import React, { useState, useEffect } from "react";
import Widget from "./Widget";
import "../Assets/SCSS/index.scss";

export default function BlogList({ limits, children, typeBlog }, ...props) {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    var type = "moi-truong";
    if (typeBlog) type = typeBlog;

    fetch(`http://localhost:3001/blogs/${type}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setBlogs(data);
      });
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
              imageUrl={blog.imageUrl}
            />
          ))) ||
        "Not found"}
    </>
  );
}
