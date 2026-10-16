/*
 * wb.js cross server and client javascript library
 * Copyright (c) Geejing
 * https://www.geejing.com
 */
/**
 * Shared global variable storage object。
 * @class Globals
 * @singleton
 */
/** @property {Object} Str {#Str} Local text objects. */
/**
 * Extension class for the global this object.
 * @class globalThis
 * @singleton
 */
/** @property {Object} Wb The {#Wb} object. */
globalThis.Wb ??= {};
/** @property {Object} Cls The {#Cls} class manager object. */
Object.assign(globalThis, {
  /** @property {Object} - Object for storing shared global variables. @priv */
  Globals: {},
  /** @property {Function} - The hasOwnProperty prototype method of objects. */
  HasOwnProperty: Object.prototype.hasOwnProperty
});
/**
 * Wb base JavaScript library for client and server programming.
 * @class Wb
 * @singleton
 */
// Extend Wb members
Object.assign(Wb, {
  /** @property {Boolean} - Whether the script is running on the server side. */
  isServer: !globalThis.window?.document,
  /** @property {Object} classes All classes defined using {#Cls} are stored in this object, where the key is the
   * class short name and the value is the class.  */
  classes: {},
  regExp: {
    // Letters and Underline
    alpha: /^[a-zA-Z_]+$/,
    //Letters, Underline and number
    alphaNum: /^[a-zA-Z0-9_]+$/,
    // Regular expressions that reference regular keywords
    quote: /[.?*+\^$\[\]\\(){}|\-]/g
  },
  /**
   * Convert the value to a JSON string。
   * See {#%JSON.stringify|obj:JSON/stringify} for details.
   * Example: 
   *
   *     let text = Wb.encode({foo: "bar", abc: 123});
   *     // text value: '{"foo":"bar","abc":123}'
   *
   */
  encode: JSON.stringify,
  /**
   * Convert the string to a JavaScript value or object it describes.
   * See {#%JSON.parse|obj:JSON/parse} for details.
   * Example: 
   *
   *     let object = Wb.decode('{"foo":"bar","abc":123}');
   *     // object value: {foo: "bar", abc: 123}
   *
   */
  decode: JSON.parse,
  /**
   * Determine whether the value is an array.
   * See {#%Array.isArray|obj:Array/isArray} for details.
   * Example: 
   *
   *     let result = Wb.isArray([1, 2, 3]);
   *     // result: true
   *
   */
  isArray: Array.isArray,
  /**
   * Copies the values of all enumerable properties from one or more source objects to the target object.
   * See {#%Object.assign|obj:object/assign} for details.
   * Example: 
   * 
   *     let result = Wb.apply({foo: 'abc'}, {bar: 123});
   *     // result: {foo: 'abc', bar: 123}
   *     // equals to: let result = {...{foo: 'abc'}, ...{bar: 123}};
   *
   */
  apply: Object.assign,
  /** @property {String} - Uninterruptive space character, its ASCII code value is 160. */
  nbsp: '\u00A0',
  /**
   * Empty method.
   */
  emptyFn: function () { },
  /** @property {Object} - Empty object. */
  emptyObject: {},
  /** @property {Number} maxInt The maximum integer value. The value is {{2147483647}}. */
  maxInt: 2147483647,
  /**
   * Throw an exception with the specified message and code.
   * Example:
   *
   *     Wb.raise('error message');
   *     Wb.raise('save error.', 'file modified');
   *
   * @param {Object} msg Exception object or message.
   * @param {String} code Exception code.
   */
  raise(msg, code) {
    if (code)
      throw '##' + code + ':' + msg; // don't use new Error to avoid the error keyword
    else
      throw new Error(msg);
  },
  /**
   * Converts the value to a JSON string with the specified formatting.
   * @param {Object} object The object needs to be converted.
   * @return {String} Formatted JSON string.
   */
  encodePretty(object) {
    return Wb.encode(object, null, 2);
  },
  /**
   * Execute all destroy method in the object. All Objects, Arrays, Maps or Sets will be traversed, and the destroy
   * method contained in them will be executed.
   * Example: 
   *
   *     Wb.destroy([obj1, obj2, obj3]);
   *
   * @param {Object/Array/Set/Map/Wb.Base} object The object or traversable that needs to execute the destroy method.
   */
  destroy(object) {
    if (!object)
      return;
    if (Wb.isArray(object) || Wb.isSet(object) || Wb.isMap(object))
      object.forEach(item => Wb.destroyIf(item));
    else if (object instanceof Wb.Base)
      Wb.destroyIf(object);
    else if (Wb.isObject(object))
      Wb.each(object, (a, v) => Wb.destroyIf(v));
  },
  /**
   * Execute the destroy method of the object, if destroy method exists.
   * @param {Object} object The object.
   */
  destroyIf(object) {
    Wb.isFunction(object?.destroy) && object.destroy();
  },
  /**
   * Returns the object represented by the script. Please note that using this method will parse and execute
   * any script. Please ensure that the script source is reliable.
   * @param {String} script Script to be executed.
   * @return {Object} Object returned after executing the script.
   */
  eval(script) {
    return new Function('return ' + script)();
  },
  /** @property {Function} - Alias of compare method of Intl.Collator. */
  compare: new Intl.Collator().compare,
  /** @property {Function} - Case insensitive comparison method alias of Intl.Collator. */
  lowerCompare: new Intl.Collator(undefined, { sensitivity: 'accent' }).compare,
  /**
   * Compares characters, numbers, or date equivalents and returns the comparison results.
   * @param {Mix} a Source value for comparison
   * @param {Mix} b Dest value for comparison
   * @return {Number} Results of comparison.
   * -< 0: less than
   * -= 0: equal to
   * -> 0: greater than
   */
  mixCompare(a, b) {
    let i, j, c1, c2, v, nullA, nullB;

    nullA = a == null;
    nullB = b == null;
    if (nullA || nullB)
      return (nullA ? 0 : 1) - (nullB ? 0 : 1);
    if (Wb.isDate(a) && Wb.isDate(b))
      return a.getTime() - b.getTime();
    if (Wb.isNumber(a) && Wb.isNumber(b))
      return a - b;
    a = String(a);
    b = String(b);
    j = a.length;
    for (i = 0; i < j; i++) {
      c1 = a.charCodeAt(i);
      c2 = b.charCodeAt(i);
      if (isNaN(c2))
        return 1;
      if (c1 > 0 && c1 < 128 || c2 > 0 && c2 < 128) {
        if (c1 >= 97 && c1 <= 122)
          c1 -= 32;
        if (c2 >= 97 && c2 <= 122)
          c2 -= 32;
        v = c1 - c2;
      } else {
        v = Wb.lowerCompare(a.charAt(i), b.charAt(i));
      }
      if (v != 0)
        return v;
    }
    if (b.length > j)
      return -1;
    return 0;
  },
  /**
   * Returns a boolean indicating whether this object has the specified property as its own property.
   * @param {Object} object The object to be checked.
   * @param {String/Symbol} name The String name or Symbol of the property to test.
   * @return {Boolean} Returns true if the object has the specified property as own property; false otherwise.
   */
  hasProperty(object, name) {
    return HasOwnProperty.call(object, name);
  },
  /**
   * Create object instances by config object. If the instanced property of the object is true,
   * the object will be returned directly.
   * Example: 
   * 
   *     let object = Wb.create({cname: 'button'});
   * 
   * @param {Object} configs Configuration object used to create instances.
   * @return {Wb.Base} The newly created object instance.
   */
  create(configs) {
    if (!configs || configs.instanced)
      return configs;
    return Wb.Configurable.create(configs);
  },
  /**
   * Add the suffix "px" after the number value. If the value is non number, it will be returned directly.
   * @param {Object} val Any value, {{true}} means ".5em". {{false}} means 0.
   * @return {String/Object} The string after adding "px" or value itself.
   */
  px(val) {
    if (val === true)
      return '.5em';
    if (val === false)
      return '0';
    return Wb.isNumber(val) ? val + 'px' : val;
  },
  /**
   * Convert an array to an object. The object key is an array member, and the value is true。
   * Example: 
   *
   *     let object = Wb.toObject(['foo', 'bar']);
   *     // object: {foo: true, bar: true}
   *
   * @param {Array} array An array to be converted.
   * @return {Object} Converted object.
   */
  toObject(array) {
    let object = {};
    array.forEach(item => object[item] = true);
    return object;
  },
  /**
   * Convert the parameters in the object to URL encoded strings.
   * @param {Object} params The parameters object.
   * @return {String} URL encoded string.
   */
  encodeURL(params) {
    let join = false, result = '';
    Wb.each(params, (k, v) => {
      if (join)
        result += '&';
      else
        join = true;
      if (Wb.isObject(v) || Wb.isArray(v))
        v = Wb.encode(v);
      result += encodeURIComponent(k) + '=' + (v == null ? '' : encodeURIComponent(String(v)));
    });
    return result;
  },
  /**
   * Convert the name starting with "@" to the string corresponding to the name of the current region.
   * Example:
   *
   *     Wb.optText('@ok'); // returns "OK" in english
   *
   * @param {String} name The name.
   * @return {String} The string corresponding to the name or the string without "@" if not found.
   */
  optText(text) {
    if (text?.startsWith('@')) {
      text = text.substr(1);
      return Str[text] ?? text;
    } else return text;
  },
  /**
   * Convert the specified url to the sourceURL used to identify the script path.
   * @param {String} url URL path.
   * @return {String} Converted sourceURL.
   */
  getSourceURL(url) {
    return '//# sourceURL=' + (Wb.isServer ? SourceBuffer.sourceDomain :
      (location.origin + Wb.path + '/')) + url;
  },
  /**
   * Serialize the value. The difference from {#Wb.encode} is that it supports the serialization and deserialization
   * of date and function values. See {#Wb.deserialize} for deserialize.
   * @param {Object} value Value to serialize.
   * @return {String} Serialized text value.
   */
  serialize(value) {
    let s, addComma = false, doSerial;

    doSerial = v => {
      if (Wb.isString(v))
        return Wb.encode('!' + v);
      else if (Wb.isDate(v))
        return Wb.encode('@' + v.textValue);
      else if (Wb.isFunction(v))
        return Wb.encode('#' + v.toString());
      else if (Wb.isObject(v) || Wb.isArray(v))
        return Wb.serialize(v);
      else
        return Wb.encode(v);
    };
    if (Wb.isArray(value)) {
      s = '[';
      value.forEach(v => {
        if (v !== undefined) {
          if (addComma)
            s += ',';
          else
            addComma = true;
          s += doSerial(v);
        }
      });
      s += ']';
      return s;
    } else if (Wb.isObject(value)) {
      s = '{';
      Wb.each(value, (k, v) => {
        if (v !== undefined) {
          if (addComma)
            s += ',';
          else
            addComma = true;
          s += Wb.encode(k) + ':' + doSerial(v);
        }
      });
      s += '}';
      return s;
    } else {
      return doSerial(value);
    }
  },
  /**
   * Deserialize the text serialized with the {#Wb.serialize} method and restore it to the value before
   * serialization. See {#Wb.serialize} for serialize.
   * @param {String} text Serialized text value.
   * @param {Boolean} [noDecode] Whether to not execute {#Wb.decode} before deserialization.
   * @param {Boolean} [noFunction] Whether to not restore the function. For security reasons, this parameter is always
   * true on the server side.
   * @return {Object} The value restored after deserialization.
   */
  deserialize(text, noDecode, noFunction) {
    let value, doDeserial;

    if (Wb.isServer)
      noFunction = true;
    value = noDecode ? text : Wb.decode(text);
    doDeserial = v => {
      if (Wb.isString(v)) {
        let body = v.substr(1);
        if (v.startsWith('@'))
          return body.dateValue;
        else if (v.startsWith('#')) {
          if (!noFunction) {
            try {
              return Wb.parse(body);
            } catch (e) {
              // Parsing functions of {fn() {}} format
              try {
                let name = body.substr(0, body.indexOf('('));
                return Wb.parse('{' + body + '}')[name];
              } catch (e) {
                return e?.toString();
              }
            }
          }
        } else
          return body;
      } else if (Wb.isObject(v) || Wb.isArray(v)) {
        return Wb.deserialize(v, true);
      } else {
        return v;
      }
    };
    if (Wb.isArray(value))
      value.forEach((v, i) => { value[i] = doDeserial(v); });
    else if (Wb.isObject(value))
      Wb.each(value, (k, v) => { value[k] = doDeserial(v); });
    else
      value = doDeserial(value);
    return value;
  },
  /**
   * Converts the value to a string in the specified format. This method will directly call the {{format}} method
   * of {{value}}, and pass the format parameter.
   * Example: 
   *
   *     // Format Numbers
   *     let val = Wb.format(1234, '#,##0.00');
   *     //val: 1,234.00
   *     //--------------------------------------------------------------------------
   *     // Format characters
   *     val = Wb.format('Name: {name}, Sex: {sex}', {name: 'Jeena', sex:'Female'});
   *     //val: Name: Jeena, Sex: Female'
   *     val = Wb.format('foo {0} bar {1} and {0}', 'abc', 123);
   *     //val: foo abc bar 123 and abc
   *     //--------------------------------------------------------------------------
   *     // Format date
   *     val = Wb.format(new Date('2021-3-10'), 'y-MM-dd');
   *     //val: 2021-03-10
   *
   * @param {Object} value Value to format.
   * @param {String} format Format text.
   * @return {String} The formatted string value. Returns {{value}} directly if {{value}} is {{null}}}.
   */
  format(value, ...format) {
    return value == null ? value : value.format(...format);
  },
  /**
   * Convert the value to an array. If the value is an array, return the value directly. Otherwise, return the value
   * wrapped in the array.
   * 
   *     array = Wb.toArray('foo'); // array: ['foo']
   *     bar = ['foo'];
   *     array = Wb.toArray(bar); // array： bar
   * 
   * @param {Object} value Value to convert.
   * @return {Array} Converted array.
   */
  toArray(value) {
    return Wb.isArray(value) ? value : [value];
  },
  /**
   * Copy the values of the configs object to the target object, and define the properties of these values. The
   * rules defined are:
   * - The method name starts with "get$" is the getter method, and its property name is the name after the $.
   * - The method name starts with "set$" is the setter method, and its property name is the name after the $r.
   * - Others will be set directly to the target object.
   * @param {Object} object The target object.
   * @param {Object} [configs] Source configs object. Defaults means that the object is configs, and create a new object.
   * @return {Object} Target object itself.
   */
  define(object, configs) {
    let name, value, item, props = {};
    if (!configs) {
      configs = object;
      object = {};
    }
    for (name in configs) {
      value = configs[name];
      if (name.startsWith('get$')) {
        name = name.substr(4);
        item = props[name];
        if (item) {
          item.get = value;
        } else {
          item = props[name] = {
            configurable: true,
            get: value
          };
        }
      } else if (name.startsWith('set$')) {
        name = name.substr(4);
        item = props[name];
        if (item) {
          item.set = value;
        } else {
          item = props[name] = {
            configurable: true,
            set: value
          };
        }
      } else {
        object[name] = value;
      }
    }
    if (!Wb.isEmpty(props))
      Object.defineProperties(object, props);
    return object;
  },
  /**
   * Returns a random integer between 0 and maxInt, including 0 but excluding maxInt.
   * @param {Number} maxInt Limited maximum value.
   * @return {Number} Randomly generated number.
   */
  random(maxInt) {
    return Math.random() * maxInt | 0;
  },
  /**
   * Down traverses the object or array, executing the given method for each items.
   * Example: 
   *
   *     let items = [{param: 'one'}, {param: 'two', items: [{param: 'three'}]}];
   *     Wb.cascade(items, item => console.log(item.param));
   *     // output: one, two, three
   *     Wb.cascade(parentNode, node => console.log(node), 'childNodes');
   *     // Traverse all child nodes of the element
   *
   * @param {Object/Array} object The object or array to traverse.
   * @param {Function} fn Function to execute. If false is returned, the traversal will be interrupted. If null
   * is returned, the items under the current node will not be traversed.
   * @param {Object} fn.item Current item.
   * @param {Object} fn.parent Parent item.
   * @param {String} [itemsName] The property name of the child items. Defaults to "items".
   * @param {Object} [scope] fn {{this}} in function. Defaults to {{object}}.
   * @param {Boolean} [reverse] Whether to traverse sibling items in reverse.
   * @param {Boolean} [includeSelf] Whether to include the object itself when traversing.
   * @param {Object} [parent] Parent item.
   * @return {Boolean} Whether the traversal is completed. true completes and false interrupts.
   */
  cascade(object, fn, itemsName, scope, reverse, includeSelf, parent) {
    let items, result;

    itemsName = itemsName ?? 'items';
    scope ??= object;
    if (includeSelf) {
      result = fn.call(scope, object, parent);
      if (result === false)
        return false;
      else if (result === null)
        return true;
    }
    return Wb.doEach(object, item => {
      result = fn.call(scope, item, parent);
      if (result === false)
        return false;
      else if (result === null)
        return true;
      items = item[itemsName];
      if (items)
        return Wb.cascade(items, fn, itemsName, scope, reverse, false, item);
    }, scope, reverse);
  },
  /**
   * Up traverses the object or array, executing the given method for each items.
   * Example: 
   *
   *     let items = {param: 'one',parent: {param: 'two', parent: {param: 'three'}}};
   *     Wb.bubble(items, parent => console.log(parent.param));
   *     // output: one, two, three
   *     Wb.bubble(childNode, parent => console.log(parent), 'parentNode');
   *     // Traverse all parent nodes of the element
   *
   * @param {Object} object The object to traverse.
   * @param {Function} fn Function to execute. If false is returned, the traversal will be interrupted. 
   * @param {Object} fn.parent Current parent.
   * @param {String} [parentName] The property name of the parent items. Defaults to "parent".
   * @param {Object} [scope] {{this}} in function. Defaults to {{object}}.
   * @param {Boolean} [excludeSelf] Whether to exclude the object itself when traversing.
   * @return {Boolean} Whether the traversal is completed. true completes and false interrupts.
   */
  bubble(object, fn, parentName, scope, excludeSelf) {
    let parent;

    parentName = parentName ?? 'parent';
    scope ??= object;
    parent = excludeSelf ? object[parentName] : object;
    while (parent) {
      if (fn.call(scope, parent) === false) {
        return false;
      }
      parent = parent[parentName];
    }
    return true;
  },
  /**
   * “向下”遍历对象，查找满足指定条件的成员。
   * Example: 
   *
   *     let object = {param: 'two', items: [{param: 'three'}]};
   *     let items = [{param: 'one'}, object];
   *     console.log(Wb.down(items, item => item.param === 'two'));
   *
   * @param {Object} object 要遍历的对象。
   * @param {Function} fn 判断对象是否满足条件的方法，返回true满足，false不满足。
   * @param {Object} fn.item 正在处理的当前成员。
   * @param {Boolean} [queryAll] 是否查询所有匹配的成员，默认为查询首个匹配的成员。
   * @param {String} [itemsName] 下级成员的属性名称，默认为items。
   * @param {Object} [scope] fn内的this对象，默认为object本身。
   * @param {Boolean} [includeSelf] 遍历时是否包含对象本身，默认为false即排序对象本身。
   * @return {Object/Array} 如果查找单个，返回对象，未找到返回null；如果查找多个，返回对象组成的数组，未找到返回空数组。
   */
  down(object, fn, queryAll, itemsName, scope, includeSelf) {
    let result;

    scope ??= object;
    result = queryAll ? [] : null;
    Wb.cascade(object, item => {
      if (fn.call(scope, item)) {
        if (queryAll) {
          result.push(item);
        } else {
          result = item;
          return false;
        }
      }
    }, itemsName, true, false, includeSelf);
    return result;
  },
  /**
   * 向下遍历对象，查找满足指定条件的所有成员。相关方法请参考{#down}。
   * @param {Object} object 要遍历的对象。
   * @param {Function} fn 判断对象是否满足条件的方法，返回true满足，false不满足。
   * @param {Object} fn.item 正在处理的当前成员。
   * @param {String} [itemsName] 下级成员的属性名称，默认为items。
   * @param {Object} [scope] fn内的this对象，默认为object本身。
   * @param {Boolean} [includeSelf] 遍历时是否包含对象本身，默认为false即排序对象本身。
   * @return {Array} 返回对象组成的数组，未找到返回空数组。
   */
  downAll(object, fn, itemsName, scope, includeSelf) {
    return Wb.down(object, fn, true, itemsName, scope, includeSelf);
  },
  /**
   * 向上遍历对象，查找满足指定条件的成员。
   * Example: 
   *
   *     let object = {param: 'two', parent: {param: 'three'}};
   *     let items = {param: 'one', parent: object};
   *     console.log(Wb.up(items, parent => parent.param === 'two'));
   * 
   * @param {Object} object 要遍历的对象。
   * @param {Function} fn 判断对象是否满足条件的方法，返回true满足，false不满足。
   * @param {Object} fn.parent 正在处理的当前成员。
   * @param {Boolean} [queryAll] 是否查询所有匹配的成员，默认为查询首个匹配的成员。
   * @param {String} [parentName] 上级成员的属性名称，默认为parent。
   * @param {Object} [scope] fn内的this对象，默认为object本身。
   * @param {Boolean} [excludeSelf] 遍历时是否排除对象本身，默认为false即包含对象本身。
   * @return {Object/Array} 如果查找单个，返回对象，未找到返回null；如果查找多个，返回对象组成的数组，未找到返回空数组。
   */
  up(object, fn, queryAll, parentName, scope, excludeSelf) {
    let result;

    scope ??= this;
    result = queryAll ? [] : null;
    Wb.bubble(object, el => {
      if (fn.call(scope, el)) {
        if (queryAll) {
          result.push(el);
        } else {
          result = el;
          return false;
        }
      }
    }, parentName, true, excludeSelf);
    return result;
  },
  /**
   * 向上遍历对象，查找满足指定条件的所有成员。相关方法请参考{#up}。
   * @param {Object} object 要遍历的对象。
   * @param {Function} fn 判断对象是否满足条件的方法，返回true满足，false不满足。
   * @param {Object} fn.parent 正在处理的当前成员。
   * @param {String} [parentName] 上级成员的属性名称，默认为parent。
   * @param {Object} [scope] fn内的this对象，默认为object本身。
   * @param {Boolean} [excludeSelf] 遍历时是否排除对象本身，默认为false即包含对象本身。
   * @return {Array} 返回对象组成的数组，未找到返回空数组。
   */
  upAll(object, fn, parentName, scope, excludeSelf) {
    return Wb.up(object, fn, true, parentName, scope, excludeSelf);
  },
  /**
   * 查找对象中满足指定条件的首个成员名。
   * Example: 
   * 
   *     Wb.find({foo: 123, bar: 'abc'}, (k, v) => v === 'abc'); //输出"bar"
   * 
   * @param {Function} fn 查找每个成员时执行的方法。如果该方法返回true，当前成员名为查找到的值。
   * @param {String} fn.k 正在处理的成员名称。
   * @param {String} fn.v 正在处理的成员值。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @param {Boolean} [isAll] 是否查找全部。
   * @return {String/String[]} 如果查找单个，将返回查找到的成员名或undefined；如果查找多个，将返回成员名组成的数组。
   */
  find(object, fn, scope, isAll) {
    let found;

    scope ??= object;
    if (isAll)
      found = [];
    Wb.each(object, (k, v) => {
      if (fn.call(scope, k, v)) {
        if (isAll) {
          found.push(k);
        } else {
          found = k;
          return false;
        }
      }
    });
    return found;
  },
  /**
   * 筛选对象中满足指定条件的所有成员名。查找首个满足条件的成员请参考{#find}。
   * @param {Function} fn 查找每个成员时执行的方法。如果该方法返回true，当前成员名为查找到的值。
   * @param {String} fn.k 正在处理的成员名称。
   * @param {String} fn.v 正在处理的成员值。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @return {String[]} 所有查找到的成员名组成的数组，未找到返回空数组。
   */
  filter(object, fn, scope) {
    return Wb.find(object, fn, scope, true);
  },
  /**
   * 判断对象内是否存在满足某个条件的成员。详见 {#Wb.PT.objectSome} 方法。
   * Example: 
   * 
   *     Wb.some({foo: {name: 'Allen'}, bar: {name: 'Chen'}}, (k, v) => v.name == 'Chen'); //输出: true
   * 
   */
  some(object, ...args) {
    return Wb.PT.objectSome.apply(object, args);
  },
  /**
   * 判断对象内所有成员均满足某个条件。详见 {#Wb.PT.objectEvery} 方法。
   * Example: 
   * 
   *     Wb.every({foo: {name: 'Allen'}, bar: {name: 'Chen'}}, (k, v) => v.name == 'Chen'); //输出: false
   * 
   */
  every(object, ...args) {
    return Wb.PT.objectEvery.apply(object, args);
  },
  /**
   * 把数组内成员指定名称属性内的列表条目按顺序添加到数组中。
   * @param {Array} array 数组。
   * @param {Boolean} [clearItems] 是否清除items属性。设置为true将影响原数组内的数据。
   * @param {String} [name] 属性名称。默认为"items"。
   * @return {Array} 新生成的数组。
   */
  flatItems(array, clearItems, name) {
    let items = [];

    name ??= 'items';
    Wb.cascade(array, item => items.push(item), name);
    if (clearItems)
      items.forEach(item => delete item[name]);
    return items;
  },
  /**
   * 获取指定对象多个指定名称的成员值组成的数组。
   * @param {Object} object 获取的对象。
   * @param {String[]} names 名称列表。
   * @return {Array} 成员值按顺序组成的数组。
   */
  pluck(object, names) {
    let result = [];
    names.forEach(k => {
      result.push(object[k]);
    });
    return result;
  },
  /**
   * 把指定的对象转换为字符串后，再转换为HTML脚本。
   * @param {Object} object 转换的对象。
   * @param {Boolean} [singleLine] 是否显示为单行。如果指定为单行将把换行符转换为空格符。
   * @param {Boolean} [convertSpace] 是否把空格转换为单个"&nbsp"，Tab转换为多个"&nbsp"，换行符转换为<br>。
   * @return {String} 转换后的HTML脚本。如果对象值为null/undefined将返回空串。
   */
  toHTML(object, singleLine, convertSpace) {
    return object == null ? '' : object.toString().toHTML(singleLine, convertSpace);
  },
  /**
   * 把rgb表示的颜色转换为16进制表示的颜色。
   * @param {String} color rgb颜色字符串。
   * @return {String} 16进制颜色字符串。
   */
  rgbToHex(color) {
    let items = color.getPart('(', ')').splitTrim(), result = '#';

    items.forEach(item => {
      result += parseInt(item).toString(16).padStart(2, '0');
    });
    return result;
  },
  /**
   * 设置指定路径命名空间的值，如果该命名空间不存在则创建它，并把值赋给命名空间。获取命名空间请参考{#getNS}方法。
   * Example: 
   *
   *     let result = Wb.setNS('a.b.c', 123);
   *     //将创建一个全局成员a，其值为{b: {c: 123}}，result值为: 123
   *
   * @param {String} namespace 命名空间的路径。
   * @param {Object} [value] 设置的值。如果缺省该值，若原值已经存在则不设置值，否则设置值为{}。
   * @param {Object} [scope] 命名空间的起始指向对象，默认为globalThis。
   * @param {String} [separater] 路径中的每个名称之间的分隔符。默认为"."。
   * @return {Object} 命名空间指向的值。
   */
  setNS(namespace, value, scope, separater) {
    let i, j, name, nameList = namespace.split(separater || '.');
    scope ??= globalThis;
    j = nameList.length - 1;
    for (i = 0; i < j; i++) {
      name = nameList[i];
      if (scope[name] == null)
        scope[name] = {};
      scope = scope[name];
    }
    name = nameList[j];
    if (value === undefined) {
      if (scope[name] === undefined)
        scope[name] = {};
      return scope[name];
    } else {
      scope[name] = value;
      return value;
    }
  },
  /**
   * 获取指定命名空间指向的值。设置命名空间请参考{#setNS}方法。
   * Example: 
   *
   *     let object = {a: {b: {c: 0}}};
   *     let result = Wb.getNS('a.b.c', object);
   *     //result值为: 0
   *
   * @param {String} namespace 命名空间的路径。
   * @param {Object} [scope] 命名空间的起始指向对象，默认为globalThis。
   * @param {String} [separater] 路径中的每个名称之间的分隔符。默认为"."。
   * @return {Object} 命名空间指向的值。如果命名空间存在则返回指向的值，否则返回undefined。
   */
  getNS(namespace, scope, separater) {
    let i, j, name, value, nameList = namespace.split(separater || '.');
    value = scope ?? globalThis;
    j = nameList.length;
    for (i = 0; i < j; i++) {
      name = nameList[i];
      value = value[name];
      if (value === undefined)
        return undefined;
    }
    return value;
  },
  /**
   * 规范化路径。把路径中的"./"和"../"按其含义进行处理，并转换为最终路径。
   * @param {String} path 路径。
   * @return {String} 规范化后的路径。
   */
  normalizePath(path) {
    if (!path.includes('./'))
      return path;
    let normalPath = [];

    path.split('/').forEach(item => {
      if (item == '..')
        normalPath.pop();
      else if (item != '.')
        normalPath.push(item);
    });
    return normalPath.join('/');
  },
  /**
   * 获取路径中的目录部分路径。
   * Example:
   *
   *     Wb.getDirectory('aa/bb/cc') //输出：aa/bb/
   *     Wb.getDirectory('aa/bb/cc/') //输出：aa/bb/cc/
   *     Wb.getDirectory('aa') //输出：(空串)
   *
   * @param {String} path 路径。
   * @return {String} 目录部分路径。如果path为null或空返回空串。
   */
  getDirectory(path) {
    if (!path)
      return '';
    let p = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));

    if (p == -1)
      return '';
    else
      return path.substr(0, p + 1);
  },
  /**
   * 获取路径中的父目录路径。
   * Example:
   *
   *     Wb.getParentDirectory('aa/bb/cc') //输出：aa/bb/
   *     Wb.getParentDirectory('aa/bb/cc/') //输出：aa/bb/
   *     Wb.getParentDirectory('aa') //输出：(空串)
   *
   * @param {String} path 路径。
   * @return {String} 父目录路径。如果path为null或空返回空串。
   */
  getParentDirectory(path) {
    if (!path)
      return '';
    if (path.endsWith('/'))
      path = path.slice(0, -1);
    return Wb.getDirectory(path);
  },
  /**
   * 获取路径中的文件名。如果路径为空，或者以"/"或"\"结尾，将返回空串。
   * @param {String} path 文件路径。
   * @return {String} 文件名。如果path为null或空返回空串。
   */
  getFilename(path) {
    if (!path)
      return '';
    let p = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));

    if (p == -1)
      return path;
    else
      return path.substring(p + 1);
  },
  /**
   * 获取路径中的文件名的扩展名。
   * @param {String} path 文件路径。
   * @return {String} 扩展名。如果path为null或空返回空串。
   */
  getFileExt(path) {
    if (path) {
      let pos = path.lastIndexOf('.');
      if (pos != -1) {
        let ext = path.substring(pos + 1);
        if (ext.includes('/') || ext.includes('\\'))
          return '';
        else
          return ext;
      }
    }
    return '';
  },
  /**
   * 根据模块文件相对路径获取其url地址。
   * @param {String} path 模块文件相对路径。
   * @return {String} 模块文件url地址。
   */
  getModuleUrl(path) {
    if (path.startsWith('m?xwl='))
      return path;
    else if (path.endsWith('.xwl'))
      return 'm?xwl=' + path.slice(0, -4);
    else
      return path;
  },
  /**
   * 获取文件名对应文件类型的图标。
   * @param {String} filename 文件名。
   * @return {String} 图标名称。
   */
  getFileIcon(filename) {
    const iconMap = {
      xwl: 'module', 'js': 'file-js', 'javascript': 'file-js', css: 'file-css', sql: 'file-sql',
      png: 'file-png', jpg: 'file-jpg', jpeg: 'file-jpg', gif: 'gif', bmp: 'image', json: 'file-json',
      jsp: 'file-java', jar: 'file-java', html: 'file-html', htm: 'file-html', xml: 'file-xml', webp: 'image',
      java: 'file-java', txt: 'file-txt', doc: 'word', docx: 'word', xls: 'excel', xlsx: 'excel', pptx: 'ppt',
      ppt: 'ppt', mjs: 'mjs', zip: 'zip', pdf: 'pdf', mp3: 'mp3', mp4: 'mp4', py: 'python', r: 'r', flw: 'flow1'
    };
    return iconMap[Wb.getFileExt(filename)] ?? 'file'
  },
  /**
   * 获取文件名对应文件是否为图片文件。
   * @param {String} filename 文件名。
   * @return {Boolean} true是图片文件，false不是图片文件。
   */
  isImageFile(filename) {
    const types = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    return types.includes(Wb.getFileExt(filename));
  },
  /**
   * 获取路径中的不含扩展名的文件名。
   * @param {String} path 文件路径。
   * @return {String} 不含扩展名的文件名。如果path为null或空返回空串。
   */
  getNormalName(path) {
    let filename = Wb.getFilename(path), pos = filename.lastIndexOf('.');

    return pos == -1 ? filename : filename.substr(0, pos);
  },
  /**
   * 把value解析为boolean。'false', 'f', 'F', '0'和Falsy值返回false，其它均返回true。
   * @param {Object} value 需要解析的值。
   * @return {Boolean} 解析后的布尔值。
   */
  parseBool(value) {
    return !!value && value !== 'false' && value !== '0' && value != 'f' && value != 'F';
  },
  /**
   * 把指定格式的文本日期转换为日期值。日期格式请参考{#Date.format}方法。
   * Example: 
   *
   *     let result =  Wb.parseDate('2021-3-10 15:13:12.18', 'y-MM-dd HH:mm:ss.S');
   *     //result为对应的日期值;
   * 
   * @param {String} value 需要转换的文本日期。
   * @param {String} [fmt] 日期格式。默认如果value长度小于8为{#Date.ymFormat}；长度小于11且带":"为{#Date.timeFormat}，
   * 否则为{#Date.dateFormat}；长度其他值为{#Date.dateTimeFormat}。
   * @param {Boolean} [defaultNow] 未指定的年、月、日、时、分、秒和毫秒是否使用当前时间。null表示日为1其它为0，
   * false除时间为0外其余均使用当前时间，true除分、秒和毫秒为0外其余都使用当前时间。
   * @return {Date} 转换后的日期值，如果值无效或为空返回null。
   */
  parseDate(value, fmt, defaultNow) {
    if (!value)
      return null;
    if (!fmt) {
      let len = value.length;
      if (len < 8)
        fmt = Date.ymFormat;
      else if (len < 11)
        fmt = value.includes(':') ? Date.timeFormat : Date.dateFormat;
      else
        fmt = Date.dateTimeFormat;
      if (value.includes('/'))
        fmt = fmt.replaceAll('-', '/');
    }
    let date, sign, i, j, k, c, p, y, m, d, h, n, s, z, len = value.length;

    j = fmt.length;
    p = 0;
    for (i = 0; i < j; i++) {
      c = fmt.charAt(i);
      if (p >= len) {
        fmt = fmt.substr(i);
        //毫秒允许缺省
        if (fmt == '.S' || fmt == '.SSS')
          break;
        else
          return null;
      }
      switch (c) {
        case 'y':
          if (value.substr(p, 1) == '-') {
            sign = '-';
            p++;
          } else {
            sign = '';
          }
          if (fmt.substr(i, 4) === 'yyyy') {
            y = value.substr(p, 4);
            p += 4;
            i += 3;
          } else if (fmt.substr(i, 2) === 'yy') {
            y = '20' + value.substr(p, 2);
            p += 2;
            i++;
          } else {
            //y
            y = value.substr(p, 4);
            p += 4;
          }
          if (y.length != 4)
            return null;
          y = parseInt(sign + y);
          if (isNaN(y))
            return null;
          break;
        case 'M':
          if (fmt.charAt(i + 1) === 'M')
            i++;
          k = Wb.isDigit(value.substr(p + 1, 1)) ? 2 : 1;
          m = parseInt(value.substr(p, k)) - 1;
          if (isNaN(m) || m > 11 || m < 0)
            return null;
          p += k;
          break;
        case 'd':
          if (fmt.charAt(i + 1) === 'd')
            i++;
          k = Wb.isDigit(value.substr(p + 1, 1)) ? 2 : 1;
          d = parseInt(value.substr(p, k));
          if (isNaN(d) || d > 31 || d < 1)
            return null;
          p += k;
          break;
        case 'H':
          if (fmt.charAt(i + 1) === 'H')
            i++;
          k = Wb.isDigit(value.substr(p + 1, 1)) ? 2 : 1;
          h = parseInt(value.substr(p, k));
          if (isNaN(h) || h > 23 || h < 0)
            return null;
          p += k;
          break;
        case 'm':
          if (fmt.charAt(i + 1) === 'm')
            i++;
          k = Wb.isDigit(value.substr(p + 1, 1)) ? 2 : 1;
          n = parseInt(value.substr(p, k));
          if (isNaN(n) || n > 59 || n < 0)
            return null;
          p += k;
          break;
        case 's':
          if (fmt.charAt(i + 1) === 's')
            i++;
          k = Wb.isDigit(value.substr(p + 1, 1)) ? 2 : 1;
          s = parseInt(value.substr(p, k));
          if (isNaN(s) || s > 59 || s < 0)
            return null;
          p += k;
          break;
        case 'S':
          if (fmt.substr(i, 3) === 'SSS')
            i += 2;
          k = Wb.isDigit(value.substr(p + 1, 1)) ? 2 : 1;
          if (k === 2 && Wb.isDigit(value.substr(p + 2, 1)))
            k = 3;
          z = parseInt(value.substr(p, k).padEnd(3, '0'));
          if (isNaN(z) || z < 0)
            return null;
          p += k;
          break;
        default:
          if (value.charAt(p) != c)
            return null;
          p++;
      }
    }
    if (len != p)
      return null;
    if (defaultNow == null) {
      date = new Date(y ?? 1970, m ?? 0, d ?? 1, h ?? 0, n ?? 0, s ?? 0, z ?? 0);
    } else {
      let now = new Date();
      date = new Date(y ?? now.getFullYear(), m ?? now.getMonth(), d ?? now.getDate(),
        h ?? (defaultNow ? now.getHours() : 0), n ?? 0, s ?? 0, z ?? 0);
    }
    //年份0-99需要使该方法重设年份
    if (y > -1 && y < 100)
      date.setFullYear(y);
    if (!Wb.isServer) {
      let offset = Wb.configs.tzOffset;
      if (offset)
        date = date.addHour(-offset);
    }
    return date;
  },
  /**
   * 把指定格式的文本日期转换为日期值。同{#Wb.parseDate}的区别为如果value参数非null且无法解析为日期值时抛出异常。
   */
  tryParseDate(value, fmt, defaultNow) {
    let date = Wb.parseDate(value, fmt, defaultNow);
    if (value != null && !date)
      Wb.raise('"' + value + '" is not a valid date.');
    return date;
  },
  /**
   * 删除对象内指定名称的元素。
   * @param {Array} names 需要删除元素的名称列表。
   * @return {Object} 对象本身。
   */
  remove(object, names) {
    names.forEach(key => delete object[key]);
    return object;
  },
  /**
   * 复制所有目标对象中不存在的源对象中的值到目标对象。
   * Example: 
   *
   *     let result = Wb.applyIf({foo: 'abc'}, {foo: 'def', bar: 123});
   *     //result: {foo: 'abc', bar: 123}
   *
   * @param {Object} dest 复制到的目标对象。
   * @param {Object} source 被复制的源对象。
   * @return {Object} 目标对象本身。
   */
  applyIf(dest, source) {
    Wb.each(source, (k, v) => {
      if (!(k in dest))
        dest[k] = v;
    });
    return dest;
  },
  /**
   * 复制所有源对象中非null和undefined值到目标对象。
   * Example: 
   *
   *     let result = Wb.applyValue({foo: 'abc'}, {bar: 123, more: null});
   *     //result: {foo: 'abc', bar: 123}
   *
   * @param {Object} dest 复制到的目标对象。
   * @param {Object} source 被复制的源对象。
   * @return {Object} 目标对象本身。
   */
  applyValue(dest, source) {
    Wb.each(source, (k, v) => {
      if (v != null)
        dest[k] = v;
    });
    return dest;
  },
  /**
   * 复制源对象中指定名称的值到目标对象。
   * Example: 
   *
   *     let result = Wb.applyWith({foo: 'abc'}, {param1:'def', param2: 123},['param2']);
   *     //result: {foo: 'abc', param2: 123}
   *
   * @param {Object} dest 复制到的目标对象。
   * @param {Object} source 被复制的源对象。
   * @param {Array/String} names 源对象中需要被复制值的名称列表。如果为字符串，表示逗号分割的多个名称。
   * @return {Object} 目标对象本身。
   */
  applyWith(dest, source, names) {
    if (source) {
      if (Wb.isString(names))
        names = names.splitTrim();
      names.forEach(name => dest[name] = source[name]);
    }
    return dest;
  },
  /**
   * 复制所有源对象中指定名称的非null和undefined值到目标对象。
   * @param {Object} dest 复制到的目标对象。
   * @param {Object} source 被复制的源对象。
   * @param {Array} names 源对象中需要被复制值的名称列表。
   * @return {Object} 目标对象本身。
   */
  applyValueWith(dest, source, names) {
    let v;
    names.forEach(name => {
      v = source[name];
      if (v != null)
        dest[name] = v;
    });
    return dest;
  },
  /**
   * 复制源对象中指定名称之外的值到目标对象。
   * Example: 
   *
   *     let result = Wb.applyWithout({foo: 'abc'}, {param1:'def', param2: 123},['param2']);
   *     //result: {foo: 'abc', param1: 'def'}
   *
   * @param {Object} dest 复制到的目标对象。
   * @param {Object} source 被复制的源对象。
   * @param {Array} names 源对象中不需要被复制值的名称列表。
   * @return {Object} 目标对象本身。
   */
  applyWithout(dest, source, names) {
    Wb.each(source, (k, v) => {
      if (!names.includes(k))
        dest[k] = v;
    });
    return dest;
  },
  /**
   * 复制多个源对象中的所有值到目标对象，该方法同{#apply}方法的区别为相同名称的对象成员将合并。
   * Example: 
   *
   *     let foo = {a: {v1: 1, v2: 2}, b: 'abc'};
   *     let bar = {a: {v3: 3, v4: 4}, c: 'xyz'};
   *     let result = Wb.applyMerge(foo, bar);
   *     //result: {a: {v1: 1, v2: 2, v3: 3, v4: 4}, b: 'abc', c: 'xyz'};
   *
   * @param {Object} dest 复制到的目标对象。如果目标对象为null或undefined，将初始化为空对象{}。
   * @param {...Object} args 被复制的多个源对象列表。
   * @return {Object} 目标对象本身。
   */
  applyMerge(object, ...args) {
    let oldV;

    object ??= {};
    args.forEach(arg => {
      if (arg) {
        Wb.each(arg, (k, v) => {
          oldV = object[k];
          if (Wb.isObject(v) && Wb.isObject(oldV)) {
            Wb.applyMerge(oldV, v);
          } else {
            object[k] = v;
          }
        });
      }
    });
    return object;
  },
  /**
   * 复制对象中的所有值到一个新的对象。新创建的对象为一个浅复制的对象，对象内所有引用的值均不变。
   * 如果需要深度克隆一个对象，请使用{#clone}方法。
   * Example: 
   *
   *     let object = {foo: 'bar', obj: {val: 123}};
   *     let copyObject = Wb.copy(object);
   *     copyObject.foo = 'other'; //foo为新的副本
   *     copyObject.obj.val = 456; //copyObject.obj仍指向object.obj
   *     console.log(object);
   *     //输出: {foo: 'bar', obj: {val: 456}}
   *
   * @param {Object} source 被复制的源对象。
   * @return {Object} 浅复制后生成的新对象。
   */
  copy(source) {
    return Wb.apply({}, source);
  },
  /**
   * 克隆对象中的所有值到一个新的对象。新创建的对象为一个深克隆的对象，对象内所有的数组和JSON对象均生成新的副本。
   * Example: 
   *
   *     let object = {foo: 'bar', arr: [1, 2, 3]};
   *     let cloneObject = Wb.clone(object);
   *     cloneObject.foo = 'other';
   *     console.log(object);
   *     //输出: {foo: 'bar', arr: [1, 2, 3]}
   *
   * @param {Object} source 被克隆的源对象。
   * @return {Object} 深克隆后生成的新对象。
   */
  clone(item) {
    if (!item)
      return item;
    else if (Array.isArray(item)) {
      //数组
      let clone, i = item.length;
      clone = [];
      while (i--) {
        clone[i] = Wb.clone(item[i]);
      }
      return clone;
    } else if (Wb.isObject(item)) {
      //对象
      let clone;
      clone = {};
      Wb.each(item, (k, v) => { clone[k] = Wb.clone(v); });
      return clone;
    } else
      return item;
  },
  /**
   * 遍历对象中本身具有的可枚举的成员，并对每个被遍历的成员执行一次给定的方法。
   * Example: 
   * 
   *     let object = {foo: 123, bar: 'abc'};
   *     Wb.each(object, (k, v) => console.log(k, v));
   *     //输出: foo 123 bar abc
   * 
   * @param {Object} object 需要遍历的对象。
   * @param {Function} fn 遍历每个成员时执行的方法。如果方法返回false，将中断遍历。
   * @param {Object/String} fn.item 正在处理的当前成员。如果遍历对象此项为成员名。
   * @param {Object} fn.v 成员值，仅适用于遍历对象。
   * @param {Object} [scope] fn内的this对象，默认为遍历的对象本身。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  each(object, fn, scope) {
    if (!object) return true;
    return Wb.PT.each.call(object, fn, scope ?? object);
  },
  /**
   * 遍历对象中所有可枚举的成员，并对每个被遍历的成员执行一次给定的方法。首先查找对象是否具有each方法，如果有则使用
   * 该方法遍历；否则遍历对象本身具有的所有可枚举属性（不包含原型中的属性）。如果仅遍历对象本身具有的所有可枚举属性
   * 请使用{#Wb.each}方法。
   * @param {Object} object 需要遍历的对象。可以为{#Object}, {#Array}, {#Set}等所有可遍历的对象。
   * @param {Function} fn 遍历每个成员时执行的方法。如果方法返回false，将中断遍历。
   * @param {Object/String} fn.item 正在处理的当前成员。如果遍历对象此项为成员名。
   * @param {Object} fn.v 成员值，仅适用于遍历对象。
   * @param {Object} [scope] fn内的this对象，默认为遍历的对象本身。
   * @param {Boolean} [reverse] 是否逆向遍历，true逆向，false正向。仅适用于数组的遍历。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  doEach(object, fn, scope, reverse) {
    if (!object) return true;
    scope ??= object;
    if (Wb.isFunction(object.each))
      return object.each(fn, scope, reverse);
    else
      return Wb.PT.each.call(object, fn, scope);
  },
  /**
   * 标识数组中的多个参数值用于同名的多个参数提交，并返回新的数组。当提交一个数组值的参数时，如果使用此方法标识，
   * 将提交同名的多个参数，否则将使用{#Wb.encode}编码数组值。
   * @param {Array} array 数组。
   * @return {Array} 新的数组。
   */
  markParams(array) {
    array = array.copy();
    array.canIterable = true;
    return array;
  },
  /**
   * 判断指定字符串是否由字母和下划线组成。
   * @param {String} str 字符串。
   * @return {Boolean} true是，false否。
   */
  isAlpha(str) {
    return Wb.regExp.alpha.test(str);
  },
  /**
   * 判断指定字符串是否由字母、下划线和数字组成。
   * @param {String} str 字符串。
   * @return {Boolean} true是，false否。
   */
  isAlphaNum(str) {
    return Wb.regExp.alphaNum.test(str);
  },
  /**
   * 判断值是否为JavaScript对象。
   * Example: 
   * 
   *     Wb.isObject({foo: 'bar'}); //true
   *     Wb.isObject(new Object()); //true
   *     Wb.isObject(treeComp); //true
   *     Wb.isObject('abc'); //false
   *     Wb.isObject(123); //false
   * 
   * @param {Object} value 需要判断的值。
   * @return {Boolean} true是，false否。
   */
  isObject(value) {
    return toString.call(value) === '[object Object]';
  },
  /**
   * 判断值是否为Map。
   * @param {Object} value 需要判断的值。
   * @return {Boolean} 如果值是Map返回true，否则返回false。
   */
  isMap(value) {
    return value instanceof Map;
  },
  /**
   * 判断值是否为Set。
   * @param {Object} value 需要判断的值。
   * @return {Boolean} 如果值是Set返回true，否则返回false。
   */
  isSet(value) {
    return value instanceof Set;
  },
  /**
   * 判断值是否为字符串。
   * Example: 
   * 
   *     Wb.isString('foo'); //true
   *     Wb.isString(123); //false
   * 
   * @param {Object} value 需要判断的值。
   * @return {Boolean} 如果值是字符串返回true，否则返回false。
   */
  isString(value) {
    return typeof value === 'string';
  },
  /**
   * 判断值是否为狭义的原始类型，即String, Number和Boolean类型。不包含BigInt, Symbol, null, undefined。
   * @param {Object} value 需要判断的值。
   * @return {Boolean} 如果值是原始类型返回true，否则返回false。
   */
  isPrimitive(value) {
    let type = typeof value;

    return type == 'string' || type == 'number' || type == 'boolean';
  },
  /**
   * 判断值是否为JavaScript方法。
   * @param {Object} value 需要判断的值。
   * @return {Boolean} 如果值是 JavaScript 方法返回true，否则返回false。
   */
  isFunction(value) {
    return typeof value === 'function';
  },
  /**
   * 判断值是否为数值。
   * @param {Object} value 需要判断的值。
   * @return {Boolean} 如果值是数字返回true，否则返回false。
   */
  isNumber(value) {
    return typeof value === 'number';
  },
  /**
   * 判断值是否为数字或表示数值的字符串。
   * Example: 
   * 
   *     Wb.isNumeric('123.4'); //true
   *     Wb.isNumeric('1a3'); //false
   * 
   * @param {Object} value 需要判断的值。
   * @return {Boolean} 数字或表示数值的字符串返回true，否则返回false。
   */
  isNumeric(value) {
    return Wb.isNumber(value) || !isNaN(parseFloat(value)) && isFinite(value);
  },
  /**
   * 判断字符是否为0-9之间的数字。
   * @param {String} ch 判断的字符。
   * @return {Boolean} true数字，false非数字。
   */
  isDigit(ch) {
    return ch >= '0' && ch <= '9';
  },
  /**
   * 判断值是否为一个日期值。
   * Example: 
   * 
   *     Wb.isDate(new Date()); //true
   *     Wb.isDate(123); //false
   * 
   * @param {Object} value 需要判断的值。
   * @return {Boolean} true是，false否。
   */
  isDate(value) {
    return toString.call(value) === '[object Date]';
  },
  /**
   * 判断值是否为布尔值。
   * @param {Object} value 需要判断的值。
   * @return {Boolean} 如果值是布尔值返回true，否则返回false。
   */
  isBoolean(value) {
    return typeof value === 'boolean';
  },
  /**
   * 判断值是否可遍历。
   * @param {Object} value 需要判断的值。
   * @param {Boolean} particular true判断除String和未包含canIterable属性的Array外的可遍历类型，false判断全部可遍历类型。
   * @return {Boolean} 如果值可遍历返回true，否则返回false。
   */
  isIterable(value, particular) {
    if (particular && (Wb.isString(value) || Wb.isArray(value) && !value.canIterable))
      return false;
    return value && typeof value[Symbol.iterator] === 'function';
  },
  /**
   * 判断对象是否类数组，即可按数组进行处理的对象。
   * @param {Object} value 判断的对象。
   * @return {Boolean} 所有{#Array}, {#Set}或包含"xLikeArray"属性为true的对象返回true，否则返回false。
   */
  likeArray(value) {
    return value?.xLikeArray;
  },
  /**
   * 把可遍历方法包装为一个可按数组进行处理的对象。
   * @param {Function} forEach 类数组的forEach方法。
   * @param {Object} .fn 遍历每个条目时执行的方法。
   * @param {Object} ..item 当前条目。
   * @param {Number} ..index 当前索引。  
   * @return {Object} 可遍历对象。
   */
  wrapArray(forEach) {
    return { length: 1, xLikeArray: true, forEach };
  },
  /**
   * 判断值是否为空值，空值是指值为null, undefined, '', 空数组, 空对象和其它length属性为0的对象。
   * Example: 
   * 
   *     Wb.isEmpty(''); //true
   *     Wb.isEmpty([]); //true
   *     Wb.isEmpty({}); //true
   *     Wb.isEmpty(null); //true
   *     Wb.isEmpty(0); //false
   * 
   * @param {Object} value 需要判断的值。
   * @return {Boolean} 如果值是空值返回true，否则返回false。
   */
  isEmpty(value) {
    return value == null || value.length === 0 || Wb.isObject(value) && !Object.keys(value).length;
  },
  /**
   * 连接多个数组并返回连接后的数组。
   * @param {...Array} arrays 连接的数组。
   * @return {Array} 连接后的数组。
   */
  concat(...arrays) {
    let arr = [];

    arrays.forEach(item => {
      if (item)
        arr = arr.concat(item)
    });
    return arr;
  },
  /**
   * 查找对象中首个具有指定值的键名称。
   * Example: 
   * 
   *     Wb.findKey({a: 123}, 123); // "a"
   * 
   * @param {Object} value 查找的值。
   * @return {String} 找到的键名称。如果未找到返回null。
   */
  findKey(object, value) {
    return Wb.find(object, (k, v) => v == value);
  },
  /**
   * 获取对象自有属性的数量。
   * @param {Object} object 对象。
   * @return {Number} 属性数量。
   */
  getSize(object) {
    return Object.keys(object).length;
  },
  /**
   * 把值转换为字符串，如果值为null或undefined返回空串。
   * @param {Object} value 需要转换的值。
   * @return {String} 转换后的字符串值。
   */
  opt(value) {
    return value == null ? '' : value.toString();
  },
  /**
   * 在值开始处重复填补指定字符串，使填补后的字符串达到某个长度。
   * Example: 
   * 
   *     Wb.padStart(9, 3, 0); //输出: "009"
   *     Wb.padStart(9, 6, 'ab'); //输出: "ababa9"
   * 
   * @param {Object} value 需要填补字符串的值。
   * @param {Number} size 填补后值的长度。
   * @param {Object} padString 填补的值。
   * @return {String} 填补字符串后的值。
   */
  padStart(value, size, padString) {
    return String(value).padStart(size, padString);
  },
  /**
   * 在值结尾处重复填补指定字符串，使填补后的字符串达到某个长度。
   * Example: 
   * 
   *     Wb.padEnd(9, 3, 0); //输出: "900"
   *     Wb.padEnd(9, 6, 'ab'); //输出: "9ababa"
   * 
   * @param {Object} value 需要填补字符串的值。
   * @param {Number} size 填补后值的长度。
   * @param {Object} padString 填补的值。
   * @return {String} 填补字符串后的值。
   */
  padEnd(value, size, padString) {
    return String(value).padEnd(size, padString);
  }
});
/**
 * 类管理器。当定义一个类并把引用添加到Cls[name]时，类管理器将把类引用添加到name指向的命名空间，
 * 并把name设置到类的fullName属性。如果类定义有名称时将把名称添加到Wb.classes，可以通过该名称找到类对象。\
 * 如果非mixin的类存在protos属性，将把protos对象的所有成员复制到类的原型中。
 * 如下的方法定义一个类: 
 * 
 *     Cls['Wb.View'] = class view extends Wb.mixin.View(Wb.Panel) {
 *     }
 * 
 * 其中，{{Wb.View}}为类全名，{{view}}为类的简名，{{Wb.mixin.View}}为mixin，{{Wb.Panel}}为父类。
 * @class Cls
 * @singleton
 */
