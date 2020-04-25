import VuiIcon from "vui-design/components/icon";
import VuiRow from "vui-design/components/row";
import VuiCol from "vui-design/components/col";
import VuiDivider from "vui-design/components/divider";
import is from "vui-design/utils/is";

const VuiCard = {
	name: "vui-card",

	components: {
		VuiIcon,
		VuiRow,
		VuiCol,
		VuiDivider
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-card"
		},
		icon: {
			type: String,
			default: undefined
		},
		title: {
			type: String,
			default: undefined
		},
		extra: {
			type: String,
			default: undefined
		},
		bordered: {
			type: Boolean,
			default: true
		},
		padding: {
			type: [String, Number],
			default: 20
		},
		shadow: {
			type: String,
			default: "never",
			validator: value => ["never", "always", "hover"].indexOf(value) > -1
		},
		loading: {
			type: Boolean,
			default: false
		}
	},

	render(h) {
		let { $slots, classNamePrefix, bordered, padding, shadow, loading } = this;

		// icon
		let icon;

		if ($slots.icon) {
			icon = $slots.icon;
		}
		else if (this.icon) {
			icon = (
				<VuiIcon type={this.icon} />
			);
		}

		// title
		let title = $slots.title || this.title;

		// extra
		let extra = $slots.extra || this.extra;

		// classes
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-bordered`]: bordered,
			[`${classNamePrefix}-shadow-${shadow}`]: shadow
		};

		// styles
		let styles = {};

		if (padding) {
			styles.body = {
				padding: `${padding}px`
			};
		}

		// children
		let children = [];

		if (icon || title || extra) {
			children.push(
				<div class={`${classNamePrefix}-header`}>
					{icon && <div class={`${classNamePrefix}-icon`}>{icon}</div>}
					{title && <div class={`${classNamePrefix}-title`}>{title}</div>}
					{extra && <div class={`${classNamePrefix}-extra`}>{extra}</div>}
				</div>
			);
		}

		if ($slots.cover) {
			children.push(
				<div class={`${classNamePrefix}-cover`}>
					{$slots.cover}
				</div>
			);
		}

		if (loading) {
			if ($slots.loading) {
				children.push(
					<div class={`${classNamePrefix}-body`} style={styles.body}>
						{$slots.loading}
					</div>
				);
			}
			else {
				children.push(
					<div class={`${classNamePrefix}-body`} style={styles.body}>
						<div class={`${classNamePrefix}-loading`}>
							<VuiRow gutter={8}>
								<VuiCol span={20}>
									<div class={`${classNamePrefix}-loading-block`}></div>
								</VuiCol>
							</VuiRow>
							<VuiRow gutter={8}>
								<VuiCol span={8}>
									<div class={`${classNamePrefix}-loading-block`}></div>
								</VuiCol>
								<VuiCol span={16}>
									<div class={`${classNamePrefix}-loading-block`}></div>
								</VuiCol>
							</VuiRow>
							<VuiRow gutter={8}>
								<VuiCol span={4}>
									<div class={`${classNamePrefix}-loading-block`}></div>
								</VuiCol>
								<VuiCol span={18}>
									<div class={`${classNamePrefix}-loading-block`}></div>
								</VuiCol>
							</VuiRow>
							<VuiRow gutter={8}>
								<VuiCol span={12}>
									<div class={`${classNamePrefix}-loading-block`}></div>
								</VuiCol>
								<VuiCol span={8}>
									<div class={`${classNamePrefix}-loading-block`}></div>
								</VuiCol>
							</VuiRow>
							<VuiRow gutter={8}>
								<VuiCol span={8}>
									<div class={`${classNamePrefix}-loading-block`}></div>
								</VuiCol>
								<VuiCol span={8}>
									<div class={`${classNamePrefix}-loading-block`}></div>
								</VuiCol>
								<VuiCol span={8}>
									<div class={`${classNamePrefix}-loading-block`}></div>
								</VuiCol>
							</VuiRow>
						</div>
					</div>
				);
			}
		}
		else {
			children.push(
				<div class={`${classNamePrefix}-body`} style={styles.body}>
					{$slots.default}
				</div>
			);
		}

		if ($slots.actions) {
			let actions = [];

			$slots.actions.forEach((action, index) => {
				if (index > 0) {
					actions.push(
						<VuiDivider type="vertical" margin="0" />
					);
				}

				actions.push(
					<div class={`${classNamePrefix}-action`}>{action}</div>
				);
			});

			children.push(
				<div class={`${classNamePrefix}-footer`}>
					{actions}
				</div>
			);
		}

		// render
		return (
			<div class={classes.el}>
				{children}
			</div>
		);
	}
};

export default VuiCard;