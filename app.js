const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const indexRoute = require('./api/routes/index');
const playerRoutes = require('./api/routes/players');
const characterRoutes = require('./api/routes/characters')

mongoose.connect("mongodb+srv://crow-manager:" + process.env.DBPASS + "@node-rest-rpggame.6micw.mongodb.net/node-rest-rpggame?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/', indexRoute);
app.use('/players', playerRoutes);
app.use('/players', characterRoutes);

app.use((req, res, nest) => {
  const error = new Error('Not found');
  error.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;