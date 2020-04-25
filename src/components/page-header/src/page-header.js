import VuiAvatar from "vui-design/components/avatar";
import VuiBreadcrumb from "vui-design/components/breadcrumb";
import VuiBreadcrumbItem from "vui-design/components/breadcrumb";
import VuiIcon from "vui-design/components/icon";
import VuiTag from "vui-design/components/tag";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiPageHeader = {
	name: "vui-page-header",

	components: {
		VuiAvatar,
		VuiBreadcrumb,
		VuiBreadcrumbItem,
		VuiIcon,
		VuiTag
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		breadcrumb: {
			type: Array,
			default: undefined
		},
		backIcon: {
			type: String,
			default: undefined
		},
		avatar: {
			type: String,
			default: undefined
		},
		title: {
			type: String,
			default: undefined
		},
		subTitle: {
			type: String,
			default: undefined
		},
		tags: {
			type: Array,
			default: undefined
		},
		ghost: {
			type: Boolean,
			default: true
		}
	},

	methods: {
		handleBack(e) {
			this.$emit("back", e);
		}
	},

	render() {
		let { $slots: slots, $listeners: listeners, classNamePrefix: customizedClassNamePrefix, ghost } = this;
		let { handleBack } = this;

		// class
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "page-header");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-with-footer`]: slots.footer,
			[`${classNamePrefix}-ghost`]: ghost
		};
		classes.elBreadcrumb = `${classNamePrefix}-breadcrumb`;
		classes.elHeader = `${classNamePrefix}-header`;
		classes.elBack = `${classNamePrefix}-back`;
		classes.elAvatar = `${classNamePrefix}-avatar`;
		classes.elTitle = `${classNamePrefix}-title`;
		classes.elSubTitle = `${classNamePrefix}-sub-title`;
		classes.elTags = `${classNamePrefix}-tags`;
		classes.elExtra = `${classNamePrefix}-extra`;
		classes.elBody = `${classNamePrefix}-body`;
		classes.elFooter = `${classNamePrefix}-footer`;

		// breadcrumb
		let breadcrumb;

		if (slots.breadcrumb) {
			breadcrumb = slots.breadcrumb;
		}
		else if (this.breadcrumb) {
			breadcrumb = (
				<VuiBreadcrumb>
					{
						this.breadcrumb.map((item, index) => {
							return (
								<VuiBreadcrumbItem key={index} href={item.href} to={item.to} replace={item.replace} append={item.append} target={item.target}>
									{item.title}
								</VuiBreadcrumbItem>
							);
						})
					}
				</VuiBreadcrumb>
			);
		}

		// backIcon
		let showBackIcon = !!listeners.back;
		let backIcon;

		if (showBackIcon) {
			if (slots.backIcon) {
				backIcon = slots.backIcon;
			}
			else if (this.backIcon) {
				backIcon = (
					<VuiIcon type={this.backIcon} />
				);
			}
			else {
				backIcon = (
					<VuiIcon type="arrow-left" />
				);
			}
		}

		// avatar
		let avatar;

		if (slots.avatar) {
			avatar = slots.avatar;
		}
		else if (this.avatar) {
			avatar = (
				<VuiAvatar src={this.avatar} />
			);
		}

		// title
		let title = slots.title || this.title;

		// subTitle
		let subTitle = slots.subTitle || this.subTitle;

		// tags
		let tags;

		if (slots.tags) {
			tags = slots.tags;
		}
		else if (this.tags) {
			tags = this.tags.map((item, index) => {
				return (
					<VuiTag key={index} color={item.color}>{item.title}</VuiTag>
				);
			});
		}

		// render
		return (
			<div class={classes.el}>
				{
					breadcrumb && (
						<div class={classes.elBreadcrumb}>
							{breadcrumb}
						</div>
					)
				}
				<div class={classes.elHeader}>
					{
						backIcon && (
							<div class={classes.elBack} onClick={handleBack}>
								{backIcon}
							</div>
						)
					}
					{
						avatar && (
							<div class={classes.elAvatar}>
								{avatar}
							</div>
						)
					}
					<div class={classes.elTitle}>
						{title}
					</div>
					{
						subTitle && (
							<div class={classes.elSubTitle}>
								{subTitle}
							</div>
						)
					}
					{
						tags && (
							<div class={classes.elTags}>
								{tags}
							</div>
						)
					}
					{
						slots.extra && (
							<div class={classes.elExtra}>
								{slots.extra}
							</div>
						)
					}
				</div>
				{
					slots.default && (
						<div class={classes.elBody}>
							{slots.default}
						</div>
					)
				}
				{
					slots.footer && (
						<div class={classes.elFooter}>
							{slots.footer}
						</div>
					)
				}
			</div>
		);
	}
};

export default VuiPageHeader;