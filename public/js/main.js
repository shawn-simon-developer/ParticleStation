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

var game = function(GameOptions) {
	require(["Vector", "Particle", "Emitter", "Field", "Player", "Engine"], function(Vector, Particle, Emitter, Field, Player, Engine) {

		var newGame = new Engine(GameOptions);
		newGame.startGame();
	});
};

game(GameOptions);