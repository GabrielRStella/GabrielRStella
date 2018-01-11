class PolyWarGame extends Game {
  constructor() {
    super("polywar");

    this.tick = 0;
  }

  register(keys) {
  }

  unregister(keys) {
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
var gameManager = new GameManager(new PolyWarGame(), {
  canvasInset: 5 //prevents chrome from making scrollbars
});
gameManager.start();