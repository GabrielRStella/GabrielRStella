var handlebars = require('handlebars');
var fs = require('fs');

function getPath(name) {
  return 'server/templates/' + name + '.hb';
}

function loadTemplateSync(name) {
  return handlebars.compile(fs.readFileSync(getPath(name), 'utf8'))
}

function loadTemplateAsync(name, cbOk, cbErr) {
  fs.readFile(getPath(name), 'utf8', function(err, data) {
    if(err) {
      cbErr(err);
    } else {
      cbOk(handlebars.compile(data));
    }
  });
}

module.exports = {
  loadSync: loadTemplateSync,
  loadAsync: loadTemplateAsync
};