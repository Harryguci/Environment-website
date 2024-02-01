import { faCaretDown, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useState } from "react";
import '../Assets/SCSS/components/chatBubble.scss';

function ChatBubble({ Toggle }, props) {
    const [type, setType] = useState('off');

    const HandleClick = (e) => {
        setType(prev => prev === 'off' ? 'on' : 'off');
        if (Toggle) {
            console.log(Toggle);
            Toggle(prev => !prev)
        }
    }

    return (
        <>
            <div className="chat-bubble"
                onClick={HandleClick}
                style={{ zIndex: props.zIndex || '100' }}>
                {type === 'off' && <FontAwesomeIcon icon={faComment} />}
                {type === 'on' && <FontAwesomeIcon icon={faCaretDown} />}
            </div>
        </>
    )
}

export default memo(ChatBubble);
