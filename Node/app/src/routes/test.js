var palette = require('../util/palette.js');
var templates = require('../util/templates.js');

module.exports = function(req, res) {
    var content = templates.templates.test();
    res.send(content);
}