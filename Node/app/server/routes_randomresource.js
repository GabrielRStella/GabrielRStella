var fs = require('fs');

function random_resource(path, alt, cb){
  fs.readdir("public" + path, function(err, files) {
    if(err) {
      //?
      //throw err;
      cb(alt);
    } else {
      if(files.length > 0) {
        var index = Math.floor(Math.random() * files.length);
        cb(path + "/" + files[index]);
      } else {
        //?
        cb(alt);
      }
    }
  });
};

module.exports = 
  function(path, alt) {
    return function(req, res) {
      random_resource(path, alt, function(bg) {
        res.redirect(bg);
      });
    }
  }