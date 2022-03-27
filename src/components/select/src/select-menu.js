import VuiSelectMenuItemGroup from "./select-menu-item-group";
import VuiSelectMenuItem from "./select-menu-item";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getStyle from "../../../utils/getStyle";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";
import utils from "./utils";

const VuiSelectMenu = {
  name: "vui-select-menu",
  inject: {
    vuiSelect: {
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
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    options: PropTypes.array.def([]),
    multiple: PropTypes.bool.def(false),
    visible: PropTypes.bool.def(false)
  },
  data() {
    return {
      pagination: {
        pageSize: 8,
        averageSize: 34,
        range: [0, 16],
        pageable: true,
        preventScrolling: false
      }
    };
  },
  computed: {
    getPageListParameters() {
      return {
        options: this.options,
        visible: this.visible,
        activedMenuItemIndex: this.vuiSelect.state.activedMenuItemIndex
      };
    }
  },
  watch: {
    getPageListParameters: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$nextTick(() => this.getPageList());
      }
    }
  },
  methods: {
    getPageList() {
      const { vuiSelect, $props: props, pagination } = this;
      const { state: vuiSelectState } = vuiSelect;
      const pageable = props.options.length > (pagination.pageSize * 2);

      if (pageable) {
        // 
        const paddingTop = parseInt(getStyle(this.$refs.wrapper, "paddingTop"));
        const itemRectTop = vuiSelectState.activedMenuItemIndex * pagination.averageSize + paddingTop;
        const itemRectBottom = itemRectTop + pagination.averageSize;
        const viewRectTop = this.$refs.wrapper.scrollTop;
        const viewRectBottom = viewRectTop + this.$refs.wrapper.clientHeight;
        let scrollTop = vuiSelectState.activedMenuItemIndex * pagination.averageSize + paddingTop;

        if (itemRectTop < viewRectTop) {
          scrollTop = itemRectTop - paddingTop;
        }
        else if (itemRectBottom > viewRectBottom) {
          scrollTop = itemRectBottom - this.$refs.wrapper.clientHeight + paddingTop;
        }
        else {
          scrollTop = this.$refs.wrapper.scrollTop;
        }

        // 
        const reserve = pagination.pageSize / 2;
        const scrollSize = scrollTop < paddingTop ? 0 : (scrollTop - paddingTop);
        let startIndex = Math.floor(scrollSize / pagination.averageSize);
        let endIndex = 0;

        if (startIndex < reserve) {
          startIndex = 0;
        }
        else {
          startIndex = startIndex - reserve;
        }

        let options = props.options.slice(startIndex, props.options.length);

        if (options.length < pagination.pageSize * 2) {
          startIndex = props.options.length - pagination.pageSize * 2;
          endIndex = props.options.length;
        }
        else {
          endIndex = startIndex + pagination.pageSize * 2;
        }

        // 
        if (vuiSelectState.activedEventType === "navigate") {
          if ((itemRectTop < viewRectTop) || (itemRectBottom > viewRectBottom)) {
            this.$refs.wrapper.scrollTop = scrollTop;
          }
        }

        // 
        this.pagination.range = [startIndex, endIndex];
        this.pagination.pageable = pageable;
        this.pagination.preventScrolling = true;
      }
      else {
        // 
        const paddingTop = parseInt(getStyle(this.$refs.wrapper, "paddingTop"));
        const itemRectTop = vuiSelectState.activedMenuItemIndex * pagination.averageSize + paddingTop;
        const itemRectBottom = itemRectTop + pagination.averageSize;
        const viewRectTop = this.$refs.wrapper.scrollTop;
        const viewRectBottom = viewRectTop + this.$refs.wrapper.clientHeight;
        let scrollTop = vuiSelectState.activedMenuItemIndex * pagination.averageSize + paddingTop;

        if (itemRectTop < viewRectTop) {
          scrollTop = itemRectTop - paddingTop;
        }
        else if (itemRectBottom > viewRectBottom) {
          scrollTop = itemRectBottom - this.$refs.wrapper.clientHeight + paddingTop;
        }
        else {
          scrollTop = this.$refs.wrapper.scrollTop;
        }

        // 
        if (vuiSelectState.activedEventType === "navigate") {
          if ((itemRectTop < viewRectTop) || (itemRectBottom > viewRectBottom)) {
            this.$refs.wrapper.scrollTop = scrollTop;
          }
        }

        // 
        this.pagination.range = [0, 0];
        this.pagination.pageable = pageable;
        this.pagination.preventScrolling = false;
      }
    },
    handleScroll(e) {
      const { $props: props, pagination } = this;

      if (pagination.preventScrolling) {
        this.pagination.preventScrolling = false;
      }
      else {
        const pageable = props.options.length > (pagination.pageSize * 2);

        if (pageable) {
          // 
          const paddingTop = parseInt(getStyle(e.target, "paddingTop"));
          let scrollTop = e.target.scrollTop;

          // 
          const reserve = pagination.pageSize / 2;
          const scrollSize = scrollTop < paddingTop ? 0 : (scrollTop - paddingTop);
          let startIndex = Math.floor(scrollSize / pagination.averageSize);
          let endIndex = 0;

          if (startIndex < reserve) {
            startIndex = 0;
          }
          else {
            startIndex = startIndex - reserve;
          }

          let options = props.options.slice(startIndex, props.options.length);

          if (options.length < pagination.pageSize * 2) {
            startIndex = props.options.length - pagination.pageSize * 2;
            endIndex = props.options.length;
          }
          else {
            endIndex = startIndex + pagination.pageSize * 2;
          }

          // 
          this.pagination.range = [startIndex, endIndex];
          this.pagination.pageable = pageable;
          this.pagination.preventScrolling = false;
        }
        else {
          // 
          this.pagination.range = [0, 0];
          this.pagination.pageable = pageable;
          this.pagination.preventScrolling = false;
        }
      }
    },
    handleActiveMenuItem(option) {
      if (option.disabled) {
        return;
      }

      this.$emit("active", option);
    },
    handleClickMenuItem(option) {
      const { $props: props } = this;

      if (option.disabled) {
        return;
      }

      if (props.multiple) {
        const index = props.value.findIndex(target => target.value === option.value);

        if (index === -1) {
          this.$emit("select", option);
        }
        else {
          this.$emit("deselect", option);
        }
      }
      else {
        this.$emit("select", option);
      }
    }
  },
  render(h) {
    const { $props: props, state, pagination } = this;
    const { handleScroll, handleActiveMenuItem, handleClickMenuItem } = this;
    const options = pagination.pageable ? props.options.slice(pagination.range[0], pagination.range[1]) : props.options;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "menu");
    let classes = {};

    classes.elWrapper = `${classNamePrefix}-wrapper`;
    classes.el = `${classNamePrefix}`;

    // style
    let styles = {};

    if (pagination.pageable) {
      styles.el = {
        height: (props.options.length * pagination.averageSize) + "px",
        paddingTop: (pagination.range[0] * pagination.averageSize) + "px"
      };
    }

    // render
    return (
      <div ref="wrapper" class={classes.elWrapper} onScroll={handleScroll}>
        <div class={classes.el} style={styles.el}>
          {
            options.map(option => {
              if (option.type === "option-group") {
                return (
                  <VuiSelectMenuItemGroup
                    key={option.key}
                    classNamePrefix={classNamePrefix}
                    data={option}
                  />
                );
              }
              else if (option.type === "option" || option.type === "keyword") {
                return (
                  <VuiSelectMenuItem
                    key={option.key}
                    classNamePrefix={classNamePrefix}
                    data={option}
                    onMouseenter={handleActiveMenuItem}
                    onClick={handleClickMenuItem}
                  />
                );
              }
            })
          }
        </div>
      </div>
    );
  }
};

export default VuiSelectMenu;