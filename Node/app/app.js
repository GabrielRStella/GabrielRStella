//require

var express = require('express');
var handlebars = require('handlebars');

var routes = require('./server/routes');

//parse command-line args

var args = process.argv.slice(2);

var options = {
  port: 80,
};

for(var idx in args) {
  var arg = args[idx];
  var split = arg.split("=");
  if(split.length >= 2) {
    var key = split[0];
    var value = split.slice(1).join("=");
    options[key] = JSON.parse(value);
  }
}

//begin server

var app = express();

app.use('/', express.static('./public'));

routes(app, express);

app.listen(options.port, function () {
  //just for fun
  var source = "Server started on port {{port}}.{{#if todo}} TODO: {{todo}}{{/if}}";

  var template = handlebars.compile(source);
  var data = {
    port: options.port,
    todo: null
  };
  var result = template(data);
  console.log(result);
});