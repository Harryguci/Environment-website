import React, { useState, useEffect } from "react";
import Widget from "./Widget";
import "../Assets/SCSS/index.scss";
import axios from "axios";
export default function BlogList({ limits, children, typeBlog }, ...props) {
  const [blogs, setBlogs] = useState([]);
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
        else setBlogs(data.data);
      })
      .catch((err) => alert(err));
  }, [typeBlog]);

  useEffect(() => {
    if (!limits) limits = 10;
  }, []);

  return (
    <>
      {(blogs &&
        blogs
          .slice(0, limits)
          .map((blog, index) => (
            <Widget
              key={index + 1}
              className="widget-header"
              typeWidget={index % 2 === 0 ? `left` : "right"}
              heading={blog.title.trim()}
              description={blog.description.trim()}
              links={blog.links}
              imageUrl={`http://localhost:3001/blogs/${blog.files[0].filename}`}
            />
          ))) ||
        "Not found"}
    </>
  );
}
