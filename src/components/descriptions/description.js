import PropTypes from "../../utils/prop-types";

export const createProps = () => {
  return {
    label: PropTypes.string,
    span: PropTypes.number
  };
};

export default {
  name: "vui-description",
  props: createProps()
};