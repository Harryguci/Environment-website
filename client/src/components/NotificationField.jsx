import { useCallback, useContext, useEffect, useState } from "react";
import '../Assets/SCSS/components/notificationField.scss';
import Notification from "./Notification";
import NotificationContext from "../helpers/NotificationContext";

export function BtnAddNoti() {
    const { setNotificationState } = useContext(NotificationContext);
    const HandleClick = () => {
        setNotificationState(prev => [...prev,
        {
            id: prev.length === 0 ? 1 : prev[prev.length - 1].id + 1,
            title: 'hello',
            contentText: 'my name is harryguci' + prev.length,
            timer: '30-01-2023',
            visible: 'true'
        }]);
    }

    return (
        <button className="btn" onClick={HandleClick}>Create</button>
    )
}

function NotificationField() {
    const { notificationState, setNotificationState } = useContext(NotificationContext);
    const [noti, setNoti] = useState(notificationState);

    useEffect(() => { setNoti([...notificationState]) }, [notificationState])

    const HandleClick = () => {
        setNoti(prev => [...prev,
        {
            id: prev.length === 0 ? 1 : prev[prev.length - 1].id + 1,
            title: 'hello',
            contentText: 'my name is harryguci' + prev.length,
            timer: '30-01-2023',
            visible: 'true'
        }]);
    }

    const CloseOne = useCallback((id) => {
        setNoti(prev => {
            const index = prev.findIndex(item => item.id == id);
            if (index >= 0) {
                prev[index].visible = false;
            }

            return [...prev];
        });
    }, []);

    return (
        <>
            <div className="notification-field">
                {noti && noti.length > 0
                    && noti.map(item =>
                        item.visible && <Notification key={item.id}
                            notification={item}
                            close={CloseOne} />)}
            </div>
        </>
    )
}

export default NotificationField;
