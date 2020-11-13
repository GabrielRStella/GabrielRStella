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
    if(this.imgCache[name]) {
      return this.imgCache[name];
    } else {
      this.loadImageAsync(name, null, null);
      return this.imgCache[name];
    }
  }
  
  loadImageAsync(name, cb, cberr) {
    var img = new Image();
    if(cb) img.onload = cb;
    if(cberr) img.onerror = cberr;
    img.src = this.path + name + ".png";
    this.imgCache[name] = img;
    return img;
  }

  drawImage(img, ctx, sr, dr) {
    ctx.drawImage(this.getImage(img), sr.minX, sr.minY, sr.width, sr.height, dr.minX, dr.minY, dr.width, dr.height);
  }
}

//TODO: pre-load imgs and wait for it

class SpriteSheet {
  constructor(img, tile_size) {
    this.img = img;
    this.tile_size = tile_size;
  }
  
  index(idx, sz) {
    sz = sz || 1;
    return this.at(idx % 16, Math.floor(idx / 16), sz, sz);
  }
  
  at(col, row, w, h) {
    if(w == null) {
      if(h == null) {
        w = h = 1;
      } else {
        w = h; //why did they do this? (null, x)? why
      }
    } else if(h == null) {
      h = w;
    }
    return this.convert_rect(new Rectangle(col, row, w, h));
  }
  
  convert_rect(r) {
    return new Rectangle(r.minX * this.tile_size, r.minY * this.tile_size, r.width * this.tile_size, r.height * this.tile_size);
  }
  
  sprite_of(sr) {
    return new Sprite(this.img, [sr], 0);
  }
}

class Sprite {
  constructor(img, srects, delays) {
    this.img = img;
    this.srects = srects;
    this.n = srects.length;
    if(delays instanceof Array) {
      this.delays = delays;
    } else {
      this.delays = Array(srects.length);
      for(var i = 0; i < this.n; i++) {
        this.delays[i] = delays;
      }
    }
    this.currentIndex = 0;
    this.currentTime = 0;
  }
  
  update(tickPart) {
    this.currentTime += tickPart;
    if(this.currentTime > this.delays[this.currentIndex]) {
      this.currentTime = 0;
      this.currentIndex = (this.currentIndex + 1) % this.n;
    }
  }
  
  currentRect() {
    return this.srects[this.currentIndex];
  }
  
  render(ctx, dr) {
    var sr = this.currentRect();
    //console.log(sr);
    ctx.drawImage(this.img, sr.minX, sr.minY, sr.width, sr.height, dr.minX, dr.minY, dr.width, dr.height);
  }
}