const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Stats = require('./stats.js');

const statsList = new Stats({
  charID: { type: mongoose.Schema.Types.ObjectId, ref:'Character', unique: true},
  strength: {type: Number, default: 10},
  dexterity: {type: Number, default: 10},
  constitution: {type: Number, default: 10}
});

const characterSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  playerID: { type: mongoose.Schema.Types.ObjectId, ref:'Player', required: true, unique: true},
  characterName: { type: String, required: true},
  stats:{type:[Stats.schema], default: statsList} 
});

module.exports = mongoose.model('Character', characterSchema);