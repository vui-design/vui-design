import VuiIcon from "vui-design/components/icon";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import { getFlattenOptions } from "../utils";

export default {
	name: "vui-select-selection",

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
			type: [Object, Array],
			default: undefined
		},
		backfillOptionProp: {
			type: String,
			default: "children"
		},
		multiple: {
			type: Boolean,
			default: false
		},
		maxTagCount: {
			type: Number,
			default: 0
		},
		maxTagPlaceholder: {
			type: Function,
			default: count => `+ ${count}`
		},
		searchable: {
			type: Boolean,
			default: false
		},
		keyword: {
			type: String,
			default: undefined
		},
		showInput: {
			type: Boolean,
			default: false
		},
		clearable: {
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
			this.$refs.input.focus();
		},
		blur() {
			this.$refs.input.blur();
		},

		handleMouseenter(e) {
			if (this.disabled) {
				return;
			}

			this.$emit("mouseenter", e);
		},
		handleMouseleave(e) {
			if (this.disabled) {
				return;
			}

			this.$emit("mouseleave", e);
		},
		handleMousedown(e) {
			if (this.disabled || e.target === this.$refs.input) {
				return;
			}

			e.preventDefault();
			this.focus();
		},
		handleClick(e) {
			if (this.disabled) {
				return;
			}

			this.$emit("click", e);
		},
		handleFocus(e) {
			if (this.disabled) {
				return;
			}

			this.$emit("focus", e);
		},
		handleBlur(e) {
			if (this.disabled) {
				return;
			}

			this.$emit("blur", e);
		},
		handleKeydown(e) {
			if (this.disabled) {
				return;
			}

			this.$emit("keydown", e);
		},
		handleInput(e) {
			if (this.disabled) {
				return;
			}

			this.$emit("input", e);
		},
		handleRemove(e, value) {
			if (this.disabled) {
				return;
			}

			e.stopPropagation();
			this.$emit("remove", value);
		},
		handleClear(e) {
			if (this.disabled) {
				return;
			}

			e.stopPropagation();
			this.$emit("clear", e);
		}
	},

	render() {
		let { classNamePrefix: customizedClassNamePrefix, placeholder, backfillOptionProp, multiple, maxTagCount, maxTagPlaceholder, searchable, keyword, showInput, clearable, disabled } = this;
		let { handleMouseenter, handleMouseleave, handleMousedown, handleClick, handleFocus, handleBlur, handleKeydown, handleInput, handleRemove, handleClear } = this;

		// value
		let value;

		if (multiple && maxTagCount > 0 && this.value.length > maxTagCount) {
			value = this.value.slice(0, maxTagCount);

			value.push({
				type: "maxTagPlaceholder",
				key: "maxTagPlaceholder",
				children: maxTagPlaceholder(this.value.length - maxTagCount)
			});
		}
		else {
			value = this.value;
		}

		// showItemRemove
		let showItemRemove = multiple && !disabled;

		// showArrow
		let showArrow = !multiple;

		// showBtnClear
		let showBtnClear = clearable && (multiple ? this.value.length > 0 : !is.undefined(this.value));

		// classes
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "select-selection");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elPlaceholder = `${classNamePrefix}-placeholder`;
		classes.elItem = `${classNamePrefix}-item`;
		classes.elItemContent = `${classNamePrefix}-item-content`;
		classes.elItemRemove = `${classNamePrefix}-item-remove`;
		classes.elInput = `${classNamePrefix}-input`;
		classes.elArraw = `${classNamePrefix}-arrow`;
		classes.elBtnClear = `${classNamePrefix}-btn-clear`;

		// styles
		let styles = {};

		styles.el = {
			cursor: disabled ? "not-allowed" : (showInput ? "text" : "pointer")
		};
		styles.elPlaceholder = {
			opacity: keyword ? 0 : (multiple ? (this.value.length === 0 ? 1 : 0) : (is.undefined(this.value) ? 1 : 0))
		};
		styles.elItem = {
			opacity: keyword ? 0 : (showInput ? 0.4 : 1)
		};
		styles.elInput = {
			opacity: showInput ? 1 : 0
		};

		// render
		return (
			<div class={classes.el} style={styles.el} onMouseenter={handleMouseenter} onMouseleave={handleMouseleave} onMousedown={handleMousedown} onClick={handleClick}>
				<div class={classes.elPlaceholder} style={styles.elPlaceholder}>
					{placeholder}
				</div>
				<div>
					{
						multiple ? value.map(item => {
							if (item.type === "maxTagPlaceholder") {
								return (
									<div key={item.key} class={classes.elItem}>
										<div class={classes.elItemContent}>{item.children}</div>
									</div>
								);
							}
							else {
								return (
									<div key={item.value} class={classes.elItem}>
										<div class={classes.elItemContent}>{item[backfillOptionProp]}</div>
										{
											showItemRemove && (
												<i domPropsInnerHTML="&#10005" class={classes.elItemRemove} onClick={e => handleRemove(e, item.value)}></i>
											)
										}
									</div>
								);
							}
						}) : (
							<div class={classes.elItem} style={styles.elItem}>
								<div class={classes.elItemContent}>{value && value[backfillOptionProp]}</div>
							</div>
						)
					}
				</div>
				<div class={classes.elInput} style={styles.elInput}>
					{
						multiple && searchable && (
							<em>{keyword}</em>
						)
					}
					<input ref="input" type="text" autocomplete="off" value={keyword} readonly={!searchable} disabled={disabled} onFocus={handleFocus} onBlur={handleBlur} onKeydown={handleKeydown} onInput={handleInput} onCompositionstart={handleInput} onCompositionupdate={handleInput} onCompositionend={handleInput} />
				</div>
				{
					showArrow && (
						<i class={classes.elArraw}></i>
					)
				}
				{
					showBtnClear && (
						<VuiIcon type="crossmark-circle-filled" class={classes.elBtnClear} onClick={handleClear} />
					)
				}
			</div>
		);
	}
};