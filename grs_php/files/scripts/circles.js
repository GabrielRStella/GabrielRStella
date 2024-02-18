////////////////////////////////////////////////////////////////////////////////

//r, g, b, in [0, 1]
function color_from_rgb(r, g, b) {
    return "rgb(" + Math.round(r * 255) + "," + Math.round(g * 255) + "," + Math.round(b * 255) + ")";
}

//r, g, b, in [0, 1]
function color_from_array(rgb) {
    return color_from_rgb(rgb[0], rgb[1], rgb[2]);
}

function color_eq(a, b) {
    return color_from_array(a) == color_from_array(b);
}

//takes a single color and creates a function that returns that color
//color = [r, g, b]
function color_generator_single(color) {
    return function(part) {
        return color;
    };
}

//takes two [r, g, b] colors and creates a function that interpolates between them
function color_generator_gradient(color1, color2) {
    return function(part) {
        var p2 = (1 - part);
        return [
            p2 * color1[0] + part * color2[0],
            p2 * color1[1] + part * color2[1],
            p2 * color1[2] + part * color2[2],
        ];
    };
}

//default color generator: white circles with black borders
class ColorGenerator {
    //part=0 is the background
    //otherwise will be in (0, 1]
    get_fill_color(part) {
        return "#ffffff";
    }

    //part=0 is the bg border
    //otherwise will be in (0, 1]
    get_border_color(part) {
        return "#000000";
    }

    needs_border() {
        return true;
    }
}

//simple color generator: single fill color func, single border color func
class ColorGeneratorSimple {
    constructor(fill, border) {
        this.fill = fill;
        this.border = border;
    }
    
    //part=0 is the background
    //otherwise will be in (0, 1]
    get_fill_color(part) {
        return this.fill(part);
    }

    //part=0 is the bg border
    //otherwise will be in (0, 1]
    get_border_color(part) {
        return this.border(part);
    }

    needs_border() {
        return color_eq(this.fill(0), this.fill(1));
    }
}

//color generator that modifies the background color and border
class ColorGeneratorSimpleBackground {
    constructor(fill, secondary) {
        this.fill = fill;
        this.secondary = secondary;
    }
    
    //part=0 is the background
    //otherwise will be in (0, 1]
    get_fill_color(part) {
        if(part > 0) return this.secondary.get_fill_color(part);
        return this.fill;
    }

    //part=0 is the bg border
    //otherwise will be in (0, 1]
    get_border_color(part) {
        return this.secondary.get_border_color(part);
    }

    needs_border() {
        return color_eq(this.fill, this.secondary.get_fill_color(0)) && color_eq(this.fill, this.secondary.get_fill_color(1)); //simple rule, should be good enough
    }
}

function get_random_color() {
    //make a nice random color
    //TODO: fruity / pastel / etc
    return [Math.random(), Math.random(), Math.random()];
}

//randomly generate either a single color or a gradient
function create_color_func() {
    if (Math.random() < 0.4) {
        //random solid color
        return color_generator_single(get_random_color());
    } else if(Math.random() < 0.5) {
        //gradient
        return color_generator_gradient(get_random_color(), get_random_color());
    } else{
        //black or white
        return color_generator_single((Math.random() < 0.5) ? [0, 0, 0] : [1, 1, 1]);
    }
}

//generate a random color generator
function create_color_generator() {
    var gen_base = new ColorGeneratorSimple(create_color_func(), create_color_func());
    //white bg
    if(Math.random() < 0.4) {
        return new ColorGeneratorSimpleBackground([1, 1, 1], gen_base);
    }
    //consistent coloring
    if(Math.random() < 0.5) {
        return (Math.random() < 0.5) ? gen_base : //background = color 1
        new ColorGeneratorSimpleBackground(gen_base.get_fill_color(1), gen_base); //background = color 2
    }
    //random color background
    //TODO: checks to ensure it doesn't generate e.g. black on black
    return new ColorGeneratorSimpleBackground(get_random_color(), gen_base);
    // return new ColorGenerator();
}

////////////////////////////////////////////////////////////////////////////////

class Circle {
    constructor(x, y, max_size, fill_color, border_color) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.max_size = max_size;
        this.fill_color = fill_color;
        this.border_color = border_color;
    }

    //distance to center, >= 0
    distance_center(x, y) {
        var dx = x - this.x;
        var dy = y - this.y;
        return Math.sqrt((dx * dx) + (dy * dy));
    }

    //SDF: >0 outside, =0 on border, <0 inside
    distance_edge(x, y) {
        return this.distance_center(x, y) - this.radius;
    }

    //
    contains(x, y) {
        return this.distance_edge(x, y) <= 0;
    }

    //return true if it reached max size
    grow(dr) {
        this.radius = Math.min(this.radius + dr, this.max_size);
        return this.radius == this.max_size;
    }
}

class Circles {

    ////////////////////////////////////////////////////////////////////////////////

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.prev_canvas_size = -1;

        //TODO: on left click event, reset
        //right click can be used to save image :)
        canvas.addEventListener("click", this.onClick.bind(this));
        
        this.restart();

