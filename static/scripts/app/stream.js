define(['template','events','user'],function(template,events,user) {

	var createListElement= function(photoData) {
		console.log(photoData);
		// List Item
		var li = document.createElement('li');
		li.classList.add('photolist');
		// photo Img
		var photo = document.createElement('img');
		photo.src='/images/'+escape(photoData['photoId']);
		li.appendChild(photo);
		// Description
		var p = document.createElement('p');
		p.classList.add('description');
		var text = document.createTextNode(photoData['description']);
		p.appendChild(text);
		li.appendChild(p)
		// Userinfo 
		p = document.createElement('p');
		text = document.createTextNode('From ');
		p.appendChild(text);
		// User
		var span = document.createElement('span');
		span.classList.add('user');
		text = document.createTextNode(photoData['username']);
		span.appendChild(text);
		// Separator
		p.appendChild(span);
		text = document.createTextNode(' at ');
		p.appendChild(text);
		// Timestamp
		var span = document.createElement('span');
		span.classList.add('time');
		
		var date = new Date(photoData['shotAt']);
		var timeString = [date.getDate(),'.',date.getMonth()+1,'.',date.getFullYear(),' ',date.getHours(),':',date.getMinutes(),':',date.getSeconds()];
		
		text = document.createTextNode(timeString.join(''));
		span.appendChild(text);
		p.appendChild(span);
		// and to li
		li.appendChild(p);
		return li;
	};

	events.on('photo::new',function(photoData) {
		createListElement(photoData);
		var stream = document.querySelector('ul.stream');
		if (!stream)
			return;
		var firstListItem = document.querySelector('ul.stream > li');
		var listElement = createListElement(photoData);
		stream.insertBefore(listElement,firstListItem);

		if (user.getUser() != photoData['username']) {
			return;
		}
		// private Stream
		listElement = listElement.cloneNod(true);
		stream = document.querySelector('ul.privateStream');
		if (!stream)
			return;
		firstListItem = document.querySelector('ul.privateStream > li');
		stream.insertBefore(listElement,firstListItem);
	});
});