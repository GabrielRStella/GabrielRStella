//basically the same as the Game interface
//but it serves a different purpose

class Gui {
  constructor() {
    
  }

  //when it first gets added on
  enter(guiManager) {}
  //final: is this gui coming off the stack, or is it just being covered
  exit(guiManager, final) {}

  register(keys, mouse) {}

  unregister(keys, mouse) {}

  update(tickPart) {}
  render(ctx, width, height) {}

  renderTitle(ctx, text) {
    ctx.font = '64px sans-serif';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'start';
    ctx.lineWidth = 2;

    ctx.fillText(text, 10, 10);
    ctx.strokeText(text, 10, 10);
  }
}

class GuiManager {
  constructor(game) {
    this.game = game;
    this.screens = [];
    this.screen = null;

    this.input = false;
  }

  push(gui) {
    if(this.screen) {
      this.screen.exit(this, false);
      if(this.input) {
        this.screen.unregister(this.keys, this.mouse);
      }
    }
    this.screens.push(gui);
    this.screen = gui;
    this.screen.enter(this);
    if(this.input) {
      this.screen.register(this.keys, this.mouse);
    }
  }

  pop() {
    if(this.screen) {
      this.screens.pop();
      if(this.input) {
        this.screen.unregister(this.keys, this.mouse);
      }
      this.screen.exit(this, true);
    }
    this.screen = this.screens.length > 0 ? this.screens[this.screens.length - 1] : null;
    if(this.screen) {
      this.screen.enter(this);
      if(this.input) {
        this.screen.register(this.keys, this.mouse);
      }
    }
  }

  popTo(gui) {
    while(this.screen != gui) {
      this.pop();
    }
  }

  popOff(gui) {
    this.popTo(gui);
    this.pop();
  }

  register(keys, mouse) {
    if(this.screen) {
      if(this.input) {
        this.screen.unregister(this.keys, this.mouse);
      } 
      this.screen.register(keys, mouse);
    }
    this.input = true;
    this.keys = keys;
    this.mouse = mouse;
  }

  unregister(keys, mouse) {
    if(this.input && this.screen) {
      this.screen.unregister(this.keys, this.mouse);
    }
    this.input = false;
  }

  update(tickPart) {
    if(this.screen) this.screen.update(tickPart);
  }

  render(ctx, width, height) {
    if(this.screen) this.screen.render(ctx, width, height);
  }
}