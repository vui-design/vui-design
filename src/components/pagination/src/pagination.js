import VuiSelect from "../../select";
import VuiOption from "../../option";
import VuiInput from "../../input";
import Locale from "../../../mixins/locale";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import range from "../../../utils/range";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    small: PropTypes.bool.def(false),
    simple: PropTypes.bool.def(false),
    align: PropTypes.oneOf(["left", "center", "right"]).def("left"),
    total: PropTypes.number.def(0),
    showTotal: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    page: PropTypes.number.def(1),
    pageSize: PropTypes.number.def(10),
    pageSizeOptions: PropTypes.array.def([10, 20, 30, 40]),
    showPageSizer: PropTypes.bool.def(false),
    showPageElevator: PropTypes.bool.def(false),
    prevPageText: PropTypes.string,
    nextPageText: PropTypes.string,
    hideOnSinglePage: PropTypes.bool.def(false)
  };
};

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
  props: createProps(),
  data() {
    const { $props: props } = this;
    const totalPages = this.getTotalPages(props.total, props.pageSize);
    let page = props.page;

    if (page < 1) {
      page = 1;
    }
    else if (page > totalPages) {
      page = totalPages;
    }

    return {
      state: {
        page: page,
        pageSize: props.pageSize
      }
    };
  },
  computed: {
    totalPages() {
      const { $props: props, state } = this;

      return this.getTotalPages(props.total, state.pageSize);
    }
  },
  watch: {
    page(value) {
      const { $props: props, state } = this;
      const totalPages = this.getTotalPages(props.total, state.pageSize);
      let page = value;

      if (page < 1) {
        page = 1;
      }
      else if (page > totalPages) {
        page = totalPages;
      }

      this.state.page = page;
    },
    pageSize(value) {
      const { $props: props, state } = this;
      const totalPages = this.getTotalPages(props.total, value);
      let page = state.page;

      if (page > totalPages) {
        page = totalPages;
      }

      this.state.page = page;
      this.state.pageSize = value;
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
      const { state } = this;
      const newPage = state.page - 1;

      if (newPage < 1) {
        return;
      }

      this.handleChangePage(newPage);
    },
    handleNextPage() {
      const { state } = this;
      const newPage = state.page + 1;

      if (newPage > this.totalPages) {
        return;
      }

      this.handleChangePage(newPage);
    },
    handlePrevFivePage() {
      const { state } = this;
      const newPage = state.page - 5;

      if (newPage > 1) {
        this.handleChangePage(newPage);
      }
      else {
        this.handleChangePage(1);
      }
    },
    handleNextFivePage() {
      const { state } = this;
      const newPage = state.page + 5;

      if (newPage < this.totalPages) {
        this.handleChangePage(newPage);
      }
      else {
        this.handleChangePage(this.totalPages);
      }
    },
    handleInputPage(e) {
      const keyCode = e.keyCode;

      if (keyCode === 38 || keyCode === 40) {
        e.preventDefault();
      }
    },
    handleConfirmPage(e) {
      const { state } = this;
      const keyCode = e.keyCode;

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

          if (value === state.page) {
            return;
          }

          if (value < 1) {
            value = 1;
          }
          else if (value > this.totalPages) {
            value = this.totalPages;
          }

          e.target.value = value;
          this.handleChangePage(value);
        }
        else {
          e.target.value = state.page;
        }
      }
    },
    handleChangePage(page) {
      const { state } = this;

      if (state.page === page) {
        return;
      }

      this.state.page = page;
      this.$emit("input", page);
      this.$emit("change", page);
    },
    handleChangePageSize(pageSize) {
      const { $props: props, state } = this;
      const totalPages = this.getTotalPages(props.total, pageSize);
      let page = state.page;

      if (page > totalPages) {
        page = totalPages;
      }

      this.state.pageSize = pageSize;
      this.handleChangePage(page);
      this.$emit("changePageSize", pageSize);
    }
  },
  render(h) {
    const { t: translate, $props: props, state } = this;
    const { handlePrevPage, handleNextPage, handlePrevFivePage, handleNextFivePage, handleInputPage, handleConfirmPage, handleChangePage, handleChangePageSize } = this;

    // show
    const show = props.hideOnSinglePage ? this.totalPages > 1 : true;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "pagination");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-small`]: props.small,
      [`${classNamePrefix}-simple`]: props.simple,
      [`${classNamePrefix}-align-${props.align}`]: props.align
    };

    // render
    const btnPrevPage = {
      key:"prevPage",
      title: translate("vui.pagination.prevPage"),
      className: {
        [`${classNamePrefix}-button`]: true,
        [`${classNamePrefix}-button-prev`]: true,
        [`${classNamePrefix}-button-disabled`]: state.page === 1
      },
      children: props.prevPageText || (
        <svg viewBox="0 0 10 10" class={`${classNamePrefix}-button-arrow`}>
          <path d="M3.6,5l4.1-4.1c0.2-0.2,0.2-0.6,0-0.8c-0.2-0.2-0.6-0.2-0.8,0L2.4,4.6c-0.2,0.2-0.2,0.6,0,0.8l4.5,4.4 c0.2,0.2,0.6,0.2,0.8,0c0.2-0.2,0.2-0.6,0-0.8L3.6,5z" />
        </svg>
      ),
      handler: handlePrevPage
    };
    const btnNextPage = {
      key:"nextPage",
      title: translate("vui.pagination.nextPage"),
      className: {
        [`${classNamePrefix}-button`]: true,
        [`${classNamePrefix}-button-next`]: true,
        [`${classNamePrefix}-button-disabled`]: state.page === this.totalPages
      },
      children: props.nextPageText || (
        <svg viewBox="0 0 10 10" class={`${classNamePrefix}-button-arrow`}>
          <path d="M6.4,5L2.4,0.9c-0.2-0.2-0.2-0.6,0-0.8c0.2-0.2,0.6-0.2,0.8,0l4.5,4.4c0.2,0.2,0.2,0.6,0,0.8L3.2,9.8c-0.2,0.2-0.6,0.2-0.8,0c-0.2-0.2-0.2-0.6,0-0.8L6.4,5z" />
        </svg>
      ),
      handler: handleNextPage
    };

    const btnPrevFivePage = {
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
    const btnNextFivePage = {
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

    if (props.simple) {
      return (
        <ul v-show={show} class={classes.el}>
          <li key={btnPrevPage.key} title={btnPrevPage.title} class={btnPrevPage.className} onClick={btnPrevPage.handler}>
            {btnPrevPage.children}
          </li>
          <li class={`${classNamePrefix}-elevator`}>
            <VuiInput size="small" value={state.page} onKeydown={handleInputPage} onKeyup={handleConfirmPage} />
            {
              props.showTotal && (
                <span>/ {this.totalPages}</span>
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

      if (props.showTotal) {
        if (is.function(props.showTotal)) {
          let rangeFrom = (state.page - 1) * state.pageSize + 1;
          let rangeTo = state.page * state.pageSize;

          if (props.total < 1) {
            rangeFrom = 0;
          }

          if (rangeTo > props.total) {
            rangeTo = props.total;
          }

          totalText = props.showTotal(props.total, [rangeFrom, rangeTo]);
        }
        else {
          totalText = `${translate("vui.pagination.total")} ${props.total} ${translate("vui.pagination." + (props.total > 1 ? "items" : "item"))}`;
        }
      }

      let items = [];

      if (this.totalPages < 9) {
        items = range(1, this.totalPages + 1);
      }
      else {
        if (state.page < 6) {
          items = [1, 2, 3, 4, 5, 6, "nextFivePage", this.totalPages];
        }
        else if (state.page > this.totalPages - 5) {
          items = [1, "prevFivePage", this.totalPages - 5, this.totalPages - 4, this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages];
        }
        else {
          items = [1, "prevFivePage", state.page - 2, state.page - 1, state.page, state.page + 1, state.page + 2, "nextFivePage", this.totalPages];
        }
      }

      return (
        <ul v-show={show} class={classes.el}>
          {
            props.showTotal && (
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
                    [`${classNamePrefix}-item-active`]: state.page === item
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
            props.showPageSizer && (
              <li key={"sizer"} class={`${classNamePrefix}-sizer`}>
                <VuiSelect size={props.small ? "small" : undefined} value={state.pageSize} onInput={handleChangePageSize}>
                  {
                    props.pageSizeOptions.map(option => {
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
            props.showPageElevator && (
              <li key={"elevator"} class={`${classNamePrefix}-elevator`}>
                <span>{translate("vui.pagination.goto")}</span>
                <VuiInput size={props.small ? "small" : undefined} value={state.page} onKeydown={handleInputPage} onKeyup={handleConfirmPage} />
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