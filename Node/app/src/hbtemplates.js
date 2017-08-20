//TODO: may move handlebars to routes
var handlebars = require('handlebars');
var hbhelpers = require('./hbhelpers');

//

hbhelpers(handlebars);

//for reading files
var fs = require('fs');

var templates = {};

templates.loadPath = './hbtemplates/';
templates.loadType = '.hb';

templates.loadSync = function(name, errCb) {
  templates[name] = handlebars.compile(fs.readFileSync(templates.loadPath + name + templates.loadType, 'utf8'));
};
templates.loadAsync = function(name) {
  fs.readFile(templates.loadPath + name + templates.loadType, 'utf8', function(err, data) {  
    if (err && errCb) errCb(err);
    else if(!err) templates[name] = handlebars.compile(data);
  });
};

//auto-load templates

var files = fs.readdirSync("./hbtemplates");
for(var index in files) {
  var file = files[index];
  templates.loadSync(file.substring(0, file.length - 3));
}

module.exports = templates;