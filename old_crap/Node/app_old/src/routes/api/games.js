var fs = require('fs');
var loader = require('../../util/loadgames');

module.exports = function(req, res) {
    loader.loadGames(res.send.bind(res));
}