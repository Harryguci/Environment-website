const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/Authentication");
const orderController = require("../app/controllers/OrderController");

router.post("/create", validateToken, orderController.createNewOrder);

router.get("/user/:id", validateToken, orderController.showByUserId);

router.get("/all", orderController.showAll);

module.exports = router;
