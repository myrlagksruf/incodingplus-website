import { S3 } from '@aws-sdk/client-s3';
import { MyFile, iUpload } from '@/app/type';
import { getS3PublicUrl } from '@/app/utils';
const Bucket = 'cdn.in-coding.com';
/** Base64 인코딩된 바이너리 파일을 s3에 업로드 */
async function uploadBinaryFile(s3:S3, file: MyFile){
    if(!file.data.includes('base64')){
        // file.data like 'data:image/png;base64,~~'
        return ''
    }
    const data = Buffer.from(file.data.split(',')[1], 'base64')
    const Key = `public/${file.path}` // ex. file.path == root/curriculum/1.커리큘럼.1.입시반/desktop.svg

    await s3.putObject({
        Bucket,
        Key,
        Body: data, 
        ContentType: file.type,
        ACL: 'public-read',

    })

    return getS3PublicUrl(file)
}

export const uploadFile = async (files:MyFile[], onEnd:() => void) => {
    try{
        const response = await fetch('/mongodb/protected/auth');
        const credentials = (await response.json()) as { accessKeyId:string, secretAccessKey:string};
        const s3 = new S3({
            credentials,
            region: 'ap-northeast-2',
        });
        await Promise.all(files.map(async file => {
            if(file.data.includes('base64')){
                file.data = await uploadBinaryFile(s3, file);
            }
        }))
        const res = await fetch('/mongodb/protected', {
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(files)
        });
        if(res.status !== 200){
            alert(`${res.status} : ${res.statusText}`);
        }
    } catch(err){
        alert(err);
    }
    onEnd();
}


export const uploadFolder = async (file:MyFile, onEnd:() => void) => {
    try{
        const res = await fetch('/mongodb/protected', {
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(file)
        });
        if(res.status !== 200){
            alert(`${res.status} : ${res.statusText}`);
        }
    } catch(err){
        alert(err);
    }
    onEnd();
}


export const deleteFile = async (file:MyFile, onEnd:() => void) => {
    try{
        const res = await fetch('/mongodb/protected', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(file)
        });
        if(res.status !== 200){
            alert(`${res.status} : ${res.statusText}`);
        }
    } catch(err){
        alert(err);
    }
    onEnd();
}