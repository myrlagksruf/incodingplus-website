'use client'
import Image from 'next/image';
import { FC, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import logo from '@/public/logo.svg';
import Link from 'next/link';
import './Header.scss';
import { MyFile } from '../type';

const Pos = createContext<number[]>([]);

interface iMenu{
    name:string;
    href:string;
}

interface iMenuContainer{
    menus:iMenu[];
}

interface iSubMenuContainer{
    menus:iMenu[][];
    flag:boolean;
}

const HEIGHT = 64;

const MenuContainer:FC<iMenuContainer> = ({menus}) => {
    return <div
        className='menu-container flex-grow grid justify-between relative'
        style={{
            minWidth:'300px',
            maxWidth:'600px',
            gridTemplateColumns: `repeat(${menus.length}, max-content)`
        }}>
        {menus.map((v, i) => (<div className='w-fit menu relative main-menu font-bold text-gray-900' key={i}><Link href={v.href}>{v.name}</Link></div>))}
  </div>
}

const SubMenuContainer:FC<iSubMenuContainer> = ({menus, flag}) => {
    let widths = useContext(Pos);
    let len = useMemo(() => {
        return menus.reduce((a, v) => Math.max(a, v.length), 0);
    }, [menus]);
    const SUBPADDING = 20;
    const GAP = 40;
    return (<div className='sub-menu-container absolute top-0 z-10 w-full' style={{
        height:`${GAP * len + SUBPADDING}px`,
        transition:`calc(0.1s * ${len})`,
        transform:`${flag ? `translateY(${HEIGHT}px)` : 'translateY(-100%)'}`,
        backgroundColor:'#FFFFFFE0'
    }}>
        {menus.map((v, i) => v.map((k, j) => (<div className='absolute menu top-0 w-max' style={{
            transform:`translate(${widths[i]}px, ${GAP * j + SUBPADDING}px)`
        }} key={`${i}-${j}`}><Link href={k.href}>{k.name}</Link></div>))).flat()}
    </div>)
}

export const Header:FC<{files:string[][]}> = ({files}) => {
    let elm = useRef<HTMLDivElement>(null);
    let [flag, setFlag] = useState(false);
    let [widths, setWidths] = useState<number[]>([]);
    useEffect(() => {
        let re = new ResizeObserver(() => {
            if(!elm.current) return
            let arr = Array.from(elm.current.querySelectorAll('.main-menu')).map(v => v.getClientRects()[0].x);
            setWidths(arr);
        });
        if(elm.current){
            re.observe(elm.current);
        }
        return () => {
            re.disconnect();
        }
    }, []);
    return (<header
            onMouseEnter={() => !flag ? setFlag(true) : null}
            onMouseLeave={() => flag ? setFlag(false) : null}
            className='sticky top-0 z-20'>
        <Pos.Provider value={widths}>
            <div
                ref={elm}
                className='relative z-20 box-border flex justify-center p-4 bg-white shadow-md'
                style={{
                    height:`${HEIGHT}px`
                }}
            >
                <div className='flex gap-4 items-center justify-around w-full box-border' style={{
                    maxWidth:'120rem',
                }}>
                    <Link href="/">
                        <Image
                            src={logo}
                            alt="logo image"
                            height={32}
                        />
                    </Link>
                    <MenuContainer menus={[
                    {name:'학원 소개', href:'/introduce'},
                    ...files.map(v => ({name:v[0], href:`/curriculum/${v[1]}`}))
                    ]} />
                </div>
            </div>
            <SubMenuContainer flag={flag} menus={[
                [],
                ...files.map(v => v.slice(1).map(t => ({name:t.split('.').at(-1) ?? '', href:`/curriculum/${t}`})))
            ]} />
        </Pos.Provider>
    </header>
    )
}