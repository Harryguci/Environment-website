import {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useMemo,
  useCallback,
  memo
} from "react";
import {
  Form,
  FormControl,
  FormLabel,
  Button
} from "react-bootstrap";
import "../Assets/SCSS/components/formBlog.scss";
import AuthContext from "../helpers/Authcontext";
import axios from "axios";

function FormProduct({ user: userInfo }) {
  const { authState } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [detailState, setDetailState] = useState("");
  const [cost, setCost] = useState();
  const [remain, setRemain] = useState();

  const [isChangeTextarea, setIsChangeTextarea] = useState(false);
  const [files, setFiles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const [previewUrl, setPreviewUrl] = useState([]);

  useEffect(() => {
    setUser({
      username: authState.username,
      id: authState.id,
      email: userInfo.email,
      phone: userInfo.phone,
      website: userInfo.website,
      birthday: userInfo.birthday,
    });
  }, [authState, userInfo.birthday, userInfo.email, userInfo.phone, userInfo.website]);

  useLayoutEffect(() => {
    var urls = [];

    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.indexOf("audio") !== -1) {
          urls.push("/NoImage.jpg");
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
    axios.post("/products", {
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

  const typeList = useMemo(() => (
    <div className="my-4">
      <p className="fw-bold">Loại hàng</p>
      <Form.Check
        type="checkbox"
        name={`type`}
        id={`thoi-trang`}
        label={`Thời trang`}
      />
      <Form.Check
        type="checkbox"
        name={`type`}
        id={`do-gia-dung`}
        label={`Đồ gia dụng`}
      />
      <Form.Check
        type="checkbox"
        name={`type`}
        id={`do-dung-hoc-tap`}
        label={`Đồ dùng học tập`}
      />
      <Form.Check
        type="checkbox"
        name={`type`}
        id={`phu-kien`}
        label={`Phụ kiện`}
      />
      <Form.Check
        type="checkbox"
        name={`type`}
        id={`trang-tri`}
        label={`Decor - Trang trí`}
      />
      <Form.Check
        type="checkbox"
        name={`type`}
        id={`do-luu-niem`}
        label={`Đồ lưu niệm`}
      />
      <Form.Check
        type="checkbox"
        name={`other`}
        id={`other`}
        label={`Khác`}
      />
    </div>
  ), []);

  const HandlePreview = useCallback(() => (
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
  ), [previewUrl])

  return (
    <Form
      className="blog-posting-form mx-sm-2 mx-md-5"
      action="/products/"
      method="POST"
      enctype="multipart/form-data"
    >
      <div className="position-relative">
        <FormControl
          as="textarea"
          name="detail"
          className="position-relative"
          rows={3}
          value={
            !isChangeTextarea
              ? `${user.username}, Mô tả sản phẩm của bạn`
              : detailState
          }
          onChange={(e) => setDetailState(e.target.value)}
          onFocus={() => setIsChangeTextarea(true)}
          disabled={user.phone ? false : true}
        />
        {!user.phone && (
          <p className="text-danger mt-3 fw-bold">
            Bạn phải cập nhật SĐT để đăng sản phẩm
          </p>
        )}
      </div>

      <FormLabel className="d-block my-4">
        <b>Giá bán</b>
        <FormControl
          className="w-100"
          type="number"
          name="cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="Đơn vị VND"
        />
      </FormLabel>

      <FormLabel className="d-block my-4">
        <b>Số lượng</b>
        <FormControl
          className="w-100"
          type="number"
          name="remain"
          value={remain}
          onChange={(e) => setRemain(e.target.value)}
          placeholder="Number"
        />
      </FormLabel>

      {typeList}

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
            onChange={HandleChangeFiles}
          />
          <span className="d-block py-3 w-100 text-center">
            Thêm Ảnh / Video
          </span>
        </FormLabel>
        <div className="d-none">
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

export default memo(FormProduct);