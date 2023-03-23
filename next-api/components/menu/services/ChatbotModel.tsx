import axios from 'axios';
import { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';

interface Chat {
  role: string;
  content: string;
}

export default function ChatbotModel() {
  const [url, setUrl] = useState<string>("https://bucket-4cr3lx.s3.ap-northeast-2.amazonaws.com/")

  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);

  const handleUserInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await axios.post('http://0.0.0.0:8000/gpt', { user_content: userInput });
    const gptResponse = res.data.response;
    const newChat = { role: 'user', content: userInput };
    const newGptResponse = { role: 'assistant', content: gptResponse };
    setChatHistory((prevChatHistory: Chat[]) => [
      ...prevChatHistory,
      newChat,
      newGptResponse,
    ]);
    setUserInput('');
  };

  return (
    <>
      <Head>
        <title>Chatbot Page</title>
      </Head>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <td style={{ textAlign: 'center' }}>
        <h1>준비 중입니다.</h1>
            <video style={{width: 300}}  controls>
                <source src={`${url}fake_ss.jpg.mp4` } type="video/mp4" />
            </video>

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

            <br/>          
            <br/> 
            <br/>    

            <form onSubmit={handleSubmit}>
                <input type="text" value={userInput} onChange={handleUserInput} />
                <button type="submit">Send</button>
            </form>
        </td>
      </div>

    </>
  );
}
