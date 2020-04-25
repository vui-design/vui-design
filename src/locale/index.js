import Vue from "vue";
import deepMerge from "vui-design/utils/deepMerge";
import format from "./utils/format";
import defaultLang from "./lang/zh-CN";

const formater = format(Vue);
let lang = defaultLang;
let merged = false;
let i18nHandler = function() {
	const vueI18n = Object.getPrototypeOf(this || Vue).$t;

	if (typeof vueI18n === "function" && !!Vue.locale) {
		if (!merged) {
			merged = true;

			Vue.locale(Vue.config.lang, deepMerge(lang, Vue.locale(Vue.config.lang) || {}, { clone: true }));
		}

		return vueI18n.apply(this, arguments);
	}
};

export const t = function(path, options) {
	let value = i18nHandler.apply(this, arguments);

	if (value !== null && value !== undefined) {
		return value;
	}

	const array = path.split(".");
	let current = lang;

	for (let i = 0, length = array.length; i < length; i++) {
		const property = array[i];

		value = current[property];

		if (i === length - 1) {
			return formater(value, options);
		}

		if (!value) {
			return "";
		}

		current = value;
	}

	return "";
};

export const use = function(language) {
	lang = language || lang;
};

export const i18n = function(fn) {
	i18nHandler = fn || i18nHandler;
};

export default {
	t,
	use,
	i18n
};