import React from 'react';
import './globals.scss'
import { Header } from './header/Header';
import { Resize } from './layoutClient';
import { getFileOrFolder } from './mongodb/public/list/[...paths]/db';
import { MyFile } from './type';

export const metadata = {
  title: '인코딩 플러스 코딩 학원',
  description: '안녕하세요. <설명>',
};

const Footer = () => {
  return (<footer className='bg-gray-50 text-sm'>
    <div className='box-border flex items-center justify-center h-16 '>
      <div className='flex gap-8 w-full p-4' style={{
        maxWidth:'1200px'
      }}>
        <div>이용약관</div>
        <div>개인정보처리방침</div>
        <div>교습비 반환기준</div>
      </div>
    </div>
    <div className='w-full m-auto text-gray-500 p-4' style={{
      maxWidth:'1200px'
    }}>
      <div>대표: 김정준 | 개인정보관리책임자 : 김정준</div>
      <br />
      <div>소재지: 경기도 안산시 단원구 광덕동로 41, 로진프라자 3층 인코딩프러스</div>
      <div>전화번호: 010-2838-2391</div>
      <div>사업자번호: 847-81-00387</div>
      <div>Copyright 2023. 인코딩플러스 Co. all rights reserved.</div>
    </div>
  </footer>)
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let files = (await getFileOrFolder(['root', 'curriculum'], 0)) as MyFile[];
  let mains = files
    .map(v => [v.name.split('.')[1], v.name])
    .reduce((a, v) => {
        let find = a.find(t => t[0] === v[0]);
        if(find){
            find.push(v[1]);
            return a;
        }
        return [...a, v];
    }, [] as string[][]);
  return (
    <html lang="en">
      <head>
        <script src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=tigdx8m9ob"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css" />
        <link rel="icon" type="image/svg+xml" href="/ico/favicon.svg" />
        <link rel="icon" type="image/png" href="/ico/favicon.png" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <Resize />
        <script src="/ga.js"></script>
      </head>
      <body className='flex flex-col'>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KR7B4LP"
            height="0"
            width="0"
            style={{
              display:"none",
              visibility:"hidden"
          }}>
          </iframe>
        </noscript>
        <Header files={mains} />
        <div className='flex flex-col flex-grow'>{children}</div>
        <Footer />
      </body>
    </html>
  )
}
