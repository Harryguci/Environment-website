import { useState, useContext, useEffect, useCallback, memo } from "react";
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
  faHome,
  faBagShopping,
  faCircleInfo,
  faNewspaper,
  faPhone,
  faMap
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import "../Assets/SCSS/navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../helpers/Authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CartContext from "../helpers/CartContext";
import CurrentPageContext from "../helpers/CurrentPageContext";
import AlertDismissible from "../components/AlertDismissable";
import AlertConfirm from "../components/AlertConfirm";

import '../Assets/SCSS/components/navbar.scss';

function NavbarCustom({ user }) {
  const [search, setSearch] = useState("");
  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    if (!search) alert("Please enter some content");
    else e.target.submit();
  };
  const navigate = useNavigate();
  const { authState, setAuthSate } = useContext(AuthContext);
  const { cartState } = useContext(CartContext);
  const { pageState, setPageState } = useContext(CurrentPageContext);
  const [cartNumber, setCartNumber] = useState(cartState.length || 0);
  // const currentPage = useRef("home");
  const [alert, setAlert] = useState("");
  const [alertConfirm, setAlertConfirm] = useState("");

  useEffect(() => {
    if (authState.id)
      axios
        .get(`/cart/single/${authState.id}`, {
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
  }, [authState, cartState]);

  const sendSearch = useCallback(() => {
    navigate(`/search/${search}`);
  }, [navigate, search]);

  const HandleLogout = useCallback(() => {
    setAlertConfirm({
      heading: "Bạn có chắc muốn đăng xuất?",
      content: '',
      type: "danger",
      accept: () => {
        localStorage.removeItem("accessToken");
        setAuthSate({ ...authState, status: false });

        try {
          navigate("/login");
        } catch (e) {
          console.log(e);
        }
      },
      cancel: () => setAlertConfirm({}),
    });
  }, [authState, navigate, setAuthSate]);

  return (
    <React.Fragment>
      {alert && alert.heading && <AlertDismissible {...alert} />}
      {alertConfirm && alertConfirm.heading && <AlertConfirm {...alertConfirm} />}
      <Navbar key={`${authState.id}`} collapseOnSelect expand="lg" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/">HAR</Navbar.Brand>
          <Navbar.Toggle id="toggle-btn" aria-controls="responsive-navbar-nav">
            <FontAwesomeIcon icon={faBars} />
          </Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav"
            style={{ justifyContent: 'center' }}>
            <Nav className="me-auto mx-auto">
              <Nav.Link name="home" title="Home" href="/"
                className={pageState === "home" ? "active" : ""}>
                <FontAwesomeIcon icon={faHome} />
                <span>Home</span>
              </Nav.Link>
              <Nav.Link name="maps" href="/maps" title="Travel Maps"
                className={pageState === "maps" ? "active" : ""} >
                <FontAwesomeIcon icon={faMap} />
                <span>Travel Maps</span>
              </Nav.Link>

              <Nav.Link name="products" href="/products" title="Products"
                className={pageState === "products" ? "active" : ""} >
                <FontAwesomeIcon icon={faBagShopping} />
                <span>Products</span>
              </Nav.Link>
              <Nav.Link name="blogs" href="/blogs" title="News Feed"
                className={pageState === "blogs" ? "active" : ""} >
                <FontAwesomeIcon icon={faNewspaper} />
                <span>Feed</span>
              </Nav.Link>
              <Nav.Link name="contact" href="/contact" title="Contact"
                className={pageState === "contact" ? "active" : ""} >
                <FontAwesomeIcon icon={faPhone} />
                <span>Contact</span>
              </Nav.Link>
            </Nav>
            <div className="d-flex gap-2 gap-md-5">
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
                  className="d-block my-auto"
                  style={{ height: 'max-content', borderTopLeftRadius: '0', borderTopRightRadius: '0' }}
                />
                <Button
                  className="search-btn d-block my-auto"
                  style={{
                    border: "1px solid white",
                    height: 'max-content'
                  }}
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
                          href={`/account/${authState.username}`}
                          className="btn fw-bold"
                          style={{ color: "rgb(100,100,255)", fontSize: 16 }}
                        >
                          {authState.username}
                        </a>
                      </div>
                      <ButtonGroup className="d-flex gap-1">
                        <Button
                          className="d-block w-100 border-0 logout-btn"
                          style={{ fontSize: "16px" }}
                          onClick={() => HandleLogout()}
                        >
                          <FontAwesomeIcon icon={faRightFromBracket} />
                        </Button>
                        <Button
                          className="d-block w-100 border-0"
                          style={{
                            fontSize: "16px",
                            background: "rgb(255, 50, 50)",
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
    </React.Fragment >
  );
}

export default memo(NavbarCustom);
