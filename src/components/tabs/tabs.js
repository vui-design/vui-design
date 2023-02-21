import VuiResizeObserver from "../resize-observer";
import VuiIcon from "../icon";
import VuiTabsTab from "./tabs-tab";
import VuiTabsPanel from "./tabs-panel";
import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    type: PropTypes.oneOf(["line", "card"]).def("line"),
    size: PropTypes.oneOf(["small", "medium", "large"]),
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tabs: PropTypes.array.def([]),
    extra: PropTypes.any,
    addable: PropTypes.bool.def(false),
    closable: PropTypes.bool.def(false),
    destroyOnHide: PropTypes.bool.def(false),
    headerStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    bodyStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };
};

export default {
  name: "vui-tabs",
  provide() {
    return {
      vuiTabs: this
    };
  },
  components: {
    VuiResizeObserver,
    VuiIcon,
    VuiTabsTab,
    VuiTabsPanel
  },
  props: createProps(),
  data() {
    const { $props: props } = this;
    const state = {
      activeKey: undefined,
      scrollable: false,
      scrollWidth: 0,
      ping: "left"
    };

    return {
      state
    };
  },
  computed: {
    maybeScroll() {
      return {
        activeKey: this.state.activeKey,
        scrollable: this.state.scrollable
      };
    }
  },
  watch: {
    activeKey: {
      immediate: true,
      deep: true,
      handler(value) {
        this.state.activeKey = value;
      }
    },
    maybeScroll: {
      immediate: true,
      deep: true,
      handler(value) {
        if (!value.scrollable) {
          return;
        }

        this.$nextTick(() => this.scrollToActiveTab());
      }
    }
  },
  methods: {
    getNavigationTab(tabs, activeKey, direction) {
      let index = tabs.findIndex(tab => tab.key === activeKey);

      index = (index + direction + tabs.length) % tabs.length;

      const tab = tabs[index];

      if (tab.disabled) {
        return this.getNavigationTab(tabs, tab.key, direction);
      }
      else {
        return tab;
      }
    },
    getHiddenParent() {
      let parentNode = this.$el.parentNode;

      while(parentNode && parentNode !== document.body) {
        if (parentNode.style && parentNode.style.display === "none") {
          return parentNode;
        }

        parentNode = parentNode.parentNode;
      }

      return null;
    },
    getScrollWidth() {
      return this.state.scrollWidth;
    },
    setScrollWidth(value) {
      const scrollerWidth = this.$refs.scroller.offsetWidth;
      const scrollerContentWidth = this.$refs.scrollerContent.offsetWidth;
      let ping = "";

      if (value === 0) {
        ping = "left";
      }
      else if (scrollerContentWidth - value <= scrollerWidth) {
        ping = "right";
      }

      this.state.scrollWidth = value;
      this.state.ping = ping;
    },
    scrollToActiveTab() {
      if (!this.state.scrollable) {
        return;
      }

      const { $props: props } = this;
      const scroller = this.$refs.scroller;
      const scrollerContent = this.$refs.scrollerContent;
      const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "tabs");
      const activeTab = scrollerContent.querySelector(`.${classNamePrefix}-tab-active`);

      if (!activeTab) {
        return;
      }

      const scrollerBounding = scroller.getBoundingClientRect();
      const scrollerContentBounding = scrollerContent.getBoundingClientRect();
      const activeTabBounding = activeTab.getBoundingClientRect();
      const scrollWidth = this.getScrollWidth();
      let value = scrollWidth;

      if (scrollerContentBounding.right < scrollerBounding.right) {
        value = scrollerContent.offsetWidth - scrollerBounding.width;
      }

      if (activeTabBounding.left < scrollerBounding.left) {
        value = scrollWidth - (scrollerBounding.left - activeTabBounding.left);
      }
      else if (activeTabBounding.right > scrollerBounding.right) {
        value = scrollWidth + activeTabBounding.right - scrollerBounding.right;
      }

      if (scrollWidth !== value) {
        this.setScrollWidth(Math.max(value, 0));
      }
    },
    handleResize() {
      const scrollerWidth = this.$refs.scroller.offsetWidth;
      const scrollerContentWidth = this.$refs.scrollerContent.offsetWidth;
      const scrollWidth = this.getScrollWidth();

      if (scrollerWidth < scrollerContentWidth) {
        this.state.scrollable = true;

        if (scrollerContentWidth - scrollWidth < scrollerWidth) {
          this.setScrollWidth(scrollerContentWidth - scrollerWidth);
        }
      }
      else {
        this.state.scrollable = false;

        if (scrollWidth > 0) {
          this.setScrollWidth(0);
        }
      }
    },
    handleScroll(e) {
      if (!this.state.scrollable) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const type = e.type;
      let delta = 0;

      if (type === "DOMMouseScroll" || type === "mousewheel") {
          delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40;
      }

      if (delta > 0) {
          this.handleScrollPrev();
      }
      else {
          this.handleScrollNext();
      }
    },
    handleScrollPrev() {
      const scrollerWidth = this.$refs.scroller.offsetWidth;
      const scrollWidth = this.getScrollWidth();

      if (!scrollWidth) {
        return;
      }

      const value = scrollWidth > scrollerWidth ? (scrollWidth - scrollerWidth) : 0;

      this.setScrollWidth(value);
    },
    handleScrollNext() {
      const scrollerWidth = this.$refs.scroller.offsetWidth;
      const scrollerContentWidth = this.$refs.scrollerContent.offsetWidth;
      const scrollWidth = this.getScrollWidth();

      if (scrollerContentWidth - scrollWidth <= scrollerWidth) {
        return;
      }

      const value = (scrollerContentWidth - scrollWidth) > scrollerWidth * 2 ? (scrollWidth + scrollerWidth) : (scrollerContentWidth - scrollerWidth);

      this.setScrollWidth(value);
    },
    handleAdd() {
      this.$emit("add");
    },
    handleClose(key) {
      const { $props: props, state } = this;

      if (state.activeKey === key) {
        let tabIndex = props.tabs.findIndex(tab => tab.key === state.activeKey);

        if (tabIndex > 0) {
          tabIndex = tabIndex - 1;
        }
        else {
          tabIndex = tabIndex + 1;
        }

        const tab = props.tabs[tabIndex];

        this.handleChange(tab ? tab.key : undefined);
      }

      this.$emit("close", key);
    },
    handleNavigation(e) {
      if (e.keyCode !== 37 && e.keyCode !== 39) {
        return;
      }

      const { $props: props, state } = this;

      if (props.tabs.length < 2) {
        return;
      }

      const tab = this.getNavigationTab(props.tabs, state.activeKey, e.keyCode === 39 ? 1 : -1);

      this.handleChange(tab.key);
    },
    handleChange(key) {
      this.state.activeKey = key;
      this.$emit("input", key);
      this.$emit("change", key);
    }
  },
  mounted() {
      const hiddenParent = this.getHiddenParent();

      if (hiddenParent) {
        const callback = () => {
            if (hiddenParent.style.display !== "none") {
                this.$nextTick(() => setTimeout(() => this.scrollToActiveTab(), 0));
                this.parentObserver.disconnect();
            }
        };
        const config = {
          attributes: true,
          childList: true,
          characterData: true,
          attributeFilter: ["style"]
        }

        this.parentObserver = new MutationObserver(callback);
        this.parentObserver.observe(hiddenParent, config);
      }
  },
  beforeDestroy() {
    if (this.parentObserver) {
      this.parentObserver.disconnect();
    }
  },
  render() {
    const { $props: props, state } = this;
    const { handleResize, handleScroll, handleScrollPrev, handleScrollNext, handleAdd, handleClose, handleNavigation, handleChange } = this;

    // size
    let size;

    if (props.size) {
      size = props.size;
    }
    else {
      size = "medium";
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "tabs");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.type}`]: true,
      [`${classNamePrefix}-${size}`]: size
    };
    classes.elHeader = `${classNamePrefix}-header`;
    classes.elHeaderContent = `${classNamePrefix}-header-content`;
    classes.elHeaderExtra = `${classNamePrefix}-header-extra`;
    classes.elBody = `${classNamePrefix}-body` ;
    classes.elBodyContent = `${classNamePrefix}-body-content`;
    classes.elScroller = {
      [`${classNamePrefix}-scroller`]: true,
      [`${classNamePrefix}-scroller-scrollable`]: state.scrollable,
      [`${classNamePrefix}-scroller-ping-${state.ping}`]: state.scrollable && state.ping
    };
    classes.elScrollerContent = `${classNamePrefix}-scroller-content`;
    classes.elBtnPrev = {
      [`${classNamePrefix}-btn`]: true,
      [`${classNamePrefix}-btn-prev`]: true
    };
    classes.elBtnNext = {
      [`${classNamePrefix}-btn`]: true,
      [`${classNamePrefix}-btn-next`]: true
    };
    classes.elBtnAdd = {
      [`${classNamePrefix}-btn`]: true,
      [`${classNamePrefix}-btn-add`]: true
    };

    // style
    let styles = {};

    styles.elScrollerContent = {
      transform: `translateX(-${state.scrollWidth}px)`
    };

    // render
    return (
      <div class={classes.el}>
        <VuiResizeObserver onResize={handleResize}>
          <div key="header" class={classes.elHeader} style={props.headerStyle}>
            <div key="headerContent" class={classes.elHeaderContent}>
              {
                state.scrollable ? (
                  <div key="btn-prev" class={classes.elBtnPrev} onClick={handleScrollPrev}>
                    <VuiIcon type="chevron-left" />
                  </div>
                ) : null
              }
              <div key="scroller" ref="scroller" class={classes.elScroller} onDOMMouseScroll={handleScroll} onMousewheel={handleScroll}>
                <VuiResizeObserver onResize={handleResize}>
                  <div key="scrollerContent" ref="scrollerContent" tabIndex="0" class={classes.elScrollerContent} style={styles.elScrollerContent} onKeydown={handleNavigation}>
                    {
                      props.tabs.map(tab => {
                        return (
                          <VuiTabsTab
                            classNamePrefix={classNamePrefix}
                            key={tab.key}
                            data={tab}
                            onClick={handleChange}
                            onClose={handleClose}
                          />
                        );
                      })
                    }
                  </div>
                </VuiResizeObserver>
              </div>
              {
                state.scrollable ? (
                  <div key="btn-next" class={classes.elBtnNext} onClick={handleScrollNext}>
                    <VuiIcon type="chevron-right" />
                  </div>
                ) : null
              }
              {
                props.addable ? (
                  <div key="btn-add" class={classes.elBtnAdd} onClick={handleAdd}>
                    <VuiIcon type="plus" />
                  </div>
                ) : null
              }
            </div>
            {
              props.extra ? (
                <div class={classes.elHeaderExtra}>{props.extra}</div>
              ) : null
            }
          </div>
        </VuiResizeObserver>
        <div key="body" class={classes.elBody} style={props.bodyStyle}>
          <div key="bodyContent" class={classes.elBodyContent}>
            {
              props.tabs.map(tab => {
                return (
                  <VuiTabsPanel
                    classNamePrefix={classNamePrefix}
                    key={tab.key}
                    data={tab}
                    destroyOnHide={props.destroyOnHide}
                  />
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
};