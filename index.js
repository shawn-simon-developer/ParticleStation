var express = require('express');
var app = express();

var PORT = 8001;

app.use(express.static('public'));

var server = app.listen(PORT, function() {
	console.log("Magic happening on port ", PORT)
});