const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json( {
    message: 'handling GET request'
  });
});

router.post('/', (req, res, next) => {
  const player = {
    name: req.body.name,
    playerID: req.body.id,
    characterName: req.body.characterName
  };
  res.status(201).json({
    message: 'handling POST request',
    createdPlayer: player
  });
}); 

router.get('/:playerID', (req, res, next) => {
  const id = req.params.playerID;
  res.status(200).json({
    message: 'recieving ids'
  });
});


router.delete('/:playerID', (req, res, next) => {
  const id = req.params.playerID;
  res.status(200).json({
    message: 'deleted player'
  });
});
module.exports = router;