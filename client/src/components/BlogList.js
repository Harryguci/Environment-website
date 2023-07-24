import React, { useState, useEffect } from "react";
import Widget from "./Widget";
import "../Assets/SCSS/index.scss";
import axios from "axios";
import { Button } from "react-bootstrap";

export default function BlogList({ limits, children, typeBlog }, ...props) {
  const [blogs, setBlogs] = useState([]);
  const [limitState, setLimitState] = useState(limits || 10);
  useEffect(() => {
    var type = "moi-truong";
    if (typeBlog) type = typeBlog;

    axios
      .get(`http://localhost:3001/blogs/${type}`, {
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
        blogs
          .slice(0, limitState)
          .map((blog, index) => (
            <Widget
              index={index}
              key={index + 1}
              typeWidget={index % 2 === 0 ? `left` : "right"}
              heading={blog.title.trim()}
              description={blog.detail.trim()}
              link={`http://localhost:3000/blogs/${blog.userId}/${blog.title}`}
              imageUrl={`http://localhost:3001/blogs/${blog.imageUrl}`}
              author={blog.username}
            />
          ))) ||
        "Not found"}
      <div className="d-flex justify-content-center">
        <Button
          className="custom-btn"
          // style={{ fontSize: 16 }}
          onClick={(e) => setLimitState((prev) => prev + 5)}
        >
          Xem thêm..
        </Button>
      </div>
    </>
  );
}
