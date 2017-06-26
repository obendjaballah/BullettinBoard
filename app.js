const express = require('express')
const app = express()
const pg = require('pg')
const bodyParser = require('body-parser');

var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost:5431/bulleting_board';

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')

app.use('/', bodyParser()) //creates key-value pairs request.body in app.post, e.g. request.body.username
app.use(express.static('src/public'))

app.get('/', ( req, res ) => {
	// Display the addmessage page
	res.render('addmessage')
})

app.post('/', function (req, res) {	
	var title = req.body.msgtitle
	var msg = req.body.msgbody
	pg.connect(connectionString, function (err, client, done) {
			if(err) {
				throw err
			}
			client.query("insert into messages (title, body) values ('" + title +"', '" + msg + "')", function(err) {
			if(err){
				throw err;
			}
					
			done();
			pg.end();
			// res.render('addmessage', {conf:"Your message has been sent!"})
			res.send("Message sent!")
		});
	});
});

app.get('/showmessage', ( req, res ) => {
	console.log("route reached")
	pg.connect(connectionString, function (err, client, done) {
		client.query('select * from messages', function (err, result) {
			if(err){
				throw err
			}
			var messages = result.rows
			console.log(messages)
			done();
			pg.end(); // the client will idle for another 30 seconds, temporarily preventing the app from closing, unless this function is called
					  // Display the addmessage page
			res.render('showmessage',{msgs: messages})
		
		}); // client.query
	}); // pg.connect 
}); // app.get


var listener = app.listen( 3000, function(){
	console.log('Bullettin Board App running')
})




