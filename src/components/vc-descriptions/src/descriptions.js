import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import range from "vui-design/utils/range";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiDescriptions = {
	name: "vui-descriptions",
	provide() {
		return {
			vuiDescriptions: this
		};
	},
	props: {
		classNamePrefix: PropTypes.string,
		layout: PropTypes.oneOf(["horizontal", "vertical"]).def("horizontal"),
		bordered: PropTypes.bool.def(false),
		fixed: PropTypes.bool.def(false),
		size: PropTypes.oneOf(["small", "medium", "large"]).def("medium"),
		columns: PropTypes.number.def(3),
		data: PropTypes.array.def([]),
		colon: PropTypes.bool,
		labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		labelAlign: PropTypes.oneOf(["left", "center", "right"]),
		title: PropTypes.any,
		extra: PropTypes.any
	},
	methods: {
		getDerivedRows() {
			const { $props: props } = this;
			let rows = [];
			let cols = null;
			let spans = null;

			props.data.forEach((item, index) => {
				if (!cols) {
					cols = [];
					spans = props.columns;
					rows.push(cols);
				}

				const isLastItem = index === props.data.length - 1;
				let isLastSpanSame = true;

				if (isLastItem) {
					isLastSpanSame = !item.span || item.span === spans;
					item.span = spans;
				}

				cols.push(item);

				const { span = 1 } = item;

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
		getDerivedColumns() {
			const { $props: props } = this;
			const isMaybeDouble = props.layout === "horizontal" && props.bordered;
			const columns = range(0, isMaybeDouble ? props.columns * 2 : props.columns);

			return columns;
		},
		getColgroup(h) {
			const columns = this.getDerivedColumns();

			return (
				<colgroup>
					{this.gatherColgroupChildren(h, columns)}
				</colgroup>
			);
		},
		gatherColgroupChildren(h, columns) {
			const { $props: props } = this;
			const isMaybeDouble = props.layout === "horizontal" && props.bordered;

			let cols = [];

			columns.forEach((column, columnIndex) => {
				const width = isMaybeDouble && columnIndex % 2 === 0 ? props.labelWidth : undefined;

				cols.push(
					<col key={columnIndex} width={width} />
				);
			});

			return cols;
		},
		getTbody(h) {
			const rows = this.getDerivedRows();

			return (
				<tbody>
					{this.gatherTbodyChildren(h, rows)}
				</tbody>
			);
		},
		gatherTbodyChildren(h, rows) {
			const { $props: props } = this;

			let colon = props.colon;

			if (colon === undefined && !props.bordered) {
				colon = true;
			}

			const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "descriptions");
			let classes = {};

			classes.elItemLabel = {
				[`${classNamePrefix}-item-label`]: true,
				[`${classNamePrefix}-item-label-colon`]: colon
			};
			classes.elItemContent = `${classNamePrefix}-item-content`;

			let trs = [];

			rows.forEach((row, rowIndex) => {
				if (props.layout === "horizontal") {
					let body = [];

					if (props.bordered) {
						row.forEach((column, columnIndex) => {
							const span = column.span || 1;
							let labelStyle = {};

							if (props.labelAlign) {
								labelStyle.textAlign = props.labelAlign;
							}

							body.push(
								<th class={classes.elItemLabel} style={labelStyle}>{column.label}</th>
							);

							body.push(
								<td class={classes.elItemContent} colSpan={span * 2 - 1}>{column.children}</td>
							);
						});
					}
					else {
						row.forEach((column, columnIndex) => {
							const span = column.span || 1;

							body.push(
								<td colSpan={span}>
									{
										column.label && (
											<label class={classes.elItemLabel}>{column.label}</label>
										)
									}
									<label class={classes.elItemContent}>{column.children}</label>
								</td>
							);
						});
					}

					trs.push(
						<tr>{body}</tr>
					);
				}
				else if (props.layout === "vertical") {
					let header = [];
					let body = [];

					if (props.bordered) {
						row.forEach((column, columnIndex) => {
							const span = column.span || 1;

							header.push(
								<th class={classes.elItemLabel} colSpan={span}>{column.label}</th>
							);

							body.push(
								<td class={classes.elItemContent} colSpan={span}>{column.children}</td>
							);
						});
					}
					else {
						row.forEach((column, columnIndex) => {
							const span = column.span || 1;

							header.push(
								<th colSpan={span}>
									<label class={classes.elItemLabel}>{column.label}</label>
								</th>
							);

							body.push(
								<td colSpan={span}>
									<label class={classes.elItemContent}>{column.children}</label>
								</td>
							);
						});
					}

					trs.push(
						<tr>{header}</tr>
					);

					trs.push(
						<tr>{body}</tr>
					);
				}
			});

			return trs;
		}
	},
	render(h) {
		const { $props: props } = this;

		// table layout
		const isTableLayoutFixed = !props.bordered || (props.bordered && props.fixed);

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "descriptions");
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

		// style
		let style = {};

		style.elTable = {
			tableLayout: isTableLayoutFixed ? "fixed" : "auto"
		};

		// render
		let header = [];

		if (props.title) {
			header.push(
				<div class={classes.elTitle}>{props.title}</div>
			);
		}

		if (props.extra) {
			header.push(
				<div class={classes.elExtra}>{props.extra}</div>
			);
		}

		let body = (
			<table style={style.elTable}>
				{this.getColgroup(h)}
				{this.getTbody(h)}
			</table>
		);

		return (
			<div class={classes.el}>
				{
					header.length && (
						<div class={classes.elHeader}>{header}</div>
					)
				}
				<div class={classes.elBody}>{body}</div>
			</div>
		);
	}
};

export default VuiDescriptions;