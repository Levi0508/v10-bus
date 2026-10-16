/**
 * IDE util.
 */
class Util {
  /**
   * Get image icon list
   * @return {String[]} Image icon list.
   */
  static getImgs() {
    let items = [];
    new Wb.File(true, 'wb/images').each(file => {
      if (file.isFile)
        items.push(file.normalName);
    });
    return items.lowerSort();
  }
  /**
   * Get icon list
   * @return {String[]} icon list.
   */
  static getIcons() {
    return new Wb.File(true, 'wb/css/iconfont.css').text.match(/(?<=\.icon-).*?(?=\:)/g).lowerSort();
  }
  /**
   * Get global variables list
   * @return {Array} Variables list.
   */
  static getGlobalsList() {
    let result = [];

    Wb.each(globalThis, (k, v) => {
      result.push(k);
    });
    return result;
  }
  /**
   * Get ss classes and hint list
   * @return {Object} List object.
   */
  static getSsList() {
    let result = {}, name, names, list, cls, items, item, type;

    Wb.each(globalThis, (k, v) => {
      if (!v)
        return;
      if (Java.isJavaObject(v)) {
        list = {};
        if (v.getClass) {
          //Instance
          cls = v.getClass();
          items = cls.getFields();
          items.forEach(item => list[item.getName()] = 0);
          items = cls.getMethods();
          items.forEach(item => list[item.getName()] = 1);
        } else {
          //Class
          for (name in v)
            list[name] = Wb.isFunction(v[name]) ? 1 : 0;
        }
        if (!Wb.isEmpty(list))
          result[k] = list;
      } else {
        names = Object.getOwnPropertyDescriptors(v);
        list = {};
        for (name in names) {
          item = Wb[name];
          if (Wb.isAlphaNum(name)) {
            if (item?.prototype instanceof Wb.Base || item == Wb.Base)
              type = 2;
            else
              type = Wb.isFunction(item) ? 1 : 0;
            list[name] = type;
          }
        }
        if (!Wb.isEmpty(list))
          result[k] = list;
      }
    });
    return result;
  }
}
export default Util;