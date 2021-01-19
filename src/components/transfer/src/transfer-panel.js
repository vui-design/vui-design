import VuiCheckbox from "vui-design/components/checkbox";
import VuiTransferPanelSearch from "./transfer-panel-search";
import VuiTransferPanelBodyList from "./transfer-panel-body-list";
import VuiTransferPanelBodyEmpty from "./transfer-panel-body-empty";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import utils from "./utils";

const VuiTransferPanel = {
	name: "vui-transfer-panel",
	components: {
		VuiCheckbox,
		VuiTransferPanelSearch,
		VuiTransferPanelBodyList,
		VuiTransferPanelBodyEmpty
	},
	props: {
		classNamePrefix: PropTypes.string,
		direction: PropTypes.string,
		title: PropTypes.string,
		data: PropTypes.array.def([]),
		optionKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def("key"),
		selectedKeys: PropTypes.array.def([]),
		option: PropTypes.func.def(option => option.key),
		body: PropTypes.func,
		footer: PropTypes.func,
		showSelectAll: PropTypes.bool.def(true),
		searchable: PropTypes.bool.def(false),
		filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]).def(true),
		filterOptionProp: PropTypes.string.def("key"),
		disabled: PropTypes.bool.def(false),
		locale: PropTypes.object
	},
	data() {
		const { $props: props } = this;
		const state = {
			keyword: "",
			selectedKeys: clone(props.selectedKeys)
		};

		return {
			state
		};
	},
	watch: {
		selectedKeys(value) {
			this.state.selectedKeys = clone(value);
		}
	},
	methods: {
		getPanelHeader(props) {
			// classes
			const classNamePrefix = `${props.classNamePrefix}-header`;
			let classes = {};

			classes.el = `${classNamePrefix}`;
			classes.elCheckbox = `${classNamePrefix}-checkbox`;
			classes.elTitle = `${classNamePrefix}-title`;
			classes.elSelection = `${classNamePrefix}-selection`;

			// length
			const length = props.options.length;
			const selectedLength = props.selectedKeys.length;

			// render
			let content = [];

			if (props.showSelectAll) {
				const options = props.options.filter(option => !option.disabled);
				const keys = options.map(option => utils.getOptionKey(option, props.optionKey));

				let checked = false;
				let indeterminate = false;
				const disabled = props.disabled || options.length === 0;

				if (length > 0 && selectedLength > 0) {
					checked = keys.every(key => props.selectedKeys.indexOf(key) > -1);
					indeterminate = keys.some(key => props.selectedKeys.indexOf(key) > -1);
				}

				const onChange = checked => {
					let selectedKeys = clone(props.selectedKeys);

					if (checked) {
						keys.forEach(key => {
							const index = selectedKeys.indexOf(key);

							if (index === -1) {
								selectedKeys.push(key);
							}
						});
					}
					else {
						keys.forEach(key => {
							const index = selectedKeys.indexOf(key);

							if (index > -1) {
								selectedKeys.splice(index, 1);
							}
						});
					}

					props.onSelectAll(selectedKeys);
				};

				content.push(
					<div class={classes.elCheckbox}>
						<VuiCheckbox checked={checked} indeterminate={indeterminate} disabled={disabled} onChange={onChange} />
					</div>
				);
			}

			if (props.title) {
				content.push(
					<div class={classes.elTitle}>
						{props.title}
					</div>
				);
			}

			content.push(
				<div class={classes.elSelection}>
					{selectedLength > 0 ? `${selectedLength} / ${length}` : `${length}`}
				</div>
			);

			return (
				<div class={classes.el}>
					{content}
				</div>
			);
		},
		getPanelSearch(props) {
			if (!props.searchable) {
				return;
			}

			return (
				<VuiTransferPanelSearch
					classNamePrefix={props.classNamePrefix}
					value={props.value}
					placeholder={props.placeholder}
					disabled={props.disabled}
					onSearch={props.onSearch}
				/>
			);
		},
		getPanelBody(scopedSlot, props) {
			// classes
			const classNamePrefix = `${props.classNamePrefix}-body`;
			let classes = {};

			classes.el = `${classNamePrefix}`;
			classes.elEmpty = `${classNamePrefix}-empty`;

			// render
			let content = scopedSlot;

			if (!content) {
				if (props.options.length) {
					content = (
						<VuiTransferPanelBodyList
							classNamePrefix={classNamePrefix}
							data={props.options}
							optionKey={props.optionKey}
							selectedKeys={props.selectedKeys}
							option={props.option}
							disabled={props.disabled}
							onSelect={props.onSelect}
						/>
					);
				}
				else {
					content = (
						<VuiTransferPanelBodyEmpty
							classNamePrefix={classNamePrefix}
							description={props.locale ? props.locale.notFound : undefined}
						/>
					);
				}
			}

			return (
				<div class={classes.el} onScroll={props.onScroll}>
					{content}
				</div>
			);
		},
		getPanelFooter(scopedSlot, props) {
			// classes
			const classNamePrefix = `${props.classNamePrefix}-footer`;
			let classes = {};

			classes.el = `${classNamePrefix}`;

			// render
			let content = scopedSlot;

			if (!content) {
				return;
			}

			return (
				<div class={classes.el}>
					{content}
				</div>
			);
		},
		handleSelectAll(selectedKeys) {
			this.handleSelect(selectedKeys);
		},
		handleSearch(keyword) {
			this.state.keyword = keyword;
			this.$emit("search", keyword);
		},
		handleScroll(e) {
			this.$emit("scroll", e);
		},
		handleSelect(selectedKeys) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.state.selectedKeys = selectedKeys;
			this.$emit("select", clone(this.state.selectedKeys));
		}
	},
	render() {
		const { $props: props, state } = this;
		const { handleSelectAll, handleSearch, handleScroll, handleSelect } = this;

		// options
		let options = props.data;

		if (props.searchable && state.keyword && props.filter) {
			options = utils.getFilteredOptions(options, state.keyword, props.filter, props.filterOptionProp);
		}

		// classes
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "panel");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-with-search`]: props.searchable
		};

		// header
		const theHeaderProps = {
			classNamePrefix,
			title: props.title,
			options,
			optionKey: props.optionKey,
			selectedKeys: state.selectedKeys,
			showSelectAll: props.showSelectAll,
			disabled: props.disabled,
			onSelectAll: handleSelectAll
		};
		const header = this.getPanelHeader(theHeaderProps);

		// search
		const theSearchProps = {
			classNamePrefix,
			searchable: props.searchable,
			value: state.keyword,
			placeholder: props.locale ? props.locale.search : undefined,
			disabled: props.disabled,
			onSearch: handleSearch
		};
		const search = this.getPanelSearch(theSearchProps);

		// body
		const theBodyProps = {
			classNamePrefix,
			direction: props.direction,
			data: props.data,
			options,
			optionKey: props.optionKey,
			selectedKeys: state.selectedKeys,
			option: props.option,
			searchable: props.searchable,
			keyword: state.keyword,
			disabled: props.disabled,
			locale: props.locale,
			onScroll: handleScroll,
			onSelect: handleSelect
		};
		const body = this.getPanelBody(is.function(props.body) ? props.body(theBodyProps) : undefined, theBodyProps);

		// footer
		const theFooterProps = {
			classNamePrefix,
			direction: props.direction,
			data: props.data,
			options,
			disabled: props.disabled,
			locale: props.locale
		};
		const footer = this.getPanelFooter(is.function(props.footer) ? props.footer(theFooterProps) : undefined, theFooterProps);

		// render
		return (
			<div class={classes.el}>
				{header}
				{search}
				{body}
				{footer}
			</div>
		);
	}
};

export default VuiTransferPanel;