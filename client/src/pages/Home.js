import { Container } from "react-bootstrap";
import BlogList from "../components/BlogList";
import ProductFrame from "../components/ProductFrame";
import { Link } from "react-router-dom";
export default function Home(props) {
  return (
    <div className="App">
      <section className="section-blogs">
        <Container className="mt-5">
          <Link to="/blogs" className="btn heading text-center my-5">News Feed</Link>
        </Container>
        <BlogList limits={1} />
      </section>
      <section className="section-products mt-5">
        <Container className="mt-5">
          <Link to="/products" className="btn heading text-center mb-5">Products</Link>
        </Container>
        <ProductFrame />
      </section>
    </div>
  );
}
