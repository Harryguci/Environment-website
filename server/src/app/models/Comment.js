const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema({
    blogId: { type: String, required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    createAt: { type: Date, default: Date.now() },
    deleteAt: { type: Date, default: null },
});

const model = mongoose.model("comments", Comment);
module.exports = model;
