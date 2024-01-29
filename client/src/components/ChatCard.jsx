import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faVideo, faXmark, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import '../Assets/SCSS/components/chatCard.scss';
import { FormControl } from 'react-bootstrap';

function ChatCard({ Close, info }, props) {

    return (
        <>
            <div key={props.key} className="chat-card">
                <div className="chat-card__header">
                    <div>
                        <button type="button" className="btn text-white" onClick={() => Close(info.id)}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <div className="chat-card__info">
                        <div className="chat-card__avatar">
                            <img src="/user.jpg" alt="" />
                        </div>
                        <div className="chat-card__info__user">
                            <p className="username">{info.usename}</p>
                            <small className="status" style={{ fontSize: '1.2rem' }}>{info.status}</small>
                        </div>
                    </div>

                    <div className="chat-card__contact">
                        <button type="button" className="btn d-block">
                            <FontAwesomeIcon icon={faPhone} />
                        </button>
                        <button type="button" className="btn d-block">
                            <FontAwesomeIcon icon={faVideo} />
                        </button>
                    </div>
                </div>
                <div className="chat-card__content"></div>
                <div className="chat-card__footer d-flex">
                    <FormControl type="text" style={{ border: 'none' }} placeholder="something..." />
                    <button type="button" className="btn send-message-btn">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </>
    )
}

export default memo(ChatCard);
