var bodyParser = require('body-parser');

var route_games = require('./games');
var route_game = require('./game');
var route_projects = require('./projects');
var route_project = require('./project');

module.exports = function(app, express) {

  var router = express.Router();

  router.get('/games', route_games);
  router.get('/games/:game', route_game);

  router.get('/projects', route_projects);
  router.get('/projects/:project', route_project);

  app.use('/api', router);

};