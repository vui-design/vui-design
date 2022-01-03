/**
* 创建链接函数
* 仅在需要时创建新函数，否则将返回现有函数或空值
* @returns {Function | null}
*/
export default function createChainedFunction() {
  const args = [].slice.call(arguments, 0);

  if (args.length === 1) {
    return args[0];
  }

  return function chainedFunction() {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg && arg.apply) {
        arg.apply(this, arguments);
      }
    }
  };
};