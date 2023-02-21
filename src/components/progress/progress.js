import VuiIcon from "../icon";
import PropTypes from "../../utils/prop-types";
import clamp from "../../utils/clamp";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    type: PropTypes.oneOf(["line", "circle", "dashboard"]).def("line"),
    size: PropTypes.oneOf(["small", "medium", "large"]).def("medium"),
    percentage: PropTypes.number.def(0),
    status: PropTypes.oneOf(["normal", "active", "exception", "success"]).def("normal"),
    trackColor: PropTypes.string,
    strokeColor: PropTypes.string,
    strokeWidth: PropTypes.number,
    strokeLinecap: PropTypes.oneOf(["round", "square"]).def("round"),
    width: PropTypes.number,
    gapDegree: PropTypes.number.def(75),
    formatter: PropTypes.func,
    showInfo: PropTypes.bool.def(true)
  };
};

const defaults = {
  width: {
    small: 80,
    medium: 120,
    large: 160
  },
  strokeWidth: {
    small: 6,
    medium: 8,
    large: 10
  }
};

export default {
  name: "vui-progress",
  components: {
    VuiIcon
  },
  props: createProps(),
  render(h) {
    const { $slots: slots, $props: props } = this;

    // percentage
    const percentage = clamp(props.percentage, 0, 100);

    // status
    let status = props.status;

    if (percentage === 100 && status === "normal") {
      status = "success";
    }

    // width
    let width = props.width;

    if (props.type !== "line" && !width) {
      width = defaults.width[props.size];
    }

    // strokeWidth
    let strokeWidth = props.strokeWidth;

    if (!strokeWidth) {
      strokeWidth = defaults.strokeWidth[props.size];
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "progress");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.type}`]: props.type,
      [`${classNamePrefix}-with-info`]: props.showInfo,
      [`${classNamePrefix}-${props.size}`]: props.size,
      [`${classNamePrefix}-status-${status}`]: status
    };

    // style
    let styles = {};

    // render
    if (props.type === "line") {
      classes.elMain = `${classNamePrefix}-main`;
      classes.elMainTrach = `${classNamePrefix}-main-track`;
      classes.elMainThumb = `${classNamePrefix}-main-thumb`;

      styles.elMainTrack = {
        height: `${strokeWidth}px`,
        borderRadius: `${props.strokeLinecap === "round" ? strokeWidth : 0}px`,
        backgroundColor: props.trackColor
      };
      styles.elMainThumb = {
        width: `${percentage}%`,
        height: `${strokeWidth}px`,
        borderRadius: `${props.strokeLinecap === "round" ? strokeWidth : 0}px`,
        backgroundColor: props.strokeColor
      };

      let children = [];

      children.push(
        <div class={classes.elMain}>
          <div class={classes.elMainTrach} style={styles.elMainTrack}>
            <div class={classes.elMainThumb} style={styles.elMainThumb}></div>
          </div>
        </div>
      );

      if (props.showInfo) {
        let info;

        if (props.formatter) {
          info = props.formatter(percentage);
        }
        else if (status === "exception") {
          info = (
            <VuiIcon type="crossmark-circle-filled" />
          );
        }
        else if (status === "success") {
          info = (
            <VuiIcon type="checkmark-circle-filled" />
          );
        }
        else {
          info = `${percentage}%`;
        }

        classes.elInfo = `${classNamePrefix}-info`;
        styles.elInfo = {
          color: status !== "normal" && props.strokeColor ? props.strokeColor : undefined
        };

        children.push(
          <div class={classes.elInfo} style={styles.elInfo}>
            {info}
          </div>
        );
      }

      return (
        <div class={classes.el}>
          {children}
        </div>
      );
    }
    else if (props.type === "circle" || props.type === "dashboard") {
      strokeWidth = Number((strokeWidth / width * 100).toFixed(2));

      const radius = 50 - strokeWidth / 2;
      const perimeter = 2 * Math.PI * radius;
      let directive;

      if (props.type === "circle") {
        directive = `M 50,50 m 0,-${radius} a ${radius},${radius} 0 1 1 0,${radius * 2} a ${radius},${radius} 0 1 1 0,-${radius * 2}`;
      }
      else if (props.type === "dashboard") {
        directive = `M 50,50 m 0,${radius} a ${radius},${radius} 0 1 1 0,-${radius * 2} a ${radius},${radius} 0 1 1 0,${radius * 2}`;
      }

      classes.elMain = `${classNamePrefix}-main`;
      classes.elMainTrach = `${classNamePrefix}-main-track`;
      classes.elMainThumb = `${classNamePrefix}-main-thumb`;

      styles.el = {
        width: `${width}px`,
        height: `${width}px`
      };
      styles.elMainTrack = {
        strokeWidth: `${strokeWidth}px`,
        strokeLinecap: props.strokeLinecap,
        stroke: props.trackColor
      };
      styles.elMainThumb = {
        stroke: props.strokeColor,
        strokeWidth: `${percentage === 0 ? 0 : strokeWidth}px`,
        strokeLinecap: props.strokeLinecap,
        transition: `stroke 0.2s ease 0s, stroke-width 0s ease ${percentage === 0 ? 0.2 : 0}s, stroke-dasharray 0.2s ease 0s, stroke-dashoffset 0.2s ease 0s`
      };

      if (props.type === "circle") {
        styles.elMainTrack.strokeDasharray = `${perimeter}px, ${perimeter}px`;
        styles.elMainTrack.strokeDashoffset = `0px`;
        styles.elMainThumb.strokeDasharray = `${percentage / 100 * perimeter}px, ${perimeter}px`;
        styles.elMainThumb.strokeDashoffset = `0px`;
      }
      else if (props.type === "dashboard") {
        const gapDegree = clamp(props.gapDegree, 0, 295);

        styles.elMainTrack.strokeDasharray = `${perimeter - gapDegree}px, ${perimeter}px`;
        styles.elMainTrack.strokeDashoffset = `-${gapDegree / 2}px`;
        styles.elMainThumb.strokeDasharray = `${percentage / 100 * (perimeter - gapDegree)}px, ${perimeter}px`;
        styles.elMainThumb.strokeDashoffset = `-${gapDegree / 2}px`;
      }

      let children = [];

      children.push(
        <svg viewBox="0 0 100 100" class={classes.elMain}>
          <path d={directive} class={classes.elMainTrach} style={styles.elMainTrack}></path>
          <path d={directive} class={classes.elMainThumb} style={styles.elMainThumb}></path>
        </svg>
      );

      if (props.showInfo) {
        let info;

        if (props.formatter) {
          info = props.formatter(percentage);
        }
        else if (status === "exception") {
          info = (
            <VuiIcon type="crossmark" />
          );
        }
        else if (status === "success") {
          info = (
            <VuiIcon type="checkmark" />
          );
        }
        else {
          info = `${percentage}%`;
        }

        classes.elInfo = `${classNamePrefix}-info`;
        styles.elInfo = {
          color: status !== "normal" && props.strokeColor ? props.strokeColor : undefined
        };

        children.push(
          <div class={classes.elInfo} style={styles.elInfo}>
            {info}
          </div>
        );
      }

      return (
        <div class={classes.el} style={styles.el}>
          {children}
        </div>
      );
    }
  }
};