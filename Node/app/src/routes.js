var bodyParser = require('body-parser');

var route_index = require('./routes/index');
var route_games = require('./routes/games');
var route_projects = require('./routes/projects');

module.exports = function(app, express) {

  app.get('/page', function (req, res) {
    res.send('page');
  });

  app.get('/page/:id', function (req, res) {
    res.send('page: ' + req.params.id);
  });

  app.get('/', route_index);

  app.get('/games', route_games);
  app.get('/projects', route_projects);

};