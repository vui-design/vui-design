<template>
	<div v-bind:class="classes.el" v-outclick="handleClose">
		<div ref="trigger" v-bind:class="classes.elTrigger" v-on:click="handleToggle">
			<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
				<path d="M0 0h1024L624.390244 462.04878v561.95122l-224.780488-112.390244V449.560976L0 0z m0 0"></path>
			</svg>
		</div>
		<transition v-bind:name="animation" appear>
			<div ref="dropdown" v-bind:class="classes.elDropdown" v-portal="portal" v-show="visible">
				<template v-if="multiple">
					<div v-bind:class="classes.elDropdownBody">
						<vui-checkbox-group v-model="store">
							<vui-checkbox v-for="option in options" v-bind:key="option.value" v-bind:label="option.label" v-bind:value="option.value" />
						</vui-checkbox-group>
					</div>
					<div v-bind:class="classes.elDropdownFooter">
						<a v-on:click="handleConfirm">{{btnConfirmText}}</a>
						<a v-on:click="handleClear">{{btnClearText}}</a>
					</div>
				</template>
				<template v-else>
					<div v-bind:class="classes.elDropdownBody">
						<vui-radio-group v-model="store">
							<vui-radio v-for="option in options" v-bind:key="option.value" v-bind:label="option.label" v-bind:value="option.value" />
						</vui-radio-group>
					</div>
					<div v-bind:class="classes.elDropdownFooter">
						<a v-on:click="handleConfirm">{{btnConfirmText}}</a>
						<a v-on:click="handleClear">{{btnClearText}}</a>
					</div>
				</template>
			</div>
		</transition>
	</div>
</template>

<script>
	import VuiCheckboxGroup from "vui-design/components/checkbox-group";
	import VuiCheckbox from "vui-design/components/checkbox";
	import VuiRadioGroup from "vui-design/components/radio-group";
	import VuiRadio from "vui-design/components/radio";
	import Portal from "vui-design/directives/portal";
  	import Outclick from "vui-design/directives/outclick";
	import Locale from "vui-design/mixins/locale";
	import Popup from "vui-design/utils/popup";
	import is from "vui-design/utils/is";
	import clone from "vui-design/utils/clone";

	const VuiTableFilter = {
		name: "vui-table-filter",

		inject: {
			vuiTable: {
				default: undefined
			},
			vuiTableThead: {
				default: undefined
			}
		},

		components: {
			VuiCheckboxGroup,
			VuiCheckbox,
			VuiRadioGroup,
			VuiRadio
		},

		directives: {
			Portal,
			Outclick,
		},

		mixins: [
			Locale
		],

		props: {
			classNamePrefix: {
				type: String,
				default: "vui-table"
			},
			options: {
				type: Array,
				default: []
			},
			multiple: {
				type: Boolean,
				default: true
			},
			value: {
				type: [String, Number, Array],
				default: undefined
			},
			animation: {
				type: String,
				default: "vui-table-column-filter-dropdown-slide"
			},
			placement: {
				type: String,
				default: "bottom-end",
				validator(value) {
					return ["top-start", "top", "top-end", "bottom-start", "bottom", "bottom-end"].indexOf(value) !== -1;
				}
			},
			getPopupContainer: {
				type: Function,
				default: () => document.body
			},
			locale: {
				type: Object,
				default: undefined
			}
		},

		data() {
			return {
				visible: false,
				store: undefined
			};
		},

		computed: {
			portal() {
				return this.getPopupContainer();
			},
			classes() {
				const { classNamePrefix, multiple, value, visible } = this;
				const classes = {};

				classes.el = `${classNamePrefix}-column-filter`;
				classes.elTrigger = {
					[`${classNamePrefix}-column-filter-trigger`]: true,
					[`open`]: visible,
					[`on`]: multiple ? value.length > 0 : value
				};
				classes.elDropdown = `${classNamePrefix}-column-filter-dropdown`;
				classes.elDropdownBody = `${classNamePrefix}-column-filter-dropdown-body`;
				classes.elDropdownFooter = `${classNamePrefix}-column-filter-dropdown-footer`;

				return classes;
			},
			btnConfirmText() {
				const { locale, t } = this;

				if (locale && locale.confirm) {
					return locale.confirm;
				}
				else {
					return t("vui.table.confirm");
				}
			},
			btnClearText() {
				const { locale, t } = this;

				if (locale && locale.clear) {
					return locale.clear;
				}
				else {
					return t("vui.table.clear");
				}
			}
		},

		watch: {
			value: {
				immediate: true,
				handler(value) {
					this.store = this.multiple ? clone(value) : value;
				}
			},
			visible: {
				handler(value) {
					value && this.$nextTick(this.createPopupPlugin);
				}
			}
		},

		methods: {
			createPopupPlugin() {
				if (is.server || !this.visible) {
					return;
				}

				const zIndex = Popup.nextZIndex();

				if (this.popup) {
					this.popup.update();
					this.popup.target.style.zIndex = zIndex;
				}
				else {
					const reference = this.$refs.trigger;
					const target = this.$refs.dropdown;
					const placement = this.placement;

					if (!reference || !target || !/^(top|bottom)(-start|-end)?$/g.test(placement)) {
						return;
					}

					this.popup = new Popup(reference, target, {
						placement,
						onCreate: () => this.$nextTick(this.createPopupPlugin)
					});
					this.popup.target.style.zIndex = zIndex;
				}
			},
			destroyPopupPlugin() {
				if (is.server || !this.popup) {
					return;
				}

				this.popup.destroy();
				this.popup = null;
			},
			handleToggle(e) {
				e.stopPropagation();

				this.visible = !this.visible;
			},
			handleClose(e) {
				const { $el, $refs, multiple, value } = this;

				if (!$el.contains($refs.dropdown) && $refs.dropdown.contains(e.target)) {
					return;
				}

				this.visible = false;
				this.store = multiple ? clone(value) : value;
			},
			handleConfirm(e) {
				const { multiple, store } = this;

				this.visible = false;
				this.$emit("change", multiple ? clone(store) : store);
			},
			handleClear(e) {
				const { multiple } = this;

				this.visible = false;
				this.$emit("change", multiple ? [] : undefined);
			}
		},

		mounted() {
			this.$nextTick(this.createPopupPlugin);
		},

		beforeDestroy() {
			this.destroyPopupPlugin();
		}
	};

	export default VuiTableFilter;
</script>
