import ProductFrame from "../components/ProductFrame";
import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import CurrentPageContext from "../helpers/CurrentPageContext";
export default function Products(props) {
  const { setPageState } = useContext(CurrentPageContext);
  useEffect(() => setPageState("products"), [setPageState]);
  
  return (
    <>
      <Container className="my-5">
        <h1 className="heading">Sản Phẩm</h1>
      </Container>
      <ProductFrame />
    </>
  );
}
