import VuiEmpty from "../../empty";
import Locale from "../../../mixins/locale";
import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiSelectEmpty = {
  name: "vui-select-empty",
  components: {
    VuiEmpty
  },
  mixins: [
    Locale
  ],
  props: {
    classNamePrefix: PropTypes.string,
    notFoundText: PropTypes.string
  },
  render(h) {
    const { $props: props, t: translate } = this;

    // notFoundText
    const notFoundText = props.notFoundText || translate("vui.select.notFound");

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "empty");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    // render
    return (
      <div class={classes.el}>
        <VuiEmpty size="small" description={notFoundText} />
      </div>
    );
  }
};

export default VuiSelectEmpty;