import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiDescriptions = {
	name: "vui-descriptions",

	provide() {
		return {
			vuiDescriptions: this
		};
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		layout: {
			type: String,
			default: "horizontal",
			validator: value => ["horizontal", "vertical"].indexOf(value) > -1
		},
		bordered: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: "medium",
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
		},
		title: {
			type: [String, Array],
			default: undefined
		},
		extra: {
			type: [String, Array],
			default: undefined
		},
		columns: {
			type: Number,
			default: 3
		},
		data: {
			type: Array,
			default: () => []
		},
		colon: {
			type: Boolean,
			default: undefined
		},
		labelWidth: {
			type: [String, Number],
			default: undefined
		},
		labelAlign: {
			type: String,
			default: undefined,
			validator: value => ["left", "center", "right"].indexOf(value) > -1
		}
	},

	methods: {
		getDerivedDataFromProps(props) {
			let rows = [];
			let cols = null;
			let spans = null;

			props.data.forEach((item, index) => {
				if (!cols) {
					cols = [];
					spans = props.columns;
					rows.push(cols);
				}

				let isLastItem = index === props.data.length - 1;
				let isLastSpanSame = true;

				if (isLastItem) {
					isLastSpanSame = !item.span || item.span === spans;
					item.span = spans;
				}

				cols.push(item);

				let { span = 1 } = item;

				spans = spans - span;

				if (spans <= 0) {
					cols = null;

					if (!(spans === 0 && isLastSpanSame)) {
						console.warn("[Vui warn][Descriptions]: sum of column \"span\" in a line not match \"columns\" of descriptions.");
					}
				}
			});

			return rows;
		},
		getDerivedRowsFromProps(props) {
			let { getDerivedDataFromProps } = this;

			// class
			let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "description");
			let classes = {};

			classes.elLabel = {
				[`${classNamePrefix}-label`]: true,
				[`${classNamePrefix}-label-colon`]: props.colon || (!props.bordered && props.colon === undefined)
			};
			classes.elContent = `${classNamePrefix}-content`;

			// render
			let data = getDerivedDataFromProps(props);
			let rows = [];

			data.forEach((row, rowIndex) => {
				if (props.layout === "horizontal") {
					let body = [];

					if (props.bordered) {
						row.forEach((col, colIndex) => {
							let labelStyle = {};
							let span = col.span || 1;

							if (props.labelWidth) {
								labelStyle.width = is.string(props.labelWidth) ? props.labelWidth : `${props.labelWidth}px`;
							}

							if (props.labelAlign) {
								labelStyle.textAlign = props.labelAlign;
							}

							body.push(
								<th class={classes.elLabel} style={labelStyle}>{col.label}</th>
							);

							body.push(
								<td class={classes.elContent} colSpan={span * 2 - 1}>{col.children}</td>
							);
						});
					}
					else {
						row.forEach((col, colIndex) => {
							let span = col.span || 1;

							body.push(
								<td colSpan={span}>
									{
										col.label && (
											<label class={classes.elLabel}>{col.label}</label>
										)
									}
									<label class={classes.elContent}>{col.children}</label>
								</td>
							);
						});
					}

					rows.push(
						<tr key={`body-${rowIndex}`}>
							{body}
						</tr>
					);
				}
				else if (props.layout === "vertical") {
					let header = [];
					let body = [];

					if (props.bordered) {
						row.forEach((col, colIndex) => {
							let span = col.span || 1;

							header.push(
								<th class={classes.elLabel} colSpan={span}>{col.label}</th>
							);

							body.push(
								<td class={classes.elContent} colSpan={span}>{col.children}</td>
							);
						});
					}
					else {
						row.forEach((col, colIndex) => {
							let span = col.span || 1;

							header.push(
								<th colSpan={span}>
									{
										col.label && (
											<label class={classes.elLabel}>{col.label}</label>
										)
									}
								</th>
							);

							body.push(
								<td colSpan={span}>
									<label class={classes.elContent}>{col.children}</label>
								</td>
							);
						});
					}

					rows.push(
						<tr key={`header-${rowIndex}`}>
							{header}
						</tr>
					);

					rows.push(
						<tr key={`body-${rowIndex}`}>
							{body}
						</tr>
					);
				}
			});

			return rows;
		}
	},

	render() {
		let { $slots: slots, $props: props } = this;
		let { getDerivedRowsFromProps } = this;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "descriptions");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-bordered`]: props.bordered,
			[`${classNamePrefix}-${props.size}`]: props.size
		};
		classes.elHeader = `${classNamePrefix}-header`;
		classes.elTitle = `${classNamePrefix}-title`;
		classes.elExtra = `${classNamePrefix}-extra`;
		classes.elBody = `${classNamePrefix}-body`;

		// render
		return (
			<div class={classes.el}>
				{
					(props.title || props.extra) && (
						<div class={classes.elHeader}>
							{
								props.title && (
									<div class={classes.elTitle}>{props.title}</div>
								)
							}
							{
								props.extra && (
									<div class={classes.elExtra}>{props.extra}</div>
								)
							}
						</div>
					)
				}
				<div class={classes.elBody}>
					<table>
						<tbody>
							{
								getDerivedRowsFromProps(props)
							}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
};

export default VuiDescriptions;