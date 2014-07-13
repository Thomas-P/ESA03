var feathers = require('feathers');
var fs = require('fs');
var easyimage = require('easyimage');
var path = require('path');
var swig = require('swig');

var session = require(__dirname +'/lib/session.js');
var user = require(__dirname +'/lib/user.js');
var template = require(__dirname +'/lib/template.js');
var photo = require(__dirname +'/lib/photo.js');

console.log(__dirname);

// setting Pathname
var viewPath = __dirname + '/views';
// Setting up Swig
swig =  new swig.Swig({
	cache: false,
	loader: swig.loaders.fs(viewPath)
});

var app = feathers();
app
.engine('html', swig.renderFile)
.set('view engine', 'html')
.set('views', viewPath)
.set('view cache', false)
.configure(
	feathers.socketio(
		function(io) {
			io.set('log level', 1);
			io.on('connection',function(socket) {
				socket.on('session::get',function(sid) {
					if (socket.auth)
						return;
					console.log('Check for auth');
					session.get(sid, {} ,function(err,userSession) {
						socket.auth = !!(userSession && userSession.data && userSession.data.username);
						if (socket.auth)
							app.lookup('photo').on('created',function(photo) {
								socket.emit('photo::new',photo);
							});

					});
				});

			});
		})
	)
.use('session', session)
.use('user', user)
.use('template',template)
.use('photo',photo)
.get('/',
	function (req, res) {
		photo.find({
			limit: 20,
			desc: true
		},function(err,data) {
			res.render('home', { photos: data });
		});
	})
.use(feathers.static(__dirname + '/static'))
.get('/[a-z]{1,10}',function(req,res,next) {
	res.redirect('/');
	next();
})
.listen(8080);
