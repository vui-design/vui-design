import VuiCheckbox from "../../checkbox";
import VuiTransferPanelSearch from "./transfer-panel-search";
import VuiTransferPanelBodyMenu from "./transfer-panel-body-menu";
import VuiTransferPanelBodyEmpty from "./transfer-panel-body-empty";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import clone from "../../../utils/clone";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";
import utils from "./utils";

const VuiTransferPanel = {
	name: "vui-transfer-panel",
	components: {
		VuiCheckbox,
		VuiTransferPanelSearch,
		VuiTransferPanelBodyMenu,
		VuiTransferPanelBodyEmpty
	},
	props: {
		classNamePrefix: PropTypes.string,
		direction: PropTypes.string,
		title: PropTypes.string,
		options: PropTypes.array.def([]),
		optionKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def("key"),
		selectedKeys: PropTypes.array.def([]),
		formatter: PropTypes.func.def(option => option.key),
		body: PropTypes.func,
		footer: PropTypes.func,
		showSelectAll: PropTypes.bool.def(true),
		searchable: PropTypes.bool.def(false),
		keyword: PropTypes.string.def(""),
		filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]).def(true),
		filterOptionProp: PropTypes.string.def("key"),
		disabled: PropTypes.bool.def(false),
		locale: PropTypes.object
	},
	data() {
		const { $props: props } = this;
		const state = {
			keyword: props.keyword,
			selectedKeys: clone(props.selectedKeys)
		};

		return {
			state
		};
	},
	watch: {
		keyword(value) {
			this.state.keyword = value;
		},
		selectedKeys(value) {
			this.state.selectedKeys = clone(value);
		}
	},
	methods: {
		getPanelHeader(props) {
			// class
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
				const optionKeys = options.map(option => utils.getOptionKey(option, props.optionKey));

				let checked = false;
				let indeterminate = false;
				const disabled = props.disabled || options.length === 0;

				if (length > 0 && selectedLength > 0) {
					checked = optionKeys.every(optionKey => props.selectedKeys.indexOf(optionKey) > -1);
					indeterminate = optionKeys.some(optionKey => props.selectedKeys.indexOf(optionKey) > -1);
				}

				const onChange = checked => {
					let selectedKeys = clone(props.selectedKeys);

					if (checked) {
						optionKeys.forEach(optionKey => {
							const index = selectedKeys.indexOf(optionKey);

							if (index === -1) {
								selectedKeys.push(optionKey);
							}
						});
					}
					else {
						optionKeys.forEach(optionKey => {
							const index = selectedKeys.indexOf(optionKey);

							if (index > -1) {
								selectedKeys.splice(index, 1);
							}
						});
					}

					props.onSelectAll(selectedKeys);
				};

				content.push(
					<div class={classes.elCheckbox}>
						<VuiCheckbox checked={checked} indeterminate={indeterminate} disabled={disabled} validator={false} onChange={onChange} />
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
			// class
			const classNamePrefix = `${props.classNamePrefix}-body`;
			let classes = {};

			classes.el = `${classNamePrefix}`;
			classes.elEmpty = `${classNamePrefix}-empty`;

			// render
			let content = scopedSlot;

			if (!content) {
				if (props.options.length) {
					content = (
						<VuiTransferPanelBodyMenu
							classNamePrefix={classNamePrefix}
							options={props.options}
							optionKey={props.optionKey}
							selectedKeys={props.selectedKeys}
							formatter={props.formatter}
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
			// class
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
		let options = props.options;

		if (props.searchable && state.keyword && props.filter) {
			options = utils.getFilteredOptions(options, state.keyword, props.filter, props.filterOptionProp);
		}

		// class
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
			options,
			optionKey: props.optionKey,
			selectedKeys: state.selectedKeys,
			formatter: props.formatter,
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