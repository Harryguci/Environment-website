import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import ReactPlayer from "react-player";
import "../Assets/SCSS/blogSingle.scss";
import ActiveNavLink from "../helpers/ActiveNavLink";
import { useNavigate } from "react-router-dom";
import AlertDismissible from "../components/AlertDismissable";
export default function BlogSingle(props) {
  const [blog, setBlog] = useState({});
  const [alert, setAlert] = useState({});

  const blogId = useParams().id;
  let navigate = useNavigate();
  useEffect(() => {
    ActiveNavLink("blogs");
  }, []);

  useEffect(() => {
    console.log("params", blogId);
    axios
      .get(`http://localhost:3001/blogs/single/${blogId}`, {
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
          // console.log(response.data);
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
                        url={`http://localhost:3001/blogs/${file.filename}`}
                        width="100%"
                        height="auto"
                        playing={false}
                        controls={true}
                      />
                    </div>
                  ) : (
                    <div className="thumbnail h-100 d-flex justify-content-center align-items-center">
                      <img
                        src={`http://localhost:3001/blogs/${file.filename}`}
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
                <h1 className="heading">{blog.title.substring(0, 50)}...</h1>
              )}
            </div>
            <p className="opacity-50">Author:
              <a
                href={`/account?user=${blog.username}`}
                style={{ marginLeft: "1rem" }}
              >
                {blog.username || blog.userId}
              </a></p>
            <p style={{ whiteSpace: "pre-line" }}>{blog.detail}</p>
          </Col>
        </Row>
      </Container>
      {alert && alert.heading && <AlertDismissible {...alert} />}
    </React.Fragment>
  );
}
