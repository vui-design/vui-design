import VuiAvatar from "../../avatar";
import VuiBreadcrumb from "../../breadcrumb";
import VuiBreadcrumbItem from "../../breadcrumb";
import VuiIcon from "../../icon";
import VuiTag from "../../tag";
import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiPageHeader = {
  name: "vui-page-header",
  components: {
    VuiAvatar,
    VuiBreadcrumb,
    VuiBreadcrumbItem,
    VuiIcon,
    VuiTag
  },
  props: {
    classNamePrefix: PropTypes.string,
    breadcrumb: PropTypes.array,
    backIcon: PropTypes.string,
    avatar: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    tags: PropTypes.array,
    ghost: PropTypes.bool.def(true)
  },
  methods: {
    handleBack(e) {
      this.$emit("back", e);
    }
  },
  render() {
    const { $slots: slots, $listeners: listeners, $props: props } = this;
    const { handleBack } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "page-header");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-with-footer`]: slots.footer,
      [`${classNamePrefix}-ghost`]: props.ghost
    };
    classes.elBreadcrumb = `${classNamePrefix}-breadcrumb`;
    classes.elHeader = `${classNamePrefix}-header`;
    classes.elHeaderContent = `${classNamePrefix}-header-content`;
    classes.elHeaderExtra = `${classNamePrefix}-header-extra`;
    classes.elBack = `${classNamePrefix}-back`;
    classes.elAvatar = `${classNamePrefix}-avatar`;
    classes.elTitle = `${classNamePrefix}-title`;
    classes.elSubTitle = `${classNamePrefix}-sub-title`;
    classes.elTags = `${classNamePrefix}-tags`;
    classes.elBody = `${classNamePrefix}-body`;
    classes.elFooter = `${classNamePrefix}-footer`;

    // breadcrumb
    let breadcrumb;

    if (slots.breadcrumb) {
      breadcrumb = slots.breadcrumb;
    }
    else if (props.breadcrumb) {
      breadcrumb = (
        <VuiBreadcrumb>
          {
            props.breadcrumb.map((item, index) => {
              const attributes = {
                key: index,
                props: {
                  href: item.href,
                  to: item.to,
                  replace: item.replace,
                  append: item.append,
                  target: item.target
                }
              };

              return (
                <VuiBreadcrumbItem {...attributes}>{item.title}</VuiBreadcrumbItem>
              );
            })
          }
        </VuiBreadcrumb>
      );
    }

    // backIcon
    const showBackIcon = !!listeners.back;
    let backIcon;

    if (showBackIcon) {
      if (slots.backIcon) {
        backIcon = slots.backIcon;
      }
      else {
        const backIconType = props.backIcon || "arrow-left";

        backIcon = (
          <VuiIcon type={backIconType} />
        );
      }
    }

    // avatar
    let avatar;

    if (slots.avatar) {
      avatar = slots.avatar;
    }
    else if (props.avatar) {
      avatar = (
        <VuiAvatar src={props.avatar} />
      );
    }

    // title
    const title = slots.title || props.title;

    // subTitle
    const subTitle = slots.subTitle || props.subTitle;

    // tags
    let tags;

    if (slots.tags) {
      tags = slots.tags;
    }
    else if (props.tags) {
      tags = props.tags.map((item, index) => {
        return (
          <VuiTag key={index} color={item.color}>{item.title}</VuiTag>
        );
      });
    }

    // render
    let children = [];

    if (breadcrumb) {
      children.push(
        <div class={classes.elBreadcrumb}>{breadcrumb}</div>
      );
    }

    if (backIcon || avatar || title || subTitle || tags || slots.extra) {
      let header = [];

      if (backIcon || avatar || title || subTitle || tags) {
        let headerContent = [];

        if (backIcon) {
          headerContent.push(
            <div class={classes.elBack} onClick={handleBack}>{backIcon}</div>
          );
        }

        if (avatar) {
          headerContent.push(
            <div class={classes.elAvatar}>{avatar}</div>
          );
        }

        if (title) {
          headerContent.push(
            <div class={classes.elTitle}>{title}</div>
          );
        }

        if (subTitle) {
          headerContent.push(
            <div class={classes.elSubTitle}>{subTitle}</div>
          );
        }

        if (tags) {
          headerContent.push(
            <div class={classes.elTags}>{tags}</div>
          );
        }

        if (headerContent.length) {
          header.push(
            <div class={classes.elHeaderContent}>{headerContent}</div>
          );
        }
      }

      if (slots.extra) {
        header.push(
          <div class={classes.elHeaderExtra}>{slots.extra}</div>
        );
      }

      children.push(
        <div class={classes.elHeader}>{header}</div>
      );
    }

    if (slots.default) {
      children.push(
        <div class={classes.elBody}>{slots.default}</div>
      );
    }

    if (slots.footer) {
      children.push(
        <div class={classes.elFooter}>{slots.footer}</div>
      );
    }

    return (
      <div class={classes.el}>{children}</div>
    );
  }
};

export default VuiPageHeader;