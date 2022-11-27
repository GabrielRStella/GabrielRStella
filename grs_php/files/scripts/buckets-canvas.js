
class BucketSim {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    
    this.m = 9; //number of output buckets
    this.c = 3; //size of bucket groups
    this.M = 10000; //number of blocks in memory
    this.ordered = true; //whether to empty in order of index (true) or max bucket (false)
    this.speed = 10; //number of buffers to distribute per step
    this.free = this.M;
    this.buckets = new Array(this.m);
    for(var i = 0; i < this.m; i++) {
      this.buckets[i] = 0;
    }
    this.current = 0; //current bucket being written, if writing
    this.writes_remaining = 0; //number of buckets left to write, if writing
    this.next = 0; //next bucket when doing fixed order
    
    //TODO also track L
    
    this.playing = false;
    this.do_play = this.do_play.bind(this);
    
    //start rendering
    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);
    
    this.play();
  }
  
  restart() {
    this.free = this.M;
    this.buckets = new Array(this.m);
    for(var i = 0; i < this.m; i++) {
      this.buckets[i] = 0;
    }
    this.current = 0;
    this.writes_remaining = 0;
    this.next = 0;
  }
  
  get_largest() {
    var index = 0;
    var sz = this.buckets[0];
    for(var i = 1; i < this.m; i++) {
      var sz2 = this.buckets[i];
      if(sz2 > sz) {
        index = i;
        sz = sz2;
      }
    }
    return index;
  }
  
  get_next() {
    return this.ordered ? (this.next++ % this.m) : this.get_largest();
  }
  
  //move one block (or, if M is full, empty c buckets)
  //return true iff it was an emptying step
  step() {
    if(this.free == 0 || this.writes_remaining > 0) {
      if(this.free == 0) {
        //assign first
        this.current = this.get_next();
        this.writes_remaining = this.c;
      }
      //drain current
      for(var i = 0; i < this.speed && this.buckets[this.current] > 0; i++) {
        this.buckets[this.current]--;
        this.free++;
      }
      //possibly move forward or end writing
      if(this.buckets[this.current] == 0) {
        this.writes_remaining--;
        if(this.writes_remaining > 0) this.current = this.get_next();
      }
      
      //empty largest c buckets
      //TODO or empty in order for demonstration
      // for(var i = 0; i < this.c; i++) {
        // //find largest bucket
        // var index = ;
        // //empty it
        // this.free += this.buckets[index];
        // this.buckets[index] = 0;
      // }
    } else {
      //move <speed> buffers
      for(var i = 0; i < this.speed && this.free > 0; i++) {
        var index = Math.floor(Math.random()*this.m);
        this.buckets[index]++;
        this.free--;
      }
    }
  }
  
  //move blocks until M is full, then empty c buckets
  next() {
    while(!step());
  }
  
  //continuously move blocks and empty buckets
  play() {
    this.playing = true;
    this.do_play();
  }
  
  do_play() {
    if(this.playing) {
      //
      this.step(); //move one block per frame?
      //
      requestAnimationFrame(this.do_play);
    }
  }

  drawRect(ctx, x, y, w, h, fill, stroke) {
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  
  render() {
    //set canvas size from parent
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = this.canvas.width * 0.5;
    //
    var w = this.canvas.width;
    var h = this.canvas.height;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.setTransform(1, 0, 0, -1, 0, this.canvas.height);
    this.ctx.clearRect(0, 0, w, h);
    // this.drawRect(this.ctx, 10, 10, w - 20, h - 20, "#ff0000", "#00ff00");
    //TODO: draw some buckets (and a free stack)
    
    //calculate width of buckets
    var bucket_width = w / (this.m + 2); //leave space for free stack + gaps
    var bucket_gap = bucket_width / (this.m + 2); //size = gap size / # of gaps, which is m+2 (m gaps between m+1 stacks, plus 1 on either end)
    var block_height = h / this.M;
    //
    var x = bucket_gap;
    //draw the free stack
    this.drawRect(this.ctx, x, 0, bucket_width, block_height * this.free, "#a0a0a0", "#000000");
    x += bucket_width + bucket_gap;
    //draw the other stacks
    for(var i = 0; i < this.m; i++) {
      this.drawRect(this.ctx, x, 0, bucket_width, block_height * this.buckets[i], "#ffffff", "#000000");
      x += bucket_width + bucket_gap;
    }
    
    requestAnimationFrame(this.render);
  }
}

var SIM = new BucketSim(document.getElementById("bucket-canvas"));