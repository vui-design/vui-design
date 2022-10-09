export default function withInstall(component) {
  component.install = function(Vue) {
    Vue.component(component.name, component);
  };

  return component;
};