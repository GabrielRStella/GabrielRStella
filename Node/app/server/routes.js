var bodyParser = require('body-parser');
var ReactDOMServer = require('react-dom/server');

var templates = require('./templates');

//performs server-side rendering using a basic template and a named react file
function templatePage(name) {
  return function(req, res) {

    //get the react component
    var component = require('./react/target/' + name + '.js');
    //render to string
    var title = "Gabriel R Stella | " + name;
    var content = ReactDOMServer.renderToString(component);
    
    //insert into template
    templates.loadAsync('html', function(template) {
      //send to client
      res.send(template({
        title: title,
        content: content
      }));
    }, function(err) {
      //send error to client?
      //this shouldn't ever happen
      res.status(500).send("Error loading page template. Sorry!");
    });
  }
}

module.exports = function(app, express) {

  app.get('/', templatePage('index'));

};