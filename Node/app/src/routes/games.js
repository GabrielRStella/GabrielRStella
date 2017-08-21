var templates = require('../hbtemplates.js');
var palette = require('../palette.js');

var fs = require('fs');

module.exports = function() {

    fs.readdir('./games', function(err, files) {
      console.log(files);
    });

    var content = templates.games({
      palette: {
        background: palette.foreground
      },
    });

    page(content, res.send.bind(res));
}