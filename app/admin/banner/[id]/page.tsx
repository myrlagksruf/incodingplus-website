import { getOrigin } from "@/app/module";
import { iBanner } from "@/app/mongodb/public/banner/type";
import { View } from "../../model";

export default async function Page({params}:{params:{id:string}}){
    try{
        let origin = getOrigin();
        let res = await fetch(`${origin}/mongodb/public/banner/data`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({id:params.id}),
        });
        let json = (await res.json()) as iBanner;
        let obj = Object.entries(json);
        return <>
            <View id={params.id} name={json.name} type={[
                ['name', 'text'],
                ['desktopUrl', 'url'],
                ['desktopBackground', 'color'],
                ['mobileUrl', 'url'],
                ['mobileBackground', 'color'],
            ]} data={obj} url={'/mongodb/protected/banner'} />
        </>
    } catch(err){
        console.log(err);
        return <>{String(err)}</>;
    }
}