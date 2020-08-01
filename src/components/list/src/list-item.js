import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import getValidElements from "vui-design/utils/getValidElements";

const VuiListItem = {
	name: "vui-list-item",

	inject: {
		vuiList: {
			default: undefined
		}
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		}
	},

	render(h) {
		let { vuiList, $slots: slots, $props: props } = this;
		let { $props: vuiListProps } = vuiList;

		// classes
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "list-item");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true
		};
		classes.elMain = `${classNamePrefix}-main`;
		classes.elActions = `${classNamePrefix}-actions`;
		classes.elAction = `${classNamePrefix}-action`;
		classes.elActionDivider = `${classNamePrefix}-action-divider`;
		classes.elExtra = `${classNamePrefix}-extra`;

		// actions
		let actions = [];
		let filteredActionList = getValidElements(slots.actions);

		filteredActionList.forEach((action, index) => {
			if (index > 0) {
				actions.push(
					<li class={classes.elActionDivider}></li>
				);
			}

			actions.push(
				<li class={classes.elAction}>{action}</li>
			);
		});

		// render
		let children = [];

		if (vuiListProps.layout === "vertical") {
			children.push(
				<div class={classes.elMain}>
					{slots.default}
					{
						actions.length > 0 && (
							<ul class={classes.elActions}>
								{actions}
							</ul>
						)
					}
				</div>
			);
		}
		else {
			children.push(slots.default);

			if (actions.length > 0) {
				children.push(
					<ul class={classes.elActions}>
						{actions}
					</ul>
				);
			}
		}

		if (slots.extra) {
			children.push(
				<div class={classes.elExtra}>
					{slots.extra}
				</div>
			);
		}

		return (
			<div class={classes.el}>
				{children}
			</div>
		);
	}
};

export default VuiListItem;