/*
 * wb-server.js server javascript library
 * Copyright (c) Geejing
 * https://www.geejing.com
 */
/**
 * 共享的全局变量存放对象。
 * @class Globals
 * @singleton
 */
/** @property {Object} loadedClasses 已经加载类的标识，K为类文件路径，V为标识。成员直接添加到Globals本身。 @priv */
/** @property {Number} maxRows 当限定读取数据库的记录数时的默认值，默认为{{sys.db.maxRows}}配置项值。 */
Wb.apply(Globals, {
  /**
   * 执行模块前的初始化方法。
   * @param {String} path 路径。
   * @param {HttpServletRequest} request 请求对象。
   * @param {HttpServletResponse} response 响应对象。
   * @param {Array} paramNames 参数名称数据。
   * @param {Array} paramValues 参数值数据。
   */
  init(path, request, response, paramNames, paramValues) {
    globalThis.request = request;
    globalThis.response = response;
    globalThis.app = {};
    globalThis.Context = { path, closable: new Set() };
    if (paramNames) {
      globalThis.paramNames = paramNames;
      paramNames.forEach((item, index) => globalThis[item] = paramValues[index]);
    }
  },
  /**
   * 执行模块后的清理方法。
   * @param {Boolean} hasExcept 是否发生异常。
   */
  clear(hasExcept) {
    //需逆向遍历关闭，如rs, st, conn的关闭顺序
    Context.closable.each(item => {
      try {
        item.close(hasExcept);
      } catch (e) {
        Wb.recordError('close error: ' + e?.toString());
      }
    }, true, true);
    if (globalThis.paramNames) {
      paramNames.forEach(item => globalThis[item] = undefined);
      globalThis.paramNames = undefined;
    }
    globalThis.request = undefined;
    globalThis.response = undefined;
    globalThis.app = undefined;
    globalThis.Context = undefined;
  }
});
/**
 * 用于保存JS执行上下文相关参数的对象。
 * @class Context
 * @singleton
 */
/** @property {Object} app 当前上下文保存共享成员的对象。 */
/** @property {String} path 当前上下文路径 */
/** @property {Object} closable 所有可关闭类的实例。 @priv */
/** @property {Object} payloadParams application/json方式提交请求的payload参数。非application/json方式无效。 @priv */
/** @property {String} payload 提交请求的payload文本。 @priv */
/**
 * 全局this对象的扩展类。
 * @class globalThis
 * @singleton
 */
/** @property {Boolean} inWSSession 是否在WebSocket会话内执行xwl模块文件。 */
/** @property {HttpServletRequest} request 请求对象。 */
/** @property {HttpServletResponse} response 响应对象。 */
/** @property {Context} context JS执行上下文。 */
/** @property {Object} Context 用于保存JS执行上下文相关参数的对象。 */
globalThis.Str ??= new Proxy({}, {
  get(_, prop) {
    return Wb.str(prop) ?? null;
  }
});
/** @property {Proxy} Params 请求上下文参数代理对象，通过该代理可以方便地访问参数。 */
globalThis.Params ??= new Proxy({}, {
  get(a, prop) {
    return Wb.get(prop);
  },
  set(target, prop, value) {
    Wb.set(prop, value);
    return true;
  },
  has(target, prop) {
    return Wb.get(prop) != null;
  },
});
Wb.apply(globalThis, {
  setTimeout: Wb.emptyFn,
  setInterval: Wb.emptyFn,
  clearTimeout: Wb.emptyFn,
  clearInterval: Wb.emptyFn,
  /** @property {Object} - 指向globalThis本身。 */
  self: globalThis,
  /** @property {Function} - com.wb.common.Base类。 */
  BaseMap: Java.type('com.wb.common.Base').map,
  /** @property {Function} - byte[]字节数组。 */
  ByteArray: Java.type('byte[]'),
  /** @property {Function} - java.io.File类。 */
  File: Java.type('java.io.File'),
  /** @property {Function} - java.lang.String类。 */
  JavaString: Java.type('java.lang.String'),
  /** @property {Function} - java.lang.Runtime类。 */
  Runtime: Java.type('java.lang.Runtime'),
  /** @property {Function} - java.util.Date类。 */
  JavaDate: Java.type('java.util.Date'),
  /** @property {Function} - java.lang.System类。 */
  System: Java.type('java.lang.System'),
  /** @property {Function} - org.apache.commons.io.FileUtils类。 */
  FileUtils: Java.type('org.apache.commons.io.FileUtils'),
  /** @property {Function} - org.apache.commons.io.IOUtils类。 */
  IOUtils: Java.type('org.apache.commons.io.IOUtils'),
  /** @property {Function} - org.apache.commons.io.FilenameUtils类。 */
  FilenameUtils: Java.type('org.apache.commons.io.FilenameUtils'),
  /** @property {Function} - org.apache.commons.io.IOCase类。 */
  IOCase: Java.type('org.apache.commons.io.IOCase'),
  /** @property {Function} - org.graalvm.polyglot.Source类。 */
  Source: Java.type('org.graalvm.polyglot.Source'),
  /** @property {Function} - org.json.JSONObject类。 */
  JSONObject: Java.type('org.json.JSONObject'),
  /** @property {Function} - org.json.JSONArray类。 */
  JSONArray: Java.type('org.json.JSONArray'),
  /** @property {Function} - com.wb.common.Base类。 */
  Base: Java.type('com.wb.common.Base'),
  /** @property {Function} - com.wb.common.Sessions。 */
  Sessions: Java.type('com.wb.common.Sessions'),
  /** @property {Function} - com.wb.common.Xwl类。 */
  Xwl: Java.type('com.wb.common.Xwl'),
  /** @property {Function} - com.wb.common.Perm类。 */
  Perm: Java.type('com.wb.common.Perm'),
  /** @property {Function} - com.wb.common.Config类。 */
  Config: Java.type('com.wb.common.Config'),
  /** @property {Function} - com.wb.common.ModuleData */
  ModuleData: Java.type('com.wb.common.ModuleData'),
  /** @property {Function} - com.wb.common.Str类。 */
  StrCls: Java.type('com.wb.common.Str'),
  /** @property {Function} - com.wb.common.UrlBuffer类。 */
  UrlBuffer: Java.type('com.wb.common.UrlBuffer'),
  /** @property {Function} - com.wb.util.WebUtil类。 */
  WebUtil: Java.type('com.wb.util.WebUtil'),
  /** @property {Function} - com.wb.util.ZipUtil类。 */
  ZipUtil: Java.type('com.wb.util.ZipUtil'),
  /** @property {Function} - com.wb.util.WSUtil类。 */
  WSUtil: Java.type('com.wb.util.WSUtil'),
  /** @property {Function} - com.wb.util.SysUtil类。 */
  SysUtil: Java.type('com.wb.util.SysUtil'),
  /** @property {Function} - com.wb.util.DateUtil类。 */
  DateUtil: Java.type('com.wb.util.DateUtil'),
  /** @property {Function} - com.wb.util.LogUtil类。 */
  LogUtil: Java.type('com.wb.util.LogUtil'),
  /** @property {Function} - com.wb.util.LogxUtil类。 */
  LogxUtil: Java.type('com.wb.util.LogxUtil'),
  /** @property {Function} - com.wb.util.DbUtil类。 */
  DbUtil: Java.type('com.wb.util.DbUtil'),
  /** @property {Function} - com.wb.util.JsonUtil类。 */
  JsonUtil: Java.type('com.wb.util.JsonUtil'),
  /** @property {Function} - com.wb.util.ExcelUtil类。 */
  ExcelUtil: Java.type('com.wb.util.ExcelUtil'),
  /** @property {Function} - com.wb.util.FileUtil类。 */
  FileUtil: Java.type('com.wb.util.FileUtil'),
  /** @property {Function} - com.wb.util.JobUtil类。 */
  JobUtil: Java.type('com.wb.util.JobUtil'),
  /** @property {Function} - com.wb.util.StringUtil类。 */
  StringUtil: Java.type('com.wb.util.StringUtil'),
  /** @property {Function} - com.wb.graal.SourceBuffer类。 */
  SourceBuffer: Java.type('com.wb.graal.SourceBuffer'),
  /** @property {Function} - com.wb.common.KVBuffer类。 */
  KVBuffer: Java.type('com.wb.common.KVBuffer'),
  /** @property {Function} - com.wb.graal.DebugFiles类。 */
  DebugFiles: Java.type('com.wb.graal.DebugFiles'),
  /** @property {Function} - com.wb.tool.Encrypter类。 */
  Encrypter: Java.type('com.wb.tool.Encrypter'),
  /** @property {Function} - com.wb.common.Dict类。 */
  DictCls: Java.type('com.wb.common.Dict'),
  /** @property {Function} - java.sql.ResultSet类。 */
  ResultSet: Java.type('java.sql.ResultSet'),
  /** @property {Function} - java.sql.Types类。 */
  Types: Java.type('java.sql.Types'),
  /** @property {Function} - java.io.InputStream类。 */
  InputStream: Java.type('java.io.InputStream'),
  /** @property {Function} - java.io.ByteArrayInputStream类。 */
  ByteArrayInputStream: Java.type('java.io.ByteArrayInputStream'),
  /** @property {Function} - java.io.ByteArrayOutputStream类。 */
  ByteArrayOutputStream: Java.type('java.io.ByteArrayOutputStream'),
  /** @property {Function} - java.io.BufferedInputStream类。 */
  BufferedInputStream: Java.type('java.io.BufferedInputStream'),
  /** @property {Function} - java.io.FileInputStream类。 */
  FileInputStream: Java.type('java.io.FileInputStream'),
  /** @property {Function} - java.util.ArrayList类。 */
  ArrayList: Java.type('java.util.ArrayList'),
  /** @property {Function} - com.wb.tool.DataSource类。 */
  DataSource: Java.type('com.wb.tool.DataSource'),
  /** @property {Function} - java.util.HashMap类。 */
  HashMap: Java.type('java.util.HashMap'),
  /** @property {Function} - java.util.concurrent.ConcurrentHashMap类。 */
  ConcurrentHashMap: Java.type('java.util.concurrent.ConcurrentHashMap'),
  /** @property {Function} - java.lang.Byte类。 */
  Byte: Java.type('java.lang.Byte'),
  /** @property {Function} - java.lang.Short类。 */
  Short: Java.type('java.lang.Short'),
  /** @property {Function} - java.lang.Integer类。 */
  Integer: Java.type('java.lang.Integer'),
  /** @property {Function} - java.lang.Long类。 */
  Long: Java.type('java.lang.Long'),
  /** @property {Function} - java.lang.Float */
  Float: Java.type('java.lang.Float'),
  /** @property {Function} - java.lang.Double类。 */
  Double: Java.type('java.lang.Double'),
  /** @property {Function} - jakarta包名。 */
  jakarta: Packages.jakarta,
  /** @property {Object} Classes 定义的常用类对象。 */
  /**
   * 定义的常用类对象。
   * @class Classes
   * @singleton
   */
  Classes: {
    /** @property {Function} - java.util.UUID类。 */
    UUID: Java.type('java.util.UUID'),
    /** @property {Function} - java.util.zip.GZIPInputStream类。 */
    GZIPInputStream: Java.type('java.util.zip.GZIPInputStream'),
    /** @property {Function} - java.util.zip.GZIPOutputStream */
    GZIPOutputStream: Java.type('java.util.zip.GZIPOutputStream'),
    /** @property {Function} - java.util.List类。 */
    List: Java.type('java.util.List'),
    /** @property {Function} - java.net.URL类。 */
    URL: Java.type('java.net.URL'),
    /** @property {Function} - java.net.Proxy */
    Proxy: Java.type('java.net.Proxy'),
    /** @property {Function} - java.net.InetSocketAddress */
    InetSocketAddress: Java.type('java.net.InetSocketAddress'),
    /** @property {Function} - com.wb.tool.VirtualRequest类。 */
    VirtualRequest: Java.type('com.wb.tool.VirtualRequest'),
    /** @property {Function} - com.wb.tool.VirtualRequest类。 */
    VirtualResponse: Java.type('com.wb.tool.VirtualResponse'),
    /** @property {Function} - java.lang.NullPointerException类。 */
    NullPointerException: Java.type('java.lang.NullPointerException'),
    /** @property {Function} - java.lang.String[]类。 */
    StringArray: Java.type("java.lang.String[]"),
    /** @property {Function} - java.sql.Timestamp类。 */
    Timestamp: Java.type('java.sql.Timestamp'),
    /** @property {Function} - java.sql.Date类。 */
    Date: Java.type('java.sql.Date'),
    /** @property {Function} - java.sql.Time类。 */
    Time: Java.type('java.sql.Time'),
    /** @property {Function} - java.io.StringReader类。 */
    StringReader: Java.type('java.io.StringReader'),
    /** @property {Function} - com.wb.graal.Executor类。 */
    Executor: Java.type('com.wb.graal.Executor'),
    /** @property {Function} - com.wb.graal.ContextPool类。 */
    ContextPool: Java.type('com.wb.graal.ContextPool'),
    /** @property {Function} - java.io.Reader类。 */
    Reader: Java.type('java.io.Reader'),
    /** @property {Function} - java.sql.Clob类。 */
    Clob: Java.type('java.sql.Clob'),
    /** @property {Function} - java.sql.Blob类。 */
    Blob: Java.type('java.sql.Blob'),
    /** @property {Function} - java.net.InetAddress类。 */
    InetAddress: Java.type('java.net.InetAddress'),
    /** @property {Function} - com.wb.common.SessionListener类。 */
    SessionListener: Java.type('com.wb.common.SessionListener'),
    /** @property {Function} - com.wb.tool.Cms类 */
    Cms: Java.type('com.wb.tool.Cms'),
    /** @property {Function} - java.util.Properties类 */
    Properties: Java.type('java.util.Properties')
  }
});
/**
 * Wb后台JavaScript库。
 * @class Wb-Server
 * @singleton
 */
