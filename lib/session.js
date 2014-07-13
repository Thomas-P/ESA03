var dbase = require('./dbase.js')('session','sid');
var user = require('./user.js');
var helper = require('./helper.js');

module.exports = {
	find: function(params, callback) {
		return;
		if (!helper.isFunction(callback)) {
			callback = helper.dummy;
		}
		if (params.filter && Array.isArray(params.filter)) {
			return dbase.filter(params.filter,params.limit || null);
		} else {
			return dbase.list(callback,params.limit || null,params.desc || null)
		}

	},
	get: function(sid, params, cb) {
		console.log('SESSION.get',arguments);
		if (!helper.isFunction(cb)) {
			cb = helper.dummy;
		}
		var session = dbase.get(sid);
		if (!session) {
			return cb(new Error('Session not found.'));
		}
		if (session.username) {
			user.get(session.username, {}, function(err,user){
				session.data = user;
				if (!session.data)
					session.data = {};
				cb(null,session);
			});
		} else {
			cb(null,session);
		}


	},
	create: function(data, params, cb) {
		console.log('SESSION.create',arguments);
		if (!helper.isFunction(cb)) {
			cb = helper.dummy;
		}
		if (!data.sid)
			data.sid = helper.guid();
		var session = {
			sid : data.sid,
			create: Date.now(),
			lastSeen: Date.now()
		};
		var failure = !dbase.add(session);
		if (failure)
			cb(new Error('Could not add session.'));
		else
			cb(null,session);

	},
	update: function(id, data, params, cb) {
		console.log('SESSION.update',arguments);
		if (!helper.isFunction(cb)) {
			cb = helper.dummy;
		}
		var ret = dbase.update(id,data);
		if (!ret) {
			return cb(new Error('Could not update the session.'));
		}
		cb(null,ret);
	},
	remove: function(id, params, cb) {
		console.log('SESSION.remove',arguments);
		if (!helper.isFunction(cb)) {
			cb = helper.dummy;
		}
		return dbase.remove(id);
	},
};