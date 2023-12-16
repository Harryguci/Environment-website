import React, { useEffect, useState, useContext } from "react";
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
import AuthContext from "../helpers/Authcontext";
import CartContext from "../helpers/CartContext";
import CurrentPageContext from "../helpers/CurrentPageContext";
import AlertDismissable from '../components/AlertDismissable';

export default function BlogSingle(props) {
  const [product, setBlog] = useState({});
  const productId = useParams().id;
  let navigate = useNavigate();

  const { cartState, setCartState } = useContext(CartContext);
  const { authState } = useContext(AuthContext);
  const { setPageState } = useContext(CurrentPageContext);
  const [alertState, setAlertState] = useState({});

  useEffect(() => setPageState("products"), [setPageState])

  useEffect(() => {
    //    console.log('PRODUCT ID', productId);

    axios
      .get(`/products/single/${productId}`, {
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

  const handleAddCart = async () => {
    if (authState.id) {
      setCartState([...cartState, productId]);
      await fetch(`/cart/add/${authState.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accessToken: localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({ product_id: productId }),
      }).then((response) => {
        if (response.error) {
          setAlertState({
            heading: 'Thông báo',
            content: 'Có lỗi xảy ra, Thêm vào giỏ hàng không thành công',
            type: 'error',
            hide: () => setAlertState({})
          });
        }
        else
          setAlertState({
            heading: 'Thông báo',
            content: 'Thêm vào giỏ hàng thành công',
            type: 'success',
            hide: () => setAlertState({})
          });
      });
    }
  };

  return (
    <React.Fragment>
      {alertState && alertState.heading && <AlertDismissable {...alertState} />}
      <Container className="blog-single-container product-single-container">
        <Row>
          <Col md={4} className="media">
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

            <div>
              {authState.id !== product.userId ? (
                <>
                  <Button
                    className="add-cart-btn gap-4 d-flex justify-content-center align-content-center"
                    onClick={handleAddCart}
                  >
                    <FontAwesomeIcon
                      icon={faCartArrowDown}
                      className="d-block my-auto"
                    />
                    <span style={{ fontSize: 1.5 + "rem" }}>
                      Thêm vào giỏ hàng
                    </span>
                  </Button>
                </>
              ) : (
                <>
                  <a
                    href="/account?tab=products"
                    className="add-cart-btn gap-4 d-flex justify-content-center align-content-center default-link"
                  // onClick={handleAddCart}
                  >
                    Đi đến sản phẩm của bạn
                  </a>
                </>
              )}
            </div>
          </Col>
          <Col md={8}>
            <div>
              {product && product.name && (
                <h1 className="heading">{product.name}</h1>
              )}
            </div>
            <p className="opacity-50">
              Author:
              <a
                href={`/account/${product.username}`}
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
