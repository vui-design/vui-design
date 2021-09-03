import VuiTooltip from "../../tooltip";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import keyCodes from "../../../utils/keyCodes";
import addEventListener from "../../../utils/addEventListener";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";
import utils from "./utils";

const VuiSliderDragger = {
	name: "vui-slider-dragger",
	components: {
		VuiTooltip
	},
	props: {
		classNamePrefix: PropTypes.string.def("vui-slider"),
		type: PropTypes.oneOf(["min", "max"]).def("max"),
		vertical: PropTypes.bool.def(false),
		value: PropTypes.number.def(0),
		min: PropTypes.number.def(0),
		max: PropTypes.number.def(100),
		step: PropTypes.number.def(1),
		marks: PropTypes.object,
		tooltip: PropTypes.object.def({
			formatter: value => value,
			color: "dark",
			placement: "top",
			getPopupContainer: () => document.body
		}),
		getContainer: PropTypes.func.def(element => element.parentNode),
		disabled: PropTypes.bool.def(false)
	},
	data() {
		return {
			state: {
				dragging: false,
				dragStart: 0,
				dragEnd: 0,
				dragStartPosition: 0,
				dragEndPosition: 0
			}
		};
	},
	methods: {
		focus() {
			this.$refs.dragger && this.$refs.dragger.focus();
		},
		blur() {
			this.$refs.dragger && this.$refs.dragger.blur();
		},
		handleKeydown(e) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			const keyCode = e.keyCode;

			if (keyCode !== keyCodes.left && keyCode !== keyCodes.down && keyCode !== keyCodes.right && keyCode !== keyCodes.up) {
				return;
			}

			e.preventDefault();

			const distance = props.step / (props.max - props.min) * 100;
			const moveStartPosition = (props.value - props.min) / (props.max - props.min) * 100;
			let moveEndPosition = moveStartPosition;

			if (keyCode === keyCodes.left || keyCode === keyCodes.down) {
				moveEndPosition = moveStartPosition - distance;
			}
			else if (keyCode === keyCodes.right || keyCode === keyCodes.up) {
				moveEndPosition = moveStartPosition + distance;
			}

			this.$emit("move", props.type, utils.getSliderDraggerValue(moveEndPosition, props));
		},
		handleDragstart(e) {
			const { $props: props } = this;

			if (props.disabled || this.state.dragging) {
				return;
			}

			if (e.type === "mousedown" && e.button !== 0) {
				return;
			}

			let dragStart = 0;

			if (props.vertical) {
				dragStart = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
			}
			else {
				dragStart = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
			}

			this.state.dragging = true;
			this.state.dragStart = dragStart;
			this.state.dragStartPosition = (props.value - props.min) / (props.max - props.min) * 100;
			this.mousemoveEvent = addEventListener(window, "mousemove", this.handleDragging);
			this.touchmoveEvent = addEventListener(window, "touchmove", this.handleDragging);
			this.mouseupEvent = addEventListener(window, "mouseup", this.handleDragend);
			this.touchendEvent = addEventListener(window, "touchend", this.handleDragend);
			this.$emit("dragstart", props.type, this.state.dragging);
		},
		handleDragging(e) {
			const { $props: props } = this;

			if (props.disabled || !this.state.dragging) {
				return;
			}

			let dragEnd = 0;
			let dragEndPosition = 0;

			if (props.vertical) {
				dragEnd = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
			}
			else {
				dragEnd = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
			}

			const container = props.getContainer();
			const size = utils.getSliderSize(container, props.vertical);
			let distance = 0;

			if (props.vertical) {
				distance = (this.state.dragStart - dragEnd) / size * 100;
			}
			else {
				distance = (dragEnd - this.state.dragStart) / size * 100;
			}

			dragEndPosition = this.state.dragStartPosition + distance;

			this.state.dragEnd = dragEnd;
			this.state.dragEndPosition = dragEndPosition;
			this.$emit("dragging", props.type, this.state.dragging, utils.getSliderDraggerValue(dragEndPosition, props));
			this.$nextTick(() => this.$refs.tooltip && this.$refs.tooltip.reregister());
		},
		handleDragend(e) {
			const { $props: props } = this;

			if (props.disabled || !this.state.dragging) {
				return;
			}

			this.state.dragging = false;
			this.state.dragStart = 0;
			this.state.dragEnd = 0;
			this.state.dragStartPosition = 0;
			this.state.dragEndPosition = 0;
			this.mousemoveEvent && this.mousemoveEvent.remove();
			this.touchmoveEvent && this.touchmoveEvent.remove();
			this.mouseupEvent && this.mouseupEvent.remove();
			this.touchendEvent && this.touchendEvent.remove();
			this.$emit("dragend", props.type, this.state.dragging);
		}
	},
	render(h) {
		const { $props: props, state } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "dragger");
		let classes = {};

		classes.elWrapper = {
			[`${classNamePrefix}-wrapper`]: true,
			[`${classNamePrefix}-wrapper-dragging`]: state.dragging
		};
		classes.el = `${classNamePrefix}`;

		// style
		const position = (props.value - props.min) / (props.max - props.min) * 100 + "%";
		let styles = {};

		styles.elWrapper = {};

		if (props.vertical) {
			styles.elWrapper.bottom = position;
		}
		else {
			styles.elWrapper.left = position;
		}

		// render
		let dragger = (
			<button ref="dragger" type="button" class={classes.el} onKeydown={this.handleKeydown} />
		);

		if (props.tooltip && is.function(props.tooltip.formatter)) {
			const tooltip = props.tooltip;

			dragger = (
				<VuiTooltip
					ref="tooltip"
					trigger={tooltip.trigger === "always" ? "always" : "focus"}
					color={tooltip.color}
					placement={tooltip.placement}
					getPopupContainer={tooltip.getPopupContainer}
				>
					{dragger}
					<div slot="content">{tooltip.formatter(props.value)}</div>
				</VuiTooltip>
			);
		}

		return (
			<div
				class={classes.elWrapper}
				style={styles.elWrapper}
				onMousedown={this.handleDragstart}
				onTouchstart={this.handleDragstart}
			>
				{dragger}
			</div>
		);
	}
};

export default VuiSliderDragger;