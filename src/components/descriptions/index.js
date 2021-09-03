import VuiDescriptions from "./src/descriptions";
import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import utils from "./src/utils";

const VuiDescriptionsWrapper = {
  name: VuiDescriptions.name,
  components: {
    VuiDescriptions
  },
  props: {
    classNamePrefix: PropTypes.string,
    layout: PropTypes.oneOf(["horizontal", "vertical"]).def("horizontal"),
    bordered: PropTypes.bool.def(false),
    size: PropTypes.oneOf(["small", "medium", "large"]).def("medium"),
    columns: PropTypes.number.def(3),
    colon: PropTypes.bool,
    labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    labelAlign: PropTypes.oneOf(["left", "center", "right"]),
    title: PropTypes.any,
    extra: PropTypes.any,
    equivalent: PropTypes.bool.def(false)
  },
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
};

VuiDescriptionsWrapper.install = function(Vue) {
	Vue.component(VuiDescriptionsWrapper.name, VuiDescriptionsWrapper);
};

export default VuiDescriptionsWrapper;