Wb.apply(Wb, {
  /**
   * 获取服务器端唯一且正增长的13位长度编号。该编号由2位服务器编号字符串和11位基于时序动态生成的字符串组成。\
   * 编号由26个大写字母和10个数字组成。该方法在指定服务器内可产生唯一且正增长的id号，并可确保在公元2386年前的
   * 编码长度不超过11位（另2位为服务器编号）。
   * Example:
   *
   *     let id = Wb.getId();
   *
   * @return {String} 13位长度的在指定一个或多个服务器内唯一的id号。
   */
  getId: SysUtil.getId,
  /** @property {Charset} - utf8编码格式。 */
  utf8: Java.type('java.nio.charset.StandardCharsets').UTF_8,
  /**
   * 把字符串编码为Base64字符串。
   * @param {String} text 需要转换的字符。
   * @return {String} 转换后的字符。
   */
  encodeBase64: StringUtil.encodeBase64,
  /**
   * 把Base64字符串解码为字符串。
   * @param {String} text 需要转换的字符。
   * @return {String} 转换后的字符。
   */
  decodeBase64: StringUtil.decodeBase64Text,
  /**
   * 线程暂停执行指定毫秒数的时间。
   * @param {Number} milliSec 毫秒数。
   */
  sleep: Java.type('java.lang.Thread').sleep,
  /**
   * 获取一个随机的32位长度的UUID字符串，关于UUID的更多信息请参阅 RFC 4122。
   * @return {String} 32位长度的去掉"-"的UUID字符串。
   */
  getUUID() {
    return Classes.UUID.randomUUID().toString().replaceAll('-', '');
  },
  /**
   * 返回脚本表示的JSON对象或数组，该方法同{#Wb.decode}的区别为允许JSON格式为JS表达式。
   * Example:
   *
   *     Wb.parse('{foo: 123, bar: "abc"}');
   *
   * @param {String} script 脚本。
   * @return {Object/Array} 脚本表示的对象或数组。如果script为null返回null。
   */
  parse(script) {
    if (script == null)
      return script;
    if (script.trimLeft().startsWith('['))
      script = new JSONArray(script).toString();
    else
      script = new JSONObject(script).toString();
    return Wb.decode(script);
  },
  /**
   * 是否允许当前用户访问指定的模块。
   * Example:
   *
   *     Wb.permit('admin/dbe.xwl');
   *     Wb.permit('dbe');
   *
   * @param {String} path 模块相对路径或捷径。
   * @param {Boolean} checkLogin 是否检查模块是否需要登录。默认为false。
   * @return {Boolean} true允许访问，false不允许访问。
   */
  permit(path, checkLogin) {
    path = FileUtil.getXwlPath(path);
    if (path && checkLogin) {
      let module = Xwl.get(path);
      if (module && !module.loginRequired)
        return true;
    }
    return Perm.permit(path, Wb.roles ?? '');
  },
  /**
   * 是否允许当前用户访问指定相对路径的模块。该方法同{#permit}方法的区别为如果不允许访问将抛出异常。
   * @param {String} path 模块相对路径或捷径。
   * @param {Boolean} checkLogin 是否检查模块是否需要登录。默认为true。
   * @return {Boolean} true允许访问，否则将抛出异常。
   */
  permitx(path, checkLogin) {
    if (!Wb.permit(path, checkLogin ?? true))
      Wb.raise(Str.notHavePerm.format(Wb.getModulePath(path).slice(0, -4)));
    return true;
  },
  /**
   * 把JS的Object/Array转换为Java的JSONObject/JSONArray对象。如果参数不是Object/Array对象，将直接返回此参数。另请参考{#toJs}。
   * @param {Object/Array} object 需要转换的对象或数组。
   * @return {JSONObject} 转换后的JSONObject/JSONArray对象或object参数原值。
   */
  toJava(object) {
    if (Wb.isArray(object)) {
      let ja = new JSONArray();
      object.forEach(v => {
        if (v == null || Wb.isFunction(v))
          v = JSONObject.NULL;
        else if (Wb.isObject(v) || Wb.isArray(v))
          v = Wb.toJava(v);
        else if (Wb.isDate(v))
          v = new JavaDate(v.getTime());
        ja.put(v);
      });
      return ja;
    } else if (Wb.isObject(object)) {
      let jo = new JSONObject();
      Wb.each(object, (k, v) => {
        if (v === undefined)
          return;
        if (v == null || Wb.isFunction(v))
          v = JSONObject.NULL;
        else if (Wb.isObject(v) || Wb.isArray(v))
          v = Wb.toJava(v);
        else if (Wb.isDate(v))
          v = new JavaDate(v.getTime());
        jo.put(k, v);
      });
      return jo;
    } else return object;
  },
  /**
   * 把Java的JSONObject/JSONArray对象转换为JS的Object/Array。如果参数不是JSONObject/JSONArray对象，将直接返回此参数。另请
   * 参考{#toJava}。如果需要通过JS的Object/Array方式快速访问JSONObject/JSONArray对象，请使用{#getProxy}方法。
   * @param {JSONObject/JSONArray} object 需要转换的JSONObject或JSONArray。
   * @return {JSONObject} 转换后的Object/Array或object参数原值。
   */
  toJs(object) {
    if (object instanceof JSONArray) {
      let ja = [], v, i, j = object.length();
      for (i = 0; i < j; i++) {
        v = JsonUtil.opt(object, i);
        if (v instanceof JSONObject || v instanceof JSONArray)
          v = Wb.toJs(v);
        else if (v instanceof JavaDate)
          v = new Date(v.getTime());
        ja.push(v);
      }
      return ja;
    } else if (object instanceof JSONObject) {
      let jo = {}, v, names = object.keySet();
      names.forEach(name => {
        v = JsonUtil.opt(object, name);
        if (v instanceof JSONObject || v instanceof JSONArray)
          v = Wb.toJs(v);
        else if (v instanceof JavaDate)
          v = new Date(v.getTime());
        jo[name] = v;
      });
      return jo;
    } else return object;
  },
  /**
   * 获取JSONObject/JSONArray对象的Proxy，用于通过以类似JavaScript对象/数组的方式读取JSONObject/JSONArray对象。
   * @param {JSONObject/JSONArray} object JSONObject或JSONArray对象。
   * @return {Proxy} 代理对象。
   */
  getProxy(object) {
    if (object == null)
      return object;
    if (object instanceof JSONArray) {
      return new Proxy(object, {
        get(target, prop, receiver) {
          switch (prop) {
            case 'length':
              return target.length();
            case 'each':
              return Wb.PT.arrayEach;
            case 'forEach':
              return fn => {
                let i, j = target.length();
                for (i = 0; i < j; i++)
                  fn(target.opt(i), i);
              };
            case 'xLikeArray':
              return true;
            case 'remove':
              return index => target.remove(index);
            case 'push':
              return item => target.put(item);
            case 'toJSON':
              return fn => {
                let i, j = target.length(), r = [];
                for (i = 0; i < j; i++)
                  r.push(receiver[i]);
                return r;
              };
            case Symbol.toStringTag:
              return f => '[object Array]';
          }
          let value = target.opt(parseInt(prop));
          if (value instanceof JSONArray || value instanceof JSONObject)
            return Wb.getProxy(value);
          else
            return value;
        },
        set(target, prop, value) {
          target.put(parseInt(prop), value);
          return true;
        },
        deleteProperty(target, prop) {
          target.remove(parseInt(prop));
          return true;
        },
        has: function (target, prop) {
          return prop >= 0 && prop < target.length();
        },
        ownKeys: function (target) {
          let a = [], i, j = target.length();

          for (i = 0; i < j; i++)
            a.push(i.toString());
          return a;
        },
        getOwnPropertyDescriptor: function (target, prop) {
          return { value: target.opt(parseInt(prop)), writable: true, enumerable: true, configurable: true };
        }
      });
    } else {
      return new Proxy(object, {
        get(target, prop) {
          if (prop == Symbol.toStringTag)
            return f => '[object Object]';
          let value = target.opt(prop);
          if (value instanceof JSONArray || value instanceof JSONObject)
            return Wb.getProxy(value);
          else
            return value;
        },
        set(target, prop, value) {
          target.put(prop, value);
          return true;
        },
        deleteProperty(target, prop) {
          target.remove(prop);
          return true;
        },
        has: function (target, prop) {
          return target.has(prop);
        },
        ownKeys: function (target) {
          return Java.from(JSONObject.getNames(target));
        },
        getOwnPropertyDescriptor: function (target, prop) {
          return { value: target.opt(prop), writable: true, enumerable: true, configurable: true };
        }
      });
    }
  },
  /**
   * 判断当前用户是否包含某个角色。
   * @param {String/String[]} roles 角色id或其列表。
   * @return {Boolean} true包含，false未包含。
   */
  hasRole(roles) {
    if (!roles)
      return false;
    roles = Wb.toArray(roles);
    return Wb.roles?.some(role => roles.includes(role)) ?? false;
  },
  /**
   * 判断当前用户是否包含某个角色或admin。
   * @param {String/String[]} roles 角色id或其列表。
   * @return {Boolean} true包含，false未包含。如果当前用户包含admin将直接返回true.
   */
  hasRolex(roles) {
    if (Wb.roles?.includes('admin'))
      return true;
    return Wb.hasRole(roles);
  },
  /**
   * 检查当前用户是否包含某个角色，如果包含某个角色则抛出拒绝访问异常。请注意"admin"用户不受限。
   * @param {String/String[]} roles 角色id或其列表。
   * @param {String} [msg] 异常信息。
   */
  forbidRole(roles, msg) {
    if (!roles)
      return;
    let userRoles = Wb.roles;
    if (userRoles) {
      if (userRoles.includes('admin'))
        return;
      roles = Wb.toArray(roles);
      if (userRoles.some(role => roles.includes(role)))
        Wb.accessDenied(msg);
    }
  },
  /**
   * 检查当前用户是否未包含某些角色，如果未包含所有这些角色则抛出拒绝访问异常。请注意"admin"用户不受限。
   * @param {String/String[]} roles 角色id或其列表。
   * @param {String} [msg] 异常信息。
   */
  permitRole(roles, msg) {
    let userRoles = Wb.roles;
    if (userRoles) {
      if (userRoles.includes('admin'))
        return;
      if (!roles)
        Wb.accessDenied(msg);
      roles = Wb.toArray(roles);
      if (!userRoles.some(role => roles.includes(role)))
        Wb.accessDenied(msg);
    } else {
      Wb.accessDenied(msg);
    }
  },
  /**
   * 如果当前为演示版本将抛出禁止访问异常。
   */
  checkDemo() {
    if (Config.isDemo)
      Wb.raise(Str.accessDeniedDownload);
  },
  /***/
  isObject(value) {
    return !Java.isJavaObject(value) && toString.call(value) === '[object Object]';
  },
  /**
   * 检查指定的对象是否为null/undefined，如果是将抛出指定信息的NullPointerException异常。
   * @param {Object} object 需要检查的对象。
   * @param {String} [message] 异常信息。
   */
  checkNull(object, message) {
    if (object == null) {
      if (message == null)
        Wb.raise(new Classes.NullPointerException());
      else
        Wb.raise(new Classes.NullPointerException(message));
    }
  },
  /**
   * 获取指定名称的当前执行会话内的数据库共享连接，如果不存在将创建一个新的数据库连接。
   * @param {String} [name] 数据库名称。默认为默认数据库。
   * @return {Wb.Connection} 数据库连接。
   */
  getConn(name) {
    return (!name || Wb.isString(name)) ? Wb.Connection.get(name) : name;
  },
  /**
   * 开始事务，使指定名称的数据库连接的所有数据库操作的自动事务提交改为手动事务提交。
   * @param {String} [name] 数据库名称。默认为默认数据库。
   * @param {String} [isolation] 事务隔离级别。详见{#Wb.Connection.isolation}。
   */
  startTrans(name, isolation) {
    Wb.getConn(name).startTrans(isolation);
  },
  /**
   * 提交事务，使自上次提交/回滚以来所做的所有更改持久化并释放当前连接的所有数据库锁。
   * @param {String} [name] 数据库名称。默认为默认数据库。
   */
  commit(name) {
    Wb.getConn(name).commit();
  },
  /**
   * 回滚事务，撤消在当前事务中所做的所有更改并释放当前连接的所有数据库锁。
   * @param {String} [name] 数据库名称。默认为默认数据库。
   */
  rollback(name) {
    Wb.getConn(name).rollback();
  },
  /**
   * {#Wb.Query.sync}方法的别名。
   */
  sync(...args) {
    Wb.Query.sync(...args);
  },
  /**
   * {#Wb.Query.syncFree}方法的别名。
   */
  syncFree(...args) {
    Wb.Query.syncFree(...args);
  },
  /**
   * 发送信息给指定用户，并在该用户主页显示该信息。
   * @param {String/Object} msg 信息内容。如果为对象表示使用{#Wb.open}方法打开时的配置对象，其中{{msg}}为信息内容，
   * {{newWin}}为true表示使用{#Wb.openWin}方法打开。
   * @param {String/Boolean/HttpServletRequest/HttpSession} [userid] 发送到指定用户的WebSocket客户端。字符串表示用户id，
   * request表示请求关联的用户，session表示会话关联的用户，true表示所有用户。缺省表示发送到当前用户。
   * @param {String} [type] 信息类型，默认为"info"。
   * -'info': 信息
   * -'warn': 警告
   * -'error': 错误
   */
  homeInfo(msg, userid, type = 'info') {
    Wb.send({ type, msg }, 'sys.home', userid);
  },
  /**
   * 发送警告信息给指定用户，并在该用户主页显示该信息。详见{#Wb.homeInfo}。
   */
  homeWarn(msg, userid) {
    Wb.homeInfo(msg, userid, 'warn');
  },
  /**
   * 发送错误信息给指定用户，并在该用户主页显示该信息。详见{#Wb.homeInfo}。
   */
  homeError(msg, userid) {
    Wb.homeInfo(msg, userid, 'error');
  },
  /**
   * 设置指定用户指定名称的值。该值存储在数据库指定的表中。较大内容的存储请参考{#setResource}方法。
   * @param {String} name 值名称。名称加用户最大长度为99个字符。
   * @param {String/Number/Boolean/Date} [value] 值。最大长度为200个字符。如果缺省或null将删除该值。
   * @param {String} [userid] 用户id。默认为当前用户。
   * @param {Number} [type] 值类型，默认为自动判断。0字符串，1数值，2日期，3布尔值。
   */
  setValue(name, value, userid, type) {
    userid ??= Wb.userid;
    if (name.length + userid.length >= 99)
      Wb.raise('Name exceeds the maximum length.');
    if (value?.length >= 200)
      Wb.raise('Value exceeds the maximum length.')
    let hasValue = value != null;

    if (hasValue)
      Wb.startTrans();
    name = userid + '@' + name;
    Wb.set('name', name);
    Wb.sql('delete from wb_value where sid={?name?}');
    if (hasValue) {
      if (Wb.isDate(value)) {
        value = value.textValue;
        type ??= 2;
      } else {
        if (type == null) {
          if (Wb.isNumber(value))
            type = 1;
          else if (Wb.isBoolean(value))
            type = 3;
          else
            type = 0;
        }
        value = String(value);
      }
      Wb.set({ type, value });
      Wb.sql('insert into wb_value values({?name?},{?type?},{?value?})');
    }
  },
  /**
   * 获取指定用户指定名称的值。该值存储在数据库指定的表中。
   * @param {String/String[]} names 值名称或多个名称列表。
   * @param {String/String[]} [userids] 用户id，如果为数组表示多个id对应的多个用户。默认为当前用户。
   * @return {Object/Object[]} 存储的单个或多个值。未找到返回null。
   */
  getValue(names, userids) {
    let clause = [], values = {}, result = [], curUserid, paramName, recs, value,
      namesIsArray, useridsIsArray, id, idList = [];

    curUserid = Wb.userid;
    userids ??= curUserid;
    namesIsArray = Wb.isArray(names);
    useridsIsArray = Wb.isArray(userids);
    if (!namesIsArray)
      names = [names];
    names.forEach((name, i) => {
      paramName = 'name' + i;
      id = (useridsIsArray ? (userids[i] ?? curUserid) : userids) + '@' + name;
      idList.push(id);
      Wb.set(paramName, id);
      clause.push('sid={?' + paramName + '?}');
    });
    recs = Wb.getAllRecords('select sid,stype,svalue from wb_value where ' + clause.join(' or '));
    recs.forEach(rec => {
      value = rec[2];
      switch (rec[1]) {
        case 1:
          value = value ? parseFloat(value) : null;
          break;
        case 2:
          value = value ? value.dateValue : null;
          break;
        case 3:
          value = value ? value == 'true' : null;
          break;
      }
      values[rec[0]] = value;
    });
    idList.forEach(id => {
      result.push(values[id] ?? null);
    });
    return namesIsArray ? result : result[0];
  },
  /**
   * 设置指定用户指定名称的资源。该值存储在数据库指定的表中。较小内容的存储请参考{#setValue}方法。
   * @param {String} name 资源名称。名称加用户最大长度为99个字符。
   * @param {String/Object/Array/byte[]/InputStream} [value] 值。无长度限制的任意类型值。如果缺省或null将删除该值。
   * @param {String} [userid] 用户id。默认为当前用户。
   * @param {Number} [type] 值类型，默认为自动判断。0字符串，1对象或数组，2字节数组，3输入流。
   */
  setResource(name, value, userid, type) {
    userid ??= Wb.userid;
    if (name.length + userid.length >= 99)
      Wb.raise('Name exceeds the maximum length.');
    let hasValue = value != null;

    if (hasValue)
      Wb.startTrans();
    name = userid + '@' + name;
    Wb.set('name', name);
    Wb.sql('delete from wb_resource where sid={?name?}');
    if (hasValue) {
      if (value instanceof ByteArray)
        type ??= 2;
      else if (value instanceof InputStream)
        type ??= 3;
      else {
        if (Wb.isObject(value) || Wb.isArray(value)) {
          value = Wb.encode(value)
          type ??= 1;
        } else {
          type ??= 0;
          value = String(value);
        }
        value = value.getByteStream();
      }
      Wb.set({ type, value });
      Wb.sql('insert into wb_resource values({?name?},{?type?},{?blob|value?})');
    }
  },
  /**
   * 获取指定用户指定名称的资源。该值存储在数据库指定的表中。
   * @param {String/String[]} names 资源名称或多个名称列表。
   * @param {String/String[]} [userids] 用户id，如果为数组表示多个id对应的多个用户。null默认为当前用户。
   * @return {String/String[]} 存储的单个或多个值。未找到返回null。
   */
  getResource(names, userids) {
    let clause = [], values = {}, result = [], curUserid, paramName, recs, value, type,
      namesIsArray, useridsIsArray, id, idList = [];

    curUserid = Wb.userid;
    userids ??= curUserid;
    namesIsArray = Wb.isArray(names);
    useridsIsArray = Wb.isArray(userids);
    if (!namesIsArray)
      names = [names];
    names.forEach((name, i) => {
      paramName = 'name' + i;
      id = (useridsIsArray ? (userids[i] ?? curUserid) : userids) + '@' + name;
      idList.push(id);
      Wb.set(paramName, id);
      clause.push('sid={?' + paramName + '?}');
    });
    recs = Wb.getAllRecords({ sql: 'select sid,stype,svalue from wb_resource where ' + clause.join(' or '), blob: true });
    recs.forEach(rec => {
      type = rec[1];
      value = rec[2];
      switch (type) {
        case 0:
        case 1:
          value = value ? new JavaString(value.readAllBytes(), Wb.utf8) : null;
          if (type == 1 && value)
            value = Wb.decode(value);
          break;
        case 2:
          value = value ? value.readAllBytes() : null;
          break;
      }
      values[rec[0]] = value;
    });
    idList.forEach(id => {
      result.push(values[id] ?? null);
    });
    return namesIsArray ? result : result[0];
  },
  /**
   * 抛出包含拒绝访问信息的异常。
   * @param {String} [msg] 信息。默认为[Str.accessDenied]。
   */
  accessDenied(msg) {
    if (msg)
      msg = Str.accessDenied + ': ' + msg;
    else
      msg = Str.accessDenied;
    Wb.raise(msg);
  },
  /**
   * 根据上下文生成"order by"部分SQL语句，{#Wb.Query.getOrderSql}方法的别名。
   */
  getOrderSql(...args) {
    return Wb.Query.getOrderSql(...args);
  },
  /**
   * 运行SQL语句，并获取首个结果集的记录列表，最大记录数由"rs"参数限制。详见{#Wb.Query.!run}说明。
   * @return {Array} 记录数据组成的数组，未找到结果集返回undefined。
   */
  getRows(configs, dbOrFn, fn, array, rs) {
    if (Wb.isString(configs))
      configs = { sql: configs, columns: false, array, rs };
    else
      configs = Wb.apply({ columns: false, array, rs }, configs);
    let value = Wb.Query.run(configs, dbOrFn, fn);
    switch (Wb.Query.result) {
      case 'value':
        return Wb.isArray(value) ? value : undefined;
      case 'array':
        return value.find(item => Wb.isArray(item));
      case 'object':
        return value.$return.find(item => Wb.isArray(item)) ??
          value[Wb.find(value, (k, v) => k != '$return' && Wb.isArray(v))];
    }
  },
  /**
   * 运行SQL语句，并获取首个结果集的所有记录列表。详见{#Wb.Query.!run}说明。
   */
  getAllRows(configs, dbOrFn, fn) {
    return Wb.getRows(configs, dbOrFn, fn, false, -1);
  },
  /**
   * 运行SQL语句，并获取首个结果集的记录并发送到客户端。该方法默认限定记录数。详见
   * {#Wb.Query.!run}说明。相关方法见{#sendRecords}。
   */
  sendRows(configs, dbOrFn, fn) {
    Wb.send(Wb.getRows(configs, dbOrFn, fn));
  },
  /**
   * 运行SQL语句，并获取首个结果集的首条记录。详见{#Wb.Query.!run}说明。相关方法见{#getRecord}。
   * @return {Object} 首条记录数据。如果无记录返回null。
   */
  getRow(configs, dbOrFn, fn) {
    return Wb.getRows(configs, dbOrFn, fn, false, 1)?.[0] ?? null;
  },
  /**
   * 运行SQL语句，并获取首个结果集的首条记录并发送到客户端。详见{#Wb.Query.!run}说明。相关方法见{#sendRecord}。
   */
  sendRow(...args) {
    Wb.send(Wb.getRow(...args));
  },
  /**
   * 运行SQL语句，并获取首个结果集的记录、列和元数据。详见{#Wb.Query.!run}说明。\
   * 该方法默认paging参数为true。相关方法见{#getRows}。
   * @return {Object} 记录、列和元数据组成的对象，未找到结果集返回undefined。
   */
  getRowx(configs, dbOrFn, fn, array, rs) {
    if (Wb.isString(configs))
      configs = { sql: configs, array, paging: true, rs };
    else
      configs = Wb.apply({ array, paging: true, rs }, configs);
    let value = Wb.Query.run(configs, dbOrFn, fn);
    switch (Wb.Query.result) {
      case 'value':
        return Wb.isArray(value?.items) ? value : undefined;
      case 'array':
        return value.find(item => Wb.isArray(item?.items));
      case 'object':
        //item.items指向结果集记录
        return value.$return.find(item => Wb.isArray(item?.items)) ??
          value[Wb.find(value, (k, v) => k != '$return' && Wb.isArray(v?.items))];
    }
  },
  /**
   * 运行SQL语句，并获取首个结果集的记录、列和元数据并发送到客户端。该方法默认paging参数为true和默认限定记录数。详见\
   * {#Wb.Query.!run}说明。
   */
  sendRowx(configs, dbOrFn, fn) {
    Wb.send(Wb.getRowx(configs, dbOrFn, fn));
  },
  /**
   * 运行SQL语句，并获取首个结果集的记录、列和元数据。详见{#Wb.Query.!run}说明。该方法默认paging参数为true。\
   * 该方法同{#getRowx}方法区别为记录数据组成格式为数组。相关方法见{#getRecords}。
   * @return {Object} 记录、列和元数据组成的对象，未找到结果集返回undefined。
   */
  getRecordx(configs, dbOrFn, fn) {
    return Wb.getRowx(configs, dbOrFn, fn, true);
  },
  /**
   * 运行SQL语句，并获取首个结果集的记录、列和元数据并发送到客户端。该方法同{#sendRowx}方法区别为记录数据组成格式为数组。\
   * 详见{#Wb.Query.!run}说明。该方法默认paging参数为true和默认限定记录数。相关方法见{#sendRecords}。
   */
  sendRecordx(configs, dbOrFn, fn) {
    Wb.send(Wb.getRowx(configs, dbOrFn, fn, true));
  },
  /**
   * 运行SQL语句，并获取首个结果集的记录列表。该方法同{#getRows}方法区别为记录数据组成格式为数组。
   * @return {Array} 记录数据组成的数组，未找到结果集返回undefined。
   */
  getRecords(configs, dbOrFn, fn) {
    return Wb.getRows(configs, dbOrFn, fn, true);
  },
  /**
   * 运行SQL语句，并获取首个结果集数组格式的所有记录列表。详见{#Wb.Query.!run}说明。
   */
  getAllRecords(configs, dbOrFn, fn) {
    return Wb.getRows(configs, dbOrFn, fn, true, -1);
  },
  /**
   * 运行SQL语句，并获取首个结果集的记录并发送到客户端。该方法同{#sendRows}方法区别为记录数据组成格式为数组和默认限定
   * 记录数。详见{#Wb.Query.!run}说明。相关方法见{#sendRows}。
   */
  sendRecords(configs, dbOrFn, fn) {
    Wb.send(Wb.getRows(configs, dbOrFn, fn, true));
  },
  /**
   * 运行SQL语句，并获取首个结果集的首条记录。该方法同{#getRow}方法区别为记录数据组成格式为数组。
   * @return {Object} 首条记录数据。如果无记录返回null。
   */
  getRecord(configs, dbOrFn, fn) {
    return Wb.getRows(configs, dbOrFn, fn, true, 1)?.[0] ?? null;
  },
  /**
   * 运行SQL语句，并获取首个结果集的首条记录并发送到客户端。该方法同{#sendRow}方法区别为记录数据组成格式为数组。\
   * 详见{#Wb.Query.!run}说明。相关方法见{#sendRow}。
   */
  sendRecord(...args) {
    Wb.send(Wb.getRecord(...args));
  },
  /**
   * 运行SQL语句，并获取经过字典处理后的首个结果集的记录、列和元数据。详见{#Wb.Query.!run}说明。\
   * 该方法默认paging参数为true。相关方法见{#getRowx}。
   * @param {Object/String} configs 执行SQL语句的配置对象或SQL语句。
   * @param {String/Wb.Connection/Function/Array} [dbOrFnOrDict] 数据库名称，回调函数或字典组名列表。带逗号的字符串
   * 表示字典组名。
   * @param {String/Array} [dictGroups] 字典组名列表。如果为字符串表示以","分隔的多个字典组名。
   * @param {Function} [fn] 回调函数。见fn参数说明。设置该值将覆盖已经设置的fn参数值。
   * @param {Boolean} [array] 是否为数组格式。
   * @param {Boolean/Number/Array} [rs] 是否读取结果集中的记录。见{#Wb.Query.run}方法的rs参数说明。
   * @return {Object} 记录、列和元数据组成的对象，未找到结果集返回undefined。
   */
  getDict(configs, dbOrFnOrDict, dictGroups, fn, array, rs) {
    let isArray = Wb.isArray(dbOrFnOrDict);
    if (isArray || Wb.isString(dbOrFnOrDict) && dbOrFnOrDict.includes(',')) {
      if (!isArray) {
        dbOrFnOrDict = dbOrFnOrDict.splitTrim();
        if (!dbOrFnOrDict.lastItem.trim())
          dbOrFnOrDict.pop();
      }
      dictGroups ??= dbOrFnOrDict;
      dbOrFnOrDict = null;
    }
    if (Wb.isString(configs))
      configs = { sql: configs, dict: dictGroups ?? true };
    else
      configs = Wb.apply({ dict: dictGroups ?? true }, configs);
    return this.getRowx(configs, dbOrFnOrDict, fn, array, rs);
  },
  /**
   * 运行SQL语句，并获取经过字典处理后的首个结果集的记录、列和元数据并发送到客户端。详见{#Wb.Query.!run}说明。\
   * 该方法默认paging参数为true和默认限定记录数。相关方法见{#getDict}。
   */
  sendDict(...args) {
    Wb.send(Wb.getDict(...args));
  },
  /**
   * 运行SQL语句，并获取数组格式的经过字典处理后的首个结果集的记录格式的记录、列和元数据。详见{#Wb.Query.!run}说明。\
   * 该方法默认paging参数为true。相关方法见{#getDict}。
   * @param {Object/String} configs 执行SQL语句的配置对象或SQL语句。
   * @param {String/Wb.Connection/Function/Array} [dbOrFnOrDict] 数据库名称，回调函数或字典组名列表。
   * @param {String/Array} [dictGroups] 字典组名列表。如果为字符串表示以","分隔的多个字典组名。
   * @param {Function} [fn] 回调函数。见fn参数说明。设置该值将覆盖已经设置的fn参数值。
   * @return {Object} 记录、列和元数据组成的对象，未找到结果集返回undefined。
   */
  getDictRecords(configs, dbOrFnOrDict, dictGroups, fn) {
    return Wb.getDict(configs, dbOrFnOrDict, dictGroups, fn, true);
  },
  /**
   * 运行SQL语句，并获取数组格式的经过字典处理后的首个结果集的记录、列和元数据并发送到客户端。详见{#Wb.Query.!run}说明。\
   * 该方法默认paging参数为true和默认限定记录数。相关方法见{#getDictRecords}。
   */
  sendDictRecords(...args) {
    Wb.send(Wb.getDictRecords(...args));
  },
  /**
   * 运行SQL语句，{#Wb.Query.!run}方法的别名。详见{#Wb.Query.!run}说明。
   */
  sql(...args) {
    return Wb.Query.run(...args);
  },
  /**
   * 运行SQL语句，并将所有获取的结果发送到客户端。该方法默认限定记录数。详见{#Wb.Query.!run}说明。。
   */
  sendSql(...args) {
    Wb.send(Wb.Query.run(...args));
  },
  /**
   * 运行SQL语句。该方法同{#sql}方法的区别为默认读取BLOB字段的内容。
   */
  sqlAll(configs, dbOrFn, fn) {
    if (Wb.isString(configs))
      configs = { sql: configs, blob: true };
    else
      configs = Wb.apply({ blob: true }, configs);
    return Wb.Query.run(configs, dbOrFn, fn);
  },
  /**
   * 运行SQL语句，并获取返回值。该方法同{#sql}方法的区别为对于结果集类型值默认返回结果集对象而非读取后的数据列表。
   */
  sqlRS(configs, dbOrFn, fn) {
    if (Wb.isString(configs))
      configs = { sql: configs, rs: true };
    else
      configs = Wb.apply({ rs: true }, configs);
    return Wb.Query.run(configs, dbOrFn, fn);
  },
  /**
   * 把数据写入到Excel模板文件，并把该文件转换为HTML脚本。{#Wb.ExcelUtil.getExcelHtml}方法的别名。
   */
  getExcelHtml(...args) {
    return Wb.ExcelUtil.getExcelHtml(...args);
  },
  /**
   * 把数据写入到Excel模板文件中，并输出到指定的输出流中。{#Wb.ExcelUtil.getExcelFile}方法的别名。
   */
  getExcelFile(...args) {
    Wb.ExcelUtil.getExcelFile(...args);
  },
  /**
   * 把对象作为信息输出到指定用户会话关联的IDE控制台。
   * @param {Object} object 输出的对象。
   * @param {String/Boolean} [userid] 输出信息到指定用户id的IDE控制台。true表示所有用户。缺省或falsy值为当前用户。
   */
  info(object, userid) {
    Wb.log(object, userid, 0);
  },
  /**
   * 把对象作为警告输出到指定用户会话关联的IDE控制台。
   * @param {Object} object 输出的对象。
   * @param {String/Boolean} [userid] 输出信息到指定用户id的IDE控制台。true表示所有用户。缺省或falsy值为当前用户。
   */
  warn(object, userid) {
    Wb.log(object, userid, 1);
  },
  /**
   * 把对象作为错误输出到指定用户会话关联的IDE控制台。
   * @param {Object} object 输出的对象。
   * @param {String/Boolean} [userid] 输出信息到指定用户id的IDE控制台。true表示所有用户。缺省或falsy值为当前用户。
   */
  error(object, userid) {
    Wb.log(object, userid, 2);
  },
  /**
   * 把对象作为表格输出到指定用户会话关联的IDE控制台。
   * @param {Object} object 输出的对象。
   * @param {String/Boolean} [userid] 输出信息到指定用户id的IDE控制台。true表示所有用户。缺省或falsy值为当前用户。
   */
  table(object, userid) {
    Wb.log(object, userid, 4);
  },
  /**
   * 把对象作为调试信息输出到指定用户会话关联的IDE控制台。
   * @param {Object} object 输出的对象。
   * @param {String/Boolean} [userid] 输出信息到指定用户id的IDE控制台。true表示所有用户。缺省或falsy值为当前
   * 用户。如果当前无用户信息输出到所有"admin"用户的IDE控制台。
   */
  debug(object, userid) {
    Wb.log(object, userid, 5);
  },
  /**
   * 把对象作为日志输出到指定用户会话关联的IDE控制台。
   * @param {Object} object 输出的对象。
   * @param {String/HttpServletRequest/HttpSession/Boolean} [userid] 输出日志到指定用户的IDE控制台。字符串表示用户id，
   * request表示请求关联的用户，session表示会话关联的用户，true表示所有用户。如果缺省该参数，默认为当前用户。
   * @param {Number} [type] 类型。0：信息，1：警告，2：错误，3：日志，4：表格，5：调试。默认为3。
   */
  log(object, userid, type = 3) {
    if (Config.consolePrint) {
      let value;
      try {
        if (object == null)
          value = String(object);
        else if (Java.isJavaObject(object))
          value = Wb.encode(object.toString());
        else
          value = object;
        let info;
        try {
          info = Wb.encode({ type: 'log', style: type, data: value });
        } catch (ex) {
          info = Wb.encode({ type: 'log', style: type, data: String(value) });
        }
        if (userid == null && !Wb.userid)
          userid = Config.anonymousUser;
        Wb.send(info, '$ide', userid);
      } catch (e) {
        System.err.println('Wb.log error: ' + e?.toString());
      }
    }
  },
  /**
   * Logs object as debug and outputs to the client console associated with the current session.
   * @param {Object} object Log object.
   */
  recordDebug(object) {
    Wb.recordLog(object, 3);
  },
  /**
   * Logs object as information and outputs to the client console associated with the current session.
   * @param {Object} object Log object.
   */
  recordInfo(object) {
    Wb.recordLog(object, 0);
  },
  /**
   * Logs object as information to the db and outputs to the client console associated with the current session.
   * @param {Object} object Log object.
   * @param {String} [type] Log type.
   */
  recordInfox(object, type) {
    Wb.recordLogx(object, type, 0);
  },
  /**
   * Logs object as warning and outputs to the client console associated with the current session.
   * @param {Object} object Log object.
   */
  recordWarn(object) {
    Wb.recordLog(object, 1);
  },
  /**
    * Logs object as warning to the db and outputs to the client console associated with the current session.
    * @param {Object} object Log object.
    * @param {String} [type] Log type.
    */
  recordWarnx(object, type) {
    Wb.recordLogx(object, type, 1);
  },
  /**
   * Logs object as error and outputs to the client console associated with the current session.
   * @param {Object} object Log object.
   */
  recordError(object) {
    Wb.recordLog(object, 2);
  },
  /**
    * Logs object as error to the db and outputs to the client console associated with the current session.
    * @param {Object} object Log object.
    * @param {String} [type] Log type.
    */
  recordErrorx(object, type) {
    Wb.recordLogx(object, type, 2);
  },
  /**
   * Logs throwable object and outputs to the client console associated with the current session.
   * @param {Throwable} throwable Exception object.
   */
  recordExcept(throwable) {
    if (Config.logEnabled && LogUtil.logger.isErrorEnabled() || Config.consolePrint)
      Wb.recordLog(throwable == null ? String(throwable) : SysUtil.getStackMessage(throwable), 2);
  },
  /**
   * Logs throwable object to the db and outputs to the client console associated with the current session.
   * @param {Throwable} throwable Exception object.
   * @param {String} [type] Log type.
   */
  recordExceptx(throwable, type) {
    if (Config.logEnabled || Config.consolePrint)
      Wb.recordLogx(throwable == null ? String(throwable) : SysUtil.getStackMessage(throwable), type, 2);
  },
  /**
   * Logs object as fatal and outputs to the client console associated with the current session.
   * @param {Object} object Log object.
   */
  recordFatal(object) {
    Wb.recordLog(object, 4);
  },
  /**
   * Logs object as trace and outputs to the client console associated with the current session.
   * @param {Object} object Log object.
   */
  recordTrace(object) {
    Wb.recordLog(object, 5);
  },
  /**
   * Logs object as the specified type and outputs to the client console associated with the specified session.
   * @param {Object} object Log object.
   * @param {Number} type Log type. 0: info, 1: warn, 2: error, 3: debug, 4: fatal, 5: trace
   */
  recordLog(object, type = 0) {
    if (Config.logEnabled) {
      let logger = LogUtil.logger;
      switch (type) {
        case 0:
          logger.info(object);
          break;
        case 1:
          logger.warn(object);
          break;
        case 2:
          logger.error(object);
          break;
        case 3:
          logger.debug(object);
          break;
        case 4:
          logger.fatal(object);
          type = 2;
          break;
        case 5:
          logger.trace(object);
          type = 0;
          break;
      }
    }
    Wb.log(object, null, type);
  },
  /**
   * Logs object as the specified type to the db and outputs to the client console associated with the specified session.
   * @param {Object} object Log object.
   * @param {String} [type] Log type.
   * @param {Number} [level] Log level. 0: info, 1: warn, 2: error. Defaults to 0.
   */
  recordLogx(object, type, level = 0) {
    if (Config.logEnabled)
      LogxUtil.log(object, level, type, request, false);
    Wb.log(object, null, level);
  },
  /**
   * 把对象转换为字符串。如果对象为null/undefined，直接转换为对应字符串；如果对象为Object和Array将使用
   * {#Wb.encode}编码转换为字符串，其它值直接转换为字符串。
   * @param {Object} object 需要转换的对象。
   * @return {String/Object} 转换后的文本或对象原值。
   */
  toText(object) {
    if (object == null)
      return String(object);
    else if (!Java.isJavaObject(object) && (Wb.isObject(object) || Wb.isArray(object)))
      return Wb.encode(object);
    else
      return object.toString();
  },
  /**
   * 设置Response头的"content-type"信息。
   * @param {String} [filename] 导出的文件名。默认为"data"。
   * @param {String/Boolean} [contentType] 导出的内容类型，如png图片为"image/png"。true表示强制
   * 下载"application/force-download"。默认为"application/octet-stream"。
   * @param {Number} [size] 输入流的大小。
   */
  setContentType(filename, contentType, size) {
    filename ??= 'data';
    if (contentType === true)
      contentType = 'application/force-download';
    response.setHeader('content-type', contentType || 'application/octet-stream');
    response.setHeader('content-disposition', 'attachment;filename=' + encodeURIComponent(filename));
    if (size != null) {
      response.setHeader('content-length', String(size));
      response.setContentLength(size);
    }
  },
  /**
   * 导出数据到客户端。
   * @param {InputStream/Wb.File/File/String/byte[]} [data] 导出的数据。如果为字符串表示文件名。默认null表示空的数据。
   * @param {String} [filename] 导出的文件名。默认为"data"。
   * @param {Number} [size] 数据以字节为单位的大小，bytes[]/File/ByteArrayInputStream/FileInputStream将自动获取大小。
   * @param {String/Boolean} [contentType] 导出的内容类型，如png图片为"image/png"。默认为
   * "application/octet-stream"。true表示强制下载"application/force-download"。
   */
  exportData(data, filename, size, contentType) {
    let os, isByteArray;

    try {
      isByteArray = data instanceof ByteArray;
      if (Wb.isString(data) || data instanceof File)
        data = new Wb.File(data);
      if (data instanceof Wb.File) {
        size ??= data.length
        filename ??= data.name;
        data = data.stream;
      }
      if (data instanceof ByteArrayInputStream || data instanceof FileInputStream)
        size ??= data.available();
      else if (isByteArray)
        size ??= data.length;
      Wb.setContentType(filename, contentType, size);
      os = response.getOutputStream();
      if (isByteArray)
        os.write(data);
      else
        IOUtils.copy(data, os);
    } finally {
      if (data instanceof InputStream) {
        SysUtil.close(data);
      }
    }
    response.flushBuffer();
  },
  /***/
  raise(msg, code) {
    if (code)
      throw '##' + code + ':' + msg;
    else
      throw msg;
  },
  /**
   * 加载指定路径的js或mjs脚本文件。如果文件已经加载则不会重复加载。如果文件不存在将抛出异常。
   * Example:
   *
   *     Wb.load('wb/ss/my.js'); // 加载基于应用根目录下的文件
   *     Wb.load('./foo/bar.mjs'); // 加载当前目录下的foo/bar.mjs文件
   *     let module = Wb.load('../foo/my.mjs'); // 加载基于当前目录下上级目录下的foo/my.mjs模块文件
   *     module.exportObject.method(); //调用模块内的导出对象exportObject的method方法
   *
   * @param {String} path 文件路径。"./"或"../"开头的路径表示基于当前文件的相对路径，否则表示基于应用根目录的路径。
   * @return {Object} 加载mjs文件时返回导出的模块对象或默认对象（使用export default导出时）；加载其它文件时始终返回null。
   */
  load(path) {
    let result;

    if (path.includes('./')) {
      if (path.startsWith('./') || path.startsWith('../'))
        path = Context.path + path;
      path = Wb.normalizePath(path);
    }
    if (path in Globals) {
      result = Globals[path];
    } else {
      let source, oldPath;

      source = SourceBuffer.get(path);
      oldPath = Context.path;
      Context.path = Wb.getDirectory(path);
      try {
        Globals[path] = undefined;//标识已经加载
        result = Globals.context.eval(source);
      } catch (e) {
        Globals[path] = { __except$__: true, e };
        Wb.raise(e);
      } finally {
        Context.path = oldPath;
      }
      if (path.endsWith('.mjs')) {
        if (result && 'default' in result)
          result = result.default;
      } else {
        result = null;
      }
      Globals[path] = result;
    }
    if (result?.__except$__)
      Wb.raise(result.e);
    else
      return result;
  },
  /**
   * 运行指定路径的XWL模块文件的服务器端脚本部份。系统不会对被调用的模块进行权限验证。相关方法请参考{#invoke}方法。
   * Example:
   *
   *     Wb.run('shortcut'); //通过模块捷径运行模块
   *     Wb.run('my/file.xwl'); //运行模块根目录下的my/file文件
   *     Wb.run('./my/file.xwl'); //运行当前目录下的my/file文件
   *     Wb.run('../my/file'); //运行基于当前目录下上级目录下的my/file文件（.xwl扩展名可省略）
   *     Wb.run('m?xwl=my/file'); //通过URI运行模块
   *
   * @param {String} path 模块路径。可以为文件相对路径，URI或模块捷径。"./"或"../"开头的路径表示基于当前文件的
   * 相对路径，否则表示基于模块根目录的路径。
   * @param {Object} [params] 参数对象。
   * @return {Object} 脚本的返回值。
   */
  run(path, params) {
    let result, fn, oldPath;

    if (params)
      Wb.set(params);
    path = Wb.getModulePath(path);
    fn = Globals[path];
    if (!fn) {
      let module = Xwl.get(path);
      if (!module)
        Wb.raise('Module "' + path + '" not found.');
      if (module.serverSource)
        result = Globals.context.eval(module.serverSource);
      else
        result = Wb.emptyFn;
      fn = Globals[path] = result;
    }
    oldPath = Context.path;
    Context.path = 'wb/modules/' + Wb.getDirectory(path);
    try {
      result = fn();
    } finally {
      Context.path = oldPath;
    }
    return result;
  },
  /**
   * 运行指定路径的XWL模块文件的服务器端脚本并输出客户端内容。系统不会对被调用的模块进行权限验证。该方法
   * 同{#run}的区别为该方法在执行服务器端脚本后将输出客户端内容。
   * Example:
   *
   *     let text = Wb.invoke('module', params, true); // 获取模块返回的文本
   *
   * @param {String} path 模块路径。可以为文件相对路径，URI或模块捷径。"./"或"../"开头的路径表示基于当前文件的
   * 相对路径，否则表示基于模块根目录的路径。
   * @param {Object} [params] 参数对象。
   * @param {String/Boolean} [returnType] 返回值的类型：
   * -null: 服务器端脚本的返回值。客户端内容直接输出到response。默认项。
   * -'text'/true: 客户端utf-8字符串内容。设置该值可防止在ServerScript中直接输出到客户端。
   * -'bytes': 客户端字节内容。
   * -'resultText': 服务器端脚本的返回值和输出到response中的utf-8字符串内容组成的数组。
   * -'resultBytes': 服务器端脚本的返回值和输出到response中的字节内容组成的数组。
   * @param {Boolean} [isClosure] 是否返回闭包脚本。true返回闭包部分脚本，false返回完整HTML，
   * null根据请求头自动判断。默认为null。
   * @return {Object/Array} 根据returnType参数指定的类型返回的结果。
   */
  invoke(path, params, returnType, isClosure) {
    let resp, result, module;

    try {
      if (returnType) {
        resp = response;
        response = new Classes.VirtualResponse(null);
      }
      path = Wb.getModulePath(path);
      module = Xwl.get(path);
      if (!module)
        Wb.raise('Module "' + path + '" not found.');
      result = this.run(path, params);
      if (module.hasXwl)
        module.loadXwl(request, response, null, null);
      if (module.hasStateData)
        module.loadStateData(request);
      if (module.hasModuleBind)
        module.loadModuleBind(request);
      if (!response.isCommitted() && module.hasClientScript) {
        if (isClosure == null) {
          let cs = request.getHeader("Closurescript");
          isClosure = cs ? Wb.parseBool(cs) : WebUtil.fromAjax(request);
        }
        if (isClosure) {
          if (module.hasParam)
            WebUtil.send(response, WebUtil.replaceParams(module.getClosureScript(), request));
          else {
            if (Config.xwlEtag) {
              let fileEtag = module.lastModified;
              if (fileEtag.equals(request.getHeader("If-None-Match"))) {
                response.setStatus(304);
                return;
              } else {
                response.setHeader('Etag', fileEtag);
              }
            }
            WebUtil.send(response, module.getClosureScript());
          }
        } else {
          let html = Xwl.getHTML(module, request);
          if (module.hasParam)
            WebUtil.send(response, WebUtil.replaceParams(html, request));
          else
            WebUtil.send(response, html);
        }
      }
      //获取结果
      switch (returnType) {
        case 'text':
        case true:
          result = response.getText();
          break;
        case 'bytes':
          result = response.getBytes();
          break;
        case 'resultText':
          result = [result, response.getText()];
          break;
        case 'resultBytes':
          result = [result, response.getBytes()];
          break;
      }
    } finally {
      if (returnType)
        response = resp;
    }
    return result;
  },
  /**
   * 运行指定路径的XWL模块文件并获取模块返回的文本或客户端闭包部分脚本。系统不会对被调用的模块进行权限验证。该方法同{#invoke}方法
   * 的区别为获取的客户端脚本不会直接输出而是返回。另请参考{#Wb.run}和{#Wb.invoke}。
   * Example:
   *
   *     let clientScript = Wb.execute('admin/dbe');
   * 
   * @param {String} path 模块路径。可以为文件相对路径，URI或模块捷径。"./"或"../"开头的路径表示基于当前文件的
   * 相对路径，否则表示基于模块根目录的路径。
   * @param {Object} [params] 参数对象。
   * @return {String} 模块客户端脚本。
   */
  execute(path, params) {
    return Wb.invoke(path, params, true, true);
  },
  /**
   * 创建新的线程，并在新的线程中运行指定的代码。
   * Example:
   *
   *     let map = Wb.startThread(params => {
   *       Wb.log(params.date);
   *       return { result: 'ok' };
   *     }, { foo: 'bar', abc: 123, date: new Date() });
   *     map.thread.join(); //等待线程结果
   *     Wb.log(map.result); //显示线程返回的结果 {result: 'ok'}
   *
   * @param {Function} fn 运行的函数。由于fn在独立线程和执行上下文中运行，因此fn不能引用外部变量。仅可使用params中的对象。
   * @param {Object} .params 传递的参数，即{#startThread}方法的params参数。
   * @param {Object} [params] 传递到fn的参数对象。
   * @param {Boolean} [noContext] 是否不在新的线程内传递Http会话。
   * @return {Map} 运行线程后返回的对象，由以下成员组成：
   * -"thread": 线程对象。
   * -"result": 运行的结果。必须待线程运行结束后才能访问。
   * -"e": 异常对象，如果有异常发生。
   */
  startThread(fn, params, noContext) {
    return SysUtil.startThread('params=Wb.toJs(params);' + fn.toScript(), Wb.toJava(params),
      noContext ? null : request.getSession(false));
  },
  /**
   * 延迟指定的时间后执行代码。当有任务泄露时可以通过IDE的[运行]->[重新加载系统]来清除所有任务。
   * Example:
   *
   *     let future = Wb.setInterval(params => {
   *       Wb.log(params.date);
   *       return { result: 'ok' };
   *     }, 1000, { foo: 'bar', abc: 123, date: new Date() });
   *     Wb.sleep(3000);
   *     future.cancel(false); // cancel interval
   *
   * @param {Function} fn 运行的函数。由于fn在独立线程和执行上下文中运行，因此fn不能引用外部变量。仅可使用params中的对象。
   * @param {Object} .params 传递的参数，即{#setInterval}方法的params参数。
   * @param {Number} [interval] 以毫秒为单位的周期。
   * @param {Object} [params] 传递到fn的参数对象。
   * @param {Boolean} [noContext] 是否不在新的线程内传递Http会话。
   * @return {ScheduledFuture} Java的ScheduledFuture对象。使用{{future.cancel(false)}}可取消执行。
   */
  setInterval(fn, interval, params, noContext) {
    return SysUtil.setInterval('params=Wb.toJs(params);' + fn.toScript(), interval, Wb.toJava(params),
      noContext ? null : request.getSession(false));
  },
  /**
   * 延迟指定的时间后执行代码。当有任务泄露时可以通过IDE的[运行]->[重新加载系统]来清除所有任务。
   * Example:
   *
   *     let future = Wb.setTimeout(params => {
   *       Wb.log(params.date);
   *       return { result: 'ok' };
   *     }, 1000, { foo: 'bar', abc: 123, date: new Date() });
   *     // future.cancel(false); // cancel setTimeout
   *
   * @param {Function} fn 运行的函数。由于fn在独立线程和执行上下文中运行，因此fn不能引用外部变量。仅可使用params中的对象。
   * @param {Object} .params 传递的参数，即{#setTimeout}方法的params参数。
   * @param {Number} [delay] 延时的毫秒数。
   * @param {Object} [params] 传递到fn的参数对象。
   * @param {Boolean} [noContext] 是否不在新的线程内传递Http会话。
   * @return {ScheduledFuture} Java的ScheduledFuture对象。使用{{future.cancel(false)}}可取消执行。
   */
  setTimeout(fn, delay, params, noContext) {
    return SysUtil.setTimeout('params=Wb.toJs(params);' + fn.toScript(), delay, Wb.toJava(params),
      noContext ? null : request.getSession(false));
  },
  /**
   * 根据模块文件路径，url表达式或模块捷径获取模块文件相对路径。
   * @param {String} path 模块路径表达式。
   * @return {String} 模块文件相对路径。
   */
  getModulePath(path) {
    return FileUtil.getXwlPath(path, Context.path);
  },
  /**
   * 把输入流转换为字节流。如果输入流为字节流直接返回该对象。
   * @param {InputStream} inputStream 输入流对象。
   * @return {ByteArrayInputStream} 字节输入流对象。
   */
  toByteStream(inputStream) {
    if (inputStream) {
      if (inputStream instanceof ByteArrayInputStream)
        return inputStream;
      let bytes;
      try {
        bytes = IOUtils.toByteArray(inputStream);
      } finally {
        inputStream.close();
      }
      return new ByteArrayInputStream(bytes);
    }
    return null;
  },
  /**
   * 获取上下文中HttpServletRequest和其关联的HttpSession对象中指定名称的属性或参数的原始值。\
   * 如果相同名称的属性或参数都存在则返回优先级最高的值。优先级从高到低依次为：
   * HttpSession的attribute，HttpServletRequest的attribute和 HttpServletRequest的parameter。如果
   * 都不存在则返回null。
   * 如果客户端发送多个重名的参数，该方法将返回包含多个参数的ArrayList。如果客户端发送文件，该方法将返回
   * HashMap，其格式为{stream, name, size}分别表示文件输入流，文件名称，文件大小；上传同名参数的多个文件
   * 该方法将返回包含文件HashMap的ArrayList。
   * 获取多个参数请参考{#getParams}。
   * 
   *
   *     let param = Wb.get('param');
   *     let username = Wb.get('sys.username');
   *     let object = Wb.get(); //返回所有属性/参数组成的对象
   *
   * @param {String} [name] 属性或参数名称。如果缺省，将返回所有属性/参数值组成的对象。
   * @return {Object} 指定名称的属性或参数值，或所有属性/参数值组成的对象。
   */
  get(name) {
    if (name == null) {
      //获取全部值
      let jo = WebUtil.get(request), result = {};
      jo.keySet().forEach(k => result[k] = jo.opt(k));
      Wb.apply(result, Wb.payloadParams);
      return result;
    } else {
      //获取单个值
      return WebUtil.get(request, name) ?? Wb.payloadParams?.[name] ?? null;
    }
  },
  /**
   * 获取上下文中的参数值。同{#Wb.get}方法的区别为该方法先获取name指定的参数值，如果为null再获取$name指定的参数值。
   * @param {String} [name] 属性或参数名称。如果缺省，将返回所有属性/参数值组成的对象。
   * @return {Object} 指定名称的属性或参数值，或所有属性/参数值组成的对象。
   */
  getx(name) {
    return Wb.get(name) ?? Wb.get('$' + name);
  },
  /**
   * 把指定名称的参数值设置为数据库查询时前后各加上“%”的通配值，如果值以"[]"引用，则设置为移除"[]"后的值。
   * @param {String} name 参数名称。
   */
  setLike(name) {
    let value = Wb.get(name);

    if (value) {
      value = String(value);
      if (value.startsWith('[') && value.endsWith(']'))
        Wb.set(name, value.slice(1, -1));
      else
        Wb.set(name, '%' + value + '%');
    }
  },
  /**
   * 加载模块并调用指定名称的方法。
   * @param {String} modulePath 模块文件路径。
   * @param {String} [functionName] 调用的方法名称。默认为直接调用模块返回的"default"方法。
   * @return {Object} 方法返回的值。
   */
  loadCall(modulePath, functionName) {
    let module = Wb.load(modulePath);
    if (functionName)
      return module[functionName]();
    else
      return module();
  },
  /**
   * 获取指定名称的配置项值。
   * @param {String} name 配置项全名。
   * @return {Object} 配置项值。
   */
  getConfig(name) {
    let value = Config.get(name);
    if (Wb.isDate(value))
      return Date.from(value);
    else if (value instanceof JSONArray || value instanceof JSONObject)
      return Wb.decode(value.toString());
    else
      return value;
  },
  /**
   * 设置指定名称的配置项值。
   * 
   * @param {String} name 配置项全名。
   * @param {Object} value 配置项值。
   */
  setConfig(name, value) {
    Wb.checkDemo();
    if (Wb.isDate(value))
      value = new JavaDate(value.getTime());
    else if (Wb.isArray(value))
      value = new JSONArray(Wb.encode(value));
    else if (Wb.isObject(value))
      value = new JSONObject(Wb.encode(value));
    Config.set(name, value);
  },
  /**
   * 获取上下文中的参数或属性值，并把该值转换为字符串值。请参考{#get}方法。
   * @param {String} name 属性或参数名称。
   * @return {String} 字符串值。如果不存在返回null。
   */
  getString(name) {
    let val = Wb.get(name);
    return val == null ? val : String(val);
  },
  /**
   * 获取上下文中的参数或属性值，并把该值转换为布尔值。请参考{#get}方法。
   * @param {String} name 属性或参数名称。
   * @return {Boolean} 布尔值。如果为空串返回空串，如果不存在返回null。
   */
  getBool(name) {
    let val = Wb.get(name);
    return (val === '' || val == null) ? val : Wb.parseBool(val);
  },
  /**
   * 获取上下文中的参数或属性值，并把该值转换为整数值。请参考{#get}方法。
   * @param {String} name 属性或参数名称。
   * @return {Number} 整数值。如果为空串返回空串，如果不存在返回null。
   */
  getInt(name) {
    let val = Wb.get(name);
    return (val === '' || val == null) ? val : parseInt(val, 10);
  },
  /**
   * 获取上下文中的参数或属性值，并把该值转换为浮点数值。请参考{#get}方法。
   * @param {String} name 属性或参数名称。
   * @return {Number} 浮点数值。如果为空串返回空串，如果不存在返回null。
   */
  getFloat(name) {
    let val = Wb.get(name);
    return (val === '' || val == null) ? val : parseFloat(val);
  },
  /**
   * 获取上下文中的参数或属性值，并把该值转换为日期值。请参考{#get}方法。
   * @param {String} name 属性或参数名称。
   * @return {Date} 日期值。如果为空串返回空串，如果不存在返回null。
   */
  getDate(name) {
    let val = Wb.get(name);
    if (Wb.isDate(val))
      return val;
    else
      return (val === '' || val == null) ? val : String(val).dateValue;
  },
  /**
   * 获取上下文中的参数或属性值，并把该值转换为对象或数组值。请参考{#get}方法。
   * Example:
   *
   *     let object = Wb.getObject('jsonObject');
   *     let array = Wb.getObject('jsonArray');
   *
   * @param {String} name 属性或参数名称。
   * @return {Object/Array} 对象/数组值。如果为空串返回空串，如果不存在返回null。
   */
  getObject(name) {
    let val = Wb.get(name);
    if (Wb.isObject(val) || Wb.isArray(val))
      return val;
    else
      return (val === '' || val == null) ? val : Wb.decode(String(val));
  },
  /**
   * 获取上下文中的同名的多个参数或属性值。获取单个参数请参考{#get}。该方法通常用于获取一致的结果，例如列如使用文件控件上传文件时，
   * 无论上传单个或多个文件，使用此方法都可以返回数组，以方便更进一步的处理。
   * @param {String} name 属性或参数名称。
   * @return {List/Array} 对象或数组值。
   */
  getParams(name) {
    let value = Wb.get(name);
    if (value instanceof Classes.List || Wb.isArray(value))
      return value;
    else
      return value ? [value] : [];
  },
  /**
   * 判断指定参数或属性是否存在。参数是指存储在session的attribute，request的attribute或parameter中的值。
   * @param {String} name 属性或参数名称。
   * @return {Boolean} 如果参数存在返回true，否则返回false。
   */
  has(name) {
    return request.getParameter(name) != null || request.getAttribute(name) != null ||
      request.getSession(false)?.getAttribute(name) != null;
  },
  /**
   * 获取上下文Request中指定名称的首个头信息。获取多个头信息请使用{#getHeaders}方法。
   * @param {String} name 头名称。
   * @return {String} 头信息。如果未找到返回null。
   */
  getHeader(name) {
    return request.getHeader(name);
  },
  /**
   * 获取上下文Request中指定名称的首个头信息。获取单个头信息请使用{#getHeader}方法。
   * @param {String} name 头名称。
   * @return {String[]} 同名的多个头信息组成的列表。如果未找到返回空数组。
   */
  getHeaders(name) {
    let v = request.getHeaders(name), result = [];
    if (!v)
      return result;
    while (v.hasMoreElements())
      result.push(v.nextElement());
    return result;
  },
  /**
   * 把指定object中每个成员的值设置到request的attribute对象中，成员名为属性名，成员值为属性值。
   * 如果object是字符串，将以object为名称value值，设置到request的attribute。
   * Example:
   *
   *     Wb.set('name', value);
   *     Wb.set({name1: value1, name2: value2});
   *
   * @param {Object/String} object 设置的对象或属性名。
   * @param {Object} [value] 如果object为字符串，该值为设置的值。
   */
  set(object, value) {
    if (Wb.isString(object)) {
      request.setAttribute(object, value);
    } else {
      Wb.each(object, (k, v) => request.setAttribute(k, v));
    }
  },
  /**
   * 检验系统是否登录，如果未登录则返回登录页面。
   * @return {Boolean} true已经成功登录，false未成功登录。
   */
  checkLogin(path) {
    if (WebUtil.isLogined(request)) {
      return true;
    } else {
      response.setStatus(401);
      if (WebUtil.fromAjax(request))
        WebUtil.send(response, '$$login');
      else
        Wb.invoke(Wb.getConfig('sys.session.loginPage'));
      return false;
    }
  },
  /**
   * 发送指定对象至上下文中的客户端。使用该方法可以发送普通请求的响应和WebSocket内容。
   * 当发送普通请求的响应时，该方法发送后将立即更新缓冲区，后续的任何普通请求响应输出均将无效。
   * Example:
   *
   *     Wb.send('text'); // 发送文本
   *     Wb.send(123); //发送数值，转换为字符串后发送
   *     Wb.send(new Date()); //发送日期值，转换为字符串后发送
   *     Wb.send({foo: 'bar'}); //发送对象，编码为字符串后发送
   *     Wb.send([1, 2, 3]); //发送数组，编码为字符串后发送
   *     Wb.send(inputStream); //发送输入流，仅首个客户端能收到数据（因为流是单向的）
   *     Wb.send(bytes); //发送字节数组byte[]
   *     Wb.send('text', 'mySocket'); //向当前用户且socket名称为mySocket的webSocket发送内容
   *     Wb.send('text', 'mySocket', 'admin'); //向所有管理员用户且socket名称为mySocket的webSocket发送内容
   *     Wb.send({ type: 'log', style: 3, data: 'msg' }, '$ide', true); //向ide的webSocket发送内容
   *
   * @param {Object} object 需要发送的对象。对象可以为任意数据类型。如果为JSON对象或数组将编码为字符串后再发送。如果为输入流，
   * 仅首个客户端能收到数据（因为流是单向的）。
   * @param {String/Session} [socketName] 发送到指定名称的WebSocket客户端。缺省表示为普通请求的响应。Session值表
   * 示WebSocket会话。如果{#globalThis.inWSSession}为true，默认该值为当前websocket会话。
   * @param {String/HttpServletRequest/HttpSession/Boolean} [userid] 发送到指定用户的WebSocket客户端。String表示
   * 用户id，HttpServletRequest表示请求关联的用户，HttpSession表示会话关联的用户，true表示所有登录的用户，false表示所有未登录的
   * 用户，'*'表示所有登录和未登录的用户。缺省值为null，表示发送到当前用户。
   */
  send(object, socketName, userid) {
    let isJson;

    if (!(object instanceof InputStream) && !(object instanceof ByteArray)) {
      if (object == null)
        object = String(object);
      else if (!Java.isJavaObject(object) && (Wb.isObject(object) || Wb.isArray(object))) {
        object = Wb.encode(object);
        isJson = true;
      } else
        object = object.toString();
    }
    if (socketName) {
      if (userid === true || userid === false || userid == '*')
        WSUtil.broadcast(socketName, object, userid == '*' ? null : userid);
      else
        WSUtil.send(userid ?? request, socketName, object);
    } else {
      if (globalThis.inWSSession)
        WSUtil.send(session, object); // pass session param from WebSocket service context
      else {
        if (isJson)
          response.setContentType('application/json;charset=utf-8');
        WebUtil.send(response, object);
      }
    }
  },
  /**
   * 向指定url发起HTTP请求。另请参考{#fetch}方法。
   * Example:
   *
   *     let html = Wb.submit('https://developer.mozilla.org'); //获取请求URL地址返回的页面内容
   *     let object = Wb.submit({ url: 'http://localhost/wb/m?xwl=test', params: { foo: 'bar' }, all: true });
   *     let result = Wb.submit({ url: 'http://localhost:8095/m?xwl=test404', all: true, silent: true }); // 获取状态码
   *
   * @param {Object/String} configs 请求的配置项或url地址。
   * @param {String} .url 请求的url地址。
   * @param {Object} [.params] 请求的参数对象。如果指定data属性或使用get方法请求，参数将编码到URL中。
   * @param {String/Object/Array/InputStream/byte[]} [.data] 请求提交的数据。如果data为Object/Array值，将默认
   * contentType为"application/json"。
   * @param {String} [.method] 请求使用的方式，如"POST", "GET"。默认当指定params或data时为"POST"，否则为"GET"。
   * @param {Object} [.header] 请求的header信息对象。
   * @param {Boolean} [.form] 是否使用"multipart/form-data"方式提交params。默认如果params包含InputStream/byte[]时
   * 为true。指定该参数时data参数将无效。
   * @param {HttpServletRequest} [.request] 把request对象的header信息添加到本次请求的header。
   * @param {String} [.charset] 发送文本的编码格式。默认为"utf-8"。
   * @param {String} [.resultCS] 返回结果编码为文本时使用的编码格式。默认为自动识别。如指定返回utf8格式，可指定为"utf-8"。
   * @param {Boolean} [.text] 是否返回文本类型结果，true返回文本，false返回字节数组，null自动判断。默认为null。
   * @param {Boolean} [.all] 是否返回多个返回值组成的对象。包括：
   * -"result": 返回的结果
   * -"header": 头信息对象
   * -"cookie": cookie值
   * -"code": 响应代码
   * @param {String} [.cookie] 设置的cookie值。
   * @param {Boolean} [.ajax] 是否在头信息中添加XMLHttpRequest请求标记。
   * @param {Boolean} [.silent] 返回的状态码非200时是否不抛出异常。
   * @param {Boolean} [.gzip] 当内容为gzip压缩时是否自动使用gzip解压。默认为true。
   * @param {Number} [.length] 发送内容的长度，以字节为单位。
   * @param {Number} [.timeout] 连接和读取时的各自超时时间，单位为毫秒。0表示永不超时。默认为30000。
   * @param {Function} [.callback] 读取流数据的回调函数，通常用于读取潜在包含大数据的流，指定该值后返回数据将为null。
   * @param {InputStream} [..inputStream] 输入流。
   * @param {Number} [..code] 响应的状态码。
   * @param {String} [host] 代理服务器地址。
   * @param {Number} [port] 代理服务器端口号，默认8080。 
   * @param {String} [proxyType] 代理服务器类型，默认为"HTTP"。 
   * @param {String/Object/Array/InputStream/byte[]} [object] 请求的参数或数据。值为对象类型时表示"params"，其他表示"data"。
   * @return {String/byte[]/Object} 请求返回的内容。返回内容类型根据text和all属性的设置。无任何内容返回null。
   */
  submit(configs, object) {
    let url, method, params, data, charset, resultCS, timeout, charsetPos, boundary, isBytes, isStream, text, all,
      length, header, resp, conn, bos, is, code, contentType, gzip, callback, request, hasError;

    configs = Wb.isString(configs) ? { url: configs } : Wb.copy(configs);
    if (object) {
      if (Wb.isObject(object))
        configs.params = object;
      else
        configs.data = object;
    }
    url = configs.url;
    charset = configs.charset || 'utf-8';
    resultCS = configs.resultCS;
    timeout = configs.timeout ?? 30000;
    gzip = configs.gzip ?? true;
    text = configs.text;
    all = configs.all;
    length = configs.length;
    data = configs.data;
    params = configs.params;
    boundary = params && (configs.form ?? Wb.some(params,
      (k, v) => v instanceof ByteArray || v instanceof InputStream || v instanceof Wb.File || v instanceof File));
    if (boundary)
      boundary = '#!^' + Wb.getId();
    callback = configs.callback;
    request = configs.request;
    method = configs.method || ((data || params) ? 'POST' : 'GET');
    header = {};
    if (request) {
      let name, names = request.getHeaderNames();

      while (names.hasMoreElements()) {
        name = names.nextElement();
        header[name] = request.getHeader(name);
      }
    }
    if (configs.ajax) {
      header['X-Requested-With'] = 'XMLHttpRequest';
      header['W-Requested-With'] = 'XMLHttpRequest';
    }
    if (configs.cookie)
      header.Cookie = configs.cookie;
    if (!boundary) {
      if (data) {
        if (!Java.isJavaObject(data) && (Wb.isObject(data) || Wb.isArray(data))) {
          header['Content-Type'] ??= 'application/json;charset=' + charset;
          data = Wb.encode(data);
        }
        if (params)
          url += (url.includes('?') ? '&' : '?') + Wb.encodeURL(params);
      } else {
        data = params ? Wb.encodeURL(params) : undefined;
        if (data && method == 'GET') {
          url += (url.includes('?') ? '&' : '?') + data;
          data = undefined;
        }
        header['Content-Type'] ??= 'application/x-www-form-urlencoded;charset=' + charset;
      }
    }
    if (boundary) {
      header['Content-Type'] ??= 'multipart/form-data; boundary=' + boundary;
    } else {
      isBytes = data instanceof ByteArray;
      isStream = data instanceof InputStream;
      header['Content-Type'] ??= (isBytes || isStream) ? 'application/octet-stream' : 'text/plain';
    }
    Wb.apply(header, configs.header);
    if (configs.host) {
      conn = new Classes.URL(url).openConnection(
        new Classes.Proxy(Classes.Proxy.Type.valueOf(configs.proxyType ?? 'HTTP'),
          new Classes.InetSocketAddress(configs.host, configs.port ?? 8080))
      );
    } else {
      conn = new Classes.URL(url).openConnection();
    }
    try {
      conn.setConnectTimeout(timeout);
      conn.setReadTimeout(timeout);
      conn.setUseCaches(false);
      conn.setRequestMethod(method);
      Wb.each(header, (k, v) => conn.setRequestProperty(k, String(v)));
      if (data || boundary) {
        //发送数据
        let os;
        conn.setDoOutput(true);
        if (isBytes)
          length ??= data.length;
        if (length != null)
          conn.setRequestProperty('Content-Length', length.toString());
        os = conn.getOutputStream();
        try {
          if (boundary)
            writeForm(os, params, boundary);
          else if (isBytes)
            os.write(data);
          else if (isStream)
            IOUtils.copy(data, os);
          else
            os.write(String(data).getBytes(charset));
          os.flush();
        } finally {
          os.close();
        }
      }
      contentType = conn.getHeaderField('Content-Type');
      charsetPos = contentType?.indexOf('charset=');
      if (text == null) {
        //自动判断返回文本还是字节
        if (contentType) {
          const mime = ['application/javascript', 'application/x-javascript', 'application/json', 'application/xml'];
          if (charsetPos != -1 || contentType?.includes('text/') || mime.some(item => contentType.includes(item)))
            text = true;
        }
        text ??= false;
      }
      if (!resultCS) {
        //自动判断返回文本的编码
        let pos, type = contentType;
        if (type) {
          pos = charsetPos;
          if (pos != -1) {
            type = type.substr(pos + 8);
            pos = type.indexOf(';');
            if (pos != -1)
              type = type.substr(0, pos);
            pos = type.indexOf(']');
            if (pos != -1)
              type = type.substr(0, pos);
            resultCS = type.trim();
          }
        }
        resultCS ||= 'utf-8';
      }
      code = conn.getResponseCode();
      hasError = code < 200 || code >= 300;
      resp = null;
      is = hasError ? conn.getErrorStream() : conn.getInputStream();
      if (is) {
        try {
          if (gzip && 'gzip' == conn.getHeaderField('Content-Encoding'))
            is = new Classes.GZIPInputStream(is);
          if (callback) {
            callback(is, code);
          } else {
            bos = new ByteArrayOutputStream();
            IOUtils.copy(is, bos);
            resp = bos.toByteArray();
            if (text)
              resp = new JavaString(resp, resultCS);
          }
        } finally {
          is.close();
        }
      }
      if (hasError && !configs.silent) {
        throw resp ? resp : ('HTTP ' + code);
      }
      if (all) {
        resp = {
          result: resp,
          cookie: conn.getHeaderField('Set-Cookie'),
          code,
          header: conn.getHeaderFields()
        }
      }
    } finally {
      conn.disconnect();
    }
    return resp;

    // write form data with params
    function writeForm(os, params, boundary) {
      const UrlConn = Java.type('java.net.HttpURLConnection');
      let isBt, isIs, isFile, writeString, is;

      writeString = s => os.write(s.getBytes(charset));
      Wb.each(params, (k, v) => {
        isBt = v instanceof ByteArray;
        isIs = v instanceof InputStream;
        if (v instanceof File)
          v = new Wb.File(v);
        isFile = v instanceof Wb.File;
        if (isBt || isIs || isFile) {
          writeString('--' + boundary + '\r\nContent-Disposition: form-data; name="' +
            k.beforeItem('|') + '"; filename="' + k.lastItem('|') + '"\r\nContent-Type: ' +
            UrlConn.guessContentTypeFromName(k) + '\r\nContent-Transfer-Encoding: binary\r\n\r\n');
        } else {
          writeString('--' + boundary + '\r\nContent-Disposition: form-data; name="' + k +
            '"\r\nContent-Type: text/plain; charset=' + charset + '\r\n\r\n');
        }
        if (isBt)
          os.write(v);
        else if (isIs)
          IOUtils.copy(v, os);
        else if (isFile) {
          is = v.stream;
          try {
            IOUtils.copy(is, os);
          } finally {
            SysUtil.close(is);
          }
        }
        else {
          if (Wb.isObject(v) || Wb.isArray(v))
            v = Wb.encode(v);
          else
            v = String(v);
          writeString(v);
        }
        writeString('\r\n');
      });
      writeString('--' + boundary + '--\r\n');
    }
  },
  /**
   * 向指定url发起HTTP请求。该方法同{#submit}方法的区别为默认参数all和silent均为true。
   * @return {String/byte[]/Object} 请求返回的内容。 
   */
  fetch(configs, object) {
    if (Wb.isString(configs))
      configs = { url: configs };
    return Wb.submit(Wb.apply({ all: true, silent: true }, configs), object);
  },
  /**
   * 系统就绪后的方法。
   */
  onReady() {
    if (!SysUtil.isReady || SysUtil.libLoaded) {
      SysUtil.isReady = true;
      Wb.Query.init();
    }
  },
  /**
   * 立即提交response缓冲区到客户端。
   */
  flush() {
    response.flushBuffer();
  },
  /**
   * 根据当前客户端语言和输入参数，格式化指定的关键字。如果无法识别客户端语言使用默认语言。
   * Example:
   *
   *     let text = Wb.str('minLength', 6);
   *
   * @param {String} key 预定义的字符串关键字。
   * @param {...Object} [params] 填充到关键字中的参数列表。
   * @return {String} 格式化后的字符串。如果不存在返回空串。
   */
  str(key, ...params) {
    if (request.isVirtual)
      return StrCls.format(key, ...params);
    else {
      let lang = request.getSession(false)?.getAttribute('sys.lang');
      if (lang)
        lang = StrCls.optLanguage(lang);
      else
        lang = StrCls.getLanguage(request);
      return StrCls.langFormat(lang, key, ...params);
    }
  },
  /**
   * 根据当前客户端的请求语言种类，获取系统支持的最接近的语言种类。如果无法识别客户端语言使用默认语言。
   * @return {String} 客户端请求的最接近的语言种类。
   */
  getLanguage() {
    return StrCls.getLanguage(request);
  }
});
Object.defineProperties(Wb, {
  /** @property {Object} - application/json方式提交请求的payload参数。非application/json方式无效。 @getter */
  payloadParams: {
    get() {
      return Context.payloadParams ??= request.getHeader('Content-Type')?.includes('application/json') ?
        (request.getHeader('Content-serialize') ? Wb.deserialize(Wb.payload ?? null, false, true) :
          Wb.decode(Wb.payload ?? null)) : undefined;
    },
    configurable: true
  },
  /** @property {String} - 提交请求的payload文本。 @getter */
  payload: {
    get() {
      let payload;

      payload = Context.payload;
      if (payload !== undefined)
        return payload;
      let stream = request.getInputStream();
      if (stream)
        payload = IOUtils.toString(stream, Wb.utf8);
      else
        payload = null;
      Context.payload = payload;
      return payload;
    },
    configurable: true
  },
  /** @property {Number} - 当限定读取数据库的记录数时的默认值。由{#Globals.maxRows}指定。 @getter */
  maxRows: {
    get() {
      return Globals.maxRows ?? Config.maxRows;
    },
    configurable: true
  },
  /** @property {String} - 当前会话的用户名称。未找到返回null。 @getter */
  username: {
    get() {
      return Wb.get('sys.username');
    },
    configurable: true
  },
  /** @property {String} - 当前会话的用户显示名称。未找到返回null。 @getter */
  dispname: {
    get() {
      return Wb.get('sys.dispname');
    },
    configurable: true
  },
  /** @property {String} - 当前会话的用户id。未找到返回null。 @getter */
  userid: {
    get() {
      return Wb.get('sys.userid');
    },
    configurable: true
  },
  /** @property {Array} - 当前会话的用户角色列表。未找到返回null。 @getter */
  roles: {
    get() {
      return Wb.get('sys.roles');
    },
    configurable: true
  }
});
/**
 * Array的扩展类。关于Array的更多说明请访问{#%Array}。
 * @class Array
 */
