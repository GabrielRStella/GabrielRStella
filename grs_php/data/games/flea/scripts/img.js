//helper to load images
//http://www.williammalone.com/articles/create-html5-canvas-javascript-game-character/1/

//TODO: dynamic images
//https://stackoverflow.com/a/20285053

/////////////////////////////////////////////////////////////////////////////////////////////////
//IMAGES
/////////////////////////////////////////////////////////////////////////////////////////////////

class ImageStore {
  constructor(name, full) {
    if(full) {
      this.path = name;
    } else {
      this.path = "/data/games/" + name + "/res/";
    }
    this.imgCache = {};
  }

  getImage(name) {
    if(imgCache[name]) {
      return imgCache[name];
    } else {
      loadImage(name);
      return imgCache[name];
    }
  }

  loadImage(name) {
    var img = new Image();
    img.src = this.path + name + ".png";
    imgCache[name] = img;
//todo - make sure it's loaded before returning (and have async version)
  }

  drawImage(img, canvas, r, flipped) {
    if(flipped) this.drawImageFlipped(img, canvas, r);
    else canvas.drawImage(this.getImage(img), r.minX, r.minY, r.width, r.height);
  }

  drawImageFlipped(img, canvas, r) {
    canvas.save();
    canvas.translate(r.minX, r.maxY);
    canvas.scale(1, -1);
    canvas.drawImage(this.getImage(img), 0, 0, r.width, r.height);
    canvas.restore();
  }
}