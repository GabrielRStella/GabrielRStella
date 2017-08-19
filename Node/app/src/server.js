//require

var express = require('express');

//TODO: may move handlebars to routes
var handlebars = require('handlebars');
var hbhelpers = require('./hbhelpers.js');

var routes = require('./routes');

//for reading files async
//var fs = require('fs');

//console.log(hbtemplates);

//

hbhelpers(handlebars);

//begin server

var app = express();

app.use('/static', express.static('../public'));

routes(app, express, handlebars);

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
});