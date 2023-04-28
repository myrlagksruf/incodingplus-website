'use client'
import { FC, useEffect } from "react";

export const Resize:FC = () => {
    useEffect(() => {
        let setVh = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        setVh();
        window.addEventListener('resize', setVh);
        return () => {
            window.removeEventListener('resize', setVh);
        }
    }, []);
    return <></>
}