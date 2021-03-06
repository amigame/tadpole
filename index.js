// Include important JS helpers
require('./helpers.js');

var express = require('express'), // Include express engine
		http = require('http'),
		app = express(),
		server = http.createServer(app), // create node server
		io = require('socket.io'),
		methodOverride = require('method-override');

var DEV = !(process.env.NODE_ENV == 'production');

// Default APP Configuration
//app.set('view engine', 'jade'); // uses JADE templating engine
//app.set('views', __dirname + '/views'); // default dir for views
app.use(methodOverride());

if( DEV ){
	app.use(express.static(__dirname + '/public'));
} else {
	var oneYear = 31557600000;
	app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
}
// Index Route
app.get('/', function(req, res){
	res.render('index', {
		locals: {
			title: "Tadpole"
		}
	});
});

// Socket Connection
var socket = io.listen( server ),
 		clients = []; // List of all connected Clients

// When user gets connected
socket.on('connection', function(client){
	// new client is here!
	var index = clients.push(client) - 1; // get array index of new client

	// On Message, send message to everyone
 	client.on('message', function(data){
		data = JSON.parse(data); // parse string data to json

		for(var i=0;i<clients.length;i++) {
			try {
				if(clients[i] != undefined)
					clients[i].send(data.msg); // send to all connected clients
			} catch(e) {
				console.log("doesn`t exist");
				continue; //if a client doesn`t exist, jus continue;
			}
		}
	});
	client.on('disconnect', function(){
		clients.splice(index,1); // remove client from array
		console.log("after length ===> " +clients.length);
	});
});


exports.server = server;
