const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/environment-website", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("[MONGODB] Connected successfully !");
  } catch (err) {
    console.log("[MONGODB] Connect failed");
  }
}

module.exports = { connect }; // exports a function(promise)
