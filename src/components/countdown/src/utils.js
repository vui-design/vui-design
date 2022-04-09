import padStart from "../../../utils/padStart";

const units = [
  ["Y", 1000 * 60 * 60 * 24 * 365],
  ["M", 1000 * 60 * 60 * 24 * 30],
  ["D", 1000 * 60 * 60 * 24],
  ["H", 1000 * 60 * 60],
  ["m", 1000 * 60],
  ["s", 1000],
  ["S", 1]
];

export const now = () => new Date().getTime();

export const parser = value => {
  if (typeof value === "string") {
    value = value.replace(/-/g,  "/");
  }

  const date = new Date(value);
  const timestamp = date.getTime();

  if (isNaN(timestamp)) {
    return 0;
  }

  return timestamp;
};

export const formatter = (current, target, format = "HH:mm:ss") => {
  return formatTimestamp(Math.max(target - current, 0), format);
};

export const formatTimestamp = (duration, format) => {
  let left = duration;

  const regex = /\[[^\]]*\]/g;
  const keepList = (format.match(regex) || []).map(string => string.slice(1, -1));
  const template = format.replace(regex, "[]");

  const replaced = units.reduce((current, [name, unit]) => {
    if (current.indexOf(name) !== -1) {
      const value = Math.floor(left / unit);

      left  -= value * unit;

      return current.replace(new RegExp(name + "+", "g"), match => {
        const length = match.length;

        return padStart(value.toString(), length, "0");
      });
    }

    return current;
  }, template);

  let index = 0;

  return replaced.replace(regex, () => {
    const match = keepList[index];

    index += 1;

    return match;
  });
};

export default {
  now,
  parser,
  formatter
};