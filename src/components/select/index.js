import VuiSelect from "./src/select";
import withInstall from "../../utils/withInstall";
import utils from "./src/utils";
import { createProps } from "./src/select";

const VuiSelectWrapper = {
  name: VuiSelect.name,
  components: {
    VuiSelect
  },
  model: {
    prop: "value",
    event: "input"
  },
  props: createProps(),
  methods: {
    focus() {
      this.$refs.select.focus();
    },
    blur() {
      this.$refs.select.blur();
    }
  },
  render() {
    const { $slots: slots, $listeners: listeners, $props: props } = this;
    const attributes = {
      ref: "select",
      props: {
        ...props,
        options: utils.getOptions(slots.default)
      },
      on: listeners
    };

    return (
      <VuiSelect {...attributes} />
    );
  }
};

export { createProps };
export default withInstall(VuiSelectWrapper);