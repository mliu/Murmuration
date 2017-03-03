(function() {
  'use strict';

  function Boid(initX, initY, maxVelocity, initDirection) {
    this.x = initX;
    this.y = initY;
    this.maxVelocity = maxVelocity;
    this.direction = initDirection;
    this.uid = window.config.uid++;
  }
  window.Boid = Boid;

  // Boids will steer in the same direction as their flockmates
  Boid.prototype.addAlignment = function(boid) {
    this.alignmentDirection 
  }

  // Boids will move along with their flockmates
  Boid.prototype.addCohesion = function(boid) {
    
  }

  // Boids will move away from close flockmates
  Boid.prototype.addSeparation = function(boid) {

  }

  // Check if this boid is in the boundaries
  Boid.prototype.inBoundaries = function(boid) {
    return Math.sqrt(Math.pow(this.x - boid.x, 2) + Math.pow(this.y - boid.y, 2)) < config.LOCAL_BOUNDS;
  }

  Boid.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.radians(this.direction));

    ctx.moveTo(10, 0);
    ctx.lineTo(-5, -5);
    ctx.lineTo(-5, 5);
    ctx.lineTo(10, 0);
    ctx.fill();

    ctx.restore();
  }

  Boid.prototype.step = function(boids) {
    for (var i = 0; i < boids.length; i++) {
      if (this.uid === boids[i].uid || !this.inBoundaries(boids[i])) {
        continue;
      }

      this.addSeparation(boid[i]);
      this.addAlignment(boid[i]);
      this.addCohesion(boid[i]);
    }

    // this.direction = this.newDirection;

    this.x += Math.cos(Math.radians(this.direction)) * this.velocity;
    this.y += Math.sin(Math.radians(this.direction)) * this.velocity;
  }
})();