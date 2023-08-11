import React, { useState, useEffect, memo } from "react";
import Widget from "./Widget";
import "../Assets/SCSS/index.scss";
import axios from "axios";
import { Button, Container } from "react-bootstrap";
import ActiveNavLink from "../helpers/ActiveNavLink";

function BlogList({ limits, typeBlog }, ...props) {
  const [blogs, setBlogs] = useState([]);
  const [limitState, setLimitState] = useState(limits || 10);

  useEffect(() => {
    ActiveNavLink("blogs");
  }, []);

  useEffect(() => {
    let type = "moi-truong";
    if (typeBlog) type = typeBlog;

    axios
      .get(`/blogs/${type}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((data) => {
        if (data.data.error) return console.log(data.data.error);
        else {
          var temps = data.data;
          temps = temps.map((blog) => {
            if (blog.files && blog.files[0].mimetype.indexOf("image") !== -1) {
              blog.imageUrl = blog.files[0].filename;
            } else {
              blog.imageUrl = "NoImage.jpg";
            }
            return blog;
          });

          setBlogs(temps.reverse());
        }
      })
      .catch((err) => alert(err));
  }, [typeBlog]);

  return (
    <>
      {(blogs &&
        blogs.length &&
        blogs
          .slice(0, limitState)
          .map((blog, index) => (
            <Widget
              index={index}
              key={index + 1}
              typeWidget={index % 2 === 0 ? `left` : "right"}
              heading={
                blog.title.trim().substring(0, 50) +
                (blog.title.length >= 50 ? "..." : "")
              }
              description={blog.detail.trim()}
              link={`/blogs/single/${blog._id}`}
              imageUrl={`/blogs/${blog.imageUrl}`}
              author={blog.username}
            />
          ))) || (
          <Container>
            <h2
              className="fs-2 text-center my-5 px-3 py-4 rounded-3 opacity-50"
              style={{ background: "rgba(0,0,0,0.05)" }}
            >
              Chưa có blog nào
            </h2>
          </Container>
        )}
      {blogs.length > limitState && (
        <div className="d-flex justify-content-center">
          <Button
            className="custom-btn"
            onClick={(e) => setLimitState((prev) => prev + 5)}
          >
            Xem thêm..
          </Button>
        </div>
      )}
    </>
  );
}


export default memo(BlogList);
