const VuiCardMeta = {
	name: "vui-card-meta",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-card-meta"
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
		let children = [];

		if ($slots.avatar) {
			children.push(
				<div class={`${classNamePrefix}-avatar`}>
					{$slots.avatar}
				</div>
			);
		}

		children.push(
			<div class={`${classNamePrefix}-detail`}>
				<div class={`${classNamePrefix}-title`}>{$slots.title || title}</div>
				<div class={`${classNamePrefix}-description`}>{$slots.description || description}</div>
			</div>
		);

		return (
			<div class={`${classNamePrefix}`}>
				{children}
			</div>
		);
	}
};

export default VuiCardMeta;