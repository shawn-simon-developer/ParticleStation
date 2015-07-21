define(["require", "exports", "module"], function(require, exports, module) {

	var Vector = require('Vector');

	var Player = function Player(point, velocity, acceleration) {
		this.position = point || new Vector(30, 30);
		this.velocity = velocity || new Vector(0, 0);
		this.acceleration = acceleration || new Vector(0, 0);
		this.drawColor = "#555"; // So we can tell them apart from Fields later
		this.lastVerticle;
		this.lastHorizontal;
	}

	Player.prototype.move = function (horizontal, vertical) {
		//console.log(horizontal, vertical);
		var limit = 2;

		// if (horizontal === 0) {
		// 	this.acceleration.x = 0;
		// }
		// if (vertical === 0) {
		// 	this.acceleration.y = 0;
		// }

		if (Math.abs(this.acceleration.x) <= limit) {
			this.acceleration.x = ((horizontal - this.position.x) - this.velocity.x);
			if (this.acceleration.x < 0) {
				this.acceleration.x = -limit;
			}
			else if (this.acceleration.x > 0) {
				this.acceleration.x = limit;
			}
			else {
				this.acceleration.x = 0;
			}
		}
		if (Math.abs(this.acceleration.y) <= limit) {
			this.acceleration.y = ((vertical - this.position.y) - this.velocity.y);
			if (this.acceleration.y < 0) {
				this.acceleration.y = -limit;
			}
			else if (this.acceleration.y > 0) {
				this.acceleration.y = limit;
			}
			else {
				this.acceleration.y = 0;
			}
		}


		console.log("Acceleration:", this.acceleration.x, this.acceleration.y);	

		this.velocity.x = this.velocity.x + this.acceleration.x/10;
		this.velocity.y = this.velocity.y + this.acceleration.y/10;

		console.log("Velocity:", this.velocity.x, this.velocity.y)

		var posX = this.position.x + (this.velocity.x + 0.5*this.acceleration.x);
		var posY = this.position.y + (this.velocity.y + 0.5*this.acceleration.y);

		if (posX >= horizontal) {
			this.position.x = horizontal;
		}
		else {
			this.position.x = posX;
		}
		if (posY >= vertical) {
			this.position.y = vertical;
		}
		else {
			this.position.y = posY;
		}

		console.log("Position:", this.position.x, this.position.y);

		//this.velocity.add(this.acceleration);
		//this.position.add(this.velocity);
		// this.position.x = this.position.x + horizontal;
		// this.position.y = this.position.y + vertical;
	};

	module.exports = Player;
});