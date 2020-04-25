// General
import Icon from "./components/icon";
import ButtonGroup from "./components/button-group";
import Button from "./components/button";
// Layout
import Layout from "./components/layout";
import Header from "./components/header";
import Sider from "./components/sider";
import Content from "./components/content";
import Footer from "./components/footer";
import Row from "./components/row";
import Col from "./components/col";
import Card from "./components/card";
import CardGrid from "./components/card-grid";
import CardMeta from "./components/card-meta";
import Collapse from "./components/collapse";
import Panel from "./components/panel";
import CellGroup from "./components/cell-group";
import Cell from "./components/cell";
import Divider from "./components/divider";
// Navigation
import Dropdown from "./components/dropdown";
import Menu from "./components/menu";
import Submenu from "./components/submenu";
import MenuItemGroup from "./components/menu-item-group";
import MenuItem from "./components/menu-item";
import Breadcrumb from "./components/breadcrumb";
import BreadcrumbItem from "./components/breadcrumb-item";
import Tabs from "./components/tabs";
import TabPanel from "./components/tab-panel";
// Data Entry
import RadioGroup from "./components/radio-group";
import Radio from "./components/radio";
import CheckboxGroup from "./components/checkbox-group";
import Checkbox from "./components/checkbox";
import Switch from "./components/switch";
import InputGroup from "./components/input-group";
import Input from "./components/input";
import Textarea from "./components/textarea";
import Upload from "./components/upload";
// Data Display
import Avatar from "./components/avatar";
import Badge from "./components/badge";
import Statistic from "./components/statistic";
import Tag from "./components/tag";
import Time from "./components/time";
import Timeline from "./components/timeline";
import TimelineItem from "./components/timeline-item";
import Table from "./components/table";
import Tooltip from "./components/tooltip";
// Feedback
import Alert from "./components/alert";
import Drawer from "./components/drawer";
import Message from "./components/message";
import Modal from "./components/modal";
import Notice from "./components/notice";
import Progress from "./components/progress";
import Result from "./components/result";
import Spin from "./components/spin";
// Other
import Loading from "./components/loading";
// Language
import locale from "./locale";

const components = [
	// General
	Icon,
	ButtonGroup,
	Button,
	// Layout
	Layout,
	Header,
	Sider,
	Content,
	Footer,
	Row,
	Col,
	Card,
	CardGrid,
	CardMeta,
	Collapse,
	Panel,
	CellGroup,
	Cell,
	Divider,
	// Navigation
	Dropdown,
	Menu,
	Submenu,
	MenuItemGroup,
	MenuItem,
	Breadcrumb,
	BreadcrumbItem,
	Tabs,
	TabPanel,
	// Data Entry
	RadioGroup,
	Radio,
	CheckboxGroup,
	Checkbox,
	Switch,
	InputGroup,
	Input,
	Textarea,
	Upload,
	// Data Display
	Avatar,
	Badge,
	Statistic,
	Tag,
	Time,
	Timeline,
	TimelineItem,
	Table,
	Tooltip,
	// Feedback
	Alert,
	Drawer,
	Message,
	Modal,
	Notice,
	Progress,
	Result,
	Spin
];

const install = function(Vue, options = {}) {
	if (install.installed) {
		return;
	}

	locale.use(options.locale);
	locale.i18n(options.i18n);

	components.forEach(component => {
		Vue.component(component.name, component);
	});

	Vue.prototype.$vui = {
		size: options.size || "",
		zIndex: options.zIndex || 2000
	};
	Vue.prototype.$loading = Loading;
	Vue.prototype.$message = Message;
	Vue.prototype.$modal = Modal;
	Vue.prototype.$notice = Notice;
	Vue.prototype.$spin = Spin;
};

if (typeof window !== "undefined" && window.Vue) {
	install(window.Vue);
}

export default {
	version: "1.0.2",
	install,
	locale: locale.use,
	i18n: locale.i18n,
	// General
	Icon,
	ButtonGroup,
	Button,
	// Layout
	Layout,
	Header,
	Sider,
	Content,
	Footer,
	Row,
	Col,
	Card,
	CardGrid,
	CardMeta,
	Collapse,
	Panel,
	CellGroup,
	Cell,
	Divider,
	// Navigation
	Dropdown,
	Menu,
	Submenu,
	MenuItemGroup,
	MenuItem,
	Breadcrumb,
	BreadcrumbItem,
	Tabs,
	TabPanel,
	// Data Entry
	RadioGroup,
	Radio,
	CheckboxGroup,
	Checkbox,
	Switch,
	InputGroup,
	Input,
	Textarea,
	Upload,
	// Data Display
	Avatar,
	Badge,
	Statistic,
	Tag,
	Time,
	Timeline,
	TimelineItem,
	Table,
	Tooltip,
	// Feedback
	Alert,
	Drawer,
	Message,
	Modal,
	Notice,
	Progress,
	Result,
	Spin,
	// Other
	Loading
};