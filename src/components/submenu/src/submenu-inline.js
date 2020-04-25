const VuiSubmenuInline = {
	name: "vui-submenu-inline",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-submenu"
		},
		mode: {
			type: String,
			default: undefined
		},
		theme: {
			type: String,
			default: undefined
		},
		level: {
			type: Number,
			default: undefined
		},
		indent: {
			type: Number,
			default: undefined
		},
		open: {
			type: Boolean,
			default: false
		},
		selected: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		animation: {
			type: String,
			default: undefined
		}
	},

	methods: {
		handleHeaderClick(e) {
			if (this.disabled) {
				return;
			}

			this.$emit("toggle", !this.open);
		},

		handleBodyBeforeEnter(el) {
			// el.style.height = "0px";
		},
		handleBodyEnter(el) {
			el.style.height = el.scrollHeight + "px";
		},
		handleBodyAfterEnter(el) {
			el.style.height = "";
		},
		handleBodyBeforeLeave(el) {
			el.style.height = el.scrollHeight + "px";
		},
		handleBodyLeave(el) {
			// el.style.height = "0px";
		},
		handleBodyAfterLeave(el) {
			el.style.height = "";
		}
	},

	render(h) {
		let { $slots, classNamePrefix, theme, indent, open, selected, disabled, animation } = this;
		let { handleHeaderClick, handleBodyBeforeEnter, handleBodyEnter, handleBodyAfterEnter, handleBodyBeforeLeave, handleBodyLeave, handleBodyAfterLeave } = this;
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-open`]: open,
			[`${classNamePrefix}-selected`]: selected,
			[`${classNamePrefix}-disabled`]: disabled
		};
		let headerStyles = {};

		if (indent > 20) {
			headerStyles.paddingLeft = `${indent}px`;
		}

		return (
			<div class={classes}>
				<div ref="header" class={`${classNamePrefix}-header`} style={headerStyles} onClick={handleHeaderClick}>
					{$slots.icon && <div class={`${classNamePrefix}-icon`}>{$slots.icon}</div>}
					{$slots.title && <div class={`${classNamePrefix}-title`}>{$slots.title}</div>}
					<i class={`${classNamePrefix}-arrow-vertical`}></i>
				</div>
				<transition
					name={animation}
					onBeforeEnter={handleBodyBeforeEnter}
					onEnter={handleBodyEnter}
					onAfterEnter={handleBodyAfterEnter}
					onBeforeLeave={handleBodyBeforeLeave}
					onLeave={handleBodyLeave}
					onAfterLeave={handleBodyAfterLeave}
				>
					<div ref="body" v-show={open} class={`${classNamePrefix}-body`}>
						<div class={[`vui-menu`, `vui-menu-inline`, `vui-menu-vertical`, `vui-menu-${theme}`]}>{$slots.default}</div>
					</div>
				</transition>
			</div>
		);
	}
};

export default VuiSubmenuInline;