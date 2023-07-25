import ProductFrame from "../components/ProductFrame";
import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import ActiveNavLink from "../helpers/ActiveNavLink";
export default function Products(props) {
  useEffect(() => ActiveNavLink("products"), []);

  return (
    <>
      <Container className="my-5">
        <h1>Sản Phẩm</h1>
      </Container>
      <ProductFrame />
    </>
  );
}
