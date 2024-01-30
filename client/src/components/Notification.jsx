import { memo, useRef } from 'react';
import '../Assets/SCSS/components/notification.scss';

function Notification({ close, notification }, key) {
    const HandleClose = (e) => {
        if (typeof close === 'function') {
            close(notification.id);
        }
    };

    return (
        <div key={key} className="notification">
            <div className="notification-header">
                <h3 className="notification-title">{notification.title}</h3>
                <button className='btn notification-close' onClick={HandleClose}>X</button>
            </div>
            <div className="notification-container">
                <div className="notification-media">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
                        alt="" className="notification-user-avatar" />
                    <i className="fa fa-thumbs-up notification-reaction"></i>
                </div>
                <div className="notification-content">
                    <p className="notification-text">
                        {notification.contentText}
                    </p>
                    <span className="notification-timer">{notification.timer}</span>
                </div>
                <span className="notification-status"></span>

            </div>
        </div>
    )
}


export default memo(Notification);
