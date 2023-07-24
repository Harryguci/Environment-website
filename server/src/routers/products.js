const express = require("express");
const Product = require("../app/models/Product");
const router = express.Router();
const { validateToken } = require("../middleware/Authentication");

// /products
router.get("/all", async function (req, res) {
  await Product.find({})
    .then((query) => {
      query = Array.from(query);
      query = query.map((product) => product.toObject());
      res.send(query);
    })
    .catch((err) => next(err));
});

router.get("/", async function (req, res) {
  await Product.find({})
    .then((query) => {
      query = Array.from(query);
      query = query.map((product) => product.toObject());

      res.send(query);
    })
    .catch((err) => next(err));
});

module.exports = router;
