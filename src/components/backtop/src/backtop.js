import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import throttle from "../../../utils/throttle";
import scrollTo from "../../../utils/scrollTo";
import { on, off } from "../../../utils/dom";
import addEventListener from "../../../utils/addEventListener";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiBacktop = {
	name: "vui-backtop",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		threshold: {
			type: Number,
			default: 400
		},
		right: {
			type: [Number, String],
			default: 40
		},
		bottom: {
			type: [Number, String],
			default: 40
		},
		duration: {
			type: Number,
			default: 500
		},
		scrollContainer: {
			default: undefined
		},
		animation: {
			type: String,
			default: "vui-backtop-fade"
		}
	},

	data() {
		let state = {
			visibility: false
		};

		return {
			state
		};
	},

	methods: {
		getContainer() {
			let { $el: el, $props: props } = this;
			let scrollContainer = props.scrollContainer;
			let container = null;

			if (is.string(scrollContainer)) {
				container = document.querySelector(scrollContainer);
			}
			else if (is.element(scrollContainer)) {
				container = scrollContainer;
			}
			else if (is.function(scrollContainer)) {
				container = scrollContainer(el);
			}
			else {
				container = window;
			}

			return container;
		},
		getContainerScrollTop() {
			let container = this.getContainer();

			if (!container) {
				return 0;
			}

			if (container === window) {
				return window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
			}

			return container.scrollTop;
		},
		addScrollListener() {
			if (is.server) {
				return;
			}

			let container = this.getContainer();

			if (!container) {
				return;
			}

			this.container = container;
			this.scrollHandler = throttle(this.handleScroll, 200);
			this.handleScroll();

			on(container, "scroll", this.scrollHandler);
		},
		removeScrollListener() {
			if (is.server) {
				return;
			}

			let { container, scrollHandler } = this;

			if (!container || !scrollHandler) {
				return;
			}

			this.container = null;
			this.scrollHandler = null;

			off(container, "scroll", scrollHandler);
		},
		handleScroll(e) {
			let { $props: props } = this;
			let scrollTop = this.getContainerScrollTop();

			this.state.visibility = scrollTop >= props.threshold;
		},
		handleClick(e) {
			this.$emit("click", e);

			let { $props: props } = this;
			let container = this.getContainer();

			if (!container) {
				return;
			}

			let start = this.getContainerScrollTop();
			let end = 0;

			scrollTo(container, start, end, props.duration);
		}
	},

	mounted() {
		this.addScrollListener();
	},

	beforeDestroy() {
		this.removeScrollListener();
	},

	render(h) {
		let { $slots: slots, $props: props, state, handleClick } = this;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "backtop");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elContent = `${classNamePrefix}-content`;

		// style
		let styles = {};

		styles.el = {
			right: is.string(props.right) ? props.right : `${props.right}px`,
			bottom: is.string(props.bottom) ? props.bottom : `${props.bottom}px`
		};

		// render
		let btnBacktop;

		if (state.visibility) {
			btnBacktop = (
				<div class={classes.el} style={styles.el} onClick={handleClick}>
					{
						slots.default ? slots.default : (
							<div class={classes.elContent}>
								<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
									<path d="M772.551111 493.174949c-7.938586 7.951515-18.010505 11.649293-28.069495 11.649293-10.05899 0-20.130909-3.710707-28.069495-11.649293l-165.236363-165.236363v264.261818c0 21.721212-18.010505 39.718788-39.718788 39.718788s-39.718788-17.997576-39.718788-39.718788V327.938586l-165.223435 165.236363c-15.36 15.36-40.77899 15.36-56.138989 0-15.36-15.36-15.36-40.77899 0-56.138989L483.400404 204.024242c15.36-15.36 40.77899-15.36 56.13899 0l233.024646 233.011718c15.347071 15.36 15.347071 40.248889-0.012929 56.138989zM511.469899 733.595152c-20.66101 0-37.598384-16.937374-37.598384-38.128485 0-20.66101 16.937374-38.128485 37.598384-38.128485 20.648081 0 37.598384 16.950303 37.598384 38.128485 0 21.191111-16.950303 38.128485-37.598384 38.128485M511.469899 833.163636c-20.66101 0-37.598384-16.937374-37.598384-38.128484 0-20.66101 16.937374-38.128485 37.598384-38.128485 20.648081 0 37.598384 16.937374 37.598384 38.128485 0 21.178182-16.950303 38.128485-37.598384 38.128484"></path>
								</svg>
							</div>
						)
					}
				</div>
			);
		}

		return (
			<transition appear name={props.animation}>
				{btnBacktop}
			</transition>
		);
	}
};

export default VuiBacktop;