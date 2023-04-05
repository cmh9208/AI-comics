import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Face from './GanFace';

interface Chat {
  role: string;
  content: string;
}

export default function ChatbotModel() {
  const [url, setUrl] = useState<string>('https://bucket-4cr3lx.s3.ap-northeast-2.amazonaws.com/');
  const [userInput, setUserInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [videoFinished, setVideoFinished] = useState<boolean>(false);
  const [videoSrc, setVideoSrc] = useState<string>('');
  const videoElement = useRef<HTMLVideoElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const playVideo = () => {
    if (videoElement.current) {
      const playPromise = videoElement.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setTimeout(() => {
              videoElement.current?.pause();
              setVideoFinished(true);
            }, 3500);
          })
          .catch((error) => {
            console.error('Failed to play video:', error);
          });
      }
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoSrc(URL.createObjectURL(file));
      setVideoFinished(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await axios.post('http://api.choiminho.co.kr/gpt', { user_content: userInput });
    const gptResponse = res.data.response;
    const newChat = { role: 'user', content: userInput };
    setChatHistory((prevChatHistory: Chat[]) => [...prevChatHistory, newChat]);
  
    const loadingChat = { role: 'assistant', content: '답변이 작성하는 중입니다.' };
    setChatHistory((prevChatHistory: Chat[]) => [...prevChatHistory, loadingChat]);
  
    setUserInput('');
    if (chatHistory.length === 0) {
      setVideoFinished(false);
      playVideo();
    } else {
      if (videoFinished) {
        setVideoFinished(false);
        playVideo();
      }
    }
  
    const newGptResponse = { role: 'assistant', content: gptResponse };
    setTimeout(() => {
      setChatHistory((prevChatHistory: Chat[]) => [...prevChatHistory.slice(0, -1), newGptResponse]);
    }, 0);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (videoSrc) {
      setVideoFinished(false);
      setUrl(videoSrc);
      playVideo();
    }
  }, [videoSrc]);

  return (
    <> 
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 800, boxShadow: '0 0 5px 5px rgba(200, 180, 230)'}}>
        <table>
          <tbody>
            <tr>
              <td style={{ width: 500, border: '1px solid black'}}>
                <div ref={chatBoxRef} style={{ height: 625, overflow: 'auto'}}>
                <h4>1. 챗봇의 답변은 문장 길이에 따라 대기 시간이 있을 수 있습니다.</h4>
                <h4>2. 내 아바타가 없어도 대화를 시도할 수 있습니다.</h4>
                <h4>4. 파일 선택은 영상 파일만 가능합니다.</h4>
                <h4>3. 아래의 이모티콘을 복사, 붙여넣기 하여 대화할 수 있습니다.</h4>
                <h4>3. 아바타가 움직이지 않는다면 새로고침 후 다시 시도해 주세요.</h4>
                <br/>
                <h5>이모티콘</h5>
                😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚☺🙂🤗🤩🤔🤨😐😑😶🙄😏
                😣😥😮🤐😯😪😫😴😛😜😝🤤😒😓😔😕🙃🤑😲☹🙁😖😞😟😤😢😭😦😧
                😨😩🤯😬😰😱🥵🥶😳🤪😵😡😠🤬😷🤒🤕🤢🤮🤧😇🤠🥳🥴🥺🤥🤫🤭🧐🤓😈
                <br/><br/>
                🍇🍈🍉🍊🍋🍌🍍🥭🍎🍏🍑🍒🍓🥝🍅🥥🥑🍆🥔🥕🌽🌶🥒🥦🍄🌰🍞🥐🥖🥯🥞
                🧀🍖🍗🥩🥓🍔🍟🍕🌭🥪🌮🌯🥙🍳🥘🍲🥣🥗🍿🧂🥫🍱🍘🍙🍚🍛🍜🍝🍠🍣🍤🍥🥮
                🥟🥠🥡🍦🍧🍨🍩🍪🎂🍰🧁🥧🍫🍬🍭🍮🍯☕🍵🍶🍾🍷🍸🍹🍺🥂🥃🥤

                ⚠🚸⛔🚫🚳🚭🚯🚱🚷📵🔞☢☣🏧🚮♿🚹🚺🚻🚼🚾🛂🛃🛄🛅
                </div>
              </td>

              <td style={{ width: 30}}></td>

              <td style={{ textAlign: 'center' }}>
                <br/><h1>GPT - 3.5</h1><br/>
                <video ref={videoElement} src={url} style={{ width: 400}} loop muted />
                <h5>내 아바타와 대화해 보세요!</h5>
                <form onSubmit={handleSubmit}>
                  <input style={{ width: 400, height: 30}} type="text" value={userInput} onChange={handleUserInput} />
                  <br/>
                  <button style={{
                      backgroundColor: "rgb(200, 180, 230)",
                      color: "white",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                      textDecoration: "none",
                      width: 400
                    }} type="submit">Send</button>
                </form>
                <br />
                <p>위에서 다운받은 mp4 영상을 선택해 주세요</p>
                <input style={{
                      backgroundColor: "rgb(200, 180, 230)",
                      color: "white",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                      textDecoration: "none",
                      width: 400
                    }}type="file" accept="video/mp4" onChange={handleVideoUpload} />
              </td>

              <td style={{ width: 30}}></td>
              
              <td style={{ width: 500, border: '1px solid black'}}>
                <div ref={chatBoxRef} style={{ height: 625, overflow: 'auto'}}>
                  {chatHistory.map((chat, index) => (
                    <div key={index} style={{ color: chat.role === 'user' ? '#FF6600' : 'black' }}>
                      {chat.role === 'user' ? (
                        <div>
                          <span><h3 style={{textAlign: 'center'}}>USER</h3><br/> </span>
                          {chat.content}
                        </div>
                      ) : (
                        <div style={{background: 'rgba(10, 50, 50, 0.05)'}}>
                          <span><h3 style={{textAlign: 'center'}}>GPT</h3><br/> </span>
                          {chat.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}