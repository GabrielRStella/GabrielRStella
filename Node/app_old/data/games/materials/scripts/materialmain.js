class MaterialsGame extends Game {
  constructor() {
    super("materials");

    this.tick = 0;
  }

  register(keys, mouse) {
  }

  unregister(keys, mouse) {
  }

  update(tickPart) {
    this.tick += tickPart;
  }

  //ctx = canvas 2d drawing context
  render(ctx, width, height) {
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.lineWidth = 2; //since this line is on the border, only 1px actually gets drawn
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  }
}

//use default options
var gameManager = new GameManager(new MaterialsGame(), {
  canvasInset: 5 //prevents chrome from making scrollbars
});
gameManager.start();