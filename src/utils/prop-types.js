const env = process && process.env && process.env.NODE_ENV;
const funProto = Function.prototype;
const objProto = Object.prototype;
const getPrototypeOf = Object.getPrototypeOf;
const objToString = objProto.toString;
const hasOwnProperty = objProto.hasOwnProperty;
const funToString = funProto.toString;
const noop = () => {};
const has = (object, property) => hasOwnProperty.call(object, property);
const isFunction = value => objToString.call(value) === "[object Function]" || typeof value === "function";
const isInteger = Number.isInteger || (value => typeof value === "number" && isFinite(value) && Math.floor(value) === value);
const isArray = Array.isArray || (value => objToString.call(value) === "[object Array]");
const isPlainObject = value => {
	if (!value || objToString.call(value) !== "[object Object]") {
		return false;
	}

	const prototype = getPrototypeOf(value);

	if (prototype === null) {
		return true;
	}

	const constructor = has(prototype, "constructor") && prototype.constructor;

	return typeof constructor === "function" && funToString.call(constructor) === funToString.call(Object);
};

let warn;

if (env === "production") {
	warn = noop;
}
else {
	const hasConsole = typeof console !== "undefined";

	warn = typeof console === "undefined" ? noop : message => console.warn("[VuePropTypes warn]: " + message);
}

const getType = fn => {
	const type = fn !== null && fn !== undefined ? (fn.type ? fn.type : fn) : null;
	const match = type && type.toString().match(/^\s*function (\w+)/);

	return match && match[1];
};

const getNativeType = value => {
	if (value === null || value === undefined) {
		return null;
	}

	const match = value.constructor.toString().match(/^\s*function (\w+)/);

	return match && match[1];
};

const withDefault = type => {
	Object.defineProperty(type, "def", {
		enumerable: false,
		writable: false,
		value(def) {
			if (def === undefined && this.default === undefined) {
				this.default = undefined;
				return this;
			}

			if (!isFunction(def) && !validateType(this, def)) {
				warn(this.vuePropTypesName + " - invalid default value: " + def, def);

				return this;
			}

			this.default = isArray(def) || isPlainObject(def) ? () => def : def;

			return this;
		}
	});
};

const withRequired = type => {
	Object.defineProperty(type, "isRequired", {
		enumerable: false,
		get() {
			this.required = true;

			return this;
		}
	});
};

const toType = (name, object) => {
	Object.defineProperty(object, "vuePropTypesName", {
		enumerable: false,
		writable: false,
		value: name
	});

	withRequired(object);
	withDefault(object);

	if (isFunction(object.validator)) {
		object.validator = object.validator.bind(object);
	}

	return object;
};

const validateType = (type, value, silent = false) => {
	let typeToCheck = type;
	let boolean = true;
	let expectedType;

	if (!isPlainObject(type)) {
		typeToCheck = {
			type
		};
	}

	const namePrefix = typeToCheck.vuePropTypesName ? typeToCheck.vuePropTypesName + " - " : "";

	if (has(typeToCheck, "type") && typeToCheck.type !== null) {
		if (isArray(typeToCheck.type)) {
			boolean = typeToCheck.type.some(type => validateType(type, value, true));
			expectedType = typeToCheck.type.map(type => getType(type)).join(" or ");
		}
		else {
			expectedType = getType(typeToCheck);

			if (expectedType === "Array") {
				boolean = isArray(value);
			}
			else if (expectedType === "Object") {
				boolean = isPlainObject(value);
			}
			else if (expectedType === "Function" || expectedType === "Boolean" || expectedType === "String" || expectedType === "Number") {
				boolean = getNativeType(value) === expectedType;
			}
			else {
				boolean = value instanceof typeToCheck.type;
			}
		}
	}

	if (!boolean) {
		silent === false && warn(namePrefix + "value " + value + " should be of type " + expectedType);

		return false;
	}

	if (has(typeToCheck, "validator") && isFunction(typeToCheck.validator)) {
		boolean = typeToCheck.validator(value);

		if (!boolean && silent === false) {
			warn(namePrefix + "custom validation failed");
		}

		return boolean;
	}

	return boolean;
};

