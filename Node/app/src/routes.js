var bodyParser = require('body-parser');

var route_index = require('./routes/index');
var route_games = require('./routes/games');
var route_game = require('./routes/game');
var route_projects = require('./routes/projects');
var route_github = require('./routes/github');
var route_test = require('./routes/test');

module.exports = function(app, express) {

  app.get('/page', function (req, res) {
    res.send('page');
  });

  app.get('/page/:id', function (req, res) {
    res.send('page: ' + req.params.id);
  });

  app.get('/', route_index);

  app.get('/games', route_games);
  app.get('/games/:game', route_game);

  app.get('/projects', route_projects);

  app.get('/github', route_github);

  app.get('/test', route_test);

};