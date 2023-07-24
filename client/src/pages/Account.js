import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";

import FormBlog from "../components/FormBlog";
import FormProduct from "../components/FormProduct";

import "../Assets/SCSS/account.scss";
import ReactPlayer from "react-player";
import AuthContext from "../helpers/Authcontext";
import { useNavigate } from "react-router-dom";

export default function Account({ props }) {
  const [slugState, setSlugState] = useState("");
  const { authState } = useContext(AuthContext);

  const [currentTab, setCurrentTab] = useState("blogs");

  const [user, setUser] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [products, setProducts] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    var url = window.location.href;
    if (url.indexOf("user=") !== -1) {
      var slug = url.substring(url.indexOf("user=")).split("=")[1];
      if (slug && authState.username === slug) setSlugState("");
      else setSlugState(slug);
    }
  }, [authState.username]);

  useLayoutEffect(() => {
    if (slugState) {
      axios
        .get(`http://localhost:3001/account/${slugState}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          if (response.data.error) {
            alert("Bạn phải đăng nhập để truy cập trang web này");
            navigate("http://localhost:3000/login");
          } else
            setUser({
              id: response.data.id,
              username: response.data.username,
              email: response.data.email,
            });
        });
    } else {
      axios
        .get("http://localhost:3001/account", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          if (response.data.error) {
            alert("Bạn phải đăng nhập để truy cập trang web này");
            navigate("/login");
          } else
            setUser({
              id: response.data.id,
              username: response.data.username,
              email: response.data.email,
            });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugState]);

  useEffect(() => {
    if (user.id) {
      // [GET] blogs
      axios
        .get(`http://localhost:3001/blogs/user/${user.id}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          if (response.data.error) console.log("Can not get blogs");
          else setBlogs(response.data.reverse());
        })
        .catch((error) => console.log("Can not get Blogs", error));

      // [GET] products
      axios
        .get(`http://localhost:3001/products/user/${user.id}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          if (response.data.error) console.log("Can not get products");
          else setProducts(response.data.reverse());
        })
        .catch((error) => console.log("Can not get Products", error));
    }
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
        {(currentTab === "blogs" && (
          <Col xl={8}>
            {!slugState && (
              <div className="mb-5">
                <h2>Đăng Blog mới</h2>
                <FormBlog />
              </div>
            )}
            <div className="user-blog-container">
              <div className="d-flex gap-5">
                <ButtonGroup className="d-flex col-12 col-md-6">
                  <h2
                    className="fs-3 btn m-0 p-0 d-flex justify-content-center align-items-center text-white"
                    style={{
                      background: "rgb(120, 120, 255)",
                      flex: "0 0 50%",
                    }}
                  >
                    Blogs
                  </h2>
                  <Button
                    className="custom-btn"
                    onClick={(e) => setCurrentTab("products")}
                  >
                    Products
                  </Button>
                </ButtonGroup>
              </div>
              {blogs && blogs.length ? (
                <ul className="list-group mt-5 user-blog-container__list">
                  {blogs.reverse().map((blog) => (
                    <li
                      key={blog._id}
                      className="list-group-item border-0 mb-5 user-blog-container__list__item"
                    >
                      <div className="info">
                        <h3>{user.username}</h3>
                        <p>{blog.detail}</p>
                      </div>
                      <div className="d-flex media">
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
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>
                  <h3
                    className="text-center p-4 rounded-2 mt-4"
                    style={{ background: "rgb(220, 255, 220)" }}
                  >
                    Bạn chưa đăng blog nào
                  </h3>
                </div>
              )}
            </div>
          </Col>
        )) || (
          <Col xl={8}>
            <div>
              {!slugState && (
                <div className="mb-5">
                  <h2>Đăng sản phẩm mới</h2>
                  <FormProduct />
                </div>
              )}
              <ButtonGroup className="d-flex col-12 col-md-6">
                <Button
                  className="custom-btn"
                  onClick={(e) => setCurrentTab("blogs")}
                >
                  Blogs
                </Button>
                <h2
                  className="fs-3 btn m-0 p-0 d-flex justify-content-center align-items-center text-white"
                  style={{
                    background: "rgb(120, 120, 255)",
                  }}
                >
                  Products
                </h2>
              </ButtonGroup>
              {products && products.length ? (
                <ul className="list-group mt-5 user-blog-container__list">
                  {products.reverse().map((product) => (
                    <li
                      key={product._id}
                      className="list-group-item border-0 mb-5 user-blog-container__list__item"
                    >
                      <div className="info">
                        <h3>{user.username}</h3>
                        <ListGroup>
                          <ListGroupItem>
                            Mô tả: {product.description}
                          </ListGroupItem>
                          <ListGroupItem>Giá bán: {product.cost}</ListGroupItem>
                          <ListGroupItem>
                            Số lượng: {product.remain || 0}
                          </ListGroupItem>
                        </ListGroup>
                      </div>
                      <div className="d-flex media">
                        {product.files &&
                          product.files.length &&
                          product.files.map((file) => (
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
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>
                  <h3
                    className="text-center p-4 rounded-2 mt-4"
                    style={{ background: "rgb(220, 255, 220)" }}
                  >
                    Bạn chưa đăng sản phẩm nào
                  </h3>
                </div>
              )}
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
}
