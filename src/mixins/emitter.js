function dispatch(component, event, params) {
  let parent = this.$parent || this.$root;
  let name = parent.$options.name;

  while (parent && (!name || name !== component)) {
    parent = parent.$parent;

    if (parent) {
      name = parent.$options.name;
    }
  }

  if (parent) {
    parent.$emit.apply(parent, [event].concat(params));
  }
}

function broadcast(component, event, params) {
  this.$children.forEach(child => {
    let name = child.$options.name;

    if (name === component) {
      child.$emit.apply(child, [event].concat(params));
    }
    else {
      broadcast.apply(child, [component, event].concat([params]));
    }
  });
}

export default {
  methods: {
    dispatch(component, event, params) {
      dispatch.call(this, component, event, params);
    },
    broadcast(component, event, params) {
      broadcast.call(this, component, event, params);
    }
  }
};