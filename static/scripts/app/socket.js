define(['io'],function(io) {

	var Socket = io.connect();
	return Socket;
});