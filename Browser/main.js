var RethinkdbWebsocketClient = require('rethinkdb-websocket-client')
var r = RethinkdbWebsocketClient.rethinkdb

// In case you want bluebird, which is bundled with the rethinkdb driver
var Promise = RethinkdbWebsocketClient.Promise

var options = {
	host: 'localhost',       // hostname of the websocket server
	port: 8015,              // port number of the websocket server
	path: '/',               // HTTP path to websocket route
	wsProtocols: ['binary'], // sub-protocols for websocket, required for websockify
	secure: false,           // set true to use secure TLS websockets
	db: 'test',              // default database, passed to rethinkdb.connect
	simulatedLatencyMs: 100, // wait 100ms before sending each message (optional)
}

var databaseConnection
var pointer

RethinkdbWebsocketClient.connect(options).then(function(connection) {
	databaseConnection = connection
	r.table('events').changes().run(connection, function(error, cursor) {
		if (error) throw error
		cursor.each(function(error, change) {
			pointer.style.left = change.new_val.position[0] - 12
			pointer.style.top = change.new_val.position[1] - 12 
			if (error) throw error
		})
	})
})

sendLocation = function(event) {
	r.db('test').table('events').insert({
		name: 'moved',
		position: [event.clientX, event.clientY, 10],
		date: new Date()}
	).run(databaseConnection)
}

window.onload = function() {
	pointer = document.querySelector('.circle')
}