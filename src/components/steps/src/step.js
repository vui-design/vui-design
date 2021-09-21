import PropTypes from "../../../utils/prop-types";

const VuiStep = {
  name: "vui-step",
  props: {
    icon: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.oneOf(["wait", "process", "finish", "error"])
  }
};

export default VuiStep;