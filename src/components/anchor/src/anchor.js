import VuiAffix from "../../affix";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getScroll from "../../../utils/getScroll";
import getOffsetTop from "../../../utils/getOffsetTop";
import scrollTo from "../../../utils/scrollTo";
import addEventListener from "../../../utils/addEventListener";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const sharpMatcherRegx = /#([^#]+)$/;

const VuiAnchor = {
  name: "vui-anchor",
  provide() {
    return {
      vuiAnchor: this
    };
  },
  components: {
    VuiAffix
  },
  props: {
    classNamePrefix: PropTypes.string,
    affix: PropTypes.bool.def(true),
    showInkInStatic: PropTypes.bool.def(false),
    bounds: PropTypes.number.def(5),
    offset: PropTypes.number.def(0),
    getScrollContainer: PropTypes.func.def(() => window),
    getCurrentAnchorLink: PropTypes.func,
    offsetTop: PropTypes.number,
    offsetBottom: PropTypes.number,
    preventDefault: PropTypes.bool.def(false)
  },
  data() {
    const state = {
      links: [],
      link: ""
    };

    return {
      state
    };
  },
  methods: {
    registerLink(link) {
      const { state } = this;
      const index = state.links.indexOf(link);

      if (index > -1) {
        return;
      }

      this.state.links.push(link);
    },
    unregisterLink(link) {
      const { state } = this;
      const index = state.links.indexOf(link);

      if (index === -1) {
        return;
      }

      this.state.links.splice(index, 1);
    },
    getCurrAnchorLink(offset = 0, bounds = 5) {
      const { $props: props, state } = this;

      if (is.function(props.getCurrentAnchorLink)) {
        return props.getCurrentAnchorLink();
      }

      if (is.undefined(document)) {
        return "";
      }

      const scrollContainer = props.getScrollContainer();
      let sections = [];

      state.links.forEach(link => {
        const sharpLinkMatch = sharpMatcherRegx.exec(String(link));

        if (!sharpLinkMatch) {
          return;
        }

        const selector = sharpLinkMatch[1];
        const target = document.getElementById(selector);

        if (!target) {
          return;
        }

        const top = getOffsetTop(target, scrollContainer);

        if (top < offset + bounds) {
          sections.push({
            top,
            link
          });
        }
      });

      if (sections.length) {
        const section = sections.reduce((prev, current) => current.top > prev.top ? current : prev);

        return section.link;
      }

      return "";
    },
    setCurrAnchorLink(link) {
      const { state } = this;
      const lastLink = state.link;

      if (lastLink === link) {
        return;
      }

      this.state.link = link;
      this.$emit("change", this.state.link, lastLink);
    },
    scrollTo(link) {
      const { $props: props, state } = this;

      this.setCurrAnchorLink(link);

      const sharpLinkMatch = sharpMatcherRegx.exec(String(link));

      if (!sharpLinkMatch) {
        return;
      }

      const selector = sharpLinkMatch[1];
      const target = document.getElementById(selector);

      if (!target) {
        return;
      }

      const scrollContainer = props.getScrollContainer();
      const scrollTop = getScroll(scrollContainer);
      const top = getOffsetTop(target, scrollContainer);
      let y = scrollTop + top;

      y -= is.undefined(props.offset) ? 0 : props.offset;

      this.animating = true;
      scrollTo(scrollContainer, scrollTop, y, 450, () => {
        this.animating = false;
      });
    },
    changeInkThumb() {
      if (is.undefined(document)) {
        return;
      }

      const { $el: element, $refs: references, $props: props } = this;
      const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "anchor");
      const link = element.querySelector("." + classNamePrefix + "-link-title-active");

      if (link) {
        references.inkThumb.style.top = (link.offsetTop + (link.clientHeight / 2) - (references.inkThumb.offsetHeight / 2)) + "px";
      }
    },
    handleScroll() {
      if (this.animating) {
        return;
      }

      const { $props: props } = this;
      const link = this.getCurrAnchorLink(is.undefined(props.offset) ? 0 : props.offset, props.bounds);

      this.setCurrAnchorLink(link);
    }
  },
  mounted() {
    const { $props: props } = this;
    const nextTick = () => {
      const scrollContainer = props.getScrollContainer();

      this.scrollContainer = scrollContainer;
      this.scrollEvent = addEventListener(this.scrollContainer, "scroll", this.handleScroll);
      this.handleScroll();
    };

    this.$nextTick(nextTick);
  },
  updated() {
    const { $props: props } = this;
    const nextTick = () => {
      if (this.scrollEvent) {
        const scrollContainer = props.getScrollContainer();

        if (this.scrollContainer !== scrollContainer) {
          this.scrollContainer = scrollContainer;
          this.scrollEvent.remove();
          this.scrollEvent = addEventListener(this.scrollContainer, "scroll", this.handleScroll);
          this.handleScroll();
        }
      }

      this.changeInkThumb();
    };

    this.$nextTick(nextTick);
  },
  beforeDestroy() {
    if (this.scrollEvent) {
      this.scrollEvent.remove();
    }
  },
  render() {
    const { $slots: slots, $props: props, state } = this;

    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "anchor");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-static`]: !props.affix
    };
    classes.elWrapper = `${classNamePrefix}-wrapper`;
    classes.elInk = {
      [`${classNamePrefix}-ink`]: true,
      [`${classNamePrefix}-ink-active`]: state.link
    };
    classes.elInkTrack = `${classNamePrefix}-ink-track`;
    classes.elInkThumb = `${classNamePrefix}-ink-thumb`;

    const offset = props.offsetTop || props.offsetBottom;
    let styles = {};

    styles.elWrapper = {
      maxHeight: offset ? `calc(100vh - ${offset}px)` : `100vh`
    };
    styles.elInkThumb = {
      display: !props.affix && !props.showInkInStatic ? "none" : ""
    };

    const anchor = (
      <div class={classes.elWrapper} style={styles.elWrapper}>
        <div class={classes.el}>
          <div class={classes.elInk}>
            <i class={classes.elInkTrack}></i>
            <i ref="inkThumb" class={classes.elInkThumb} style={styles.elInkThumb}></i>
          </div>
          {slots.default}
        </div>
      </div>
    );

    if (props.affix) {
      return (
        <VuiAffix getScrollContainer={props.getScrollContainer} offsetTop={props.offsetTop} offsetBottom={props.offsetBottom}>
          {anchor}
        </VuiAffix>
      );
    }
    else {
      return anchor;
    }
  }
};

export default VuiAnchor;