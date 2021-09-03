import Locale from "../../../mixins/locale";
import is from "../../../utils/is";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiTime = {
	name: "vui-time",

	mixins: [
		Locale
	],

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		type: {
			type: String,
			default: "relative",
			validator: value => ["relative", "date", "datetime"].indexOf(value) > -1
		},
		time: {
			type: [Date, String, Number],
			required: true
		},
		interval: {
			type: Number,
			default: 60
		}
	},

	data() {
		let state = {
			text: ""
		};

		return {
			state
		};
	},

	methods: {
		parse(value) {
			let result;

			if (is.object(value)) {
				result = value;
			}
			else if (is.string(value)) {
				result = new Date(value.replace(/-/g, "/"));
			}
			else if (is.number(value)) {
				result = new Date(String(value).length > 10 ? value : value * 1000);
			}
			else {
				result = new Date();
			}

			return result;
		},
		format(value, type) {
			let result;
			let date = this.parse(value);
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			let hour = date.getHours();
			let minute = date.getMinutes();
			let second = date.getSeconds();

			month = month < 10 ? `0${month}` : month;
			day = day < 10 ? `0${day}` : day;
			hour = hour < 10 ? `0${hour}` : hour;
			minute = minute < 10 ? `0${minute}` : minute;
			second = second < 10 ? `0${second}` : second;

			if (type === "date") {
				result = `${year}-${month}-${day}`;
			}
			else if (type === "datetime") {
				result = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
			}

			return result;
		},
		getRelativeTime(value) {
			let date = this.parse(value);
			let now = new Date();
			let direction;
			let diff = now.getTime() - date.getTime();

			if (diff >= 0) {
				direction = this.t("vui.time.before");
			}
			else {
				direction = this.t("vui.time.after");
				diff = -diff;
			}

			let years = Math.floor(diff / (86400000 * 365));
			let months = Math.floor(diff / (86400000 * 30));
			let days = Math.floor(diff / 86400000);
			let hours = Math.floor(diff / 3600000);
			let minutes = Math.floor(diff / 60000);

			if (years > 0) {
				return years + (years === 1 ? this.t("vui.time.year") : this.t("vui.time.years")) + direction;
			}

			if (months > 0) {
				return months + (months === 1 ? this.t("vui.time.month") : this.t("vui.time.months")) + direction;
			}

			if (days > 0) {
				return days + (days === 1 ? this.t("vui.time.day") : this.t("vui.time.days")) + direction;
			}

			if (hours > 0) {
				return hours + (hours === 1 ? this.t("vui.time.hour") : this.t("vui.time.hours")) + direction;
			}

			if (minutes > 0) {
				return minutes + (minutes === 1 ? this.t("vui.time.minute") : this.t("vui.time.minutes")) + direction;
			}

			return this.t("vui.time.just");
		},
		getDateTime(value, type) {
			return this.format(value, type);
		},
		setTimeout() {
			let { $props: props } = this;
			let callback = () => this.setTimeout();
			let duration = props.interval * 1000;

			if (props.type === "relative") {
				this.state.text = this.getRelativeTime(props.time);
			}
			else {
				this.state.text = this.getDateTime(props.time, props.type);
			}

			clearTimeout(this.timeout);
			this.timeout = setTimeout(callback, duration);
		},
		clearTimeout() {
			if (!this.timeout) {
				return;
			}

			clearTimeout(this.timeout);
			this.timeout = null;
		}
	},

	mounted() {
		this.setTimeout();
	},

	beforeDestroy() {
		this.clearTimeout();
	},

	render() {
		let { $props: props, state } = this;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "time");
		let classes = {};

		classes.el = `${classNamePrefix}`;

		// render
		return (
			<label class={classes.el}>{state.text}</label>
		);
	}
};

export default VuiTime;