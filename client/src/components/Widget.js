import { useEffect, useState, useReducer } from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";

// eslint-disable-next-line no-unused-vars
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line no-unused-vars
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import "../Assets/SCSS/components/widget.scss";
export default function Widget(
  {
    heading,
    description,
    link,
    imageUrl,
    typeWidget,
    author,
    className,
    index,
  },
  ...props
) {
  const [showAllDescription, setShowAllDescription] = useReducer(
    (prev) => !prev,
    false
  );

  const [displayDescription, setDisplayDescription] = useState(
    description.substring(0, 100)
  );

  useEffect(() => {
    if (showAllDescription) {
      setDisplayDescription(description);
    } else setDisplayDescription(description.substring(0, 200) + `...`);
  }, [description, showAllDescription]);

  return (
    <Container className={"widget" + (className ? ` ${className}` : '')} key={props.key}>
      <Row
        className="justify-content-center"
        style={
          typeWidget === "right"
            ? { flexDirection: "row-reverse" }
            : { flexDirection: "row" }
        }
      >
        <Col md={6} className="d-flex align-items-center">
          <Row>
            <div className="widget__content-container px-3">
              <a href={link}>
                {index <= 1 && (
                  <Badge bg="secondary fs-5 bg-danger mb-2">New</Badge>
                )}
                <h3>
                  {heading || "HEADING"}
                  <p className="fw-light">
                    Tác giả: <b className="fw-bold">{author}</b>
                  </p>
                </h3>
              </a>
              <p className="widget__description">
                {displayDescription || "some content..."}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: `rgb(100, 100, 255)`,
                  }}
                  onClick={setShowAllDescription}
                >
                  {!showAllDescription ? `xem thêm` : "ẩn bớt"}
                </button>
              </p>
            </div>
          </Row>
        </Col>
        <Col md={6}>
          <Row>
            <a href={link} className="d-block widget__thumbnail">
              <div className="thumbnail">
                {imageUrl ? <img src={imageUrl} alt="SFIT" /> : <></>}
              </div>
            </a>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
