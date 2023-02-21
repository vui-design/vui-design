import VuiEmpty from "../empty";
import Locale from "../../mixins/locale";
import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    notFoundText: PropTypes.string
  };
};

export default {
  name: "vui-cascader-empty",
  components: {
    VuiEmpty
  },
  mixins: [
    Locale
  ],
  props: createProps(),
  render(h) {
    const { $props: props, t: translate } = this;

    // notFoundText
    const notFoundText = props.notFoundText || translate("vui.cascader.notFound");

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "empty");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    // render
    return (
      <div class={classes.el}>
        <VuiEmpty description={notFoundText} />
      </div>
    );
  }
};