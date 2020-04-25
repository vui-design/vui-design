import VuiTreeNode from "./tree-node";
import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import { getDerivedDataFromProps, getDerivedCheckedKeysFromProps } from "./utils";

const VuiTree = {
	name: "vui-tree",

	provide() {
		return {
			vuiTree: this
		};
	},

	components: {
		VuiTreeNode
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		data: {
			type: Array,
			default: () => []
		},
		showIcon: {
			type: Boolean,
			default: false
		},
		checkable: {
			type: Boolean,
			default: false
		},
		checkStrictly: {
			type: Boolean,
			default: false
		},
		selectable: {
			type: Boolean,
			default: true
		},
		multiple: {
			type: Boolean,
			default: false
		},
		expendedKeys: {
			type: Array,
			default: () => []
		},
		checkedKeys: {
			type: Array,
			default: () => []
		},
		selectedKeys: {
			type: Array,
			default: () => []
		}
	},

	data() {
		let { $props: props } = this;
		let state = this.getDerivedStateFromProps(props);

		return {
			state: {
				data: state.data,
				expendedKeys: props.expendedKeys,
				checkedKeys: props.checkedKeys,
				selectedKeys: props.selectedKeys
			}
		};
	},

	watch: {
		data: {
			deep: true,
			handler() {
				let { $props: props } = this;
				let state = this.getDerivedStateFromProps(props);

				this.state.data = state.data;
			}
		},
		expendedKeys: {
			deep: true,
			handler() {
				let { $props: props } = this;
				let state = this.getDerivedStateFromProps(props);

				this.state.expendedKeys = state.expendedKeys;
			}
		},
		checkedKeys: {
			deep: true,
			handler() {
				let { $props: props } = this;
				let state = this.getDerivedStateFromProps(props);

				this.state.checkedKeys = state.checkedKeys;
			}
		},
		selectedKeys: {
			deep: true,
			handler() {
				let { $props: props } = this;
				let state = this.getDerivedStateFromProps(props);

				this.state.selectedKeys = state.selectedKeys;
			}
		}
	},

	methods: {
		getDerivedStateFromProps(props) {
			let data = getDerivedDataFromProps(props.data);
			let expendedKeys = clone(props.expendedKeys);
			let checkedKeys = getDerivedCheckedKeysFromProps(props.data, props.checkedKeys);
			let selectedKeys = clone(props.selectedKeys);

			console.log(clone(data));

			return {
				data,
				expendedKeys,
				checkedKeys,
				selectedKeys
			};
		},
		handleNodeExpand(node) {
			let { state } = this;
			let index = state.expendedKeys.indexOf(node.key);

			if (index > -1) {
				state.expendedKeys.splice(index, 1);
			}
			else {
				state.expendedKeys.push(node.key);
			}

			this.$emit("expend", clone(state.expendedKeys));
		},
		handleNodeCheck(node, checked) {
			let { state } = this;
			console.log(node.key, checked)
			let checkedKeys = getDerivedCheckedKeysFromProps(state.checkedKeys, node, checked);

			console.log(checkedKeys)

			this.state.checkedKeys = checkedKeys;
			/*
			let { state } = this;
			let checkedKeys = clone(state.checkedKeys);
			let toggleCheckedKey = (target, checked) => {
				let index = checkedKeys.indexOf(target.key);

				if (checked) {
					if (index == -1) {
						checkedKeys.push(target.key);
					}
				}
				else {
					if (index > -1) {
						checkedKeys.splice(index, 1);
					}
				}

				if (target.children && target.children.length) {
					target.children.forEach(child => {
						toggleCheckedKey(child, checked);
					});
				}
			};

			toggleCheckedKey(node, checked);

			console.log(checkedKeys)

			this.state.checkedKeys = checkedKeys;
			*/
		},
		handleNodeSelect(node) {
			let { $props: props, state } = this;
			let index = state.selectedKeys.indexOf(node.key);

			if (props.multiple) {
				if (index > -1) {
					state.selectedKeys.splice(index, 1);
				}
				else {
					state.selectedKeys.push(node.key);
				}
			}
			else {
				if (index > -1) {
					state.selectedKeys.splice(index, 1);
				}
				else {
					this.state.selectedKeys = [node.key];
				}
			}
		}
	},

	render(h) {
		let { $slots: slots, t: translate, state, $props: props } = this;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "tree");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true
		};

		// render
		return (
			<ul class={classes.el}>
				{
					state.data.map((item, index) => {
						return (
							<VuiTreeNode
								key={item.key}
								classNamePrefix={props.classNamePrefix}
								data={item}
								level={1}
							/>
						);
					})
				}
			</ul>
		);
	}
};

export default VuiTree;