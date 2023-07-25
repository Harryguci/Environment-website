const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/Authentication");
const User = require("../app/models/User");

router.get("/:username", async function (req, res) {
  const queryUsername = req.params.username;
  var currentUser;

  console.log("USERNAME ", queryUsername);

  if (queryUsername) {
    currentUser = await User.findOne({ username: queryUsername }).then((user) =>
      user.toObject()
    );
  } else {
    currentUser = await User.findOne({ username: req.user.username }).then(
      (user) => user.toObject()
    );
  }
  res.send({
    id: currentUser._id,
    username: currentUser.username,
    email: currentUser.email,
    phone: currentUser.phone,
    website: currentUser.website,
    birthday: currentUser.birthday,
  });
});

router.post("/change", validateToken, async function (req, res) {
  const data = req.body;
  const id = req.body.id;
  console.log(data);

  const user = await User.findOneAndUpdate(
    { _id: id },
    {
      phone: data.phone,
      website: data.website,
    },
    {
      new: true,
    }
  ).then((user) => user.toObject());

  res.send(user);
});

router.get("/", validateToken, async function (req, res) {
  const currentUser = await User.findOne({ username: req.user.username }).then(
    (user) => user.toObject()
  );

  res.send({
    id: currentUser._id,
    username: currentUser.username,
    email: currentUser.email,
    phone: currentUser.phone,
    website: currentUser.website,
    birthday: { type: Date, default: "" },
  });
});

module.exports = router;
