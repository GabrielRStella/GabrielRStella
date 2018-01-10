var templates = require('../util/templates.js');
var loadGames = require('../util/loadgames');

module.exports = function(req, res) {
  loadGames.loadGame(req.params.game, function(data) {
    res.send(data.fullscreen ?
      templates.body(templates.hbt.content.game_fullscreen({game: data})) :
      templates.page('game', {game: data})
    );
  }, function(err) {
    res.redirect('/games');
  });
}