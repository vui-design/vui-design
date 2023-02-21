import VuiDescriptions from "./descriptions";
import { createProps } from "./descriptions";
import withInstall from "../../utils/withInstall";
import utils from "./utils";

export { createProps };
export default withInstall({
  name: VuiDescriptions.name,
  components: {
    VuiDescriptions
  },
  props: createProps(),
  render() {
    const { $slots: slots, $props: props } = this;
    const attributes = {
      props: {
        ...props,
        title: slots.title || props.title,
        extra: slots.extra || props.extra,
        data: utils.getDataFromChildren(slots.default)
      }
    };

    return (
      <VuiDescriptions {...attributes} />
    );
  }
});