        //initial settings
        this.color_generator = new ColorGeneratorSimpleBackground([1, 1, 1],
            new ColorGeneratorSimple(
                (Math.random() < 0.5) ? color_generator_single([0.2, 0.5, 1.0]) : color_generator_gradient([0.125, 0.14, 0.48], [1, 0, 0]),
                // color_generator_gradient([0.2, 0.5, 1.0], [1, 0.25, 0]),
                // color_generator_gradient([0.2, 0.5, 1.0], [1, 0, 0]),
                color_generator_single([0, 0, 0])
                )
            );
        this.border_thickness = 0;

        //start updating + rendering
        this.update = this.update.bind(this);
        requestAnimationFrame(this.update);
    }

    onClick(event) {
        this.restart();
    }

    ////////////////////////////////////////////////////////////////////////////////
    //color/etc helpers

    //index=0 is the background
    get_fill_color(index) {
        var p = index / this.N; ;
        return color_from_array(this.color_generator.get_fill_color(Math.sqrt(p)));
    }

    //index=0 is the bg border
    get_border_color(index) {
        return color_from_array(this.color_generator.get_border_color(index / this.N));
    }

    ////////////////////////////////////////////////////////////////////////////////
    //spacing helpers

    //returns array of [x, y]
    get_random_point() {
        var x = Math.random() * (this.radius * 2) - this.radius;
        var y = Math.random() * (this.radius * 2) - this.radius;
        return [x, y];
    }

    //returns true iff not inside any circle, but is inside border
    is_point_valid(x, y) {
        if (Math.sqrt((x * x) + (y * y)) > this.radius) return false; //outside of border
        for(var circle of this.circles) {
            if (circle.contains(x, y)) return false; //inside other circle
        }
        //
        return true;
    }

    get_max_size(x, y) {
        var max_size = this.radius;
        //not outside of bounds
        max_size = Math.min(max_size, this.radius - Math.sqrt(x * x + y * y));
        //not colliding with other circles
        for(var circle of this.circles) {
            max_size = Math.min(max_size, circle.distance_edge(x, y));
        }
        //
        return max_size;
    }

    ////////////////////////////////////////////////////////////////////////////////
    //...

    new_circle(index) {
        //
        var pos = this.get_random_point();
        if(!this.is_point_valid(pos[0], pos[1])) {
            return null; //skip and try again on next tick, to reduce lag when # of circles is already large
        }
        //x, y, max_size, fill_color, border_color
        var x = pos[0];
        var y = pos[1];
        return new Circle(x, y, this.get_max_size(x, y), this.get_fill_color(index + 1), this.get_border_color(index + 1));
    }

    ////////////////////////////////////////////////////////////////////////////////
    //restart

    restart() {

        //clear canvas
        
        // this.ctx.fillStyle="#ffffff00";
        // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        //reset basic stuff

        this.N = Math.round(Math.pow(Math.random(), 1.5) * 1000); //max number of circles

        this.time = Date.now(); //time since epoch, in ms
        this.prev_time = this.time; //time since last frame

        //set initial parameters randomly:
        //initial border color, final border color, border thickness, initial fill color, final fill color, blend mode (rgb, hsv, ?)
        this.color_generator = create_color_generator();
        this.border_thickness = Math.random() + 1;
        if(!this.color_generator.needs_border() && Math.random() < 0.5) this.border_thickness = 0; //turn off borders half the time

        //

        this.circles = [];

        this.current_circle = this.new_circle(0);
    }

    ////////////////////////////////////////////////////////////////////////////////
    //update

    update() {
        this.logic();
        this.render();
        requestAnimationFrame(this.update);
    }

    logic() {
        var new_time = Date.now();
        var dt = (new_time - this.prev_time) / 1000.0;
        this.prev_time = new_time;
        //
        if(this.current_circle == null && this.circles.length < this.N) {
            this.current_circle = this.new_circle(this.circles.length);
        }
        if (this.current_circle != null) {
            if(this.current_circle.grow(dt * this.radius / 5)) {
                this.circles.push(this.current_circle);
                this.current_circle = null;
            }
        }
    }

    draw_circle(circle) {
        var ctx = this.ctx;
        //
        ctx.fillStyle = circle.fill_color;
        ctx.strokeStyle = circle.border_color;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        if(this.border_thickness > 0) ctx.stroke();
    }

    render() {
        var canvas = this.canvas;
        var ctx = this.ctx;
        //
        //TODO: dynamic resizing when window resizes
        var sz = canvas.width;
        canvas.height = sz;
        var padding = 5;
        this.radius = sz / 2 - padding * 2; //give a bit of space near the edge
        //
        if(sz != this.prev_canvas_size) {
            this.prev_canvas_size = sz;
            this.circles = [];
            this.current_circle = null;
        }
        //
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, sz, sz);
        
        ctx.lineWidth = this.border_thickness;

        ctx.save();
        ctx.translate(this.radius + padding, this.radius + padding);
        //
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.rect(0, 0, 10, 10);
        ctx.closePath();
        ctx.fill();
        //draw bg
        var bg = new Circle(0, 0, 0, this.get_fill_color(0), this.get_border_color(0));
        bg.radius = this.radius;
        this.draw_circle(bg);
        //TODO: sort circles in decreasing order of radius
        for(var i = this.circles.length; i > 0; i--) {
            this.draw_circle(this.circles[i - 1]);
        }
        if(this.current_circle != null) this.draw_circle(this.current_circle);
        //
        ctx.restore();
    }

    ////////////////////////////////////////////////////////////////////////////////
}

var CIRCLES = new Circles(document.getElementById("circles"));