const VuePropTypes = {
	get any() {
		return toType("any", {
			type: null
		});
	},

	get func() {
		return toType("function", {
			type: Function,
		}).def(defaults.func);
	},

	get bool() {
		return toType("boolean", {
			type: Boolean,
		}).def(defaults.bool);
	},

	get string() {
		return toType("string", {
			type: String,
		}).def(defaults.string);
	},

	get number() {
		return toType("number", {
			type: Number,
		}).def(defaults.number);
	},

	get integer() {
		return toType("integer", {
			type: Number,
			validator(value) {
				return isInteger(value);
			}
		}).def(defaults.integer);
	},

	get array() {
		return toType("array", {
			type: Array,
		}).def(defaults.array);
	},

	get object() {
		return toType("object", {
			type: Object,
		}).def(defaults.object);
	},

	get symbol() {
		return toType("symbol", {
			type: null,
			validator(value) {
				return typeof value === "symbol";
			},
		});
	},

	custom(validator, message = "custom validation failed") {
		if (!isFunction(validator)) {
			throw new TypeError("[VuePropTypes error]: You must provide a function as argument");
		}

		return toType(validator.name || "<<anonymous function>>", {
			validator(...args) {
				const boolean = validator(...args);

				if (!boolean) {
					warn(this.vuePropTypesName + " - " + message);
				}

				return boolean;
			}
		});
	},

	oneOf(array) {
		if (!isArray(array)) {
			throw new TypeError("[VuePropTypes error]: You must provide an array as argument");
		}

		const message = "oneOf - value should be one of [" + array.join(", ") + "]";
		const allowedTypes = array.reduce((result, value) => {
			if (value !== null && value !== undefined) {
				result.indexOf(value.constructor) === -1 && result.push(value.constructor);
			}

			return result;
		}, []);

		return toType("oneOf", {
			type: allowedTypes.length > 0 ? allowedTypes : null,
			validator(value) {
				const boolean = array.indexOf(value) !== -1;

				if (!boolean) {
					warn(message);
				}

				return boolean;
			}
		});
	},

	instanceOf(Constructor) {
		return toType("instanceOf", {
			type: Constructor
		});
	},

	oneOfType(array) {
		if (!isArray(array)) {
			throw new TypeError("[VuePropTypes error]: You must provide an array as argument");
		}

		let hasCustomValidators = false;

		const checks = array.reduce((result, type) => {
			if (isPlainObject(type)) {
				if (type.vuePropTypesName === "oneOf") {
					return result.concat(type.type || []);
				}

				if (type.type && !isFunction(type.validator)) {
					if (isArray(type.type)) {
						return result.concat(type.type);
					}

					result.push(type.type);
				}
				else if (isFunction(type.validator)) {
					hasCustomValidators = true;
				}

				return result;
			}

			result.push(type);

			return result;
		}, []);

		if (!hasCustomValidators) {
			return toType("oneOfType", {
				type: checks,
			}).def(undefined);
		}

		const class2types = array.map(type => {
			if (type && isArray(type.type)) {
				return type.type.map(getType);
			}

			return getType(type);
		}).reduce((result, type) => result.concat(isArray(type) ? type : [type]), []).join(", ");

		return this.custom(function oneOfType(value) {
			const boolean = array.some(type => {
				if (type.vuePropTypesName === "oneOf") {
					return type.type ? validateType(type.type, value, true) : true;
				}

				return validateType(type, value, true);
			});

			if (!boolean) {
				warn("oneOfType - value type should be one of [" + class2types + "]");
			}

			return boolean;
		}).def(undefined);
	},

	arrayOf(type) {
		return toType("arrayOf", {
			type: Array,
			validator(array) {
				const boolean = array.every(value => validateType(type, value));

				if (!boolean) {
					warn("arrayOf - value must be an array of " + getType(type));
				}

				return boolean;
			}
		});
	},

	objectOf(type) {
		return toType("objectOf", {
			type: Object,
			validator(object) {
				const boolean = Object.keys(object).every(key => validateType(type, object[key]));

				if (!boolean) {
					warn("objectOf - value must be an object of " + getType(type));
				}

				return boolean;
			}
		});
	},

	shape(object) {
		const keys = Object.keys(object);
		const requiredKeys = keys.filter(key => object[key] && object[key].required === true);
		const type = toType("shape", {
			type: Object,
			validator(value) {
				if (!isPlainObject(value)) {
					return false;
				}

				const valueKeys = Object.keys(value);

				if (requiredKeys.length > 0 && requiredKeys.some(requiredKey => valueKeys.indexOf(requiredKey) === -1)) {
					warn("shape - at least one of required properties [" + requiredKeys.join(", ") + "] is not present");

					return false;
				}

				return valueKeys.every(key => {
					if (keys.indexOf(key) === -1) {
						if (this.vuePropTypesIsLoose === true) {
							return true;
						}

						warn("shape - object is missing " + key + " property");

						return false;
					}

					const type = object[key];

					return validateType(type, value[key]);
				});
			}
		});

		Object.defineProperty(type, 'vuePropTypesIsLoose', {
			enumerable: false,
			writable: true,
			value: false
		});

		Object.defineProperty(type, "loose", {
			enumerable: false,
			get() {
				this.vuePropTypesIsLoose = true;

				return this;
			}
		});

		return type;
	}
};

const createDefaultTypes = () => {
	return {
		func: undefined,
		bool: undefined,
		string: undefined,
		number: undefined,
		integer: undefined,
		array: undefined,
		object: undefined,
	};
};

let defaults = createDefaultTypes();

Object.defineProperty(VuePropTypes, "sensibleDefaults", {
	enumerable: false,
	set(value) {
		if (value === false) {
			defaults = {};
		}
		else if (value === true) {
			defaults = createDefaultTypes();
		}
		else if (isPlainObject(value)) {
			defaults = value;
		}
	},
	get() {
		return defaults;
	}
});

export default VuePropTypes;