'use client'

import { MyFile } from "@/app/type";
import Link from "next/link";
import { redirect, useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react";

const MAX_SIZE = 10000000;

// import { FileManagerComponent } from "@syncfusion/ej2-react-filemanager";
export default function Page(){
    let param = useParams();
    let [ command, setCommand ] = useState('refresh');
    let input = useRef<HTMLInputElement>(null);
    if(!param.paths.startsWith('root')) redirect('/admin/root');
    const [arr, setArr] = useState<MyFile[]>([]);

    const refresh = () => {
        setCommand('refresh');
    }
    const [upload, setUpload] = useState<MyFile[]>([])
    useEffect(() => {
        // Command useEffect
        const reader = async (file:File):Promise<MyFile> => {
            let read = new FileReader();
            read.readAsDataURL(file);
            await new Promise(res => read.onload = res);
            return {
                path:`${param.paths}/${file.name}`,
                name:file.name,
                type:file.type,
                lastModified:file.lastModified,
                size:(read.result as string).length,
                data:read.result as string
            } 
        }
        const filePick = async () => {
            setCommand('loading');
            if(!input.current || !input.current.files){
                setCommand('');
                return;
            }
            let pros:Promise<MyFile>[] = []; 
            for(let i of input.current.files){
                if(!i.type.startsWith('text') && !i.type.startsWith('image') && i.type !== 'application/json'){
                    console.log(`${i.type}은 text 또는 image 또는 json이 아닙니다.`)
                    continue;
                }
                if(i.size > MAX_SIZE){
                    console.log(`${i.name}의 크기는 ${i.size}로 너무 큽니다.`);
                    continue;
                }
                pros.push(reader(i));
            }
            const results = await Promise.all(pros);
            setUpload(results);
            setCommand('');
        };

        const getList = async () => {
            setCommand('loading');
            try{
                const res = await fetch(`/mongodb/public/list/${param.paths}`);
                let json = (await res.json()) as MyFile[];
                console.log(json);
                setArr(json);
            } catch(err){
                alert(err);
            }
            setCommand('');
        }
        if(command === 'file'){
            filePick();
        } else if(command === 'refresh'){
            getList();
        }
        setCommand('');
    }, [command]);
    useEffect(() => {
        const uploadFunc = async () => {
            if(upload.length === 0) return;
            try{
                const res = await fetch('/mongodb/protected', {
                    method:'PATCH',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(upload)
                });
                if(res.status === 200){
                    setUpload([]);
                    refresh();
                    return;
                }
                alert(`${res.status} : ${res.statusText}`);
            } catch(err){
                alert(err)
            }
        }
        uploadFunc();
    }, [upload]);
    const SIZE = ['B', 'KB', 'MB', 'GB', 'TB'];
    return (<div className="box-border control-section grid items-center" style={{
        gridTemplateColumns:'max-content 2fr max-content max-content 1fr max-content',
    }}>
        <div className="flex justify-between items-center" style={{
            gridColumnStart:'span 6'
        }}>
            <div className="p-1">/{param.paths.split('/').slice(1).join('/')}</div>
            <div>
                <input ref={input} type="file" multiple style={{
                    display:'none'
                }} onInput={() => setCommand('file')} />
                <button onClick={() => {
                    if(command !== '') return;
                    input.current && input.current.click();
                }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">업로드</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">새 폴더</button>
                <button onClick={refresh} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">새로고침</button>
            </div>
        </div>
        <div className="p-1 bg-gray-100">Icon</div>
        <div className="p-1 bg-gray-100">이름</div>
        <div className="p-1 bg-gray-100">수정한 날짜</div>
        <div className="p-1 bg-gray-100">형식</div>
        <div className="p-1 bg-gray-100">크기</div>
        <div className="p-1 bg-gray-100">컨트롤</div>
        {arr.map((v, i) => {
            let log = v.size ? Math.log2(v.size) : 0;
            return [
                <Link href={v.type === 'folder' ? `/admin/${v.path}` : `/mongodb/public/list/${v.path}`} key={i * 6 + 0} className="p-1"></Link>,
                <Link href={v.type === 'folder' ? `/admin/${v.path}` : `/mongodb/public/list/${v.path}`} key={i * 6 + 1} className="p-1">{v.name}</Link>,
                <Link href={v.type === 'folder' ? `/admin/${v.path}` : `/mongodb/public/list/${v.path}`} key={i * 6 + 2} className="p-1">{v.lastModified ? v.lastModified : ''}</Link>,
                <Link href={v.type === 'folder' ? `/admin/${v.path}` : `/mongodb/public/list/${v.path}`} key={i * 6 + 3} className="p-1">{v.type}</Link>,
                <Link href={v.type === 'folder' ? `/admin/${v.path}` : `/mongodb/public/list/${v.path}`} key={i * 6 + 4} className="p-1">{v.size ? `${(2 ** (log % 10)).toPrecision(4)}${SIZE[Math.floor(log / 10)]}` : ''}</Link>,
                <Link href={v.type === 'folder' ? `/admin/${v.path}` : `/mongodb/public/list/${v.path}`} key={i * 6 + 5} className="p-1">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">이름 변경</button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">삭제</button>
                </Link>
            ]
        })}
    </div>)
}