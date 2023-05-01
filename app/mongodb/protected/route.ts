import { NextRequest, NextResponse } from "next/server";
import { check } from "./check";
import { deleteFileOrFolder, insertFolder, updateFiles } from "./db";
import { MyFile } from "@/app/type";

export async function PATCH(request:NextRequest){
    try{
        if(await check(request)){
            const json = (await request.json()) as MyFile[];
            const docu = await updateFiles(json);
            return new NextResponse(JSON.stringify(docu));
        }
        return new NextResponse(null, {
            status:403,
            statusText:'No permission'
        })
    }catch(err){
        return new NextResponse(null, {
            status:500,
            statusText:String(err)
        });
    }
}

export async function PUT(req:NextRequest){
    try{
        if(await check(req)){
            const json = (await req.json()) as MyFile[];
            const docu = await insertFolder(json[0].path);
            if(!docu) throw JSON.stringify(docu);
            return new NextResponse(JSON.stringify(docu));
        }
        return new NextResponse(null, {
            status:403,
            statusText:'No permission'
        })
    }catch(err){
        return new NextResponse(null, {
            status:500,
            statusText:String(err)
        });
    }
}

export async function POST(req:NextRequest){
    try{
        if(await check(req)){
            const json = (await req.json()) as MyFile[];
            const docu = await deleteFileOrFolder(json[0].path);
            if(!docu) throw JSON.stringify(docu);
            return new NextResponse(JSON.stringify(docu));
        }
        return new NextResponse(null, {
            status:403,
            statusText:'No permission'
        })
    }catch(err){
        return new NextResponse(null, {
            status:500,
            statusText:String(err)
        });
    }
}