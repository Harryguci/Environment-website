import React, { useState, useEffect, useContext } from "react";
import "../Assets/SCSS/components/productFrame.scss";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  FormLabel,
  ListGroup,
  ListGroupItem,
  FormControl,
  Button,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import DisplayPrice from "../helpers/DisplayPrice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCartShopping,
  faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";

import AuthContext from "../helpers/Authcontext";
import CartContext from "../helpers/CartContext";
import LoadingCard from '../components/LoadingCard';
import AlertDismissible from "./AlertDismissable";

export default function ProductFrame({ className }) {
  const [products, setProducts] = useState([]);
  const [otherAddress, setOtherAddress] = useState("");
  const [search, setSearch] = useState("");
  const [isFetch, setIsFetch] = useState(false);
  const [typeState, setTypeState] = useState("");

  useEffect(() => {
    axios
      .get("/products/all", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((data) => {
        if (data.data.error) return console.log(data.data.error);
        else {
          // console.log(data.data);
          setProducts(data.data.reverse());
        }

        setIsFetch(true);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    axios
      .get(`/products/all?type=${typeState}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((data) => {
        if (data.data.error) return console.log(data.data.error);
        else {
          setProducts(data.data.reverse());
        }

        setIsFetch(true);
      })
      .catch((error) => console.error(error));
  }, [typeState]);

  const { authState } = useContext(AuthContext);
  const { cartState, setCartState } = useContext(CartContext);

  const [alertState, setAlertState] = useState({});

  const refreshCart = () => {
    if (authState.id) {
      axios
        .get(`/cart/single/${authState.id}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          if (response.data.error) {
            // Call alert show error
          } else {
            setCartState(prev => [...prev, response.data]);
          }
        });
    }
  };

  const AddToCart = async (product) => {
    if (authState.id) {
      setCartState([...cartState, product._id]);
      await fetch(`/cart/add/${authState.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accessToken: localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({ product_id: product._id }),
      }).then((response) => {
        refreshCart();
        setAlertState({
          type: "success",
          heading: "Thêm vào giỏ hàng",
          content: "Thêm vào giỏ hàng thành công",
          hide: () => setAlertState({}),
        });
      });
    }
  };

  const [productType, setProductType] = useState([
    ["thoi-trang", "Thời trang"],
    ["do-gia-dung", "Đồ gia dụng"],
    ["do-dung-hoc-tap", "Đồ dùng học tập"],
    ["phu-kien", "Phụ kiện"],
    ["trang-tri", "Decor - Trang trí"],
    ["do-luu-niem", "Đồ lưu niệm"],
    ["other", "Khác"],
    ['', 'Tất cả']
  ]);

  const showErrorAlert = () => {
    setAlertState({
      type: "danger",
      heading: "ERROR",
      content: "Tính năng đang được nâng cấp. Quay lại sau.",
      hide: () => setAlertState({}),
    });
  };

  const HandleFilerName = async (e) => {
    e.preventDefault();

    await axios
      .get(`/products/all?q=${search}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((data) => {
        if (data.data.error)
          return console.log(data.data.error);
        else {
          console.log(data.data);
          setProducts(data.data.reverse());
        }
      })
      .catch((error) => console.error(error));
  };

  const HandleChangeProductType = (type) => {
    setTypeState(type);
    setIsFetch(false);
    setProducts([]);
  };

  return (
    <>
      <Container fluid className={"product-frame " + className}>
        <Row>
          <div className="d-flex search-container justify-content-center" >
            <Form onSubmit={(e) => HandleFilerName(e)}>
              <FormLabel className="d-flex my-3 my-md-5" style={{ alignItems: 'center', gap: '1rem' }}>
                <Button type="submit"
                  className="custom-btn heading-2 my-auto" style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Button>
                <FormControl
                  type="text" style={{
                    maxWidth: '700px',
                    width: '90vw',
                    fontSize: '1.6rem',
                    height: '100%',
                  }}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </FormLabel>
            </Form>
          </div>
        </Row>
        <Row style={{ rowGap: "3rem" }}>
          <Col md={2} className="px-4">
            <div>
              <p className="selector-title">Loại sản phẩm</p>
              <ul className="control-list rounded-3 overflow-hidden">
                {productType &&
                  productType.length &&
                  productType.map((item) => (
                    <li className="control-list__item p-0" key={item[0]}>
                      <Button
                        style={{ textDecoration: "none", display: "block", padding: '1rem', width: '100%', textAlign: 'left' }}
                        onClick={() => HandleChangeProductType(item[0])}
                      >
                        {item[1]}
                      </Button>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="mt-5">
              <p className="selector-title">Địa chỉ</p>
              <Form>
                <div>
                  <FormLabel className="d-flex gap-3">
                    <input type="checkbox" name="addresses" value="HN" />
                    Hà Nội
                  </FormLabel>
                </div>
                <div>
                  <FormLabel className="d-flex gap-3">
                    <input type="checkbox" name="addresses" value="HN" />
                    Sài Gòn
                  </FormLabel>
                </div>
                <div>
                  <FormLabel className="d-flex gap-3">
                    <input type="checkbox" name="addresses" value="HN" />
                    Đà Nẵng
                  </FormLabel>
                </div>
                <div>
                  <FormControl
                    type="text"
                    name="addresses"
                    value={otherAddress}
                    onChange={(e) => setOtherAddress(e.target.value)}
                    className="d-block w-100"
                    placeholder="Nơi khác"
                  />
                </div>
                <div className="mt-3 d-flex gap-2">
                  <Button
                    className="custom-btn primary"
                    type="button"
                    onClick={(e) => showErrorAlert()}
                  >
                    Tìm
                  </Button>
                  <Button
                    className="custom-btn"
                    type="button"
                    onClick={(e) => showErrorAlert()}
                  >
                    Tùy chọn thêm
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
          <Col md={10}>
            <div className="product-frame__main">
              {products && products.length && (
                <Row className="" style={{ rowGap: "1.5rem" }}>
                  {products.map((product, index) => (
                    <Col
                      sm={4}
                      md={3}
                      xl={2}
                      key={index + 1}
                      className="col-6 position-relative"
                    >
                      {index < 2 && (
                        <Badge
                          className="position-absolute d-block bg-danger"
                          style={{
                            top: "0",
                            right: 0,
                            zIndex: 10,
                          }}
                        >
                          new
                        </Badge>
                      )}
                      <Card className="product-frame__main__item position-relative">
                        <div className="thumbnail">
                          <img
                            src={`/blogs/${product.imageUrl}`}
                            alt={product.name}
                          />
                        </div>
                        <div className="product-frame__main__item__content">
                          <a
                            href={`/products/single/${product._id}`}
                            className="text-decoration-none"
                          >
                            <h3 className="fs-3">{product.name.substr(0, 30)}{product.name.length > 30 ? '...' : ''}</h3>
                          </a>
                          <p>
                            Giá bán:<b> {DisplayPrice(product.cost)}</b>
                          </p>
                        </div>
                        <div className="d-flex p-3">
                          <Button
                            className="bg-none red"
                            onClick={(e) => showErrorAlert()}
                          >
                            <FontAwesomeIcon icon={faHeart} />
                          </Button>
                          {(authState.id !== product.userId && (
                            <Button
                              className="bg-none"
                              style={{ marginLeft: "auto", marginRight: "0" }}
                              onClick={(e) => AddToCart(product)}
                            >
                              <FontAwesomeIcon icon={faCartShopping} />
                            </Button>
                          )) || (
                              <span
                                style={{
                                  marginLeft: "auto",
                                  marginRight: "0",
                                  color: "rgb(200, 200, 200)",
                                }}
                              >
                                Sản phẩm của bạn
                              </span>
                            )}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
              {isFetch && (!products || products.length === 0) &&
                <h2
                  className="fs-2 text-center my-5 px-3 py-4 rounded-3 opacity-50"
                  style={{ background: "rgba(0,0,0,0.05)" }}
                >
                  Chưa có sản phẩm nào
                </h2>}

              {!isFetch &&
                <div className="d-flex" style={{ flexWrap: 'wrap' }}>
                  {Array.from({ length: 10 }).map((it, index) =>
                    <LoadingCard
                      key={index}
                      style={{
                        width: '20%',
                        height: '30rem',
                        marginBottom: '1rem'
                      }}
                    />)}
                </div>}
            </div>
          </Col>
        </Row>
      </Container>
      {alertState &&
        alertState.heading &&
        <AlertDismissible {...alertState} />}
    </>
  );
}
