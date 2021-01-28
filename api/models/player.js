const mongoose = require('mongoose');
const Character = require('./character.js').schema;

const playerTemplate = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true},
  password: { type: String, required: true},
  characters: [Character]
});

module.exports = mongoose.model('Player', playerTemplate);