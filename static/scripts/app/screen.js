define(['exports','events'],function(exports,events){
	
	// Implementation for all known webbrowser
	var _cancelFullScreen = function() {
		return (
			(document.exitFullscreen && document.exitFullscreen()) ||
			(document.webkitExitFullscreen && document.webkitExitFullscreen())  ||
			(document.webkitCancelFullScreen && document.webkitCancelFullScreen()) ||
			(document.msExitFullscreen && document.msExitFullscreen()) ||
			(document.mozCancelFullScreen && document.mozCancelFullScreen()) 
			);
	};

	var _canFullScreen = function() {
		return document.webkitFullscreenEnabled || 
		document.mozFullScreenEnabled || 
		document.FullScreenEnabled;
	};

	var _fullScreenElement = function() {
		return (document.fullScreenElement || 
			document.webkitCurrentFullScreenElement || 
			document.webkitFullScreenElement || 
			document.mozFullScreenElement || 
			document.msFullscreenElement);
	};

	var _isFullScreen = function() {
		return !!(document.fullScreenElement || 
			document.msFullScreenElement ||	
			document.mozFullScreen || 
			document.webkitIsFullScreen);
	};

	var _requestFullScreen = function(element) {
		if (element) {
			return (
				(element.requestFullscreen && element.requestFullscreen()) || 
				(element.webkitRequestFullscreen && element.webkitRequestFullscreen()) || 
				(element.msRequestFullscreen && element.msRequestFullscreen()) || 
				(element.mozRequestFullScreen && element.mozRequestFullScreen())
				);
		}
	};

	// Statehandling
	var _fullScreenError = function() {
		events.trigger('screen::fullScreenError');
	};

	var _fullScreenChange  = function() {
		var isFullScreen = _isFullScreen();
		// trigger the fullScreenState
		events.trigger('screen::fullScreenChange',[isFullScreen]);
	};
	/* doesn't work at the moment*/
	document.addEventListener('fullscreenchange', _fullScreenChange,false);
	document.addEventListener('mozfullscreenchange', _fullScreenChange,false);
	document.addEventListener('webkitfullscreenchange', _fullScreenChange,false);
	document.addEventListener('msfullscreenchange', _fullScreenChange);


	document.addEventListener('webkitfullscreenerror', _fullScreenError,false);
	document.addEventListener('MSFullscreenError', _fullScreenError,false);
	document.addEventListener('mozfullscreenerror', _fullScreenError,false);
	document.addEventListener('fullscreenerror', _fullScreenError,false);

	exports.cancelFullScreen = _cancelFullScreen;
	exports.canFullScreen = _canFullScreen;
	exports.fullScreenElement = _fullScreenElement;
	exports.isFullScreen = _isFullScreen;
	exports.requestFullScreen = _requestFullScreen;
});