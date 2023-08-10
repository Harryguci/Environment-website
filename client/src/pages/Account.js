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
  FormControl,
} from "react-bootstrap";

import FormBlog from "../components/FormBlog";
import FormProduct from "../components/FormProduct";

import "../Assets/SCSS/account.scss";
import ReactPlayer from "react-player";
import AuthContext from "../helpers/Authcontext";
import { useNavigate, useParams } from "react-router-dom";
import AlertDismissible from "../components/AlertDismissable";
import ActiveNavLink from "../helpers/ActiveNavLink";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import AlertConfirm from "../components/AlertConfirm";
import ItemBlog from "../components/ItemBlog";
export default function Account({ props }) {
  const [slugState, setSlugState] = useState("");
  const { authState } = useContext(AuthContext);
  const { tab } = useParams();

  const [currentTab, setCurrentTab] = useState(tab ? tab : "blogs");

  const [user, setUser] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [products, setProducts] = useState([]);

  const [alert, setAlert] = useState({});
  const [alertState, setAlertState] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    ActiveNavLink("account");
  }, []);

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
          } else console.log(response.data);
          setUser({
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            phone: response.data.phone,
            website: response.data.website,
            birthday: response.data.birthday,
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
              phone: response.data.phone,
              website: response.data.website,
              birthday: response.data.birthday,
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

  useEffect(() => {
    setUserPhone(user.phone);
    setUserWebsite(user.website);
  }, [user.phone, user.website]);

  const [userPhone, setUserPhone] = useState(user.phone ? user.phone : "");
  const [userWebsite, setUserWebsite] = useState(
    user.website ? user.website : ""
  );

  const handleChangeUserInfo = (e) => {
    if (userPhone || userWebsite)
      fetch(`http://localhost:3001/account/change`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          accessToken: localStorage.getItem("accessToken"),
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          phone: userPhone,
          website: userWebsite,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setAlert({
            type: "success",
            heading: "Thành công",
            content: "Thay đổi thông tin thành công !!",
            hide: () => setAlert({}),
          });
          setUser(prev => ({
            id: prev.id,
            username: prev.username,
            email: data.email,
            phone: data.phone,
            website: data.website,
            birthday: data.birthday,
          }))
        })
        .catch((err) => {
          console.log(err);
          setAlert({
            type: "danger",
            heading: "Lưu không thành công",
            content: "Có lỗi xảy ra, chúng tôi rất tiếc.",
            hide: () => setAlert({}),
          });
        });
  };

  const handleDeleteProduct = (product) => {
    if (product._id) {
      setAlertState({
        heading: "Delete Order",
        content: "Bạn có chắc chắn muốn xóa ?",
        accept: async () => {
          // [POST] to delete this product
          await fetch("http://localhost:3001/products/delete/single", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accessToken: localStorage.getItem("accessToken"),
            },
            body: JSON.stringify({
              userId: authState.id,
              productId: product._id,
            }),
          })
            .then((response) => console.log(response))
            .catch((error) => console.log(error));

          refreshProducts(); // update front end in products tab
          setAlertState({});
        },
        cancel: () => {
          setAlertState({});
        },
      });
    }
  };

  const handleDeleteBlog = (blog) => {
    if (blog._id) {
      setAlertState({
        heading: "Delete Blog",
        content: "Bạn có chắc chắn muốn xóa ?",
        accept: async () => {
          // [POST] to delete this product
          await fetch("http://localhost:3001/blogs/delete/single", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accessToken: localStorage.getItem("accessToken"),
            },
            body: JSON.stringify({
              userId: authState.id,
              blogId: blog._id,
            }),
          })
            .then((response) => console.log(response))
            .catch((error) => console.log(error));

          refreshBlogs(); // update front end in products tab
          setAlertState({});
        },
        cancel: () => {
          setAlertState({});
        },
      });
    }
  };

  const refreshProducts = () => {
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
  };
  const refreshBlogs = () => {
    // [GET] products
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
      .catch((error) => console.log("Can not get blogs", error));
  };

  return (
    <>
      <Container className="account-container position-relative">
        <Row>
          <Col xl={4}>
            <div className="user-container mb-5">
              <h2>Thông Tin</h2>
              {user && (
                <ul className="list-group mt-5">
                  <li className="list-group-item">
                    <b className="mx-3">ID</b>
                    {user.id}
                  </li>
                  <li className="list-group-item d-flex active">
                    <b className="mx-3">Username</b>
                    {user.username}
                  </li>
                  <li className="list-group-item disabled">
                    <b className="mx-3">Email</b>
                    {user.email}
                  </li>
                  <li className="list-group-item d-flex">
                    <b className="mx-3 my-auto">Phone</b>
                    <FormControl
                      type="phone"
                      style={{ fontSize: 16 }}
                      placeholder="Cập nhật số ĐT"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      disabled={authState.id !== user.id}
                    />
                  </li>
                  <li className="list-group-item d-flex">
                    <b className="mx-3 my-auto">Website</b>
                    <FormControl
                      type="url"
                      style={{ fontSize: 16 }}
                      placeholder="Cập nhật trang web của bạn"
                      value={userWebsite}
                      onChange={(e) => setUserWebsite(e.target.value)}
                      disabled={authState.id !== user.id}
                    />
                  </li>
                  {
                    // TODO: Changing information is allowed only if this account is the current user of the account
                    authState.id === user.id &&
                    < Button
                      className="custom-btn primary-blue"
                      onClick={handleChangeUserInfo}
                      disabled={authState.id !== user.id}
                    >
                      Lưu
                    </Button>
                  }
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
                    {blogs.reverse().map((blog, index) => (
                      <ItemBlog
                        key={index}
                        blog={blog}
                        user={user}
                        handleDeleteBlog={(e) => handleDeleteBlog(blog)}
                      />
                    ))}
                  </ul>
                ) : (
                  <div>
                    <h3
                      className="text-center p-4 rounded-2 mt-4"
                      style={{ background: "rgb(220, 255, 220)" }}
                    >
                      {authState.id === user.id
                        ? "Bạn chưa đăng blog nào"
                        : `${user.username} chưa có blog nào`}
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
                      <FormProduct user={user} />
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
                              <ListGroupItem>
                                Giá bán: {product.cost}
                              </ListGroupItem>
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
                          {(authState.id === user.id && (
                            <div className="control mt-3 d-flex">
                              <Button
                                className="custom-btn primary"
                                onClick={(e) =>
                                  setAlert({
                                    heading: "ERROR",
                                    type: "danger",
                                    content: "Tính năng đang được nâng cấp",
                                    hide: () => setAlert({}),
                                  })
                                }
                              >
                                Cập nhật
                              </Button>
                              <Button
                                className="custom-btn"
                                style={{
                                  marginLeft: "auto",
                                  marginRight: 0,
                                }}
                                onClick={(e) => handleDeleteProduct(product)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          )) || (
                              <div className="control mt-3 d-flex">
                                <a
                                  className="default-link custom-btn primary-blue"
                                  href={`/products/single/${product._id}`}
                                >
                                  Chi tiết
                                </a>
                              </div>
                            )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>
                      <h3
                        className="text-center p-4 rounded-2 mt-4"
                        style={{ background: "rgb(220, 255, 220)" }}
                      >
                        {authState.id === user.id
                          ? "Bạn chưa đăng sản phẩm nào"
                          : `${user.username} chưa có sản phẩm nào`}
                      </h3>
                    </div>
                  )}
                </div>
              </Col>
            )}
        </Row>
      </Container >
      {alert && alert.heading && <AlertDismissible {...alert} />}
      {alertState && alertState.heading && <AlertConfirm {...alertState} />}
    </>
  );
}
