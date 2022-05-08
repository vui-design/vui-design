import PropTypes from "../../../utils/prop-types";
import utils from "./utils";

const VuiAuthorizer = {
  name: "vui-authorizer",
  functional: true,
  props: {
    authorize: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  },
  render(h, context) {
    const { props, scopedSlots } = context;
    const { attrs } = context.data;
    const isAllowed = utils.authorizer(props.authorize, props.value, attrs);
    const scopedSlotKey = isAllowed ? "default" : "replacement";
    const scopedSlot = scopedSlots[scopedSlotKey];

    return scopedSlot ? scopedSlot() : null;
  }
};

export default VuiAuthorizer;