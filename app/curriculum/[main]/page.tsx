import { getFileOrFolder } from "@/app/mongodb/public/list/[...paths]/db";
import { MyFile } from "@/app/type";
import { ReactMarkdownWrap } from "@/app/utils/lib";

export default async function Page({params}:{params:{main:string}}){
    let main = decodeURIComponent(params.main);
    let list = (await getFileOrFolder(['root', 'curriculum', main], 0)) as MyFile[];
    let desktop = list.find(v => v.name.includes('desktop.md'))?.path ?? 'root/index.md';
    let mobile = list.find(v => v.name.includes('mobile.md'))?.path ?? 'root/index.md';
    return <>
        <div className="hidden md:block">
            <ReactMarkdownWrap url={desktop} />
        </div>
        <div className="md:hidden">
            <ReactMarkdownWrap url={mobile} />
        </div>
    </>
}