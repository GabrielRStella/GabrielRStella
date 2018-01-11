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

class Game {
  constructor(name) {
    this.name = name;
  }

  register(keys) {
  }

  unregister(keys) {
  }

  update(tickPart) {
  }

  //ctx = canvas 2d drawing context
  render(ctx, width, height) {
  }
}

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
  return Math.floor(randomRange(min, max));
}

GameLib.randomUnitPoint = function() {
  var p = new Point(1, 0);
  p.rotate(Math.random() * Math.PI * 2);
  return p;
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//POINT/RECT
/////////////////////////////////////////////////////////////////////////////////////////////////

class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  get magnitude() {
    var m = this.x * this.x + this.y * this.y;
    return Math.sqrt(m);
  }

  set magnitude(len) {
    var m = this.magnitude;
    if(m == 0) return;
    len /= m;
    this.x *= len;
    this.y *= len;
  }

  get zero() {
    return (this.x == 0) && (this.y == 0);
  }

  distance(other) {
    var dx = this.x - other.x;
    var dy = this.y - other.y;
    var m = dx * dx + dy * dy;
    return Math.sqrt(m);
  }

  multiply(d) {
    this.x *= d;
    this.y *= d;
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
  }

  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
  }

  get direction() {
    if(Math.abs(this.x) > Math.abs(this.y)) {
      //left or right
      return this.x > 0 ? DIR_RIGHT : DIR_LEFT;
    } else if(Math.abs(this.x) < Math.abs(this.y)) {
      //up or down
      return this.y > 0 ? DIR_UP : DIR_DOWN;
    } else {
      //literally exact corner... que
      if(this.x < 0) {
        //left
        if(this.y < 0) {
          return (Math.random() < 0.5) ? (DIR_LEFT) : (DIR_DOWN);
        } else {
          return (Math.random() < 0.5) ? (DIR_LEFT) : (DIR_UP);
        }
      } else {
        //right
        if(this.y < 0) {
          return (Math.random() < 0.5) ? (DIR_RIGHT) : (DIR_DOWN);
        } else {
          return (Math.random() < 0.5) ? (DIR_RIGHT) : (DIR_UP);
        }
      }
    }
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  set angle(r) {
    var m = this.magnitude;
    this.x = Math.cos(r) * m;
    this.y = Math.sin(r) * m;
  }

  rotate(dr) {
    var cos = Math.cos(dr);
    var sin = Math.sin(dr);
    var xP = cos * this.x - sin * this.y;
    var yP = sin * this.x + cos * this.y;
    this.x = xP;
    this.y = yP;
  }

  angleTo(other) {
    return Math.atan2(other.y - this.y, other.x - this.x);
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
  }

  apply(f) {
    this.x = f(this.x);
    this.y = f(this.y);
  }

  copy() {
    return new Point(this.x, this.y);
  }

}

class Rectangle {
  constructor(x, y, w, h) {
    this.point = new Point(x, y);
    this.width = w;
    this.height = h;
  }

  get center() {
    return new Point(this.point.x + (this.width / 2), this.point.y + (this.height / 2));
  }

  get minX() {
    return this.point.x;
  }

  get minY() {
    return this.point.y;
  }

  get maxX() {
    return this.point.x + this.width;
  }

  get maxY() {
    return this.point.y + this.height;
  }

  set center(p) {
    this.point = p.copy();
    this.point.x -= this.width / 2;
    this.point.y -= this.height / 2;
  }

  set minX(x) {
    this.point.x = x;
  }

  set minY(y) {
    this.point.y = y;
  }

  set maxX(x) {
    this.point.x = x - this.width;
  }

  set maxY(y) {
    this.point.y = y - this.height;
  }

  contains(p) {
    return (p.x >= this.minX) && (p.x <= this.maxX) && (p.y >= this.minY) && (p.y <= this.maxY);
  }

  distance(p) {
    var dx = Math.min(this.minX - p.x, 0, p.x - this.maxX);
    var dy = Math.min(this.minY - p.y, 0, p.y - this.maxY);
    return Math.sqrt(dx * dx + dy * dy);
  }

