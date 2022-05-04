import VuiIcon from "../../icon";
import VuiRow from "../../row";
import VuiCol from "../../col";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getValidElements from "../../../utils/getValidElements";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const gridCardLoadingBlocks = [
  [20],
  [8, 16],
  [4, 18],
  [12, 8],
  [8, 8, 8]
];

const VuiCard = {
  name: "vui-card",
  components: {
    VuiIcon,
    VuiRow,
    VuiCol
  },
  props: {
    classNamePrefix: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    extra: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cover: PropTypes.string,
    bordered: PropTypes.bool.def(true),
    shadow: PropTypes.oneOf(["never", "hover", "always"]).def("never"),
    headerStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    bodyStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    footerStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    loading: PropTypes.bool.def(false)
  },
  methods: {
    withCardGrids(children = [], tagName = "vui-card-grid") {
      let bool = false;

      children.forEach(element => {
        if (!element) {
          return;
        }

        const options = element.componentOptions;

        if (!options) {
          return;
        }

        if (options && options.tag === tagName) {
          bool = true;
        }
      });

      return bool;
    }
  },
  render(h) {
    const { $slots: slots, $props: props } = this;
    const withCardGrids = this.withCardGrids(slots.default);

    // icon
    let icon;

    if (slots.icon) {
      icon = slots.icon;
    }
    else if (props.icon) {
      icon = (
        <VuiIcon type={props.icon} />
      );
    }

    // title
    const title = slots.title || props.title;

    // extra
    const extra = slots.extra || props.extra;

    // cover
    let cover;

    if (slots.cover) {
      cover = slots.cover;
    }
    else if (props.cover) {
      cover = (
        <img src={props.cover} />
      );
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "card");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-bordered`]: props.bordered,
      [`${classNamePrefix}-shadow-${props.shadow}`]: props.shadow,
      [`${classNamePrefix}-with-grid`]: withCardGrids
    };
    classes.elHeader = `${classNamePrefix}-header`;
    classes.elIcon = `${classNamePrefix}-icon`;
    classes.elTitle = `${classNamePrefix}-title`;
    classes.elExtra = `${classNamePrefix}-extra`;
    classes.elCover = `${classNamePrefix}-cover`;
    classes.elBody = `${classNamePrefix}-body`;
    classes.elLoading = `${classNamePrefix}-loading`;
    classes.elLoadingRow = `${classNamePrefix}-loading-row`;
    classes.elLoadingBlock = `${classNamePrefix}-loading-block`;
    classes.elActions = `${classNamePrefix}-actions`;
    classes.elAction = `${classNamePrefix}-action`;
    classes.elActionDivider = `${classNamePrefix}-action-divider`;
    classes.elFooter = `${classNamePrefix}-footer`;

    // render
    let children = [];

    if (icon || title || extra) {
      let header = [];

      if (icon) {
        header.push(
          <div class={classes.elIcon}>{icon}</div>
        );
      }

      if (title) {
        header.push(
          <div class={classes.elTitle}>{title}</div>
        );
      }

      if (extra) {
        header.push(
          <div class={classes.elExtra}>{extra}</div>
        );
      }

      children.push(
        <div class={classes.elHeader} style={props.headerStyle}>{header}</div>
      );
    }

    if (cover) {
      children.push(
        <div class={classes.elCover}>{cover}</div>
      );
    }

    let body;

    if (!props.loading) {
      body = slots.default;
    }
    else if (slots.loading) {
      body = slots.loading;
    }
    else {
      body = (
        <div class={classes.elLoading}>
          {
            gridCardLoadingBlocks.map(row => {
              return (
                <VuiRow gutter={8} class={classes.elLoadingRow}>
                  {
                    row.map(col => {
                      return (
                        <VuiCol span={col}>
                          <div class={classes.elLoadingBlock}></div>
                        </VuiCol>
                      );
                    })
                  }
                </VuiRow>
              );
            })
          }
        </div>
      );
    }

    children.push(
      <div class={classes.elBody} style={props.bodyStyle}>{body}</div>
    );

    if (slots.actions) {
      const elements = getValidElements(slots.actions);
      let actions = [];

      elements.forEach((element, index) => {
        if (index > 0) {
          actions.push(
            <i class={classes.elActionDivider} />
          );
        }

        actions.push(
          <div class={classes.elAction}>{element}</div>
        );
      });

      children.push(
        <div class={classes.elActions}>{actions}</div>
      );
    }

    if (slots.footer) {
      children.push(
        <div class={classes.elFooter} style={props.footerStyle}>{slots.footer}</div>
      );
    }

    return (
      <div class={classes.el}>{children}</div>
    );
  }
};

export default VuiCard;