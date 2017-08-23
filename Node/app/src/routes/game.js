var templates = require('../util/hbtemplates.js');
var palette = require('../util/palette.js');

var page = require('../util/page');

var fs = require('fs');
var handlebars = require('handlebars');

module.exports = function(req, res) {

    var path = './games/' + req.params.game;

    fs.stat(path, function(err, stats) {
      var content = null;
      if(err) {
        content = templates.content.game_invalid({
          palette: {
            background: palette.foreground
          },
        });
      } else {
        var gameData = require('.' + path + '/game.json');
        gameData.template_after = !gameData.template_before;
        if(fs.existsSync(path + '/game.hb')) {
          var template = handlebars.compile(fs.readFileSync(path + '/game.hb', 'utf8'));
          gameData.template = template({
            //nothing yet
          });
        }
        content = templates.content.game({
          palette: {
            background: palette.foreground
          },
          game: gameData
        });
      }
      page(content, res.send.bind(res));
    });
}