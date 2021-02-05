const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const Player = require('../models/player');
const Character = require('../models/character');

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

router.get("/:playerID", checkAuth, (req, res, next) => {
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

router.patch("/:playerID", checkAuth, async (req, res, next) => {
  const id = req.params.playerID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  await Player.updateOne({_id: id }, { $set: updateOps }).exec().then(result => {
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

router.delete("/:playerID", checkAuth,(req, res, next) => {
  const id = req.params.playerID;
  Player.deleteOne({ _id: id }).exec().then(resultP => {
    res.status(200).json({
      message: 'User deleted',
      request: {
        type: 'POST',
        url: 'https://rpgAPI.callmecrow.repl.co/signup',
        body: { name: 'String', password: 'String', email: 'String' }
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