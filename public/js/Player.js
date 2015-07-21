define(["require", "exports", "module"], function(require, exports, module) {

	var Vector = require('Vector');

	var Player = function Player(point, velocity, acceleration) {
		this.position = point || new Vector(30, 30);
		this.velocity = velocity || new Vector(0, 0);
		this.acceleration = acceleration || new Vector(0, 0);
		this.drawColor = "#555"; // So we can tell them apart from Fields later
		this.verticalPressure = 0.9;
		this.horizontalPressure = 0.9;
	}

	Player.prototype.move = function (horizontal, vertical, acceleration) {

		//console.log(horizontal, vertical);

		this.acceleration.x = (((this.position.x+horizontal) - this.position.x) - this.velocity.x)*2;
		this.acceleration.y = (((this.position.y+vertical) - this.position.y) - this.velocity.y)*2;

		console.log("Acceleration:", this.acceleration.x, this.acceleration.y);	

		this.velocity.x = Math.sqrt(Math.abs(this.velocity.x*this.velocity.x + 2*this.acceleration.x*this.position.x));
		this.velocity.y = Math.sqrt(Math.abs(this.velocity.y*this.velocity.y + 2*this.acceleration.y*this.position.y));

		console.log("Velocity:", this.velocity.x, this.velocity.y)

		this.position.x = this.position.x + (this.velocity.x + 0.5*this.acceleration.x);
		this.position.y = this.position.y + (this.velocity.y + 0.5*this.acceleration.y);

		console.log("Position:", this.position.x, this.position.y);

		//this.velocity.add(this.acceleration);
		//this.position.add(this.velocity);
		// this.position.x = this.position.x + horizontal;
		// this.position.y = this.position.y + vertical;
	};

	module.exports = Player;
});