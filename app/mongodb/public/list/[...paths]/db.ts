import { handler } from "@/app/mongodb/setting";
import { MyFile } from "@/app/type";
import { WithId } from "mongodb";


export async function getFileOrFolder(strs:string[]){
    const {collection, client} = await handler();
    const info = await collection.findOne({
        path:strs.join('/')
    });
    if(!info) return [];
    if(info.type === 'folder'){
        const cursor = collection.aggregate([
            { $addFields: { patharr:{ $split:["$path", "/"] } } },
            { $addFields: { pathCount:{$size:"$patharr"}}},
            { $addFields: {order:{ $cond: { if: { type:"folder"}, then:{$concat:["0", "$name"]}, else:{$concat:["1", "$name"]}}}}},
            { $match : { $and:[{pathCount:{$eq:strs.length + 1}}, {path:{$regex:`^${strs.join('/')}/`}}]}},
            { $sort: { order: 1 }},
            { $project: { data:0, _id:0, patharr:0, pathCount:0, order:0}},
        ]);
        let docu = await cursor.toArray();
        if(!docu || docu.length === 0) return [];
        return docu;
    }
    return info as WithId<MyFile>
}