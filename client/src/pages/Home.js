import { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import BlogList from "../components/BlogList";
import ProductFrame from "../components/ProductFrame";
import CurrentPageContext from "../helpers/CurrentPageContext";
export default function Home(props) {
  const { setPageState } = useContext(CurrentPageContext);

  useEffect(() => setPageState("home"), [setPageState]);

  return (
    <div className="App">
      <section className="section-blogs">
        <Container className="mt-5">
          <h1 className="heading text-center my-5">Blogs</h1>
        </Container>
        <BlogList limits={1} />
      </section>
      <section className="section-products mt-5">
        <Container className="mt-5">
          <h1 className="heading text-center mb-5">Products</h1>
        </Container>
        <ProductFrame />
      </section>
    </div>
  );
}
