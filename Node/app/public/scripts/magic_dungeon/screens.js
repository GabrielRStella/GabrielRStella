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

  onKeyUp() {}
  onKeyDown() {}
  onKeyLeft() {}
  onKeyRight() {}

  update(paused, mouse, keys) {}
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
      "1-4 to select element",
      "Q/E to swap elements",
      "Hold space for fun"
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

class ScreenDeath extends Screen {
  constructor(game, msg) {
    super(game, msg);
  }
}

//TODO: map of rooms, can calculate path from room A to B
class ScreenMap extends Screen {
  constructor(game) {
    super(game, "Map");
    this.roomDst = null;
  }

  swapRoom(d) {
    if(this.roomDst) {
      var world = this.game.world;
      this.roomDst = world.rooms[loop(this.roomDst.id + d, world.rooms.length)];
    } else {
      this.roomDst = this.game.world.currentRoom;
    }
  }

  onKeyLeft() {
    this.swapRoom(-1);
  }

  onKeyRight() {
    this.swapRoom(1);
  }

  draw(canvas, width, height) {
    super.draw(canvas, width, height);
    var mouse = THE_MOUSE;

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
        return room.getConnection(dir).name;
      }
      return room.isOpen(dir) ? n1 : n2;
    }
    var r_left = nameFunc(DIR_LEFT);
    var r_right = nameFunc(DIR_RIGHT);
    var r_up = nameFunc(DIR_UP);
    var r_down = nameFunc(DIR_DOWN);

    var info = [
      "Current Room: " + room.name + "/" + rooms.length,
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

    var r2 = Math.max(radius * 0.1 / Math.sqrt(rooms.length), 25);
    radius *= 0.85;

    var angleIncr = (Math.PI * 2) / rooms.length;
    var getPoint = function(room) {
      var angle = -(Math.PI / 2) + (angleIncr * room.difficulty);
      var point = new Point(radius, 0);
      point.rotate(angle);
      point.add(center);
      return point;
    }

    var roomSrc = room;
    var roomDst = this.roomDst;

    var littleCircle = function(point, isDist) {
        canvas.fillStyle = isDist ? "#800000c0" : "#000000a0";
        canvas.strokeStyle = "#ffffff";
        canvas.lineWidth = 4;
        canvas.beginPath();
        canvas.arc(point.x, point.y, r2, 0, Math.PI*2);
        canvas.fill();
        canvas.stroke();
        canvas.closePath();
    };

    var drawLine = function(room2, room3) {
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

      canvas.beginPath();
      canvas.moveTo(src.x, src.y);
      canvas.lineTo(dst.x, dst.y);
      canvas.stroke();
      canvas.closePath();

      canvas.restore();
    };

//////////////////////////////////////////////////////////////////////////////////////////////////
//draw white lines

    canvas.lineWidth = 4;
    canvas.strokeStyle = "#ffffff";
    for(var i = 0; i < rooms.length; i++) {
      var room2 = rooms[i];
      for(var j = 0; j < DIRS.length; j++) {
        if(room2.hasConnection(DIRS[j])) {
          var room3 = room2.getConnection(DIRS[j]);
          drawLine(room2, room3);
        }
      }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////
//draw red path

    //generate + draw path
    if(roomDst && (roomDst != roomSrc)) {
      var checked = [roomSrc];
      var frontier = [roomSrc];
      var sources = {};

      var path = [];

      while(frontier.length > 0) {
        var roomCurr = frontier[0];
        frontier.splice(0, 1);
        checked.push(roomCurr);

        for(var j = 0; j < DIRS.length; j++) {
          if(roomCurr.hasConnection(DIRS[j])) {
            var roomNext = roomCurr.getConnection(DIRS[j]);
            if(roomNext == roomDst) {
              sources[roomNext.id] = roomCurr;
              while(roomNext) {
                path.push(roomNext);
                roomNext = sources[roomNext.id];
              }
              frontier = []; //to make it end
              break;
            } else if(!checked.includes(roomNext)) {
              sources[roomNext.id] = roomCurr;
              checked.push(roomNext);
              frontier.push(roomNext);
            }
          }
        }

      }

      canvas.lineWidth = 3;
      canvas.strokeStyle = "#ff0000";
      for(var i = 0; i < path.length - 1; i++) {
        var room2 = path[i];
        var room3 = path[i + 1];
        drawLine(room2, room3);
      }
      var ln = path.length - 1;
      littleCircle(center, false);
      canvas.save();
      canvas.fillStyle = "#ffffff";
      canvas.textAlign = "center";
      canvas.textBaseline = "middle";
      canvas.fillText(ln, center.x, center.y);
      canvas.restore();
    }

//////////////////////////////////////////////////////////////////////////////////////////////////
//draw circles

    for(var i = 0; i < rooms.length; i++) {
      var room2 = rooms[i];
      var point = getPoint(room2);

      var isCurrent = (room2 == room);
      var isDist = (room2 == this.roomDst) || (mouse.distance(point) <= r2 + 2); //2 = half of line width
      if(isDist) roomDst = this.roomDst = room2; //for later
      if(isCurrent || isDist) {
        littleCircle(point, isDist);
      }

      canvas.fillStyle = "#ffffff";
      canvas.save();
      canvas.textAlign = "center";
      canvas.textBaseline = "middle";
      canvas.fillText(room2.name, point.x, point.y);
      canvas.restore();
    }

  }
}