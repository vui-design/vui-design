import is from "./is";

function isInstanceOf(value, type) {
  return type != null && value instanceof type;
}

function getRegExpFlags(value) {
  var flags = "";

  if (value.global) {
    flags += "g";
  }

  if (value.ignoreCase) {
    flags += "i";
  }

  if (value.multiline) {
    flags += "m";
  }

  return flags;
}

var Map = window.Map || function() {};
var Set = window.Set || function() {};
var Promise = window.Promise || function() {};

function clone(parent, circular, depth, prototype, includeNonEnumerable) {
  if (typeof circular === "object") {
    circular = circular.circular;
    depth = circular.depth;
    prototype = circular.prototype;
    includeNonEnumerable = circular.includeNonEnumerable;
  }

  var allParents = [];
  var allChildren = [];
  var useBuffer = typeof Buffer != "undefined";

  if (typeof circular == "undefined") {
    circular = true;
  }

  if (typeof depth == "undefined") {
    depth = Infinity;
  }

  function copy(parent, depth) {
    if (parent === null) {
      return null;
    }

    if (depth === 0) {
      return parent;
    }

    var proto;
    var child;

    if (typeof parent != "object") {
      return parent;
    }

    if (isInstanceOf(parent, Map)) {
      child = new Map();
    }
    else if (isInstanceOf(parent, Set)) {
      child = new Set();
    }
    else if (isInstanceOf(parent, Promise)) {
      child = new Promise(function(resolve, reject) {
        parent.then(function(value) {
          resolve(copy(value, depth - 1));
        }, function(error) {
          reject(copy(error, depth - 1));
        });
      });
    }
    else if (is.array(parent)) {
      child = [];
    }
    else if (is.regexp(parent)) {
      child = new RegExp(parent.source, getRegExpFlags(parent));

      if (parent.lastIndex) {
        child.lastIndex = parent.lastIndex;
      }
    }
    else if (is.date(parent)) {
      child = new Date(parent.getTime());
    }
    else if (useBuffer && Buffer.isBuffer(parent)) {
      if (Buffer.from) {
        child = Buffer.from(parent);
      }
      else {
        child = new Buffer(parent.length);
        parent.copy(child);
      }

      return child;
    }
    else if (isInstanceOf(parent, Error)) {
      child = Object.create(parent);
    }
    else {
      if (typeof prototype == "undefined") {
        proto = Object.getPrototypeOf(parent);
      }
      else {
        proto = prototype;
      }

      child = Object.create(proto);
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }

      allParents.push(parent);
      allChildren.push(child);
    }

    if (isInstanceOf(parent, Map)) {
      parent.forEach(function(value, key) {
        var newKey = copy(key, depth - 1);
        var newValue = copy(value, depth - 1);

        child.set(newKey, newValue);
      });
    }

    if (isInstanceOf(parent, Set)) {
      parent.forEach(function(value) {
        var entry = copy(value, depth - 1);

        child.add(entry);
      });
    }

    for (var i in parent) {
      var attrs = Object.getOwnPropertyDescriptor(parent, i);

      if (attrs) {
        child[i] = copy(parent[i], depth - 1);
      }

      try {
        var objProperty = Object.getOwnPropertyDescriptor(parent, i);

        if (objProperty.set === "undefined") {
          continue;
        }

        child[i] = copy(parent[i], depth - 1);
      }
      catch(e) {
        if (e instanceof TypeError) {
          continue;
        }
        else if (e instanceof ReferenceError) {
          continue;
        }
      }
    }

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(parent);

      for (var i = 0; i < symbols.length; i++) {
        var symbol = symbols[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);

        if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
          continue;
        }

        child[symbol] = copy(parent[symbol], depth - 1);

        Object.defineProperty(child, symbol, descriptor);
      }
    }

    if (includeNonEnumerable) {
      var allPropertyNames = Object.getOwnPropertyNames(parent);

      for (var i = 0; i < allPropertyNames.length; i++) {
        var propertyName = allPropertyNames[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);

        if (descriptor && descriptor.enumerable) {
          continue;
        }

        child[propertyName] = copy(parent[propertyName], depth - 1);

        Object.defineProperty(child, propertyName, descriptor);
      }
    }

    return child;
  }

  return copy(parent, depth);
};

clone.clonePrototype = function clonePrototype(parent) {
  if (parent === null) {
    return null;
  }

  var c = function() {};

  c.prototype = parent;

  return new c();
};

export default clone;