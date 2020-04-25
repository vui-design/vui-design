const VuiBreadcrumb = {
	name: "vui-breadcrumb",

	provide() {
		return {
			vuiBreadcrumb: this
		};
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-breadcrumb"
		},
		separator: {
			type: String,
			default: "/"
		}
	},

	render() {
		let { $slots, classNamePrefix } = this;
		let classes = {
			[`${classNamePrefix}`]: true
		};

		return (
			<div class={classes}>
				{$slots.default}
			</div>
		);
	}
};

export default VuiBreadcrumb;