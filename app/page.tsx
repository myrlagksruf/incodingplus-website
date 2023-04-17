import Image from 'next/image'
import { Inter } from 'next/font/google'
import { FC } from 'react'

const inter = Inter({ subsets: ['latin'] })

interface iImageButton{
  title:string;
  src:string;
}

const ImageButton:FC<iImageButton> = ({title, src}) => (<div className='flex items-center flex-col gap-4'>
  <img src={src} alt={title} />
  <strong>{title}</strong>
</div>);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ImageButton title='상담 예약' src="/image/sandam.svg" />
      <ImageButton title='위치 보기' src="/image/position.svg" />
      <ImageButton title='블로그 보기' src="/image/blog.svg" />
    </main>
  )
}
