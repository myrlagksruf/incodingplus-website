import { handler } from "@/app/mongodb/setting";
import { MyFileBuffer } from "@/app/type";
import { WithId } from "mongodb";


export async function getFileOrFolder(strs:string[]){
    const {collection, client} = await handler();
    const info = await collection.findOne({
        path:strs.join('/')
    });
    if(!info) return null;
    if(info.type === 'folder'){
        const cursor = collection.aggregate([
            { $addFields: { patharr:{ $split:["$path", "/"] } } },
            { $addFields: { pathCount:{$size:"$patharr"}}},
            { $addFields: {ordered:{ $cond: { if: { $eq:["$type", "folder"]}, then:{$concat:["0", "$name"]}, else:{$concat:["1", "$name"]}}}}},
            { $match : { $and:[{pathCount:{$eq:strs.length + 1}}, {path:{$regex:`^${strs.join('/')}/`}}]}},
            { $sort: { ordered: 1 }},
            { $project: { data:0, _id:0, patharr:0, pathCount:0, ordered:0}},
        ]);
        let docu = await cursor.toArray();
        if(!docu || docu.length === 0) return [];
        return docu;
    }
    return info as WithId<MyFileBuffer>
}