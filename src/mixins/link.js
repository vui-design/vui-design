import is from "vui-design/utils/is";
import guardLinkEvent from "vui-design/utils/guardLinkEvent";

export default {
	props: {
		href: {
			type: String,
			default: undefined
		},
		to: {
			type: [String, Object],
			default: undefined
		},
		replace: {
			type: Boolean,
			default: false
		},
		append: {
			type: Boolean,
			default: false
		},
		target: {
			type: String,
			default: undefined
		}
	},
	methods: {
		getNextRoute() {
			let { $router, $route, to, append } = this;
			let next = $router.resolve(to, $route, append);

			return next;
		},
		handleLinkClick(e) {
			let { $router, href, to, replace, getNextRoute } = this;

			this.$emit("click", e);

			if (href) {

			}
			else if (to && guardLinkEvent(e)) {
				try {
					let next = getNextRoute();

					replace ? $router.replace(next.location).catch(error => {}) : $router.push(next.location).catch(error => {});
				}
				catch(e) {
					console.error(e);
				}
			}
		}
	}
};