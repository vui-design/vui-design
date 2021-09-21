import VuiIcon from "../../icon";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiSteps = {
  name: "vui-steps",
  props: {
    classNamePrefix: PropTypes.string,
    type: PropTypes.oneOf(["default", "dot"]).def("default"),
    direction: PropTypes.oneOf(["horizontal", "vertical"]).def("horizontal"),
    size: PropTypes.oneOf(["small"]),
    step: PropTypes.number.def(0),
    steps: PropTypes.array.def([]),
    status: PropTypes.oneOf(["wait", "process", "finish", "error"]).def("process")
  },
  methods: {
    handleStepClick(index) {
      const { $listeners: listeners } = this;
      const clickable = listeners.change;

      if (!clickable) {
        return;
      }

      this.$emit("change", index);
    }
  },
  render() {
    const { $slots: slots, $listeners: listeners, $props: props } = this;
    const { handleStepClick } = this;

    // clickable
    const clickable = is.function(listeners.change);

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "steps");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.type}`]: props.type,
      [`${classNamePrefix}-${props.direction}`]: props.direction,
      [`${classNamePrefix}-${props.size}`]: props.size,
      [`${classNamePrefix}-clickable`]: clickable
    };

    // render
    return (
      <div class={classes.el}>
        {
          props.steps.map(step => {
            const nextStep = props.steps[step.index + 1];
            let nextStepStatus;

            if (nextStep) {
              nextStepStatus = nextStep.status;
            }

            let stepClasses = {};

            stepClasses.el = {
              [`${classNamePrefix}-item`]: true,
              [`${classNamePrefix}-item-${step.status}`]: step.status,
              [`${classNamePrefix}-item-next-${nextStepStatus}`]: nextStepStatus
            };
            stepClasses.elContent = `${classNamePrefix}-item-content`;
            stepClasses.elTitle = `${classNamePrefix}-item-title`;
            stepClasses.elDot = `${classNamePrefix}-item-dot`;
            stepClasses.elIcon = `${classNamePrefix}-item-icon`;
            stepClasses.elCustomIcon = `${classNamePrefix}-item-custom-icon`;
            stepClasses.elDescription = `${classNamePrefix}-item-description`;
            stepClasses.elSeparator = `${classNamePrefix}-item-separator`;

            let stepChildren = [];

            stepChildren.push(
              <div class={stepClasses.elTitle}>{step.title}</div>
            );

            if (props.type === "dot") {
              stepChildren.push(
                <div class={stepClasses.elDot}></div>
              );
            }
            else if (is.string(step.icon)) {
              stepChildren.push(
                <div class={stepClasses.elCustomIcon}>
                  <VuiIcon type={step.icon} />
                </div>
              );
            }
            else if (is.array(step.icon)) {
              stepChildren.push(
                <div class={stepClasses.elCustomIcon}>{step.icon}</div>
              );
            }
            else if (step.status === "finish" || step.status === "error") {
              stepChildren.push(
                <div class={stepClasses.elIcon}>
                  {
                    step.status === "finish" ? (
                      <VuiIcon type="checkmark" />
                    ) : (
                      <VuiIcon type="crossmark" />
                    )
                  }
                </div>
              );
            }
            else {
              stepChildren.push(
                <div class={stepClasses.elIcon}>{step.index + 1}</div>
              );
            }

            if (step.description) {
              stepChildren.push(
                <div class={stepClasses.elDescription}>{step.description}</div>
              );
            }

            const handleClick = e => handleStepClick(step.index);

            return (
              <div class={stepClasses.el}>
                <div class={stepClasses.elContent} onClick={handleClick}>{stepChildren}</div>
                <div class={stepClasses.elSeparator}></div>
              </div>
            );
          })
        }
      </div>
    );
  }
};

export default VuiSteps;