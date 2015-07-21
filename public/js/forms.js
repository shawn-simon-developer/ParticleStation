$('#particleMax').on('submit', function(event){
	event.preventDefault();

	console.log(GameOptions.maxParticles);

	GameOptions.maxParticles = $('#particles').val();
	game(GameOptions);
});

$('#playerMass').on('submit', function(event){
	event.preventDefault();

	console.log(GameOptions.maxParticles);

	GameOptions.playerMass = $('#mass').val();
	game(GameOptions);
});

$('#fieldNum').on('submit', function(event){
	event.preventDefault();

	console.log(GameOptions.maxParticles);

	GameOptions.numberOfFields = $('#fields').val();
	game(GameOptions);
});

$('#emitterNum').on('submit', function(event){
	event.preventDefault();

	console.log(GameOptions.maxParticles);

	GameOptions.numberOfEmitters = $('#emitters').val();
	game(GameOptions);
});