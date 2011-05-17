var express=require('express'),
	app=express.createServer(),
	ua = require('user-agent');

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.static(__dirname+'/public'));
});

//Test Page
app.get('/', function(req,res){
	res.redirect('/index.html');
});

//Web Service
app.get('/ua/:ua?', function(req,res){
	var q=req.params.ua || req.query.ua || req.headers['user-agent'];
	console.log('parsing: '+q);
	res.send(JSON.stringify(ua.parse(q)));
});

app.listen(10050);

console.log('listening on http://localhost:10050');