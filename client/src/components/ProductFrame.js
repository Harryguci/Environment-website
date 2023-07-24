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
} from "react-bootstrap";
import axios from "axios";

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
        else setProducts(data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <Container fluid className={"product-frame " + className}>
      <Row style={{ rowGap: "3rem" }}>
        <Col md={2} className="px-4">
          <div>
            <p className="selector-title">Loại sản phẩm</p>
            <ListGroup>
              <ListGroupItem>
                <a href="/products/tui-xach">Túi xách</a>
              </ListGroupItem>
              <ListGroupItem>
                <a href="/products/do-luu-niem">Đồ lưu niệm</a>
              </ListGroupItem>
              <ListGroupItem>
                <a href="/products/do-gia-dung">Đồ gia dụng</a>
              </ListGroupItem>
              <ListGroupItem>
                <a href="/products/all">Xem thêm</a>
              </ListGroupItem>
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
                <Button className="custom-btn" type="submit">
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
                {products.map((product) => (
                  <Col sm={4} md={3} xl={2} key={product.id} className="col-6">
                    <Card className="product-frame__main__item">
                      <div className="thumbnail">
                        <img src={product.imageUrl} alt={product.name} />
                      </div>
                      <p className="p-3">{product.name}</p>
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
