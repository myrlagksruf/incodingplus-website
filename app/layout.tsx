import React, { FC } from 'react';
import './globals.scss'
import logo from '@/public/logo.svg'
import Image from 'next/image';
import Link from 'next/link';
import { Header } from './header/Header';

export const metadata = {
  title: '인코딩 플러스 코딩 학원',
  description: '안녕하세요. <설명>',
};

const Footer = () => {
  return (<footer>
    <div className='box-border flex items-center justify-center h-16 bg-gray-200'>
      <div className='flex gap-8 w-full p-4' style={{
        maxWidth:'1200px'
      }}>
        <div>이용약관</div>
        <div>개인정보처리방침</div>
        <div>교습비 반환기준</div>
      </div>
    </div>
    <div className='w-full m-auto text-gray-500 p-4 text-sm' style={{
      maxWidth:'1200px'
    }}>
      <div>대표: 김정준 | 개인정보관리책임자 : 김정준</div>
      <br />
      <div>소재지: 경기도 안산시 단원구 광덕동로 41, 로진프라자 3층 인코딩프러스</div>
      <div>전화번호: 010-2838-2391</div>
      <div>사업자번호: 847-81-00387</div>
      <div>CopyRight: 블라블라</div>
    </div>
  </footer>)
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=tigdx8m9ob"></script>
        <script src="/js/resize.js"></script>
      </head>
      <body className='flex flex-col'>
        <Header />
        <div className='flex flex-col flex-grow'>{children}</div>
        <Footer />
      </body>
    </html>
  )
}
