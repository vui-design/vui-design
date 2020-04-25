import VuiIcon from "vui-design/components/icon";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VcSteps = {
	name: "vc-steps",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		type: {
			type: String,
			default: "default",
			validator: value => ["default", "dot"].indexOf(value) > -1
		},
		direction: {
			type: String,
			default: "horizontal",
			validator: value => ["horizontal", "vertical"].indexOf(value) > -1
		},
		size: {
			type: String,
			default: undefined,
			validator: value => ["small"].indexOf(value) > -1
		},
		step: {
			type: Number,
			default: 0
		},
		steps: {
			type: Array,
			default: () => []
		},
		status: {
			type: String,
			default: "process",
			validator: value => ["wait", "process", "finish", "error"].indexOf(value) > -1
		}
	},

	render() {
		let { $slots: slots, $props: props } = this;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "steps");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.type}`]: props.type,
			[`${classNamePrefix}-${props.direction}`]: props.direction,
			[`${classNamePrefix}-${props.size}`]: props.size
		};

		// render
		return (
			<div class={classes.el}>
				{
					props.steps.map(step => {
						let nextStep = props.steps[step.index + 1];
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

						return (
							<div class={stepClasses.el}>
								<div class={stepClasses.elContent}>{stepChildren}</div>
								<div class={stepClasses.elSeparator}></div>
							</div>
						);
					})
				}
			</div>
		);
	}
};

export default VcSteps;