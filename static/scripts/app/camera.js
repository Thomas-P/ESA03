define(['exports'],function(exports) {

	/* unprefix getUserMedia */
	navigator.getUserMedia = (navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia);

	var cameraStream;
	var userDenied = false;
	var noCameraFound = false;


	/* starts camera */
	var initCamera = function(callback) {

		if (cameraStream)
			return callback(null,cameraStream);

		if (!navigator.getUserMedia) {
			noCameraFound = true;
			userDenied = false;
			return callback(new Error('No Camera found'),null);
		}


		var cameraSuccessCallback = function(stream) {
			cameraStream = stream;
			callback(null,stream);
		};

		var cameraErrorCallback = function(error) {
			console.error('Cannot establish a camera connection. ',error);
			if (error == 'NO_DEVICES_FOUND' || error && error.name=='DevicesNotFoundError') {
				noCameraFound = true;
				userDenied = false;
			} else {
				noCameraFound = !true;
				userDenied = !false;
			}
			callback(new Error('Cannot establish a camera connection.'),null);
		};

		navigator.getUserMedia({
			video: true,
			audio: false
		}, cameraSuccessCallback,	cameraErrorCallback	);


	};

	/* Stops the media Stream */
	var stopCamera = function() {
		if (cameraStream)
			cameraStream.stop();
		cameraStream = null;
	};
	/* returns true if user denied access */
	var isDenied = function() {
		return userDenied;
	};
	/* returns true if no camera found */
	var cameraFound = function() {
		return !noCameraFound;
	};

	
	exports.init = initCamera;
	exports.stop = stopCamera;
	exports.isDenied = isDenied;
	exports.cameraFound = cameraFound;
});