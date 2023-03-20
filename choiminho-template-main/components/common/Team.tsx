
import React from "react";
import IntroduceItem from "./IntroItem";

const Introduce: React.FC = () => {
    return (
    <>
        <section className="text-gray-600 body-font">
                
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col w-full mb-20 text-center">
                    <h1 className="mb-4 text-2xl font-medium tracking-widest text-gray-900 title-font">
                        TEAM mibot</h1>
                    <p className="mx-auto text-base leading-relaxed lg:w-2/3">
                        GAN, 챗봇 등의 기술을 사용해 아바타 음성채팅 봇을 구현했습니다.</p>
                </div>
                <div className="Box">
                    <IntroduceItem 
                        ImgSrc={"/team/WonJong.png"} 
                        Name={"Won-Jong Jang"}
                        LinkHref1={"https://github.com/JangWonJong"} 
                        LinkHref2={"/"} 
                        Role={"Front/Back-end Developer"} 
                        Role2={"PO, 화면 및 서버 구현"} 
                        Skill={"TypeScript, Next.js, React.js, Spring"} 
                        Email={"jwj96895@gmail.com"} />
                    <IntroduceItem 
                        ImgSrc={"https://avatars.githubusercontent.com/u/97998445?v=4"} 
                        Name={"Min-Hye Sim"}
                        LinkHref1={"https://github.com/MinhyeSim"} 
                        LinkHref2={"/"} 
                        Role={"AI Developer"} 
                        Role2={"챗봇(자연어 처리), 음성인식(STT/TTS)"} 
                        Skill={"NLP, Python"} 
                        Email={"smine0032@gmail.com"} />
                    <IntroduceItem 
                        ImgSrc={"https://avatars.githubusercontent.com/u/97998407?v=4"} 
                        Name={"Ji-Hye Kim"}
                        LinkHref1={"https://github.com/codejihyekim"} 
                        LinkHref2={"/"} 
                        Role={"AI Developer"} 
                        Role2={"챗봇(자연어 처리)"} 
                        Skill={"NLP, Python"} 
                        Email={"wlgp03090@gmail.com"} />
                    <IntroduceItem 
                        ImgSrc={"https://avatars.githubusercontent.com/u/97512602?v=4"} 
                        Name={"Gun-Il Choi"}
                        LinkHref1={"https://github.com/nengcham"} 
                        LinkHref2={"/"} 
                        Role={"AI Developer"} 
                        Role2={"GAN을 통한 가상휴먼 캐릭터 생성"} 
                        Skill={"GAN, Python"} 
                        Email={"cgi0104@gmail.com"} />
                </div>
            </div>
        </section>
        <style jsx>{`
         .Box {
            display: flex;
            justify-content: space-around;
         }
        `}</style>
    </>
    )
}

export default Introduce