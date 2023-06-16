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

export interface iUpload{
    files:MyFile[];
    command:'PUT'|'POST'|'PATCH'|'';
}

export interface iBanner{
    mobile:{
      url:string;
      backgroundColor:string;
      href:string;
    };
    desktop:{
        url:string;
        backgroundColor:string;
        href:string;
    };
}


export interface CurriSetting{
    name:string;
    href:string;
    src:string;
}