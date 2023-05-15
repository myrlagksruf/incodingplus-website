import { MyFile } from "../type"

const getS3PublicUrl = (file: Pick<MyFile, 'path'>) => {
  return `https://s3.ap-northeast-2.amazonaws.com/cdn.in-coding.com/public/${file.path}`

}

export { getS3PublicUrl }