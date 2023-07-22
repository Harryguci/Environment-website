const express = require("express");
const router = express.Router();
const db = require("../config/db");
// /blogs/top
router.get("/top", async (req, res) => {
  var data = await db.getBlogs();
  res.send(data);
});

// /blogs/moi-truong
router.get("/moi-truong", async (req, res) => {
  var limits = 100;
  const data = await db.getBlogs();
  res.send(data);
});

router.get("/all", async (req, res) => {
  var limits = 100;
  const data = await db.getBlogs();
  res.send(data);
});

module.exports = router;
