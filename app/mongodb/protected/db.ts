import { MyFile } from "@/app/type";
import { handler } from "../setting";

export async function updateFiles(files:MyFile[]){
    const {collection} = await handler();
    const existsDocuments = await collection.find({
        path:{ $in:files.map(v => v.path) }
    }).project<Pick<MyFile, 'path' | 'type'>>({
        path:1, type:1
    }).toArray();

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