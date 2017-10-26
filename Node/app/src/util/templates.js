var hbt = require('./hbtemplates');
var page = require('./page');

var t_page = function(content, args) {
  return function(req, res) {
    page(content, res.send.bind(res), args);
  };
};

var t_react = function(palette, script) {
  return t_page(hbt.react({
      palette: palette,
      script: script
    }), ["react"]);
};

module.exports = {
  templates: hbt,
  page: t_page,
  react: t_react
};