//polygons should be constructed CCW (x+ = right, y+ = up)

var Polygons = {
  toApiPoints: function(points) {
    var apiPoints = [];
    for(var i = 0; i < points.length; i++) {
      var p = points[i];
      apiPoints.push(p.x);
      apiPoints.push(p.y);
    }
    return apiPoints;
  },
  fromApiPoints: function(apiPoints) {
    var points = [];
    for(var i = 0; i < apiPoints.length; i+=2) {
      points.push(new Point(apiPoints[i], apiPoints[i + 1]));
    }
    return points;
  }
};

class Polygon {
  constructor(points, apiPoints) {
    this.points = points || Polygons.fromApiPoints(apiPoints);
    this.apiPoints = apiPoints || Polygons.toApiPoints(points);
    this.area = PolyK.GetArea(this.apiPoints);
  }

  rebuild(points, apiPoints) {
    this.points = points || Polygons.fromApiPoints(apiPoints);
    this.apiPoints = apiPoints || Polygons.toApiPoints(points);
    this.area = PolyK.GetArea(this.apiPoints);
    this.triangles = null;
    this.centerPoint = null;
  }

  isSimple() {
    return PolyK.IsSimple(this.apiPoints);
  }

  isConvex() {
    return PolyK.IsConvex(this.apiPoints);
  }

  contains(p) {
    return PolyK.ContainsPoint(this.apiPoints, p.x, p.y);
  }

  get bounds() {
    var b = PolyK.GetAABB(this.apiPoints)
    return new Rectangle(b.x, b.y, b.width, b.height);
  }

  triangulate() {
    if(this.triangles) return this.triangles;
    if(this.isSimple()) {
      var indices = PolyK.Triangulate(this.apiPoints);
      var points = this.points;
      var triangles = [];
      for(var i = 0; i < indices.length; i += 3) {
        triangles.push(new Polygon([points[indices[i]], points[indices[i + 1]], points[indices[i + 2]]]));
      }
      this.triangles = triangles;
      return triangles;
    }
    //no return for u
  }

  get center() {
    if(this.centerPoint) return this.centerPoint;
    if(this.points.length == 0) return new Point();

    //triangle or line or point
    if(this.points.length <= 3) {
      var p = new Point();
      for(var i = 0; i < this.points.length; i++) {
        p.add(this.points[i]);
      }
      p.multiply(1/this.points.length);
      this.centerPoint = p;
      return p;
    }

    //n-gon
    var triangles = this.triangulate();
    if(triangles) {
      var p = new Point();
      var weight = 0;
      for(var i = 0; i < triangles.length; i++) {
        var triangle = triangles[i];
        var area = triangle.area;
        var center = triangle.center.copy();
        center.multiply(area);

        p.add(center);
        weight += area;
      }
      p.multiply(1/weight);
      this.centerPoint = p;
      return p;
    }
  }

  forEachVertex(f) {
    for(var i = 0; i < this.points.length; i++) {
      f(this.points[i]);
    }
  }

  forEachEdge(f) {
    var prev = null;
    for(var i = 0; i <= this.points.length; i++) {
      var p = this.points[i % this.points.length];
      if(prev) {
        f(prev, p);
      }
      prev = p;
    }
  }

  kRaycast(point, dir) {
    return PolyK.Raycast(this.apiPoints, point.x, point.y, dir.x, dir.y);
  }

  kClosestEdge(point) {
    return PolyK.ClosestEdge(this.apiPoints, point.x, point.y);
  }

  slice(a, b) {
    var polys = PolyK.Slice(this.apiPoints, a.x, a.y, b.x, b.y);
    return polys.map(x => new Polygon(null, x));
  }
}