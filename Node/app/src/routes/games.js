var templates = require('../util/templates.js');
var connect = require('../util/connect.js');

module.exports = function(req, res) {
  connect("/api/games", function(data) {
    res.send(templates.page2([templates.hbt.content.games({games: data})]));
  }, function(error) {
    res.status(500).send("Error!");
  });
};