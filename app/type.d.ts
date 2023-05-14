interface MyFileOrigin{
    name:string,
    type:string,
    lastModified:number;
    size:number;
    path:string;
    pathCount:number;
    isPersistent?:boolean;
}

export interface MyFile extends MyFileOrigin{
    data:string;
}
