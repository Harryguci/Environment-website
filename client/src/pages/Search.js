import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  FormControl,
  FormLabel,
  Button,
} from "react-bootstrap";
import axios from "axios";
import AlertDismissible from "../components/AlertDismissable";
import "../Assets/SCSS/search.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
export default function Search() {
  const [search, setSearch] = useState();
  const [query, setQuery] = useState(useParams().q || "");
  const [result, setResult] = useState({
    users: [],
    products: [],
    blogs: [],
  });
  const [alert, setAlert] = useState({});

  useEffect(() => {
    console.log(query);
    if (query) setSearch(query);
  }, [query]);

  useEffect(() => {
    const sendSearch = () => {
      //   console.log(search);
      axios
        .get(`/search?q=${search}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          setResult({
            users: response.data.users,
            products: response.data.products,
            blogs: response.data.blogs,
          });
          //   console.log(response);
        })
        .catch((error) => {
          setAlert({
            type: "danger",
            heading: "Có lỗi xảy ra",
            content: "Error: " + error.message,
            hide: () => setAlert({}),
          });
        });
    };

    if (search) sendSearch();
  }, [search]);

  return (
    <>
      <Container className="search-container">
        <Row>
          <Col>
            <div className="d-flex justify-content-center">
              <FormLabel
                className="w-100 d-flex gap-1"
                style={{ maxWidth: "50rem" }}
              >
                <Button
                  className="my-auto fw-bold fs-1 bg-light px-4 rounded-2 m-0 h-100 text-dark border-0"
                  style={{ flex: "0 0 auto" }}
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Button>
                <FormControl
                  className="fs-4 py-3"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </FormLabel>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              <h2 className="heading">Users</h2>
              {(result && result.users && result.users.length && (
                <ListGroup id="search-users" className="px-5">
                  {result.users.slice(0, 5).map((user) => (
                    <ListGroupItem key={user._id}>
                      <a
                        className="fs-2 fw-bold text-decoration-none"
                        href={`/account/${user.username}`}
                      >
                        {user.username}
                      </a>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )) || (
                <p className="fs-3 opacity-50">
                  Không tìm thấy kết quả phù hợp
                </p>
              )}
            </div>
            <div>
              <h2 className="heading">Blogs</h2>
              {(result &&
                result.blogs &&
                result.blogs.length &&
                result.blogs.slice(0, 5).map((blog) => (
                  <ListGroup id="search-blogs" key={blog._id} className="px-5">
                    <ListGroupItem>
                      <div className="d-flex">
                        <a
                          className="fs-2 fw-bold text-decoration-none"
                          href={`/blogs/single/${blog._id}`}
                        >
                          {blog.title.substring(0, 60)}
                        </a>
                        <a
                          href={`/account?user=${blog.username}`}
                          style={{ marginLeft: "auto", marginRight: 0 }}
                        >
                          <small className="fs-5 fw-thin opacity-50">
                            {blog.username}
                          </small>
                        </a>
                      </div>
                      <p>{blog.description.substring(0, 300)}....</p>
                    </ListGroupItem>
                  </ListGroup>
                ))) || (
                <p className="fs-3 opacity-50">
                  Không tìm thấy kết quả phù hợp
                </p>
              )}
            </div>
            <div>
              <h2 className="heading">Products</h2>
              {(result && result.products && result.products.length && (
                <ListGroup id="search-blogs" className="px-5">
                  {result.products.slice(0, 5).map((product) => (
                    <ListGroupItem key={product._id}>
                      <a
                        className="fs-2 fw-bold text-decoration-none"
                        href={`/products/single/${product._id}`}
                      >
                        {product.name}
                      </a>
                      <p>{product.description.substring(0, 250)} </p>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )) || (
                <p className="fs-3 opacity-50">
                  Không tìm thấy kết quả phù hợp
                </p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
      {alert && alert.heading && <AlertDismissible {...alert} />}
    </>
  );
}
