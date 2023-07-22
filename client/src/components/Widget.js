import { useEffect, useState, useReducer } from "react";
import { Container, Row, Col, ListGroup, ListGroupItem } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "../Assets/SCSS/components/widget.scss";
export default function Widget(
  { heading, description, links, imageUrl, typeWidget },
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
    <Container className={"widget " + props.className} key={props.key}>
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
              <h1 style={heading.length > 50 ? { fontSize: "3rem" } : {}}>
                {heading || "HEADING"}
              </h1>
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
              {links && (
                <div className="d-flex">
                  {links.map((link, index) => (
                    <a
                      className="custom-btn mx-1"
                      key={index + 1}
                      href={link.href}
                    >
                      {link.icon === "faHeart" ? (
                        <FontAwesomeIcon icon={faHeart} />
                      ) : (
                        link.content
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </Row>
        </Col>
        <Col md={6}>
          <Row>
            <div className="widget__thumbnail">
              <div className="thumbnail">
                <img src={imageUrl} alt="SFIT" />
              </div>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
