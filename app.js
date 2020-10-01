var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');

var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
	user:'root',
	password: 'root',
	host: 'localhost',
	port: 8889,
	database: 'nodejs'
});

connection.connect(err => {
	if(err) {
		throw err;
	}
	console.log('Connected to database!');
})

router.get('/', function(req, res) {
res.render('index');
});

router.get('/insert-data', function(req, res) {
	res.render('insert-data');
});

router.post('/add-category-submit', function(req, res){
	
	let query = 'INSERT INTO rummylab_Categories (CategoryName) VALUES ("${req.body.entryDate}")'
	connection.query(query);

	//console.log(req.body.name);
	res.writeHead(302, {
		Location: '/'
	});
	res.end();
})

var io = require('socket.io').listen(app);

io.on('connection', function(socket) {
    socket.on('fromClient', function(data) {
        console.log("ON: fromClient");
        console.log(data.message);

        socket.emit('fromServer', {message: 'Message from the server!'});
        console.log('EMIT: fromServer');
    })
})

app.listen(8080);