import { on, once } from "../utils/dom";

export default {
  bind(el, binding, vnode) {
    let interval = null;
    let startTime;

    const handler = () => {
      return binding.value.apply();
    };
    const clear = () => {
      if (new Date() - startTime < 100) {
        handler();
      }

      clearInterval(interval);
      interval = null;
    };

    on(el, "mousedown", e => {
      if (e.button !== 0) {
        return;
      }

      startTime = new Date();

      once(document, "mouseup", clear);

      clearInterval(interval);
      interval = setInterval(handler, 100);
    });
  }
};