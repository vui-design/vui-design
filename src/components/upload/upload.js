import VuiUploadTrigger from "./upload-trigger";
import VuiUploadList from "./upload-list";
import PropTypes from "../../utils/prop-types";
import guid from "../../utils/guid";
import request from "./request";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    draggable: PropTypes.bool.def(false),
    multiple: PropTypes.bool.def(false),
    accept: PropTypes.string,
    showList: PropTypes.bool.def(true),
    list: PropTypes.array.def([]),
    listType: PropTypes.oneOf(["text", "picture", "picture-card"]).def("text"),
    request: PropTypes.func.def(request),
    action: PropTypes.string,
    headers: PropTypes.object,
    withCredentials: PropTypes.bool.def(false),
    name: PropTypes.string.def("file"),
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    autoUpload: PropTypes.bool.def(true),
    beforeUpload: PropTypes.func,
    beforeRemove: PropTypes.func,
    disabled: PropTypes.bool.def(false)
  };
};

export default {
  name: "vui-upload",
  provide() {
    return {
      vuiUpload: this
    };
  },
  inject: {
    vuiForm: {
      default: undefined
    }
  },
  components: {
    VuiUploadTrigger,
    VuiUploadList
  },
  props: createProps(),
  data() {
    return {
      state: {
        list: []
      }
    };
  },
  watch: {
    list: {
      immediate: true,
      handler(value) {
        this.state.list = value.map(target => {
          target.id = target.id || guid();
          target.status = target.status || "success";

          return target;
        });
      }
    }
  },
  methods: {
    getFile(rawFile) {
      let file;

      this.state.list.every(target => {
        file = target.id === rawFile.id ? target : undefined;

        return !file;
      });

      return file;
    },
    upload(file) {
      const trigger = this.$refs.trigger;

      if (file) {
        let bool = file.rawFile && file.status === "ready";

        if (bool) {
          trigger.upload(file.rawFile);
        }
      }
      else {
        this.state.list.forEach(target => {
          const bool = target.rawFile && target.status === "ready";

          if (bool) {
            trigger.upload(target.rawFile);
          }
        });
      }
    },
    abort(file) {
      const trigger = this.$refs.trigger;

      if (file) {
        trigger.abort(file);
      }
      else {
        this.state.list.forEach(target => {
          trigger.abort(target);
        });
      }
    },
    handleReady(rawFile) {
      const { $props: props } = this;
      let file = {
        rawFile: rawFile,
        id: rawFile.id,
        name: rawFile.name,
        size: rawFile.size,
        url: "",
        status: "ready",
        percentage: 0,
        event: undefined,
        response: undefined,
        error: undefined
      };

      if (props.listType === "picture" || props.listType === "picture-card") {
        try {
          file.url = URL.createObjectURL(rawFile);
        }
        catch(error) {
          console.error("[Vui Design][Upload]: " + error.message);
        }
      }

      this.state.list.push(file);
      this.$emit("ready", file, this.state.list);
      this.$emit("change", file, this.state.list);
    },
    handleProgress(progress, rawFile) {
      let file = this.getFile(rawFile);

      if (!file) {
        return;
      }

      file.status = "progress";
      file.percentage = progress.percentage;
      file.progress = progress;

      this.$emit("progress", progress, file, this.state.list);
      this.$emit("change", file, this.state.list);
    },
    handleSuccess(response, rawFile) {
      let file = this.getFile(rawFile);

      if (!file) {
        return;
      }

      file.status = "success";
      file.response = response;

      this.$emit("success", response, file, this.state.list);
      this.$emit("change", file, this.state.list);
    },
    handleError(error, rawFile) {
      let file = this.getFile(rawFile);

      if (!file) {
        return;
      }

      file.status = "error";
      file.error = error;

      this.$emit("error", error, file, this.state.list);
      this.$emit("change", file, this.state.list);
    },
    handlePreview(file) {
      this.$emit("preview", file, this.state.list);
    },
    handleRemove(file) {
      this.abort(file);
      this.state.list.splice(this.state.list.indexOf(file), 1);

      this.$emit("remove", file, this.state.list);
      this.$emit("change", file, this.state.list);
    }
  },
  beforeDestroy() {
    this.state.list.forEach(file => {
      if (file.url && file.url.indexOf("blob:") === 0) {
        URL.revokeObjectURL(file.url);
      }
    });
  },
  render(h) {
    const { vuiForm, $slots: slots, $props: props, state } = this;
    const { handleReady, handleProgress, handleSuccess, handleError, handlePreview, handleRemove } = this;

    // disabled
    let disabled;

    if (vuiForm && vuiForm.disabled) {
      disabled = vuiForm.disabled;
    }
    else {
      disabled = props.disabled;
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "upload");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-draggable`]: props.draggable,
      [`${classNamePrefix}-${props.listType}`]: props.listType,
      [`${classNamePrefix}-disabled`]: disabled
    };

    // render
    let children = [];
    let childUploadTrigger;
    let childUploadList;

    childUploadTrigger = (
      <VuiUploadTrigger
        ref="trigger"
        v-show={slots.trigger || slots.default}
        classNamePrefix={classNamePrefix}
        draggable={props.draggable}
        multiple={props.multiple}
        accept={props.accept}
        list={state.list}
        request={props.request}
        action={props.action}
        headers={props.headers}
        withCredentials={props.withCredentials}
        name={props.name}
        data={props.data}
        autoUpload={props.autoUpload}
        beforeUpload={props.beforeUpload}
        disabled={disabled}
        onReady={handleReady}
        onProgress={handleProgress}
        onSuccess={handleSuccess}
        onError={handleError}
        onRemove={handleRemove}
      >
        {slots.trigger || slots.default}
      </VuiUploadTrigger>
    );

    if (props.showList && state.list.length > 0) {
      childUploadList = (
        <VuiUploadList
          ref="list"
          classNamePrefix={classNamePrefix}
          list={state.list}
          listType={props.listType}
          beforeRemove={props.beforeRemove}
          disabled={disabled}
          onPreview={handlePreview}
          onRemove={handleRemove}
        />
      );
    }

    if (!props.draggable && props.listType === "picture-card") {
      children.push(childUploadList);
    }

    if (slots.trigger) {
      children.push(childUploadTrigger);
      children.push(slots.default);
    }
    else {
      children.push(childUploadTrigger);
    }

    if (props.listType === "text" || props.listType === "picture" || (props.draggable && props.listType === "picture-card")) {
      children.push(childUploadList);
    }

    return (
      <div class={classes.el}>
        {children}
      </div>
    );
  }
};