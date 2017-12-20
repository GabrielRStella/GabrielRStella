var templates = require('../util/templates.js');

module.exports = function(script) {
  return function(req, res) {
    res.send(templates.page(script || req.params.script));
  };
}