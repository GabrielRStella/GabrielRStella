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
    this.mover = new MovementEngine(0.9);
  }

  newGoal() {
    if(!this.path || !this.path.length || Math.random() < 0.2) {
      var player = this.room.world.player.bounds.center;
      this.path = this.room.findPath(this.bounds.center, player, Math.max(this.bounds.width, this.bounds.height));
    }
    if(!this.path.length) return this.bounds.center;
    var g = this.path[0];
    this.path.splice(0, 1);
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

class AIDodgeWall extends AI {
  constructor(entity) {
    super(entity);
    this.room = entity.room;
    this.bounds = entity.bounds;
    this.mover = new MovementEngine(0.95);
    this.tick = 0;
  }

  move(tickPart) {
    var states = this.room.states;
    var pos = this.bounds.center;
    var sz = Math.max(this.bounds.width, this.bounds.height) * 2;
    var minPos = pos.copy();
    minPos.sub(new Point(sz, sz));
    minPos.round();
    sz *= 2;

    var mov = new Point();
    for(var dx = 0; dx < sz; dx++) {
      for(var dy = 0; dy < sz; dy++) {
        var xx = minPos.x + dx;
        var yy = minPos.y + dy;
        if(!states[xx][yy].walkable) {
          var del = new Point(xx + 0.5, yy + 0.5);
          del.sub(pos);
          del.magnitude = -1 / del.magnitude; //farther away = less important
          mov.add(del);
        }
      }
    }

    return this.mover.updateAccel(tickPart, mov);
  }
}

class AICombined extends AI {
  constructor(entity) {
    super(entity);
    //change internal AI based on difficulty
    this.types = [];
    var dif = entity.difficulty;
    var coeff
    this.addType(AIRandom, 2 / dif);
    this.addType(AIAggressive, 4 + 2 * dif);
    this.addType(AIDodger, 3 + dif);
    this.addType(AIDodgeWall, 2 + dif);
  }

  addType(type, weight) {
    var inst = new type(this.entity);
    this.types.push({ai: inst, weight: weight});
  }

  move(tickPart) {
    var delta = new Point();
    for(var i = 0; i < this.types.length; i++) {
      var mov = this.types[i].ai.move(tickPart);
      mov.magnitude = this.types[i].weight;
      delta.add(mov);
    }
    return delta;
  }
}