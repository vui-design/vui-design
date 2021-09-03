import VuiCheckbox from "../../checkbox";
import VuiIcon from "../../icon";
import is from "../../../utils/is";
import clone from "../../../utils/clone";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiTreeNode = {
	name: "vui-tree-node",

	inject: {
		vuiTree: {
			default: undefined
		}
	},

	components: {
		VuiCheckbox,
		VuiIcon
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		data: {
			type: Object,
			default: () => ({})
		},
		level: {
			type: Number,
			default: 1
		}
	},

	data() {
		return {
			state: {

			}
		};
	},

	watch: {

	},

	methods: {
		handleExpand() {
			let { vuiTree, $props: props } = this;
			let { data } = props;

			if (data.children && data.children.length == 0) {
				return;
			}

			vuiTree.handleNodeExpand(data);
		},
		handleCheck(checked) {
			let { vuiTree, $props: props } = this;
			let { data } = props;

			if (data.disabled) {
				return;
			}

			vuiTree.handleNodeCheck(data, checked);
		},
		handleSelect() {
			let { vuiTree, $props: props } = this;
			let { data } = props;

			if (data.disabled) {
				return;
			}

			vuiTree.handleNodeSelect(data);
		},

		handleChildrenBeforeEnter(el) {
			// el.style.height = "0px";
		},
		handleChildrenEnter(el) {
			el.style.height = el.scrollHeight + "px";
		},
		handleChildrenAfterEnter(el) {
			el.style.height = "";
		},
		handleChildrenBeforeLeave(el) {
			el.style.height = el.scrollHeight + "px";
		},
		handleChildrenLeave(el) {
			// el.style.height = "0px";
		},
		handleChildrenAfterLeave(el) {
			el.style.height = "";
		}
	},

	render(h) {
		let { $slots: slots, t: translate, vuiTree, state, $props: props } = this;
		let { state: vuiTreeState, $props: vuiTreeProps } = vuiTree;
		let { handleExpand, handleCheck, handleSelect, handleChildrenBeforeEnter, handleChildrenEnter, handleChildrenAfterEnter, handleChildrenBeforeLeave, handleChildrenLeave, handleChildrenAfterLeave } = this;

		let showIcon = vuiTreeProps.showIcon && props.data.icon;
		let withChildren = props.data.children && props.data.children.length > 0;

		let isExpended = withChildren && vuiTreeState.expendedKeys.indexOf(props.data.key) > -1;
		let isChecked = vuiTreeState.checkedKeys.indexOf(props.data.key) > -1;
		let isSelected = vuiTreeState.selectedKeys.indexOf(props.data.key) > -1;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "tree-node");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-level-${props.level}`]: props.level,
			[`${classNamePrefix}-open`]: withChildren && isExpended,
			[`${classNamePrefix}-close`]: withChildren && !isExpended,
			[`${classNamePrefix}-selected`]: isSelected
		};
		classes.elSwith = {
			[`${classNamePrefix}-switch`]: true
		};
		classes.elCheckbox = {
			[`${classNamePrefix}-checkbox`]: true
		};
		classes.elIcon = {
			[`${classNamePrefix}-icon`]: true
		};
		classes.elTitle = {
			[`${classNamePrefix}-title`]: true,
			[`${classNamePrefix}-title-selected`]: isSelected
		};
		classes.elChildren = {
			[`${classNamePrefix}-children`]: true
		};

		// render
		let children = [];

		children.push(
			<div class={classes.elSwith} onClick={handleExpand}></div>
		);

		if (vuiTreeProps.checkable) {
			children.push(
				<div class={classes.elCheckbox}>
					<VuiCheckbox checked={isChecked} onInput={handleCheck} />
				</div>
			);
		}

		if (showIcon) {
			children.push(
				<div class={classes.elIcon}>
					<VuiIcon type={props.data.icon} />
				</div>
			);
		}

		children.push(
			<div class={classes.elTitle} onClick={handleSelect}>
				{props.data.title}
			</div>
		);

		if (withChildren) {
			children.push(
				<transition
					name={"vui-tree-node-children"}
					onBeforeEnter={handleChildrenBeforeEnter}
					onEnter={handleChildrenEnter}
					onAfterEnter={handleChildrenAfterEnter}
					onBeforeLeave={handleChildrenBeforeLeave}
					onLeave={handleChildrenLeave}
					onAfterLeave={handleChildrenAfterLeave}
				>
					<ul class={classes.elChildren} v-show={isExpended}>
						{
							props.data.children.map((item, index) => {
								return (
									<VuiTreeNode
										key={item.key}
										classNamePrefix={props.classNamePrefix}
										data={item}
										level={props.level + 1}
										showIcon={props.showIcon}
										checkable={props.checkable}
										selectable={props.selectable}
										multiple={props.multiple}
									/>
								);
							})
						}
					</ul>
				</transition>
			);
		}

		return (
			<li class={classes.el}>
				{children}
			</li>
		);
	}
};

export default VuiTreeNode;