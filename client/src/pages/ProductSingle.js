import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import ReactPlayer from "react-player";
import "../Assets/SCSS/blogSingle.scss";
import "../Assets/SCSS/productSingle.scss";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import DisplayPrice from "../helpers/DisplayPrice";
export default function BlogSingle(props) {
  const [product, setBlog] = useState({});
  const productId = useParams().id;
  let navigate = useNavigate();

  useEffect(() => {
    console.log("params", productId);
    axios
      .get(`http://localhost:3001/products/single/${productId}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert("Bạn phải đăng nhập để xem");
          navigate("/login");
        } else setBlog(response.data);
      })
      .catch((err) => {
        console.log(err);
        alert("Bạn phải đăng nhập để xem");
        navigate("/login");
      });
  }, [navigate, productId]);

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
            <p className="opacity-50">
              Author:
              <a
                href={`/account?user=${product.username}`}
                style={{ marginLeft: "1rem" }}
              >
                {product.username || product.userId}
              </a>
            </p>
            <p className="cost">Giá bán: {DisplayPrice(product.cost)} VND</p>
            <p style={{ whiteSpace: "pre-line" }}>{product.description}</p>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}
