const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema({
  name: { type: String, default: "", required: true },
  imageUrl: { type: String, default: "" },
  description: { type: String, default: "", required: true },
  cost: { type: Number, default: "" },
  create_at: { type: Date, default: new Date() },
  update_at: { type: Date, default: new Date() },
  deleted: { type: Boolean, default: false },
  remain: { type: Number, default: 0 },
  userId: { type: String, default: "" },
  files: { type: Array, default: [] },
  type: { type: String, default: "other" },
});

const model = mongoose.model("products", Product);
module.exports = model;
