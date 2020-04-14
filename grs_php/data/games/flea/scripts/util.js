//https://stackoverflow.com/a/14521482

//array shuffle polyfill
Array.prototype.shuffle = Array.prototype.shuffle || function() {
  for(var i = 0; i < this.length; i++) {
    var j = Math.floor(Math.random() * arr.length);
    var temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
};

//https://stackoverflow.com/a/11409944
/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

Math.TAU = Math.TAU || (Math.PI * 2);

//various generic utility stuff
var GameLib = {};

GameLib.loopRange = function(x, max) {
  if(x < 0) {
    x %= max;
    x += max;
  }
  return x % max;
}

GameLib.randomRange = function(min, max) {
  return min + Math.random() * (max - min);
}

GameLib.randomRangeFloor = function(min, max) {
  return Math.floor(this.randomRange(min, max));
}

GameLib.randomUnitPoint = function() {
  var p = new Point(1, 0);
  p.rotate(Math.random() * Math.PI * 2);
  return p;
}