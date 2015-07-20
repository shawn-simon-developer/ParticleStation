define(["require", "exports", "module"], function(require, exports, module) {

	var Vector = require("Vector");
	var Particle = require("Particle");

	function Emitter(point, velocity, spread) {
		this.position = point; // Vector
		this.velocity = velocity; // Vector
		this.spread = spread || Math.PI / 32; // possible angles = velocity +/- spread
		this.drawColor = "#999"; // So we can tell them apart from Fields later
	};

	Emitter.prototype.emitParticle = function() {

	  var angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 360);

	  var magnitude = this.velocity.getMagnitude();

	  var position = new Vector(this.position.x, this.position.y);

	  var velocity = Vector.fromAngle(angle, magnitude);

	  return new Particle(position,velocity);
	};

	module.exports = Emitter;

});