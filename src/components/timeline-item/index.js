import VuiTimelineItem from "../timeline/src/timeline-item";

VuiTimelineItem.install = function(Vue) {
	Vue.component(VuiTimelineItem.name, VuiTimelineItem);
};

export default VuiTimelineItem;