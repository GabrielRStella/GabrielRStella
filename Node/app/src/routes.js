var bodyParser = require('body-parser');
var templates = require('./hbtemplates.js');

module.exports = function(app, express) {

  app.get('/page', function (req, res) {
    res.send('page');
  });

  app.get('/page/:id', function (req, res) {
    res.send('page: ' + req.params.id);
  });

  app.get('/', function (req, res) {
    res.send(templates.html({
      title: "Gabriel R Stella",
      head: templates.external({
        materialize: true
      }),
      body: templates.body({
        text: `
          <div class="card-panel center-align blue">Gabriel Stella</div>
          <div class="center section">This site is a work in progress.</div>
        `
      })
    }));
  });

};