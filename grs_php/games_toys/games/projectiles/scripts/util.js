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

class Color {
  //all in [0, 1]
  constructor(r, g, b, a) {
    this.r = (r || 0).clamp(0, 1);
    this.g = (g || 0).clamp(0, 1);
    this.b = (b || 0).clamp(0, 1);
    this.a = (a || 0).clamp(0, 1);
  }

  add(c) {
    this.r = (this.r + c.r).clamp(0, 1);
    this.g = (this.g + c.g).clamp(0, 1);
    this.b = (this.b + c.b).clamp(0, 1);
    this.a = (this.a + c.a).clamp(0, 1);
  }

  subtract(c) {
    this.r = (this.r - c.r).clamp(0, 1);
    this.g = (this.g - c.g).clamp(0, 1);
    this.b = (this.b - c.b).clamp(0, 1);
    this.a = (this.a - c.a).clamp(0, 1);
  }

  multiply(c) {
    this.r = (this.r * c.r).clamp(0, 1);
    this.g = (this.g * c.g).clamp(0, 1);
    this.b = (this.b * c.b).clamp(0, 1);
    this.a = (this.a * c.a).clamp(0, 1);
  }

  //gives css-style rgba color string
  toString() {
    return "rgba(" + Math.floor(this.r.clamp(0, 1) * 255) + "," + Math.floor(this.g.clamp(0, 1) * 255) + "," + Math.floor(this.b.clamp(0, 1) * 255) + "," + a + ")";
  }

  copy() {
    return new Color(this.r, this.g, this.b, this.a);
  }
}

//some common colors
