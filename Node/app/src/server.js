//require

var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('handlebars');
var hbhelpers = require('./hbhelpers.js');
var hbtemplates = require('./hbtemplates.js');

//for reading files async
//var fs = require('fs');

//console.log(hbtemplates);

//

hbhelpers(handlebars);

//begin server

var app = express();

app.use('/static', express.static('../public'));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  //just for fun
  var source = "Server started on port {{port}}.{{#if todo}} TODO: {{todo}}{{/if}}";

  var template = handlebars.compile(source);
  var data = {
    port: 3000,
    todo: "command line ports"
  };
  var result = template(data);
  console.log(result);
})