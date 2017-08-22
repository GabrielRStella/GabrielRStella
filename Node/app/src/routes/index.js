var templates = require('../util/hbtemplates.js');
var palette = require('../util/palette.js');

var page = require('../util/page');

var fs = require('fs');

module.exports = function(req, res) {
  var content = templates.content.index({
    palette: {
      background: palette.foreground
    },
  });

  page(content, res.send.bind(res));
}