import { useEffect, useState, useContext, useRef, useLayoutEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
  Table,
} from "react-bootstrap";
import AuthContext from "../helpers/Authcontext";
import axios from "axios";
export default function OrderList() {
  const { authState } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  const orderCostRef = useRef(null);

  useEffect(() => {
    if (authState.id)
      axios
        .get(`/order/user/${authState.id}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          if (response.data.error) console.log(response.error);
          else {
            setOrders(response.data);
          }
        });
  }, [authState.id]);

  const formatMoney = (number) => {
    return number.toLocaleString('en-US', { style: 'currency', currency: 'VND' });
  }

  return (
    <Container>
      <Row>
        <h2 className="fs-1 fw-bold">Đơn hàng đã đặt</h2>
      </Row>
      <Row>
        <Col>
          <div>
            {orders && orders.length ? (
              <Table>
                <thead>
                  <tr>
                    {/* <th>Id</th> */}
                    <th>Sản phẩm</th>
                    <th>Giá tiền</th>
                    <th>SDT</th>
                    <th>Địa chỉ</th>
                    <th>Trạng thái</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr>
                      {/* <td>{order._id}</td> */}
                      <td>{order.product_name}</td>
                      <td ref={orderCostRef}>{formatMoney(order.cost)}</td>
                      <td>{order.phone}</td>
                      <td>{order.address}</td>
                      <td>{order.status}</td>
                      <td>{order.note}</td>
                    </tr>
                  ))}
                </tbody>
                {/* {orders.map((order) => (
                  
                ))} */}
              </Table>
            ) : (
              <h2
                className="text-center my-4 fs-2 opacity-50"
              >
                Chưa có đơn hàng nào
              </h2>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
