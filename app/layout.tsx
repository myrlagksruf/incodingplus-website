import React, { FC } from 'react';
import './globals.css'
import logo from '@/public/logo.svg'
import Image from 'next/image';

export const metadata = {
  title: '인코딩 플러스 코딩 학원',
  description: '안녕하세요. <설명>',
};

const Header: FC = () => {
  return (<header className='box-content sticky top-0 flex items-center justify-around h-8 p-4 bg-white shadow-md'>
    <div>
      <Image
        src={logo}
        alt="logo image"
        height={32}
      />
    </div>
    <div>
      뭔가 메뉴
    </div>
  </header>)
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