Object.defineProperties(Array.prototype, {
  /** @property {String[]} - 返回显式的字符串数组。 @getter */
  stringArray: {
    get() {
      return Java.to(this, Classes.StringArray);
    },
    configurable: true
  }
});
/**
 * String的扩展类。关于String的更多说明请访问{#%String}。
 * @class String
 */
Wb.apply(String.prototype, {
  /**
  * 获取当前字符串指定编码的字节数组。仅服务器端适用。
  * @param {String} [charset] 编码方式。默认为"utf-8"。
  * @return {Number[]} 字节列表。
  */
  getBytes(charset) {
    return StringUtil.getBytes(this, charset ?? 'utf-8');
  },
  /**
   * 获取当前字符串指定编码的字节输入流。仅服务器端适用。
   * @param {String} [charset] 编码方式。默认为"utf-8"。
   * @return {ByteArrayInputStream} 字节输入流。
   */
  getByteStream(charset) {
    return new ByteArrayInputStream(this.getBytes(charset));
  },
  /**
   * 判断当前字符串是否匹配指定通配符。
   * @param {String} wildcard 通配符。
   * @param {Boolean} [caseSensitivity] 是否区分大小写：
   * -false: 不区分，默认值。
   * -true: 区分。
   * -null: 根据操作系统文件名是否区分大小写自动判断。
   * @return {Boolean} true匹配，false不匹配。
   */
  wildcardMatch(wildcard, caseSensitivity) {
    let me = this;

    caseSensitivity ??= false;
    if (caseSensitivity == null)
      return FilenameUtils.wildcardMatchOnSystem(me, wildcard);
    else if (caseSensitivity)
      return FilenameUtils.wildcardMatch(me, wildcard);
    else
      return FilenameUtils.wildcardMatch(me, wildcard, IOCase.INSENSITIVE);
  }
});
/**
 * 可自动执行关闭方法的类。在会话当前执行结束后，系统会自动调用{#close}方法。该方法无论是否发生异常或强制中断都会被执行。
 * Example:
 *
 *     //定义类的close方法
 *     close(){
 *       super.close();
 *       connection.close();
 *     }
 *
 */
