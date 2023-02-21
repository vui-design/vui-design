import VuiSpin from "../spin";
import Locale from "../../mixins/locale";
import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    loadingText: PropTypes.string
  };
};

export default {
  name: "vui-select-spin",
  components: {
    VuiSpin
  },
  mixins: [
    Locale
  ],
  props: createProps(),
  render(h) {
    const { $props: props, t: translate } = this;

    // loadingText
    const loadingText = props.loadingText || translate("vui.select.loading");

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "spin");
    let classes = {};

    classes.el = `${classNamePrefix}`;
    classes.elMessage = `${classNamePrefix}-message`;

    // render
    return (
      <div class={classes.el}>
        <VuiSpin size="small" />
        <div class={classes.elMessage}>{loadingText}</div>
      </div>
    );
  }
};