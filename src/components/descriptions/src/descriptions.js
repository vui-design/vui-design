import VcDescriptions from "vui-design/components/vc-descriptions";

const VuiDescriptions = {
	name: "vui-descriptions",

	components: {
		VcDescriptions
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		layout: {
			type: String,
			default: "horizontal",
			validator: value => ["horizontal", "vertical"].indexOf(value) > -1
		},
		bordered: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: "medium",
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
		},
		title: {
			type: String,
			default: undefined
		},
		extra: {
			type: String,
			default: undefined
		},
		columns: {
			type: Number,
			default: 3
		},
		colon: {
			type: Boolean,
			default: undefined
		},
		labelWidth: {
			type: [String, Number],
			default: undefined
		},
		labelAlign: {
			type: String,
			default: undefined,
			validator: value => ["left", "center", "right"].indexOf(value) > -1
		}
	},

	methods: {
		getDerivedDataFromChildren(children) {
			let data = [];

			if (!children) {
				return data;
			}

			children.forEach(element => {
				if (!element) {
					return;
				}

				let options = element.componentOptions;

				if (options && options.propsData && options.tag === "vui-description") {
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
		let { $slots: slots, $props: props, getDerivedDataFromChildren } = this;
		let attributes = {
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