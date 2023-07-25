import React, { useState, useEffect } from "react";
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

export default function ProductFrame({ limits, className }) {
  const [products, setProducts] = useState([]);
  const [otherAddress, setOtherAddress] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:3001/products/all", {
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

  const [productType, setProductType] = useState([
    ["thoi-trang", "Thời trang"],
    ["do-gia-dung", "Đồ gia dụng"],
    ["do-dung-hoc-tap", "Đồ dùng học tập"],
    ["phu-kien", "Phụ kiện"],
    ["trang-tri", "Decor - Trang trí"],
    ["do-luu-niem", "Đồ lưu niệm"],
    ["other", "Khác"],
  ]);

  return (
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
                <Button className="custom-btn primary" type="submit">
                  Tìm
                </Button>
                <Button className="custom-btn" type="submit">
                  Tùy chọn thêm
                </Button>
              </div>
            </Form>
          </div>
        </Col>
        <Col md={10}>
          <div className="product-frame__main">
            {(products && (
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
                          src={`http://localhost:3001/blogs/${product.imageUrl}`}
                          alt={product.name}
                        />
                      </div>
                      <div className="p-3">
                        <a
                          href={`http://localhost:3000/products/single/${product._id}`}
                          className="text-decoration-none"
                        >
                          <h3 className="fs-3">{product.name}</h3>
                        </a>
                        <p>
                          Giá bán:<b> {DisplayPrice(product.cost)}</b>
                        </p>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )) || <h2>Not found</h2>}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
