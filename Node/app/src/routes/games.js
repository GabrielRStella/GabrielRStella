var templates = require('../util/hbtemplates.js');
var palette = require('../util/palette.js');

var page = require('../util/page');

var loadGames = require('../util/loadgames');

module.exports = function(req, res) {

    loadGames.loadGames(function(games) {
      var content = templates.content.games({
        palette: palette,
        games: games
      });

      page(content, res.send.bind(res));
    });
}