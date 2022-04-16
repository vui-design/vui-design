import is from "../../../utils/is";

/**
* 从 children 中解析获取步骤列表
* @param {Object} parent 父组件
* @param {Array} children 子组件
* @param {String} tagName 组件名称
*/
export const getStepsFromChildren = (parent, children, tagName = "vui-step") => {
  let steps = [];

  if (!is.array(children)) {
    return steps;
  }

  children.forEach(node => {
    if (!node) {
      return;
    }

    const component = node.componentOptions;

    if (!component || !component.Ctor) {
      return;
    }

    const { tag, propsData: props, children: elements } = component;

    if (tag === tagName && is.json(props)) {
      let step = {
        ...props,
        index: steps.length
      };

      // 设置 step 的 status 属性
      if (!step.status) {
        if (step.index < parent.step) {
          step.status = "finish";
        }
        else if (step.index === parent.step) {
          step.status = parent.status;
        }
        else if (step.index > parent.step) {
          step.status = "wait";
        }
      }

      if (elements) {
        elements.forEach(element => {
          if (!element) {
            return;
          }

          if (element.data && element.data.slot) {
            const slot = element.data.slot;

            // icon
            if (slot === "icon") {
              if (element.data.attrs) {
                delete element.data.attrs.slot;
              }

              if (element.tag === "template") {
                if (is.array(step.icon)) {
                  step.icon.push.apply(step.icon, element.children);
                }
                else {
                  step.icon = element.children;
                }
              }
              else {
                if (is.array(step.icon)) {
                  step.icon.push(element);
                }
                else {
                  step.icon = [element];
                }
              }
            }
            // title
            else if (slot === "title") {
              if (element.data.attrs) {
                delete element.data.attrs.slot;
              }

              if (element.tag === "template") {
                if (is.array(step.title)) {
                  step.title.push.apply(step.icon, element.children);
                }
                else {
                  step.title = element.children;
                }
              }
              else {
                if (is.array(step.title)) {
                  step.title.push(element);
                }
                else {
                  step.title = [element];
                }
              }
            }
            // description
            else if (slot === "description") {
              if (element.data.attrs) {
                delete element.data.attrs.slot;
              }

              if (element.tag === "template") {
                if (is.array(step.description)) {
                  step.description.push.apply(step.icon, element.children);
                }
                else {
                  step.description = element.children;
                }
              }
              else {
                if (is.array(step.description)) {
                  step.description.push(element);
                }
                else {
                  step.description = [element];
                }
              }
            }
          }
        });
      }

      steps.push(step);
    }
  });

  return steps;
};

/**
* 默认导出指定接口
*/
export default {
  getStepsFromChildren
};