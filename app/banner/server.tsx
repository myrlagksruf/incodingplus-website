import { FC } from "react";

interface iBanner{
    backgroundColor:string;
    src:string;
}

export const Banner:FC<iBanner> = ({backgroundColor, src}) => {
    return (<div className="h-96 flex-grow" style={{
        backgroundColor,
    }}>
        <div className="h-full bg-contain bg-no-repeat bg-center container m-auto overflow-hidden" style={{
            backgroundImage:`url("${src}")`,
        }}></div>
    </div>)
}