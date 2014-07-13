define(['exports','template','events','user','interaction','camera','video','stream'], function(exports,template,events,user) {

	var start = function() {
		events.trigger('app::load');
	};

	exports.start = start;
});