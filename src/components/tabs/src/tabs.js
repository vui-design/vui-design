import VuiTabTrigger from "./tab-trigger";
import is from "vui-design/utils/is";

const VuiTabs = {
	name: "vui-tabs",

	provide() {
		return {
			vuiTabs: this
		};
	},

	components: {
		VuiTabTrigger
	},

	model: {
		prop: "value",
		event: "input"
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-tabs"
		},
		type: {
			type: String,
			default: "line",
			validator(value) {
				return ["line", "card"].indexOf(value) > -1;
			}
		},
		value: {
			type: [String, Number],
			default: undefined
		},
		size: {
			type: String,
			default: undefined,
			validator(value) {
				return ["small", "medium", "large"].indexOf(value) > -1;
			}
		},
		headerStyle: {
			type: [String, Object],
			default: undefined
		},
		bodyStyle: {
			type: [String, Object],
			default: undefined
		},
		addable: {
			type: Boolean,
			default: false
		},
		closable: {
			type: Boolean,
			default: false
		},
		editable: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			list: [],
			currentValue: this.value
		};
	},

	watch: {
		value(value) {
			this.currentValue = value;
		}
	},

	methods: {
		update() {
			let { $children: children, closable, editable } = this;
			let list = [];

			children.forEach(child => {
				if (child.$options.name !== "vui-tab-panel") {
					return;
				}

				let item = {
					name: child.name,
					icon: child.icon,
					title: child.$slots.title || child.title,
					closable: (closable || editable) && child.closable !== false,
					disabled: child.disabled
				};

				list.push(item);
			});

			let currentValue = this.currentValue;
			let item = list[0];

			if (!currentValue && item) {
				currentValue = item.name;
			}

			this.list = list;
			this.currentValue = currentValue;
		},

		handleChange(e, name) {
			this.currentValue = name;

			this.$emit("input", name);
			this.$emit("change", name);
		},
		handleAdd(e) {
			this.$emit("add");
		},
		handleClose(e, name) {
			this.$emit("close", name);
			e.stopPropagation();
		},

		drawTabsHeader(h) {
			let { $slots: slots, classNamePrefix, headerStyle, addable, closable, editable, list, currentValue } = this;
			let { handleChange, handleAdd, handleClose } = this;

			let classes = {};

			classes.header = `${classNamePrefix}-header`;
			classes.headerContent = `${classNamePrefix}-header-content`;
			classes.extra = `${classNamePrefix}-extra`;
			classes.btnAdd = `${classNamePrefix}-btn-add`;

			let children = [];

			children.push(
				<div class={classes.headerContent}>
					{
						list.map(item => {
							return (
								<VuiTabTrigger
									key={item.name}
									name={item.name}
									icon={item.icon}
									closable={item.closable}
									active={item.name === currentValue}
									disabled={item.disabled}
									onClick={handleChange}
									onClose={handleClose}
								>
									{
										is.function(item.title) ? item.title(h, item) : item.title
									}
								</VuiTabTrigger>
							);
						})
					}
				</div>
			);

			if (slots.extra) {
				children.push(
					<div class={classes.extra}>
						{slots.extra}
					</div>
				);
			}
			else if (addable || editable) {
				children.push(
					<div class={classes.extra}>
						<a href="javascript:;" class={classes.btnAdd} onClick={handleAdd}>
							<svg viewBox="0 0 28 28">
								<path d="M27,12.5v3H15.5V27h-3V15.5H1v-3h11.5V1h3v11.5H27z" />
							</svg>
						</a>
					</div>
				);
			}

			return (
				<div class={classes.header} style={headerStyle}>
					{children}
				</div>
			);
		},

		drawTabsBody(h) {
			let { $slots: slots, classNamePrefix, bodyStyle, animated, list, currentValue } = this;

			let classes = {};

			classes.body = `${classNamePrefix}-body`;
			classes.bodyContent = `${classNamePrefix}-body-content`;

			let styles = {};
			let x = list.findIndex(item => item.name === currentValue);

			if (x > -1) {
				x = x === 0 ? `0%` : `-${x * 100}%`;

				styles.bodyContent = {
					transform: `translateX(${x}) translateZ(0px)`
				};
			}

			return (
				<div class={classes.body} style={bodyStyle}>
					<div class={classes.bodyContent} style={styles.bodyContent}>
						{slots.default}
					</div>
				</div>
			);
		}
	},

	render(h) {
		let { $vui, classNamePrefix, type, drawTabsHeader, drawTabsBody } = this;
		let size;
		let classes;

		if (this.size) {
			size = this.size;
		}
		else if ($vui && $vui.size) {
			size = $vui.size;
		}
		else {
			size = "medium";
		}

		classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${type}`]: true,
			[`${classNamePrefix}-${size}`]: size
		};

		return (
			<div class={classes}>
				{drawTabsHeader(h)}
				{drawTabsBody(h)}
			</div>
		);
	}
};

export default VuiTabs;