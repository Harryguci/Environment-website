import React, { useState, useEffect, useContext, memo } from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../helpers/Authcontext";
import AlertDismissible from "./AlertDismissable";

function LoginForm() {

  // const [formType, setFormType] = useState("login");
  const { authState, setAuthSate } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({});

  useEffect(() => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });
    signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });
    return () => {
      signUpButton.removeEventListener('click', () => {
        container.classList.add("right-panel-active");
      });
      signInButton.removeEventListener('click', () => {
        container.classList.remove("right-panel-active");
      });
    };
  }, []);

  const validateLogin = ({ username, password }) => {
    let usernameReg = /[a-zA-Z0-9_]{3,50}/;
    let passwordReg = /[a-zA-Z0-9_]{6,}/;
    return usernameReg.test(username) && passwordReg.test(password);
  };

  const validateSign = ({ username, password, repassword, email }) => {
    let usernameReg = /[a-zA-Z0-9_]{3,50}/;
    let passwordReg = /[a-zA-Z0-9_]{6,50}/;
    console.log(password, repassword);
    return (
      usernameReg.test(username) &&
      passwordReg.test(password) &&
      password === repassword
    );
  };

  const navigate = useNavigate();

  const LoginHandle = async (e) => {
    e.preventDefault();
    const data = { username: username, password: password };

    if (!validateLogin(data)) {
      setAlert({
        heading: "Không thành công",
        type: "danger",
        content:
          `Thông tin không hợp lệ. 
          Username phải có độ dài trên 3
           ký tự và không chứa ký tự đặc biệt. 
           Password có độ dài trên 6 ký tự và 
           không có ký tự đặc biệt`,
        hide: () => setAlert({}),
      });
      return;
    }

    await axios
      .post("/auth/login", data)
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          setAlert({
            type: "danger",
            heading: "Đăng nhập không thành công !!",
            content:
              "Đăng nhập không thành công, hãy kiểm tra lại thông tin của bạn.",
            hide: () => setAlert({}),
          });
        } else {
          localStorage.setItem("accessToken", response.data);

          setAuthSate({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });

          setAlert({
            type: "success",
            heading: "Đăng nhập thành công !!",
            content: "Đăng nhập thành công !!",
            hide: () => setAlert({}),
          });

          navigate("/");
          // After replacing the url, 
          // manually calling navigate(0) 
          // will refresh the page automatically!
          navigate(0);
        }
      })
      .catch((error) =>
        setAlert({
          type: "danger",
          heading: "Đăng nhập không thành công !!",
          content:
            "Đăng nhập không thành công, hãy kiểm tra lại thông tin của bạn.",
          hide: () => setAlert({}),
        })
      );
  };

  const SignupHandle = async (e) => {
    e.preventDefault();
    const data = { username: username, password: password, email: email };

    if (!validateSign({ username, password, repassword, email })) {
      setAlert({
        heading: "Signup failed",
        type: "danger",
        content:
          "Thông tin không hợp lệ. Username phải có độ dài trên 3 ký tự và không chứa ký tự đặc biệt. Password có độ dài trên 6 ký tự và không có ký tự đặc biệt",
        hide: () => setAlert({}),
      });
      return;
    }

    await axios
      .post("/auth/signup", data)
      .then((response) => {
        if (response.data.error) {
          setAlert({
            type: "danger",
            heading: "Không thành công",
            content:
              "Đăng ký tài khoản không thành công, hãy kiểm tra lại thông tin của bạn, " +
              response.data.error,
            hide: () => setAlert({}),
          });
        } else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthSate({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });

          setAlert({
            type: "success",
            heading: "Đăng ký tài khoản thành công",
            content: "Đăng ký tài khoản thành công !!",
            hide: () => {
              setAlert({});
              navigate("/");
              navigate(0);
            },
          });
        }
      })
      .catch((error) => {
        setAlert({
          type: "danger",
          heading: "Đăng ký tài khoản không thành công",
          content:
            "Đăng ký tài khoản không thành công, hãy kiểm tra lại thông tin của bạn",
          hide: () => setAlert({}),
        });
      });

    await fetch("/cart/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accessToken: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        id: authState.id,
        products_id: [],
      }),
    })
      .then((response) => console.log(response))
      .catch((error) => console.log(error.message));
  };

  return (
    <React.Fragment>
      {alert && alert.heading && <AlertDismissible {...alert} />}
      <div class="container my-auto" id="container">
        <div class="form-container sign-up-container">
          <form action="/auth/signup" onSubmit={(e) => SignupHandle(e)}>
            <h1 style={{ fontSize: '3rem' }}>Create Account</h1>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Username" name='username' value={username} onChange={e => setUsername(e.target.value)} />
            <input type="email" placeholder="Email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
            <input type="password" placeholder="Again Password" value={repassword} onChange={e => setRepassword(e.target.value)} />
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div class="form-container sign-in-container">
          <form action="/auth/login" onSubmit={(e) => LoginHandle(e)}>
            <h1 style={{ fontSize: '3rem' }}>Login</h1>
            <span>or use your account</span>
            <input type="text" placeholder="Username" name="username" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
            <Link to="/">Forgot your password?</Link>
            <button type="submit">Login</button>
          </form>
        </div>
        <div class="overlay-container">
          <div class="overlay">
            <div class="overlay-panel overlay-left">
              <h1 style={{ fontSize: '3rem' }}>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button class="ghost" id="signIn">Login</button>
            </div>
            <div class="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button class="ghost" id="signUp">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default memo(LoginForm);