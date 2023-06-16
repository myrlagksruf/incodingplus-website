'use client'
import { MyFile, iUpload } from "@/app/type";
import { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getS3PublicUrl } from "@/app/utils";
import { uploadFile, deleteFile, uploadFolder, reader } from "./uploadFunc";
import mime from 'mime-types';
import { ModalContext } from "@/app/admin/container";

const SIZE = ['B', 'KB', 'MB', 'GB', 'TB'];
export const FileView:FC<{file:MyFile}> = ({file}) => {
    const log = useMemo(() => file.size ? Math.log2(file.size) : 0, [file]);
    const router = useRouter();
    const ModalControl = useContext(ModalContext);
    const [download, setDownload] = useState(false);
    const [upload, setUpload] = useState<iUpload>({files:[], command:''});
    useEffect(() => {
        if(upload.command !== 'POST') return;
        ModalControl.setModal({
            type:'loading', data:'',
        });
        deleteFile(upload.files[0], () => {
            router.refresh();
            ModalControl.setModal({
                type:'', data:''
            });
            setUpload({files:[], command:''});
        })
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
    const href = file.type === 'folder' ? folderUrl : fileUrl;
    return <div className="contents">
        <Link href={href} className="p-1"></Link>
        <Link href={href} className="p-1">{file.name}</Link>
        <Link href={href} className="p-1">{file.lastModified ? file.lastModified : ''}</Link>
        <Link href={href} className="p-1">{file.type}</Link>
        <Link href={href} className="p-1">{file.size ? `${(2 ** (log % 10)).toPrecision(4)}${SIZE[Math.floor(log / 10)]}` : ''}</Link>
        <div className="p-1 text-right">
            {
                (file.type === 'application/json' || file.type.includes('text')) &&
                <a 
                    className="inline-block bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded"
                    target="_blank"
                    href={`/admin/edit/${file.path}`}
                >
                    수정하기
                </a>
            }
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
                        if(confirm(`정말로 "${file.name}"를 삭제하시겠습니까?`)){
                            setUpload({files:[file], command:'POST'});
                        }
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    삭제
                </button>
            }
        </div>
    </div>
}

const MAX_SIZE = 50_000_000;
export const PanelView:FC<{params:{paths:string[]}, names:string[]}> = ({params, names}) => {
    const input = useRef<HTMLInputElement>(null);
    const [command, setCommand] = useState('');
    const [upload, setUpload] = useState<iUpload>({files:[], command:''});
    const { modal, setModal } = useContext(ModalContext);
    const router = useRouter();
    useEffect(() => {
        const filePick = async () => {
            setCommand('loading');
            if(!input.current || !input.current.files){
                setCommand('');
                return;
            }
            let pros:Promise<MyFile>[] = []; 
            for(let i of input.current.files){
                let type = i.type;
                if(!type) type = mime.lookup(i.name) ? mime.lookup(i.name) as string : 'application/octet-stream';
                if(!type.startsWith('text') && !type.startsWith('image') && type !== 'application/json'){
                    alert(`${i.name} 파일의 타입은 ${type}로 text 또는 image 또는 json이 아닙니다.`);
                    continue;
                }
                if(i.size > MAX_SIZE){
                    alert(`${i.name}의 크기는 ${i.size}로 너무 큽니다.`);
                    continue;
                }
                pros.push(reader(new File([i], i.name, { type, lastModified:i.lastModified }), params.paths));
            }
            const results = await Promise.all(pros);
            setUpload({files:results, command:'PATCH'});
        };

        if(command === 'file'){
            filePick();
        }
    }, [command]);


    useEffect(() => {
        if(upload.command === '') return;
        setModal({
            type:'loading', data:''
        });
        if(upload.command === 'PATCH'){
            uploadFile(upload.files, () => {
                router.refresh();
                setModal({
                    type:'', data:''
                });
                setCommand('')
                setUpload({files:[], command:''});

            });
        } else if(upload.command === 'PUT'){
            uploadFolder(upload.files[0], () => {
                router.refresh();
                setModal({
                    type:'', data:''
                });
                setCommand('')
                setUpload({files:[], command:''});
            });
        }
    }, [upload]);

    useEffect(() => {
        if(modal?.type !== 'folder-modal' || !Array.isArray(modal.data)) return;
        const data = modal.data;
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
        setCommand('loading');
        setModal({type:'loading', data:''});
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
    }, [modal])

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
            <button onClick={() => setModal({type:'folder-modal', data:''})} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">새 폴더</button>
            <button onClick={() => router.refresh()} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">새로고침</button>
        </div>
    </div>
}