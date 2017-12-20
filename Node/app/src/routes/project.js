var templates = require('../util/templates.js');
var loadProjects = require('../util/loadprojects');

module.exports = function(req, res) {
  loadProjects.loadProject(req.params.project, function(data) {
    res.send(templates.page('project', {project: data}));
  }, function(err) {
    res.send(templates.page('project_invalid', {}));
  });
}