var bodyParser = require('body-parser');
var page = require('./page');

var templates = require('./hbtemplates.js');
var palette = require('./palette.js');

module.exports = function(app, express) {

  app.get('/page', function (req, res) {
    res.send('page');
  });

  app.get('/page/:id', function (req, res) {
    res.send('page: ' + req.params.id);
  });

  app.get('/', function (req, res) {
    var content = templates.body({
      palette: {
        background: palette.foreground
      },
    });

    page(content, res.send.bind(res));
  });

  app.get('/games', function (req, res) {
    var content = templates.games({
      palette: {
        background: palette.foreground
      },
    });

    page(content, res.send.bind(res));
  });

  app.get('/projects', function (req, res) {
    var content = templates.projects({
      palette: {
        background: palette.foreground
      },
    });

    page(content, res.send.bind(res));
  });

};