import React from "react";

export interface IntroduceItemProps {
  ImgSrc: string;
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
      ImgSrc:
        "https://bucket-4cr3lx.s3.ap-northeast-2.amazonaws.com/minho.jpg",
      Name: "Min-Ho Choi",
      LinkHref1: "https://github.com/cmh9208",
      LinkHref2: "/",
      Role: "GAN, NLP, DL",
      Skill: "RestAPI, Python, AWS, Docker" ,
      Email: "Email: cwh625@gmail.com",
      Kakao: "Kakao: choiminho1",
      ImgStyle: { width: "210px", height: "280px" },
    },
  ];

  return (
    <>
      <div className="Box">
        {introduceItems.map((item, index) => (
          <div key={index}>
            <img src={item.ImgSrc} alt="profile" style={item.ImgStyle} />
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
