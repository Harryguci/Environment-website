const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Status = new Schema({
    username: { type: 'string', required: true },
    description: { type: 'string', required: true },
    location: { type: Object, required: true },
    image: { type: 'string', required: true },
});

const model = mongoose.model("status", Status);
module.exports = model;