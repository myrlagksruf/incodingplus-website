'use client'
import { FC, useRef, useState } from "react";
import { ReactMarkdownWrap } from "../utils/lib";
import './client.scss'

export const SosicList:FC<{list:string[]}> = ({list}) => {
    const [index, setIndex] = useState(0);
    const body = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    return (<div className="grid gap-3 sosic-container">
        <div className="pt-8 mt-8 markdown-body">
            <h1 className='text-xl tracking-wider' style={{
                fontFamily:"NanumSquareNeo",
                fontWeight:"900"
            }}>| 인코딩플러스 소식</h1>
            <div className="bg-blue-50 p-3">
                {list.map((v, i) => {
                    let mat = v.match(/(?<=\d)\./);
                    let result = v;
                    if(mat){
                        result = v.slice((mat.index ?? -1) + 1)
                    }
                    return <div
                        onClick={() => {
                            if(!loading){
                                setLoading(true);
                                setIndex(i)
                            }
                        }}
                        style={{fontFamily: 'NanumSquareNeo'}}
                        className={`${index === i ? '' : 'sosic-disable'} sosic-list cursor-pointer p-2 font-extrabold`}
                        key={i}>
                            {result}
                        </div>
                    })
                }
            </div>
        </div>
        <div ref={body} className="pt-8 mt-8 markdown-body pl-6" style={{
            transition:'height 0.5s'
        }}>
            <ReactMarkdownWrap url={`root/sosic/${list[index]}/index.md`} onload={() => setLoading(false)} />
        </div>
    </div>)
}