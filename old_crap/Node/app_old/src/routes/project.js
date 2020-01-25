var templates = require('../util/templates.js');
var loadProjects = require('../util/loadprojects');

module.exports = function(req, res) {
  loadProjects.loadProject(req.params.project, function(data) {
    if(data.redirect) {
      res.redirect(data.url);
    } else {
      res.send(templates.page('project', {project: data}));
    }
  }, function(err) {
    res.redirect('/projects');
  });
}