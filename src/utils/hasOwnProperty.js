export default function hasOwnProperty(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
};