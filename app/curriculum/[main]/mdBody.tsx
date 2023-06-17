'use client'
import { FC, useLayoutEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from "rehype-raw";
import remarkGfm from 'remark-gfm';

export const MDBody:FC<{ mdUrl: string }> = ({ mdUrl }) => {
    const [markdown, setMarkdown] = useState('');

    useLayoutEffect(() => {
        const getMarkdown = async () => {
            const res = await fetch(mdUrl, { cache:'no-cache'});
            const text = await res.text();
            setMarkdown(text);
        }
        getMarkdown();
    }, [mdUrl]);

    return <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkGfm]}
      components={{
          a({node, className, children, href, ...props}){
              const hrefObj:{href?:string} = {};
              if(href){
                  const result = new URL(href, mdUrl);
                  hrefObj.href = result.href;
              }
              return <a {...props} target="_blank" className={className} {...hrefObj}>{children}</a>
          },
          img({node, className, src, ...props}){
              const srcObj:{src?:string} = {};
              if(src){
                  const result = new URL(src, mdUrl);
                  srcObj.src = result.href;
              }
              return <img {...props} className={className} {...srcObj} />
          }
      }}
      children={markdown}
  />
}