globalThis.Cls = new Proxy({}, {
  set(target, prop, value) {
    let proto, cname = value.name;

    value.fullName = prop;
    Wb.setNS(prop, value);
    target[prop] = value;
    if (cname)
      Wb.classes[cname] = value;
    //把静态成员protos中的属性设置到原型
    proto = value.prototype;
    if (proto) {
      if (Wb.hasProperty(value, 'protos')) {
        Wb.apply(proto, value.protos);
        value.protos = undefined;
      }
      proto.cname = cname;
    }
    return true;
  }
});
/**
 * JavaScript的Object类。关于Object的更多说明请访问{#%Object}。
 * @class Object
 */
/**
 * JavaScript的Boolean类。关于Boolean的更多说明请访问{#%Boolean}。
 * @class Boolean
 */
/**
 * JavaScript的Promise类。关于Promise的更多说明请访问{#%Promise}。
 * @class Promise
 */
/**
 * JavaScript的正则表达式类。关于RegExp的更多说明请访问{#%RegExp}。
 * @class RegExp
 */
/**
 * 通用的原型方法类。这些原型方法可以应用于Array, Set和Map等类中。
 */
Cls['Wb.PT'] = class PT {
  /**
   * 遍历对象本身具有的可枚举属性成员，并对每个被遍历的成员执行一次给定的方法。
   * @param {Function} fn 遍历每个成员时执行的方法。如果方法返回false，将中断遍历。
   * @param {String} fn.key 正在处理的当前成员名称。
   * @param {String} fn.value 正在处理的当前成员值。
   * @param {Object} [scope] fn内的this对象，默认为遍历的对象本身。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  static each(fn, scope) {
    let keys, key, i, j;

    scope ??= this;
    keys = Object.keys(this);
    j = keys.length;
    for (i = 0; i < j; i++) {
      key = keys[i];
      if (fn.call(scope, key, this[key]) === false)
        return false;
    }
    return true;
  }
  /**
   * 类数组对象的遍历方法，遍历数组中的所有元素，对每个元素执行一次给定的方法。
   * 该方法同forEach方法的区别为可以通过返回false中断遍历，并且可以逆向进行遍历。
   * @param {Function} fn 遍历每个元素时执行的方法。如果方法返回false，将中断遍历。
   * @param {String} fn.item 数组中正在处理的当前元素。
   * @param {String} fn.index 数组中正在处理的当前元素的索引。
   * @param {Object} [scope] fn内的this对象，默认为遍历的对象本身。
   * @param {Boolean} [reverse] 是否逆向遍历，true逆向，false正向。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  static arrayEach(fn, scope, reverse) {
    let i, j = this.length;
    scope ??= this;
    if (reverse) {
      for (i = j - 1; i > -1; i--) {
        if (fn.call(scope, this[i], i) === false) {
          return false;
        }
      }
    } else {
      for (i = 0; i < j; i++) {
        if (fn.call(scope, this[i], i) === false) {
          return false;
        }
      }
    }
    return true;
  }
  /**
   * 获取类数组列表移除指定列表所有条目后的数组。
   * @param {Array/Set} array 比较的列表。
   * @return {Array} 移除条目后的数组。如果array为null直接返回当前数组本身。
   */
  static diff(array) {
    if (array)
      return this.filter(item => !array.includes(item));
    else
      return this;
  }
  /**
   * 获取类数组列表和指定列表都具有的条目组成的数组。
   * @param {Array/Set} array 比较的列表。
   * @return {Array} 共有条目组成的数组。
   */
  static intersect(array) {
    return this.filter(item => array.includes(item));
  }
  /**
   * 从可枚举对象的每个项中提取指定名称属性值。
   * @param {String} name 提取的属性名称。
   * @return {Array} 指定属性值组成的数组。
   */
  static pluck(name) {
    let result = [];

    this.each(item => result.push(item[name]));
    return result;
  }
  /**
   * 可枚举对象的遍历方法，遍历对象中所有元素。遍历的方法传递单个参数。
   * @param {Function} fn 遍历每个元素时执行的方法。如果方法返回false，将中断遍历。
   * @param {String} fn.item 正在处理的当前元素。
   * @param {String} fn.index 正在处理的当前元素的索引。
   * @param {Object} [scope] fn内的this对象，默认为遍历的对象本身。
   * @param {Boolean} [reverse] 是否逆向遍历，true逆向，false正向。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  static iteratorEach(fn, scope, reverse) {
    let me = this;

    scope ??= me;
    if (reverse) {
      let i, j;
      me = [...me];
      j = me.length;
      for (i = j - 1; i > -1; i--) {
        if (fn.call(scope, me[i], i) === false) {
          return false;
        }
      }
    } else {
      let item, i = 0;
      for (item of me) {
        if (fn.call(scope, item, i++) === false) {
          return false;
        }
      }
    }
    return true;
  }
  /**
   * 可枚举对象的遍历方法，遍历对象中所有元素。遍历的方法传递2个参数。
   * @param {Function} fn 遍历每个元素时执行的方法。如果方法返回false，将中断遍历。
   * @param {String} fn.value1 正在处理的当前元素作为数组的第1个参数。
   * @param {String} fn.value2 正在处理的当前元素作为数组的第2个参数。
   * @param {Object} [scope] fn内的this对象，默认为遍历的对象本身。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  static iteratorEach2P(fn, scope) {
    let item;
    scope ??= this;
    for (item of this) {
      if (fn.call(scope, item[0], item[1]) === false) {
        return false;
      }
    }
    return true;
  }
  /**
   * 可枚举对象的查找方法。查找的方法仅传递单个参数。
   * @param {Function} fn 查找每个元素时执行的方法。如果该方法返回true，当前元素为查找到的值，整个方法将返回该值并中断遍历。
   * @param {String} fn.item 正在处理的当前元素。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @return {Object} 如果值被查找到将返回该值，否则返回undefined。
   */
  static iteratorFind(fn, scope) {
    let item;

    scope ??= this;
    for (item of this) {
      if (fn.call(scope, item)) {
        return item;
      }
    }
    return undefined;
  }
  /**
   * 可枚举对象的筛选多个元素的方法。查找的方法仅传递单个参数。
   * @param {Function} fn 查找每个元素时执行的方法。如果该方法返回true，当前元素为查找到的值。
   * @param {String} fn.item 正在处理的当前元素。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @return {Array} 找到的元素组成的数组。
   */
  static iteratorFilter(fn, scope) {
    let item, items = [];

    scope ??= this;
    for (item of this) {
      if (fn.call(scope, item)) {
        items.push(item);
      }
    }
    return items;
  }
  /**
   * 可枚举对象的查找方法。查找的方法传递2个参数。
   * @param {Function} fn 查找每个元素时执行的方法。如果该方法返回true，当前元素为查找到的值，整个方法将返回该值并中断遍历。
   * @param {String} fn.value1 正在处理的当前元素作为数组的第1个参数。
   * @param {String} fn.value2 正在处理的当前元素作为数组的第2个参数。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @return {Object} 如果值被查找到将返回该值，否则返回undefined。
   */
  static iteratorFind2P(fn, scope) {
    let item;

    scope ??= this;
    for (item of this) {
      if (fn.call(scope, item[0], item[1])) {
        return item;
      }
    }
    return undefined;
  }
  /**
   * 可枚举对象的多个元素查找方法。查找的方法传递2个参数。
   * @param {Function} fn 查找每个元素时执行的方法。如果该方法返回true，当前元素为查找到的值。
   * @param {String} fn.value1 正在处理的当前元素作为数组的第1个参数。
   * @param {String} fn.value2 正在处理的当前元素作为数组的第2个参数。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @return {Object} 找到的元素组成的数组。
   */
  static iteratorFilter2p(fn, scope) {
    let item, items = [];

    scope ??= this;
    for (item of this) {
      if (fn.call(scope, item[0], item[1])) {
        items.push(item);
      }
    }
    return items;
  }
  /**
   * 按指定的方法进行遍历并判断是否存在满足某个条件的元素。
   * @param {Function} eachFn 遍历的方法。
   * @param {Function} fn 测试元素是否满足条件的方法，返回true表示满足条件，返回false表示不满足条件。\
   * 方法内的参数见eachFn方法。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @param {...Object} [eachParams] 传递到eachFn方法内除fn,scope之外的参数。
   * @return {Boolean} 只要有一个元素满足测试的条件返回true，否则返回false。
   */
  static doSome(eachFn, fn, scope, ...eachParams) {
    let foundTrue = false;

    scope ??= this;
    eachFn.call(this, (...args) => {
      if (fn.apply(scope, args)) {
        foundTrue = true;
        return false;
      }
    }, scope, ...eachParams);
    return foundTrue;
  }
  /**
   * 按指定的方法进行遍历并判断所有元素是否均满足某个条件。
   * @param {Function} eachFn 遍历的方法。
   * @param {Function} fn 测试元素是否满足条件的方法，返回true表示满足条件，返回false表示不满足条件。\
   * 方法内的参数见eachFn方法。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @param {...Object} [eachParams] 传递到eachFn方法内除fn,scope之外的参数。
   * @return {Boolean} 所有元素满足测试的条件返回true，否则返回false。
   */
  static doEvery(eachFn, fn, scope, ...eachParams) {
    let foundFalse = false;

    scope ??= this;
    eachFn.call(this, (...args) => {
      if (!fn.apply(scope, args)) {
        foundFalse = true;
        return false;
      }
    }, scope, ...eachParams);
    return !foundFalse;
  }
  /**
   * 按被遍历对象的each方法进行遍历并判断是否存在满足某个条件的元素。
   * @param {Function} fn 测试元素是否满足条件的方法，返回true表示满足条件，返回false表示不满足条件。\
   * 方法内的参数见遍历对象的each方法。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @param {...Object} [eachParams] 传递到each方法内除fn,scope之外的参数。
   * @return {Object} 只要有一个元素满足测试的条件返回true，否则返回false。空对象返回false。
   */
  static some(...args) {
    return Wb.PT.doSome.call(this, this.each, ...args);
  }
  /**
   * 遍历对象并判断是否存在满足某个条件的元素。
   * @param {Function} fn 测试元素是否满足条件的方法，返回true表示满足条件，返回false表示不满足条件。
   * 方法内的参数见{#Wb.PT.each}方法。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @param {...Object} [eachParams] 传递到each方法内除fn,scope之外的参数。
   * @return {Object} 只要有一个元素满足测试的条件返回true，否则返回false。空对象返回false。
   */
  static objectSome(...args) {
    return Wb.PT.doSome.call(this, Wb.PT.each, ...args);
  }
  /**
   * 按对象的each方法进行遍历并判断所有元素是否均满足某个条件。
   * @param {Function} fn 测试元素是否满足条件的方法，返回true表示满足条件，返回false表示不满足条件。
   * 方法内的参数见each方法。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @param {...Object} [eachParams] 传递到each方法内除fn,scope之外的参数。
   * @return {Object} 所有元素满足测试的条件返回true，否则返回false。空对象返回true。
   */
  static every(...args) {
    return Wb.PT.doEvery.call(this, this.each, ...args);
  }
  /**
   * 遍历对象并判断所有元素是否均满足某个条件。
   * @param {Function} fn 测试元素是否满足条件的方法，返回true表示满足条件，返回false表示不满足条件。
   * 方法内的参数见{#Wb.PT.each}方法。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @param {...Object} [eachParams] 传递到each方法内除fn,scope之外的参数。
   * @return {Object} 所有元素满足测试的条件返回true，否则返回false。空对象返回true。
   */
  static objectEvery(...args) {
    return Wb.PT.doEvery.call(this, Wb.PT.each, ...args);
  }
  /**
   * 按对象的bubble方法进行遍历并判断是否存在满足某个条件的元素。
   * @param {Function} fn 测试元素是否满足条件的方法，返回true表示满足条件，返回false表示不满足条件。\
   * 方法内的参数见bubble方法。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @param {...Object} [eachParams] 传递到bubble方法内除fn,scope之外的参数。
   * @return {Boolean} 只要有一个元素满足测试的条件返回true，否则返回false。
   */
  static bubbleSome(...args) {
    return Wb.PT.doSome.call(this, this.bubble, ...args);
  }
  /**
   * 按对象的bubble方法进行遍历并判断所有元素是否均满足某个条件。
   * @param {Function} fn 测试元素是否满足条件的方法，返回true表示满足条件，返回false表示不满足条件。\
   * 方法内的参数见bubble方法。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @param {...Object} [eachParams] 传递到bubble方法内除fn,scope之外的参数。
   * @return {Boolean} 所有元素满足测试的条件返回true，否则返回false。
   */
  static bubbleEvery(...args) {
    return Wb.PT.doEvery.call(this, this.bubble, ...args);
  }
  /**
   * 按对象的cascade方法进行遍历并判断是否存在满足某个条件的元素。
   * @param {Function} fn 测试元素是否满足条件的方法，返回true表示满足条件，返回false表示不满足条件。\
   * 方法内的参数见cascade法。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @param {...Object} [eachParams] 传递到cascade方法内除fn, scope之外的参数。
   * @return {Boolean} 只要有一个元素满足测试的条件返回true，否则返回false。
   */
  static cascadeSome(...args) {
    return Wb.PT.doSome.call(this, this.cascade, ...args);
  }
  /**
   * 按对象的cascade方法进行遍历并判断所有元素是否均满足某个条件。
   * @param {Function} fn 测试元素是否满足条件的方法，返回true表示满足条件，返回false表示不满足条件。\
   * 方法内的参数见cascade方法。
   * @param {Object} [scope] fn内的this对象，默认为对象本身。
   * @param {...Object} [eachParams] 传递到cascade方法内除fn,scope之外的参数。
   * @return {Boolean} 所有元素满足测试的条件返回true，否则返回false。
   */
  static cascadeEvery(...args) {
    return Wb.PT.doEvery.call(this, this.cascade, ...args);
  }
}
/**
 * 混合类型，具有多种可能的数据类型。
 * @class Mix
 */
