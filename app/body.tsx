import { FC, ReactNode } from "react";

export const ContainerMin:FC<{children:ReactNode,className?:string,isRow?:boolean}> = ({children, className, isRow}) => {
    return (<div className={`flex justify-start w-full box-border pl-5 pr-5 ${isRow ? 'flex-row' : 'flex-col'} ${className ?? ''}`} style={{
        maxWidth:'1200px'
    }}>
        {children}
    </div>)
}

export const ContainerMain:FC<{children:ReactNode,className?:string}> = ({children, className}) => {
    return (<main className={`flex flex-col items-center justify-between ${className ?? ''}`}>
        {children}
    </main>)
}