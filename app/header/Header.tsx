'use client'
import Image from 'next/image';
import { FC, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Menubar } from 'primereact/menubar';
import './Header.scss';

export const Header:FC<{files:string[][]}> = ({files}) => {
    const router = useRouter();
    const items = useMemo(() => files.map(v => ({
        label:v[0],
        items:v.slice(1).map(t => ({
            label:t.split('.')[3],
            command:() => router.push(`/curriculum/${t}`)
        }))
    })), [files])
    const start = <a href="/">
        <img src="/logo.svg" width={32} height={32} />
    </a>
    return (<header className="card">
        <Menubar model={[{ label:"학원 소식", command:() => router.push("/introduce")}, ...items]} start={start} />
    </header>
    )
}