  //https://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
  //do the two rectangles intersect?
  intersects(r) {
    var c = this.center;
    var rc = r.center;
    var x = c.x;
    var y = c.y;
    var rx = rc.x;
    var ry = rc.y;
    return (Math.abs(x - rx) * 2 < (this.width + r.width))
      && (Math.abs(y - ry) * 2 < (this.height + r.height));
  }

  //push rectangle r out of this rectangle's bounds
  push(r) {
    if(!this.intersects(r)) return;

    var to = r.center;
    to.sub(this.center);
    to.x /= this.width;
    to.y /= this.height;
    var dir = to.direction;
    var tmp = 0;

    if(dir == DIR_UP) {
      tmp = r.minY - this.maxY;
      if(tmp < 0) {
        r.point.y -= tmp;
      }
    } else if(dir == DIR_DOWN) {
      tmp = r.maxY - this.minY;
      if(tmp > 0) {
        r.point.y -= tmp;
      }
    } else if(dir == DIR_LEFT) {
      tmp = r.maxX - this.minX;
      if(tmp > 0) {
        r.point.x -= tmp;
      }
    } else if(dir == DIR_RIGHT) {
      tmp = r.minX - this.maxX;
      if(tmp < 0) {
        r.point.x -= tmp;
      }
    }
  }

  //if the two rectangles can be merged exactly, without gaining or losing area,
  //combine them and return true
  //else do nothing and return false
  merge(r) {
  }

