// Include important JS helpers
require('./helpers.js');

var express = require('express'), // Include express engine
		app = express.createServer(), // create node server
		io = require('socket.io');

// Default APP Configuration
app.configure(function(){
  app.set('view engine', 'jade'); // uses JADE templating engine
  app.set('views', __dirname + '/views'); // default dir for views
  app.use(express.methodOverride());
  app.use(express.logger());
  app.use(app.router);
});

app.configure('development', function(){
   app.use(express.static(__dirname + '/public'));
   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});
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
			title: "Authenticate Twitter"
		}
	});
});


// Listen on this port
app.listen(10050); 
  
// Socket Connection
var socket = io.listen(app),
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