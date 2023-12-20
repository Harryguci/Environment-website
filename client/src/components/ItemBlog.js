import ReactPlayer from "react-player";
import {
  useState,
  useEffect,
  useContext,
  memo,
  useReducer
} from "react";
import { Button } from "react-bootstrap";
import "../Assets/SCSS/components/showMoreBtn.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faComment, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../helpers/Authcontext";
import '../Assets/SCSS/components/blogitem.scss';
import Submenu from "./Submenu";
import BlogComment from "./BlogComment";

function ItemBlog({ blog, user, handleDeleteBlog }, key) {
  const [showMore, setShowMore] = useState(false);
  const [blogState, setBlogState] = useState(blog);
  const [userState, setUserState] = useState(user);
  const [showSettingMenu, setShowSettingMenu]
    = useReducer(prev => !prev, false);

  const [showComment, setShowComment] = useState(false);

  useEffect(() => {
    setBlogState(blog);
  }, [blog]);

  useEffect(() => {
    setUserState(user);
  }, [user]);

  const { authState } = useContext(AuthContext);

  return (
    <li key={key}
      className="blog-item list-group-item border-0 mb-5 user-blog-container__list__item">
      <div className="info">
        <div class="d-flex blog-item__header">
          <h4 style={{ marginBottom: '1rem' }}>
            @{userState.username}
          </h4>
          {authState.id === user.id &&
            <button className="btn blog-item__show-setting-btn"
              onClick={setShowSettingMenu}>
              <FontAwesomeIcon
                icon={faEllipsis}
                style={{ color: 'blue' }} />
            </button>}
          {showSettingMenu &&
            <Submenu items={[
              {
                content: 'Edit status',
                link: `/blogs/edit/${blog._id}`
              }
            ]}
              id=''
              className=""
              style={{
                position: 'absolute',
                right: 0,
                top: 10,
                transform: 'translate(50%, 100%)'
              }} />}
        </div>
        <h3>{blogState.title}</h3>
        <p style={{ whiteSpace: "pre-line" }}>
          {showMore ?
            blogState.detail :
            blogState.detail.substring(0, 400)}
          <button
            className="show-more-btn"
            onClick={(e) => setShowMore(!showMore)}
          >
            {showMore ? "ẩn bớt" : "...xem thêm"}
          </button>
        </p>
      </div>
      <div className="d-flex media">
        {blogState &&
          blogState.files &&
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
      <div className="control mt-4 d-flex justify-content-end gap-1">
        <Button className="btn text-primary" style={{
          background: 'none',
          border: 'none',
        }}
          onClick={() => setShowComment(prev => !prev)}>
          <FontAwesomeIcon style={{ fontSize: 2 + 'rem' }} icon={faComment} />
        </Button>

        {authState.id === user.id
          &&
          <Button className="custom-btn" onClick={handleDeleteBlog}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        }
      </div>
      {showComment &&
        <div className="comment-container">
          <BlogComment blog={blog} />
        </div>}
    </li>
  );
}

export default memo(ItemBlog);