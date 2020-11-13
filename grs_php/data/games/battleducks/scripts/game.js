


//encapsulates static data about the game
class Game {
  constructor() {
    this.game_port = new Rectangle(0, 0, 1, 1);
    this.game_port_size = 1;
    
    this.imgs = new ImageStore('battleducks');
    this.img = this.imgs.loadImageAsync('tex');
    var sprites = new SpriteSheet(this.img, 16);
    this.ducks = [sprites.sprite_of(sprites.index(0)), sprites.sprite_of(sprites.index(1)), sprites.sprite_of(sprites.index(2))];
    this.ducks_blasted = [sprites.sprite_of(sprites.index(16)), sprites.sprite_of(sprites.index(17)), sprites.sprite_of(sprites.index(18))];
    this.outfits = [sprites.sprite_of(sprites.index(32)), sprites.sprite_of(sprites.index(33)), sprites.sprite_of(sprites.index(34)), sprites.sprite_of(sprites.index(35)), sprites.sprite_of(sprites.index(36)), sprites.sprite_of(sprites.index(37)), sprites.sprite_of(sprites.index(38))];
    this.octopi = [];
    this.water = new Sprite(this.img, [sprites.index(4), sprites.index(5), sprites.index(6), sprites.index(7), sprites.index(8)], 0.2);
  }
  
  begin(gui, window) {
    this.gui = gui;
    this.resize(window);
  }
  
  //you lost :^(
  end() {
    this.playing = false;
    this.gui.pop();
    //this.gui.push(new ScreenGameOver(this));
  }
  
  resize(window) {
    var prev_size = this.game_port_size;
    RectanglePosition.aspect_fit(window, this.game_port);
    RectanglePosition.right(window, this.game_port, 0);
    this.game_port_size = this.game_port.width;
  }
  
  mouseDownUp(pt) {
  }

  update(tickPart, window, cursor) {
    if(this.game_port.contains(cursor)) {
      this.water.update(tickPart / 20);
    }
  }
  
  render(ctx, window) {
    ctx.imageSmoothingEnabled = false;
    //bg
    ctx.lineWidth = 2;
    RenderHelper.drawRect(ctx, this.game_port, null, "#000000");
    //translations
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(this.game_port.minX, this.game_port.minY);  
    //set up the snipping layer
    ctx.beginPath();
    ctx.rect(0, 0, this.game_port_size, this.game_port_size);
    ctx.clip();
    //render game
    
    //TODO
    this.ducks[0].render(ctx, new Rectangle(16, 16, 64, 64));
    this.ducks[0].render(ctx, new Rectangle(-32, 100, 64, 64));
    
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        this.water.render(ctx, new Rectangle(64 + 64 * i, 64 + 64 * j, 64, 64));
      }
    }
    
    var sz = 48;
    for(var i = 0; i < this.ducks.length; i++) {
      for(var j = 0; j < this.outfits.length; j++) {
        var r = new Rectangle(300 + sz * i, 64 + sz * j, sz, sz);
        this.water.render(ctx, r);
        this.ducks[i].render(ctx, r);
        this.outfits[j].render(ctx, r);
      }
    }

    
    //reset translations
    ctx.restore();
    
    this.imgs.drawImage('tex', ctx, new Rectangle(0, 0, 256, 256), new Rectangle(0, 0, 512, 512));
    
    RenderHelper.drawText(ctx, "Step " + this.water.currentIndex, 'top', 'right', 32, new Point(this.game_port.point.x - 10, 270), "#000000", null);
    
    //HUD
    if(this.playing) {
    }
  }
  
}