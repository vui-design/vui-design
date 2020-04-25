import { t } from "vui-design/locale";

export default {
	methods: {
		t(...args) {
			return t.apply(this, args);
		}
	}
};