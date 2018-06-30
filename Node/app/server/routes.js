var bodyParser = require('body-parser');
var ReactDOMServer = require('react-dom/server');

var templates = require('./templates');
var random_resource = require('./routes_randomresource');

//performs server-side rendering using a basic template and a named react file
function templatePage(name, template) {
  template = template || 'html';

  return function(req, res) {
    
    //find and insert into template
    templates.loadAsync(template, function(template) {

      //template found - do some stuff
      //get the react component
      var component = require('./react/target/' + name + '.js');
      //render to string
      var title = "Gabriel R Stella | " + name;
      var content = ReactDOMServer.renderToString(component);

      //send to client
      res.send(template({
        title: title,
        content: content
      }));
    }, function(err) {
      //send error to client?
      //this shouldn't ever happen
      res.status(500).send("Error loading page template \"" + template + "\". Sorry!");
    });
  }
}

module.exports = function(app, express) {

  app.get('/', templatePage('index'));
  app.get('/games', templatePage('games'));

  app.get('/avatar', random_resource("/img/avatars", "/img/avatar.png"));

};