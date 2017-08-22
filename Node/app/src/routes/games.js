var templates = require('../util/hbtemplates.js');
var palette = require('../util/palette.js');

var page = require('../util/page');

var fs = require('fs');

module.exports = function(req, res) {

    fs.readdir('./games', function(err, files) {
      console.log(files);
    });

    var content = templates.content.games({
      palette: {
        background: palette.foreground
      },
    });

    page(content, res.send.bind(res));
}