import "../Assets/SCSS/blogSingle.scss";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import AlertDismissible from "../components/AlertDismissable";
import CurrentPageContext from "../helpers/CurrentPageContext";
import BlogComment from "../components/BlogComment";

export default function BlogSingle(props) {
  const [blog, setBlog] = useState({});
  const [alert, setAlert] = useState({});

  const blogId = useParams().id;
  let navigate = useNavigate();

  const { setPageState } = useContext(CurrentPageContext);
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

  return (
    <React.Fragment>
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
            <div>
              {blog && blog.title && (
                <h1 className="heading">{blog.title}</h1>
              )}
            </div>
            <p className="opacity-50">Author:
              <Link
                to={`/account/${blog.username}`}
                style={{ marginLeft: "1rem" }}
              >
                {blog.username || blog.userId}
              </Link>
            </p>
            <p style={{ whiteSpace: "pre-line" }}>{blog.detail}</p>
          </Col>
        </Row>
        <Row>
          <div>
            <BlogComment blog={blog} limits={10} />
          </div>
        </Row>
      </Container>
      {alert && alert.heading && <AlertDismissible {...alert} />}
    </React.Fragment>
  );
}
