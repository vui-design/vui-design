import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiCardMeta = {
	name: "vui-card-meta",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
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

	isCardMeta: true,

	render(h) {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix, title, description } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "card-meta");

		return (
			<div class={`${classNamePrefix}`}>
				{
					slots.avatar && (
						<div class={`${classNamePrefix}-avatar`}>
							{slots.avatar}
						</div>
					)
				}
				<div class={`${classNamePrefix}-detail`}>
					<div class={`${classNamePrefix}-title`}>{slots.title || title}</div>
					<div class={`${classNamePrefix}-description`}>{slots.description || description}</div>
				</div>
			</div>
		);
	}
};

export default VuiCardMeta;