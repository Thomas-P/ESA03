define(['exports'],function(exports) {

	// Insert Text in a tag with textNode -> security
	var insert = function (tag, text) {
		var element = document.getElementById(tag);
		if (!element)
			return;
		var textNode = document.createTextNode(text);
		while (element.childNodes.length) {
			element.removeChild(element.childNodes[0]);
		}
		element.appendChild(textNode);
	};

	// Prototype String trim
	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		};
		String.prototype.ltrim = function () {
			return this.replace(/^\s+/, '');
		};
		String.prototype.rtrim = function () {
			return this.replace(/\s+$/, '');
		};
		String.prototype.fulltrim = function () {
			return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '')
			.replace(/\s+/g, ' ');
		};
	}
	// create a unique ID -> based on a RFC
	var guid = function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};

	// JQuery Text
	var text = function (elem) {
		if (!elem)
			return "";
		var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

		if (!nodeType) {
			// If no nodeType, this is expected to be an array
			while ((node = elem[i++])) {
				// Do not traverse comment nodes
				ret += text(node);
			}
		} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
			// Use textContent for elements
			return elem.textContent;
		} else if (nodeType === 3 || nodeType === 4) {
			return elem.nodeValue;
		} // Do not include comment or processing instruction nodes

		return ret;
	};

	// Is check a String or not
	var isString = function (check) {
		return typeof check == 'string' || check instanceof String;
	};


	var traverseElement = function (element, tag) { // traverse an element up to body, finding a specified tag

		if ((element instanceof Element) === false) // Ist das übergebene Element vom Typ Element
			return null;
		if (!tag || !isString(tag))
			return element;
		tag = tag.toLowerCase();

		while (element.tagName && (element.tagName.toLowerCase() != 'body' && element.tagName.toLowerCase() != tag)) {
			element = element.parentNode;
		}
		return element.tagName.toLowerCase() == tag ? element : null;
	};

	var isRelative = function (link) { //	prüft ob der übergebene Link auf ein realatives Element zeigt oder nicht
		if (/^https?:\/\//i.test(link)) {
			var parser = document.createElement('a');
			try {
				parser.href = link;

				if (parser.host == document.location.host) // same Host?
					return true;
			} catch (e) {
				console.error('Error: ', e);
			}
			return false;
		}
		return true;
	};

	exports.isRelative = isRelative;
	exports.traverse = traverseElement;
	exports.isString = isString;
	exports.toText = text;
	exports.guid = guid;
	exports.insertText = insert;
	
});