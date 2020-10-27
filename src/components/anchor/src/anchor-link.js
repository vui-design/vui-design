import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiAnchorLink = {
	name: "vui-anchor-link",
	inject: {
		vuiAnchor: {
			default: undefined
		}
	},
	props: {
		classNamePrefix: PropTypes.string,
		href: PropTypes.string,
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		target: PropTypes.string
	},
	watch: {
		href(next, prev) {
			const { vuiAnchor } = this;
			const nextTick = () => {
				vuiAnchor.unregisterLink(prev);
				vuiAnchor.registerLink(next);
			};

			this.$nextTick(nextTick);
		}
	},
	methods: {
		handleClick(e) {
			const { vuiAnchor, $props: props } = this;
			const { href, title } = props;

			vuiAnchor.scrollTo(href);
			vuiAnchor.$emit("click", e, { href, title });
		}
	},
	mounted() {
		const { vuiAnchor, $props: props } = this;
		const { href } = props;

		vuiAnchor.registerLink(href);
	},
	beforeDestroy() {
		const { vuiAnchor, $props: props } = this;
		const { href } = props;

		vuiAnchor.unregisterLink(href);
	},
	render() {
		const { vuiAnchor, $slots: slots, $props: props } = this;
		const { handleClick } = this;

		// active
		const active = vuiAnchor && vuiAnchor.state.link === props.href;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "anchor-link");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-active`]: active
		};
		classes.elTitle = {
			[`${classNamePrefix}-title`]: true,
			[`${classNamePrefix}-title-active`]: active
		};

		// render
		return (
			<div class={classes.el}>
				<a href={props.href} target={props.target} class={classes.elTitle} title={is.string(props.title) ? props.title : ""} onClick={handleClick}>{slots.title || props.title}</a>
				{slots.default}
			</div>
		);
	}
};

export default VuiAnchorLink;