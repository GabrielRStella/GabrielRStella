var templates = require('../util/templates.js');
var palette = require('../util/palette.js');

module.exports = templates.page(templates.templates.content.index({
    palette: palette
  }));