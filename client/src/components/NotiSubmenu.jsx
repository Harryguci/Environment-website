import { useState, useEffect, memo, useRef } from 'react';
import axios from 'axios';
import '../Assets/SCSS/components/notisubmenu.scss';
import { Link } from 'react-router-dom';

function NotiSubmenu({ visible }) {
    const notiElem = useRef(null);
    const [notiData, setNotiData] = useState([])
    const [isFetch, setIsFetch] = useState(true);

    useEffect(() => {
        var url = `/notification`;
        axios.get(url, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        })
            .then(response => response.data)
            .then(response => {
                setNotiData(response);
                setIsFetch(false);
            })
            .catch(error => window.alert(JSON(error)));
    }, []);

    useEffect(() => {
        if (visible) {
            notiElem.current.classList.add('active');
            axios.put('/notification', {
                type: 'seen',
            },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    }
                })
                .then(response => response.data)
                .then(data => console.log(data))
                .catch(error => console.log(error));
        }
        else {
            notiElem.current.classList.remove('active');
        }
    }, [visible])

    return (
        <div ref={notiElem} className='noti-submenu'>
            <ul className='list-group'>
                {isFetch &&
                    <>
                        <li className='list-group-item item-loading'></li>
                        <li className='list-group-item item-loading'></li>
                        <li className='list-group-item item-loading'></li>
                    </>
                }
                {
                    notiData.length > 0 &&
                    <>
                        {notiData.map((noti, index) =>
                            <li key={index} className='list-group-item'>
                                <Link className='list-group-link' to={noti.link}>
                                    <div dangerouslySetInnerHTML={{ __html: noti.content }} />
                                </Link>
                            </li>)}
                    </>
                }
                {
                    !isFetch && notiData.length === 0
                    && <h3 className='fw-bold opacity-50'
                        style={{ width: 'max-content' }}>
                        Chưa có thông báo nào
                    </h3>
                }
            </ul>
        </div>
    )
}

export default memo(NotiSubmenu)
