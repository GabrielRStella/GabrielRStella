var headers = require('../headers.js');

var templates = require('../hbtemplates.js');
var palette = require('../palette.js');

module.exports = function(content, callback) {

    headers(function(path){

      var bg = palette.primary;
      if(path) {
        bg = path;
      }

      callback(templates.html({
        title: "Gabriel R Stella",
        head: templates.external({
          materialize: true,
          jquery: true
        }),
        body: templates.list({ content: [
          templates.header({
            palette: {
              color: palette.primary
            },
            background: bg,
            title: "Gabriel R Stella"
          }),
          templates.navbar({
            palette: {
              color: palette.primary,
              text: palette.foreground,
              hover: palette.light.primary
            },
            title: "Navigation",
            links: [
              {
                to: "/",
                title: "Home"
              },
              {
                to: "/games",
                title: "Games"
                //todo: sub links (dropdown)
              },
              {
                to: "/projects",
                title: "Projects"
              },
              {
                to: "#",
                title: "Links"
              }
            ]
          }),
          content
        ]}),
        style: {
          body: "background: " + palette.background
        }
      }));
    });

}