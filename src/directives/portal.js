import getContainer from "../utils/getContainer";

// Thanks to: https://github.com/calebroseland/vue-dom-portal
const map = new Map();

export default {
  inserted(element, binding) {
    const container = getContainer(binding.value);
    const homeplace = element.parentNode;
    const placeholder = document.createComment("");
    let moved = false;

    // 本次移动的目标父节点为空，或为原始父节点时不做任何操作
    if (container === null || container === homeplace) {

    }
    // 执行移动操作
    else {
      homeplace.replaceChild(placeholder, element);
      container.appendChild(element);
      moved = true;
    }

    map.set(element, { homeplace, placeholder, moved });
  },
  componentUpdated(element, binding) {
    const container = getContainer(binding.value);
    const history = map.get(element);
    const { homeplace, placeholder, moved } = history;

    // 之前已被移动过
    if (moved) {
      // 本次移动的目标父节点为空，或为原始父节点时恢复到原来的位置
      if (container === null || container === homeplace) {
        homeplace.replaceChild(element, placeholder);

        map.set(element, {
          ...history,
          moved: false
        });
      }
      // 本次移动的目标父节点为当前父节点时不做任何操作
      else if (container === element.parentNode) {

      }
      // 执行移动操作
      else {
        container.appendChild(element);
      }
    }
    // 之前未被移动过
    else {
      // 本次移动的目标父节点为空，或为原始父节点时不做任何操作
      if (container === null || container === homeplace) {

      }
      // 执行移动操作
      else {
        homeplace.replaceChild(placeholder, element);
        container.appendChild(element);

        map.set(element, {
          ...history,
          moved: true
        });
      }
    }
  },
  unbind(element) {
    const { homeplace, placeholder, moved } = map.get(element);

    // 指令解绑时，如果之前已被移动过，则恢复到原来的位置
    if (moved) {
      homeplace.replaceChild(element, placeholder);
    }

    map.delete(element);
  }
};