Cls['Wb.Closable'] = class closable extends Wb.Base {
  /***/
  constructor() {
    super();
    Context.closable.add(this);
  }
  /**
   * 会话当前执行结束后自动执行的方法。可以通过继承该类，并重载该方法来确保资源的关闭和释放。\
   * 如果已经执行了close方法，则在执行结束后不会再执行该方法。
   * @param {Boolean} hasExcept 会话执行期间是否发生了异常。
   */
  close() {
    Context.closable.delete(this);
  }
}
/**
 * 服务器端文件类。
 */
Cls['Wb.File'] = class file extends Wb.Base {
  /** @property {Wb.File} - 应用目录。 */
  static get appFolder() {
    return this.appFolder$ = new Wb.File(Base.path);
  }
  /** @property {Wb.File} - wb目录。 */
  static get wbFolder() {
    return this.wbFolder$ = new Wb.File(Base.path, 'wb');
  }
  /** @property {Wb.File} - 模块目录。 */
  static get moduleFolder() {
    return this.moduleFolder$ = new Wb.File(Base.modulePath);
  }
  /**
   * 检查指定父目录是否包含子目录或文件。如果未包含将抛出拒绝访问异常。
   * @param {Wb.File/File/String} parent 父目录。以'|'开头的目录表示基于应用目录。
   * @param {Wb.File/File/String} child 子目录或文件。以'|'开头的目录表示基于应用目录。
   */
  static checkContains(parent, sub) {
    if (Wb.isString(parent)) {
      if (parent.startsWith('|'))
        parent = new File(Base.path, parent.slice(1));
      else
        parent = new File(parent);
    } else if (parent instanceof Wb.File)
      parent = parent.file;
    if (Wb.isString(sub)) {
      if (sub.startsWith('|'))
        sub = new File(Base.path, sub.slice(1));
      else
        sub = new File(sub);
    } else if (sub instanceof Wb.File)
      sub = sub.file;
    if (!FileUtil.isAncestor(parent, sub))
      Wb.accessDenied(sub);
  }
  /**
   * 获取系统根文件/目录列表。如果无返回null。
   * @param {String} [sortType] 排序类型。默认为不排序。
   * -'name': 文件名
   * -'size': 文件大小
   * -'type': 文件类别
   * -'date': 修改日期
   * @param {Boolean} [desc] 是否逆向排序。
   * @return {Wb.File[]} 根文件/目录列表。
   */
  static listRoots(sortType, desc) {
    let files = File.listRoots();

    if (files) {
      if (sortType)
        FileUtil.sort(files, sortType, !!desc);
      return files.map(file => new Wb.File(file));
    } else
      return null;
  }
  /** @property {java.io.File} file 关联的系统文件对象。 */
  /**
   * 生成系统的目录/文件对象。
   * Example:
   *
   *     file = new Wb.File('foo/bar');
   *     file = new Wb.File(parent, 'sub'); //parent可为Wb.File/File/String
   *     file = new Wb.File(sysFile); //sysFile为Sys.File
   *     file = new Wb.File(wbFile); //wbFile为Wb.File
   *
   * @param {Wb.File/File/String/Boolean} path1 父目录或完全路径的目录/文件。如果为true表示为应用目录。
   * @param {String} [path2] 子目录/文件。
   */
  constructor(path1, path2) {
    super();
    if (path1 === true)
      path1 = Base.path;
    else if (path1 instanceof Wb.File)
      path1 = path1.file;
    if (path2)
      this.file = new File(path1, path2);
    else
      this.file = path1 instanceof File ? path1 : new File(path1);
    if (Config.isDemo && !FileUtil.isAncestor(Base.path, this.file))
      Wb.checkDemo();
  }
  /** @property {Wb.Lock} fileLock 文件锁。 @priv */
  /**
   * 对当前文件进行加锁。加锁后如果对相同路径的文件进行再次加锁时将被阻塞，直到调用{#unlock}方法为止。
   */
  lock() {
    this.fileLock = new Wb.Lock('f:' + this.path);
  }
  /**
   * 对当前文件进行解锁。
   */
  unlock() {
    this.fileLock.unlock();
  }
  /**
   * 判断当前文件名称是否匹配指定通配符。
   * @param {String} wildcard 通配符。
   * @param {Boolean} [caseSensitivity] 是否区分大小写：
   * -false: 不区分，默认值。
   * -true: 区分。
   * -null: 根据操作系统自动判断。
   * @return {Boolean} true匹配，false不匹配。
   */
  match(wildcard, caseSensitivity) {
    return this.name.wildcardMatch(wildcard, caseSensitivity);
  }
  /** @property {Wb.File} - 当前目录下的名称唯一的文件。 */
  get uniqueFile() {
    let name = this.name, newName = name, extension, normalName, i = 1, parent;

    parent = this.parent.file;
    if (!parent)
      return this;
    while (new File(parent, newName).exists()) {
      normalName ??= this.normalName.replace(/\d+$/, '');
      if (extension == null) {
        extension = this.extension;
        if (extension)
          extension = '.' + extension;
      }
      newName = normalName + i++ + extension;
    }
    if (name == newName)
      return this;
    else
      return new Wb.File(parent, newName);
  }
  /** @property {Wb.File} - 获取文件关联的最小化压缩文件。如果不存在返回null。 */
  get minFile() {
    let me = this;
    let file, name = me.name, pos = name.lastIndexOf('.');
    if (pos == -1) {
      file = null;
    } else {
      file = new Wb.File(me.parent, name.substr(0, pos) + '.min.' + name.substr(pos + 1));
      if (!file.exists)
        file = null;
    }
    return file;
  }
  /** @property {Boolean} - 文件是否为最小化文件，即以.min.*文件结尾的文件。 */
  get isMinFile() {
    let name = this.name, pos = name.lastIndexOf('.');
    if (pos != -1) {
      name = name.substr(0, pos);
      if (name.endsWith('.min'))
        return true;
    }
    return false;
  }
  /** @property {java.io.File} - 如果系统设置了同步目录，获取实际文件/目录。
   * 如果不在同步目录内或没有设置同步目录返回null。 */
  get realFile() {
    return FileUtil.getRealFile(this.file);
  }
  /** @property {String} - 如果系统设置了同步目录，获取实际文件/目录路径。
   * 如果不在同步目录内或没有设置同步目录返回null。 */
  get realFilePath() {
    return this.realFile ? FileUtil.getPath(this.realFile) : null;
  }
  /**
   * 创建新的文件。
   * @param {Boolean} [silent] 当创建失败时是否不抛出异常。
   * @return {Boolean} 如果文件不存在且已成功创建返回true，否则返回false。
   */
  createFile(silent) {
    Wb.checkDemo();
    let file = this.file, succ;

    if (!silent && file.exists()) {
      Wb.raise(Str.alreadyExists.format(this.path));
    }
    succ = file.createNewFile();
    if (succ) {
      let realFile = this.realFile;
      if (realFile) {
        if (!silent && realFile.exists())
          Wb.raise(Str.alreadyExists.format(this.realFilePath));
        succ = realFile.createNewFile();
        if (!silent && !succ)
          Wb.raise(Str.createFailed.format(this.realFilePath));
        realFile.setLastModified(file.lastModified());
      }
    } else if (!silent) {
      Wb.raise(Str.createFailed.format(this.path));
    }
    return succ;
  }
  /**
   * 创建新的目录。
   * @param {Boolean} [createParents] 如果父目录不存在是否创建。
   * @param {Boolean} [silent] 当创建失败时是否不抛出异常。
   * @return {Boolean} 如果目录不存在且已成功创建返回true，否则返回false。
   */
  createFolder(createParents, silent) {
    Wb.checkDemo();
    let file = this.file, succ;

    if (!silent && file.exists()) {
      Wb.raise(Str.alreadyExists.format(this.path));
    }
    succ = createParents ? this.file.mkdirs() : this.file.mkdir();
    if (succ) {
      let realFile = this.realFile;
      if (realFile) {
        if (!silent && realFile.exists())
          Wb.raise(Str.alreadyExists.format(this.realFilePath));
        succ = createParents ? realFile.mkdirs() : realFile.mkdir();
        if (!silent && !succ)
          Wb.raise(Str.createFailed.format(this.realFilePath));
        realFile.setLastModified(file.lastModified());
      }
    } else if (!silent) {
      Wb.raise(Str.createFailed.format(this.path));
    }
    return succ;
  }
  /**
   * 删除当前文件/目录。
   * @param {Boolean} [silent] 当删除失败时是否不抛出异常。
   * @return {Boolean} 如果成功删除返回true，否则返回false。
   */
  remove(silent) {
    Wb.checkDemo();
    let succ = FileUtils.deleteQuietly(this.file);
    if (succ) {
      let realFile = this.realFile;
      if (realFile) {
        succ = FileUtils.deleteQuietly(realFile);
        if (!silent && !succ)
          Wb.raise(Str.deleteFailed.format(this.realFilePath));
      }
    } else if (!silent) {
      Wb.raise(Str.deleteFailed.format(this.path));
    }
    return succ;
  }
  /**
   * 判断当前文件/目录是否包含指定的文件/目录。
   * @param {Wb.File/String} file 判断的文件/目录。
   * @param {Boolean} [excludeSelf] 是否不包含当前文件/目录本身。
   * @return {Boolean} true包含，false不包含。
   */
  contains(file, excludeSelf) {
    if (Wb.isString(file))
      file = new Wb.File(file);
    return FileUtil.isAncestor(this.file, file.file, !excludeSelf);
  }
  /** @property {Boolean} - 当前文件/目录是否位于应用目录内，包含应用目录本身。 */
  get inAppFolder() {
    return (this.path + '/').startsWith(Base.pathText);
  }
  /** @property {Boolean} - 当前文件/目录是否位于模块目录内，包含模块目录本身。 */
  get inModuleFolder() {
    return (this.path + '/').startsWith(Base.modulePathText);
  }
  /** @property {String} - 文件的扩展名。请注意文件名更改后，当前文件将指向更名后的文件。 */
  set extension(value) {
    Wb.checkDemo();
    let name = this.name, lastDotPos = name.lastIndexOf('.');

    if (lastDotPos != -1)
      name = name.substr(0, lastDotPos);
    this.name = name + '.' + value;
  }
  /***/
  get extension() {
    return FileUtil.getFileExt(this.name);
  }
  /** @property {String} - 文件名称。请注意文件名更改后，当前文件将指向更名后的文件。 */
  set name(value) {
    Wb.checkDemo();
    if (this.name != value) {
      let parentFile = this.parent.file, realFile = this.realFile, dstFile = new File(parentFile, value),
        succ = (!dstFile.exists() || System.getProperty('os.name').toLowerCase().includes('win')) &&
          this.file.renameTo(dstFile);
      if (succ) {
        this.file = dstFile;
        if (realFile) {
          succ = realFile.renameTo(new File(realFile.getParentFile(), value));
          if (!succ)
            Wb.raise(Str.renameFailed.format(this.realFilePath));
        }
      } else {
        Wb.raise(Str.renameFailed.format(this.path));
      }
    }
  }
  /***/
  get name() {
    return this.file.getName();
  }
  /** @property {String} - 不包含扩展名的文件名称。 */
  get normalName() {
    let name = this.name, i = name.lastIndexOf('.');
    if (i != -1)
      name = name.substr(0, i);
    return name;
  }
  /** @property {String} - 文件的正式完整绝对路径，路径分隔符统一使用“/”来表示。 */
  get path() {
    return FileUtil.getPath(this.file);
  }
  /** @property {String} - 当前文件/目录位于应用目录内的相对路径。如果在应用目录外返回null。 */
  get relPath() {
    if (this.inAppFolder)
      return this.path.substr(Base.pathLen);
    else
      return null;
  }
  /** @property {String} - 当前文件/目录位于模块目录内的相对路径。如果在模块目录外返回null。 */
  get modulePath() {
    if (this.inModuleFolder)
      return this.path.substr(Base.modulePathLen);
    else
      return null;
  }
  /** @property {String} - 当前文件的类别名称。读取值时同{#extension}属性。 */
  get type() {
    return this.extension;
  }
  /** @property {Boolean} - 判断当前文件是否存在。 */
  get exists() {
    return this.file.exists();
  }
  /** @property {String} - 以utf-8格式编码的字符串。请注意每次读写该属性时都将重新读写文件。 */
  set text(value) {
    Wb.checkDemo();
    if (Wb.isObject(value) || Wb.isArray(value))
      value = Wb.encode(value);
    this.writeString(String(value));
  }
  /***/
  get text() {
    return this.readString();
  }
  /** @property {Object/Array} - JSON对象或数组。请注意每次读写该属性时都将重新读写文件。 */
  set object(value) {
    Wb.checkDemo();
    this.writeString(Wb.encode(value));
  }
  /***/
  get object() {
    let text = this.readString().trimLeft();
    return text ? Wb.decode(text) : {};
  }
  /** @property {Object/Array} - 经过格式化的JSON对象或数组。请注意每次读写该属性时都将重新读写文件。 */
  set prettyObject(value) {
    Wb.checkDemo();
    this.writeString(Wb.encodePretty(value));
  }
  /***/
  get prettyObject() {
    return this.object;
  }
  /**
   * 如果存在需要同步的文件，把文件复制到同步文件中。 @priv
   */
  syncFile() {
    Wb.checkDemo();
    let realFile = this.realFile;
    //更新到同步目录
    if (realFile) {
      FileUtils.copyFile(this.file, realFile);
    }
  }
  /** @property {byte[]} - 字节数组。请注意每次读写该属性时都将重新读写文件。 */
  set bytes(value) {
    Wb.checkDemo();
    FileUtils.writeByteArrayToFile(this.file, value);
    this.syncFile();
  }
  /***/
  get bytes() {
    this.checkExists();
    return FileUtils.readFileToByteArray(this.file);
  }
  /** @property {ByteArrayInputStream} - 把文件一次性读入到内存中的字节输入流。访问该流后无需关闭。 */
  get byteStream() {
    return new ByteArrayInputStream(this.bytes);
  }
  /**
   * 把文件写到指定的输出流中。
   * @param {OutputStream} os 输出流。
   */
  writeTo(os) {
    FileUtils.copyFile(this.file, os);
  }
  /**
   * 把指定输入流写到文件中。写入完成后该输入流会被关闭。
   * @param {InputStream} is 输入流。
   */
  readFrom(is) {
    try {
      Wb.checkDemo();
      FileUtils.copyInputStreamToFile(is, this.file);
      this.syncFile();
    } finally {
      SysUtil.close(is);
    }
  }
  /** @property {InputStream} - 把指定的输入流写入到文件中。写入完成后{{value}}指定的输入流会被关闭。 */
  set stream(value) {
    Wb.checkDemo();
    this.readFrom(value);
  }
  /** @property {InputStream} - 获取缓冲的文件输入流，该流不会自动关闭，请在使用完成后关闭。 */
  get stream() {
    this.checkExists();
    return new BufferedInputStream(new FileInputStream(this.file));
  }
  /** @property {String} - Base64编码的字符串。请注意每次读写该属性时都将重新读写文件。 */
  set base64(value) {
    Wb.checkDemo();
    this.bytes = StringUtil.decodeBase64(value);
  }
  /***/
  get base64() {
    return StringUtil.encodeBase64(this.bytes);
  }
  /**
   * 读取当前文件的文本。
   * @param {String} [charset] 文件文本编码方式。默认为"utf-8"。
   * @return {String} 文件文本内容。
   */
  readString(charset) {
    this.checkExists();
    return FileUtils.readFileToString(this.file, charset ?? Wb.utf8);
  }
  /**
   * 检查文件是否存在，如果不存在抛出异常。
   */
  checkExists() {
    let me = this;
    if (!me.exists)
      Wb.raise(Str.notExists.format(me.path));
  }
  /**
   * 把文本写入到当前文件。
   * @param {String} content 文件文本内容。
   * @param {String} [charset] 文件文本编码方式。默认为"utf-8"。
   */
  writeString(content, charset) {
    Wb.checkDemo();
    FileUtils.writeStringToFile(this.file, content, charset ?? Wb.utf8);
    this.syncFile();
  }
  /** @property {Number} - 文件最后修改日期。以1970年1月1日0时0分0秒距离该日期所代表时间的毫秒数表示。 */
  set lastModified(value) {
    Wb.checkDemo();
    let realFile = this.realFile;
    this.file.setLastModified(value);
    if (realFile)
      realFile.setLastModified(value);
  }
  /***/
  get lastModified() {
    return this.file.lastModified();
  }
  /** @property {Date} - 文件最后修改日期 */
  set lastModifiedDate(value) {
    this.lastModified = value.getTime();
  }
  /***/
  get lastModifiedDate() {
    return new Date(this.lastModified);
  }
  /**
   * 如果当前文件已经被缓存，则清除缓存中的该文件。
   */
  clearBuffer() {
    Wb.checkDemo();
    SysUtil.clearBuffer(this.file);
  }
  /**
   * 获取所有子文件/目录列表。如果当前文件不是目录则返回null。
   * @param {String} [sortType] 排序类型。默认为不排序。
   * -'name': 文件名
   * -'size': 文件大小
   * -'type': 文件类别
   * -'date': 修改日期
   * @param {Boolean} [desc] 是否逆向排序。
   * @return {Wb.File[]} 子文件/目录列表。
   */
  listFiles(sortType, desc) {
    let files = this.file.listFiles();

    if (files) {
      if (sortType)
        FileUtil.sort(files, sortType, !!desc);
      return files.map(file => new Wb.File(file));
    } else
      return null;
  }
  /** @property {Wb.File[]} - 获取所有子文件/目录列表。如果当前文件不是目录则返回null。 */
  get items() {
    return this.file.listFiles()?.map(file => new Wb.File(file)) ?? null;
  }
  /** @property {Wb.File[]} - 获取所有按文件名排序后的子文件/目录列表。如果当前文件不是目录则返回null。 */
  get orderItems() {
    return this.listFiles('name');
  }
  /**
   * 判断当前文件同另一个文件的路径是否相同。请注意不同操作系统对文件名的大小写敏感不尽相同。
   * @param {Wb.File} file 文件对象。
   * @return {Boolean} true相同，false不相同。
   */
  equals(file) {
    return this.file.equals(file.file);
  }
  /** @property {Boolean} - 判断当前对象是否为文件。 */
  get isFile() {
    return this.file.isFile();
  }
  /** @property {Boolean} - 判断当前对象是否为目录。 */
  get isFolder() {
    return this.file.isDirectory();
  }
  /** @property {Boolean} - 判断当前对象是否为模块文件。 */
  get isModuleFile() {
    return this.isFile && this.name.endsWith('.xwl');
  }
  /** @property {Number} - 以字节为单位的文件大小。 */
  get length() {
    return this.file.length();
  }
  /** @property {Boolean} - 是否具有子文件或目录。 */
  get hasItems() {
    return this.file.list()?.length > 0;
  }
  /** @property {Wb.File} - 上级文件，如果无上文件文件返回null。 */
  get parent() {
    let parent = this.file.getParentFile();
    return parent ? new Wb.File(parent) : null;
  }
  /**
   * 向下遍历当前目录下的直接子文件/目录，对这些文件/目录执行一次给定的方法。如果方法返回false遍历将中断。
   * Example: 
   * 
   *     folder.each(file => console.log(file));
   * 
   * @param {Function} fn 遍历每个文件时执行的方法。如果方法返回false，将中断遍历。
   * @param {Wb.Component} fn.file 正在处理的文件。
   * @param {String} fn.index 正在处理的文件索引。
   * @param {Object} [scope] fn内的this对象，默认为当前文件本身。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  each(fn, scope) {
    return this.items?.each(fn, scope ?? this) ?? true;
  }
  /**
   * 按被遍历对象的each方法进行遍历并判断是否存在满足某个条件的文件。
   * @param {Function} fn 遍历每个文件时执行的方法。如果方法返回false，将中断遍历。
   * @param {Wb.Component} fn.file 正在处理的文件。
   * @param {String} fn.index 正在处理的文件索引。
   * @param {Object} [scope] fn内的this对象，默认为当前文件本身。
   * @return {Object} 只要有一个文件满足测试的条件返回true，否则返回false。空目录返回false。
   */
  some(fn, scope) {
    return this.items?.some(fn, scope ?? this) ?? false;
  }
  /**
   * 按对象的each方法进行遍历并判断所有文件是否均满足某个条件。
   * @param {Function} fn 遍历每个文件时执行的方法。如果方法返回false，将中断遍历。
   * @param {Wb.Component} fn.file 正在处理的文件。
   * @param {String} fn.index 正在处理的文件索引。
   * @param {Object} [scope] fn内的this对象，默认为当前文件本身。
   * @return {Object} 所有文件满足测试的条件返回true，否则返回false。空目录返回true。
   */
  every(fn, scope) {
    return this.items?.every(fn, scope ?? this) ?? true;
  }
  /**
   * 向下遍历当前文件/目录下的所有文件/目录，对这些文件/目录执行一次给定的方法。如果方法返回false遍历将中断。
   * Example: 
   * 
   *     folder.cascade(file => console.log(file)); //遍历folder下的所有文件
   * 
   * @param {Function} fn 执行的方法，如果方法返回false将中断遍历，返回null当前节点下的条目将不再遍历。
   * @param {Object} fn.file 正在处理的文件。
   * @param {Object} [scope] fn内的this对象，默认为当前文件/目录本身。
   * @param {Boolean} [includeSelf] 遍历时是否包含文件/目录本身，默认为false即排序文件/目录本身。
   * @param {Boolean} [ordered] 是否按文件名排序。
   * @return {Boolean} 是否完成遍历，true完成，false中断。
   */
  cascade(fn, scope, includeSelf, ordered) {
    return Wb.cascade(this, fn, ordered ? 'orderItems' : 'items', scope, null, includeSelf);
  }
  /**
   * 按对象的cascade方法进行遍历并判断是否存在满足某个条件的文件。详见{#cascade}。
   * @return {Boolean} 只要有一个文件满足测试的条件返回true，否则返回false。
   */
  cascadeSome(...args) {
    return Wb.PT.cascadeSome.apply(this, args);
  }
  /**
   * 按对象的cascade方法进行遍历并判断所有文件是否均满足某个条件。详见{#cascade}。
   * @return {Boolean} 所有文件满足测试的条件返回true，否则返回false。
   */
  cascadeEvery(...args) {
    return Wb.PT.cascadeEvery.apply(this, args);
  }
  /**
   * 向下遍历当前文件/目录及其下的所有文件/目录，对这些文件/目录执行一次给定的方法。如果方法返回false将中断遍历，
   * 返回null当前节点下的条目将不再遍历。该方法同{#cascade}方法区别为默认遍历文件/目录本身。详见{#cascade}说明。
   * @return {Boolean} 是否完成遍历，true完成，false中断。
   */
  cascadeSelf(fn, scope) {
    return this.cascade(fn, scope, true);
  }
  /**
   * 向上遍历当前文件/目录及其上级的所有目录，对这些文件/目录执行一次给定的方法。如果方法返回false遍历将中断。
   * @param {Object} fn.file 正在处理的文件。
   * @param {Object} [scope] fn内的this对象，默认为当前文件/目录本身。
   * @param {Boolean} [excludeSelf] 遍历时是否排除当前文件，默认为false即包含当前文件。
   * @return {Boolean} 是否完成遍历，true完成，false中断。
   */
  bubble(fn, scope, excludeSelf) {
    return Wb.bubble(this, fn, 'parent', scope, excludeSelf);
  }
  /**
   * 按对象的bubble方法进行遍历并判断是否存在满足某个条件的文件。详见{#bubble}。
   * @return {Boolean} 只要有一个文件满足测试的条件返回true，否则返回false。
   */
  bubbleSome(...args) {
    return Wb.PT.bubbleSome.apply(this, args);
  }
  /**
   * 按对象的bubble方法进行遍历并判断所有文件是否均满足某个条件。详见{#bubble}。
   * @return {Boolean} 所有文件满足测试的条件返回true，否则返回false。
   */
  bubbleEvery(...args) {
    return Wb.PT.bubbleEvery.apply(this, args);
  }
  /**
   * 向上遍历当前文件/目录上级的所有目录，对这些目录执行一次给定的方法。如果方法返回false遍历将中断。详见{#bubble}。
   */
  bubbleParent(fn, scope) {
    return this.bubble(fn, scope, true);
  }
  /***/
  toString() {
    return this.path;
  }
  /***/
  toJSON() {
    return this.path;
  }
}
/**
 * 数据库连接。
 */
