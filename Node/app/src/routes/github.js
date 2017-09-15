var templates = require('../util/hbtemplates.js');
var palette = require('../util/palette.js');

var page = require('../util/page');

var fs = require('fs');
var handlebars = require('handlebars');

module.exports = function(req, res) {
  page(templates.content.github({
    palette: palette,
  }), res.send.bind(res), ["react"]);
}