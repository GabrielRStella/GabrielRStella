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

//todo - make sure it's loaded and such
function loadImage(name) {

  var img = new Image();
  img.src = "res/" + name + ".png";
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
}
