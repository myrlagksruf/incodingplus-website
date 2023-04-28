'use client'

import { MyFile } from "@/app/type";
import Link from "next/link";
import { redirect, useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react";

const MAX_SIZE = 10000000;

// import { FileManagerComponent } from "@syncfusion/ej2-react-filemanager";
export default function Page(){
    let param = useParams();
    const [arr, setArr] = useState<MyFile[]>([]);
    const [newfolder, setNewfolder] = useState<MyFile|null>(null);
    const [command, setCommand] = useState('refresh');
    const [upload, setUpload] = useState<MyFile[]>([]);
    const [del, setDel] = useState<MyFile|null>(null);
    let ref = useRef<HTMLInputElement>(null);
    let input = useRef<HTMLInputElement>(null);
    if(!param.paths.startsWith('root')) redirect('/admin/root');

    const refresh = () => {
        setCommand('refresh');
    }
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
        };
        if(command === 'file'){
            filePick();
        } else if(command === 'refresh'){
            getList();
        }
        setCommand('');
    }, [command]);
    useEffect(() => {
        const uploadFunc = async (upload:MyFile[]) => {
            try{
                const res = await fetch('/mongodb/protected', {
                    method:'PATCH',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(upload)
                });
                if(res.status !== 200){
                    alert(`${res.status} : ${res.statusText}`);
                }
            } catch(err){
                alert(err)
            }
            refresh();
        }
        if(upload.length !== 0) {
            uploadFunc(upload);
            setUpload([]);
        }
    }, [upload]);

    useEffect(() => {
        const insertFolder = async (newfolder:MyFile) => {
            try{
                const res = await fetch(`/mongodb/protected`, {
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(newfolder)
                });
                if(res.status !== 200) throw res.statusText;
            } catch(err){
                alert(String(err));
            }
            refresh();
        }
        if(newfolder){
            insertFolder(newfolder);
            setNewfolder(null);
        }
    }, [newfolder]);
    useEffect(() => {
        const deleteSomeThing = async (del:MyFile) => {
            try{
                const res = await fetch('/mongodb/protected', {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(del)
                });
                if(res.status !== 200){
                    alert(`${res.status} : ${res.statusText}`);
                }
            } catch(err){
                alert(err)
            }
            refresh();
        }
        if(del){
            deleteSomeThing(del);
            setDel(null);
        }
    }, [del])
    useEffect(() => {
        if(ref.current) ref.current.focus();
    }, [arr]);

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
                <button onClick={() => {
                    let now = Date.now();
                    if(ref.current) ref.current.focus();
                    else setArr([{path:`${param.paths}/${now}`, name:`${now}`, data:'',  lastModified:0, size:0, type:'folder', isNew:true},...arr])
                }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">새 폴더</button>
                <button onClick={refresh} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">새로고침</button>
            </div>
        </div>
        <div className="p-1 bg-gray-100">Icon</div>
        <div className="p-1 bg-gray-100">이름</div>
        <div className="p-1 bg-gray-100">수정한 날짜</div>
        <div className="p-1 bg-gray-100">형식</div>
        <div className="p-1 bg-gray-100">크기</div>
        <div className="p-1 bg-gray-100">컨트롤</div>
        <Link className="p-1" href={`/admin/${param.paths.split('/').slice(0, -1).join('/')}`}></Link>
        <Link className="p-1" href={`/admin/${param.paths.split('/').slice(0, -1).join('/')}`}>..</Link>
        <Link className="p-1" href={`/admin/${param.paths.split('/').slice(0, -1).join('/')}`}></Link>
        <Link className="p-1" href={`/admin/${param.paths.split('/').slice(0, -1).join('/')}`}></Link>
        <Link className="p-1" href={`/admin/${param.paths.split('/').slice(0, -1).join('/')}`}></Link>
        <Link className="p-1" href={`/admin/${param.paths.split('/').slice(0, -1).join('/')}`}></Link>
        {arr.map((v, i) => {
            let log = v.size ? Math.log2(v.size) : 0;
            return [
                <Link onClick={(e) => v.isNew && e.preventDefault()} href={v.type === 'folder' ? `/admin/${v.path}` : `/mongodb/public/list/${v.path}`} key={i * 6 + 0} className="p-1"></Link>,
                <Link onClick={(e) => v.isNew && e.preventDefault()} href={v.type === 'folder' ? `/admin/${v.path}` : `/mongodb/public/list/${v.path}`} key={i * 6 + 1} className="p-1">
                    {v.isNew ? <input type="text" ref={ref}
                        value={v.name}
                        onChange={(e) => setArr([...arr.slice(0, i), {...v, path:`${param.paths}/${e.currentTarget.value}`, name:e.currentTarget.value}, ...arr.slice(i + 1)])}
                        onKeyDown={(e) => {
                            if(e.code === 'Enter'){
                                if(arr.find(t => t.path === v.path.trim() && !t.isNew)){
                                    alert('같은 이름의 폴더 또는 파일이 존재합니다.');
                                    return;
                                } else if(!v.name.trim()){
                                    alert('이름이 비어있으면 안됩니다.');
                                    return;
                                } else if(v.name !== v.name.trim()){
                                    alert('이름의 앞 또는 끝이 비어있으면 안됩니다.');
                                    return;
                                }
                                delete v.isNew;
                                setArr([...arr.slice(0, i), {...v}, ...arr.slice(i + 1)]);
                                setNewfolder(v);
                            }
                        }}/> : v.name}
                </Link>,
                <Link onClick={(e) => v.isNew && e.preventDefault()} href={v.type === 'folder' ? `/admin/${v.path}` : `/mongodb/public/list/${v.path}`} key={i * 6 + 2} className="p-1">{v.lastModified ? v.lastModified : ''}</Link>,
                <Link onClick={(e) => v.isNew && e.preventDefault()} href={v.type === 'folder' ? `/admin/${v.path}` : `/mongodb/public/list/${v.path}`} key={i * 6 + 3} className="p-1">{v.type}</Link>,
                <Link onClick={(e) => v.isNew && e.preventDefault()} href={v.type === 'folder' ? `/admin/${v.path}` : `/mongodb/public/list/${v.path}`} key={i * 6 + 4} className="p-1">{v.size ? `${(2 ** (log % 10)).toPrecision(4)}${SIZE[Math.floor(log / 10)]}` : ''}</Link>,
                <div key={i * 6 + 5} className="p-1">
                    {v.isNew ||
                    <div>
                        <button onClick={() => confirm('정말로 지우시겠습니까?') && setDel(v)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">삭제</button>
                    </div>}
                </div>
            ]
        })}
    </div>)
}