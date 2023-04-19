import Image from 'next/image'
import { Inter } from 'next/font/google'
import { FC } from 'react'
import { Banner, BannerList } from './banner';
import { ContainerMin, ContainerMain } from './body';

const inter = Inter({ subsets: ['latin'] })

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

export default function Home() {
  return (
    <ContainerMain>
      <BannerList>
        <Banner backgroundColor='#3A61EC' src="/banner_image/camp.svg" />
        <Banner backgroundColor='#EC613A' src="/banner_image/camp.svg" />
      </BannerList>
      <ContainerMin className='gap-8 pt-10' isRow={true}>
        <ImageButton href='https://map.naver.com/v5/entry/place/1353598676?c=13,0,0,0,dh&placePath=%2Fhome%3Fentry=plt' title='상담 예약' src="/image/sandam.svg" />
        <ImageButton href='https://map.naver.com/v5/entry/place/1353598676?c=13,0,0,0,dh&placePath=%2Fhome%3Fentry=plt' title='위치 보기' src="/image/position.svg" />
        <ImageButton href='https://blog.naver.com/incodingplus' title='블로그 보기' src="/image/blog.svg" />
      </ContainerMin>
      <ContainerMin>
        <h2 className='text-xl font-black mt-14'>커리큘럼 소개</h2>
        <div className='flex flex-wrap justify-between mb:'>
          <Curri title="입시반(프로그래밍)" src="/curri/coding1.avif" />
          <Curri title="입시반(프로그래밍)" src="/curri/coding2.avif" />
          <Curri title="입시반(프로그래밍)" src="/curri/coding3.avif" />
        </div>
      </ContainerMin>
      <ContainerMin>
        <h2 className='text-xl font-black mt-14'>인코딩 플러스 소식</h2>
        <div className='flex'>

        </div>
      </ContainerMin>
    </ContainerMain>
  )
}
