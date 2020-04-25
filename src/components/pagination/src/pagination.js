import VuiSelect from "vui-design/components/select";
import VuiOption from "vui-design/components/option";
import VuiInput from "vui-design/components/input";
import Locale from "vui-design/mixins/locale";
import is from "vui-design/utils/is";
import range from "vui-design/utils/range";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiPagination = {
	name: "vui-pagination",

	components: {
		VuiSelect,
		VuiOption,
		VuiInput
	},

	mixins: [
		Locale
	],

	model: {
		prop: "page",
		event: "input"
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		small: {
			type: Boolean,
			default: false
		},
		simple: {
			type: Boolean,
			default: false
		},
		align: {
			type: String,
			default: "left",
			validator: value => ["left", "center", "right"].indexOf(value) > -1
		},
		total: {
			type: Number,
			default: 0
		},
		showTotal: {
			type: [Boolean, Function],
			default: false
		},
		page: {
			type: Number,
			default: 1
		},
		pageSize: {
			type: Number,
			default: 10,
		},
		pageSizeOptions: {
			type: Array,
			default: () => [10, 20, 30, 40],
		},
		showPageSizer: {
			type: Boolean,
			default: false
		},
		showPageElevator: {
			type: Boolean,
			default: false
		},
		prevPageText: {
			type: String,
			default: undefined
		},
		nextPageText: {
			type: String,
			default: undefined
		},
		hideOnSinglePage: {
			type: Boolean,
			default: false
		}
	},

	data() {
		let { total, page, pageSize } = this;
		let totalPages = this.getTotalPages(total, pageSize);

		if (page < 1) {
			page = 1;
		}
		else if (page > totalPages) {
			page = totalPages;
		}

		return {
			currentPage: page,
			currentPageSize: pageSize
		};
	},

	computed: {
		totalPages() {
			return this.getTotalPages(this.total, this.currentPageSize);
		}
	},

	watch: {
		page(value) {
			let totalPages = this.getTotalPages(this.total, this.currentPageSize);

			if (value < 1) {
				value = 1;
			}
			else if (value > totalPages) {
				value = totalPages;
			}

			this.currentPage = value;
		},
		pageSize(value) {
			let totalPages = this.getTotalPages(this.total, value);

			if (this.currentPage > totalPages) {
				this.currentPage = totalPages;
			}

			this.currentPageSize = value;
		}
	},

	methods: {
		getTotalPages(total, pageSize) {
			let totalPages = Math.ceil(total / pageSize);

			if (totalPages < 1) {
				totalPages = 1;
			}

			return totalPages;
		},

		handlePrevPage() {
			let newPage = this.currentPage - 1;

			if (newPage < 1) {
				return;
			}

			this.handleChangePage(newPage);
		},
		handleNextPage() {
			let newPage = this.currentPage + 1;

			if (newPage > this.totalPages) {
				return;
			}

			this.handleChangePage(newPage);
		},
		handlePrevFivePage() {
			let newPage = this.currentPage - 5;

			if (newPage > 1) {
				this.handleChangePage(newPage);
			}
			else {
				this.handleChangePage(1);
			}
		},
		handleNextFivePage() {
			let newPage = this.currentPage + 5;

			if (newPage < this.totalPages) {
				this.handleChangePage(newPage);
			}
			else {
				this.handleChangePage(this.totalPages);
			}
		},
		handleInputPage(e) {
			let keyCode = e.keyCode;

			if (keyCode === 38 || keyCode === 40) {
				e.preventDefault();
			}
		},
		handleConfirmPage(e) {
			let keyCode = e.keyCode;

			if (keyCode === 38) {
				this.handlePrevPage();
			}
			else if (keyCode === 40) {
				this.handleNextPage();
			}
			else if (keyCode === 13) {
				let value = e.target.value.trim();

				if ((/^-?[0-9]\d*$/).test(value)) {
					value = Number(value);

					if (value === this.currentPage) {
						return;
					}

					if (value > this.totalPages) {
						value = this.totalPages;
					}
					else if (value < 1) {
						value = 1;
					}

					e.target.value = value;
					this.handleChangePage(value);
				}
				else {
					e.target.value = this.currentPage;
				}
			}
		},
		handleChangePage(page) {
			if (this.currentPage === page) {
				return;
			}

			this.currentPage = page;
			this.$emit("input", page);
			this.$emit("change", page);
		},
		handleChangePageSize(pageSize) {
			let totalPages = this.getTotalPages(this.total, pageSize);
			let currentPage = this.currentPage;

			if (currentPage > totalPages) {
				currentPage = totalPages;
			}

			this.currentPageSize = pageSize;
			this.handleChangePage(currentPage);
			this.$emit("changePageSize", pageSize);
		}
	},

	render(h) {
		let { t: translate, classNamePrefix: customizedClassNamePrefix, small, simple, align, total, showTotal, totalPages, currentPage: page, currentPageSize: pageSize, pageSizeOptions, showPageSizer, showPageElevator, prevPageText, nextPageText, hideOnSinglePage } = this;
		let { handlePrevPage, handleNextPage, handlePrevFivePage, handleNextFivePage, handleInputPage, handleConfirmPage, handleChangePage, handleChangePageSize } = this;
		let show = hideOnSinglePage ? totalPages > 1 : true;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "pagination");
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-small`]: small,
			[`${classNamePrefix}-simple`]: simple,
			[`${classNamePrefix}-align-${align}`]: align
		};

		let btnPrevPage = {
			key:"prevPage",
			title: translate("vui.pagination.prevPage"),
			className: {
				[`${classNamePrefix}-button`]: true,
				[`${classNamePrefix}-button-prev`]: true,
				[`${classNamePrefix}-button-disabled`]: page === 1
			},
			children: prevPageText || (
				<svg viewBox="0 0 10 10" class={`${classNamePrefix}-button-arrow`}>
					<path d="M3.6,5l4.1-4.1c0.2-0.2,0.2-0.6,0-0.8c-0.2-0.2-0.6-0.2-0.8,0L2.4,4.6c-0.2,0.2-0.2,0.6,0,0.8l4.5,4.4 c0.2,0.2,0.6,0.2,0.8,0c0.2-0.2,0.2-0.6,0-0.8L3.6,5z" />
				</svg>
			),
			handler: handlePrevPage
		};
		let btnNextPage = {
			key:"nextPage",
			title: translate("vui.pagination.nextPage"),
			className: {
				[`${classNamePrefix}-button`]: true,
				[`${classNamePrefix}-button-next`]: true,
				[`${classNamePrefix}-button-disabled`]: page === totalPages
			},
			children: nextPageText || (
				<svg viewBox="0 0 10 10" class={`${classNamePrefix}-button-arrow`}>
					<path d="M6.4,5L2.4,0.9c-0.2-0.2-0.2-0.6,0-0.8c0.2-0.2,0.6-0.2,0.8,0l4.5,4.4c0.2,0.2,0.2,0.6,0,0.8L3.2,9.8c-0.2,0.2-0.6,0.2-0.8,0c-0.2-0.2-0.2-0.6,0-0.8L6.4,5z" />
				</svg>
			),
			handler: handleNextPage
		};

		let btnPrevFivePage = {
			key:"prevFivePage",
			title: translate("vui.pagination.prevFivePage"),
			className: {
				[`${classNamePrefix}-ellipsis`]: true
			},
			icon: (
				<i class={`${classNamePrefix}-ellipsis-icon`}>•••</i>
			),
			arrow: (
				<svg class={`${classNamePrefix}-ellipsis-arrow`} viewBox="0 0 10 10">
					<path d="M1.4,5l4.1-4.1c0.2-0.2,0.2-0.6,0-0.8c-0.2-0.2-0.6-0.2-0.8,0L0.2,4.6c-0.2,0.2-0.2,0.6,0,0.8l4.5,4.4c0.2,0.2,0.6,0.2,0.8,0c0.2-0.2,0.2-0.6,0-0.8L1.4,5z M5.8,5l4.1-4.1c0.2-0.2,0.2-0.6,0-0.8C9.6-0.1,9.3-0.1,9,0.2L4.6,4.6c-0.2,0.2-0.2,0.6,0,0.8L9,9.8c0.2,0.2,0.6,0.2,0.8,0s0.2-0.6,0-0.8L5.8,5z" />
				</svg>
			),
			handler: handlePrevFivePage
		};
		let btnNextFivePage = {
			key:"nextFivePage",
			title: translate("vui.pagination.nextFivePage"),
			className: {
				[`${classNamePrefix}-ellipsis`]: true
			},
			icon: (
				<i class={`${classNamePrefix}-ellipsis-icon`}>•••</i>
			),
			arrow: (
				<svg class={`${classNamePrefix}-ellipsis-arrow`} viewBox="0 0 10 10">
					<path d="M8.6,5L4.6,0.9c-0.2-0.2-0.2-0.6,0-0.8c0.2-0.2,0.6-0.2,0.8,0l4.5,4.4c0.2,0.2,0.2,0.6,0,0.8L5.4,9.8c-0.2,0.2-0.6,0.2-0.8,0c-0.2-0.2-0.2-0.6,0-0.8L8.6,5z M4.2,5L0.2,0.9c-0.2-0.2-0.2-0.6,0-0.8c0.2-0.2,0.6-0.2,0.8,0l4.5,4.4c0.2,0.2,0.2,0.6,0,0.8L1,9.8c-0.2,0.2-0.6,0.2-0.8,0c-0.2-0.2-0.2-0.6,0-0.8L4.2,5z" />
				</svg>
			),
			handler: handleNextFivePage
		};

		if (simple) {
			return (
				<ul v-show={show} class={classes}>
					<li key={btnPrevPage.key} title={btnPrevPage.title} class={btnPrevPage.className} onClick={btnPrevPage.handler}>
						{btnPrevPage.children}
					</li>
					<li class={`${classNamePrefix}-elevator`}>
						<VuiInput size="small" value={page} onKeydown={handleInputPage} onKeyup={handleConfirmPage} />
						{
							showTotal && (
								<span>/ {totalPages}</span>
							)
						}
					</li>
					<li key={btnNextPage.key} title={btnNextPage.title} class={btnNextPage.className} onClick={btnNextPage.handler}>
						{btnNextPage.children}
					</li>
				</ul>
			);
		}
		else {
			let totalText;

			if (showTotal) {
				if (is.function(showTotal)) {
					let rangeFrom = (page - 1) * pageSize + 1;
					let rangeTo = page * pageSize;

					if (total < 1) {
						rangeFrom = 0;
					}

					if (rangeTo > total) {
						rangeTo = total;
					}

					totalText = showTotal(total, [rangeFrom, rangeTo]);
				}
				else {
					totalText = `${translate("vui.pagination.total")} ${total} ${translate("vui.pagination." + (total > 1 ? "items" : "item"))}`;
				}
			}

			let items = [];

			if (totalPages < 9) {
				items = range(1, totalPages + 1);
			}
			else {
				if (page < 6) {
					items = [1, 2, 3, 4, 5, 6, "nextFivePage", totalPages];
				}
				else if (page > totalPages - 5) {
					items = [1, "prevFivePage", totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
				}
				else {
					items = [1, "prevFivePage", page - 2, page - 1, page, page + 1, page + 2, "nextFivePage", totalPages];
				}
			}

			return (
				<ul v-show={show} class={classes}>
					{
						showTotal && (
							<li key={"total"} class={`${classNamePrefix}-total`}>
								{totalText}
							</li>
						)
					}
					<li key={btnPrevPage.key} title={btnPrevPage.title} class={btnPrevPage.className} onClick={btnPrevPage.handler}>
						{btnPrevPage.children}
					</li>
					{
						items.map(item => {
							if (item === "prevFivePage") {
								let attrs = btnPrevFivePage;

								return (
									<li key={attrs.key} title={attrs.title} class={attrs.className} onClick={attrs.handler}>
										{attrs.icon}
										{attrs.arrow}
									</li>
								);
							}
							else if (item === "nextFivePage") {
								let attrs = btnNextFivePage;

								return (
									<li key={attrs.key} title={attrs.title} class={attrs.className} onClick={attrs.handler}>
										{attrs.icon}
										{attrs.arrow}
									</li>
								);
							}
							else {
								let attrs = {
									key: item,
									title: item,
									className: {
										[`${classNamePrefix}-item`]: true,
										[`${classNamePrefix}-item-active`]: page === item
									},
									children: item,
									handler: e => handleChangePage(item)
								};

								return (
									<li key={attrs.key} title={attrs.title} class={attrs.className} onClick={attrs.handler}>
										{attrs.children}
									</li>
								);
							}
						})
					}
					<li key={btnNextPage.key} title={btnNextPage.title} class={btnNextPage.className} onClick={btnNextPage.handler}>
						{btnNextPage.children}
					</li>
					{
						showPageSizer && (
							<li key={"sizer"} class={`${classNamePrefix}-sizer`}>
								<VuiSelect size={small ? "small" : undefined} value={pageSize} onInput={handleChangePageSize}>
									{
										pageSizeOptions.map(option => {
											return (
												<VuiOption key={option} value={option}>
													{option} {translate("vui.pagination.pageSize")}
												</VuiOption>
											);
										})
									}
								</VuiSelect>
							</li>
						)
					}
					{
						showPageElevator && (
							<li key={"elevator"} class={`${classNamePrefix}-elevator`}>
								<span>{translate("vui.pagination.goto")}</span>
								<VuiInput size={small ? "small" : undefined} value={page} onKeydown={handleInputPage} onKeyup={handleConfirmPage} />
								<span>{translate("vui.pagination.page")}</span>
							</li>
						)
					}
				</ul>
			);
		}
	}
};

export default VuiPagination;