const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Player = require('../models/player');
const Character = require('../models/character');

router.get('/:playerID/characters', (req, res, next) => {
  const id = req.params.playerID;
  Player.findById(id).select('characters').exec().then(doc => {
    console.log("From database", doc);
    if (doc) {
      res.status(200).json({
        player: doc
      });
    } else {
      res.status(404).json({ message: 'No valid id found' });
    }
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: err });
  });
});

router.post('/:playerID/characters', (req, res, next) => {
  const id = req.params.playerID;
  Player.findById(id).select('characters').exec().then(doc => {
    const newCharacter = new Character({
      _id: new mongoose.Types.ObjectId(),
      playerID: id,
      characterName: req.body.characterName
    });
    console.log(doc);
    doc.characters.push(newCharacter);
    doc.save().then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created user succesfully',
        createdCharacter: {
          characterID: newCharacter._id,
          playerID: newCharacter.playerID,
          characterName: newCharacter.characterName
        }
      });
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.get('/:playerID/characters/:characterID', (req, res, next) => {
  const playerID = req.params.playerID;
  const characterID = req.params.characterID;
  Player.findById(playerID).select('characters').exec().then(doc => {
    console.log(Object.keys(doc._doc.characters));
    doc._doc.characters.findById(characterID).select('_id playerID characterName').exec().then(result => {
      console.log("From database", result);
      if (result) {
        res.status(200).json({
          character: result
        });
      } else {
        res.status(404).json({ message: 'No valid id found' });
      }
      }).catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: err });
  });
});


router.delete('/:playerID/characters/:characterID', (req, res, next) => {
  const playerID = req.params.playerID;
  const characterID = req.params.characterID;
  Character.remove({ _id: characterID }).exec().then(result => {
    res.status(200).json({
      message: 'User deleted',
      request: {
        type: 'POST',
        url: 'https://rpgAPI.callmecrow.repl.co/players/:playerID/characters',
        body: { characterName: 'String' }
      }
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});
module.exports = router;