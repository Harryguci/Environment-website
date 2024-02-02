import React, { useState, useEffect, memo, useRef, lazy, Suspense } from "react";
import "../Assets/SCSS/index.scss";
import { Button, Container } from "react-bootstrap";
// import Widget from "./Widget";
import axios from "axios";
import LoadingCard from '../components/LoadingCard';

const Widget = lazy(() => import(
  './Widget'));

var captureImage = function (video, scale = 1) {
  var canvas = document.createElement("canvas");
  canvas.width = video.videoWidth * scale;
  canvas.height = video.videoHeight * scale;
  canvas.getContext('2d')
    .drawImage(video, 0, 0, canvas.width, canvas.height);

  var img = document.createElement("img");
  img.src = canvas.toDataURL();
};

function BlogList({ limits, typeBlog, autoChangeLimits }, ...props) {
  const [blogs, setBlogs] = useState([]);
  const [limitState, setLimitState] = useState(limits || 5);
  const [remain, setRemain] = useState(true);

  const [pageIndex, setPageIndex] = useState(1);
  const [isFetch, setIsFetch] = useState(false);
  const container = useRef(null);

  useEffect(() => {
    if (!autoChangeLimits) return;

    function handle(event) {
      let scroll = window.scrollY;

      if (container.current.scrollHeight - scroll <= 200) {
        HandleChangeLimits();
      }
    }

    window.addEventListener('scroll', handle);

    return () => window.removeEventListener('scroll', handle);
  }, [container.current])

  useEffect(() => {
    if (!remain) return;

    let type = "all";
    if (typeBlog) type = typeBlog;

    setIsFetch(false);

    axios
      .get(`/blogs/${type}?limits=${limitState}&pageIndex=${pageIndex}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((data) => {
        if (data.data.error) return console.log(data.data.error);
        else {
          var temps = data.data;
          temps = temps.map((blog) => {
            if (blog.files && blog.files.length > 0
              && blog.files[0].mimetype.indexOf("image") !== -1) {
              blog.imageUrl = blog.files[0].filename;
            } else {
              blog.imageUrl = "NoImage.jpg";
            }

            setIsFetch(true);
            return blog;
          });
          //temps.reverse();
          setBlogs(temps);

          if (temps.length < limitState) setRemain(false);
        }
      })
      .catch((err) => alert(err));
  }, [limitState, pageIndex, typeBlog]);

  const HandleChangeLimits = () => {
    setLimitState((prev) => prev + 5);
  };

  return (
    <div className="blog-list" ref={container}>
      {blogs &&
        blogs.length > 0 &&
        blogs
          .map((blog, index) => (
            <Suspense fallback=
              {<LoadingCard
                key={index}
                style={{ height: '30rem', marginBottom: '1rem' }}
              />}>
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
            </Suspense>
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

      {remain && blogs && <div className="d-flex justify-content-center">
        <Button
          className="custom-btn"
          onClick={HandleChangeLimits}
        >
          Xem thêm..
        </Button>
      </div>}
    </div>
  );
}


export default memo(BlogList);
