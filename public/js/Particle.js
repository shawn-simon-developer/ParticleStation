define(["require", "exports", "module"], function(require, exports, module) {

	var Vector = require('Vector');

	var Particle = function Particle(point, velocity, acceleration) {
		this.position = point || new Vector(0, 0);
		this.velocity = velocity || new Vector(0, 0);
		this.acceleration = acceleration || new Vector(0, 0);
	}

	Particle.prototype.submitToFields = function (fields) {

		var totalAccelerationX = 0;
		var totalAccelerationY = 0;

		for (var i = 0; i < fields.length; i++) {
			var field = fields[i];

			// find the distance between the particle and the field
			var vectorX = field.position.x - this.position.x;
			var vectorY = field.position.y - this.position.y;

			// calculate the force.
			var force = field.mass / Math.pow(vectorX*vectorX+vectorY*vectorY, 1.5);

			// add to the total acceleration the force adjusted by distance
			totalAccelerationX += vectorX * force;
			totalAccelerationY += vectorY * force;
		}

		// update our particle's acceleration
		this.acceleration = new Vector(totalAccelerationX, totalAccelerationY);
	};

	Particle.prototype.move = function () {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
	};

	module.exports = Particle;
});