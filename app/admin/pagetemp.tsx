'use client'
import Link from "next/link";
import { iBannerList } from "../mongodb/public/banner/type";
import { useEffect, useState } from "react";
import { ContainerMain, ContainerMin } from "../body";


export default function Page(){
    let [json, setJson] = useState<iBannerList|null>(null);
    let [command, setCommand] = useState('');
    useEffect(() => {
        const init = async () => {
            const res = await fetch(`/mongodb/public/banner/list`);
            setJson((await res.json()) as iBannerList);
        }
        init();
    }, [json]);

    useEffect(() => {

    }, [command]);
    
    return (<ContainerMain>
        <ContainerMin>
            <h1 className="text-4xl">배너 수정</h1>
            {json ? json.data.map((v, i) => (
                <div className="grid" style={{
                    gridTemplateColumns:'1fr 30px 30px'
                }}>
                <Link
                    key={i}
                    className="p-3 bg-blue-200 rounded-md"
                    href={`/admin/banner/${v._id}`}>{v.name}
                </Link>
                <button className="bg-red-300">↑</button>
                <button className="bg-green-300">↓</button>
            </div>)) : <></>}
            <button onClick={() => setCommand('new')} className="w-full bg-blue-300 p-4">새로 추가</button>
        </ContainerMin>
    </ContainerMain>)
}