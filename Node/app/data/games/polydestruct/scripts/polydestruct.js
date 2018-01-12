class GuiScreenPolygon extends Gui {
  constructor(poly) {
    super();
    this.poly = poly;
  }

  //when it first gets added on
  enter(guiManager) {
    this.guiManager = guiManager;
  }

  //final: is this gui coming off the stack, or is it just being covered
  exit(guiManager, final) {}

  register(keys, mouse) {
    this.keys = keys;
    this.mouse = mouse;

    this.LISTENER_MOUSE_CLICK = mouse.addListener("click", function(evt) {
      var p = mouse.getMousePos(evt);
    }.bind(this));
  }

  unregister(keys, mouse) {
    mouse.removeListener(this.LISTENER_MOUSE_CLICK);
  }

  update(tickPart) {
    
  }

  render(ctx, width, height) {
    ctx.save();
    ctx.fillStyle = "#00ff00";
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    var radius = 3;

    var points = this.poly.points;
    var prev = null;
    for(var i = 0; i <= points.length; i++) {
      var p = points[i % points.length];

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.TAU);
      ctx.closePath();
      ctx.fill();

      if(prev) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
      prev = p;
    }

    var mouse = this.mouse.mouse;
    //what now? rockets and debug stuff

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    this.renderTitle(ctx, "Destroy the Polygon");

    ctx.restore();
  }
}

class GuiScreenInitial extends Gui {
  constructor() {
    super();
    this.points = [];
    this.tolerance = 20;
  }

  //when it first gets added on
  enter(guiManager) {
    this.guiManager = guiManager;
  }

  //final: is this gui coming off the stack, or is it just being covered
  exit(guiManager, final) {}

  register(keys, mouse) {
    this.keys = keys;
    this.mouse = mouse;

    this.LISTENER_MOUSE_CLICK = mouse.addListener("click", function(evt) {
      var p = mouse.getMousePos(evt);
      for(var i = 0; i < this.points.length; i++) {
        if(this.points[i].distance(p) < this.tolerance) {
          var poly = new Polygon(this.points); //dont need to add the final point
          this.guiManager.push(new GuiScreenPolygon(poly));
          return;
        }
      }
      this.points.push(p);
    }.bind(this));
  }

  unregister(keys, mouse) {
    mouse.removeListener(this.LISTENER_MOUSE_CLICK);
  }

  update(tickPart) {
    
  }

  render(ctx, width, height) {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    var radius = 3;

    var mouse = this.mouse.mouse;

    var prev = null;
    for(var i = 0; i <= this.points.length; i++) {
      var p = null;
      if(i == this.points.length) p = mouse;
      else p = this.points[i];

      ctx.beginPath();
      if(i == 0 && p != this.mouse.mouse && p.distance(this.mouse.mouse) < this.tolerance) {
        ctx.fillStyle = "#ff0000";
        mouse = p;
      } else {
        ctx.fillStyle = "#ffffff";
      }
      ctx.arc(p.x, p.y, radius, 0, Math.TAU);
      ctx.closePath();
      ctx.fill();

      if(prev) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
      prev = p;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, this.tolerance, 0, Math.TAU);
    ctx.closePath();
    ctx.strokeStyle = "#ff0000";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    this.renderTitle(ctx, "Create a Polygon");

    ctx.restore();
  }
}

class PolyDestructGame extends Game {
  constructor() {
    super("polydestruct");

    this.tick = 0;
    this.guiManager = new GuiManager(this);
    this.guiManager.push(new GuiScreenInitial());
  }

  register(keys, mouse) {
    this.guiManager.register(keys, mouse);
  }

  unregister(keys, mouse) {
    this.guiManager.unregister(keys, mouse);
  }

  update(tickPart) {
    this.tick += tickPart;
    this.guiManager.update(tickPart);
  }

  //ctx = canvas 2d drawing context
  render(ctx, width, height) {
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.lineWidth = 2; //since this line is on the border, only 1px actually gets drawn
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    this.guiManager.render(ctx, width, height);
  }
}

//use default options
var gameManager = new GameManager(new PolyDestructGame(), {
  canvasInset: 5 //prevents chrome from making scrollbars
});
gameManager.start();