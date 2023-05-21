import { ContainerMin } from "@/app/body";
import { getFileOrFolder } from "@/app/mongodb/public/list/[...paths]/db";
import { MyFile } from "@/app/type";
<<<<<<< Updated upstream
import { ReactMarkdownWrap } from "@/app/utils/lib";
=======
import { getS3PublicUrl } from "@/app/utils";
import { MDBody } from "./mdBody";
>>>>>>> Stashed changes

export default async function Page({params}:{params:{main:string}}){
    let main = decodeURIComponent(params.main);
    let list = (await getFileOrFolder(['root', 'curriculum', main], 0)) as MyFile[];
<<<<<<< Updated upstream
    let desktop = list.find(v => v.name.includes('desktop.md'))?.path ?? 'root/index.md';
    let mobile = list.find(v => v.name.includes('mobile.md'))?.path ?? 'root/index.md';
    return <>
        <div className="hidden md:block">
            <ReactMarkdownWrap url={desktop} />
        </div>
        <div className="md:hidden">
            <ReactMarkdownWrap url={mobile} />
        </div>
    </>
=======
    let desktop = getS3PublicUrl({ path: list.find(v => v.name.includes('desktop.md'))?.path ?? 'root/index.md' })
    let mobile = getS3PublicUrl({ path: list.find(v => v.name.includes('mobile.md'))?.path ?? 'root/index.md' })

    if(!desktop.endsWith('.md')) {
        return <div>올바른 파일을 업로드 해주세요</div>
    }

    return(
        <div className="py-4">
            <ContainerMin>
                <div className="hidden md:block">
                    <MDBody mdUrl={desktop} />
                </div>
                <div className="md:hidden">
                    <MDBody mdUrl={mobile} />
                </div>
            </ContainerMin>
        </div>
    )

>>>>>>> Stashed changes
}