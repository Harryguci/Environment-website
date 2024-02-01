import { useState, useContext, useEffect, useCallback, memo } from "react";
import { Link, NavLink } from "react-router-dom";
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
  faBell,
  faNewspaper,
  faMap,
  faMessage
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import "../Assets/SCSS/navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../helpers/Authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CartContext from "../helpers/CartContext";
import AlertDismissible from "../components/AlertDismissable";
import AlertConfirm from "../components/AlertConfirm";
import NotiSubmenu from "./NotiSubmenu";
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
  const [cartNumber, setCartNumber] = useState(cartState.length || 0);
  const [alert] = useState("");
  const [alertConfirm, setAlertConfirm] = useState("");
  const [noti, setNoti] = useState(false);
  const [notiNum, setNotiNum] = useState(0);

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

  useEffect(() => {
    axios.get('/notification/new', {
      headers: {
        accessToken: localStorage.getItem('accessToken')
      },
    }).then(res => res.data)
      .then(data => setNotiNum(data.length));
  }, [])

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

  const HandleToggleNoti = (e) => {
    setNoti(prev => !prev)
  };

  const [navbarItems] = useState([
    {
      display: 'Home',
      name: 'home',
      href: '/home',
      icon: faHome,
    },
    {
      display: 'Travel Maps',
      name: 'maps',
      href: '/maps',
      icon: faMap,
    },
    {
      display: 'Products',
      name: 'products',
      href: '/products',
      icon: faBagShopping,
    },
    {
      display: 'New Feed',
      name: 'blogs',
      href: '/blogs',
      icon: faNewspaper,
    },
    // {
    //   display: 'Contact',
    //   name: 'contact',
    //   href: '/contact',
    //   icon: faPhone,
    // },
    {
      display: 'Chat',
      name: 'chat',
      href: '/chat',
      icon: faMessage
    }
  ]);

  return (
    <React.Fragment>
      {alert && alert.heading && <AlertDismissible {...alert} />}
      {alertConfirm && alertConfirm.heading && <AlertConfirm {...alertConfirm} />}
      <Navbar key={`${authState.id}`} collapseOnSelect expand="lg" data-bs-theme="light">
        <Container>
          <NavLink className={'nav-brand'} to={'/home'}>
            <img src="/harryguci-logo-orange.png" alt="logo" style={{ width: '50px', height: '50px' }} />
          </NavLink>

          <Navbar.Toggle id="toggle-btn" aria-controls="responsive-navbar-nav">
            <FontAwesomeIcon icon={faBars} />
          </Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav"
            style={{ justifyContent: 'center' }}>
            <Nav className="me-auto mx-auto">
              {navbarItems.map(item =>
                <NavLink key={item.name}
                  name={item.name}
                  to={item.href}
                  title={item.display}
                  className={
                    ({ isActive, isPending }) =>
                      isActive
                        ? "nav-link active"
                        : isPending
                          ? "nav-link pending"
                          : "nav-link"
                  }>
                  <FontAwesomeIcon icon={item.icon} />
                  <span>{item.display}</span>
                </NavLink>
              )}
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
                  <NavLink to={`/accounts/${user.username}`} className={'nav-link'}>
                    {user.username}
                  </NavLink>
                )) ||
                  (!authState.status ? (
                    <>
                      <NavLink className="text-center nav-link" to="/login">
                        Login
                      </NavLink>
                      <NavLink className="text-center nav-link" to="/signup">
                        Sign Up
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <div>
                        <Link
                          to={`/account/${authState.username}`}
                          className="btn fw-bold"
                          style={{ color: "rgb(100,100,255)", fontSize: 16 }}
                        >
                          {authState.username}
                        </Link>
                      </div>
                      <ButtonGroup className="d-flex gap-1">
                        <Button
                          className="d-block w-100 border-0 logout-btn"
                          style={{ fontSize: "16px" }}
                          onClick={() => HandleLogout()}
                        >
                          <FontAwesomeIcon icon={faRightFromBracket} />
                        </Button>
                        <Button className="d-block w-100 border-0"
                          style={{
                            fontSize: "16px",
                            background: "rgb(255, 50, 50)",
                          }}
                          onClick={HandleToggleNoti}>
                          <FontAwesomeIcon icon={faBell} />
                          <Badge
                            className="position-absolute"
                            style={{ right: -15, zIndex: 100 }}
                          >
                            {notiNum > 0 && notiNum}
                          </Badge>
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
                        <NotiSubmenu visible={noti} />
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
