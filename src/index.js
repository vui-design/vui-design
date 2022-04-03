// This file is not used if use https://github.com/ant-design/babel-plugin-import
if (typeof console !== "undefined" && console.warn && typeof window !== "undefined") {
  console.warn("You are using a whole package of Vui Design, please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.");
}

// General
import Icon from "./components/icon";
import ButtonGroup from "./components/button-group";
import Button from "./components/button";
import Link from "./components/link";
// Layout
import Divider from "./components/divider";
import Row from "./components/row";
import Col from "./components/col";
import Layout from "./components/layout";
import Header from "./components/header";
import Sider from "./components/sider";
import Content from "./components/content";
import Footer from "./components/footer";
import Space from "./components/space";
// Navigation
import Affix from "./components/affix";
import Breadcrumb from "./components/breadcrumb";
import BreadcrumbItem from "./components/breadcrumb-item";
import Dropdown from "./components/dropdown";
import DropdownButton from "./components/dropdown-button";
import DropdownMenu from "./components/dropdown-menu";
import DropdownSubmenu from "./components/dropdown-submenu";
import DropdownMenuItem from "./components/dropdown-menu-item";
import DropdownMenuItemGroup from "./components/dropdown-menu-item-group";
import DropdownMenuDivider from "./components/dropdown-menu-divider";
import Menu from "./components/menu";
import Submenu from "./components/submenu";
import MenuItem from "./components/menu-item";
import MenuItemGroup from "./components/menu-item-group";
import MenuDivider from "./components/menu-divider";
import PageHeader from "./components/page-header";
import Pagination from "./components/pagination";
import Steps from "./components/steps";
import Step from "./components/step";
import Tabs from "./components/tabs";
import TabPanel from "./components/tab-panel";
// Data Entry
import Cascader from "./components/cascader";
import Checkbox from "./components/checkbox";
import CheckboxGroup from "./components/checkbox-group";
import Datepicker from "./components/datepicker";
import Form from "./components/form";
import FormGroup from "./components/form-group";
import FormItem from "./components/form-item";
import Input from "./components/input";
import InputGroup from "./components/input-group";
import InputNumber from "./components/input-number";
import MutexGroup from "./components/mutex-group";
import Radio from "./components/radio";
import RadioGroup from "./components/radio-group";
import Rate from "./components/rate";
import Select from "./components/select";
import Option from "./components/option";
import OptionGroup from "./components/option-group";
import Slider from "./components/slider";
import Switch from "./components/switch";
import Textarea from "./components/textarea";
import Timeroutine from "./components/timeroutine";
import Transfer from "./components/transfer";
import CascadeTransfer from "./components/cascade-transfer";
import Upload from "./components/upload";
// Data Display
import Avatar from "./components/avatar";
import AvatarGroup from "./components/avatar-group";
import Badge from "./components/badge";
import Card from "./components/card";
import CardGrid from "./components/card-grid";
import CardMeta from "./components/card-meta";
import Cell from "./components/cell";
import CellGroup from "./components/cell-group";
import Collapse from "./components/collapse";
import Countdown from "./components/countdown";
import Panel from "./components/panel";
import Descriptions from "./components/descriptions";
import Description from "./components/description";
import Empty from "./components/empty";
import Image from "./components/image";
import List from "./components/list";
import ListItem from "./components/list-item";
import ListItemMeta from "./components/list-item-meta";
import Popover from "./components/popover";
import Qrcode from "./components/qrcode";
import Ratio from "./components/ratio";
import Statistic from "./components/statistic";
import Table from "./components/table";
import Tag from "./components/tag";
import Time from "./components/time";
import Timeline from "./components/timeline";
import TimelineItem from "./components/timeline-item";
import Tooltip from "./components/tooltip";
import Tree from "./components/tree";
import Watermark from "./components/watermark";
// Feedback
import Alert from "./components/alert";
import Drawer from "./components/drawer";
import Message from "./components/message";
import Modal from "./components/modal";
import Notice from "./components/notice";
import Popconfirm from "./components/popconfirm";
import Progress from "./components/progress";
import Result from "./components/result";
import Skeleton from "./components/skeleton";
import SkeletonAvatar from "./components/skeleton-avatar";
import SkeletonTitle from "./components/skeleton-title";
import SkeletonParagraph from "./components/skeleton-paragraph";
import SkeletonInput from "./components/skeleton-input";
import SkeletonButton from "./components/skeleton-button";
import SkeletonImage from "./components/skeleton-image";
import Spin from "./components/spin";
// Other
import Anchor from "./components/anchor";
import AnchorLink from "./components/anchor-link";
import Authorizer from "./components/authorizer";
import Backtop from "./components/backtop";
import Collapser from "./components/collapser";
import Fullscreen from "./components/fullscreen";
import Loading from "./components/loading";
import ResizeObserver from "./components/resize-observer";
// Language
import locale from "./locale";

