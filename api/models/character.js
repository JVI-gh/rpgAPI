const mongoose = require('mongoose');
const Template = mongoose.Schema

const characterTemplate = new Template({
  _characterID: mongoose.Schema.Types.ObjectId,
  playerID: { type: mongoose.Schema.Types.ObjectId, ref:'Player', required: true},
  characterName: { type: String, required: true},
});

module.exports = mongoose.model('Character', characterTemplate);