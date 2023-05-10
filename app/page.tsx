import { FC } from 'react'
import { BannerList } from './banner/client';
import { ContainerMin, ContainerMain } from './body';
import { getFileOrFolder } from './mongodb/public/list/[...paths]/db';
import { MyFile } from './type';
import { SosicList } from './sosic/client';


interface iImageButton{
  title:string;
  src:string;
  href:string;
}

interface iCurri{
  title:string;
  src:string;
}

const ImageButton:FC<iImageButton> = ({title, src, href}) => (<a target='_blank' href={href} className='flex items-center flex-col gap-4'>
    <img src={src} alt={title} />
    <strong>{title}</strong>
</a>);

const Curri:FC<iCurri> = ({title, src}) => {
  return (<div className='flex mt-7 items-end pb-3 pl-3 w-96 h-48 relative rounded-xl' style={{
    background:`linear-gradient(180deg, rgba(0, 0, 0, 0) 66.15%, rgba(0, 0, 0, 0.5) 100%), url("${src}"), #D9D9D9`,
    backgroundSize:'cover',
    backgroundPosition:'center',
  }}>
    <div className='text-white font-black'>{title}</div>
  </div>)
}

export default async function Home() {
  const res = await getFileOrFolder(['root', 'banner'], 1);
  const sosicStringList = ((await getFileOrFolder(['root', 'sosic'], 0)) as MyFile[]).filter(v => v.type === 'folder');
  let banners:string[][] = [];
  if(res === null || !Array.isArray(res)) banners = [['default', 'rgb(75, 130, 195)', '/logo.svg']];
  else {
    const result = res
      .filter(v => /^root\/banner/.test(v.path) && v.type !== 'folder')
      .sort((a, b) => a.path.localeCompare(b.path))
      .reduce((a, v) => {
        let [title, img] = v.path.split('/').slice(2);
        let find = a.find(t => t[0] === title);
        if(!find) {
          find = [title];
          a.push(find);
        }
        let check = img.split('.')[0];
        let back = img.split('.')[1];
        if(check === 'desktop'){
          find[1] = back;
          find[2] = `/mongodb/public/list/${v.path.split('/').map(encodeURIComponent).join('/')}`;
        } else if(check === 'mobile'){
          find[3] = back;
          find[4] = `/mongodb/public/list/${v.path.split('/').map(encodeURIComponent).join('/')}`;
        }
        return a;
      }, [] as string[][])
      banners = result;
  }
  return (
    <ContainerMain>
      <BannerList banners={banners} />
      <ContainerMin className='gap-8 pt-10' isRow={true}>
        <ImageButton href='https://map.naver.com/v5/entry/place/1353598676?c=13,0,0,0,dh&placePath=%2Fhome%3Fentry=plt' title='상담 예약' src="/image/sandam.svg" />
        <ImageButton href='https://map.naver.com/v5/entry/place/1353598676?c=13,0,0,0,dh&placePath=%2Fhome%3Fentry=plt' title='위치 보기' src="/image/position.svg" />
        <ImageButton href='https://blog.naver.com/incodingplus' title='블로그 보기' src="/image/blog.svg" />
      </ContainerMin>
      <ContainerMin>
        <h2 className='text-xl font-black mt-14'>커리큘럼 소개</h2>
        <div className='flex flex-wrap justify-between'>
          <Curri title="입시반(프로그래밍)" src="/curri/coding1.avif" />
          <Curri title="입시반(프로그래밍)" src="/curri/coding2.avif" />
          <Curri title="입시반(프로그래밍)" src="/curri/coding3.avif" />
        </div>
      </ContainerMin>
      <ContainerMin className='mb-5'>
        <h2 className='text-xl font-black mt-14'>인코딩 플러스 소식</h2>
        <SosicList list={sosicStringList.map(v => v.name)} />
      </ContainerMin>
    </ContainerMain>
  )
}
