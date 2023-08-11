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
import { faHeart, faCartShopping } from "@fortawesome/free-solid-svg-icons";

import AuthContext from "../helpers/Authcontext";
import CartContext from "../helpers/CartContext";

import AlertDismissible from "./AlertDismissable";

export default function ProductFrame({ limits, className }) {
  const [products, setProducts] = useState([]);
  const [otherAddress, setOtherAddress] = useState("");
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
      })
      .catch((error) => console.error(error));
  }, []);

  const { authState } = useContext(AuthContext);
  const { cartState, setCartState } = useContext(CartContext);

  const [alertState, setAlertState] = useState({});

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
      }).then((response) =>
        setAlertState({
          type: "success",
          heading: "Thêm vào giỏ hàng",
          content: "Thêm vào giỏ hàng thành công",
          hide: () => setAlertState({}),
        })
      );
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
  ]);

  const showErrorAlert = () => {
    setAlertState({
      type: "danger",
      heading: "ERROR",
      content: "Tính năng đang được nâng cấp. Quay lại sau.",
      hide: () => setAlertState({}),
    });
  };

  return (
    <>
      <Container fluid className={"product-frame " + className}>
        <Row style={{ rowGap: "3rem" }}>
          <Col md={2} className="px-4">
            <div>
              <p className="selector-title">Loại sản phẩm</p>
              <ListGroup>
                {productType &&
                  productType.length &&
                  productType.map((item) => (
                    <ListGroupItem key={item[0]}>
                      <a
                        style={{ textDecoration: "none" }}
                        href={`/products/${item[0]}`}
                      >
                        {item[1]}
                      </a>
                    </ListGroupItem>
                  ))}
              </ListGroup>
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
              {(products && products.length && (
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
                            <h3 className="fs-3">{product.name}</h3>
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
              )) ||
                <h2
                  className="fs-2 text-center my-5 px-3 py-4 rounded-3 opacity-50"
                  style={{ background: "rgba(0,0,0,0.05)" }}
                >
                  Chưa có sản phẩm nào
                </h2>
              }
            </div>
          </Col>
        </Row>
      </Container>
      {alertState && alertState.heading && <AlertDismissible {...alertState} />}
    </>
  );
}
