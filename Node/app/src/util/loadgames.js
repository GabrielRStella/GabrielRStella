var handlebars = require('handlebars');
var fs = require('fs');

var exports = {};

exports.loadGame = function(game, cbOk, cbErr) {
  var path = './games/' + game;

  fs.stat(path, function(err, stats) {
      if(err) {
        cbErr();
      } else {
        var gameData = require('.' + path + '/game.json');
        gameData.path = game;
        gameData.template_after = !gameData.template_before;
        if(!gameData.background) {
          gameData.background = "#ffffff";
        }
        if(!gameData.foreground) {
          gameData.foreground = "#000000";
        }

        if(fs.existsSync(path + '/game.hb')) {
          var template = handlebars.compile(fs.readFileSync(path + '/game.hb', 'utf8'));
          gameData.template = template({
            //nothing yet
          });
        }

        cbOk(gameData);
      }
  });
};

exports.loadGames = function(cbOk) {
    fs.readdir('./games', function(err, files) {
      var games = [];
      var counter = files.length;
      for(var index in files) {
        var file = files[index];
        var count = function() {
          counter--;
          if(counter == 0) {
            cbOk(games);
          }
        };
        if(fs.lstatSync('./games/' + file).isDirectory()) {
          exports.loadGame(file, function(data) {
            games.push(data);
            count();
          }, count);
        }
      }
    });
};

module.exports = exports;