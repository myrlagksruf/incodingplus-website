import { ContainerMin } from "@/app/body";
import { getFileOrFolder } from "@/app/mongodb/public/list/[...paths]/db";
import { MyFile } from "@/app/type";
import { getS3PublicUrl } from "@/app/utils";
import { MDBody } from "./mdBody";

export default async function Page({params}:{params:{main:string}}){
    let main = decodeURIComponent(params.main);
    let list = (await getFileOrFolder(['root', 'curriculum', main], 0)) as MyFile[];
    let desktop = getS3PublicUrl({ path: list.find(v => v.name.includes('desktop.md'))?.path ?? 'root/index.md' })
    let mobile = getS3PublicUrl({ path: list.find(v => v.name.includes('mobile.md'))?.path ?? 'root/index.md' })

    if(!desktop.endsWith('.md')) {
        return <div>올바른 파일을 업로드 해주세요</div>
    }

    return(
        <div className="py-4">
            <ContainerMin className="m-auto">
                <div className="hidden md:block markdown-body">
                    <MDBody mdUrl={desktop} />
                </div>
                <div className="md:hidden markdown-body">
                    <MDBody mdUrl={mobile} />
                </div>
            </ContainerMin>
        </div>
    )

}