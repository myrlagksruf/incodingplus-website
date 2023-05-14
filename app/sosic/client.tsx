'use client'
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { getS3PublicUrl } from "../utils";

const DEFAULT = 300;

export const SosicList:FC<{list:string[]}> = ({list}) => {
    const [index, setIndex] = useState(0);
    const [sh, setSh] = useState(DEFAULT);
    const [origin, setOrigin] = useState('http://0.0.0.0');
    const [markdown, setMarkdown] = useState('');
    const body = useRef<HTMLDivElement>(null);
    useEffect(() => {
        setOrigin(location.origin);
    }, []);
    useLayoutEffect(() => {
        const getMarkdown = async () => {
            const url = getS3PublicUrl({ path: `root/sosic/${encodeURIComponent(list[index])}/index.md` })
            const res = await fetch(url);
            const text = await res.text();
            setMarkdown(text);
        }
        getMarkdown();
    }, [index]);
    return (<div className="grid gap-3" style={{
        gridTemplateColumns:"1fr 2fr"
    }}>
        <div className="pt-8 mt-8 border-t-2 border-gray-300 markdown-body">
            {list.map((v, i) => {
                let mat = v.match(/(?<=\d)\./);
                let result = v;
                if(mat){
                    result = v.slice((mat.index ?? -1) + 1)
                }
                return <div
                    onClick={() => {
                        setIndex(i);
                        if(body.current)
                            setMarkdown(`<div style="height:calc(${getComputedStyle(body.current).height} - 2rem)"></div>`);
                    }}
                    className={`${index === i ? 'text-blue-400' : 'text-gray-300'} text-xl hover:text-red-300 cursor-pointer`}
                    key={i}>
                        {result}
                    </div>
                })}
        </div>
        <div ref={body} className="pt-8 mt-8 markdown-body" style={{
            transition:'height 0.5s'
        }}>
            <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={{
                    a({node, className, children, href, ...props}){
                        const hrefObj:{href?:string} = {};
                        if(href){
                            const origin = getS3PublicUrl({ path: `root/sosic/${encodeURIComponent(list[index])}/index.md` })
                            const result = new URL(href, origin);
                            hrefObj.href = result.href;
                        }
                        return <a {...props} className={className} {...hrefObj}>{href}{children}</a>
                    },
                    img({node, className, src, ...props}){
                        const srcObj:{src?:string} = {};
                        if(src){
                            const origin = getS3PublicUrl({ path: `root/sosic/${encodeURIComponent(list[index])}/index.md` })
                            const result = new URL(src, origin);
                            srcObj.src = result.href;
                        }
                        return <img {...props} className={className} {...srcObj} />
                    }
                }}
                children={markdown}
            />
        </div>
    </div>)
}