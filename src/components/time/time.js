import Locale from "../../mixins/locale";
import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import padStart from "../../utils/padStart";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    type: PropTypes.oneOf(["relative", "date", "datetime"]).def("relative"),
    time: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.date]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.date]),
    interval: PropTypes.number.def(60)
  };
};

export default {
  name: "vui-time",
  mixins: [
    Locale
  ],
  props: createProps(),
  data() {
    const state = {
      value: ""
    };

    return {
      state
    };
  },
  methods: {
    parse(value) {
      let date;

      if (is.string(value)) {
        date = new Date(value.replace(/-/g, "/"));
      }
      else if (is.number(value)) {
        date = new Date(String(value).length > 10 ? value : value * 1000);
      }
      else if (is.date(value)) {
        date = value;
      }

      return date;
    },
    format(value, type) {
      const date = this.parse(value);

      if (!is.date(date)) {
        return "";
      }

      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();

      month = padStart(month, 2, "0");
      day = padStart(day, 2, "0");
      hour = padStart(hour, 2, "0");
      minute = padStart(minute, 2, "0");
      second = padStart(second, 2, "0");

      if (type === "date") {
        return year + "-" + month + "-" + day;
      }
      else if (type === "datetime") {
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
      }
    },
    getRelativeTime(value) {
      const date = this.parse(value);

      if (!is.date(date)) {
        return "";
      }

      const now = new Date();
      let direction;
      let diff = now.getTime() - date.getTime();

      if (diff >= 0) {
        direction = this.t("vui.time.before");
      }
      else {
        direction = this.t("vui.time.after");
        diff = -diff;
      }

      const years = Math.floor(diff / (86400000 * 365));
      const months = Math.floor(diff / (86400000 * 30));
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor(diff / 60000);

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
      const { $props: props } = this;
      const value = props.value || props.time;
      const callback = () => this.setTimeout();
      const duration = props.interval * 1000;

      if (props.type === "relative") {
        this.state.value = this.getRelativeTime(value);
      }
      else {
        this.state.value = this.getDateTime(value, props.type);
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
    const { $props: props, state } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "time");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    // render
    return (
      <span class={classes.el}>{state.value}</span>
    );
  }
};