class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  get magnitude() {
    var m = this.x * this.x + this.y * this.y;
    return Math.sqrt(m);
  }

  distance(other) {
    var dx = this.x - other.x;
    var dy = this.y - other.y;
    var m = dx * dx + dy * dy;
    return Math.sqrt(m);
  }

  scale(len) {
    var m = this.magnitude;
    len /= m;
    this.x *= len;
    this.y *= len;
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
  }

  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  angleTo(other) {
    return Math.atan2(other.y - this.y, other.x - this.x);
  }

  copy() {
    return new Point(this.x, this.y);
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

  contains(p) {
    return (p.x >= this.minX) && (p.x <= this.maxX) && (p.y >= this.minY) && (p.y <= this.maxY);
  }

  distance(p) {
    var dx = Math.min(this.minX - p.x, 0, p.x - this.maxX);
    var dy = Math.min(this.minY - p.y, 0, p.y - this.maxY);
    return Math.sqrt(dx * dx + dy * dy);
  }

  //do the two rectangles intersect?
  intersects(r) {
  }

  //push rectangle r out of this rectangle's bounds
  push(r) {
  }

  //if the two rectangles can be merged exactly, without gaining or losing area,
  //combine them and return true
  //else do nothing and return false
  merge(r) {
  }
}