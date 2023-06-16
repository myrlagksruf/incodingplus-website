import { getS3PublicUrl } from "@/app/utils"
import { redirect } from "next/navigation";
import { EditorContainer } from "./client";

export default async function Page({params}:{params:{paths:string[]}}){
    const res = await fetch(getS3PublicUrl({path:params.paths.join('/')}), { cache:'no-cache'});
    const type = res.headers.get('Content-Type');
    if(!(type && (type === 'application/json' || type.includes('text')))){
        redirect(getS3PublicUrl({path:params.paths.join('/')}));
    }
    if(type === 'application/json'){
        const json = await res.json();
        return <EditorContainer value={JSON.stringify(json, null, 2)} type={type} paths={params.paths} />
    }
    const text = await res.text();
    return <EditorContainer value={text} type={type} paths={params.paths} />
}