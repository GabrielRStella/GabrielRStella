var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('handlebars');
var hbhelpers = require('./hbhelpers.js');

//for reading files async
//var fs = require('fs');

hbhelpers(handlebars);

//begin server

var app = express();

app.use('/static', express.static('../public'));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Started on port 3000. TODO: command line ports')
})