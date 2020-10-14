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
			const { $router: router, $route: route, $props: props } = this;
			const result = router.resolve(props.to, route, props.append);

			return result;
		},
		handleLinkClick(e) {
			const { $router: router, $props: props, getNextRoute } = this;

			this.$emit("click", e);

			if (props.href) {

			}
			else if (props.to && guardLinkEvent(e)) {
				try {
					const route = getNextRoute();
					const fallback = error => {};

					props.replace ? router.replace(route.location).catch(fallback) : router.push(route.location).catch(fallback);
				}
				catch(e) {
					console.error(e);
				}
			}
		}
	}
};