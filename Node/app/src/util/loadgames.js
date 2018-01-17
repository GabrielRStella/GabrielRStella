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
        gameData.thumbnailUrl = gameData.staticUrl + gameData.thumbnail;

        if(gameData.script) {
          gameData.scripts = [gameData.script];
        }
        gameData.scriptDir = gameData.scriptDir || "";
        var gameScriptUrl = gameData.staticUrl + gameData.scriptDir;
        gameData.scriptUrls = gameData.scripts.map(x => (gameScriptUrl + x));

        gameData.libs = gameData.libs || [];
        var gameLibUrl = "/static/scripts/games/";
        gameData.libsUrls = gameData.libs.map(x => (gameLibUrl + x));

        if(!gameData.background) {
          gameData.background = "#ffffff";
        }
        if(!gameData.foreground) {
          gameData.foreground = "#000000";
        }
        if(!gameData.page_background) {
          gameData.page_background = gameData.background;
        }
        if(!gameData.canvas_background) {
          gameData.canvas_background = gameData.background;
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
        if(gameData.template_page) {
          var template = handlebars.compile(fs.readFileSync(path + '/' + gameData.template_page + '.hb', 'utf8'));
          gameData.template.page = template({});
        }

        gameData.date = new Date(gameData.dateString);

        //ensure both are boolean values
        gameData.enabled = !gameData.disabled;
        gameData.disabled = !gameData.enabled;

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
          games.sort(function(a, b) {
            //negative to reverse order (recent games at top)
            return -(a.date.getTime() - b.date.getTime());
          });
          cbOk(games);
        }
      };
      for(var index in files) {
        var file = files[index];
        if(fs.lstatSync(DIR + file).isDirectory()) {
          exports.loadGame(file, function(data) {
            if(data.enabled) games.push(data);
            count();
          }, count);
        }
      }
    });
};

module.exports = exports;