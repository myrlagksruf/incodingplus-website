import { getFileOrFolder } from "@/app/mongodb/public/list/[...paths]/db";
import { MyFile } from "@/app/type";
import Link from "next/link";
import { FileView } from "./clientUtils";
export default async function Page({params}:{params:{paths:string[]}}){
    let files = (await getFileOrFolder(params.paths)) as MyFile[];
    return (<div className="box-border control-section grid items-center" style={{
        gridTemplateColumns:'max-content 2fr max-content max-content 1fr max-content',
    }}>
        <div className="p-1 bg-gray-100">Icon</div>
        <div className="p-1 bg-gray-100">이름</div>
        <div className="p-1 bg-gray-100">수정한 날짜</div>
        <div className="p-1 bg-gray-100">형식</div>
        <div className="p-1 bg-gray-100">크기</div>
        <div className="p-1 bg-gray-100">컨트롤</div>
        <Link className="p-1" href={`/admin/${params.paths.slice(0, -1).join('/')}`}></Link>
        <Link className="p-1" href={`/admin/${params.paths.slice(0, -1).join('/')}`}>..</Link>
        <Link className="p-1" href={`/admin/${params.paths.slice(0, -1).join('/')}`}></Link>
        <Link className="p-1" href={`/admin/${params.paths.slice(0, -1).join('/')}`}></Link>
        <Link className="p-1" href={`/admin/${params.paths.slice(0, -1).join('/')}`}></Link>
        <Link className="p-1" href={`/admin/${params.paths.slice(0, -1).join('/')}`}></Link>
        {files.map((v, i) => (<FileView file={v} key={i} />))}
    </div>)
}