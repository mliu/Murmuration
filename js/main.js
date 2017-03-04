(function() {
  'use strict';

  // Setup project configuration variables
  if (!window.config) {
    window.config = {};

    config.CANVAS_WIDTH;
    config.CANVAS_HEIGHT;
    config.MAX_VELOCITY = 2;
    config.MIN_VELOCITY = 1;
    config.NUM_BOIDS = 200;
    config.LOCAL_BOUNDS = 100;
    config.SEPARATION_BOUNDS = 30;
    config.WALL_BUFFER = 50;

    config.uid = 0; 
  }

  var canvas;
  var ctx;
  var boids = [];

  function init() {
    canvas = $("#canvas");
    ctx = getHtmlCanvas().getContext("2d");
    window.ctx = ctx;
    config.CANVAS_WIDTH = canvas.width();
    config.CANVAS_HEIGHT = canvas.height();
    ctx.translate(0, config.CANVAS_HEIGHT);
    ctx.scale(1, -1);

    window.onresize();

    // Add boids
    for (var i = 0; i < config.NUM_BOIDS; i++) {
      addBoid(
        Math.round(Math.random() * config.CANVAS_WIDTH),
        Math.round(Math.random() * config.CANVAS_HEIGHT),
        getRandomInt(config.MIN_VELOCITY, config.MAX_VELOCITY),
        Math.round(Math.random() * 360));
    }
    // addBoid(500, 200, 2, 45, false);
    // addBoid(600, 200, 2, 70, false);
    // addBoid(575, 200, 2, 35, false);
    // addBoid(490, 200, 2, 1, true);

    window.requestAnimationFrame(step);
  }

  $(document).ready(function() {
    init();
  });

  function addBoid(x, y, maxVelocity, direction, debug) {
    boids.push(new Boid(x, y, maxVelocity, direction, debug));
  }

  function getHtmlCanvas() {
    return canvas.get()[0];
  }

  function step() {
    ctx.beginPath();
    ctx.clearRect(0, 0, config.CANVAS_WIDTH, config.CANVAS_HEIGHT);
    ctx.stroke();

    for (var i = 0; i < boids.length; i++) {
      boids[i].step(boids);
    }

    for (var i = 0; i < boids.length; i++) {
      boids[i].draw(ctx);
    }

    window.requestAnimationFrame(step);
  }

  window.onresize = function() {
    // Do nothing
  };

  Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  };

  Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
  };

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
})();