var fs = require('fs');

//base path for all data folders
var DIR = 'data';

class Loader {
  //dir: the path to look in (eg. "games")
  //mainFileName: the main file to return for each element (eg. "game.json")
  constructor(dir, mainFileName) {
    this.dir = DIR + "/" + dir;
    this.file = mainFileName;
  }

  checkDir(dir) {
    return fs.lstatSync(dir).isDirectory() && fs.existsSync(dir + "/" + this.file);
  }

  mapper(file) {
    var localDir = this.dir + "/" + file;
    var localFile = localDir + "/" + this.file;
    var data = JSON.parse(fs.readFileSync(localFile));
    return {
      file: file,
      dir: localDir,
      data: data
    };
  }

  ls(cbOk, cbErr) {
    fs.readdir(this.dir, function(err, files) {
      if(err) {
        if(cbErr) cbErr(err);
        else cbOk([]) //reasonable?
      } else {
        cbOk(files.filter(
          (x) => (
            this.checkDir(this.dir + "/" + x)
          )
        ));
      }
    }.bind(this));
  }

  //takes just the name of the folder, no path or anything like that
  load(cbOk, cbErr) {
    this.ls(function(files) {
      cbOk(files.map(this.mapper.bind(this)));
    }.bind(this), cbErr);
  }

  lsSync() {
    var files = fs.readdirSync(this.dir);
    files.filter(
      (x) => (
        this.checkDir(this.dir + "/" + x)
      )
    );
    return files;
  }

  //takes just the name of the folder, no path or anything like that
  loadSync(cbOk, cbErr) {
    var files = this.lsSync();
    return files.map(this.mapper.bind(this));
  }
}

module.exports = Loader;