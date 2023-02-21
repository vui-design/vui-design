import VuiTooltip from "../tooltip";
import VuiAvatar from "../avatar";
import VuiSpace from "../space";
import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";
import getValidElements from "../../utils/getValidElements";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    shape: PropTypes.oneOf(["circle", "square"]).def("circle"),
    size: PropTypes.oneOfType([PropTypes.oneOf(["small", "medium", "large"]), PropTypes.number]).def("medium"),
    maxCount: PropTypes.number,
    maxTooltipColor: PropTypes.oneOf(["light", "dark"]).def("light"),
    maxTooltipPlacement: PropTypes.oneOf(["top", "bottom"]).def("top")
  };
};

export default {
  name: "vui-avatar-group",
  provide() {
    return {
      vuiAvatarGroup: this
    };
  },
  components: {
    VuiTooltip,
    VuiAvatar,
    VuiSpace
  },
  props: createProps(),
  render() {
    const { $slots: slots, $props: props } = this;
    const maxCount = props.maxCount && props.maxCount > 0 ? props.maxCount : 0;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "avatar-group");
    let classes = {};

    classes.el = `${classNamePrefix}`;
    classes.elItem = `${classNamePrefix}-item`;
    classes.elPlaceholder = `${classNamePrefix}-placeholder`;
    classes.elTooltipContent = `${classNamePrefix}-tooltip-content`;

    // render
    const avatars = getValidElements(slots.default);
    const overflowedCount = avatars.length - maxCount;
    let children = [];

    avatars.forEach((avatar, index) => {
      if (maxCount && index >= maxCount) {
        return;
      }

      children.push(
        <div class={classes.elItem}>{avatar}</div>
      );
    });

    if (maxCount && overflowedCount > 0) {
      children.push(
        <div class={classes.elPlaceholder}>
          <VuiTooltip color={props.maxTooltipColor} placement={props.maxTooltipPlacement}>
            <VuiAvatar>&#43;{overflowedCount}</VuiAvatar>
            <div slot="content" class={classes.elTooltipContent}>
              <VuiSpace size="small">{avatars.slice(maxCount)}</VuiSpace>
            </div>
          </VuiTooltip>
        </div>
      );
    }

    return (
      <div class={classes.el}>
        {children}
      </div>
    );
  }
};