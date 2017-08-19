//require

var express = require('express');

//TODO: may move handlebars to routes
var handlebars = require('handlebars');
var hbhelpers = require('./hbhelpers');

var routes = require('./routes');

//

hbhelpers(handlebars);

//parse command-line args

var args = process.argv.slice(2);

var options = {
  port: 80,
};

for(var idx in args) {
  var arg = args[idx];
  var split = arg.split("=");
  var key = split[0];
  var value = split.slice(1).join("=");
  options[key] = JSON.parse(value);
}

//begin server

var app = express();

app.use('/static', express.static('../public'));

routes(app, express, handlebars);

app.listen(options.port, function () {
  //just for fun
  var source = "Server started on port {{port}}.{{#if todo}} TODO: {{todo}}{{/if}}";

  var template = handlebars.compile(source);
  var data = {
    port: options.port,
    todo: "command line ports"
  };
  var result = template(data);
  console.log(result);
});