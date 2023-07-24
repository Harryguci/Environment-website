const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema({
  name: { type: String, default: "", required: true },
  imageUrl: { type: String, default: "", required: true },
  description: { type: String, default: "", required: true },
  cost: { type: String, default: "" },
  create_at: { type: Object, default: "" },
  remain: { type: Number, default: 0 },
});

const model = mongoose.model("products", Product);
module.exports = model;
