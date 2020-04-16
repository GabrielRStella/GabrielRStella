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

  distanceSquared(other) {
    var dx = this.x - other.x;
    var dy = this.y - other.y;
    var m = dx * dx + dy * dy;
    return m;
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

//TODO redo this to not include a point
//just store x and y
class Rectangle {
  constructor(x, y, w, h) {
    this.point = new Point(x, y);
    this.width = w;
    this.height = h;
  }
  
  //get a random point inside
  sample() {
    return new Point(GameLib.randomRange(0, this.width), GameLib.randomRange(0, this.height));
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
    var dx = Math.max(this.minX - p.x, 0, p.x - this.maxX);
    var dy = Math.max(this.minY - p.y, 0, p.y - this.maxY);
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

  pushPoint(p) {
    if(p.x < this.point.x) {
      p.x = this.point.x;
    }
    if(p.x > this.point.x + this.width) {
      p.x = this.point.x + this.width;
    }
    if(p.y < this.point.y) {
      p.y = this.point.y;
    }
    if(p.y > this.point.y + this.height) {
      p.y = this.point.y + this.height;
    }
  }

  //push rectangle r out of this rectangle's bounds
  push(r) {
    var center = r.center;
    var w2 = r.width / 2;
    var h2 = r.height / 2;
    //first: check if it's inside and push it out
    if (this.intersects(r)) {
      //TODO: this jumps slightly when it touches a corner.
      //maybe I can make it smoother?
      var cx = this.point.x + this.width / 2;
      var cy = this.point.y + this.height / 2;
      var dist_inset_x = Math.min(center.x - this.point.x, (this.point.x + this.width) - center.x);
      var dist_inset_y = Math.min(center.y - this.point.y, (this.point.y + this.height) - center.y);
      if (dist_inset_x <= dist_inset_y) {
        //inset horizontally (or on corner)
        if (center.x < cx) {
          //left
          center.x = this.point.x - w2;
        }
        else {
          //right
          center.x = this.point.x + this.width + w2;
        }
      }
      if (dist_inset_y <= dist_inset_x) {
        //inset vertically (or on corner)
        if (center.y < cy) {
          //"bottom"
          center.y = this.point.y - h2;
        }
        else {
          //"top"
          center.y = this.point.y + this.height + h2;
        }
      }
    }
    //else: it's outside, grab it
    else {
      if (center.x < this.point.x - w2) {
        //left (outside)
        center.x = this.point.x - w2;
      }
      else if (center.x > this.point.x + this.width + w2) {
        //right (outside)
        center.x = this.point.x + this.width + w2;
      }
      if (center.y < this.point.y - h2) {
        //"bottom" (outside)
        center.y = this.point.y - h2;
      }
      else if (center.y > this.point.y + this.height + h2) {
        //"top" (outside)
        center.y = this.point.y + this.height + h2;
      }
    }
    r.center = center;
  }

  copy() {
    return new Rectangle(this.point.x, this.point.y, this.width, this.height);
  }
}