let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
var multer = require('multer');
var upload = multer();
let { PORT } = require('./config.js');
let { RESPONSE } = require('./config.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//CORS
let allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.sendStatus(RESPONSE.OK);
  }
  else {
    next();
  }
};
app.use(allowCrossDomain);

// Routes
app.post('/files', require('./routes/files/compare').compareCsvFiles);

// Port
app.listen(PORT, (data, error) => {
  error ? console.error(error) : console.log(`Express started on port ${PORT}`);
});


