const VuiIcon = {
	name: "VuiIcon",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-icon"
		},
		type: {
			type: String,
			default: undefined
		},
		color: {
			type: String,
			default: undefined
		},
		size: {
			type: [Number, String],
			default: undefined
		}
	},

	render(h) {
		let { $listeners, classNamePrefix, type, color, size } = this;

		// classes
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${type}`]: type
		};

		// styles
		let styles = {};

		if (color) {
			styles.color = color;
		}

		if (size) {
			styles.fontSize = `${size}px`;
		}

		// props
		let props = {
			class: classes,
			style: styles,
			on: {
				...$listeners
			}
		};

		return (
			<i {...props}></i>
		);
	}
};

export default VuiIcon;