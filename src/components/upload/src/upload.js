import guid from "vui-design/utils/guid";
import request from "./request";
import VuiUploadTrigger from "./upload-trigger";
import VuiUploadList from "./upload-list";

const VuiUpload = {
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
		showList: {
			type: Boolean,
			default: true
		},
		list: {
			type: Array,
			default: () => []
		},
		listType: {
			type: String,
			default: "text",
			validator: value => ["text", "picture", "picture-card"].indexOf(value) > -1
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
		beforeRemove: {
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
			fileList: []
		};
	},

	watch: {
		list: {
			immediate: true,
			handler(value) {
				this.fileList = value.map(file => {
					file.id = file.id || guid();
					file.status = file.status || "success";

					return file;
				});
			}
		}
	},

	methods: {
		getFile(rawFile) {
			let target;

			this.fileList.every(file => {
				target = file.id === rawFile.id ? file : null;

				return !target;
			});

			return target;
		},

		upload(file) {
			let trigger = this.$refs.trigger;

			if (file) {
				let bool = file.rawFile && file.status === "ready";

				if (bool) {
					trigger.upload(file.rawFile);
				}
			}
			else {
				this.fileList.forEach(item => {
					let bool = item.rawFile && item.status === "ready";

					if (bool) {
						trigger.upload(item.rawFile);
					}
				});
			}
		},
		abort(file) {
			let trigger = this.$refs.trigger;

			if (file) {
				trigger.abort(file);
			}
			else {
				this.fileList.forEach(item => {
					trigger.abort(item);
				});
			}
		},

		handleReady(rawFile) {
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

			if (this.listType === "picture" || this.listType === "picture-card") {
				try {
					file.url = URL.createObjectURL(rawFile);
				}
				catch (error) {
					return console.error("[Vui Error][Upload]", error);
				}
			}

			this.fileList.push(file);
			this.$emit("ready", file, this.fileList);
			this.$emit("change", file, this.fileList);
		},
		handleProgress(progress, rawFile) {
			let file = this.getFile(rawFile);

			if (!file) {
				return;
			}

			file.status = "progress";
			file.percentage = progress.percentage;
			file.progress = progress;

			this.$emit("progress", progress, file, this.fileList);
			this.$emit("change", file, this.fileList);
		},
		handleSuccess(response, rawFile) {
			let file = this.getFile(rawFile);

			if (!file) {
				return;
			}

			file.status = "success";
			file.response = response;

			this.$emit("success", response, file, this.fileList);
			this.$emit("change", file, this.fileList);
		},
		handleError(error, rawFile) {
			let file = this.getFile(rawFile);

			if (!file) {
				return;
			}

			file.status = "error";
			file.error = error;

			this.$emit("error", error, file, this.fileList);
			this.$emit("change", file, this.fileList);
		},
		handlePreview(file) {
			this.$emit("preview", file, this.fileList);
		},
		handleRemove(file) {
			this.abort(file);
			this.fileList.splice(this.fileList.indexOf(file), 1);
			this.$emit("remove", file, this.fileList);
			this.$emit("change", file, this.fileList);
		}
	},

	beforeDestroy() {
		this.fileList.forEach(file => {
			if (file.url && file.url.indexOf("blob:") === 0) {
				URL.revokeObjectURL(file.url);
			}
		});
	},

	render(h) {
		let { vuiForm, $slots, classNamePrefix, draggable, multiple, accept, showList, fileList, listType, request, action, headers, withCredentials, name, data, autoUpload, beforeUpload, beforeRemove } = this;
		let { handleReady, handleProgress, handleSuccess, handleError, handlePreview, handleRemove } = this;

		// disabled
		let disabled;

		if (vuiForm && vuiForm.disabled) {
			disabled = vuiForm.disabled;
		}
		else {
			disabled = this.disabled;
		}

		// classes
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-draggable`]: draggable,
			[`${classNamePrefix}-${listType}`]: listType,
			[`${classNamePrefix}-disabled`]: disabled
		};

		// render
		let children = [];
		let childUploadTrigger;
		let childUploadList;

		childUploadTrigger = (
			<VuiUploadTrigger
				ref="trigger"
				v-show={$slots.trigger || $slots.default}
				draggable={draggable}
				multiple={multiple}
				accept={accept}
				list={fileList}
				request={request}
				action={action}
				headers={headers}
				withCredentials={withCredentials}
				name={name}
				data={data}
				autoUpload={autoUpload}
				beforeUpload={beforeUpload}
				disabled={disabled}
				onReady={handleReady}
				onProgress={handleProgress}
				onSuccess={handleSuccess}
				onError={handleError}
				onRemove={handleRemove}
			>
				{$slots.trigger || $slots.default}
			</VuiUploadTrigger>
		);

		if (showList && fileList.length > 0) {
			childUploadList = (
				<VuiUploadList
					ref="list"
					list={fileList}
					listType={listType}
					beforeRemove={beforeRemove}
					disabled={disabled}
					onPreview={handlePreview}
					onRemove={handleRemove}
				/>
			);
		}

		if (!draggable && listType === "picture-card") {
			children.push(childUploadList);
		}

		if ($slots.trigger) {
			children.push(childUploadTrigger);
			children.push($slots.default);
		}
		else {
			children.push(childUploadTrigger);
		}

		if (listType === "text" || listType === "picture" || (draggable && listType === "picture-card")) {
			children.push(childUploadList);
		}

		return (
			<div class={classes}>
				{children}
			</div>
		);
	}
};

export default VuiUpload;