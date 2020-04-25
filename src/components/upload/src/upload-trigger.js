import getType from "vui-design/utils/getType";
import guid from "vui-design/utils/guid";
import request from "./request";

const VuiUploadTrigger = {
	name: "vui-upload-trigger",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-upload"
		},
		draggable: {
			type: Boolean,
			default: false
		},
		multiple: {
			type: Boolean,
			default: false
		},
		accept: {
			type: String,
			default: undefined
		},
		list: {
			type: Array,
			default: () => []
		},
		request: {
			type: Function,
			default: request
		},
		action: {
			type: String,
			default: undefined,
			required: true
		},
		headers: {
			type: Object,
			default: undefined
		},
		withCredentials: {
			type: Boolean,
			default: false
		},
		name: {
			type: String,
			default: "file"
		},
		data: {
			type: [Object, Function],
			default: undefined
		},
		autoUpload: {
			type: Boolean,
			default: true
		},
		beforeUpload: {
			type: Function,
			default: undefined
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			dragover: false,
			xhrs: {}
		};
	},

	methods: {
		parseStreamToFile(stream, file) {
			let type = getType(stream);

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
			let doUpload = file => {
				let id = file.id;
				let options = {
					action: this.action,
					headers: this.headers,
					withCredentials: this.withCredentials,
					data: getType(this.data) === "[object Function]" ? this.data() : this.data,
					name: this.name,
					file: file,
					onProgress: progress => {
						this.$emit("progress", progress, file);
					},
					onSuccess: response => {
						this.$emit("success", response, file);
						delete this.xhrs[id];
					},
					onError: error => {
						this.$emit("error", error, file);
						delete this.xhrs[id];
					}
				};

				let xhr = this.request(options);

				if (xhr && xhr.then) {
					xhr.then(options.onSuccess, options.onError);
				}

				this.xhrs[id] = xhr;
			};

			if (!this.beforeUpload) {
				return doUpload(file);
			}

			let promise = this.beforeUpload(file, this.list);

			if (promise && promise.then) {
				let resolve = stream => {
					doUpload(this.parseStreamToFile(stream, file));
				};
				let reject = () => {
					this.$emit("remove", file);
				};

				promise.then(resolve, reject);
			}
			else if (promise !== false) {
				doUpload(file);
			}
			else {
				this.$emit("remove", file);
			}
		},
		abort(file) {
			let xhrs = this.xhrs;

			if (file) {
				let id = file.id ? file.id : file;
				let xhr = xhrs[id];

				if (!xhr || !xhr.abort) {
					return;
				}

				xhr.abort();
				delete xhrs[id];
			}
			else {
				Object.keys(xhrs).forEach(id => {
					let xhr = xhrs[id];

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

			this.dragover = true;
		},
		handleTriggerDrop(e) {
			e.preventDefault();
			e.stopPropagation();

			this.dragover = false;

			let files = e.dataTransfer.files;

			if (!files) {
				return;
			}

			if (this.accept) {
				files = files.filter(file => {
					let name = file.name;
					let extension = name.indexOf(".") > -1 ? "." + name.split(".").pop() : "";
					let type = file.type;
					let baseType = type.replace(/\/.*$/, "");

					return this.accept.split(",").map(type => type.trim()).filter(type => type).some(acceptedType => {
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

			files = Array.prototype.slice.call(files);

			if (!this.multiple) {
				files = files.slice(0, 1);
			}

			if (files.length === 0) {
				return;
			}

			files.forEach(file => {
				file.id = file.id || guid();

				this.$emit("ready", file);
				this.autoUpload && this.upload(file);
			});
		},
		handleTriggerDragleave(e) {
			e.preventDefault();
			e.stopPropagation();

			this.dragover = false;
		},
		handleInputClick(e) {
			e.stopPropagation();
		},
		handleInputChange(e) {
			let files = e.target.files;

			if (!files) {
				return;
			}

			files = Array.prototype.slice.call(files);

			if (!this.multiple) {
				files = files.slice(0, 1);
			}

			if (files.length === 0) {
				return;
			}

			files.forEach(file => {
				file.id = file.id || guid();

				this.$emit("ready", file);
				this.autoUpload && this.upload(file);
			});

			this.$refs.input.value = null;
		}
	},

	render(h) {
		let { $slots, classNamePrefix, draggable, multiple, accept, dragover, disabled } = this;
		let { handleTriggerClick, handleTriggerDragover, handleTriggerDrop, handleTriggerDragleave, handleInputClick, handleInputChange } = this;

		// classes
		let classes = {};

		classes.el = {
			[`${classNamePrefix}-trigger`]: true,
			[`${classNamePrefix}-trigger-dragover`]: dragover
		};
		classes.main = `${classNamePrefix}-trigger-main`;

		// props
		let props = {};

		props.el = {
			class: classes.el
		};
		props.input = {
			ref: "input",
			attrs: {
				type: "file",
				disabled,
				multiple,
				accept
			}
		};
		props.main = {
			class: classes.main
		};

		if (!disabled) {
			props.el.on = {
				click: handleTriggerClick,
				dragover: handleTriggerDragover,
				drop: handleTriggerDrop,
				dragleave: handleTriggerDragleave
			};
			props.input.on = {
				click: handleInputClick,
				change: handleInputChange
			};
		}

		// render
		return (
			<div {...props.el}>
				<input {...props.input} />
				<div {...props.main}>{$slots.default}</div>
			</div>
		);
	}
};

export default VuiUploadTrigger;