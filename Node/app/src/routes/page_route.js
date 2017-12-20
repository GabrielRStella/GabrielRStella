var templates = require('../util/templates.js');

module.exports = function(page) {
  return function(req, res) {
    res.send(templates.page(page));
  };
}