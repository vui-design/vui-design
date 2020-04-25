import VuiIcon from "vui-design/components/icon";
import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

export default {
	name: "vui-cascader-selection",

	componetns: {
		VuiIcon
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		placeholder: {
			type: String,
			default: undefined
		},
		value: {
			type: Array,
			default: undefined
		},
		keyNames: {
			type: Object,
			default: () => ({ label: "label", value: "value", children: "children" })
		},
		formatter: {
			type: Function,
			default: (labels, options) => labels.join(" / ")
		},
		searchable: {
			type: Boolean,
			default: false
		},
		keyword: {
			type: String,
			default: undefined
		},
		clearable: {
			type: Boolean,
			default: false
		},
		focused: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	methods: {
		focus() {
			let { $refs: refs } = this;

			refs.input && refs.input.focus();
		},
		blur() {
			let { $refs: refs } = this;

			refs.input && refs.input.blur();
		},

		handleMouseenter(e) {
			let { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("mouseenter", e);
		},
		handleMouseleave(e) {
			let { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("mouseleave", e);
		},
		handleMousedown(e) {
			let { $refs: refs, $props: props } = this;

			if (e.target === refs.input || props.disabled) {
				return;
			}

			e.preventDefault();
			this.focus();
		},
		handleClick(e) {
			let { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("click", e);
		},
		handleFocus(e) {
			let { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("focus", e);
		},
		handleBlur(e) {
			let { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("blur", e);
		},
		handleKeydown(e) {
			let { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("keydown", e);
		},
		handleInput(e) {
			let { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.$emit("input", e);
		},
		handleClear(e) {
			let { $props: props } = this;

			if (props.disabled) {
				return;
			}

			e.stopPropagation();
			this.$emit("clear", e);
		}
	},

	render() {
		let { $props: props } = this;
		let { handleMouseenter, handleMouseleave, handleMousedown, handleClick, handleFocus, handleBlur, handleKeydown, handleInput, handleClear } = this;

		// value
		let labels = props.value.map(option => option[props.keyNames.label]);
		let value = props.formatter(labels, clone(props.value));

		// showBtnClear
		let showBtnClear = props.clearable && props.value.length > 0;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "cascader-selection");
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
				<i class={classes.elArraw}></i>
				{
					showBtnClear && (
						<VuiIcon type="crossmark-circle-filled" class={classes.elBtnClear} onClick={handleClear} />
					)
				}
			</div>
		);
	}
};