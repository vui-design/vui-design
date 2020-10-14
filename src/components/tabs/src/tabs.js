import VcTabs from "vui-design/components/vc-tabs";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";

const VuiTabs = {
	name: "vui-tabs",
	components: {
		VcTabs
	},
	model: {
		prop: "activeKey",
		event: "input"
	},
	props: {
		classNamePrefix: PropTypes.string,
		type: PropTypes.oneOf(["line", "card"]).def("line"),
		size: PropTypes.oneOf(["small", "medium", "large"]),
		activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		addable: PropTypes.bool.def(false),
		closable: PropTypes.bool.def(false),
		editable: PropTypes.bool.def(false),
		animated: PropTypes.bool.def(true),
		headerStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		bodyStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	},
	methods: {
		getDerivedTabpanels(tabsProps, nodes, tagName = "vui-tab-panel") {
			let tabpanels = [];

			if (!nodes) {
				return tabpanels;
			}

			nodes.forEach(node => {
				if (!node) {
					return;
				}

				const options = node.componentOptions;

				if (!options) {
					return;
				}

				const { tag, propsData: props, children: elements } = options;

				if (tag === tagName && is.json(props)) {
					let tabpanel = {
						...props,
						index: tabpanels.length
					};

					// 设置 panel 的唯一 key 值
					const key = node.key;

					if (is.effective(key)) {
						tabpanel.key = key;
					}
					else {
						tabpanel.key = tabpanel.index;
					}

					// 设置 panel 的关闭属性，只有显示的定义为 false，才禁止关闭，默认继承于 tabs 的 closable 或 editable 属性
					const closable = props.closable;

					if (closable === false) {
						tabpanel.closable = false;
					}
					else {
						tabpanel.closable = tabsProps.closable || tabsProps.editable;
					}

					// 设置 panel 的禁用属性
					const disabled = props.disabled;

					if (disabled === undefined || disabled === null || disabled === false) {
						tabpanel.disabled = false;
					}
					else {
						tabpanel.disabled = true;
					}

					// 分离 panel 的内容元素，因为内容可能包含了图标或标题等自定义插槽
					if (elements) {
						elements.forEach(element => {
							if (!element) {
								return;
							}

							if (element.data && element.data.slot) {
								const slot = element.data.slot;

								// icon
								if (slot === "icon") {
									if (element.data.attrs) {
										delete element.data.attrs.slot;
									}

									if (element.tag === "template") {
										if (is.array(tabpanel.icon)) {
											tabpanel.icon.push.apply(tabpanel.icon, element.children);
										}
										else {
											tabpanel.icon = element.children;
										}
									}
									else {
										if (is.array(tabpanel.icon)) {
											tabpanel.icon.push(element);
										}
										else {
											tabpanel.icon = [element];
										}
									}
								}
								else if (slot === "title") {
									if (element.data.attrs) {
										delete element.data.attrs.slot;
									}

									if (element.tag === "template") {
										if (is.array(tabpanel.title)) {
											tabpanel.title.push.apply(tabpanel.icon, element.children);
										}
										else {
											tabpanel.title = element.children;
										}
									}
									else {
										if (is.array(tabpanel.title)) {
											tabpanel.title.push(element);
										}
										else {
											tabpanel.title = [element];
										}
									}
								}
							}
							else {
								if (is.array(tabpanel.children)) {
									tabpanel.children.push(element);
								}
								else {
									tabpanel.children = [element];
								}
							}
						});
					}

					tabpanels.push(tabpanel);
				}
			});

			return tabpanels;
		}
	},
	render(h) {
		const { $slots: slots, $props: props, $listeners: listeners } = this;

		let activeKey = props.activeKey;
		const tabpanels = this.getDerivedTabpanels(props, slots.default);

		if (!is.effective(activeKey)) {
			const enabledTabpanels = tabpanels.filter(tabpanel => !tabpanel.disabled);
			const tabpanel = enabledTabpanels[0];

			if (tabpanel) {
				activeKey = tabpanel.key;
			}
		}

		const attributes = {
			props: {
				...props,
				activeKey,
				tabpanels,
				extra: slots.extra
			},
			on: {
				...listeners
			}
		};

		return (
			<VcTabs {...attributes} />
		);
	}
};

export default VuiTabs;