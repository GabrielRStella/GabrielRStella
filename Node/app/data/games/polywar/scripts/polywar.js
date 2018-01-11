class PolyWarGame extends Game {
  constructor() {
    super("polywar");
  }

  register(keys) {
  }

  unregister(keys) {
  }

  update(tickPart) {
    console.log(tickPart);
  }

  //ctx = canvas 2d drawing context
  render(ctx, width, height) {
  }
}

//use default options
var gameManager = new GameManager(new PolyWarGame());
//gameManager.start();