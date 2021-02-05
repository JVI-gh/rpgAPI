const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Player = require('../models/player');
const Character = require('../models/character');
const Stats = require('../models/stats');

router.get('/', (req, res, next) => {
  res.status(200).json( {
    message: 'Service Online'
  });
});

router.post('/signup', async (req, res, next) => {
  Player.find({email: req.body.email }).exec().then(user => {
    if(user.lenght >= 1) {
      return res.status(409).json({
        message: 'Mail already in use'
      });
    } else {
      if (req.body.password != undefined && req.body.name != undefined || req.body.email != undefined) {
    try {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw (err);
          const player = new Player({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
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
    }
  })
});

router.post('/login', (req, res, next) => {
  Player.find({"name": req.body.name} || {"email": req.body.email}).exec().then(player => {
    if(player.lenght < 1) {
      return res.status(404).json({
        message: 'Auth failed'
      });
    }
    bcrypt.compare(req.body.password, player[0].password, (err, result) => {
      if(err) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      if(result) {
        const token = jwt.sign({
          email: player[0].email || player[0].name,
          playerID: player[0]._id
        }, process.env.JWT_KEY,
        {
          expiresIn: "1h"
        });
        return res.status(200).json({
          message: 'Auth sucessful',
          token: token
        });
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