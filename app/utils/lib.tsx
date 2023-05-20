'use client'
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import ReactMarkdown from 'react-markdown';
import { getS3PublicUrl } from ".";
import { FC, useLayoutEffect, useMemo, useRef, useState } from "react";

export const ReactMarkdownWrap:FC<{url:string}> = ({url}) => {
    const [markdown, setMarkdown] = useState('');
    const body = useRef<HTMLDivElement>(null);
    const origin = useMemo(() => getS3PublicUrl({ path: url.split('/').map(v => encodeURIComponent(v)).join('/')}), [url]);
    useLayoutEffect(() => {
        if(body.current){
            setMarkdown(`<div style="height:calc(${getComputedStyle(body.current).height} - 2rem)"></div>`);
        }
        const getMarkdown = async () => {
            const urlTemp = getS3PublicUrl({ path: url })
            const res = await fetch(urlTemp);
            const text = await res.text();
            setMarkdown(text);
        }
        getMarkdown();
    }, [url]);
    return <div className="markdown-body" ref={body}>
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={{
                a({node, className, children, href, ...props}){
                    const hrefObj:{href?:string} = {};
                    if(href){
                        const result = new URL(href, origin);
                        hrefObj.href = result.href;
                    }
                    return <a {...props} className={className} {...hrefObj}>{href}{children}</a>
                },
                img({node, className, src, ...props}){
                    const srcObj:{src?:string} = {};
                    if(src){
                        const result = new URL(src, origin);
                        srcObj.src = result.href;
                    }
                    return <img {...props} className={className} {...srcObj} />
                }
            }}
            children={markdown}
        />
    </div>
}