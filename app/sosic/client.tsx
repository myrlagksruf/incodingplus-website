'use client'
import { FC, useEffect, useRef, useState } from "react";

const DEFAULT = 300;

export const SosicList:FC<{list:string[]}> = ({list}) => {
    const [index, setIndex] = useState(0);
    const [sh, setSh] = useState(DEFAULT);
    const iframe = useRef<HTMLIFrameElement>(null);
    useEffect(() => {
        let setT = setInterval(() => {
            if(iframe.current)
                setSh(iframe.current.contentDocument?.body.scrollHeight ?? DEFAULT);
        }, 500);
        return () => clearInterval(setT);
    }, []);
    return (<div className="grid gap-3" style={{
        gridTemplateColumns:"1fr 2fr"
    }}>
        <div className="pt-8 mt-8 border-t-2 border-gray-300">
            {list.map((v, i) => {
                let mat = v.match(/(?<=\d)\./);
                let result = v;
                if(mat){
                    result = v.slice((mat.index ?? -1) + 1)
                }
                return <div
                    onClick={() => setIndex(i)}
                    className={`${index === i ? 'text-blue-400' : 'text-gray-300'} text-xl hover:text-red-300 cursor-pointer`}
                    key={i}>
                        {result}
                    </div>
                })}
        </div>
        <div>
            <iframe ref={iframe} className="w-full" src={`/mongodb/public/list/root/sosic/${list[index]}/index.html`} style={{
                border:'none',
                outline:'none',
                height:sh,
            }}></iframe>
        </div>
    </div>)
}