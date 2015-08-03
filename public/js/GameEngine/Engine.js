define(["require", "exports", "module"], function(require, exports, module) {

	var Vector = require('GameEngine/Vector');
	var Emitter = require('GameEngine/Emitter');
	var Field = require('GameEngine/Field');
	var Particle = require('GameEngine/Particle');
	var Player = require('GameEngine/Player');

	var GameObject = function(gameOptions) {
		this.particles = [];
		this.emitters = [];
		this.fields = [];
		this.gameOptions = gameOptions;
		this.player;
		this.canvas;
		this.lastX = 0;
		this.lastY = 0;
	}

	GameObject.prototype.startGame = function() {

		// For user safety!
		if (typeof(this.gameOptions) === 'undefined') {
			this.gameOptions = new GameOptions();
		}

		this.player = new Player();
		this.player.mass = this.gameOptions.playerMass;

		// Setup Canvas.
		this.canvas = document.querySelector('canvas');
		var headerOffset = 60;
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight - headerOffset;
		this.ctx = this.canvas.getContext('2d');

		// Start random universe generation.
		this.generateUniverse();
		self = this;
		setInterval(function () {
			self.generateUniverse();
		}, 5000);

		document.onmousemove = function(event) {
			var pageX, pageY;

			event = event || window.event;
			self.lastX = event.pageX;
			self.lastY = event.pageY - 60;
		};

		this.loop();
	}

	GameObject.prototype.addNewParticles = function() {

		if (this.particles.length > this.gameOptions.maxParticles) return;

		for (var i = 0; i < this.emitters.length; i++) {
			for (var j = 0; j < this.gameOptions.emissionRate; j++) {
				this.particles.push(this.emitters[i].emitParticle());
			}
		}
	};

	GameObject.prototype.plotParticles = function(boundsX, boundsY) {

		var currentParticles = [];

		for (var i = 0; i < this.particles.length; i++) {
			var particle = this.particles[i];
			var pos = particle.position;

			// If we're out of bounds, drop this particle and move on to the next.
			if (pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY) continue;

			// Update velocities and accelerations to account for the fields.
			particle.submitToFields(this.fields);

			if (this.player.mass != 0) {
				particle.submitToFields([this.player]);
			}

			particle.move();

			currentParticles.push(particle);
		}

		this.particles = currentParticles;
	};

	GameObject.prototype.drawParticles = function() {
		var ctx = this.canvas.getContext('2d');

		for (var i = 0; i < this.particles.length; i++) {
			var position = this.particles[i].position;
			ctx.beginPath();
			ctx.arc(position.x, position.y, this.gameOptions.particleSize/2, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fillStyle = this.particles[i].drawColor;
			ctx.fill();
		}
	}

	GameObject.prototype.drawPlayer = function() {
		if (this.player.life >= 0) {
			this.ctx.fillStyle = this.player.drawColor;
			this.ctx.beginPath();
			this.ctx.arc(this.player.position.x, this.player.position.y, this.gameOptions.playerSize, 0, Math.PI * 2);
			this.ctx.closePath();
			this.ctx.fill();
		};
	};

	GameObject.prototype.drawCircle = function(object) {
		var ctx = this.canvas.getContext('2d');
		ctx.fillStyle = object.drawColor;
		ctx.beginPath();
		ctx.arc(object.position.x, object.position.y, this.gameOptions.objectSize, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
	};

	GameObject.prototype.checkCollision = function() {
		for (var i = 0; i < this.particles.length; i++) {
			particle = this.particles[i];
			if ((particle.position.x <= this.player.position.x+this.gameOptions.playerSize/2) && (particle.position.x >= this.player.position.x-this.gameOptions.playerSize/2) && 
				(particle.position.y <= this.player.position.y+this.gameOptions.playerSize/2) && (particle.position.y >= this.player.position.y-this.gameOptions.playerSize/2)) 
			{
				this.particles.splice(i, 1);
				if (particle.type === 0) {
					this.gameOptions.playerSize = this.gameOptions.playerSize - 1;
				}
				else {
					this.gameOptions.playerSize = this.gameOptions.playerSize + 1;
				}
			}
		};
	};

	GameObject.prototype.generateUniverse = function() {
		this.emitters = [];
		this.fields = [];
		for (var i = 0; i < this.gameOptions.numberOfEmitters; i++) {
			this.emitters.push(new Emitter(new Vector(Math.random()*this.canvas.width, Math.random()*this.canvas.height), Vector.fromAngle(0, 2)))
		}
		for (var i = 0; i < this.gameOptions.numberOfFields; i++) {
			this.fields.push(new Field(new Vector(Math.random()*this.canvas.width, Math.random()*this.canvas.height), ((Math.random()*2)-1)*4000));
		};
	};

	GameObject.prototype.clear = function() {
		var ctx = this.canvas.getContext('2d');
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	};

	GameObject.prototype.update = function() {
		this.addNewParticles();
		this.plotParticles(this.canvas.width, this.canvas.height);
		this.checkCollision();
	};

	GameObject.prototype.draw = function() {
		this.drawParticles();

		this.fields.forEach(self.drawCircle.bind(this));

		this.emitters.forEach(self.drawCircle.bind(this));
		this.drawPlayer();
		this.player.move(this.lastX, this.lastY);
	};

	GameObject.prototype.queue = function() {
		window.requestAnimationFrame(this.loop.bind(this));
	};

	GameObject.prototype.loop = function() {
		this.clear();
		this.update();
		this.draw();
		this.queue();
	};

	return GameObject;
});