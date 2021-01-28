const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Player = require('../models/player');
const Character = require('../models/character');
const Stats = require('../models/stats');

router.get('/', (req, res, next) => {
  Player.find().select('_id name password characters').exec().then(docs => {
    const response = {
      count: docs.lenght,
      players: docs.map(doc => {
        return {
          id: doc._id,
          name: doc.name,
          password: doc.password,
          characters: doc.characters,
          request: {
            type: 'GET',
            url: 'https://rpgAPI.callmecrow.repl.co/players/' + doc._id
          }
        }
      })
    };
    res.status(200).json(response);
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  })
});

router.post('/', async (req, res, next) => {
  if (req.body.password != undefined && req.body.name != undefined) {
    try {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw (err);

          const player = new Player({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            password: hash,
            characters: []
          });
          const newCharacter = new Character({
            _id: new mongoose.Types.ObjectId(),
            playerID: player._id,
            characterName: req.body.characterName,
            stats: []
          });
          console.log(newCharacter._id);
          const statsList = new Stats({
            charID: newCharacter._id,
            strength: 10,
            dexterity: 10,
            constitution: 10
          });

          player.characters.push(newCharacter);
          newCharacter.stats.push(statsList);

          newCharacter.save();

          statsList.save();

          player.save().then(result => {
            console.log(result);
            res.status(201).json({
              message: 'Created player succesfully',
              createdPlayer: {
                id: result._id,
                name: result.name,
                password: result.password,
                characters: newCharacter,
                request: {
                  type: 'GET',
                  url: 'https://rpgAPI.callmecrow.repl.co/players/' + result._id
                }
              }
            });
          }).catch(err => {
            console.log(err);
          });
        });
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err
      });
    }
  } else {
    res.status(500).json({ message: 'No valid request detected' });
  }
});


router.get("/:playerID", (req, res, next) => {
  const id = req.params.playerID;
  Player.findById(id).select('_id name password characters').exec().then(doc => {
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

router.patch("/:playerID", (req, res, next) => {
  const id = req.params.playerID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Player.update({ _id: id }, { $set: updateOps }).exec().then(result => {
    res.status(200).json({
      message: 'User updated',
      request: {
        type: 'GET',
        url: 'https://rpgAPI.callmecrow.repl.co/players/' + id
      }
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.delete("/:playerID", (req, res, next) => {
  const id = req.params.playerID;
  Player.remove({ _id: id }).exec().then(result => {
    res.status(200).json({
      message: 'User deleted',
      request: {
        type: 'POST',
        url: 'https://rpgAPI.callmecrow.repl.co/players',
        body: { name: 'String', password: 'String', characterName: 'String' }
      }
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
  Character.remove({ playerID: id }).exec().then(result => {
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});
module.exports = router;