import is from "../../../utils/is";

/**
* 从 children 中解析获取 steps 步骤列表
* @param {Array} props 组件属性
* @param {Boolean} children 子组件
*/
export const getStepsFromChildren = (props, children) => {
  let steps = [];

  if (!is.array(children)) {
    return steps;
  }

  children.forEach(node => {
    if (!node) {
      return;
    }

    let component = node.componentOptions;

    if (component && component.tag === "vui-step" && component.propsData) {
      let step = {
        ...component.propsData,
        index: steps.length
      };

      if (!step.status) {
        if (step.index < props.step) {
          step.status = "finish";
        }
        else if (step.index === props.step) {
          step.status = props.status;
        }
        else if (step.index > props.step) {
          step.status = "wait";
        }
      }

      if (component.children) {
        component.children.forEach(element => {
          if (!element) {
            return;
          }

          let data = element.data;

          if (!data) {
            return;
          }

          if (data.slot === "icon") {
            if (is.array(step.icon)) {
              step.icon.push(element);
            }
            else {
              step.icon = [element];
            }
          }
          else if (data.slot === "title") {
            if (is.array(step.title)) {
              step.title.push(element);
            }
            else {
              step.title = [element];
            }
          }
          else if (data.slot === "description") {
            if (is.array(step.description)) {
              step.description.push(element);
            }
            else {
              step.description = [element];
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