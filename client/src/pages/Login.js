import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "../components/LoginForm";

import "../Assets/SCSS/login.scss";
export default function Login({ typeForm }) {
  const [type, setType] = useState("login");

  const centerFlex = {
    display: "flex",
    justifyContent: "center",
  };

  useEffect(() => {
    if (typeForm) setType(typeForm);
  }, [typeForm]);

  useEffect(() => {
    return () => {
      const queryParameters = new URLSearchParams(window.location.search);
      const isFailed = queryParameters.get("failed");
      if (isFailed === true || isFailed === "true") {
        alert("Please check your information");
      }
    };
  }, []);

  return (
    <React.Fragment>
      <main
        className="login-container"
        style={{
          width: "100%",
          minHeight: "100vh",
        }}
      >
        <div className="position-absolute" style={{ bottom: 30, left: 30 }}>
          <a className="custom-btn primary-blue d-block my-auto" href="/">
            Trang chủ
          </a>
        </div>
        <Container>
          <div id="heading-container">
            <h1>SFIT</h1>
          </div>
          <Row style={centerFlex}>
            <Form type={type} changeType={setType} />
          </Row>
        </Container>
      </main>
    </React.Fragment>
  );
}
