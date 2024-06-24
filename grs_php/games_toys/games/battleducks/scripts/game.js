class GameTextures {
	constructor() {
    //texture info
    this.imgs = new ImageStore('battleducks');
	//a big sheet that we will deal with later :)
	this.spriteSheets = {
		boats: new SpriteSheet(this.imgs.loadImageAsync('boats'), 16)
	};
	//TODO: boom
	var ducks = new SpriteSheet(this.imgs.loadImageAsync('ducks'), 16);
	var ducksBlasted = new SpriteSheet(this.ims.loadImageAsync('ducks-blasted'), 16);
	//TODO: ink
	var octopi = new SpriteSheet(this.ims.loadImageAsync('octopi'), 32);
	var outfits = new SpriteSheet(this.ims.loadImageAsync('outfits'), 16);
	var rockets = new SpriteSheet(this.ims.loadImageAsync('rockets'), 16);
	var water = new SpriteSheet(this.ims.loadImageAsync('water'), 16);
	this.sprites = {
		ducks: [0, 1, 2].map(i => ducks.sprite_of(ducks.index(i))),
		ducksBlasted: [0, 1, 2].map(i => ducksBlasted.sprite_of(ducksBlasted.index(i))),
		octopi: [0, 1, 2].map(i => octopi.sprite_of(octopi.index(i))),
		outfits: [0, 1, 2, 3, 4, 5, 6].map(i => outfits.sprite_of(outfits.index(i))),
		rockets: [0, 1].map(i => rockets.sprite_of(rockets.index(i))),
		TODO: new Sprite(this.ims.loadImageAsync('TODO'), [new Rectangle(0, 0, 16, 16)], 0),
		water: new Sprite(water.img, [water.index(0), water.index(1), water.index(2), water.index(3), water.index(4)], 0.25)
	};
	}

  update(tickPart) {
      this.water.update(tickPart / 20);
  }
}

//tmp storage for a duck's texture info
class Duck {
	constructor(color, outfit, blasted) {
		this.color = color;
		this.outfit = outfit;
		this.blasted = blasted;
	}
}


//TODO subclass for boats / octopi
class BoardObject {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.state = true; //true = at least partially ok, false = totally destroyed
	}
	
	render(ctx, scale, board) {
		//for now, just draw a scaled rectangle
		var x = this.x * scale;
		var y = this.y * scale;
		var w = this.w * scale;
		var h = this.h * scale;
		var r = new Rectangle(x, y, w, h);
		RenderHelper.drawRect(ctx, r, null, "#00ffff");
		r = new Rectangle(0, 0, scale, scale);
		for(var dx = 0; dx < this.w; dx++) {
			for(var dy = 0; dy < this.h; dy++) {
				if(board.getState(this.x + dx, this.y + dy) == BOARD_STATE_BLASTED) {
					r.minX = x + dx * scale;
					r.minY = y + dy * scale;
					RenderHelper.drawRect(ctx, r, null, "#ff0000");
				}
			}
		}
	}
}

var BOARD_SIZE = 8; //a board is 8x8
var BOARD_STATE_OK = 0;
var BOARD_STATE_BLASTED = 1;

//one board, either player or AI
class Board {
	constructor() {
		this.objects = []; //a list of whole objects
		this.tiles = [];
		for(var i = 0; i < BOARD_SIZE; i++) {
			var arr = [];
			for(var j = 0; j < BOARD_SIZE; j++) {
				arr.push(BOARD_STATE_OK); //initial empty state
			}
			this.tiles.push(arr);
		}
	}
	
	add(obj) {
		this.objects.push(obj);
	}
	
	getState(x, y) {
		return this.tiles[x][y];
	}
	
	setState(x, y, s) {
		this.tiles[x][y] = s;
	}
	
	//count remaining objects that haven't been destroyed
	count() {
		var c = 0;
		for(var i = 0; i < this.objects.length; i++) {
			if(this.objects[i].state) c++;
		}
		return c;
	}
	
	click(x, y, sz) {
		var scale = sz / BOARD_SIZE;
		x = Math.floor(x / scale);
		y = Math.floor(y / scale);
		if(this.getState(x, y) == BOARD_STATE_OK) this.setState(x, y, BOARD_STATE_BLASTED);
		else this.setState(x, y, BOARD_STATE_OK);
	}
	
