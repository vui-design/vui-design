import VcSteps from "../../vc-steps";
import is from "../../../utils/is";

const VuiSteps = {
	name: "vui-steps",

	components: {
		VcSteps
	},

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
		status: {
			type: String,
			default: "process",
			validator: value => ["wait", "process", "finish", "error"].indexOf(value) > -1
		}
	},

	methods: {
		getDerivedStepsFromProps(props, children) {
			let steps = [];

			if (!children) {
				return steps;
			}

			children.forEach(vNode => {
				if (!vNode) {
					return;
				}

				let component = vNode.componentOptions;

				if (component && component.tag === "vui-step" && component.propsData) {
					let step = {
						...component.propsData,
						index: steps.length
					};

					if (!step.status) {
						if (step.index < props.step) {
							step.status = "finish";
						}
						else if (step.index === props.step) {
							step.status = props.status;
						}
						else if (step.index > props.step) {
							step.status = "wait";
						}
					}

					if (component.children) {
						component.children.forEach(element => {
							if (!element) {
								return;
							}

							let data = element.data;

							if (!data) {
								return;
							}

							if (data.slot === "icon") {
								if (is.array(step.icon)) {
									step.icon.push(element);
								}
								else {
									step.icon = [element];
								}
							}
							else if (data.slot === "title") {
								if (is.array(step.title)) {
									step.title.push(element);
								}
								else {
									step.title = [element];
								}
							}
							else if (data.slot === "description") {
								if (is.array(step.description)) {
									step.description.push(element);
								}
								else {
									step.description = [element];
								}
							}
						});
					}

					steps.push(step);
				}
			});

			return steps;
		}
	},

	render() {
		let { $slots: slots, $props: props, $listeners: listeners, getDerivedStepsFromProps } = this;
		let attributes = {
			props: {
				...props,
				steps: getDerivedStepsFromProps(props, slots.default)
			},
			on: {
				...listeners
			}
		};

		return (
			<VcSteps {...attributes} />
		);
	}
};

export default VuiSteps;