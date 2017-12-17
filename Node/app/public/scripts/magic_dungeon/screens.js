class Screen {
  constructor(game, title) {
    this.game = game;
    this.title = title;
  }

  draw(canvas, width, height) {
    //overlay
    canvas.fillStyle = "#000000a0";
    canvas.strokeStyle = "#ffffff";
    canvas.lineWidth = 4;
    canvas.beginPath();
    canvas.rect(0, 0, width, height);
    canvas.fill();
    canvas.stroke();
    canvas.closePath();

    //title text
    canvas.font = '36px sans-serif';
    canvas.fillStyle = "#ffffff";
    canvas.strokeStyle = "#000000";
    canvas.lineWidth = 1;
    canvas.fillText(this.title, 20, 50);
  }
}

class ScreenPause extends Screen {
  constructor(game) {
    super(game, "Paused");
  }

  draw(canvas, width, height) {

    super.draw(canvas, width, height);

    canvas.font = '24px sans-serif';
    canvas.fillStyle = "#ffffff";
    canvas.strokeStyle = "#000000";

    var x = 40;
    var y = 80;
    var dy = 30;

    var keybindInfo = [
      "P to pause",
      "R to restart",
      "WASD to move",
      "Arrow keys to shoot",
      "1-4 to select element"
      ];

    for(var i = 0; i < keybindInfo.length; i++) {
      canvas.fillText(keybindInfo[i], x, y);
      y += dy;
    }

    y += dy;

    var pauseInfo = this.game.world.pauseInfo();

    for(var i = 0; i < pauseInfo.length; i++) {
      canvas.fillText(pauseInfo[i], x, y);
      y += dy;
    }
  }
}

class ScreenTrait extends Screen {
  constructor(game, trait, element) {
    super(game, "You unlocked a new Trait!");
    this.trait = trait;
    this.element = element;
  }

  draw(canvas, width, height) {

    super.draw(canvas, width, height);

    canvas.font = '24px sans-serif';
    canvas.fillStyle = "#ffffff";
    canvas.strokeStyle = "#000000";

    var x = 40;
    var y = 80;
    var dy = 30;

    var info = [
      "Element: " + this.element.name,
      "Trait: " + this.trait.name
      ];

    for(var i = 0; i < info.length; i++) {
      canvas.fillText(info[i], x, y);
      y += dy;
    }
  }
}

//TODO: map of rooms, can calculate path from room A to B
class ScreenMap extends Screen {
  constructor(game) {
    super(game, "Map");
  }

  draw(canvas, width, height) {
    super.draw(canvas, width, height);
  }
}