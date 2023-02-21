import VuiCascaderMenu from "./cascader-menu";
import PropTypes from "../../utils/prop-types";
import clone from "../../utils/clone";
import getClassNamePrefix from "../../utils/getClassNamePrefix";
import utils from "./utils";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    value: PropTypes.array.def([]),
    options: PropTypes.array.def([]),
    optionKeys: PropTypes.object.def(utils.optionKeys),
    expandTrigger: PropTypes.oneOf(["click", "hover"]).def("click"),
    changeOnSelect: PropTypes.bool.def(false)
  };
};

export default {
  name: "vui-cascader-menu-list",
  inject: {
    vuiCascader: {
      default: undefined
    }
  },
  provide() {
    return {
      vuiCascaderMenuList: this
    };
  },
  components: {
    VuiCascaderMenu
  },
  props: createProps(),
  data() {
    const { $props: props } = this;
    const state = this.getDerivedStateFromProps(props);

    return {
      state: {
        value: state.value,
        menuList: state.menuList
      }
    };
  },
  watch: {
    value(value) {
      const { $props: props } = this;
      const state = this.getDerivedStateFromProps(props);

      this.state.value = state.value;
      this.state.menuList = state.menuList;
    },
    options(value) {
      const { $props: props } = this;
      const state = this.getDerivedStateFromProps(props);

      this.state.value = state.value;
      this.state.menuList = state.menuList;
    },
    visible(value) {
      if (!value) {
        return;
      }

      const { $props: props } = this;
      const state = this.getDerivedStateFromProps(props);

      this.state.value = state.value;
      this.state.menuList = state.menuList;
    }
  },
  methods: {
    getDerivedStateFromProps(props) {
      const value = clone(props.value);
      const menuList = this.getDerivedStateMenuListFromProps({
        value: props.value,
        options: props.options,
        optionKeys: props.optionKeys
      });

      return {
        value,
        menuList
      };
    },
    getDerivedStateMenuListFromProps(props) {
      let result = [props.options];
      let value = clone(props.value);

      if (!value.length) {
        return result;
      }

      const target = value.shift();
      const option = props.options.find(option => option[props.optionKeys.value] === target[props.optionKeys.value]);

      if (option && option[props.optionKeys.children]) {
        result = result.concat(this.getDerivedStateMenuListFromProps({
          value: value,
          options: option[props.optionKeys.children],
          optionKeys: props.optionKeys
        }));
      }

      return result;
    },
    handleSelect(level, data) {
      const { $props: props, state } = this;
      const value = state.value.slice(0, level).concat(data);
      const menuList = this.getDerivedStateMenuListFromProps({
        value: value,
        options: props.options,
        optionKeys: props.optionKeys
      });

      this.state.value = value;
      this.state.menuList = menuList;

      if (!props.changeOnSelect && data[props.optionKeys.children]) {
        return;
      }

      this.$emit("select", clone(value));
    }
  },
  render(h) {
    const { $props: props, state } = this;
    const { handleSelect } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "menu-list");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    // render
    const children = state.menuList.map((menu, index) => {
      return (
        <VuiCascaderMenu
          key={index}
          classNamePrefix={props.classNamePrefix}
          level={index}
          value={state.value[index]}
          options={menu}
          optionKeys={props.optionKeys}
          expandTrigger={props.expandTrigger}
          onSelect={handleSelect}
        />
      );
    });

    return (
      <div class={classes.el}>{children}</div>
    );
  }
};