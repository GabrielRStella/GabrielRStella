//helper to load images
//http://www.williammalone.com/articles/create-html5-canvas-javascript-game-character/1/

//TODO: dynamic images
//https://stackoverflow.com/a/20285053

var IMAGE_CACHE = {};

function getImage(name) {
  if(IMAGE_CACHE[name]) {
    return IMAGE_CACHE[name];
  } else {
    loadImage(name);
    return IMAGE_CACHE[name];
  }
}

function drawImage(img, canvas, r, flipped) {
  if(flipped) drawImageFlipped(img, canvas, r);
  else canvas.drawImage(getImage(img), r.minX, r.minY, r.width, r.height);
}

function drawImageFlipped(img, canvas, r) {
  canvas.save();
  canvas.translate(r.minX, r.maxY);
  canvas.scale(1, -1);
  canvas.drawImage(getImage(img), 0, 0, r.width, r.height);
  canvas.restore();
}

//todo - make sure it's loaded and such
function loadImage(name) {

  var img = new Image();
  img.src = "/games_toys/games/magic_dungeon/res/" + name + ".png";
  IMAGE_CACHE[name] = img;

//this doesn't synchronize it - 'loaded' is never set in the calling scope
/*
  var img = new Image();
  var loaded = false;
  img.onload = function() {
      loaded = true;
  }
  img.src = "res/" + name + ".png";
  while(!loaded) {}
  IMAGE_CACHE[name] = img;
*/

/*
  TODO: if image could not load, return false
*/
}
