var fs = require('fs');

module.exports = function(cb){
  fs.readdir("../public/img/headers", function(err, files) {
    if(err) {
      //?
      //throw err;
      cb();
    } else {
      if(files.length > 0) {
        var index = Math.floor(Math.random() * files.length);
        cb("/static/img/headers/" + files[index]);
      } else {
        //?
        cb();
      }
    }
  });
};