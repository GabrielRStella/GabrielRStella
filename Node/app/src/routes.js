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

      var body = `
        <div style="background: ${bg}" class="blue">
          <div style="height: 150px" class="valign-wrapper">
            <div style="margin-left: 20px" class="center-align">
              <h1 style="font-size: 72px">Gabriel R Stella</h1>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="card-panel center-align blue z-depth-1" style="margin: 0px 0px"></div>
          <div style="background: ${palette.foreground}">
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
          body: "background: " + palette.background
        }
      }));
    });
  });

};