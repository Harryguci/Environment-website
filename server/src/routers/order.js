const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/Authentication");
const Order = require("../app/models/Order");

router.post("/create", validateToken, async function (req, res, next) {
  const data = req.body;

  if (req.user.id !== data.user.id) {
    res.send({
      error: "Invalid",
    });
  } else {
    const newOrder = new Order({
      product_id: data.product._id,
      buyer_id: data.user.id,
      cost: data.product.cost,
      address: data.address,
      phone: data.phone,
      note: data.note,
    });

    await newOrder.save();

    res.send({ success: true });
  }
});

router.get("/user/:id", validateToken, async (req, res, next) => {
  if (req.user.id !== req.params.id) res.send({ error: "Can not get" });
  else {
    await Order.find({ buyer_id: req.params.id })
      .then((query) => query.map((order) => order.toObject()))
      .then((query) => res.send(query));
  }
});

router.get("/all", validateToken, async (req, res, next) => {
  await Order.find({})
    .then((query) => query.map((order) => order.toObject()))
    .then((query) => res.send(query));
});

module.exports = router;
