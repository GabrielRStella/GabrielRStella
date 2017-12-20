var bodyParser = require('body-parser');

var route_react = require('./routes/router_react');
var route_page = require('./routes/router_page');
var route_request = require('./routes/router_request');

var route_header = require('./routes/header');
var api = require('./routes/api/routes');

module.exports = function(app, express) {

  app.get('/header', route_header);

  app.get('/', route_page('index'));

  app.get('/games', route_request('games', 'games', 'games'));

  //no longer necessary thanks to the below
  //app.get('/github', route_react('github'));

  //i feel like this could be dangerous...but i like it ;)
  app.get('/:script', route_react());

  api(app, express);

};