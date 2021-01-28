const mongoose = require('mongoose');
const Schema = mongoose.Schema

const statsSchema = new Schema({
  charID: { type: mongoose.Schema.Types.ObjectId, ref:'Character'},
  strength: {type: Number, default: 10},
  dexterity: {type: Number, default: 10},
  constitution: {type: Number, default: 10}
});

module.exports = mongoose.model('Stats', statsSchema);