import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import FormBlog from "../components/FormBlog";
import "../Assets/SCSS/account.scss";

export default function Account({ props }) {
  const [user, setUser] = useState({});
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/account", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) console.log("Can not get user information");
        else
          setUser({
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
          });
      });
  }, []);

  useEffect(() => {
    if (user.id)
      axios
        .get(`http://localhost:3001/blogs/user/${user.id}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          if (response.data.error) console.log("Can not get user information");
          else setBlogs(response.data);
        })
        .catch((error) => console.log("Can not get Blogs", error));
  }, [user]);

  return (
    <Container className="account-container">
      <Row>
        <Col xl={4}>
          <div className="user-container mb-5">
            <h2>Thông Tin</h2>
            {user && (
              <ul className="list-group mt-5">
                <li className="list-group-item active">
                  <b className="mx-3">ID</b>
                  {user.id}
                </li>
                <li className="list-group-item">
                  <b className="mx-3">Username</b>
                  {user.username}
                </li>
                <li className="list-group-item disabled">
                  <b className="mx-3">Email</b>
                  {user.email}
                </li>
              </ul>
            )}
          </div>
        </Col>
        <Col xl={8}>
          <div className="mb-5">
            <h2>Đăng Blog mới</h2>
            <FormBlog />
          </div>
          <div className="user-blog-container">
            <h2>Blogs</h2>
            {blogs && blogs.length ? (
              <ul className="list-group list-group-numbered mt-5">
                {blogs.map((blog) => (
                  <li key={blog._id} className="list-group-item">
                    <h3>{blog.title}</h3>
                    <p>{blog.description}</p>
                    <div className="d-flex">
                      {blog.files &&
                        blog.files.length &&
                        blog.files.map((file) => (
                          <div key={file.filename}>
                            {file.mimetype.indexOf("video") !== -1 ? (
                              <video
                                src={`http://localhost:3001/blogs/${file.filename}`}
                              />
                            ) : (
                              <div className="thumbnail h-100 d-flex justify-content-center align-items-center">
                                <img
                                  src={`http://localhost:3001/blogs/${file.filename}`}
                                  alt="SFIT"
                                  width={100 + "%"}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <h3
                  className="text-center p-4 rounded-2"
                  style={{ background: "rgb(220, 255, 220)" }}
                >
                  Bạn chưa đăng blog nào
                </h3>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
