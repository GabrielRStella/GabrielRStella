var fs = require('fs');
var loader = require('../../util/loadprojects');

module.exports = function(req, res) {
    loader.loadProject(req.params.project, res.send.bind(res), function() {
      res.status(404).send({});
    });
}