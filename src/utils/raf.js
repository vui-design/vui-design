// Thanks for https://github.com/chrisdickinson/raf
import getDOMHighResTimeStamp from "./getDOMHighResTimeStamp";

const root = typeof window === "undefined" ? global : window;
const vendors = ["webkit", "moz", "ms"];
const suffix = "AnimationFrame";

let raf = root["request" + suffix];
let caf = root["cancel" + suffix] || root["cancelRequest" + suffix];

for (let i = 0; !raf && i < vendors.length; i++) {
	raf = root[vendors[i] + "Request" + suffix];
	caf = root[vendors[i] + "Cancel" + suffix] || root[vendors[i] + "CancelRequest" + suffix];
}

if (!raf || !caf) {
	let last = 0;
	let id = 0;
	let queue = [];
	let frameDuration = 1000 / 60;

	raf = function(callback) {
		if (queue.length === 0) {
			const now = getDOMHighResTimeStamp();
			const next = Math.max(0, frameDuration - (now - last));

			last = next + now;

			setTimeout(function() {
				const cp = queue.slice(0);

				queue.length = 0;

				for (let i = 0; i < cp.length; i++) {
					if (!cp[i].cancelled) {
						try {
							cp[i].callback(last);
						}
						catch(e) {
							setTimeout(function() {
								throw e;
							}, 0);
						}
					}
				}
			}, Math.round(next));
		}

		id++;

		queue.push({
			id: id,
			callback: callback,
			cancelled: false
		});

		return id;
	};

	caf = function(id) {
		for (let i = 0; i < queue.length; i++) {
			if (queue[i].id === id) {
				queue[i].cancelled = true;
			}
		}
	};
}

const requestAnimationFrame = function(callback) {
	return raf.call(root, callback);
};

requestAnimationFrame.cancel = function() {
	caf.apply(root, arguments);
};

requestAnimationFrame.polyfill = function(object) {
	if (!object) {
		object = root;
	}

	object.requestAnimationFrame = raf;
	object.cancelAnimationFrame = caf;
};

export default requestAnimationFrame;