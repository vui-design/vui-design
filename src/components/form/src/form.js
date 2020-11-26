import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiForm = {
	name: "vui-form",

	provide() {
		return {
			vuiForm: this
		};
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		layout: {
			type: String,
			default: "horizontal",
			validator: value => ["horizontal", "vertical", "inline"].indexOf(value) > -1
		},
		model: {
			type: Object,
			default: undefined
		},
		rules: {
			type: Object,
			default: () => {}
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
		showMessage: {
			type: Boolean,
			default: true
		},
		hideRequiredMark: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: undefined,
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
		},
		disabled: {
			type: Boolean,
			default: undefined
		}
	},

	data() {
		return {
			fields: []
		};
	},

	watch: {
		rules() {
			this.validate();
		}
	},

	created() {
		this.$on("form-item-add", field => {
			if (field && field.prop) {
				this.fields.push(field);
			}
		});
		this.$on("form-item-remove", field => {
			if (field && field.prop) {
				this.fields.splice(this.fields.indexOf(field), 1);
			}
		});
	},

	methods: {
		validate(callback) {
			return new Promise(resolve => {
				let valid = true;
				let count = 0;

				this.fields.forEach(field => {
					field.validate("", errors => {
						if (errors) {
							valid = false;
						}

						count++;

						if (count === this.fields.length) {
							// all finish
							resolve(valid);

							if (is.function(callback)) {
								callback(valid);
							}
						}
					});
				});
			});
		},
		validateFields(props, callback) {
			let array = [].concat(props);
			let fields = this.fields.filter(field => {
				return array.indexOf(field.prop) > -1;
			});

			fields.forEach(field => {
				field.validate("", callback);
			});
		},
		reset() {
			if (!this.model) {
				console.warn("[Vui warn][Form]: model is required for reset to work.");
				return;
			}

			let fields = this.fields;

			fields.forEach(field => field.reset());
		},
		resetFields(props) {
			if (!this.model) {
				console.warn("[Vui warn][Form]: model is required for resetFields to work.");
				return;
			}

			let array = [].concat(props);
			let fields = this.fields.filter(field => {
				return array.indexOf(field.prop) > -1;
			});

			fields.forEach(field => field.reset());
		},
		handleSubmit(e) {
			e.preventDefault();
			e.stopPropagation();

			this.$emit("submit", e);
		}
	},

	render() {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix, layout } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "form");
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${layout}`]: true
		};

		return (
			<form class={classes} onSubmit={this.handleSubmit}>
				{slots.default}
			</form>
		);
	}
};

export default VuiForm;