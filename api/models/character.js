const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const characterSchema = new Schema({
  playerID: { type: Schema.Types.ObjectId, ref: 'Player', unique: true },
  characterName: { type: String, required: true },
  strength: {type: Number, default: 10},
  dexterity: {type: Number, default: 10},
  constitution: {type: Number, default: 10}
});

module.exports = mongoose.model('Character', characterSchema);