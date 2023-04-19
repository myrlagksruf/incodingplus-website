'use client'

import { FC, useState, useRef, useLayoutEffect } from "react";
import React from "react";

export const BannerList:FC<{children:React.ReactNode[]}> = ({children}) => {
    let elm = useRef<HTMLDivElement>(null);
    let [ inner, setInner ] = useState({
        width:0,
        height:0
    });
    let [index, setIndex] = useState(0);
    let [flag, setFlag] = useState(false);
    useLayoutEffect(() => {
        let re = new ResizeObserver(ents => {
            for(let ent of ents){
                if(ent.target !== elm.current) continue;
                setInner({
                    width:ent.contentRect.width,
                    height:ent.contentRect.height,
                });
                if(!flag) setFlag(true);
                break;
            }
        });
        if(elm.current){
            re.observe(elm.current);
        }
        return () => {
            re.disconnect();
        }
    }, []);
    return (<div ref={elm} className="h-96 mb-10 w-full relative overflow-y-hidden overflow-x-hidden whitespace-nowrap">
        {flag && <div className="flex w-full" style={{
            width:`${inner.width * 2}px`,
            transform:`translateX(calc(-100% / ${children.length} * ${index}))`,
            transition:'transform 0.5s'
        }}>
            {children}
        </div>}
        <svg onClick={() => setIndex((index - 1 + children.length) % children.length)} style={{
            left:'max(calc(50% - 600px - 30px), 0px)',
            top:'50%',
            transform:'translateY(-50%)'
        }} className="cursor-pointer absolute" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="48" y="48" width="48" height="48" rx="24" transform="rotate(-180 48 48)" fill="black" fillOpacity="0.5"/>
            <path d="M26.586 12.5861L15.172 24.0001L26.586 35.4141L29.414 32.5861L20.828 24.0001L29.414 15.4141L26.586 12.5861Z" fill="white"/>
        </svg>
        <svg onClick={() => setIndex((index + 1) % children.length)} style={{
            right:'max(calc(50% - 600px - 30px), 0px)',
            top:'50%',
            transform:'translateY(-50%)'
        }} className="cursor-pointer absolute" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="24" fill="black" fillOpacity="0.5"/>
            <path d="M21.4139 35.4139L32.8279 23.9999L21.4139 12.5859L18.5859 15.4139L27.1719 23.9999L18.5859 32.5859L21.4139 35.4139Z" fill="white"/>
        </svg>
    </div>)
}
interface iBanner{
    backgroundColor:string;
    src:string;
}

export const Banner:FC<iBanner> = ({backgroundColor, src}) => {
    return (<div className="h-96 flex-grow" style={{
        backgroundColor,
    }}>
        <div className="h-full bg-contain bg-no-repeat bg-center container m-auto overflow-hidden" style={{
            backgroundImage:`url("${src}")`,
        }}></div>
    </div>)
}