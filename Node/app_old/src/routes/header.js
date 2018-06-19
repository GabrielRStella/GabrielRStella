var fs = require('fs');

function alternateHeader() {
  return null;
}

function header(cb){
  fs.readdir("../root/static/img/headers", function(err, files) {
    if(err) {
      //?
      //throw err;
      cb(alternateHeader());
    } else {
      if(files.length > 0) {
        var index = Math.floor(Math.random() * files.length);
        cb("/static/img/headers/" + files[index]);
      } else {
        //?
        cb(alternateHeader());
      }
    }
  });
};

module.exports = function(req, res) {
    header(function(bg) {
      res.redirect(bg);
    });
}