Cls['Wb.Connection'] = class connection extends Wb.Closable {
  /** @property {Object} - 名称和连接组成的对象。 @priv */
  static connections = {};
  /** @property {Object} - 事务隔离级别。 */
  static isolationMap = { none: 0, uncommitted: 1, committed: 2, repeatable: 4, serializable: 8 };
  /**
   * 获取指定名称的连接，如果不存在将创建一个新的连接。
   * @param {String} [name] 数据库名称。默认为默认数据库。
   * @return {Wb.Connection} 数据库连接。
   */
  static get(name) {
    name ||= Config.defaultSource;
    return this.connections[name] ??= new Wb.Connection(name);
  }
  /** @property {Connection} connection 数据库连接对象。 */
  /** @property {String} name 数据库名称。如果由数据库名称构造时有效。 */
  /**
   * 生成数据库连接的构造器方法。
   * @param {String/Connection} [name] 数据库名称或连接对象。默认为默认数据库。
   */
  constructor(name) {
    super();
    name ||= Config.defaultSource;
    if (Wb.isString(name)) {
      this.name = name;
      this.connection = DataSource.getConnection(name);
    } else {
      this.connection = name;
    }
  }
  /**
   * 创建SQL语法对象。
   * @param {String} sql SQL语句。
   * @param {Boolean} [isCall] 是否创建CallableStatement。
   * @param {Boolean} [returnKeys] 是否返回键值。
   * @return {Wb.Statement} 语法对象。
   */
  createStatement(sql, isCall, returnKeys) {
    let st;

    if (isCall && !returnKeys)
      st = this.connection.prepareCall(sql);
    else {
      if (returnKeys)
        st = this.connection.prepareStatement(sql, 1);
      else
        st = this.connection.prepareStatement(sql);
    }
    return new Wb.Statement(st, this);
  }
  /**
   * 开始事务，使当前连接的所有数据库操作的自动事务提交改为手动事务提交。如果已经开始事务该方法无任何效果。
   * @param {String} [isolation] 事务隔离级别。详见{#Wb.Connection.isolation}。
   */
  startTrans(isolation) {
    let conn = this.connection;
    if (conn.getAutoCommit()) {
      conn.setAutoCommit(false);
      if (isolation)
        this.isolation = isolation;
    }
  }
  /** @property {Boolean} - 当前连接执行完SQL后是否自动提交。 */
  set autoCommit(value) {
    this.connection.setAutoCommit(value);
  }
  /***/
  get autoCommit() {
    return this.connection.getAutoCommit();
  }
  /** @property {String} - 事务隔离级别。当连接在连接池中被重复使用（关闭后再获取）该属性不会被重置。如果需要
   * 指定默认的隔离级别，可配置数据源的defaultTransactionIsolation属性。相关值描述：
   * -'none': 事务不支持。
   * -'uncommitted': 可能发生脏读、不可重复读和幻读。如果回滚任何更改，则第二个事务将检索到无效行。
   * -'committed': 防止脏读。可能发生不可重复读取和幻读。该级别仅禁止事务读取其中包含未提交更改的行。
   * -'repeatable': 防止脏读和不可重复读；幻读可能发生。该级别禁止事务读取其中未提交更改的行，同时也禁止一个\
   * 事务读取一行，第二个事务更改该行，第一个事务重新读取该行，第二次得到不同值的情况。
   * -'serializable': 防止脏读、不可重复读和幻读。
   */
  set isolation(value) {
    let level = this.constructor.isolationMap[value?.toLowerCase()];
    if (level === undefined)
      Wb.raise('Invalid transaction isolation "' + value + '".')
    this.connection.setTransactionIsolation(level);
  }
  /***/
  get isolation() {
    return Wb.findKey(this.constructor.isolationMap, this.connection.getTransactionIsolation());
  }
  /**
   * 回滚事务，撤消在当前事务中所做的所有更改并释放当前连接的所有数据库锁。
   */
  rollback() {
    let conn = this.connection;
    if (!conn.getAutoCommit()) {
      conn.rollback();
      conn.setAutoCommit(true);
    }
  }
  /**
   * 提交事务，使自上次提交/回滚以来所做的所有更改持久化并释放当前连接的所有数据库锁。
   */
  commit() {
    let conn = this.connection;
    if (!conn.getAutoCommit()) {
      conn.commit();
      conn.setAutoCommit(true);
    }
  }
  /** @property {DatabaseMetaData} - 当前数据库的元数据。 */
  get metaData() {
    return this.connection.getMetaData();
  }
  /***/
  close(hasExcept) {
    let ex, me = this, conn = me.connection;
    super.close();
    if (!conn)
      return;
    if (me.name != null)
      Wb.Connection.connections[me.name] = undefined;
    try {
      if (!me.autoCommit) {
        if (hasExcept)
          me.rollback();
        else
          me.commit();
      }
    } catch (e) {
      ex = e;
    }
    conn.close();
    if (ex)
      Wb.raise(ex);
  }
  /** @property {String} - 数据库的产品名称。 */
  get dbName() {
    return this.metaData.getDatabaseProductName();
  }
  /**
   * 判断当前数据库产品名称是否包含指定的名称。
   * @param {String} name 数据库产品名称。
   * @return {Boolean} true包含，false未包含。
   */
  match(name) {
    return this.dbName.toLowerCase().includes(name?.trim().toLowerCase());
  }
  /** @property {String} - 数据库默认的Schema. */
  get schema() {
    let me = this, schema = me.connection.getSchema();
    if (schema)
      return schema;
    let dbName = me.dbName.toLowerCase();
    if (dbName.includes('sql server')) {
      return Wb.getRecord({ sql: 'select schema_name()', db: me })?.[0] || null;
    } else {
      return null;
    }
  }
}
/**
 * 数据库Statement。
 */
Cls['Wb.Statement'] = class statement extends Wb.Closable {
  /** @property {Statement} statement 数据库Statement。 */
  /**
   * 生成Statement的构造器方法。
   * @param {Statement} st 语法对象。
   */
  constructor(st) {
    super();
    this.statement = st;
  }
  /** @property {Connection} - 关联的数据库连接对象。 */
  get connection() {
    return this.statement.getConnection();
  }
  /**
   * 获取结果集。
   * @return {Wb.ResultSet} 结果集。
   */
  getResultSet() {
    return new Wb.ResultSet(this.statement.getResultSet());
  }
  /**
   * 执行查询并返回结果集。
   * @return {Wb.ResultSet} 结果集。
   */
  executeQuery() {
    return new Wb.ResultSet(this.statement.executeQuery());
  }
  /***/
  close() {
    super.close();
    this.statement.close();
  }
}
/**
 * 数据库结果集。
 */
Cls['Wb.ResultSet'] = class resultSet extends Wb.Closable {
  /** @property {ResultSet} resultSet 数据库结果集。 */
  /**
   * 生成结果集的构造器方法。
   * @param {ResultSet} rs 数据集对象。
   */
  constructor(rs) {
    super();
    this.resultSet = rs;
  }
  /***/
  close() {
    super.close();
    this.resultSet.close();
  }
  /** @property {Statement} - 关联的Statement对象。 */
  get statement() {
    return this.getStatement();
  }
  /** @property {Connection} - 关联的数据库连接对象。 */
  get connection() {
    return this.statement.getConnection();
  }
  /** @property {ResultSetMetaData} - 结果集元数据。 */
  get metaData() {
    return this.resultSet.getMetaData();
  }
  /** @property {Array} - 所有字段名称和类型对象组成的数组。对象中name为字段名称，type为字段类型。 */
  get fieldTypes() {
    let meta = this.metaData, i, j = meta.getColumnCount(), types = [];

    for (i = 1; i <= j; i++)
      types.push({ name: DbUtil.getFieldName(meta, i), type: meta.getColumnType(i) });
    return types;
  }
  /**
   * 遍历整个结果集的方法。
   * @param {Function} fn 回调方法。
   * @param {Object} .row 行数据对象。
   * @param {Number} .index 行索引。
   */
  forEach(fn) {
    let me = this, rs = me.resultSet, val, index = 0, fieldType, i, j,
      fieldTypes = me.fieldTypes, row, Query = Wb.Query;

    j = fieldTypes.length;
    while (rs.next()) {
      row = {};
      for (i = 0; i < j; i++) {
        fieldType = fieldTypes[i];
        val = Query.getObject(rs, i + 1, fieldType.type, true, true);
        if (val != null)
          row[fieldType.name] = val;
      }
      fn.call(me, row, index++);
    }
  }
  /** @property {Number} - 虚拟的记录集长度。用于{#forEach}方法。 */
  get length() {
    return 1;
  }
  /** @property {Number} - 是否可作为数组处理的标识。 */
  get xLikeArray() {
    return true;
  }
  /**
   * 复制当前结果集数据到指定数据库表。如果发生异常操作将被回滚。成功后事务将被提交。
   * @param {String} tableName 表名。
   * @param {String} [db] 数据库名称。默认为默认数据库。
   * @param {Boolean} [truncate] 复制前是否先清空数据库表。
   */
  copyTo(tableName, db, truncate) {
    db = Wb.getConn(db);
    db.startTrans();
    if (truncate)
      Wb.sql('delete from ' + tableName, db);
    Wb.sync({ tableName, db, insert: this });
  }
}
/**
 * 数据库查询类。
 */
