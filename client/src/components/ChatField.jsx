import { memo, useCallback, useState } from "react";
import ChatBubble from "./ChatBubble.jsx";
import ChatCard from "./ChatCard.jsx";

function ChatField() {
    const [showChatCards, setShowChatCards] = useState(false);
    const [chats, setChats] = useState([
        {
            id: 1,
            usename: 'harryguci',
            status: 'online',
        },
        {
            id: 2,
            usename: 'ngocanh',
            status: 'online',
        },
        {
            id: 3,
            usename: 'qhuy',
            status: 'online',
        }
    ]);

    const CloseChat = useCallback((id) => {
        setChats(prev => {
            prev = prev.filter(element => element.id !== id);
            return prev;
        });
    }, []);



    return (
        <>
            {showChatCards &&
                <div className="chat-container d-flex"
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        right: '5rem',
                        zIndex: 100,
                        gap: '5px'
                    }}>
                    {chats && chats.length > 0 && chats.map(chat => <ChatCard key={chat.id} info={chat} Close={CloseChat} />)}
                </div>}

            <ChatBubble zIndex='101' Toggle={setShowChatCards} />
        </>
    )
}

export default memo(ChatField)
