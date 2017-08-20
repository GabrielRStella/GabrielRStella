var bodyParser = require('body-parser');
var templates = require('./hbtemplates.js');

var headers = require('./headers.js');

var palette = require('./palette.js');

module.exports = function(app, express) {

  app.get('/page', function (req, res) {
    res.send('page');
  });

  app.get('/page/:id', function (req, res) {
    res.send('page: ' + req.params.id);
  });

  app.get('/', function (req, res) {
    headers(function(path){
      var bg = palette.primary;
      if(path) {
        bg = path;
      }

      res.send(templates.html({
        title: "Gabriel R Stella",
        head: templates.external({
          materialize: true,
          jquery: true
        }),
        body: templates.list({ content: [
          templates.header({
            palette: palette,
            background: bg,
            title: "Gabriel R Stella"
          }),
          templates.navbar({
            palette: palette,
            
          }),
          templates.body({
            palette: palette,
            
          })
        ]}),
        style: {
          body: "background: " + palette.background
        }
      }));
    });
  });

};