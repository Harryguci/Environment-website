const express = require("express");
const Product = require("../app/models/Product");
const router = express.Router();
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

// /products
router.get("/all", async function (req, res) {
  await Product.find({})
    .then((query) => {
      query = Array.from(query);
      query = query.map((product) => product.toObject());
      res.send(query);
    })
    .catch((err) => next(err));
});

router.get("/user/:id", validateToken, async function (req, res) {
  const userId = req.params.id;

  const products = await Product.find({ userId: userId }).then(function (
    query
  ) {
    query = Array.from(query);
    query = query.map((product) => product.toObject());
    return query;
  });
  res.send(products);
});

router.post("/", upload.array("files", 12), async (req, res) => {
  const data = req.body;
  // console.log("PRODUCTS POST", req.files);
  console.log("PRODUCTS POST", req.body);
  var imgUrl = "NoImage.jpg";

  if (
    req.files &&
    req.files[0] &&
    req.files[0].mimetype.indexOf("image") !== -1
  )
    imgUrl = req.files[0].filename;

  var product = new Product({
    name: data.detail.substring(0, 50),
    description: data.detail.toString(),
    userId: data.userId,
    cost: data.cost,
    remain: data.remain,
    files: [...req.files],
    imageUrl: imgUrl,
  });

  await product.save().catch((err) => console.log(err));

  res.redirect("http://localhost:3000/account");
});

router.get("/single/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  console.log(req.params);

  const product = await Product.findById(id)
    .then((response) => response.toObject())
    .catch((err) => {
      console.log(err);
    });

  res.send(product);
});

router.get("/", async function (req, res) {
  await Product.find({})
    .then((query) => {
      query = Array.from(query);
      query = query.map((product) => product.toObject());

      res.send(query);
    })
    .catch((err) => next(err));
});

module.exports = router;
