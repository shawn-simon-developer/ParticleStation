define(["require", "exports", "module"], function() {
	var game = function() {


		

		var maxParticles = 20000;
		var particleSize = 2;
		var emissionRate = 5;
		var objectSize = 15; // drawSize of emitter/field

		var canvas = document.querySelector('canvas');
		var ctx = canvas.getContext('2d');

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;


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

		    // Move our particles
		    particle.move();

		    // Add this particle to the list of current particles
		    currentParticles.push(particle);
		  }

		  // Update our global particles reference
		  particles = currentParticles;
		}

		function drawParticles() {
		  ctx.fillStyle = 'rgb(255,255,255)';
		  for (var i = 0; i < particles.length; i++) {
		    var position = particles[i].position;
		    ctx.beginPath();
		    ctx.arc(position.x, position.y, particleSize/2, 0, Math.PI * 2);
		    ctx.closePath();
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
		 
		var particles = []; 

		var midX = canvas.width / 2;
		var midY = canvas.height / 2; 

		var emitters = [];
		var fields = [];

		function generateUniverse() {
			emitters = [new Emitter(new Vector(Math.random()*canvas.width, Math.random()*canvas.height), Vector.fromAngle(0, 2))];
			fields = [new Field(new Vector(Math.random()*canvas.width, Math.random()*canvas.height), ((Math.random()*2)-1)*4000)];
		}

		generateUniverse()
		setInterval(function () {
			generateUniverse()
		}, 2000);


		function loop() {
			clear();
			update();
			draw();
			queue();
		}

		function clear() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

		function update() {
			addNewParticles();
			plotParticles(canvas.width, canvas.height);
		}

		function draw() {
		  drawParticles();
		  fields.forEach(drawCircle);
		  emitters.forEach(drawCircle);
		}

		function queue() {
			window.requestAnimationFrame(loop);
		}

		loop();
	}

	module.exports = game;
});