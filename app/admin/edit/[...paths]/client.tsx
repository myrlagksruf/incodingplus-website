'use client'
import { FC, useContext, useEffect, useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/themes/prism.min.css';
import { reader, uploadFile } from "@/app/admin/[...paths]/uploadFunc";
import { ModalContext } from "@/app/admin/container";
import { useRouter } from "next/navigation";

export const EditorContainer:FC<{value:string;type:string,paths:string[]}> = ({value, type, paths}) => {
    const [code, setCode] = useState<string>(value);
    const { setModal } = useContext(ModalContext);
    const router = useRouter();
    const upload = async () => {
        if(type === 'application/json'){
            try{
                JSON.parse(code)
            } catch(err){
                alert(err);
                return;
            }
        }
        setModal({
            type:'loading', data:''
        });
        const file = new File([code], paths.at(-1) as string, { type, lastModified:Date.now() });
        const result = await reader(file, paths.slice(0, -1))
        await uploadFile([result], () => {
            setModal({ type:'', data:'' });
            alert('수정 완료!');
            router.refresh();
        });
    }
    console.log(languages.json, languages.markdown)
    return <div className="relative">
        <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => {
                switch(type){
                    case 'application/json': return highlight(code, languages.json, 'json');
                    case 'text/markdown': return highlight(code, languages.markdown, 'markdown')
                    default: return code
                }
            }}
            disabled={false}
            padding={10}
            style={{
                fontFamily: "D2Coding"
            }}
            tabSize={2}
        />
        <button
            className="bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded absolute top-0 right-0"
            onClick={upload}
        >
            수정완료
        </button>
    </div>
}