import VcOptionGroup from "vui-design/components/vc-option-group";
import VcOption from "vui-design/components/vc-option";
import VuiSpin from "vui-design/components/spin";
import VuiEmpty from "vui-design/components/empty";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

export default {
	name: "vui-select-dropdown",

	inject: {
		vcSelect: {
			default: undefined
		}
	},

	components: {
		VcOptionGroup,
		VcOption,
		VuiSpin,
		VuiEmpty
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		options: {
			type: Array,
			default: () => []
		},
		hoveredOption: {
			type: Object,
			default: undefined
		},
		selectedOption: {
			type: Object,
			default: undefined
		},
		selectedOptions: {
			type: Array,
			default: () => []
		},
		multiple: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
		loadingText: {
			type: String,
			default: undefined
		},
		notFoundText: {
			type: String,
			default: undefined
		}
	},

	methods: {
		getOptionHoveredProp(value) {
			return this.hoveredOption && this.hoveredOption.value === value;
		},
		getOptionSelectedProp(value) {
			if (this.multiple) {
				return this.selectedOptions.findIndex(option => option.value === value) > -1;
			}
			else {
				return this.selectedOption && this.selectedOption.value === value;
			}
		},

		handleMousedown(e) {
			e.preventDefault();
		},

		handleOptionHover(option) {
			if (option.disabled) {
				return;
			}

			this.$emit("optionHover", option);
		},
		handleOptionClick(option) {
			if (option.disabled) {
				return;
			}

			this.$emit("optionClick", option);
		}
	},

	render(h) {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix, options, loading, getOptionHoveredProp, getOptionSelectedProp } = this;
		let { handleMousedown, handleOptionHover, handleOptionClick } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "select-dropdown");
		let loadingText = loading && this.loadingText;
		let notFoundText = options.length === 0 && this.notFoundText;

		return (
			<div class={`${classNamePrefix}`} onMousedown={handleMousedown} >
				{
					loading ? (
						<div class={`${classNamePrefix}-loading`}>
							<VuiSpin size="small" />{loadingText}
						</div>
					) : (
						options.length === 0 ? (
							<div class={`${classNamePrefix}-empty`}>
								<VuiEmpty size="small" description={notFoundText} />
							</div>
						) : (
							<div class={`${classNamePrefix}-menu`}>
								{
									options.map(element => {
										if (element.isOptionGroup) {
											return (
												<VcOptionGroup classNamePrefix={customizedClassNamePrefix} key={element.label} label={element.label} disabled={element.disabled}>
													{
														element.children.map(option => {
															return (
																<VcOption
																	classNamePrefix={customizedClassNamePrefix}
																	key={option.value}
																	label={option.label}
																	value={option.value}
																	hovered={getOptionHoveredProp(option.value)}
																	selected={getOptionSelectedProp(option.value)}
																	disabled={option.disabled}
																	onMouseenter={e => handleOptionHover(option)}
																	onClick={e => handleOptionClick(option)}
																>
																	{option.children}
																</VcOption>
															);
														})
													}
												</VcOptionGroup>
											);
										}
										else if (element.isOption) {
											return (
												<VcOption
													classNamePrefix={customizedClassNamePrefix}
													key={element.value}
													label={element.label}
													value={element.value}
													hovered={getOptionHoveredProp(element.value)}
													selected={getOptionSelectedProp(element.value)}
													disabled={element.disabled}
													onMouseenter={e => handleOptionHover(element)}
													onClick={e => handleOptionClick(element)}
												>
													{element.children}
												</VcOption>
											);
										}
									})
								}
							</div>
						)
					)
				}
			</div>
		);
	}
};