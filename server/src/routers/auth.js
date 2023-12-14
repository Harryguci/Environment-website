const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();

const crypto = require("crypto");
const db = require("../config/db/mongodb");
const User = require("../app/models/User");
const { sign } = require("jsonwebtoken");

const { validateToken } = require("../middleware/Authentication");

async function Check(username, password) {
  var res = false;

  if (username && password) {
    res = await User.findOne({
      username: username,
      password: password,
    })
      .then((user) => user.toObject())
      .catch((err) => false);
  } else if (username) {
    res = await User.findOne({
      username: username,
    })
      .then((user) => user.toObject())
      .catch((err) => false);
  }

  return res ? true : false;
}

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log(`username:::${username}, pass::::${password}`);
    var check = await Check(username, password);
    if (check) {
      return done(null, {
        username,
        password,
        active: true,
      });
    }
    done(null, false);
  })
);

passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser(async (username, done) => {
  console.log(`deserializeUser:::`, username);
  //check username
  if (await Check(username)) {
    return done(null, {
      username,
      active: true,
    });
  }
  done(null, false);
});

router.get("/login", function (req, res, next) {
  res.send("login");
});

// [POST] /auth/login
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: `${process.env.URI || 'https://localhost:3001'}/login`,
  }),
  async (req, res, next) => {
    const user = await User.findOne({ username: req.user.username });

    console.log("LOGIN post", user._id);

    const accessToken = sign(
      {
        username: user.username,
        id: user._id,
        role: user.role
      },
      "importantsecret"
    );

    res.send(accessToken);
  }
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/signup", function (req, res, next) {
  res.render("signup");
});

async function CheckAccountExist(req, res, next) {
  const data = req.body;

  await User.findOne({ username: data.username }).then((user) =>
    user ? res.send({ error: "Tài khoản đã tồn tại" }) : next()
  );
}

router.post("/signup", CheckAccountExist, async function (req, res, next) {
  const data = req.body;

  const user = new User({
    username: data.username,
    password: data.password,
    email: data.email,
    role: data.user || 'user'
  });

  await user
    .save()
    .then((user) => console.log("Sign", user))
    .catch((err) => console.log(err));

  const accessToken = sign(
    { username: user.username, id: user._id },
    "importantsecret"
  );

  res.send({ token: accessToken, username: user.username, id: user._id, role: user.role });
});

router.get("/auth", validateToken, (req, res) => {
  res.send(req.user);
});

module.exports = router;
