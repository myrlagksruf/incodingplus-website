import { MyFile } from "../type"

const getS3PublicUrl = (file: Pick<MyFile, 'path'>) => {
  return `https://s3.ap-northeast-2.amazonaws.com/cdn.in-coding.com/public/${file.path}`

}

const getSetting = async <T>(url:string) => {
  const res = await fetch(getS3PublicUrl({path:url}));
  const json = await res.json();
  return json as T;
}

export { getS3PublicUrl, getSetting }