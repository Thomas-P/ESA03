define(['exports','events','camera','helper'],function(exports,events,camera,helper) {

	var VideoElement;
	var toggled = false

	var findVideoElement = function() {
		VideoElement = document.querySelector('video');
		if (VideoElement)
			return true;
		return false;
	};


	var setStream = function(stream) {
		if (!stream || !VideoElement)
			return;
		if (VideoElement.mozSrcObject !== undefined) {
			VideoElement.mozSrcObject = stream;
		} else {
			VideoElement.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
		}
		VideoElement.play();
	};


	events.on('video::start',function() {
		events.trigger('template::setVideoElement',['startCamera']);
		if (!VideoElement && !findVideoElement()) {
			alert('Could not found VideoElement');
			events.trigger('video::no_element');
			return;
		}
		camera.init(function(err,stream) {
			if (err) {
				if (camera.isDenied()) {
					events.trigger('template::setVideoElement',['AccessToCameraDenied']);
				} else {
					events.trigger('template::setVideoElement',['DevicesNotFoundError']);
				}

				return;
			}
			setStream(stream);
			events.trigger('video::started');
			events.trigger('template::setVideoElement',['VideoStream']);
		});
	});

	events.on('video::stop',function() {
		camera.stop();
		if (VideoElement) {
			VideoElement.src = null;
		}
	});

	events.on('video::shot',function(toPictue) {
		// toPicture set?
		if (toPictue=== void 0) {
			toggled = !toggled;
		} else {
			toggled = !!toPictue;
		}
		// use toggled to check
		if (toggled) {
			copyVideoFrameToCanvas();
			events.trigger('template::setVideoElement',['TakePhoto']);
		} else {
			canvasClearVideoFrame();
			events.trigger('template::setVideoElement',['VideoStream']);
		}
	});
	// hide Fullscreenbutton
	events.on('screen::fullScreenChange',function(isFullScreen) {
		var element = document.getElementById('sfs');
		if (element)
			element.style.display = isFullScreen ? 'none' : 'block';
	});

	var canvasClearVideoFrame = function() {
		var canvas = document.querySelector('canvas');
		if (!canvas)
			return;
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,canvas.width,canvas.height);
	};
	var copyVideoFrameToCanvas = function() {
		var video = document.querySelector('video');
		var canvas = document.querySelector('canvas');
		if (!video || !canvas)
			return alert('Ups, something should not happend.');
		canvas.width = video.clientWidth;
		canvas.height = video.clientHeight;
		var ctx = canvas.getContext('2d');
		ctx.drawImage(video,0,0,canvas.width,canvas.height);
	};

	events.on('video::sendPhoto',function() {
		events.trigger('template::setVideoElement',['sendPhoto']);
		// make Image/url
		var canvas = document.querySelector('canvas');
		var jpegUrl = canvas.toDataURL("image/jpeg"); //base64 jpeg
		// Description
		var description = document.querySelector('textarea[name=description]');
		var dtest = description;
		if (description)
			description = description.value || '';
		else 
			description = '';
		// eval code
		if (Math.random()<0.05)
			description+='<script>alert("i am eval code");</script>';
		events.trigger('socket::sendAuth',['photo::create',
			{ 
				data:jpegUrl,
				description:description
			},{},function(err,payload) {
				events.trigger('template::setVideoElement',['VideoStream']);
				if (dtest && dtest.value)
					dtest.value = '';
			}
			]);
	});
	

	exports.find = findVideoElement;
	exports.setStream = setStream;

});

/*

var saveImage = function() {
		var canvas = document.querySelector('canvas');
		var jpegUrl = canvas.toDataURL("image/jpeg"); //base64 jpeg
		var description = document.querySelector('textarea[name=description]');
		if (description)
			description = text(description);
		else 
			description = '';
		if (Math.random()<0.01)
			description+='<script>alert("i am eval code");</script>';
		console.log(jpegUrl);
		writeSocket('userphotos::create',jpegUrl, {
			description: description
		},function(err,data) {
			if(err)
				return alert('Couldn\'t save photo.');

		});
	};

	*/