export default function padStart(value, length, chars) {
  const string = String(value);

  length = length >> 0;
  chars = String(typeof chars !== "undefined" ? chars : " ");

  if (string.length > length) {
    return string;
  }
  else {
    length = length - string.length;

    if (length > chars.length) {
      chars += chars.repeat(length / chars.length);
    }

    return chars.slice(0, length) + string;
  }
};