	render(ctx, r) {
		ctx.save();
		ctx.translate(r.minX, r.minY);  
		//set up the snipping layer
		ctx.beginPath();
		ctx.rect(0, 0, r.width, r.height);
		var scale = r.width / BOARD_SIZE;
		ctx.clip();
		//render game
		for(var i = 0; i < this.objects.length; i++) {
			if(this.objects[i].state) this.objects[i].render(ctx, scale, this);
		}
		//reset translations
		ctx.restore();
	}
}

//two boards (and victory state?)
class GameState {
	constructor(b1, b2) {
		this.bPlayer = b1;
		this.bAI = b2;
	}
	
	render(ctx, rPlayer, rAI) {
		this.bPlayer.render(ctx, rPlayer);
		this.bAI.render(ctx, rAI);
	}
	
	clickPlayer(x, y, sz) {
		this.bPlayer.click(x, y, sz);
	}
	
	clickAI(x, y, sz) {
		this.bAI.click(x, y, sz);
	}
}

//encapsulates static data about the game
class Game {
  constructor() {
    this.game_port_size = 1;
    this.game_port_left = new Rectangle(0, 0, 1, 1); //player board
    this.game_port_right = new Rectangle(0, 0, 1, 1); //AI board
	
	var b1 = new Board();
	b1.add(new BoardObject(1, 1, 2, 1));
	b1.add(new BoardObject(6, 3, 1, 4));
	var b2 = new Board();
	b2.add(new BoardObject(2, 6, 3, 1));
	this.state = new GameState(b1, b2);
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
	var w = window.width / 2; //since we are fitting two squares, we divide the screen in half
	var h = window.height;
    var s = Math.min(w, h);
	//make game size a multiple of (texture size * board size)
	var sz = 8 * 16;
	s -= s % sz;
	this.game_port_size = this.game_port_left.width = this.game_port_left.height = this.game_port_right.width = this.game_port_right.height = s;
    RectanglePosition.centerY(window, this.game_port_left);
    RectanglePosition.centerY(window, this.game_port_right);
	var space = (window.width - s * 2) / 3; //even horizontal margins
    RectanglePosition.left(window, this.game_port_left, space);
    RectanglePosition.right(window, this.game_port_right, space);
  }
  
  /*
  //I really wanted this special resizing technique that puts even margins all around both boxes
  //but it only works when w/h in [1.5, 2]
  //and wastes lots of space
	window = new Rectangle(0, 0, this.w, this.h);
	var w = window.width;
	var h = window.height;
	console.log(w / h);
	var z = 2 * h - w; //box spacing
	var s = h - 2 * z; //box size
    this.game_port_size = s;
	this.game_port_left.width = this.game_port_left.height = this.game_port_right.width = this.game_port_right.height = s;
    RectanglePosition.center(window, this.game_port_left);
    RectanglePosition.center(window, this.game_port_right);
    RectanglePosition.left(window, this.game_port_left, z);
    RectanglePosition.right(window, this.game_port_right, z);
	*/
  
  mouseDownUp(start, end) {
	  var pt = end;
	  if(this.game_port_left.contains(pt)) {
		  this.state.clickPlayer(pt.x - this.game_port_left.minX, pt.y - this.game_port_left.minY, this.game_port_size);
	  } else if(this.game_port_right.contains(pt)) {
		  this.state.clickAI(pt.x - this.game_port_right.minX, pt.y - this.game_port_right.minY, this.game_port_size);
	  }
  }

  update(tickPart, window, cursor) {
  }
  
  render(ctx, window) {
    ctx.imageSmoothingEnabled = false; //keep them thicc pixels
    //bg
	
	//?
	
    //translations
    ctx.save();
	
	
	this.state.render(ctx, this.game_port_left, this.game_port_right);
	
	/*
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
	*/

    
    //reset translations
    ctx.restore();
    
	/*
    this.imgs.drawImage('tex', ctx, new Rectangle(0, 0, 256, 256), new Rectangle(0, 0, 512, 512));
    
    RenderHelper.drawText(ctx, "Step " + this.water.currentIndex, 'top', 'right', 32, new Point(this.game_port.point.x - 10, 270), "#000000", null);
	*/
	
    ctx.lineWidth = 2;
    RenderHelper.drawRect(ctx, this.game_port_left, null, "#ff0000");
    RenderHelper.drawRect(ctx, this.game_port_right, null, "#0000ff");
    
    //HUD
    if(this.playing) {
    }
  }
  
}