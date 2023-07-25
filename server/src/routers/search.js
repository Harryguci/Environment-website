const express = require("express");
const router = express.Router();
const Blogs = require("../app/models/Blogs");
const Products = require("../app/models/Product");
const User = require("../app/models/User");

router.get("/", async (req, res, next) => {
  const query = req.query.q.toLocaleLowerCase();
  const result = {
    blogs: [],
    products: [],
    users: [],
  };

  const promiseUser = User.find({}).then((users) => {
    users = users.map((user) => user.toObject());
    users = users.filter(
      (user) => user.username.toLocaleLowerCase().indexOf(query) !== -1
    );
    return users;
  });

  const promiseProducts = Products.find({}).then((products) => {
    products = products.map((product) => product.toObject());
    products = products.filter(
      (product) => product.name.toLocaleLowerCase().indexOf(query) !== -1
    );
    return products;
  });

  const blogsBlogs = Blogs.find({})
    .then((blogs) => {
      blogs = blogs.map((blog) => blog.toObject());
      blogs = blogs.filter(
        (blog) => blog.title.toLocaleLowerCase().indexOf(query) !== -1
      );
      return blogs;
    })
    .then(async (blogs) => {
      for (var i = 0; i < blogs.length; i++) {
        var username = await User.findById(blogs[i].userId).then(
          (user) => user.toObject().username
        );
        blogs[i].username = username;
      }

      return blogs;
    });

  await Promise.all([promiseUser, promiseProducts, blogsBlogs])
    .then((value) => {
      result.users = value[0];
      result.products = value[1];
      result.blogs = value[2];
      return result;
    })
    .then((result) => result)
    .catch((error) => console.log(error));
  console.log(result);

  res.send(result);
});

module.exports = router;