/**
 * 表达式类型。
 * @class Express
 */
/**
 * 多行文本类，同String。更多信息请参考{#String}。
 * @class TextString
 */
/**
 * 颜色文本类，表示通过文本表示的颜色。同String。更多信息请参考{#String}。
 * @class ColorString
 */
/**
 * 时间类，表示时间类型。同Date。更多信息请参考{#Date}。
 * @class Time
 */
/**
 * 日期时间类，表示时期和时间类型。同Date。更多信息请参考{#Date}。
 * @class DateTime
 */
/**
 * 年月类，表示年和月类型。同Date。更多信息请参考{#Date}。
 * @class YearMonth
 */
/**
 * 枚举类，通常表示几种固定可能的取值。
 * @class Enum
 */
/**
 * 指定文件相对路径的文本类，同String。更多信息请参考{#String}。
 * @class PathString
 */
/**
 * String的扩展类。关于String的更多说明请访问{#%String}。
 * @class String
 */
Wb.apply(String.prototype, {
  /**
   * String.prototype.includes的别名。
   */
  contains: String.prototype.includes,
  /**
   * 获取指定的字符串出现的次数。
   * Example: 
   * 
   *     'foo bar foo'.occur('foo'); //输出: 2
   * 
   * @param {String} str 检测的字符串。
   * @return {Number} 出现的次数。
   */
  occur(str) {
    let count = 0,
      len = str.length,
      pos = -len;
    while ((pos = this.indexOf(str, pos + len)) != -1)
      count++;
    return count;
  },
  /**
   * 替换当前文本中使用_$name$_语法引用的值，值取自指定对象。
   * @param {Object} params 存放值的对象。
   * @return {String} 替换值后的文本。
   */
  replaceParams(params) {
    let text = this, start = 0, startPos = text.indexOf('_$', start), endPos = text.indexOf('$_', startPos + 2);

    if (startPos > -1 && endPos > -1) {
      let paramName, paramValue, result = '';

      params ??= {};
      while (startPos > -1 && endPos > startPos) {
        paramName = text.substring(startPos + 2, endPos);
        paramValue = params[paramName];
        result += text.substring(start, startPos);
        if (paramValue != null)
          result += String(paramValue);
        start = endPos + 2;
        startPos = text.indexOf('_$', start);
        endPos = text.indexOf('$_', startPos + 2);
      }
      result += text.substr(start);
      return result;
    } else
      return text;
  },
  /**
   * 在以"\n"分隔的每行字符串前加指定字符串的前缀。
   * @param {String} prefix 前缀。
   * @return {String} 添加前缀后的字符串。
   */
  addPrefix(prefix) {
    let result = [];
    this.split('\n').forEach(line => {
      result.push(prefix + line);
    });
    return result.join('\n');
  },
  /**
   * 把当前字符串转换为HTML脚本。
   * @param {Boolean} [singleLine] 是否显示为单行。如果指定为单行将把换行符转换为空格符。
   * @param {Boolean} [convertSpace] 是否把空格转换为单个"&nbsp"，Tab转换为多个"&nbsp"，换行符转换为<br>。
   * @return {String} 转换后的HTML脚本。
   */
  toHTML(singleLine, convertSpace) {
    let me = this, i, j = me.length, result = '', c;

    for (i = 0; i < j; i++) {
      c = me.charAt(i);
      switch (c) {
        case ' ':
          result += convertSpace ? '&nbsp;' : c;
          break;
        case '"':
          result += '&quot;';
          break;
        case "'":
          result += '&#39;';
          break;
        case '<':
          result += '&lt;';
          break;
        case '>':
          result += '&gt;';
          break;
        case '&':
          result += '&amp;';
          break;
        case '\n':
          if (singleLine)
            result += convertSpace ? '&nbsp;' : ' ';
          else
            result += convertSpace ? '<br>' : c;
          break;
        case '\r':
          break;
        case '\t':
          result += convertSpace ? '&nbsp;&nbsp;&nbsp;&nbsp;' : c;
          break;
        default:
          result += c;
      }
    }
    return result;
  },
  /**
   * 按指定分隔符分隔字符串，并对分隔后的字符串执行trim操作。
   * @param {String} [splitter] 分割符。默认为逗号。
   * @return {Array} 分隔后的字符串列表。
   */
  splitTrim(splitter = ',') {
    let arr = this.split(splitter), result = [];
    arr.forEach(item => {
      result.push(item.trim());
    });
    return result;
  },
  /**
   * 按驼峰命名法对每个关键字进行分隔，并返回转换为小写后的字符串列表。
   * @return {Array} 分隔后的字符串列表。
   */
  camelCaseSplit() {
    let me = this, result = [], pos = 0, ch, i, j = me.length;

    for (i = 0; i < j; i++) {
      ch = me.charAt(i);
      if (ch >= 'A' && ch <= 'Z') {
        result.push(me.substring(pos, i).toLowerCase());
        pos = i;
      }
    }
    result.push(me.substr(pos).toLowerCase());
    return result;
  },
  /**
   * 获取省略字符串，当字符串超出指定最大长度后，末尾使用"..."表示。
   * @param {Number} [maxLength] 最大长度。默认为200。
   * @return {String} 省略后的字符串。
   */
  ellipsis(maxLength) {
    maxLength ??= 200;
    if (this.length > maxLength)
      return this.substr(0, maxLength) + '...';
    else
      return this;
  },
  /**
   * 获取用于显示目的的省略字符串，使用该方法后将对字符串作如下处理：
   * 1、首尾去掉空串；
   * 2、获取指定长度的省略字符串；
   * 3、把换行符替换为空格。
   * @param {Number} [maxLength] 最大长度。默认为200。
   * @return {String} 省略后的字符串。
   */
  ellipsisLine(maxLength) {
    return this.trimLeft().ellipsis(maxLength).trimRight().replaceAll('\n', ' ');
  },
  /**
   * 判断当前字符串同指定字符串是否完全相等。
   * @param {String} str 比较的字符串。
   * @return {Boolean} true相等，false不相等。
   */
  equals(str) {
    return this == str;
  },
  /**
   * 忽略大小写，判断当前字符串同指定字符串是否完全相等。
   * @param {String} str 比较的字符串。
   * @return {Boolean} true相等，false不相等。
   */
  equalsIC(str) {
    return this.toLowerCase() == str.toLowerCase();
  },
  /**
   * 忽略大小写，判断当前字符串是否以指定字符串开始。
   * @param {String} str 比较的字符串。
   * @return {Boolean} true是，false否。
   */
  startsWithIC(str) {
    return this.toLowerCase().startsWith(str.toLowerCase());
  },
  /**
   * 忽略大小写，判断当前字符串是否以指定字符串结束。
   * @param {String} str 比较的字符串。
   * @return {Boolean} true是，false否。
   */
  endsWithIC(str) {
    return this.toLowerCase().endsWith(str.toLowerCase());
  },
  /**
   * 忽略大小写，判断当前字符串是否包含指定的字符串。
   * @param {String} str 比较的字符串。
   * @return {Boolean} true是，false否。
   */
  includesIC(str) {
    return this.toLowerCase().includes(str.toLowerCase());
  },
  /**
   * 获取字符串中指定子字符串第n次出现的位置。
   * Example: 
   *
   *     let str = 'abc 123 abc 456 abc';
   *     //获取第2个abc出现的位置
   *     str.timesIndexOf('abc', 2);
   *     //获取最后一个abc出现的位置
   *     str.timesIndexOf('abc', -1);
   *
   * @param {String} subStr 查找的子字符串。
   * @param {Number} n 子字符串出现次序，首次为1，负数表示倒数次序。0将直接返回-1。
   * @return {Number} 子字符串位置，0表示首个字符位置，-1表示没有找到。
   */
  timesIndexOf(subStr, n) {
    if (n === 0)
      return -1;
    let i, pos, negative = n < 0, len = subStr.length;

    n = Math.abs(n);
    if (negative)
      pos = this.length + len - 1;
    else
      pos = -len;
    for (i = 0; i < n; i++) {
      if (negative)
        pos = this.lastIndexOf(subStr, pos - len);
      else
        pos = this.indexOf(subStr, pos + len);
      if (pos === -1)
        return pos;
    }
    if (pos < -1)
      pos = -1;
    return pos;
  },
  /**
   * 按传入参数的顺序依此代入当前字符串模板中的占位符，其格式为{索引}。首个字符串为{0}，第2个字符串为{1}，其余依次类推。
   * 如果首个参数为对象，对象名称表示为索引。
   * Example: 
   *
   *     let str = 'foo {0} bar {1} and {0}'.format('abc', 123);
   *     //str值为: foo abc bar 123 and abc
   *     str = 'foo {value1} bar {value2}'.format({value1: 'abc', value2: 123});
   *     //str值为: foo abc bar 123
   *
   * @param {Object/...Object} values 参数列表。如果首个参数为对象，将对象的各个成员作为参数代入。
   * @return {String} 传入参数后的字符串。
   */
  format(...values) {
    let begin, firstValue, end = -1, lastEnd = -1, result = '';

    firstValue = values[0];
    if (Wb.isObject(firstValue))
      values = firstValue;
    while (true) {
      begin = this.indexOf("{", end + 1);
      end = this.indexOf("}", begin + 2);
      if (begin > -1 && end > begin) {
        result += this.substring(lastEnd + 1, begin);
        result += String(values[this.substring(begin + 1, end)]);
        lastEnd = end;
      } else {
        result += this.substr(lastEnd + 1);
        break;
      }
    }
    return result;
  },
  /**
   * 分组格式化字符串。在格式化前将首先去除在格式模板中包含的字符。该方法通常用于对字符串中的字符进行分组显示。
   * Example: 
   *
   *     '23508172639'.formatGroup('???? ???? ???'); //输出: "2350 8172 639"
   *     'abc def'.formatGroup('??-?? ?? ??'); //输出: "ab-cd ef"
   *     'abc def'.formatGroup('?? ??'); //输出: "ab cd"
   *
   * @param {String} format 格式模板，?表示当前位置的字符，其它字符直接输出。\
   * 如果所有可用字符均已经输出，后续模板中的字符将不再输出。
   * @return {String} 格式化后的字符串。
   */
  formatGroup(format) {
    let result = '', index = 0, c, i, j = format.length, len = this.length;

    for (i = 0; i < j; i++) {
      c = format.charAt(i);
      if (c == '?') {
        c = this.charAt(index++);
        if (format.includes(c))
          i--;
        else
          result += c;
        if (index >= len)
          return result;
      }
      else {
        result += c;
      }
    }
    return result;
  },
  /**
   * 把字符串中以空格分隔的各个子串前加上"."。
   * Example: 
   * 
   *     'foo bar'.padDot() //输出: ".foo .bar"
   * 
   * @param {Boolean} noBlank 添加"."后的各个子串是否不以空格连接，false以空格连接，true直接连接。
   * @return {String} 添加"."后新生成的字符串。
   */
  padDot(noBlank) {
    let result = '',
      space = noBlank ? '' : ' ';
    this.split(' ').each(item => {
      item = item.trim();
      if (result && space)
        result += space;
      result += '.' + item;
    });
    return result;
  },
  /**
   * 获取指定字符串分隔的首个子字符串。如果未找到分隔符返回该字符串的副本。
   * Example: 
   * 
   *     'foo.bar.abc'.firstItem('.'); //输出: "foo"
   *  
   * @param {String} separator 分隔符。
   * @return {String} 字符串。
   */
  firstItem(separator) {
    let index = this.indexOf(separator);
    if (index === -1)
      return this.slice();
    else
      return this.substr(0, index);
  },
  /**
   * 获取指定字符串分隔的最后一个子字符串。如果未找到分隔符返回该字符串的副本。
   * Example: 
   * 
   *     'foo.bar.abc'.lastItem('.'); //输出: "abc"
   * 
   * @param {String} separator 分隔符。
   * @return {String} 字符串。
   */
  lastItem(separator) {
    let index = this.lastIndexOf(separator);
    if (index === -1)
      return this.slice();
    else
      return this.substr(index + separator.length);
  },
  /**
   * 获取最后一个出现的指定分隔符之前的字符串。如果未找到分隔符返回该字符串的副本。
   * Example: 
   * 
   *     'foo.bar.abc'.beforeItem('.'); //输出: "foo.bar"
   *  
   * @param {String} separator 分隔符。
   * @return {String} 字符串。
   */
  beforeItem(separator) {
    let index = this.lastIndexOf(separator);
    if (index === -1)
      return this.slice();
    else
      return this.substr(0, index);
  },
  /**
   * 获取首个出现的指定分隔符之后的字符串。如果未找到分隔符返回该字符串的副本。
   * Example: 
   * 
   *     'foo.bar.abc'.afterItem('.'); //输出: "bar.abc"
   *  
   * @param {String} separator 分隔符。
   * @return {String} 字符串。
   */
  afterItem(separator) {
    let index = this.indexOf(separator);
    if (index === -1)
      return this.slice();
    else
      return this.substr(index + separator.length);
  },
  /**
   * 获取两个字符串之间的字符串。
   * Example: 
   * 
   *     'foo(bar)'.getPart('(', ')'); //输出: "bar"
   *  
   * @param {String} begin 开始字符串。
   * @param {String} end 结束字符串。
   * @return {Sring} begin和end之间的字符串。未找到返回空串。
   */
  getPart(begin, end) {
    let b = this.indexOf(begin), e = this.indexOf(end);

    if (b != -1 && e > b)
      return this.substring(b + begin.length, e);
    return '';
  }
});
Object.defineProperties(String.prototype, {
  /**
   * @property {String} - 把首字母转换为大写后的字符串。
   * Example: 
   * 
   *     'allen'.capital; //输出: "Allen"
   * @getter
   */
  capital: {
    get() {
      return this.length ? (this[0].toUpperCase() + this.substr(1)) : '';
    },
    configurable: true
  },
  /**
   * @property {String} - 以HTML脚本表示当前字符串。空格，Tab和换行符将被转换为HTML。
   * @getter
   */
  html: {
    get() {
      return this.toHTML(false, true);
    },
    configurable: true
  },
  /**
   * @property {String} - 以HTML脚本表示当前字符串。空格，Tab和换行符将被不会被转换为HTML。
   * @getter
   */
  htmlText: {
    get() {
      return this.toHTML();
    },
    configurable: true
  },
  /**
   * @property {String} - 以单行HTML脚本表示当前字符串。将把换行符转换为空格符。
   * @getter
   */
  htmlLine: {
    get() {
      return this.toHTML(true);
    },
    configurable: true
  },
  /**
   * @property {String} - 字符串中包括的错误代码。错误代码为以首字符“##”开始以“:”结束的子串。如果不存在返回null。
   * @getter
   */
  errorCode: {
    get() {
      let pos = this.indexOf(':');
      if (this.startsWith('##') && pos > 1)
        return this.substring(2, pos);
      else
        return null;
    },
    configurable: true
  },
  /**
   * @property {String} - 字符串中包括的错误文本。如果存在{#errorCode}，那么以“:”开始到结尾的子串即为错误文本。如果\
   * 不存在返回null。
   * @getter
   */
  errorText: {
    get() {
      let pos = this.indexOf(':');
      if (this.startsWith('##') && pos > 1)
        return this.substr(pos + 1).trim();
      else
        return null;
    },
    configurable: true
  },
  /**
   * @property {String} - 把当前字符串转换为面向正则表达式的字符串，字符串中的正则表达式关键字均会被转义。
   * @getter
   */
  regexpText: {
    get() {
      return this.replace(Wb.regExp.quote, '\\$&');
    },
    configurable: true
  },
  /**
   * @property {Date} - 把当前字符串按{#Date.dateFormat}转换为日期值。日期值还原为
   * 字符串值时可访问{#Date.textValue}属性。
   * Example: 
   * 
   *     '2021-03-12 14:19:39.614'.dateValue; //输出对应的日期值
   * @getter
   */
  dateValue: {
    get() {
      return Wb.parseDate(this);
    },
    configurable: true
  },
  /**
   * @property {Date} - 把当前字符串去除千分位和空格符后转换为数值。该属性将按当前客户端区域识别千分位符号。
   * Example: 
   * 
   *     '3,45 6.12'.numValue; //3456.12
   * @getter
   */
  numValue: {
    get() {
      return parseFloat(this.replaceAll(Number.thousandChar, '').replaceAll(' ', ''));
    },
    configurable: true
  }
});
/**
 * Function的扩展类。关于Function的更多说明请访问{#%Function}。
 * @class Function
 */
