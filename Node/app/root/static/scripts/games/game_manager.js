

class GameManager {
  constructor(game, options) {

    this.game = game;

    options = options || {};

    this.keys = new Keys();
    this.images = new ImageStore(options.imagePath || game.name);

    this.canvas = document.getElementById(options.canvasName || "gameCanvas");
    this.ctx = canvas.getContext("2d");

    this.canvasInset = options.canvasInset || 0;
    this.edgePadding = options.edgePadding || 0;

    this.running = false;
  }

  init() {
    this.keys.register();
    this.game.register(keys);

    this.running = false;
  }

  start() {
    this.running = true;

    //run the loop
  }

  stop() {
    this.game.unregister(keys);
    this.keys.unregister();

    this.running = false;
  }
}