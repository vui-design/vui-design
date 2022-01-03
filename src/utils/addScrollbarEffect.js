import getScrollbarSize from "./getScrollbarSize";

/**
* Modal、Drawer 等弹窗组件弹出时，添加滚动条占位符
*/
export default function addScrollbarEffect(container) {
  if (container === undefined || container === document.body) {
    let fullWindowWidth = window.innerWidth;

    // workaround for missing window.innerWidth in IE8
    if (!fullWindowWidth) {
      const documentElementRect = document.documentElement.getBoundingClientRect();

      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }

    const isOverflowed = document.body.clientWidth < fullWindowWidth;

    if (!isOverflowed) {
      return;
    }

    const size = getScrollbarSize();

    if (!size) {
      return;
    }

    document.body.style.paddingRight = size + "px";
    document.body.style.overflow = "hidden";

    return {
      remove() {
        document.body.style.paddingRight = "";
        document.body.style.overflow = "";
      }
    };
  }
  else {
    const isOverflowed = container.clientWidth < container.offsetWidth;

    if (!isOverflowed) {
      return;
    }

    const size = getScrollbarSize();

    if (!size) {
      return;
    }

    container.scrollTop = 0;
    container.scrollLeft = 0;
    container.style.paddingRight = `${size}px`;
    container.style.overflow = "hidden";

    return {
      remove() {
        container.style.paddingRight = "";
        container.style.overflow = "";
      }
    };
  }
};