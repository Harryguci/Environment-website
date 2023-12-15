const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/Authentication");
const productController = require('../app/controllers/ProductController')
const upload = require('../middleware/upload');

router.get("/single/:id", validateToken, productController.showProductById);

router.get("/user/:id", validateToken, productController.showByUserId);

router.post("/delete/single", validateToken, productController.deleteOne);

router.get("/all", productController.showAll);

router.post("/", upload.array("files", 12), productController.uploadNewProduct);

router.get("/", productController.showAll);

module.exports = router;
