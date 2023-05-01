import { MyFile } from "@/app/type";
import { FC, useMemo } from "react";
import Link from "next/link";
const MAX_SIZE = 10000000;
const SIZE = ['B', 'KB', 'MB', 'GB', 'TB'];
export const FileView:FC<{file:MyFile}> = ({file}) => {
    let log = useMemo(() => file.size ? Math.log2(file.size) : 0, [file]);
    return <div className="grid" style={{
        gridColumn: '1 / -1',
        grid:'inherit',
        gap:'inherit',
        gridTemplateColumns:'inherit'
    }}>
        <Link href={file.type === 'folder' ? `/admin/${file.path}` : `/mongodb/public/list/${file.path}`} className="p-1"></Link>
        <Link href={file.type === 'folder' ? `/admin/${file.path}` : `/mongodb/public/list/${file.path}`} className="p-1">{file.name}</Link>
        <Link href={file.type === 'folder' ? `/admin/${file.path}` : `/mongodb/public/list/${file.path}`} className="p-1">{file.lastModified ? file.lastModified : ''}</Link>
        <Link href={file.type === 'folder' ? `/admin/${file.path}` : `/mongodb/public/list/${file.path}`} className="p-1">{file.type}</Link>
        <Link href={file.type === 'folder' ? `/admin/${file.path}` : `/mongodb/public/list/${file.path}`} className="p-1">{file.size ? `${(2 ** (log % 10)).toPrecision(4)}${SIZE[Math.floor(log / 10)]}` : ''}</Link>
        <div className="p-1">
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">삭제</button>
        </div>
    </div>
}