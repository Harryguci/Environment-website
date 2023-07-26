const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/Authentication");
const Cart = require("../app/models/Cart");
const Product = require("../app/models/Product");

router.post("/delete", validateToken, async function (req, res) {
  if (user.id !== buyer_id) res.send({ error: "Can not handle the order" });
  var user = req.user;
  var data = req.body;

  await Cart.findOneAndUpdate({ buyer_id: user.id }, { products_id: [] });
});

router.post("/add/:buyer_id", validateToken, async function (req, res) {
  var buyer_id = req.params.buyer_id;
  if (req.user.id !== buyer_id) res.send({ error: "Can not handle the order" });

  var user = req.user;
  var data = req.body;

  // console.log("[Data]", JSON.stringify(data));

  var cart = await Cart.findOne({ buyer_id: user.id })
    .then((cart) => cart.toObject())
    .catch((error) => {
      res.send({ error: error.message });
    });

  var set = new Set([...cart.products_id, data.product_id]);

  // Cart.property.findOneAndUpdate({filter}, {new object});
  if (data.product_id)
    await Cart.findOneAndUpdate(
      { buyer_id: user.id },
      {
        buyer_id: cart.buyer_id,
        products_id: Array.from(set),
      },
      { new: true }
    );

  await Cart.findOne({ buyer_id: user.id }).then((cart) => cart.toObject());

  res.send(cart);
});

router.post("/delete/single", validateToken, async (req, res, next) => {
  const data = req.body;
  // console.log(req.user.id);
  if (req.user.id !== data.userId) {
    res.send({
      error: "Invalid",
    });
  } else {
    var current = await Cart.findOne({ buyer_id: req.user.id })
      .then((cart) => cart.toObject())
      .then((cart) => cart.products_id);
    // console.log("\n\n\t\t\t[current products]", current);

    current = current.filter((product) => product !== data.productId);
    await Cart.findOneAndUpdate(
      { buyer_id: req.user.id },
      { products_id: [...current] }
    )
      .then((value) => res.send(value))
      .catch((err) => res.send(err));
  }
});

// [GET] /cart/single/:buyer_id
router.get("/single/:buyer_id", validateToken, async function (req, res) {
  // console.log("BUYER ID", req.params.buyer_id);
  if (req.params.buyer_id !== req.user.id)
    res.send({ errors: "Cart not found" });

  var cart = await Cart.findOne({ buyer_id: req.params.buyer_id })
    .then((cart) => cart.toObject())
    .then(async (cart) => {
      var products = [];

      for (var i = 0; i < cart.products_id.length; i++) {
        var product = await Product.findById(cart.products_id[i])
          .then((product) => product.toObject())
          .catch((err) => {});
        // console.log(product);
        if (product) products.push(product);
      }

      cart.products = products;
      return cart;
    })
    .catch((err) => null);

  if (cart) {
    // console.log('[cart products]', cart.products.length);
    res.send(cart);
  } else res.send({ errors: "Cart not found" });
});

router.post("/create", validateToken, async (req, res, next) => {
  const user = req.user;
  const data = req.body;

  const cart = new Cart({
    buyer_id: user.id,
    products_id: data.products_id || [],
  });

  await cart.save();
  res.send(cart);
});

router.get("/all/delete", async function (req, res) {
  await Cart.deleteMany({})
    .then((response) => res.send(response))
    .catch((error) => res.send(error));
});

router.get("/all", async (req, res) => {
  await Cart.find({})
    .then((query) => {
      query = query.map((doc) => doc.toObject());
      return query;
    })
    .then((query) => res.send(query));
});

module.exports = router;
