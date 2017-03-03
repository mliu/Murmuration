(function() {
  'use strict';

  function Boid(initX, initY, velocity, initDirection) {
    this.x = initX;
    this.y = initY;
    this.velocity = velocity;
    this.direction = initDirection;

    console.log("Creating boid (" + initX + ", " + initY + ") velocity " + velocity + " facing " + initDirection);
  }
  window.Boid = Boid;

  Boid.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.radians(this.direction));

    ctx.moveTo(10, 0);
    ctx.lineTo(-5, -5);
    ctx.lineTo(-5, 5);
    ctx.lineTo(10, 0);

    ctx.restore();
  }

  Boid.prototype.step = function() {
    this.x += Math.cos(Math.radians(this.direction)) * this.velocity;
    this.y += Math.sin(Math.radians(this.direction)) * this.velocity;
  }
})();