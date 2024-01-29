import React, { useState, useEffect, memo, useCallback, useMemo } from "react";
import Widget from "./Widget";
import "../Assets/SCSS/index.scss";
import axios from "axios";
import { Button, Container } from "react-bootstrap";
import ActiveNavLink from "../helpers/ActiveNavLink";
import LoadingCard from '../components/LoadingCard';

function BlogList({ limits, typeBlog }, ...props) {
  const [blogs, setBlogs] = useState([]);
  const [limitState, setLimitState] = useState(limits || 5);
  const [pageIndex, setPageIndex] = useState(1);
  const [isFetch, setIsFetch] = useState(false);

  useEffect(() => {
    ActiveNavLink("blogs");
  }, []);

  useEffect(() => {
    let type = "all";
    if (typeBlog) type = typeBlog;

    axios
      .get(`/blogs/${type}?limits=${limitState}&pageIndex=${pageIndex}`, {
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

            setIsFetch(true);
            return blog;
          });
          //temps.reverse();
          setBlogs(temps);
        }
      })
      .catch((err) => alert(err));
  }, [limitState, pageIndex, typeBlog]);

  const HandleChangeLimits = () => {
    setLimitState((prev) => prev + 5);
  };

  return (
    <>
      {blogs &&
        blogs.length > 0 &&
        blogs
          .map((blog, index) => (
            <Widget
              index={index}
              key={index + 1}
              typeWidget={index % 2 === 0 ? `left` : "right"}
              heading={blog.title}
              description={blog.detail.trim().substring(0, 100)}
              link={`/blogs/single/${blog._id}`}
              imageUrl={`/blogs/${blog.imageUrl}`}
              author={blog.username}
            />
          ))}
      {isFetch && (!blogs || blogs.length === 0) && (
        <Container>
          <h2
            className="fs-2 text-center my-5 px-3 py-4 rounded-3 opacity-50"
            style={{ background: "rgba(0,0,0,0.05)" }}
          >
            Chưa có blog nào
          </h2>
        </Container>
      )}

      {!isFetch &&
        <Container>
          {Array.from({ length: limitState }).map((it, index) =>
            <LoadingCard
              key={index}
              style={{ height: '30rem', marginBottom: '1rem' }}
            />)}
        </Container>
      }

      {blogs && <div className="d-flex justify-content-center">
        <Button
          className="custom-btn"
          onClick={HandleChangeLimits}
        >
          Xem thêm..
        </Button>
      </div>}
    </>
  );
}


export default memo(BlogList);
