import React, { useState, useEffect, useRef } from "react";

interface Props {
  userResponse: string;
  botResponse: {
    purpose: string;
    message?: string;
    options?: string[];
    sender: string;
  };
  sendUserResponse: string;
  optionClick: (ev: React.MouseEvent<HTMLElement>) => void;
}

interface MessagesInfo {
  purpose?: string;
  message?: string;
  options?: string[];
  sender: string;
}

const Chats: React.FC<Props> = props => {
    const [messages, setMessages] = useState<MessagesInfo[]>([]);
    const dummyRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);

  // stacking up messages
    useEffect(() => {
        if (messages.length === 0) {
        setMessages([
            {
            purpose: "introduction",
            message:
                "저는 미봇이에요 당신의 이야기를 들려주세요.",
            sender: "bot"
            }
        ]);
        } else {
        let tempArray = [...messages];
        tempArray.push({ message: props.sendUserResponse, sender: "user" });
        setMessages(tempArray);

        setTimeout(() => {
            let temp2 = [...tempArray];
            temp2.push(props.botResponse);
            setMessages(temp2);
        }, 1000);
        }
    }, [props.sendUserResponse, props.botResponse]);

    // enable autoscroll after each message
    useEffect(() => {
        if (dummyRef && dummyRef.current && bodyRef && bodyRef.current) {
        bodyRef.current.scrollTo({
            top: dummyRef.current.offsetTop,
            behavior: "smooth"
        });
        }
    }, [messages]);

    return (
        <div className="message-container" ref={bodyRef}>
        {messages.map(chat => (
            <div key={chat.message}>
            <div className={`message ${chat.sender}`}>
                <p>{chat.message}</p>
            </div>
            {chat.options ? (
                <div className="options">
                <div>
                    <i className="pointer"></i>
                </div>
                {chat.options.map(option => (
                    <p
                    onClick={e => props.optionClick(e)}
                    data-id={option}
                    key={option}
                    >
                    {option}
                    </p>
                ))}
                </div>
            ) : null}
            <div ref={dummyRef} className="dummy-div"></div>
            </div>
        ))}
        <style jsx>{`
            .bot {
                background: #393e46;
                color: #f7f7f7;
                align-self: flex-start;
            }
            .user {
                background: #dfdfe5;
                color: #393e46;
                align-self: flex-end;
            }
            .message-container {
                overflow-y: scroll;
                margin-bottom: 2em;
            }
            .message-container div {
                display: flex;
                flex-direction: column;
            }
            .message {
                max-width: 1000px;
                padding: $standard-padding;
                border-radius: $bubble-border-radius;
                overflow-wrap: break-word;
            }
            .options {
                background: white;
                display: flex;
                align-items: center;
            }
            .options div:first-child {
                font-size: 1.3em;
                margin: 0.7em 0.7em 0.9em 0.3em;
                transform: rotate(90deg);
            }
            .pointer {
                color: #393e46;
                animation: arrow-move 1.2s infinite;
            
            }
            @keyframes arrow-move {
                0% {
                    transform: translateY(4px);
                }
                50% {
                    transform: translateY(0);
                }
                100% {
                    transform: translateY(4px);
                }
            }
            p {
                padding: $standard-padding;
                margin-right: 10em;
            }
            p .bot {
                background: #393e46;
                color: #f7f7f7;
                align-self: flex-start;
                border-radius: $bubble-border-radius;
            }
            .dummy-div {
                padding: 0.5em 0;
            }
        `}</style>
        </div>
    );
    };

export default Chats;