import PropTypes from "../../../utils/prop-types";

const VuiOptionGroup = {
  name: "vui-option-group",
  props: {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    disabled: PropTypes.bool.def(false)
  }
};

export default VuiOptionGroup;