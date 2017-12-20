var bodyParser = require('body-parser');

var route_react = require('./routes/react_route');
var route_page = require('./routes/page_route');

var route_header = require('./routes/header');
var router_api = require('./routes/api/routes');

module.exports = function(app, express) {

  app.get('/header', route_header);

  app.get('/', route_page('index'));

  //i feel like this could be dangerous...but i like it ;)
  app.get('/:script', route_react());

  //no longer necessary thanks to the above
  //app.get('/github', route_react('github'));

  router_api(app, express);

};