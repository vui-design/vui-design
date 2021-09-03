import VuiSelectMenuItemGroup from "./select-menu-item-group";
import VuiSelectMenuItem from "./select-menu-item";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";
import utils from "./utils";

export default {
  name: "vui-select-menu",
  inject: {
    vuiSelect: {
      default: undefined
    },
    vuiSelectDropdown: {
      default: undefined
    }
  },
  provide() {
    return {
      vuiSelectMenu: this
    };
  },
  components: {
    VuiSelectMenuItemGroup,
    VuiSelectMenuItem
  },
  props: {
    classNamePrefix: PropTypes.string,
    options: PropTypes.array.def([])
  },
  methods: {
    handleMenuItemActive(data) {
      if (data.disabled) {
        return;
      }

      this.$emit("active", data);
    },
    handleMenuItemClick(data) {
      const { vuiSelect, $props: props } = this;
      const { $props: vuiSelectProps, state: vuiSelectState } = vuiSelect;

      if (data.disabled) {
        return;
      }

      if (vuiSelectProps.multiple) {
        const index = vuiSelectState.value.findIndex(item => item.value === data.value);
      
        if (index === -1) {
          this.$emit("select", data);
        }
        else {
          this.$emit("deselect", data);
        }
      }
      else {
        this.$emit("select", data);
      }
    }
  },
  render(h) {
    const { $props: props } = this;
    const { handleMenuItemActive, handleMenuItemClick } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "menu");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    // render
    return (
      <div class={classes.el}>
        {
          props.options.map((option, optionIndex) => {
            if (option.type === "option-group") {
              return (
                <VuiSelectMenuItemGroup
                  key={optionIndex}
                  classNamePrefix={classNamePrefix}
                  data={option}
                >
                  {
                    option.children.map((subOption, subOptionIndex) => {
                      return (
                        <VuiSelectMenuItem
                          key={subOptionIndex}
                          classNamePrefix={classNamePrefix}
                          data={subOption}
                          onMouseenter={handleMenuItemActive}
                          onClick={handleMenuItemClick}
                        />
                      );
                    })
                  }
                </VuiSelectMenuItemGroup>
              );
            }
            else if (option.type === "option" || option.type === "keyword") {
              return (
                <VuiSelectMenuItem
                  key={optionIndex}
                  classNamePrefix={classNamePrefix}
                  data={option}
                  onMouseenter={handleMenuItemActive}
                  onClick={handleMenuItemClick}
                />
              );
            }
          })
        }
      </div>
    );
  }
};