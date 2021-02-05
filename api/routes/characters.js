const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Player = require('../models/player');
const Character = require('../models/character');

router.get('/:playerID/characters',  checkAuth, (req, res, next) => {
  const id = req.params.playerID;
  Character.find({ "playerID": id }).exec().then(doc => {
    console.log("From database", doc);
    if (doc) {
      res.status(200).json({
        characters: doc
      });
    } else {
      res.status(404).json({ message: 'No valid id found' });
    }
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: err });
  });
});

router.post('/:playerID/characters', checkAuth, (req, res, next) => {
  const id = req.params.playerID;

  const newCharacter = new Character({
    _id: new mongoose.Types.ObjectId(),
    playerID: id,
    characterName: req.body.characterName,
  });

  newCharacter.save().then(result => {
    res.status(201).json({
        message: 'Created character succesfully',
        createdCharacter: {
          playerID: id,
          characterName: newCharacter.characterName
        }
      });
  }).catch(err => {
    console.log(err);
  });
});

router.get('/characters/:characterID',checkAuth, (req, res, next) => {
  const playerID = req.body.playerID;
  const characterID = req.params.characterID;
  Character.find({ "_id": characterID, "playerID": playerID }).select('_id playerID characterName ').exec().then(doc => {
    if (doc) {
      res.status(200).json({
        character: doc
      });
    } else {
      res.status(404).json({ message: 'No valid id found' });
    }
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: err });
  });
});

router.patch('/:playerID/characters/:characterID', checkAuth, (req, res, next) => {
  const playerID = req.params.playerID;
  const characterID = req.params.characterID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Character.updateOne({ "_id": characterID, "playerID": playerID }, { $set: updateOps }).exec().then(result => {
    res.status(200).json({
      message: 'Updated character',
      request: {
        type: 'GET',
        url: 'https://rpgAPI.callmecrow.repl.co/players' + playerID + '/characters'
      }
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
});

router.delete('/characters/:characterID', checkAuth, (req, res, next) => {
  const playerID = req.body.playerID;
  const characterID = req.params.characterID;

  console.log(Character.find({ _id: characterID }).exec().then(result => {
    console.log(result);
  }));

  Character.deleteOne({ _id: characterID }).exec().then(result => {

    res.status(200).json({
      message: 'Character deleted',
      request: {
        type: 'POST',
        url: 'https://rpgAPI.callmecrow.repl.co/players/:playerID/characters',
        body: { characterName: 'String' }
      }
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: err });
  });
});

module.exports = router;