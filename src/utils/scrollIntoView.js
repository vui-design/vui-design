import is from "./is";

/**
* @param {HTMLElement} view
* @param {HTMLElement} target
*/
export default function scrollIntoView(view, target) {
  if (is.server) {
    return;
  }

  if (!target) {
    return view.scrollTop = 0;
  }

  let offsetParents = [];
  let offsetParent = target.offsetParent;

  while (offsetParent && view !== offsetParent && view.contains(offsetParent)) {
    offsetParents.push(offsetParent);
    offsetParent = offsetParent.offsetParent;
  }

  const top = target.offsetTop + offsetParents.reduce((prev, curr) => (prev + curr.offsetTop), 0);
  const bottom = top + target.offsetHeight;
  const viewRectTop = view.scrollTop;
  const viewRectBottom = viewRectTop + view.clientHeight;

  if (top < viewRectTop) {
    view.scrollTop = top;
  }
  else if (bottom > viewRectBottom) {
    view.scrollTop = bottom - view.clientHeight;
  }
};