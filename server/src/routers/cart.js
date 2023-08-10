const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/Authentication");
const cartController = require('../app/controllers/CartController')

router.post("/delete", validateToken, cartController.deleteAllProductInCart);

router.post("/add/:buyer_id", validateToken, cartController.addOneByBuyerId);

router.post("/delete/single", validateToken, cartController.deleteSingleProduct);

router.get("/single/:buyer_id", validateToken, cartController.showByBuyerId);

router.post("/create", validateToken, cartController.createNewCart);

router.get("/all/delete", cartController.deleteAll);

router.get("/all", cartController.showAll);

module.exports = router;
