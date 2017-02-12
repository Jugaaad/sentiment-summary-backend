var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var wordSchema = new Schema({
    word: { type: String, required: true, unique: true },
    score: { type: Number, required: true, default: 0}
});

var Word = mongoose.model('Word', wordSchema);

module.exports = {Word: Word};
