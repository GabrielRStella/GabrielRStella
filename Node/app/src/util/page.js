var headers = require('./headers.js');

var templates = require('./hbtemplates.js');
var palette = require('./palette.js');

module.exports = function(content, callback, args) {

    headers(function(path){

      var bg = palette.primary;
      if(path) {
        bg = path;
      }

      var argsExternal = {
        icons: true,
        materialize: true,
        jquery: true
      };
      if(args) {
        //argsExternal = {};
        for(var i = 0; i < args.length; i++) {
          argsExternal[args[i]] = true;
        }
      }

      callback(templates.html({
        title: "Gabriel R Stella",
        head: templates.external(argsExternal),
        body: templates.list({ content: [
          templates.page({
            background: bg,
            title: "Gabriel R Stella",
            nav: "Navigation",
            palette: {
              color: palette.primary,
              text: palette.foreground,
              hover: "#404040"
            },
            links: [
              {
                to: "/",
                title: "Home"
              },
              {
                to: "/games",
                title: "Games"
              },
              {
                to: "/projects",
                title: "Projects"
              },
              {
                to: "#",
                title: "Links",
/*
//temporarily out of order
                sub: [
                  {
                    title: "Github",
                    to: "https://github.com/GabrielRStella/"
                  },
                  {
                    title: "LinkedIn",
                    to: "#"
                  }
                ]
*/
              }
            ]
          }),
          content,
          templates.footer({
          })
        ]}),
        style: {
          body: "background: " + palette.negative
        }
      }));
    });

}