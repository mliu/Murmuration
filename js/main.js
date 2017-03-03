(function() {
  'use strict';

  // Setup project configuration variables
  if (!window.config) {
    window.config = {};

    config.CANVAS_WIDTH;
    config.CANVAS_HEIGHT;
    config.MAX_VELOCITY = 2;
    config.MIN_VELOCITY = 1;
    config.NUM_BOIDS = 15;
    config.LOCAL_BOUNDS = 50;

    config.uid = 0; 
  }

  var canvas;
  var boids = [];

  function init() {
    canvas = $("#canvas");
    config.CANVAS_WIDTH = canvas.width();
    config.CANVAS_HEIGHT = canvas.height();

    window.onresize();

    // Add boids
    for (var i = 0; i < config.NUM_BOIDS; i++) {
      addBoid();
    }

    window.requestAnimationFrame(step);
  }

  $(document).ready(function() {
    init();
  });

  function addBoid() {
    boids.push(
      new Boid(
        Math.round(Math.random() * config.CANVAS_WIDTH),
        Math.round(Math.random() * config.CANVAS_HEIGHT),
        getRandomInt(config.MIN_VELOCITY, config.MAX_VELOCITY),
        Math.round(Math.random() * 360)));
  }

  function getHtmlCanvas() {
    return canvas.get()[0];
  }

  function step() {
    var canvas_context = getHtmlCanvas().getContext("2d");
    canvas_context.beginPath();
    canvas_context.clearRect(0, 0, config.CANVAS_WIDTH, config.CANVAS_HEIGHT);

    for (var i = 0; i < boids.length; i++) {
      boids[i].step(boids);
    }

    canvas_context.fillStyle = "#fff";
    for (var i = 0; i < boids.length; i++) {
      boids[i].draw(canvas_context);
    }
    canvas_context.stroke();

    window.requestAnimationFrame(step);
  }

  window.onresize = function() {
    // Do nothing
  };

  Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  };

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
})();