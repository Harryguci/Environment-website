const express = require("express");
const router = express.Router();
const Blog = require("../app/models/Blogs");

const { validateToken } = require("../middleware/Authentication");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    var Path = path.join(__dirname, "..", "..", "public", "blogs");
    callback(null, Path);
  },
  filename: (req, file, callback) => {
    var fileID = path.extname(file.originalname);
    var userId = req.userId;

    callback(
      null,
      file.originalname.substring(0, file.originalname.lastIndexOf(".")) +
        fileID
    );
  },
});

const upload = multer({ storage });

router.get("/user/:id", validateToken, async function (req, res) {
  const userId = req.params.id;

  const blogs = await Blog.find({ userId: userId }).then(function (query) {
    query = Array.from(query);
    query = query.map((blog) => blog.toObject());
    return query;
  });
  res.send(blogs);
});

// /blogs/top
router.get("/top", async (req, res) => {
  await Blog.find({})
    .then((query) => {
      query = Array.from(query);
      query = query.map((blog) => blog.toObject());

      res.send(query);
    })
    .catch((err) => next(err));
});

// /blogs/moi-truong
router.get("/moi-truong", async (req, res) => {
  await Blog.find({})
    .then((query) => {
      query = Array.from(query);
      query = query.map((blog) => blog.toObject());

      res.send(query);
    })
    .catch((err) => next(err));
});

// moi-truong,
router.get("/all", async (req, res) => {
  await Blog.find({})
    .then((query) => {
      query = Array.from(query);
      query = query.map((blog) => blog.toObject());

      res.send(query);
    })
    .catch((err) => next(err));
});

router.post("/", upload.array("files", 12), async (req, res) => {
  const data = req.body;
  console.log("BLOGS POST", req.files);

  var blog = new Blog({
    title: data.title,
    description: data.detail.substring(0, 200),
    detail: data.detail,
    userId: data.userId,
    files: [...req.files],
  });

  await blog.save();

  res.send(blog);
});

module.exports = router;
