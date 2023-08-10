import React from "react";
import "../Assets/SCSS/index.scss";
import { Container } from "react-bootstrap";
import BlogList from "../components/BlogList";
export default function Blogs(props) {
  return (
    <Container>
      <h1 className="heading">Blogs</h1>
      <BlogList typeBlog={"all"} />
    </Container>
  );
}
