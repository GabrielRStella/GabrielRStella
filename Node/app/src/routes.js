var bodyParser = require('body-parser');

//var route_index = require('./routes/index');
var route_header = require('./routes/header');
var router_api = require('./routes/api/routes');

module.exports = function(app, express) {

  //app.get('/', route_index);

  app.get('/header', route_header);

  router_api(app, express);

};