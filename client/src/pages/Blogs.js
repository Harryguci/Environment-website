import React from "react";
import "../Assets/SCSS/index.scss";
import { Container } from "react-bootstrap";
import BlogList from "../components/BlogList";
export default function Blogs(props) {
  return (
    <Container>
      <BlogList typeBlog={"all"} />
    </Container>
  );
}
