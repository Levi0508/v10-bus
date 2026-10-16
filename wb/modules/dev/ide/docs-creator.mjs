/*
 * wb-docs-creator.js WebBuilder Document Creator
 * Copyright (c) Geejing
 * https://www.geejing.com
 */
/**
 * WebBuilder documents creator.
 */
class DocsCreator {
  /** @property {RegExp} - Regexp of class name without extensions @priv */
  static clsExp = /\bCls\b\[[\"|'](.*)[\"|']\]\s*=\s*\bclass\b\s+(.*)\s*{/;
  /** @property {RegExp} - Regexp of class name with extensions @priv */
  static clsExpExtends = /\bCls\b\[[\"|'](.*)[\"|']\]\s*=\s*\bclass\b\s+(.*)\s*\bextends\b\s*(.*)\s*{/;
  /** @property {RegExp} - Regexp of class name with mixin @priv */
  static clsMixin = /\bCls\b\[[\"|'](.*)[\"|']\]\s*=\s*.*\s*=>\s*\bclass\b\s+(.*)\s*\bextends\b\s*(.*)\s*{/;
  /** @property {Array} - Reserved key names @priv */
  static reservedNames = ['constructor', 'toString'];
  /** Constructor function */
  constructor() {
    this.docs = {};
    this.scripts = [];
  }
  /**
   * Add the script document to be compiled.
   * @param {String} script Compiled script
   * @param {String} path Path of script
   */
  addScript(script, path) {
    this.scripts.push([script, path]);
  }
  /**
   * Add WebBuilder documentation to be compiled.
   * @param {Object} doc Compiled docs
   */
  addDoc(doc) {
    this.docs[doc.cls] = doc;
  }
  /**
   * Gets the class name after the specified location
   * @param {String} script Scan Script
   * @param {Number} start Start pos
   * @return {String} Class name
   * @priv
   */
  findClass(script, start) {
    let pos, result, extendsCls, mixin;

    pos = script.indexOf('{', start);
    if (pos == -1)
      return null;
    script = script.substring(start, pos + 1);
    if (result = script.match(this.constructor.clsExpExtends)) {
      extendsCls = result[3].trim();
      extendsCls = extendsCls.split('(');
      if (extendsCls.length > 1) {
        mixin = extendsCls;
        extendsCls = mixin.pop();
        extendsCls = extendsCls.replaceAll(')', '');
      } else {
        mixin = null;
        extendsCls = extendsCls[0];
      }
      return {
        cls: result[1],
        cname: result[2].trim(),
        extend: extendsCls,
        mixin
      };
    } else if (result = (script.match(this.constructor.clsExp) || script.match(this.constructor.clsMixin))) {
      return {
        cls: result[1],
        cname: result[2].trim()
      };
    } else {
      return null;
    }
  }
  /**
   * Gets the function name after the specified location.
   * @param {String} script Scan script
   * @param {Number} start Start pos
   * @return {String} Function name
   * @priv
   */
  getFunctionName(script, start) {
    let i, j, k, s, l = Wb.maxInt,
      chars = '(:=;\n';

    j = chars.length;
    for (i = 0; i < j; i++) {
      k = script.indexOf(chars[i], start);
      if (k != -1)
        l = Math.min(l, k);
    }
    s = script.substring(start, l).trim();
    if (s.startsWith('function'))
      s = s.substring(8);
    return s.trim();
  }
  /**
   * Gets a fragment of a specific space split in a document.
   * @param {String} content Scan content
   * @param {Boolean} longSection true means consists of 3 sections and false means consists of 2 sections.
   * @return {Array} All sections
   * @priv
   */
  getSections(content, longSection) {
    let str, i, j = longSection ? 3 : 2,
      k = j - 1,
      begin = 0,
      end = 0,
      sections = [];

    content = content.trimLeft();
    for (i = 0; i < j; i++) {
      if (i == k) {
        str = content.substring(begin);
      } else {
        end = content.indexOf(' ', begin);
        if (end == -1)
          end = content.length;
        str = content.substring(begin, end);
        begin = end + 1;
      }
      sections.push(str.trim());
    }
    return sections;
  }
  /**
   * Gets the content inside the parentheses.
   * @param {String} content Scan content.
   * @return {String} Remove the contents of the preceding and following parentheses.
   * @priv
   */
  getKeyword(content) {
    return content.substring(1, content.length - 1);
  }
  /**
   * Compiles the specified script and generates the document.
   * @priv
   */
  compileScript() {
    let me, begin, end, str, enterPos, first, item, keyType, keyTitle, isGetter, isSetter, itemCls,
      doc, docs, pos, lines, section, sections, category, lastIsGetter, params, keyItem, segScript,
      existsDoc, absentName, isStatic, name, funcName, accessorName, cls, className, script, path;

    docs = this.docs;
    me = this;
    me.scripts.forEach(scriptItem => {
      doc = null;
      script = scriptItem[0];
      path = scriptItem[1];
      end = 0;
      while (true) {
        do {
          begin = script.indexOf('/**', end);
          if (begin == -1)
            break;
          //Determine whether the comments are blank before they start
          if (!script.substring(script.lastIndexOf('\n', begin), begin - 1).trim())
            break;
          end = begin + 3;
        } while (true);
        if (begin == -1)
          break;
        end = script.indexOf('*/', begin + 3);
        if (end == -1)
          break;
        pos = script.lastIndexOf('\n', begin);
        //Invalid comment is returned
        if (pos != -1 && script.substring(pos + 1, begin).trim())
          break;
        item = {};
        name = null;
        category = null;
        isStatic = false;
        segScript = script.substring(begin + 2, end - 1);
        //Remove the * sign at the beginning of each line
        lines = segScript.split('\n');
        str = '';
        first = true;
        lines.forEach(line => {
          if (first)
            first = false;
          else
            str += '\n';
          line = line.trim();
          if (line.startsWith('*'))
            line = line.substr(1);
          str += line;
        });
        //Resolve tags starting with each " @"
        lines = str.split(' @');
        //Title
        str = lines[0].trim();
        if (str != '')
          item.title = str;
        lines.erase(0);
        lines.forEach(line => {
          line = line.trim();
          pos = line.indexOf(' ');
          enterPos = line.indexOf('\n');
          if (enterPos != -1 && enterPos < pos)
            pos = enterPos;
          if (pos == -1) {
            str = line;
            section = '';
          } else {
            str = line.substring(0, pos);
            section = line.substr(pos + 1);
          }
          switch (str) {
            case 'property':
              category = str;
              sections = me.getSections(section, true);
              keyType = me.getKeyword(sections[0]);
              name = sections[1];
              keyTitle = sections[2];
              funcName = me.getFunctionName(script, script.indexOf('\n', end) + 1);
              if (funcName.startsWith('static ')) {
                category = 'sproperty';
                funcName = funcName.substr(7).trimLeft();
              }
              accessorName = funcName.lastItem(' ');
              absentName = !name || name == '-';
              isGetter = segScript.includes('@getter');
              isSetter = segScript.includes('@setter')
              if (absentName || name == accessorName || isGetter || isSetter) {
                if (funcName.startsWith('get ') || isGetter) {
                  lastIsGetter = true;
                  keyItem = item.getter = {};
                } else if (funcName.startsWith('set ') || isSetter) {
                  lastIsGetter = false;
                  keyItem = item.setter = {};
                } else {
                  keyItem = item;
                }
                if (absentName)
                  name = accessorName;
              } else {
                keyItem = item;
              }
              if (keyType)
                keyItem.type = keyType;
              if (keyTitle)
                keyItem.title = keyTitle;
              break;
            case 'event':
              category = str;
              sections = me.getSections(section, false);
              name = sections[0];
              item.title = sections[1];
              break;
            case 'param':
              sections = me.getSections(section, true);
              let param = {};
              if (!item.params) {
                if (item.setter || item.getter) {
                  if (lastIsGetter) {
                    if (item.getter.params)
                      params = item.getter.params;
                    else
                      params = item.getter.params = [];
                  } else {
                    if (item.setter.params)
                      params = item.setter.params;
                    else
                      params = item.setter.params = [];
                  }
                } else {
                  if (item.params)
                    params = item.params;
                  else
                    params = item.params = [];
                }
              }
              params.push(param);
              param.type = me.getKeyword(sections[0]);
              param.optional = sections[1].indexOf('[') != -1;
              param.name = param.optional ? me.getKeyword(sections[1]) : sections[1];
              param.title = sections[2];
              break;
            case 'function':
              category = str;
              name = section;
              if (name == 'constructor')
                name = '$$' + name;
              break;
            case 'return':
              sections = me.getSections(section, false);
              item.return = {
                type: me.getKeyword(sections[0]),
                title: sections[1]
              };
              break;
            case 'static':
              isStatic = true;
              if (category == 'property')
                category = 'sproperty';
              if (category == 'function')
                category = 'sfunction';
              break;
            case 'private':
              item.priv = true;
              break;
            case 'readonly':
            case 'writeonly':
            case 'priv':
            case 'desktop':
            case 'touch':
            case 'override':
            case 'key':
            case 'singleton':
            case 'code':
            case 'container':
            case 'implict':
            case 'noDesign':
              item[str] = true;
              break;
            case 'class':
              item.cls = section;
              break;
            case 'icon':
            case 'lib':
            case 'design':
            case 'mimic':
              item[str] = section;
              break;
            case 'getter':
            case 'setter':
              //ignore
              break;
            default:
              Wb.warn(`Invalid tag "${str}": ${line}`);
          }
        });
        itemCls = item.cls;
        //Define new cls
        if (itemCls) {
          if (docs[itemCls])
            doc = Wb.applyIf(docs[itemCls], item);
          else
            doc = docs[itemCls] = item;
          doc.path ??= path;
        } else {
          //continue append
          if (!category) {
            cls = me.findClass(script, end + 2);
            if (cls) {
              className = cls.cls;
              //find new class
              doc = {
                title: item.title,
                path
              };
              Wb.applyValue(doc, cls);
              if (item.icon)
                doc.icon = item.icon;
              if (item.lib)
                doc.lib = item.lib;
              if (item.mimic)
                doc.mimic = item.mimic;
              if (item.design)
                doc.design = item.design;
              if (item.implict)
                doc.implict = true;
              if (item.noDesign)
                doc.noDesign = true;
              if (item.container)
                doc.container = true;
              if (item.singleton)
                doc.singleton = true;
              if (docs[className])
                doc = docs[className];
              else
                docs[className] = doc;
            } else {
              name = me.getFunctionName(script, script.indexOf('\n', end) + 1) || 'anonymous';
              if (this.constructor.reservedNames.includes(name))
                name = '$$' + name;
              if (!isStatic) {
                isStatic = name.startsWith('static ');
                if (isStatic)
                  name = name.substr(7).trimLeft();
              }
              if (name.startsWith('get ')) {
                lastIsGetter = true;
                name = name.substr(4);
                category = isStatic ? 'sproperty' : 'property';
                item.getter = {};
              } else if (name.startsWith('set ')) {
                lastIsGetter = false;
                name = name.substr(4);
                category = isStatic ? 'sproperty' : 'property';
                item.setter = {};
              } else {
                category = isStatic ? 'sfunction' : 'function';
              }
            }
          }
          if (category) {
            if (!doc) {
              doc = {
                title: 'Untitled'
              };
            }
            if (doc.singleton) {
              if (category == 'property')
                category = 'sproperty';
              if (category == 'function')
                category = 'sfunction';
            }
            if (!doc[category])
              doc[category] = {};
            if (name.startsWith('*') || name.startsWith('/'))
              Wb.warn(`Invalid name "${name}": ` + script.substring(script.lastIndexOf('/*', end), script.lastIndexOf('*/', end)));
            existsDoc = doc[category][name];
            if (existsDoc)
              Wb.apply(existsDoc, item);
            else
              doc[category][name] = item;
          }
        }
      }
    });
  }
  /**
   * Create a control metadata file for server control resolution @priv
   * @return {Objet} Control metadata file. Key is the cls name, and Value is an object composed of all attributes.
   */
  createControlsMeta() {
    let doc = this.docs, object, result = {};
    //Only controls that have icons are extracted
    Wb.each(doc, (k, v) => {
      if (v.icon) {
        object = this.getAllMembers(k);
        object.cname = v.cname;
        result[k] = object;
      }
    });
    return result;
  }
  /**
   * Gets all the members of the specified class and their types.
   * @return {Object} Data object.
   */
  getAllMembers(cls) {
    let params, data, type, isCt = false, parentCls = cls, allCls = [], doc = this.docs,
      properties = {}, events = {}, result, lib, libs = [];

    do {
      allCls.push(parentCls);
      data = doc[parentCls];
      if (data.mixin) {
        allCls.push(...data.mixin);
      }
    } while (parentCls = data.extend);
    allCls.each(cls => {
      data = doc[cls];
      lib = data.lib;
      if (lib) {
        lib = lib.splitTrim();
        lib.forEach((item, i) => {
          if (item.endsWith('*')) {
            item = { url: item.slice(0, -1), async: true };
            lib[i] = item;
          }
        });
        libs.push(...lib);
      }
      if (data.container || cls == 'Wb.Container')
        isCt = true;
      //property
      Wb.each(data.property, (k, v) => {
        if ((v.setter || !v.getter) && !v.priv && !v.readonly && !v.code && k != 'events') {
          type = v.type?.firstItem('/');
          if (!type)
            type = v.setter?.type?.firstItem('/');
          if (type?.endsWith('[]'))
            type = 'Object';
          if (type || !properties[k]) {
            type ??= 'Object';
            properties[k] = type == 'Function' ? ('*' +
              ((v.setter?.params ?? v.params)?.pluck('name').join(', ') ?? '')) : type;
          }
        }
      });
      //event
      Wb.each(data.event, (k, v) => {
        if (v.params) {
          params = [];
          v.params.forEach(item => {
            if (!item.name.startsWith('.'))
              params.push(item.name);
          });
          params.push('options');
          params = params.join(', ');
        } else {
          params = 'options'
        }
        events[k] = params;
      });
    }, true, true);
    result = { properties, events, isCt, implict: doc[cls].implict };
    if (libs.length)
      result.libs = libs;
    return result;
  }
  /**
   * Compiles the specified script document and WebBuilder document.
   */
  build() {
    this.compileScript();
    new Wb.File(true, 'wb/docs/data.js').text = 'globalThis.WbDocsData=' + Wb.encode(this.docs) + ';';
    //create controls.json
    new Wb.File(true, 'wb/system/controls.json').object = this.createControlsMeta();
    ModuleData.load();
  }
}
export default DocsCreator;