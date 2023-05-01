import { getFileOrFolder } from "@/app/mongodb/public/list/[...paths]/db";
import { MyFile } from "@/app/type";

export default async function Page({params}:{params:{main:string}}){
    let main = decodeURIComponent(params.main);
    let list = (await getFileOrFolder(['root', 'curriculum', main], 0)) as MyFile[];
    let desktop = list.find(v => v.name.includes('desktop'))?.path ?? 'root/logo.svg';
    let mobile = list.find(v => v.name.includes('mobile'))?.path ?? 'root/logo.svg';
    return <>
        <div className="hidden md:block">
            {desktop.endsWith('.svg') ? <object className="w-full" data={`/mongodb/public/list/${desktop}`} type="image/svg+xml"></object> : <img className="w-full" src={`/mongodb/public/list/${desktop}`} />}
        </div>
        <div className="md:hidden">
            {mobile.endsWith('.svg') ? <object className="w-full" data={`/mongodb/public/list/${mobile}`} type="image/svg+xml"></object> : <img className="w-full" src={`/mongodb/public/list/${mobile}`} />}
        </div>
    </>
}