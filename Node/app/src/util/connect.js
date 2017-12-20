var request = require('request');

module.exports = function(url, cbOk, cbErr) {
  var options = {
    url: "http://localhost:3000" + url,
    method: "GET",
    json: true,
    headers: {
      'User-Agent': 'internal'
    }
  };
  request(options, function(error, response, body){
    if (!error && response.statusCode == 200) {
      cbOk(response.body);
    } else if(cbErr) {
      cbErr(error);
    }
  });
}