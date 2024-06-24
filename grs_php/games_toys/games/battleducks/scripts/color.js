class Color {
  //all in [0, 1]
  constructor(r, g, b, a) {
    this.r = (r || 0).clamp(0, 1);
    this.g = (g || 0).clamp(0, 1);
    this.b = (b || 0).clamp(0, 1);
    this.a = (a || 0).clamp(0, 1);
  }

  add(c) {
    this.r = (this.r + c.r).clamp(0, 1);
    this.g = (this.g + c.g).clamp(0, 1);
    this.b = (this.b + c.b).clamp(0, 1);
    this.a = (this.a + c.a).clamp(0, 1);
  }

  subtract(c) {
    this.r = (this.r - c.r).clamp(0, 1);
    this.g = (this.g - c.g).clamp(0, 1);
    this.b = (this.b - c.b).clamp(0, 1);
    this.a = (this.a - c.a).clamp(0, 1);
  }

  multiply(c) {
    this.r = (this.r * c.r).clamp(0, 1);
    this.g = (this.g * c.g).clamp(0, 1);
    this.b = (this.b * c.b).clamp(0, 1);
    this.a = (this.a * c.a).clamp(0, 1);
  }

  //gives css-style rgba color string
  toString() {
    return "rgba(" + Math.floor(this.r.clamp(0, 1) * 255) + "," + Math.floor(this.g.clamp(0, 1) * 255) + "," + Math.floor(this.b.clamp(0, 1) * 255) + "," + a + ")";
  }

  copy() {
    return new Color(this.r, this.g, this.b, this.a);
  }
}

//some common colors
