import React from "react";
import Image from 'next/image';

import minho from "@/public/minho.png"
export interface IntroduceItemProps {
  Name: string;
  LinkHref1: string;
  LinkHref2: string;
  Role: string;
  Skill: string;
  Email: string;
  Kakao: string;
  ImgStyle?: React.CSSProperties;
}

const Introduce: React.FC = () => {
  const introduceItems: IntroduceItemProps[] = [
    {
      Name: "Min-Ho Choi",
      LinkHref1: "https://github.com/cmh9208",
      LinkHref2: "/",
      Role: "GAN, NLP, DL",
      Skill: "RestAPI, Python, AWS, Docker" ,
      Email: "Email: cwh625@gmail.com",
      Kakao: "Kakao: choiminho1",
      ImgStyle: { width: "413px", height: "531px" },
    },
  ];

  return (
    <>
    
      <div className="Box">
      
        {introduceItems.map((item, index) => (
          <div key={index}>
            
            <Image src={minho} alt="MINHO" width={207} height={266} />
            <h2>{item.Name}</h2>
            <div className="Role">
              <a href={item.LinkHref1}>{item.Role}</a>
            </div>
            <p>{item.Skill}</p>
            <p>{item.Email}</p>
            <p>{item.Kakao}</p>
            <a href={item.LinkHref2}>more</a>
          </div>
        ))}
      </div>
      <style jsx>{`
        .Box {
          display: flex;
          justify-content: space-around;
        }
        div {
          text-align: center;
        }
        .Role {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        a {
          margin: 10px;
        }
      `}</style>
    </>
  );
};

export default Introduce;
