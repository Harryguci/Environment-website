import { Container } from "react-bootstrap";
import BlogList from "../components/BlogList";
import ProductFrame from "../components/ProductFrame";
export default function Home(props) {
  return (
    <div className="App">
      <section className="section-blogs">
        <Container className="mt-5">
          <a href="/blogs" className="btn heading text-center my-5">News Feed</a>
        </Container>
        <BlogList limits={1} />
      </section>
      <section className="section-products mt-5">
        <Container className="mt-5">
          <a href="/products" className="btn heading text-center mb-5">Products</a>
        </Container>
        <ProductFrame />
      </section>
    </div>
  );
}