Wb.apply(Function.prototype, {
  /**
   * 获取函数的正文脚本。正文脚本不包含函数名称、参数列表和首尾大括号。
   * @return {String} 函数正文脚本。
   */
  toScript() {
    let s = this.toString(), arrowPos = s.indexOf('=>'), bPos = s.indexOf('{');
    if (bPos == -1 || arrowPos != -1 && arrowPos < bPos) {
      //箭头函数
      s = s.substr(arrowPos + 2).trim();
      if (s.startsWith('{'))
        s = s.slice(1, -1).trim();
      return s;
    }
    return s.slice(bPos + 1, -1).trim();
  }
});
/**
 * Number的扩展类。关于Number的更多说明请访问{#%Number}。
 * @class Number
 */
Wb.apply(Number, {
  /** @property {NumberFormat} - 默认数字格式化对象。 @static */
  numFormatter: new Intl.NumberFormat(undefined, { maximumFractionDigits: 20 }),
  /** @property {NumberFormat} - 整数格式化对象。 @static */
  intFormatter: new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }),
  /** @property {NumberFormat} - 浮点数格式化对象，保留小数。 @static */
  floatFormatter: new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 20 }),
  /** @property {NumberFormat} - 百分比格式化对象，小数固定保留2位。 @static */
  percentFormatter: new Intl.NumberFormat(undefined, {
    style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2
  }),
  /** @property {NumberFormat} - 百分比格式化对象，无小数位。 @static */
  percentIntFormatter: new Intl.NumberFormat(undefined, {
    style: 'percent'
  }),
  /** @property {String} - 小数点符号。 @readonly */
  decimalChar: (f => {
    let str = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(1.1);
    return str.replaceAll('1', '');
  })(),
  /** @property {String} - 千分位符号。 @readonly */
  thousandChar: (f => {
    let str = new Intl.NumberFormat().format(11111);
    return str.replaceAll('1', '');
  })(),
  /** @property {NumberFormat} - 百分比格式化对象，小数最多保留2位。 @static */
  percentAutoFormatter: new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 2 }),
  /** @property {NumberFormat} - 人民币数字格式化对象。 @static */
  cnyFormatter: new Intl.NumberFormat(undefined, { style: 'currency', currency: 'CNY' }),
  /** @property {NumberFormat} - 美元数字格式化对象。 @static */
  usdFormatter: new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }),
  /** @property {NumberFormat} - 欧元数字格式化对象。 @static */
  eurFormatter: new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }),
  /** @property {NumberFormat} - 英镑数字格式化对象。 @static */
  gbpFormatter: new Intl.NumberFormat(undefined, { style: 'currency', currency: 'GBP' }),
  /** @property {NumberFormat} - 日元数字格式化对象。 @static */
  jpyFormatter: new Intl.NumberFormat(undefined, { style: 'currency', currency: 'JPY' }),
  /** @property {NumberFormat} - 加元数字格式化对象。 @static */
  cadFormatter: new Intl.NumberFormat(undefined, { style: 'currency', currency: 'CAD' }),
  /** @property {NumberFormat} - 澳元数字格式化对象。 @static */
  audFormatter: new Intl.NumberFormat(undefined, { style: 'currency', currency: 'AUD' }),
  /** @property {NumberFormat} - 港元数字格式化对象。 @static */
  hkdFormatter: new Intl.NumberFormat(undefined, { style: 'currency', currency: 'HKD' })
});
Wb.apply(Number.prototype, {
  /**
   * 把当前数值转换到最接近指定步长的数值。
   * Example:
   *
   *     (92).snap(5); //90
   *     (93).snap(5); //95
   *
   * @param {Number} step 步长。
   * @return {Number} 转换后的数值。
   */
  snap(step) {
    return Math.round(this / step) * step;
  },
  /**
   * 把值限定在>=minValue和<=maxValue之间的，如果值<minValue返回minValue，如果值>maxValue返回maxValue，否则返回值本身。
   * Example: 
   * 
   *     (56).constrain(80, 90); //输出: 80
   * 
   * @param {Number} [minValue] 最小值，null默认为-Number.MAX_VALUE。
   * @param {Number} [maxValue] 最大值，null默认为Number.MAX_VALUE。
   * @return {Number} 被限定范围后的值。
   */
  constrain(minValue, maxValue) {
    let val = this.valueOf();
    minValue ??= -Number.MAX_VALUE;
    maxValue ??= Number.MAX_VALUE;
    if (val > maxValue)
      val = maxValue;
    if (val < minValue)
      val = minValue;
    return val;
  },
  /**
   * 把数字转换为指定格式的字符串。
   * Example: 
   *
   *     (12345.625).format('$#,##0.00'); //"$12,345.63"
   *     (12345.625).format('0.0###'); //"12345.625"
   *     (1.23).format('000'); //"001"
   *     (1.235).format('0.00%'); //"1.24%"
   *
   * @param {String} fmt 转换格式模板字符串，模板中有如下4个指定含义的符号: 
   * -'0': 如果该位数字不存在将以0替代。
   * -'#': 如果该位数字不存在将不显示。
   * -',': 千分位符号，该符号受所在区域的影响，如德国使用'.'作为千分位符号。
   * -'.': 小数点符号，该符号受所在区域的影响，如德国使用','作为小数点符号。
   * @return {String} 数字转换为指定格式后的字符串。
   */
  format(fmt) {
    let i, j, k, c, startFormat, endFormat, intPart, rawIntPart, decimalPart,
      isKey, hasThousand, decimalStart = -1, decimalEnd,
      prefix = '', suffix = '', result = '', intFormat = '', decimalFormat = '';

    j = fmt.length;
    for (i = 0; i < j; i++) {
      c = fmt.charAt(i);
      isKey = true;
      switch (c) {
        case '0':
        case '#':
          if (decimalStart === -1) {
            intFormat += c;
          } else {
            decimalFormat += c;
            decimalEnd = i;
          }
          break;
        case ',':
          hasThousand = true;
          break;
        case '.':
          decimalStart = i;
          break;
        case '"':
          continue;
        default:
          isKey = false;
      }
      if (isKey) {
        startFormat = true;
      } else {
        if (startFormat)
          endFormat = true;
      }
      if (!startFormat)
        prefix += c;
      if (endFormat)
        suffix += c;
    }
    if (decimalStart === -1) {
      //整数
      intPart = result = this.roundFixed();
      decimalPart = '';
    } else {
      //小数
      result = this.roundFixed(decimalEnd - decimalStart);
      i = result.indexOf('.');
      if (i === -1) {
        intPart = result;
        decimalPart = '';
      } else {
        intPart = result.substr(0, i);
        decimalPart = result.substr(i + 1);
      }
    }
    if (intPart === '0')
      intPart = '';
    //补前置0
    i = intFormat.indexOf('0');
    if (i != -1)
      intPart = intPart.padStart(intFormat.length - i, '0');
    if (decimalPart) {
      //去掉后置多余0
      j = decimalPart.length;
      k = decimalFormat.length;
      c = 0;
      for (i = j - 1; i >= 0; i--) {
        if (decimalPart.charAt(i) === '0' && decimalFormat.charAt(--k) === '#')
          c++;
        else
          break;
      }
      if (c > 0)
        decimalPart = decimalPart.substr(0, j - c);
      if (decimalPart)
        decimalPart = Number.decimalChar + decimalPart;
    }
    if (hasThousand) {
      if (intPart.startsWith('-')) {
        prefix += '-';
        intPart = intPart.substr(1);
      }
      j = intPart.length;
      k = j - 1;
      rawIntPart = intPart;
      intPart = '';
      for (i = 0; i < j; i++) {
        c = rawIntPart.charAt(i);
        intPart += c;
        if ((j - i) % 3 === 1 && i < k)
          intPart += Number.thousandChar;
      }
    }
    return prefix + intPart + decimalPart + suffix;
  },
  /**
   * 转换数值为指定小数位数的值。舍弃小数部分四舍五入。
   * Example:
   *
   *     (3.568).round(2); // 3.57
   *     (258).round(-2); // 300
   *
   * @param {Number} [digits] 小数位数。默认为0。
   * @return {Number} 转换后的值。
   */
  round(digits) {
    digits ??= 0;
    if (digits == 0)
      return Math.round(this);
    let v = Math.pow(10, digits);
    return Math.round((this + Number.EPSILON) * v) / v;
  },
  /**
   * 转换数值为指定小数位数的字符串值。舍弃小数部分四舍五入，小数不足部分补0。
   * Example:
   *
   *     (258.6215).roundFixed(3); // "258.622"，(258.6215).toFixed(3) is "258.621"
   *     (1258.6215).roundFixed(3, true); //"1,258.622"
   *     
   *
   * @param {Number} [digits] 小数位数。默认为0。
   * @param {Number} [autoFormat] 是否使用千分位符自动格式化值。
   * @return {String} 转换后的字符串值。
   */
  roundFixed(digits, autoFormat) {
    let v = this.round(digits), pos;

    digits ??= 0;
    v = autoFormat ? v.floatText : v.toString();
    if (digits > 0) {
      pos = v.lastIndexOf(Number.decimalChar);
      if (pos == -1) {
        v += Number.decimalChar;
        pos = 0;
      } else
        pos = v.substr(pos + 1).length;
      return v + '0'.repeat(digits - pos);
    } else
      return v;
  }
});
Object.defineProperties(Number.prototype, {
  /** 
   * @property {Number} - 小数位数长度。
   * @getter
   */
  decimalCount: {
    get() {
      let str = this.toString(), dotPos = str.indexOf('.');
      return dotPos == -1 ? 0 : str.length - dotPos - 1;
    },
    configurable: true
  },
  /** 
   * @property {Number} - 是否包含小数。
   * @getter
   */
  hasDecimal: {
    get() {
      return (this - Math.floor(this)) != 0;
    }
  },
  /** 
   * @property {String} - 当地区域表示的数字字符串。
   * Example: 
   * 
   *     (1234.5678).text //在中文下输出: "1,234.5678"
   * @getter
   */
  text: {
    get() {
      return Number.numFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域表示的整数字符串。
   * Example: 
   * 
   *     (1234.5678).intText //在中文下输出: "1,235"
   * 
   * @getter
   */
  intText: {
    get() {
      return Number.intFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以浮点数表示的字符串，保留有效小数位。
   * Example: 
   * 
   *     (1234.2).floatText //在中文下输出: "1,234.2"
   * @getter
   */
  floatText: {
    get() {
      return Number.floatFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以百分比表示的字符串，小数固定保留2位。
   * Example: 
   * 
   *     (1.203).percent //在中文下输出: "120.30%"
   * @getter
   */
  percent: {
    get() {
      return Number.percentFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以百分比表示的字符串，无小数位。
   * Example: 
   * 
   *     (1.2).percentInt //在中文下输出: "120%"
   * @getter
   */
  percentInt: {
    get() {
      return Number.percentIntFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以百分比表示的字符串，小数最多保留2位。
   * Example: 
   * 
   *     (1.2).percentAuto //在中文下输出: "120%"
   * @getter
   */
  percentAuto: {
    get() {
      return Number.percentAutoFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以人民币货币表示的字符串。
   * Example: 
   * 
   *     (1234.5).cny //在中文下输出: "¥1,234.50"
   * @getter
   */
  cny: {
    get() {
      return Number.cnyFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以美元货币表示的字符串。
   * Example: 
   * 
   *     (1234.5).usd //在中文下输出: "US$1,234.50"
   * @getter
   */
  usd: {
    get() {
      return Number.usdFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以欧元货币表示的字符串。
   * Example: 
   * 
   *     (1234.5).eur //在中文下输出: "€1,234.50"
   * @getter
   */
  eur: {
    get() {
      return Number.eurFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以英镑货币表示的字符串。
   * Example: 
   * 
   *     (1234.5).gbp //在中文下输出: "£1,234.50"
   * @getter
   */
  gbp: {
    get() {
      return Number.gbpFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以日元货币表示的字符串。
   * Example: 
   * 
   *     (1234.5).jpy //在中文下输出: "JP¥1,235"
   * @getter
   */
  jpy: {
    get() {
      return Number.jpyFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以加元货币表示的字符串。
   * Example: 
   * 
   *     (1234.5).cad //在中文下输出: "CA$1,234.50"
   * @getter
   */
  cad: {
    get() {
      return Number.cadFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以澳元货币表示的字符串。
   * Example: 
   * 
   *     (1234.5).aud //在中文下输出: "AU$1,234.50"
   * @getter
   */
  aud: {
    get() {
      return Number.audFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以港元货币表示的字符串。
   * Example: 
   * 
   *     (1234.5).hkd //在中文下输出: "HK$1,234.50"
   * @getter
   */
  hkd: {
    get() {
      return Number.hkdFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以KB为单位表示的字符串。大于0小于1KB显示为1KB。
   * Example: 
   * 
   *     (12345678).kb //在中文下输出: "12,056 KB"
   *     (1).kb //在中文下输出: "1 KB"
   * 
   * @getter
   */
  kb: {
    get() {
      const kb = 1024;
      let val = this;
      if (val > 0 && val < kb)
        val = kb;
      return (val / kb).intText + ' KB';
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以MB为单位表示的字符串。大于0小于1MB显示为1MB。
   * Example: 
   * 
   *     (12345678912).mb //在中文下输出: "11,774 MB"
   *     (1).mb //在中文下输出: "1 MB"
   * 
   * @getter
   */
  mb: {
    get() {
      const mb = 1048576;
      let val = this;
      if (val > 0 && val < mb)
        val = mb;
      return (val / mb).intText + ' MB';
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以MB/KB/B为单位表示的字符串。具体使用的单位取决于实际大小。
   * @getter
   */
  fileSize: {
    get() {
      const mb = 1048576, kb = 1024;
      let val = this;
      if (val < kb)
        val = val + ' B';
      else if (val < mb)
        val = val.kb;
      else
        val = val.mb;
      return val;
    },
    configurable: true
  }
});
/**
 * Array的扩展类。关于Array的更多说明请访问{#%Array}。
 * @class Array
 */
Wb.apply(Array.prototype, {
  /**
   * 对数组的每个元素执行一次给定的方法。该方法同forEach方法的区别为可以通过返回false中断遍历，
   * 并且可以逆向进行遍历。详见{#Wb.PT.arrayEach}方法。
   * Example: 
   * 
   *     [1, 2, 3].each(n => {
   *       if (n === 1)
   *         return false;
   *       console.log(n);
   *     }, null, true);
   *     //输出: 3 2
   * 
   */
  each: Wb.PT.arrayEach,
  /**
   * 从可枚举对象的每个项中提取指定名称属性值，详见{#Wb.PT.pluck}方法
   * Example: 
   * 
   *     [{name: 'Allen'}, {name:'Chen'}].pluck('name'); //返回["Allen", "Chen"]
   * 
   */
  pluck: Wb.PT.pluck,
  /**
   * 获取当前数组移除指定列表所有条目后的数组。
   * @param {Array/Set} array 比较的列表。
   * @return {Array} 移除条目后的数组。
   */
  diff: Wb.PT.diff,
  /**
   * 获取当前数组和指定列表都具有的条目组成的数组。
   * @param {Array/Set} array 比较的列表。
   * @return {Array} 共有条目组成的数组。
   */
  intersect: Wb.PT.intersect,
  /** @property {Boolean} - 类数组标记。 @priv */
  xLikeArray: true,
  /**
   * 合并数组本身和一个可遍历的对象，并返回合并后的新数组。该方法区别于concat，可以实现同所有可遍历数据类型的值合并。
   * Example: 
   * 
   *     [1, 2, 3].merge(new Set([3, 4, 5])); //输出: [1, 2, 3, 3, 4, 5]
   *     [1, 2, 3].merge('abc'); //输出: [1, 2, 3, "a", "b", "c"]
   * 
   * @param {Iterable} iterable 可遍历的值，包括Array，Set和String等。
   * @return {Array} 合并后获得的新数组。
   */
  merge(iterable) {
    if (iterable)
      return [...this, ...iterable];
    return this;
  },
  /**
   * 把指定可遍历对象中的所有成员依次添加到当前数组。
   * @param {Iterable} iterable 可遍历对象。
   * @return {Number} 数组的新长度。
   */
  pushAll(iterable) {
    iterable?.forEach(item => this.push(item));
    return this.length;
  },
  /**
   * 复制当前数组中的所有值到一个新的数组。新创建的数组为一个浅复制的数组。\
   * 参考 {#Wb.clone} 深克隆一个对象。
   * @return {Array} 浅复制后生成的新数组。
   */
  copy: Array.prototype.slice,
  /**
   * 判断是否当前数组同指定数组任意索引号的元素均完全相同。
   * @param {Array} array 判断的数组。
   * @return {Boolean} true相同，false不相同。
   */
  equals(array) {
    if (this.length != array.length)
      return false;
    return this.every((item, i) => array[i] === item);
  },
  /**
   * 把数组中的值进行本地区域正常的排序。混合Unicode字符的排序请使用{#mixSort}。\
   * 该方法将直接修改数组本身。
   * @param {String/String[]} [keys] 如果排序对象，指定排序对象的成员名称或其列表。
   * @param {Boolean/Boolean[]} [desc] 是否逆向排序。如果为数组每项对应每个成员是否逆向排序。
   * @return {Array} 排序后的数组本身。
   */
  normalSort(keys, desc) {
    return this.mixSort(keys, desc, Wb.compare);
  },
  /**
   * 把数组中的值进行不区分大小写的排序。混合Unicode字符的排序请使用{#mixSort}。\
   * 该方法将直接修改数组本身。
   * @param {String/String[]} [keys] 如果排序对象，指定排序对象的成员名称或其列表。
   * @param {Boolean/Boolean[]} [desc] 是否逆向排序。如果为数组每项对应每个成员是否逆向排序。
   * @return {Array} 排序后的数组本身。
   */
  lowerSort(keys, desc) {
    return this.mixSort(keys, desc, Wb.lowerCompare);
  },
  /**
   * 把数组内的条目进行混合排序。该方法将直接修改数组本身。该方法支持对Unicode字符按本地规则进行排序。
   * Example:
   *
   *     [{a: 3, b: 2}, {a: 1, b: 4}].mixSort(['a', 'b'], [false, true]);
   *
   * @param {String/String[]} [keys] 如果排序对象，指定排序对象的成员名称或其列表。
   * @param {Boolean/Boolean[]} [desc] 是否逆向排序。如果为数组每项对应每个成员是否逆向排序。
   * @param {Function} [fn] 比较的函数。缺省为{#Wb.mixCompare}。
   * @return {Array} 排序后的数组本身。
   */
  mixSort(keys, desc, fn) {
    fn ??= Wb.mixCompare;
    if (keys == null) {
      if (desc)
        return this.sort((a, b) => fn(b, a));
      else
        return this.sort(fn);
    } else {
      let value, v1, v2, defaultDesc;
      keys = Wb.toArray(keys);
      desc = Wb.toArray(desc);
      defaultDesc = desc[0];
      return this.sort((a, b) => {
        keys.each((key, i) => {
          v1 = a[key];
          v2 = b[key];
          value = (desc[i] ?? defaultDesc) ? fn(v2, v1) : fn(v1, v2);
          if (value != 0)
            return false;
        });
        return value;
      });
    }
  },
  /**
   * 合并数组本身和一个可遍历的对象，并返回去重后的数组，如果合并的对象为空返回数组本身去重后的对象。
   * Example: 
   * 
   *     [1, 2, 1, 3].unique(); //输出: [1, 2, 3]
   *     [1, 2, 3].unique([3, 4, 5]); //输出: [1, 2, 3, 4, 5]
   *     ['a', 'b', 'c'].unique(['d', 'b'], true); //输出: ['a', 'c', 'd', 'b']
   * 
   * @param {Iterable} [iterable] 可遍历的值，包括Array，Set和String等。
   * @param {Boolean} [subtract] 是否先移除当前数组的重复成员后再合并值。
   * @return {Array} 合并后获得的数组或本身去重后的数组。
   */
  unique(iterable, subtract) {
    let arr = this;
    if (iterable) {
      if (subtract)
        arr = arr.filter(item => !iterable.includes(item));
      return [...new Set([...arr, ...iterable])];
    } else {
      return [...new Set(arr)];
    }
  },
  /**
   * 删除数组中存在的首个指定元素并返回数组本身。如果已经获得需要删除元素的索引号，请使用{#erase}方法。
   * Example: 
   * 
   *     let array = [1, 2, 3];
   *     array.remove(2); //输出: true
   *     //array值为: [1, 3]
   * 
   * @param {Object} item 删除的元素。
   * @return {Boolean} true已删除，false未删除。
   */
  remove(item) {
    let index = this.indexOf(item);

    if (index === -1) {
      return false;
    } else {
      this.splice(index, 1);
      return true;
    }
  },
  /**
   * 删除数组中存在的所有指定元素并返回数组本身。
   * @param {Object} item 删除的元素。
   * @return {Boolean} true已删除，false未删除。
   */
  removeAll(item) {
    let i, j = this.length, result = false;

    for (i = j - 1; i > -1; i--) {
      if (this[i] == item) {
        this.splice(i, 1);
        result ||= true;
      }
    }
    return result;
  },
  /**
   * 删除数组中满足指定条件的所有元素。
   * Example: 
   * 
   *     let array = [1, 2, 3];
   *     array.removeBy(item => item === 2); //输出: true
   *     //array值为: [1, 3]
   * 
   * @param {Function} fn 用于测试是否满足条件的方法。
   * @param {Object} fn.item 数组中正在处理的当前元素。
   * @param {Number} fn.index 数组中正在处理的当前元素的索引。
   * @param {Object} [scope] fn内的this对象。
   * @return {Boolean} true至少1个元素被删除，false未删除。
   */
  removeBy(fn, scope) {
    let i, j = this.length, result = false;

    scope ??= this;
    for (i = j - 1; i > -1; i--) {
      if (fn.call(scope, this[i], i)) {
        this.splice(i, 1);
        if (!result)
          result = true;
      }
    }
    return result;
  },
  /**
   * 删除数组中满足指定条件的首个元素。
   * Example: 
   * 
   *     let array = [1, 2, 3, 2];
   *     array.removeFirst(item => item === 2); //输出: true
   *     //array值为: [1, 3, 2]
   * 
   * @param {Function} fn 用于测试是否满足条件的方法。
   * @param {Object} fn.item 数组中正在处理的当前元素。
   * @param {Number} fn.index 数组中正在处理的当前元素的索引。
   * @param {Object} [scope] fn内的this对象。
   * @return {Boolean} true元素被删除，false未删除。
   */
  removeFirst(fn, scope) {
    scope ??= this;
    this.forEach((item, i) => {
      if (fn.call(scope, item, i)) {
        this.splice(i, 1);
        return true;
      }
    });
    return false;
  },
  /**
   * 删除数组中的指定索引号的元素并返回数组本身。删除元素请使用{#remove}方法。
   * Example: 
   * 
   *     let array = [1, 2, 3];
   *     array.erase(2); //输出: true
   *     //array值为: [1, 2]
   * 
   * @param {Number} index 删除元素的索引号。
   * @return {Boolean} true已删除，false未删除。
   */
  erase(index) {
    return this.splice(index, 1).length === 1;
  },
  /**
   * 向数组中的指定位置插入新的元素并返回数组本身。
   * Example: 
   * 
   *     [1, 2, 3].insert(0, 'a', 'b'); //输出: ["a", "b", 1, 2, 3]
   * 
   * @param {Number} index 插入元素位置的索引号。负值表示倒数位置。
   * @param {...Object} item 插入的元素列表。
   * @return {Array} 数组本身。
   */
  insert(index, ...item) {
    this.splice(index, 0, ...item);
    return this;
  },
  /**
   * 把参数列表中的所有非null和undefined的值添加到数组中。
   * Example: 
   * 
   *     let array = [1, 2, 3];
   *     array.pushIf(null, 'b'); //输出array长度: 4
   *     //array值为: [1, 2, 3, 'b']
   * 
   * @param {...Object} items 需要添加的值列表。
   * @return {Number} 数组的新长度。
   */
  pushIf(...items) {
    items.forEach(item => {
      if (item != null)
        this.push(item);
    });
    return this.length;
  }
});
Object.defineProperties(Array.prototype, {
  /** @property {Object} - 返回数组的首个元素。 @getter */
  firstItem: {
    //设置值后直接返回该值，防止firstItem被重置为其它值
    set(value) {
      this.firstItem$ = value;
    },
    get() {
      return this.firstItem$ ?? this[0];
    },
    configurable: true
  },
  /** @property {Object} - 返回数组的最后一个元素。 @getter */
  lastItem: {
    //设置值后直接返回该值，防止lastItem被重置为其它值
    set(value) {
      this.lastItem$ = value;
    },
    get() {
      return this.lastItem$ ?? this[this.length - 1];
    },
    configurable: true
  }
});
/**
 * Set的扩展类。关于Set的更多说明请访问{#%Set}。
 * @class Set
 */
Wb.apply(Set.prototype, {
  /** @property {Boolean} - 类数组标记。 @priv */
  xLikeArray: true,
  /**
   * 从可枚举对象的每个项中提取指定名称属性值。详见{#Wb.PT.pluck}方法。示例参考{#Array.pluck}。
   */
  pluck: Wb.PT.pluck,
  /**
   * 删除集合内的元素，delete方法的别名。
   */
  remove: Set.prototype.delete,
  /**
   * 判断是否存在某个元素，has方法的别名，用于兼容数组的includes方法。
   */
  includes: Set.prototype.has,
  /**
   * 获取当前集合移除指定列表所有条目后的数组。
   * @param {Array/Set} array 比较的列表。
   * @return {Array} 移除条目后的数组。
   */
  diff: Wb.PT.diff,
  /**
   * 获取当前集合和指定列表都具有的条目组成的数组。
   * @param {Array/Set} array 比较的列表。
   * @return {Array} 共有条目组成的数组。
   */
  intersect: Wb.PT.intersect,
  /**
   * 查找某个元素，详见{#Wb.PT.iteratorFind}方法。
   * Example: 
   * 
   *    (new Set([1, 2, 3])).find(item => item == 2); //输出: 2
   * 
   */
  find: Wb.PT.iteratorFind,
  /**
   * 过滤多个元素，详见{#Wb.PT.iteratorFilter}方法。
   */
  filter: Wb.PT.iteratorFilter,
  /**
   * 对集合内每个元素执行一次给定的方法。该方法同forEach方法的区别为可以通过返回false中断遍历，并且可以逆向进行遍历。
   * 详见{#Wb.PT.iteratorEach}方法。示例参考{#Array.each}。
   */
  each: Wb.PT.iteratorEach,
  /**
   * 判断集合内是否存在满足某个条件的元素。详见 {#Wb.PT.some} 方法。
   * Example: 
   * 
   *     (new Set([1, 2, 3])).some(item => item == 2); //输出: true
   * 
   */
  some: Wb.PT.some,
  /**
   * 判断集合内所有元素是否均满足某个条件。详见 {#Wb.PT.every} 方法。
   * Example: 
   * 
   *     (new Set(['Allen', 'Chen', 'Jenna'])).every(item => item.includes('e')); //输出: true
   * 
   */
  every: Wb.PT.every,
  /**
   * 合并Set本身和一个可遍历的对象，并返回去重后的Set对象，如果合并的对象为空返回Set本身。示例参考{#Array.unique}。
   * @param {Iterable} iterable 可遍历的值，包括Array，Set和String等。
   * @return {Set} 合并后获得的Set或Set本身。
   */
  unique: Array.prototype.unique,
  /**
   * 将一个或多个元素添加到集合，重复的元素将被去除，并返回该集合的新长度。
   * @param {...Object} list 添加的元素。
   * @return {Number} 集合的新长度。
   */
  push(...list) {
    list.forEach(item => this.add(item));
    return this.size;
  },
  /**
   * 把指定可遍历对象中的所有成员依次添加到当前集合。
   * @param {Iterable} iterable 可遍历对象。
   * @return {Number} 集合的新长度。
   */
  pushAll(iterable) {
    iterable.forEach(item => this.add(item));
    return this.size;
  },
  /**
   * 使用指定字符串连接集合内的所有元素。
   * 详见{#%Array.join|obj:Array/join}方法说明。
   */
  join(...args) {
    return [...this].join(...args);
  },
  /**
   * 对集合内所有元素进行排序。
   * 详见{#%Array.sort|obj:Array/sort}方法说明。
   */
  sort(...args) {
    return [...this].sort(...args);
  },
  /**
   * 把字符按本地区域进行正常的排序。
   * @param {String} [key] 如果排序对象，指定排序对象的成员名称。
   * @return {Array} 排序后的数组本身。
   */
  normalSort(key) {
    return [...this].normalSort(key);
  },
  /**
   * 把字符转换为小写后再进行排序。
   * @param {String} [key] 如果排序对象，指定排序对象的成员名称。
   * @return {Array} 排序后的数组本身。
   */
  lowerSort(key) {
    return [...this].lowerSort(key);
  },
  /**
   * 对常规字符（编码小于128的字符）和其它字符进行不区分大小写的混合排序。先显示常规字符后显示其它字符。
   * @param {String} [key] 如果排序对象，指定排序对象的成员名称。
   * @return {Array} 排序后的数组本身。
   */
  mixSort(key) {
    return [...this].mixSort(key);
  },
  /**
   * 转换为JSON的方法。
   */
  toJSON() {
    return [...this];
  }
});
/**
 * Map的扩展类。关于Map的更多说明请访问{#%Map}。
 * @class Map
 */
Wb.apply(Map.prototype, {
  /**
   * 删除Map内的元素，delete方法的别名。
   */
  remove: Map.prototype.delete,
  /**
   * 查找某个元素，详见{#Wb.PT.iteratorFind2P}方法。
   */
  find: Wb.PT.iteratorFind2P,
  /**
   * 查找多个元素，详见{#Wb.PT.iteratorFilter2p}方法。
   * Example: 
   * 
   *     (new Map([['key1', 'Allen'], ['key2', 'Chen']])).filter((k, v) => v.includes('e'));
   *     //输出: [['key1', 'Allen'], ['key2', 'Chen']]
   * 
   */
  filter: Wb.PT.iteratorFilter2p,
  /**
   * 对Map内每个元素执行一次给定的方法。该方法同forEach方法的区别为可以通过返回false中断遍历。
   * 详见{#Wb.PT.iteratorEach2P}方法。
   * Example: 
   * 
   *     (new Map([['key1', 'Allen'], ['key2', 'Chen']])).each((k, v) => console.log(k, v));
   *     //输出: key1 Allen key2 Chen
   * 
   */
  each: Wb.PT.iteratorEach2P,
  /**
   * 判断Map内是否存在满足某个条件的元素。详见 {#Wb.PT.some} 方法。
   * Example: 
   * 
   *     (new Map([['key1', 'Allen'], ['key2', 'Chen']])).some((k, v) => v === 'Chen'); //输出: true
   * 
   */
  some: Wb.PT.some,
  /**
   * 判断Map内所有元素是否均满足某个条件。详见 {#Wb.PT.every} 方法。
   * Example: 
   * 
   *     (new Map([['key1', 'Allen'], ['key2', 'Chen']])).every((k, v) => v.includes('e')); //输出: true
   * 
   */
  every: Wb.PT.every
});
/**
 * Date的扩展类。关于Date的更多说明请访问{#%Date}。
 * @class Date
 */
Wb.apply(Date, {
  /** @property {String} - 解析日期时，默认使用的年月格式，值为: {{y-MM}}，表示完整的年月值。 @static */
  ymFormat: 'y-MM',
  /** @property {String} - 解析日期时，默认使用的日期格式，值为: {{y-MM-dd}}，表示完整的年月日值。 @static */
  dateFormat: 'y-MM-dd',
  /** @property {String} - 解析时间时，默认使用的时间格式，值为: {{HH:mm:ss.SSS}}，表示完整的时分秒毫秒值。 @static */
  timeFormat: 'HH:mm:ss.SSS',
  /** @property {String} - 解析日期时间时，默认使用的日期时间格式，值为: {{y-MM-dd HH:mm:ss.SSS}}，表示年月日时分
   * 秒毫秒。 @static */
  dateTimeFormat: 'y-MM-dd HH:mm:ss.SSS',
  /** @property {DateTimeFormat} - 2位数月日的日期格式化对象。 @static */
  dateFormatter: new Intl.DateTimeFormat(Wb.isServer ? undefined : Str.lang,
    { year: 'numeric', month: '2-digit', day: '2-digit' }),
  /** @property {DateTimeFormat} - 短名称年月的日期格式化对象。 @static */
  yearMonthFormatter: new Intl.DateTimeFormat(Wb.isServer ? undefined : Str.lang,
    { year: 'numeric', month: 'short' }),
  /** @property {DateTimeFormat} - 长名称月的日期格式化对象。 @static */
  monthFormatter: new Intl.DateTimeFormat(Wb.isServer ? undefined : Str.lang, { month: 'long' }),
  /** @property {DateTimeFormat} - 短名称月的日期格式化对象。 @static */
  shortMonthFormatter: new Intl.DateTimeFormat(Wb.isServer ? undefined : Str.lang, { month: 'short' }),
  /** @property {DateTimeFormat} - 长名称月日的日期格式化对象。 @static */
  monthDayFormatter: new Intl.DateTimeFormat(Wb.isServer ? undefined : Str.lang, { month: '2-digit', day: '2-digit' }),
  /** @property {DateTimeFormat} - 24小时制2位数时分秒的时间格式化对象。 @static */
  timeFormatter: new Intl.DateTimeFormat(Wb.isServer ? undefined : Str.lang, {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }),
  /** @property {DateTimeFormat} - 24小时制2位数时分的时间格式化对象。 @static */
  timeFormatterHM: new Intl.DateTimeFormat(Wb.isServer ? undefined : Str.lang, {
    hour: '2-digit', minute: '2-digit', hour12: false
  }),
  /** @property {DateTimeFormat} - 12小时制2位数时分秒的时间格式化对象。 @static */
  timeFormatter12: new Intl.DateTimeFormat(Wb.isServer ? undefined : Str.lang, {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  }),
  /** @property {DateTimeFormat} - 12小时制2位数时分的时间格式化对象。 @static */
  timeFormatter12HM: new Intl.DateTimeFormat(Wb.isServer ? undefined : Str.lang, {
    hour: '2-digit', minute: '2-digit', hour12: true
  }),
  /**
   * 从指定对象创建新的日期。该对象的getTime()方法返回时间整数值。 @static
   * @param {Object} object 从该对象创建日期。
   * @return {Date} 创建的日期值。
   */
  from(date) {
    if (date)
      return new Date(date.getTime());
    else
      return date;
  },
  /**
   * 获取去除毫秒后的当前时间。 @static
   * @return {Date} 时期时间值。
   */
  current() {
    let date = new Date();
    date.setMilliseconds(0);
    return date;
  }
});
Wb.apply(Date.prototype, {
  /**
   * 判断当前时间是否位于指定开始时间和结束时间之间，包含开始时间和结束时间。
   * @param {Date} begin 开始时间。
   * @param {Date} end 结束时间  
   * @return {Boolean} 如果位于开始时间和结束时间之间返回true，否则返回false。
   */
  between(begin, end) {
    let t = this.getTime();
    return begin.getTime() <= t && end.getTime() >= t;
  },
  /**
   * 获取当前时间到指定时间间隔的毫秒数，其值为当前时间减指定时间的毫秒数。
   * @param {Date} date 判断的时间，通常为之前的时间。
   * @return {Number} 毫秒数。
   */
  elapse(date) {
    return date ? (this.getTime() - date.getTime()) : null;
  },
  /**
   * 把日期转换为指定格式的字符串。
   * Example: 
   *
   *     (new Date()).format('y-MM-dd HH:mm:ss.S'); //输出类似: "2020-06-23 14:26:29.012"
   *
   * @param {String} fmt 转换格式模板字符串，该格式兼容于Java Date的日期格式。
   * -yy: 后2位数的年份。解析年份时2位数的年份前面2位默认为“20”。
   * -y/yyyy: 4位数的年份。
   * -M: 月份。
   * -MM: 2位数的月份，如果不足2位前面补0。
   * -d: 日期。
   * -dd: 2位数的日期，如果不足2位前面补0。
   * -H: 小时。
   * -HH: 2位数的小时，如果不足2位前面补0。
   * -m: 分钟。
   * -mm: 2位数的分钟，如果不足2位前面补0。
   * -s: 秒。
   * -ss: 2位数的秒，如果不足2位前面补0。
   * -S: 毫秒。当毫秒前有值且毫秒为0时将省略输出。
   * -SSS: 3位数的毫秒，如果不足3位后面补0。
   * @return {String} 日期转换为指定格式后的字符串。
   */
  format(fmt) {
    let str, i, j, c, val, sign, isSss;
    str = '';
    j = fmt.length;
    for (i = 0; i < j; i++) {
      c = fmt.charAt(i);
      switch (c) {
        case 'y':
          val = this.getFullYear().toString();
          //年份允许为负
          if (val.startsWith('-')) {
            val = val.substr(1);
            sign = '-';
          } else
            sign = '';
          val = val.padStart(4, 0);
          if (fmt.substr(i, 4) === 'yyyy') {
            str += val.slice(-4);
            i += 3;
          } else if (fmt.substr(i, 2) === 'yy') {
            str += val.slice(-2);
            i++;
          } else {
            str += val.slice(-4);
          }
          str = sign + str;
          break;
        case 'M':
          val = (this.getMonth() + 1).toString();
          if (fmt.charAt(i + 1) === 'M') {
            str += val.padStart(2, '0'); //MM
            i++;
          } else
            str += val;
          break;
        case 'd':
          val = this.getDate().toString();
          if (fmt.charAt(i + 1) === 'd') {
            str += val.padStart(2, '0'); //dd
            i++;
          } else
            str += val;
          break;
        case 'H':
          val = this.getHours().toString();
          if (fmt.charAt(i + 1) === 'H') {
            str += val.padStart(2, '0'); //HH
            i++;
          } else
            str += val;
          break;
        case 'm':
          val = this.getMinutes().toString();
          if (fmt.charAt(i + 1) === 'm') {
            str += val.padStart(2, '0'); //mm
            i++;
          } else
            str += val;
          break;
        case 's':
          val = this.getSeconds().toString();
          if (fmt.charAt(i + 1) === 's') {
            str += val.padStart(2, '0'); //ss
            i++;
          } else
            str += val;
          break;
        case 'S':
          val = this.getMilliseconds();
          isSss = fmt.substr(i, 3) === 'SSS';
          if (isSss || val || !str) {
            val = val.toString().padStart(3, '0');
            if (isSss) {
              str += val;
              i += 2;
            } else {
              //去掉尾随的毫秒0
              for (let ii = 0; ii < 2; ii++) {
                if (val.endsWith('0'))
                  val = val.slice(0, -1);
              }
              str += val;
            }
          } else {
            //去掉毫秒前的"."
            if (str.endsWith('.'))
              str = str.slice(0, -1);
          }
          break;
        case '"':
          continue;
        default:
          str += c;
      }
    }
    return str;
  },
  /**
   * 转换为JSON的方法。
   * @return {String} 日期格式化为y-MM-dd HH:mm:ss.SSS格式的字符串。
   */
  toJSON() {
    return this.textValue;
  },
  /**
   * 把日期转换为字符串。
   * @return {String} 日期格式化为y-MM-dd HH:mm:ss.SSS格式的字符串。
   */
  toString() {
    return this.textValue;
  },
  /**
   * 在当前日期上增加指定数量的毫秒。
   * Example: 
   * 
   *     (new Date()).addMilliSec(3); //当前日期增加3毫秒
   * 
   * @param {Number} milliSecs 增加的毫秒数，可以为负值，表示减少的毫秒数。
   * @return {Date} 增加后新获得的日期。
   */
  addMilliSec(milliSecs) {
    let date = new Date(this);

    date.setMilliseconds(date.getMilliseconds() + milliSecs);
    return date;
  },
  /**
   * 在当前日期上增加指定数量的秒。
   * Example: 
   * 
   *     (new Date()).addSecond(3); //当前日期增加3秒
   * 
   * @param {Number} seconds 增加的秒数，可以为负值，表示减少的秒数。
   * @return {Date} 增加后新获得的日期。
   */
  addSecond(seconds) {
    let date = new Date(this);

    date.setSeconds(date.getSeconds() + seconds);
    return date;
  },
  /**
   * 在当前日期上增加指定数量的分钟。
   * Example: 
   * 
   *     (new Date()).addMinute(3); //当前日期增加3分钟
   * 
   * @param {Number} minutes 增加的分钟数，可以为负值，表示减少的分钟数。
   * @return {Date} 增加后新获得的日期。
   */
  addMinute(minutes) {
    let date = new Date(this);

    date.setMinutes(date.getMinutes() + minutes);
    return date;
  },
  /**
   * 在当前日期上增加指定数量的小时。
   * Example: 
   * 
   *     (new Date()).addHour(3); //当前日期增加3小时
   * 
   * @param {Number} hours 增加的小时数，可以为负值，表示减少的小时数。
   * @return {Date} 增加后新获得的日期。
   */
  addHour(hours) {
    let date = new Date(this);

    date.setHours(date.getHours() + hours);
    return date;
  },
  /**
   * 在当前日期上增加指定数量的天数。
   * Example: 
   * 
   *     (new Date()).addDay(3); //当前日期增加3天
   * 
   * @param {Number} days 增加的天数，可以为负值，表示减少的天数。
   * @return {Date} 增加后新获得的日期。
   */
  addDay(days) {
    let date = new Date(this);

    date.setDate(date.getDate() + days);
    return date;
  },
  /**
   * 在当前日期上增加指定数量的月数。
   * Example: 
   * 
   *     (new Date()).addMonth(3); //当前日期增加3月
   * 
   * @param {Number} months 增加的月数，可以为负值，表示减少的月数。
   * @return {Date} 增加后新获得的日期。
   */
  addMonth(months) {
    let date = new Date(this),
      day = date.getDate();

    if (day > 28) {
      day = Math.min(day, date.monthFirstDate.addMonth(months).monthLastDate.getDate());
    }
    date.setDate(day);
    date.setMonth(date.getMonth() + months);
    return date;
  },
  /**
   * 在当前日期上增加指定数量的年数。
   * Example: 
   * 
   *     (new Date()).addYear(3); //当前日期增加3年
   * 
   * @param {Number} years 增加的年数，可以为负值，表示减少的年数。
   * @return {Date} 增加后新获得的日期。
   */
  addYear(years) {
    let date = new Date(this),
      day = date.getDate();
    if (day > 28) {
      day = Math.min(day, date.monthFirstDate.addYear(years).monthLastDate.getDate());
    }
    date.setDate(day);
    date.setFullYear(date.getFullYear() + years);
    return date;
  },
  /**
   * 判断当前日期同指定日期的日期时间值是否相等。
   * @param {Date} date 比较的日期值。
   * @return {Boolean} true相等，false不等。
   */
  equals(date) {
    return date ? this.getTime() === date.getTime() : false;
  },
  /**
   * 判断当前日期同指定日期的日期部分值是否相等。
   * @param {Date} date 比较的日期值。
   * @return {Boolean} true相等，false不等。
   */
  equalsDate(date) {
    if (date) {
      return this.getDate() === date.getDate() && this.getMonth() === date.getMonth()
        && this.getFullYear() === date.getFullYear();
    }
    return false;
  },
  /**
   * 判断当前日期同指定日期的年月部分值是否相等。
   * @param {Date} date 比较的日期值。
   * @return {Boolean} true相等，false不等。
   */
  equalsMonth(date) {
    if (date) {
      return this.getMonth() === date.getMonth() && this.getFullYear() === date.getFullYear();
    }
    return false;
  }
});
Object.defineProperties(Date.prototype, {
  /** 
   * @property {String} - 当地区域以4位年和2位数月日表示的日期字符串。
   * Example: 
   * 
   *     new Date().dateText; //在中文下输出: "2021/03/09"
   * 
   * @getter
   */
  dateText: {
    get() {
      return Date.dateFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以24小时制2位数时分秒表示的时间字符串。
   * Example: 
   * 
   *     new Date().timeText; //在中文下输出: "15:03:23"
   * 
   * @getter
   */
  timeText: {
    get() {
      return Date.timeFormatter.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以24小时制2位数时分表示的时间字符串。
   * Example: 
   * 
   *     new Date().timeTextHM; //在中文下输出: "15:03"
   * 
   * @getter
   */
  timeTextHM: {
    get() {
      return Date.timeFormatterHM.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以12小时制2位数时分秒表示的时间字符串。
   * Example: 
   * 
   *     new Date().timeText12; //在中文下输出: "下午02:15:29"
   * 
   * @getter
   */
  timeText12: {
    get() {
      return Date.timeFormatter12.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以12小时制2位数时分秒表示的时间字符串。
   * Example: 
   * 
   *     new Date().timeText12HM; //在中文下输出: "下午02:15"
   * 
   * @getter
   */
  timeText12HM: {
    get() {
      return Date.timeFormatter12HM.format(this);
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以24小时制4位年和2位数月日时分秒表示的日期时间字符串。日期和时间使用空格连接。
   * Example: 
   * 
   *     new Date().dateTimeText; //在中文下输出: "2021/03/09 15:01:10"
   * 
   * @getter
   */
  dateTimeText: {
    get() {
      return this.dateText + ' ' + this.timeText;
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以24小时制4位年和2位数月日时分表示的日期时间字符串。日期和时间使用空格连接。
   * Example: 
   * 
   *     new Date().dateTimeTextHM; //在中文下输出: "2021/03/09 15:01"
   * 
   * @getter
   */
  dateTimeTextHM: {
    get() {
      return this.dateText + ' ' + this.timeTextHM;
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以24小时制4位年和2位数月日时分秒表示的日期时间字符串。日期和时间使用空格连接。如果时分秒
   * 为0仅显示日期部分。
   * @getter
   */
  autoText: {
    get() {
      let me = this;

      if (me.getHours() == 0 && me.getMinutes() == 0 && me.getSeconds() == 0)
        return me.dateText;
      return me.dateText + ' ' + me.timeText;
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以12小时制4位年和2位数月日时分秒表示的日期时间字符串。日期和时间使用空格连接。
   * Example: 
   * 
   *     new Date().dateTimeText12; //在中文下输出: "2022/10/06 下午02:17:06"
   * 
   * @getter
   */
  dateTimeText12: {
    get() {
      return this.dateText + ' ' + this.timeText12;
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以12小时制4位年和2位数月日时分表示的日期时间字符串。日期和时间使用空格连接。
   * Example: 
   * 
   *     new Date().dateTimeText12HM; //在中文下输出: "2022/10/06 下午02:17"
   * 
   * @getter
   */
  dateTimeText12HM: {
    get() {
      return this.dateText + ' ' + this.timeText12HM;
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以24小时制4位年和2位数月日时分秒和3位数毫秒表示的日期时间字符串。日期和时间使用
   * 空格连接，毫秒和时间使用"."连接。
   * Example: 
   * 
   *     new Date().dateTimeMilliText; //在中文下输出: "2021/03/09 15:01:10.120"
   * 
   * @getter
   */
  dateTimeMilliText: {
    get() {
      return this.dateText + ' ' + this.timeText + '.' + Wb.padStart(this.getMilliseconds(), 3, '0');
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地区域以12小时制4位年和2位数月日时分秒和3位数毫秒表示的日期时间字符串。日期和时间使用
   * 空格连接，毫秒和时间使用"."连接。
   * Example: 
   * 
   *     new Date().dateTimeMilliText12; //在中文下输出: "2021/03/09 下午02:17:06.120"
   * 
   * @getter
   */
  dateTimeMilliText12: {
    get() {
      return this.dateText + ' ' + this.timeText12 + '.' + Wb.padStart(this.getMilliseconds(), 3, '0');
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地地区域根据当前时间显示的24小时制最佳时间表示。当天将省略日期部分，当年将省略年。
   * @getter
   */
  prettyText: {
    get() {
      let now = new Date(), date = this;

      if (date >= now.datePart)
        return date.timeTextHM;
      else if (date.getFullYear() == now.getFullYear())
        return Date.monthDayFormatter.format(date) + ' ' + date.timeTextHM;
      else
        return date.dateTimeTextHM;
    },
    configurable: true
  },
  /** 
   * @property {String} - 当地地区域根据当前时间显示的12小时制最佳时间表示。当天将省略日期部分，当年将省略年。
   * @getter
   */
  prettyText12: {
    get() {
      let now = new Date(), date = this;

      if (date >= now.datePart)
        return date.timeText12HM;
      else if (date.getFullYear() == now.getFullYear())
        return Date.monthDayFormatter.format(date) + ' ' + date.timeText12HM;
      else
        return date.dateTimeText12HM;
    },
    configurable: true
  },
  /** 
   * @property {String} - 以文本表示的日期值。字符串还原为日期值时可访问{#String.dateValue}属性。
   * Example: 
   * 
   *     new Date().textValue; //输出: "2022-08-25 15:53:36.328"
   * 
   * @getter
   */
  textValue: {
    get() {
      let date, year;

      if (Wb.isServer) {
        date = this;
      } else {
        let offset = Wb.configs.tzOffset;
        date = offset ? this.addHour(offset) : this;
      }
      year = date.getFullYear();
      //测试是否是一个有效的日期值
      if (isNaN(year))
        return 'Invalid Date';
      if (year < 0)
        year = '-' + year.toString().substr(1).padStart(4, '0');
      else
        year = year.toString().padStart(4, '0');
      let result, h = date.getHours(), m = date.getMinutes(),
        s = date.getSeconds(), ms = date.getMilliseconds();
      result = year.toString() + '-' + Wb.padStart(date.getMonth() + 1, 2, '0') + '-' +
        Wb.padStart(date.getDate(), 2, '0');
      if (h || m || s || ms)
        result += ' ' + Wb.padStart(h, 2, '0') + ':' + Wb.padStart(m, 2, '0') + ':'
          + Wb.padStart(s, 2, '0');
      if (ms)
        result += '.' + Wb.padStart(ms, 3, '0')
      return result;
    },
    configurable: true
  },
  /** @property {Boolean} - 判断当前时间是否为闰年。 */
  isLeapYear: {
    get() {
      let year = this.getFullYear();
      return (year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0);
    },
    configurable: true
  },
  /** @property {Date} - 返回限定日期年份从-9999到9999的值，超过范围之外的年份值将取除10000后的余数。 @getter */
  constrainValue: {
    get() {
      let date = new Date(this), year = date.getFullYear();
      if (year > 9999 || year < -9999)
        date.setFullYear(year % 10000);
      return date;
    },
    configurable: true
  },
  /** @property {Date} - 当前日期所在月份的第1天日期值。 @getter */
  monthFirstDate: {
    get() {
      return new Date(this.getFullYear(), this.getMonth(), 1);
    },
    configurable: true
  },
  /** @property {Date} - 当前日期所在月份的最后1天日期值。 @getter */
  monthLastDate: {
    get() {
      return new Date(this.getFullYear(), this.getMonth() + 1, 0);
    },
    configurable: true
  },
  /** @property {Number} - 当前日期所在月份的天数。 @getter */
  monthDays: {
    get() {
      return this.monthLastDate.getDate();
    },
    configurable: true
  },
  /**
   * @property {Date} - 当前日期所在周星期一的日期值。该属性把星期一作为每周的第一天，
   * 如果需要把星期日作为每周的第一天请使用sundayDate属性。
   * @getter
   */
  mondayDate: {
    get() {
      let date = new Date(this);

      date.setDate(date.getDate() - (date.getDay() || 7) + 1);
      return date;
    },
    configurable: true
  },
  /**
   * @property {Date} - 当前日期所在周星期日的日期值。该属性把星期日作为每周的第一天，
   * 如果需要把星期一作为每周的第一天请使用mondayDate属性。
   * @getter
   */
  sundayDate: {
    get() {
      let date = new Date(this);

      date.setDate(date.getDate() - date.getDay());
      return date;
    },
    configurable: true
  },
  /** @property {Date} - 获取当前日期的日期部分值。 @getter */
  datePart: {
    get() {
      return new Date(this.getFullYear(), this.getMonth(), this.getDate());
    },
    configurable: true
  },
  /** @property {Date} - 获取当前日期的时间部分值。 @getter */
  timePart: {
    get() {
      return new Date(1970, 0, 1, this.getHours(), this.getMinutes(), this.getSeconds());
    },
    configurable: true
  }
});
/**
 * Wb基类，为所有Wb类的根类。该类定义了一些最基本的属性和方法。
 */
Cls['Wb.Base'] = class base {
  /** @property {Object} - 设置到类原型的对象，将把该对象中的所有成员复制到原型。如果类为mixin该属性无效。 */
  static protos = {
    /** @property {Boolean} instanced 组件是否实例化。在设计阶段表示是否自动实例化该组件，在运行阶段表示是否已经实例化。 */
    /** @property {String[]} suspendedEvents 暂停触发的所有事件名称列表。 @priv */
    /** @property {Number} - 挂起所有事件执行的次数。 @priv */
    suspendedCount: 0
  };
  /** @property {Function} - 当前类的父类。 */
  static get parentClass() {
    return Object.getPrototypeOf(this);
  }
  /**
   * 按指定方法合并指定名称的当前类静态属性值同父类该名称的静态属性值，合并到的属性名称为“all"+name.capital。
   * Example: 
   *
   *     this.mergeMembers('firstNames', (parent, self) => parent.unique(self, true));
   *
   * @param {String} name 成员名称。
   * @param {Function} mergeFn 合并的方法。方法需返回合并后的值。
   * @param {Function} mergeFn.parentValue 父类值。
   * @param {Function} mergeFn.selfValue 当前类值。
   * @param {Function} [rootCls] 合并的根类，默认为Wb.Base。
   * @return {Object} 合并后的值。
   */
  static mergeMembers(name, mergeFn, rootCls) {
    let allName = 'all' + name.capital, allName$ = allName + '$';

    if (!rootCls)
      rootCls = Wb.Base;
    if (this === rootCls) {
      return this[allName$] = this[name];
    } else {
      let parentValues = this.parentClass[allName];
      return this[allName$] = Wb.hasProperty(this, name) ? mergeFn(parentValues, this[name]) : parentValues;
    }
  }
  /** @property {Object} - 当前类原型中的setter属性名称组成的对象合并父类该值后的值。 @priv */
  static get setterNames() {
    if (!Wb.hasProperty(this, 'setterNames$')) {
      let map = Object.getOwnPropertyDescriptors(this.prototype), setters = {};
      Wb.each(map, (k, v) => {
        if (v.set)
          setters[k] = true;
      });
      this.setterNames$ = Wb.apply(setters, this.parentClass.setterNames);
    }
    return this.setterNames$;
  }
  /** @property {Object} - 当前类静态和原型中的所有成员名称组成的对象合并父类该值后的值。键为名称，值为是否为方法。 @priv */
  static get allMembers() {
    let me = this;
    if (!Wb.hasProperty(me, 'allMembers$')) {
      let map, names = {};
      map = Object.getOwnPropertyDescriptors(me.prototype)
      Wb.each(map, (k, v) => {
        names[k] = Wb.isFunction(v.value);
      });
      map = Object.getOwnPropertyDescriptors(me);
      Wb.each(map, (k, v) => {
        names[k] = Wb.isFunction(v.value);
      });
      me.allMembers$ = Wb.apply(names, me.parentClass.allMembers);
    }
    return me.allMembers$;
  }
  /**
   * 当前对象转换为JSON的方法。
   * @return {String} 表示当前对象的JSON字符串。
   * @function toJSON
   */
  /**
   * 当前对象转换为字符串的方法。
   * @return {String} 表示当前对象的字符串。
   * @function toString
   */
  /** @property {String} cname 类简名。 @code */
  /**
   * 触发指定名称的事件，事件关联的所有方法都将被执行。事件可由对象的{#on}方法或{#events}属性设置。如果事件
   * 对应的方法返回false，将立即中断事件的继续传播和触发。
   * Example: 
   *
   *     let continue  = container.fireEvent('remove', component);
   *
   * @param {String} eventName 事件名称。
   * @param {...Object} [args] 事件参数。
   * @return {Boolean} 如果事件对应的任意一个方法返回了false，那么返回false，否则返回true。
   */
  fireEvent(eventName, ...args) {
    let event = this.events$?.[eventName];
    if (!event || this.suspendedCount > 0 || this.suspendedEvents?.includes(eventName))
      return true;
    let item, options, i, j = event.length - 1;
    for (i = j; i >= 0; i--) {
      item = event[i];
      options = item.options;
      if (options?.once)
        event.splice(i, 1);
      if (item.fn.call(item.scope ?? this, ...args, options) === false)
        return false;
    }
    return true;
  }
  /**
   * 暂停当前对象的事件触发。暂停后可通过{#resumeEvent}恢复事件触发。
   * @param {String} [eventName] 如果该参数为null或空，表示所有事件。
   */
  suspendEvent(eventName) {
    if (eventName) {
      this.suspendedEvents ??= [];
      this.suspendedEvents.push(eventName);
    } else {
      this.suspendedCount++;
    }
  }
  /**
   * 恢复触发当前对象通过{#suspendEvent}方法暂停的事件。
   * @param {String} [eventName] 如果该参数为null或空，表示所有事件。
   */
  resumeEvent(eventName) {
    if (eventName) {
      this.suspendedEvents?.remove(eventName);
    } else {
      if (this.suspendedCount > 0)
        this.suspendedCount--;
    }
  }
  /**
   * 注册一个或多个对象事件。这些事件关联的方法可以通过{#fireEvent}触发运行。当对象被销毁时，
   * 事件将自动被注销。对于具有相同函数的事件，系统仅允许注册一次，后续多次重复的注册将无效。
   * 注销事件请使用{#un}方法。
   * Example: 
   *
   *     view.on('load', handlerFn, scope, {once: true}); //首个参数为事件名称
   *     view.on({scope: container, load: handlerFn, remove: {fn: onRemoveFn,  once: true}}); //首个参数为对象
   *
   * @param {Object/String} configs 事件名称或监听配置对象。当该值为字符串时，表示参数为事件名称。\
   * 当该值为对象时，表示参数为事件配置对象，对象中每个值为方法的成员其名称为事件名称，\
   * 值为事件方法；每个值为对象的成员其名称为事件名称，值为事件的配置对象，其属性同configs参数。\
   * 名称为scope的成员值为默认的scope值。
   * @param {Boolean} [configs.once] 事件是否单次执行，如果设置为true，事件执行一次后即被注销。
   * @param {Object} [configs.scope] 事件方法内this指向的对象，默认为对象本身。
   * @param {Function} [configs.fn] 事件的方法，仅用于配置对象作为事件成员时。
   * @param {Object} [configs.xxx] 任意名称的自定义参数。
   * @param {Function} [fn] 事件方法。仅当configs为事件名称时有效。
   * @param {...Object} [fn.args] 调用事件时的参数。
   * @param {Object} [fn.options] 传递的options参数。如果通过对象的方式配置事件，options为对象中的所有成员。
   * @param {Object} [scope] 事件方法内this指向的对象，默认为对象本身。仅当configs为事件名称时有效。
   * @param {Object} [options] 选项对象，见configs配置说明，当事件方法运行时也将传递该参数作为fn的options。
   * 仅当configs为事件名称时有效。
   */
  on(configs, fn, scope, options) {
    let event;

    if (Wb.isObject(configs) && !fn) {
      scope = configs.scope;
      Wb.each(configs, (k, v) => {
        if (k == 'scope')
          return;
        //k为事件名称，v为配置对象
        if (Wb.isObject(v)) {
          this.events$ ??= {};
          this.addProxyEvent?.(k);
          event = this.events$[k] ??= [];
          if (event.some(item => item.fn == v.fn))
            return;
          if (!v.fn)
            Wb.raise(`Null event "${k}"`);
          event.push({
            fn: v.fn,
            scope: v.scope ?? scope,
            options: v
          });
        }
        //v为事件方法
        else if (Wb.isFunction(v)) {
          this.events$ ??= {};
          this.addProxyEvent?.(k);
          event = this.events$[k] ??= [];
          if (event.some(item => item.fn == v))
            return;
          event.push({ fn: v, scope });
        } else {
          if (v == null)
            Wb.raise(`Null event "${k}"`);
          else
            Wb.raise(`Invalid event "${k}"`);
        }
      });
    } else {
      this.events$ ??= {};
      this.addProxyEvent?.(configs);
      event = this.events$[configs] ??= [];
      if (event.some(item => item.fn == fn))
        return;
      if (!fn)
        Wb.raise(`Null event "${configs}"`);
      event.push({ fn, scope, options });
    }
  }
  /**
   * 注销一个或多个通过{#on}方法注册的事件。使用该方法将注销指定对象上具有指定函数的事件。
   * Example: 
   *
   *     view.un('load', handlerFn); //首个参数为事件名称
   *     view.un({load: handlerFn, remove: onRemoveFn}); //首个参数为对象
   *     view.un({load: handlerFn, remove: {fn: onRemoveFn}}); //成员为对象
   *
   * @param {Object/String} configs 事件名称或监听配置对象。当该值为字符串时，表示参数为事件名称。\
   * 当该值为对象时，表示参数为事件配置对象，对象中每个值为方法的成员其名称为事件名称，\
   * 值为事件方法；每个值为对象的成员其名称为事件名称，值为事件的配置对象，其属性同configs参数。\
   * 名称为scope的成员值为默认的scope值。
   * @param {Function} [configs.fn] 事件的方法，仅用于配置对象作为事件成员时。
   * @param {Function} [fn] 需要注销事件关联的方法。仅当configs为事件名称时有效。
   */
  un(configs, fn) {
    if (Wb.isObject(configs)) {
      Wb.each(configs, (k, v) => {
        if (k == 'scope')
          return;
        if (Wb.isObject(v)) {
          fn = v.fn;
          this.events$?.[k]?.removeFirst(item => item.fn === fn);
          this.removeProxyEvent?.(k);
        } else if (Wb.isFunction(v)) {
          this.events$?.[k]?.removeFirst(item => item.fn === v);
          this.removeProxyEvent?.(k);
        }
      });
    } else {
      this.events$?.[configs]?.removeFirst(item => item.fn === fn);
      this.removeProxyEvent?.(configs);
    }
  }
  /**
   * 注册或注销事件。
   * @param {Boolean} status true注册，false注销。
   * @param {...Object} [args] 添加到{#on}/{#un}方法的参数。
   */
  setEvents(status, ...args) {
    if (status)
      this.on(...args);
    else
      this.un(...args);
  }
  /** @property {Object} - 事件的配置对象，用于新注册一个或多个事件。请参考{#on}方法说明。 @code */
  set events(value) {
    this.on(value);
  }
  /***/
  get events() {
    return this.events$;
  }
  /**
   * 清除当前对象的所有事件{#events}。
   */
  clearEvents() {
    this.events$ = undefined;
  }
  /**
   * 设置当前对象指定名称的属性值。
   * Example:
   *
   *     if (foo.bar.button) foo.bar.button.width = 100; // 访问setter
   *     foo.bar.button?.setter('width', 100); // 使用setter方法简化上面代码
   * 
   * @param {String} name 属性名称。
   * @param {Object} value 属性值。
   * @return {Wb.Base} 当前对象本身。
   */
  setter(name, value) {
    this[name] = value;
    return this;
  }
  /**
   * 强制重新设置setter属性值。
   * Example:
   *
   *     tree.resetter('plainTable', 'auto');
   * 
   * @param {String} name 属性名称。
   * @return {Wb.Base} 当前对象本身。
   */
  resetter(name) {
    let me = this, name$ = name + '$', oldValue;

    oldValue = me[name$];
    me[name$] = undefined;
    me[name] = oldValue;
    return me;
  }
}
/**
 * 可配置的对象。该类的构造函数通过传递对象参数configs进行配置，configs中的成员即为类的成员。\
 * 类中可以指定默认的静态configs对象，对象构造时将合并静态configs对象和构造函数入参configs对象。
 * 该类实例化过程如下：
 * 1、合并类静态configs和构造函数入参configs为新的configs对象。
 * 2、执行{#init}方法并触发{#*init}事件。在该步骤中可以重设configs中的setter参数。
 * 3、按非setter成员、{#!firstNames}指定成员和setter成员的先后顺序把configs中的成员依次设置到实例。
 * 4、执行{#ready}方法并触发{#*ready}事件。
 */
Cls['Wb.Configurable'] = class configurable extends Wb.Base {
  /** 
   * @property {String[]} firstNames 优先处理的成员名称。类实例化时，配置对象中firstNames指定的成员将最先被依次设置。
   * 非Setter属性无需设置到firstNames，系统会自动优先处理。
   * Example: 
   * 
   *     $text:{name1: value, setter1: value, setter2: value, setter3: value, name2: value}
   *     如果未指定firstNames将优先设置非setter属性到对象，然后按顺序依次设置setter到对象，默认顺序为: 
   *     name1 -> name2 -> setter1 -> setter2 -> setter3
   *     如果设置firstNames为['setter3', 'setter2']，设置到对象的顺序为: 
   *     name1 -> name2 -> setter3 -> setter2 -> setter1
   *  
   * @priv
   */
  static firstNames = ['app']; //app要先设置便于子组件继承。
  /** @property {Array} - 当前类静态{#!firstNames}值合并父类该属性值后的值。 @priv */
  static get allFirstNames() {
    if (!Wb.hasProperty(this, 'allFirstNames$')) {
      let setterNames = this.setterNames;
      this.allFirstNames$ = this.mergeMembers('firstNames',
        (parent, self) => parent ? parent.unique(self, true) : self, Wb.Configurable);
      //检查是否把非setter属性设置为了firstNames
      this.allFirstNames$.forEach(name => {
        if (!setterNames[name])
          Wb.raise(`Name "${name}" set to firstNames must be a setter`);
      });
    }
    return this.allFirstNames$;
  }
  /** @property {Object} - 当前类原型中的{#setterName}属性名称去掉{#allFirstNames}后的值。 @priv */
  static get setterLastNames() {
    if (!Wb.hasProperty(this, 'setterLastNames$')) {
      let setterNames = this.setterNames, firstNames = this.allFirstNames, name, lastNames = {};

      for (name in setterNames) {
        if (!firstNames.includes(name))
          lastNames[name] = true;
      }
      this.setterLastNames$ = lastNames;
    }
    return this.setterLastNames$;
  }
  /** @property {Object} - 当前类静态{#!configs}值合并父类该属性值后的值。 @priv */
  static get allConfigs() {
    if (!Wb.hasProperty(this, 'allConfigs$'))
      this.allConfigs$ = this.mergeMembers('configs', (parent, self) => Wb.apply({}, parent, self), Wb.Configurable);
    return this.allConfigs$;
  }
  /**
   * 通过配置对象创建对象实例，如果对象已经被实例化将直接返回该对象。配置对象的cname属性指定了类简称，如果未指定cname，
   * 且配置对象具有items属性，那么cname为"container"，否则为"component"。
   * Example: 
   * 
   *     let btn = Wb.Create({cname: 'button'}); //创建Button
   * 
   * @param {Object} configs 用于创建对象的配置对象。
   * @return {Wb.Base} 对象实例。
   */
  static create(configs) {
    if (configs?.instanced)
      return configs;
    let cname, cls;

    cname = configs.cname || (configs.items ? 'container' : 'component');
    cls = Wb.classes[cname];
    if (!cls)
      Wb.raise(`Invalid cname "${cname}"`);
    return new cls(configs);
  }
  static protos = {
    /**
     * 构造函数开始执行时执行的方法。该方法在设置非setter属性后，setter属性前执行。重置的非setter属性可直接设置到this对象，
     * 重置的setter属性可设置到configs参数。可以重载该方法执行初始化相关的操作。
     * Example: 
     * 
     *     super.init(configs);
     *     doSomething();
     * 
     * @param {Object} configs 所有需要被设置的参数。该对象是一个副本，可以被更改。
     * @priv
     */
    init: Wb.emptyFn,
    /**
     * 构造函数结束执行时执行的方法。可以重载该方法执行初始化完成后相关的操作。
     * Example: 
     * 
     *     super.ready(configs);
     *     doSomething();
     * 
     * @param {Object} configs 所有需要被设置的参数。该对象是一个副本，可以被更改。
     * @priv
     */
    ready: Wb.emptyFn
  };
  /** @property {Object} configs 默认的configs对象。该属性会自动合并所有上级该属性，
   * 如果对象成员名称重复，下级的成员将覆盖上级的成员。
   * @static @priv
   */
  /** @property {Boolean} capture 事件是否最先设置，false最后设置，true最先设置。该属性可以控制事件是否在初始
   * 化时触发，例如text控件在实例化时，默认设置value属性时不会触发change事件，当初始化value属性需要触发change事件时，
   * 可以设置该属性为true。如果需要灵活控制多个事件，请使用{#on}方法。默认为false。 @key
   */
  /** @property {Boolean} isProperty 标识该组件是否作为上级组件的属性，其{#cid}属性为属性名称。 */
  /**
   * 构造函数。
   * @param {Object} [configs] 配置对象，对象中除undefined外的所有成员值将被设置到类实例。\
   * 对象中的成员处理的先后顺序由{#!firstNames}属性指定。
   */
  constructor(configs) {
    let allConfigs = {}, me;

    super(configs);
    me = this;
    //合并configs
    Wb.apply(allConfigs, me.constructor.allConfigs, configs);
    //设置非setter属性
    me.initConfigs(allConfigs)
    //执行初始化init方法和事件
    me.init(allConfigs);
    allConfigs.events?.init?.call(me, allConfigs);
    //把属性设置到实例
    me.applyConfigs(allConfigs);
    //执行最终ready方法和事件
    me.ready(allConfigs);
    me.fireEvent('ready', allConfigs);
    me.instanced = true;
  }
  /**
   * @event init 在对象初始化时触发，设置setter属性值可访问configs参数，设置非setter属性可访问this对象。实例化完成
   * 后的事件请参考{#*ready}。
   * @param {Object} configs 所有需要被设置的参数。该对象是一个副本，可以被更改。
   */
  /**
   * @event ready 在对象实例化完成后触发。初始化时的事件请参考{#*init}。
   * @param {Object} configs 所有需要被设置的参数。该对象是一个副本，可以被更改。
   */
  /**
   * 把指定配置项对象的所有非setter成员值设置到当前组件。 @priv
   * @param {Object} configs 配置对象。
   */
  initConfigs(configs) {
    let name, value, setterNames = this.constructor.setterNames;

    for (name in configs) {
      if (!setterNames[name]) {
        value = configs[name];
        if (value !== undefined)
          this[name] = value;
      }
    }
  }
  /**
   * 把指定配置项对象的所有setter成员值按特定的先后顺序依次设置到当前组件。 @priv
   * @param {Object} configs 配置对象。
   */
  applyConfigs(configs) {
    let i, j, name, value, ct = this.constructor, capture = configs.capture,
      events = configs.events, setterNames = ct.setterLastNames, firstNames = ct.allFirstNames;

    if (events) {
      configs.events = undefined;
      if (capture)
        this.events = events;
    }
    //优先设置firstNames中配置的属性
    j = firstNames.length;
    for (i = 0; i < j; i++) {
      name = firstNames[i];
      value = configs[name];
      if (value !== undefined)
        this[name] = value;
    }
    //最后设置其它setter属性
    for (name in configs) {
      if (setterNames[name]) {
        value = configs[name];
        if (value !== undefined)
          this[name] = value;
      }
    }
    if (events && !capture)
      this.events = events;
  }
  /** @property {String} - 对象标识。可通过{#app}[cid]访问组件实例。 @key */
  set cid(cid) {
    let me = this, oldCid = this.cid$;
    if (oldCid !== cid) {
      let app = me.app$;
      me.cid$ = cid;
      if (app) {
        if (app[oldCid] == me)
          delete app[oldCid];
        app[cid] = me;
      }
    }
  }
  /***/
  get cid() {
    return this.cid$;
  }
  /** @property {Object} - 把当前对象的cid及实例引用设置到该对象，以方便通过cid来直接访问实例。 @code */
  set app(value) {
    let oldObject = this.app$;
    if (oldObject !== value) {
      let cid = this.cid$;
      this.app$ = value;
      if (cid) {
        if (oldObject?.[cid] == this)
          delete oldObject[cid];
        value[cid] = this;
      }
    }
  }
  /***/
  get app() {
    return this.app$;
  }
  /**
   * 销毁当前对象。
   */
  destroy() {
    if (this.app$?.[this.cid$] == this)
      delete this.app$[this.cid$];
  }
}
/**
 * 生成器类，用于生成特定模式的数据资源。
 */
Cls['Wb.Builder'] = class builder extends Wb.Base {
  /**
   * 把以指定符号分隔的字符串组成的数组，按其路径生成树形数据结构。
   * Example:
   *
   *     Wb.Builder.getTree(['abc/def/ghi', 'abc/def/jkl']);
   *
   * @param {Array} items 生成树的数据源。每个条目路径以指定分隔符分隔。
   * @param {String} [separator] 路径分隔符，默认为"/"。
   * @param {String} [icon] 目录图标，默认为"folder1"。
   * @return {Array} 树形数据结构。
   */
  static getTree(items, separator, icon) {
    let result = [], target, object, secs, path;

    separator ??= '/';
    icon ??= 'folder1';
    items = items.unique().sort();
    items.forEach(item => {
      target = result;
      path = '';
      secs = item.split(separator);
      secs.forEach((text, i) => {
        if (i > 0) {
          target = object.items;
          path += separator;
        }
        path += text;
        object = target.find(item => item.text == text);
        if (!object) {
          object = { icon, text, path, items: [] };
          target.push(object);
        }
      });
    });
    return result;
  }
  /**
   * 把有上下级关系的数组，按其上下级关系生成树形数据结构。
   * @param {Array} recs 记录数组。
   * @param {String} [keyName] 主键ID字段名称。默认为"sid"。
   * @param {String} [parentKeyName] 上级ID字段名称。默认为"parent_id"。
   * @param {String/Object} [rootId] 根节点ID值。默认为"0"。
   * @param {String} [itemsName] 下级条目属性名称，默认为"items"。
   * @return {Array} 树形数据结构。
   */
  static getLevelTree(recs, keyName, parentKeyName, rootId, itemsName) {
    let result = {}, records = {}, nodes, parentValue, createNodes, subItems;

    keyName ??= 'sid';
    parentKeyName ??= 'parent_id';
    itemsName ??= 'items';
    rootId ??= '0';
    createNodes = (items, parentId) => {
      subItems = items[itemsName] = records[parentId] || [];
      subItems.forEach(item => createNodes(item, item[keyName]));
    }
    recs.forEach(record => {
      parentValue = record[parentKeyName];
      nodes = records[parentValue];
      if (nodes) {
        nodes.push(record);
      } else {
        nodes = [record];
        records[parentValue] = nodes;
      }
    });
    createNodes(result, rootId);
    return result;
  }
  /**
   * 把有上下级关系的数组，按其上下级关系生成树形数据结构，并返回指定节点及其所有子节点keyName列表。
   * @param {Array} recs 记录数组。
   * @param {Object/Array} parentId 查找节点ID值或其列表。
   * @param {String} [keyName] 主键ID字段名称。默认为"sid"。
   * @param {String} [parentKeyName] 上级ID字段名称。默认为"parent_id"。
   * @param {Boolean} [excludeSelf] 是否排除节点本身。
   * @return {Array} 指定节点及其所有子节点keyName列表。
   */
  static getTreeItems(recs, parentId, keyName, parentKeyName, excludeSelf) {
    let result = [], findId, id;

    findId = pid => {
      recs.forEach(rec => {
        if (rec[parentKeyName] == pid) {
          id = rec[keyName];
          result.push(id);
          findId(id);
        }
      });
    }
    keyName ??= 'sid';
    parentKeyName ??= 'parent_id';
    parentId = parentId ? Wb.toArray(parentId) : [];
    if (!excludeSelf)
      result.pushAll(parentId);
    parentId.forEach(item => findId(item));
    return result.unique();
  }
}