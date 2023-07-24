import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhone,
  faEnvelope,
  faHome,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Footer(props) {
  const [blogs, setBlogs] = useState([]);
  const [contactInformation, setContactInformation] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/blogs/all", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((data) => {
        if (data.data.error) console.log(data.data.error);
        else setBlogs(data.data.reverse());
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/contact", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((data) => {
        if (data.data.error) console.log(data.data.error);
        else setContactInformation(data.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/products", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((data) => {
        if (data.data.error) console.log(data.data.error);
        else setProducts(data.data);
      });
  }, []);

  return (
    <Container fluid id="footer" className="footer">
      <Row style={{ rowGap: "3rem" }}>
        <Col md={6}>
          <div className="footer__section-container">
            <p className="fs-1 fw-bold mt-4">Blogs</p>
            {blogs && (
              <ul>
                {blogs.slice(0, 3).map((blog, index) => (
                  <li
                    key={index + 1}
                    className="footer__section-container__item d-flex gap-4"
                  >
                    <div style={{ flex: "0 0 20%" }}>
                      <div className="thumbnail">
                        <a href={`/blogs/${blog._id}`}>
                          <img
                            src={`http://localhost:3001/blogs/${blog.files[0].filename}`}
                            alt="SFIT"
                          />
                        </a>
                      </div>
                    </div>
                    <div className="p-3">
                      <a
                        href={`/blogs/${blog._id}`}
                        style={{ textDecoration: "none", color: "white" }}
                      >
                        <p className="footer__section-container__item__title">
                          {blog.title}
                        </p>
                      </a>
                      <p className="footer__section-container__item__content">
                        {blog.description.substring(0, 150) + "..."}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="footer__section-container mt-5">
            <p className="fs-1 fw-bold">Sản phẩm</p>
            {products && (
              <Row className="gap-3">
                {products.slice(0, 4).map((product, index) => (
                  <Col
                    key={index + 1}
                    className="footer__section-container__item products-container"
                  >
                    <a href={product.url} style={{ cursor: "pointer" }}>
                      <img
                        src={`http://localhost:3001/blogs/${product.imageUrl}`}
                        alt={product.name}
                      />
                    </a>
                    <p
                      className="footer__section-container__item__title"
                      style={{
                        position: "absolute",
                        bottom: 10 + "px",
                        padding: "0 1rem",
                      }}
                    >
                      {product.name}
                    </p>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Col>
        <Col md={6}>
          <div>
            <h3 className="text-center fw-bold">Liên hệ</h3>
            <Form
              name="contact-form"
              className="contact-form"
              action="http://localhost:3001/contact"
              method="POST"
            >
              <div className="mt-5">
                <FormControl type="text" name="name" placeholder="Your name" />
              </div>
              <div className="mt-3">
                <FormControl
                  type="email"
                  name="email"
                  placeholder="Your email"
                />
              </div>
              <div className="mt-3">
                <FormControl
                  as="textarea"
                  type="text"
                  rows={2}
                  name="message"
                  placeholder="Message"
                />
              </div>
              <div className="mt-5 d-flex justify-content-end">
                <Button type="submit" className="">
                  Send
                </Button>
              </div>
            </Form>
            {contactInformation && (
              <>
                <h3 className="text-center fw-bold">Thông tin</h3>
                <div className="d-flex justify-content-center">
                  <ul className="contact-info-list mt-5">
                    <li>
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        style={{ marginRight: 20 + "px" }}
                      />
                      {contactInformation.address}
                    </li>
                    <li>
                      <FontAwesomeIcon
                        icon={faPhone}
                        style={{ marginRight: 20 + "px" }}
                      />
                      {contactInformation.phone}
                    </li>
                    <li>
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        style={{ marginRight: 20 + "px" }}
                      />
                      {contactInformation.email}
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <span>Copyright 2023</span>
          <span className="mx-4">|</span>
          <span>SFIT - Environment</span>
        </Col>
        <Col>Hackfest 2023</Col>
        <Col>
          <div
            className="d-flex gap-3"
            style={{ marginRight: 0, marginLeft: "auto", width: "max-content" }}
          >
            <a href="/home" style={{ color: "white" }}>
              <FontAwesomeIcon icon={faHome} />
            </a>
            <a href="/about" style={{ color: "white" }}>
              <FontAwesomeIcon icon={faCircleInfo} />
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
