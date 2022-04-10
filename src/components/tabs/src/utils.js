import is from "../../../utils/is";

/**
* 从 children 中解析获取面板列表
* @param {Object} parent 父组件
* @param {Array} children 子组件
* @param {String} tagName 组件名称
*/
export const getTabsFromChildren = (parent, children, tagName = "vui-tab-panel") => {
  let tabs = [];

  if (!children) {
    return tabs;
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
      let tabpanel = {
        ...props,
        index: tabs.length
      };

      // 设置 panel 的唯一 key 值
      const key = node.key;

      if (is.effective(key)) {
        tabpanel.key = key;
      }
      else {
        tabpanel.key = tabpanel.index;
      }

      // 设置 panel 的关闭属性，只有显示的定义为 false，才禁止关闭，默认继承于 VuiTabs 的 closable 属性
      const closable = props.closable;

      if (closable === false) {
        tabpanel.closable = false;
      }
      else {
        tabpanel.closable = parent.closable;
      }

      // 设置 panel 的禁用属性
      const disabled = props.disabled;

      if (disabled === undefined || disabled === null || disabled === false) {
        tabpanel.disabled = false;
      }
      else {
        tabpanel.disabled = true;
      }

      // 分离 panel 的内容元素，因为内容可能包含了图标或标题等自定义插槽
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
                if (is.array(tabpanel.icon)) {
                  tabpanel.icon.push.apply(tabpanel.icon, element.children);
                }
                else {
                  tabpanel.icon = element.children;
                }
              }
              else {
                if (is.array(tabpanel.icon)) {
                  tabpanel.icon.push(element);
                }
                else {
                  tabpanel.icon = [element];
                }
              }
            }
            // title
            else if (slot === "title") {
              if (element.data.attrs) {
                delete element.data.attrs.slot;
              }

              if (element.tag === "template") {
                if (is.array(tabpanel.title)) {
                  tabpanel.title.push.apply(tabpanel.icon, element.children);
                }
                else {
                  tabpanel.title = element.children;
                }
              }
              else {
                if (is.array(tabpanel.title)) {
                  tabpanel.title.push(element);
                }
                else {
                  tabpanel.title = [element];
                }
              }
            }
          }
          else {
            if (is.array(tabpanel.children)) {
              tabpanel.children.push(element);
            }
            else {
              tabpanel.children = [element];
            }
          }
        });
      }

      tabs.push(tabpanel);
    }
  });

  return tabs;
};

/**
* 默认导出指定接口
*/
export default {
  getTabsFromChildren
};