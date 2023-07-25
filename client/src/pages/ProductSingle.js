import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import ReactPlayer from "react-player";
import "../Assets/SCSS/blogSingle.scss";
import "../Assets/SCSS/productSingle.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";

export default function BlogSingle(props) {
  const [product, setBlog] = useState({});
  const productId = useParams().id;

  useEffect(() => {
    console.log("params", productId);
    axios
      .get(`http://localhost:3001/products/single/${productId}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        setBlog(response.data);
        console.log(response.data);
      })
      .catch((err) => console.log(err));
  }, [productId]);

  return (
    <React.Fragment>
      <Container className="blog-single-container">
        <Row>
          <Col md={4} className="media">
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

            <div>
              <Button className="add-cart-btn gap-4 d-flex justify-content-center align-content-center">
                <FontAwesomeIcon
                  icon={faCartArrowDown}
                  className="d-block my-auto"
                />
                <span style={{ fontSize: 1.5 + "rem" }}>Thêm vào giỏ hàng</span>
              </Button>
            </div>
          </Col>
          <Col>
            <div>
              {product && product.name && (
                <h1 className="heading">{product.name}</h1>
              )}
            </div>
            <p className="opacity-50">Author: {product.userId}</p>
            <p style={{ whiteSpace: "pre-line" }}>{product.description}</p>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}
