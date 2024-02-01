import React, { useContext, useEffect } from "react";
import "../Assets/SCSS/index.scss";
import { Container } from "react-bootstrap";
import BlogList from "../components/BlogList";
import CurrentPageContext from "../helpers/CurrentPageContext";
export default function Blogs(props) {

  const { setPageState } = useContext(CurrentPageContext);
  useEffect(() => setPageState("blogs"), [setPageState]);

  return (
    <Container>
      <h1 className="heading">Newfeed</h1>
      <BlogList typeBlog={"all"} />
    </Container>
  );
}
