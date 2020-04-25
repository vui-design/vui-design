export default function padEnd(string, length, chars) {
	length = length >> 0;
	chars = String(typeof chars !== "undefined" ? chars : " ");

	if (string.length > length) {
		return String(string);
	}
	else {
		length = length - string.length;

		if (length > chars.length) {
			chars += chars.repeat(length / chars.length);
		}

		return String(string) + chars.slice(0, length);
	}
};