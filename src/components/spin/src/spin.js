const VuiSpin = {
	name: "vui-spin",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-spin"
		},
		fixed: {
			type: Boolean,
			default: false
		},
		fullscreen: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			validator(value) {
				return ["small", "medium", "large"].indexOf(value) > -1;
			}
		},
		message: {
			type: String,
			default: undefined
		},
		animation: {
			type: String,
			default: "vui-spin-fade"
		}
	},

	render(h) {
		let { $vui, $slots, classNamePrefix, fixed, fullscreen, message, animation } = this;

		// 属性 size 优先级：self > $vui
		let size;

		if (this.size) {
			size = this.size;
		}
		else if ($vui && $vui.size) {
			size = $vui.size;
		}
		else {
			size = "medium";
		}

		// classes
		let classes = {};

		classes.root = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-fixed`]: fixed,
			[`${classNamePrefix}-fullscreen`]: fullscreen,
			[`${classNamePrefix}-${size}`]: size
		};
		classes.main = `${classNamePrefix}-main`;
		classes.icon = `${classNamePrefix}-icon`;
		classes.message = `${classNamePrefix}-message`;

		// children
		let children = [];

		if ($slots.default) {
			children = $slots.default;
		}
		else {
			children.push(
				<i class={classes.icon}></i>
			);

			if (message) {
				children.push(
					<div class={classes.message}>{message}</div>
				);
			}
		}

		// render
		return (
			<transition name={animation}>
				<div class={classes.root}>
					<div class={classes.main}>
						{children}
					</div>
				</div>
			</transition>
		);
	}
};

export default VuiSpin;
