var guid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
    v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

var base64encode = function (string) {
  return new Buffer(string)
  .toString('base64');
};
var base64decode = function (string) {
  return new Buffer(string, 'base64');
};

function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function dummy() {
  console.log('Had to use dummy');
}

module.exports = {
	guid: guid,
	base64decode: base64decode,
	base64encode: base64encode,
  isFunction: isFunction,
  dummy:dummy
};