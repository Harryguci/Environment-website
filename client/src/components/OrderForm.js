import { useState, useEffect } from "react";
import { Form, FormControl, FormLabel, Button } from "react-bootstrap";
import "../Assets/SCSS/components/orderForm.scss";
import AlertDismissible from "./AlertDismissable";

export default function OrderForm({ product, user, hide, CbSuccess }) {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [alert, setAlert] = useState({});
  const [successOrder, setSuccessOrder] = useState(false);

  useEffect(() => {
    console.log(hide);
  }, [hide]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/order/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accessToken: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        product: product,
        user: user,
        address: address,
        phone: phone,
        note: note,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSuccessOrder(true);
        } else {
          setAlert({
            heading: "Lỗi",
            type: "danger",
            content: "Đặt hàng không thành công",
            hide: () => hide(),
          });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (successOrder) {
      fetch("/cart/delete/single", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accessToken: localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({
          productId: product._id,
          userId: user.id,
        }),
      }).then((value) => {
        console.log(value);
        setAlert({
          heading: "Thành công",
          type: "success",
          content: "Đặt hàng thành công",
          hide: () => hide(),
        });
        CbSuccess();
      });
    }
  }, [hide, product._id, product.id, successOrder, user.id, CbSuccess]);

  return (
    <>
      {alert && alert.heading && <AlertDismissible {...alert} />}
      <div className="background-dark" style={{zIndex: 100}} onClick={(e) => hide && hide()}></div>
      <div className="order-form-container center" style={{zIndex: 101}} onSubmit={handleSubmit}>
        <Button
          className="position-absolute m-0 danger"
          style={{ right: -15, top: -15 }}
          onClick={(e) => hide && hide()}
        >
          X
        </Button>
        <div>
          <h2 className="heading">Đặt hàng</h2>
        </div>
        <Form className="w-100">
          <div>
            <FormLabel>
              Sản phẩm
              <FormControl
                style={{ fontSize: 16 }}
                type="text"
                disabled
                value={product.name}
              />
            </FormLabel>
          </div>
          <div>
            <FormLabel>
              Giá tiền
              <FormControl
                style={{ fontSize: 16 }}
                type="text"
                name="cost"
                disabled
                value={product.cost}
              />
            </FormLabel>
          </div>
          <div>
            <FormLabel>
              Địa chỉ
              <FormControl
                style={{ fontSize: 16 }}
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </FormLabel>
          </div>
          <div>
            <FormLabel>
              SDT
              <FormControl
                style={{ fontSize: 16 }}
                type="text"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </FormLabel>
          </div>
          <div>
            <FormLabel>
              Ghi chú
              <FormControl
                style={{ fontSize: 16 }}
                type="text"
                name="phone"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </FormLabel>
          </div>
          <div>
            <Button className="custom-btn primary" type="submit">
              Send
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
