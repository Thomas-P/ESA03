define(['exports','helper','events','socket'], function(exports, helper, events,socket) {

	/* predefined Elements. */
	var body = document.querySelector('body');
	var contentElement = document.querySelector('main');
	var HiddenElement = document.getElementById('hidden_container');
	var useElement = document.getElementById('use');

	var appStart = [0,1];

	var init = function() {
		if (appStart[0]>1)
			contentElement.setAttribute('data-step',appStart[1]);
	};

	events.on('app::load', function() {
		appStart[0]++;
		if (appStart[1]==1)
			appStart[1] = 2;
		init();
	});

	events.on('user::start',function() {
		appStart[0]++;
		init();
	});

	events.on('user::logged', function() {
		appStart[1]=3;
		body.classList.remove('unlogged');
		body.classList.add('logged');
		init();
	});

	// got a request to change the template
	events.on('template::change', function(page) {

		if ('' == page) 
			page = 'home';

		var actualElement = useElement.children[0];
		if (actualElement.id == page)
			return;


		var template = document.getElementById(page);
		if (!template) {
			socket.authEmit('template::get', page, {}, function (err, template) {
				if (err) {
					console.error('Error while loading template: ', err);
					return;
				}
				useElement.innerHTML = template.content;
				HiddenElement.appendChild(actualElement);
				events.trigger('video::' + (page=='photo' ? 'start' : 'stop'));
				events.trigger('stream::' + (page=='stream' ? 'start' : 'stop'));
			});			
		} else {
			if (actualElement.id == 'account')
				actualElement.parentElement.removeChild(actualElement);
			else
				HiddenElement.appendChild(actualElement);
			useElement.appendChild(template);
			events.trigger('video::' + (page=='photo' ? 'start' : 'stop'));
			events.trigger('stream::' + (page=='stream' ? 'start' : 'stop'));
		}

	});

	events.on('template::setVideoElement',function(seeType) {
		var actualElement = useElement.children[0] || null;
		if (!seeType || !actualElement || actualElement.id!='photo')
			return;
		var tmp;
		for (var i=0;i< actualElement.children.length;i++) {
			tmp = actualElement.children[i];
			tmp.style.display = tmp.id == seeType ? 'block' : 'none';
		}

	});
});