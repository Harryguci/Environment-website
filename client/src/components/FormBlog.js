import {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  memo,
  useMemo,
  useCallback
} from "react";
import {
  Form,
  FormControl,
  FormLabel,
  Button
} from "react-bootstrap";
import "../Assets/SCSS/components/formBlog.scss";
import AuthContext from "../helpers/Authcontext";
import TextareaAutoHeight from "./TextareaAutoHeight";
import '../Assets/SCSS/customFormControl.scss';

function FormBlog() {
  const { authState } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [titleState, setTitleState] = useState("");
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
    let urls = [];

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

  const HandlePreview = useCallback(
    () => (
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
      </div>),
    [previewUrl]);


  const defaultUserInfo = useMemo(() => (
    <>
      <input
        type="text"
        name="description"
        value={detailState}
        onChange={(e) => setDetailState(e.target.value)}
      />
      <input
        type="text"
        name="userId"
        value={user.id}
        onChange={(e) => setUser({ ...user, id: e.target.id })}
      />
    </>
  ), [detailState, user]);


  const HandleChangeFiles = (e) => {
    setFiles((prev) => {
      let value = e.target.files;
      setShowPreview(true);
      e.target.files = null;
      console.log(value);

      return value;
    });
  };

  return (
    <Form
      className="blog-posting-form mx-sm-2 mx-md-5"
      action="/blogs/"
      method="POST"
      encType="multipart/form-data"
    >
      <div>
        <FormControl
          className="heading"
          style={{
            fontWeight: 'bold',
            boxShadow: 'none',
            width: '100%',
            fontSize: '2rem',
          }}
          name="title"
          value={titleState}
          onChange={(e) => setTitleState(e.target.value)}
          onFocus={() => setIsChangeTextarea(true)}
          placeholder={`${user.username}, hãy viết tiêu đề`}
          required
        />
      </div>
      <div>
        <TextareaAutoHeight
          id={'detail'}
          value={!isChangeTextarea
            ? `Bạn đang nghĩ gì`
            : detailState}
          handleChange={setDetailState}
          handleFocus={() => setIsChangeTextarea(true)}
          required={true}
        />
      </div>
      {showPreview && previewUrl && previewUrl.length && (
        <HandlePreview />
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
            // value={files}
            onChange={HandleChangeFiles}
          />
          <span className="d-block py-3 w-100 text-center">
            Thêm Ảnh / Video
          </span>
        </FormLabel>
        <div className="d-none">
          {defaultUserInfo}
        </div>
        <Button
          type="submit"
          style={{ flex: "0 0 20%" }}
          disabled={detailState ? false : true}
        >
          Post
        </Button>
      </div>
    </Form>
  );
}


export default memo(FormBlog);
