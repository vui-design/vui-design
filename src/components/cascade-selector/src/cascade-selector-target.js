import VuiIcon from "vui-design/components/icon";
import VuiCascadeSelectorEmpty from "./cascade-selector-empty";
import Locale from "vui-design/mixins/locale";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import utils from "./utils";

const VuiCascadeSelectorTarget = {
	name: "vui-cascade-selector-target",
	components: {
		VuiIcon,
		VuiCascadeSelectorEmpty
	},
	mixins: [
		Locale
	],
	props: {
		classNamePrefix: PropTypes.string,
		title: PropTypes.func.def(props => ""),
		value: PropTypes.array.def([]),
		options: PropTypes.array.def([]),
		valueKey: PropTypes.string.def("value"),
		childrenKey: PropTypes.string.def("children"),
		formatter: PropTypes.func.def(option => option.label),
		body: PropTypes.func,
		showClear: PropTypes.bool.def(true),
		disabled: PropTypes.bool.def(false),
		locale: PropTypes.object
	},
	methods: {
		getHeader(props) {
			// class
			const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "target-header");
			let classes = {};

			classes.el = `${classNamePrefix}`;
			classes.elTitle = `${classNamePrefix}-title`;
			classes.elExtra = `${classNamePrefix}-extra`;

			// title
			const title = props.title({
				direction: props.direction
			});

			// render
			let content = [];

			content.push(
				<div class={classes.elTitle}>
					{title}
				</div>
			);

			if (!props.disabled && props.showClear) {
				let btnClearText;

				if (props.locale && props.locale.clear) {
					btnClearText = props.locale.clear;
				}
				else {
					btnClearText = this.t("vui.multipleCascader.clear");
				}

				content.push(
					<div class={classes.elExtra}>
						<a href="javascript:;" onClick={props.onClear}>
							{btnClearText}
						</a>
					</div>
				);
			}

			return (
				<div class={classes.el}>
					{content}
				</div>
			);
		},
		getBody(scopedSlot, props) {
			// class
			const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "target-body");
			let classes = {};

			classes.el = `${classNamePrefix}`;

			// render
			let content;

			if (scopedSlot) {
				content = scopedSlot;
			}
			else if (props.value.length) {
				content = this.getChoice(props);
			}
			else {
				content = (
					<VuiCascadeSelectorEmpty
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
		getChoice(props) {
			// class
			const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "choice");
			let classes = {};

			classes.el = `${classNamePrefix}`;

			// options
			const options = utils.getSelectedOptions(props.value, props.options, props.valueKey, props.childrenKey);

			// render
			return (
				<div class={classes.el}>
					{
						options.map(option => {
							const value = option[props.valueKey];
							const children = option[props.childrenKey];

							const attributes = {
								classNamePrefix: classNamePrefix,
								direction: props.direction,
								value: value,
								children: children,
								data: option,
								formatter: props.formatter,
								disabled: props.disabled,
								onDeselect: props.onDeselect
							};

							return this.getChoiceItem(attributes);
						})
					}
				</div>
			);
		},
		getChoiceItem(props) {
			// content
			let content;

			if (is.function(props.formatter)) {
				const attributes = {
					direction: props.direction,
					data: clone(props.data)
				};

				content = props.formatter(attributes);
			}
			else {
				content = props.value;
			}

			// onDeselect
			const onDeselect = () => {
				const option = {
					value: props.value,
					data: clone(props.data)
				};

				props.onDeselect(option);
			};

			// class
			const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "item");
			let classes = {};

			classes.el = {
				[`${classNamePrefix}`]: true,
				[`${classNamePrefix}-disabled`]: props.disabled
			};
			classes.elLabel = `${classNamePrefix}-label`;
			classes.elBtnDeselect = `${classNamePrefix}-btn-deselect`;

			// render
			let children = [];

			children.push(
				<div class={classes.elLabel}>
					{content}
				</div>
			);

			if (!props.disabled) {
				children.push(
					<div class={classes.elBtnDeselect} onClick={onDeselect}>
						<VuiIcon type="crossmark" />
					</div>
				);
			}

			return (
				<div class={classes.el}>
					{children}
				</div>
			);
		},
		handleClear() {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("clear");
		},
		handleDeselect(option) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("deselect", option);
		}
	},
	render(h) {
		const { $props: props } = this;
		const { handleClear, handleDeselect } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "target");
		let classes = {};

		classes.el = `${classNamePrefix}`;

		// render
		const attributes = {
			direction: "target",
			classNamePrefix: props.classNamePrefix,
			title: props.title,
			value: props.value,
			options: props.options,
			valueKey: props.valueKey,
			childrenKey: props.childrenKey,
			formatter: props.formatter,
			showClear: props.showClear,
			disabled: props.disabled,
			locale: props.locale,
			onClear: handleClear,
			onDeselect: handleDeselect
		};

		return (
			<div class={classes.el}>
				{this.getHeader(attributes)}
				{this.getBody(is.function(props.body) ? props.body(attributes) : undefined, attributes)}
			</div>
		);
	}
};

export default VuiCascadeSelectorTarget;