  copy() {
    return new Rectangle(this.point.x, this.point.y, this.width, this.height);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//rectangle positioning (for gui systems)
/////////////////////////////////////////////////////////////////////////////////////////////////

//ordering, arranging, and scaling boxes relative to eachother
var RectanglePosition = {
  align: function(outer, inner, funcs, padding) {
    padding = padding || 0;
    for(var i = 0; i < funcs.length; i++) {
      funcs[i](outer, inner, padding);
    }
  },
  fit: function(outer, inner) {
    var minScale = Math.min(outer.width / inner.width, outer.height / inner.height);
    inner.width *= minScale;
    inner.height *= minScale;
  },
  fit2: function(outer, inner) {
    var maxScale = Math.max(outer.width / inner.width, outer.height / inner.height);
    inner.width *= maxScale;
    inner.height *= maxScale;
  },
  center: function(outer, inner) {
    inner.minX = outer.minX + (outer.width - inner.width) / 2;
    inner.minY = outer.minY + (outer.height - inner.height) / 2;
  },
  centerX: function(outer, inner) {
    inner.minX = outer.minX + (outer.width - inner.width) / 2;
  },
  centerY: function(outer, inner) {
    inner.minY = outer.minY + (outer.height - inner.height) / 2;
  },
  left: function(outer, inner, padding) {
    inner.minX = outer.minX + padding;
  },
  right: function(outer, inner, padding) {
    inner.maxX = outer.maxX - padding;
  },
  top: function(outer, inner, padding) {
    inner.maxY = outer.maxY - padding;
  },
  bottom: function(outer, inner, padding) {
    inner.minY = outer.minY + padding;
  }
};

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

/////////////////////////////////////////////////////////////////////////////////////////////////
//MOUSE
/////////////////////////////////////////////////////////////////////////////////////////////////

class MouseListener {
  constructor(canvas, edgePadding) {
    this.canvas = canvas;
    this.edgePadding = edgePadding;
    this.mouse = new Point(0, 0);
  }

  getMousePos(evt) {
    var rect = this.canvas.getBoundingClientRect();
    return new Point(evt.clientX - rect.left - this.edgePadding, evt.clientY - rect.top - this.edgePadding);
  }

  register() {
    this.canvas.addEventListener('mousemove', function(evt) {
      this.mouse = this.getMousePos(evt);
    }.bind(this), false);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//KEYS
/////////////////////////////////////////////////////////////////////////////////////////////////

var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

var KEY_SPACE = 32;
var KEY_P = 80;
var KEY_P_PRESS = 112;
var KEY_R = 82;
var KEY_C = 67;
var KEY_M = 77;
var KEY_Q = 81;
var KEY_E = 69;

var KEY_0 = 48;
var KEY_1 = 49;

var KEY_W = 87;
var KEY_A = 65;
var KEY_S = 83;
var KEY_D = 68;

function getKeyCode(keyChar) {
  return keyChar.toUpperCase().charCodeAt(0);
}

class Key {
  constructor(keyCode, callBack) {
    this.keyCode = keyCode;
    this.callBack = callBack;
  }
}

class KeyDual {
  constructor(keyCode, callBackDown, callBackUp) {
    this.keyCode = keyCode;
    this.callBackDown = callBackDown;
    this.callBackUp = callBackUp;
  }
}

class FakeArray {
  constructor() {
    this.length = 0;
  }

  push(t) {
    this[this.length] = t;
    this.length++;
    return this.length;
  }

  remove(i) {
    this[i] = undefined;
  }
}

class Keys {
  constructor() {
    this.KEYS_DOWN = new FakeArray();
    this.KEYS_UP = new FakeArray();
    this.KEYS_PRESS = new FakeArray();
    this.KEYS_DUAL = new FakeArray();

    this.eventKeydownB = this.eventKeydown.bind(this);
    this.eventKeyupB = this.eventKeyup.bind(this);
    this.eventKeypressB = this.eventKeypress.bind(this);

    this.keyStates = {};
  }

  checkKey(key) {
    return this.keyStates[getKeyCode(key)];
  }

  checkKeyCode(key) {
    return this.keyStates[key];
  }

  addKeyListenerDown(key) {
    return this.KEYS_DOWN.push(key) - 1;
  }

  addKeyListenerUp(key) {
    return this.KEYS_UP.push(key) - 1;
  }

  addKeyListenerPress(key) {
    return this.KEYS_PRESS.push(key) - 1;
  }

  addKeyListenerDual(key) {
    return this.KEYS_DUAL.push(key) - 1;
  }

  removeKeyListenerDown(key) {
    this.KEYS_DOWN.remove(key);
  }

  removeKeyListenerUp(key) {
    this.KEYS_UP.remove(key);
  }

  removeKeyListenerPress(key) {
    this.KEYS_PRESS.remove(key);
  }

  removeKeyListenerDual(key) {
    this.KEYS_DUAL.remove(key);
  }

  register() {
    document.addEventListener("keydown", this.eventKeydownB, false);
    document.addEventListener("keyup", this.eventKeyupB, false);
    document.addEventListener("keypress", this.eventKeypressB, false);
  }

  unregister() {
    document.removeEventListener("keydown", this.eventKeydownB);
    document.removeEventListener("keyup", this.eventKeyupB);
    document.removeEventListener("keypress", this.eventKeypressB);
  }

  eventKeydown(e) {
    var keyCode = e.keyCode;
    for(var i = 0; i < this.KEYS_DOWN.length; i++) {
      var key = this.KEYS_DOWN[i];
      if(!key) continue;
      if(key.keyCode == keyCode) key.callBack(e);
    }
    for(var i = 0; i < this.KEYS_DUAL.length; i++) {
      var key = this.KEYS_DUAL[i];
      if(!key) continue;
      if(key.keyCode == keyCode) key.callBackDown(e);
    }
    this.keyStates[keyCode] = true;
  }

  eventKeyup(e) {
    var keyCode = e.keyCode;
    for(var i = 0; i < this.KEYS_UP.length; i++) {
      var key = this.KEYS_UP[i];
      if(!key) continue;
      if(key.keyCode == keyCode) key.callBack(e);
    }
    for(var i = 0; i < this.KEYS_DUAL.length; i++) {
      var key = this.KEYS_DUAL[i];
      if(!key) continue;
      if(key.keyCode == keyCode) key.callBackUp(e);
    }
    this.keyStates[keyCode] = false;
  }

  eventKeypress(e) {
    var keyCode = e.keyCode;
    for(var i = 0; i < this.KEYS_PRESS.length; i++) {
      var key = this.KEYS_PRESS[i];
      if(!key) continue;
      if(key.keyCode == keyCode) key.callBack(e);
    }
  }

}