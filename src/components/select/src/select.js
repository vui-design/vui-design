import VcSelect from "vui-design/components/vc-select";

const VuiSelect = {
	name: "vui-select",

	components: {
		VcSelect
	},

	model: {
		prop: "value",
		event: "input"
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		size: {
			type: String,
			default: undefined,
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
		},
		placeholder: {
			type: [String, Number],
			default: undefined
		},
		value: {
			type: [String, Number, Array],
			default: undefined
		},
		backfillOptionProp: {
			type: String,
			default: "children"
		},
		multiple: {
			type: Boolean,
			default: false
		},
		maxTagCount: {
			type: Number,
			default: 0
		},
		maxTagPlaceholder: {
			type: Function,
			default: count => `+${count}`
		},
		allowCreate: {
			type: Boolean,
			default: false
		},
		searchable: {
			type: Boolean,
			default: false
		},
		filter: {
			type: [Boolean, Function],
			default: true
		},
		filterOptionProp: {
			type: String,
			default: "children"
		},
		loading: {
			type: Boolean,
			default: false
		},
		loadingText: {
			type: String,
			default: undefined
		},
		notFoundText: {
			type: String,
			default: undefined
		},
		autoClearKeyword: {
			type: Boolean,
			default: true
		},
		clearable: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		placement: {
			type: String,
			default: "bottom-start",
			validator: value => ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"].indexOf(value) > -1
		},
		animation: {
			type: String,
			default: "vui-select-dropdown-scale"
		},
		getPopupContainer: {
			type: Function,
			default: () => document.body
		}
	},

	methods: {
		focus() {
			this.$refs.select.focus();
		},
		blur() {
			this.$refs.select.blur();
		},

		getOptionsFromChildren(children, disabledFromParent) {
			let options = [];

			if (!children) {
				return options;
			}

			children.forEach(vNode => {
				if (!vNode) {
					return;
				}

				const component = vNode.componentOptions;

				if (!component || !component.Ctor || !component.Ctor.options || !component.propsData) {
					return;
				}

				if (component.Ctor.options.isOptionGroup) {
					let data = {
						...component.propsData
					};
					let disabled = disabledFromParent || data.disabled;

					if (disabled === undefined || disabled === null || disabled === false) {
						data.disabled = false;
					}
					else {
						data.disabled = true;
					}

					options.push({
						isOptionGroup: true,
						children: this.getOptionsFromChildren(component.children, data.disabled),
						...data
					});
				}
				else if (component.Ctor.options.isOption) {
					let data = {
						...component.propsData,
					};
					let disabled = disabledFromParent || data.disabled;

					if (disabled === undefined || disabled === null || disabled === false) {
						data.disabled = false;
					}
					else {
						data.disabled = true;
					}

					options.push({
						isOption: true,
						children: component.children,
						...data
					});
				}
			});

			return options;
		}
	},

	render() {
		const attrs = {
			ref: "select",
			props: {
				...this.$props,
				options: this.getOptionsFromChildren(this.$slots.default)
			},
			on: this.$listeners
		};

		return <VcSelect {...attrs}></VcSelect>;
	}
};

export default VuiSelect;