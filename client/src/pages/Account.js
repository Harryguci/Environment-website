import React, { useState, useEffect, useContext, useCallback } from "react";
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

import { useLocation } from "react-router-dom";
import OrderList from "../components/OrderList";

export default function Account() {
  const { authState } = useContext(AuthContext);
  const { tab } = useParams();

  const [slugState, setSlugState] = useState("");
  const [currentTab, setCurrentTab] = useState(tab ? tab : "blogs");

  const [user, setUser] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [alert, setAlert] = useState({});
  const [alertState, setAlertState] = useState({});

  const navigate = useNavigate();
  const userId = useParams().id;

  const location = useLocation();

  useEffect(() => {
    ActiveNavLink("account");
  }, []);

  useEffect(() => {
    setSlugState(userId);
  }, [userId]);

  useEffect(() => {
    console.log('User:' + userId);
    if (userId) {
      axios
        .get(`/account/${userId}`, {
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
              phone: response.data.phone,
              website: response.data.website,
              birthday: response.data.birthday,
              role: response.data.role,
            });
        });
    } else {
      axios
        .get("/account", {
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
  }, []);

  useEffect(() => {
    let params = new URLSearchParams(location.search); // create a URLSearchParams object
    let tab = params.get("tab");
    console.log(params);
    if (tab) setCurrentTab(tab);
  }, [location.search]);

  useEffect(() => {
    if (currentTab === 'blogs') {
      axios
        .get(`/blogs/user/${user.id}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          if (response.data.error) console.log("Can not get blogs");
          else setBlogs(response.data.reverse());
        })
        .catch((error) => console.log("Can not get Blogs", error));
    } else if (currentTab === 'products') {
      axios
        .get(`/products/user/${user.id}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          if (response.data.error) console.log("Can not get products");
          else setProducts(response.data.reverse());
        })
        .catch((error) => console.log("Can not get Products", error));
    } else if (currentTab === 'orders') {
      axios.get(`/order/user/${user.id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        if (response.data.error) console.log(response.data.error);
        else setOrders(response.data.reverse());
      }).catch((error) => console.log("Can not get orders", error));
    }
  }, [currentTab, user]);

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
      fetch(`/account/change`, {
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
          if (data.error) {
            setAlert({
              type: "danger",
              heading: "Lưu không thành công",
              content: data.error,
              hide: () => setAlert({}),
            })
            setUserPhone("");
          } else {
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
          }
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
          await fetch("/products/delete/single", {
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
          await fetch("/blogs/delete/single", {
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
      .get(`/products/user/${user.id}`, {
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
      .get(`/blogs/user/${user.id}`, {
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

  const ActiveTab = useCallback(({ text }) => {
    return (<h2
      className="fs-3 btn d-block m-0 p-0 d-flex justify-content-center align-items-center text-white"
      style={{
        background: "rgb(120, 120, 255)",
        minWidth: '20rem'
      }}
    >
      {text}
    </h2>)
  }, [])

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
                  <h2 className="heading-2">Đăng Blog mới</h2>
                  <FormBlog />
                </div>
              )}
              <div className="user-blog-container">
                <div className="d-flex gap-5">
                  <ButtonGroup className="d-flex col-12 col-md-6">
                    <ActiveTab text={`Blogs`} />
                    <Button
                      className="custom-btn"
                      onClick={(e) => setCurrentTab("products")}
                    >
                      Products
                    </Button>
                    {authState.id === user.id && <Button
                      className="custom-btn"
                      onClick={(e) => setCurrentTab("orders")}
                    >
                      Orders
                    </Button>}
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
          )) || (currentTab === "products" &&
            <Col xl={8}>
              <div>
                {!slugState && (
                  <div className="mb-5">
                    <h2 className="heading-2">Đăng sản phẩm mới</h2>
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
                  <ActiveTab text="Products" />
                  {authState.id === user.id && <Button
                    className="custom-btn"
                    onClick={(e) => setCurrentTab("orders")}
                  >
                    Orders
                  </Button>}
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
                              <Button style={{
                                background: 'none', border: 'none',
                                color: 'blueviolet', fontSize: '1rem',
                                padding: '0'
                              }}>
                                show more
                              </Button>
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
            ) || (currentTab === "orders" &&
              <Col xl={8}>
                <div>
                  {!slugState && (
                    <div className="mb-5">
                      <h2 className="heading-2">Tất cả đơn hàng của bạn</h2>
                    </div>
                  )}
                  <ButtonGroup className="d-flex col-12 col-md-6">
                    <Button
                      className="custom-btn"
                      onClick={(e) => setCurrentTab("blogs")}
                    >
                      Blogs
                    </Button>
                    <Button
                      className="custom-btn"
                      onClick={(e) => setCurrentTab("products")}
                    >
                      Products
                    </Button>
                    <ActiveTab text={`Orders`} />
                  </ButtonGroup>
                  <div className="mt-3 mt-md-5">
                    <OrderList />
                  </div>
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
