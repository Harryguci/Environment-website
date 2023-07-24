const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Blog = new Schema({
  title: { type: String, default: "", required: true },
  description: { type: String, default: "", required: true },
  detail: { type: String, default: "", required: true },
  userId: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  files: { type: Array, default: [] },
  links: { type: Object, default: "" },
  create_at: { type: Date, default: new Date() },
  delete: { type: Boolean, default: false },
});

const model = mongoose.model("blogs", Blog);
module.exports = model;