const components = [
  // General
  Icon,
  ButtonGroup,
  Button,
  Link,
  // Layout
  Divider,
  Row,
  Col,
  Layout,
  Header,
  Sider,
  Content,
  Footer,
  Space,
  // Navigation
  Affix,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownSubmenu,
  DropdownMenuItem,
  DropdownMenuItemGroup,
  DropdownMenuDivider,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  MenuDivider,
  PageHeader,
  Pagination,
  Steps,
  Step,
  Tabs,
  TabPanel,
  // Data Entry
  Cascader,
  Checkbox,
  CheckboxGroup,
  Datepicker,
  Form,
  FormGroup,
  FormItem,
  Input,
  InputGroup,
  InputNumber,
  MutexGroup,
  Radio,
  RadioGroup,
  Rate,
  Select,
  Option,
  OptionGroup,
  Slider,
  Switch,
  Textarea,
  Timeroutine,
  Transfer,
  CascadeTransfer,
  Upload,
  // Data Display
  AvatarGroup,
  Avatar,
  Badge,
  Card,
  CardGrid,
  CardMeta,
  Cell,
  CellGroup,
  Collapse,
  Countdown,
  Panel,
  Descriptions,
  Description,
  Empty,
  Image,
  List,
  ListItem,
  ListItemMeta,
  Popover,
  Qrcode,
  Ratio,
  Statistic,
  Table,
  Tag,
  Time,
  Timeline,
  TimelineItem,
  Tooltip,
  Tree,
  Watermark,
  // Feedback
  Alert,
  Drawer,
  Message,
  Modal,
  Notice,
  Popconfirm,
  Progress,
  Result,
  Skeleton,
  SkeletonAvatar,
  SkeletonTitle,
  SkeletonParagraph,
  SkeletonInput,
  SkeletonButton,
  SkeletonImage,
  Spin,
  // Other
  Anchor,
  AnchorLink,
  Authorizer,
  Backtop,
  Collapser,
  Fullscreen,
  ResizeObserver
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
    classNamePrefix: "vui",
    size: options.size || "",
    zIndex: options.zIndex || 2000,
    authorize: options.authorize
  };
  Vue.prototype.$notice = Notice;
  Vue.prototype.$message = Message;
  Vue.prototype.$modal = Modal;
  Vue.prototype.$spin = Spin;
  Vue.prototype.$loading = Loading;
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export {
  // General
  Icon,
  ButtonGroup,
  Button,
  Link,
  // Layout
  Divider,
  Row,
  Col,
  Layout,
  Header,
  Sider,
  Content,
  Footer,
  Space,
  // Navigation
  Affix,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownSubmenu,
  DropdownMenuItem,
  DropdownMenuItemGroup,
  DropdownMenuDivider,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  MenuDivider,
  PageHeader,
  Pagination,
  Steps,
  Step,
  Tabs,
  TabPanel,
  // Data Entry
  Cascader,
  Checkbox,
  CheckboxGroup,
  Datepicker,
  Form,
  FormGroup,
  FormItem,
  Input,
  InputGroup,
  InputNumber,
  MutexGroup,
  Radio,
  RadioGroup,
  Rate,
  Select,
  Option,
  OptionGroup,
  Slider,
  Switch,
  Textarea,
  Timeroutine,
  Transfer,
  CascadeTransfer,
  Upload,
  // Data Display
  Avatar,
  AvatarGroup,
  Badge,
  Card,
  CardGrid,
  CardMeta,
  Cell,
  CellGroup,
  Collapse,
  Countdown,
  Panel,
  Descriptions,
  Description,
  Empty,
  Image,
  List,
  ListItem,
  ListItemMeta,
  Popover,
  Qrcode,
  Ratio,
  Statistic,
  Table,
  Tag,
  Time,
  Timeline,
  TimelineItem,
  Tooltip,
  Tree,
  // Feedback
  Watermark,
  Alert,
  Drawer,
  Message,
  Modal,
  Notice,
  Popconfirm,
  Progress,
  Result,
  Skeleton,
  SkeletonAvatar,
  SkeletonTitle,
  SkeletonParagraph,
  SkeletonInput,
  SkeletonButton,
  SkeletonImage,
  Spin,
  // Other
  Anchor,
  AnchorLink,
  Authorizer,
  Backtop,
  Loading,
  Collapser,
  Fullscreen,
  ResizeObserver
};

export default {
  version: "1.10.0",
  install,
  // Locale
  locale: locale.use,
  i18n: locale.i18n,
  // General
  Icon,
  ButtonGroup,
  Button,
  Link,
  // Layout
  Divider,
  Row,
  Col,
  Layout,
  Header,
  Sider,
  Content,
  Footer,
  Space,
  // Navigation
  Affix,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownSubmenu,
  DropdownMenuItem,
  DropdownMenuItemGroup,
  DropdownMenuDivider,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  MenuDivider,
  PageHeader,
  Pagination,
  Steps,
  Step,
  Tabs,
  TabPanel,
  // Data Entry
  Cascader,
  Checkbox,
  CheckboxGroup,
  Datepicker,
  Form,
  FormGroup,
  FormItem,
  Input,
  InputGroup,
  InputNumber,
  MutexGroup,
  Radio,
  RadioGroup,
  Rate,
  Select,
  Option,
  OptionGroup,
  Slider,
  Switch,
  Textarea,
  Timeroutine,
  Transfer,
  CascadeTransfer,
  Upload,
  // Data Display
  Avatar,
  AvatarGroup,
  Badge,
  Card,
  CardGrid,
  CardMeta,
  Cell,
  CellGroup,
  Collapse,
  Countdown,
  Panel,
  Descriptions,
  Description,
  Empty,
  Image,
  List,
  ListItem,
  ListItemMeta,
  Popover,
  Qrcode,
  Ratio,
  Statistic,
  Table,
  Tag,
  Time,
  Timeline,
  TimelineItem,
  Tooltip,
  Tree,
  // Feedback
  Watermark,
  Alert,
  Drawer,
  Message,
  Modal,
  Notice,
  Popconfirm,
  Progress,
  Result,
  Skeleton,
  SkeletonAvatar,
  SkeletonTitle,
  SkeletonParagraph,
  SkeletonInput,
  SkeletonButton,
  SkeletonImage,
  Spin,
  // Other
  Anchor,
  AnchorLink,
  Authorizer,
  Backtop,
  Collapser,
  Loading,
  Fullscreen,
  ResizeObserver
};