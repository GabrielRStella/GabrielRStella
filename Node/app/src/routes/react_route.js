var templates = require('../util/templates.js');
var palette = require('../util/palette.js');

module.exports = function(script) {
  return function(req, res) {
    templates.react(palette, script);
  };
}