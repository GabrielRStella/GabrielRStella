class Style {
  constructor() {}

  //draws a block with the given state on the given canvas in the given rectangle
  draw(canvas, r, state) {
    return false;
  }
}

class ArrayFunctionStyle extends Style {
  constructor() {
    super();
    this.styles = {};
  }

  //draws a block with the given state on the given canvas in the given rectangle
  draw(canvas, r, state) {
    if(styles[state]) {
      styles[state](canvas, r);
      return true;
    } else {
      //que? i guess just ignore
      return false;
    }
  }
}

class ArrayImageStyle extends Style {
  constructor() {
    super();
    this.styles = {};
  }

  //draws a block with the given state on the given canvas in the given rectangle
  draw(canvas, r, state) {
    var img = styles[state] || ("blocks/" + state.name);
    var dImg = getImage(img);
    if(dImg) {
      canvas.drawImage(dImg, r.minX, r.minY, r.width, r.height);
      return true;
    }
    return false; 
  }
}

var THE_STYLE = new ArrayImageStyle();