import { NextRequest } from "next/server";
import { allow } from "@/app/api/auth/[...nextauth]/route";

interface iUser{
    user:{
        name:string;
        email:string;
        image:string;
    }
    expires:string;
    accessToken:string;
}

export async function check(req:NextRequest){
    let url = new URL(req.url);
    try{
        const res = await fetch(`${url.origin}/api/auth/session`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': req.headers.get('cookie') ?? ''
            }
        });
        const json = (await res.json()) as iUser;
        if(json.accessToken){
            return allow.includes(json?.user?.email);
        } else {
            throw '잘못된 접근';
        }
    } catch(err){
        console.log(err);
        return false;
    }
}