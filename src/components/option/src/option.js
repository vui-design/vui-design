import PropTypes from "../../../utils/prop-types";

const VuiOption = {
  name: "vui-option",
  props: {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
    disabled: PropTypes.bool.def(false)
  }
};

export default VuiOption;