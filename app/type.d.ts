export interface MyFile{
    name:string,
    type:string,
    lastModified:number;
    size:number;
    data:string;
    path:string;
    isNew?:boolean;
}