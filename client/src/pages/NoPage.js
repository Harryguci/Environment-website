import { useEffect } from "react";

import { Container, Row, Col } from "react-bootstrap";
import ActiveNavLink from "../helpers/ActiveNavLink";
export default function NoPage() {
  useEffect(() => {
    var url = window.location.href;
    if (url.indexOf("about") !== -1) ActiveNavLink("about");
    if (url.indexOf("contact") !== -1) ActiveNavLink("contact");
  }, []);

  return (
    <Container>
      <Row>
        <Col
          className="d-flex justify-content-center align-items-center"
          style={{ height: 50 + "vh" }}
        >
          <div className="">
            <h1 className="fw-bold" style={{ fontSize: "10rem", color: "red" }}>
              404
            </h1>
            <h1 className="fw-bold" style={{ fontSize: "5rem", color: "red" }}>
              Không tìm thấy trang.
            </h1>
            <p>
              Hoặc tính năng đang được nâng cấp.
              <br /> Vui lòng quay lại sau.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
