function getBody(xhr) {
	const response = xhr.responseText || xhr.response;

	if (!response) {
		return response;
	}

	try {
		return JSON.parse(response);
	}
	catch (e) {
		return response;
	}
}

function getError(action, xhr) {
	let message;

	if (xhr.response) {
		message = `${xhr.response.error || xhr.response}`;
	}
	else if (xhr.responseText) {
		message = `${xhr.responseText}`;
	}
	else {
		message = `fail to post ${action} ${xhr.status}`;
	}

	const error = new Error(message);

	error.method = "post";
	error.url = action;
	error.status = xhr.status;

	return error;
}

export default function(options) {
	if (typeof XMLHttpRequest === "undefined") {
		return;
	}

	const xhr = new XMLHttpRequest();

	if (xhr.upload) {
		xhr.upload.onprogress = function(e) {
			if (e.total > 0) {
				e.percentage = e.loaded / e.total * 100;
			}
			else {
				e.percentage = 0;
			}

			options.onProgress(e);
		};
	}

	const formData = new FormData();

	if (options.data) {
		Object.keys(options.data).forEach(key => {
			formData.append(key, options.data[key]);
		});
	}

	formData.append(options.name, options.file, options.file.name);

	xhr.onload = function() {
		if (xhr.status >= 200 && xhr.status < 300) {
			options.onSuccess(getBody(xhr));
		}
		else {
			options.onError(getError(options.action, xhr));
		}
	};

	xhr.onerror = function(e) {
		options.onError(e);
	};

	xhr.open("post", options.action, true);

	if (options.headers) {
		Object.keys(options.headers).forEach(key => {
			xhr.setRequestHeader(key, options.headers[key]);
		});
	}

	if (options.withCredentials && "withCredentials" in xhr) {
		xhr.withCredentials = true;
	}

	xhr.send(formData);

	return xhr;
};