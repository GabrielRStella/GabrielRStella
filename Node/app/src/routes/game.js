var templates = require('../util/templates.js');
var loadGames = require('../util/loadgames');

module.exports = function(req, res) {
  loadGames.loadGame(req.params.game, function(data) {
    res.send(templates.page('game', {game: data}));
  }, function(err) {
    res.redirect('/games');
  });
}