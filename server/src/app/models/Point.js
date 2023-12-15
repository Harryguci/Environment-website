const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Point = new Schema({
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
});

const model = mongoose.Model('point', Point);
module.exports = model;