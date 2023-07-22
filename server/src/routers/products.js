const express = require("express");
const db = require("../config/db");
const router = express.Router();

// /products
router.get("/all", async function (req, res) {
  const data = await db.getProducts();
  res.send(data);
});

router.get("/", async function (req, res) {
  const data = await db.getProducts();
  res.send(data);
});

module.exports = router;
