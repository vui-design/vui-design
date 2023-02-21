import AsyncValidator from "async-validator";
import VuiSpace from "../space";
import VuiIcon from "../icon";
import VuiTooltip from "../tooltip";
import Locale from "../../mixins/locale";
import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import noop from "../../utils/noop";
import getTargetByPath from "../../utils/getTargetByPath";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    labelFor: PropTypes.string,
    labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    labelAlign: PropTypes.oneOf(["left", "right"]),
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tooltipColor: PropTypes.string,
    tooltipMaxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(400),
    extra: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    prop: PropTypes.string,
    required: PropTypes.bool,
    rules: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    validateStatus: PropTypes.bool.def(false),
    message: PropTypes.string.def(""),
    showMessage: PropTypes.bool.def(true),
    animation: PropTypes.string.def("vui-form-item-control-message-fade")
  };
};

export default {
  name: "vui-form-item",
  inject: {
    vuiForm: {
      default: undefined
    }
  },
  components: {
    VuiIcon,
    VuiTooltip
  },
  mixins: [
    Locale
  ],
  props: createProps(),
  data() {
    const { vuiForm, $props: props } = this;
    const state = {
      value: this.getValueByModelProp(vuiForm.model, props.prop),
      validator: {
        disabled: false,
        status: props.message ? "error" : "",
        message: props.message
      }
    };

    return {
      state
    };
  },
  computed: {
    value() {
      const { vuiForm, $props: props } = this;

      return this.getValueByModelProp(vuiForm.model, props.prop);
    },
    isRequired() {
      const { $props: props } = this;

      if (props.required) {
        return true;
      }

      const rules = this.getRules();
      let isRequired = false;

      if (rules && rules.length) {
        isRequired = rules.some(rule => rule.required);
      }

      return isRequired;
    }
  },
  watch: {
    message(value) {
      this.state.validator.status = value ? "error" : "";
      this.state.validator.message = value;
    },
    validateStatus(value) {
      this.state.validator.status = value;
    }
  },
  methods: {
    getValueByModelProp(model, prop) {
      if (!model || !prop) {
        return;
      }

      if (prop.indexOf(":") > -1) {
        prop = prop.replace(/:/, ".");
      }

      return getTargetByPath(model, prop, true).value;
    },
    getRules() {
      const { vuiForm, $props: props } = this;
      const target = getTargetByPath(vuiForm.rules, props.prop);

      return [].concat(props.rules || target.value || []);
    },
    getRulesByTrigger(trigger) {
      const rules = this.getRules();

      return rules.filter(rule => {
        if (!rule.trigger || !trigger) {
          return true;
        }

        if (is.array(rule.trigger)) {
          return rule.trigger.indexOf(trigger) > -1;
        }
        else {
          return rule.trigger === trigger;
        }
      });
    },
    validate(trigger, callback = noop) {
      const { vuiForm, $props: props } = this;
      let rules = this.getRulesByTrigger(trigger);

      if (!rules || rules.length === 0) {
        if (!props.required) {
          callback();
          return true;
        }
        else {
          rules = [
            {
              required: true
            }
          ];
        }
      }

      this.state.validator.status = "validating";

      let descriptor = {};
      let source = {};
      const options = {
        firstFields: true
      };

      descriptor[props.prop] = rules;
      source[props.prop] = this.value;

      let validator = new AsyncValidator(descriptor);

      validator.validate(source, options, (errors, fields) => {
        this.state.validator.status = errors ? "error" : "success";
        this.state.validator.message = errors ? errors[0].message : "";

        callback(this.state.validator.message, fields);

        if (vuiForm) {
          vuiForm.$emit("validate", props.prop, this.state.validator.status, this.state.validator.message);
        }
      });

      this.state.validator.disabled = false;
    },
    reset() {
      const { vuiForm, $props: props, state } = this;

      this.state.validator.status = "";
      this.state.validator.message = "";

      let model = vuiForm.model;
      let prop = props.prop;

      if (prop.indexOf(":") > -1) {
        prop = prop.replace(/:/, ".");
      }

      let target = getTargetByPath(model, prop, true);
      let value = this.value;

      if (is.array(value)) {
        this.state.validator.disabled = true;
        target.from[target.key] = [].concat(state.value);
      }
      else {
        this.state.validator.disabled = true;
        target.from[target.key] = state.value;
      }
    },
    addValidateEvents() {
      const rules = this.getRules();

      if (rules.length || this.isRequired) {
        this.$on("blur", this.handleFieldBlur);
        this.$on("change", this.handleFieldChange);
      }
    },
    removeValidateEvents() {
      this.$off("blur", this.handleFieldBlur);
      this.$off("change", this.handleFieldChange);
    },
    handleFieldBlur() {
      this.validate("blur");
    },
    handleFieldChange() {
      if (this.state.validator.disabled) {
        this.state.validator.disabled = false;
        return;
      }

      this.validate("change");
    }
  },
  mounted() {
    const { $props: props } = this;

    if (props.prop) {
      this.vuiForm.registerField(this);
      this.addValidateEvents();
    }
  },
  beforeDestroy() {
    const { $props: props } = this;

    if (props.prop) {
      this.vuiForm.unregisterField(this);
      this.removeValidateEvents();
    }
  },
  render() {
    const { vuiForm, $slots: slots, $props: props, state, isRequired, t: translate } = this;

    // label
    const label = slots.label || props.label;

    // label width
    let labelWidth;

    if (!is.undefined(props.labelWidth)) {
      labelWidth = props.labelWidth;
    }
    else if (!is.undefined(vuiForm.labelWidth)) {
      labelWidth = vuiForm.labelWidth;
    }

    if (is.string(labelWidth) || is.number(labelWidth)) {
      labelWidth = is.string(labelWidth) ? labelWidth : `${labelWidth}px`;
    }

    // label align
    let labelAlign;

    if (props.labelAlign) {
      labelAlign = props.labelAlign;
    }
    else if (vuiForm.labelAlign) {
      labelAlign = vuiForm.labelAlign;
    }
    else if (vuiForm.layout === "vertical") {
      labelAlign = "left";
    }
    else {
      labelAlign = "right";
    }

    // required mark
    let requiredMark;

    if (isRequired) {
      requiredMark = vuiForm.requiredMark === true ? "asterisk" : "";
    }
    else {
      requiredMark = vuiForm.requiredMark === "optional" ? "optional" : "";
    }

    // description
    const description = vuiForm.layout === "vertical" ? (slots.description || props.description) : "";

    // tooltip
    const tooltip = slots.tooltip || props.tooltip;

    // colon
    const colon = vuiForm.layout === "horizontal" && vuiForm.colon;

    // extra
    const extra = slots.extra || props.extra;

    // showMessage
    const showMessage = state.validator.status === "error" && props.showMessage && vuiForm.showMessage;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "form-item");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-without-label`]: !label,
      [`${classNamePrefix}-required`]: isRequired,
      [`${classNamePrefix}-error`]: state.validator.status === "error",
      [`${classNamePrefix}-validating`]: state.validator.status === "validating"
    };
    classes.elLabel = {
      [`${classNamePrefix}-label`]: true,
      [`${classNamePrefix}-label-${labelAlign}`]: labelAlign
    };
    classes.elLabelRequired = `${classNamePrefix}-label-required`;
    classes.elLabelOptional = `${classNamePrefix}-label-optional`;
    classes.elLabelContent = `${classNamePrefix}-label-content`;
    classes.elLabelDescription = `${classNamePrefix}-label-description`;
    classes.elLabelTooltip = `${classNamePrefix}-label-tooltip`;
    classes.elLabelColon = `${classNamePrefix}-label-colon`;
    classes.elControl = `${classNamePrefix}-control`;
    classes.elControlLayout = `${classNamePrefix}-control-layout`;
    classes.elControlLayoutContent = `${classNamePrefix}-control-layout-content`;
    classes.elControlExtra = `${classNamePrefix}-control-extra`;
    classes.elControlMessage = `${classNamePrefix}-control-message`;

    // style
    let styles = {};

    styles.elLabel = {};
    styles.elControl = {};

    if (vuiForm.layout !== "vertical" && labelWidth) {
      styles.elLabel.width = labelWidth;

      if (vuiForm.layout === "horizontal" && !label) {
        styles.elControl.marginLeft = labelWidth;
      }
    }

    // render
    let children = [];

    if (label) {
      children.push(
        <label for={props.labelFor} class={classes.elLabel} style={styles.elLabel}>
          {
            requiredMark === "asterisk" && (
              <div class={classes.elLabelRequired}>∗</div>
            )
          }
          <div class={classes.elLabelContent} title={props.label}>
            {
              description ? (
                <VuiSpace divider size="small">
                  {label}
                  <div class={classes.elLabelDescription}>{description}</div>
                </VuiSpace>
              ) : (
                label
              )
            }
          </div>
          {
            requiredMark === "optional" && (
              <div class={classes.elLabelOptional}>{translate("vui.form.optional")}</div>
            )
          }
          {
            tooltip && (
              <div class={classes.elLabelTooltip}>
                <VuiTooltip color={props.tooltipColor} maxWidth={props.tooltipMaxWidth}>
                  <VuiIcon type="help" />
                  <div slot="content">{tooltip}</div>
                </VuiTooltip>
              </div>
            )
          }
          {
            label && colon && (
              <div class={classes.elLabelColon}>:</div>
            )
          }
        </label>
      );
    }

    children.push(
      <div class={classes.elControl} style={styles.elControl}>
        {slots.default}
        {
          extra ? (
            <div class={classes.elControlExtra}>{extra}</div>
          ) : null
        }
        <transition appear name={props.animation}>
          {
            showMessage ? (
              <div class={classes.elControlMessage}>{state.validator.message}</div>
            ) : null
          }
        </transition>
      </div>
    );

    return (
      <div class={classes.el}>{children}</div>
    );
  }
};