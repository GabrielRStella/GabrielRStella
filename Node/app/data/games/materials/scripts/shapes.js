class Force {
  //direction = vector indicating direction and strength
  constructor(position, direction) {
    this.position = position;
    this.direction = direction;
  }
}



class BodyForce {
  constructor(body, f, radius) {
    this.body = body;
    this.position = f.position;
    this.direction = f.direction;
    this.radius = radius || 0;
    this.area = Math.PI * this.radius * this.radius;
    this.magnitude = f.direction.magnitude;
    this.power = 0;

    //precalculate bc whatever
    this.dist = body.poly.distance(this.position);
  }

  get inBody() {
    return this.dist <= this.radius;
  }

  update(tickPart) {
    //default 1 (through air) is fine...
    var rate = 1;
    //force is inside body
    if(this.inBody) {
      rate = this.body.material.propogationRate;
    }

    //this expands radius linearly. should it expand area linearly instead? i think this makes sense.
    this.radius += tickPart * rate;
    this.area = Math.PI * this.radius * this.radius;

    //power is inversely proportional to area though
    this.power = this.magnitude / this.area;
  }

  //calculates a decrease in power when this force is used (to move or break something)
  //for example, if it causes a movement of "amt" energy, then this is called
  usePower(amt) {
    amt *= this.area;
    this.magnitude -= amt;
  }
}



class BodyPart {
  constructor(material, poly, position, orientation, grainAngle) {
    this.material = material;
    this.poly = poly;
    this.position = position || new Point();
    this.orientation = orientation || 0;
    this.grainAngle = grainAngle || (Math.random() * Math.TAU);

    this.forces = [];
    this.updateForce = this.updateForce.bind(this);

    //Fracture format = {path: Segment, force: BodyForce, power: Number}
    this.fractures = [];
    //Fracture Point format = {source: Fracture}
    this.fracturePoints = [];
    this.updateFracturePoint = this.updateFracturePoint.bind(this);
  }

  addForce(f) {
    this.forces.push(new BodyForce(this, f));
  }

  //propogate forces and fractures
  //also move body part
  //TODO return: somehow indicate if the body part has broken
  update(tickPart) {
    this.forces.forEach(this.updateForce);
    this.fracturePoints.forEach(this.updateFracturePoint);
  }

  //perhaps this should only cause movement and *initial* fractures? idk...
  updateForce(f) {
    f.update(tickPart);
    if(f.inBody) {
      //cause fractures and movement
      var p = f.position;
      var dir = f.direction;
      var power = f.power;
    }
  }

  //hm.....
  //calculate propogation
  //direction = random spread, possible forks, possibly in direction of grain
  //away or towards center? idk....
  updateFracturePoint(fp) {
    var source = fp.source; //the source fracture
    var path =  source.path; //the line it follows
    var force = source.force; //the force that spawned it
    var power = source.power; //the power of the fracture (how big it is)
  }
}

class Body {
  //parts = single body part or array of body parts
  constructor(material, parts) {
    this.material = material;

    if(!(parts instanceof Array)) {
      parts = [parts];
    }
    this.parts = parts;
  }

  update(tickPart) {
    this.parts.forEach(x => x.update(tickPart));
  }
}