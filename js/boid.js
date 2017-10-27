(function() {
  'use strict';

  function Boid(initX, initY, velocity, initDirection, fillStyle, debug) {
    this.x = initX;
    this.y = initY;
    this.velocity = velocity;
    this.direction = Math.radians(initDirection);
    this.velocityInputs = [];
    this.uid = window.config.uid++;
    this.strokeStyle = debug ? "#1b51d1" : "#000";
    this.fillStyle = debug ? "#1b51d1" : fillStyle;
    this.debug = debug;
  }
  window.Boid = Boid;

  // Boids will steer in the same direction as their flockmates
  Boid.prototype.addAlignment = function(flock) {
    var alignment = { x: Math.cos(this.direction), y: Math.sin(this.direction) };
    for (var i = 0; i < flock.length; i++) {
      alignment.x += Math.cos(flock[i].direction);
      alignment.y += Math.sin(flock[i].direction);
    }

    var dir = Math.atan2(alignment.y, alignment.x);

    this.velocityInputs.push({
      value: dir,
      weight: 1,
    });
  }

  // Boids will move along with their flockmates
  Boid.prototype.addCohesion = function(flock) {
    var cohesion = { x: this.x, y: this.y };
    for (var i = 0; i < flock.length; i++) {
      cohesion.x += flock[i].x;
      cohesion.y += flock[i].y;
    }

    cohesion.x = cohesion.x / (flock.length + 1);
    cohesion.y = cohesion.y / (flock.length + 1);

    // Calculate angle
    var dir = Math.atan2(cohesion.y - this.y, cohesion.x - this.x);

    if (this.debug) {
      ctx.fillRect(cohesion.x, cohesion.y, 3,3);
    }

    this.velocityInputs.push({
      value: dir,
      weight: 1,
    });
  }

  // Boids will move away from close flockmates
  Boid.prototype.addSeparation = function(flock) {
    var separationVec = { x: this.x, y: this.y };
    var boidsInCriticalSeparationThreshold = false;
    var dir, weight;
    for (var i = 0; i < flock.length; i++) {
      // Calculate angle facing away
      dir = Math.atan2(this.y - flock[i].y, this.x - flock[i].x);

      // Heavier weighting to boids closer
      weight = config.LOCAL_BOUNDS / Math.sqrt(Math.pow(this.x - flock[i].x, 2) +
        Math.pow(this.y - flock[i].y, 2));

      if (this.inBoundaries(flock[i], config.SEPARATION_BOUNDS)) {
        boidsInCriticalSeparationThreshold = true;
      }

      separationVec.x += Math.cos(dir) * weight;
      separationVec.y += Math.sin(dir) * weight;
    }

    dir = Math.atan2(separationVec.y - this.y, separationVec.x - this.x);

    if (this.debug) {
      ctx.fillRect(separationVec.x, separationVec.y, 5, 5);
    }

    this.velocityInputs.push({
      value: dir,
      weight: boidsInCriticalSeparationThreshold ? 3 : 1,
    });
  }

  // Check if this boid is in the boundaries
  Boid.prototype.inBoundaries = function(boid, bounds) {
    return Math.sqrt(Math.pow(this.x - boid.x, 2) +
      Math.pow(this.y - boid.y, 2)) < bounds
  }

  Boid.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.direction);

    ctx.fillStyle = this.fillStyle;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = config.LINE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-5, -5);
    ctx.lineTo(-5, 5);
    ctx.closePath();
    if (config.LINE_WIDTH) {
      ctx.stroke();
    }
    ctx.fill();

    if (this.debug) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#FF0000"
      ctx.moveTo(0, 0);
      ctx.beginPath();
      ctx.arc(0, 0, config.LOCAL_BOUNDS, 2 * Math.PI, false);
      ctx.stroke();
    }

    ctx.restore();
  }

  Boid.prototype.log = function(input) {
    if (this.debug) {
      console.log(input);
    }
  }

  Boid.prototype.resolveStep = function() {
    // Compute sum vector of new directions
    this.velocityInputs.push({
      value: this.direction,
      weight: 5,
    });
    if (this.velocityInputs.length) {
      var finalizedDestinationVec = { x: 0, y: 0 };
      this.velocityInputs.forEach(function(el) {
        finalizedDestinationVec.x += Math.cos(el.value) * el.weight * 10;
        finalizedDestinationVec.y += Math.sin(el.value) * el.weight * 10;
      }, this);
      this.direction =
        Math.atan2(finalizedDestinationVec.y, finalizedDestinationVec.x);

      if (this.debug) {
        console.log(finalizedDestinationVec);
        ctx.moveTo(this.x, this.y);
        ctx.beginPath();
        ctx.lineTo(this.x + finalizedDestinationVec.x, this.y + finalizedDestinationVec.y);
        ctx.stroke();
      }

      this.velocityInputs = [];
    }

    this.x += Math.cos(this.direction) * this.velocity;
    this.y += Math.sin(this.direction) * this.velocity;

    // Catch out of bounds
    if (this.x < -config.WALL_BUFFER) this.x = config.CANVAS_WIDTH+config.WALL_BUFFER;
    if (this.y < -config.WALL_BUFFER) this.y = config.CANVAS_HEIGHT+config.WALL_BUFFER;
    if (this.x > config.CANVAS_WIDTH+config.WALL_BUFFER) this.x = -config.WALL_BUFFER;
    if (this.y > config.CANVAS_HEIGHT+config.WALL_BUFFER) this.y = -config.WALL_BUFFER;
  }

  Boid.prototype.step = function(boids) {
    var _this = this;
    var flock = boids.filter(function(b) {
      return _this.uid !== b.uid && _this.inBoundaries(b, config.LOCAL_BOUNDS);
    });

    if (flock.length) {
      this.addAlignment(flock);
      this.addCohesion(flock);
      this.addSeparation(flock);
    }
  }
})();
