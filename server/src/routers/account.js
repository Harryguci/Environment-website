const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/Authentication");
const User = require("../app/models/User");
const accountController = require("../app/controllers/AccountController");

router.get("/:username", accountController.showByUsername);

router.post("/change", validateToken, accountController.changeInfo);

// [For Development]
router.get("/all/delete", async (req, res) => {
  await User.deleteMany({})
    .then((response) => res.send(response))
    .catch((err) => res.send(err));
});

// [For Development]
router.get("/all/info", async (req, res) => {
  await User.find({})
    .then((response) => res.send(response))
    .catch((err) => res.send(err));
});

router.get("/", validateToken, accountController.showCurrentAccount);

module.exports = router;
