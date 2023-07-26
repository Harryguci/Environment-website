import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Button,
} from "react-bootstrap";
import { useState, useEffect, useContext } from "react";

import AuthContext from "../helpers/Authcontext";
import CartContext from "../helpers/CartContext";

import axios from "axios";
import "../Assets/SCSS/cart.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import AlertConfirm from "../components/AlertConfirm";
import AlertDismissable from "../components/AlertDismissable";

export default function Cart() {
  const { authState } = useContext(AuthContext);
  const { setCartState } = useContext(CartContext);

  const [cart, setCart] = useState({});
  const [alertState, setAlertState] = useState({}); // Alert confirm
  const [alertDismissState, setAlertDismissState] = useState({}); // Alert dismiss

  useEffect(() => {
    if (authState.id) {
      axios
        .get(`http://localhost:3001/cart/single/${authState.id}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          if (response.data.error) {
            // console.log(response.data.error);
            // Call alert show error
            setAlertDismissState({
              heading: "ERROR",
              type: "danger",
              content: response.data.error,
              hide: () => setAlertDismissState({}),
            });
          } else {
            setCart(response.data);
          }
        });
    }
  }, [authState.id]);

  const handleDeleteProduct = (product) => {
    if (product._id) {
      setAlertState({
        heading: "Delete Order",
        content: "Bạn có chắc chắn muốn xóa ?",
        accept: async () => {
          // [POST] to delete this product
          await fetch("http://localhost:3001/cart/delete/single", {
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

          setAlertState({});
          refreshCart();
        },
        cancel: () => {
          setAlertState({});
        },
      });
    }
  };

  const refreshCart = () => {
    if (authState.id) {
      axios
        .get(`http://localhost:3001/cart/single/${authState.id}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          if (response.data.error) {
            // console.log(response.data.error);
            // Call alert show error
          } else {
            setCart(response.data);
          }
        });
    }
  };

  useEffect(() => {
    if (cart.products_id) {
      console.log("[PRODUCTS]", cart.products_id);
      setCartState([...cart.products_id]);
    }
  }, [cart, cart.products_id, setCartState]);

  return (
    <>
      <Container className="cart-container">
        {(cart && (
          <Row>
            <Col md={2}>
              <div>Some control</div>
            </Col>
            <Col md={10}>
              <ListGroup className="cart-container__list">
                {(cart.products &&
                  cart.products.length &&
                  cart.products.map((product, index) => (
                    <ListGroupItem
                      key={index + 1}
                      className="cart-container__item"
                    >
                      <div className="cart-container__item__thumbnail">
                        <img
                          src={`http://localhost:3001/blogs/${product.imageUrl}`}
                          alt="SFIT"
                        />
                      </div>
                      <div className="cart-container__item__info">
                        <h3 className="fs-3 fw-bold">{product.name}</h3>
                        <p>{product.description}</p>
                      </div>
                      <div className="cart-container__item__control">
                        <Button className="custom-btn primary-blue">
                          Đặt hàng
                        </Button>
                        <Button
                          className="custom-btn w-100"
                          onClick={(e) => handleDeleteProduct(product)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </ListGroupItem>
                  ))) || <h2>Not found products</h2>}
              </ListGroup>
            </Col>
          </Row>
        )) || (
          <Row>
            <h1>Something was wrong</h1>
          </Row>
        )}
      </Container>
      {alertState && alertState.heading && <AlertConfirm {...alertState} />}
      {alertDismissState && alertDismissState.heading && (
        <AlertDismissable {...alertDismissState} />
      )}
    </>
  );
}
