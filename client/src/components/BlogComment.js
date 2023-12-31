import { useState, useEffect, useRef, memo, useContext } from 'react';
import axios from 'axios';
import AlertDismissable from './AlertDismissable';
import AlertConfirm from './AlertConfirm';
import { Form, FormControl, Button } from 'react-bootstrap';
import AuthContext from '../helpers/Authcontext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";

function BlogComment({ blog }) {
    const limits = 5;
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [alert, setAlert] = useState({});
    const [alertConfirm, setAlertConfirm] = useState({});
    const { authState } = useContext(AuthContext);
    const contentInput = useRef(null);

    useEffect(() => {
        axios.get(`/blogs/comments/${blog._id}?limits=${limits}`, {
            headers: {
                accessToken: localStorage.getItem('accessToken')
            }
        })
            .then((response) => response.data)
            .then((data) => {
                if (data.error) {
                    setAlert({
                        heading: 'Lỗi',
                        content: data.error,
                        hide: () => setAlert({})
                    })
                } else {
                    setComments(data);
                    console.log(data);
                }
            })
            .catch((error) => console.error(error));
    }, [blog._id]);


    const HandleSubmit = async (e) => {
        e.preventDefault();
        contentInput.current.value = '';
        setContent("");
        contentInput.current.focus = true;

        await axios.post(`/blogs/comments`, {
            blogId: blog._id,
            username: authState.username,
            content: content
        }, {
            headers: {
                accessToken: localStorage.getItem('accessToken'),
            }
        })
            .then(response => response.data)
            .then((data) => {
                setComments(prev => [...prev, data]);
            }).catch((error) => console.error(error));
    };

    return (
        <>
            {alert && alert.heading && <AlertDismissable {...alert} />}
            {alertConfirm && alertConfirm.heading && <AlertConfirm {...alertConfirm} />}
            <div key={blog._id} className='blog-comments'>
                <Form action='/blogs/comments' method='POST' onSubmit={HandleSubmit}>
                    <FormControl name='username' type='hidden' value={authState.username} />
                    <div className='d-flex'>
                        <FormControl ref={contentInput} name='content' placeholder='' value={content}
                            onChange={e => setContent(e.target.value)} />
                        <Button type='submit' style={{ flex: '0 0 10%' }}>
                            <FontAwesomeIcon icon={faShare} />
                        </Button>
                    </div>

                </Form>
                <ul className='list-group blog-comments__list'>
                    {comments && comments.length > 0 &&
                        comments.map((comment, index) =>
                            <li key={index} className='list-group-item blog-comments__list__item'>
                                <div className='d-flex gap-3'>
                                    <p className='blog-comments__list__item__username fw-bold'
                                        style={{ flex: '0 0 70px' }}>
                                        {comment.username}
                                    </p>
                                    <p className='blog-comments__list__item__content'>
                                        {comment.content}
                                    </p>
                                    <span style={{
                                        marginRight: 0,
                                        marginLeft: 'auto',
                                        color: 'rgb(170, 170, 170)',
                                        fontSize: '1.3rem'
                                    }}>{(new Date(comment.createAt))
                                        .toISOString().slice(0, 10)}</span>
                                </div>
                            </li>
                        )
                    }
                    {(!comments || comments.length === 0)
                        && <li className='list-group-item position-relative'>
                            <p className='text-center'>Không có comment nào</p>
                        </li>}
                </ul>
            </div>
        </>
    )
}

export default memo(BlogComment)
