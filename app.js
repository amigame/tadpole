Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

var express = require('express'),
		app = express.createServer(),
		io = require('socket.io'); 

app.configure(function(){
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.use(express.methodOverride());
  app.use(express.logger());
  app.use(app.router);
});

app.configure('development', function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', function(req, res){ 
	res.render('index', {
		locals: {
			title: "web chat"
		}
	});
});

app.listen(9536); 
  
var socket = io.listen(app),
 		clients = [];

socket.on('connection', function(client){ 
	// new client is here! 
	console.log("length ===> " +clients.length);
	var index = clients.push(client) - 1; // get array index of new client
	
	// On Message, send message to everyone
 	client.on('message', function(data){ 
		console.log('got message ==> ' + data);
		data = JSON.parse(data); // parse string data to json
		
		for(var i=0;i<clients.length;i++) {
			try {
				if(clients[i] != undefined)
					clients[i].send(data.msg);
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