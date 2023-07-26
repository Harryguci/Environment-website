const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema({
  buyer_id: { type: String, default: "", require: true },
  product_id: { type: String, default: "", require: true },
  cost: { type: Number, default: 0 },
  address: { type: String, default: "", require: true },
  phone: { type: String, default: "", require: true },
  status: { type: String, default: "Đang chuẩn bị hàng", require: true },
  done: { type: Boolean, default: false },
  note: { type: String, default: "" },
  rate: { type: Number, default: "" },
  create_at: { type: Date, default: new Date() },
  delete: { type: Boolean, default: false },
  date_delivered: { type: Date },
});

const model = mongoose.model("orders", Order);
module.exports = model;
