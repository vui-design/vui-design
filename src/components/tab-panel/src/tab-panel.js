import PropTypes from "../../../utils/prop-types";

const VuiTabPanel = {
  name: "vui-tab-panel",
  props: {
    icon: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func]),
    closable: PropTypes.bool,
    disabled: PropTypes.bool.def(false)
  }
};

export default VuiTabPanel;