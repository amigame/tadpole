// Include important JS helpers
var config = require( __dirname +'/config/server'), 
	server = require('./index').server; 
	
// Listen on this port
server.listen(config.port); 
