function GameOptions(numOfParticles, particleSize, emissionRate, objectSize, playerSize, playerMass, numberOfFields, numberOfEmitters) {
	this.maxParticles = numOfParticles || 20;
	this.particleSize = particleSize || 5;
	this.emissionRate = emissionRate || 1;
	this.objectSize = objectSize || 15;
	this.playerSize = playerSize || 15;
	this.playerMass = playerMass || 0;
	this.numberOfFields = numberOfFields || 1;
	this.numberOfEmitters = numberOfEmitters || 1;
}

var GameOptions = new GameOptions();

var Game = function(GameOptions) {

	this.GameOptions = GameOptions;

	this.startGame = function() {
		var Vector = require('GameEngine/Vector');
		var Particle = require('GameEngine/Particle');
		var Emitter = require('GameEngine/Emitter');
		var Field = require('GameEngine/Field');
		var Player = require('GameEngine/Player');

		var maxParticles = this.GameOptions.maxParticles;
		var particleSize = this.GameOptions.particleSize;
		var emissionRate = this.GameOptions.emissionRate;
		var objectSize = this.GameOptions.objectSize; 
		var playerSize = this.GameOptions.playerSize;

		var canvas = document.querySelector('canvas');
		var ctx = canvas.getContext('2d');

		var headerOffset = 60;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight - headerOffset;


		function addNewParticles() {

			if (particles.length > maxParticles) return;

			for (var i = 0; i < emitters.length; i++) {
				for (var j = 0; j < emissionRate; j++) {
					particles.push(emitters[i].emitParticle());
				}
			}
		}

		function plotParticles(boundsX, boundsY) {

		  var currentParticles = [];

		  for (var i = 0; i < particles.length; i++) {
		    var particle = particles[i];
		    var pos = particle.position;

		    // If we're out of bounds, drop this particle and move on to the next
		    if (pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY) continue;

		    // Update velocities and accelerations to account for the fields
		    particle.submitToFields(fields);

		    if (player.mass != 0) {
		    	particle.submitToFields([player]);
		    }

		    // Move our particles
		    particle.move();

		    // Add this particle to the list of current particles
		    currentParticles.push(particle);
		  }

		  // Update our global particles reference
		  particles = currentParticles;
		}

		function drawParticles() {
		  for (var i = 0; i < particles.length; i++) {
		    var position = particles[i].position;
		    ctx.beginPath();
		    ctx.arc(position.x, position.y, particleSize/2, 0, Math.PI * 2);
		    ctx.closePath();
		    ctx.fillStyle = particles[i].drawColor;
			ctx.fill();
		  }
		}

		function drawCircle(object) {
			ctx.fillStyle = object.drawColor;
			ctx.beginPath();
			ctx.arc(object.position.x, object.position.y, objectSize, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
		}

		function drawPlayer(player) {
			if (player.life >= 0) {
				ctx.fillStyle = player.drawColor;
				ctx.beginPath();
				ctx.arc(player.position.x, player.position.y, playerSize, 0, Math.PI * 2);
				ctx.closePath();
				ctx.fill();
			};
		}

		function checkCollision(player) {
			for (var i = 0; i < particles.length; i++) {
				particle = particles[i];
				if ((particle.position.x <= player.position.x+playerSize/2) && (particle.position.x >= player.position.x-playerSize/2) && 
					(particle.position.y <= player.position.y+playerSize/2) && (particle.position.y >= player.position.y-playerSize/2)) {
					particles.splice(i, 1);
					if (particle.type === 0) {
						playerSize = playerSize - 1;
					}
					else {
						playerSize = playerSize + 1;
					}
				}
			};
		}
		 
		var particles = []; 

		var midX = canvas.width / 2;
		var midY = canvas.height / 2; 

		var emitters = [];
		var fields = [];

		function generateUniverse() {
			emitters = [];
			fields = [];
			for (var i = 0; i < GameOptions.numberOfEmitters; i++) {
				emitters.push(new Emitter(new Vector(Math.random()*canvas.width, Math.random()*canvas.height), Vector.fromAngle(0, 2)))
			}
			for (var i = 0; i < GameOptions.numberOfFields; i++) {
				fields.push(new Field(new Vector(Math.random()*canvas.width, Math.random()*canvas.height), ((Math.random()*2)-1)*4000));
			};
		}

		generateUniverse()
		setInterval(function () {
			generateUniverse()
		}, 5000);

		var player = new Player();
		player.mass = GameOptions.playerMass;

		var pause = false;

		document.onmousemove = handleMouseMove;
		var lastX;
		var lastY;
		function handleMouseMove(event) {
			var dot, eventDoc, doc, body, pageX, pageY;

			event = event || window.event;

			lastX = event.pageX;
			lastY = event.pageY - headerOffset;
		}

		function loop() {
			if (!pause) {
				clear();
				update();
				draw();
				queue();
			}
		}

		function clear() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

		function update() {
			addNewParticles();
			plotParticles(canvas.width, canvas.height);
			checkCollision(player);
		}

		function draw() {
		  drawParticles();
		  fields.forEach(drawCircle);
		  emitters.forEach(drawCircle);
		  drawPlayer(player);
		  player.move(lastX, lastY);
		}

		function queue() {
			window.requestAnimationFrame(loop);
		}

		loop();
  	};
};

var start = function(Game) {

	this.options = "Hello";

	define(["require", "exports", "module", "GameEngine/Vector", 'GameEngine/Particle', 'GameEngine/Emitter', 'GameEngine/Field', 'GameEngine/Player'], function(require, exports, module) {

		var game = new Game(GameOptions);
		game.startGame();

		return game;

	});

};

start(Game)