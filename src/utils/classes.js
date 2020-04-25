var objProto = Object.prototype;
var funProto = Function.prototype;

var getPrototypeOf = Object.getPrototypeOf;
var isArray = Array.isArray;

var objToString = objProto.toString;
var hasOwnProperty = objProto.hasOwnProperty;
var funToString = funProto.toString;

// --------------------------------------------------------------------------------
// 准备工作
var ready = {
    isObject: function(value){
        return !!value && typeof value === "object";
    },
    isPlainObject: function(value){
        if(!value || objToString.call(value) !== "[object Object]"){
            return false;
        }

        var prototype = getPrototypeOf(value);

        if(prototype === null){
            return true;
        }

        var constructor = hasOwnProperty.call(prototype, "constructor") && prototype.constructor;

        return typeof constructor === "function" && funToString.call(constructor) === funToString.call(Object);
    },
    isArray: isArray || function(value){
        return objToString.call(value) === "[object Array]";
    },
    isFunction: function(value){
        return objToString.call(value) === "[object Function]" || typeof value === "function";
    },
    isBoolean: function(value){
        return value === true || value === false || objToString.call(value) === "[object Boolean]";
    },
    isString: function(value){
        return objToString.call(value) === "[object String]";
    },
    isElement: function(value){
        return ready.isObject(value) && !ready.isPlainObject(value) && value.nodeType === 1;
    },
    stripAndCollapse: function(value){
        return value.match(/[^\x20\t\r\n\f]+/g) || [];
    },
    classesToArray: function(value){
        if(ready.isArray(value)){
            return value;
        }

        if(ready.isString(value)){
            return ready.stripAndCollapse(value);
        }

        return [];
    }
};

// --------------------------------------------------------------------------------
// 构造函数
function Classes(element){
    if(!ready.isElement(element)){
        throw new TypeError("a DOM element is required");
    }

    this.element = element;
}

Classes.prototype.value = function(name){
    if(ready.isFunction(name)){
        return this.value(name.call(this));
    }

    if(ready.isString(name)){
        name = ready.stripAndCollapse(name);

        this.element.className = name.join(" ");

        return this;
    }

    return ready.stripAndCollapse(this.element.className);
};

Classes.prototype.has = function(name){
    var value = this.value();

    name = ready.stripAndCollapse(name);

    if(value.length < name.length){
        return false;
    }

    for(var i = 0, length = name.length; i < length; i++){
        if(value.indexOf(name[i]) === -1){
            return false;
        }
    }

    return true;
};

Classes.prototype.add = function(name){
    if(ready.isFunction(name)){
        return this.add(name.call(this));
    }

    name = ready.classesToArray(name);

    if(name.length > 0){
        var value = this.value();
        var curValue = value.join(" ");
        var i = 0;
        var current;

        while((current = name[i++])){
            if(value.indexOf(current) === -1){
                value.push(current);
            }
        }

        value = value.join(" ");

        if(curValue !== value){
            this.element.className = value;
            delete this.element.previousClassName;
        }
    }

    return this;
};

Classes.prototype.remove = function(name){
    if(arguments.length === 0){
        this.element.className = "";
        delete this.element.previousClassName;
    }
    else{
        if(ready.isFunction(name)){
            return this.remove(name.call(this));
        }

        name = ready.classesToArray(name);

        if(name.length > 0){
            var value = this.value();
            var curValue = value.join(" ");
            var i = 0;
            var current;

            while((current = name[i++])){
                var index = value.indexOf(current);

                if(index !== -1){
                    value.splice(index, 1);
                }
            }

            value = value.join(" ");

            if(curValue !== value){
                this.element.className = value;
                delete this.element.previousClassName;
            }
        }
    }

    return this;
};

Classes.prototype.toggle = function(name, force){
    var valid = ready.isString(name) || ready.isArray(name);

    if(ready.isBoolean(force) && valid){
        return force ? this.add(name) : this.remove(name);
    }

    if(ready.isFunction(name)){
        return this.toggle(name.call(this), force);
    }

    if(valid){
        name = ready.classesToArray(name);

        var i = 0;
        var current;

        while((current = name[i++])){
            if(this.has(current)){
                this.remove(current);
            }
            else{
                this.add(current);
            }
        }
    }
    else if(name === undefined || ready.isBoolean(name)){
        var value = this.value();
        var curValue = value.join(" ");

        if(curValue){
            this.element.previousClassName = curValue;
        }

        this.element.className = curValue || name === false ? "" : this.element.previousClassName || "";
    }

    return this;
};

// --------------------------------------------------------------------------------
// 返回 classes 方法供使用
function classes(element){
    return new Classes(element);
}

classes.create = function(){
    var classname = [];

    for(var i = 0, length = arguments.length; i < length; i++){
        var arg = arguments[i];

        if(!arg){
            continue;
        }

        if(ready.isString(arg)){
            classname.push(arg);
        }
        else if(ready.isArray(arg) && arg.length > 0){
            var middle = classes.create.apply(null, arg);

            if(middle){
                classname.push(middle);
            }
        }
        else if(ready.isPlainObject(arg)){
            for(var key in arg){
                if(hasOwnProperty.call(arg, key) && arg[key]){
                    classname.push(key);
                }
            }
        }
    }

    return classname.join(" ");
};

export default classes;