(function() {
  'use strict';

  // Setup project configuration variables
  if (!window.config) {
    window.config = {};

    config.LINE_WIDTH = 1.5;
    config.CANVAS_WIDTH;
    config.CANVAS_HEIGHT;
    config.MAX_VELOCITY = 2;
    config.MIN_VELOCITY = 1.5;
    config.NUM_BOIDS = 300;
    config.LOCAL_BOUNDS = 100;
    config.SEPARATION_BOUNDS = 15;
    config.WALL_BUFFER = 10;

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
        // config.MAX_VELOCITY,
        getRandomInt(config.MIN_VELOCITY, config.MAX_VELOCITY),
        Math.round(Math.random() * 360),
        rgbToHex(
          255,
          Math.floor(Math.random() * 70 + 150),
          Math.floor(Math.random() * 70 + 40),
        ),
        false);
    }
    // addBoid(100, 100, config.MAX_VELOCITY, 35, false);
    // addBoid(130, 140, config.MAX_VELOCITY, 35, false);
    // addBoid(110, 120, config.MAX_VELOCITY, 35, false);
    // addBoid(130, 110, config.MAX_VELOCITY, 35, false);

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

  function rgbComponentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  function rgbToHex(r, g, b) {
    return "#" + rgbComponentToHex(r) + rgbComponentToHex(g) +
      rgbComponentToHex(b);
  }
  window.rgbToHex = rgbToHex;

  function step() {
    ctx.beginPath();
    ctx.clearRect(0, 0, config.CANVAS_WIDTH, config.CANVAS_HEIGHT);
    ctx.stroke();

    for (var i = 0; i < boids.length; i++) {
      boids[i].step(boids);
    }

    for (var i = 0; i < boids.length; i++) {
      boids[i].resolveStep();
      boids[i].draw(ctx);
    }

    window.requestAnimationFrame(step);
  }
  window.Step = step;

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
