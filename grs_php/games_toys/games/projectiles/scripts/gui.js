/////////////////////////////////////////////////////////////////////////////////////////////////
//rectangle positioning (for gui layout)
/////////////////////////////////////////////////////////////////////////////////////////////////

//ordering, arranging, and scaling boxes relative to eachother
var RectanglePosition = {
  align: function(outer, inner, funcs, padding) {
    padding = padding || 0;
    for(var i = 0; i < funcs.length; i++) {
      funcs[i](outer, inner, padding);
    }
  },
  aspect_fit: function(outer, inner) {
    var minScale = Math.min(outer.width / inner.width, outer.height / inner.height);
    inner.width *= minScale;
    inner.height *= minScale;
  },
  aspect_fill: function(outer, inner) {
    var maxScale = Math.max(outer.width / inner.width, outer.height / inner.height);
    inner.width *= maxScale;
    inner.height *= maxScale;
  },
  center: function(outer, inner) {
    inner.minX = outer.minX + (outer.width - inner.width) / 2;
    inner.minY = outer.minY + (outer.height - inner.height) / 2;
  },
  centerX: function(outer, inner) {
    inner.minX = outer.minX + (outer.width - inner.width) / 2;
  },
  centerY: function(outer, inner) {
    inner.minY = outer.minY + (outer.height - inner.height) / 2;
  },
  //scaled
  insideY: function(outer, inner, padding) {
    inner.minY = outer.height * padding - inner.height / 2;
  },
  //inside window
  left: function(outer, inner, padding) {
    inner.minX = outer.minX + padding;
  },
  right: function(outer, inner, padding) {
    inner.maxX = outer.maxX - padding;
  },
  top: function(outer, inner, padding) {
    inner.maxY = outer.maxY - padding;
  },
  bottom: function(outer, inner, padding) {
    inner.minY = outer.minY + padding;
  },
  //outside
  above: function(outer, inner, padding) {
    inner.maxY = outer.minY - padding;
  },
  below: function(outer, inner, padding) {
    inner.minY = outer.maxY + padding;
  },
  //moving
  up: function(outer, inner, padding) {
    inner.minY -= padding
  },
  down: function(outer, inner, padding) {
    inner.minY += padding
  }
};

//helper classes

class Alignment {
  constructor(ref, box, funcs, padding) {
    this.ref = ref;
    this.box = box;
    this.funcs = funcs || [];
    this.padding = padding || 0;
  }

  align() {
    RectanglePosition.align(this.ref, this.box, this.funcs, this.padding);
  }
}

class Aligner {
  constructor() {
    this.aligns = [];
  }

  add(ref, box, funcs, padding) {
    this.aligns.push(new Alignment(ref, box, funcs, padding));
  }

  align() {
    for(var i = 0; i < this.aligns.length; i++) {
      this.aligns[i].align();
    }
  }
};