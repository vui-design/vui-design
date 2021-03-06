import PropTypes from "vui-design/utils/prop-types";
import guardLinkEvent from "vui-design/utils/guardLinkEvent";

export default {
	props: {
		href: PropTypes.string,
		to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		replace: PropTypes.bool.def(false),
		append: PropTypes.bool.def(false),
		target: PropTypes.string
	},
	methods: {
		getNextRoute() {
			const { $router: router, $route: route, $props: props } = this;
			const result = router.resolve(props.to, route, props.append);

			return result;
		},
		handleLinkClick(e) {
			const { $router: router, $props: props } = this;

			this.$emit("click", e);

			if (props.href) {

			}
			else if (props.to && guardLinkEvent(e)) {
				try {
					const route = this.getNextRoute();
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