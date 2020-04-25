var nativeCreate = Object.create;
var nativeKeys = Object.keys;
var nativeIsArray = Array.isArray;

var objProto = Object.prototype;
var arrProto = Array.prototype;
var symbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

var toString = objProto.toString;
var hasOwnProperty = objProto.hasOwnProperty;
var slice = arrProto.slice;
var push = arrProto.push;

var util = function(obj){
  if(obj instanceof util){
    return obj;
  }

  if(!(this instanceof util)){
    return new util(obj);
  }

  this.wrapped = obj;
};

var optimizeCallback = function(fn, context, argsCount){
  if(context === void 0){
    return fn;
  }

  switch(argsCount){
    case 1:
      return function(value){
        return fn.call(context, value);
      };
    case null:
    case 3:
      return function(value, index, collection){
        return fn.call(context, value, index, collection);
      };
    case 4:
      return function(accumulator, value, index, collection){
        return fn.call(context, accumulator, value, index, collection);
      };
  }

  return function(){
    return fn.apply(context, arguments);
  };
};

var builtinIterator;

var callback = function(value, context, argsCount){
  if(util.iterator !== builtinIterator){
    return util.iterator(value, context);
  }

  if(value == null){
    return util.identity;
  }

  if(util.isFunction(value)){
    return optimizeCallback(value, context, argsCount);
  }

  if(util.isObject(value) && !util.isArray(value)){
    return util.matcher(value);
  }

  return util.property(value);
};

util.iterator = builtinIterator = function(value, context){
  return callback(value, context, Infinity);
};

var restArgs = function(fn, startIndex){
  startIndex = startIndex == null ? fn.length - 1 : +startIndex;

  return function(){
    var index = 0, length = Math.max(arguments.length - startIndex, 0), rest = Array(length);

    for(; index < length; index++){
      rest[index] = arguments[index + startIndex];
    }

    switch(startIndex){
      case 0:
        return fn.call(this, rest);
      case 1:
        return fn.call(this, arguments[0], rest);
      case 2:
        return fn.call(this, arguments[0], arguments[1], rest);
    }

    var args = Array(startIndex + 1);

    for(index = 0; index < startIndex; index++){
      args[index] = arguments[index];
    }

    args[startIndex] = rest;

    return fn.apply(this, args);
  };
};

var F = function(){

};

var baseCreate = function(prototype){
  if(!util.isObject(prototype)){
    return {};
  }

  if(nativeCreate){
    return nativeCreate(prototype);
  }

  F.prototype = prototype;

  var result = new F();

  F.prototype = null;

  return result;
};

var shallowProperty = function(key){
  return function(obj){
    return obj == null ? void 0 : obj[key];
  };
};

var deepGet = function(obj, path){
  var length = path.length;

  for(var i = 0; i < length; i++){
    if(obj == null){
      return void 0;
    }

    obj = obj[path[i]];
  }

  return length ? obj : void 0;
};

var maxSafeInteger = Math.pow(2, 53) - 1;
var getLength = shallowProperty('length');
var isArrayLike = function(collection){
  var length = getLength(collection);

  return typeof length == 'number' && length >= 0 && length <= maxSafeInteger;
};





// 集合相关
/* ---------------------------------------------------------------------------------------------------- */

// 遍历 list 中的所有元素，按顺序将每个元素当做参数调用 iterator 函数。
// 如果传递了 context 参数，则把 iterator 绑定到 context 上。
// 每次调用 iterator 都会传递三个参数 value, index, list。如果 list 是个 javascript 对象，iterator 的参数是 value, key, list。
// 返回 list 以方便链式调用。
util.each = function(list, iterator, context){
  iterator = optimizeCallback(iterator, context);

  var keys = !isArrayLike(list) && util.keys(list), length = (keys || list).length;

  for(var i = 0; i < length; i++){
    var key = keys ? keys[i] : i;

    iterator(list[key], key, list);
  }

  return list;
};

// 通过对 list 中的每个元素调用转换函数（iterator 迭代器）生成一个与之相对应的数组。
// iterator 传递三个参数：value，然后是迭代 index（如果 list 是个 javascript 对象，这个参数就是 key），最后一个是引用，指向整个 list。
util.map = function(list, iterator, context){
  iterator = callback(iterator, context);

  var keys = !isArrayLike(list) && util.keys(list), length = (keys || list).length, result = Array(length);

  for(var i = 0; i < length; i++){
    var key = keys ? keys[i] : i;

    result[i] = iterator(list[key], key, list);
  }

  return result;
};

// 返回 list 中的最大值。
// 如果传递 iterator 参数，iterator 将作为 list 中每个值的排序依据。
// 如果 list 为空，将返回 -Infinity，所以你可能需要事先用 isEmpty 检查 list。
util.max = function(list, iterator, context){
  var result = -Infinity, lastComputed = -Infinity, computed;

  if(iterator == null || (typeof iterator == 'number' && typeof list[0] != 'object') && list != null){
    list = isArrayLike(list) ? list : util.values(list);

    for(var i = 0, length = list.length; i < length; i++){
      computed = list[i];

      if(computed != null && computed > result){
        result = computed;
      }
    }
  }else{
    iterator = callback(iterator, context);

    util.each(list, function(value, index, list){
      computed = iterator(value, index, list);

      if(computed > lastComputed || computed === -Infinity && result === -Infinity){
        result = value;
        lastComputed = computed;
      }
    });
  }

  return result;
};

// 返回 list 中的最小值。
// 如果传递 iterator 参数，iterator 将作为 list 中每个值的排序依据。
// 如果 list 为空，将返回 Infinity，所以你可能需要事先用 isEmpty 检查 list。
util.min = function(list, iterator, context){
  var result = Infinity, lastComputed = Infinity, computed;

  if(iterator == null || (typeof iterator == 'number' && typeof list[0] != 'object') && list != null){
    list = isArrayLike(list) ? list : util.values(list);

    for(var i = 0, length = list.length; i < length; i++){
      computed = list[i];

      if(computed != null && computed < result){
        result = computed;
      }
    }
  }else{
    iterator = callback(iterator, context);

    util.each(list, function(value, index, list){
      computed = iterator(value, index, list);

      if(computed < lastComputed || computed === Infinity && result === Infinity){
        result = value;
        lastComputed = computed;
      }
    });
  }

  return result;
};

// 如果 list 中包含指定的 value 值则返回 true（使用 === 检测）。
// 如果 list 是数组，内部使用 indexOf 判断，使用 fromIndex 来指定开始检索的索引位置。
util.contains = function(list, item, fromIndex, guard){
  if(!isArrayLike(list)){
    list = util.values(list);
  }

  if(typeof fromIndex != 'number' || guard){
    fromIndex = 0;
  }

  return util.indexOf(list, item, fromIndex) >= 0;
};

