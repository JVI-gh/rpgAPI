const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Player = require('../models/player');
const Character = require('../models/character');
const Stats = require('../models/stats');

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
      email: req.body.email,
      playerID: id,
      characterName: req.body.characterName,
      stats: []
    });
    const statsList = new Stats({
      charID: newCharacter._id,
      strength: 10,
      dexterity: 10,
      constitution: 10
    });

    newCharacter.stats.push(statsList);
    statsList.save().then(result => {
      }).catch(err => {
        console.log(err);
      });
    console.log(doc);
    doc.characters.push(newCharacter);
    newCharacter.save().then(result => {
    }).catch(err => {
      console.log(err);
    });
    doc.save().then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created character succesfully',
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
  Character.find({ "_id": characterID, "playerID": playerID }).select('_id playerID characterName stats').exec().then(doc => {
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

router.patch('/:playerID/characters/:characterID', (req, res, next) => {
  const playerID = req.params.playerID;
  const characterID = req.params.characterID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Character.updateOne({ "_id": characterID}, {$set: updateOps}).exec().then(result => {
    Player.updateOne({"_id": playerID, characters: { $elemMatch: { "_id": characterID }}}, {$set:{ characters: {updateOps}}}).exec().then(playermod => {
    });
    res.status(200).json({
      message: 'Updated character',
      request: {
        type: 'GET',
        url: 'https://rpgAPI.callmecrow.repl.co/players' + playerID + '/characters/' + characterID
      }
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
});

router.patch('/:playerID/chracters/:characterID/stats', (req, res, next) =>{
  const playerID = req.params.playerID;
  const characterID = req.params.characterID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Stats.updateOne({"charID": characterID}, {$set: updateOps}).exec().then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Updated stats',
      stats: result
    })
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});


router.delete('/:playerID/characters/:characterID', (req, res, next) => {
  const playerID = req.params.playerID;
  const characterID = req.params.characterID;

  Character.removeOne({ "_id": characterID, "playerID": playerID }).exec().then(result => {
      Player.findById(playerID).select('characters').exec().then(doc => {
      doc.characters.pull({"_id": characterID});
      doc.save();
    });
    Stats.find({ "charID": characterID}).remove();
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
    res.status(500).json({
      error: err
    });
  });
});
module.exports = router;