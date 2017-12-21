var handlebars = require('handlebars');
var fs = require('fs');

var exports = {};

exports.loadProject = function(project, cbOk, cbErr) {
  var path = './projects/' + project;

  fs.stat(path, function(err, stats) {
      if(err) {
        cbErr();
      } else {
        var projectData = require('.' + path + '/project.json');
        projectData.path = project;
        projectData.url = '/projects/' + project;
        projectData.extension = projectData.extension || '.png';
        projectData.thumbnail = '/static/projects/thumbnails/' + project + projectData.extension;

        projectData.color = projectData.color || "#000";
        projectData.template = handlebars.compile(fs.readFileSync(path + '/page.hb', 'utf8'))({});

        cbOk(projectData);
      }
  });
};

exports.loadProjects = function(cbOk) {
    fs.readdir('./projects', function(err, files) {
      var projects = [];
      var counter = files.length;
      var count = function() {
        counter--;
        if(counter == 0) {
          cbOk(projects);
        }
      };
      for(var index in files) {
        var file = files[index];
        if(fs.lstatSync('./projects/' + file).isDirectory()) {
          exports.loadProject(file, function(data) {
            projects.push(data);
            count();
          }, count);
        }
      }
    });
};

module.exports = exports;