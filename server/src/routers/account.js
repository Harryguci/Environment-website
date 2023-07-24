const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/Authentication");
const User = require("../app/models/User");

router.get("/", validateToken, async function (req, res) {
  // console.log("[ACCOUNT]", req.user.username); 
  const currentUser = await User.findOne({ username: req.user.username });
  res.send({
    id: currentUser._id,
    username: currentUser.username,
    email: currentUser.email,
  });
});

module.exports = router;
