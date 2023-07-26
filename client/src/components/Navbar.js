import { useState, useContext, useEffect } from "react";
import {
  Container,
  Navbar,
  Nav,
  FormControl,
  Button,
  ButtonGroup,
  Badge,
} from "react-bootstrap";
import {
  faMagnifyingGlass,
  faBars,
  faRightFromBracket,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import "../Assets/SCSS/navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../helpers/Authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CartContext from "../helpers/CartContext";

function NavbarCustom({ user }, props) {
  const [search, setSearch] = useState("");
  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    if (!search) alert("Please enter some content");
    else e.target.submit();
  };
  const navigate = useNavigate();
  const { authState, setAuthSate } = useContext(AuthContext);
  const { cartState, setCartState } = useContext(CartContext);

  const [cartNumber, setCartNumber] = useState(cartState.length || 0);

  useEffect(() => {
    if (authState.id)
      axios
        .get(`http://localhost:3001/cart/single/${authState.id}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          // console.log(response.data.products.length);
          if (response.data.error) console.log(response.data.error);
          else {
            // console.log("NAVBAR ", response.data.products.length);
            if (response.data.products)
              setCartNumber(response.data.products.length);
          }
        });
  }, [authState.id, cartState]);

  const sendSearch = () => {
    navigate(`/search/${search}`);
  };

  return (
    <React.Fragment>
      <Navbar collapseOnSelect expand="lg" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/">SFIT</Navbar.Brand>
          <Navbar.Toggle id="toggle-btn" aria-controls="responsive-navbar-nav">
            <FontAwesomeIcon icon={faBars} />
          </Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto" style={{ marginBottom: 1 + "rem" }}>
              <Nav.Link name="home" className="active" href="/">
                Home
              </Nav.Link>
              <Nav.Link name="about" href="/about">
                About
              </Nav.Link>
              <Nav.Link name="products" href="/products">
                Products
              </Nav.Link>
              <Nav.Link name="blogs" href="/blogs">
                Blogs
              </Nav.Link>
              <Nav.Link name="contact" href="/contact">
                Contact
              </Nav.Link>
            </Nav>
            <div className="d-flex gap-3">
              <form
                id="search-form"
                action="/search"
                method="GET"
                className="d-flex"
                onSubmit={handleSearchFormSubmit}
              >
                <FormControl
                  type="text"
                  name="q"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  style={{ border: "1px solid white", marginLeft: "1rem" }}
                  onClick={(e) => sendSearch()}
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Button>
              </form>
              <div>
                {(user && (
                  <Nav.Link href={`/accounts/${user.username}`}>
                    {user.username}
                  </Nav.Link>
                )) ||
                  (!authState.status ? (
                    <>
                      <Nav.Link className="text-center" href="/login">
                        Login
                      </Nav.Link>
                      <Nav.Link className="text-center" href="/signup">
                        Sign Up
                      </Nav.Link>
                    </>
                  ) : (
                    <>
                      <div>
                        <a
                          href={`/account?user=${authState.username}`}
                          className="btn fw-bold"
                          style={{ color: "rgb(70,70,255)", fontSize: 16 }}
                        >
                          {authState.username}
                        </a>
                      </div>
                      <ButtonGroup className="d-flex gap-2">
                        <Button
                          className="d-block w-100 bg-danger border-0"
                          style={{ fontSize: "16px" }}
                          onClick={() => {
                            localStorage.removeItem("accessToken");
                            setAuthSate({ ...authState, status: false });
                            try {
                              navigate("/login");
                            } catch (e) {
                              console.log(e);
                            }
                          }}
                        >
                          <FontAwesomeIcon icon={faRightFromBracket} />
                        </Button>
                        <Button
                          className="d-block w-100 border-0"
                          style={{
                            fontSize: "16px",
                            background: "rgb(50, 230, 50)",
                          }}
                          onClick={() => {
                            try {
                              navigate("/cart");
                            } catch (e) {
                              console.log(e);
                            }
                          }}
                        >
                          <FontAwesomeIcon icon={faCartShopping} />
                          <Badge
                            className="position-absolute"
                            style={{ right: -15 }}
                          >
                            {cartNumber || 0}
                          </Badge>
                        </Button>
                      </ButtonGroup>
                    </>
                  ))}
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </React.Fragment>
  );
}

export default NavbarCustom;
