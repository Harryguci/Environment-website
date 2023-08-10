const express = require("express");
const router = express.Router();
const contactController = require('../app/controllers/ContactController')

router.get("/", contactController.showInfo);
router.post("/", contactController.sendMessage);

module.exports = router;
