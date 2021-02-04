const mongoose = require('mongoose');
const Character = require('./character.js').schema;

const playerTemplate = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {type: String, required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
  name: { type: String},
  password: { type: String, required: true},
  characters: [Character]
});

module.exports = mongoose.model('Player', playerTemplate);