import VuiSteps from "./src/steps";
import PropTypes from "../../utils/prop-types";
import utils from "./src/utils";

const VuiStepsWrapper = {
  name: VuiSteps.name,
  components: {
    VuiSteps
  },
  props: {
    classNamePrefix: PropTypes.string,
    type: PropTypes.oneOf(["default", "dot"]).def("default"),
    direction: PropTypes.oneOf(["horizontal", "vertical"]).def("horizontal"),
    size: PropTypes.oneOf(["small"]),
    step: PropTypes.number.def(0),
    status: PropTypes.oneOf(["wait", "process", "finish", "error"]).def("process"),
    changeOnTitle: PropTypes.bool.def(false)
  },
  render() {
    const { $slots: slots, $listeners: listeners, $props: props } = this;
    const attributes = {
      props: {
        ...props,
        steps: utils.getStepsFromChildren(props, slots.default)
      },
      on: {
        ...listeners
      }
    };

    return (
      <VuiSteps {...attributes} />
    );
  }
};

VuiStepsWrapper.install = function(Vue) {
  Vue.component(VuiStepsWrapper.name, VuiStepsWrapper);
};

export default VuiStepsWrapper;