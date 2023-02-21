import VuiRow from "../row";
import VuiCol from "../col";
import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

const gridType = {
  gutter: PropTypes.number,
  column: PropTypes.oneOf([1, 2, 3, 4, 6, 8, 12, 24])
};

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    header: PropTypes.string,
    footer: PropTypes.string,
    layout: PropTypes.oneOf(["horizontal", "vertical"]).def("horizontal"),
    size: PropTypes.oneOf(["small", "medium", "large"]).def("medium"),
    bordered: PropTypes.bool.def(false),
    split: PropTypes.bool.def(true),
    grid: PropTypes.shape(gridType),
    data: PropTypes.array
  };
};

export default {
  name: "vui-list",
  provide() {
    return {
      vuiList: this
    };
  },
  components: {
    VuiRow,
    VuiCol
  },
  props: createProps(),
  render(h) {
    const { $slots: slots, $scopedSlots: scopedSlots, $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "list");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.layout}`]: props.layout,
      [`${classNamePrefix}-${props.size}`]: props.size,
      [`${classNamePrefix}-bordered`]: props.bordered && !props.grid,
      [`${classNamePrefix}-split`]: props.split,
      [`${classNamePrefix}-grid`]: props.grid
    };
    classes.elHeader = `${classNamePrefix}-header`;
    classes.elBody = `${classNamePrefix}-body`;
    classes.elMore = `${classNamePrefix}-more`;
    classes.elFooter = `${classNamePrefix}-footer`;

    // render
    let children = [];

    if (slots.header || props.header) {
      children.push(
        <div class={classes.elHeader}>
          {slots.header || props.header}
        </div>
      );
    }

    if (props.grid && props.data && props.data.length > 0) {
      const gutter = props.grid.gutter || 16;
      const column = props.grid.column || 4;
      const span = Math.round(24 / column);
      let cols = [];

      props.data.forEach((item, index) => {
        const scopedSlot = scopedSlots.item;
        const content = scopedSlot && scopedSlot(item, index);
        const style = {
          marginTop: index < column ? `0px` : `${gutter}px`
        };

        cols.push(
          <VuiCol span={span} style={style}>
            {content}
          </VuiCol>
        );
      });

      children.push(
        <div class={classes.elBody}>
          <VuiRow gutter={gutter}>
            {cols}
          </VuiRow>
        </div>
      );
    }
    else {
      children.push(
        <div class={classes.elBody}>
          {slots.default}
          {
            slots.more && (
              <div class={classes.elMore}>{slots.more}</div>
            )
          }
        </div>
      );
    }

    if (slots.footer || props.footer) {
      children.push(
        <div class={classes.elFooter}>
          {slots.footer || props.footer}
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