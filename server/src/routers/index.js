const express = require("express");
const router = express.Router();
const blogs = require("./blogs");
const contact = require("./contact");
const products = require("./products");
const auth = require("./auth");
const account = require("./account");
router.get("/users");
router.use("/blogs", blogs);
router.use("/contact", contact);
router.use("/products", products);
router.use("/auth", auth);
router.use("/account", account);

router.use("/", (req, res) => res.send("NOT FOUND"));

module.exports = router;
