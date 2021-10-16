import PropTypes from "../../../utils/prop-types";
import utils from "./utils";

const VuiAuthorizer = {
  name: "vui-authorizer",
  functional: true,
  props: {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    authorize: PropTypes.func
  },
  render(h, context) {
    const { props, scopedSlots } = context;
    const isAllowed = utils.authorizer(props.value, props.authorize);
    const key = isAllowed ? "default" : "replacement";
    const scopedSlot = scopedSlots[key];

    return scopedSlot ? scopedSlot() : null;
  }
};

export default VuiAuthorizer;