'use client'
import { Dispatch, FC, ReactNode, SetStateAction, createContext, useEffect, useState } from "react";

interface iInner{
    innerWidth:number;
    innerHeight:number;
}

export const InnerContext = createContext<{
    inner:iInner;
    setInner:Dispatch<SetStateAction<iInner>>;
}>({
    inner:{
        innerWidth:0,
        innerHeight:0,
    },
    setInner:() => {}
})

export const Resize:FC<{children:ReactNode}> = ({children}) => {
    const [inner, setInner] = useState<iInner>({
        innerWidth:0,
        innerHeight:0
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