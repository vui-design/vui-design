import VuiResizeObserver from "vui-design/components/resize-observer";
import VuiIcon from "vui-design/components/icon";
import Locale from "vui-design/mixins/locale";
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
    VuiResizeObserver,
    VuiIcon
  },
  mixins: [
    Locale
  ],
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
    },
    handleResize() {
      this.$emit("resize");
    }
  },
  render() {
    const { vuiCascader, $props: props, t: translate } = this;
    const { handleMouseenter, handleMouseleave, handleMousedown, handleClick, handleFocus, handleBlur, handleKeydown, handleInput, handleClear, handleResize } = this;

    // placeholder
    const placeholder = props.placeholder || translate("vui.cascader.placeholder");

    // showBtnClear
    const showBtnClear = props.clearable && props.hovered && !props.disabled && (props.keyword || props.value.length > 0);

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

    styles.el = {};
    styles.elValue = {};
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

    if (props.keyword) {
      styles.elValue.opacity = 0;
    }
    else if (props.focused) {
      styles.elValue.opacity = 0.4;
    }
    else {
      styles.elValue.opacity = 1;
    }

    if (props.value.length === 0) {
      styles.elPlaceholder.display = "block";
      styles.elPlaceholder.opacity = props.keyword ? 0 : 1;
    }
    else {
      styles.elPlaceholder.display = "none";
      styles.elPlaceholder.opacity = 0;
    }

    if (props.focused) {
      styles.elInput.opacity = 1;
    }
    else {
      styles.elInput.opacity = 0;
    }

    // render
    let children = [];

    if (props.value.length > 0) {
      const labels = props.value.map(option => option[props.optionKeys.label]);
      const value = props.formatter(labels, clone(props.value));
      
      children.push(
        <div key="value" class={classes.elValue} style={styles.elValue}>{value}</div>
      );
    }

    children.push(
      <div key="placeholder" class={classes.elPlaceholder} style={styles.elPlaceholder}>
        {placeholder}
      </div>
    );

    children.push(
      <div key="input" class={classes.elInput} style={styles.elInput}>
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

    if (showBtnClear) {
      children.push(
        <div key="btn-clear" class={classes.elBtnClear} onClick={handleClear}>
          <VuiIcon type="crossmark-circle-filled" />
        </div>
      );
    }
    else {
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