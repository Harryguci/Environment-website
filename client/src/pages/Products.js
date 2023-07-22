import ProductFrame from "../components/ProductFrame";
import React from "react";
import { Container } from "react-bootstrap";

export default function Products(props) {
  return (
    <>
      <Container className="my-5">
        <h1>Sản Phẩm</h1>
      </Container>
      <ProductFrame />
    </>
  );
}
