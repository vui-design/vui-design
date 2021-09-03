import VuiRow from "../../row";
import VuiCol from "../../col";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiList = {
	name: "vui-list",

	provide() {
		return {
			vuiList: this
		};
	},

	components: {
		VuiRow,
		VuiCol
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		header: {
			type: String,
			default: undefined
		},
		footer: {
			type: String,
			default: undefined
		},
		layout: {
			type: String,
			default: "horizontal",
			validator: value => ["horizontal", "vertical"].indexOf(value) > -1
		},
		size: {
			type: String,
			default: "medium",
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
		},
		bordered: {
			type: Boolean,
			default: false
		},
		split: {
			type: Boolean,
			default: true
		},
		grid: {
			type: Object,
			default: undefined,
			validator: value => {
				if ("columns" in value) {
					return [1, 2, 3, 4, 6, 8, 12, 24].indexOf(value.columns) > -1;
				}
			}
		},
		data: {
			type: Array,
			default: undefined
		}
	},

	render(h) {
		let { $slots: slots, $scopedSlots: scopedSlots, $props: props } = this;

		// classes
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "list");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.layout}`]: props.layout,
			[`${classNamePrefix}-${props.size}`]: props.size,
			[`${classNamePrefix}-bordered`]: props.bordered && !props.grid,
			[`${classNamePrefix}-split`]: props.split,
			[`${classNamePrefix}-grid`]: props.grid
		};
		classes.elHeader = `${classNamePrefix}-header`;
		classes.elBody = `${classNamePrefix}-body`;
		classes.elMore = `${classNamePrefix}-more`;
		classes.elFooter = `${classNamePrefix}-footer`;

		// render
		let children = [];

		if (slots.header || props.header) {
			children.push(
				<div class={classes.elHeader}>
					{slots.header || props.header}
				</div>
			);
		}

		if (props.grid && props.data && props.data.length) {
			let gutter = props.grid.gutter || 16;
			let columns = props.grid.columns || 4;
			let cols = [];
			let span = Math.round(24 / columns);

			props.data.forEach((item, index) => {
				let scopedSlot = scopedSlots.item;
				let content = scopedSlot && scopedSlot(item, index);
				let style = {
					marginTop: index < columns ? `0px` : `${gutter}px`
				};

				cols.push(
					<VuiCol span={span} style={style}>{content}</VuiCol>
				);
			});

			children.push(
				<div class={classes.elBody}>
					<VuiRow gutter={gutter}>
						{cols}
					</VuiRow>
				</div>
			);
		}
		else {
			children.push(
				<div class={classes.elBody}>
					{slots.default}
					{
						slots.more && (
							<div class={classes.elMore}>{slots.more}</div>
						)
					}
				</div>
			);
		}

		if (slots.footer || props.footer) {
			children.push(
				<div class={classes.elFooter}>
					{slots.footer || props.footer}
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

export default VuiList;