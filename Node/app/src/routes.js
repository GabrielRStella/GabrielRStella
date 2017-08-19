var bodyParser = require('body-parser');
var templates = require('./hbtemplates.js');

module.exports = function(app, express) {

  app.get('/page', function (req, res) {
    res.send('speshul page');
  });

  app.get('/page/:id', function (req, res) {
    res.send('speshul page 2: ' + req.params.id);
  });

  app.get('/', function (req, res) {
    res.send(templates.html({
      title: "Gabriel R Stella",
      head: templates.external({
        materialize: true
      }),
      body: templates.body({
        text: "hi!"
      })
    }));
  });

};