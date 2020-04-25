const VuiCellGroup = {
	name: "vui-cell-group",

	provide() {
		return {
			vuiCellGroup: this
		};
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-cell-group"
		},
		title: {
			type: String,
			default: undefined
		},
		description: {
			type: String,
			default: undefined
		}
	},

	render(h) {
		let { $slots, classNamePrefix, title, description } = this;
		let classes = {};
		let children = [];

		classes.el = `${classNamePrefix}`;
		classes.title = `${classNamePrefix}-title`;
		classes.description = `${classNamePrefix}-description`;

		if (title) {
			children.push(
				<div class={classes.title}>{title}</div>
			);
		}

		children.push($slots.default);

		if (description) {
			children.push(
				<div class={classes.description}>{description}</div>
			);
		}

		return (
			<div class={classes.el}>{children}</div>
		);
	}
};

export default VuiCellGroup;