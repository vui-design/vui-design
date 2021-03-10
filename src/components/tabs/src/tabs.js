import VuiTabsTab from "./tabs-tab";
import VuiTabsPanel from "./tabs-panel";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiTabs = {
  name: "vui-tabs",
  provide() {
    return {
      vuiTabs: this
    };
  },
  components: {
    VuiTabsTab,
    VuiTabsPanel
  },
  props: {
    classNamePrefix: PropTypes.string,
    type: PropTypes.oneOf(["line", "card"]).def("line"),
    size: PropTypes.oneOf(["small", "medium", "large"]),
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tabpanels: PropTypes.array.def([]),
    extra: PropTypes.any,
    addable: PropTypes.bool.def(false),
    closable: PropTypes.bool.def(false),
    editable: PropTypes.bool.def(false),
    animated: PropTypes.bool.def(true),
    headerStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    bodyStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  },
  data() {
    const { $props: props } = this;
    const state = {
      activeKey: props.activeKey
    };

    return {
      state
    };
  },
  watch: {
    activeKey(value) {
      this.state.activeKey = value;
    }
  },
  methods: {
    handleChange(tabpanel) {
      if (tabpanel.disabled) {
        return;
      }

      this.state.activeKey = tabpanel.key;
      this.$emit("input", this.state.activeKey);
      this.$emit("change", this.state.activeKey);
    },
    handleAdd(e) {
      this.$emit("add");
    },
    handleClose(tabpanel) {
      if (tabpanel.disabled) {
        return;
      }

      this.$emit("close", tabpanel.key);
    }
  },
  render() {
    const { $vui: vui, $props: props, state } = this;
    const { handleChange, handleAdd, handleClose } = this;

    // size
    let size;

    if (props.size) {
      size = props.size;
    }
    else if (vui && vui.size) {
      size = vui.size;
    }
    else {
      size = "medium";
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "tabs");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.type}`]: true,
      [`${classNamePrefix}-${size}`]: size,
      [`${classNamePrefix}-animated`]: props.animated
    };
    classes.elHeader = `${classNamePrefix}-header`;
    classes.elHeaderContent = `${classNamePrefix}-header-content`;
    classes.elExtra = `${classNamePrefix}-extra`;
    classes.elBtnAdd = `${classNamePrefix}-btn-add`;
    classes.elBody = `${classNamePrefix}-body` ;
    classes.elBodyContent = `${classNamePrefix}-body-content`;

    // style
    let styles = {};
    let x = props.tabpanels.findIndex(tabpanel => tabpanel.key === state.activeKey);

    if (x > -1) {
      x = x === 0 ? `0%` : `-${x * 100}%`;

      styles.elBodyContent = {
        transform: `translateX(${x}) translateZ(0px)`
      };
    }

    // extra
    let extra;

    if (props.extra) {
      extra = (
        <div class={classes.elExtra}>{props.extra}</div>
      );
    }
    else if (props.addable || props.editable) {
      extra = (
        <div class={classes.elExtra}>
          <a href="javascript:;" class={classes.elBtnAdd} onClick={handleAdd}></a>
        </div>
      );
    }

    // render
    return (
      <div class={classes.el}>
        <div class={classes.elHeader} style={props.headerStyle}>
          <div class={classes.elHeaderContent}>
            {
              props.tabpanels.map(tabpanel => {
                return (
                  <VuiTabsTab
                    classNamePrefix={classNamePrefix}
                    key={tabpanel.key}
                    data={tabpanel}
                    onClick={handleChange}
                    onClose={handleClose}
                  />
                );
              })
            }
          </div>
          {extra}
        </div>
        <div class={classes.elBody} style={props.bodyStyle}>
          <div class={classes.elBodyContent} style={styles.elBodyContent}>
            {
              props.tabpanels.map(tabpanel => {
                return (
                  <VuiTabsPanel
                    classNamePrefix={classNamePrefix}
                    key={tabpanel.key}
                    data={tabpanel}
                  />
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
};

export default VuiTabs;