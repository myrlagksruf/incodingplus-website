import { MyFile } from "@/app/type";
import { handler } from "../setting";

export async function updateFiles(files:MyFile[]){
    const {collection, client} = await handler();
    const arr = await collection.find({
        path:{ $in:files.map(v => v.path)}
    }).project({
        path:1, type:1
    }).toArray();
    console.log(arr)
    const docu = await collection.bulkWrite(files.filter(v => {
        let x = arr.find(t => t.path === v.path);;
        return !x || x.type !== 'folder';
    }).map(v => {
        return {
            replaceOne:{
                filter:{
                    path:v.path
                },
                upsert:true,
                replacement:v
            }
        }
    }))
    // await client.close();
    if(!docu) return null;
    return docu;
}

export async function insertFolder(path:string){
    const {collection, client} = await handler();
    let folderCheck = await collection.findOne({ path });
    if(folderCheck) return null;
    let docu = await collection.insertOne({
        path,
        name:path.split('/').at(-1),
        type:'folder',
        size:0,
        lastModified:0,
        data:null,
    });
    // await client.close();
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