const express = require("express");
const router = express.Router();
const blogs = require("./blogs");
const contact = require("./contact");
const products = require("./products");
const auth = require("./auth");
const account = require("./account");
const cart = require("./cart");
const search = require("./search");
const order = require("./order");
const notification = require('./notification');

router.get("/users");
router.use("/blogs", blogs);
router.use("/contact", contact);
router.use("/products", products);
router.use("/auth", auth);
router.use("/account", account);
router.use("/cart", cart);
router.use("/order", order);
router.use("/search", search);
router.use('/notification', notification);

router.use("/", (req, res) => res.send("NOT FOUND"));

module.exports = router;
