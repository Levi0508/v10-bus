/**
 * File content searcher
 * @class $path
 */
class FileSearcher {
  /** @property {String[]} paths List of searched paths @priv */
  /** @property {String} searchText Search text content @priv */
  /** @property {String[]} fileTypes File types @priv */
  /** @property {Object} options Search options @priv */
  /** @property {Number} count Max count of search items @priv */
  /** @property {Array} rows Search result @priv */
  /**
   * The constructor
   * @param {String[]} paths List of searched paths
   * @param {String} searchText Search text content
   * @param {String} fileTypes File types
   * @param {Object} options Search options
   * @param {Number} [count] count Max count of search items. Default is 1000
   * @param {String} [replaceTo] Replace to it
   */
  constructor(paths, searchText, fileTypes, options, count, replaceTo) {
    let me = this;

    me.paths = paths;
    me.searchText = searchText;
    me.fileTypes = fileTypes.splitTrim();
    me.options = options;
    me.count = count ?? 1000;
    me.replaceTo = replaceTo;
  }
  /**
   * Performs a search-replace operation on all files at the specified path.
   * @return {Array} Search result
   */
  searchReplace() {
    let me = this, includeLibs = me.options.includeLibs, filePath,
      libPath = new Wb.File(true, 'wb/libs').path, dataPath = new Wb.File(true, 'wb/docs/data.js').path;

    me.rows = [];
    me.paths.each(path => {
      path = new Wb.File(path);
      if (path.isFile) {
        if (!me.doSearch(path))
          return false;
      } else {
        if (path.cascade(file => {
          if (file.isMinFile)
            return;
          filePath = file.path;
          if (!includeLibs && filePath == libPath)
            return null;
          if (file.isFolder || filePath == dataPath)
            return;
          if (!me.doSearch(file))
            return false;
        }) === false)
          return false;
      }
    });
    return me.rows;
  }
  /**
   * Performs a search operation on the specified file @priv
   * @param {Wb.File} file search file
   * @return {Boolean} true means done, false means search aborted
   */
  doSearch(file) {
    let me = this;

    if (!me.fileTypes.some(type => file.match(type)))
      return true;
    let options = me.options, regExp, text, replacedText, path = file.path, searchText = me.searchText,
      replaceTo = me.replaceTo, hasReplace = replaceTo != null;

    regExp = options.regularExpress ? searchText : searchText.regexpText;
    if (options.wholeWord)
      regExp = '\\b' + regExp + '\\b';
    regExp = new RegExp(regExp, 'g' + (options.caseSensitive ? '' : 'i'));
    text = file.text;
    if (file.name.endsWith('.xwl')) {
      let properties, events, cid, subPath, result, object;
      try {
        object = Wb.decode(text);
      } catch (e) {
        Wb.raise('Invalid file "' + file.path + '".');
      }
      result = Wb.cascade([object], (item, parent) => {
        properties = item.properties;
        events = item.events;
        cid = properties.cid;
        subPath = parent ? (parent.path + '.' + cid) : cid;
        item.path = subPath;
        if (Wb.each(properties, (k, v) => {
          if (hasReplace)
            properties[k] = v.replaceAll(regExp, replaceTo);
          else {
            if (me.addMatchs(k.matchAll(regExp), path, subPath, k, 'properties', v.substr(0, 30)) === false)
              return false;
            if (me.addMatchs(v.matchAll(regExp), path, subPath, k, 'properties') === false)
              return false;
          }
        }) === false)
          return false;
        if (Wb.each(events, (k, v) => {
          if (hasReplace)
            events[k] = v.replaceAll(regExp, replaceTo);
          else {
            if (me.addMatchs(k.matchAll(regExp), path, subPath, k, 'events', v.substr(0, 30)) === false)
              return false;
            if (me.addMatchs(v.matchAll(regExp), path, subPath, k, 'events') === false)
              return false;
          }
        }) === false)
          return false;
      });
      if (hasReplace) {
        Wb.cascade([object], item => delete item.path);
        replacedText = Wb.encode(object);
        if (text != replacedText) {
          file.text = replacedText;
          file.clearBuffer();
        }
        return true;
      } else {
        return result;
      }
    } else {
      if (hasReplace) {
        replacedText = text.replaceAll(regExp, replaceTo);
        if (text != replacedText) {
          file.text = replacedText;
          file.clearBuffer();
        }
        return true;
      } else {
        return me.addMatchs(file.text.matchAll(regExp), path);
      }
    }
  }
  /**
   * Adds the searched results to the result set @priv
   * @param {Object} matchs The match
   * @param {String} path File path
   * @param {String} [compPath] Node sub path
   * @param {String} [propName] Property name
   * @param {String} [propType] Property type
   * @param {String} [valueText] Value part text, means a property name.
   * @return {Boolean} true means done, false means search aborted
   */
  addMatchs(matchs, path, compPath, propName, propType, valueText) {
    let m, str, input, index, strLen, result, content, me = this, lastIndex = 0,
      count = me.count, rows = me.rows, lineNumber = 0;

    for (m of matchs) {
      index = m.index;
      str = m[0];
      strLen = str.length;
      input = m.input;
      content = '';
      if (index > 40)
        content += '...';
      content += input.substring(index - 40, index).htmlLine + '<span class="w-key-color">' +
        str.htmlLine + '</span>' + input.substr(index + strLen, 40).htmlLine;
      if (input.length > index + strLen + 40)
        content += '...';
      lineNumber += input.substring(lastIndex, index).occur('\n');
      result = {
        path, content: valueText ? (content + ': ' + valueText.htmlLine) : content, lineNumber: valueText ? 1 : (lineNumber + 1),
        column: valueText ? 1 : (index - input.lastIndexOf('\n', index))
      };
      if (compPath)
        Wb.apply(result, { compPath, propName, propType });
      rows.push(result);
      if (rows.length >= count)
        return false;
      lastIndex = index;
    }
    return true;
  }
}
export default FileSearcher;