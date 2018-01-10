var handlebars = require('handlebars');
var fs = require('fs');

var exports = {};

var DIR = '../data/games/';

exports.loadGame = function(game, cbOk, cbErr) {
  var path = DIR + game;

  fs.stat(path, function(err, stats) {
      if(err) {
        cbErr();
      } else {
        var gameData = require('../' + path + '/game.json');
        gameData.path = game;
        gameData.url = '/games/' + game;
        gameData.staticUrl = '/data/games/' + game + '/';
        gameData.scriptUrl = gameData.staticUrl + gameData.script;
        gameData.thumbnailUrl = gameData.staticUrl + gameData.thumbnail;
        if(!gameData.background) {
          gameData.background = "#ffffff";
        }
        if(!gameData.foreground) {
          gameData.foreground = "#000000";
        }

        gameData.template = {};
        if(gameData.template_before) {
          var template = handlebars.compile(fs.readFileSync(path + '/' + gameData.template_before + '.hb', 'utf8'));
          gameData.template.before = template({});
        }
        if(gameData.template_after) {
          var template = handlebars.compile(fs.readFileSync(path + '/' + gameData.template_after + '.hb', 'utf8'));
          gameData.template.after = template({});
        }

        cbOk(gameData);
      }
  });
};

exports.loadGames = function(cbOk) {
    fs.readdir(DIR, function(err, files) {
      var games = [];
      var counter = files.length;
      var count = function() {
        counter--;
        if(counter == 0) {
          cbOk(games);
        }
      };
      for(var index in files) {
        var file = files[index];
        if(fs.lstatSync(DIR + file).isDirectory()) {
          exports.loadGame(file, function(data) {
            games.push(data);
            count();
          }, count);
        }
      }
    });
};

module.exports = exports;