// 在 list 中逐项查找，返回第一个通过 predicate 真值检测的元素，如果没有元素通过检测则返回 undefined。
// 如果找到匹配的元素，函数将立即返回，不会遍历整个 list。
util.find = function(list, predicate, context){
  var keyFinder = isArrayLike(list) ? util.findIndex : util.findKey;
  var key = keyFinder(list, predicate, context);

  if(key !== -1 && key !== void 0){
    return list[key];
  }
};

// 遍历 list 中的每个元素，返回所有通过 predicate 真值检测的元素所组成的数组。
util.filter = function(list, predicate, context){
  predicate = callback(predicate, context);

  var result = [];

  util.each(list, function(value, index, list){
    if(predicate(value, index, list)){
      result.push(value);
    }
  });

  return result;
};

// 返回 list 中没有通过 predicate 真值检测的元素集合，与 filter 相反。
util.reject = function(list, predicate, context){
  return util.filter(list, util.negate(predicate), context);
};

// 如果 list 中的所有元素都通过 predicate 真值检测就返回 true。
util.every = util.all = function(list, predicate, context){
  predicate = callback(predicate, context);

  var keys = !isArrayLike(list) && util.keys(list), length = (keys || list).length;

  for(var i = 0; i < length; i++){
    var key = keys ? keys[i] : i;

    if(!predicate(list[key], key, list)){
      return false;
    }
  }

  return true;
};

// 如果 list 中有任何一个元素通过 predicate 真值检测就返回true。一旦找到了符合条件的元素，就直接中断对 list 的遍历。
util.some = util.any = function(list, predicate, context){
  predicate = callback(predicate, context);

  var keys = !isArrayLike(list) && util.keys(list), length = (keys || list).length;

  for(var i = 0; i < length; i++){
    var key = keys ? keys[i] : i;

    if(predicate(list[key], key, list)){
      return true;
    }
  }

  return false;
};

// 遍历 list 中的每一个元素，返回一个数组，这个数组里的每一个元素都包含 attrs 所列出的键值对。
util.where = function(list, attrs){
  return util.filter(list, util.matcher(attrs));
};

// 遍历 list，返回第一个包含 attrs 所列出的键值对的元素。
// 如果没有找到匹配的元素，或者 list 是空的，那么将返回 undefined。
util.findWhere = function(list, attrs){
  return util.find(list, util.matcher(attrs));
};

var createReduce = function(dir){
  var reducer = function(list, iterator, memo, initial){
    var keys = !isArrayLike(list) && util.keys(list), length = (keys || list).length, i = dir > 0 ? 0 : length - 1;

    if(!initial){
      memo = list[keys ? keys[i] : i];
      i += dir;
    }

    for(; i >= 0 && i < length; i += dir){
      var key = keys ? keys[i] : i;

      memo = iterator(memo, list[key], key, list);
    }

    return memo;
  };

  return function(list, iterator, memo, context){
    var initial = arguments.length >= 3;

    return reducer(list, optimizeCallback(iterator, context, 4), memo, initial);
  };
};

// 把 list 中的元素归结为一个单独的数值。
// memo 是 reduce 函数的初始值，会被每一次成功调用 iterator 函数的返回值所取代 。
// 迭代函数 iterator 接收 4 个参数：memo，value，然后是迭代 index（或者 key），最后一个是引用，指向整个 list。
// 如果没有 memo 传递给 reduce 的初始调用，iterator 不会被列表中的第一个元素调用。第一个元素将取代 memo 参数传递给列表中下一个元素调用的 iterator 函数。
util.reduce = createReduce(1);

// 从右侧开始组合元素的 reduce 函数
util.reduceRight = createReduce(-1);

// 在 list 的每个元素上执行 methodName 方法。任何传递给 invoke 的额外参数，invoke 都会在调用 methodName 方法的时候传递给它。
util.invoke = restArgs(function(list, path, args){
  var contextPath, fn;

  if(util.isFunction(path)){
    fn = path;
  }else if(util.isArray(path)){
    contextPath = path.slice(0, -1);
    path = path[path.length - 1];
  }

  return util.map(list, function(context){
    var method = fn;

    if(!method){
      if(contextPath && contextPath.length){
        context = deepGet(context, contextPath);
      }

      if(context == null){
        return void 0;
      }

      method = context[path];
    }

    return method == null ? method : method.apply(context, args);
  });
});

// pluck 也许是 map 最常使用的用例模型的简化版本，即萃取对象数组中的某属性值，返回一个数组。
util.pluck = function(list, key){
  return util.map(list, util.property(key));
};

// 从 list 中产生一个随机样本。
// 传递一个数字表示从 list 中返回 n 个随机元素。否则将返回一个单一的随机项。
util.sample = function(list, n, guard){
  if(n == null || guard){
    if(!isArrayLike(list)){
      list = util.values(list);
    }

    return list[util.random(list.length - 1)];
  }

  var sample = isArrayLike(list) ? util.clone(list) : util.values(list), length = getLength(sample), last = length - 1;

  n = Math.max(Math.min(n, length), 0);

  for(var i = 0; i < n; i++){
    var rd = util.random(i, last), temp = sample[i];

    sample[i] = sample[rd];
    sample[rd] = temp;
  }

  return sample.slice(0, n);
};

// 返回一个随机乱序的 list 副本，使用 Fisher-Yates shuffle 来进行随机乱序。
util.shuffle = function(list){
  return util.sample(list, Infinity);
};

var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;

// 把 list（任何可以迭代的对象）转换成一个数组，在转换 arguments 对象时非常有用。
util.parseArray = function(list){
  if(!list){
    return [];
  }

  if(util.isArray(list)){
    return slice.call(list);
  }

  if(util.isString(list)){
    return list.match(reStrSymbol);
  }

  if(isArrayLike(list)){
    return util.map(list, util.identity);
  }

  return util.values(list);
};

// 返回 list 的长度。
util.size = function(list){
  if(list == null){
    return 0;
  }

  return isArrayLike(list) ? list.length : util.keys(list).length;
};

// 返回 list 排序后的副本。
// 如果传递 iterator 参数，iterator 将作为 list 中每个元素的排序依据。
// 用来进行排序的迭代器也可以是字符串类型的属性名称，比如 length。
util.sortBy = function(obj, iterator, context){
  iterator = callback(iterator, context);

  var index = 0;

  return util.pluck(util.map(obj, function(value, key, list){
    return {
      value: value,
      index: index++,
      criteria: iterator(value, key, list)
    };
  }).sort(function(left, right){
    var a = left.criteria;
    var b = right.criteria;

    if(a !== b){
      if(a > b || a === void 0){
        return 1;
      }

      if(a < b || b === void 0){
        return -1;
      }
    }

    return left.index - right.index;
  }), 'value');
};

var group = function(behavior, partition){
  return function(list, iterator, context){
    var result = partition ? [[], []] : {};

    iterator = callback(iterator, context);

    util.each(list, function(value, index){
      var computed = iterator(value, index, list);

      behavior(result, value, computed);
    });

    return result;
  };
};

