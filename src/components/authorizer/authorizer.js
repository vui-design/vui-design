import PropTypes from "../../utils/prop-types";
import utils from "./utils";

export const createProps = () => {
  return {
    authorize: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  };
};

export default {
  name: "vui-authorizer",
  functional: true,
  props: createProps(),
  render(h, context) {
    const { props, scopedSlots } = context;
    const { attrs } = context.data;
    const isAllowed = utils.authorizer(props.authorize, props.value, attrs);
    const scopedSlotKey = isAllowed ? "default" : "replacement";
    const scopedSlot = scopedSlots[scopedSlotKey];

    return scopedSlot ? scopedSlot() : null;
  }
};