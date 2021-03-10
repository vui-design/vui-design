import VuiTabs from "./src/tabs";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
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
    editable: PropTypes.bool.def(false),
    animated: PropTypes.bool.def(true),
    headerStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    bodyStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  },
  render() {
    const { $slots: slots, $listeners: listeners, $props: props } = this;

    const tabpanels = utils.getTabpanelsFromChildren(props, slots.default);
    let activeKey = props.activeKey;

    if (!is.effective(activeKey)) {
      const tabpanel = tabpanels.find(tabpanel => !tabpanel.disabled);

      if (tabpanel) {
        activeKey = tabpanel.key;
      }
    }

    const attributes = {
      props: {
        ...props,
        activeKey,
        tabpanels,
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