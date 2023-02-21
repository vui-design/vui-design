import VuiTabs from "./tabs";
import { createProps } from "./tabs";
import is from "../../utils/is";
import withInstall from "../../utils/withInstall";
import utils from "./utils";

export { createProps };
export default withInstall({
  name: VuiTabs.name,
  components: {
    VuiTabs
  },
  model: {
    prop: "activeKey",
    event: "input"
  },
  props: createProps(),
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
});