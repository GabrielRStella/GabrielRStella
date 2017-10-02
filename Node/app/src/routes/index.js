var templates = require('../util/hbtemplates.js');
var palette = require('../util/palette.js');

var page = require('../util/page');

var fs = require('fs');

module.exports = function(req, res) {
  var content = templates.content.index({
    palette: palette,
    sections: [
      {
        background: "",
        content: templates.content.main['1']({palette: palette})
      }
    ]
  });

  page(content, res.send.bind(res));
}