var fs = require('fs');

function alternateHeader() {
  return null;
}

module.exports = function(cb){
  fs.readdir("../public/img/headers", function(err, files) {
    if(err) {
      //?
      //throw err;
      cb(alternateHeader());
    } else {
      if(files.length > 0) {
        var index = Math.floor(Math.random() * files.length);
        cb("url(/static/img/headers/" + files[index] + ")");
      } else {
        //?
        cb(alternateHeader());
      }
    }
  });
};