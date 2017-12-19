var fs = require('fs');
var loader = require('../../util/loadgames');

module.exports = function(req, res) {
    loader.loadGame(req.params.game, res.send.bind(res), function() {});
}