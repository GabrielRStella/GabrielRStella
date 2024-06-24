//helpers, copied from The Flea
RenderHelper = {};
//
RenderHelper.drawRect = function(ctx, r, fill, stroke) {
  if(fill) ctx.fillStyle = fill;
  if(stroke) ctx.strokeStyle = stroke;
  ctx.beginPath();
  ctx.rect(r.minX, r.minY, r.width, r.height);
  ctx.closePath();
  if(fill) ctx.fill();
  if(stroke) ctx.stroke();
}
RenderHelper.drawPoint = function(ctx, p, fill, stroke, radius) {
  if(fill) ctx.fillStyle = fill;
  if(stroke) ctx.strokeStyle = stroke;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius || 2, 0, Math.TAU);
  ctx.closePath();
  if(fill) ctx.fill();
  if(stroke) ctx.stroke();
}
RenderHelper.drawLine = function(ctx, a, b, color) {
  if(color) ctx.strokeStyle = color;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}
RenderHelper.drawText = function(ctx, text, baseline, align, size, p, fill, stroke) {
  if(fill) ctx.fillStyle = fill;
  if(stroke) ctx.strokeStyle = stroke;
  ctx.font = size + 'px sans-serif';
  ctx.textBaseline = baseline;
  ctx.textAlign = align;
  if(fill) ctx.fillText(text, p.x, p.y);
  if(stroke) ctx.strokeText(text, p.x, p.y);
}
RenderHelper.drawTextCentered = function(ctx, text, size, p, fill, stroke) {
  if(fill) ctx.fillStyle = fill;
  if(stroke) ctx.strokeStyle = stroke;
  ctx.font = size + 'px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  if(fill) ctx.fillText(text, p.x, p.y);
  if(stroke) ctx.strokeText(text, p.x, p.y);
}

function randPoint(r) {
  return new Point(GameLib.randomRangeFloor(0, r.width), GameLib.randomRangeFloor(0, r.height));
}

function color(r, g, b, a) {
  return "rgba(" + Math.floor(r * 255) + "," + Math.floor(g * 255) + "," + Math.floor(b * 255) + "," + a + ")";
}

//let the user control all aspects above
var DAT_GUI = new dat.GUI();

class DiffuseGame extends Game {
  constructor() {
    super("diffuse");
    
    this.updateSize = this.updateSize.bind(this);
    this.updateN = this.updateN.bind(this);
    
    this.Paused = false;
    DAT_GUI.add(this, "Paused");
    this.Width = 80;
    DAT_GUI.add(this, "Width", 1, 300).onFinishChange(this.updateSize);
    this.Height = 40;
    DAT_GUI.add(this, "Height", 1, 300).onFinishChange(this.updateSize);
    this.N = 5;
    DAT_GUI.add(this, "N", 1, 100).onFinishChange(this.updateN);
    this.Rate = 0.25;
    DAT_GUI.add(this, "Rate", 0, 1);
    this.Reset = this.reset.bind(this);
    DAT_GUI.add(this, "Reset");
    //color stuff
    this.R = 0.1;
    this.G = 0.4;
    this.B = 1;
    DAT_GUI.add(this, "R", 0, 1);
    DAT_GUI.add(this, "G", 0, 1);
    DAT_GUI.add(this, "B", 0, 1);
    
    this.vals = [];
    this.entities = [];
    this.partialTick = 0;
    
    this.metric = 0;
    
    this.reset();
  }
  
  updateSize() {
    this.Width = Math.round(this.Width);
    this.Height = Math.round(this.Height);
    /*
    var w = this.Width;
    var h = this.Height;
    
    //do some updates
    
    this.prevWidth = w;
    this.prevHeight = h;
    */
    this.reset(); //am lazy
  }
  
  updateN() {
    var n = this.N = Math.round(this.N);
    
    //do some updates
    
    if(n > this.prevN) {
      var w = this.Width;
      var h = this.Height;
      while(this.entities.length < n) {
        var x = GameLib.randomRangeFloor(0, w);
        var y = GameLib.randomRangeFloor(0, h);
        this.entities.push(new Point(x, y));
      }
    } else if(n < this.prevN) {
      this.entities.splice(n, this.prevN - n);
    }
    
    this.prevN = n;
  }
  
  reset() {
    var w = this.Width;
    var h = this.Height;
    var v = new Array(w);
    this.vals = new Array(w);
    for(var x = 0; x < w; x++) {
      this.vals[x] = new Array(h);
    }
    for(var x = 0; x < w; x++) {
      for(var y = 0; y < h; y++) {
        this.vals[x][y] = Math.random();
      }
    }
    var n = this.N;
    var e = this.entities = new Array(n);
    for(var i = 0; i < n; i++) {
      var x = GameLib.randomRangeFloor(0, w);
      var y = GameLib.randomRangeFloor(0, h);
      e[i] = new Point(x, y);
    }
    
    this.partialTick = 0;
    
    this.prevWidth = w;
    this.prevHeight = h;
    this.prevN = n;
  }

  update(tickPart) {
    if(this.Paused) return;
    
    //update all entities
    this.partialTick += tickPart;
    if(this.partialTick >= 1) {
      this.partialTick = 0;
      //do the update
      var w = this.prevWidth;
      var h = this.prevHeight;
      var n = this.N;
      var entities = this.entities;
      for(var i = 0; i < entities.length; i++) {
        var e = entities[i];
        var x = e.x;
        var y = e.y;
        var dx = GameLib.randomRangeFloor(-1, 2);
        var dy = GameLib.randomRangeFloor(-1, 2);
        var nx = GameLib.loopRange(x + dx, w);
        var ny = GameLib.loopRange(y + dy, h);
        //transfer matter
        var m = this.vals[x][y] * this.Rate;
        this.vals[x][y] -= m;
        this.vals[nx][ny] += m;
        //update entity
        e.x = nx;
        e.y = ny;
      }
      //recalculate metric
      //it's just variance
      this.metric = 0;
      var avg = 0;
      for(var x = 0; x < w; x++) {
        for(var y = 0; y < h; y++) {
          avg += this.vals[x][y];
        }
      }
      avg /= (w * h);
      for(var x = 0; x < w; x++) {
        for(var y = 0; y < h; y++) {
          var v = (this.vals[x][y] - avg);
          this.metric += v * v;
        }
      }
      this.metric /= (w * h);
    }
  }

  //ctx = canvas 2d drawing context
  render(ctx, width, height) {
    var vals = this.vals;
    var w = this.prevWidth;
    var h = this.prevHeight;
    var sx = width / w;
    var sy = height / h;
    //draw all cells
    for(var x = 0; x < w; x++) {
      var a = vals[x];
      for(var y = 0; y < h; y++) {
        var c = color(this.R, this.G, this.B, a[y]);
        RenderHelper.drawRect(ctx, new Rectangle(x * sx, y * sy, sx, sy), c, null);
      }
    }
    //draw point at each  entity
    var entities = this.entities;
    for(var i = 0; i < entities.length; i++) {
      var e = entities[i];
      var p = new Point((e.x + 0.5) * sx, (e.y + 0.5) * sy);
      //RenderHelper.drawPoint(ctx, p, "#ffffff", null, 2);
    }
    //display cell value variance
    RenderHelper.drawText(ctx, "" + Math.round(this.metric * 1000) / 1000, "top", "left", 36, new Point(10, 10), "#ffffff", null);
  }
}

//use default options
var gameManager = new GameManager(new DiffuseGame(), {});
gameManager.start();