var hbt = require('./hbtemplates');

var t_body = function(contents) {
  return hbt.html({body: contents});
};

var t_list = function(contents) {
  return hbt.list({content: contents});
};

var t_footer = hbt.footer({});

var t_react = function(script, id) {
  return hbt.react({script: script, id: id});
}

var t_header = hbt.header(require('./nav.js'));

var t_page = function(script, id) {
  //todo: prepend header, append footer
  return t_body(t_list([t_header, t_react(script, id), t_footer]));
};

var t_page2 = function(contents) {
  return t_body(t_list(contents));
};

module.exports = {
  hbt: hbt,
  body: t_body,
  list: t_list,
  page: t_page,
  page2: t_page2,
  footer: t_footer,
  react: t_react
};