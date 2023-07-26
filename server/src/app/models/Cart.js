const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cart = new Schema({
  buyer_id: { type: String, required: true },
  products_id: { type: Array, default: [] },
});

const model = mongoose.model("carts", Cart);
module.exports = model;
