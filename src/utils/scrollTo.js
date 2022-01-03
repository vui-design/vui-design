/**
* 从一个位置平滑滚动到另一个位置
* @param {window/HTMLElement} element 
* @param {Number} from 
* @param {Number} to 
* @param {Number} duration 
* @param {Function} complete 
*/
export default function scrollTo(element, from = 0, to, duration = 500, complete) {
  if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  }

  const difference = Math.abs(from - to);
  const step = Math.ceil(difference / duration * 50);
  const scroll = (start, end, step) => {
    if (start === end) {
      return complete && complete();
    }

    let d = (start + step > end) ? end : start + step;

    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (element === window) {
      window.scrollTo(d, d);
    }
    else {
      element.scrollTop = d;
    }

    window.requestAnimationFrame(() => scroll(d, end, step));
  }

  scroll(from, to, step);
};