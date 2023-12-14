const mongoose = require("mongoose");
// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://harryguci:harryguci@cluster01.chrqhpv.mongodb.net/environment-website?retryWrites=true&w=majority';

async function connect() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("[MONGODB] Connected successfully !");
  } catch (err) {
    console.log("[MONGODB] Connect failed");
  }
}

module.exports = { connect }; // exports a function(promise)