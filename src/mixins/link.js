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
			let { $router: router, $route: route, $props: props } = this;
			let result = router.resolve(props.to, route, props.append);

			return result;
		},
		handleLinkClick(e) {
			let { $router: router, $props: props } = this;
			let { getNextRoute } = this;

			this.$emit("click", e);

			if (props.href) {

			}
			else if (props.to && guardLinkEvent(e)) {
				try {
					let route = getNextRoute();
					let reject = error => {};

					props.replace ? router.replace(route.location).catch(reject) : router.push(route.location).catch(reject);
				}
				catch(e) {
					console.error(e);
				}
			}
		}
	}
};