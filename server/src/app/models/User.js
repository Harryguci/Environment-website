const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  username: { type: String, default: "", required: true },
  password: { type: String, default: "", required: true },
  deleted: { type: Boolean, default: false },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  website: { type: String, default: "" },
  birthday: { type: Date, default: "" },
  role: { type: String, default: "user" }
});

const model = mongoose.model("users", User);
module.exports = model;
