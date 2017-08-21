var templates = require('../hbtemplates.js');
var palette = require('../palette.js');

var fs = require('fs');

module.exports = function() {
    var content = templates.projects({
      palette: {
        background: palette.foreground
      },
    });

    page(content, res.send.bind(res));
}