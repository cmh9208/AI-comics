// import axios from 'axios';
// import { useState, ChangeEvent, FormEvent } from 'react';
// import Head from 'next/head';

// interface Chat {
//   role: string;
//   content: string;
// }

// export default function ChatbotModel() {
//   const [userInput, setUserInput] = useState('');
//   const [chatHistory, setChatHistory] = useState<Chat[]>([]);

//   const handleUserInput = (e: ChangeEvent<HTMLInputElement>) => {
//     setUserInput(e.target.value);
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const res = await axios.post('http://localhost:8000/gpt', { user_content: userInput });
//     const gptResponse = res.data.response;
//     const newChat = { role: 'user', content: userInput };
//     const newGptResponse = { role: 'assistant', content: gptResponse };
//     setChatHistory((prevChatHistory: Chat[]) => [
//       ...prevChatHistory,
//       newChat,
//       newGptResponse,
//     ]);
//     setUserInput('');
//   };

//   return (
//     <>
//       <Head>
//         <title>Chatbot Page</title>
//       </Head>
//       <div>
//         {chatHistory.map((chat, index) => (
//           <div key={index}>
//             {chat.role === 'user' ? (
//               <div>
//                 <span>You: </span>
//                 {chat.content}
//               </div>
//             ) : (
//               <div>
//                 <span>Chatbot: </span>
//                 {chat.content}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       <form onSubmit={handleSubmit}>
//         <input type="text" value={userInput} onChange={handleUserInput} />
//         <button type="submit">Send</button>
//       </form>
//     </>
//   );
// }
