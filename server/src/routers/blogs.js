const express = require("express");
const router = express.Router();
const Blog = require("../app/models/Blogs");
const User = require("../app/models/User");
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
router.get("/top", async (req, res, next) => {
  await Blog.find({})
    .then((query) => {
      query = Array.from(query);
      query = query.map((blog) => blog.toObject());

      res.send(query);
    })
    .catch((err) => next(err));
});

// /blogs/moi-truong
router.get("/moi-truong", async (req, res, next) => {
  await Blog.find({})
    .then((query) => {
      query = Array.from(query);
      query = query.map((blog) => blog.toObject());

      res.send(query);
    })
    .catch((err) => next(err));
});

// moi-truong,
router.get("/all", async (req, res, next) => {
  await Blog.find({})
    .then(async (query) => {
      query = Array.from(query);
      query = query.map((blog) => blog.toObject());

      for (var i = 0; i < query.length; i++) {
        var username = await User.findById(query[i].userId).then(
          (user) => user.toObject().username
        );
        query[i].username = username;
      }

      res.send(query);
    })
    .catch((err) => next(err));
});

router.get("/single/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  console.log(req.params);
  
  const blog = await Blog.findById(id)
    .then((blog) => blog.toObject())
    .catch((err) => {
      console.log(err);
    });

  res.send(blog);
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

  res.redirect("http://localhost:3000/account");
});

module.exports = router;
