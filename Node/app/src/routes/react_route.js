var templates = require('../util/templates.js');

module.exports = function(script, id) {
  return function(req, res) {
    res.send(templates.page_react(script || req.params.script, id));
  };
}