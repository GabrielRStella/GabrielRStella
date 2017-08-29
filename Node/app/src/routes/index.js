var templates = require('../util/hbtemplates.js');
var palette = require('../util/palette.js');

var page = require('../util/page');

var fs = require('fs');

module.exports = function(req, res) {
  var content = templates.content.index({
    palette: {
      background: palette.foreground
    },
    sections: [
      {
        background: "",
        content: templates.content.main['1']({palette: palette})
      },
      {
        background: palette.background,
        content: templates.content.main['end']({palette: palette})
      },
    ]
  });

  page(content, res.send.bind(res));
}