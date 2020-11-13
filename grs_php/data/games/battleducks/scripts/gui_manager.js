class GuiManager {

  constructor(gui, name) {

    this.gui = gui;

    this.canvas = document.getElementById("gameCanvas");
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.ctx = this.canvas.getContext("2d");

    this.keys = new Keys();
    this.images = new ImageStore(name);
    this.mouse = new MouseListener(this.canvas, 0);

    this.ticksPerSec = 20;
    this.msPerTick = 1000 / this.ticksPerSec;

    this.update = this.update.bind(this);
    this.running = false;

    this.window = new Rectangle(this.width, this.height);
  }

  start() {
    this.keys.register();
    this.mouse.register();
    this.gui.register(this.keys, this.mouse);

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

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 1; //is the -1 necessary? I think it is, to make borders render properly
      this.width = canvas.width;
      this.height = canvas.height;

      this.window = new Rectangle(0, 0, this.width, this.height);
      this.gui.resize(this.window);
    }

    //prepare for next screen
    var ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.gui.updateAndRender(part, ctx, this.window);

    this.prevTickMs = ms;

    requestAnimationFrame(this.update);
  }

  stop() {
    this.gui.unregister(this.keys, this.mouse);
    this.keys.unregister();
    this.mouse.unregister();

    this.running = false;
  }
}

//goes in the starter file for each game:
//var gui = new Gui();
//gui.push(...);
//var gameManager = new GameManager(gui, "game-name");
//gameManager.start();