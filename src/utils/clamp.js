export default function clamp(n, min, max) {
	return Math.min.call(null, Math.max.call(null, n, min), max);
};