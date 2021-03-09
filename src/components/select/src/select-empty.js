import VuiEmpty from "vui-design/components/empty";
import Locale from "vui-design/mixins/locale";
import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

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