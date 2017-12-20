var templates = require('../util/templates.js');

module.exports = function(dataFunc, template, key) {
  return function(req, res) {
    var dFunc = dataFunc;
    dataFunc(function(data) {
      var params = {};
      if(key) params[key] = data;
      else params = data;
      res.send(templates.page(template, params));
    });
  };
};

var loadGames = require('../util/loadgames');

module.exports = function(req, res) {
  loadGames.loadGame(req.params.game, function(data) {
    res.send(templates.page('game', {game: data}));
  }, function(err) {
    res.send(templates.page('game_invalid', {}));
  });
}