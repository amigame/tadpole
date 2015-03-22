// Include important JS helpers
require('./helpers.js');

var express = require('express'), // Include express engine
		http = require('http'),
		app = express(),
		server = http.createServer(app), // create node server
		io = require('socket.io'),
		methodOverride = require('method-override'),
		config = require('./config/server');

var DEV = !(process.env.NODE_ENV == 'production');

// Default APP Configuration
app.set('view engine', 'jade'); // uses JADE templating engine
app.set('views', __dirname + '/views'); // default dir for views
app.use(methodOverride());
//app.use(express.logger());
//app.use(app.router);

if( DEV ){
	app.use(express.static(__dirname + '/public'));
//	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
} else {
	var oneYear = 31557600000;
	app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
//	app.use(express.errorHandler());
}
// Index Route
app.get('/', function(req, res){
	res.render('index', {
		locals: {
			title: "Rumpetnode! It's Rumpetroll with a node backend"
		}
	});
});

// Auth Route
app.get('/auth', function(req, res){
	res.render('auth', {
		locals: {
			title: "Authenticate Twitter",
			//twitter: config.twitter,
			layout: false
		}
	});
});


// Listen on this port
server.listen( config.port );

// Socket Connection
var socket = io.listen( server ),
 		clients = []; // List of all connected Clients

// When user gets connected
socket.on('connection', function(client){
	// new client is here!
	var index = clients.push(client) - 1; // get array index of new client

	// On Message, send message to everyone
 	client.on('message', function(data){
		console.log('got message ==> ' + data);
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