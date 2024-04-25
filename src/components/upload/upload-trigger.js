import PropTypes from "../../utils/prop-types";
import getType from "../../utils/getType";
import guid from "../../utils/guid";
import request from "./request";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    draggable: PropTypes.bool.def(false),
    uploadPastedFiles: PropTypes.bool.def(false),
    multiple: PropTypes.bool.def(false),
    accept: PropTypes.string,
    list: PropTypes.array.def([]),
    request: PropTypes.func.def(request),
    action: PropTypes.string,
    headers: PropTypes.object,
    withCredentials: PropTypes.bool.def(false),
    name: PropTypes.string.def("file"),
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    autoUpload: PropTypes.bool.def(true),
    beforeUpload: PropTypes.func,
    disabled: PropTypes.bool.def(false)
  };
};

export default {
  name: "vui-upload-trigger",
  props: createProps(),
  data() {
    return {
      state: {
        dragover: false,
        xhrs: {}
      }
    };
  },
  methods: {
    streamToFile(stream, file) {
      const type = getType(stream);

      if (type !== "[object File]" && type !== "[object Blob]") {
        return file;
      }
      else {
        if (type === "[object Blob]") {
          stream = new File([stream], file.name, {
            type: file.type
          });
        }

        for (let property in file) {
          if (file.hasOwnProperty(property)) {
            stream[property] = file[property];
          }
        }

        return stream;
      }
    },
    upload(file) {
      const { $props: props } = this;
      const upload = file => {
        const id = file.id;
        const options = {
          action: props.action,
          headers: props.headers,
          withCredentials: props.withCredentials,
          data: getType(props.data) === "[object Function]" ? props.data() : props.data,
          name: props.name,
          file: file,
          onProgress: progress => {
            this.$emit("progress", progress, file);
          },
          onSuccess: response => {
            this.$emit("success", response, file);
            delete this.state.xhrs[id];
          },
          onError: error => {
            this.$emit("error", error, file);
            delete this.state.xhrs[id];
          }
        };

        const xhr = props.request(options);

        if (xhr && xhr.then) {
          xhr.then(options.onSuccess, options.onError);
        }

        this.state.xhrs[id] = xhr;
      };

      if (!props.beforeUpload) {
        return upload(file);
      }

      const promise = props.beforeUpload(file, props.list);

      if (promise && promise.then) {
        promise.then(stream => upload(this.streamToFile(stream, file)), () => this.$emit("remove", file));
      }
      else if (promise !== false) {
        upload(file);
      }
      else {
        this.$emit("remove", file);
      }
    },
    abort(file) {
      let xhrs = this.state.xhrs;

      if (file) {
        const id = file.id ? file.id : file;
        const xhr = xhrs[id];

        if (!xhr || !xhr.abort) {
          return;
        }

        xhr.abort();
        delete xhrs[id];
      }
      else {
        Object.keys(xhrs).forEach(id => {
          const xhr = xhrs[id];

          if (!xhr || !xhr.abort) {
            return;
          }

          xhr.abort();
          delete xhrs[id];
        });
      }
    },
    handleTriggerClick(e) {
      this.$refs.input.click();
    },
    handleTriggerDragover(e) {
      e.preventDefault();
      e.stopPropagation();

      this.state.dragover = true;
    },
    handleTriggerDrop(e) {
      e.preventDefault();
      e.stopPropagation();

      this.state.dragover = false;

      const { $props: props } = this;
      let files = e.dataTransfer.files;

      if (!files) {
        return;
      }

      files = Array.prototype.slice.call(files);

      if (props.accept) {
        files = files.filter(file => {
          const name = file.name;
          const extension = name.indexOf(".") > -1 ? ("." + name.split(".").pop()) : "";
          const type = file.type;
          const baseType = type.replace(/\/.*$/, "");

          return props.accept.split(",").map(acceptedType => acceptedType.trim()).filter(acceptedType => acceptedType).some(acceptedType => {
            if (/\..+$/.test(acceptedType)) {
              return extension === acceptedType;
            }

            if (/\/\*$/.test(acceptedType)) {
              return baseType === acceptedType.replace(/\/\*$/, "");
            }

            if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
              return type === acceptedType;
            }

            return false;
          });
        });
      }

      if (!props.multiple) {
        files = files.slice(0, 1);
      }

      if (files.length === 0) {
        return;
      }

      files.forEach(file => {
        file.id = guid();

        this.$emit("ready", file);

        if (props.autoUpload) {
          this.upload(file);
        }
      });
    },
    handleTriggerDragleave(e) {
      e.preventDefault();
      e.stopPropagation();

      this.state.dragover = false;
    },
    handleTriggerPaste(e) {
      const { $props: props } = this;
      let files = e.clipboardData.files;

      if (!props.uploadPastedFiles || !files) {
        return;
      }

      files = Array.prototype.slice.call(files);

      if (props.accept) {
        files = files.filter(file => {
          const name = file.name;
          const extension = name.indexOf(".") > -1 ? ("." + name.split(".").pop()) : "";
          const type = file.type;
          const baseType = type.replace(/\/.*$/, "");

          return props.accept.split(",").map(acceptedType => acceptedType.trim()).filter(acceptedType => acceptedType).some(acceptedType => {
            if (/\..+$/.test(acceptedType)) {
              return extension === acceptedType;
            }

            if (/\/\*$/.test(acceptedType)) {
              return baseType === acceptedType.replace(/\/\*$/, "");
            }

            if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
              return type === acceptedType;
            }

            return false;
          });
        });
      }

      if (!props.multiple) {
        files = files.slice(0, 1);
      }

      if (files.length === 0) {
        return;
      }

      files.forEach(file => {
        file.id = guid();

        this.$emit("ready", file);

        if (props.autoUpload) {
          this.upload(file);
        }
      });
    },
    handleInputClick(e) {
      e.stopPropagation();
    },
    handleInputChange(e) {
      const { $props: props } = this;
      let files = e.target.files;

      if (!files) {
        return;
      }

      files = Array.prototype.slice.call(files);

      if (!props.multiple) {
        files = files.slice(0, 1);
      }

      if (files.length === 0) {
        return;
      }

      files.forEach(file => {
        file.id = guid();

        this.$emit("ready", file);

        if (props.autoUpload) {
          this.upload(file);
        }
      });

      this.$refs.input.value = null;
    }
  },
  render(h) {
    const { $slots: slots, $props: props, state } = this;
    const { handleTriggerClick, handleTriggerDragover, handleTriggerDrop, handleTriggerDragleave, handleTriggerPaste, handleInputClick, handleInputChange } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "trigger");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-dragover`]: state.dragover,
      [`${classNamePrefix}-disabled`]: props.disabled
    };

    // attributes
    let attributes = {};

    attributes.el = {
      class: classes.el,
      attrs: {
        tabIndex: 0
      }
    };
    attributes.elInput = {
      ref: "input",
      attrs: {
        type: "file",
        multiple: props.multiple,
        accept: props.accept,
        disabled: props.disabled
      }
    };

    if (!props.disabled) {
      attributes.el.on = {
        click: handleTriggerClick,
        dragover: handleTriggerDragover,
        drop: handleTriggerDrop,
        dragleave: handleTriggerDragleave,
        paste: handleTriggerPaste
      };
      attributes.elInput.on = {
        click: handleInputClick,
        change: handleInputChange
      };
    }

    // render
    return (
      <div {...attributes.el}>
        <input {...attributes.elInput} />
        {slots.default}
      </div>
    );
  }
};