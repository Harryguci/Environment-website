const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/Authentication");
const blogsController = require("../app/controllers/BlogsController");
const upload = require('../middleware/upload');

router.get("/user/:id", validateToken, blogsController.getByUserId);

// /blogs/top
router.get("/top", blogsController.showTop);

// /blogs/moi-truong
router.get("/moi-truong", blogsController.showAboutEnvironment);

// moi-truong,
router.get("/all", blogsController.showAll);

router.get("/single/:id", validateToken, blogsController.showSingle);

router.post("/delete/single", validateToken, blogsController.deleteSingle);

router.post("/edit/:id", validateToken, blogsController.edit);

router.post("/", upload.array("files", 12), blogsController.uploadOne);

module.exports = router;
