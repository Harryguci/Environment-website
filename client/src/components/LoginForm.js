import React, { useState, useEffect, useContext } from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../helpers/Authcontext";

export default function LoginForm({ type, changeType }) {
  const [form, setForm] = useState({
    name: "login-form",
    id: "login-form",
    action: "http://localhost:3001/auth/login",
    method: "POST",
  });

  const { setAuthSate } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (type === "signup") {
      setForm((prev) => ({
        name: "signup-form",
        id: "login-form",
        action: "http://localhost:3001/auth/signup",
        method: prev.method,
      }));
    } else {
      setForm({
        name: "login-form",
        id: "login-form",
        action: "http://localhost:3001/auth/login",
        method: "POST",
      });
    }
  }, [type]);
  let navigate = useNavigate();
  const LoginHandle = async (e) => {
    const data = { username: username, password: password };
    await axios
      .post("http://localhost:3001/auth/login", data)
      .then((response) => {
        if (response.data.error) alert(response.data.error);
        else {
          localStorage.setItem("accessToken", response.data);
          setAuthSate({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      })
      .catch((error) => alert(error));

    navigate("/");
  };

  const SignupHandle = async (e) => {
    const data = { username: username, password: password, email: email };
    await axios
      .post("http://localhost:3001/auth/signup", data)
      .then((response) => {
        if (response.data.error) alert(response.data.error);
        else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthSate({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      })
      .catch((error) => alert(error));

    navigate("/");
  };

  const formHandleSubmit = async (e) => {
    if (type === "login") {
      await LoginHandle(e);
    } else {
      await SignupHandle(e);
    }
  };

  return (
    <React.Fragment>
      <Form
        name={form.name}
        id={form.id}
        className="mt-3"
        method={form.method}
        action={form.action}
        style={{ fontSize: 16 + "px" }}
        onSubmit={(e) => e.preventDefault()}
      >
        <FormControl
          type="text"
          name="username"
          placeholder="username"
          value={username}
          style={{ fontSize: 16 + "px" }}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormControl
          type="password"
          name="password"
          placeholder="password"
          value={password}
          style={{ fontSize: 16 + "px" }}
          onChange={(e) => setPassword(e.target.value)}
        />
        {type !== "login" && (
          <>
            <FormControl
              type="re-password"
              name="re-password"
              placeholder="again password"
              style={{ fontSize: 16 + "px" }}
            />
            <FormControl
              type="email"
              name="email"
              placeholder="email"
              value={email}
              style={{ fontSize: 16 + "px" }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}
        <Button
          className="mt-3"
          type="button"
          style={{ fontSize: 16 + "px" }}
          onClick={formHandleSubmit}
        >
          {type === "login" ? "Login" : "Sign Up"}
        </Button>
        <Button
          className="mt-3"
          type="button"
          style={{ fontSize: 16 + "px" }}
          onClick={() => changeType(type === "login" ? "signup" : "login")}
        >
          {type !== "login" ? "Login" : "Sign Up"}
        </Button>
      </Form>
    </React.Fragment>
  );
}
