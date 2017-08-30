var headers = require('./headers.js');

var templates = require('./hbtemplates.js');
var palette = require('./palette.js');

module.exports = function(content, callback) {

    headers(function(path){

      var bg = palette.primary;
      if(path) {
        bg = path;
      }

      callback(templates.html({
        title: "Gabriel R Stella",
        head: templates.external({
          icons: true,
          materialize: true,
          jquery: true
        }),
        body: templates.list({ content: [
          templates.page({
            background: bg,
            title: "Gabriel R Stella",
            nav: "Navigation",
            palette: {
              color: palette.primary,
              text: palette.foreground,
              hover: palette.light.primary
            },
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
          content,
          templates.footer({
          })
        ]}),
        style: {
          body: "background: " + palette.background
        }
      }));
    });

}