import { useState, useEffect, useContext, useLayoutEffect } from "react";
import { Form, FormControl, FormLabel, Button } from "react-bootstrap";
import "../Assets/SCSS/components/formBlog.scss";
import AuthContext from "../helpers/Authcontext";
import axios from "axios";

export default function FormBlog() {
  const { authState } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [detailState, setDetailState] = useState("");

  const [isChangeTextarea, setIsChangeTextarea] = useState(false);
  const [files, setFiles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const [previewUrl, setPreviewUrl] = useState([]);

  useEffect(() => {
    setUser({
      username: authState.username,
      id: authState.id,
    });
  }, [authState]);

  useLayoutEffect(() => {
    var urls = [];

    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.indexOf("audio") !== -1) {
          urls.push("/logo192.png");
        } else urls.push(URL.createObjectURL(files[i]));
      }
    }

    setPreviewUrl(urls);

    return () => {
      if (files && files.length) {
        for (let i = 0; i < files.length; i++) {
          URL.revokeObjectURL(files[i]);
        }
      }
    };
  }, [files]);

  const HandleChangeFiles = (e) => {
    setFiles((prev) => {
      let value = e.target.files;
      setShowPreview(true);
      e.target.files = null;
      console.log(value);

      return value;
    });
  };

  // eslint-disable-next-line no-unused-vars
  const HandleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/blogs", {
      title: detailState,
      description: detailState,
      detail: detailState,
      userId: user.id,
      files: files,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return (
    <Form
      className="blog-posting-form mx-sm-2 mx-md-5"
      action="http://localhost:3001/blogs/"
      method="POST"
      enctype="multipart/form-data"
      // onSubmit={HandleSubmit}
    >
      <div>
        <FormControl
          as="textarea"
          name="detail"
          rows={3}
          value={
            !isChangeTextarea
              ? `${user.username}, bạn đang nghĩ gì`
              : detailState
          }
          onChange={(e) => setDetailState(e.target.value)}
          onFocus={() => setIsChangeTextarea(true)}
        />
      </div>
      {showPreview && previewUrl && previewUrl.length && (
        <div className="preview-container">
          {previewUrl.map((url, index) => (
            <div
              key={index + 1}
              className="thumbnail"
              style={{ width: 300, height: 300 }}
            >
              <img className="preview" src={url} alt="SFIT" />
            </div>
          ))}
        </div>
      )}

      <div className="d-flex gap-2">
        <FormLabel
          className="d-block custom-btn p-0 m-0"
          style={{ flex: "0 0 50%" }}
        >
          <FormControl
            type="file"
            name="files"
            accept=".jpg, .jpeg, .png, .mp3, .mp4"
            multiple
            onChange={HandleChangeFiles}
          />
          <span className="d-block py-3 w-100 text-center">
            Thêm Ảnh / Video
          </span>
        </FormLabel>
        <div className="d-none">
          <input
            type="text"
            name="description"
            value={detailState}
            onChange={(e) => setDetailState(e.target.value)}
          />
          <input
            type="text"
            name="title"
            value={detailState}
            onChange={(e) => setDetailState(e.target.value)}
          />
          <input
            type="text"
            name="userId"
            value={user.id}
            onChange={(e) => setUser({ ...user, id: e.target.id })}
          />
        </div>
        <Button type="submit" style={{ flex: "0 0 20%" }}>
          Post
        </Button>
      </div>
    </Form>
  );
}
