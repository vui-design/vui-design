import VuiIcon from "../../icon";
import PropTypes from "../../../utils/prop-types";
import padEnd from "../../../utils/padEnd";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiRatio = {
  name: "vui-ratio",
  props: {
    classNamePrefix: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    denominator: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    precision: PropTypes.number.def(2),
    suffix: PropTypes.string.def("%"),
    replacement: PropTypes.string.def("NaN")
  },
  methods: {
    translate(value, precision, replacement) {
      const string = String(value);
      const matched = string.match(/^(-?)(\d*)(\.(\d+))?$/);

      if (value === 0 || matched === null) {
        return {
          direction: "",
          int: replacement,
          decimal: ""
        };
      }
      else {
        const negative = matched[1];
        const int = matched[2] || "0";
        let decimal = matched[4] || "";

        if (/^\d+$/.test(precision)) {
          decimal = padEnd(decimal, precision, "0").slice(0, precision);
        }

        if (decimal) {
          decimal = `.${decimal}`;
        }

        return {
          direction: negative ? "down" : "up",
          int,
          decimal
        };
      }
    }
  },

  render(h) {
    const { $props: props, translate } = this;

    // ratio
    const value = Number(props.value);
    const denominator = Number(props.denominator);
    let ratio = ((value - denominator) / denominator) * 100;

    ratio = translate(ratio, props.precision, props.replacement);

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "ratio");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${ratio.direction}`]: ratio.direction
    };
    classes.elPrefix = `${classNamePrefix}-prefix`;
    classes.elSuffix = `${classNamePrefix}-suffix`;
    classes.elValue = `${classNamePrefix}-value`;

    // render
    let children = [];

    if (ratio.direction) {
      const iconType = "arrow-" + ratio.direction;

      children.push(
        <div class={classes.elPrefix}>
          <VuiIcon type={iconType} />
        </div>
      );
    }

    children.push(
      <div class={classes.elValue}>
        <big>{ratio.int}</big>
        {
          ratio.decimal ? (
            <small>{ratio.decimal}</small>
          ) : null
        }
      </div>
    );

    if (props.suffix && ratio.direction) {
      children.push(
        <div class={classes.elSuffix}>{props.suffix}</div>
      );
    }

    return (
      <div class={classes.el}>
        {children}
      </div>
    );
  }
};

export default VuiRatio;