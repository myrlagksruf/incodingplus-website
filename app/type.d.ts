import type { Binary } from "mongodb";

interface MyFileOrigin{
    name:string,
    type:string,
    lastModified:number;
    size:number;
    path:string;
    isNew?:boolean;
    isPersistent?:boolean;
}

export interface MyFile extends MyFileOrigin{
    data:string;
}

export interface MyFileBuffer extends MyFileOrigin{
    data:Binary;
}