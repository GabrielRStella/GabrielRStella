var bodyParser = require('body-parser');
var templates = require('./hbtemplates.js');

var headers = require('./headers.js');

module.exports = function(app, express) {

  app.get('/page', function (req, res) {
    res.send('page');
  });

  app.get('/page/:id', function (req, res) {
    res.send('page: ' + req.params.id);
  });

  app.get('/', function (req, res) {
    headers(function(path){
      var bg = "#ffffff";
      if(path) {
        bg = "url(" + path + ")";
      }


      var body = `
        <div class="container">
          <div class="card-panel center-align blue">Gabriel Stella</div>
          <div style="background: ${bg}">
            <div class="center section">This site is a work in progress.</div>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          </div>
        </div>
      `;

      res.send(templates.html({
        title: "Gabriel R Stella",
        head: templates.external({
          materialize: true,
          jquery: true
        }),
        body: body,
        style: {
          body: "background: #5f5f5f"
        }
      }));
    });
  });

};