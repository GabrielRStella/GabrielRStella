//various generic utility stuff

function loop(x, max) {
  if(x < 0) {
    x %= max;
    x += max;
  }
  return x % max;
}

function shuffle(arr) {
  for(var i = 0; i < arr.length; i++) {
    var j = Math.floor(Math.random() * arr.length);
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function randomRangeFloor(min, max) {
  return Math.floor(randomRange(min, max));
}

function choosePoint() {
  var p = new Point(1, 0);
  p.rotate(Math.random() * Math.PI * 2);
  return p;
}

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

  copy() {
    return new Point(this.x, this.y);
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
  }

}

class Rectangle {
  constructor(p, w, h) {
    this.point = p;
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
    return new Rectangle(this.point.copy(), this.width, this.height);
  }
}

class Direction {
  constructor(id, p) {
    this.id = id;
    this.delta = p;
  }

  get next() {
    return DIRS[(this.id + 1) % 4];
  }

  get prev() {
    return DIRS[loop(this.id - 1, 4)];
  }

  get opposite() {
    return DIRS[(this.id + 2) % 4];
  }

  toString() {
    return this.id.toString();
  }
}

var DIR_UP = new Direction(0, new Point(0, 1));
var DIR_RIGHT = new Direction(1, new Point(1, 0));
var DIR_DOWN = new Direction(2, new Point(0, -1));
var DIR_LEFT = new Direction(3, new Point(-1, 0));
var DIRS = [DIR_UP, DIR_RIGHT, DIR_DOWN, DIR_LEFT];

//a very bad priority queue. i'm rushed...
//for note: it's a minimum priority queue
class PriorityQueue {
  constructor() {
    this.data = [];
  }

  get size() {
    return this.data.length
  }

  getPriorityPair(e, priority) {
    return {
      element: e,
      priority: priority
    };
  }

  push(e, priority) {
    var pair = this.getPriorityPair(e, priority);
    for(var i = 0; i < this.data.length; i++) {
      var pair2 = this.data[i];
      if(pair.priority < pair2.priority) break;
    }
    this.data.splice(i, 0, pair);
  }

  pop() {
    return this.data.length ? this.data.splice(0, 1)[0].element : null;
  }
}