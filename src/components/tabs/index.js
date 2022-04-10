import VuiTabs from "./src/tabs";
import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import utils from "./src/utils";

const VuiTabsWrapper = {
  name: VuiTabs.name,
  components: {
    VuiTabs
  },
  model: {
    prop: "activeKey",
    event: "input"
  },
  props: {
    classNamePrefix: PropTypes.string,
    type: PropTypes.oneOf(["line", "card"]).def("line"),
    size: PropTypes.oneOf(["small", "medium", "large"]),
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    extra: PropTypes.any,
    addable: PropTypes.bool.def(false),
    closable: PropTypes.bool.def(false),
    destroyOnHide: PropTypes.bool.def(false),
    headerStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    bodyStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  },
  render() {
    const { $slots: slots, $listeners: listeners, $props: props } = this;

    const tabs = utils.getTabsFromChildren(props, slots.default);
    let activeKey = props.activeKey;

    if (!is.effective(activeKey)) {
      const tab = tabs.find(tab => !tab.disabled);

      if (tab) {
        activeKey = tab.key;
      }
    }

    const attributes = {
      props: {
        ...props,
        activeKey,
        tabs,
        extra: slots.extra || props.extra
      },
      on: {
        ...listeners
      }
    };

    return (
      <VuiTabs {...attributes} />
    );
  }
};

VuiTabsWrapper.install = function(Vue) {
  Vue.component(VuiTabsWrapper.name, VuiTabsWrapper);
};

export default VuiTabsWrapper;