Cls['Wb.Query'] = class query extends Wb.Base {
  /** @property {RegExp} - 匹配call的正则表达式。 */
  static matchCallReg = /^\{\s*(\?\s*=\s*)?call\b/i;
  /**
   * 删除SQL语句中的注释。
   * @param {String} sql SQL语句。
   * @return {String} 删除注释后的SQL语句。
   */
  static removeComments(sql) {
    if (!sql) return '';
    let len = sql.length, result = new Array(len), inLineComment = false, inBlockComment = false, resultIndex = 0,
      quoteType = 0, i, j, c, next, backslashCount;

    for (i = 0; i < len; i++) {
      c = sql[i];
      next = sql[i + 1];
      if (!quoteType) {
        if (inLineComment) {
          if (c === '\n' || c === '\r') {
            inLineComment = false;
            result[resultIndex++] = c;
          }
          continue;
        }
        if (inBlockComment) {
          if (c === '*' && next === '/') {
            inBlockComment = false;
            i++;
          }
          continue;
        }
        if (c === '-' && next === '-') {
          inLineComment = true;
          i++;
          continue;
        }
        if (c === '/' && next === '*') {
          inBlockComment = true;
          i++;
          continue;
        }
        if (c === "'") quoteType = 1;
        else if (c === '"') quoteType = 2;
        else if (c === '`') quoteType = 4;
      } else {
        if (c === "'" && quoteType === 1 || c === '"' && quoteType === 2 || c === '`' && quoteType === 4) {
          j = i - 1;
          backslashCount = 0;
          while (j >= 0 && sql[j] === '\\') {
            backslashCount++;
            j--;
          }
          if (backslashCount % 2 === 0) {
            quoteType = 0;
          }
        }
      }
      if (!inLineComment && !inBlockComment) {
        result[resultIndex++] = c;
      }
    }
    return result.slice(0, resultIndex).join('');
  }
  /**
   * 获取"name=param"格式的参数列表中，由非空值参数组成的表达式。
   * @param {Array} [paramList] 参数列表。
   * @param {Boolean} [noWhere] 是否不添加where关键字。
   * @param {Boolean} [useOr] 是否使用or连接参数。 false用and连接，true用or连接。
   * @param {Object} [params] 参数对象。默认为{#Params|globalThis.Params}。
   * @return {String} 非空值参数使用" and "连接的表达式。
   */
  static getParamsIf(paramList, noWhere, useOr, params) {
    let result = [];

    params ??= Params;
    paramList?.forEach(item => {
      if (!Wb.isEmpty(params[item.firstItem('=')])) {
        result.push(item);
      }
    });
    if (result.length)
      return (noWhere ? '' : ' where ') + result.join(useOr ? ' or ' : ' and ');
    else
      return '';
  }
  /** @property {String} result 使用{#!run}方法返回的值类型。
   * -null: 不返回结果。{#!run}方法的returns参数为false导致。
   * -"value": 单个影响记录数，结果集或undefined(SQL无任何值返回)。
   * -"array": 按顺序返回的多个影响记录数或结果集。
   * -"batch": 批处理执行结果影响记录数组成的数组。
   * -"object": 影响记录数，结果集和输出参数值组成的对象，对象格式为：{$return: [影响记录数和结果集按顺序组成的数组...]，\
   * param1: 输出参数1, param2: 输出参数2, ...}。
   * @static 
   */
  /** @property {Array} keys 执行语句后返回的所有键值，如添加记录时的自增字段值。 @static */
  /**
   * 执行任意的SQL语句，并获取其返回的结果。执行该方法后除数据库连接之外的所有需要关闭的资源（包括ResultSet, Statement，
   * Clob, Blob和InputStream等）都将立即关闭。数据库连接在执行上下文结束后关闭，如果未显式指定连接参数且需要立即
   * 关闭数据库连接，可使用{#Wb.getConn}方法获取数据库连接并调用对应的关闭方法。
   * Example:
   *
   *     Wb.sql('delete from table1 where 1 = 0', 'my-oracle'); // 返回0，Wb.sql为Wb.Query.run别名
   *     Wb.sql({sql: 'select * from table1', db: 'my-oracle', fn(row){ process(row); }}); // 通过配置对象调用方法
   *     Wb.sql('{call sp({?timestamp|inParam?}, {*cursor|p1*}, {!double|3|p2!})}'); // 访问存储过程
   *
   * @param {Object/String} configs 执行SQL语句的配置对象或SQL语句。
   * @param {String/Wb.Connection} [.sql] SQL语句。在SQL语句中可以使用输入和输出参数，输入参数使用{?type|scale|name?}表示，
   * 输出参数使用{*type|scale|name*}表示，既是输入又是输出参数使用{!type|scale|name!}表示，其中type和scale可以省略。省略type
   * 后将按对象类型进行处理，建议加上type。当输入参数存在scale（scale可为空，但必须保留占位符"|"）时，将强制按对象类型进行处理。
   * @param {String/Wb.Connection} [.db] 数据库名称或连接。缺省为默认数据库。如果为名称将获取执行上下文内同名的共享连接，
   * 该连接将在执行上下文结束后自动关闭。
   * @param {Object/Array} [.params] 传递到SQL语句中的输入参数。如果需批处理请设置参数为数组格式或任意带forEach方法的对象。
   * @param {Boolean} [.contextParams] 是否自动引用上下文的session属性和request的属性和参数。默认为true。同名的参数params
   * 中指定的参数优先。contextParams中的同名参数优先级从高到低分别为session属性，request属性和request参数。
   * @param {Boolean/String} [.trans] 当前数据库连接的事务隔离级别，设置为true将启用事务，设置为字符串将指定隔离
   * 级别。如果指定数据库连接的事务已经启用，设置该属性将无任何效果。隔离级别见{#Wb.Connection.isolation}。如果params
   * 为数组默认为true。手动管理事务请访问{#Wb.startTrans}, {#Wb.commit}和{#Wb.rollback}方法。
   * @param {Boolean} [.commit] 如果存在事务，执行完成之后是否自动commit事务。
   * @param {Function} [.fn] 处理返回结果和输出参数的回调函数。系统会依次传递每个返回结果和输出参数到该函数。当处理结果集时，
   * 结果集的每行记录读取后的值将传递入该回调函数中，返回false将中断当前结果集的遍历。
   * @param {Object/Number} [..item] 当前正在处理的结果集记录数据、影响记录数或输出参数值。
   * @param {String/Number} [..name] 输出参数名称或返回结果索引号。当SQL返回多个结果集时，相同参数名称或索引号的为同一个结果集。
   * @param {Number} [..index] 处理结果集时的当前记录索引号。处理其它数据时该参数无效。
   * @param {Boolean} [.unique] 指定插入、更改或删除记录等操作时返回影响记录数是否有且只有1，否则抛出异常。默认开始事务。
   * @param {Boolean} [.batch] 当params参数为数组时是否使用批处理。默认为true。
   * @param {Boolean/Number/Array} [.rs] 是否读取结果集中的记录：
   * -false: 不读取记录。例如当我们仅需执行SQL而不关心其返回的大量结果时，可设置此参数为false或returns属性为false以提高性能。
   * -true: 返回{#Wb.ResultSet}对象替代返回记录列表。请注意非输出参数的结果集由于读取下一个结果集会导致上一个结果集关闭，\
   * 因此首个结果集后的数据将不再返回。输出参数中的结果集仍可正常返回。设置该值后关联的ResultSet和Statement将不会被立即关闭。\
   * 相关资源在执行上下文结束后会自动关闭，建议显式关闭结果集。
   * -Number: 允许读取记录的最大数量。当读取大量记录时建议使用{{fn}}来遍历和获取记录值，否则可能导致内存溢出异常。-1表示\
   * 读取全部记录。
   * -Number[]: 按顺序读取各个结果集记录时允许读取的最大记录数组成的数组，如[0, 100, null]表示第1个结果集不读取记录，\
   * 第2个结果集取100条，第3个结果集取全部记录。
   * -null: 当指定fn参数时读取全部，否则读取{#Wb.maxRows}限定数量的记录数。默认值。
   * @param {Boolean/String} [.blob] 是否读取BLOB字段中的内容至内存字节流中。如果为"text"表示以base64表示。
   * @param {Boolean/Number} [.clob] 是否读取clob字段中的内容至字符串。默认为true。如果值为数字表示读取的最大字符数量。
   * @param {Boolean} [.array] 生成的记录数据是否使用数组。false使用对象，true使用数组。
   * @param {Number/Boolean} [.from] 获取每个结果集中的该值指定索引开始的记录。首条为0。缺省从上下文"_from"参数获取值。\
   * 无值从首条记录开始获取。遍历最大记录数受rs参数指定获取的记录数限制。设置false显式取消开始限制。
   * @param {Number/Boolean} [.to] 获取每个结果集中的该值指定索引结束的记录。首条为0。缺省从上下文"_to"参数获取值。\
   * 无值获取到结果集末尾。遍历最大记录数受rs参数指定获取的记录数限制。设置false显式取消结束限制。
   * @param {Boolean} [.paging] 是否根据"from"和"to"参数进行自动分页。
   * @param {Boolean} [.long] 是否使用长整型，如果处理记录数可能超出最大整数值时设置true。如果数据库不支持将抛出异常。
   * @param {Number} [.fetchSize] 从数据库中批量获取数据的行数。默认null或0表示自动。
   * @param {Number} [.timeout] 执行SQL超时时长，单位为秒。默认null或0表示永不超时。
   * @param {Boolean} [.readonly] 是否为只读模式，该模式下会作特定处理，例如仅创建大于255长度字符型字段的自读文本编辑器，
   * blob字段不可编辑等。
   * @param {Boolean} [.returns] 运行SQL后是否返回运行结果的返回值和输出参数。默认如果设置fn该值为false，否则为true。
   * @param {Boolean} [.returnObject] 是否始终按object类型返回结果。见{#result}说明。
   * @param {Boolean/String} [.columns] 是否返回列和相关元数据。默认为true。如果为"tree"表示生成树控件专用列，该模式下
   * 默认将不生成行号。
   * @param {Boolean} [.nullValue] 当值为null是否返回。默认为true。
   * @param {String/Array/Boolean} [.dict] 获取数据时依次使用的字典组名列表或数组。当以字符串指定多个名称时，请使用","分隔。设置为
   * true表示使用所有未指定组名的字典。当指定多个组名时，以"false"结尾表示不使用所有未指定组名的字典，否则未找到的字段将在所有未指定
   * 组名的字典中查找。
   * @param {Object/String} [.kv] 字段名称和键名称映射map。如果为字符串表示字段名称等于键名称，多个字段以逗号分隔。
   * @param {Number/Boolean/String/Object} [.total] 当指定columns返回列和相关元数据时，返回的可访问记录总数。设置为false不返回记
   * 录总数，设置为true返回结果集可返回的记录总数。如果为字符串表示通过该SQL语句获取记录总数。如果为对象表示使用{#Wb.getRecord}方法
   * 获取记录总数的参数配置对象。默认为true。
   * @param {Boolean} [.dateFormat] 日期时间类型数据是否使用本地完整格式。
   * @param {Boolean/String} [.returnKeys] 是否返回自动创建的键值，如添加记录时的自增字段值。可通过{#keys}属性访问返回的
   * 键值。{{'all'}}表示返回整个keys结果集组成的数组。
   * @param {String/Wb.Connection/Function} [dbOrFn] 数据库名称或回调函数。见db参数或fn参数说明。设置该值将覆盖已经
   * 设置的db或fn参数值。
   * @param {Function} [fn] 回调函数。见fn参数说明。设置该值将覆盖已经设置的fn参数值。
   * @return {Object/Array} 所有返回影响记录数、结果集和输出参数值组成的数组或对象。返回的数据有4种可能的类型，
   * 可通过{#result}属性判断，详见{#result}说明。仅当returns参数为true时才会返回值，否则始终返回undefined。
   */
  static run(configs, dbOrFn, fn) {
    let conn, st, rawSt, rs, isRs, sql, returns, retValue, value, meta, rsValue, data, long,
      params, batch, contextParams, unique, index, trans, ct, likeArray, returnKeys, commit;

    this.result = null;
    this.keys = null;
    configs = Wb.isString(configs) ? { sql: configs } : Wb.copy(configs);
    if (dbOrFn) {
      if (Wb.isFunction(dbOrFn))
        configs.fn = dbOrFn;
      else
        configs.db = dbOrFn;
    }
    if (fn)
      configs.fn = fn;
    fn = configs.fn;
    sql = configs.sql;
    returns = configs.returns ?? !fn;
    rsValue = configs.rs;
    params = configs.params;
    trans = configs.trans;
    long = configs.long;
    commit = configs.commit;
    returnKeys = configs.returnKeys;
    contextParams = configs.contextParams ?? true;
    unique = configs.unique;
    batch = configs.batch ?? true;
    conn = Wb.getConn(configs.db);
    likeArray = Wb.likeArray(params);
    if (likeArray || unique)
      trans ??= true;
    if (conn.autoCommit && trans) {
      conn.autoCommit = false;
      if (Wb.isString(trans))
        conn.isolation = trans;
    }
    meta = this.compile(conn, sql, returnKeys);
    try {
      st = meta[0];
      rawSt = st.statement;
      if (value = configs.fetchSize)
        rawSt.setFetchSize(value);
      sql = meta[1];
      meta = meta[2];
      if (value = configs.timeout)
        rawSt.setQueryTimeout(value);
      if (likeArray) {
        //批处理
        if (!batch)
          retValue = [];
        params.forEach(param => {
          this.setParams(rawSt, meta, param, contextParams, sql);
          if (batch) {
            rawSt.addBatch();
          } else {
            value = rawSt.executeUpdate();
            if (unique && value != 1 && value != -2)
              this.notUnique();
            retValue.push(value);
            if (returnKeys)
              this.loadKeys(rawSt, returnKeys);
          }
        });
        if (batch) {
          retValue = long ? rawSt.executeLargeBatch() : rawSt.executeBatch();
          if (unique && retValue.some(item => item != 1 && item != -2))
            this.notUnique();
          if (returnKeys)
            this.loadKeys(rawSt, returnKeys);
        }
        fn?.(retValue, 0);
        if (commit)
          conn.commit();
        if (returns) {
          this.result = 'batch';
          return retValue;
        }
        return;
      }
      if (returns) {
        retValue = [];
        data = {};
      }
      this.setParams(rawSt, meta, params, contextParams, sql);
      isRs = rawSt.execute();
      if (returnKeys)
        this.loadKeys(rawSt, returnKeys);
      index = 0;
      //读取返回结果
      while (true) {
        if (isRs) {
          if (fn || returns) {
            ct = rsValue?.shift?.();
            if (rsValue !== false && ct != 0) {
              rs = st.getResultSet();
              if (returns && rsValue === true) {
                retValue.push(rs);
                //不再获取更多结果集，否则前一个结果集将关闭
                break;
              } else {
                value = this.getData(rs.resultSet, configs, index, ct);
                rs.close();
              }
            } else {
              value = null;
            }
          }
        } else {
          value = long ? rawSt.getLargeUpdateCount() : rawSt.getUpdateCount();
          if (value == -1)
            break;
          else {
            if (unique && value != 1 && value != -2)
              this.notUnique();
          }
          fn?.(value, index);
        }
        if (returns)
          retValue.push(value);
        isRs = rawSt.getMoreResults();
        index++;
      }
      if (returns) {
        //读取输出参数
        this.getParams(rawSt, meta, data, configs);
        data.$return = retValue;
        if (!configs.returnObject && Wb.getSize(data) == 1) {
          if (retValue.length < 2) {
            this.result = 'value';
            data = retValue[0];
          } else {
            this.result = 'array';
            data = retValue;
          }
        } else {
          this.result = 'object';
        }
      }
      if (commit)
        conn.commit();
    } finally {
      if (rsValue !== true) {
        rs?.close();
        st?.close();
      }
    }
    if (returns)
      return data;
  }
  /**
   * 加载键值，如添加记录时的自增主键值。
   * @param {Statement} st 语法对象。
   * @param {String} [type] 如果值为{{'all'}}，返回全部字段值组成的数组，否则返回首个字段值组成的数组。
   */
  static loadKeys(st, type) {
    let result;
    try {
      if (type == 'all')
        result = this.getAllRows(st.getGeneratedKeys());
      else
        result = this.getAllRecords(st.getGeneratedKeys())?.pluck(0);
      if (this.keys)
        this.keys.pushAll(result);
      else
        this.keys = result;
    } catch (e) {
      this.keys = null;
    }
  }
  /**
   * 根据指定的数组获取SQL in 语句表达式和参数列表。
   * Example:
   *
   *      let sqlMap = Wb.Query.getArraySql(['role1', 'role2', 'role3'], 'varchar');
   *      let recs = Wb.getRecords({
   *        sql: 'select role_name from wb_role where sid in (' + sqlMap.sql + ')',
   *        params: sqlMap.params
   *      });
   *
   * @param {Array} values 参数值。
   * @param {String} [type] 参数类型。
   * @return {Object} 生成的对象，sql表示SQL语句片断，params表示参数组成的对象。
   */
  static getArraySql(values, type) {
    let name, sql = '', params = {};
    values.forEach((value, i) => {
      if (i > 0)
        sql += ',';
      name = 'xP' + i;
      params[name] = value;
      sql += '{?' + (type ? (type + '|') : '') + name + '?}';
    });
    return { sql, params };
  }
  /**
   * 获取结果集数据。获取完成后结果集不会被关闭。 @priv
   * @param {ResultSet} resultSet 结果集。
   * @param {Object} [configs] 可选参数对象。详见{#run}方法说明。
   * @param {String/Number} [rsName] 回调函数中的结果集名称或索引。
   * @param {Number} [rs] 允许读取的最大记录数量。详见{#run}方法configs的rs参数说明。
   * @return {Object} 结果集元数据和记录数据列表组成的对象或undefined。其中columns为列元数据，
   * fields为字段元数据，items为记录数据。
   */
  static getData(resultSet, configs, rsName, rs) {
    let fn, useArray, dateFormat, readBlob, readClob, fromIndex, toIndex, hasFrom, hasTo, dict, kv, returns,
      dbType, rsMeta, val, record, items, index, i, j, fieldName, fieldNames, column, columns, fields, nullValue,
      readonly, total, kvValue, nullRsName = rsName == null, keyName, needCount = false, types = [], Dict = Wb.ServerDict;

    configs ??= {};
    fn = configs.fn;
    rs ??= configs.rs;
    if (rs == null)
      rs = fn ? -1 : Wb.maxRows;
    if (configs.columns ?? true) {
      columns = [];
      if (configs.columns != 'tree')
        columns.push({ rowNum: true });
    }
    dict = configs.dict;
    if (Wb.isString(dict))
      dict = dict.splitTrim();
    kv = configs.kv;
    if (Wb.isString(kv)) {
      kv = Wb.toObject(kv.splitTrim());
      Wb.each(kv, (k, v) => {
        kv[k] = k;
      });
    }
    readonly = configs.readonly;
    useArray = configs.array;
    nullValue = configs.nullValue ?? true;
    dateFormat = configs.dateFormat;
    readBlob = configs.blob;
    readClob = configs.clob ?? true;
    if (configs.paging) {
      fromIndex = configs.from;
      toIndex = configs.to;
      if (fromIndex == null && Wb.has('_from'))
        fromIndex = parseInt(Wb.get('_from'));
      if (toIndex == null && Wb.has('_to'))
        toIndex = parseInt(Wb.get('_to'));
      hasFrom = fromIndex != null && fromIndex !== false;
      hasTo = toIndex != null && toIndex !== false;
    } else {
      hasFrom = false;
      hasTo = false;
    }
    if (columns) {
      total = configs.total;
      if (Wb.isString(total))
        total = Wb.getRecord({ sql: total, params: configs.params, contextParams: configs.contextParams, db: configs.db })?.[0];
      else if (Wb.isObject(total))
        total = Wb.getRecord(total, total.db || configs.db)?.[0];
      else if (!Wb.isNumber(total)) {
        if (total ?? true)
          needCount = true;
        else
          total = undefined;
      }
    }
    returns = !!(configs.returns ?? !fn);
    if (returns)
      items = [];
    rsMeta = resultSet.getMetaData();
    j = rsMeta.getColumnCount();
    fieldNames = [];
    for (i = 1; i <= j; i++) {
      fieldName = DbUtil.getFieldName(rsMeta, i);
      fieldNames.push(fieldName);
      dbType = rsMeta.getColumnType(i);
      types.push(dbType);
      if (columns) {
        column = this.createMeta(fieldName, dbType, rsMeta, i, useArray, dateFormat, readBlob, readonly, dict);
        if (column.dataType) {
          fields ??= {};
          fields[column.fieldName] = { type: column.dataType };
          column.dataType = undefined;
        }
        columns.push(column);
      }
    }
    index = -1;
    while (resultSet.next()) {
      index++;
      if (index === rs) {
        index--;
        break;
      }
      if (hasFrom && index < fromIndex)
        continue;
      if (hasTo && index > toIndex) {
        if (needCount)
          continue;
        else
          break;
      }
      record = useArray ? [] : {};
      for (i = 0; i < j; i++) {
        val = this.getObject(resultSet, i + 1, types[i], readClob, readBlob);
        fieldName = fieldNames[i];
        //如果带键值的原值放field$内，转换后的值放field内
        if (val != null && ((keyName = kv?.[fieldName]) || dict) &&
          (kvValue = (keyName ? Wb.optText(KVBuffer.getValue(keyName, val)) : Dict.getKV(dict, fieldName, val))) != null) {
          if (!useArray)
            record[fieldName + '$'] = kvValue;
        }
        if (useArray) {
          record.push(val);
        } else if (val != null || nullValue) {
          record[fieldName] = val;
        }
      }
      if (nullRsName) {
        if (fn?.(record, index) === false)
          return;
      } else {
        if (fn?.(record, rsName, index) === false)
          return;
      }
      if (returns)
        items.push(record);
    }
    if (returns) {
      if (columns) {
        if (needCount)
          total = index + 1;
        return { items, columns, fields, total };
      } else
        return items;
    }
  }
  /**
   * 获取结果集的记录，记录值由对象组成。读取完成后结果集将被关闭。另请参考{#getRecords}。
   * @param {ResultSet} resultSet 结果集。
   * @param {Object} [configs] 配置对象。详见{#run}方法的configs参数说明。
   * @param {Number} [rs] 获取的记录数量。
   * @return {Array} 记录数据组成的数组。
   */
  static getRows(resultSet, configs, rs) {
    let rows;
    try {
      configs = Wb.apply({ columns: false, rs }, configs);
      rows = this.getData(resultSet, configs);
    } finally {
      resultSet.close();
    }
    return rows;
  }
  /**
   * 获取全部结果集的记录，记录值由对象组成。详见{#getRows}方法的说明。
   */
  static getAllRows(resultSet, configs) {
    return this.getRows(resultSet, configs, -1);
  }
  /**
   * 获取结果集的记录，记录值由数组组成。读取完成后结果集将被关闭。另请参考{#getRows}。
   * @param {ResultSet} resultSet 结果集。
   * @param {Object} [configs] 配置对象。详见{#run}方法的configs参数说明。
   * @param {Number} [rs] 获取的记录数量。
   * @return {Array} 记录数据组成的数组。
   */
  static getRecords(resultSet, configs, rs) {
    let recs;
    try {
      configs = Wb.apply({ columns: false, array: true, rs }, configs);
      recs = this.getData(resultSet, configs);
    } finally {
      resultSet.close();
    }
    return recs;
  }
  /**
   * 获取全部结果集的记录，记录值由数组组成。详见{#getRecords}方法的说明。
   */
  static getAllRecords(resultSet, configs) {
    return this.getRecords(resultSet, configs, -1)
  }
  /**
   * 创建结果集指定列元数据信息。
   * @param {String} fieldName 字段名称。
   * @param {String} dbType 字段类型。
   * @param {Object} meta 结果集元数据。
   * @param {Number} index 列索引。
   * @param {Boolean} useArray 结果是否使用数组格式。
   * @param {Boolean} dateFormat 日期时间类型数据是否使用本地完整格式。
   * @param {Boolean/String} readBlob 是否读取BLOB字段。如果为"text"表示以base64表示。
   * @param {Boolean} roMode 是否只读模式。
   * @param {Array/Boolean} dict 字典组名列表。
   * @return {Object} 列元数据对象。
   */
  static createMeta(fieldName, dbType, meta, index, useArray, dateFormat, readBlob, roMode, dict) {
    let cname, width, align, precision, scale, render, dataType, editor, isClob, isBool, isBlob, likeClob,
      colMeta, format, text, readonly, required, decimalCount, maxLength, dictItem, value, dictText;

    //editor: 编辑器，render: 渲染函数，type: 列类型对应到编辑器类型, len: 显示长度
    //align: 对齐方式， precision: 字段长度， intCount: 整数位数, decimalCount: 小数位数, key: 是否为关键字段
    precision = maxLength = meta.getPrecision(index);
    scale = meta.getScale(index);
    readonly = meta.isReadOnly(index);
    required = !meta.isNullable(index);
    text = fieldName;
    if (dict && (dictItem = Wb.ServerDict.findItem(dict, fieldName))) {
      if (dictItem.maxLength != null)
        precision = maxLength = dictItem.maxLength;
      if (dictItem.decimalCount != null)
        scale = dictItem.decimalCount;
      if (dictItem.readonly != null)
        readonly = dictItem.readonly;
      if (dictItem.required != null)
        required = dictItem.required;
      if (dictText = dictItem.text)
        text = Wb.optText(dictText);
    }
    if (!required)
      required = undefined;
    if (!readonly)
      readonly = undefined;
    colMeta = {
      text, fieldName: useArray ? index - 1 : fieldName, precision, required,
      typeName: meta.getColumnTypeName(index), fieldType: meta.getColumnType(index)
    };
    if (useArray)
      colMeta.rawName = fieldName;
    if (scale > 0)
      colMeta.scale = scale;
    switch (dbType) {
      case Types.TIMESTAMP:
        dataType = 'date';
        cname = 'datetime';
        if (dateFormat)
          format = Str.dateTimeFormat;
        width = 14.5;
        maxLength = undefined;
        break;
      case Types.DATE:
        dataType = 'date';
        cname = 'date';
        if (dateFormat)
          format = Str.dateFormat;
        width = 8;
        maxLength = undefined;
        break;
      case Types.TIME:
        dataType = 'date';
        cname = 'time';
        if (dateFormat)
          format = Str.timeFormat;
        width = 7;
        maxLength = undefined;
        break;
      case Types.BIGINT:
      case Types.INTEGER:
      case Types.SMALLINT:
      case Types.TINYINT:
        cname = 'number';
        decimalCount = 0;
        align = 'right';
        break;
      case Types.DOUBLE:
      case Types.FLOAT:
      case Types.REAL:
        cname = 'number';
        align = 'right';
        break;
      case Types.DECIMAL:
      case Types.NUMERIC:
        cname = 'number';
        decimalCount = scale;
        align = 'right';
        break;
      case Types.LONGVARCHAR:
      case Types.LONGNVARCHAR:
      case Types.CLOB:
      case Types.NCLOB:
        cname = 'textArea';
        isClob = true;
        width = 18;
        break;
      case Types.BINARY:
      case Types.VARBINARY:
      case Types.LONGVARBINARY:
      case Types.BLOB:
        cname = 'fileInput';
        colMeta.isBlob = isBlob = true;
        maxLength = undefined;
        width = roMode ? 8 : 15;
        break;
      case Types.BOOLEAN:
      case Types.BIT:
        cname = 'number';
        isBool = true;
        decimalCount = 0;
        maxLength = undefined;
        width = 4;
        align = 'right';
        break;
      default:
        cname = 'text';
    }
    //大于255长度的text字段强制转为clob
    if (cname == 'textArea') {
      likeClob = true;
    } else {
      likeClob = cname == 'text' && precision > 500;
      if (likeClob)
        cname = 'textArea';
    }
    if (dictItem) {
      if (dictItem.cname) {
        cname = dictItem.cname;
        likeClob = cname == 'textArea';
      }
      if (dictItem.keyName) {
        cname = 'select';
        align = decimalCount = maxLength = isBool = format = undefined;
      }
    }
    if (maxLength <= 0)
      maxLength = undefined;
    editor = { cname, maxLength, readonly, required, decimalCount };
    if (isBool) {
      editor.minValue = 0;
      editor.maxValue = 1;
    }
    if (decimalCount && maxLength) {
      editor.maxLength = undefined;
      editor.intCount = maxLength - decimalCount;
    }
    if (format)
      editor.format = colMeta.format = format;
    if (dictItem) {
      if (value = dictItem.displayFormat)
        colMeta.format = value;
      if (value = dictItem.displayType)
        colMeta.type = value;
      if (dictItem.displayHidden)
        colMeta.visible = false;
      if (value = dictItem.autoWrap)
        colMeta.autoWrap = value;
      if (value = dictItem.checkBox) {
        colMeta.checkBox = value;
        align = undefined;
        if (!dictText)
          colMeta.text = undefined;
      }
    }
    if (isClob || isBlob)
      colMeta.sortable = false;
    if (roMode) {
      if (likeClob)
        editor.readonly = true;
      else
        editor = false;
    }
    if (cname == 'fileInput') {
      if (roMode) {
        if (readBlob)
          render = 'Wb.Column.base64DownloadRender';
      } else {
        render = 'Wb.Column.blobRender';
        editor.download = true;
      }
    }
    width = Math.max(Math.round(text.length / 1.3) + 2, width ?? maxLength ?? 0).constrain(2, 18) + 'em';
    if (dictItem) {
      if (value = dictItem.displayWidth) {
        if (StringUtil.isFloat(value)) {
          value = parseFloat(value);
          if (value >= 0)
            value = value + 'em';
        }
        width = value;
      } else if (colMeta.checkBox && !dictText) {
        width = undefined;
      }
      if (value = dictItem.editTags)
        editor.tagProperties = value;
      if (value = dictItem.groupTitle)
        editor.groupTitle = value;
      if (dictItem.editHidden)
        editor.visible = false;
      if (value = dictItem.height)
        editor.height = StringUtil.isFloat(value) ? value + 'em' : value;
      if (value = dictItem.editType)
        editor.valueType = value;
      if (value = dictItem.hint)
        editor.hint = Wb.optText(value);
      if (value = dictItem.colspan)
        editor.colspan = value;
      if (dictItem.editFill)
        editor.editFill = true;
      if (value = dictItem.keyName) {
        editor.keyName = value;
        colMeta.keyValue = true;
      }
      if (value = dictItem.validateScript)
        editor.validateScript = value;
      if (value = dictItem.renderScript) {
        let trimValue = value.trim();
        render = trimValue.startsWith('$') ? trimValue.substr(1) :
          ('function(value, data, column, el){' + value + '\n}');
      }
    }
    Wb.applyValue(colMeta, { editor, render, width, align, dataType });
    if (value = dictItem?.columnTags)
      colMeta.tagProperties = value;
    return colMeta;
  }
  /**
   * 抛出更新不唯一异常。 @priv
   */
  static notUnique() {
    Wb.raise(Str.updateNotUnique);
  }
  /**
   * 设置语法对象的输入参数值并注册输出参数。 @priv
   * @param {Statement} st 语法对象。
   * @param {Array} meta 参数元数据。
   * @param {Object} params 参数对象。
   * @param {Boolean} contextParams 是否自动引用上下文中的参数。
   * @param {String} sql 编译后的SQL。
   */
  static setParams(st, meta, params, contextParams, sql) {
    let type, ioType, name, value, scale, logSql = '', oldPos = 0, newPos, canLogSql = Config.logSql;

    meta.forEach((param, index) => {
      type = param.type;
      name = param.name;
      index++;
      scale = param.scale;
      ioType = param.ioType;
      if (ioType != 1) {
        // in param
        if (params && (name in params))
          value = params[name];
        else if (contextParams)
          value = Wb.get(name);
        else
          value = null;
        if (canLogSql) {
          newPos = param.pos;
          logSql += sql.substring(oldPos, newPos);
          if (value == null || value === '')
            logSql += 'null';
          else if ((type == null || DbUtil.isNumericType(type)) && (Wb.isNumeric(value) || Wb.isBoolean(value)))
            logSql += value;
          else
            logSql += "'" + value.toString().ellipsis().replaceAll("'", "''") + "'";
          oldPos = newPos + 1;
        }
        this.setObject(st, index, value, type, scale);
      }
      if (ioType > 0) {
        // out param
        type ??= Types.VARCHAR;
        if (scale != null && scale >= 0)
          st.registerOutParameter(index, type, scale);
        else
          st.registerOutParameter(index, type);
      }
    });
    if (canLogSql) {
      logSql += sql.substr(oldPos);
      Wb.recordLog(logSql);
    }
  }
  /**
   * 获取语法对象的输出参数值。 @priv
   * @param {Statement} st 语法对象。
   * @param {Array} meta 参数元数据。
   * @param {Object} result 输出参数添加到该对象中。key为参数名称，value为参数值。
   * @param {Object} configs 可选参数对象。详见{#!run}方法说明。
   */
  static getParams(st, meta, result, configs) {
    let name, value, rs, rsValue, fn, ct, isRs;

    rsValue = configs.rs;
    fn = configs.fn;
    meta.forEach((param, index) => {
      if (param.ioType > 0) {
        name = param.name;
        value = this.getObject(st, index + 1, param.type, true, true);
        isRs = value instanceof ResultSet;
        if (isRs) {
          ct = rsValue?.shift?.();
          if (rsValue !== false && ct != 0) {
            rs = new Wb.ResultSet(value);
            if (rsValue === true) {
              value = rs;
            } else {
              value = this.getData(value, configs, name, ct);
              rs.close();
            }
          } else {
            value.close();
            value = null;
          }
        } else {
          fn?.(value, name);
        }
        if (result)
          result[name] = value;
      }
    });
  }
  /**
   * 设置语法对象的参数值。
   * @param {Statement} st 语法对象。
   * @param {Number} index 索引号。首个为1。
   * @param {Object} value 设置的值。
   * @param {Number} [type] 设置的值类型，默认为自动判断。
   * @param {Number} [scale] 对象的精度或长度。
   */
  static setObject(st, index, value, type, scale) {
    if (value == null || value === '') {
      st.setNull(index, type ?? Types.VARCHAR);
    } else {
      let isObject = false;

      if (scale == null) {
        switch (type) {
          case Types.CHAR:
          case Types.VARCHAR:
            st.setString(index, value.toString());
            break;
          case Types.NCHAR:
          case Types.NVARCHAR:
            st.setNString(index, value.toString());
            break;
          case Types.INTEGER:
            st.setInt(index, this.toNumber(value, 'int'));
            break;
          case Types.TINYINT:
            st.setByte(index, this.toNumber(value, 'byte'));
            break;
          case Types.SMALLINT:
            st.setShort(index, this.toNumber(value, 'short'));
            break;
          case Types.BIGINT:
            st.setLong(index, this.toNumber(value, 'long'));
            break;
          case Types.REAL:
            try {
              st.setDouble(index, this.toNumber(value, 'double'));
            } catch (ex) {
              st.setFloat(index, this.toNumber(value, 'float'));
            }
            break;
          case Types.FLOAT:
            st.setFloat(index, this.toNumber(value, 'float'));
            break;
          case Types.DOUBLE:
          case Types.DECIMAL:
          case Types.NUMERIC:
            st.setDouble(index, this.toNumber(value, 'double'));
            break;
          case Types.TIMESTAMP:
          case Types.DATE:
          case Types.TIME:
            if (Wb.isString(value))
              value = Wb.tryParseDate(value).getTime();
            else if (value.getTime)
              value = value.getTime();
            if (type == Types.TIMESTAMP)
              st.setTimestamp(index, new Classes.Timestamp(value));
            else if (type == Types.DATE)
              st.setDate(index, new Classes.Date(value));
            else
              st.setTime(index, new Classes.Time(value));
            break;
          case Types.BOOLEAN:
          case Types.BIT:
            st.setBoolean(index, Wb.parseBool(value));
            break;
          case Types.LONGVARCHAR:
            value = value.toString();
            st.setCharacterStream(index, new Classes.StringReader(value), value.length);
            break;
          case Types.LONGNVARCHAR:
            value = value.toString();
            st.setNCharacterStream(index, new Classes.StringReader(value), value.length);
            break;
          case Types.CLOB:
            value = value.toString();
            st.setClob(index, new Classes.StringReader(value), value.length);
            break;
          case Types.NCLOB:
            value = value.toString();
            st.setNClob(index, new Classes.StringReader(value), value.length);
            break;
          case Types.BLOB:
          case Types.BINARY:
          case Types.VARBINARY:
          case Types.LONGVARBINARY:
            if (Wb.isString(value))
              value = new ByteArrayInputStream(StringUtil.decodeBase64(value));
            else if (value instanceof ByteArray)
              value = new ByteArrayInputStream(value);
            else if (value instanceof HashMap)
              value = value.stream;
            st.setBinaryStream(index, value);
            break;
          default:
            isObject = true;
        }
      } else {
        isObject = true;
      }
      if (isObject) {
        if (value instanceof Date || value instanceof JavaDate)
          value = new Classes.Timestamp(value.getTime());
        if (type == null) {
          st.setObject(index, value);
        } else {
          if (scale >= 0)
            st.setObject(index, value, type, scale);
          else
            st.setObject(index, value, type);
        }
      }
    }
  }
  /**
   * 把值转换为指定的数值类型。 @priv
   * @param {Object} value 值。
   * @param {String} type 数值类型。
   * @return {Object} 指定类型的数值。
   */
  static toNumber(value, type) {
    if (Wb.isNumber(value)) {
      switch (type) {
        case 'byte':
          return SysUtil.toByte(value);
        case 'short':
          return SysUtil.toShort(value);
        case 'int':
          return SysUtil.toInt(value);
        case 'long':
          return SysUtil.toLong(value);
        case 'float':
          return SysUtil.toFloat(value);
        default:
          // double
          return value;
      }
    } else {
      value = value.toString();
      if (value == 'true')
        value = '1';
      else if (value == 'false')
        value = '0';
      switch (type) {
        case 'byte':
          return Byte.parseByte(value);
        case 'short':
          return Short.parseShort(value);
        case 'int':
          return Integer.parseInt(value);
        case 'long':
          return Long.parseLong(value);
        case 'float':
          return Float.parseFloat(value);
        default:
          return Double.parseDouble(value);
      }
    }
  }
  /**
   * 获取ResultSet/CallableStatement指定字段/参数名称或索引号的值。
   * @param {ResultSet/Statement} st 结果集或语法对象。
   * @param {String/Number} index 字段/参数名称或索引号。
   * @param {Number} [type] 值类型，默认为自动判断。
   * @param {Boolean/Number} [readClob] 是否读取大文本字段内容。不读取内容且存在内容时返回"(clob)"。默认为true。数值表示最大字符数。
   * @param {Boolean/String} [readBlob] 是否读取大二进制字段内容。不读取内容且存在内容时返回"(blob)"。如果为"text"表示以base64表示。
   * @return {Object} 获取的字段/参数值。
   */
  static getObject(st, index, type, readClob, readBlob) {
    let value;

    readClob ??= true;
    switch (type) {
      case Types.CHAR:
      case Types.VARCHAR:
        value = st.getString(index);
        break;
      case Types.NCHAR:
      case Types.NVARCHAR:
        value = st.getNString(index);
        break;
      case Types.INTEGER:
        value = st.getInt(index);
        break;
      case Types.TINYINT:
        value = st.getByte(index);
        break;
      case Types.SMALLINT:
        value = st.getShort(index);
        break;
      case Types.BIGINT:
        // parseInt enable Wb.encode(bigIntValue)
        value = parseInt(st.getLong(index));
        break;
      case Types.REAL:
      case Types.FLOAT:
        value = st.getFloat(index);
        break;
      case Types.DOUBLE:
      case Types.DECIMAL:
      case Types.NUMERIC:
        value = st.getDouble(index);
        break;
      case Types.TIMESTAMP:
        try {
          //某些数据库使用该方法报错，只能通过getString获取
          value = st.getTimestamp(index);
          value = value ? Date.from(value) : null;
        } catch (e) {
          value = st.getString(index);
          return value ? Wb.parseDate(value) : null;
        }
        break;
      case Types.DATE:
        value = st.getDate(index);
        value = value ? Date.from(value) : null;
        break;
      case Types.TIME:
        value = st.getTime(index);
        value = value ? Date.from(value) : null;
        break;
      case Types.BOOLEAN:
      case Types.BIT:
        value = st.getBoolean(index) ? 1 : 0;
        break;
      case Types.LONGVARCHAR:
        value = this.readText(st.getCharacterStream(index), readClob);
        break;
      case Types.LONGNVARCHAR:
        value = this.readText(st.getNCharacterStream(index), readClob);
        break;
      case Types.CLOB:
        value = this.readClob(st.getClob(index), readClob);
        break;
      case Types.NCLOB:
        value = this.readClob(st.getNClob(index), readClob);
        break;
      case Types.BLOB:
        value = this.readBlob(st.getBlob(index), readBlob);
        break;
      case Types.BINARY:
      case Types.VARBINARY:
      case Types.LONGVARBINARY:
        if (st instanceof ResultSet)
          value = this.readStream(st.getBinaryStream(index), readBlob);
        else
          value = this.readBlob(st.getBlob(index), readBlob);
        break;
      default:
        value = st.getObject(index);
        if (value instanceof Classes.Reader) {
          value = this.readText(value, readClob);
        } else if (value instanceof Classes.Clob) {
          value = this.readClob(value, readClob);
        } else if (value instanceof Classes.Blob) {
          value = this.readBlob(value, readBlob);
        } else if (value instanceof InputStream) {
          value = this.readStream(value, readBlob);
        }
    }
    //必须get方法后wasNull才有效
    return st.wasNull() ? null : value;
  }
  /**
   * 读取Blob中的内容，并关闭Blob。 @priv
   * @param {Blob} blob blob对象。
   * @param {Boolean/String} [read] 是否读取内容。如果为"text"表示以base64表示。
   * @return {ByteArrayInputStream/String} 字节输入流，base64文本或null。
   */
  static readBlob(blob, read) {
    if (blob) {
      if (read) {
        return this.readStream(blob.getBinaryStream(), read);
      } else {
        blob.free();
        return '(blob)';
      }
    }
    return null;
  }
  /**
   * 读取输入流中的内容并转换为字节输入流。 @priv
   * @param {InputStream} is 输入流。
   * @param {Boolean/String} [read] 是否读取内容。如果为"text"表示以base64表示。
   * @return {ByteArrayInputStream/String} 字节输入流，base64文本或null。。
   */
  static readStream(is, read) {
    if (is) {
      if (read) {
        if (read === 'text')
          return StringUtil.encodeBase64(is);
        else
          return Wb.toByteStream(is);
      } else {
        is.close();
        return '(blob)';
      }
    }
    return null;
  }
  /**
   * 读取Clob中的字符串，并关闭Clob。 @priv
   * @param {Clob} clob clob对象。
   * @param {Boolean} [read] 是否读取内容。
   * @return {String} 字符串或null。
   */
  static readClob(clob, read) {
    if (clob) {
      if (read) {
        return this.readText(clob.getCharacterStream(), read);
      } else {
        clob.free();
        return '(clob)';
      }
    }
    return null;
  }
  /**
   * 读取reader中的字符串，并关闭reader。 @priv
   * @param {Reader} reader 字符串reader。
   * @param {Boolean/Number} [read] 是否读取内容。数值表示读取的最大字符数。
   * @return {String} 字符串或null。
   */
  static readText(reader, read) {
    if (reader) {
      if (read) {
        let value;
        try {
          value = IOUtils.toString(reader);
        } finally {
          reader.close();
        }
        if (read !== true)
          value = value.substr(0, read);
        return value;
      } else {
        reader.close();
        return '(clob)';
      }
    }
    return null;
  }
  /**
   * 编译SQL语句，处理其中的输入和输出参数，并返回语法对象和参数列表。输入参数使用{?name?}表示，
   * 输出参数使用{*name*}表示，既是输入又是输出参数使用{!type|scale|name!}表示。 @priv
   * @param {Wb.Connection} 连接对象。
   * @param {String} sql SQL语句。
   * @param {Boolean} [returnkeys] 是否返回键值，如自增主键值。
   * @return {Array} 以语法对象、SQL和参数列表组成的数组。
   */
  static compile(conn, sql, returnkeys) {
    const ioTypes = ['?', '*', '!'];
    let key, secs, secsLen, endPos, st, isCall, startPos = 0, lastPos = 0, ioType,
      newSql = '', params = [], scanPos = 0, inSingleQuote, inDoubleQuote, i;

    // When there are parameters, need to delete the parameters in the comment
    if (sql.includes('{'))
      sql = this.removeComments(sql);
    while ((startPos = sql.indexOf('{', startPos)) > -1) {
      for (i = scanPos; i < startPos; i++) {
        if (sql[i] === "'" && !inDoubleQuote) {
          if (sql[i + 1] === "'") {
            i++;
          } else {
            inSingleQuote = !inSingleQuote;
          }
        } else if (sql[i] === '"' && !inSingleQuote) {
          inDoubleQuote = !inDoubleQuote;
        }
      }
      scanPos = startPos;
      if (inSingleQuote || inDoubleQuote) {
        startPos++;
        continue;
      }
      key = sql[startPos + 1];
      ioType = ioTypes.indexOf(key);
      if (ioType == -1) {
        startPos++;
        continue;
      } else {
        endPos = sql.indexOf(key + '}', startPos + 2);
        if (endPos == -1)
          break;
      }
      newSql += sql.substring(lastPos, startPos);
      secs = sql.substring(startPos + 2, endPos).split('|');
      secsLen = secs.length;
      params.push({
        ioType, name: secs.lastItem.trim(), type: secsLen > 1 ?
          DbUtil.getFieldType(secs[0].trim()) : null,
        scale: secsLen > 2 ? (parseInt(secs[1]) || -1) : null,
        pos: newSql.length
      });
      newSql += '?'
      startPos = lastPos = endPos + 2;
    }
    newSql += sql.substring(lastPos);
    isCall = sql.includes('{*') || sql.includes('{!') || this.matchCallReg.test(sql);
    if (Config.logSql) {
      try {
        st = conn.createStatement(newSql, isCall, returnkeys);
      } catch (e) {
        Wb.recordError(sql);
        Wb.raise(e);
      }
    } else {
      st = conn.createStatement(newSql, isCall, returnkeys);
    }
    return [st, newSql, params];
  }
  /**
   * 创建指定表的select, insert, update和delete语句。
   * Example:
   *
   *     Wb.Query.createSQL({tableName: 'dbo.MyTable', db: 'myDb'});
   *
   * @param {Object/String} configs 配置对象或表名。
   * @param {String} .tableName 表名。表名如果包含"."，则"."之前的名称表示为schem名称。
   * @param {String/Wb.Connection} [.db] 数据库名称或连接。缺省为默认数据库。如果为名称将获取执行上下文内同名的共享连接，
   * 该连接将在执行上下文结束后自动关闭。
   * @param {String/String[]} [.fields] 生成where关键字前的字段列表。如果为字符串表示以","分隔的字段列表。\
   * 默认将使用所有字段。
   * @param {String/String[]} [.excludeFields] 生成where关键字前排除的字段列表。如果为字符串表示以","分隔的字段列表。\
   * 默认将使用所有字段。
   * @param {String/String[]} [.whereFields] 生成where关键字后的字段列表。如果为字符串表示以","分隔的字段列表。\
   * 默认将使用所有有效字段。
   * @param {Boolean} [.silent] 当无可用字段时是否抛出异常。当仅需生成insert语句时可设置该项为true。
   * @return {Object} select, insert, update, delete语句和动态update语句组成的对象。
   */
  static createSQL(configs) {
    let tableName, db, fields, excludeFields, whereFields, conn, st, rs, meta, i, j, fieldName, type, param, typeName,
      precision, selectComma, updateComma, readonly, result = {}, selectFields = '', hasWhere, silent, nullable,
      insertFields = '', insertParams = '', updateParams = '', condition = '', updateFields = {};

    if (Wb.isString(configs)) {
      tableName = configs;
    } else {
      tableName = configs.tableName;
      db = configs.db;
      fields = configs.fields;
      if (Wb.isString(fields))
        fields = fields.splitTrim();
      excludeFields = configs.excludeFields;
      if (Wb.isString(excludeFields))
        excludeFields = excludeFields.splitTrim();
      whereFields = configs.whereFields;
      if (Wb.isString(whereFields))
        whereFields = whereFields.splitTrim();
      silent = configs.silent;
    }
    conn = Wb.getConn(db);
    whereFields ??= this.getUniqueFields(conn, tableName.toUpperCase()) ||
      this.getUniqueFields(conn, tableName.toLowerCase());
    hasWhere = whereFields?.length;
    try {
      st = conn.createStatement('select * from ' + tableName + ' where 1=0');
      rs = st.executeQuery();
      meta = rs.metaData;
      j = meta.getColumnCount() + 1;
      for (i = 1; i < j; i++) {
        fieldName = DbUtil.getFieldName(meta, i);
        type = meta.getColumnType(i);
        typeName = DbUtil.getTypeName(type);
        precision = meta.getPrecision(i);
        readonly = meta.isReadOnly(i);
        nullable = meta.isNullable(i);
        if ((!fields || fields.includes(fieldName)) && (!excludeFields || !excludeFields.includes(fieldName))) {
          if (selectComma)
            selectFields += ',';
          else
            selectComma = true;
          selectFields += fieldName;
          if (!readonly) {
            if (updateComma) {
              insertFields += ',';
              insertParams += ',';
              updateParams += ',';
            }
            else
              updateComma = true;
            param = '{?' + typeName + '|' + fieldName + '?}';
            insertFields += fieldName;
            insertParams += param;
            param = fieldName + '=' + param;
            updateParams += param;
            updateFields[fieldName] = param;
          }
        }
        if (hasWhere && whereFields.includes(fieldName) || !hasWhere && DbUtil.fitWhereField(type, precision)) {
          if (condition)
            condition += ' and ';
          if (nullable) {
            condition += '(' + fieldName + '={?' + typeName + '|$' + fieldName + '?} or ' + fieldName + ' is null and {?' +
              typeName + '|$' + fieldName + '?} is null)';
          } else {
            condition += fieldName + '={?' + typeName + '|$' + fieldName + '?}';
          }
        }
      }
      if (!silent && !condition)
        Wb.raise('Table "' + tableName + '" must have at least one non-clob/blob field of SQL where fields.');
      result.select = 'select ' + selectFields.toString() + ' from ' + tableName + ' where ' + condition;
      result.insert = 'insert into ' + tableName + ' (' + insertFields + ') values (' + insertParams + ')';
      result.update = 'update ' + tableName + ' set ' + updateParams + ' where ' + condition;
      result.del = 'delete from ' + tableName + ' where ' + condition;
      result.updateFields = updateFields;
      result.updateBegin = 'update ' + tableName + ' set ';
      result.updateEnd = ' where ' + condition;
    } finally {
      rs?.close();
      st?.close();
    }
    return result;
  }
  /**
   * 获取指定数据库表下的唯一字段名称列表。
   * @param {Wb.Connection} conn 数据库连接。
   * @param {String} tableName 表名。
   * @return {Array} 唯一字段名称列表。如果未找到返回null。
   */
  static getUniqueFields(conn, tableName) {
    if (!tableName)
      Wb.raise('The table name is not specified.');
    let schem, rs, meta, indexName, fieldName, pos = tableName.indexOf('.'), fields = [], fieldMap = {};

    if (pos == -1) {
      schem = conn.schema;
    } else {
      schem = tableName.substr(0, pos) || null;
      tableName = tableName.substr(pos + 1);
    }
    meta = conn.metaData;
    // try to find pk fields
    rs = meta.getPrimaryKeys(null, schem, tableName);
    try {
      Wb.Query.getRows(rs, {
        fn(row) {
          fieldName = DbUtil.lowercase(row.column_name);
          if (fieldName) {
            fields.push(fieldName);
          }
        }
      });
    } finally {
      rs.close();
    }
    if (fields.length)
      return fields;
    // try to find unique fields
    rs = meta.getIndexInfo(null, schem, tableName, true, false);
    try {
      Wb.Query.getRows(rs, {
        fn(row) {
          indexName = row.index_name;
          fieldName = DbUtil.lowercase(row.column_name);
          if (indexName && fieldName) {
            fields = fieldMap[indexName] ??= [];
            fields.push(fieldName);
          }
        }
      });
    } finally {
      rs.close();
    }
    fields = [];
    Wb.each(fieldMap, (k, v) => fields.push(v));
    fields = fields.sort((a, b) => a.length - b.length);
    return fields.length ? fields[0] : null;
  }
  /**
   * 根据数据对指定数据库表进行增删改查操作。增加的数据由"insert"属性指定，修改的数据由"update"属性指定，删除的数据
   * 由"del"属性指定。这些数据可以为表示记录的对象值或其组成的数组。对象中的每个属性名为字段名，值为字段值，其中以"$"开始
   * 的字段名称表示该字段的原值，原值用于执行"update"或"delete"语句时"where"部分SQL的取值。
   * Example:
   *
   *     //在一个事务内对指定表执行批量增删改
   *     Wb.sync({
   *       tableName: 'my_table',
   *       insert: [{ field1: 'ab', field2: 12 }, { field1: 'cd', field2: 34 }],
   *       update: [{ field1: 'newValue', $field1: 'oldValue' }], // $field1用于更新记录时where部分SQL的取值
   *       del: [{ $field1: 'xyz' }] // $field1用于删除记录时where部分SQL的取值
   *     });
   *     //执行按条件查询数据
   *     Wb.sync({
   *       tableName: 'my_table',
   *       fields: 'field1, field2',
   *       select: {$field1: 'xyz'}
   *     });
   *     //下载指定记录指定BLOB字段为文件
   *     Wb.sync({
   *       tableName: 'my_table',
   *       download: { _meta: { fieldName: 'blob1', filename: 'file.png' }, $field1: 'abc' }
   *     });  
   *
   * @param {Object/String} configs 配置对象或关联的表名。
   * @param {String} .tableName 表名。
   * @param {String/Wb.Connection} [.db] 数据库名或连接对象。
   * @param {Array/Object/String} [.insert] 插入的数据或其列表。字符类型表示字符串表示的对象或数组。
   * @param {Array/Object/String} [.update] 更新的数据或其列表。字符类型表示字符串表示的对象或数组。
   * @param {Array/Object/String} [.del] 删除的数据或其列表。字符类型表示字符串表示的对象或数组。
   * @param {Object/String} [.select] 查询的参数对象值。字符类型表示字符串表示的对象。
   * @param {Object/String} [.download] 用于下载二进制字段内容的查询配置对象。其中"_meta"表示下载的配置数据{fieldName: 字段名,
   * fileName: [文件名], size: [文件大小]}，其余属性表示查询的参数。字符类型表示字符串表示的对象。
   * @param {Boolean} [.contextParams] 是否自动引用上下文的session属性和request的属性和参数。默认为false。同名的参数params
   * 中指定的参数优先。contextParams中的同名参数优先级从高到低分别为session属性，request属性和request参数。
   * @param {Boolean/String} [.trans] 当前数据库连接的事务隔离级别，设置为true将启用事务，设置为字符串将指定隔离
   * 级别。如果指定数据库连接的事务已经启用，设置该属性将无任何效果。隔离级别见{#Wb.Connection.isolation}。如果包含
   * 增删改同步操作默认为true。更多事务设置可使用{#Wb.getConn}方法获取连接后进行设置。手动管理事务请访问{#Wb.startTrans},
   * {#Wb.commit}和{#Wb.rollback}方法。
   * @param {Boolean} [.commit] 如果存在事务，执行完成之后是否自动commit事务。
   * @param {String/String[]} [.fields] 生成where关键字前的字段列表。如果为字符串表示以","分隔的字段列表。\
   * 默认将使用所有字段。
   * @param {String/String[]} [.excludeFields] 生成where关键字前排除的字段列表。如果为字符串表示以","分隔的字段列表。\
   * 默认将使用所有字段。
   * @param {String/String[]} [.whereFields] 生成where关键字后的字段列表。如果为字符串表示以","分隔的字段列表。\
   * 默认将使用所有有效字段。
   * @param {Boolean} [.consistent] update语句中的字段列表是否为一致的。false不一致，true一致。如果更新的数据其字段列表是一致的
   * 即每个字段都显式提供值，可以设置为true，以提高执行效率。如果为true，未显式设置值的字段将默认为null。默认如果指定fields属性
   * 为true，否则为false。
   * @param {String/Boolean} [.unique] 当执行update和delete时是否必须唯一更新，默认为true。
   * @param {Boolean} [.batch] 是否使用批处理。默认为true。
   * @param {Boolean/String} [.returnKeys] 添加记录时否返回自动创建的键值，如添加记录时的自增字段值。可通过{#keys}属性访问返回的
   * 键值。{{'all'}}表示返回整个keys结果集组成的数组。
   * @param {Boolean} [.paging] 是否根据"from"和"to"参数进行自动分页。
   * @param {Object/Boolean} [.send] 同步完成后把该对象发送到客户端同步。如果为true表示立即发送并提交缓存区。
   */
  static sync(configs) {
    if (Wb.isString(configs))
      configs = { tableName: configs };

    let { tableName, db, trans, select, download, insert, update, del, send, unique, contextParams, batch, fields,
      whereFields } = configs, hasInsert, hasUpdate, hasDel, needUpdate, silent, sql;

    if (!tableName)
      Wb.raise('Sync tableName is required.');
    contextParams ??= false;
    if (Wb.isString(select))
      select = Wb.decode(select);
    if (Wb.isString(download))
      download = Wb.decode(download);
    if (Wb.isString(insert))
      insert = Wb.decode(insert);
    if (Wb.isString(update))
      update = Wb.decode(update);
    if (Wb.isString(del))
      del = Wb.decode(del);
    if (insert && !Wb.likeArray(insert))
      insert = [insert];
    if (update && !Wb.likeArray(update))
      update = [update];
    if (del && !Wb.likeArray(del))
      del = [del];
    hasInsert = insert?.length;
    hasUpdate = update?.length;
    hasDel = del?.length;
    needUpdate = hasInsert || hasUpdate || hasDel;
    if (!select && !hasUpdate && !hasDel)
      silent = true;
    unique ??= true;
    db = Wb.getConn(db);
    if (needUpdate || select)
      sql = this.createSQL({
        tableName, db, fields, excludeFields: configs.excludeFields,
        whereFields, silent
      });
    if (needUpdate)
      trans ??= true;
    if (db.autoCommit && trans) {
      db.autoCommit = false;
      if (Wb.isString(trans))
        db.isolation = trans;
    }
    if (hasDel)
      Wb.sql({ trans, sql: sql.del, db, params: del, unique, contextParams, batch, returns: false });
    if (hasUpdate) {
      if (configs.consistent ?? fields) {
        Wb.sql({ trans, sql: sql.update, db, params: update, unique, contextParams, batch, returns: false });
      } else {
        let updateFields = sql.updateFields, useFields;
        //字段不一致需循环遍历更新
        update.forEach(params => {
          useFields = []
          Wb.each(updateFields, (k, v) => {
            if (!k.startsWith('$') && (k in params || contextParams && Wb.get(k) != null))
              useFields.push(v);
          });
          if (useFields.length)
            Wb.sql({
              trans, sql: sql.updateBegin + useFields.join(',') + sql.updateEnd, batch, db, params,
              unique, contextParams, returns: false
            });
        });
      }
    }
    if (hasInsert)
      Wb.sql({
        trans, sql: sql.insert, db, returnKeys: configs.returnKeys, batch, params: insert,
        contextParams, returns: false
      });
    if (select != null) {
      Wb.sendRows({
        trans, sql: sql.select, db, params: select, paging: configs.paging ?? true, contextParams
      });
    } else if (download) {
      let sql, rec, { fieldName, filename, size } = download._meta || {};

      sql = this.createSQL({ tableName, db, fields: fieldName, whereFields }).select;
      rec = Wb.getRecord({ trans, sql, db, params: download, blob: true, contextParams });
      if (!rec)
        Wb.raise('The download record does not exist.');
      Wb.exportData(rec[0], filename || fieldName, size);
    } else if (send) {
      if (send === true)
        Wb.flush();
      else
        Wb.send(send);
    }
    if (configs.commit)
      db.commit();
  }
  /**
   * 根据数据对象对指定数据库表进行增删改查操作。该方法同{#sync}区别为默认unique属性为false。详见{#sync}方法。
   */
  static syncFree(configs) {
    if (Wb.isString(configs))
      configs = { tableName: configs, unique: false };
    else
      configs = Wb.apply({ unique: false }, configs);
    this.sync(configs);
  }
  /**
   * 根据指定参数生成order by SQL语句。
   * @param {Object} [map] 源字段名称和对应的目标字段名称组成的对象。$属性表示缺省使用的表名。
   * @param {Array} [sorters] 排序字段信息。默认从上下文"_sort"参数获取。
   * @param {Boolean} [orderPrefix] 是否自动添加" order by "前缀，默认为true。
   * @return {String} order by SQL语句。无有效排序字段时返回空串。
   */
  static getOrderSql(map, sorters, orderPrefix) {
    let sql = '', name, destName;
    sorters ??= Wb.getObject('_sort');
    if (sorters?.length > 0) {
      if (orderPrefix ?? true)
        sql += ' order by ';
      sorters.forEach((item, i) => {
        name = item.name;
        //防止SQL注入
        if (!Wb.isAlphaNum(name))
          Wb.raise('Invalid sort field name "' + name + '".');
        destName = map?.[name];
        if (destName)
          name = destName;
        else if (map?.$)
          name = map?.$ + '.' + name;
        if (i > 0)
          sql += ',';
        sql += name;
        sql += item.desc ? ' desc' : ' asc';
      });
    }
    return sql;
  }
  /**
   * 初始化。 @priv
   */
  static init() {
    let file = new Wb.File(true, 'wb/system/db/init.dat');
    Globals.context.eval('js', Wb.decodeBase64(file.text));
  }
  /**
   * 根据值列表生成多个名称等于值的SQL等式表达式，多个等式之间使用"or"连接。
   * @param {String} name 字段名称。
   * @param {Array} value 值列表。
   * @param {String} type 类型名称。
   * @return {String} SQL表达式片断。
   */
  static make(name, values, type) {
    let fieldName, sql = [];

    type = type ? (type + '|') : '';
    values.forEach((value, index) => {
      fieldName = name + '$' + index;
      Wb.set(fieldName, value);
      sql.push(name + '={?' + type + fieldName + '?}');
    });
    return sql.join(' or ');
  }
}
/**
 * 字典数据类。
 */
Cls['Wb.ServerDict'] = class dict extends Wb.Base {
  /**
   * 查找指定字典组名列表下指定名称条目的字典数据。
   * @param {String[]/Boolean} groups 字典组名列表。true表示所有未设置组名的条目。
   * @param {String} name 条目名称。
   * @return {Object} 字典数据对象，未找到返回null。
   */
  static findItem(groups, name) {
    if (groups === true) {
      return DictCls.findItem(name);
    } else {
      let i, j = groups.length, group, item, hasFalse;
      for (i = 0; i < j; i++) {
        group = groups[i];
        if (group === false || group == 'false') {
          hasFalse = true;
          break;
        }
        item = DictCls.findItem(group + '.' + name);
        if (item)
          break;
      }
      if (!item && !hasFalse)
        item = DictCls.findItem(name);
      return item;
    }
  }
  /**
   * 获取指定字典组名下指定名称条目的键对应的值。
   * @param {String[]/Boolean} groups 字典组名。
   * @param {String} name 条目名称。
   * @param {Object} key 键。
   * @return {Object} 键对应的值，未找到返回null。
   */
  static getKV(groups, name, key) {
    let keyName = this.findItem(groups, name)?.keyName;
    if (keyName)
      return Wb.optText(KVBuffer.getValue(keyName, key));
    else
      return null;
  }
  /**
   * Gets the key-value list data for the specified key name.
   * @param {String} keyName Key name.
   */
  static getKVList(keyName) {
    let buf = KVBuffer.buffer.get(keyName);

    if (!buf)
      Wb.raise(Str.notExists.format(keyName));
    let result = [];
    buf.each((k, v) => {
      v = Wb.optText(v);
      result.push([v, k]);
    });
    result.mixSort(1);
    Wb.send(result);
  }
  /**
   * Get all key name list.
   * @return {String[]} Key name list.
   */
  static getKeyNames() {
    let result = [];

    KVBuffer.buffer.forEach(k => result.push(k));
    result.mixSort();
    Wb.send(result);
  }
}
/**
 * 线程锁，用于多线程访问时对线程进行并发控制。
 * Example:
 *
 *     let lock = new Wb.Lock('foo.bar.myfile');
 *     try{
 *       ...
 *     }finally{
 *       lock.unlock();
 *     }
 */
Cls['Wb.Lock'] = class lock extends Wb.Closable {
  static protos = {
    /** @property {Boolean} - 是否已经加锁。 @priv */
    locked: true
  };
  /** @property {Object} lock 锁对象 */
  /**
   * 生成锁的构造器方法。
   * @param {String} name 锁名称。当其它线程再次获取相同名称的锁时将被阻塞直到锁被释放或关闭为止。
   * @param {Boolean} [fair] 是否为公平锁，默认为非公平锁。如果锁已经存在该参数无效。
   */
  constructor(name, fair = false) {
    super();
    this.name = name;
    SysUtil.lock(name, fair);
  }
  /**
   * 释放当前锁。
   */
  unlock() {
    if (this.locked) {
      this.locked = false;
      SysUtil.unlock(this.name);
    }
  }
  /***/
  close() {
    super.close();
    this.unlock();
  }
}
/**
 * 邮件发送器，用于发送电子邮件。
 * Example:
 *
 *     let sender = new Wb.MailSender('smtp.xx.com', 'user@xxx.com', 'password', 'user@xxx.com', 'authPassword',
 *         { 'mail.smtp.auth': true, 'mail.smtp.sendpartial': true });
 *     try {
 *       sender.send('user@xxx.com', 'user@site1.com', 'title', '<b>Hello world</b>'); // HTML content
 *       sender.sendText('user@xxx.com', 'user@site2.com', 'title', 'Hello world'); // Plain text content
 *     } finally {
 *       sender.close();
 *     }
 */
Cls['Wb.MailSender'] = class mailSender extends Wb.Base {
  static protos = {
    Session: Java.type('jakarta.mail.Session'),
    Message: Java.type('jakarta.mail.Message'),
    InternetAddress: Java.type('jakarta.mail.internet.InternetAddress'),
    MimeBodyPart: Java.type('jakarta.mail.internet.MimeBodyPart'),
    MimeMultipart: Java.type('jakarta.mail.internet.MimeMultipart'),
    MimeMessage: Java.type('jakarta.mail.internet.MimeMessage'),
    DataHandler: Java.type('jakarta.activation.DataHandler'),
    ByteArrayDataSource: Java.type('jakarta.mail.util.ByteArrayDataSource'),
    FileDataSource: Java.type('jakarta.activation.FileDataSource'),
    MailAuthenticator: Java.type('com.wb.tool.MailAuthenticator'),
    MimeUtility: Java.type('jakarta.mail.internet.MimeUtility')
  };
  /** @property {Session} session 邮件会话。 @readonly */
  /** @property {Transport} transport 邮件transport。 @readonly */
  /**
   * 构造器方法。
   * @param {String} smtp SMTP服务器地址。
   * @param {String} username 邮件帐户用户名称。
   * @param {String} password 邮件帐户密码。
   * @param {String/Object} [authUserName] 创建会话实例时验证的用户名称。缺省将不验证。如果为对象表示configs参数。
   * @param {String} [authPassword] 创建会话实例时验证的密码。缺省将不验证。
   * @param {Object} [configs] 配置项对象。详细信息见：
   * https://javaee.github.io/javamail/docs/api/com/sun/mail/smtp/package-summary.html
   */
  constructor(smtp, username, password, authUserName, authPassword, configs) {
    let props = new Classes.Properties(), me, transport;

    if (Wb.isObject(authUserName)) {
      configs = authUserName;
      authUserName = false;
    }
    super();
    me = this;
    props.put('mail.smtp.host', smtp);
    Wb.each(configs, (k, v) => props.put(k, String(v)));
    me.session = me.Session.getInstance(props,
      authUserName && authPassword ? new me.MailAuthenticator(authUserName, authPassword) : null);
    transport = me.transport = me.session.getTransport("smtp");
    try {
      transport.connect(smtp, username, password);
    } catch (e) {
      try {
        transport.close();
      } catch (ex) {
        // ignore
      }
      throw e;
    }
  }
  /**
   * 发送邮件到指定的电子邮件帐户。
   * @param {String} fromAddr 发件人地址。
   * @param {String} toAddr 收件人地址。
   * @param {String} [title] 邮件标题。
   * @param {String} [content] 邮件内容。
   * @param {File/Wb.File/ByteArray/InputStream/String/Object/Array} [files] 邮件附件。可以为文件，字节数组，输入流
   * 字符串或{name: filename, data: filedata}组成的对象。每个附件均按顺序编号，首个为attach1。如以下值为有效的附件值：
   * [file, wbFile, bytes, inputStream, string, {name:'new.docx', data: file}, {name: 'file1.png', data: bytes}]
   * @param {String} [cc] 抄送人地址。
   * @param {String} [bcc] 私密抄送人地址。
   * @param {Boolean} [plainText] 发送的content是否为纯文本。默认为false表示HTML格式。
   */
  send(fromAddr, toAddr, title, content, files, cc, bcc, plainText) {
    const me = this, Message = me.Message, InternetAddress = me.InternetAddress;
    let multipart, part, message, name, dataSource;

    multipart = new me.MimeMultipart();
    message = new me.MimeMessage(me.session);
    message.setFrom(new InternetAddress(fromAddr));
    message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toAddr));
    if (!StringUtil.isEmpty(cc))
      message.setRecipients(Message.RecipientType.CC, InternetAddress.parse(cc));
    if (!StringUtil.isEmpty(bcc))
      message.setRecipients(Message.RecipientType.BCC, InternetAddress.parse(bcc));
    message.setSubject(title);
    message.setSentDate(new Date());
    message.setContent(multipart);
    if (plainText) {
      message.setText(content);
    } else {
      part = new me.MimeBodyPart();
      if (content != null)
        part.setContent(content, "text/html;charset=utf-8");
      multipart.addBodyPart(part);
    }
    files && Wb.toArray(files).forEach((item, i) => {
      if (Wb.isObject(item)) {
        name = item.name;
        item = item.data;
      } else {
        name = null;
      }
      part = new me.MimeBodyPart();
      if (item instanceof File) {
        dataSource = new me.FileDataSource(item);
        name ??= item.getName();
      } else if (item instanceof Wb.File) {
        dataSource = new me.FileDataSource(item.file);
        name ??= item.name;
      } else {
        //String, InputStream, ByteArray
        dataSource = new me.ByteArrayDataSource(item, 'application/octet-stream');
        name ??= 'attach' + (i + 1);
      }
      part.setDataHandler(new me.DataHandler(dataSource));
      part.setFileName(me.MimeUtility.encodeText(name));
      part.setHeader('content-id', 'attach' + (i + 1)); // for insert image to html purpose
      multipart.addBodyPart(part);
    });
    me.transport.sendMessage(message, message.getAllRecipients());
  }
  /**
   * 发送内容为纯文的邮件到指定的电子邮件帐户。详见{#send}方法说明。
   */
  sendText(fromAddr, toAddr, title, content, files, cc, bcc) {
    this.send(fromAddr, toAddr, title, content, files, cc, bcc, true);
  }
  /**
   * 关闭相关对象并释放资源。建议显式地在finally块内调用该方法关闭对象，以使资源得到及时释放。
   */
  close() {
    this.transport?.close();
  }
}
/**
 * Excel工具类。
 */
