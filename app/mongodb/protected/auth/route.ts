import { NextRequest, NextResponse } from "next/server";
import { check } from "../check";

export async function GET(request:NextRequest){
    try{
        if(await check(request)){
            return new NextResponse(JSON.stringify({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
            }))
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