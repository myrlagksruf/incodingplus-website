'use client'

import { FC, FormEventHandler, useCallback, useEffect, useRef, useState } from "react";

type iType = [string,string][];
type iData = [string,string,boolean?][];

export const View:FC<{
    id:string;
    name:string;
    type:iType;
    data:iData;
    url:string;
}> = ( {id, name, type, data, url}) => {
    const [arr, setArr] = useState<iData>(data);
    const [command, setCommand] = useState<string>('');
    const toHex = (rgb:string) => {
        if(!/^rgb/.test(rgb)) return rgb;
        let colors = rgb.match(/\d+/g) ?? [];
        if(colors.length < 3) return rgb;
        return `#${colors.map(v => Number(v).toString(16).padStart(2, '0')).join('')}`;
    }
    const call:FormEventHandler<HTMLInputElement> = useCallback(async (e) => {
        let tar = e.currentTarget;
        if(e.currentTarget.type === 'file'){
            let reader = new FileReader();
            if(!tar.files) return;
            reader.readAsDataURL(tar.files[0]);
            await new Promise(res => reader.onload = res);
            if(typeof reader.result !== 'string') return;
            let id = tar.dataset.id;
            if(!id) return;
            let find = arr.findIndex(v => v[0] === id);
            if(find === -1) return;
            setArr([...arr.slice(0, find), [id, reader.result, true], ...arr.slice(find + 1)]);
        } else {
            let id = tar.dataset.id;
            if(!id) return;
            let find = arr.findIndex(v => v[0] === id);
            if(find === -1) return;
            setArr([...arr.slice(0, find), [id, tar.value, true], ...arr.slice(find + 1)]);
        }
    }, []);
    useEffect(() => {
        const update = async () => {
            setCommand('loading');
            let obj = arr.reduce((a:Record<string,string>, v) => {
                if(v[2]) a[v[0]] = v[1];
                return a;
            }, {id});
            const res = await fetch(url, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(obj)
            });
            if(res.status === 200){
                alert('성공적으로 업데이트 되었습니다.');
                setArr(arr.map(v => [...v.slice(0, 2), false] as [string, string, boolean]));
            } else {
                let json = await res.json();
                alert(json.reason);
            }
            setCommand('');
        }

        if(command === 'update'){
            update()
        }
    }, [command]);
    return (<div className="grid grid-cols-3">
        <div>항목</div>
        <div>데이터</div>
        <div>미리보기</div>
        {type.map((v, i) => {
            let data = arr.find(t => t[0] === v[0]);
            if(!data) return null;
            const divArr = [<div key={i * 3}>{data[0]}</div>];
            if(v[1] === 'url') {
                divArr.push(<div key={i * 3 + 1}><input data-id={data[0]} data-value={data[1]} type="file" onInput={call}/></div>);
                divArr.push(<div key={i * 3 + 2}><img src={data[1]} /></div>);
            }
            else if(v[1] === 'color'){
                divArr.push(<div key={i * 3 + 1}><input data-id={data[0]} type="color" value={toHex(data[1])} onInput={call} /></div>);
                divArr.push(<div key={i * 3 + 2} style={{backgroundColor:data[1]}}></div>);
            }
            else {
                divArr.push(<div key={i * 3 + 1}><input data-id={data[0]} type="text" value={data[1]} onInput={call} /></div>);
                divArr.push(<div key={i * 3 + 2}>{data[1]}</div>)
            }
            return divArr;
        }).filter(v => v).flat()}
        <div className="text-center" style={{
            gridColumn:'span 3'
        }}>
            <button onClick={() => setCommand('update')} className="p-3 bg-gray-100 rounded-sm">업데이트</button>
            <button onClick={() => setCommand('delete')} className="p-3 bg-gray-100 rounded-sm">삭제</button>
            <a className="p-3 bg-gray-100 rounded-sm" href="/admin">뒤로 가기</a>
        </div>
    </div>)
}