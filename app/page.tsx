import { FC } from 'react'
import { BannerList } from './banner/client';
import { ContainerMin, ContainerMain } from './body';
import { getFileOrFolder } from './mongodb/public/list/[...paths]/db';
import { iBanner, MyFile, CurriSetting } from './type';
import { SosicList } from './sosic/client';
import { getS3PublicUrl, getSetting } from './utils';


interface iImageButton{
  title:string;
  src:string;
  href:string;
}

interface iCurri{
  title:string;
  src:string;
  href:string;
}

const ImageButton:FC<iImageButton> = ({title, src, href}) => (<a target='_blank' href={href} className='flex items-center flex-col gap-4'>
    <img src={src} alt={title} />
    <strong>{title}</strong>
</a>);

const Curri:FC<iCurri> = ({title, src, href}) => {
  return (<a href={href} className='flex mt-7 items-end pb-3 pl-3 w-96 h-48 relative rounded-xl' style={{
    background:`linear-gradient(180deg, rgba(0, 0, 0, 0) 66.15%, rgba(0, 0, 0, 0.5) 100%), url("${getS3PublicUrl({path:`root${src}`})}"), #D9D9D9`,
    backgroundSize:'cover',
    backgroundPosition:'center',
  }}>
    <div className='text-white font-black'>{title}</div>
  </a>)
}

const DEFAULT_COLOR = 'rgb(75, 130, 195)';
const DEFAULT_URL = '/logo.svg';

export default async function Home() {
  const [banners, curri, sosicStringListRaw] = await Promise.all([
    getSetting<iBanner[]>("root/banner/setting.json"),
    getSetting<CurriSetting[]>("root/curri/setting.json"),
    getFileOrFolder(['root', 'sosic'], 0),
  ] as const)
  const sosicStringList = (sosicStringListRaw as MyFile[]).filter(v => v.type === 'folder');
  return (
    <ContainerMain>
      <BannerList banners={banners} />
      <ContainerMin className='gap-8 pt-10' isRow={true}>
        <ImageButton href='https://map.naver.com/v5/entry/place/1353598676?c=13,0,0,0,dh&placePath=%2Fhome%3Fentry=plt' title='상담 예약' src="/image/sandam.svg" />
        <ImageButton href='https://map.naver.com/v5/entry/place/1353598676?c=13,0,0,0,dh&placePath=%2Fhome%3Fentry=plt' title='위치 보기' src="/image/position.svg" />
        <ImageButton href='https://blog.naver.com/incodingplus' title='블로그 보기' src="/image/blog.svg" />
      </ContainerMin>
      <ContainerMin>
        <h1 className='text-xl font-black mt-14 tracking-wider mb-6' style={{
          fontFamily:"NanumSquareNeo",
          fontSize:"2em"
        }}>| 커리큘럼 소개</h1>
        <div className='flex flex-wrap justify-between'>
          {curri.map((v, i) => <Curri title={v.name} src={v.src} href={v.href} key={i} />)}
        </div>
      </ContainerMin>
      <ContainerMin className='my-16'>
        <h1 className='text-xl font-black mt-14 mb-6 tracking-wider' style={{
          fontFamily:"NanumSquareNeo",
          fontSize:"2em"
        }}>| 인코딩플러스 소식</h1>
        <SosicList list={sosicStringList.map(v => v.name)} />
      </ContainerMin>
    </ContainerMain>
  )
}

export const dynamic = 'force-dynamic'
