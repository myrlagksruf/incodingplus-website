import { NextRequest, NextResponse } from "next/server";
import { getFileOrFolder } from "./db";

export async function GET(req:NextRequest, { params }:{params:{paths:string[]}}){
    try{
        let d = Number(req.nextUrl.searchParams.get('d'));
        let num = isNaN(d) ? 0 : Math.max(Math.floor(d), 0);
        let arr = await getFileOrFolder(params.paths.map(decodeURIComponent), num);
        if(Array.isArray(arr)){
            return new NextResponse(JSON.stringify(arr));
        }
        if(arr === null) {
            console.log(req.url)
            throw '해당 폴더 또는 파일은 존재하지 않습니다.';
        }

        // TODO 필요하면 s3에서 fetch 해와서 response
        return new NextResponse(arr.data, {
            headers:{
                'Content-Type': 'text/plain; charset=utf-8',
            }
        })
    } catch(err){
        console.log(err)
        return new NextResponse(String(err), {
            status:500
        })
    }
}