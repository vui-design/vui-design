import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    data: PropTypes.object.def({})
  };
};

export default {
  name: "vui-select-menu-item",
  inject: {
    vuiSelect: {
      default: undefined
    }
  },
  props: createProps(),
  computed: {
    actived() {
      const { vuiSelect, $props: props } = this;
      const { state: vuiSelectState } = vuiSelect;
      let actived = false;

      if (vuiSelectState.activedMenuItem) {
        actived = vuiSelectState.activedMenuItem.value === props.data.value;
      }

      return actived;
    },
    selected() {
      const { vuiSelect, $props: props } = this;
      const { $props: vuiSelectProps, state: vuiSelectState } = vuiSelect;
      let selected = false;

      if (vuiSelectProps.multiple) {
        if (vuiSelectState.value && vuiSelectState.value.length > 0) {
          selected = vuiSelectState.value.findIndex(item => item.value === props.data.value) > -1;
        }
      }
      else {
        if (vuiSelectState.value) {
          selected = vuiSelectState.value.value === props.data.value;
        }
      }

      return selected;
    },
    disabled() {
      const { $props: props } = this;

      return props.data.disabled;
    }
  },
  methods: {
    handleMouseenter(e) {
      const { $props: props } = this;

      if (this.disabled) {
        return;
      }

      this.$emit("mouseenter", props.data);
    },
    handleClick(e) {
      const { $props: props } = this;

      if (this.disabled) {
        return;
      }

      this.$emit("click", props.data);
    }
  },
  render(h) {
    const { $props: props } = this;
    const { handleMouseenter, handleClick } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "item");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-level-${props.data.level}`]: true,
      [`${classNamePrefix}-actived`]: this.actived,
      [`${classNamePrefix}-selected`]: this.selected,
      [`${classNamePrefix}-disabled`]: this.disabled
    };
    classes.elContent = `${classNamePrefix}-content`;
    classes.elIcon = `${classNamePrefix}-icon`;

    // render
    let children = [];

    children.push(
      <div class={classes.elContent}>
        {props.data.children || props.data.label || props.data.value}
      </div>
    );

    if (props.data.type === "keyword") {
      children.push(
        <div class={classes.elIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
            <path d="M965.6,80h-77.3c-5.6,0-10.3,4.5-10.3,10.1v653.3H251.6v-92c-0.1-5.7-4.8-10.2-10.5-10.2c-2.3,0-4.5,0.8-6.3,2.2L51.9,784.6c-4.4,3.4-5.3,9.7-1.9,14.1c0.5,0.7,1.2,1.3,1.9,1.8l182.9,141.2c4.5,3.5,11,2.8,14.5-1.6c1.4-1.8,2.2-4,2.3-6.3v-94.7h641.9c45.5,0,82.5-36.2,82.5-80.7V90.1C975.9,84.5,971.3,79.9,965.6,80C965.6,80,965.6,80,965.6,80z" />
          </svg>
        </div>
      );
    }

    return (
      <div class={classes.el} onMouseenter={handleMouseenter} onClick={handleClick}>
        {children}
      </div>
    );
  }
};