import restArgs from "./restArgs";

export default restArgs(function(fn, wait, args) {
  return setTimeout(function() {
    return fn.apply(null, args);
  }, wait);
});