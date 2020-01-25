class FX {
  constructor(life) {
    this.life = life;
  }

  get active() {
    return this.life > 0;
  }

  update(tickPart) {
    this.life -= tickPart;
  }

  render(canvas) {
    //base class - nothing
  }
}

//TODO:
//magical and explosion FX