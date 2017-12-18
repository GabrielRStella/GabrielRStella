class MovementEngine {
  constructor(drag) {
    this.velocity = new Point();
    this.drag = drag || 0.995;
    this.tick = 0;
  }

  updateGoal(tickPart, pos, goal) {
    var delta = goal.copy();
    delta.sub(pos);
    delta.magnitude = tickPart;
    return this.updateAccel(tickPart, delta);
  }

  updateAccel(tickPart, acceleration) {
    this.tick += tickPart;
    if(this.tick >= 1) {
      this.tick -= 1;
      this.velocity.multiply(this.drag);
    }
    //this.velocity.multiply(1 / Math.exp(1/(tickPart+1)));
    acceleration.magnitude = tickPart;
    this.velocity.add(acceleration);
    return this.velocity.copy();
  }
}

class AI {
  constructor(entity) {
    this.entity = entity;
  }

  //magnitude of returned velocity may be anything
  move(tickPart) {
    return new Point(0, 0);
  }
}

class AIGoal extends AI {
  constructor(entity) {
    super(entity);
    this.room = entity.room;
    this.bounds = entity.bounds;
    this.mover = new MovementEngine();
    this.tick = 0;
  }

  newGoal() {
    return null;
  }

  move(tickPart) {
    this.tick += tickPart;

    var pos = this.bounds.center;
    if(!this.goal || pos.distance(this.goal) < (this.tick / 100)) {
      this.goal = this.newGoal();
      this.tick = 0;
    }

    return this.mover.updateGoal(tickPart, this.bounds.center, this.goal);
  }
}

class AIRandom extends AIGoal {
  constructor(entity) {
    super(entity);
  }

  newGoal() {
    return this.room.getRandomPoint(this.bounds.width + this.bounds.height);
  }
}

class AIAggressive extends AIGoal {
  constructor(entity) {
    super(entity);
    this.path = [];
  }

  newPath() {
    var player = this.room.world.player.bounds.center;
    this.path = this.room.findPath(this.bounds.center, player, Math.max(this.bounds.width, this.bounds.height));
console.log(this.path);
  }

  newGoal() {
    var path = this.path;
    if(!path.length) {
      this.newPath();
      path = this.path;
    }
    var g = path[0];
    path.splice(0, 1);
    return g;
  }
}

class AIDodger extends AI {
  constructor(entity) {
    super(entity);
    this.room = entity.room;
    this.bounds = entity.bounds;
    this.mover = new MovementEngine(0.9);
    this.tick = 0;
  }

  move(tickPart) {
    var spells = this.room.spellParts;
    var pos = this.bounds.center;

    var mov = new Point();
    var count = 0;
    for(var i = 0; i < spells.length; i++) {
      var spell = spells[i];
      if(spell.srcEntity.isPlayer) {
        var sPos = spell.bounds.center;
        var sVel = spell.velocity.copy();
        var sPosNext = sPos.copy();
        sPosNext.add(sVel);
        if(sPosNext.distance(pos) < sPos.distance(pos)) {
          var del = pos;
          del.sub(sPos);
          del.rotate(Math.PI * (Math.random() - Math.random()));
          mov.add(del);
          count++;
        }
      }
    }

    if(count) {
      mov.multiply(1/count);
    }

    return this.mover.updateAccel(tickPart, mov);
  }
}

class AICombined extends AI {
  constructor(entity) {
    super(entity);
    //change internal AI based on difficulty
  }

  move(tickPart) {
  }
}