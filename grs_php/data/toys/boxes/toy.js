class BoxesGame extends Game {
  constructor() {
    super("boxes");

    this.tick = 0;

    this.colorCursorBox = "rgba(0, 0, 255, 0.5)";
    this.colorPushBox = "rgba(255, 0, 0, 0.5)";

    this.centerBox = new Rectangle(0, 0, 100, 100);
    this.cursorBox = new Rectangle(0, 0, 100, 100);
    this.pushBox = new Rectangle(0, 0, 100, 100);
  }

  register(keys, mouse) {
    this.mouse = mouse;
  }

  unregister(keys, mouse) {
  }

  update(tickPart) {
    this.tick += tickPart;
  }

  drawRect(ctx, r, fill, stroke) {
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.rect(r.minX, r.minY, r.width, r.height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawPoint(ctx, p, color, radius) {
    if(color) ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius || 2, 0, Math.TAU);
    ctx.closePath();
    ctx.fill();
  }

  drawLine(ctx, a, b, color) {
    if(color) ctx.strokeStyle = color;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  //ctx = canvas 2d drawing context
  render(ctx, width, height) {
    //draw a border
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.lineWidth = 2; //since this line is on the border, only 1px actually gets drawn
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    //put center box in center
    this.centerBox.center = new Point(width / 2, height / 2);

    //put mouse box at mouse
    var mouse = this.mouse.mouse;
    this.cursorBox.center = mouse; //auto-copies

    //put push box at ... push
    this.pushBox.center = mouse; //auto-copies
    this.centerBox.push(this.pushBox);

    //draw
    this.drawRect(ctx, this.centerBox,
        this.centerBox.intersects(this.cursorBox) ? (this.centerBox.contains(mouse) ? "#ffffff" : "#ffffff80") : "#000000",
      "#ffffff");
    this.drawRect(ctx, this.cursorBox, this.colorCursorBox, "#ffffff");
    this.drawRect(ctx, this.pushBox, this.colorPushBox, "#ffffff");

    //todo: some lines
    var edge = mouse.copy();
    this.centerBox.pushPoint(edge);
    this.drawLine(ctx, mouse, edge, "#00ff00");
  }
}

//use default options
var gameManager = new GameManager(new BoxesGame(), {});
gameManager.start();