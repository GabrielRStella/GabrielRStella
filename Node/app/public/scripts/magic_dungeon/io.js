class IO {
  constructor(keys) {
    this.keys = keys;
    this.key_a = getKeyCode('a');
    this.key_w = getKeyCode('w');
    this.key_s = getKeyCode('s');
    this.key_d = getKeyCode('d');
  }

  get playerMove() {
    var p = new Point(0, 0);
    if(this.keys.checkKeyCode(this.key_a)) {
      p.x--;
    }
    if(this.keys.checkKeyCode(this.key_w)) {
      p.y++;
    }
    if(this.keys.checkKeyCode(this.key_s)) {
      p.y--;
    }
    if(this.keys.checkKeyCode(this.key_d)) {
      p.x++;
    }
    p.magnitude = 1;
    return p;
  }

  get playerSpell() {
    var p = new Point(0, 0);
    if(this.keys.checkKeyCode(KEY_UP)) {
      p.y++;
    }
    if(this.keys.checkKeyCode(KEY_DOWN)) {
      p.y--;
    }
    if(this.keys.checkKeyCode(KEY_LEFT)) {
      p.x--;
    }
    if(this.keys.checkKeyCode(KEY_RIGHT)) {
      p.x++;
    }
    p.magnitude = 1;
    return p;
  }
}