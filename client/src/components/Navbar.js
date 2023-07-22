import { useState } from "react";
import { Container, Navbar, Nav, FormControl, Button } from "react-bootstrap";
import React from "react";
import "../Assets/SCSS/navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBars } from "@fortawesome/free-solid-svg-icons";

function NavbarCustom(props) {
  const [search, setSearch] = useState("");

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    if (!search) alert("Please enter some content");
    else e.target.submit();
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
              <Nav.Link className="active" href="/">
                Home
              </Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/products">Products</Nav.Link>
              <Nav.Link href="/blogs">Blogs</Nav.Link>
              <Nav.Link href="/contact">Contact</Nav.Link>
            </Nav>
            <div>
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
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </React.Fragment>
  );
}

export default NavbarCustom;
