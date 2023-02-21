import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    layout: PropTypes.oneOf(["horizontal", "vertical", "inline"]).def("horizontal"),
    size: PropTypes.oneOf(["small", "medium", "large"]),
    autocomplete: PropTypes.oneOf(["on", "off"]).def("off"),
    model: PropTypes.object,
    rules: PropTypes.object.def({}),
    labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    labelAlign: PropTypes.oneOf(["left", "right"]),
    requiredMark: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(["optional"])]).def(true),
    colon: PropTypes.bool.def(true),
    showMessage: PropTypes.bool.def(true),
    disabled: PropTypes.bool
  };
};

export default {
  name: "vui-form",
  provide() {
    return {
      vuiForm: this
    };
  },
  props: createProps(),
  data() {
    const state = {
      fields: []
    };

    return {
      state
    };
  },
  watch: {
    rules() {
      this.validate();
    }
  },
  methods: {
    registerField(field) {
      if (!field || !field.prop) {
        return;
      }

      const { state } = this;
      const index = state.fields.indexOf(field);

      if (index > -1) {
        return;
      }

      this.state.fields.push(field);
    },
    unregisterField(field) {
      if (!field || !field.prop) {
        return;
      }

      const { state } = this;
      const index = state.fields.indexOf(field);

      if (index === -1) {
        return;
      }

      this.state.fields.splice(index, 1);
    },
    validate(callback) {
      const { $props: props, state } = this;

      if (!props.model) {
        console.warn("[Vui Design warn][Form]: model is required for validate to work!");
        return;
      }

      // 如果未设置回调函数，则创建一个 promise 对象，用于结尾返回
      let promise;

      if (!is.function(callback) && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          callback = valid => valid ? resolve(valid) : reject(valid);
        });
      }

      // 如果需要验证的 fields 为空，则立即执行 callback
      if (state.fields.length === 0 && is.function(callback)) {
        callback(true);
      }

      let valid = true;
      let count = 0;

      // 循环验证
      state.fields.forEach(field => {
        field.validate("", (message, field) => {
          if (message) {
            valid = false;
          }

          count++;

          if (count === state.fields.length && is.function(callback)) {
            callback(valid, field);
          }
        });
      });

      // 返回 promise 对象
      if (promise) {
        return promise;
      }
    },
    validateFields(fieldProps, callback) {
      const { $props: props, state } = this;

      if (!props.model) {
        console.warn("[Vui Design warn][Form]: model is required for validateFields to work!");
        return;
      }

      fieldProps = [].concat(fieldProps);

      const fields = state.fields.filter(field => fieldProps.indexOf(field.prop) > -1);

      if (fields.length === 0) {
        console.warn("[Vui Design warn][Form]: please pass correct field props!");
        return;
      }

      fields.forEach(field => field.validate("", callback));
    },
    reset() {
      const { $props: props, state } = this;

      if (!props.model) {
        console.warn("[Vui Design warn][Form]: model is required for reset to work.");
        return;
      }

      state.fields.forEach(field => field.reset());
    },
    resetFields(fieldProps) {
      const { $props: props, state } = this;

      if (!props.model) {
        console.warn("[Vui warn][Form]: model is required for resetFields to work.");
        return;
      }

      fieldProps = [].concat(fieldProps);

      const fields = state.fields.filter(field => fieldProps.indexOf(field.prop) > -1);

      if (fields.length === 0) {
        console.warn("[Vui Design warn][Form]: please pass correct field props!");
        return;
      }

      fields.forEach(field => field.reset());
    },
    handleSubmit(e) {
      e.preventDefault();
      e.stopPropagation();

      this.$emit("submit", e);
    }
  },
  render() {
    const { $slots: slots, $props: props } = this;
    const { handleSubmit } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "form");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.layout}`]: true
    };

    // render
    return (
      <form class={classes.el} autocomplete={props.autocomplete} onSubmit={handleSubmit}>{slots.default}</form>
    );
  }
};