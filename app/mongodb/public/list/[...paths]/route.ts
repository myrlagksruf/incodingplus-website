import { NextRequest, NextResponse } from "next/server";
import { getFileOrFolder } from "./db";

export async function GET(req:NextRequest, { params }:{params:{paths:string[]}}){
    try{
        let arr = await getFileOrFolder(params.paths);
        if(Array.isArray(arr)){
            return new NextResponse(JSON.stringify(arr));
        }
        if(arr === null) throw '해당 폴더 또는 파일은 존재하지 않습니다.';
        return new NextResponse(arr.data.buffer, {
            headers:{
                'Content-Type':arr.type
            }
        })
    } catch(err){
        console.log(err)
        return new NextResponse(String(err), {
            status:500
        })
    }
}