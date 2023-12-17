import React, {
    useEffect, useLayoutEffect,
    useState, useContext, useRef
} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col, FormControl, Form, Button } from "react-bootstrap";
import ReactPlayer from "react-player";
import "../Assets/SCSS/blogSingle.scss";
import { useNavigate } from "react-router-dom";
import AlertDismissible from "../components/AlertDismissable";
import CurrentPageContext from "../helpers/CurrentPageContext";
import AlertConfirm from "../components/AlertConfirm";
const MIN_TEXTAREA_HEIGHT = 500;

export default function BlogEdit(props) {
    const [blog, setBlog] = useState({});

    const [alert, setAlert] = useState({});
    const [alertConfirm, setAlertConfirm] = useState({});

    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('');

    const blogId = useParams().id;
    const navigate = useNavigate();

    const { setPageState } = useContext(CurrentPageContext);

    const form = useRef(null);

    useEffect(() => setPageState("blogs"), [setPageState]);

    useEffect(() => {
        // console.log("params", blogId);
        axios
            .get(`/blogs/single/${blogId}`, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            })
            .then((response) => {
                if (response.data.error) {
                    setAlert({
                        type: "danger",
                        heading: "Login",
                        content: "Bạn phải đăng nhập để xem",
                        hide: () => {
                            setAlert({});
                            navigate("/login");
                        },
                    });
                } else {
                    setBlog(response.data);
                }
            })
            .catch((err) => console.log(err));
    }, [blogId, navigate]);

    useEffect(() => {
        setTitle(blog.title);
        setDetail(blog.detail);
    }, [blog]);

    const textareaRef = React.useRef(null);

    useLayoutEffect(() => {
        // Reset height - important to shrink on delete
        textareaRef.current.style.height = "inherit";
        // Set height
        textareaRef.current.style.height = `${Math.max(
            textareaRef.current.scrollHeight,
            MIN_TEXTAREA_HEIGHT
        )}px`;
    }, [detail]);

    const HandleSubmit = (e) => {
        e.preventDefault();

        setAlertConfirm({
            heading: "Thông báo",
            content: "Bạn có chắc muốn lưu thay đổi?",
            type: 'info',
            accept: async () => {
                try {
                    await axios.post(
                        `/blogs/edit/${blog._id}`, { id: blog._id, title, detail },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                accessToken: localStorage.getItem("accessToken")
                            }
                        })
                        .then((response) => response.data)
                        .then((data) => {
                            if (data.error) {
                                setAlertConfirm({});
                                setAlert({
                                    heading: 'Lỗi',
                                    content: data.error.message,
                                    type: 'error',
                                    hide: () => {
                                        setAlert({});
                                    }
                                })
                            } else {
                                setAlertConfirm({});
                                setAlert({
                                    heading: 'Thông báo',
                                    content: 'Lưu thông tin thành công',
                                    type: 'success',
                                    hide: () => {
                                        setAlert({});
                                    }
                                })
                            }
                        }).catch((err) => {
                            console.error(err.message);
                        });
                } catch (error) {
                    console.log(error.message);
                }
            },
            cancel: () => {
                setAlertConfirm({});
            },
        });
    }
    return (
        <React.Fragment>
            {alert && alert.heading && <AlertDismissible {...alert} />}
            {alertConfirm
                && alertConfirm.heading
                && <AlertConfirm {...alertConfirm} />}
            <Container
                className="blog-single-container"
                style={{ minHeight: 50 + "vh" }}
            >
                <Row>
                    <Col md={4} className="media">
                        {blog.files &&
                            blog.files.length &&
                            blog.files.map((file) => (
                                <div key={file.filename}>
                                    {file.mimetype.indexOf("video") !== -1 ? (
                                        <div className="video-section">
                                            <ReactPlayer
                                                url={`/blogs/${file.filename}`}
                                                width="100%"
                                                height="auto"
                                                playing={false}
                                                controls={true}
                                            />
                                        </div>
                                    ) : (
                                        <div className="thumbnail h-100 d-flex justify-content-center align-items-center">
                                            <img
                                                src={`/blogs/${file.filename}`}
                                                alt="SFIT"
                                                width={100 + "%"}
                                                height={100 + "%"}
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                    </Col>
                    <Col>
                        <Form ref={form}
                            action={`/blogs/edit/${blog._id}`}
                            method="POST" onSubmit={HandleSubmit}>
                            <div>
                                {blog && blog.title && (
                                    <FormControl id="title" name="title"
                                        className="heading text-white"
                                        style={{ fontSize: '2.5rem', width: '100%' }}
                                        value={title} onChange={e => setTitle(e.target.value)} />
                                )}
                            </div>
                            <p className="opacity-50 my-2">Author:
                                <a
                                    href={`/account/${blog.username}`}
                                    style={{ marginLeft: "1rem" }}
                                >
                                    {blog.username || blog.userId}
                                </a>
                            </p>
                            <textarea
                                ref={textareaRef}
                                as='textarea'
                                name="detail"
                                style={{
                                    width: '100%',
                                    minHeight: MIN_TEXTAREA_HEIGHT,
                                    resize: "none"
                                }}
                                value={detail}
                                onChange={e => setDetail(e.target.value)} />
                            <Button type="submit"
                                className="custom-btn">
                                Save
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
            {alert && alert.heading && <AlertDismissible {...alert} />}
        </React.Fragment>
    );
}
