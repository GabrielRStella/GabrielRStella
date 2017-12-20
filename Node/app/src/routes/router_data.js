var templates = require('../util/templates.js');
var connect = require('../util/connect.js');

module.exports = function(dataFunc, template, key) {
  return function(req, res) {
    dataFunc(function(data) {
      var params = {};
      if(key) params[key] = data;
      else params = data;
      res.send(templates.page(template, params));
    }, function(error) {
      res.status(500).send("Error!");
    });
  };
};