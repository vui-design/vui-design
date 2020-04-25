import AsyncValidator from "async-validator";
import Emitter from "vui-design/mixins/emitter";
import is from "vui-design/utils/is";
import noop from "vui-design/utils/noop";
import getTargetByPath from "vui-design/utils/getTargetByPath";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiFormItem = {
	name: "vui-form-item",

	inject: {
		vuiForm: {
			default: undefined
		}
	},

	mixins: [
		Emitter
	],

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		label: {
			type: String,
			default: undefined
		},
		labelFor: {
			type: String,
			default: undefined
		},
		labelWidth: {
			type: [String, Number],
			default: undefined
		},
		labelAlign: {
			type: String,
			default: undefined,
			validator: value => ["left", "right"].indexOf(value) > -1
		},
		prop: {
			type: String,
			default: undefined
		},
		required: {
			type: Boolean,
			default: undefined
		},
		rules: {
			type: [Object, Array],
			default: undefined
		},
		validateStatus: {
			type: Boolean,
			default: false
		},
		error: {
			type: String,
			default: ""
		},
		showMessage: {
			type: Boolean,
			default: true
		}
	},

	data() {
		let model = this.vuiForm && this.vuiForm.model;
		let prop = this.prop;
		let error = this.error;

		return {
			defaultValue: this.getValueByModelProp(model, prop),
			validator: {
				disabled: false,
				state: error ? "error" : "",
				message: error
			}
		};
	},

	computed: {
		fieldValue() {
			let model = this.vuiForm && this.vuiForm.model;
			let prop = this.prop;

			return this.getValueByModelProp(model, prop);
		},
		isRequired() {
			if (this.required) {
				return true;
			}

			let rules = this.getRules();
			let isRequired = false;

			if (rules && rules.length) {
				rules.every(rule => {
					if (rule.required) {
						isRequired = true;
						return false;
					}

					return true;
				});
			}

			return isRequired;
		}
	},

	watch: {
		error(value) {
			this.validator.state = value ? "error" : "";
			this.validator.message = value;
		},
		validateStatus(value) {
			this.validator.state = value;
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
			let formRules = this.vuiForm.rules;
			let rules = this.rules;
			let prop = this.prop;
			let target = getTargetByPath(formRules, prop);

			formRules = formRules ? (target.from[prop] || target.value) : [];

			return [].concat(rules || formRules || []);
		},
		getFilteredRules(trigger) {
			let rules = this.getRules();

			return rules.filter(rule => {
				return !rule.trigger || rule.trigger.indexOf(trigger) > -1;
			});
		},

		validate(trigger, callback = noop) {
			this.$nextTick(() => {
				let rules = this.getFilteredRules(trigger);

				if (!rules || rules.length === 0) {
					if (!this.required) {
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

				this.validator.state = "validating";

				let source = {};
				let descriptor = {};

				source[this.prop] = this.fieldValue;
				descriptor[this.prop] = rules;

				let validator = new AsyncValidator(descriptor);

				validator.validate(source, {
					firstFields: true
				}, (errors, fields) => {
					this.validator.state = !errors ? "success" : "error";
					this.validator.message = errors ? errors[0].message : "";
					this.vuiForm && this.vuiForm.$emit("validate", this.prop, this.validator.state, this.validator.message);

					callback(this.validator.message, fields);
				});

				this.validator.disabled = false;
			});
		},
		reset() {
			this.validator.state = "";
			this.validator.message = "";

			let model = this.vuiForm.model;
			let prop = this.prop;

			if (prop.indexOf(":") > -1) {
				prop = prop.replace(/:/, ".");
			}

			let target = getTargetByPath(model, prop, true);
			let value = this.fieldValue;

			if (is.array(value)) {
				this.validator.disabled = true;
				target.from[target.key] = [].concat(this.defaultValue);
			}
			else {
				this.validator.disabled = true;
				target.from[target.key] = this.defaultValue;
			}
		},

		addValidateEvents() {
			let rules = this.getRules();

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
			if (this.validator.disabled) {
				this.validator.disabled = false;
				return;
			}

			this.validate("change");
		}
	},

	mounted() {
		if (this.prop) {
			this.dispatch("vui-form", "form-item-add", this);
			this.addValidateEvents();
		}
	},

	beforeDestroy() {
		if (this.prop) {
			this.dispatch("vui-form", "form-item-remove", this);
			this.removeValidateEvents();
		}
	},

	render() {
		let { vuiForm, $slots: slots, classNamePrefix: customizedClassNamePrefix, isRequired, validator } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "form-item");
		let animation = `${classNamePrefix}-message-fade`;

		// label
		let label = {
			for: this.labelFor,
			children: slots.label || this.label
		};

		// showRequiredMark
		let showRequiredMark = isRequired && vuiForm && !vuiForm.hideRequiredMark;

		// showMessage
		let showMessage = validator.state === "error" && this.showMessage && (vuiForm && vuiForm.showMessage);

		if (this.labelWidth) {
			label.width = this.labelWidth;
		}
		else if (vuiForm && vuiForm.labelWidth) {
			label.width = vuiForm.labelWidth;
		}

		if (label.width) {
			label.width = is.string(label.width) ? label.width : `${label.width}px`;
		}

		if (this.labelAlign) {
			label.align = this.labelAlign;
		}
		else if (vuiForm && vuiForm.labelAlign) {
			label.align = vuiForm.labelAlign;
		}
		else if (vuiForm.layout === "vertical") {
			label.align = "left";
		}
		else {
			label.align = "right";
		}

		// classes
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-required`]: isRequired,
			[`${classNamePrefix}-error`]: validator.state === "error",
			[`${classNamePrefix}-validating`]: validator.state === "validating"
		};
		classes.elLabel = `${classNamePrefix}-label`;
		classes.elLabelMark = `${classNamePrefix}-label-mark`;
		classes.elControl = `${classNamePrefix}-control`;
		classes.elControlLayout = `${classNamePrefix}-control-layout`;
		classes.elControlLayoutContent = `${classNamePrefix}-control-layout-content`;
		classes.elControlMessage = `${classNamePrefix}-control-message`;

		// styles
		let styles = {};

		styles.elLabel = {
			textAlign: label.align
		};
		styles.elControl = {};

		if ((vuiForm && vuiForm.layout !== "vertical") && label.width) {
			styles.elLabel.width = label.width;

			if (vuiForm.layout === "horizontal") {
				styles.elControl.marginLeft = label.width;
			}
		}

		// render
		return (
			<div class={classes.el}>
				{
					label.children && (
						<label for={label.for} class={classes.elLabel} style={styles.elLabel}>
							{
								showRequiredMark && (
									<em class={classes.elLabelMark}>*</em>
								)
							}
							{label.children}
						</label>
					)
				}
				<div class={classes.elControl} style={styles.elControl}>
					<div class={classes.elControlLayout}>
						<div class={classes.elControlLayoutContent}>{slots.default}</div>
					</div>
					<transition name={animation} appear>
						{
							showMessage && (
								<div class={classes.elControlMessage}>{validator.message}</div>
							)
						}
					</transition>
				</div>
			</div>
		);
	}
};

export default VuiFormItem;