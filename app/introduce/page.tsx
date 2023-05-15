import { ContainerMain, ContainerMin } from "../body";
import { MapElement } from "./Map";
export default function Page(){
    return (<ContainerMain>
        <div className="mb-16">
            <img src="/introduce/first.svg" />
        </div>
        <ContainerMin>
            <div className="flex mb-3">
                <div className="w-2/4 text-right box-border pr-5">블라블라</div>
                <img width="50%" src="/next.svg" alt="" />
            </div>
            <div className="flex mb-3">
                <img width="50%" src="/next.svg" alt="" />
                <div className="w-2/4 text-left box-border pl-5">블라블라</div>
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