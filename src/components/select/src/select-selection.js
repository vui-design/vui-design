import VuiResizeObserver from "vui-design/components/resize-observer";
import VuiIcon from "vui-design/components/icon";
import Locale from "vui-design/mixins/locale";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

export default {
  name: "vui-select-selection",
  inject: {
    vuiSelect: {
      default: undefined
    }
  },
  componetns: {
    VuiResizeObserver,
    VuiIcon
  },
  mixins: [
    Locale
  ],
  props: {
    classNamePrefix: PropTypes.string,
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    backfillOptionProp: PropTypes.string.def("children"),
    multiple: PropTypes.bool.def(false),
    maxTagCount: PropTypes.number.def(0),
    maxTagPlaceholder: PropTypes.func.def(count => "+" + count),
    searchable: PropTypes.bool.def(false),
    keyword: PropTypes.string,
    clearable: PropTypes.bool.def(false),
    hovered: PropTypes.bool.def(false),
    focused: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false)
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    blur() {
      this.$refs.input.blur();
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

      if (props.disabled || e.target === references.input) {
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
    handleDeselect(e, value) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.$emit("deselect", value);
      e.stopPropagation();
    },
    handleClear(e) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.$emit("clear", e);
      e.stopPropagation();
    },
    handleResize() {
      this.$emit("resize");
    }
  },
  render() {
    const { vuiSelect, $props: props, t: translate } = this;
    const { handleMouseenter, handleMouseleave, handleMousedown, handleClick, handleFocus, handleBlur, handleKeydown, handleInput, handleDeselect, handleClear, handleResize } = this;

    // value
    const valueLength = props.multiple ? props.value.length : 0;
    let value = props.value;

    // placeholder
    const placeholder = props.placeholder || translate("vui.select.placeholder");

    // showItemBtnDeselect
    const showItemBtnDeselect = props.multiple && !props.disabled;

    // showBtnClear
    const showBtnClear = props.clearable && props.hovered && !props.disabled &&  (props.keyword || (props.multiple ? valueLength > 0 : !is.undefined(value)));

    // showArrow
    const showArrow = !props.multiple;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "selection");
    let classes = {};

    classes.el = `${classNamePrefix}`;
    classes.elItemList = `${classNamePrefix}-item-list`;
    classes.elItem = `${classNamePrefix}-item`;
    classes.elItemContent = `${classNamePrefix}-item-content`;
    classes.elItemBtnDeselect = `${classNamePrefix}-item-btn-deselect`;
    classes.elPlaceholder = `${classNamePrefix}-placeholder`;
    classes.elInput = `${classNamePrefix}-input`;
    classes.elBtnClear = `${classNamePrefix}-btn-clear`;
    classes.elArraw = `${classNamePrefix}-arrow`;

    // style
    let styles = {};

    styles.el = {};
    styles.elItem = {};
    styles.elPlaceholder = {};
    styles.elInput = {};

    if (props.disabled) {
      styles.el.cursor = "not-allowed";
    }
    else if (props.focused) {
      styles.el.cursor = "text";
    }
    else {
      styles.el.cursor = "pointer";
    }

    if (!props.multiple) {
      if (props.keyword) {
        styles.elItem.opacity = 0;
      }
      else if (props.focused) {
        styles.elItem.opacity = 0.4;
      }
      else {
        styles.elItem.opacity = 1;
      }
    }

    if (props.multiple) {
      if (valueLength === 0) {
        styles.elPlaceholder.display = "block";
        styles.elPlaceholder.opacity = props.keyword ? 0 : 1;
      }
      else {
        styles.elPlaceholder.display = "none";
        styles.elPlaceholder.opacity = 0;
      }
    }
    else {
      if (is.undefined(value)) {
        styles.elPlaceholder.display = "block";
        styles.elPlaceholder.opacity = props.keyword ? 0 : 1;
      }
      else {
        styles.elPlaceholder.display = "none";
        styles.elPlaceholder.opacity = 0;
      }
    }

    if (props.focused) {
      styles.elInput.opacity = 1;
    }
    else {
      styles.elInput.opacity = 0;
    }

    // render
    const elInput = (
      <div key="input" class={classes.elInput} style={styles.elInput}>
        {
          props.multiple && props.searchable && (
            <pre>{props.keyword}</pre>
          )
        }
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
    );

    let children = [];

    if (props.multiple) {
      let maxTagPlaceholder;

      if (props.maxTagCount > 0 && valueLength > props.maxTagCount) {
        value = value.slice(0, props.maxTagCount);
        maxTagPlaceholder = (
          <div key="maxTagPlaceholder" class={classes.elItem}>
            <div class={classes.elItemContent}>
              {props.maxTagPlaceholder(valueLength - props.maxTagCount)}
            </div>
          </div>
        );
      }

      let itemList = value.map(item => {
        return (
          <div key={item.value} class={classes.elItem}>
            <div class={classes.elItemContent}>{item[props.backfillOptionProp]}</div>
            {
              showItemBtnDeselect && !item.disabled && (
                <div class={classes.elItemBtnDeselect} onClick={e => handleDeselect(e, item.value)}>
                  <VuiIcon type="crossmark" />
                </div>
              )
            }
          </div>
        );
      });
      
      if (maxTagPlaceholder) {
        itemList.push(maxTagPlaceholder);
      }

      itemList.push(elInput);

      children.push(
        <div key="item-list" class={classes.elItemList}>
          {itemList}
        </div>
      );
    }
    else if (!is.undefined(value)) {
      children.push(
        <div key="item" class={classes.elItem} style={styles.elItem}>
          <div class={classes.elItemContent}>{value[props.backfillOptionProp]}</div>
        </div>
      );
    }
  
    children.push(
      <div key="placeholder" class={classes.elPlaceholder} style={styles.elPlaceholder}>
        {placeholder}
      </div>
    );

    if (!props.multiple) {
      children.push(elInput);
    }

    if (showBtnClear) {
      children.push(
        <div key="btn-clear" class={classes.elBtnClear} onClick={handleClear}>
          <VuiIcon type="crossmark-circle-filled" />
        </div>
      );
    }
    else if (showArrow) {
      children.push(
        <div key="arrow" class={classes.elArraw}></div>
      );
    }

    return (
      <VuiResizeObserver onResize={handleResize}>
        <div
          class={classes.el}
          style={styles.el}
          onMouseenter={handleMouseenter}
          onMouseleave={handleMouseleave}
          onMousedown={handleMousedown}
          onClick={handleClick}
        >
          {children}
        </div>
      </VuiResizeObserver>
    );
  }
};