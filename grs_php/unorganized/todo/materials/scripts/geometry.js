class Segment {
  constructor(a, b) {
    this.a = a;
    this.b = b;

    var s = this.b.copy();
    s.sub(this.a);
    this.slope = s;

    this.length = s.magnitude;
  }

  distance(p) {
    return this.closestPointTo(p).distance(p);
  }

  closestPointTo(p) {
  }

  intersection(segment) {
  }
}

class Polygon {
  constructor(points) {
    this.points = points;

    var prev = null;
    for(var i = 0; i <= points.length; i++) {
    }
  }

  //the center of mass of this shape
  center() {
    
  }

  //lowest distance to the given point
  distance(p) {
  }

  //does this shape contain the given point? uses CCW edge looping to check
  contains(p) {
  }

  //returns a list of polygons, each of which is a triangle
  triangulate() {
  }

  //splits the polygon along the given segment, returning a list of more polygons
  split(segment) {
  }
}

class Triangle extends Polygon {
  constructor(points) {
    super(points);
    if(points.length != 3) {
      throw ("Invalid triangle creation: " + (points.length) + " points given");
    }
  }

  //nice
  center() {
    if(this.centerPoint) return this.centerPoint;
    this.centerPoint = new Point();
    var p = this.centerPoint;
    this.points.forEach(x => p.add(x));
    p.multiply(1/3);
    return p;
  }
}