// 把一个集合分组为多个集合，通过 iterator 返回的结果进行分组。
// 如果 iterator 是一个字符串而不是函数，那么将使用 iterator 作为各元素的属性名来对比进行分组。
util.groupBy = group(function(result, value, key){
  if(util.has(result, key)){
    result[key].push(value);
  }else{
    result[key] = [value];
  }
});

// 给定一个 list，和一个为列表中的每个元素返回一个键（或一个属性名）的 iterator 函数。
// 返回一个包含每个项目索引的对象。
// 和 groupBy 非常像，当你知道你的键是唯一的时候可以使用 indexBy。
util.indexBy = group(function(result, value, key){
  result[key] = value;
});

// 对一个列表进行分组，并且返回各组中的元素的数量。
util.countBy = group(function(result, value, key){
  if(util.has(result, key)){
    result[key]++;
  }else{
    result[key] = 1;
  }
});

// 将 array 数组拆分为两个数组：第一个数组其元素都满足 predicate 迭代函数，而第二个数组的所有元素均不能满足 predicate 迭代函数。
util.partition = group(function(result, value, passed){
  result[passed ? 0 : 1].push(value);
}, true);





// 对象相关
/* ---------------------------------------------------------------------------------------------------- */

var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
var nonEnumProps = ['valueOf', 'toString', 'toLocaleString', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable'];
var collectNonEnumProps = function(obj, keys){
  var nonEnumIndex = nonEnumProps.length;
  var constructor = obj.constructor;
  var proto = util.isFunction(constructor) && constructor.prototype || objProto;
  var prop = 'constructor';

  if(util.has(obj, prop) && !util.contains(keys, prop)){
    keys.push(prop);
  }

  while(nonEnumIndex--){
    prop = nonEnumProps[nonEnumIndex];

    if(prop in obj && obj[prop] !== proto[prop] && !util.contains(keys, prop)){
      keys.push(prop);
    }
  }
};

// 沿着 path 检查 object 对象自身是否包含指定的键。
// 等同于 object.hasOwnProperty(key)，但是使用 hasOwnProperty 函数的一个安全引用，以防意外覆盖。
util.has = function(obj, path){
  if(!util.isArray(path)){
    return obj != null && hasOwnProperty.call(obj, path);
  }

  var length = path.length;

  for(var i = 0; i < length; i++){
    var key = path[i];

    if(obj == null || !hasOwnProperty.call(obj, key)){
      return false;
    }

    obj = obj[key];
  }

  return !!length;
};

// 检索 object 对象自身拥有的所有可枚举属性的名称。
util.keys = function(obj){
  if(!util.isObject(obj)){
    return [];
  }

  if(nativeKeys){
    return nativeKeys(obj);
  }

  var keys = [];

  for(var key in obj){
    if(util.has(obj, key)){
      keys.push(key);
    }
  }

  if(hasEnumBug){
    collectNonEnumProps(obj, keys);
  }

  return keys;
};

// 检索 object 对象自身拥有的和继承的所有可枚举属性的名称。
util.allKeys = function(obj){
  if(!util.isObject(obj)){
    return [];
  }

  var keys = [];

  for(var key in obj){
    keys.push(key);
  }

  if(hasEnumBug){
    collectNonEnumProps(obj, keys);
  }

  return keys;
};

// 返回 object 对象中第一个通过 predicate 函数真值检测的键。
// 如果没有键通过检测则返回 undefined。
util.findKey = function(obj, predicate, context){
  predicate = callback(predicate, context);

  var keys = util.keys(obj), length = keys.length;

  for(var i = 0; i < length; i++){
    var key = keys[i];

    if(predicate(obj[key], key, obj)){
      return key;
    }
  }
};

// 返回 object 对象自身拥有的所有可枚举属性的值。
util.values = function(obj){
  var keys = util.keys(obj), length = keys.length, values = Array(length);

  for(var i = 0; i < length; i++){
    values[i] = obj[keys[i]];
  }

  return values;
};

// 返回一个对象里的所有方法名，而且是已经排序的。也就是说，对象里每个方法（属性值是一个函数）的名称。
util.functions = util.methods = function(obj){
  var names = [];

  for(var key in obj){
    if(util.isFunction(obj[key])){
      names.push(key);
    }
  }

  return names.sort();
};

var keyInObj = function(value, key, obj){
  return key in obj;
};

// 返回 object 对象的一个副本，只过滤出 keys（有效的键组成的数组）参数指定的属性。
// 或者接受一个迭代判断函数，指定挑选哪些 keys 属性。
util.pick = restArgs(function(obj, keys){
  var result = {}, iterator = keys[0];

  if(obj == null){
    return result;
  }

  if(util.isFunction(iterator)){
    if(keys.length > 1){
      iterator = optimizeCallback(iterator, keys[1]);
    }

    keys = util.allKeys(obj);
  }else{
    iterator = keyInObj;
    keys = flatten(keys, false, false);
    obj = Object(obj);
  }

  for(var i = 0, length = keys.length; i < length; i++){
    var key = keys[i], value = obj[key];

    if(iterator(value, key, obj)){
      result[key] = value;
    }
  }

  return result;
});

// 返回 object 对象的一个副本，忽略 keys 参数指定的属性。
// 或者接受一个迭代判断函数，指定忽略哪些 keys 属性。
util.omit = restArgs(function(obj, keys){
  var iterator = keys[0], context;

  if(util.isFunction(iterator)){
    iterator = util.negate(iterator);

    if(keys.length > 1){
      context = keys[1];
    }
  }else{
    keys = util.map(flatten(keys, false, false), String);
    iterator = function(value, key){
      return !util.contains(keys, key);
    };
  }

  return util.pick(obj, iterator, context);
});

// 返回一个函数，这个函数返回任何传入对象的 key 属性。
util.property = function(path){
  if(!util.isArray(path)){
    return shallowProperty(path);
  }

  return function(obj){
    return deepGet(obj, path);
  };
};

// 和 property 相反。需要一个对象，并返回一个函数，这个函数将返回为该对象提供的 key 属性的值。
util.propertyOf = function(obj){
  if(obj == null){
    return util.noop;
  }

  return function(path){
    return !util.isArray(path) ? obj[path] : deepGet(obj, path);
  };
};

var createAssigner = function(keysFn, defaults){
  return function(obj){
    var length = arguments.length;

    if(defaults){
      obj = Object(obj);
    }

    if(length < 2 || obj == null){
      return obj;
    }

    for(var index = 1; index < length; index++){
      var source = arguments[index], keys = keysFn(source), l = keys.length;

      for(var i = 0; i < l; i++){
        var key = keys[i];

        if(!defaults || obj[key] === void 0){
          obj[key] = source[key];
        }
      }
    }

    return obj;
  };
};

// 复制 source 对象中的所有属性覆盖到 destination 对象上，并且返回 destination 对象。
// 复制是按顺序的，所以如果有重复属性的话，后面的对象属性会把前面的对象属性覆盖掉。
util.extend = createAssigner(util.allKeys);

// 类似于 extend，但只复制自身属性覆盖到目标对象，不包括继承过来的属性。
util.extendOwn = util.assign = createAssigner(util.keys);

// 用 defaults 对象填充 object 对象中的 undefined 属性，并且返回这个 object 对象。
// 一旦某个属性被填充，再使用 util.defaults 方法将不会有任何效果。
util.defaults = createAssigner(util.allKeys, true);

// 创建一个浅复制（浅拷贝）的克隆 object。任何嵌套的对象或数组都通过引用拷贝，不会复制。
util.clone = function(obj){
  if(!util.isObject(obj)){
    return obj;
  }

  return util.isArray(obj) ? obj.slice() : util.extend({}, obj);
};

// 把一个对象转换为一个 [key, value] 形式的数组。
util.pairs = function(obj){
  var keys = util.keys(obj), length = keys.length, pairs = Array(length);

  for(var i = 0; i < length; i++){
    var key = keys[i];

    pairs[i] = [key, obj[key]];
  }

  return pairs;
};

// 返回 object 对象的一个副本，使其键（keys）和值（values）对换。
// 对于这个操作，必须确保 object 对象里所有的值都是唯一的，且可以序列化成字符串。
util.invert = function(obj){
  var keys = util.keys(obj), length = keys.length, result = {};

  for(var i = 0; i < length; i++){
    var key = keys[i];

    result[obj[key]] = key;
  }

  return result;
};

// 类似于 util.map，但是针对于对象，用于转换每个属性的值。
util.mapObject = function(obj, iterator, context){
  iterator = callback(iterator, context);

  var keys = util.keys(obj), length = keys.length, result = {};

  for(var i = 0; i < length; i++){
    var key = keys[i];

    result[key] = iterator(obj[key], key, obj);
  }

  return result;
};

// 返回一个谓词函数，这个函数可以用来检查一个对象是否有一组给定的 key: value 键值对。
util.matcher = function(attrs){
  attrs = util.extendOwn({}, attrs);

  return function(obj){
    return util.isMatch(obj, attrs);
  };
};

// 用 object 作为参数来调用函数 interceptor，然后返回 object。
// 这种方法的主要意图是作为函数链式调用的一环，为了对此对象执行操作并返回对象本身。
util.tap = function(obj, interceptor){
  interceptor(obj);

  return obj;
};

// 创建一个从指定原型对象继承的对象。
// 如果提供了其它属性，则会将其添加到创建的对象中。
util.create = function(prototype, props){
  var result = baseCreate(prototype);

  if(props){
    util.extendOwn(result, props);
  }

  return result;
};





// 数组相关
/* ---------------------------------------------------------------------------------------------------- */

var createPredicateIndexFinder = function(dir){
  return function(array, predicate, context){
    predicate = callback(predicate, context);

    var length = getLength(array), index = dir > 0 ? 0 : length - 1;

    for(; index >= 0 && index < length; index += dir){
      if(predicate(array[index], index, array)){
        return index;
      }
    }

    return -1;
  };
};

// 正向（从前往后）遍历 array 数组，返回第一个通过 predicate 函数真值检测的元素的索引。
// 如果都未通过则返回 -1。
util.findIndex = createPredicateIndexFinder(1);

// 反向（从后往前）遍历 array 数组，返回第一个通过 predicate 函数真值检测的元素的索引。
// 如果都未通过则返回 -1。
util.findLastIndex = createPredicateIndexFinder(-1);

// 使用二分查找确定 value 在 array 中的序号，value 按此序号插入能保持 array 原有的排序。
// 如果提供 iterator 函数，iterator 将作为 array 排序的依据。
// iterator 也可以是字符串形式的属性名，比如 length。
util.sortedIndex = function(array, obj, iterator, context){
  iterator = callback(iterator, context, 1);

  var value = iterator(obj), low = 0, high = getLength(array);

  while(low < high){
    var mid = Math.floor((low + high) / 2);

    if(iterator(array[mid]) < value){
      low = mid + 1;
    }else{
      high = mid;
    }
  }

  return low;
};

var createIndexFinder = function(dir, predicateFind, sortedIndex){
  return function(array, value, index){
    var i = 0, length = getLength(array);

    if(typeof index == 'number'){
      if(dir > 0){
        i = index >= 0 ? index : Math.max(index + length, i);
      }else{
        length = index >= 0 ? Math.min(index + 1, length) : index + length + 1;
      }
    }else if(sortedIndex && index && length){
      index = sortedIndex(array, value);

      return array[index] === value ? index : -1;
    }

    if(value !== value){
      index = predicateFind(slice.call(array, i, length), util.isNaN);

      return index >= 0 ? index + i : -1;
    }

    for(index = dir > 0 ? i : length - 1; index >= 0 && index < length; index += dir){
      if(array[index] === value){
        return index;
      }
    }

    return -1;
  };
};

// 正向（从前往后）查找 value 元素在 array 数组中第一次出现时的索引。
// 如果 value 不在 array 中则返回 -1。
// 如果您正在使用一个大数组，且知道数组已经排序，传递 isSorted 参数并设置为 true 将更快的用二进制搜索。
// 或者，传递一个数值作为第三个参数，来指定开始检索的索引位置。
util.indexOf = createIndexFinder(1, util.findIndex, util.sortedIndex);

// 反向（从后往前）查找 value 元素在 array 数组中第一次出现时的索引。
// 如果 value 不在 array 中则返回 -1。
// 传递一个数值作为第三个参数，来指定开始检索的索引位置。
util.lastIndexOf = createIndexFinder(-1, util.findLastIndex);

// 返回 array 数组中的第一个元素。
// 传递 n 参数将返回从第一个元素开始的 n 个元素（返回数组中的前 n 个元素）。
util.first = function(array, n, guard){
  if(array == null || array.length < 1){
    return void 0;
  }

  if(n == null || guard){
    return array[0];
  }

  return util.initial(array, array.length - n);
};

// 返回 array 数组中除了最后一个元素外的其它全部元素。
// 传递 n 参数将忽略从最后一个元素开始的 n 个元素（忽略数组中的后 n 个元素）。
util.initial = function(array, n, guard){
  return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
};

// 返回 array 数组中最后一个元素。
// 传递 n 参数将返回从最后一个元素开始的 n 个元素（返回数组中的后 n 个元素）。
util.last = function(array, n, guard){
  if(array == null || array.length < 1){
    return void 0;
  }

  if(n == null || guard){
    return array[array.length - 1];
  }

  return util.rest(array, Math.max(0, array.length - n));
};

// 返回 array 数组中除了第一个元素外的其它全部元素。
// 传递 n 参数将忽略从第一个元素开始的 n 个元素（忽略数组中的前 n 个元素）。
util.rest = function(array, n, guard){
  return slice.call(array, n == null || guard ? 1 : n);
};

// 返回 array 数组去除所有 false 值后的副本。
// 在 javascript 中，null、undefined、false、''、0 和 NaN 都是 false 值。
util.compact = function(array){
  return util.filter(array, Boolean);
};

var flatten = function(input, shallow, strict, output){
  output = output || [];

  var idx = output.length;

  for(var index = 0, length = getLength(input); index < length; index++){
    var value = input[index];

    if(isArrayLike(value) && (util.isArray(value) || util.isArguments(value))){
      if(shallow){
        var i = 0, l = value.length;

        while(i < l){
          output[idx++] = value[i++];
        }
      }else{
        flatten(value, shallow, strict, output);
        idx = output.length;
      }
    }else if(!strict){
      output[idx++] = value;
    }
  }

  return output;
};

// 将一个嵌套多层的 array 数组（嵌套可以是任意层数）转换为只有一层的数组。
// 如果传递 shallow 参数，并设置为 true，数组将只减少一维的嵌套。
util.flatten = function(array, shallow){
  return flatten(array, shallow, false);
};

// 返回 array 数组中除了 value 元素外的其它全部元素。
// 可以传入一个或多个 value 元素。
util.without = restArgs(function(array, otherArrays){
  return util.difference(array, otherArrays);
});

// 类似于 without。
// 返回的元素来自 array 数组，并且不存在于 other 数组中。
// 可以传递一个或多个 other 数组。
util.difference = restArgs(function(array, rest){
  rest = flatten(rest, true, true);

  return util.filter(array, function(value){
    return !util.contains(rest, value);
  });
});

// 返回传入的 array 数组的并集。
// 按顺序返回，结果中的每个元素都是唯一的。
// 可以传入一个或多个 array 数组。
util.union = restArgs(function(arrays){
  return util.unique(flatten(arrays, true, true));
});

// 返回传入的 array 数组的交集。
// 结果中的每个元素是存在于传入的每个 array 数组里。
// 可以传入一个或多个 array 数组。
util.intersection = function(array){
  var result = [], argsLength = arguments.length;

  for(var index = 0, length = getLength(array); index < length; index++){
    var item = array[index];

    if(util.contains(result, item)){
      continue;
    }

    for(var i = 1; i < argsLength; i++){
      if(!util.contains(arguments[i], item)){
        break;
      }
    }

    if(i === argsLength){
      result.push(item);
    }
  }

  return result;
};

// 返回 array 数组去重后的副本。
// 使用 === 做相等测试。
// 如果您确定 array 已经排序，那么给 isSorted 参数传递 true 值， 此函数将运行更快的算法。
// 如果要处理对象数组，传递 iterator 函数来获取需要对比的属性。
util.unique = function(array, isSorted, iterator, context){
  if(!util.isBoolean(isSorted)){
    context = iterator;
    iterator = isSorted;
    isSorted = false;
  }

  if(iterator != null){
    iterator = callback(iterator, context);
  }

  var result = [], seen = [];

  for(var i = 0, length = getLength(array); i < length; i++){
    var value = array[i], computed = iterator ? iterator(value, i, array) : value;

    if(isSorted && !iterator){
      if(!i || seen !== computed){
        result.push(value);
      }

      seen = computed;
    }else if(iterator){
      if(!util.contains(seen, computed)){
        result.push(value);
        seen.push(computed);
      }
    }else if(!util.contains(result, value)){
      result.push(value);
    }
  }

  return result;
};

// 返回 arrary 数组中重复的元素。
// 如果要处理对象数组，传递 iterator 函数来获取需要对比的属性。
util.duplicate = function(arrary, iterator, context){
  if(arrary == null){
    return [];
  }

  if(iterator != null){
    iterator = callback(iterator, context);
  }

  var result = [], seen = [], hash = {};

  for(var i = 0, length = getLength(arrary); i < length; i++){
    var value = arrary[i], computed = iterator ? iterator(value, i, arrary) : value;

    if(!hash[computed]){
      hash[computed] = true;
    }else if(iterator){
      if(!util.contains(seen, computed)){
        result.push(value);
        seen.push(computed);
      }
    }else if(!util.contains(result, value)){
      result.push(value);
    }
  }

  return result;
};

// 与 util.zip 功能相反的函数。
// 给定若干个 array 数组，返回一个串联的新数组，其第一个元素包含所有输入数组的第一个元素，其第二个元素包含了所有输入数组的第二个元素，依此类推。
util.unzip = function(array){
  var length = array && util.max(array, getLength).length || 0, result = Array(length);

  for(var i = 0; i < length; i++){
    result[i] = util.pluck(array, i);
  }

  return result;
};

// 将每个 array 数组中相应位置的元素合并在一起。在合并分开保存的数据时很有用。
// 如果你用来处理矩阵嵌套数组时，util.zip.apply 可以做类似的效果。
util.zip = restArgs(util.unzip);

// 将数组转换为对象。
// 传递任何一个 [key, value] 键值对的列表，或者一个键的列表和一个值的列表。
// 如果存在重复键，最后一个值将被返回。
util.object = function(list, values){
  var length = getLength(list), result = {};

  for(var i = 0; i < length; i++){
    if(values){
      result[list[i]] = values[i];
    }else{
      result[list[i][0]] = list[i][1];
    }
  }

  return result;
};

// 生成一个包含算术级数的整数数组，便于 each 和 map 循环。
// 如果省略 start 则默认为 0，step 默认为 1。返回一个从 start 到 stop 的整数列表。
// 用 step 来增加或减少独占。
// 值得注意的是，如果 stop 值在 start 前面（也就是 stop 值小于 start 值），那么值域会被认为是零长度，而不是负增长。
// 如果你要一个负数的值域 ，请使用负数 step。
util.range = function(start, stop, step){
  if(stop == null){
    stop = start || 0;
    start = 0;
  }

  if(!step){
    step = stop < start ? -1 : 1;
  }

  var length = Math.max(Math.ceil((stop - start) / step), 0), range = Array(length);

  for(var i = 0; i < length; i++, start += step){
    range[i] = start;
  }

  return range;
};

// 将一个 array 数组，每 count 个元素分为一组。
// 例如将数组 [1, 2, 3, 4, 5] 每 2 个元素分为一组，分割成 [[1, 2], [3, 4], [5]]
util.chunk = function(array, count){
  if(count == null || count < 1){
    return array;
  }

  var i = 0, length = array.length, result = [];

  while(i < length){
    result.push(slice.call(array, i, i += count));
  }

  return result;
};





// 函数相关
/* ---------------------------------------------------------------------------------------------------- */

var executeBound = function(sourceFn, boundFn, context, callingContext, args){
  if(!(callingContext instanceof boundFn)){
    return sourceFn.apply(context, args);
  }

  var self = baseCreate(sourceFn.prototype), result = sourceFn.apply(self, args);

  if(util.isObject(result)){
    return result;
  }

  return self;
};

// 绑定函数 function 到对象 object 上。
// 也就是说，无论何时调用函数，函数里的 this 都指向这个 object。
// 任意可选参数 arguments 可以传递给函数 function，填充函数所需要的参数。
util.bind = restArgs(function(fn, context, args){
  if(!util.isFunction(fn)){
    throw new TypeError('util.bind must be called on a function');
  }

  var bound = restArgs(function(callArgs){
    return executeBound(fn, bound, context, this, args.concat(callArgs));
  });

  return bound;
});

// 把 methodNames 参数指定的一些方法绑定到 object 上，这些方法就会在 object 的上下文环境中执行。
// 绑定函数用作事件处理函数时非常便利，否则函数被调用时 this 一点用也没有。
// methodNames 参数是必须的。
util.bindAll = restArgs(function(obj, keys){
  keys = flatten(keys, false, false);

  var index = keys.length;

  if(index < 1){
    throw new Error('util.bindAll must be passed function names');
  }

  while(index--){
    var key = keys[index];

    obj[key] = util.bind(obj[key], obj);
  }
});

// 通过创建一个已经预先填充了一些参数的版本来部分应用一个函数，而不改变它的动态 this 上下文。
// util 在默认情况下充当占位符，允许预先填充任何参数组合。
// 自定义占位符参数请设置 util.partial.placeholder。
util.partial = restArgs(function(fn, boundArgs){
  var placeholder = util.partial.placeholder;

  var bound = function(){
    var position = 0, length = boundArgs.length, args = Array(length);

    for(var i = 0; i < length; i++){
      args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
    }

    while(position < arguments.length){
      args.push(arguments[position++]);
    }

    return executeBound(fn, bound, this, this, args);
  };

  return bound;
});

util.partial.placeholder = util;

// 创建一个函数，这个函数只有在调用次数小于 times 时才会有实际效果。
util.before = function(times, fn){
  var memo;

  return function(){
    if(--times > 0){
      memo = fn.apply(this, arguments);
    }

    if(times <= 1){
      fn = null;
    }

    return memo;
  };
};

// 创建一个函数，这个函数只有在调用次数大于等于 times 时才会有实际效果。
// 在处理同组异步请求的返回结果时，如果你要确保同组里所有异步请求完成之后才执行指定函数，这将非常有用。
util.after = function(times, fn){
  return function(){
    if(--times < 1){
      return fn.apply(this, arguments);
    }
  };
};

// 类似 setTimeout，等待 wait 毫秒后调用 function。
// 如果传递可选的参数 arguments，当函数 function 执行时，arguments 会作为参数传入。
util.delay = restArgs(function(fn, wait, args){
  return setTimeout(function(){
    return fn.apply(null, args);
  }, wait);
});

// 延迟调用 function，直到当前调用栈清空为止，类似使用延时为 0 的 setTimeout 方法。
// 对于执行开销大的计算和无阻塞 ui 线程的 html 渲染非常有用。
// 如果传递可选的参数 arguments，当函数 function 执行时，arguments 会作为参数传入。
util.defer = util.partial(util.delay, util, 1);

// 创建一个只会执行一次的函数。
// 作为初始化函数使用时非常有用，不用再设置一个 boolean 类型的变量来检查是否已经初始化完成。
util.once = util.partial(util.before, 2);

// 将函数 function 作为第一个参数传给 wrapper，返回 function 的一个新版本。这样可以让 wrapper 在 function 运行之前和之后执行代码，调整参数然后附有条件地执行。
util.wrap = function(fn, wrapper){
  return util.partial(wrapper, fn);
};

// 返回一个谓词函数（返回 boolean 值的函数或者仿函数）的否定版本。
util.negate = function(predicate){
  return function(){
    return !predicate.apply(this, arguments);
  };
};

// 返回函数集 functions 组合后的复合函数，也就是一个函数执行完之后把返回结果再作为参数传递给下一个函数来执行，以此类推。
// 在数学里，把函数 f(), g() 和 h() 组合起来可以得到复合函数 f(g(h()))。
util.compose = function(){
  var args = arguments, start = args.length - 1;

  return function(){
    var i = start, result = args[start].apply(this, arguments);

    while(i--){
      result = args[i].call(this, result);
    }

    return result;
  };
};

// 缓存一个函数针对某个参数的运行结果，对于耗时较长的计算是很有帮助的。
// 如果传递了 hashFunction 参数，就用 hashFunction 的返回值作为 key 存储函数的计算结果。hashFunction 默认使用 function 的第一个参数作为 key。memoized 值的缓存可作为返回函数的 cache 属性。
util.memoize = function(fn, hasher){
  var memoize = function(key){
    var cache = memoize.cache;
    var address = '' + (hasher ? hasher.apply(this, arguments) : key);

    if(!util.has(cache, address)){
      cache[address] = fn.apply(this, arguments);
    }

    return cache[address];
  };

  memoize.cache = {};

  return memoize;
};

// 
util.restArgs = restArgs;

// 函数节流
util.throttle = function(fn, wait, options){
  var timeout, context, args, result, previous = 0;

  if(!options){
    options = {};
  }

  var later = function(){
    previous = options.leading === false ? 0 : util.now();
    timeout = null;
    result = fn.apply(context, args);

    if(!timeout){
      context = args = null;
    }
  };

  var throttled = function(){
    var now = util.now();

    if(!previous && options.leading === false){
      previous = now;
    }

    var remaining = wait - (now - previous);

    context = this;
    args = arguments;

    if(remaining <= 0 || remaining > wait){
      if(timeout){
        clearTimeout(timeout);
        timeout = null;
      }

      previous = now;
      result = fn.apply(context, args);

      if(!timeout){
        context = args = null;
      }
    }else if(!timeout && options.trailing !== false){
      timeout = setTimeout(later, remaining);
    }

    return result;
  };

  throttled.cancel = function(){
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
};

// 函数防抖
util.debounce = function(fn, wait, immediate){
  var timeout, result;

  var later = function(context, args){
    timeout = null;

    if(args){
      result = fn.apply(context, args);
    }
  };

  var debounced = restArgs(function(args){
    if(timeout){
      clearTimeout(timeout);
    }

    if(immediate){
      var callNow = !timeout;

      timeout = setTimeout(later, wait);

      if(callNow){
        result = fn.apply(this, args);
      }
    }else{
      timeout = util.delay(later, wait, this, args);
    }

    return result;
  });

  debounced.cancel = function(){
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
};





// 谓词函数
/* ---------------------------------------------------------------------------------------------------- */

// 如果 object 是 window 窗口对象，返回 true。
util.isWindow = function(obj){
  return obj != null && obj === obj.window;
};

// 如果 object 是一个 dom 元素，返回 true。
util.isElement = function(obj){
  return !!(obj && obj.nodeType === 1);
};

// 如果 object 是一个对象，返回 true。需要注意的是 javascript 中数组和函数是对象，字符串和数字不是。
// Object(obj) === obj
util.isObject = function(obj){
  var type = typeof obj;

  return type === 'function' || type === 'object' && !!obj;
};

// 测试 object 是否是一个纯粹的对象（即通过 {} 或者 new Object 创建的对象）。
util.isPlainObject = function(obj){
  return toString.call(obj) === '[object Object]';
};

// 如果 object 是一个数组，返回 true。
util.isArray = nativeIsArray || function(obj){
  return toString.call(obj) === '[object Array]';
};

// 如果 object 是一个参数对象，返回 true。
util.isArguments = function(obj){
  return toString.call(obj) === '[object Arguments]' || (obj != null && typeof obj === 'object' && 'callee' in obj);
};

// 如果 object 是一个函数，返回 true。
util.isFunction = function(value){
  return toString.call(value) === '[object Function]' || typeof value === 'function';
};

// 如果 object 是一个布尔值，返回 true。
util.isBoolean = function(obj){
  return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
};

util.each(['Date', 'RegExp', 'Number', 'String', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name){
  util['is' + name] = function(obj){
    return toString.call(obj) === '[object ' + name + ']';
  };
});

// 如果 object 是 NaN，返回 true。 
// 这和原生的 isNaN 函数不一样，如果变量是 undefined，原生的 isNaN 函数也会返回 true 。
util.isNaN = function(obj){
  return util.isNumber(obj) && isNaN(obj);
};

// 如果 object 是一个有限的数字，返回 true。
util.isFinite = function(obj){
  return !util.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
};

// 如果 object 的值是 null，返回 true。
util.isNull = function(obj){
  return obj === null;
};

// 如果 object 是 undefined，返回 true。
util.isUndefined = function(obj){
  return obj === void 0;
};

// 检查 object 的值是否为假，即 null、undefined、false、''、0、-0、NaN。
util.isFalsy = function(obj){
  return !obj;
};

// 检查 object 的值是否为真，与 util.isFalsy 相反。
util.isTruthy = util.negate(util.isFalsy);

// 检查 object 的值是否存在，即不是 null 或 undefined。
util.isExisty = function(obj){
  return obj != null;
};

// 如果 object 不包含任何值（没有可枚举的属性），返回 true。
// 对于字符串和类数组（array-like）对象，如果 length 属性为 0，那么 util.isEmpty 检查返回 true。
util.isEmpty = function(obj){
  if(obj == null){
    return true;
  }

  if(isArrayLike(obj) && (util.isArray(obj) || util.isArguments(obj) || util.isString(obj))){
    return obj.length === 0;
  }

  return util.keys(obj).length === 0;
};

var eq = function(a, b, aStack, bStack){
  if(a === b){
    return a !== 0 || 1 / a === 1 / b;
  }

  if(a == null || b == null){
    return false;
  }

  if(a !== a){
    return b !== b;
  }

  var type = typeof a;

  if(type !== 'function' && type !== 'object' && typeof b != 'object'){
    return false;
  }

  return deepEq(a, b, aStack, bStack);
};

var deepEq = function(a, b, aStack, bStack){
  if(a instanceof util){
    a = a.wrapped;
  }

  if(b instanceof util){
    b = b.wrapped;
  }

  var className = toString.call(a);

  if(className !== toString.call(b)){
    return false;
  }

  switch(className){
    case '[object RegExp]':
    case '[object String]':
      return '' + a === '' + b;
    case '[object Number]':
      if(+a !== +a){
        return +b !== +b;
      }
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
      return +a === +b;
    case '[object Symbol]':
      return symbolProto.valueOf.call(a) === symbolProto.valueOf.call(b);
  }

  var areArrays = className === '[object Array]';

  if(!areArrays){
    if(typeof a != 'object' || typeof b != 'object'){
      return false;
    }

    var aCtor = a.constructor, bCtor = b.constructor;

    if(aCtor !== bCtor && !(util.isFunction(aCtor) && aCtor instanceof aCtor && util.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)){
      return false;
    }
  }

  aStack = aStack || [];
  bStack = bStack || [];

  var length = aStack.length;

  while(length--){
    if(aStack[length] === a){
      return bStack[length] === b;
    }
  }

  aStack.push(a);
  bStack.push(b);

  if(areArrays){
    length = a.length;

    if(length !== b.length){
      return false;
    }

    while(length--){
      if(!eq(a[length], b[length], aStack, bStack)){
        return false;
      }
    }
  }else{
    var keys = util.keys(a), key;

    length = keys.length;

    if(util.keys(b).length !== length){
      return false;
    }

    while(length--){
      key = keys[length];

      if(!(util.has(b, key) && eq(a[key], b[key], aStack, bStack))){
        return false;
      }
    }
  }

  aStack.pop();
  bStack.pop();

  return true;
};

// 执行深入的比较来检查两个对象是否相等。
util.isEqual = function(a, b){
  return eq(a, b);
};

// 检查 object 对象是否有一组给定的 key: value 键值对。
util.isMatch = function(object, attrs){
  var keys = util.keys(attrs), length = keys.length;

  if(object == null){
    return !length;
  }

  var obj = Object(object);

  for(var i = 0; i < length; i++){
    var key = keys[i];

    if(attrs[key] !== obj[key] || !(key in obj)){
      return false;
    }
  }

  return true;
};





// 实用方法
/* ---------------------------------------------------------------------------------------------------- */

// 生成一个唯一的整数 id（在当前客户端会话中是唯一的）。
// 可用于临时 dom id。
var idCounter = 0;

util.uniqueId = function(prefix){
  var id = ++idCounter + '';

  return prefix ? prefix + id : id;
};

// 创建一个全局唯一标识符（GUID）。
util.guid = function(){
  var str = '';

  for(var i = 1; i <= 32; i++){
    var n = Math.floor(Math.random() * 16.0).toString(16);

    str += n;

    if((i == 8) || (i == 12) || (i == 16) || (i == 20)){
      str += '-';
    }
  }

  return str;
};

// 返回一个 min 和 max 之间的随机整数。
// 如果只传递一个参数，那么将返回 0 和这个参数之间的整数。
util.random = function(min, max){
  if(max == null){
    max = min;
    min = 0;
  }

  return min + Math.floor(Math.random() * (max - min + 1));
};

// 一种（可能更快）获取当前时间戳的方法。
util.now = Date.now || function(){
  return new Date().getTime();
};

// 返回 undefined，无论传递给它的是什么参数。
// 可以用作默认可选的回调函数。
util.noop = function(){

};

// 返回与传入参数相等的值，相当于数学里的 f(x) = x。
// 在 util 里被用作默认的迭代函数。
util.identity = function(value){
  return value;
};

// 返回一个函数，这个函数的返回值就是传递给 constant 函数的参数。
util.constant = function(value){
  return function(){
    return value;
  };
};

// 调用指定的 iterator 函数 n 次，每次调用 iterator 传递 index 参数。
util.times = function(n, iterator, context){
  var accum = Array(Math.max(0, n));

  iterator = optimizeCallback(iterator, context, 1);

  for(var i = 0; i < n; i++){
    accum[i] = iterator(i);
  }

  return accum;
};

// 沿着 path 查找 object 的指定节点。
// 如果该节点是一个函数，那么将在它的父级上下文内调用它，否则直接返回它。
// 如果提供默认值，并且该节点不存在，那么默认值将被返回。如果默认值是一个函数，它的结果将被返回。
util.result = function(obj, path, fallback){
  if(!util.isArray(path)){
    path = [path];
  }

  var len = path.length;

  if(!len){
    return util.isFunction(fallback) ? fallback.call(obj) : fallback;
  }

  for(var i = 0; i < len; i++){
    var prop = obj == null ? void 0 : obj[path[i]];

    if(prop === void 0){
      prop = fallback;
      i = len;
    }

    obj = util.isFunction(prop) ? prop.call(obj) : prop;
  }

  return obj;
};

var escapeMap = {
  '&': '&#38;',
  '<': '&#60;',
  '>': '&#62;',
  '"': '&#34;',
  '\'': '&#39;',
  '`': '&#x60;'
};

var unescapeMap = util.invert(escapeMap);

var createEscaper = function(map){
  var escaper = function(match){
    return map[match];
  };

  var source = '(?:' + util.keys(map).join('|') + ')';
  var testRegExp = RegExp(source);
  var replaceRegExp = RegExp(source, 'g');

  return function(string){
    string = string == null ? '' : '' + string;

    return testRegExp.test(string) ? string.replace(replaceRegExp, escaper) : string;
  };
};

// 转义 HTML 字符串，替换 "、&、'、/、< 和 > 字符
util.escape = createEscaper(escapeMap);

// 和 escape 相反
// 转义 HTML 字符串，替换 &#34;、&#38;、&#39;、&#47;、&#60; 和 &#62; 字符
util.unescape = createEscaper(unescapeMap);

// util.template 的默认设置。
util.templateSettings = {
  escape: /<%-([\s\S]+?)%>/g,
  interpolate: /<%=([\s\S]+?)%>/g,
  evaluate: /<%([\s\S]+?)%>/g
};

var templateNoMatch = /(.)^/;

var templateEscapeSetting = {
  '"': '"',
  '\\': '\\',
  '\r': 'r',
  '\n': 'n',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

var templateEscapeRegexp = /"|\\|\r|\n|\u2028|\u2029/g;

var templateEscapeChar = function(match){
  return '\\' + templateEscapeSetting[match];
};

// 将 javascript 模板编译为可以用于页面呈现的函数，对于通过 json 数据源生成复杂的 html 并呈现出来的操作非常有用。
// 模板函数可以使用 <%= ... %> 插入变量，也可以用 <% ... %> 执行任意的 javascript 代码。如果您希望插入一个值，并让其进行 html 转义，请使用 <%- ... %>。
// 当您要给模板函数赋值的时候，可以传递一个含有与模板对应属性的 data 对象。
// 如果您要写一个一次性的，您可以将 data 对象作为第二个参数传递给模板 util.template 来直接呈现，这样页面会立即呈现而不是返回一个模板函数。
// 参数 settings 应该是一个哈希表，包含任何可以被覆盖的默认设置 util.templateSettings。
util.template = function(text, settings, oldSettings){
  if(!settings && oldSettings){
    settings = oldSettings;
  }

  settings = util.defaults({}, settings, util.templateSettings);

  var matcher = new RegExp([(settings.escape || templateNoMatch).source, (settings.interpolate || templateNoMatch).source, (settings.evaluate || templateNoMatch).source].join('|') + '|$', 'g');
  var index = 0;
  var source = '$template+="';

  text.replace(matcher, function(match, escape, interpolate, evaluate, offset){
    source += text.slice(index, offset).replace(templateEscapeRegexp, templateEscapeChar);

    index = offset + match.length;

    if(escape){
      source += '"+(($value=(' + escape + '))==null?"":util.escape($value))+"';
    }else if(interpolate){
      source += '"+(($value=(' + interpolate + '))==null?"":$value)+"';
    }else if(evaluate){
      source += '";' + evaluate + '$template+="';
    }

    return match;
  });

  source += '";';

  if(!settings.variable){
    source = 'with(obj||{}){' + source + '}';
  }

  source = 'var $template="",$value,$join=Array.prototype.join,print=function(){$template+=$join.call(arguments,"");};' + source + 'return $template;';

  var render;

  try{
    render = new Function(settings.variable || 'obj', 'util', source);
  }catch(e){
    e.source = source;
    throw e;
  }

  var template = function(data){
    return render.call(this, data, util);
  };

  var argument = settings.variable || 'obj';

  template.source = 'function(' + argument + '){' + source + '}';

  return template;
};

// 命名空间。
util.namespace = function(path){
  if(!path){
    throw new Error('util.namespace(path): path required');
  }

  if(!(/^[a-zA-Z0-9\_\.]+$/.test(path)) || /^-?\d+$/.test(path.charAt(0)) || path.charAt(0) == '.' || path.charAt(path.length - 1) == '.' || path.indexOf('..') != -1){
    throw new Error('util.namespace(path): illegal path "' + path + '"');
  }

  var namespace = root, arr = path.split('.');

  for(var i = 0, len = arr.length; i < len; i++){
    var key = arr[i];

    if(!namespace[key]){
      namespace[key] = {};
    }else if(typeof namespace[key] != 'object'){
      throw new Error(arr.slice(0, i + 1).join('.') + ' already exists and is not an object');
    }

    namespace = namespace[key];
  }

  return namespace;
};







// 链式语法
/* ---------------------------------------------------------------------------------------------------- */

util.chain = function(obj){
  var instance = util(obj);

  instance.chained = true;

  return instance;
};





// 面向对象
/* ---------------------------------------------------------------------------------------------------- */

var chainResult = function(instance, obj){
  return instance.chained ? util(obj).chain() : obj;
};

util.mixin = function(obj){
  util.each(util.functions(obj), function(name){
    var fn = util[name] = obj[name];

    util.prototype[name] = function(){
      var args = [this.wrapped];

      push.apply(args, arguments);

      return chainResult(this, fn.apply(util, args));
    };
  });

  return util;
};

util.mixin(util);

util.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name){
  var method = arrProto[name];

  util.prototype[name] = function(){
    var obj = this.wrapped;

    method.apply(obj, arguments);

    if((name === 'shift' || name === 'splice') && obj.length === 0){
      delete obj[0];
    }

    return chainResult(this, obj);
  };
});

util.each(['concat', 'join', 'slice'], function(name){
  var method = arrProto[name];

  util.prototype[name] = function(){
    return chainResult(this, method.apply(this.wrapped, arguments));
  };
});

util.prototype.value = function(){
  return this.wrapped;
};

util.prototype.toString = function(){
  return String(this.wrapped);
};

util.prototype.valueOf = util.prototype.toJSON = util.prototype.value;

export default util;