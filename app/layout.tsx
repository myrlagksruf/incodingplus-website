import React, { FC } from 'react';
import './globals.scss'
import logo from '@/public/logo.svg'
import Image from 'next/image';
import { Menu } from './header/Header';
import Link from 'next/link';

export const metadata = {
  title: '인코딩 플러스 코딩 학원',
  description: '안녕하세요. <설명>',
};

const Header = () => {
  return (<header className='box-content sticky top-0 flex items-center justify-around h-8 p-4 bg-white shadow-md'>
    <div>
      <Image
        src={logo}
        alt="logo image"
        height={32}
      />
    </div>
    <div className='flex justify-between' style={{minWidth:'450px'}}>
      <div><Link href="/">학원 소개</Link></div>
      <Menu name="커리큘럼" menus={[
        {name:"입시반", href:"/curriculum/ipsi"},
        {name:"코딩 기초", href:"/curriculum/coding_basic"},
        {name:"국어 논술", href:"/curriculum/guknon"},
        {name:"원데이 클래스", href:"/curriculum/one_day_class"},
      ]} />
      <div>학원 소식</div>
      <div>수강생 후기</div>
    </div>
  </header>)
}

const Footer = () => {
  return (<footer>
    <div className='box-content flex items-center justify-center h-8 p-4 bg-gray-200'>
      <div className='flex gap-8 w-full' style={{
        maxWidth:'1200px'
      }}>
        <div>이용약관</div>
        <div>개인정보처리방침</div>
        <div>교습비 반환기준</div>
      </div>
    </div>
    <div className='w-full text-gray-500 p-4 text-sm' style={{
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
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
