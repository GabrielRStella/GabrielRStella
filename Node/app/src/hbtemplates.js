//for reading files async
var fs = require('fs');

var templates = {};

templates.loadPath = './hbtemplates/';

templates.loadSync = function(name, errCb) {
  templates[name] = fs.readFileSync(templates.loadPath + name, 'utf8');
};
templates.loadAsync = function(name) {
  fs.readFile(templates.loadPath + name, 'utf8', function(err, data) {  
    if (err && errCb) errCb(err);
    else if(!err) templates[name] = data;
  });
};


templates.loadSync('page.hb', function(err) {console.log(err);});
templates.loadSync('body.hb', function(err) {console.log(err);});

module.exports = templates;