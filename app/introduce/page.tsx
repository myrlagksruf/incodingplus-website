import { ContainerMain, ContainerMin } from "../body";
import { MapElement } from "./Map";

import './introduce.scss';
export default function Page(){
    return (<ContainerMain>
        <div className="mb-16 mt-16">
            <img src="/introduce/first.svg" />
        </div>
        <ContainerMin>
            <div className="flex mb-3 introduce lg:flex-row flex-col mb-14">
                <img src="/introduce/image.png" className="lg:w-2/4" />
                <div className="lg:w-2/4 box-border pl-5">
                    <h1>코딩과 논술로 진로를 컨설팅하다</h1>
                    <h1 className="mb-8">인코딩 플러스</h1>
                    <div>미래는 기술로 세상을 주도해 나가는 사람과 통찰력으로 세상을 꿰뚫어 보는 사람의 것입니다.</div>
                    <div>창의적인 코딩 교육을 미래 기술로 세상을 설계하게 합니다.</div>
                    <div>앞서가는 논술 교육은 IT를 중심으로 세상을 바라보게 합니다.</div>
                    <div>코딩과 논술을 통해 기술과 통찰력을 갖춘 미래 인재의 시작 인코딩플러스입니다.</div>
                </div>
            </div>
            <div className="flex mb-3 introduce lg:flex-row flex-col-reverse">
                <div className="lg:w-2/4 box-border pr-5">
                    <h1>많은 능력을 요구하는 세상에서</h1>
                    <h1 className="mb-8">다양한 경험을</h1>
                    <div>딱 한가지에 전문성을 요구하던 세상은 지나가고 있습니다.</div>
                    <div>어느정도의 깊이 있는 학습과 다양한 활동, 다양한 경험을 통해서 "정보"를 먼저 가지고 움직일 수 있는 능력과 이를 "실행"하는 능력이 중요합니다.</div>
                </div>
                <img src="/introduce/second.svg" className="lg:w-2/4" />
            </div>
            <h1 className="text-center mt-16 font-bold text-4xl mb-16 leading-[2]">
                <span className="text-blue-600">자기 주도적 학습</span>과 <span className="text-[#FF4581]">자신만의 포트폴리오</span>로<br />
                미래 사회를 준비할 수 있습니다
            </h1>
            <div className="flex flex-wrap justify-center mb-10">
                <div className="grid items-center flex-grow mb-6" style={{
                    gridTemplateColumns:"100px 1fr",
                    minWidth:'450px',
                    flexBasis:'50%'
                }}>
                    <div className="pt-2 pb-2 text-right mr-6 font-medium text-gray-600">주소</div>
                    <div className="font-bold">안산시 단원구 광덕동로 41 로진프라자, 3층 인코딩플러스</div>
                    <div className="pl-4 pr-4" style={{gridColumn:'span 2'}}>
                        <div className="h-[1px] rounded bg-gray-200"></div>
                    </div>
                    <div className="pt-2 pb-2 text-right mr-6 font-medium text-gray-600">전화번호</div>
                    <div className="font-bold">010-2838-2391</div>
                    <div className="pl-4 pr-4" style={{gridColumn:'span 2'}}>
                        <div className="h-[1px] rounded bg-gray-200"></div>
                    </div>
                    <div className="pt-2 pb-2 text-right mr-6 font-medium text-gray-600">지하철</div>
                    <div className="font-medium">중앙역 도보 20분</div>
                    <div className="pl-4 pr-4" style={{gridColumn:'span 2'}}>
                        <div className="h-[1px] rounded bg-gray-200"></div>
                    </div>
                    <div className="pt-2 pb-2 text-right mr-6 font-medium text-gray-600">버스</div>
                    <div className="pt-2 pb-2 font-medium">
                        중앙역 2번출구 정류장<br />
                        77번 '폴리타운역' 하차 도보 3분<br />
                        62번, 60A번 '고잔고등학교 역' 하차 도보 5분
                    </div>
                    <div className="text-right" style={{
                        gridColumn: "2 span"
                    }}>
                        <a href="https://map.naver.com/v5/entry/place/1353598676?c=13,0,0,0,dh&placePath=%2Fhome%3Fentry=plt" target="_blank">
                            <img className="inline-block" src="/image/naver.svg" alt="" />
                        </a>
                    </div>
                </div>
                <div className="pl-4 flex-grow mb-6" style={{
                    minWidth:'450px',
                    flexBasis:'50%',
                }}>
                    <MapElement />
                </div>
            </div>
        </ContainerMin>
    </ContainerMain>);
}