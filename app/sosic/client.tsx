'use client'
import { FC, useRef, useState } from "react";
import { ReactMarkdownWrap } from "../utils/lib";

export const SosicList:FC<{list:string[]}> = ({list}) => {
    const [index, setIndex] = useState(0);
    const body = useRef<HTMLDivElement>(null);
    return (<div className="grid gap-3" style={{
        gridTemplateColumns:"1fr 2fr"
    }}>
        <div className="pt-8 mt-8 markdown-body">
            <h2 className='text-xl font-black'>인코딩 플러스 소식</h2>
            {list.map((v, i) => {
                let mat = v.match(/(?<=\d)\./);
                let result = v;
                if(mat){
                    result = v.slice((mat.index ?? -1) + 1)
                }
                return <div
                    onClick={() => setIndex(i)}
                    style={{
                        fontFamily: 'NanumSquare'
                    }}
                    className={`${index === i ? 'text-blue-500 text-xl' : 'text-gray-300 text-lg'}  hover:text-red-300 cursor-pointer mb-3 font-extrabold`}
                    key={i}>
                        {result}
                    </div>
                })}
        </div>
        <div ref={body} className="pt-8 mt-8 markdown-body" style={{
            transition:'height 0.5s'
        }}>
            <ReactMarkdownWrap url={`root/sosic/${list[index]}/index.md`} />
        </div>
    </div>)
}