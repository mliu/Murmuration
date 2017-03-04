(function() {
  'use strict';

  function Boid(initX, initY, maxVelocity, initDirection, debug) {
    this.x = initX;
    this.y = initY;
    this.velocity = maxVelocity;
    this.direction = initDirection;
    this.uid = window.config.uid++;
    this.maxVelocity = maxVelocity;
    this.fillStyle = "#fff";

    this.debug = debug;
  }
  window.Boid = Boid;

  Boid.prototype.steerTowards = function(dir, steer) {
    if (steer <= 0)
      return;
    if (dir < 0)
      dir += 360;

    if (this.direction < dir) {
      this.direction += steer;
    } else if (this.direction > dir) {
      this.direction -= steer;
    }

    this.direction %= 360;
  }

  // Boids will steer in the same direction as their flockmates
  Boid.prototype.addAlignment = function(flock) {
    var alignment = this.direction;
    for (var i = 0; i < flock.length; i++) {
      alignment += flock[i].direction;
    }

    alignment = Math.round(alignment / (flock.length + 1));

    this.steerTowards(alignment, 1);
  }

  // Boobs will move along with their flockmates
  Boid.prototype.addCohesion = function(flock) {
    var cohesion = { x: this.x, y: this.y };
    for (var i = 0; i < flock.length; i++) {
      cohesion.x += flock[i].x;
      cohesion.y += flock[i].y;
    }

    cohesion.x = Math.round(cohesion.x / (flock.length + 1));
    cohesion.y = Math.round(cohesion.y / (flock.length + 1));

    // Calculate angle
    var dir = Math.degrees(Math.atan2(cohesion.y - this.y, cohesion.x - this.x));

    this.steerTowards(dir, 3);
  }

  // Boids will move away from close flockmates
  Boid.prototype.addSeparation = function(flock) {
    for (var i = 0; i < flock.length; i++) {
      if (this.inBoundaries(flock[i], config.SEPARATION_BOUNDS)) {
        // Calculate angle
        var dir = (Math.degrees(Math.atan2(flock[i].y - this.y, flock[i].x - this.x)) + 180) % 360;

        this.steerTowards(dir, 5);
      }
    }
  }

  Boid.prototype.avoidWalls = function() {
    var angle = { x: 0, y: 0 };
    if (this.x > config.CANVAS_WIDTH - config.WALL_BUFFER) {
      angle.x = -1;
      // this.steerTowards(180, 3);
      // this.steerTowards(180, this.x - config.CANVAS_WIDTH);
    } else if (this.x < config.WALL_BUFFER) {
      angle.x = 1;
      // this.steerTowards(0, -this.x);
    }
    if (this.y > config.CANVAS_HEIGHT - config.WALL_BUFFER) {
      angle.y = -1;
      // this.steerTowards(270, this.y - config.CANVAS_HEIGHT);
    } else if (this.y < config.WALL_BUFFER) {
      angle.y = 1;
      // this.steerTowards(90, -this.y);
    }

    if (this.debug)
      console.log(Math.degrees(Math.atan2(angle.y, angle.x)));
    if (angle.x !== 0 || angle.y !== 0)
      this.steerTowards(Math.degrees(Math.atan2(angle.y, angle.x)), 5);
  }

  // Check if this boid is in the boundaries
  Boid.prototype.inBoundaries = function(boid, bounds) {
    return Math.sqrt(Math.pow(this.x - boid.x, 2) + Math.pow(this.y - boid.y, 2)) < bounds
      // (Math.degrees(Math.atan2(this.y - boid.y, this.x - boid.x)) > (-45 + this.direction) % 360 &&
      //   Math.degrees(Math.atan2(this.y - boid.y, this.x - boid.x)) < (315 + this.direction) % 360);
  }

  Boid.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.radians(this.direction));

    if (this.debug) {
      ctx.strokeStyle = "#FF0000"
    }

    ctx.beginPath();
    ctx.fillStyle = "#FFF";
    // ctx.fillRect(-2, -2, 4, 4);
    ctx.moveTo(10, 0);
    ctx.lineTo(-5, -5);
    ctx.lineTo(-5, 5);
    ctx.lineTo(10, 0);
    ctx.stroke();
    ctx.fill();
    
    // ctx.beginPath();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(Math.cos(Math.radians(-225)) * config.LOCAL_BOUNDS, Math.sin(Math.radians(-225)) * config.LOCAL_BOUNDS);
    // ctx.moveTo(0, 0);
    // ctx.lineTo(Math.cos(Math.radians(-135)) * config.LOCAL_BOUNDS, Math.sin(Math.radians(-135)) * config.LOCAL_BOUNDS);
    // ctx.stroke();

    // ctx.moveTo(0, 0);
    // ctx.strokeStyle = this.fillStyle;
    // ctx.beginPath();
    // ctx.arc(0, 0, config.LOCAL_BOUNDS, 2 * Math.PI, false);
    // ctx.arc(0, 0, config.SEPARATION_BOUNDS, 2 * Math.PI, false);
    // ctx.stroke();

    ctx.restore();
  }

  Boid.prototype.step = function(boids) {
    var _this = this;
    var flock = boids.filter(function(b) {
      return _this.uid !== b.uid && _this.inBoundaries(b, config.LOCAL_BOUNDS);
    });

    if (flock.length) {
      this.fillStyle = "#00ff04";
      this.addAlignment(flock);
      this.addCohesion(flock);
      this.addSeparation(flock);
    } else {
      this.fillStyle = "#ff0000";
    }
    this.avoidWalls();

    this.x += Math.cos(Math.radians(this.direction)) * this.velocity;
    this.y += Math.sin(Math.radians(this.direction)) * this.velocity;
  }
})();