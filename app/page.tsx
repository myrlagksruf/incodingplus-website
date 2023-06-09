import { FC } from 'react'
import { BannerList } from './banner/client';
import { ContainerMin, ContainerMain } from './body';
import { getFileOrFolder } from './mongodb/public/list/[...paths]/db';
import { MyFile } from './type';
import { SosicList } from './sosic/client';
import { getS3PublicUrl } from './utils';


interface iImageButton{
  title:string;
  src:string;
  href:string;
}

interface iCurri{
  title:string;
  src:string;
}

export interface iBanner{
  name:string;
  desktop:{
    color:string;
    url:string;
  };
  mobile:{
    color:string;
    url:string;
  }
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

const DEFAULT_COLOR = 'rgb(75, 130, 195)';
const DEFAULT_URL = '/logo.svg';

export default async function Home() {
  const res = await getFileOrFolder(['root', 'banner'], 1);
  const sosicStringList = ((await getFileOrFolder(['root', 'sosic'], 0)) as MyFile[]).filter(v => v.type === 'folder');
  let banners:iBanner[] = [];
  if(res === null || !Array.isArray(res))
    banners = [{
      name:'default', 
      desktop:{
        color:DEFAULT_COLOR, 
        url:DEFAULT_URL
      },
      mobile:{
        color:DEFAULT_COLOR,
        url:DEFAULT_URL
      }
    }];
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
          find[2] = getS3PublicUrl({
            path: v.path.split('/').map(encodeURIComponent).join('/')
          })
        } else if(check === 'mobile'){
          find[3] = back;
          find[4] = getS3PublicUrl({
            path: v.path.split('/').map(encodeURIComponent).join('/')
          })
        }
        return a;
      }, [] as string[][])
      banners = result.map(v => ({
        name:v[0],
        desktop:{
          color:v[1] ?? DEFAULT_COLOR,
          url:v[2] ?? DEFAULT_URL,
        },
        mobile:{
          color:v[3] ?? DEFAULT_COLOR,
          url:v[4] ?? DEFAULT_URL,
        }
      }));
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
      <ContainerMin className='my-16'>
        <SosicList list={sosicStringList.map(v => v.name)} />
      </ContainerMin>
    </ContainerMain>
  )
}
