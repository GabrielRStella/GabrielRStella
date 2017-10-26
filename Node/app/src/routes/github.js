var templates = require('../util/templates.js');
var palette = require('../util/palette.js');

var page = require('../util/page');

var fs = require('fs');
var handlebars = require('handlebars');

module.exports = templates.react(palette, "github");