import VuiIcon from "vui-design/components/icon";
import VuiRow from "vui-design/components/row";
import VuiCol from "vui-design/components/col";
import VuiDivider from "vui-design/components/divider";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import getElementWithoutBlankspace from "vui-design/utils/getElementWithoutBlankspace";

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
			default: undefined
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
		cover: {
			type: String,
			default: undefined
		},
		bordered: {
			type: Boolean,
			default: true
		},
		shadow: {
			type: String,
			default: "never",
			validator: value => ["never", "always", "hover"].indexOf(value) > -1
		},
		headerStyle: {
			type: [String, Object],
			default: undefined
		},
		bodyStyle: {
			type: [String, Object],
			default: undefined
		},
		footerStyle: {
			type: [String, Object],
			default: undefined
		},
		loading: {
			type: Boolean,
			default: false
		}
	},

	methods: {
		hasCardGrids(children = []) {
			let bool = false;

			children.forEach(vNode => {
				if (!vNode) {
					return;
				}

				const component = vNode.componentOptions;

				if (!component || !component.Ctor || !component.Ctor.options) {
					return;
				}

				if (component.Ctor.options.isCardGrid) {
					bool = true;
				}
			});

			return bool;
		}
	},

	render(h) {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix, bordered, shadow, headerStyle, bodyStyle, footerStyle, loading } = this;
		let hasCardGrids = this.hasCardGrids(slots.default);

		// icon
		let icon;

		if (slots.icon) {
			icon = slots.icon;
		}
		else if (this.icon) {
			icon = (
				<VuiIcon type={this.icon} />
			);
		}

		// title
		let title = slots.title || this.title;

		// extra
		let extra = slots.extra || this.extra;

		// cover
		let cover;

		if (slots.cover) {
			cover = slots.cover;
		}
		else if (this.cover) {
			cover = (
				<img src={this.cover} />
			);
		}

		// class
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "card");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-bordered`]: bordered,
			[`${classNamePrefix}-shadow-${shadow}`]: shadow,
			[`${classNamePrefix}-with-grid`]: hasCardGrids
		};
		classes.elHeader = `${classNamePrefix}-header`;
		classes.elIcon = `${classNamePrefix}-icon`;
		classes.elTitle = `${classNamePrefix}-title`;
		classes.elExtra = `${classNamePrefix}-extra`;
		classes.elCover = `${classNamePrefix}-cover`;
		classes.elBody = `${classNamePrefix}-body`;
		classes.elLoading = `${classNamePrefix}-loading`;
		classes.elLoadingBlock = `${classNamePrefix}-loading-block`;
		classes.elActions = `${classNamePrefix}-actions`;
		classes.elAction = `${classNamePrefix}-action`;
		classes.elFooter = `${classNamePrefix}-footer`;

		// render
		let children = [];

		if (icon || title || extra) {
			children.push(
				<div class={classes.elHeader} style={headerStyle}>
					{
						icon && (
							<div class={classes.elIcon}>{icon}</div>
						)
					}
					{
						title && (
							<div class={classes.elTitle}>{title}</div>
						)
					}
					{
						extra && (
							<div class={classes.elExtra}>{extra}</div>
						)
					}
				</div>
			);
		}

		if (cover) {
			children.push(
				<div class={classes.elCover}>{cover}</div>
			);
		}

		if (loading) {
			if (slots.loading) {
				children.push(
					<div class={classes.elBody} style={bodyStyle}>{slots.loading}</div>
				);
			}
			else {
				children.push(
					<div class={classes.elBody} style={bodyStyle}>
						<div class={classes.elLoading}>
							<VuiRow gutter={8}>
								<VuiCol span={20}>
									<div class={classes.elLoadingBlock}></div>
								</VuiCol>
							</VuiRow>
							<VuiRow gutter={8}>
								<VuiCol span={8}>
									<div class={classes.elLoadingBlock}></div>
								</VuiCol>
								<VuiCol span={16}>
									<div class={classes.elLoadingBlock}></div>
								</VuiCol>
							</VuiRow>
							<VuiRow gutter={8}>
								<VuiCol span={4}>
									<div class={classes.elLoadingBlock}></div>
								</VuiCol>
								<VuiCol span={18}>
									<div class={classes.elLoadingBlock}></div>
								</VuiCol>
							</VuiRow>
							<VuiRow gutter={8}>
								<VuiCol span={12}>
									<div class={classes.elLoadingBlock}></div>
								</VuiCol>
								<VuiCol span={8}>
									<div class={classes.elLoadingBlock}></div>
								</VuiCol>
							</VuiRow>
							<VuiRow gutter={8}>
								<VuiCol span={8}>
									<div class={classes.elLoadingBlock}></div>
								</VuiCol>
								<VuiCol span={8}>
									<div class={classes.elLoadingBlock}></div>
								</VuiCol>
								<VuiCol span={8}>
									<div class={classes.elLoadingBlock}></div>
								</VuiCol>
							</VuiRow>
						</div>
					</div>
				);
			}
		}
		else {
			children.push(
				<div class={classes.elBody} style={bodyStyle}>{slots.default}</div>
			);
		}

		if (slots.actions) {
			let actions = [];
			let filteredActionList = getElementWithoutBlankspace(slots.actions);

			filteredActionList.forEach((action, index) => {
				if (index > 0) {
					actions.push(
						<VuiDivider type="vertical" margin={0} />
					);
				}

				actions.push(
					<div class={classes.elAction}>{action}</div>
				);
			});

			children.push(
				<div class={classes.elActions}>{actions}</div>
			);
		}

		if (slots.footer) {
			children.push(
				<div class={classes.elFooter} style={footerStyle}>{slots.footer}</div>
			);
		}

		return (
			<div class={classes.el}>{children}</div>
		);
	}
};

export default VuiCard;