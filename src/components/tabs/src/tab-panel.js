import guid from "vui-design/utils/guid";

const VuiTabPanel = {
	name: "vui-tab-panel",

	inject: {
		vuiTabs: {
			default: undefined
		}
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-tab-panel"
		},
		name: {
			type: [String, Number],
			default() {
				return guid();
			}
		},
		icon: {
			type: String,
			default: undefined
		},
		title: {
			type: [String, Number, Function],
			default: undefined
		},
		closable: {
			type: Boolean,
			default: undefined
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	watch: {
		name() {
			this.vuiTabs.update();
		},
		icon() {
			this.vuiTabs.update();
		},
		title() {
			this.vuiTabs.update();
		},
		closable() {
			this.vuiTabs.update();
		},
		disabled() {
			this.vuiTabs.update();
		}
	},

	mounted() {
		this.vuiTabs.update();
	},

	destroyed() {
		this.vuiTabs.update();
	},

	render() {
		let { vuiTabs, $slots, classNamePrefix, name } = this;
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-active`]: name === vuiTabs.currentValue
		};
		classes.elContent = `${classNamePrefix}-content`;

		return (
			<div class={classes.el}>
				<div class={classes.elContent}>{$slots.default}</div>
			</div>
		);
	}
};

export default VuiTabPanel;