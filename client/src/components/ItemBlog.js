import ReactPlayer from "react-player";
import { useState, useEffect, useContext, memo } from "react";
import { Button } from "react-bootstrap";
import "../Assets/SCSS/components/showMoreBtn.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../helpers/Authcontext";

function ItemBlog({ blog, user, handleDeleteBlog }, key) {
  const [showMore, setShowMore] = useState(false);
  const [blogState, setBlogState] = useState(blog);
  const [userState, setUserState] = useState(user);

  useEffect(() => {
    setBlogState(blog);
  }, [blog]);

  useEffect(() => {
    setUserState(user);
  }, [user]);

  const { authState } = useContext(AuthContext);

  return (
    <li
      key={key}
      className="list-group-item border-0 mb-5 user-blog-container__list__item"
    >
      <div className="info">
        <h3>@{userState.username}</h3>
        <p style={{ whiteSpace: "pre-line" }}>
          {showMore ? blogState.detail : blogState.detail.substring(0, 400)}
          <button
            className="show-more-btn"
            onClick={(e) => setShowMore(!showMore)}
          >
            {showMore ? "ẩn bớt" : "...xem thêm"}
          </button>
        </p>
      </div>
      <div className="d-flex media">
        {blogState.files &&
          blogState.files.length &&
          blogState.files.map((file) => (
            <div key={file.filename}>
              {file.mimetype.indexOf("video") !== -1 ? (
                <div className="video-section">
                  <ReactPlayer
                    url={`/blogs/${file.filename}`}
                    width="100%"
                    height="auto"
                    playing={false}
                    controls={true}
                  />
                </div>
              ) : (
                <div className="thumbnail h-100 d-flex justify-content-center align-items-center">
                  <img
                    src={`/blogs/${file.filename}`}
                    alt="SFIT"
                    width={100 + "%"}
                    height={100 + "%"}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
            </div>
          ))}
      </div>

      {authState.id === user.id && <div className="control mt-4 d-flex justify-content-end">
        <Button className="custom-btn" onClick={handleDeleteBlog}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </div>}
    </li>
  );
}

export default memo(ItemBlog);