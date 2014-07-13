var dbase = require('./dbase.js')('user','username');
var helper = require('./helper.js');

module.exports = {
	find: function(params, cb) {
		if (!helper.isFunction(cb)) {
			cb = helper.dummy;
		}		
	/**	if (params.filter && Array.isArray(params.filter)) {
			return dbase.filter(params.filter,params.limit || null);
		} else {
			return dbase.list(cb,params.limit || null,params.desc || null)
		}*/

	},
	get: function(id, params, cb) {
		console.log('USER.get',arguments);
		if (!helper.isFunction(cb)) {
			cb = helper.dummy;
		}
		var user = dbase.get(id);
		if (!user) {
			return cb(new Error('User not found.'));
		}
		cb(null,user);
	},
	create: function(data, params, cb) {
		console.log('USER.create',arguments);
		if (!helper.isFunction(cb)) {
			cb = helper.dummy;
		}
		data.registered = Date.now();
		if (dbase.add(data)) {
			return cb(null,data);
		} else {
			return cb(new Error('Could not create user'));
		}
	},
	remove: function(id, params, cb) {
		console.log('USER.remove',arguments);
		if (!helper.isFunction(cb)) {
			cb = helper.dummy;
		}		
		if (dbase.remove(id)) {
			return cb(null,id);
		} else {
			return cb(new Error('Could not remove user'));
		}
	},
	update: function(id, data, param, cb) {
		cb(null,'test');
	}
};