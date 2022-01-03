/**
* (Internal) Applies css properties to an element, similar to the jQuery
* While this helper does assist with vendor prefixed property names, it does not perform any manipulation of values prior to setting styles.
*/
const cssPrefixes = ["Webkit", "Moz", "O", "ms"];
let cssProperties = {};

export function getVendorProperty(key) {
  const style = document.body.style;

  if (key in style) {
    return key;
  }

  let i = cssPrefixes.length;
  let capName = key.charAt(0).toUpperCase() + key.slice(1);
  let vendorName;

  while(i--) {
    vendorName = cssPrefixes[i] + capName;

    if (vendorName in style) {
      return vendorName;
    }
  }

  return key;
};

export function getStyleProperty(key) {
  key = key.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, (match, letter) => {
    return letter.toUpperCase();
  });

  return cssProperties[key] || (cssProperties[key] = getVendorProperty(key));
};

export function setStyle(element, key, value) {
  const property = getStyleProperty(key);

  element.style[property] = value;
};

export default function setStyles(element, styles) {
  if (arguments.length === 2) {
    for (let key in styles) {
      const value = styles[key];

      if (value !== undefined && styles.hasOwnProperty(key)) {
        setStyle(element, key, value);
      }
    }
  }
  else {
    setStyle(element, arguments[1], arguments[2]);
  }
};