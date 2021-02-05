const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Character = require('./character.js').schema;

const playerTemplate = mongoose.Schema({
  email: {type: String, required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
  name: { type: String},
  password: { type: String, required: true},
});

module.exports = mongoose.model('Player', playerTemplate);