import is from "./is";

const defaults = {
  quoted: false,
  separator: ","
};

const newline = "\r\n";
const bom = "\uFEFF";

const appendLine = (content, row, options) => {
  const line = row.map(data => {
    if (!options.quoted) {
      return data;
    }

    data = is.string(data) ? data.replace(/"/g, '"') : data;

    return `"${data}"`;
  });

  content.push(line.join(options.separator));
};

const has = browser => {
  const ua = navigator.userAgent;

  if (browser === "ie") {
    const isIE = ua.indexOf("compatible") > -1 && ua.indexOf("MSIE") > -1;

    if (isIE) {
      const reIE = new RegExp("MSIE (\\d+\\.\\d+);");

      reIE.test(ua);

      return parseFloat(RegExp.$1);
    }
    else {
      return false;
    }
  }
  else {
    return ua.indexOf(browser) > -1;
  }
};

const isIE11 = () => {
  const ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
  const trident = !!navigator.userAgent.match(/Trident\/7.0/);
  const rv = navigator.userAgent.indexOf("rv:11.0");
  let iev = 0;

  if (ieold) {
    iev = Number(RegExp.$1);
  }

  if (navigator.appVersion.indexOf("MSIE 10") > -1) {
    iev = 10;
  }

  if (trident && rv !== -1) {
    iev = 11;
  }

  return iev === 11;
};

const isEdge = () => {
  return /Edge/.test(navigator.userAgent);
};

const getDownloadUrl = text => {
  if (window.Blob && window.URL && window.URL.createObjectURL) {
    const data = new Blob([bom + text], {
      type: "text/csv"
    });

    return URL.createObjectURL(data);
  }
  else {
    return "data:attachment/csv;charset=utf-8," + bom + encodeURIComponent(text);
  }
};

const csv = (columns, data, options) => {
  let settings = { ...defaults, ...options };

  let cols = [];
  let content = [];

  if (columns) {
    let row = [];

    cols = columns.map(column => {
      if (is.string(column)) {
        return column;
      }

      if (settings.showHeader) {
        row.push(is.undefined(column.title) ? column.key : column.title);
      }

      return column.key;
    });

    if (row.length > 0) {
      appendLine(content, row, settings);
    }
  }
  else {
    data.forEach(row => {
      if (!is.array(row)) {
        cols = cols.concat(Object.keys(row));
      }
    });

    if (cols.length > 0) {
      cols = cols.filter((value, index, self) => self.indexOf(value) === index);

      if (settings.showHeader) {
        appendLine(content, cols, settings);
      }
    }
  }

  if (is.array(data)) {
    data.forEach(row => {
      if (!is.array(row)) {
        row = cols.map(key => (is.undefined(row[key]) ? "" : row[key]));
      }

      appendLine(content, row, settings);
    });
  }

  return content.join(newline);
};

csv.export = (filename, text) => {
  if (has("ie") && has("ie") < 10) {
    const win = window.top.open("about:blank", "_blank");

    win.document.charset = "utf-8";
    win.document.write(text);
    win.document.close();
    win.document.execCommand("SaveAs", filename);
    win.close();
  }
  else if (has("ie") === 10 || isIE11() || isEdge()) {
    const data = new Blob([bom + text], {
      type: "text/csv"
    });

    navigator.msSaveBlob(data, filename);
  }
  else {
    const link = document.createElement("a");

    link.download = filename;
    link.href = getDownloadUrl(text);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }
};

export default csv;