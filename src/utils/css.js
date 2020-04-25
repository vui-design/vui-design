/**
 * (Internal) Applies css properties to an element, similar to the jQuery
 * While this helper does assist with vendor prefixed property names, it
 * does not perform any manipulation of values prior to setting styles.
 */
let cssPrefixes = ["Webkit", "Moz", "O", "ms"];
let cssProps = {};

function getVendorProp(name) {
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
}

function camelCase(string) {
	return string.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function(match, letter) {
		return letter.toUpperCase();
	});
}

function getStyleProp(name) {
	name = camelCase(name);

	return cssProps[name] || (cssProps[name] = getVendorProp(name));
}

function applyCss(element, prop, value) {
	prop = getStyleProp(prop);

	element.style[prop] = value;
}

export default function css(element, properties) {
	let args = arguments;

	if (args.length == 2) {
		for (let prop in properties) {
			let value = properties[prop];

			if (value !== undefined && properties.hasOwnProperty(prop)) {
				applyCss(element, prop, value);
			}
		}
	}
	else {
		applyCss(element, args[1], args[2]);
	}
};