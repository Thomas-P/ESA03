define(['events','history','helper','screen'], function(events,History,helper,fullScreen) {

	/* predefined Elements. */
	var body = document.querySelector('body');
	var contentElement = document.querySelector('main');

	if (History.enabled) {
		body.addEventListener('click', overwriteLinks, false);

		History.Adapter.bind(window, 'statechange', function () {
			State = History.getState();
			var path = State.data.urlPath.substring(1);
			events.trigger('template::change',[path]);
		});

	}

	function overwriteLinks(event) { 
		var target = helper.traverse(event.target, 'a');
		if (target && helper.isRelative(target.href)) {
			event.preventDefault();
			History.pushState({
				urlPath: target.pathname
			}, helper.toText(target), target.href);
			return false;
		}

		var input = helper.traverse(event.target, 'input');
		// login user
		if (input && input.name == 'login') {
			event.preventDefault();
			var loginElement = document.getElementById('usernameForLogin');
			events.trigger('user::login',[loginElement.value]);
			return false;
		}
		// reconnect to camera
		if (input && input.name == 'allowCamera') {
			event.preventDefault();
			events.trigger('video::start');
			return;
		}
		// take a photo or Reset
		if (input && input.name == 'take' || input.name == 'resetPhoto') {
			event.preventDefault();
			fullScreen.cancelFullScreen();
			events.trigger('video::shot',[input.name == 'take']);
		}

		if (input && input.name == 'switchFullScreen') {
			event.preventDefault();
			fullScreen.requestFullScreen(document.getElementById('photo'));
			return;
		}

		if (input && input.name == 'sendPhoto') {
			event.preventDefault();
			events.trigger('video::sendPhoto');
		}

		return;
		// TODO
	}




});
