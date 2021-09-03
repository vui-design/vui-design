import VuiIcon from "../../icon";
import VuiProgress from "../../progress";

const VuiUploadList = {
	name: "vui-upload-list",

	components: {
		VuiIcon,
		VuiProgress
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-upload"
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
		beforeRemove: {
			type: Function,
			default: undefined
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	methods: {
		handlePreview(item) {
			this.$emit("preview", item);
		},
		handleRemove(item) {
			let doRemove = () => {
				this.$emit("remove", item);
			};

			if (!this.beforeRemove) {
				return doRemove();
			}

			let promise = this.beforeRemove(item, this.list);

			if (promise && promise.then) {
				let resolve = () => {
					doRemove();
				};
				let reject = () => {
					// do nothing...
				};

				promise.then(resolve, reject);
			}
			else if (promise !== false) {
				doRemove();
			}
			else {
				// do nothing...
			}
		}
	},

	render(h) {
		let { classNamePrefix, list, listType, disabled, handlePreview, handleRemove } = this;

		return (
			<ul class={`${classNamePrefix}-list`}>
				{
					list.map(item => {
						let children = [];

						if (listType !== "text") {
							children.push(
								<a
									href="javascript:;"
									class={`${classNamePrefix}-item-thumbnail`}
									onClick={e => handlePreview(item)}
								>
									<img src={item.url} alt={item.name} />
								</a>
							);
						}

						if (listType !== "picture-card") {
							let iconType;
							let icon;

							if (listType === "text") {
								iconType = item.status === "progress" ? "loading" : "attachment";
								icon = (
									<VuiIcon type={iconType} />
								);
							}

							children.push(
								<div class={`${classNamePrefix}-item-name`}>
									{icon}
									{item.name}
								</div>
							);
						}

						if (item.status === "progress") {
							let progressType = listType === "picture-card" ? "circle" : "line";

							children.push(
								<VuiProgress
									class={`${classNamePrefix}-item-percentage`}
									type={progressType}
									canvas={50}
									stroke={2}
									percentage={item.percentage}
									showInfo={false}
								/>
							);
						}

						if (listType === "text" && !disabled) {
							children.push(
								<div class={`${classNamePrefix}-item-actions`}>
									<VuiIcon
										type="dustbin"
										class={`${classNamePrefix}-item-action ${classNamePrefix}-item-action-remove`}
										onClick={e => handleRemove(item)}
									/>
								</div>
							);
						}
						else if (listType === "picture" || listType === "picture-card") {
							let actions = [];

							actions.push(
								<VuiIcon
									type="eye"
									class={`${classNamePrefix}-item-action ${classNamePrefix}-item-action-preview`}
									onClick={e => handlePreview(item)}
								/>
							);

							if (!disabled) {
								actions.push(
									<VuiIcon
										type="dustbin"
										class={`${classNamePrefix}-item-action ${classNamePrefix}-item-action-remove`}
										onClick={e => handleRemove(item)}
									/>
								);
							}

							children.push(
								<div class={`${classNamePrefix}-item-actions`}>
									{actions}
								</div>
							);
						}

						return (
							<li
								key={item.id}
								class={`${classNamePrefix}-item ${classNamePrefix}-item-${item.status}`}
							>
								{children}
							</li>
						);
					})
				}
			</ul>
		);
	}
};

export default VuiUploadList;