requirejs.config({
	baseUrl: '/scripts/app',
	async:true,
	shim: {
		'socketio': {
			exports: 'io'
		},
		'EventEmitter': {
			exports: 'ee'
		},
		'history': {
			exports: 'History'
		}
	},
	paths: {
		'io': '../../socket.io/socket.io',
		'ee': '../EventEmitter',
		'history': '../history'
	},
	deps: ["template"]
});

requirejs(['domReady!','app'], function (domReady,app) {
	app.start();
});

