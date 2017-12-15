class Player {
  constructor(world, bounds, health) {
    this.world = world;
    this.bounds = bounds;
    this.maxhealth = health;
    this.health = health;
  }

  draw(canvas) {
/*
    canvas.fillStyle = "#000000";
    canvas.beginPath();
    canvas.rect(this.bounds.minX, this.bounds.minY, this.bounds.width, this.bounds.height);
    canvas.fill();
    canvas.closePath();
*/
    canvas.save();
    canvas.translate(this.bounds.minX, this.bounds.maxY);
    canvas.scale(1, -1);
    canvas.drawImage(getImage("player"), 0, 0, this.bounds.width, this.bounds.height);
    canvas.restore();
  }
}