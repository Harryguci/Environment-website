import { useState, useRef, useCallback, memo } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import "../Assets/SCSS/components/alert.scss";
function AlertDismissible({ hide, heading, content, type }) {
  const id = useRef("alert" + ((Math.random() * 1000) % 100));
  const [show] = useState(true);

  const handleHide = useCallback((e) => {
    document.getElementById(id.current).classList.add("hidden");
    setTimeout(() => {
      hide();
    }, 500);
  }, [hide]);

  return (
    <>
      <div
        className="position-fixed w-100 h-100"
        style={{ background: "rgba(0,0,0,0.5)", top: 0, left: 0 }}
        onClick={handleHide}
      ></div>
      <Alert
        id={id.current}
        show={show}
        variant={type}
        className="p-5"
        style={{
          zIndex: 500,
          fontSize: "1.6rem",
          maxWidth: 500,
          boxShadow: "10px 10px 5rem rgba(0, 0, 255, 0.3)",
        }}
      >
        <Alert.Heading className="fs-1 fw-bold">{heading}</Alert.Heading>
        <p className="fs-4">{content}</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button
            className="fs-3"
            onClick={handleHide}
            variant="outline-success"
          >
            Close
          </Button>
        </div>
      </Alert>
    </>
  );
}

export default memo(AlertDismissible);
