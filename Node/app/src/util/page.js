var headers = require('./headers.js');

var hbt = require('./hbtemplates.js');
var palette = require('./palette.js');

module.exports = function(content, callback, args) {

    headers(function(path) {

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

      callback(hbt.html({
        title: "Gabriel R Stella",
        head: hbt.external(argsExternal),
        body: hbt.list({ content: [
          hbt.page({
            background: bg,
            title: "Gabriel R Stella",
            nav: "Navigation",
            palette: {
              color: palette.primary,
              text: palette.background,
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
              }
            ]
          }),
          content,
          hbt.footer({
          })
        ]}),
        style: {
          body: "background: " + palette.negative
        }
      }));
    });

}