//TODO: may move handlebars to routes
var handlebars = require('handlebars');
var hbhelpers = require('./hbhelpers');

//

hbhelpers(handlebars);

//for reading files
var fs = require('fs');

function Templates(path, type) {
  this.load = {
    path: path || './',
    type: type || '.hb',
  };
  this.load.sync = function(name, errorCb) {
      if(fs.existsSync(this.load.path + name) && fs.lstatSync(this.load.path + name).isDirectory()) {
        var child = new Templates(this.load.path + name + '/', this.load.type);
        var files = fs.readdirSync(this.load.path + name);
        for(var index in files) {
          var file = files[index];
          if(fs.lstatSync(child.load.path + file).isDirectory()) {
            child.load.sync(file);
          } else {
            child.load.sync(file.substring(0, file.length - this.load.type.length));
          }
        }
        this[name] = child;
      } else {
        this[name] = handlebars.compile(fs.readFileSync(this.load.path + name + this.load.type, 'utf8'));
      }
    }.bind(this);
/*
  this.load.async = function(name) {
      fs.readFile(templates.loadPath + name + templates.loadType, 'utf8', function(err, data) {  
        if (err && errCb) errCb(err);
        else if(!err) templates[name] = handlebars.compile(data);
      });
    }.bind(this);
*/
};

var templates = new Templates();
templates.load.sync('hbtemplates');

module.exports = templates.hbtemplates;