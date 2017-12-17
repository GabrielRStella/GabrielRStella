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
      "M to view the map",
      "WASD to move",
      "Arrow keys to shoot",
      "1-4 to select element"
      ];

    for(var i = 0; i < keybindInfo.length; i++) {
      canvas.fillText(keybindInfo[i], x, y);
      y += dy;
    }

    y += dy;

    var scoreInfo = this.game.scoreInfo;

    for(var i = 0; i < scoreInfo.length; i++) {
      canvas.fillText(scoreInfo[i], x, y);
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

    canvas.font = '24px sans-serif';
    canvas.fillStyle = "#ffffff";
    canvas.strokeStyle = "#000000";

    var x = 40;
    var y = 80;
    var dy = 30;

    var world = this.game.world;
    var room = world.currentRoom;
    var rooms = world.rooms;
    var n1 = "?";
    var n2 = "None";
    var nameFunc = function(dir) {
      if(room.hasConnection(dir)) {
        return room.getConnection(dir).id;
      }
      return room.isOpen(dir) ? n1 : n2;
    }
    var r_left = nameFunc(DIR_LEFT);
    var r_right = nameFunc(DIR_RIGHT);
    var r_up = nameFunc(DIR_UP);
    var r_down = nameFunc(DIR_DOWN);

    var info = [
      "Current Room: " + room.id + "/" + rooms.length,
      "Left: " + r_left,
      "Right: " + r_right,
      "Up: " + r_up,
      "Down: " + r_down
      ];

    for(var i = 0; i < info.length; i++) {
      canvas.fillText(info[i], x, y);
      y += dy;
    }

    var mapBounds = new Rectangle(new Point(), 1, 1);
    Gui.align(new Rectangle(new Point(), width, height), mapBounds, [Gui.fit, Gui.center], 0);

    canvas.beginPath();
    canvas.fillStyle = "#000000a0";
    canvas.strokeStyle = "#ffffff";
    canvas.lineWidth = 4;
    var center = mapBounds.center;
    var radius = mapBounds.width / 2;
    canvas.arc(center.x, center.y, radius, 0, Math.PI*2);
    canvas.fill();
    canvas.stroke();
    canvas.closePath();

    var r2 = Math.max(radius * 0.1 - Math.sqrt(rooms.length), 25);
    radius *= 0.85;

    var angleIncr = (Math.PI * 2) / rooms.length;
    var getPoint = function(room) {
      var angle = -(Math.PI / 2) + (angleIncr * room.difficulty);
      var point = new Point(radius, 0);
      point.rotate(angle);
      point.add(center);
      return point;
    }

    for(var i = 0; i < rooms.length; i++) {
      var point = getPoint(rooms[i]);

      canvas.fillStyle = "#000000a0";
      canvas.strokeStyle = "#ffffff";
      canvas.lineWidth = 4;
      canvas.beginPath();
      canvas.arc(point.x, point.y, r2, 0, Math.PI*2);
      canvas.fill();
      canvas.stroke();
      canvas.closePath();

      canvas.fillStyle = "#ffffff";
      canvas.save();
      canvas.textAlign = "center";
      canvas.textBaseline = "middle";
      canvas.fillText(rooms[i].id, point.x, point.y);
      canvas.restore();
    }

    for(var i = 0; i < rooms.length; i++) {
      var room2 = rooms[i];
      for(var j = 0; j < DIRS.length; j++) {
        if(room2.hasConnection(DIRS[j])) {
          var room3 = room2.getConnection(DIRS[j]);
          var src = getPoint(room2);
          var dst = getPoint(room3);

          //adjust points to be outside of the circles
          var delta = dst.copy();
          delta.sub(src);
          delta.magnitude = r2;

          var delta2 = src.copy();
          delta2.sub(dst);
          delta2.magnitude = r2;

          src.add(delta);
          dst.add(delta2);

          canvas.save();

          canvas.strokeStyle = "#ffffff";
          canvas.lineWidth = 4;
          canvas.beginPath();
          canvas.moveTo(src.x, src.y);
          canvas.lineTo(dst.x, dst.y);
          canvas.stroke();
          canvas.closePath();

          canvas.restore();
        }
      }
    }
  }
}