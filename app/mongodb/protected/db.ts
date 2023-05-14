import { MyFile } from "@/app/type";
import { handler } from "../setting";
import { Binary } from "mongodb";
import { S3 } from '@aws-sdk/client-s3'

const s3 = new S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
    },
    region: 'ap-northeast-2',
})

async function uploadeImageToS3(file: MyFile){
    if(!file.type.startsWith('image/') || !file.data.includes('base64')){
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

    const publicUrl = `https://s3.ap-northeast-2.amazonaws.com/cdn.in-coding.com/${Key}`
    return publicUrl
}

export async function updateFiles(files:MyFile[]){
    const {collection} = await handler();
    const existsDocuments = await collection.find({
        path:{ $in:files.map(v => v.path) }
    }).project<Pick<MyFile, 'path' | 'type'>>({
        path:1, type:1
    }).toArray();

    // 이미지 파일이면 S3에 업로드 및 data 값 public url 로 변경
    await Promise.all(files.map(async file => {
        if(file.type.startsWith('image/') && file.data.includes('base64')){
            file.data = await uploadeImageToS3(file)
        }
    }))

    const docu = await collection.bulkWrite(files.filter(v => {
        let existsDoc = existsDocuments.find(t => t.path === v.path);;
        return existsDoc == null || existsDoc.type !== 'folder';
    }).map(v => {
        let isB = v.data.includes('base64');
        return {
            replaceOne:{
                filter:{
                    path:v.path
                },
                upsert:true,
                replacement:{ ...v, data: isB ? Binary.createFromBase64(v.data.split(',')[1]) : v.data }
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
        data: new Binary(Buffer.from('')),
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