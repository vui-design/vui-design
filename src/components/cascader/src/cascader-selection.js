import VuiIcon from "vui-design/components/icon";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import utils from "./utils";

export default {
	name: "vui-cascader-selection",
	inject: {
		vuiCascader: {
			default: undefined
		}
	},
	componetns: {
		VuiIcon
	},
	props: {
		classNamePrefix: PropTypes.string,
		placeholder: PropTypes.string,
		value: PropTypes.array.def([]),
		optionKeys: PropTypes.object.def(utils.optionKeys),
		formatter: PropTypes.func.def((labels, options) => labels.join(" / ")),
		searchable: PropTypes.bool.def(false),
		keyword: PropTypes.string,
		clearable: PropTypes.bool.def(false),
		hovered: PropTypes.bool.def(false),
		focused: PropTypes.bool.def(false),
		disabled: PropTypes.bool.def(false)
	},
	methods: {
		focus() {
			const { $refs: references } = this;

			if (references.input) {
				references.input.focus();
			}
		},
		blur() {
			const { $refs: references } = this;

			if (references.input) {
				references.input.blur();
			}
		},
		handleMouseenter(e) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("mouseenter", e);
		},
		handleMouseleave(e) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("mouseleave", e);
		},
		handleMousedown(e) {
			const { $refs: references, $props: props } = this;

			if (e.target === references.input || props.disabled) {
				return;
			}

			this.focus();
			e.preventDefault();
		},
		handleClick(e) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("click", e);
		},
		handleFocus(e) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("focus", e);
		},
		handleBlur(e) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("blur", e);
		},
		handleKeydown(e) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("keydown", e);
		},
		handleInput(e) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("input", e);
		},
		handleClear(e) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("clear", e);
			e.stopPropagation();
		}
	},
	render() {
		const { vuiCascader, $props: props } = this;
		const { handleMouseenter, handleMouseleave, handleMousedown, handleClick, handleFocus, handleBlur, handleKeydown, handleInput, handleClear } = this;

		// value
		const labels = props.value.map(option => option[props.optionKeys.label]);
		const value = props.formatter(labels, clone(props.value));

		// showBtnClear
		const showBtnClear = props.clearable && !props.disabled && props.hovered && (props.keyword || props.value.length > 0);

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "selection");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elPlaceholder = `${classNamePrefix}-placeholder`;
		classes.elValue = `${classNamePrefix}-value`;
		classes.elInput = `${classNamePrefix}-input`;
		classes.elArraw = `${classNamePrefix}-arrow`;
		classes.elBtnClear = `${classNamePrefix}-btn-clear`;

		// style
		let styles = {};

		styles.el = {
			cursor: props.disabled ? "not-allowed" : (props.focused ? "text" : "pointer")
		};
		styles.elPlaceholder = {
			opacity: props.keyword ? 0 : (props.value.length ? 0 : 1)
		};
		styles.elValue = {
			opacity: props.keyword ? 0 : (props.focused ? 0.4 : 1)
		};
		styles.elInput = {
			opacity: props.focused ? 1 : 0
		};

		// render
		return (
			<div
				class={classes.el}
				style={styles.el}
				onMouseenter={handleMouseenter}
				onMouseleave={handleMouseleave}
				onMousedown={handleMousedown}
				onClick={handleClick}
			>
				<div class={classes.elPlaceholder} style={styles.elPlaceholder}>{props.placeholder}</div>
				<div class={classes.elValue} style={styles.elValue}>{value}</div>
				<div class={classes.elInput} style={styles.elInput}>
					<input
						ref="input"
						type="text"
						autocomplete="off"
						value={props.keyword}
						readonly={!props.searchable}
						disabled={props.disabled}
						onFocus={handleFocus}
						onBlur={handleBlur}
						onKeydown={handleKeydown}
						onCompositionstart={handleInput}
						onCompositionupdate={handleInput}
						onCompositionend={handleInput}
						onInput={handleInput}
					/>
				</div>
				{
					showBtnClear ? (
						<VuiIcon type="crossmark-circle-filled" class={classes.elBtnClear} onClick={handleClear} />
					) : (
						<i class={classes.elArraw}></i>
					)
				}
			</div>
		);
	}
};