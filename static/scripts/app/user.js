define(['exports','helper','cookies','socket','events'],
	function(exports, helper, cookies, socket, events) {
	
	var sessionID = cookies.getItem('sid');
	var userData = {};

	var dummy = function(err) {
		if (err) {
			console.Error('Something went wrong',err);
		}
	};

	// create a new Session
	var createSession = function(callback) {
		sessionID = helper.guid();
		cookies.setItem('sid',sessionID, Infinity);		
		socket.emit('session::create', {
			sid : sessionID
		}, {}, function(err,sessionData) {
			if (err) {
				return callback(err);
			}
			userData = {};
			return callback(null,sessionData);
		});
	};



	var getSession = function(callback) {
		if (!sessionID) {
			return createSession(callback);
		}
		socket.emit('session::get', sessionID, {}, function(err,sessionData) {
			if (err) {
				return createSession(callback);
			}
			if ( sessionData.data ) {
				userData = sessionData.data;
				userData.lastLogged = sessionData.create;
				events.trigger('user::logged');
			} else {
				userData = {};
			}
			callback(null,sessionData);
		});
	};


	var updateSession = function(callback) {
		socket.emit('session::update',sessionID, {
			username:userData.username
		},{},callback);
	};


	var createUser = function(username, callback) {
		username = username && username.trim() || null;
		if (!callback)
			callback = dummy;
		if (!username)
			return callback(new Error('No user name set'),null);
		if (userData.username)
			return callback(new Error('User already set'),null);
		socket.emit('user::create',{
			username: username
		}, {}, function(err) {
			if (err) {
				return callback(err);
			}
			userData.username = username;
			updateSession(function(err,session) {
				if( !err)
					events.trigger('user::logged');
				callback(err,session);
			});
		});
	};

	socket.authEmit = function() {
		var param = arguments[arguments.length-2] || {};
		param.sid = sessionID;
		arguments[arguments.length-2] = param;
		socket.emit.apply(this,arguments);
	};

	events.on('socket::sendAuth',function() {
		socket.authEmit.apply(socket,arguments);
	});


	if (!sessionID) {
		createSession(function() {
			events.trigger('user::start');
		});
	} else {
		getSession(function() {
			events.trigger('user::start');
		});
	}

	events.on('user::login',function(username) {
		createUser(username,function(err) {
			if (err) {
				return alert('Sorry, user could not create: ' +err);
			}
		});
	});
	
	var getUserData = function() {
		return userData;
	};

	var isLogged = function() {
		return sessionID && userData.username;
	};

	var getUser = function() {
		return userData.username;
	};

	var getSessionExport = function() {
		return sessionID;
	};

	socket.on('photo::new',function(photo) {
		events.trigger('photo::new',[photo]);
	});

	exports.getData = getUserData;
	exports.getUser = getUser;
	exports.getSession = getSessionExport;
	exports.create = createUser;
	
});