'use client'
import { FC, ReactNode, createContext, useEffect, useState } from "react";

interface iInner{
    innerWidth:number;
    innerHeight:number;
}

const InnerContext = createContext<{
    inner:ReturnType<typeof useState<iInner>>[0];
    setInner:ReturnType<typeof useState<iInner>>[1];
}>({
    inner:{
        innerWidth:window.innerWidth,
        innerHeight:window.innerHeight,
    },
    setInner:() => {}
})

export const Resize:FC<{children:ReactNode}> = ({children}) => {
    const [inner, setInner] = useState<iInner>({
        innerWidth:window.innerWidth,
        innerHeight:window.innerHeight
    });
    useEffect(() => {
        let setVh = () => {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
            setInner({
                innerWidth:window.innerWidth,
                innerHeight:window.innerHeight
            })
        }
        setVh();
        window.addEventListener('resize', setVh);
        return () => {
            window.removeEventListener('resize', setVh);
        }
    }, []);
    return <InnerContext.Provider value={{ inner, setInner }}>
        {children}
    </InnerContext.Provider>
}