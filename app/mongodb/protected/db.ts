import { MyFile } from "@/app/type";
import { handler } from "../setting";
import { S3 } from '@aws-sdk/client-s3'
import { getS3PublicUrl } from "@/app/utils";

const s3 = new S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
    },
    region: 'ap-northeast-2',
})

/** Base64 인코딩된 바이너리 파일을 s3에 업로드 */
async function uploadBinaryFile(file: MyFile){
    if(!file.data.includes('base64')){
        // file.data like 'data:image/png;base64,~~'
        return ''
    }

    const data = Buffer.from(file.data.split(',')[1], 'base64')
    const Key = `public/${file.path}` // ex. file.path == root/curriculum/1.커리큘럼.1.입시반/desktop.svg

    await s3.putObject({
        Bucket: 'cdn.in-coding.com',
        Key,
        Body: data, 
        ContentType: file.type,
        ACL: 'public-read'
    })

    return getS3PublicUrl(file)
}

export async function updateFiles(files:MyFile[]){
    const {collection} = await handler();
    const existsDocuments = await collection.find({
        path:{ $in:files.map(v => v.path) }
    }).project<Pick<MyFile, 'path' | 'type'>>({
        path:1, type:1
    }).toArray();

    // base64 인코딩된 파일은 모두 s3 로 업로드
    await Promise.all(files.map(async file => {
        if(file.data.includes('base64')){
            file.data = await uploadBinaryFile(file)
        }
    }))

    const docu = await collection.bulkWrite(files.filter(v => {
        let existsDoc = existsDocuments.find(t => t.path === v.path);;
        return existsDoc == null || existsDoc.type !== 'folder';
    }).map(v => {
        return {
            replaceOne:{
                filter:{
                    path:v.path
                },
                upsert:true,
                replacement:{ ...v, data: v.data }
            }
        }
    }))
    if(!docu) return null;
    return docu;
}

export async function insertFolder(path:string){
    const {collection, client} = await handler();
    let folderCheck = await collection.findOne({ path });
    if(/\/[.]{1,2}$/.test(path.trim())) return null;
    if(folderCheck) return null;
    let docu = await collection.insertOne({
        path,
        name: path.split('/').at(-1)!,
        type: 'folder',
        size: 0,
        lastModified: 0,
        pathCount: path.split('/').length,
        data: '',
    });
    if(!docu) return null;
    return docu;
}

export async function deleteFileOrFolder(path:string){
    const {collection, client} = await handler();
    const info = await collection.findOne({
        path
    });
    if(!info || info.type === 'folder'){
        const docu = await collection.deleteMany({
            $or:[
                {
                    path:{
                        $regex:`^${path}/`
                    }
                },
                { path }
            ]
        })
        if(!docu) return null;
        return docu;
    } else {
        const docu = await collection.deleteOne({
            path
        });
        if(!docu) return null;
        return docu;
    }
}