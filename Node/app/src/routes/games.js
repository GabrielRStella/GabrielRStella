var templates = require('../util/hbtemplates.js');
var palette = require('../util/palette.js');

var page = require('../util/page');

var fs = require('fs');

module.exports = function(req, res) {

    fs.readdir('./games', function(err, files) {
      var games = [];
      for(var index in files) {
        var file = files[index];
        if(fs.lstatSync('./games/' + file).isDirectory()) {
          var gameData = require('../games/' + file + '/game.json');
          gameData.path = file;
          games.push(gameData);
        }
      }

      var content = templates.content.games({
        palette: {
          background: palette.foreground
        },
        games: games
      });

      page(content, res.send.bind(res));
    });
}