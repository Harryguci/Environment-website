import "bootstrap/dist/css/bootstrap.css";
import React, { useState, useEffect, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./Assets/SCSS/index.scss";
// import "./Assets/SCSS/custom/custom.scss";

import AuthContext from "./helpers/Authcontext";
import axios from "axios";

import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Account from "./pages/Account";
import BlogSingle from "./pages/BlogSingle";
import ProductSingle from "./pages/ProductSingle";
import Search from "./pages/Search";

function App() {
  const [authState, setAuthSate] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    // console.log("Get user information");
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthSate({
            ...authState,
            status: false,
          });
          console.log(response.data.error);
        } else {
          setAuthSate({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthSate }}>
        <BrowserRouter>
          <Routes>
            <Route
              index
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/blogs"
              element={
                <Layout>
                  <Blogs />
                </Layout>
              }
            />
            <Route
              path="/blogs/single/:id"
              element={
                <Layout>
                  <BlogSingle />
                </Layout>
              }
            />
            <Route
              path="/products"
              element={
                <Layout>
                  <Products />
                </Layout>
              }
            />
            <Route
              path="/products/single/:id"
              element={
                <Layout>
                  <ProductSingle />
                </Layout>
              }
            />
            <Route
              path="/account"
              element={
                <Layout>
                  <Account />
                </Layout>
              }
            />
            <Route
              path="/search/:q"
              element={
                <Layout>
                  <Search />
                </Layout>
              }
            />
            <Route
              path="/search"
              element={
                <Layout>
                  <Search />
                </Layout>
              }
            />
            <Route path="/login" element={<Login typeForm={"login"} />} />
            <Route path="/signup" element={<Login typeForm={"signup"} />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
