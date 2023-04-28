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