let getDOMHighResTimeStamp;

let hrtime;
let uptime;
let getNanoSeconds;
let moduleLoadTime;
let upTime;
let nodeLoadTime;

let loadTime;

if (typeof performance !== "undefined" && performance && performance.now) {
  getDOMHighResTimeStamp = function() {
    return performance.now();
  };
}
else if (typeof process !== "undefined" && process && process.hrtime) {
  hrtime = process.hrtime;
  uptime = process.uptime;

  getNanoSeconds = function() {
    const hrTime = hrtime();

    return hrTime[0] * 1e9 + hrTime[1];
  };

  moduleLoadTime = getNanoSeconds();
    upTime = uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;

  getDOMHighResTimeStamp = function() {
    return (getNanoSeconds() - nodeLoadTime) / 1e6;
  };
}
else if (Date.now) {
  loadTime = Date.now();

  getDOMHighResTimeStamp = function() {
    return Date.now() - loadTime;
  };
}
else {
  loadTime = new Date().getTime();

  getDOMHighResTimeStamp = function() {
    return new Date().getTime() - loadTime;
  };
}

export default getDOMHighResTimeStamp;