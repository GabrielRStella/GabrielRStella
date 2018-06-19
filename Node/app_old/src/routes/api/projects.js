var fs = require('fs');
var loader = require('../../util/loadprojects');

module.exports = function(req, res) {
    loader.loadProjects(res.send.bind(res));
}