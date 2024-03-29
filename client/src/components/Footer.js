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
import { useState, useEffect, memo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Footer() {
  const [blogs, setBlogs] = useState([]);
  const [contactInformation, setContactInformation] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("/blogs/all", {
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
      .get("/contact", {
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
      .get("/products", {
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
                    <div className="thumbnail-container">
                      <div className="thumbnail">
                        <Link to={`/blogs/${blog._id}`}>
                          <img
                            src={`/blogs/${blog.files[0].filename}`}
                            alt="SFIT"
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="p-3" style={{ height: '100%', overflow: 'hidden' }}>
                      <Link
                        to={`/blogs/single/${blog._id}`}
                        style={{ textDecoration: "none", color: "white" }}
                      >
                        <p className="footer__section-container__item__title">
                          {blog.title.substring(0, 30)}...
                        </p>
                      </Link>
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
                    <Link
                      className="thumbnail"
                      to={`/products/single/${product._id}`}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={`/blogs/${product.imageUrl}`}
                        alt={product.name}
                      />
                    </Link>
                    <Link
                      to={`/products/single/${product._id}`}
                      className="footer__section-container__item__title text-white text-decoration-none"
                      style={{
                        position: "absolute",
                        display: "block",
                        bottom: 10 + "px",
                        padding: "0 1rem",
                        zIndex: 10,
                      }}
                    >
                      {product.name}
                    </Link>
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
              action="/contact"
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
          <span>Copyright {new Date(Date.now()).getFullYear()}</span>
          <span className="mx-4">|</span>
          <span>Harryguci - Social Media</span>
        </Col>
        <Col>Harryguci {new Date(Date.now()).getFullYear()}</Col>
        <Col>
          <div
            className="d-flex gap-3"
            style={{ marginRight: 0, marginLeft: "auto", width: "max-content" }}
          >
            <Link to="/home" style={{ color: "white" }}>
              <FontAwesomeIcon icon={faHome} />
            </Link>
            <Link to="/about" style={{ color: "white" }}>
              <FontAwesomeIcon icon={faCircleInfo} />
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default memo(Footer);
