import { useState, useContext, useEffect } from "react";
import { Container, Navbar, Nav, FormControl, Button } from "react-bootstrap";
import React from "react";
import "../Assets/SCSS/navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBars } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../helpers/Authcontext";
import { useNavigate } from "react-router-dom";

function NavbarCustom({ user }, props) {
  const [search, setSearch] = useState("");
  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    if (!search) alert("Please enter some content");
    else e.target.submit();
  };

  let navigate = useNavigate();

  const { authState, setAuthSate } = useContext(AuthContext);

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
              <Nav.Link className="active" href="/">
                Home
              </Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/products">Products</Nav.Link>
              <Nav.Link href="/blogs">Blogs</Nav.Link>
              <Nav.Link href="/contact">Contact</Nav.Link>
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
                  type="submit"
                  style={{ border: "1px solid white", marginLeft: "1rem" }}
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
                          className="btn"
                          style={{ color: "rgb(70,70,255)", fontSize: 16 }}
                        >
                          {authState.username}
                        </a>
                      </div>
                      <Button
                        className="d-block w-100"
                        style={{ fontSize: "16px" }}
                        onClick={() => {
                          localStorage.removeItem("accessToken");
                          setAuthSate({ ...authState, status: false });
                          navigate("/login");
                        }}
                      >
                        Logout
                      </Button>
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
