import VcDescriptions from "vui-design/components/vc-descriptions";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";

const VuiDescriptions = {
	name: "vui-descriptions",
	components: {
		VcDescriptions
	},
	props: {
		classNamePrefix: PropTypes.string,
		layout: PropTypes.oneOf(["horizontal", "vertical"]).def("horizontal"),
		bordered: PropTypes.bool.def(false),
		fixed: PropTypes.bool.def(false),
		size: PropTypes.oneOf(["small", "medium", "large"]).def("medium"),
		columns: PropTypes.number.def(3),
		colon: PropTypes.bool,
		labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		labelAlign: PropTypes.oneOf(["left", "center", "right"]),
		title: PropTypes.any,
		extra: PropTypes.any
	},
	methods: {
		getDerivedDataFromChildren(children, tagName = "vui-description") {
			let data = [];

			if (!children) {
				return data;
			}

			children.forEach(element => {
				if (!element) {
					return;
				}

				const options = element.componentOptions;

				if (!options) {
					return;
				}

				if (options && options.propsData && options.tag === tagName) {
					data.push({
						...options.propsData,
						children: options.children
					});
				}
			});

			return data;
		}
	},
	render() {
		const { $slots: slots, $props: props, getDerivedDataFromChildren } = this;
		const attributes = {
			props: {
				...props,
				title: slots.title || props.title,
				extra: slots.extra || props.extra,
				data: getDerivedDataFromChildren(slots.default)
			}
		};

		return (
			<VcDescriptions {...attributes} />
		);
	}
};

export default VuiDescriptions;