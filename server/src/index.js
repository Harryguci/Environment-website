const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const router = require("./routers");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(cors());

app.use("/", router);

app.listen(port, () => console.log(`listen on http://localhost:${port}`));
