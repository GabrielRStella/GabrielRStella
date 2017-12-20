var bodyParser = require('body-parser');

var route_games = require('./games');
var route_game = require('./game');

module.exports = function(app, express) {

  var router = express.Router();

  router.get('/games', route_games);
  router.get('/games/:game', route_game);

  app.use('/api', router);

};