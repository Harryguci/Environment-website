import React, { useEffect, useMemo } from "react";
import LoginForm from "../components/LoginForm";
import "../Assets/CSS/login.scss";
import { Link } from "react-router-dom";
export default function Login() {
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
          <Link className="custom-btn primary-blue d-block my-auto" to="/home">
            Trang chủ
          </Link>
        </div>
        <LoginForm />

      </main>
    </React.Fragment>
  );
}
