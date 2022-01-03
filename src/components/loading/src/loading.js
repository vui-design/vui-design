import clamp from "../../../utils/clamp";
import queue from "../../../utils/queue";
import setStyle from "../../../utils/setStyle";

const VuiLoading = {};

VuiLoading.settings = {
  minimum: 0.08,
  trickle: true,
  speed: 200,
  duration: 200,
  easing: "linear",
  getPopupContainer: function() {
    return document.body;
  },
  template: `
    <div class="vui-loading-bar"></div>
  `
};

VuiLoading.status = null;

VuiLoading.configure = function(settings) {
  for (let key in settings) {
    const value = settings[key];

    if (value !== undefined && settings.hasOwnProperty(key)) {
      VuiLoading.settings[key] = value;
    }
  }

  return this;
};

VuiLoading.isStarted = function() {
  return typeof this.status === "number";
};

VuiLoading.isRendered = function() {
  return !!document.getElementById("vui-loading");
};

VuiLoading.render = function(fromStart) {
  if (this.isRendered()) {
    return document.getElementById("vui-loading");
  }

  const elContainer = this.settings.getPopupContainer();
  const elLoading = document.createElement("div");

  elLoading.id = "vui-loading";
  elLoading.className = "vui-loading";
  elLoading.innerHTML = this.settings.template;

  const elLoadingBar = elLoading.querySelector(".vui-loading-bar");
  const percentage = fromStart ? 0 : this.status * 100;

  setStyle(elLoadingBar, {
    transition: "all 0s linear",
    width: percentage + "%"
  });

  elContainer.appendChild(elLoading);

  return elLoading;
};

VuiLoading.set = function(n) {
  const that = this;
  const settings = that.settings;
  const status = clamp(n, settings.minimum, 1);

  that.status = (status === 1 ? null : status);

  const started = that.isStarted();
  const elLoading = that.render(!started);
  const elLoadingBar = elLoading.querySelector(".vui-loading-bar");
  const duration = settings.duration;
  const easing = settings.easing;

  queue(function(next) {
    setStyle(elLoadingBar, {
      width: status * 100 + "%",
      transition: "all " + duration + "ms " + easing
    });

    if (status === 1) {
      setStyle(elLoading, {
        opacity: 1,
        transition: "none"
      });

      setTimeout(function() {
        setStyle(elLoading, {
          opacity: 0,
          transition: "all " + duration + "ms linear",
        });

        setTimeout(function() {
          that.remove();
          next();
        }, duration);
      }, duration);
    }
    else {
      setTimeout(next, duration);
    }
  });

  return this;
};

VuiLoading.start = function() {
  const that = this;
  const settings = that.settings;

  if (!that.status) {
    that.set(0);
  }

  const work = function() {
    setTimeout(function() {
      if (!that.status) {
        return;
      }

      that.trickle();
      work();
    }, settings.speed);
  };

  if (settings.trickle) {
    work();
  }

  return this;
};

VuiLoading.trickle = function() {
  return this.inc();
};

VuiLoading.inc = function(amount) {
  let status = this.status;

  if (!status) {
    return this.start();
  }
  else if(status > 1) {
    return;
  }
  else {
    if (typeof amount !== "number") {
      if (status >= 0 && status < 0.2) {
        amount = 0.1;
      }
      else if (status >= 0.2 && status < 0.5) {
        amount = 0.04;
      }
      else if (status >= 0.5 && status < 0.8) {
        amount = 0.02;
      }
      else if (status >= 0.8 && status < 0.99) {
        amount = 0.005;
      }
      else {
        amount = 0;
      }
    }

    status = clamp(status + amount, 0, 0.994);

    return this.set(status);
  }
};

VuiLoading.finish = function(force) {
  if (!force && !this.status) {
    return this;
  }

  return this.inc(0.3 + 0.5 * Math.random()).set(1);
};

VuiLoading.remove = function() {
  const elLoading = document.getElementById("vui-loading");

  elLoading && elLoading.parentNode && elLoading.parentNode.removeChild(elLoading);
};

export default VuiLoading;