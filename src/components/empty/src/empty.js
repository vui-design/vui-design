import Locale from "vui-design/mixins/locale";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiEmpty = {
	name: "vui-empty",
	mixins: [
		Locale
	],
	props: {
		classNamePrefix: PropTypes.string,
		image: PropTypes.string,
		description: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).def(true)
	},
	render() {
		const { $slots: slots, $props: props, t: translate } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "empty");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elImage = `${classNamePrefix}-image`;
		classes.elDescription = `${classNamePrefix}-description`;
		classes.elContent = `${classNamePrefix}-content`;

		// image
		let image;

		if (slots.image) {
			image = slots.image;
		}
		else if (props.image) {
			image = (
				<img alt="empty" src={props.image} />
			);
		}
		else {
			image = (
				<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg">
					<ellipse fill="#f5f5f5" fill-rule="evenodd" clip-rule="evenodd" cx="32" cy="33" rx="32" ry="7" />
					<path stroke="#d9d9d9" fill="none" d="M55,13.3L44.9,1.8c-0.5-0.8-1.2-1.3-1.9-1.3H21.1c-0.7,0-1.5,0.5-1.9,1.3L9,13.3v9.2h46V13.3z" />
					<path stroke="#d9d9d9" fill="#fafafa" d="M41.6,16.4c0-1.6,1-2.9,2.2-2.9H55v18.1c0,2.1-1.3,3.9-3,3.9H12c-1.6,0-3-1.7-3-3.9V13.5h11.2c1.2,0,2.2,1.3,2.2,2.9v0c0,1.6,1,2.9,2.2,2.9h14.8C40.6,19.4,41.6,18,41.6,16.4L41.6,16.4z" />
				</svg>
			);
		}

		// description
		let description;

		if (slots.description) {
			description = slots.description;
		}
		else if (props.description) {
			description = is.boolean(props.description) ? translate("vui.empty.description") : props.description;
		}

		// render
		let children = [];

		children.push(
			<div class={classes.elImage}>{image}</div>
		);

		if (description) {
			children.push(
				<div class={classes.elDescription}>{description}</div>
			);
		}

		if (slots.default) {
			children.push(
				<div class={classes.elContent}>{slots.default}</div>
			);
		}

		return (
			<div class={classes.el}>{children}</div>
		);
	}
};

export default VuiEmpty;