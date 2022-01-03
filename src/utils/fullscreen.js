// 是否支持全屏
export const isSupport = () => {
  const element = document.documentElement;

  return ("requestFullscreen" in element) || ("webkitRequestFullScreen" in element) || ("mozRequestFullScreen" in element && document.mozFullScreenEnabled) || ("msRequestFullscreen" in element && document.msFullscreenEnabled);
};

// 获取全屏状态
export const getStatus = () => {
  if (document.fullscreen || document.mozFullScreen || document.fullscreenElement || document.msFullscreenElement || document.webkitIsFullScreen) {
    return true;
  }
  else {
    return false;
  }
};

// 全屏
export const request = element => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  }
  else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  }
  else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  }
  else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  }
  else {
    console.warn("Fullscreen API is not supported.");
  }
};

// 退出全屏
export const exit = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
  else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }
  else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  else {
    console.warn("Fullscreen API is not supported.");
  }
};

// 注册全屏事件
export const addEventListener = callback => {
  document.addEventListener("fullscreenchange", callback);
  document.addEventListener("webkitfullscreenchange", callback);
  document.addEventListener("mozfullscreenchange", callback);
  document.addEventListener("MSFullscreenChange", callback);
};

// 注销全屏事件
export const removeEventListener = callback => {
  document.removeEventListener("fullscreenchange", callback);
  document.removeEventListener("webkitfullscreenchange", callback);
  document.removeEventListener("mozfullscreenchange", callback);
  document.removeEventListener("MSFullscreenChange", callback);
};

// 
export default {
  isSupport,
  getStatus,
  request,
  exit,
  addEventListener,
  removeEventListener
};