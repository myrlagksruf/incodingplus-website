import { handler } from "@/app/mongodb/setting";
import { MyFile, MyFileBuffer } from "@/app/type";
import { WithId } from "mongodb";


export async function getFileOrFolder(strs:string[], num:number){
    const {collection, client} = await handler();
    const info = await collection.findOne({
        path:strs.join('/')
    });
    if(!info) return null;
    if(info.type === 'folder'){
        const cursor = collection.aggregate([
            { $addFields: {ordered:{ $cond: { if: { $eq:["$type", "folder"]}, then:{$concat:["0", "$name"]}, else:{$concat:["1", "$name"]}}}}},
            { $match : { $and:[{pathCount:{$gte:strs.length + 1}}, {pathCount:{$lte:strs.length + 1 + num}}, {path:{$regex:`^${strs.join('/')}/`}}]}},
            { $sort: { ordered: 1 }},
            { $project: { data:0, _id:0, pathCount:0, ordered:0}},
        ]);
        let docu = (await cursor.toArray()) as MyFile[];
        if(!docu || docu.length === 0) return [];
        return docu;
    }
    return info as WithId<MyFileBuffer>
}