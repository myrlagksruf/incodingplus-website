import { NextRequest, NextResponse } from "next/server";
import { getFileOrFolder } from "./db";

export async function GET(req:NextRequest, { params }:{params:{paths:string[]}}){
    let arr = await getFileOrFolder(params.paths);
    if(Array.isArray(arr)){
        return new NextResponse(JSON.stringify(arr));
    }
    return new NextResponse(Buffer.from(arr.data.split(',')[1], 'base64'), {
        headers:{
            'Content-Type':arr.type
        }
    })
}