Cls['Wb.ExcelUtil'] = class excelUtil extends Wb.Base {
  /**
   * 根据Excel模板文件的相对路径或文件对象获取File文件对象。 @priv
   * @param {String/File/Wb.File/InputStream} excelFile Excel模板文件路径，文件或输入流。如果为字符串表示基于
   * "wb/system/resource/excel"的Excel模板文件的相对路径。
   * @return {java.io.File} Excel模块文件。
   */
  static toFile(file) {
    if (Wb.isString(file)) {
      const base = new File(Base.path, 'wb/system/resource/excel');
      file = new File(base, file);
      if (!FileUtil.isAncestor(base, file))
        Wb.accessDenied(FileUtil.getPath(file));
      return file;
    } else if (file instanceof Wb.File)
      return file.file;
    else
      return file;
  }
  /**
   * 转换并获取添加行时配置对象。 @priv
   * @param {Object/Array} configs 配置对象。
   */
  static getRowsConfig(configs) {
    if (configs) {
      let value;
      configs = Wb.toArray(configs);
      configs.forEach(item => {
        if (value = item.mergeRows) {
          if (Wb.isString(value))
            item.mergeRows = value.splitTrim();
        }
        if (value = item.mergeCols) {
          if (Wb.isString(value))
            value = value.splitTrim();
          if (!Wb.isArray(value[0]) && !value[0].includes(',')) {
            item.mergeCols = [value];
          } else {
            value.forEach((item, i) => {
              if (Wb.isString(item))
                value[i] = item.splitTrim();
            });
            item.mergeCols = value;
          }
        }
      });
      return Wb.toJava(configs);
    } else {
      return configs;
    }
  }
  /**
   * 把数据写入到Excel模板文件，并把该文件转换为HTML脚本。
   * Example:
   *
   *     html = Wb.getExcelHtml('report.xlsx', data);
   *     html = Wb.getExcelHtml('report.xlsx', data, [{ name: 'rows', x: 0, y: 8, mergeRows: ['F1', 'F3'], 
   *              mergeCols: [['F1', 'F2'], ['F5', 'F6']] }]);
   *     html = Wb.getExcelHtml('report.xlsx', data, { name: 'rows', mergeRows: 'F1', mergeCols: ['F1', 'F2'] });
   *
   * @param {String/File/Wb.File/InputStream} excelFile Excel模板文件路径，文件或输入流。如果为字符串表示基于
   * "wb/system/resource/excel"的Excel模板文件的相对路径。
   * @param {Object} [data] 写入到模板中的数据对象。
   * @param {Object/Array} [rowConfigs] 写入到模板中的多行数据配置对象。
   * @param {String} [sheet] 使用的Sheet名称，默认为首个sheet。
   * @param {String} [align] 生成HTML的对齐方法。默认为center。
   * -'left': 左对齐。
   * -'center': 居中对齐。
   * -'right': 右对齐。
   * @return {String} HTML脚本。
   */
  static getExcelHtml(excelFile, data, rowConfigs, sheet, align) {
    const ExcelForm = Java.type('com.wb.office.ExcelForm');

    data ??= {};
    return ExcelForm.getHtml(Wb.toJava(data), this.toFile(excelFile), sheet,
      align ?? 'center', this.getRowsConfig(rowConfigs));
  }
  /**
   * 把数据写入到Excel模板文件中，并输出到指定的输出流中。
   * Example:
   *
   *     Wb.getExcelFile('my-report.xlsx', 'report.xlsx', data, { name: 'rows', x: 0, y: 8 });
   *     Wb.getExcelFile('my-report.xlsx', 'report.xlsx', data, [{ name: 'rows', x: 0, y: 8, sheet: 'Sheet2',
   *              mergeRows: ['F1', 'F3'],  mergeCols: [['F1', 'F2'], ['F5', 'F6']] }]);
   *
   * @param {OutputStream/String} outputStream 生成的Excel文件输出到该流中。如果为字符串表示下载的文件名。
   * @param {String/File/Wb.File/InputStream} excelFile Excel模板文件路径，文件或输入流。如果为字符串表示基于
   * "wb/system/resource/excel"的Excel模板文件的相对路径。
   * @param {Object} [data] 写入到模板中的数据对象。
   * @param {Object/Array} [rowConfigs] 写入到模板中的多行数据配置对象。name表示属性名称，x表示列号, y表示行号,
   * sheet表示Sheet名称，mergeRows表示合并行字段列表，mergeCols表示合并列字段列表。
   * @param {String} [sheet] 使用的模板文件中的Sheet名称，默认表示使用全部Sheet。
   */
  static getExcelFile(outputStream, excelFile, data, rowConfigs, sheet) {
    if (Wb.isString(outputStream)) {
      Wb.setContentType(outputStream, true);
      outputStream = response.getOutputStream();
    }
    data ??= {};
    ExcelUtil.importToExcel(Wb.toJava(data), this.toFile(excelFile), outputStream, sheet,
      this.getRowsConfig(rowConfigs));
  }
}
/**
 * 用户和会话相关的工具类。
 */
