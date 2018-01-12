class PolyDestructGame extends Game {
  constructor() {
    super("polydestruct");

    this.tick = 0;
    this.guiManager = new GuiManager(this);
  }

  register(keys, mouse) {
    this.keys = keys;
    this.mouse = mouse;
    this.guiManager.register(keys, mouse);
  }

  unregister(keys, mouse) {
    this.guiManager.unregister(keys, mouse);
  }

  update(tickPart) {
    this.tick += tickPart;
  }

  //ctx = canvas 2d drawing context
  render(ctx, width, height) {
    var tick = ((((this.tick * 5) % width) % height) / 2);

    ctx.beginPath();

    ctx.rect(0, 0, width, height);

    ctx.closePath();
    ctx.lineWidth = 2; //since this line is on the border, only 1px actually gets drawn
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  }
}

//use default options
var gameManager = new GameManager(new PolyDestructGame(), {
  canvasInset: 5 //prevents chrome from making scrollbars
});
gameManager.start();