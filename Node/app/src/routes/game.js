var templates = require('../util/hbtemplates.js');
var palette = require('../util/palette.js');

var page = require('../util/page');

var fs = require('fs');
var handlebars = require('handlebars');

var loadGames = require('../util/loadgames');

module.exports = function(req, res) {

    loadGames.loadGame(req.params.game, function(game) {
      page(templates.content.game({
          palette: palette,
          game: game
        }), res.send.bind(res));
    }, function() {
      page(templates.content.game_invalid({
        palette: palette,
      }), res.send.bind(res));
    });
}