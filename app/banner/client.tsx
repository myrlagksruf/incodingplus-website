'use client'

import { FC, useState, useRef, useLayoutEffect } from "react";
import React from "react";

export const BannerList:FC<{banners:string[][]}> = ({banners}) => {
    let elm = useRef<HTMLDivElement>(null);
    let setT = useRef<NodeJS.Timer>();
    let [ inner, setInner ] = useState({ width:0, height:0 });
    let [index, setIndex] = useState(0);
    let [flag, setFlag] = useState(false);
    useLayoutEffect(() => {
        setT.current = setInterval(() => {
            setIndex(v => (v + 1) % banners.length);
        }, 5000);
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
            clearInterval(setT.current);
        }
    }, []);
    return (<div ref={elm} className="h-96 mb-10 w-full relative overflow-y-hidden overflow-x-hidden whitespace-nowrap">
        {flag && <div className="flex w-full">
            {banners.map((v, i) => <div key={i} className="absolute h-full flex-grow w-full" style={{
                backgroundColor:inner.width < 768 ? v[3] : v[1],
                top:0,
                left:0,
                transform:`translateX(calc(100% * ${i - index}))`,
                transition:'transform 0.5s'
            }}>
                <div className="h-full bg-contain bg-no-repeat bg-center container m-auto overflow-hidden" style={{
                    backgroundImage:`url("${inner.width < 768 ? v[4] : v[2]}")`,
                }}></div>
            </div>)}
        </div>}
        <svg onClick={() => {
                setIndex((index - 1 + banners.length) % banners.length);
                clearInterval(setT.current);
                setT.current = setInterval(() => {
                    setIndex(v =>  (v - 1 + banners.length) % banners.length);
                }, 5000);
            }} style={{
            left:'max(calc(50% - 600px - 30px), 0px)',
            top:'50%',
            transform:'translateY(-50%)'
        }} className="cursor-pointer absolute" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="48" y="48" width="48" height="48" rx="24" transform="rotate(-180 48 48)" fill="black" fillOpacity="0.5"/>
            <path d="M26.586 12.5861L15.172 24.0001L26.586 35.4141L29.414 32.5861L20.828 24.0001L29.414 15.4141L26.586 12.5861Z" fill="white"/>
        </svg>
        <svg onClick={() => {
                setIndex((index + 1) % banners.length);
                clearInterval(setT.current);
                setT.current = setInterval(() => {
                    setIndex(v => (v + 1) % banners.length);
                }, 5000);
            }} style={{
            right:'max(calc(50% - 600px - 30px), 0px)',
            top:'50%',
            transform:'translateY(-50%)'
        }} className="cursor-pointer absolute" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="24" fill="black" fillOpacity="0.5"/>
            <path d="M21.4139 35.4139L32.8279 23.9999L21.4139 12.5859L18.5859 15.4139L27.1719 23.9999L18.5859 32.5859L21.4139 35.4139Z" fill="white"/>
        </svg>
    </div>)
}