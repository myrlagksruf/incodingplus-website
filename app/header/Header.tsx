'use client'
import Image from 'next/image';
import { FC, useState } from 'react';
import logo from '@/public/logo.svg';
import './Header.scss'
import Link from 'next/link';

interface iMenu{
    name:string;
    menus:{
        name:string;
        href:string;
    }[];
}

export const Menu:FC<iMenu> = ({name, menus}) => {
    let [show, setShow] = useState(false);
    let [ani, setAni] = useState(false);
    return (<div
        className={`relative${show ? ' show' : ''}${ani ? ' ani' : ''}`}
        onMouseEnter={() => {
            setShow(true);
            setAni(true);
        }}
        onMouseLeave={() => {
            setAni(false);
        }}
        onTransitionEnd={e => console.log(e)}>
    <div className='h-full header-dropdown'>{name}</div>
    <div className='header-dropdown-menu' onTransitionEnd={e => {
        let tar = e.target as HTMLDivElement;
        if(tar.parentElement?.firstChild === tar){
            let { opacity } = getComputedStyle(tar);
            if(Number(opacity) < 0.5) setShow(false);
        }
    }}>
        {menus.map((v, i) => (<div key={i} style={{
            transitionDelay:`${ani ? i * 0.1 : (menus.length - i - 1) * 0.1}s`,
        }}><Link href={v.href}>{v.name}</Link></div>))}
    </div>
  </div>)
}