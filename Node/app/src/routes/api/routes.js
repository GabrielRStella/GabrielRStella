var bodyParser = require('body-parser');

var route_games = require('./games');
var route_game = require('./game');

module.exports = function(app, express) {

  app.get('/api/games', route_games);
  app.get('/api/game/:game', route_game);

};