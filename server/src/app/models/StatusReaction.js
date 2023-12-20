const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StatusReaction = new Schema({
    userId: { type: String, required: true },
    type: { type: String, default: "like", required: true },
});

const model = mongoose.model("status-reactions", StatusReaction);
module.exports = model;
