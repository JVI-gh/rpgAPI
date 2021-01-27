const mongoose = require('mongoose');

const playerTemplate = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true},
  password: { type: String, required: true},
  characters: [{
    _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Character'},
    playerID:  {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
    characterName: {type: String, required: true, ref: 'Character'}
  }]
});

module.exports = mongoose.model('Player', playerTemplate);