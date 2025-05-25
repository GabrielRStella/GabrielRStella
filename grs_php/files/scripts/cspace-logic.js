//tpoint, tcircle, arm, slider
//TODO: expanding point/circle robot on a slider, ...
//TODO: add dat.gui menu to modify obstacles
//TODO: plot current trajectory (since mouse was clicked) in c-space window

////////////////////////////////////////////////////////////////////////////////
//geometry (point and rect copied from toys)
////////////////////////////////////////////////////////////////////////////////

Math.TAU = Math.TAU || (Math.PI * 2);

class Point {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    get magnitudeSquared() {
        var m = this.x * this.x + this.y * this.y;
        return m;
    }

    get magnitude() {
        var m = this.x * this.x + this.y * this.y;
        return Math.sqrt(m);
    }

    set magnitude(len) {
        var m = this.magnitude;
        if (m == 0) return;
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

    slope() {
        return this.y / this.x;
    }

    slopeFrom(p) {
        return (this.y - p.y) / (this.x - p.x);
    }

    rotate(dr) {
        var cos = Math.cos(dr);
        var sin = Math.sin(dr);
        var xP = cos * this.x - sin * this.y;
        var yP = sin * this.x + cos * this.y;
        this.x = xP;
        this.y = yP;
    }

    rotateAround(p, dr) {
        this.sub(p);
        this.rotate(dr);
        this.add(p);
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    //vector projection
    project(other) {
        var N = this.copy();
        N.magnitude = 1;
        N.multiply(N.dot(other));
        return N;
    }

    //vector rejection
    reject(other) {
        var projection = this.project(other);
        projection.sub(other);
        projection.multiply(-1);
        return projection;
    }

    angleTo(other) {
        return Math.atan2(other.y - this.y, other.x - this.x);
    }

    angleBetween(other) {
        //this has numerical stability issues...
        // var dot = (this.x * other.x + this.y * other.y);
        // var mags = this.magnitude * other.magnitude;
        // console.log(this, other, dot / mags);
        // if(mags == 0) return 0;
        // return Math.acos(dot / mags);
        //https://stackoverflow.com/a/55510185
        var dot = this.x * other.x + this.y * other.y;
        var cross = this.x * other.y - this.y * other.x;
        return Math.atan2(cross, dot);
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

//return whether two lines intersect
/*
//https://stackoverflow.com/a/9997374
//https://bryceboe.com/2006/10/23/line-segment-intersection-algorithm/
def ccw(A,B,C):
    return (C.y-A.y) * (B.x-A.x) > (B.y-A.y) * (C.x-A.x)

# Return true if line segments AB and CD intersect
def intersect(A,B,C,D):
    return ccw(A,C,D) != ccw(B,C,D) and ccw(A,B,C) != ccw(A,B,D)
*/
function pointsCCW(A, B, C) {
    return (C.y-A.y) * (B.x-A.x) > (B.y-A.y) * (C.x-A.x);
}
function lineIntersect(A, B, C, D) {
    return pointsCCW(A,C,D) != pointsCCW(B,C,D) && pointsCCW(A,B,C) != pointsCCW(A,B,D);
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
        var x = p.x;
        var y = p.y;
        var dx = 0;
        var dy = 0;
        if (x < this.minX) dx = this.minX - x;
        else if (x > this.maxX) dx = x - this.maxX;
        if (y < this.minY) dy = this.minY - y;
        else if (y > this.maxY) dy = y - this.maxY;
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
        if (p.x < this.point.x) {
            p.x = this.point.x;
        }
        if (p.x > this.point.x + this.width) {
            p.x = this.point.x + this.width;
        }
        if (p.y < this.point.y) {
            p.y = this.point.y;
        }
        if (p.y > this.point.y + this.height) {
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

    //new stuff

    //take a line segment (two points, a-b) and return the segment intersects with the rectangle's boundary
    intersectBoundaryWithLine(a, b) {
        var topleft = new Point(this.point.x, this.point.y);
        var topright = new Point(this.point.x + this.width, this.point.y);
        var bottomleft = new Point(this.point.x, this.point.y + this.height);
        var bottomright = new Point(this.point.x + this.width, this.point.y + this.height);
        return lineIntersect(a, b, topleft, topright)
            || lineIntersect(a, b, topleft, bottomleft)
            || lineIntersect(a, b, bottomleft, bottomright)
            || lineIntersect(a, b, topright, bottomright);
    }

    intersectWithLine(a, b) {
        return this.contains(a) || this.contains(b) || this.intersectBoundaryWithLine(a, b);
    }
}

////////////////////////////////////////////////////////////////////////////////
//rendering
////////////////////////////////////////////////////////////////////////////////

//helpers, copied from The Flea
RenderHelper = {};
//
RenderHelper.drawRect = function (ctx, r, fill, stroke) {
    if (fill) ctx.fillStyle = fill;
    if (stroke) ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.rect(r.minX, r.minY, r.width, r.height);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}
RenderHelper.drawPoint = function (ctx, p, fill, stroke, radius) {
    if (fill) ctx.fillStyle = fill;
    if (stroke) ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.TAU);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}
RenderHelper.drawLine = function (ctx, a, b, color) {
    if (color) ctx.strokeStyle = color;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

////////////////////////////////////////////////////////////////////////////////
//robots
////////////////////////////////////////////////////////////////////////////////

//translating point robot
class RTPoint {

    getEndpoint(t0, t1) {
        return new Point(t0, t1);
    }

    //move the robot from pose (t0, t1) in c-space to position (x, y) in world space [in whatever way is reasonable for this robot]
    solveIK(x, y, t0, t1, res) {
        var sp = new Point(t0, t1);
        var ep = new Point(x, y);
        var delta = ep.copy();
        delta.sub(sp);
        delta.magnitude = res;
        //
        var ps = [];
        while(sp.distance(ep) > res) {
            ps.push(sp);
            sp.add(delta);
            sp = sp.copy();
        }
        ps.push(ep);
        return ps;
    }

    //return the number of obstacles that are in collision at configuration (t0, t1)
    testCollisions(obstacles, t0, t1) {
        var p = new Point(t0, t1);

        var collisions = 0;
        for (var i = 0; i < obstacles.length; i++) {
            if (obstacles[i].contains(p)) collisions++;
        }
        return collisions;
    }

    //ctx is pre-transformed to the [0, 1]^2 c-space coordinate system
    render(ctx, t0, t1) {
        // console.log("hi", t0, t1);
        RenderHelper.drawPoint(ctx, new Point(t0, t1), "#ffffff", null, 0.01);
    }
}

//translating circle robot
class RTCircle {
    constructor() {
        this.radius = 0.05;
    }

    getEndpoint(t0, t1) {
        return new Point(t0, t1);
    }

    //move the robot from pose (t0, t1) in c-space to position (x, y) in world space [in whatever way is reasonable for this robot]
    solveIK(x, y, t0, t1, res) {
        //
        var p_from = new Point(t0, t1);
        var p_to = new Point(x, y);
        var d = p_to.distance(p_from);
        //
        var ep = new Point(t0, t1); //don't move, cursor inside circle already
        if(d > this.radius) {
            //move shortest distance so cursor is on edge of circle
            var p_delta = p_to.copy();
            p_delta.sub(p_from);
            p_delta.multiply((d - this.radius) / d);
            ep = new Point(t0 + p_delta.x, t1 + p_delta.y);
        }
        //
        var sp = new Point(t0, t1);
        var delta = ep.copy();
        delta.sub(sp);
        delta.magnitude = res;
        //
        var ps = [];
        while(sp.distance(ep) > res) {
            ps.push(sp);
            sp.add(delta);
            sp = sp.copy();
        }
        ps.push(ep);
        return ps;
    }

    //return the number of obstacles that are in collision at configuration (t0, t1)
    testCollisions(obstacles, t0, t1) {
        var p = new Point(t0, t1);

        var collisions = 0;
        for (var i = 0; i < obstacles.length; i++) {
            if (obstacles[i].distance(p) <= this.radius) collisions++;
        }
        return collisions;
    }

    //ctx is pre-transformed to the [0, 1]^2 c-space coordinate system
    render(ctx, t0, t1) {
        // console.log("hi", t0, t1);
        RenderHelper.drawPoint(ctx, new Point(t0, t1), "#ffffff", null, this.radius);
    }
}

//arm with 2 revolute joints
class RArm {
    constructor() {
        this.l0 = 0.2; //length of upper arm
        this.l1 = this.l0; //length of lower arm
        //
        this.root = new Point(0.5, 0.5); //fixed at the center of the c-space
    }

    getEndpoint(t0, t1) {
        return this.getPoints(t0, t1)[2];
    }

    getPoints(t0, t1) {
        var p0 = this.root.copy();
        var p1 = new Point(this.l0, 0);
        p1.rotate(t0 * Math.TAU);
        p1.add(p0);
        var p2 = new Point(this.l1, 0);
        p2.rotate((t0 + t1) * Math.TAU);
        p2.add(p1);
        //
        return [p0, p1, p2];
    }

    //move the robot from pose (t0, t1) in c-space to position (x, y) in world space [in whatever way is reasonable for this robot]
    solveIK(x, y, t0, t1) {
        //angles, in radians
        var a0 = t0 * Math.TAU;
        var a1 = t1 * Math.TAU;
        //
        var p = new Point(x, y);
        var d = p.distance(this.root);
        if(d > this.l0 + this.l1) {
            //can't reach this point
            var angle = this.root.angleTo(p);
            if(angle < 0) angle = angle + Math.TAU;
            //
            a0 = angle;
            a1 = 0;
        } else {
            //reach the point

            //compute both flips (lower arm left or right) and do the one that requires moving the upper arm the least

            //1. rotate upper arm so that it is at distance d from the root
            a1 = Math.acos((d * d - this.l0 * this.l0 - this.l1 * this.l1) / (2 * this.l0 * this.l1)); //returns in [0, pi]
            var a1_ = Math.TAU - a1; //other way of tilting

            //2. rotate lower arm so that the endpoint is at p=(x, y)
            //we can just figure out where the endpoint is right now, then turn as much as necessary
            var endpoint = this.getPoints(t0, a1 / Math.TAU)[2];
            var angle_from = this.root.angleTo(endpoint);
            var angle_to = this.root.angleTo(p);
            var delta_angle = angle_to - angle_from;
            //
            var endpoint_ = this.getPoints(t0, a1_ / Math.TAU)[2];
            var angle_from_ = this.root.angleTo(endpoint_);
            var angle_to_ = this.root.angleTo(p);
            var delta_angle_ = angle_to_ - angle_from_;
            //angle wrapping sucks
            if(Math.min(Math.abs(delta_angle_), Math.abs(Math.abs(delta_angle_) - Math.TAU)) < Math.min(Math.abs(delta_angle), Math.abs(Math.abs(delta_angle) - Math.TAU))) {
                a1 = a1_;
                delta_angle = delta_angle_;
            }
            //
            a0 += delta_angle;
            if(a0 < 0) a0 = a0 + Math.TAU;
            if(a0 > Math.TAU) a0 = a0 - Math.TAU;

        }
        return [new Point(a0 / Math.TAU, a1 / Math.TAU)];
    }

    //return the number of obstacles that are in collision at configuration (t0, t1)
    testCollisions(obstacles, t0, t1) {
        //
        var ps = this.getPoints(t0, t1);
        var p0 = ps[0];
        var p1 = ps[1];
        var p2 = ps[2];
        //

        var collisions = 0;
        for(var i = 0; i < obstacles.length; i++) {
            if(obstacles[i].intersectWithLine(p0, p1) || obstacles[i].intersectWithLine(p1, p2)) collisions++;
        }
        return collisions;
    }

    //ctx is pre-transformed to the [0, 1]^2 c-space coordinate system
    render(ctx, t0, t1) {
        //
        var p0 = this.root;
        var p1 = new Point(this.l0, 0);
        p1.rotate(t0 * Math.TAU);
        p1.add(p0);
        var p2 = new Point(this.l1, 0);
        p2.rotate((t0 + t1) * Math.TAU);
        p2.add(p1);
        //
        ctx.lineWidth = 0.01;
        RenderHelper.drawLine(ctx, p0, p1, "#ffffff");
        RenderHelper.drawLine(ctx, p1, p2, "#ffffff");
    }
}

//rotating line on a slider
class RSlider {
    constructor() {
        this.l0 = 0.5; //length of the slider (centered at 0.5, 0.5)
        this.l1 = 0.2; //length of the arm (one end on slider)
    }

    getEndpoint(t0, t1) {
        var p0 = new Point(0.5 - this.l0 / 2, 0.5);
        p0.x += t0 * this.l0;
        //point at end
        var p1 = new Point(this.l1, 0);
        p1.rotate(t1 * Math.TAU);
        p1.add(p0);
        //
        return p1;
    }

    //convert an x position to a t0 on the slider
    invertX(x) {
        var x0 = 0.5 - this.l0 / 2;
        return (x - x0) / this.l0;
    }

    //move the robot from pose (t0, t1) in c-space to position (x, y) in world space [in whatever way is reasonable for this robot]
    solveIK(x, y, t0, t1) {
        var slider_left = new Point(0.5 - this.l0 / 2, 0.5);
        var slider_right = new Point(0.5 + this.l0 / 2, 0.5);
        var p = new Point(x, y);

        //case 1: point is perpendicular to slider segment (between endpoints)
        if(slider_left.x <= x && x <= slider_right.x) {
            if(Math.abs(y - 0.5) <= this.l1) {
                //1.1: reachable; rotate arm and slide
                var a = Math.asin((y - 0.5) / this.l1);
                var a_ = Math.PI - a; //other tilt
                if(a < 0) a = a + Math.TAU;
                if(a_ < 0) a_ = a_ + Math.TAU;
                //figure out which tilt is closer to current settings (and makes endpoint reachable)
                var x0 = (0.5 - this.l0 / 2) + this.l0 * t0; //current point on x axis
                var x1 = p.x - this.l1 * Math.cos(a);
                var x2 = p.x - this.l1 * Math.cos(a_);
                if((x1 < 0.5 - this.l0 / 2) || (x1 > 0.5 + this.l0 / 2)) {
                    //have to do x2
                    return [new Point(this.invertX(x2), a_ / Math.TAU)];
                } else if((x2 < 0.5 - this.l0 / 2) || (x2 > 0.5 + this.l0 / 2)) {
                    //have to do x1
                    return [new Point(this.invertX(x1), a / Math.TAU)];
                }
                if ((Math.abs(x1 - x0) < Math.abs(x2 - x0))) {
                    //preferable to do x1
                    return [new Point(this.invertX(x1), a / Math.TAU)];
                } else {
                    //preferable to do x2
                    return [new Point(this.invertX(x2), a_ / Math.TAU)];
                }
                //
            } else {
                //1.2: not reachable; stick straight up/down
                return [new Point(this.invertX(x), y > 0.5 ? (1/4) : (3/4))];
            }
        }
        //case 2: point is reachable from near one end of the slider
        else if(p.distance(slider_left) <= this.l1 || p.distance(slider_right) <= this.l1) {
            //duplicate code from above :) TODO clean

            var a = Math.asin((y - 0.5) / this.l1);
            var a_ = Math.PI - a; //other tilt
            if(a < 0) a = a + Math.TAU;
            if(a_ < 0) a_ = a_ + Math.TAU;
            //figure out which tilt is closer to current settings (and makes endpoint reachable)
            var x0 = (0.5 - this.l0 / 2) + this.l0 * t0; //current point on x axis
            var x1 = p.x - this.l1 * Math.cos(a);
            var x2 = p.x - this.l1 * Math.cos(a_);
            if((x1 < 0.5 - this.l0 / 2) || (x1 > 0.5 + this.l0 / 2)) {
                //have to do x2
                return [new Point(this.invertX(x2), a_ / Math.TAU)];
            } else if((x2 < 0.5 - this.l0 / 2) || (x2 > 0.5 + this.l0 / 2)) {
                //have to do x1
                return [new Point(this.invertX(x1), a / Math.TAU)];
            }
            if ((Math.abs(x1 - x0) < Math.abs(x2 - x0))) {
                //preferable to do x1
                return [new Point(this.invertX(x1), a / Math.TAU)];
            } else {
                //preferable to do x2
                return [new Point(this.invertX(x2), a_ / Math.TAU)];
            }

        }
        //case 3: point is not reachable, go to end of slider and aim towards it
        else {
            if(x < slider_left.x) {
                var a = slider_left.angleTo(p) / Math.TAU;
                if(a < 0) a = a + 1;
                return [new Point(0, a)];
            } else {
                var a = slider_right.angleTo(p) / Math.TAU;
                if(a < 0) a = a + 1;
                return [new Point(1, a)];
            }
        }
        
        // //point on slider
        // var p0 = slider_left.copy();
        // p0.x += t0 * this.l0;
        // //point at end
        // var p1 = new Point(this.l1, 0);
        // p1.rotate(t1 * Math.TAU);
        // p1.add(p0);
        // //

        //rotate arm the min amount to get to the necessary y offset

        //slide to get close to point
        return [t0, t1]; //TODO
    }

    //return the number of obstacles that are in collision at configuration (t0, t1)
    testCollisions(obstacles, t0, t1) {
        //point on slider
        var p0 = new Point(0.5 - this.l0 / 2, 0.5);
        p0.x += t0 * this.l0;
        //point at end
        var p1 = new Point(this.l1, 0);
        p1.rotate(t1 * Math.TAU);
        p1.add(p0);
        //
        var collisions = 0;
        for (var i = 0; i < obstacles.length; i++) {
            if(obstacles[i].intersectWithLine(p0, p1)) collisions++;
        }
        return collisions;
    }

    //ctx is pre-transformed to the [0, 1]^2 c-space coordinate system
    render(ctx, t0, t1) {
        var slider_left = new Point(0.5 - this.l0 / 2, 0.5);
        var slider_right = new Point(0.5 + this.l0 / 2, 0.5);
        //point on slider
        var p0 = slider_left.copy();
        p0.x += t0 * this.l0;
        //point at end
        var p1 = new Point(this.l1, 0);
        p1.rotate(t1 * Math.TAU);
        p1.add(p0);
        //

        //draw slider
        ctx.lineWidth = 0.01;
        RenderHelper.drawLine(ctx, slider_left, slider_right, "#a0a0a0");
        //draw arm
        ctx.lineWidth = 0.01;
        RenderHelper.drawLine(ctx, p0, p1, "#ffffff");
    }
}


////////////////////////////////////////////////////////////////////////////////
//running
////////////////////////////////////////////////////////////////////////////////

//https://stackoverflow.com/a/74622706
function decToHex(dec) {
    const part = Math.floor(dec * 255).toString(16)
    return `#${part}${part}${part}`
}

//a set of rectangular obstacles + a robot
class World {
    constructor(obstacles, robot, id) {
        this.obstacles = obstacles;
        this.robot = robot;
        this.id = id;
        //the two dof parameters; all parameters have range [0, 1] or [0, 1)
        this.t0 = Math.random();
        this.t1 = Math.random();
        //canvas element ids: canvas-robot-x and canvas-cspace-x
        this.canvas_robot = null;
        this.canvas_cspace = null;
        //visualization stuff
        this.pixels_per_batch = 100; //number of pixels to be updated per call to process()
        this.resolution_x = 0;
        this.resolution_y = 0;
        this.offset = 0; //next pixel index to start processing at
        this.data = null; //ImageData from the canvas, at its current resolution
        //
        this.mouseDownRobot = 0;
        this.mouseDownCspace = 0;
        //pose and endpoint tracking
        this.pts_robot = [];
        this.pts_pose = [];
        this.pts_resolution = 0.01; //dist through c-space between pose points
    }

    process() {
        //update c-space render, if necessary
        if (this.canvas_robot == null) {
            this.canvas_robot = document.getElementById("canvas-robot-" + this.id);
            this.canvas_robot.onmousemove = this.onMouseMoveRobot.bind(this);
            this.canvas_robot.onmousedown = this.onMouseDownRobot.bind(this);
            this.canvas_robot.onmouseup = this.onMouseUpRobot.bind(this);
            this.canvas_robot.onmouseleave = this.onMouseUpRobot.bind(this); //no dragging if leave
        }
        if (this.canvas_cspace == null) {
            this.canvas_cspace = document.getElementById("canvas-cspace-" + this.id);
            this.canvas_cspace.onmousemove = this.onMouseMoveCspace.bind(this);
            this.canvas_cspace.onmousedown = this.onMouseDownCspace.bind(this);
            this.canvas_cspace.onmouseup = this.onMouseUpCspace.bind(this);
            this.canvas_cspace.onmouseleave = this.onMouseUpCspace.bind(this); //no dragging if leave
        }
        if (this.canvas_robot != null && this.canvas_cspace != null) {

            if (this.resolution_x != this.canvas_cspace.width || this.resolution_y != this.canvas_cspace.height) {
                this.resolution_x = this.canvas_cspace.width;
                this.resolution_y = this.canvas_cspace.height;
                this.offset = 0;
                this.data = this.canvas_cspace.getContext("2d").createImageData(this.resolution_x, this.resolution_y);
            }

            var w = this.data.width;
            var h = this.data.height;
            var n = w * h;
            for (var i = 0; i < this.pixels_per_batch && this.offset < n; i++) {
                //calc pixel coords
                var x = (this.offset) % w;
                var y = (this.offset - x) / w;
                // console.log(x, y);
                //calc normalized c-space coords
                var p0 = x / w;
                var p1 = y / h;
                //check collision
                // var c = 1 - this.robot.testCollisions(this.obstacles, p0, p1) / (this.obstacles.length - 1); //1 = no collision, 0 = all collisions
                var c = 1 - (this.robot.testCollisions(this.obstacles, p0, p1) + 1) / (this.obstacles.length); //1 = no collision, 0 = all collisions
                c = Math.floor(c * 255);
                // console.log(c);
                //set pixel value
                this.data.data[(this.offset) * 4] = c;
                this.data.data[(this.offset) * 4 + 1] = c;
                this.data.data[(this.offset) * 4 + 2] = c;
                this.data.data[(this.offset) * 4 + 3] = 255;
                //
                this.offset++;
            }
        }
    }

    render() {
        //render robot
        if (this.canvas_robot != null) {
            this.canvas_robot.width = this.canvas_robot.clientWidth;
            this.canvas_robot.height = this.canvas_robot.clientWidth;

            var ctx = this.canvas_robot.getContext("2d");

            ctx.clearRect(0, 0, this.canvas_robot.width, this.canvas_robot.height);

            ctx.save();

            ctx.scale(this.canvas_robot.width, this.canvas_robot.height)

            for (var i = 0; i < this.obstacles.length; i++) {
                RenderHelper.drawRect(ctx, this.obstacles[i], "#000000");
            }

            for (var i = 0; i < this.pts_robot.length; i++) {
                RenderHelper.drawPoint(ctx, this.pts_robot[i], "#00ff00", null, 0.005);
            }

            this.robot.render(ctx, this.t0, this.t1);

            ctx.restore();
        }
        //render c-space
        if (this.canvas_cspace != null) {
            this.canvas_cspace.width = this.canvas_cspace.clientWidth;
            this.canvas_cspace.height = this.canvas_cspace.clientWidth;

            var ctx = this.canvas_cspace.getContext("2d");

            ctx.clearRect(0, 0, this.canvas_cspace.width, this.canvas_cspace.height);

            ctx.putImageData(this.data, 0, 0);

            ctx.save();

            ctx.scale(this.canvas_robot.width, this.canvas_robot.height)

            // ctx.drawImage(this.data_draw, 0, 0, 1, 1);

            for (var i = 0; i < this.pts_pose.length; i++) {
                RenderHelper.drawPoint(ctx, this.pts_pose[i], "#00ff00", null, 0.005);
            }

            RenderHelper.drawPoint(ctx, new Point(this.t0, this.t1), this.robot.testCollisions(this.obstacles, this.t0, this.t1) == 0 ? "#0000ff" : "#ff0000", null, 0.008);

            ctx.restore();
        }
    }

    onMouseMoveRobot(e) {
        // https://stackoverflow.com/a/10109204
        const x = e.pageX - e.currentTarget.offsetLeft;
        const y = e.pageY - e.currentTarget.offsetTop;

        // console.log(this.id, x, y, mouseDown);

        if (this.mouseDownRobot) {
            this.onMouseRobot(x, y);
        }

    }

    onMouseDownRobot(e) {
        this.mouseDownRobot = 1;
        //
        const x = e.pageX - e.currentTarget.offsetLeft;
        const y = e.pageY - e.currentTarget.offsetTop;

        // console.log(this.id, x, y, mouseDown);

        //reset path
        this.pts_robot = [];
        this.pts_pose = [];

        if (this.mouseDownRobot) {
            this.onMouseRobot(x, y);
        }
    }

    onMouseUpRobot(e) {
        this.mouseDownRobot = 0;
        //
        // const x = e.pageX - e.currentTarget.offsetLeft;
        // const y = e.pageY - e.currentTarget.offsetTop;

        // console.log(this.id, x, y, mouseDown);

        // if(mouseDown) {
        //     this.onMouse(x, y);
        // }
    }

    //use this to set the robot's configuration (using ik)
    onMouseRobot(x, y) {
        // console.log(x, y, this.canvas_cspace.clientWidth, this.canvas_cspace.clientHeight)
        x = x / this.canvas_cspace.clientWidth;
        y = y / this.canvas_cspace.clientHeight;
        // console.log(x, y);
        var ps = this.robot.solveIK(x, y, this.t0, this.t1, this.pts_resolution);
        for(var i = 0; i < ps.length; i++) {
            var p = ps[i];
            this.pts_pose.push(p);
            this.pts_robot.push(this.robot.getEndpoint(p.x, p.y));
        }
        var p = ps[ps.length - 1];
        this.t0 = p.x;
        this.t1 = p.y;
    }

    onMouseMoveCspace(e) {
        // https://stackoverflow.com/a/10109204
        const x = e.pageX - e.currentTarget.offsetLeft;
        const y = e.pageY - e.currentTarget.offsetTop;

        // console.log(this.id, x, y, mouseDown);

        if (this.mouseDownCspace) {
            this.onMouseCspace(x, y);
        }

    }

    onMouseDownCspace(e) {
        this.mouseDownCspace = 1;
        //
        const x = e.pageX - e.currentTarget.offsetLeft;
        const y = e.pageY - e.currentTarget.offsetTop;

        // console.log(this.id, x, y, mouseDown);

        //reset path
        this.pts_robot = [];
        this.pts_pose = [];

        if (this.mouseDownCspace) {
            this.onMouseCspace(x, y);
        }
    }

    onMouseUpCspace(e) {
        this.mouseDownCspace = 0;
        //
        // const x = e.pageX - e.currentTarget.offsetLeft;
        // const y = e.pageY - e.currentTarget.offsetTop;

        // console.log(this.id, x, y, mouseDown);

        // if(mouseDown) {
        //     this.onMouse(x, y);
        // }
    }

    //use this to set the robot's configuration (directly to specified pose)
    onMouseCspace(x, y) {
        // console.log(x, y, this.canvas_cspace.clientWidth, this.canvas_cspace.clientHeight)
        x = x / this.canvas_cspace.clientWidth;
        y = y / this.canvas_cspace.clientHeight;
        // console.log(x, y);
        if(this.pts_pose.length > 0) {
            //interpolate path
            var p = this.pts_pose[this.pts_pose.length - 1].copy();
            var ep = new Point(x, y);
            var delta = ep.copy();
            delta.sub(p);
            delta.magnitude = this.pts_resolution;;
            while(p.distance(ep) > this.pts_resolution) {
                p.add(delta);
                this.pts_pose.push(p);
                this.pts_robot.push(this.robot.getEndpoint(p.x, p.y));
                p = p.copy();
            }
        } else {
            //new path
            this.pts_pose.push(new Point(x, y));
            this.pts_robot.push(this.robot.getEndpoint(x, y));
        }
        //
        this.t0 = x;
        this.t1 = y;
    }
}

class Runner {

    constructor(worlds) {
        this.worlds = worlds;
        this.run = this.run.bind(this);
    }

    run(t) {
        //multiple processing passes to fill in c-space visualizations (up to a limit of 3ms per frame)
        var time_start = Date.now();
        while (Date.now() - time_start < 3) {
            for (var i = 0; i < this.worlds.length; i++) {
                this.worlds[i].process();
            }
        }
        //render
        for (var i = 0; i < this.worlds.length; i++) {
            this.worlds[i].render();
        }
        // console.log(t);
        // console.log(this.worlds);
        requestAnimationFrame(this.run);
    }
}


////////////////////////////////////////////////////////////////////////////////
//setup
////////////////////////////////////////////////////////////////////////////////

//[new Rectangle(0.1, 0.1, 0.2, 0.1), new Rectangle(0.8, 0.3, 0.1, 0.2), new Rectangle(0.2, 0.6, 0.3, 0.3)]
var o = [new Rectangle(0.1, 0.1, 0.2, 0.1), new Rectangle(0.8, 0.3, 0.1, 0.2), new Rectangle(0.15, 0.55, 0.3, 0.3), new Rectangle(0.5, 0.75, 0.1, 0.1)];

var worlds = [
    new World(o, new RTPoint(), "tpoint"),
    new World(o, new RTCircle(), "tcircle"),
    new World(o, new RArm(), "arm"),
    new World(o, new RSlider(), "slider")
];

var runner = new Runner(worlds);

runner.run(0);