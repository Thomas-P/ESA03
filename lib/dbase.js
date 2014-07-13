var fs = require('fs');
var pathUtil = require('path');
var util = require('util');



/* Setting up Pathname */
var pathName = __dirname+'/../database/';

var used = {};

// little dirty wrapper i wrote, when i was drunken
// and i didn't want to use database
// i think, i was very drunken
var dataBase = function(dbName,primary,parameter) {
	// params
	var parameter = parameter || {};
	var path = (parameter.path || pathName);
	var primary = primary || '_id';
	
	// Internals
	var internaleID = 0;
	var store = [];

	if (!pathUtil.extname(dbName)) {
		dbName+='.json';
	}

	if (used[dbName]) {
		return used[dbName];
	}
	// exits, then load
	if (fs.existsSync(path+dbName)) {
		var data = fs.readFileSync(path+dbName);
		if (Buffer.isBuffer(data))
			data = data.toString();
		if (data)
			data = JSON.parse(data);

		store = data.store || [];
		internaleID = data.internaleID || 0;
	}

	var count = 0;
	var saveStore = function() {
		fs.writeFile(path+dbName,JSON.stringify({
			store: store,
			internaleID: internaleID
		}),function(err) {
			// save data every 5 minutes
			setTimeout(saveStore,50000);
			if (err) {
				return console.error('Could not save File:',dbName);
			}
			return console.log('File saved:', dbName, ++count,'time');
		});
	};
	// init Savestore
	saveStore();

	// get Method
	var get = function(value) {
		if (!value) {
			return null;
		}
		value = new String(value).toLowerCase();

		for (var i=0 ;i<store.length;i++) {
			if (!store[i] || !store[i][primary]) {
				continue;
			}
			if (new String(store[i][primary]).toLowerCase()==value) {
				return store[i];
			}
		}
		return null;
	};


	var add = function(data) {
		data._id = internaleID+1;
		if (!data[primary]) {
			return false
		}
		if (get(data[primary]))
			return false;
		store.push(data);
		internaleID++;
		return true;
	};


	var filter = function(key, values, limit, desc) {
		if (!Array.isArray(values)) {
			values = [];
		}
		// reduce to unique items
		values = values.reduce(function(a,b) {
			b = new String(b).toLowerCase();
			if (-1 == a.indexOf(b))
				a.push(b);
			return a;
		},[]);

		if (!limit || limit < 0)
			limit = Math.pow(2,52);
		found = 0;
		var ret = [];

		for(i=0;i<store.length;i++) {
			storeData = store[desc ? store.length-i-1 : i];
			if (!storeData)
				continue;
			var primaryData = new String(storeData[key] || '').toLowerCase();
			if ( -1 !== values.indexOf(primaryData)) {
				ret.push(storeData);
				found++;
				if (limit===found) {
					return ret;
				}
			}
		}
		return ret;
	};
	
	var list = function(limit, desc) {
		if (!limit || limit < 0)
			limit = Math.pow(2,52);
		found = 0;
		var ret = [];

		for(i=0;i<store.length;i++) {
			storeData = store[desc ? store.length-i-1 : i];
			if (!storeData)
				continue;
			ret.push(storeData);
			if (limit===ret.length) {
				return ret;
			}
		}
		return ret;
	};

	var remove = function (value) {
		var myGet = get (value);
		if (!myGet)
			return false;
		store.slice(store.indexOf(myGet),1);
		return true;
	};

	var update = function(id,data) {
		var data2 = get(id);
		if (!data2)
			return null;
		for (name in data) {
			if (name == '_id')
				continue;
			data2[name] = data[name];
		}
		return data2;
	};



	ret = {
		get: get,
		filter: filter,
		add: add,
		remove: remove,
		list: list,
		update: update
	};
	used[dbName] = ret;


	return ret;
};

module.exports = dataBase;