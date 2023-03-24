import { useRef, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

interface Chat {
  role: string;
  content: string;
}

export default function ChatbotModel() {
  const [url, setUrl] = useState<string>('https://bucket-4cr3lx.s3.ap-northeast-2.amazonaws.com/');
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const videoElement = useRef<HTMLVideoElement>(null);

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const playVideo = () => {
    if (videoElement.current) {
      videoElement.current.currentTime = 0;
      videoElement.current.play();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await axios.post('http://api.choiminho.co.kr/gpt', { user_content: userInput });
    const gptResponse = res.data.response;
    const newChat = { role: 'user', content: userInput };
    const newGptResponse = { role: 'assistant', content: gptResponse };
    setChatHistory((prevChatHistory: Chat[]) => [
      ...prevChatHistory,
      newChat,
      newGptResponse,
    ]);
    setUserInput('');
    if (chatHistory.length === 0) {
      playVideo();
    }
  };

  return (
    <>
      <Head>
        <title>Chatbot Page</title>
      </Head>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <td style={{ textAlign: 'center' }}>
          <h1>준비 중입니다.</h1>
          <video ref={videoElement} src={`${url}fake_ss.jpg.mp4`} style={{ width: 300 }} loop muted />
          <table>
            {chatHistory.map((chat, index) => (
              <div key={index}>
                {chat.role === 'user' ? (
                  <div>
                    <span>You: </span>
                    {chat.content}
                  </div>
                ) : (
                  <div>
                    <span>Chatbot: </span>
                    {chat.content}
                  </div>
                )}
              </div>
            ))}
          </table>
          <br />
          <br />
          <br />
          <form onSubmit={handleSubmit}>
            <input type="text" value={userInput} onChange={handleUserInput} />
            <button type="submit">Send</button>
          </form>
        </td>
      </div>
    </>
  );
}
