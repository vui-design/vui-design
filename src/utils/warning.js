const production = process.env.NODE_ENV === "production";
let warning = function() {};

if (!production) {
  const printWarning = function(format, args) {
    const length = arguments.length;

    args = new Array(length > 1 ? length - 1 : 0);

    for (let i = 1; i < length; i++) {
      args[i - 1] = arguments[i];
    }

    let argIndex = 0;
    const message = format.replace(/%s/g, function() {
      return args[argIndex++];
    });

    if (typeof console !== "undefined") {
      console.error(message);
    }

    try {
      throw new Error(message);
    }
    catch(e) {

    }
  };

  warning = function(condition, format, args) {
    const length = arguments.length;

    args = new Array(length > 2 ? length - 2 : 0);

    for (let i = 2; i < length; i++) {
      args[i - 2] = arguments[i];
    }

    if (format === undefined) {
      throw new Error("`warning(condition, format, ...args)` requires a warning message argument.");
    }

    if (!condition) {
      printWarning.apply(null, [format].concat(args));
    }
  };
}

export default warning;