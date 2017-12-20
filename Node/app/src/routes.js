var bodyParser = require('body-parser');

var route_react = require('./routes/router_react');
var route_page = require('./routes/router_page');
var route_request = require('./routes/router_request');
var route_data = require('./routes/router_data');

var route_game = require('./routes/game');

var route_header = require('./routes/header');
var api = require('./routes/api/routes');

var loadGames = require('./util/loadgames');

module.exports = function(app, express) {

  app.get('/header', route_header);

  app.get('/', route_page('index'));

  app.get('/games', route_data(loadGames.loadGames, 'games', 'games'));
  app.get('/games/:game', route_game);

  app.get('/github', route_react('github'));

  api(app, express);

};