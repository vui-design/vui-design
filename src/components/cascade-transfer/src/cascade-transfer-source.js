import VuiCheckbox from "../../checkbox";
import VuiIcon from "../../icon";
import VuiCascadeTransferEmpty from "./cascade-transfer-empty";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import clone from "../../../utils/clone";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";
import utils from "./utils";

const VuiCascadeTransferSource = {
	name: "vui-cascade-transfer-source",
	components: {
		VuiCheckbox,
		VuiIcon,
		VuiCascadeTransferEmpty
	},
	props: {
		classNamePrefix: PropTypes.string,
		level: PropTypes.number.def(1),
		parent: PropTypes.object,
		selectedKeys: PropTypes.array.def([]),
		options: PropTypes.array.def([]),
		valueKey: PropTypes.string.def("value"),
		childrenKey: PropTypes.string.def("children"),
		title: PropTypes.func.def(props => ""),
		formatter: PropTypes.func.def(option => option.label),
		body: PropTypes.func,
		locale: PropTypes.object,
		showSelectAll: PropTypes.bool.def(true),
		disabled: PropTypes.bool.def(false)
	},
	data() {
		const state = {
			expandedKey: undefined
		};

		return {
			state
		};
	},
	methods: {
		getHeader(props) {
			// class
			const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "source-header");
			let classes = {};

			classes.el = `${classNamePrefix}`;
			classes.elCheckbox = `${classNamePrefix}-checkbox`;
			classes.elTitle = `${classNamePrefix}-title`;

			// title
			const title = props.title({
				type: props.type,
				level: props.level,
				parent: props.parent
			});

			// onSelectAll
			const onSelectAll = checked => {
				props.onSelectAll(checked, props.parent, props.level - 1);
			};

			// render
			let content = [];

			if (props.showSelectAll) {
				const checkedStatus = utils.getCheckedStatus(props.selectedKeys, props.options, props.valueKey);
				const indeterminate = utils.getIndeterminateStatus(props.selectedKeys, props.options, props.valueKey, props.childrenKey);
				const checked = checkedStatus === "all";
				const disabled = props.disabled;

				content.push(
					<div class={classes.elCheckbox}>
						<VuiCheckbox checked={checked} indeterminate={indeterminate} disabled={disabled} validator={false} onChange={onSelectAll} />
					</div>
				);
			}

			content.push(
				<div class={classes.elTitle}>
					{title}
				</div>
			);

			return (
				<div class={classes.el}>
					{content}
				</div>
			);
		},
		getBody(scopedSlot, props) {
			// class
			const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "source-body");
			let classes = {};

			classes.el = `${classNamePrefix}`;

			// render
			let content;

			if (scopedSlot) {
				content = scopedSlot;
			}
			else if (props.options.length) {
				content = this.getMenu(props);
			}
			else {
				content = (
					<VuiCascadeTransferEmpty
						classNamePrefix={props.classNamePrefix}
						description={props.locale ? props.locale.notFound : undefined}
					/>
				);
			}

			return (
				<div class={classes.el}>
					{content}
				</div>
			);
		},
		getMenu(props) {
			// class
			const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "menu");
			let classes = {};

			classes.el = `${classNamePrefix}`;

			// render
			return (
				<div class={classes.el}>
					{
						props.options.map(option => {
							const value = option[props.valueKey];
							const children = option[props.childrenKey];

							const expanded = props.expandedKey === value;
							const indeterminate = utils.getIndeterminateStatus(props.selectedKeys, children, props.valueKey, props.childrenKey);
							const checked = props.selectedKeys.indexOf(value) > -1;

							const attributes = {
								classNamePrefix: classNamePrefix,
								type: props.type,
								level: props.level,
								parent: props.parent,
								option: option,
								valueKey: props.valueKey,
								childrenKey: props.childrenKey,
								formatter: props.formatter,
								expanded: expanded,
								indeterminate: indeterminate,
								checked: checked,
								disabled: props.disabled,
								onClick: props.onClick,
								onSelect: props.onSelect
							};

							return this.getMenuItem(attributes);
						})
					}
				</div>
			);
		},
		getMenuItem(props) {
			// class
			const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "item");
			let classes = {};

			classes.el = {
				[`${classNamePrefix}`]: true,
				[`${classNamePrefix}-expanded`]: props.expanded,
				[`${classNamePrefix}-indeterminate`]: props.indeterminate,
				[`${classNamePrefix}-checked`]: props.checked,
				[`${classNamePrefix}-disabled`]: props.disabled
			};
			classes.elCheckbox = `${classNamePrefix}-checkbox`;
			classes.elLabel = `${classNamePrefix}-label`;
			classes.elArrow = `${classNamePrefix}-arrow`;

			// content
			let content;

			if (is.function(props.formatter)) {
				const attributes = {
					type: props.type,
					level: props.level,
					parent: props.parent,
					option: props.option
				};

				content = props.formatter(attributes);
			}
			else {
				content = props.option[props.valueKey];
			}

			// onStopPropagation
			const onStopPropagation = e => e.stopPropagation();

			// onClick
			const onClick = e => {
				props.onClick(props.option, props.level);
			};

			// onSelect
			const onSelect = checked => {
				props.onSelect(checked, props.option);
			};

			// render
			let children = [];

			children.push(
				<div class={classes.elCheckbox} onClick={onStopPropagation}>
					<VuiCheckbox indeterminate={props.indeterminate} checked={props.checked} disabled={props.disabled} onChange={onSelect} />
				</div>
			);

			children.push(
				<div class={classes.elLabel}>
					{content}
				</div>
			);

			if (props.option[props.childrenKey] && props.option[props.childrenKey].length > 0) {
				children.push(
					<div class={classes.elArrow}>
						<VuiIcon type="chevron-right" />
					</div>
				);
			}

			return (
				<div class={classes.el} onClick={onClick}>
					{children}
				</div>
			);
		},
		handleClick(option, level) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.state.expandedKey = option[props.valueKey];
			this.$emit("click", option, level);
		},
		handleSelectAll(checked, option, level) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("selectAll", checked, option, level);
		},
		handleSelect(checked, option) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("select", checked, option);
		}
	},
	render(h) {
		const { $props: props, state } = this;
		const { handleClick, handleSelectAll, handleSelect } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "source");
		let classes = {};

		classes.el = `${classNamePrefix}`;

		// render
		const attributes = {
			type: "source",
			classNamePrefix: props.classNamePrefix,
			level: props.level,
			parent: props.parent,
			expandedKey: state.expandedKey,
			selectedKeys: props.selectedKeys,
			options: props.options,
			valueKey: props.valueKey,
			childrenKey: props.childrenKey,
			title: props.title,
			formatter: props.formatter,
			locale: props.locale,
			showSelectAll: props.showSelectAll,
			disabled: props.disabled,
			onClick: handleClick,
			onSelectAll: handleSelectAll,
			onSelect: handleSelect
		};

		return (
			<div class={classes.el}>
				{this.getHeader(attributes)}
				{this.getBody(is.function(props.body) ? props.body(attributes) : undefined, attributes)}
			</div>
		);
	}
};

export default VuiCascadeTransferSource;