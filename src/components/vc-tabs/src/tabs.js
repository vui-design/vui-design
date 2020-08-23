import VuiIcon from "vui-design/components/icon";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VcTabs = {
	name: "vc-steps",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		type: {
			type: String,
			default: "line",
			validator: value => ["line", "card"].indexOf(value) > -1
		},
		size: {
			type: String,
			default: undefined,
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
		},
		activeKey: {
			type: [String, Number],
			default: undefined
		},
		tabpanels: {
			type: Array,
			default: () => []
		},
		extra: {
			type: Array,
			default: undefined
		},
		addable: {
			type: Boolean,
			default: false
		},
		closable: {
			type: Boolean,
			default: false
		},
		editable: {
			type: Boolean,
			default: false
		},
		animated: {
			type: Boolean,
			default: false
		},
		headerStyle: {
			type: [String, Object],
			default: undefined
		},
		bodyStyle: {
			type: [String, Object],
			default: undefined
		}
	},

	data() {
		const { $props: props } = this;
		const state = {
			activeKey: props.activeKey
		};

		return {
			state
		};
	},

	watch: {
		activeKey(value) {
			this.state.activeKey = value;
		}
	},

	methods: {
		handleChange(e, tabpanel) {
			if (tabpanel.disabled) {
				return;
			}

			this.state.activeKey = tabpanel.key;
			this.$emit("input", this.state.activeKey);
			this.$emit("change", this.state.activeKey);
		},
		handleAdd(e) {
			this.$emit("add");
		},
		handleClose(e, tabpanel) {
			if (tabpanel.disabled) {
				return;
			}

			this.$emit("close", tabpanel.key);
			e.stopPropagation();
		}
	},

	render() {
		let { $vui: vui, $props: props, state } = this;

		// size
		let size;

		if (props.size) {
			size = props.size;
		}
		else if (vui && vui.size) {
			size = vui.size;
		}
		else {
			size = "medium";
		}

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "tabs");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.type}`]: true,
			[`${classNamePrefix}-${size}`]: size,
			[`${classNamePrefix}-animated`]: props.animated
		};
		classes.elHeader = `${classNamePrefix}-header`;
		classes.elHeaderContent = `${classNamePrefix}-header-content`;
		classes.elExtra = `${classNamePrefix}-extra`;
		classes.elBtnAdd = `${classNamePrefix}-btn-add`;
		classes.elBody = `${classNamePrefix}-body` ;
		classes.elBodyContent = `${classNamePrefix}-body-content`;

		// style
		let styles = {};
		let x = props.tabpanels.findIndex(tabpanel => tabpanel.key === state.activeKey);

		if (x > -1) {
			x = x === 0 ? `0%` : `-${x * 100}%`;

			styles.elBodyContent = {
				transform: `translateX(${x}) translateZ(0px)`
			};
		}

		// extra
		let extra;

		if (props.extra) {
			extra = (
				<div class={classes.elExtra}>{props.extra}</div>
			);
		}
		else if (props.addable || props.editable) {
			extra = (
				<div class={classes.elExtra}>
					<a href="javascript:;" class={classes.elBtnAdd} onClick={this.handleAdd}></a>
				</div>
			);
		}

		// render
		return (
			<div class={classes.el}>
				<div class={classes.elHeader} style={props.headerStyle}>
					<div class={classes.elHeaderContent}>
						{
							props.tabpanels.map(tabpanel => {
								let tabsTabClasses = {};
								let closable = tabpanel.closable && !tabpanel.disabled;

								tabsTabClasses.el = {
									[`${classNamePrefix}-tab`]: true,
									[`${classNamePrefix}-tab-active`]: tabpanel.key === state.activeKey,
									[`${classNamePrefix}-tab-disabled`]: tabpanel.disabled
								};
								tabsTabClasses.elContent = `${classNamePrefix}-tab-content`;
								tabsTabClasses.elIcon = `${classNamePrefix}-tab-icon`;
								tabsTabClasses.elTitle = `${classNamePrefix}-tab-title`;
								tabsTabClasses.elBtnClose = `${classNamePrefix}-tab-btn-close`;

								return (
									<div class={tabsTabClasses.el} onClick={e => this.handleChange(e, tabpanel)}>
										<div class={tabsTabClasses.elContent}>
											{
												is.string(tabpanel.icon) ? (
													<div class={tabsTabClasses.elIcon}>
														<VuiIcon type={tabpanel.icon} />
													</div>
												) : (
													is.array(tabpanel.icon) ? (
														<div class={tabsTabClasses.elIcon}>
															{tabpanel.icon}
														</div>
													) : null
												)
											}
											<div class={tabsTabClasses.elTitle}>{tabpanel.title}</div>
										</div>
										{
											closable ? (
												<a href="javascript:;" class={tabsTabClasses.elBtnClose} onClick={e => this.handleClose(e, tabpanel)}>
													<svg viewBox="0 0 28 28">
														<path d="M16,14l9.9-11.5C26.1,2.3,26,2,25.7,2h-3c-0.2,0-0.3,0.1-0.5,0.2L14,11.7L5.8,2.2C5.7,2.1,5.5,2,5.3,2h-3C2,2,1.9,2.3,2.1,2.5L12,14L2.1,25.5c-0.1,0.1-0.1,0.3,0,0.4C2.2,26,2.2,26,2.3,26h3c0.2,0,0.3-0.1,0.5-0.2l8.2-9.5l8.2,9.5c0.1,0.1,0.3,0.2,0.5,0.2h3c0.3,0,0.4-0.3,0.2-0.5L16,14z" />
													</svg>
												</a>
											) : null
										}
									</div>
								);
							})
						}
					</div>
					{extra}
				</div>
				<div class={classes.elBody} style={props.bodyStyle}>
					<div class={classes.elBodyContent} style={styles.elBodyContent}>
						{
							props.tabpanels.map(tabpanel => {
								let tabsPanelClasses = {};

								tabsPanelClasses.el = {
									[`${classNamePrefix}-panel`]: true,
									[`${classNamePrefix}-panel-active`]: tabpanel.key === state.activeKey
								};
								tabsPanelClasses.elContent = `${classNamePrefix}-panel-content`;

								return (
									<div class={tabsPanelClasses.el}>
										<div class={tabsPanelClasses.elContent}>{tabpanel.children}</div>
									</div>
								);
							})
						}
					</div>
				</div>
			</div>
		);
	}
};

export default VcTabs;