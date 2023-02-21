import VuiSkeletonAvatar from "./skeleton-avatar";
import VuiSkeletonTitle from "./skeleton-title";
import VuiSkeletonParagraph from "./skeleton-paragraph";
import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

function getComponentProps(property) {
  if (is.json(property)) {
    return property;
  }

  return {};
}

function getAvatarBasicProps(props) {
  if (props.title && !props.paragraph) {
    return {
      shape: "square"
    };
  }

  return {
    shape: "circle"
  };
}

function getTitleBasicProps(props) {
  if (!props.avatar && props.paragraph) {
    return {
      width: "40%"
    };
  }

  if (props.avatar && props.paragraph) {
    return {
      width: "50%"
    };
  }

  return {};
}

function getParagraphBasicProps(props) {
  let basicProps = {};

  if (!props.avatar || !props.title) {
    basicProps.width = "60%";
  }

  if (!props.avatar && props.title) {
    basicProps.rows = 3;
  }
  else {
    basicProps.rows = 2;
  }

  return basicProps;
}

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    loading: PropTypes.bool,
    animated: PropTypes.bool.def(false),
    avatar: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).def(false),
    title: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).def(true),
    paragraph: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).def(true)
  };
};

export default {
  name: "vui-skeleton",
  components: {
    VuiSkeletonAvatar,
    VuiSkeletonTitle,
    VuiSkeletonParagraph
  },
  props: createProps(),
  render() {
    const { $slots: slots, $props: props } = this;

    if (props.loading === false) {
      return (
        <div>{slots.default}</div>
      );
    }

    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "skeleton");
    let classes = {};

    classes.el = `${classNamePrefix}`;
    classes.elHeader = `${classNamePrefix}-header`;
    classes.elBody = `${classNamePrefix}-body`;

    let children = [];

    if (props.avatar) {
      const mergedAvatarProps = {
        props: {
          classNamePrefix: props.classNamePrefix,
          animated: props.animated,
          ...getAvatarBasicProps(props),
          ...getComponentProps(props.avatar)
        }
      };

      children.push(
        <div class={classes.elHeader}>
          <VuiSkeletonAvatar {...mergedAvatarProps} />
        </div>
      );
    }

    if (props.title || props.paragraph) {
      let title;

      if (props.title) {
        const mergedTitleProps = {
          props: {
            classNamePrefix: props.classNamePrefix,
            animated: props.animated,
            ...getTitleBasicProps(props),
            ...getComponentProps(props.title)
          }
        };

        title = (
          <VuiSkeletonTitle {...mergedTitleProps} />
        );
      }

      let paragraph;

      if (props.paragraph) {
        const mergedParagraphProps = {
          props: {
            classNamePrefix: props.classNamePrefix,
            animated: props.animated,
            ...getParagraphBasicProps(props),
            ...getComponentProps(props.paragraph)
          }
        };

        paragraph = (
          <VuiSkeletonParagraph {...mergedParagraphProps} />
        );
      }

      children.push(
        <div class={classes.elBody}>
          {title}
          {paragraph}
        </div>
      );
    }

    return (
      <div class={classes.el}>{children}</div>
    );
  }
};