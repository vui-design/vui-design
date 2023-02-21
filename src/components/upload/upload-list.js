import VuiIcon from "../icon";
import VuiProgress from "../progress";
import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    list: PropTypes.array.def([]),
    listType: PropTypes.oneOf(["text", "picture", "picture-card"]).def("text"),
    beforeRemove: PropTypes.func,
    disabled: PropTypes.bool.def(false)
  };
};

export default {
  name: "vui-upload-list",
  components: {
    VuiIcon,
    VuiProgress
  },
  props: createProps(),
  methods: {
    handlePreview(item) {
      this.$emit("preview", item);
    },
    handleRemove(item) {
      const { $props: props } = this;
      const remove = () => {
        this.$emit("remove", item);
      };

      if (!props.beforeRemove) {
        return remove();
      }

      const promise = props.beforeRemove(item, props.list);

      if (promise && promise.then) {
        promise.then(() => remove(), () => {});
      }
      else if (promise !== false) {
        remove();
      }
    }
  },
  render(h) {
    const { $props: props } = this;
    const { handlePreview, handleRemove } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "list");
    let classes = {};

    classes.el = `${classNamePrefix}`;
    classes.elItem = status => {
      return {
        [`${classNamePrefix}-item`]: true,
        [`${classNamePrefix}-item-${status}`]: status
      };
    };
    classes.elItemThumbnail = `${classNamePrefix}-item-thumbnail`;
    classes.elItemName = `${classNamePrefix}-item-name`;
    classes.elItemPercentage = `${classNamePrefix}-item-percentage`;
    classes.elItemActions = `${classNamePrefix}-item-actions`;
    classes.elItemActionPreview = {
      [`${classNamePrefix}-item-action`]: true,
      [`${classNamePrefix}-item-action-preview`]: true
    };
    classes.elItemActionRemove = {
      [`${classNamePrefix}-item-action`]: true,
      [`${classNamePrefix}-item-action-remove`]: true
    };

    // render
    return (
      <ul class={classes.el}>
        {
          props.list.map(item => {
            let children = [];

            children.push(
              <div class={classes.elItemThumbnail}>
                {
                  props.listType === "text" ? (
                    <VuiIcon type={item.status === "progress" ? "loading" : "attachment"} />
                  ) : (
                    <img src={item.url} alt={item.name} />
                  )
                }
              </div>
            );

            if (props.listType !== "picture-card") {
              children.push(
                <div class={classes.elItemName}>{item.name}</div>
              );
            }

            if (props.listType === "text" && !props.disabled) {
              children.push(
                <div class={classes.elItemActions}>
                  <a href="javascript:;" class={classes.elItemActionRemove} onClick={e => handleRemove(item)}>
                    <VuiIcon type="dustbin" />
                  </a>
                </div>
              );
            }
            else if (props.listType === "picture" || props.listType === "picture-card") {
              let actions = [];

              actions.push(
                <a href="javascript:;" class={classes.elItemActionPreview} onClick={e => handlePreview(item)}>
                  <VuiIcon type="eye" />
                </a>
              );

              if (!props.disabled) {
                actions.push(
                  <a href="javascript:;" class={classes.elItemActionRemove} onClick={e => handleRemove(item)}>
                  <VuiIcon type="dustbin" />
                </a>
                );
              }

              children.push(
                <div class={classes.elItemActions}>
                  {actions}
                </div>
              );
            }

            if (item.status === "progress") {
              children.push(
                <div class={classes.elItemPercentage}>
                  <VuiProgress
                    type={props.listType === "picture-card" ? "circle" : "line"}
                    strokeWidth={2}
                    width={48}
                    percentage={item.percentage}
                    showInfo={false}
                  />
                </div>
              );
            }

            return (
              <li key={item.id} class={classes.elItem(item.status)}>
                {children}
              </li>
            );
          })
        }
      </ul>
    );
  }
};