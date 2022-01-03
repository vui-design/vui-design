/**
* 根据指定顺序从上级组件获取继承属性
* @returns {Any}
*/
export default function getInheritProp(prop, defaultValue, parents) {
  let i = 0;
  let length = parents.length;
  let value = defaultValue;

  while (i < length) {
    const parent = parents[i];

    if (parent && parent[prop]) {
      value = parent[prop];
      break;
    }

    i++;
  }

  return value;
};