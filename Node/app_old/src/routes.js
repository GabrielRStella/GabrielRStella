var bodyParser = require('body-parser');

var route_react = require('./routes/router_react');
var route_page = require('./routes/router_page');
var route_request = require('./routes/router_request');
var route_data = require('./routes/router_data');

var route_game = require('./routes/game');
var route_project = require('./routes/project');
var route_toys = require('./routes/toys');

var route_header = require('./routes/header');
var api = require('./routes/api/routes');

var loadGames = require('./util/loadgames');
var loadProjects = require('./util/loadprojects');

module.exports = function(app, express) {

  app.get('/header', route_header);

  app.get('/', route_page('index'));

  app.get('/games', route_data(loadGames.loadGames, 'games', 'games'));
  app.get('/games/:game', route_game);

  app.get('/projects', route_page('projects'));
  app.get('/projects/:project', route_project);

  app.get('/toys', route_toys);

  app.get('/github', route_react('github'));

  api(app, express);

};