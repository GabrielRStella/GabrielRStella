var bodyParser = require('body-parser');

var route_react = require('./routes/react_route');
var route_header = require('./routes/header');
var router_api = require('./routes/api/routes');

module.exports = function(app, express) {

  app.get('/', route_react('index'));

  app.get('/header', route_header);

  router_api(app, express);

};