Cls['Wb.UserUtil'] = class userUtil extends Wb.Base {
  /** @property {String} - Password protected text. */
  static protectedText = '(protected)';
  /** @property {String[]} - System reserved user name. */
  static reservedName = ['admin', 'system'];
  /**
   * Get online user list.
   * @param {Number} fromIndex Start index for paging.
   * @param {Number} toIndex End index for paging.
   * @return {Object} Online users list.
   */
  static getOnlineUsers(fromIndex, toIndex) {
    let map = Sessions.getSessionMap(), index = -1, items = [], session;

    map.each((userid, sessions) => {
      index++;
      if (index < fromIndex)
        return;
      else if (index > toIndex)
        return false;
      session = SysUtil.peekKey(sessions);
      if (session)
        items.push({
          userid, username: Sessions.getUsername(userid), dispname: session.getAttribute('sys.dispname'),
          ip: session.getAttribute('sys.ip'), createTime: new Date(session.getCreationTime()),
          lastAccessTime: new Date(session.getLastAccessedTime()), sessions: sessions.size()
        });
      else
        items.push({ userid, username: Sessions.getUsername(userid) });
    });
    return {
      total: map.size(), items, fields: {
        createTime: { type: 'date' }, lastAccessTime: { type: 'date' }
      }
    };
  }
  /**
   * Gets the session data under the specified user.
   * @param {String} userid The userid.
   * @param {Number} fromIndex Start index for paging.
   * @param {Number} toIndex End index for paging.
   * @return {Object} Sessions list.
   */
  static getSessions(userid, fromIndex, toIndex) {
    let map = Sessions.getSessions(userid), index = -1, items = [];

    map?.each(session => {
      index++;
      if (index < fromIndex)
        return;
      else if (index > toIndex)
        return false;
      items.push({
        ip: session.getAttribute('sys.ip'), createTime: new Date(session.getCreationTime()),
        lastAccessTime: new Date(session.getLastAccessedTime())
      });
    });
    return {
      total: map?.size() ?? 0, items, fields: {
        createTime: { type: 'date' }, lastAccessTime: { type: 'date' }
      }
    };
  }
  /**
   * Encrypts passwords. For related configuration items, please refer to"sys.session.passwordMethod".
   * @param {String} password The password.
   * @return {String} The encrypted password.
   */
  static encryptPassword(password) {
    let fn = Wb.getConfig('sys.session.passwordMethod');
    if (fn) {
      fn = Java.type(fn.beforeItem('.'))[fn.lastItem('.')];
      password = fn(password);
    }
    return password;
  }
  /**
   * Login to the system by the specified user.
   * @param {String} username The username to login.
   * @param {String/Boolean} [password] The password to login. true means login directly without verifying password.
   * @param {String} [verifyCode] The verification code.
   */
  static login(username, password, verifyCode) {
    let session, rec, recs, userId, dbPassword, dispname, lang, value, roles, passwordOk;

    if (Wb.getConfig('sys.session.verifyCode') && (!verifyCode ||
      verifyCode.toLowerCase() != request.getSession().getAttribute('sys.verifyCode')?.toLowerCase())) {
      Wb.raise(Str.invalidVerifyCode);
    }
    rec = Wb.getRow({
      sql: 'select sid,password,display_name,use_lang,dept_name from wb_user where user_name={?username?} and status=1',
      params: { username }
    });
    if (rec) {
      userId = rec.sid;
      dbPassword = rec.password;
      dispname = rec.display_name;
      lang = rec.use_lang;
      if (password === true) {
        passwordOk = true;
      } else {
        passwordOk = dbPassword === this.encryptPassword(password);
      }
    }
    if (!passwordOk)
      Wb.raise(Str.invalidUserPwd);
    session = request.getSession(false);
    if (session) {
      //If already login and the password is the same, return directly, otherwise the current session will be logout
      if (username.equals(Wb.username) && passwordOk) {
        return;
      } else {
        session.invalidate();
      }
    }
    if (!Config.isDemo) {
      Wb.sql({
        sql: 'update wb_user set login_times=login_times+1,last_login={?now?} where user_name={?username?}',
        params: { username, now: new Date() }
      });
    }
    session = request.getSession();
    session.setMaxInactiveInterval(Config.sessionTimeout);
    session.setAttribute('sys.userid', userId);
    session.setAttribute('sys.username', username);
    session.setAttribute('sys.dispname', dispname);
    session.setAttribute('sys.lang', lang);
    session.setAttribute('sys.deptname', rec.dept_name);
    session.setAttribute('sys.ip', request.getRemoteAddr());
    session.setAttribute('sys.listener', new Classes.SessionListener());
    roles = Wb.getAllRecords({
      sql: `select a.role_id from wb_user_role a, wb_role b where a.role_id=b.role_id and a.user_id={?userId?} and b.status=1
        and (a.begin_date is null or a.begin_date<={?timestamp|now?}) and  (a.end_date is null or a.end_date>={?timestamp|now?})
      `,
      params: { userId }
    }).pluck(0);
    if (Config.getBool('sys.session.addDefaultRole'))
      roles.push('default');
    session.setAttribute('sys.roles', roles.stringArray);
    //Gets the session variables for the current user and stores them in the session attributes
    recs = Wb.getAllRecords({
      sql: 'select sid,stype,svalue from wb_value where sid like {?sid?}',
      params: { sid: userId + '@sys.%' }
    });
    recs.forEach(rec => {
      value = rec[2];
      /* type: 0 string, 1 number, 2 date, 3 bool */
      switch (rec[1]) {
        case 1:
          value = value ? parseFloat(value) : null;
          break;
        case 2:
          value = value ? value.dateValue : null;
          break;
        case 3:
          value = value ? value == 'true' : null;
          break;
      }
      session.setAttribute('sys.' + rec[0].afterItem('.'), value);
    });
  }
}
Wb.onReady();