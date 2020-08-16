/**
* (Internal) Applies css properties to an element, similar to the jQuery
* While this helper does assist with vendor prefixed property names, it does not perform any manipulation of values prior to setting styles.
*/
let cssPrefixes = ["Webkit", "Moz", "O", "ms"];
let cssProperties = {};

export function getVendorProperty(name) {
	let style = document.body.style;

	if (name in style) {
		return name;
	}

	let i = cssPrefixes.length;
	let capName = name.charAt(0).toUpperCase() + name.slice(1);
	let vendorName;

	while (i--) {
		vendorName = cssPrefixes[i] + capName;

		if (vendorName in style) {
			return vendorName;
		}
	}

	return name;
};

export function getStyleProperty(key) {
	key = key.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function(match, letter) {
		return letter.toUpperCase();
	});

	return cssProperties[key] || (cssProperties[key] = getVendorProperty(key));
};

export function applyStyle(element, key, value) {
	const property = getStyleProperty(key);

	element.style[property] = value;
};

export default function css(element, properties) {
	if (arguments.length == 2) {
		for (let key in properties) {
			const value = properties[key];

			if (value !== undefined && properties.hasOwnProperty(key)) {
				applyStyle(element, key, value);
			}
		}
	}
	else {
		applyStyle(element, arguments[1], arguments[2]);
	}
};