const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const router = require("./routers");
const mongodb = require("./config/db/mongodb");

const session = require("express-session");
const store = session.MemoryStore();
// const store = session.MemoryStore();
const passport = require("passport");

app.use(
  session({
    secret: "keyboard cat",
    cookie: { maxAge: 1000 * 10 }, // 10s
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongodb.connect();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(cors());

app.use("/", router);

app.listen(port, () => console.log(`listen on http://localhost:${port}`));
