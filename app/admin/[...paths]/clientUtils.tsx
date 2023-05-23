'use client'
import { MyFile } from "@/app/type";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { getS3PublicUrl } from "@/app/utils";

const uploadFunc = async (upload:iUpload, router:ReturnType<typeof useRouter>) => {
    try{
        const res = await fetch('/mongodb/protected', {
            method:upload.command,
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(upload.files)
        });
        if(res.status !== 200){
            alert(`${res.status} : ${res.statusText}`);
        }
    } catch(err){
        alert(err)
    }
    router.refresh();
}

const SIZE = ['B', 'KB', 'MB', 'GB', 'TB'];
export const FileView:FC<{file:MyFile}> = ({file}) => {
    const log = useMemo(() => file.size ? Math.log2(file.size) : 0, [file]);
    const router = useRouter();
    const [download, setDownload] = useState(false);
    const [upload, setUpload] = useState<iUpload>({files:[], command:''});
    useEffect(() => {
        if(upload.command !== '') {
            uploadFunc(upload, router);
            setUpload({files:[], command:''});
        }
    }, [upload]);
    useEffect(() => {
        if(!download) return;
        setDownload(false);
        const downloadFromURL = async () => {
            const res = await fetch(fileUrl);
            const blob = await res.blob();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = file.name;
            a.click();
            URL.revokeObjectURL(a.href);
        }
        downloadFromURL()
    }, [download]);

    const folderUrl = `/admin/${file.path.split('/').map(encodeURIComponent).join('/')}`
    const fileUrl = getS3PublicUrl({
        path: file.path.split('/').map(encodeURIComponent).join('/')
    })
    const href = file.type === 'folder' ? folderUrl : fileUrl

    return <div className="contents">
        <Link href={href} className="p-1"></Link>
        <Link href={href} className="p-1">{file.name}</Link>
        <Link href={href} className="p-1">{file.lastModified ? file.lastModified : ''}</Link>
        <Link href={href} className="p-1">{file.type}</Link>
        <Link href={href} className="p-1">{file.size ? `${(2 ** (log % 10)).toPrecision(4)}${SIZE[Math.floor(log / 10)]}` : ''}</Link>
        <div className="p-1">
            {
                file.type !== 'folder' &&
                <button
                    className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setDownload(true)}
                >
                    다운로드
                </button>
            }
            {
                !file.isPersistent && 
                <button
                    onClick={() => {
                        if(confirm(`정말로 "${file.name}"를 삭제하시겠습니까?`))
                            setUpload({files:[file], command:'POST'});
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    삭제
                </button>
            }
        </div>
    </div>
}

const Modal:FC<{title:string; types?:[string, string][];onSuccess:(data:string[]) => void;onAboart:() => void}> = ({title, types, onAboart, onSuccess}) => {
    let [inputs, setInputs] = useState<string[]>(Array(types?.length).fill(''));
    return <div className="bg-opacity-70 bg-black flex items-center justify-center" style={{
        width:'100vw', height:'calc(100 * var(--vh, 1vh))'
    }}>
        <div className="p-4 rounded-2xl bg-white flex flex-col">
            <h1 className="text-center text-2xl">{title}</h1>
            {!!types && types.map((v, i) => [
                <label
                    key={i * 2}
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor={`input-modal-${i}`}
                >
                    {v[0]}
                </label>,
                <input
                    id={`input-modal-${i}`}
                    key={i * 2 + 1}
                    type={v[1]}
                    value={inputs[i]}
                    className="shadow appearance-none border rounded w-full py-2 mb-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={v[0]}
                    onChange={e => setInputs([...inputs.slice(0, i), e.currentTarget.value, ...inputs.slice(i + 1)])}
                />
            ])}
            <div className="flex justify-around w-full">
                <button onClick={() => onSuccess(inputs)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">확인</button>
                <button onClick={onAboart} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">취소</button>
            </div>
        </div>
    </div>
}

interface iUpload{
    files:MyFile[];
    command:'PUT'|'POST'|'PATCH'|'';
}

const MAX_SIZE = 10_000_000;
export const PanelView:FC<{params:{paths:string[]}, names:string[]}> = ({params, names}) => {
    const input = useRef<HTMLInputElement>(null);
    const modalContainer = useRef<HTMLDivElement>();
    const [command, setCommand] = useState('');
    const [upload, setUpload] = useState<iUpload>({files:[], command:''});
    const [isModal, setIsModal] = useState(false);
    const router = useRouter();
    useEffect(() => {
        // Command useEffect
        const reader = async (file:File):Promise<MyFile> => {
            let read = new FileReader();
            read.readAsDataURL(file);
            await new Promise(res => read.onload = res);
            return {
                path:decodeURIComponent(`${params.paths.join('/')}/${file.name}`),
                name:file.name,
                type:file.type,
                lastModified:file.lastModified,
                size:(read.result as string).length,
                data:read.result as string,
                pathCount:params.paths.length + 1
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
            setUpload({files:results, command:'PATCH'});
            setCommand('');
        };

        if(command === 'file'){
            filePick();
        }
        setCommand('');
    }, [command]);


    useEffect(() => {
        if(upload.command !== '') {
            uploadFunc(upload, router);
            setUpload({files:[], command:''});
        }
    }, [upload]);

    useEffect(() => {
        const modalTemp = document.querySelector<HTMLDivElement>('#modal-container');
        if(modalTemp){
            modalContainer.current = modalTemp;
        }
    }, []);

    return <div className="flex justify-between items-center" style={{
        gridColumnStart:'span 6'
    }}>
        <div className="p-1">/{decodeURIComponent(params.paths.slice(1).join('/'))}</div>
        <div>
            <input ref={input} type="file" multiple style={{
                display:'none'
            }} onInput={() => setCommand('file')} />
            <button onClick={() => {
                if(command !== '') return;
                input.current && input.current.click();
            }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">업로드</button>
            <button onClick={() => setIsModal(!isModal)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">새 폴더</button>
            <button onClick={() => router.refresh()} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">새로고침</button>
            {(Boolean(modalContainer.current) && isModal) &&
                createPortal(
                    <Modal
                        onSuccess={data => {
                            if(names.includes(data[0])){
                                alert('같은 이름의 폴더 또는 파일이 존재합니다.');
                                return;
                            } else if(data[0].trim() === ''){
                                alert('이름이 비어있으면 안됩니다.');
                                return;
                            } else if(data[0] !== data[0].trim()){
                                alert('이름의 앞 또는 끝이 비어있으면 안됩니다.');
                                return;
                            }
                            setUpload({
                                files:[{
                                    path:decodeURIComponent(`${params.paths.join('/')}/${data[0]}`),
                                    name:data[0],
                                    type:'folder',
                                    lastModified:0,
                                    size:0,
                                    data:'',
                                    pathCount:params.paths.length + 1
                                }], command:'PUT'
                            });
                            setIsModal(false);
                        }}
                        onAboart={() => setIsModal(false)}
                        title="새 폴더 만들기"
                        types={[['폴더명', 'text']]}
                    />,
                modalContainer.current as HTMLDivElement)}
        </div>
    </div>
}