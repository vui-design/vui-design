import VuiAnchorLink from "../anchor/src/anchor-link";

VuiAnchorLink.install = function(Vue) {
	Vue.component(VuiAnchorLink.name, VuiAnchorLink);
};

export default VuiAnchorLink;