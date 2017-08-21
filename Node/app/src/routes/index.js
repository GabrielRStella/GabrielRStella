var templates = require('../hbtemplates.js');
var palette = require('../palette.js');

var fs = require('fs');

var page = require('./page');

module.exports = function() {
  var content = templates.body({
    palette: {
      background: palette.foreground
    },
  });

  page(content, res.send.bind(res));
}