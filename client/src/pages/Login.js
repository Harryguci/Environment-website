import React, { useEffect, useMemo } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import LoginForm from "../components/LoginForm";
// import "../Assets/SCSS/login.scss";
import "../Assets/CSS/login.scss";
export default function Login() {
  // const [type, setType] = useState("login");

  const centerFlex = useMemo(() => ({
    display: "flex",
    justifyContent: "center",
    background: '#f6f5f7',
    height: '100%',
  }), []);

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
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          background: 'rgb(240, 240, 240)',
        }}
      >
        <div className="position-absolute" style={{ bottom: 30, left: 30 }}>
          <a className="custom-btn primary-blue d-block my-auto" href="/">
            Trang chủ
          </a>
        </div>
        <LoginForm />

      </main>
    </React.Fragment>
  );
}
