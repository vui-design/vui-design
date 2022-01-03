import guid from "../utils/guid";
import is from "../utils/is";
import { on } from "../utils/dom";

let nodeList = [];
let context = "vue-outclick-context";
let createDocumentHandler = function(el, binding, vnode) {
  return function(e) {
    if (!e.target || el.contains(e.target)) {
      return;
    }

    el[context] && el[context].method && el[context].method(e);
  };
};

!is.server && on(document, "mousedown", function(e) {
  nodeList.forEach(node => node[context].documentHandler(e));
});

export default {
  bind(el, binding, vnode) {
    nodeList.push(el);

    el[context] = {
      id: guid(),
      documentHandler: createDocumentHandler(el, binding, vnode),
      method: binding.value
    };
  },
  update(el, binding, vnode) {
    el[context].documentHandler = createDocumentHandler(el, binding, vnode);
    el[context].method = binding.value;
  },
  unbind(el) {
    let i = 0;
    let length = nodeList.length;

    for (; i < length; i++) {
      let node = nodeList[i];

      if (node[context].id === el[context].id) {
        nodeList.splice(i, 1);
        break;
      }
    }

    delete el[context];
  }
};