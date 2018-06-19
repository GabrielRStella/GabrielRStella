//TODO: may move handlebars to routes
var handlebars = require('handlebars');

//add handlebars block helpers

handlebars.registerHelper('react', function(script, id) {
  //test if it's actually the 'options' object
  id = id.name ? "react-app" : ("react-app-" + id);

var p1 = `
<div style="display: block; background: #ffffff">
  <div id="`;
var p2 = `"></div>
  <script src="/static/scripts/react/`;
var p3 = `.js"></script>
</div>`;
  return new handlebars.SafeString(p1 + id + p2 + script + p3);
});

//for reading files
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