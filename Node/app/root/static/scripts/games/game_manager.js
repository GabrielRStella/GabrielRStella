class GameManager {

  /*
    all options:
    -canvasName = "gameCanvas"
    -canvasInset = 0
    -edgePadding = 0
    -imagePath = game.name
    -ticksPerSec = 20
  */

  constructor(game, options) {

    this.game = game;

    options = options || {};

    this.canvas = document.getElementById(options.canvasName || "gameCanvas");
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.ctx = this.canvas.getContext("2d");
    this.canvasInset = options.canvasInset || 0;
    this.edgePadding = options.edgePadding || 0;

    this.keys = new Keys();
    this.images = new ImageStore(options.imagePath || game.name);
    this.mouse = new MouseListener(this.canvas, this.edgePadding);

    this.ticksPerSec = options.ticksPerSec || 20;
    this.msPerTick = 1000 / this.ticksPerSec;

    this.update = this.update.bind(this);
    this.running = false;



    game.gameManager = this;
  }

  start() {
    this.keys.register();
    this.mouse.register();
    this.game.register(this.keys);

    this.running = true;
    this.prevTickMs = new Date().getTime();

    requestAnimationFrame(this.update);
  }

  update() {
    if(!this.running) return;

    var ms = new Date().getTime();
    var part = (ms - this.prevTickMs) / this.msPerTick;

    //resize
    if(this.prevWindowWidth != window.innerWidth || this.prevWindowHeight != window.innerHeight) {
      this.prevWindowWidth = window.innerWidth;
      this.prevWindowHeight = window.innerHeight;

      //reset canvas
      var canvas = this.canvas;

      var canvasInset = this.canvasInset * 2;
      var edgePadding = this.edgePadding * 2;
      canvas.width = window.innerWidth - canvasInset;
      canvas.height = window.innerHeight - canvasInset;
      this.width = canvas.width - edgePadding;
      this.height = canvas.height - edgePadding;
    }

    //prepare for next screen
    var ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.translate(this.edgePadding, this.edgePadding);

    this.game.update(part);
    this.game.render(ctx, this.width, this.height);

    this.prevTickMs = ms;

    requestAnimationFrame(this.update);
  }

  stop() {
    this.game.unregister(this.keys);
    this.keys.unregister();

    //TODO
    //this.mouse.unregister();

    this.running = false;
  }
}