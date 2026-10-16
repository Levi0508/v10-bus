/*
 * wb-client.js client javascript library
 * Copyright (c) Geejing
 * https://www.geejing.com
 */
/**
 * 共享的全局变量存放对象。
 * @class Globals
 * @singleton
 */
/** @property {Wb.Tab} WbMainTab 当前上下文的主Tab组件。见{#Wb.Tab.mainTab}说明。 @readonly */
/** @property {Wb.Window} Wb.Window 共享的登录窗口对象。 @readonly */
/** @property {String} wsPrefix WebSocket地址前缀。 @readonly */
/** @property {Boolean} onLoadDone 页面onLoad方法已经完成标识。 @readonly @priv */
/** @property {Boolean} debugMode 是否调试模式标识。ide中调试模式下可实现无模态模式。 @priv */
/** @property {Object} promptWins 所有通过{#Wb.prompt}方法显示的单例窗口组成的对象。 @priv */
Wb.apply(Globals, {
  /** @property {Object} - 所有单例模块组成的对象。 @priv */
  allModules: {},
  /** @property {Object} - 所有缓存的模块脚本组成的对象。 @priv */
  allScript: {},
  /** @property {Number} - 手动加载计数。 @priv */
  onLoadCt: 0,
  /** @property {Number} - 当前的zIndex值。 */
  zIndex: 100000000,
  /** @property {Number} - 最小zIndex值。 */
  minZIndex: 100000000,
  /** @property {Number} - 最大zIndex值。 */
  maxZIndex: 900000000,
  /** @property {Boolean} - 是否正在对组件进行移动操作中。 */
  isMoving: false,
  /** @property {Boolean} - 是否为小屏。 */
  smallScreen: false,
  /** @property {Number} - 小屏的宽度。 */
  smallScreenWidth: 800
});
/**
 * 全局this对象的扩展类。
 * @class globalThis
 * @singleton
 */
/** @property {Object} WbDocsData {#WbDocsData}文档数据对象。通常仅在客户端有效。 */
Wb.apply(globalThis, {
  /** @property {HTMLBodyElement} BodyEl HTML的Body节点元素。通常仅在客户端有效。 */
  /** @property {Element} - 文档根节点元素。通常仅在客户端有效。 */
  DocEl: document.documentElement,
  /** @property {Object} - 常用键code列表组成的对象。通常仅在客户端有效。 */
  Keys: {
    Escape: 'Escape', Esc: 'Escape', Digit0: 'Digit0', 0: 'Digit0', Digit1: 'Digit1', 1: 'Digit1',
    Digit2: 'Digit2', 2: 'Digit2', Digit3: 'Digit3', 3: 'Digit3', Digit4: 'Digit4', 4: 'Digit4',
    Digit5: 'Digit5', 5: 'Digit5', Digit6: 'Digit6', 6: 'Digit6', Digit7: 'Digit7', 7: 'Digit7',
    Digit8: 'Digit8', 8: 'Digit8', Digit9: 'Digit9', 9: 'Digit9', Minus: 'Minus', '-': 'Minus',
    Equal: 'Equal', '=': 'Equal', Backspace: 'Backspace', Tab: 'Tab', KeyQ: 'KeyQ', Q: 'KeyQ',
    KeyW: 'KeyW', W: 'KeyW', KeyE: 'KeyE', E: 'KeyE', KeyR: 'KeyR', R: 'KeyR', KeyT: 'KeyT',
    T: 'KeyT', KeyY: 'KeyY', Y: 'KeyY', KeyU: 'KeyU', U: 'KeyU', KeyI: 'KeyI', I: 'KeyI',
    KeyO: 'KeyO', O: 'KeyO', KeyP: 'KeyP', P: 'KeyP', BracketLeft: 'BracketLeft', '[': 'BracketLeft',
    BracketRight: 'BracketRight', ']': 'BracketRight', Enter: 'Enter', ControlLeft: 'ControlLeft',
    KeyA: 'KeyA', A: 'KeyA', KeyS: 'KeyS', S: 'KeyS', KeyD: 'KeyD', D: 'KeyD', KeyF: 'KeyF', F: 'KeyF',
    KeyG: 'KeyG', G: 'KeyG', KeyH: 'KeyH', H: 'KeyH', KeyJ: 'KeyJ', J: 'KeyJ', KeyK: 'KeyK', K: 'KeyK',
    KeyL: 'KeyL', L: 'KeyL', Semicolon: 'Semicolon', ';': 'Semicolon', Quote: 'Quote', "'": 'Quote',
    Backquote: 'Backquote', ShiftLeft: 'ShiftLeft', Backslash: 'Backslash', '|': 'Backslash',
    KeyZ: 'KeyZ', Z: 'KeyZ', KeyX: 'KeyX', X: 'KeyX', KeyC: 'KeyC', C: 'KeyC', KeyV: 'KeyV', V: 'KeyV',
    KeyB: 'KeyB', B: 'KeyB', KeyN: 'KeyN', N: 'KeyN', KeyM: 'KeyM', M: 'KeyM', Comma: 'Comma',
    ',': 'Comma', Period: 'Period', '.': 'Period', Slash: 'Slash', '/': 'Slash', ShiftRight: 'ShiftRight',
    NumpadMultiply: 'NumpadMultiply', AltLeft: 'AltLeft', Space: 'Space', CapsLock: 'CapsLock',
    F1: 'F1', F2: 'F2', F3: 'F3', F4: 'F4', F5: 'F5', F6: 'F6', F7: 'F7', F8: 'F8', F9: 'F9', F10: 'F10',
    Pause: 'Pause', ScrollLock: 'ScrollLock', Numpad7: 'Numpad7', Numpad8: 'Numpad8', Numpad9: 'Numpad9',
    NumpadSubtract: 'NumpadSubtract', Numpad4: 'Numpad4', Numpad5: 'Numpad5', Numpad6: 'Numpad6',
    NumpadAdd: 'NumpadAdd', Numpad1: 'Numpad1', Numpad2: 'Numpad2', Numpad3: 'Numpad3', Numpad0: 'Numpad0',
    NumpadDecimal: 'NumpadDecimal', IntlBackslash: 'IntlBackslash', F11: 'F11', F12: 'F12',
    IntlYen: 'IntlYen', MediaTrackPrevious: 'MediaTrackPrevious', MediaTrackNext: 'MediaTrackNext',
    NumpadEnter: 'NumpadEnter', ControlRight: 'ControlRight', AudioVolumeMute: 'AudioVolumeMute',
    MediaPlayPause: 'MediaPlayPause', MediaStop: 'MediaStop', AudioVolumeDown: 'AudioVolumeDown',
    AudioVolumeUp: 'AudioVolumeUp', BrowserHome: 'BrowserHome', NumpadDivide: 'NumpadDivide',
    PrintScreen: 'PrintScreen', AltRight: 'AltRight', NumLock: 'NumLock', Home: 'Home', ArrowUp: 'ArrowUp',
    Up: 'ArrowUp', PageUp: 'PageUp', ArrowLeft: 'ArrowLeft', Left: 'ArrowLeft', ArrowRight: 'ArrowRight',
    Right: 'ArrowRight', End: 'End', ArrowDown: 'ArrowDown', Down: 'ArrowDown', PageDown: 'PageDown',
    Insert: 'Insert', Delete: 'Delete', Del: 'Delete', ContextMenu: 'ContextMenu',
    BrowserSearch: 'BrowserSearch', BrowserFavorites: 'BrowserFavorites', BrowserRefresh: 'BrowserRefresh',
    BrowserForward: 'BrowserForward', BrowserBack: 'BrowserBack', BrowserStop: 'BrowserStop',
    MetaLeft: 'MetaLeft', MetaRight: 'MetaRight'
  }
});
/**
 * Wb前台JavaScript库。
 * @class Wb-Client
 * @singleton
 */
Wb.apply(Wb, {
  /** @property {Object} - wb的客户端参数配置对象。 */
  configs: { maskDelay: 1500, tzOffset: 0, cmdAsCtrl: true, noHash: ['xiaomi'] },
  /** @property {Boolean} - WebBuilder库是否运行在服务器端标识。 */
  isServer: false,
  /** @property {String} path 应用路径。如应用部署到app目录返回"/app"，部署到根目录返回空串。 @readonly */
  /** @property {Boolean} unloading 当前窗口是否正在卸载中。 @readonly */
  /** @property {Boolean} - 当前设备是否为移动端设备，比如手机或Pad等。 */
  isTouch: 'ontouchstart' in document,
  /** @property {Boolean} - 当前设备是否为桌面端设备，比如PC，工作站等。 */
  isDesktop: !('ontouchstart' in document),
  /** @property {Number} - 当前id值。获取一个新的id请使用{#getId}方法。 */
  currentId: Date.now(),
  /** @property {Number} - 客户端id值，用于标识一个客户端。通常仅用户区分同一个用户打开的不同窗口。 */
  clientId: Date.now() + Math.random().toString().substr(2, 2),
  /** @property {String[]} - 用于定位的样式名称列表。 */
  posItems: ['absolute', 'relative', 'fixed'],
  /** @property {Function} - 返回脚本表示的对象。{#Wb.eval}方法的别名。 */
  parse: Wb.eval,
  /** @property {Object} - 从CSS取的颜色值对象。 */
  color: {},
  /**
   * 获取指定id的元素，如果id不是字符串直接返回该值。
   * @param {String} id 元素id。
   * @return {Element} 获取的元素。
   */
  el(id) {
    return Wb.isString(id) ? document.getElementById(id) : id;
  },
  /**
   * 把基于应用目录的相对路径转换为绝对路径。
   * @param {String} path 基于应用目录的相对路径。
   * @return {String} 绝对路径。
   */
  url(path) {
    return Wb.path + '/' + path;
  },
  /**
   * 检查指定的关键字是否在指定的字符串值中，如果存在将显示值已经存在的错误提示。
   * @param {String} value 检查的字符串值。
   * @param {String} key 检查的关键字。
   * @param {Wb.Component/String} [name] 如果为组件表示检查关联的组件，将显示该组件的值作为错误提示关键字。如果
   * 为字符串表示错误提示关键字。默认为[Str.list]。
   * @return {Boolean} 是否已经存在。true存在，false不存在。
   */
  checkExists(value, key, name) {
    if (value?.toLowerCase().includes(key?.toLowerCase())) {
      name ??= Str.list;
      if (Wb.isString(name))
        Wb.error(Str.duplicate.format(name));
      else
        Wb.error(Str.alreadyExists.format(name.value), f => name.focus(false, true));
      return true;
    }
    return false;
  },
  /**
   * 在新窗口中根据参数设置打开指定URL。
   * Example:
   *
   *     Wb.openWin('https://developer.mozilla.org'); //在新窗口中打开MDN
   *     Wb.openWin({url: 'dbe', params: {foo: 'bar'}, method: 'POST'}); //设置参数和method
   *
   * @param {Object/String} configs 配置对象或URL地址。
   * @param {Object} .url url地址。如果指定此项将覆盖前面的url参数。
   * @param {Object} [.params] 提交的页面参数。
   * @param {String} [.target] 指定在何处打开目标页面，可以为iframe的id。默认为'_blank'。
   * @param {String} [.method] 提交使用的方法。默认为'GET'。
   * @param {Boolean} [.form] 是否使用'multipart/form-data'方式编码。默认为false即使用URL方式编码。
   */
  openWin(configs) {
    let url;

    if (Wb.isString(configs))
      configs = { url: configs };
    url = configs.url;
    if (configs.params == null && configs.target == null && configs.method == null && configs.form == null)
      window.open(url);
    else
      Wb.submit(url, configs.params, configs.target, configs.method, configs.form);
  },
  /**
   * 把字符串编码为Base64字符串。
   * @param {String} text 需要转换的字符。
   * @return {String} 转换后的字符。
   */
  encodeBase64(text) {
    let str = '', i, j;

    text = new TextEncoder().encode(text);
    j = text.length;
    for (i = 0; i < j; i++)
      str += String.fromCharCode(text[i]);
    return btoa(str);
  },
  /**
   * 把Base64字符串解码为字符串。
   * @param {String} text 需要转换的字符。
   * @return {String} 转换后的字符。
   */
  decodeBase64(text) {
    let arr, i, j;

    text = atob(text);
    j = text.length;
    arr = new Uint8Array(j);
    for (i = 0; i < j; i++)
      arr[i] = text.charCodeAt(i);
    return new TextDecoder().decode(arr)
  },
  /**
   * 把对象作为日志信息输出到当前控制台。
   */
  log(object) {
    console.log(object);
  },
  /**
   * 通过常规方式提交表单。
   * Example:
   *
   *     Wb.submit('m?xwl=file', {p1: 'foo', p2: [1, 2, 3], p3: new Date()});
   *
   * @param {String/Object} url 提交到的目标URL地址或配置对象。
   * @param {Object} [params] 提交的参数组成的对象。
   * @param {String} [target] 指定在何处打开目标页面，可以为iframe的id。默认为'_blank'。
   * @param {String} [method] 提交使用的方法。默认为'GET'。
   * @param {Boolean} [form] 是否使用'multipart/form-data'方式编码。指定该值method默认为"POST"。默认为false即使用URL方式编码。
   */
  submit(url, params, target, method, form) {
    let el, submitForm;

    if (Wb.isObject(url)) {
      params = url.params;
      target = url.target;
      method = url.method;
      form = url.form;
      if (url.comps)
        params = Wb.apply(Wb.getValue(url.comps), params);
      url = url.url;
    }
    submitForm = BodyEl.addEl('w-disp-none', 'form');
    Wb.each(params, (k, v) => {
      if (v !== undefined) {
        el = submitForm.addTag('input');
        el.setAttribute('type', 'hidden');
        el.setAttribute('name', k);
        if (Wb.isArray(v) || Wb.isObject(v))
          v = Wb.encode(v);
        else
          v = v == null ? '' : String(v);
        el.setAttribute('value', v);
      }
    });
    if (form)
      method ??= 'POST';
    // get方法url中的参数必须使以下方式提交，否则url中的参数不会被提交
    if ((!method || method.equalsIC('get')) && url.includes('?')) {
      let pos = url.indexOf('?');
      params = new URLSearchParams(url.substr(pos + 1));
      params.forEach((v, k) => {
        el = submitForm.addTag('input');
        el.setAttribute('type', 'hidden');
        el.setAttribute('name', k);
        el.setAttribute('value', v ?? '');
      });
      url = url.substr(0, pos);
    }
    submitForm.action = url;
    if (method)
      submitForm.method = method;
    submitForm.target = target || '_blank';
    submitForm.encoding = form ? 'multipart/form-data' : 'application/x-www-form-urlencoded';
    BodyEl.append(submitForm);
    submitForm.submit();
    submitForm.remove();
  },
  /**
   * 根据图片文件名获取其完整路径。如果名称未包含路径和扩展名，取系统images目录下扩展名
   * 为".png"的文件；否则直接返回文件名。
   * @param {String} filename 文件名称。
   * @return {String} 完整的路径。
   */
  getImagePath(filename) {
    if (!filename.includes('/') && !filename.includes('.'))
      return 'wb/images/' + filename + '.png';
    else
      return filename;
  },
  /**
   * 把url地址转换为完整的url地址。
   * @param {String} url URL地址。
   * @return {String} 经过修饰后的完整的url地址。
   */
  qualifyURL(url) {
    if (url.startsWith('http:') || url.startsWith('https:'))
      return url;
    if (!url.startsWith('/'))
      url = Wb.path + '/' + url;
    if (url.includes('./'))
      url = Wb.normalizePath(url);
    return location.origin + url;
  },
  /**
   * 获取URL地址中除当前页面origin外部分的路径。如果路径不以origin开头将直接返回该路径。
   * @param {String} url URL地址。
   * @return {String} URL短地址。
   */
  shortURL(url) {
    let origin = location.origin;
    if (url?.startsWith(origin))
      return url.substr(origin.length);
    return url;
  },
  /**
   * 获取当前页面WebSocket地址的前缀。前缀由协议+主机+端口+路径组成，如：wss://myhost.com/foo/bar
   * @param {String} [separator] 协议后的分隔符。默认为":"。
   * @return {String} 地址前缀。
   */
  getWSPrefix(separator) {
    let prefix, pathname = location.pathname;

    prefix = location.protocol == 'https:' ? 'wss' : 'ws';
    prefix += (separator ?? ':') + location.host + pathname.substr(0, pathname.lastIndexOf('/'));
    return prefix;
  },
  /**
   * 运行指定URL地址的XWL模块文件，并在回调函数中返回模块的app对象。如果模块app内的包含onLoad方法，将在模块加载
   * 完成后执行，无论模块是否单例加载后该方法均会被执行。
   * Example:
   *
   *     Wb.run({url: 'm?xwl=module', params: {foo: 'bar'}, success(scope){
   *       scope.publicMethod();
   *     }});
   *
   * @param {Object/String} configs 配置对象或模块url地址。
   * @param {String} [.url] 模块url地址。
   * @param {Object} [.params] 参数对象。
   * @param {String} [.title] 显示在card或相关组件上时的标题。
   * @param {String} [.icon] 显示在card或相关组件上时的图标。
   * @param {String} [.img] 显示在card或相关组件上时的图片图标。
   * @param {String} [.cid] 显示在card或相关组件上时的组件cid属性。
   * @param {Boolean} [.focus] 是否把焦点转移到打开的容器。
   * @param {String/Function} [.tip] 显示在card或相关组件上时的提示。
   * @param {Object} [.app] 模块的上级app对象。
   * @param {Wb.Panel/Boolean} [.container] 把模块中的所有根组件添加到该容器中。true表示在新窗口打开模块，false表示无容器。当
   * 该容器销毁时，默认打开的整个模块将销毁。
   * @param {Boolean} [.updateTitle] 是否自动更新面板标题和图标。默认为true。
   * @param {Wb.Component/String/Boolean} [.owner] 模块的拥有者组件，该组件销毁时整个模块将销毁。如果为字符串表示模块内的组件cid，
   * 如果模块存在cid为main的组件且未设置container参数时，默认将作为owner。false显式表示无拥有者。如果未指定owner，后续可以通过
   * scope.setOwnerComp方法动态添加owner。
   * @param {Boolean} [.single] 是否单例模式。false每次运行创建新的实例，true如果相同url的模块已经运行，
   * 则不再创建新的实例。
   * @param {Boolean} [.cached] 运行后是否缓存模块的客户端脚本，缓存后下次再次运行时将直接在缓存中获取模块。如果模块每次返回的客
   * 户端脚本是固定的且需要多次运行时，可设置该属性为true。
   * @param {String} [.script] 模块的客户端静态脚本。
   * @param {String} [.tabMode] 当在Tab中打开模块时，如果模块已经存在，处理的模式：
   * -'new': 创建新的模块
   * -'reload': 重新加载模块
   * -'show': 显示已经打开的模块
   * -'auto'/null: 自动判断，默认项。如果同已存在卡片的url和params参数内容一致则模式为"show"，否则模式为"new"。
   * @param {Wb.Card} [.card] 操作的选项卡对象。如果存在参数相同的选项卡刷新时可设置此项。
   * @param {Wb.Card/Boolean} [.refCard] 在此选项卡后打开新的选项卡。true表示在最后打开选项卡，false表示在
   * 最前打开选项卡，null表示在当前激活的选项卡后打开选项卡（默认值）。
   * @param {Object} [.tags] 添加到容器的参数对象，该对象中的所有参数直接添加到容器。
   * @param {Boolean} [.allowRefresh] 当模块添加到容器后，是否允许用户手动刷新该模块。
   * @param {String} [.method] 使用的HTTP方法，例如GET, POST, PUT, DELETE等，默认为GET。
   * @param {Function} [.success] 运行成功时的回调函数。可用参数scope表示返回的模块app对象。
   * @param {Function} [.failure] 运行失败时的回调函数。可用参数scope表示返回的模块app对象。
   * @param {Function} [.callback] 运行结束时的回调函数，无论成功失败都会执行。可用参数scope和ok，
   * 分别表示返回的模块app对象和请求是否成功标识。
   * 更多参数说明详见{#Wb.Request.!ajax}方法。
   */
  run(configs) {
    if (Wb.isString(configs))
      configs = { url: configs };
    let { callback, success, failure, title, icon, img, url, container, owner, tags, allowRefresh, path, destroyFn,
      single, cached, script, mask, focus } = configs, module, meta, tabMode, isTab, cacheScript, updateTitle, saveIcon;

    if (single && (module = Globals.allModules[url])) {
      //处理单例模式
      container = module.parentContainer;
      if (container instanceof Wb.Component) {
        if (focus)
          container.focus();
        container.show();
      }
      callback?.call(module, module, true);
      success?.call(module, module);
      module.onLoad?.call(module);
      return;
    }
    destroyFn = module => {
      Wb.each(module, (k, v) => {
        v?.app === module && (v instanceof Wb.Configurable) && v.destroy();
      });
      if (single)
        delete Globals.allModules[url];
      module.onDestroy?.call(module);
    };
    path = tags?.path;
    isTab = container instanceof Wb.Tab;
    if (isTab && (tabMode = configs.tabMode) != 'new') {
      //判断在选项卡中的模块是否已经存在
      if (tabMode != null && !['new', 'auto', 'reload', 'show'].includes(tabMode))
        Wb.raise('Invalid tabMode "' + tabMode + '".');
      let card, encodeParams, findName, findValue;
      findName = path ? 'path' : 'moduleUrl';
      findValue = path ? path : url;
      encodeParams = Wb.encode(configs.params);
      card = configs.card || container.findBy(card => card.moduleUrl && card[findName] == findValue &&
        Wb.encode(card.moduleParams) == encodeParams);
      if (card) {
        if (focus)
          card.tabButton?.focus();
        card.show();
        if (tabMode == 'reload' && !card.isLoading) {
          if (card.beforeUnloadFn?.() === false) {
            Wb.confirm(Str.reloadConfirm, f => {
              card.beforeUnloadFn = null;
              Wb.run(configs);
            });
            return;
          }
          card.destroyAll();
          card.text = '';
          card.bodyEl.removeCls('w-plain-text');
          card.beforeUnloadFn = null;
          card.clearAppObjects?.();
          container = card;
        } else {
          module = card.module;
          callback?.call(module, module, true);
          success?.call(module, module);
          return;
        }
      }
    }
    //发起新的请求
    configs = Wb.copy(configs);
    configs.showError ??= false;
    configs.method ??= (configs.form || configs.data) ? 'POST' : 'GET';
    configs.mask = false;
    mask ??= !container;
    //success和failure在callback中调用
    configs.success = undefined;
    configs.failure = undefined;
    configs.callback = function (resp, xhr) {
      let pos, load, respMode, ok = xhr.ok;

      if (ok && cached)
        Globals.allScript[url] = resp;
      load = f => {
        let geval = eval; //geval = eval使之在全局运行

        if (mask)
          Wb.unmask(mask);
        if (container) {
          container.delaySpin.cancelDelay(container);
          container.spin = false;
          container.isLoading = false;
          if (updateTitle ?? true) {
            if (!title)
              container.title = meta.title || Wb.getUrlKey(url);
            //图标可能变为加载中图标，需重置图标
            if (icon ??= meta.icon)
              container.icon = icon;
            else if (img ??= meta.img)
              container.img = img;
            else
              container.icon = 'module';
          } else if (saveIcon) {
            if (saveIcon.icon)
              container.icon = saveIcon.icon;
            else
              container.img = saveIcon.img;
          }
          if (container instanceof Wb.Card)
            container.tabButton.intoView();
          if (respMode) {
            container.bodyCls = 'w-plain-text';
            if (ok)
              container.text = resp;
          }
        }
        if (ok) {
          if (!respMode) {
            module = geval(resp.substr(pos + 5) + '\n' + Wb.getSourceURL('wb/modules/' + meta.url))
              (configs.app ?? container?.app, container ?? false);
            if (!container && module.main)
              owner ??= 'main';
            if (Wb.isString(owner)) {
              owner = module[owner];
              if (!owner)
                Wb.raise('Module owner not found.');
            }
            if (owner)
              owner.on('destroy', f => destroyFn(module));
            else
              module.setOwnerComp = comp => {
                comp?.on('destroy', f => destroyFn(module));
              };
            if (single)
              Globals.allModules[url] = module;
            if (container)
              container.module = module;
            module.onLoad?.call(module);
          }
        } else {
          if (xhr.status == 401 || xhr.status == 402)
            container?.destroy();
          Wb.Request.processError(xhr, respMode ? container : null);
        }
        callback?.call(module, module, ok);
        if (ok) {
          success?.call(module, module);
        } else {
          failure?.call(module, module);
        }
      };
      delete container?.runAjaxObject;
      //respMode表示服务端发送任意数据，非有效模块
      respMode = !resp.startsWith('$$^xwl');
      if (respMode) {
        meta = {};
      } else {
        pos = resp.indexOf('^$*%!');
        meta = Wb.decode(resp.substring(6, pos));
        meta.title = Wb.optText(meta.title);
      }
      if (meta.links) {
        Wb.load(meta.links, f => Wb.onLoad(load));
      } else {
        Wb.onLoad(load);
      }
    };
    //初始化容器
    if (container && !container.moduleCtInited) {
      let ctConfig;

      ctConfig = { title: title || url && Wb.getUrlKey(url), moduleCtInited: true };
      if (icon)
        ctConfig.icon = icon;
      else if (img)
        ctConfig.img = img;
      else
        ctConfig.icon = 'module';
      if (container === true) {
        ctConfig.cid ??= Wb.getId();
        container = new Wb.Window(Wb.apply(ctConfig, {
          modal: true, cls: 'w-view-win', closeAction: single ? 'hide' : 'destroy'
        }));
      } else if (isTab) {
        ctConfig.cid ??= Wb.getId();
        if (configs.tip)
          ctConfig.tabTip = configs.tip;
        Wb.apply(ctConfig, {
          moduleParams: configs.params, moduleUrl: url, path: ''
        });
        let refCard = configs.refCard;
        if (refCard === true)
          container = container.add(ctConfig);
        else if (refCard === false)
          container = container.insert(0, ctConfig);
        else if (refCard)
          container = container.insertAfter(ctConfig, refCard);
        else
          container = container.insertAfter(ctConfig, container.activeCard);
      } else {
        updateTitle = configs.updateTitle ?? true;
        if (updateTitle)
          Wb.apply(container, ctConfig);
        container.cid ??= Wb.getId();
      }
      if (tags)
        Wb.apply(container, tags);
      container.allowRefresh = allowRefresh;
      container.on('beforeclose', function () {
        if (this.beforeUnloadFn?.() === false) {
          Wb.confirm(Str.unloadConfirm, f => {
            this.beforeUnloadFn = null;
            container.close();
          });
          if (container instanceof Wb.Card) {
            let btn = container.tabButton;
            container.show();
            btn.highlight();
          }
          return false;
        }
      });
      container.mon(window, 'beforeunload', function (e) {
        if (this.beforeUnloadFn?.() === false) {
          if (container instanceof Wb.Card) {
            let btn = container.tabButton;
            container.show();
            btn.highlight();
          }
          Wb.stopLoad(e);
        }
      });
      if (focus) {
        if (container instanceof Wb.Card)
          container.tabButton?.focus();
        else
          container.focus();
      }
      container.show();
      container.delaySpin = f => {
        saveIcon = { icon: container.icon, img: container.img };
        container.icon = 'loading';
        container.spin = true;
      };
      container.clearAppObjects = function () {
        let module = this.module;
        container.runAjaxObject?.abort();
        if (module) {
          destroyFn(module);
          container.module = null;
        }
      };
      container.on('destroy', container.clearAppObjects);
    }
    if (mask !== false)
      mask = Wb.mask(mask);
    if (script || cached && (cacheScript = Globals.allScript[url])) {
      let mimicXhr = { ok: true, status: 200 };
      configs.callback?.call(configs.scope ?? mimicXhr, script || cacheScript, mimicXhr);
    } else {
      if (container) {
        if (container.parent?.isWbIde)
          configs.header = Wb.apply({ Showstack: true }, configs.header)
        container.delaySpin.delay(container, Wb.configs.maskDelay);
        container.isLoading = true;
        container.runAjaxObject = Wb.ajax(configs);
      } else {
        Wb.ajax(configs);
      }
    }
  },
  /**
   * 运行指定模块文件，如果未指定打开的容器将在当前主Tab{#Wb.Tab.mainTab}中打开模块。如果没有发现主Tab将在新窗口中打开
   * 模块。更多说明详见{#Wb.run}方法。
   * Example:
   *
   *     Wb.open({url: 'm?xwl=foo/bar', params: {foo: 'bar'}, success(scope){
   *       scope.publicMethod();
   *     }});
   *
   */
  open(configs) {
    if (Wb.isString(configs))
      configs = { url: configs };
    let tab = Globals.WbMainTab;
    if (tab || configs.container)
      Wb.run(Wb.apply({ container: tab }, configs));
    else
      Wb.openWin(configs);
  },
  /**
   * 运行指定模块文件。该方法同{#open}方法的区别为默认允许用户手动刷新该模块。更多说明详见{#Wb.run}方法。
   */
  openNormal(configs) {
    if (Wb.isString(configs))
      configs = { url: configs, allowRefresh: true };
    else
      configs = Wb.apply({ allowRefresh: true }, configs);
    Wb.open(configs);
  },
  /**
   * 获取url中代表整个地址的关键字。
   */
  getUrlKey(url) {
    let p;

    if (url.startsWith('m?xwl=')) {
      url = url.substr(6);
      p = url.indexOf('&');
    } else {
      p = url.indexOf('?');
    }
    if (p != -1)
      url = url.substr(0, p);
    return url.lastItem('/');
  },
  /**
   * 在当前上下文的主Tab{#Wb.Tab.mainTab}中浏览指定URL的资源。如果没有发现主Tab将在新窗口中打开资源。
   * Example:
   *
   *     Wb.browse('https://www.geejing.com');
   *
   * @param {Object/String} configs 配置对象或URL地址。
   * @param {String} .url 资源URL地址。
   * @param {Object} [.params] 参数对象。
   * @param {String} [.title] 标题。
   * @param {String} [.icon] 图标。
   * @param {String} [.method] 使用的方法。默认为'GET'。
   * @param {Boolean} [.form] 是否使用'multipart/form-data'方式编码。默认为false即使用URL方式编码。
   */
  browse(configs) {
    if (Wb.isString(configs))
      configs = { url: configs };
    let { url, params, title, icon, method, form } = configs, tab = Globals.WbMainTab, name;
    if (tab) {
      let card;

      card = tab.findBy(card => card.browseUrl == url);
      if (card) {
        card.show();
        return;
      } else {
        card = tab.add({
          icon: icon ?? 'module', title: title ?? url, path: ':',
          browseUrl: url, layout: 'fit'
        });
        name = Wb.getId();
        card.el.innerHTML = '<iframe class="w-iframe" name="' + name + '"></iframe>';
        card.show();
      }
    } else {
      name = null;
    }
    Wb.submit(url, params, name, method, form);
  },
  /**
   * 获取执行指定操作的提示文本。
   * @param {Object/Array} items 一个或多个项目。
   * @param {String} [key] 提示的属性名称。
   * @param {String} [action] 提示的动作类型。默认为Str.del。
   * @return {String} 提示文本。
   */
  getActionHint(items, key, action) {
    let len, rec;
    if (Wb.isArray(items)) {
      len = items.length;
      rec = items[0];
    } else {
      len = 1;
      rec = items;
    }
    action ??= Str.del;
    action = action.toLowerCase();
    if (key) {
      if (rec instanceof Wb.ViewItem)
        text = rec.data[key];
      else
        text = rec[key];
      if (len > 1)
        return Str.actionManyConfirm.format(action, text, len);
      else
        return Str.actionConfirm.format(action, text);
    } else {
      if (len > 1)
        return Str.actionNumConfirm.format(action, len);
      else
        return Str.actionThisConfirm.format(action);
    }
  },
  /**
   * 获取当前具有焦点的指定组件类名称的组件。获取任意组件可直接访问{#activeComp}属性。
   * Example: 
   *
   *     let view = Wb.getActiveComp(Wb.View); //获取当前激的Wb.View组件
   *
   * @param {Function} [cls] 组件类名称。缺省表示任意类。
   * @return {Wb.Component} 找到的组件，如果未找到返回null。
   */
  getActiveComp(cls) {
    return document.activeElement.getClosestComp(cls);
  },
  /**
   * 设置指定名称的Cookie值。
   * Example:
   *
   *     Wb.setCookie('my-name', 'my-value');
   *
   * @param {String} name Cookie名称。
   * @param {Object} value Cookie值。
   * @param {Date/Number/Boolean} [expires] Cookie过期时间。日期表示到该时间时失效，数字表示过该数量的天数后失效，
   * true表示永久有效。默认为对话结束时过期。
   * @param {String} [path] 路径，默认为所有页面（'/'）。
   * @param {String} [domain] 域，默认为当前页面所在的域。
   * @param {Boolean} [secure] 是否Cookie只通过https协议传输。
   */
  setCookie(name, value, expires, path, domain, secure) {
    let cookie;

    try {
      cookie = name + '=' + escape(value);
      if (expires) {
        if (expires === true)
          expires = 'Fri, 31 Dec 9999 23:59:59 GMT';
        else if (Wb.isNumber(expires))
          expires = (new Date()).addDay(expires).toUTCString();
        else
          expires = expires.toUTCString()
        cookie += '; expires=' + expires;
      }
      cookie += '; path=' + (path ?? '/');
      if (domain)
        cookie += '; domain=' + domain;
      if (secure)
        cookie += '; secure';
      document.cookie = cookie;
    }
    catch (e) {
      // no permission
    }
  },
  /**
   * 获取指定名称的Cookie值，如果不存在返回null。
   * Example:
   *
   *     let value = Wb.getCookie('my-name');
   *
   * @param {String} name Cookie名称。
   * @return {String} cookie值。
   */
  getCookie(name) {
    try {
      let items = document.cookie.split('; '),
        item, i, j = items.length, result;

      for (i = 0; i < j; ++i) {
        item = items[i].split('=');
        if (item[0] === name) {
          result = item[1];
          return result ? unescape(result) : '';
        }
      }
      return null;
    } catch (e) {
      return null; // no permission
    }
  },
  /**
   * 移除指定名称的Cookie，如果Cookie不存在该方法无任何效果。
   * @param {String} name Cookie名称。
   * @param {String} [path] 路径。如果设置Cookie时包含路径，则该项必须指定。
   */
  removeCookie(name, path) {
    try {
      if (Wb.getCookie(name))
        document.cookie = name + '=' + '; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=' + (path ?? '/');
    } catch (e) {
      // no permission
    }
  },
  /**
   * 获取本地存储指定名称的值。
   * @param {String} name 名称。
   * @return {String} 存储的值。如果不存在或无权限返回null。
   */
  getStorage(name) {
    try {
      return localStorage.getItem(name);
    } catch (e) {
      return null;
    }
  },
  /**
   * 设置本地存储指定名称的值。
   * @param {String} name 名称。
   * @param {String} value 值。
   */
  setStorage(name, value) {
    try {
      localStorage.setItem(name, value);
    } catch (e) {
      //ignore
    }
  },
  /**
   * 删除本地存储指定名称的值。
   * @param {String} name 名称。
   */
  removeStorage(name) {
    try {
      localStorage.removeItem(name);
    } catch (e) {
      //ignore
    }
  },
  /**
   * 异步读取一个或多个blob，并获取blob内容的base64编码字符串。
   * @param {Blob[]/Blob} blobs 要读取的一个或多个blob对象。
   * @param {Function} [success] 全部成功之后的回调方法。
   * @param {String/String[]] .values 读取成功后的base64值或其数组。
   */
  readBlob(blobs, success) {
    let readers = [], isArray = Wb.isArray(blobs);

    Wb.toArray(blobs).forEach(blob => {
      if (!blob) return;
      readers.push(new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = f => {
          let result = reader.result, pos = result.indexOf('base64,');
          result = pos == -1 ? '' : result.substr(pos + 7);
          resolve(result);
        };
        reader.onerror = f => {
          reject(f);
        };
        reader.readAsDataURL(blob);
      }));
    });
    Promise.all(readers).then(r => {
      success?.(isArray ? r : r[0]);
    });
  },
  /**
   * 下载指定链接的文件或资源。
   * @param {String/Object} url url路径或配置对象。
   * @param {Object} [params] 可选参数。
   * @param {String} [method] 提交使用的方法。默认为'GET'。
   * @param {Boolean} [form] 是否使用'multipart/form-data'方式编码。指定该值method默认为"POST"。
   */
  download(url, params, method, form) {
    if (Wb.isObject(url)) {
      params = url.params;
      method = url.method;
      form = url.form;
      if (url.comps)
        params = Wb.apply(Wb.getValue(url.comps), params);
      url = url.url;
    }
    if (url.includes('?'))
      url += '&';
    else
      url += '?';
    url += 'W-Requested-With=XMLHttpRequest';
    Wb.submit(url, params, Wb.iframe.id, method, form);
  },
  /**
   * 下载二进制对象为文件。
   * @param {Blob} blob 二制制对象。
   * @param {String} [filename] 文件名称。默认为"download"。
   */
  downloadBlob(blob, filename) {
    let a = document.createElement('a'), url = URL.createObjectURL(blob);

    try {
      a.download = filename ?? 'download';
      a.href = url;
      a.click();
      a.remove();
    } finally {
      URL.revokeObjectURL(url);
    }
  },
  /**
   * 下载文本为文件。
   * @param {String} text 文本。
   * @param {String} [filename] 文件名称。默认为"download"。
   */
  downloadText(text, filename) {
    Wb.downloadBlob(new Blob([text], { type: 'text/plain' }), filename);
  },
  /**
   * 下载Base64编码的字符串为文件。
   * @param {String} text Base64编码的字符串。
   * @param {String} [filename] 文件名称。默认为"download"。
   */
  downloadBase64(text, filename) {
    const url = 'data:application/octet-stream;base64,' + text;

    fetch(url).then(res => res.blob()).then(blob => Wb.downloadBlob(blob, filename));
  },
  /**
   * 使用浏览器内置的打印功能打印指定的对象。
   * Example:
   *
   *     Wb.print(panel1, 'A3 landscape');
   *
   * @param {Object} object 打印的对象。如果对象为文本则打印该HTML文本，否则将打印对象中的html内容。
   * @param {String} [pageSize] 页面大小或样式。如"A3 landscape", "A4 portrait", "@page{size:A3;margin:0;}"。
   * @param {String} [title] 输出的页面标题。
   */
  print(object, pageSize, title) {
    let html, iframe, doc, style, cssLinks = '';

    iframe = Globals.printIframe ??= BodyEl.addEl('w-disp-none', 'iframe');
    if (object instanceof Wb.Component)
      html = (object.bodyEl || object.el).outerHTML;
    else
      html = object ? object.toString() : '';
    doc = iframe.contentDocument;
    pageSize ||= 'auto';
    style = pageSize.includes('{') ? pageSize : '@page{size:' + pageSize + ';margin:0}';
    style = '<style>' + style + '</style>';
    document.getElementsByTagName('link').forEach(link => {
      if (link.rel.toLowerCase() === 'stylesheet')
        cssLinks += link.outerHTML;
    });
    doc.write('<!DOCTYPE html><html><head><meta http-equiv="content-type" content="text/html;charset=utf-8"/><title>' +
      (title || '&#160;') + '</title>' + cssLinks + style + '</head><body onload="this.focus();this.print();">' +
      html + '</body></html>');
    doc.close();
  },
  /**
   * 把组件悬浮显示在指定的位置。通常用于同组件的快速交互，当焦点转移当组件外时组件将隐藏。
   * Example:
   *
   *     Wb.hover(panel, button, panel => { doSomething(); });
   *
   * @param {Wb.Component} comp 需要悬浮显示的组件。
   * @param {Wb.Component/Array} target 对齐到该组件所在的位置，如果为数组表示[x, y]指定坐标。
   * @param {Function} [fn] 组件隐藏后执行的方法。
   */
  hover(comp, target, fn) {
    let events, configs, isArray = Wb.isArray(target);

    Globals.hoverEvent?.comp?.hide();
    if (!isArray)
      comp = Wb.create(comp);
    comp.cls = 'w-hover-comp';
    comp.show();
    comp.focusFirst();
    if (isArray) {
      comp.xy = target;
    } else {
      comp.alignTo(target);
      // prevent trigger click
      target.cls = 'w-pass';
    }
    events = Globals.hoverEvent ??= {
      onDocTapDown(e) {
        let me = this, target = e.target, els = [me.el];
        if (!els.some(el => el.contains(target)) && !me.contains(target.getClosestComp()))
          me.hide();
      },
      onDocKeyDown(e) {
        let me = this;
        if (e.code == Keys.Esc && (me.closeOnEsc ?? true)) {
          me.hide();
          e.stopEvent();
        }
      },
      onDocWheel(e) {
        let me = this;
        if (!me.el.contains(e.target))
          me.hide();
      }
    };
    events.comp = comp;
    configs = {
      el: DocEl,
      [Event.tapDownName]: events.onDocTapDown,
      keydown: events.onDocKeyDown,
      wheel: { fn: events.onDocWheel, passive: true }
    };
    comp.mon(configs);
    comp.on('hide', f => {
      comp.mun({
        el: DocEl,
        [Event.tapDownName]: events.onDocTapDown,
        keydown: events.onDocKeyDown,
        wheel: events.onDocWheel
      });
      delete events.comp;
      target.removeCls('w-pass');
      fn?.call(comp, comp);
    }, comp, { once: true });
  },
  /**
   * 显示带指定输入控件的对话框，并在点击确定按钮后执行回调方法。
   * Example:
   *
   *     Wb.prompt('My Dialog', [{text: 'Your Name', cid: 'name'}], (values, win) => {
   *       Wb.tip(values.name);
   *       win.close();
   *     });
   *
   * @param {String/Object} title 对话框标题或窗口配置对象。
   * @param {Array/Function} items 控件配置项列表或点击确定按钮后执行的回调方法。
   * @param {Function} [handler] 点击确定按钮后执行的回调方法。
   * @param {Object} .values 包含cid属性的组件值组成的对象。
   * @param {Wb.Window} .win 窗口对象。
   * @param {String} [name] 窗口名称。指定此项后相同名称的窗口将生成单例共享窗口。
   * @return {Wb.Window} 对话框窗口。
   */
  prompt(title, items, handler, name) {
    let configs, win, value;

    if (Wb.isFunction(items)) {
      handler = items;
      items = undefined;
    }
    if (name) {
      win = Globals.promptWins?.[name];
      if (win) {
        configs = Wb.isObject(title) ? title : { title };
        if ((value = configs.title) != null)
          win.title = value;
        if (value = configs.icon)
          win.icon = value;
        else if (value = configs.img)
          win.img = value;
        if (handler)
          win.handler = handler;
        win.show();
        return win;
      }
    }
    configs = {
      items, dialog: true, cls: 'w-prompt-win', layout: 'grid1', handler,
      closeAction: name ? 'hide' : 'destroy', defaults: { cname: 'text' }, events: {
        ok() {
          win.handler?.call(win, Wb.getValue(win), win);
        }
      }
    };
    if (Wb.isObject(title))
      Wb.apply(configs, title);
    else
      configs.title = title;
    win = new Wb.Window(configs);
    win.show();
    if (name) {
      Globals.promptWins ??= {};
      Globals.promptWins[name] = win;
    }
    return win;
  },
  /**
   * 显示日期选择对话框，并获取选择的日期值。
   * @param {Function} callback 选择日期后的回调事件。返回false阻止窗口关闭。
   * @param {Date} .value 选择的日期。
   * @param {Date} date 显示的日期。默认为当前日期。
   * @param {String} [title] 窗口标题。
   * @param {Boolean} [isDrawer] 是否使用抽屉作为对话框。true抽屉，false普通对话框。null表示自动判断，
   * 即touch下使用抽屉，其他使用普通对话框。
   * @param {String} [type] 类型：
   * -'date': 日期，默认值。
   * -'time': 时间
   * -'datetime': 日期时间
   * -'month': 年月
   * @return {Wb.Window} 显示的对话框。
   */
  promptDate(callback, date, title, isDrawer, type) {
    let win, cls, configs, cnames = { date: 'dateView', time: 'timeSlot', datetime: 'datetimePanel', month: 'monthSlot' };

    isDrawer ??= Wb.isTouch;
    cls = isDrawer ? Wb.Drawer : Wb.Window;
    type ??= 'date';
    configs = {
      layout: 'fit', focusControl: false,
      title: title ?? (isDrawer ? undefined : type.includes('time') ? Str.time : Str.date), items: {
        cname: cnames[type], value: date ?? new Date(), okButton: isDrawer, nowButton: isDrawer, events: {
          selectdate(value) {
            let win = this.parent;
            if (callback?.call(win, value) !== false)
              win.close();
          }
        }
      }, events: {
        ok() {
          let comp = this.firstItem;
          comp.fireEvent('selectdate', comp.value);
        },
        hide() {
          if (!(this instanceof Wb.Drawer))
            this.destroy();
        },
        hidden() {
          this.destroy();
        }
      }
    };
    if (isDrawer) {
      Wb.apply(configs, { maxHeight: 'min(30em, calc(100% - 3em))' });
    } else {
      Wb.apply(configs, { icon: 'calendar', dialog: true, width: '33em', height: '30em' });
    }
    win = new cls(configs);
    if (!isDrawer)
      win.buttonsBar.insert(0, [{
        cname: 'button', text: Str.now, handler() {
          win.firstItem.fireEvent('selectdate', new Date());
        }
      }, '->']);
    win.show();
    win.down(c => c.isView)?.focus(true);
    return win;
  },
  /**
   * 显示时间选择对话框，并获取选择的日期值。详见{#Wb.promptDate}。
   */
  promptTime(callback, date, title, isDrawer, type) {
    return Wb.promptDate(callback, date, title, isDrawer, 'time');
  },
  /**
   * 显示日期时间选择对话框，并获取选择的日期值。详见{#Wb.promptDate}。
   */
  promptDateTime(callback, date, title, isDrawer, type) {
    return Wb.promptDate(callback, date, title, isDrawer, 'datetime');
  },
  /**
   * 显示年月选择对话框，并获取选择的日期值。详见{#Wb.promptDate}。
   */
  promptMonth(callback, date, title, isDrawer, type) {
    return Wb.promptDate(callback, date, title, isDrawer, 'month');
  },
  /**
   * 显示带多行文本编辑器的对话框，并在点击确定按钮后执行回调方法。
   * @param {String/Object} [title] 对话框标题或窗口配置对象。
   * @param {Function} [handler] 点击确定按钮后执行的回调方法。
   * @param {String} .text 编辑的文本。
   * @param {Wb.Window} .win 窗口对象。
   * @param {String} [value] 编辑的文本。
   * @return {Wb.Window} 对话框窗口。
   */
  promptText(title, handler, value) {
    let win, configs = { layout: 'fit', height: '30em', width: '60em', icon: 'edit' };

    if (Wb.isObject(title))
      Wb.apply(configs, title);
    else
      configs.title = title ?? Str.edit;
    win = Wb.prompt(configs, { cname: 'textArea', cid: 'textEditor', value }, (values, win) => {
      handler?.(values.textEditor, win);
    }, 'wb.textDialog');
    win.down('textEditor').value = value ?? '';
    return win;
  },
  /**
   * 显示带单行文本编辑器的对话框，并在点击确定按钮后执行回调方法。
   * @param {String/Object} [title] 对话框标题或窗口配置对象。
   * @param {Function} [handler] 点击确定按钮后执行的回调方法。
   * @param {String} .text 编辑的文本。
   * @param {Wb.Window} .win 窗口对象。
   * @param {String} [value] 编辑的文本。
   * @return {Wb.Window} 对话框窗口。
   */
  promptString(title, handler, value) {
    let win, configs = { width: '60em', icon: 'edit' };

    if (Wb.isObject(title))
      Wb.apply(configs, title);
    else
      configs.title = title ?? Str.edit;
    win = Wb.prompt(configs, { cname: 'text', cid: 'textEditor', value }, (values, win) => {
      handler?.(values.textEditor, win);
    }, 'wb.stringDialog');
    win.down('textEditor').value = value ?? '';
    return win;
  },
  /**
   * 显示带JavaScript脚本编辑器的对话框，并在点击确定按钮后执行回调方法。该方法仅在加载monaco类库后有效。
   * @param {String/Object} [title] 对话框标题或窗口配置对象。
   * @param {Function} [handler] 点击确定按钮后执行的回调方法。
   * @param {String} .value 编辑的脚本。
   * @param {Wb.Window} .win 窗口对象。
   * @param {String} [value] 编辑的脚本。
   * @return {Wb.Window} 对话框窗口。
   */
  promptJs(title, handler, value) {
    let win, configs = { layout: 'fit', height: '40em', width: '80em', icon: 'file-js' };

    if (Wb.isObject(title))
      Wb.apply(configs, title);
    else
      configs.title = title ?? Str.edit;
    win = Wb.prompt(configs, [{ cname: 'codeEditor', cid: 'jsEditor', value }], (values, win) => {
      handler?.(values.jsEditor, win);
    }, 'wb.jsDialog');
    win.down('jsEditor').value = value ?? '';
    return win;
  },
  /**
   * 根据按钮实例列表创建对应的菜单。
   * Example:
   *
   *     Wb.createMenu([btn1, null, btn2]);
   *
   * @param {Wb.Button[]} btns 按钮实例列表。列表元素中，如果值为null将生成分割线。
   * @param {Boolean} [autoDestroy] 当owner销毁时菜单是否自动销毁。默认为true。
   * @return {Wb.Menu} 菜单。
   */
  createMenu(btns, autoDestroy) {
    let menu, configs, text, items = [];

    btns.forEach(item => {
      if (item instanceof Wb.Divider || item instanceof Wb.Space || item instanceof Wb.Fill || !item) {
        if (item?.visible && items.lastItem != '-')
          items.push('-');
      } else if (item instanceof Wb.Button) {
        configs = { refBtn: item };
        if (item.html)
          configs.html = item.html;
        if (item.icon)
          configs.icon = item.icon;
        if (item.img)
          configs.img = item.img;
        text = item.menuText || item.text;
        if (text)
          configs.text = text;
        text = item.keys ?? btns.keysText;
        if (text)
          configs.keysText = text;
        items.push(configs);
      }
    });
    autoDestroy ??= true;
    menu = new Wb.Menu({
      autoDestroy, items, ignoreInputMenu: true, events: {
        menuclick(item, e) {
          item.refBtn.fireEvent('click', e);
        },
        beforeshow() {
          this.each(item => {
            let btn = item.refBtn;
            if (btn) {
              item.disabled = btn.disabled;
              item.visible = btn.visible;
            }
          });
        }
      }
    });
    return menu;
  },
  /**
   * 在应用内通过配置对象创建对象实例。该方法同{#Wb.create}方法的区别为能把组件自动添加到上下文容器中。
   * @param {Object} app 模块app对象。
   * @param {Object/Array} item 组件或其列表。
   */
  make(app, item) {
    if (Wb.isArray(item)) {
      item.forEach(item => Wb.make(app, item));
    } else {
      item.app = app;
      if (item.instanced ?? true) {
        let ct = app.parentContainer;
        if (item.cname == 'window') {
          //顶层窗口会渲染到BodyEl，需要关联owner以自动关闭
          if (ct)
            item.owner ??= ct;
          new Wb.Window(item);
        } else {
          item = Wb.create(item);
          if (item instanceof Wb.Component) {
            if (ct) {
              //添加到容器
              ct.add(item);
            } else {
              //渲染到BodyEl
              item.renderEl ??= BodyEl;
            }
          }
        }
      } else {
        app[item.cid] = item;
      }
    }
  },
  /**
   * 停止关闭或重新加载窗口。在窗口的beforeunload事件中调用该方法可停止关闭或重新加载窗口。
   * @param {Event} e 事件对象。
   */
  stopLoad(e) {
    e.preventDefault();
    e.returnValue = '';
    Wb.unloading = false;
  },
  /**
   * 在当前窗口生成一个正增长的数字序号。该id仅在当前页面内唯一。
   * @return {Number} 当前页面内唯一的数字。
   */
  getId() {
    return 'x' + Wb.currentId++;
  },
  /**
   * 播放音频。
   * @param {String} url 音频源。
   * @param {Boolean} [newAudio] 是否创建新的音频。默认为false，即中断原音频的播放。当
   * @param {Boolean} [loop] 是否循环播放。
   * @return {Audio} 音频对象。调用该对象的{{pause()}}方法可暂停播放。共享的音频暂停播放可使用{{Globals.audio?.pause()}}方法。
   */
  playAudio(url, newAudio, loop) {
    let audio;

    if (newAudio) {
      audio = new Audio(url);
    } else {
      audio = Globals.audio ??= new Audio(url);
      audio.pause();
      audio.currentTime = 0;
      if (audio.src != url)
        audio.src = url;
    }
    audio.loop = !!loop;
    audio.play();
    return audio;
  },
  /**
   * 设置卡片的状态为被更改，设置被更改状态将在卡片的标题前加“*”符，并添加isModified属性为true。
   * @param {Wb.Card} card Tab卡片。
   */
  setModified(card) {
    if (!card.isModified) {
      card.isModified = true;
      if (!card.title.startsWith('*'))
        card.title = '*' + card.title;
    }
  },
  /**
   * 设置卡片的状态为未更改，设置未更改状态将移除卡片的标题前置“*”符，并设置isModified属性为false。
   * @param {Wb.Card} card Tab卡片。
   */
  unModified(card) {
    if (card.isModified) {
      card.isModified = false;
      card.title = card.title.substr(1);
    }
  },
  /**
   * 打开文件对话框选择单个文件。
   * Example:
   *
   *     Wb.selectFile(file => Wb.tip(file.name), 'image/*');
   *
   * @param {Function} callback 选择文件后的回调函数。
   * @param {File/File[]} .files 选择的文件或文件列表。
   * @param {String} [accept] 文件类型。如".xls, .xlsx'。
   * @param {Boolean} [multiple] 是否允许多选。
   */
  selectFile(callback, accept, multiple) {
    let input = Globals.fileInput ??= new Wb.FileInput({
      visible: false,
      events: {
        change(files) {
          this.changeHandlerFn?.call(this, files);
        }
      }
    });
    input.multiple = multiple;
    input.accept = accept;
    input.changeHandlerFn = null;
    input.clear();
    input.changeHandlerFn = callback;
    input.openDialog();
  },
  /**
   * 打开文件对话框选择多个文件。
   * Example:
   *
   *     Wb.selectFiles(files => Wb.tip(Wb.encode(files)), 'image/*');
   *
   * @param {Function} callback 选择文件后的回调函数。
   * @param {File[]} .files 选择的文件列表。
   * @param {String} [accept] 文件类型。
   */
  selectFiles(callback, accept) {
    Wb.selectFile(callback, accept, true);
  },
  /**
   * 打开服务器端的文件对话框选择单个文件。如果当前用户无权限访问文件系统相关模块时将抛出异常。
   * Example:
   *
   *     Wb.promptFile((file, win) => { Wb.tip(file); win.close(); } );
   *     Wb.promptFile((file, win) => { Wb.tip(file); win.close(); }, '|wb/modules', '.xwl');
   *
   * @param {Function/Object} callback 选择文件后的回调函数。this指向window。如果为Object表示配置对象。
   * @param {String/String[]} .files 选择的文件或文件列表。
   * @param {Wb.Window} .win 文件窗口对话框。
   * @param {String/String[]} .relFiles 选择的文件或文件相对路径列表。
   * @param {String} [rootPath] 根目录。以"|"开头的目录表示基于应用目录，如"|wb/modules"。
   * @param {String} [accept] 文件扩展名，多个扩展名以“,"分隔。
   * @param {String} [title] 窗口标题。
   * @param {Boolean} [multiple] 是否允许多选。
   * @param {String} [getUrl] 文件浏览器获取文件时使用的URL。
   */
  promptFile(callback, rootPath, accept, title, multiple, getUrl) {
    let win = Globals.fileWin, doInit;

    if (Wb.isObject(callback)) {
      rootPath ??= callback.rootPath;
      accept ??= callback.accept;
      title ??= callback.title;
      multiple ??= callback.multiple;
      getUrl ??= callback.getUrl;
      callback = callback.callback;
    }
    rootPath ??= '';
    accept ??= '';
    doInit = f => {
      let fileApp = win.fileApp, pathSelect = fileApp.pathSelect, pathData = pathSelect.data.pluck('text'),
        pathList = fileApp.params.pathList;
      title ??= Str.selectFile;
      win.title = title;
      win.icon = 'file-admin';
      win.filenameSelect.value = '';
      win.okHandler = f => {
        let names = win.filenameSelect.value;
        if (!names) {
          Wb.tipSelect();
          return;
        }
        let files = [], relFiles = [], filePath = fileApp.filePath, relPath = fileApp.fileTree.selection.path;

        if (relPath.includes('/'))
          relPath = relPath.slice(relPath.indexOf('/') + 1) + '/';
        else
          relPath = '';
        names.splitTrim('|').forEach(name => {
          files.push(filePath + name);
          relFiles.push(relPath + name);
        });
        if (!multiple) {
          files = files[0];
          relFiles = relFiles[0];
        }
        callback?.call(win, files, win, relFiles);
      };
      fileApp.fileGrid.multiSelect = multiple;
      fileApp.fileTree.url = (getUrl || fileApp.getFileUrl) + '&type=tree';
      fileApp.fileGrid.url = (getUrl || fileApp.getFileUrl) + '&type=file';
      fileApp.extNames = accept;
      if (fileApp.rawPath != rootPath || !fileApp.fileTree.loaded) {
        pathSelect.data = rootPath ? pathData.diff(pathList) : pathData.unique(pathList);
        fileApp.rawPath = rootPath;
        fileApp.fileTree.load({
          success() {
            win.show();
          }
        });
      } else {
        fileApp.fileGrid.reload({ success() { win.show(); } });
      }
    };
    if (win) {
      doInit();
    } else {
      Wb.run({
        url: 'file-browser', params: { dialog: 1 }, success(scope) {
          win = Globals.fileWin = new Wb.Window({
            layout: 'fit', width: '80em', height: '40em', dialog: true, syncSelFiles() {
              win.filenameSelect.value = this.selectionsData.pluck('text').join(' | ');
            }
          });
          scope.setOwnerComp(win);
          win.filenameSelect = win.buttonsBar.insert(0, {
            cname: 'select', text: Str.name, flex: 1, margin: '0 2em', events: {
              beforequery(value) {
                let me = this;
                if (value === '') {
                  me.collapse();
                } else {
                  let fileApp = win.fileApp, data = [], text;
                  value ??= '';
                  fileApp.fileGrid.each(item => {
                    text = item.data.text;
                    if (text.includes(value)) {
                      data.push(text);
                    }
                  });
                  me.data = data;
                  me.localQuery();
                }
                return false;
              }
            }
          });
          win.add(win.add(scope.viewport1));
          win.fileApp = scope;
          scope.fileGrid.on({ selectionchange: win.syncSelFiles, itemclick: win.syncSelFiles });
          scope.onGridDblClick = f => win.okHandler();
          doInit();
        }
      });
    }
  },
  /**
   * 打开服务器端的文件对话框选择多个文件。详见{#Wb.promptFile}方法说明。
   * Example:
   *
   *     Wb.promptFiles((files, win) => { Wb.tip(Wb.encode(files)); win.close(); }, '|wb/modules', '.xwl');
   */
  promptFiles(callback, rootPath, accept, title, getUrl) {
    Wb.promptFile(callback, rootPath, accept, title, true, getUrl);
  },
  /**
   * 查找指定语言列表中最接近用户指定的语言，如果未找到返回undefined。
   * @param {String[]} langList 语言列表。
   * @return {String} 找到的语言或undefined。
   */
  findLang(langList) {
    let pos, lang = Str.lang;
    if (langList.includes(lang))
      return lang;
    pos = lang.indexOf('-');
    if (pos != -1) {
      lang = lang.substr(0, pos);
      if (langList.includes(lang))
        return lang;
    }
    return undefined;
  },
  /**
   * 显示信息对话框。
   * @param {String} msg 信息。
   * @param {Function} [callback] 对话框关闭后的回调方法。this指向窗口。
   * @param {Boolean} [htmlMsg] 信息是否为html格式，false纯文本格式，true html格式。
   * @return {Wb.Window} 显示的窗口。
   */
  info(msg, callback, htmlMsg) {
    return Wb.Window.showMessage({
      title: Str.info, [htmlMsg ? 'html' : 'text']: msg, icon: 'info', name: 'sys.dialog',
      buttons: [{ text: Str.ok, cid: 'ok' }], callback() {
        this.close();
        callback?.call(this);
      }
    });
  },
  /**
   * 显示成功对话框。
   * @param {String} msg 信息。
   * @param {Function} [callback] 对话框关闭后的回调方法。this指向窗口。
   * @param {Boolean} [htmlMsg] 信息是否为html格式，false纯文本格式，true html格式。
   * @return {Wb.Window} 显示的窗口。
   */
  succ(msg, callback, htmlMsg) {
    return Wb.Window.showMessage({
      title: Str.info, [htmlMsg ? 'html' : 'text']: msg, icon: 'succ', name: 'sys.dialog',
      buttons: [{ text: Str.ok, cid: 'ok' }], callback() {
        this.close();
        callback?.call(this);
      }
    });
  },
  /**
   * 显示警告对话框。
   * @param {String} msg 信息。
   * @param {Function} [callback] 对话框关闭后的回调方法。this指向窗口。
   * @param {Boolean} [htmlMsg] 信息是否为html格式，false纯文本格式，true html格式。
   * @return {Wb.Window} 显示的窗口。
   */
  warn(msg, callback, htmlMsg) {
    return Wb.Window.showMessage({
      title: Str.warn, [htmlMsg ? 'html' : 'text']: msg, icon: 'warn', name: 'sys.dialog',
      buttons: [{ text: Str.ok, cid: 'ok' }], callback() {
        this.close();
        callback?.call(this);
      }
    });
  },
  /**
   * 显示错误对话框。
   * @param {String} msg 信息。
   * @param {Function} [callback] 对话框关闭后的回调方法。this指向窗口。
   * @param {Boolean} [htmlMsg] 信息是否为html格式，false纯文本格式，true html格式。
   * @return {Wb.Window} 显示的窗口。
   */
  error(msg, callback, htmlMsg) {
    return Wb.Window.showMessage({
      title: Str.error, [htmlMsg ? 'html' : 'text']: msg, icon: 'error', name: 'sys.dialog',
      buttons: [{ text: Str.ok, cid: 'ok' }], callback() {
        this.close();
        callback?.call(this);
      }
    });
  },
  /**
   * 显示包含确定和取消两个按钮的确认对话框。
   * Example:
   *
   *     Wb.confirm('确定要删除吗？', f => doSomething());
   *
   * @param {String} msg 信息。
   * @param {Function} [onOk] 点击确定后执行的方法。this指向窗口。
   * @param {Function} [onCancel] 点击取消后执行的方法。this指向窗口。
   * @param {Boolean} [htmlMsg] 信息是否为html格式，false纯文本格式，true html格式。
   * @return {Wb.Window} 显示的窗口。
   */
  confirm(msg, onOk, onCancel, htmlMsg) {
    return Wb.Window.showMessage({
      title: Str.confirm, [htmlMsg ? 'html' : 'text']: msg, icon: 'help1', name: 'sys.dialog',
      buttons: [{ text: Str.ok, cid: 'ok', type: 'primary' },
      { text: Str.cancel, cid: 'cancel' }], callback(btn) {
        this.close();
        (btn == 'ok' ? onOk : onCancel)?.call(this);
      }
    });
  },
  /**
   * 显示包含是、否和取消三个按钮的确认对话框。
   * Example:
   *
   *     Wb.choose('确定要保存吗？', button => Wb.info(button));
   *
   * @param {String} msg 信息。
   * @param {Function} [callback] 对话框关闭后的回调方法。this指向窗口。
   * @param {Function} [callback.button] 点击按钮的cid，可能值为'yes', 'no', 'cancel'。
   * @param {Boolean} [htmlMsg] 信息是否为html格式，false纯文本格式，true html格式。
   * @return {Wb.Window} 显示的窗口。
   */
  choose(msg, callback, htmlMsg) {
    return Wb.Window.showMessage({
      title: Str.confirm, [htmlMsg ? 'html' : 'text']: msg, icon: 'help1', name: 'sys.dialog',
      buttons: [{ text: Str.yes, cid: 'yes', type: 'primary' }, { text: Str.no, cid: 'no' },
      { text: Str.cancel, cid: 'cancel' }], callback(btn) {
        this.close();
        callback?.call(this, btn);
      }
    });
  },
  /**
   * 在指定坐标位置显示浮动提示信息。系统会自动在指定位置加上提示对象的偏移量。
   * @param {String/Object/Wb.Tip} msg 提示的信息内容、配置对象或提示实例。
   * @param {Number} x x坐标。
   * @param {Number} y y坐标。
   * @param {Boolean} [isHtml] msg为字符串时是否为html格式。
   * @return {Wb.Tooltip} 提示对象。
   */
  tipAt(msg, x, y, isHtml) {
    let tip = Wb.Tooltip.toTip(msg, isHtml);
    tip.showAt(x + tip.defaultOffset[0], y + tip.defaultOffset[1]);
    tip.hideTip.delay(tip, tip.dismissDelay);
    return tip;
  },
  /**
   * 自窗口顶部显示普通信息。
   * @param {String} msg 信息。
   * @param {Boolean} [htmlMsg] 信息是否为html格式，false纯文本格式，true html格式。
   * @param {Function} [callback] 点击消息文字链接后执行的回调方法。
   * @return {Wb.Container} 提示容器。
   */
  tip(msg, htmlMsg, callback) {
    return Wb.Window.showTip({
      [htmlMsg ? 'html' : 'text']: msg, icon: 'info', callback
    });
  },
  /**
   * 自窗口顶部显示普通信息。{#tip}方法的别名。
   */
  tipInfo(msg, htmlMsg, callback) {
    return Wb.tip(msg, htmlMsg, callback);
  },
  /**
   * 自窗口顶部显示成功信息。
   * @param {String} msg 信息。
   * @param {Boolean} [htmlMsg] 信息是否为html格式，false纯文本格式，true html格式。
   * @param {Function} [callback] 点击消息文字链接后执行的回调方法。
   * @return {Wb.Container} 提示容器。
   */
  tipSucc(msg, htmlMsg, callback) {
    return Wb.Window.showTip({
      [htmlMsg ? 'html' : 'text']: msg, icon: 'succ', callback
    });
  },
  /**
   * 自窗口顶部显示警告信息。
   * @param {String} msg 信息。
   * @param {Boolean} [htmlMsg] 信息是否为html格式，false纯文本格式，true html格式。
   * @param {Function} [callback] 点击消息文字链接后执行的回调方法。
   * @return {Wb.Container} 提示容器。
   */
  tipWarn(msg, htmlMsg, callback) {
    return Wb.Window.showTip({
      [htmlMsg ? 'html' : 'text']: msg, icon: 'warn', callback
    });
  },
  /**
   * 自窗口顶部显示错误信息。
   * @param {String} msg 信息。
   * @param {Boolean} [htmlMsg] 信息是否为html格式，false纯文本格式，true html格式。
   * @param {Function} [callback] 点击消息文字链接后执行的回调方法。
   * @return {Wb.Container} 提示容器。
   */
  tipError(msg, htmlMsg, callback) {
    return Wb.Window.showTip({
      [htmlMsg ? 'html' : 'text']: msg, icon: 'error', callback
    });
  },
  /**
   * 在窗口中间显示普通提示。
   * @param {String} msg 提示。
   * @param {Boolean} [htmlMsg] 信息是否为html格式，false纯文本格式，true html格式。
   * @param {Function} [callback] 点击消息文字链接后执行的回调方法。
   * @return {Wb.Container} 提示容器。
   */
  toast(msg, htmlMsg, callback) {
    return Wb.Window.showTip({
      [htmlMsg ? 'html' : 'text']: msg, icon: 'info', toast: true, callback
    });
  },
  /**
   * 在窗口中间显示成功提示。
   * @param {String} msg 提示。
   * @param {Boolean} [htmlMsg] 信息是否为html格式，false纯文本格式，true html格式。
   * @param {Function} [callback] 点击消息文字链接后执行的回调方法。
   * @return {Wb.Container} 提示容器。
   */
  toastSucc(msg, htmlMsg, callback) {
    return Wb.Window.showTip({
      [htmlMsg ? 'html' : 'text']: msg, icon: 'succ', toast: true, callback
    });
  },
  /**
   * 在窗口中间显示警告提示。
   * @param {String} msg 提示。
   * @param {Boolean} [htmlMsg] 信息是否为html格式，false纯文本格式，true html格式。
   * @param {Function} [callback] 点击消息文字链接后执行的回调方法。
   * @return {Wb.Container} 提示容器。
   */
  toastWarn(msg, htmlMsg, callback) {
    return Wb.Window.showTip({
      [htmlMsg ? 'html' : 'text']: msg, icon: 'warn', toast: true, callback
    });
  },
  /**
   * 在窗口中间显示错误提示。
   * @param {String} msg 提示。
   * @param {Boolean} [htmlMsg] 信息是否为html格式，false纯文本格式，true html格式。
   * @param {Function} [callback] 点击消息文字链接后执行的回调方法。
   * @return {Wb.Container} 提示容器。
   */
  toastError(msg, htmlMsg, callback) {
    return Wb.Window.showTip({
      [htmlMsg ? 'html' : 'text']: msg, icon: 'error', toast: true, callback
    });
  },
  /**
   * 根据当前语言环境，显示"请选择一个有效的条目。"的提示。
   * @param {String} [key] 关键字。默认为缺省。
   * @return {Wb.Container} 提示容器。
   */
  tipSelect(key) {
    if (key)
      return Wb.tipWarn(Str.concat.format(key, Str.selectItem));
    else
      return Wb.tipWarn(Str.selectItem);
  },
  /**
   * 根据当前语言环境，显示"任务已经成功完成。"的提示。
   * @param {String} [key] 关键字。默认为缺省。
   * @return {Wb.Container} 提示容器。
   */
  tipDone(key) {
    if (key)
      return Wb.tipSucc(Str.concat.format(key, Str.done));
    else
      return Wb.tipSucc(Str.done);
  },
  /**
   * 在指定面板中创建登录对话框。
   * @param {Wb.Panel} panel 面板。
   * @param {Function} callback 登录成功后的回调方法。
   * @param {Boolean} winMode 是否窗口模式。
   * @param {Boolean} verifyCode 是否显示验证码。
   * @return {Wb.Container} 登录表单容器。
   */
  createLoginPanel(panel, callback, winMode, verifyCode) {
    const storeName = 'wb.username';
    let items = [], username = Wb.getStorage(storeName);

    if (!winMode)
      items.push({
        value: Str.login, icon: 'lock', cname: 'displayField', textAlign: 'center', cls: 'w-login-title'
      });
    items.push({
      placeholder: Str.username, cid: 'username', icon: 'user', required: true, value: username,
      autocomplete: 'username'
    }, {
      placeholder: Str.password, cid: 'password', icon: 'lock', required: true, password: true, eyeButton: true,
      autocomplete: username ? null : undefined
    });
    if (verifyCode) {
      items.push({
        cname: 'trigger', placeholder: Str.verificationCode, cid: 'verifyCode', icon: 'label', required: true,
        flex: 1, triggerIcon: 'refresh', trigger: {
          tip: Str.refresh, handler() {
            let image = this.parent.downWhole('verifyImage');
            image.src = image.src.beforeItem('&') + '&' + Wb.getId();
          }
        }, events: {
          ready() {
            this.addFooter({
              cname: 'image', cid: 'verifyImage', alignSelf: 'stretch', src: 'm?xwl=sys/session/service&xaction=captcha&fontSize=' +
                Wb.configs.fontSize + '&' + Wb.getId(), weight: 10, width: '8em', cls: 'w-pointer', events: {
                  click() {
                    this.parent.trigger.handler();
                  }
                }
            }, this.wrapEl);
          }
        }
      });
    }
    items.push({
      suffix: Str.saveUsername, cid: 'saveUsername', cname: 'toggle', value: !!username, events: {
        change(value) {
          if (!value)
            Wb.removeStorage(storeName);
        }
      }
    });
    Wb.apply(panel, {
      cls: 'w-login',
      layout: 'fit',
      width: '28em',
      style: winMode ? undefined : 'border-radius:.5em;',
      buttonAlign: 'center',
      minButtonWidth: '7em',
      setLoginFocus() {
        let me = this, userText = me.username;
        if (userText.value)
          me.password.focus(false, true);
        else
          userText.focus(false, true);
      },
      buttons: [{
        text: Str.login, cid: 'loginButton', type: 'primary', handler() {
          if (!Wb.verify(panel))
            return;
          let params = Wb.getValue(panel);
          if (panel.saveUsername.value)
            Wb.setStorage(storeName, params.username);
          Wb.ajax({
            url: 'verify',
            params,
            json: true,
            success(resp) {
              Wb.Socket.openAll();
              panel.fireEvent('loginsuccess', ...resp);
              callback?.();
            },
            failure(resp) {
              if (resp == Str.invalidUserPwd)
                Wb.error(resp, f => panel.down('password').focus(false, true));
              else if (resp == Str.invalidVerifyCode) {
                Wb.error(resp, f => {
                  let text = panel.down('verifyCode');

                  text.focus(false, true);
                  text.trigger.handler();
                });
              }
            }
          });
        }
      }, {
        text: Str.reset, cid: 'resetButton', handler() {
          Wb.clear([panel.password, panel.username]);
          panel.username.focus();
        }
      }],
      items: {
        tagName: 'FORM',
        layout: 'grid1',
        defaults: {
          cname: 'text'
        },
        items
      },
      listeners: {
        keydown(e) {
          if (e.isGoKey)
            panel.loginButton.fireEvent('click', e);
        }
      }
    });
    panel.applyRefer();
    return panel.firstItem;
  },
  /**
   * 显示登录对话框。
   * @param {Function} [callback] 登录成功后的回调函数。
   * @param {String} .username 用户名称。
   * @return {Wb.Window} 登录窗口。
   */
  login(callback) {
    let win = Globals.loginWin;

    if (win) {
      if (callback)
        win.on('loginsuccess', callback);
      return win;
    }
    win = Globals.loginWin = new Wb.Window({
      closeAction: 'destroy',
      title: Str.login,
      icon: 'lock',
      modal: true,
      closable: null,
      cls: 'w-limit-width',
      maximizable: null,
      events: {
        destroy() {
          Globals.loginWin = undefined;
        }
      }
    });
    Wb.createLoginPanel(win, f => win.close(), true, DocEl.getAttribute('verifycode'));
    if (callback)
      win.on('loginsuccess', callback);
    win.show();
    win.setLoginFocus();
    return win;
  },
  /**
   * 根据指定的模块路径表达式获取模块相对路径.
   * @param {String} path 模块路径表达式。
   * @param {String} [base] 当前路径。
   * @return {String} 模块相对路径。
   */
  getModulePath(path, base) {
    if (!path)
      return path;
    if (path.startsWith('/'))
      path = path.substring(1);
    if (path.startsWith('m?xwl='))
      path = path.substring(6) + '.xwl';
    if (!path.endsWith('.xwl'))
      path += '.xwl';
    if (path.contains('./')) {
      if (path.startsWith('./') || path.startsWith('../'))
        path = (base || '') + path;
      path = Wb.normalizePath(path);
      if (path.startsWith('wb/modules/'))
        path = path.substring(11);
    }
    return path;
  },
  /**
   * 创建一个新的元素。
   * Example: 
   * 
   *     el = Wb.createEl('my-class'); //创建class为my-class的div元素
   *     el = Wb.createEl('cls1 cls2', 'span'); //创建class为cls1 cls2的span元素
   * 
   * @param {String} className 新创建元素的类名。
   * @param {String} [tagName] 新创建元素的标签名，默认为'div'。
   * @return {Element} 新创建的元素。
   */
  createEl(className, tagName) {
    let el = document.createElement(tagName || 'div');
    if (className)
      el.className = className;
    return el;
  },
  /**
   * html转换为组件配置对象。
   * @param {String} html html脚本。
   * @return {Object} 组件配置对象。
   */
  textToComp(html) {
    switch (html) {
      case ' ':
        return {
          cname: 'space'
        };
      case '->':
        return {
          cname: 'fill'
        };
      case '--':
        return {
          cname: 'line'
        };
      case '-':
      case '|':
        return {
          cname: 'divider'
        };
      case '||':
        return {
          cname: 'splitter'
        };
      case '=':
        return {
          cname: 'gap'
        };
      default:
        return {
          cname: 'component',
          html: html
        };
    }
  },
  /**
   * 对指定组件或元素添加遮盖，并显示正在加载中的动画效果。多次调用该方法会被叠加，不同的提示文本也将层叠显示。
   * 隐藏遮盖请使用{#unmask}方法。
   * Example: 
   * 
   *     Wb.mask(); //显示默认全局遮盖
   *     Wb.mask('保存中...'); //显示指定提示信息的全局遮盖
   *     Wb.mask({text: '保存中...', target: grid1}); //在grid1上显示遮盖，并显示正在保存中的提示
   *     Wb.mask({modal: false}); //显示非模态带背景框提示信息的遮盖
   * 
   * @param {Object/String} [configs] 遮盖的配置项或遮盖的提示文本: 
   * @param {Object} [configs.text] 在遮盖上显示的提示文本。默认为Str.processing。空字符串表示不显示。
   * @param {Component/Element} [configs.target] 遮盖的组件或元素。默认为body。
   * @param {Boolean} [configs.animate] 是否显示提示动画，默认为true。
   * @param {Boolean} [configs.top] 是否为顶层遮盖。null表示自动判断，基于body时使用顶层遮盖，其它使用普通遮盖。
   * @param {Boolean} [configs.frame] 是否显示背景框。默认为true。
   * @param {Boolean} [configs.modal] 是否显示模态遮盖，默认为true。
   * @param {Number} [configs.delay] 延时指定时间显示遮盖，避免频繁切换显示引起闪烁。\
   * 单位为毫秒，默认为{#Wb.configs}.maskDelay。
   * @param {Number/String} [configs.width] 标签显示的宽度。如果为数值单位为px。
   * @param {Number/String} [configs.minWidth] 标签显示的最小宽度。如果为数值单位为px。
   * @param {Number/String} [configs.maxWidth] 标签显示的最大宽度。如果为数值单位为px。
   * @param {Function} [configs.cancel] 指定该值将显示取消按钮，点击该按钮将执行该回调方法。
   * @return {Object} 遮盖对象，可用于使用{#progress}或{#unmask}方法。
   */
  mask(configs) {
    let mask, text, target, targetEl, addLabel, modal, frame;

    //mask结构{maskEl, textList: [], labelEls: {text: el}, timeout, timer}
    if (Wb.isString(configs))
      configs = {
        text: configs
      };
    else
      configs ??= {};
    text = configs.text ?? Str.processing;
    target = configs.target;
    targetEl = target?.el ?? target ?? BodyEl;
    mask = targetEl.maskComp;
    addLabel = (text, configs) => {
      let labelEl = mask.labelEls[text];
      if (!labelEl) {
        labelEl = mask.labelEls[text] = mask.wrapEl.insertEl(0, 'w-mask-label');
        labelEl.textEl = labelEl.addTag();
        labelEl.textEl.textContent = mask.infoList?.[text] ?? text;
        if (configs.width != null)
          labelEl.width = configs.width;
        if (configs.minWidth != null)
          labelEl.setStyle('min-width', Wb.px(configs.minWidth));
        if (configs.maxWidth != null)
          labelEl.setStyle('max-width', Wb.px(configs.maxWidth));
        //如果设置了进度则更新进度条
        if (mask.progressList?.[text] != null)
          Wb.progress(mask.progressList[text], { text: text, target: targetEl });
      }
      if (configs.cancel) {
        if (!mask.cancelFn) {
          let btn;
          mask.cancelFn = [];
          btn = mask.wrapEl.addEl('w-mask-cancel w-btn w-btn-primary');
          btn.textContent = Str.cancel;
          btn.onclick = f => {
            btn.onclick = null;
            btn.cls = 'w-disabled';
            mask.cancelFn.forEach(fn => fn());
          };
        }
        mask.cancelFn.push(configs.cancel);
      }
    };
    if (mask) {
      mask.textList.push(text);
      mask.configsList.push(configs);
      //如果已经渲染直接添加label
      if (mask.labelEls)
        addLabel(text, configs);
    } else {
      mask = targetEl.maskComp = {};
      mask.textList = [text];
      mask.configsList = [configs];
      modal = configs.modal ?? true;
      frame = configs.frame ?? true;
      mask.maskEl = targetEl.addEl('w-mask' + (modal ? '' : ' w-pass') +
        ((configs.top || configs.top == null && targetEl == BodyEl) ? ' w-mask-zindex' : ''));
      if (targetEl == BodyEl && modal)
        BodyEl.addEventListener('keydown', Event.interceptSpreadIf, true);
      mask.timeout = setTimeout(f => {
        let i, wrapEl, colorStr = '89ABCDEF', iconWrapEl, setBg, color, iconDivs = [];
        setBg = f => {
          iconDivs.forEach(div => {
            color = '#';
            for (i = 0; i < 6; i++) {
              color += colorStr[Wb.random(8)];
            }
            div.setStyle('background', color);
          });
        };
        //添加相对于父元素的位置
        if (!Wb.posItems.includes(targetEl.computeStyle().position))
          targetEl.addCls('w-mask-parent');
        mask.maskEl.cls = 'w-center ' + (modal ? 'w-mask-modal' : 'w-mask-normal');
        mask.wrapEl = wrapEl = mask.maskEl.addEl('w-mask-wrap' +
          (frame ? ' w-mask-frame' : ''));
        mask.labelEls = {};
        mask.textList.each((text, i) => addLabel(text, mask.configsList[i]), true, true);
        if (configs.animate ?? true) {
          if (mask.cancelFn)
            iconWrapEl = wrapEl.insertElBefore('w-loading-icon w-row', 'div', wrapEl.lastElementChild);
          else
            iconWrapEl = wrapEl.addEl('w-loading-icon w-row');
          for (i = 0; i < 5; i++) {
            iconDivs.push(iconWrapEl.addEl());
          }
          setBg();
          mask.timer = setInterval(setBg, 2000);
        }
      }, configs.delay ?? Wb.configs.maskDelay);
    }
    return { text: text, target: targetEl };
  },
  /**
   * 隐藏使用{#mask}方法添加的对元素的遮盖。只有当所有被添加的遮盖隐藏后，遮盖才会被真正移除。
   * Example: 
   * 
   *     Wb.unmask(); //隐藏默认全局遮盖
   *     Wb.unmask('保存中...'); //隐藏特定提示信息的全局遮盖
   *     Wb.unmask({text: '保存中...', target: grid1}); //隐藏在grid1上显示指定信息的遮盖
   *     let mask = Wb.mask({target: grid1});
   *     Wb.unmask(mask); //隐藏指定的遮盖
   * 
   * @param {Object/String} [configs] 遮盖的配置项或提示文本，通常为使用{#mask}方法返回的对象。
   * @param {Object} [configs.text] 在遮盖上显示的提示文本。默认为Str.processing。
   * @param {Component/Element} [configs.target] 遮盖的组件或元素。默认为body。
   */
  unmask(configs) {
    let labelEl, labelEls, mask, text, textList, target, targetEl;

    if (Wb.isString(configs))
      configs = {
        text: configs
      };
    else
      configs ??= {};
    target = configs.target;
    targetEl = target?.el ?? target ?? BodyEl;
    mask = targetEl.maskComp;
    if (!mask) return;
    text = configs.text ?? Str.processing;
    textList = mask.textList;
    if (textList.remove(text)) {
      if (textList.length) {
        //仍有内容删除标签
        labelEls = mask.labelEls;
        if (labelEls) {
          //如果多个text中的任意一个均不存在，移除text对应的label元素
          if (!textList.includes(text)) {
            labelEl = labelEls[text];
            if (labelEl) {
              labelEl.remove();
              delete labelEls[text];
            }
          }
        }
      } else {
        clearTimeout(mask.timeout);
        //无内容时删除全部
        clearInterval(mask.timer);
        mask.maskEl.remove();
        if (targetEl == BodyEl)
          BodyEl.removeEventListener('keydown', Event.interceptSpreadIf, true);
        targetEl.removeCls('w-mask-parent');
        delete targetEl.maskComp;
      }
    }
  },
  /**
   * 对指定组件或元素添加遮盖，并显示和更新进度条位置或显示标签的文本。该方法将默认设置标签宽度并添加背景框。\
   * 隐藏进度条请使用{#unmask}方法。详见{#mask}方法。
   * Example: 
   * 
   *     Wb.progress(60); //更新默认mask的进度条位置于60%处
   *     Wb.progress(80.5, '正在保存中...'); //更新指定mask的进度条位置于80.5%处
   *     Wb.progress('正在复制文件 file1.js'); //更新默认mask的标签文本
   *     Wb.progress('正在复制文件 file2.js', 'myMask'); //更新指定mask的标签文本
   *     Wb.progress('正在复制文件 file3.js', {text: 'myMask', width: null}); //取消宽度限制
   *     Wb.progress([-1, '正在处理中...']); //隐藏进度条，并更新mask的标签文件
   *     Wb.progress(30, {cancel(){Wb.unmask();}, delay: 0}); //立即显示mask，点击取消按钮执行取消操作
   *     Wb.progress([35, '正在复制文件file4.js']); //同时更新进度和标签
   * 
   * @param {Number/String/Array} info 如果为数值表示进度条进度百分比乘以100后的数值，如30表示进度条位置在30%处。-1表示不显示
   * 进度条。如果为字符串表示对应mask需要更新的标签文本。如果值为数组表示进度位置和标签文本的组合。
   * @param {Object/String} [configs] 遮盖的配置项或遮盖的提示文本，详见{#mask}方法的configs参数。
   * @return {Object} 遮盖对象，可用于使用{#progress}或{#unmask}方法。
   */
  progress(info, configs) {
    if (Wb.isArray(info)) {
      Wb.progress(info[0], configs);
      if (info.length > 1)
        Wb.progress(info[1], configs);
      return;
    }
    let maskComp, labelEls, text, el, textList, strInfo;

    if (Wb.isString(configs))
      configs = { text: configs };
    strInfo = Wb.isString(info);
    configs = Wb.apply({ frame: true, target: BodyEl, width: '40em' }, configs)
    text = configs.text ?? Str.processing;
    el = configs.target.el || configs.target;
    //如果无mask创建mask
    textList = el?.maskComp?.textList;
    if (!textList?.includes(text))
      Wb.mask(configs);
    maskComp = el.maskComp;
    labelEls = maskComp.labelEls;
    if (labelEls) {
      //直接渲染进度条
      el = labelEls[text];
      if (strInfo) {
        el.cls = 'w-mask-plabel';
        el.textEl.textContent = info;
      } else {
        el.setCls(info != -1, 'w-mask-plabel');
        if (info == -1) {
          el.removeCls('w-mask-plabel');
          el.percentEl?.remove();
          el.percentEl = null;
          el.removeStyle('background');
        } else {
          el.cls = 'w-mask-plabel';
          el.percentEl ??= el.addTag();
          el.percentEl.textContent = '(' + Math.round(info) + '%)';
          el.setStyle('background', 'linear-gradient(to right, ' + Wb.configs.progressColor + ' ' + info +
            '%, ' + Wb.configs.progressBgColor + ' 0%)');
        }
      }
    } else {
      //加到list中，待显示mask时渲染
      if (strInfo) {
        maskComp.infoList ??= {};
        maskComp.infoList[text] = info;
      } else {
        maskComp.progressList ??= {};
        maskComp.progressList[text] = info;
      }
    }
    return { text: text, target: el };
  },
  /**
   * 动态加载JavaScript模块文件。在head节点中加载JavaScript模块文件请使用{#load}方法。
   * Example:
   *
   *     Wb.loadModule('wb/js/my.mjs', module => module.MyCls.doSomething());
   *
   * @param {String} path 基于应用根目录的模块文件路径。如果以"m?xwl="开头的路径表示基于模块目录的路径。
   * @param {Function} [callback] 模块加载完成后执行的方法。
   * @param {Function} .module 加载的模块。
   * @param {Boolean/Object} [mask] 加载过程中显示正在加载中的遮盖动画提示。false表示不显示，默认为显示
   * 默认的遮盖。详见{#mask}说明。
   * @param {Boolean} [showError] 是否显示加载错误的信息。默认为true。
   */
  loadModule(path, callback, mask, showError) {
    if (path.startsWith('m?xwl=')) {
      path = 'wb/modules/' + path.substr(6);
      if (!path.endsWith('.mjs'))
        path += '.mjs';
    }
    path = Wb.normalizePath(path);
    if (mask !== false)
      mask = Wb.mask(mask);
    import(Wb.path + '/' + path).then(m => {
      if (mask)
        Wb.unmask(mask);
      callback?.(m);
    }).catch(e => {
      if (mask)
        Wb.unmask(mask);
      if (showError ?? true)
        Wb.error(e);
    });
  },
  /**
   * 动态在当前页面head节点中加载js, mjs或css资源，并在全部资源加载成功后执行指定的方法。动态加载mjs资源请
   * 使用{#loadModule}方法。
   * Example: 
   *
   *     Wb.load('foo/bar.js', f => doSomething());
   *     Wb.load(['file.css', 'file.js', {url: 'foo/bar', async: true, type: 'js', 
   *             reload: true, autoRemove: true}], callback);
   *
   * @param {String/Object/Array} urlList 需要加载的js/mjs/css资源地址或其数组列表。如果值为Object表示配置对象: 
   * @param {String} .url url地址。
   * @param {Boolean} [.async] 是否异步加载，false同步，true异步。默认为false同步。
   * @param {String} [.type] 资源类型，有效值为js,mjs和css。默认为根据地址是否为.js/.mjs/.css结尾来
   * 自动判断，无法判断时默认为js。
   * @param {Boolean} [.reload] 是否允许重复加载相同的资源。默认为false仅允许加载单次。
   * @param {Boolean} [.autoRemove] 加载完成后是否自动移除该节点。可用于单次执行脚本。默认仅当加载异常时自动移除。
   * @param {Function} [callback] 全部资源加载完成后执行的方法。
   * @param {Boolean/Object} [mask] 加载过程中显示正在加载中的遮盖动画提示。false表示不显示，默认为显示
   * 默认的遮盖。详见{#mask}说明。
   * @param {Boolean} [showError] 是否显示加载错误的信息。默认为true。
   * @param {Boolean} [useDefine] 加载过程中是否允许使用AMD define方法。false不允许，true允许。
   */
  load(urlList, callback, mask, showError, useDefine) {
    let createLink, onLoad, total, count = 0, urls = {}, head = Wb.headEl;

    //configs为地址, cb为回调函数
    createLink = (configs, cb) => {
      let node, url, scriptType, reload, asyncFlag, autoRemove;

      if (Wb.isString(configs)) {
        url = configs;
      } else {
        url = configs.url;
        scriptType = configs.type;
        autoRemove = configs.autoRemove;
        asyncFlag = configs.async;
        reload = configs.reload;
      }
      if (!scriptType) {
        if (url.endsWith('.css'))
          scriptType = 'css';
        else if (url.endsWith('.mjs'))
          scriptType = 'mjs';
        else scriptType = 'js';
      }
      if (!reload && (node = urls[Wb.qualifyURL(url)])) {
        if (node.isLoading)
          node.addEventListener('load', cb, {
            once: true
          });
        else
          cb();
        return;
      }
      if (scriptType == 'css') {
        node = document.createElement('link');
        node.rel = 'stylesheet';
        node.href = url;
      } else {
        node = document.createElement('script');
        if (scriptType == 'mjs')
          node.type = 'module';
        node.src = url;
        if (!asyncFlag)
          node.async = false;
      }
      node.isLoading = true;
      if (autoRemove)
        node.autoRemove = true;
      node.addEventListener('load', cb, {
        once: true
      });
      node.addEventListener('error', e => {
        cb(e);
        if (showError ?? true)
          Wb.error(Str.loadFailed.format(Wb.shortURL(e.target.src ?? e.target.href)));
        if (autoRemove ?? true)
          e.target.remove();
      }, {
        once: true
      });
      head.appendChild(node);
    };
    onLoad = e => {
      let target = e?.target;

      if (target)
        delete target.isLoading;
      if (target?.autoRemove)
        target.remove();
      count++;
      if (count === total) {
        //完成所有加载后执行回调
        if (mask)
          Wb.unmask(mask);
        if (Globals.savedDefine)
          window.define = Globals.savedDefine;
        callback?.();
      }
    };
    if (mask !== false)
      mask = Wb.mask(mask);
    //获取已经加载的script和link
    document.getElementsByTagName('script').forEach(script => {
      urls[script.src] = script;
    });
    document.getElementsByTagName('link').forEach(link => urls[link.href] = link);
    urlList = Wb.toArray(urlList);
    total = urlList.length;
    if (!useDefine && window.define?.amd) {
      Globals.savedDefine ??= window.define;
      window.define = undefined;
    }
    //加载异步资源
    urlList.forEach(configs => {
      createLink(configs, onLoad);
    });
  },
  /**
   * {#Wb.load}方法的Promise版本。无论请求成功或失败，Promise始终执行resolved。
   * Example: 
   *
   *     Wb.loadx('foo/bar.js').then(f => doSomething());
   *
   * @param {String/Object/Array} urlList 需要加载的js/css源地址或其数组列表。
   * @param {Boolean/Object} [mask] 加载过程中显示正在加载中的遮盖动画提示。false表示不显示，
   * 默认为显示默认的遮盖。详见{#mask}说明。
   * @return {Promise} promise对象。
   */
  loadx(urlList, mask) {
    return new Promise(resolve => {
      Wb.load(urlList, resolve, mask);
    });
  },
  /**
   * 获得指定元素的{#Wb.Component}对象。通过{#Wb.Component}对象可以方便对元素进行操作。
   * Example: 
   * 
   *     Wb.get(div).tip = '提示';
   * 
   * @param {String/Element} el 元素或元素id。
   * @param {Object} [configs] 组件配置项。
   * @return {Wb.Component} 包含指定元素的{#Wb.Component}对象。
   */
  get(el, configs) {
    let object = { el: Wb.el(el) };
    if (configs)
      Wb.apply(object, configs);
    return new Wb.Component(object);
  },
  /**
   * 获得指定元素的共享{#Wb.Component}对象。通过{#Wb.Component}对象可以方便对元素进行操作。
   * 请注意每次使用该方法后，上次使用该方法获得的对象中的元素将指向本次的元素。
   * 如需获得独立的对象请使用{#get}方法。
   * Example: 
   * 
   *     Wb.fly('my-div').hide();
   * 
   * @param {String/Element} el 元素或元素id。
   * @return {Wb.Component} 包含指定元素的共享{#Wb.Component}对象。
   */
  fly(el) {
    let fly = Wb.Component.flyComp ??= new Wb.Component();
    fly.el = Wb.el(el);
    return fly;
  },
  /**
   * 获取组件列表中所有组件及其下级组件和子组件的cid属性和值组成的对象。只有具有cid属性且值不是undefined的组件
   * 才会被获取值。如果组件的cid重复，后面的值会覆盖前面的值。组件的值通过组件的{{getValue}}方法和{{value}}属性
   * 获取，前者优先级更高。
   * Example: 
   *
   *     values = Wb.getValue(panel1);
   *     values = Wb.getValue([panel1, viewport1], true);
   *
   * @param {Wb.Component/Wb.Component[]} comps 组件列表。
   * @param {Boolean} [noEmpty] 是否不获取为空的组件值，是否空值由{#Wb.isEmpty}函数判断。
   * @param {Boolean} [whole] 是否完整遍历下级组件和子组件，true完整遍历下级组件和子组件（默认值），
   * false仅遍历子组件，null只遍历下级组件。
   * @return {Object} 所有组件的cid属性和值组成的对象。
   */
  getValue(comps, noEmpty, whole = true) {
    let cid, value, values = {}, allowEmpty = !noEmpty;

    Wb.toArray(comps).forEach(comp => comp?.cascade(item => {
      if (item.noValue)
        return null;
      if ((cid = item.cid$) && (value = Wb.isFunction(item.getValue) ? item.getValue() : item.value) !== undefined &&
        (allowEmpty || !Wb.isEmpty(value))) {
        if (item.valueMap) {
          Wb.apply(values, item.getMappedValue());
        } else if (item.bindField) {
          values[cid] = item.inputValue;
          values[item.bindField] = value;
        } else if (item.keyName) {
          values[cid] = value;
          values[cid + '$'] = item.inputValue;
        } else {
          values[cid] = value;
        }
      }
    }, true, false, true, whole));
    return values;
  },
  /**
   * 把对象中的值按键名对应组件cid属性的方法，依次设置到组件列表中所有组件及其下级组件和子组件中。
   * Example: 
   *
   *     Wb.setValue(container1, {text1: 'foo', number1: 123});
   *     Wb.setValue([container1, panel1], {text1: 'foo', number1: 123}, true, true);
   *
   * @param {Wb.Component/Wb.Component[]} comps 组件列表。
   * @param {Object} values 设置的值组成的对象。
   * @param {Boolean} [autoClear] 如果组件对应的值为undefined，是否清除组件的值。
   * @param {Boolean} [whole] 是否完整遍历下级组件和子组件，true完整遍历下级组件和子组件（默认值），
   * false仅遍历子组件，null只遍历下级组件。
   */
  setValue(comps, values, autoClear, whole = true) {
    let cid, value, v;

    Wb.toArray(comps).forEach(comp => comp?.cascade(item => {
      if (cid = item.cid$) {
        value = values[cid];
        if (value === undefined) {
          if (autoClear && Wb.isFunction(item.clear))
            item.clear();
        } else {
          if (item instanceof Wb.Select) {
            if (item.valueMap)
              item.value = item.getMappedValue(values);
            else if (item.bindField)
              item.value = [values[item.bindField], value];
            else
              item.value = (v = values[cid + '$']) ? [value, v] : value;
          } else
            item.value = value;
        }
      }
    }, true, false, true, whole));
  },
  /**
   * 重置组件列表中所有的组件及其下级组件和子组件的值。重置值通过调用组件的reset方法实现，如果组件具有reset方法则调用它。
   * Example: 
   *
   *     Wb.reset(panel1);
   *     Wb.reset([panel1, text1], true);
   *
   * @param {Wb.Component/Wb.Component[]} comps 组件列表。
   * @param {Boolean} [whole] 是否完整遍历下级组件和子组件，true完整遍历下级组件和子组件（默认值），
   * false仅遍历子组件，null只遍历下级组件。
   */
  reset(comps, whole = true) {
    Wb.toArray(comps).forEach(comp => comp?.cascade(item => {
      if (Wb.isFunction(item.reset))
        item.reset();
    }, true, false, true, whole));
  },
  /**
   * 清空组件列表中所有的组件及其下级组件和子组件的值。清空值通过调用组件的clear方法实现，如果组件具有clear方法则调用它。
   * Example: 
   *
   *     Wb.clear(panel1);
   *     Wb.clear([panel1, text1], true);
   *
   * @param {Wb.Component/Wb.Component[]} comps 组件列表。
   * @param {Boolean} [whole] 是否完整遍历下级组件和子组件，true完整遍历下级组件和子组件（默认值），
   * false仅遍历子组件，null只遍历下级组件。
   */
  clear(comps, whole = true) {
    Wb.toArray(comps).forEach(comp => comp?.cascade(item => {
      if (Wb.isFunction(item.clear))
        item.clear();
    }, true, false, true, whole));
  },
  /**
   * 验证组件列表中所有组件及其所有下级组件和子组件的值是否合法。
   * Example: 
   *
   *     if (Wb.verify(panel1)) return;
   *     Wb.verify([panel1, date1], true, true);
   *
   * @param {Wb.Component/Wb.Component[]} comps 组件列表。
   * @param {Boolean} [noFocus] 是否不设置首个具有非法值组件的焦点。
   * @param {Boolean} [whole] 是否完整遍历下级组件和子组件，true完整遍历下级组件和子组件（默认值），
   * false仅遍历子组件，null只遍历下级组件。
   * @return {Boolean} true全部合法，false至少有一个组件的值非法。
   */
  verify(comps, noFocus, whole = true) {
    let firstComp, unsetFocus = noFocus;

    Wb.toArray(comps).forEach(comp => comp?.cascade(item => {
      if (!item.visible$ && (!(item instanceof Wb.Card) || !item.tabButton?.visible$) ||
        !item.appeared$ || item.disabled$ || item.noVerify)
        return null;
      if (Wb.isFunction(item.verify) && !item.verify(unsetFocus) && !firstComp) {
        firstComp = true;
        if (!noFocus && !item.noVerifyFocus) {
          item.bubble(parent => {
            if (parent?.parent instanceof Wb.CardCt && !parent.disabled$)
              parent.parent.activeCard = parent;
          });
          item.focus();
          unsetFocus = true;
        }
      }
    }, true, false, true, whole));
    return !firstComp;
  },
  /**
   * 设置组件列表中所有的控件{#Wb.Control}及其下级控件和子控件的事件。
   * Example: 
   *
   *     Wb.setEvents(panel1, 'change', app.onChange);
   *
   * @param {Wb.Component/Wb.Component[]} comps 组件列表。
   * @param {String} eventName 事件名称。
   * @param {Function} fn 事件方法。
   * @param {Boolean} [whole] 是否完整遍历下级组件和子组件，true完整遍历下级组件和子组件（默认值），
   * false仅遍历子组件，null只遍历下级组件。
   */
  setEvents(comps, eventName, fn, whole = true) {
    Wb.toArray(comps).forEach(comp => comp?.cascade(item => {
      if (item instanceof Wb.Control)
        item.on(eventName, fn);
    }, true, false, true, whole));
  },
  /**
   * 向服务器发送请求，并返回获得的数据。
   * Example:
   *
   *     //GET方式提交参数（默认POST）
   *     Wb.ajax({url: path, params: {p1: 'abc', p2: 123}, method: 'GET', success(resp){doSuccess();}});
   *     //POST方式提交参数、文件和blob（参数如果包含文件/blob将使用multipart/form-data方式）
   *     Wb.ajax({url: path, params: {p1: 'abc', p2: 123, p3: file, p4: blob}});
   *     //强制使用multipart/form-data编码方式提交大参数值，因为过大的参数值使用普通编码方式提交将导致失败
   *     Wb.ajax({url: path, params: {p1: 'large text...'}, form: true});
   *     //指定data内容提交（支持大参数值），data如果为Object/Array，默认内容类型为'application/json;charset=utf-8'
   *     Wb.ajax({url: path, data: 'large text...'});
   *     //指定form, comps和params和来提交参数，重名参数将覆盖，优先级从低到高
   *     Wb.ajax({url: path, form: myForm, comps: [panel1, file1], params: {foo: 'bar'}});
   *     //提交Object和Array
   *     Wb.ajax({url: path, params: {object: {foo: 'bar'}, array: [1, 'abc', new Date()]}});
   *     //提交同名的多个参数
   *     Wb.ajax({url: path, params: {myParam: Wb.markParams([1, 'abc', new Date()])}});
   *     //下载文件
   *     Wb.ajax({url: path, download: true, mask: false, onDownload(percent){console.log(percent)}});
   *     //发送对象，后台可还原对象的原数据类型，后台使用Wb.get('date')可获得日期类型值
   *     Wb.ajax({url: path, object: {foo: 'bar', num: 123, date: new Date()}});
   *     //指定header提交
   *     Wb.ajax({url: path, data, header: {'Content-Type': 'text/html;charset=utf-8'}});
   * 
   * @param {Object/String} configs 请求的配置对象或请求的url地址。
   * @param {String} .url url地址。
   * @param {Object} [.params] 请求的参数对象。如果指定data属性或使用get方法请求，参数将编码到URL中，因此在此类场景
   * 下，params中不可包含File, Blob和同名的多个参数等值。如果发送的数据包含File、Blob或特定的可枚举值，
   * 默认将使用multipart/form-data编码。
   * @param {Wb.Component/Wb.Component[]} [.comps] 组件列表及其所有下级组件和子组件的值组成的请求参数对象。
   * @param {HTMLFormElement/Boolean} [.form] 请求的form表单，如果该参数为true，将指定通过FormData提交参数。\
   * 默认将使用multipart/form-data编码。
   * @param {Object} [.data] 发送的任意类型值数据，如果数据为Object/Array对象，将设置默认contentType为
   * application/json。设置该属性后form属性将无效。data内容详情请参考XMLHttpRequest.send方法。
   * @param {Object} [.object] 发送的对象数据。该属性同data属性的区别为能在后台还原数据类型。指定该属性data将无效。
   * @param {Boolean/String} [.download] 是否把目标url返回的资源作为文件进行下载操作。字符串表示下载的文件名。\
   * 非Ajax方式的下载可使用{#Wb.download}方法。下载操作推荐使用{#Wb.download}方法。
   * @param {Function} [.success] 请求成功时的回调函数。可用参数response, xhr, e分别表示返回值，
   * ajax对象和事件对象。this指向ajax对象。
   * @param {Function} [.failure] 请求失败时的回调函数。可用参数response, xhr, e分别表示返回值，
   * ajax对象和事件对象。this指向ajax对象。
   * @param {Function} [.callback] 请求结束时的回调函数，无论成功失败都会执行。可用参数response, xhr, e分别
   * 表示返回值，ajax对象和事件对象。this指向ajax对象。可通过检测xhr.ok是否为true来判断请求成功与否。
   * @param {Object} [.scope] success, failure, callback方法内的this对象，默认为xhr对象。
   * @param {String} [.method] 要使用的HTTP方法，例如GET, POST, PUT, DELETE等，默认为POST。
   * @param {Boolean/String} [.json] 指定返回响应数据的类型是否为json，如果为true返回值将直接解码为json对象。\
   * 当发生异常时，如果该参数值为字符串表示异常信息属性名称，如果值为Boolean表示返回的整个字符串作为异常信息。
   * @param {String} [.type] 返回响应数据的类型。请参考XMLHttpRequest.responseType。
   * @param {Number} [.timeout] 表示该请求的最大请求时间（毫秒），若超出该时间，请求会自动终止。请参考
   * XMLHttpRequest.timeout。默认空值或 0，表示永不超时。
   * @param {Boolean} [.wc] 用来指定跨域 Access-Control 请求是否应当带有授权信息，如 cookie 或授权 header 头。\
   * 请参考XMLHttpRequest.withCredentials。
   * @param {Boolean} [.async] 是否为异步请求，true异步，false同步，默认为true。
   * @param {String} [.username] 可选的用户名用于认证用途。
   * @param {String} [.password] 可选的密码用于认证用途。
   * @param {Function} [.onDownload] 下载进度变化时执行的方法。可用参数percent，表示进度百分比。
   * @param {Function} [.onUpload] 上传进度变化时执行的方法。可用参数percent，表示进度百分比。
   * @param {Boolean/String} [.uploadProgress] 是否在mask中显示上传进度。如果为字符串表示上传完成后显示的提示信息。
   * @param {Boolean} [.downloadProgress] 是否在mask中显示下载进度。
   * @param {Boolean} [.showError] 是否自动显示异常信息。默认为true。
   * @param {Object} [.header] 设置 HTTP 请求头的值。
   * @param {Object/String/Boolean} [.mask] 加载过程中显示正在加载中的遮盖动画提示。false表示不显示，
   * 默认为显示默认的遮盖。详见{#Wb.mask}说明。
   * @param {Function} [resolve] 请求结束时的回调函数，无论成功失败都会执行。
   * @return {XMLHttpRequest} ajax请求对象。
   */
  ajax(configs) {
    return Wb.Request.ajax(configs);
  },
  /**
   * {#Wb.ajax}方法的Promise版本。无论请求成功或失败，Promise始终执行resolved。
   * Promise回调方法this指向scope参数或xhr，结果对象的参数如下：
   * -response: 返回值
   * -xhr: xhr对象
   * -e: 事件对象
   * -ok: 是否成功
   * Example: 
   *
   *     Wb.fetch({url: path, params: {p1: 'abc', p2:123}}).then(
   *       result => {
   *          if(result.ok)
   *            console.log(result.response);
   *          else
   *            console.warn('failed');
   *       }
   *     );
   *
   * @return {Promise} promise对象。
   */
  fetch(configs) {
    return new Promise(resolve => {
      Wb.Request.ajax(configs, resolve);
    });
  },
  /**
   * 向Document元素添加指定名称的class。
   * @param {String} cls 添加的class名称。
   */
  addCls(cls) {
    DocEl.classList.add(cls);
  },
  /**
   * 移除Document元素指定名称的class。
   * @param {String} cls 移除的class名称。
   */
  removeCls(cls) {
    DocEl.removeCls(cls);
  },
  /**
   * 添加或移除Document元素指定名称的class。
   * @param {Boolean} enabled true添加样式，false移除样式。
   * @param {String} cls class名称。
   */
  setCls(enabled, cls) {
    DocEl.setCls(enabled, cls);
  },
  /**
   * 切换Document元素样式类名。如果存在指定名称的类名则移除，否则添加。
   * @param {String} cls 样式类名。
   */
  toggleCls(cls) {
    DocEl.toggleCls(cls);
  },
  /**
   * 查找指定坐标点上最上层的元素。为document.elementFromPoint的别名。
   * @param {Number} x x坐标。
   * @param {Number} y y坐标。
   * @return {Element} 找到的元素，不存在返回null。
   */
  findEl(x, y) {
    return document.elementFromPoint(x, y);
  },
  /**
   * 设置系统字体大小。
   * @param {Number} fontSize 字体大小。单位为像素。
   */
  setFontSize(fontSize) {
    if (Wb.configs.fontSize !== fontSize) {
      let config;
      BodyEl.setStyle('font-size', fontSize + 'px');
      fontSize = Wb.configs.fontSize = parseInt(BodyEl.computeStyle().fontSize);
      config = { fontSize };
      Wb.each(Wb.CodeEditor?.editors, (k, editor) => editor.editor.updateOptions(config));
    }
  },
  /**
   * 初始化CSS变量。
   */
  initCssVar() {
    let varEl, style, bgColor, fontSize, configs = Wb.configs;

    varEl = BodyEl.addEl('w-var-el');
    style = varEl.computeStyle();
    fontSize = configs.rawFontSize = parseInt(style.fontSize);
    configs.fontSize ??= fontSize;
    bgColor = style.borderRightColor;
    Wb.apply(configs, {
      editorTheme: ['vs', 'vs-dark', 'hc-black', 'custom'][parseInt(style.borderTopColor.slice(-2, -1))],
      editorBgColor: '#' + bgColor.slice(4, -1).split(',').map(
        x => parseInt(x).toString(16).padStart(2, '0')).join(''),
      progressColor: style.borderBottomColor,
      progressBgColor: style.borderLeftColor,
      borderColor: style.outlineColor,
      fixedBgColor: style.backgroundColor,
      mainBgColor: style.caretColor,
      mainColor: style.color
    });
    varEl.remove();
  },
  /**
   * Wb初始化时执行的方法。 @priv
   */
  init() {
    let value, configs = Wb.configs, ua = navigator.userAgent.toLowerCase();

    globalThis.BodyEl = document.body;
    value = DocEl.getAttribute('timezone');
    if (value)
      configs.tzOffset = parseInt(value) + (new Date().getTimezoneOffset()) / 60;
    value = DocEl.getAttribute('fs');
    if (value)
      configs.fontSize = parseInt(value);
    Wb.initCssVar();
    configs.recordHash = !configs.noHash.some(item => ua.includes(item));
    configs.cmdAsCtrl &&= true;// ua.includes('macintosh') || ua.includes('mac os');
    BodyEl.setStyle('font-size', Wb.px(configs.fontSize));
    if (Wb.isTouch) {
      Wb.apply(Event, { tapDownName: 'touchstart', tapUpName: 'touchend', tapMoveName: 'touchmove' });
      Object.defineProperties(Event.prototype, {
        //首个changedTouches的clientX值
        x: {
          get() {
            return this.changedTouches?.[0]?.clientX;
          },
          configurable: true
        },
        //首个changedTouches的clientY值
        y: {
          get() {
            return this.changedTouches?.[0]?.clientY;
          },
          configurable: true
        }
      });
    } else {
      Wb.apply(Event, { tapDownName: 'mousedown', tapUpName: 'mouseup', tapMoveName: 'mousemove' });
    }
    //标识touch和desktop的样式
    DocEl.addCls(Wb.isTouch ? 'w-touch' : 'w-desktop');
    Globals.monWinResize = f => {
      let v = BodyEl.clientWidth < Globals.smallScreenWidth;
      if (Globals.smallScreen != v) {
        DocEl.setCls(v, 'w-small-scr');
        Globals.smallScreen = v;
      }
      if (Wb.isTouch && (v = Wb.activeWindow)) {
        let vh = v.el.offsetHeight, bh = BodyEl.offsetHeight;
        //可能弹出软键盘
        if (v.el.offsetTop + vh > bh)
          v.y = Math.max(0, bh - vh);
      }
    };
    window.addEventListener('beforeunload', e => Wb.unloading = true);
    window.addEventListener('popstate', f => {
      if (Globals.stopPopState) {
        Globals.stopPopState = false;
        return;
      }
      let hash, wins;

      wins = DocEl.queryAll('.w-win.w-modal:not(.w-hidden):not(.w-disp-none)')
      if (wins.length) {
        let win, z, zindex = 0, cob;
        wins.forEach(w => {
          z = w.getStyle('z-index');
          if (z > zindex) {
            win = w;
            zindex = z;
          }
        });
        win ??= wins[0];
        win = win.citem;
        if (win) {
          cob = win.closeOnBack;
          if (win.modal$ && (cob || cob == null && Wb.isTouch && win.closable))
            win.close();
        }
        return;
      }
      hash = decodeURIComponent(location.hash).slice(1);
      if (hash.startsWith('wb$')) {
        hash.slice(3).split('|').forEach(item => {
          Wb.el(item.firstItem('='))?.citem?.gotoHash?.(item.afterItem('='));
        });
      } else {
        Wb.el(hash)?.intoView();
      }
    });
    window.addEventListener('resize', Globals.monWinResize);
    Globals.monWinResize();
    console.info('%cPowered by WebBuilder%cgeejing.com',
      'padding: 2px 8px; border-radius: 3px 0 0 3px; color: #fff; background: #606060;',
      'padding: 2px 8px; border-radius: 0 3px 3px 0; color: #fff; background: #1475b2;');
    Globals.wsPrefix = (location.protocol == 'https:' ? 'wss:' : 'ws:') + '//' + location.host + Wb.path;
  },
  /**
   * 当页面重新加载或模块销毁前执行指定的方法，返回false阻止销毁和重新加载。
   * @param {Wb.Container} ct 容器对象。
   * @param {Function} fn 执行的方法。
   */
  onUnload(ct, fn) {
    if (ct) {
      ct.beforeUnloadFn = fn;
    } else {
      window.addEventListener('beforeunload', e => {
        if (fn() === false)
          Wb.stopLoad(e);
      });
    }
  },
  /**
   * 当初始的 HTML 文档被完全加载和解析完成之后执行指定的方法。如果已经加载完成，指定的方法将立即被执行。
   * 另外每个模块客户端的"app"对象内的onLoad方法将在模块被加载后执行，区别于{#finalize|Wb.Module.finalize}事件，无论加载模块是否为单例，只要加载模块该方法均会被执行。
   * @param {Function} fn 执行的方法。
   */
  onLoad(fn) {
    if (Globals.onLoadDone && Globals.onLoadCt == 0)
      fn();
    else
      window.addEventListener('manualload', fn, {
        once: true
      });
  },
  /**
   * WebBuilder client JS 库最后执行的方法。
   */
  finalize() {
    document.addEventListener('DOMContentLoaded', e => {
      Globals.onLoadDone = true;
      if (Globals.onLoadCt == 0)
        window.dispatchEvent(new Event('manualload'));
    }, {
      once: true
    });
    Wb.onLoad(Wb.init);
  },
  /**
   * 开始手动通知加载完成模式。调用{#Wb.endLoad}方法完成加载，然后自动执行{#Wb.load}方法内的方法。
   */
  startLoad() {
    Globals.onLoadCt++;
  },
  /**
   * 结束手动通知加载完成模式。另请参考{#Wb.startLoad}方法。
   */
  endLoad() {
    Globals.onLoadCt--;
    if (Globals.onLoadDone && Globals.onLoadCt == 0)
      window.dispatchEvent(new Event('manualload'));
  }
});
Object.defineProperties(Wb, {
  /** @property {Element} - 获取head元素。 @getter */
  headEl: {
    get() {
      return this.headEl$ ??= document.getElementsByTagName('head')[0];
    },
    configurable: true
  },
  /** @property {HTMLIFrameElement} - 窗口内唯一隐藏的用于下载文件的Iframe对象。任何返回的文本表示错误信息。 @getter */
  iframe: {
    get() {
      let iframe = Globals.iframe;

      if (iframe)
        return iframe;
      let id = 'f' + Wb.getId();
      iframe = Globals.iframe = BodyEl.addEl('w-disp-none', 'iframe');
      iframe.setAttribute('id', id);
      iframe.setAttribute('name', id);
      document.body.appendChild(iframe); // important, don't remove
      iframe.onload = f => {
        let text = iframe.contentDocument?.body?.innerHTML;
        if (text) {
          if (text == '$$login')
            Wb.login();
          else if (text.startsWith('$$')) {
            text = text.substr(2);
            if (text)
              Wb.tip(text);
          } else
            Wb.error(text);
        } else {
          Wb.error(Str.serverError);
        }
      };
      return iframe;
    },
    configurable: true
  },
  /** @property {String} - 根目录路径名称。如根目录为app返回"/app"，如根目录为空返回空串。 @getter */
  path: {
    get() {
      let path = location.pathname;
      return path.substr(0, path.lastIndexOf('/'));
    },
    configurable: true
  },
  /** @property {Wb.Component} - 当前具有焦点的组件。如果不存在返回null。 @getter */
  activeComp: {
    get() {
      return document.activeElement.getClosestComp();
    },
    configurable: true
  },
  /** @property {Wb.Window} - 当前具有焦点的窗口。如果不存在返回null。 @getter */
  activeWindow: {
    get() {
      return document.activeElement.getClosestComp(Wb.Window);
    },
    configurable: true
  }
});
/**
 * 通用的原型方法类。这些原型方法可以应用于Array, Set和Map等类中。
 * @class Wb.PT
 */
Wb.apply(Wb.PT, {
  /**
   * 设置图标元素指定类型的图标。
   * @param {String} value 图标的值。如果value为null或空将销毁{#iconEl}图标元素。"null"值表示空的图标。当销毁
   * 图标后{#iconColor}值也将同时被重置。
   * @param {Boolean} isImg 是否为图片，false文字，true图片。
   * @static
   */
  setIcon(value, isImg) {
    let iconEl, me = this, oldIsImage = me.isImageIcon, oldValue = oldIsImage ? me.img$ : me.icon$;

    if (me.isImageIcon !== isImg || oldValue !== value) {
      me.isImageIcon = isImg;
      if (isImg) {
        me.icon$ = null;
        me.img$ = value;
      } else {
        me.img$ = null;
        me.icon$ = value;
      }
      if (value) {
        iconEl = me.iconEl;
        if (iconEl) {
          if (oldValue) {
            if (oldIsImage) {
              if (!isImg) {
                //新的为文字且旧的为图片时
                iconEl.removeCls(me.smallImg ? 'w-small-img' : 'w-img');
                iconEl.removeStyle('background-image');
              }
            } else {
              if (isImg) {
                //新的为图片且旧的为文字时
                iconEl.removeCls('w-icon');
              }
              iconEl.removeCls('w-xicon');
              iconEl.removeCls('icon-' + oldValue);
              if (iconEl.textContent)
                iconEl.textContent = '';
            }
          }
          if (isImg) {
            if (!oldValue || !oldIsImage)
              iconEl.addCls(me.smallImg ? 'w-small-img' : 'w-img');
            value = Wb.getImagePath(value);
            iconEl.setStyle('background-image', `url(${value})`);
          } else {
            if (!oldValue || oldIsImage)
              iconEl.addCls('w-icon');
            if (value.charCodeAt(0) < 128 && !value.startsWith('!')) {
              iconEl.addCls('icon-' + value);
            } else {
              if (value.startsWith('!'))
                value = value.substr(1);
              iconEl.textContent = value;
              iconEl.addCls('w-xicon');
            }
          }
        }
      } else {
        iconEl = me.iconEl$;
        if (iconEl) {
          iconEl.remove();
          delete me.iconEl$;
        } else {
          me.iconEl.remove();
          delete me.iconEl;
        }
        delete me.iconColor$;
      }
    }
  }
});
/**
 * Event的扩展类。关于Event的更多说明请访问{#%Event}。
 * @class Event
 */
/** @property {String} tapDownName 接触按下事件的名称。移动端为touchstart，桌面端为mousedown。 @static */
/** @property {String} tapUpName 接触释放事件的名称。移动端为touchend，桌面端为mouseup。 @static */
/** @property {String} tapMoveName 接触移动事件的名称。移动端为touchmove，桌面端为mousemove。 @static */
Wb.apply(Event, {
  /**
   * 拦截事件的默认行为和继续传播。 @static
   * @param {Event} e 事件对象。
   */
  interceptHandler(e) {
    e.stopEvent();
  },
  /**
   * 拦截事件的继续传播。 @static
   * @param {Event} e 事件对象。
   */
  interceptSpread(e) {
    e.stopSpread();
  },
  /**
   * 拦截事件的设置焦点行为。 @static
   * @param {Event} e 事件对象。
   */
  pfHandler(e) {
    e.target.blur();
    e.stopEvent();
  },
  /**
   * 有条件拦截事件的继续传播。在调试模式下可以阻止拦截。 @static
   * @param {Event} e 事件对象。
   */
  interceptSpreadIf(e) {
    if (!Globals.debugMode) {
      if (e.code == Keys.F12)
        e.stopSpread();
      else
        e.stopEvent();
    }
  },
  /**
   * 有条件拦截事件的默认行为和继续传播。在调试模式下可以阻止拦截。 @static
   * @param {Event} e 事件对象。
   */
  interceptHandlerIf(e) {
    if (!Globals.debugMode)
      e.stopEvent();
  },
  /**
   * 拦截事件的默认行为。 @static
   * @param {Event} e 事件对象。
   */
  pdHandler(e) {
    e.preventDefault();
  }
});
Wb.apply(Event.prototype, {
  /**
   * 阻止事件的默认行为并停止事件的传播。
   * @param {Boolean} [propagation] 是否允许同类事件的传播。true使用stopPropagation方法阻止，
   * false使用stopImmediatePropagation方法阻止。
   */
  stopEvent(propagation) {
    this.preventDefault();
    if (propagation)
      this.stopPropagation();
    else
      this.stopSpread();
  },
  /**
   * stopImmediatePropagation方法的别名。
   * @function stopSpread
   */
  stopSpread: Event.prototype.stopImmediatePropagation
});
Object.defineProperties(Event.prototype, {
  /** @property {Boolean} - 是否按下Ctrl, Shift, Alt或Meta键中的任意一个键。 @getter */
  hasAssistKey: {
    get() {
      let e = this;
      return e.ctrlKey || e.shiftKey || e.altKey || e.metaKey;
    },
    configurable: true
  },
  /** @property {Boolean} - 是否按下鼠标左键。当在移动设备上时始终返回true。 @getter */
  isLeftButton: {
    get() {
      let e = this;
      return e.button == 0 || e.button == null;
    },
    configurable: true
  },
  /** @property {Boolean} - 是否按下回车或移动设备的“开始”键。 @getter */
  isGoKey: {
    get() {
      let e = this;
      return e.code == Keys.Enter || e.keyCode == 13;
    },
    configurable: true
  },
  /** @property {Boolean} - 判断是否按下Ctrl键或meta键（如果允许meta键作为ctrl键）。 @getter */
  ctrlMeta: {
    get() {
      let e = this;
      return e.ctrlKey || Wb.configs.cmdAsCtrl && e.metaKey;
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
   * 延迟指定时间后执行该方法。
   * Example: 
   * 
   *     Wb.info.delays(Wb, 1000, 'Hello'); //延时1秒显示Hello提示框
   * 
   * @param {Object} [scope] 方法内的this对象。默认为函数本身。
   * @param {Number} [timeout] 延时时间，单位为毫秒，默认为100。
   * @param {...Object} [args] 执行方法时传递的参数列表。
   * @return {Number} 延时执行后返回的定时器句柄。
   */
  delays(scope, timeout, ...args) {
    let handle, delayMap;

    scope ??= this;
    delayMap = scope.delayMap ??= new Map();
    handle = setTimeout(f => {
      this.call(scope, ...args);
      delayMap.remove(this);
    }, timeout ?? 100);
    delayMap.set(this, handle);
    return handle;
  },
  /**
   * 取消最后一次正在延迟执行的该方法，并再次延迟指定时间后执行该方法。
   * Example: 
   * 
   *     Wb.info.delay(Wb, 1000, 'Hello'); //延时1秒显示Hello提示框
   *     Wb.info.delay(Wb, 1000, 'Hello World'); //取消显示Hello，并延时1秒显示Hello World提示框
   * 
   * @param {Object} [scope] 方法内的this对象。默认为函数本身。
   * @param {Number} [timeout] 延时时间，单位为毫秒，默认为100。
   * @param {...Object} [args] 执行方法时传递的参数列表。
   * @return {Number} 延时执行后返回的定时器句柄。
   */
  delay(scope, timeout, ...args) {
    scope ??= this;
    this.cancelDelay(scope);
    return this.delays(scope, timeout, ...args);
  },
  /**
   * 取消最后一次正在延迟执行的该方法。
   * Example: 
   * 
   *     Wb.info.delay(Wb, 1000, 'Hello'); //延时1秒显示Hello提示框
   *     Wb.info.cancelDelay(Wb); //取消显示Hello
   * 
   * @param {Object} [scope] 方法内的this对象。默认为函数本身。
   */
  cancelDelay(scope) {
    let handle, delayMap;

    scope ??= this;
    delayMap = scope.delayMap;
    if (handle = delayMap?.get(this)) {
      clearTimeout(handle);
      delayMap.remove(this);
    }
  },
  /**
   * 判断该方法在指定scope内是否已经被设置延时执行。
   * @param {Object} [scope] 方法内的this对象。默认为函数本身。
   */
  isDelayed(scope) {
    return (scope ?? this)?.delayMap.has(this)
  }
});
/**
 * Document的扩展类。关于Document的更多说明请访问{#%Document}。
 * @class Document
 */
/**
 * Element的扩展类。关于Element的更多说明请访问{#%Element}。
 * @class Element
 */
Wb.apply(Element.prototype, {
  /** @property {Object} - 滚动到可视界面的选项。 @priv */
  intoViewOption: { block: 'nearest', inline: 'nearest' },
  /** @property {Object} - 滚动到可视界面中间的选项。 @priv */
  intoViewCenterOption: { block: 'center', inline: 'center' },
  /** @property {Object} - 平滑滚动到可视界面中间的选项。 @priv */
  intoViewSmoothOption: { behavior: 'smooth', block: 'center', inline: 'center' },
  /** @property {Object} - 设置焦点时阻止滚动的选项。 @priv */
  preventScrollOption: { preventScroll: true },
  /** @property {Wb.Component} citem 绑定该元素的组件。 */
  /**
   * 判断元素内是否存在满足某个条件的直接子元素。详见 {#Wb.PT.some} 方法。
   */
  some: Wb.PT.some,
  /**
   * 判断元素内所有直接子元素是否均满足某个条件。详见 {#Wb.PT.every} 方法。
   */
  every: Wb.PT.every,
  /**
   * 判断元素是否存在满足某个条件的上级元素（含元素本身）。详见 {#Wb.PT.bubbleSome} 方法。
   */
  bubbleSome: Wb.PT.bubbleSome,
  /**
   *  判断元素所有上级元素（含元素本身）是否均满足某个条件。详见 {#Wb.PT.bubbleEvery} 方法。
   */
  bubbleEvery: Wb.PT.bubbleEvery,
  /**
   * 判断元素内是否存在满足某个条件的子元素。详见 {#Wb.PT.cascadeSome} 方法。
   */
  cascadeSome: Wb.PT.cascadeSome,
  /**
   * 判断元素内所有子元素是否均满足某个条件。详见 {#Wb.PT.cascadeEvery} 方法。
   */
  cascadeEvery: Wb.PT.cascadeEvery,
  /**
   * getBoundingClientRect的别名。详见Element的getBoundingClientRect的方法说明。
   */
  getRect: Element.prototype.getBoundingClientRect,
  /**
   * 遍历每个直接的子元素，并对每个被遍历的元素执行一次给定的方法。
   * Example: 
   * 
   *     el.each((el, index) => console.log(el, index));
   * 
   * @param {Function} fn 遍历每个节点时执行的方法。如果方法返回false，将中断遍历。
   * @param {String} fn.item 正在处理的当前节点。
   * @param {String} fn.index 正在处理的当前节点的索引。
   * @param {Object} [scope] fn内的this对象，默认为遍历的节点本身。
   * @param {Boolean} [reverse] 是否逆向遍历，true逆向，false正向。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  each(fn, scope, reverse) {
    let children = this.children;

    return Wb.PT.arrayEach.call(children, fn, scope ?? this, reverse);
  },
  /**
   * 高亮元素内指定的文本。
   * @param {String} text 高亮的文本。
   * @param {Boolean} [keepExists] 是否保留已经存在的高亮内容。
   */
  highlightText(text, keepExists) {
    const textNode = 3;
    let key, content, span;

    if (!keepExists)
      this.queryAll('.wx-hl').forEach(el => el.removeAttribute('class'));
    key = '<span class="wx-hl w-hl-search">' + Wb.toHTML(text) + '</span>';
    Wb.cascade(this, el => {
      if (el.nodeType == textNode && (content = el.textContent).includes(text)) {
        span = document.createElement('span');
        span.innerHTML = content.replaceAll(text, key);
        el.parentNode.replaceChild(span, el);
      }
    }, 'childNodes');
  },
  /**
   * 设置元素是否可见。详见{#visible}属性。
   * @param {Boolean} visible 是否可见。
   */
  setVisible(visible) {
    this.visible = visible;
  },
  /**
   * 设置元素是否可见。详见{#appeared}属性。隐藏元素请尽量使用{#visible}属性。
   * @param {Boolean} appeared 是否可见。
   */
  setAppeared(appeared) {
    this.appeared = appeared;
  },
  /**
   * 清空当前元素内所有的子节点，包括文本节点。
   */
  clearChildren() {
    while (this.lastChild) {
      this.lastChild.remove();
    }
  },
  /**
   * 当元素为单元格元素时，在当前元素下添加带图标的文本。
   * @param {String} icon 图标。
   * @param {String} text 文本。
   */
  insertCellIcon(icon, text) {
    let el = this, wrapEl = el.addEl('w-row w-align-center');
    el.removeCls('w-text');
    wrapEl.addEl('w-item-icon w-icon icon-' + icon);
    wrapEl.addEl('w-text').textContent = text;
  },
  /**
   * 当元素为单元格元素时，在当前元素下添加带图片的文本。
   * @param {String} image 图片URL。
   * @param {String} text 文本。
   * @param {Boolean} [smallImage] 是否生成较小的图片。
   */
  insertCellImage(image, text, smallImage) {
    let el = this, wrapEl = el.addEl('w-row w-align-center');
    el.removeCls('w-text');
    wrapEl.addEl('w-item-icon ' + (smallImage ? 'w-small-image' : 'w-img')).setStyle('background-image',
      `url(${Wb.getImagePath(image)})`);
    wrapEl.addEl('w-text').textContent = text;
  },
  /**
   * 把当前元素滚动到父元素的可见位置。
   */
  viewInParent() {
    let el = this, pel = el.parentNode;

    if (!pel)
      return;
    let left = el.offsetLeft, width = el.offsetWidth, right = left + width, top = el.offsetTop,
      height = el.offsetHeight, bottom = top + height, pol = pel.offsetLeft, pleft = pol + pel.scrollLeft,
      pow = pel.offsetWidth, pright = pleft + pow, pot = pel.offsetTop, poh = pel.offsetHeight,
      ptop = pot + pel.scrollTop, pbottom = ptop + poh;

    if (left < pleft)
      pel.scrollLeft = left - pol;
    else if (right > pright && left > pleft + 3)
      pel.scrollLeft = right - pol - pow;
    if (top < ptop)
      pel.scrollTop = top - pot;
    else if (bottom > pbottom && top > ptop + 3)
      pel.scrollTop = bottom - pot - poh;
  },
  /**
   * 把当前元素按最近原则滚动到可视界面。
   */
  intoView() {
    this.scrollIntoView(this.intoViewOption);
  },
  /**
   * 把当前元素滚动到可视界面中间位置。
   * @param {Boolean} smooth 是否平滑滚动。
   */
  intoViewCenter(smooth) {
    this.scrollIntoView(smooth ? this.intoViewSmoothOption : this.intoViewCenterOption);
  },
  /**
   * 把当前元素滚动到父元素垂直中间位置。
   */
  intoVCenter() {
    let me = this, parent = me.parentNode;

    parent.scrollTop = me.offsetTop - (parent.offsetHeight - me.offsetHeight) / 2;
  },
  /**
   * 把当前元素滚动到父元素水平中间位置。
   */
  intoHCenter() {
    let me = this, parent = me.parentNode;

    parent.scrollLeft = me.offsetLeft - (parent.offsetWidth - me.offsetWidth) / 2;
  },
  /**
   * 对当前元素设置焦点但不调整滚动条。
   */
  focusOnly() {
    this.focus(this.preventScrollOption);
  },
  /**
   * 显示元素淡入效果。
   * @param {Function} [callback] 淡入效果完成后执行的方法。
   * @param {Number} [duration] 淡入效果持续的时长，单位为毫秒，默认为800。
   * @return {Animation} 动画对象。
   */
  fadeIn(callback, duration) {
    let animate = this.animate([
      { opacity: 0 },
      { opacity: this.computeStyle().opacity }
    ], {
      duration: duration ?? 800,
      easing: 'ease-in-out'
    });
    if (callback)
      animate.onfinish = callback;
    return animate;
  },
  /**
   * 显示元素淡出效果。
   * @param {Function} [callback] 淡出效果完成后执行的方法。
   * @param {Number} [duration] 淡出效果持续的时长，单位为毫秒，默认为800。
   * @return {Animation} 动画对象。
   */
  fadeOut(callback, duration) {
    let animate = this.animate([
      { opacity: this.computeStyle().opacity },
      { opacity: 0 }
    ], {
      duration: duration ?? 800,
      easing: 'ease-in-out'
    });
    if (callback)
      animate.onfinish = callback;
    return animate;
  },
  /**
   * 显示元素从源位置滑入的效果。
   * Example:
   *
   *     //从左侧滑入
   *     el.slideIn();
   *     //从顶部滑入
   *     el.slideIn(true);
   *     //从 {x: '10px', y: '5em'} 滑入，持续2秒，最后移除el
   *     el.slideIn({x: 10, y: '5em', callback(){ el.remove() }, duration: 2000, easing: 'ease-in-out'}); 
   *
   * @param {Boolean/Object} configs 配置选项，如果缺省表示从视口左边界水平滑入，如果为true表示从视口顶边界垂直滑入。
   * @param {Number/String/Boolean} [configs.x] 从x坐标滑入，数值表示像素。true表示x方向从视口左边界滑入，
   * false表示x方向从视口右边界滑入。
   * @param {Number/String/Boolean} [configs.y] 从y坐标滑入，数值表示像素。true表示y方向从视口顶边界滑入,
   * false表示y方向从视口底边界滑入。
   * @param {Element} [configs.el] 从该元素所在位置滑入。
   * @param {Function} [configs.callback] 滑动效果完成后执行的方法。
   * @param {Number} [configs.duration] 滑动效果持续的时长，单位为毫秒，默认为300。
   * @param {String} [configs.easing] 滑动效果选项，可为"linear"，"ease"，"ease-in"，"ease-out"和"ease-in-out"，
   * 或定制"cubic-bezier"值，如"cubic-bezier(0.42, 0, 0.58, 1)"。默认为"ease-out"。
   * @param {String} [configs.fill] 指定动画播放前后的模式，可为"backwards", "forwards", "both"和"none"。
   * @param {Boolean} [reverse] 是否反向，设置true将为滑出。
   * @return {Animation} 动画对象。
   */
  slideIn(configs, reverse) {
    let x, y, pSize, cSize, fromFrame = {}, toFrame = {}, style = this.computeStyle();

    if (!configs)
      x = true;
    else if (configs === true)
      y = true;
    else {
      if (configs.el) {
        let rect = configs.el.getRect();
        x = rect.x;
        y = rect.y;
      } else {
        x = configs.x;
        y = configs.y;
        if (x == null && y == null)
          x = true;
      }
    }
    if (x != null) {
      pSize = this.posParent.offsetWidth;
      cSize = this.offsetWidth;
      if (x === true && !reverse || x === false && reverse)
        x = -cSize + 'px';
      else if (x === false && !reverse || x === true && reverse)
        x = pSize + 'px';
      else
        x = Wb.px(x);
      fromFrame.left = reverse ? style.left : x;
      toFrame.left = reverse ? x : style.left;
    }
    if (y != null) {
      pSize = this.posParent.offsetHeight;
      cSize = this.offsetHeight;
      if (y === true && !reverse || y === false && reverse)
        y = -cSize + 'px';
      else if (y === false && !reverse || y === true && reverse)
        y = pSize + 'px';
      else
        y = Wb.px(y);
      fromFrame.top = reverse ? style.top : y;
      toFrame.top = reverse ? y : style.top;
    }
    animate = this.animate([fromFrame, toFrame], {
      duration: configs?.duration ?? 300,
      easing: configs?.easing ?? (reverse ? 'ease-in' : 'ease-out'),
      fill: configs?.fill ?? 'none'
    });
    if (configs?.callback)
      animate.onfinish = configs.callback;
    return animate;
  },
  /**
   * 显示元素滑出到目标位置的效果。
   * Example:
   *
   *     //从右侧滑出
   *     el.slideOut();
   *     //从底部滑出
   *     el.slideOut(true);
   *     //滑到 {x: '10px', y: '5em'} ，持续2秒，最后移除el
   *     el.slideOut({x: 10, y: '5em', callback(){ el.remove() }, duration: 2000, easing: 'ease-in-out'}); 
   *
   * @param {Boolean/Object} configs 配置选项，如果缺省表示水平滑出视口右边界，如果为true表示垂直滑出视口底边界。
   * @param {Number/String/Boolean} [configs.x] 滑出到x坐标，数值表示像素。true表示x方向滑出视口右边界，
   * false表示x方向滑出视口左边界。
   * @param {Number/String/Boolean} [configs.y] 滑出到y坐标，数值表示像素。true表示y方向滑出视口底边界,
   * false表示y方向滑出视口顶边界。
   * @param {Element} [configs.el] 滑出到该元素所在位置。
   * @param {Function} [configs.callback] 滑动效果完成后执行的方法。
   * @param {Number} [configs.duration] 滑动效果持续的时长，单位为毫秒，默认为300。
   * @param {String} [configs.easing] 滑动效果选项，可为"linear"，"ease"，"ease-in"，"ease-out"和"ease-in-out"，
   * 或定制"cubic-bezier"值，如"cubic-bezier(0.42, 0, 0.58, 1)"。默认为"ease-in"。
   * @param {String} [configs.fill] 指定动画播放前后的模式，可为"backwards", "forwards", "both"和"none"。
   * @return {Animation} 动画对象。
   */
  slideOut(configs) {
    return this.slideIn(configs, true);
  },
  /**
   * 元素从当前位置滑动到指定位置。该方法同{#slideOut}方法的区别为滑动后的位置为元素的最新位置。详见{#slideOut}方法说明。
   */
  slideTo(configs) {
    return this.slideOut(Wb.apply({ fill: 'forwards' }, configs), true);
  },
  /**
   * 向上遍历，对元素的所有上级元素执行一次给定的方法。
   * Example: 
   * 
   *     div.bubble(el => console.log(el)); //遍历所有div的上级元素至DocEl
   * 
   * @param {Function} fn 执行的方法，返回false将中断遍历。
   * @param {Object} fn.el 正在处理的当前元素。
   * @param {Object} [scope] fn内的this对象，默认为元素本身。
   * @param {Boolean} [excludeSelf] 遍历时是否排除元素本身，默认为false即包含元素本身。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  bubble(fn, scope, excludeSelf) {
    return Wb.bubble(this, fn, 'parentElement', scope, excludeSelf);
  },
  /**
   * 向上遍历，对元素的所有上级元素（不包含元素本身）执行一次给定的方法。如果方法返回false遍历将中断。详见{#bubble}。
   */
  bubbleParent(fn, scope) {
    return this.bubble(fn, scope, true);
  },
  /**
   * 向下遍历，对元素的所有下级元素执行一次给定的方法。
   * Example: 
   * 
   *     div.cascade(el => console.log(el)); //遍历所有div的下级元素
   * 
   * @param {Function} fn 执行的方法，返回false将中断遍历，返回null当前节点下的条目将不再遍历。
   * @param {Object} fn.el 正在处理的当前元素。
   * @param {Object} fn.parent 遍历时传递的当前成员的上级成员参数。访问实际的上级元素请使用el.parentNode属性。
   * @param {Object} [scope] fn内的this对象，默认为元素本身。
   * @param {Boolean} [reverse] 对同级元素遍历时是否反向遍历。
   * @param {Boolean} [includeSelf] 遍历时是否包含元素本身，默认为false即排序元素本身。
   * @return {Boolean} 是否完成遍历，true完成，false中断。
   */
  cascade(fn, scope, reverse, includeSelf) {
    return Wb.cascade(this, fn, 'children', scope, reverse, includeSelf);
  },
  /**
   * 向下遍历，对元素的所有下级元素（包含元素本身）执行一次给定的方法。返回false将中断遍历，
   * 返回null当前节点下的条目将不再遍历。详见{#cascade}。
   */
  cascadeSelf(fn, scope, reverse) {
    return this.cascade(fn, scope, reverse, true);
  },
  /**
   * 向上遍历查找匹配指定选择器的元素。
   * Example: 
   *
   *     let rowDiv = span.up('div.w-row');
   *
   * @param {String} selectors 选择器字符串。
   * @param {Boolean} [excludeSelf] 遍历时是否排除元素本身，默认为false即包含元素本身。
   * @param {Boolean} [queryAll] 指定是否查找全部匹配的元素，true全部，false首个。
   * @return {Element/Element[]} 匹配的首个元素或所有元素组成的数组。如果未匹配返回null或空数组（queryAll为true时）。
   */
  up(selectors, excludeSelf, queryAll, x) {
    if (Wb.isFunction(selectors))
      return this.upBy(selectors, excludeSelf, queryAll, x);
    let el = this;

    if (queryAll) {
      let result = [];
      el.bubble(el => {
        if (el.matches(selectors)) {
          result.push(el);
        }
      }, el, excludeSelf);
      return result;
    } else {
      if (excludeSelf)
        el = el.parentElement;
      return el ? el.closest(selectors) : null;
    }
  },
  /**
   * 向上遍历查找所有匹配指定选择器的元素。详见{#up}。
   */
  upAll(selectors, excludeSelf) {
    return this.up(selectors, excludeSelf, true);
  },
  /**
   * 向上遍历查找匹配指定条件的元素。
   * @param {Function} fn 测试元素是否满足条件的方法，返回true表示满足条件，返回false表示不满足条件。
   * @param {Object} [scope] fn内的this对象，默认为元素本身。
   * @param {Boolean} [excludeSelf] 遍历时是否排除元素本身，默认为false即包含元素本身。
   * @param {Boolean} [queryAll] 指定是否查找全部匹配的元素，true全部，false首个。
   * @return {Element/Element[]} 匹配的首个元素或所有元素组成的数组。如果未匹配返回null或空数组（queryAll为true时）。
   */
  upBy(fn, scope, excludeSelf, queryAll) {
    let result;

    scope ??= this;
    result = queryAll ? [] : null;
    this.bubble(el => {
      if (fn.call(scope, el)) {
        if (queryAll) {
          result.push(el);
        } else {
          result = el;
          return false;
        }
      }
    }, this, excludeSelf);
    return result;
  },
  /**
   * 向上遍历查找所有匹配指定条件的元素。详见{#upBy}。
   */
  upAllBy(fn, scope, excludeSelf) {
    return this.upBy(fn, scope, excludeSelf, true);
  },
  /**
   * 向下遍历查找匹配指定选择器的元素。
   * Example: 
   *
   *     let rowDiv = div.down('div.w-row');
   *
   * @param {String} selectors 选择器字符串。
   * @param {Boolean} [includeSelf] 遍历时是否包含元素本身，默认为false即排序元素本身。
   * @param {Boolean} [queryAll] 指定是否查找全部匹配的元素，true全部，false首个。
   * @return {Element/Element[]/NodeList} 匹配的首个元素或所有元素组成的数组。\
   * 如果未匹配返回null或空数组/NodeList（queryAll为true时）。
   */
  down(selectors, includeSelf, queryAll, x) {
    if (Wb.isFunction(selectors))
      return this.downBy(selectors, includeSelf, queryAll, x);
    if (includeSelf && this.matches(selectors)) {
      if (queryAll)
        return [this, ...this.queryAll(selectors)];
      else
        return this;
    }
    if (queryAll)
      return this.queryAll(selectors);
    else
      return this.query(selectors);
  },
  /**
   * 向下遍历查找所有匹配指定选择器的元素。详见{#down}。
   */
  downAll(selectors, includeSelf) {
    return this.down(selectors, includeSelf, true);
  },
  /**
   * 向下遍历查找匹配指定条件的元素。
   * @param {Function} fn 测试元素是否满足条件的方法，返回true表示满足条件，返回false表示不满足条件。
   * @param {Object} [scope] fn内的this对象，默认为元素本身。
   * @param {Boolean} [includeSelf] 遍历时是否包含元素本身，默认为false即排序元素本身。
   * @param {Boolean} [queryAll] 指定是否查找全部匹配的元素，true全部，false首个。
   * @return {Element/Element[]} 匹配的首个元素或所有元素组成的数组。如果未匹配返回null或空数组（queryAll为true时）。
   */
  downBy(fn, scope, includeSelf, queryAll) {
    let result;

    scope ??= this;
    result = queryAll ? [] : null;
    this.cascade(el => {
      if (fn.call(scope, el)) {
        if (queryAll) {
          result.push(el);
        } else {
          result = el;
          return false;
        }
      }
    }, this, false, includeSelf);
    return result;
  },
  /**
   * 向下遍历查找所有匹配指定条件的元素。详见{#downBy}。
   */
  downAllBy(fn, scope, includeSelf) {
    return this.downBy(fn, scope, includeSelf, true);
  },
  /**
   * 向下遍历查找匹配指定选择器的首个子元素，为{#%querySelector|api:Element/querySelector}方法的别名。
   */
  query: Element.prototype.querySelector,
  /**
   * 向下遍历查找匹配指定选择器的所有子元素，为{#%querySelectorAll|api:Element/querySelectorAll}方法的别名。
   */
  queryAll: Element.prototype.querySelectorAll,
  /**
   * 向下遍历查找包含指定类名的首个子元素（不包含元素本身）。
   * @param {String} [cls] 样式类名。
   * @return {Element} 找到的首个元素。如果未找到返回null。
   */
  find(cls) {
    return this.getElementsByClassName(cls)[0] ?? null;
  },
  /**
   * 向下遍历查找包含指定类名的所有子元素（不包含元素本身）。getElementsByClassName方法的别名。
   */
  filter: Element.prototype.getElementsByClassName,
  /**
   * 插入HTML到节点的指定位置。insertAdjacentHTML方法的别名。
   */
  insertHtml: Element.prototype.insertAdjacentHTML,
  /**
   * 向上遍历查找包含指定类名的首个上级元素（包含元素本身）。
   * Example: 
   * 
   *     div.findParent('my-class');
   * 
   * @param {String} [cls] 样式类名。
   * @return {Element} 找到的首个元素。如果未找到返回null。
   */
  findParent(cls) {
    return this.closest(cls.padDot());
  },
  /**
   * 向上遍历查找包含指定类名的所有上级元素（包含元素本身）。
   * @param {String} [cls] 样式类名。
   * @return {Element[]} 找到的所有元素。如果未找到返回空数组。
   */
  findParents(cls) {
    return this.upAll(cls.padDot());
  },
  /**
   * 获取包含当前元素最接近的指定组件类的上级组件。
   * Example: 
   *
   *     let grid = el.getClosestComp(Wb.Grid); //获取包含el的最近的Wb.Grid组件
   *
   * @param {Function} [cls] 组件类名称。缺省表示任意类。
   * @return {Wb.Component} 找到的组件，如果未找到返回null。
   */
  getClosestComp(cls) {
    return this.upBy(parentEl => {
      if (parentEl.citem && (!cls || parentEl.citem instanceof cls))
        return true;
    })?.citem ?? null;
  },
  /**
   * 把当前元素按指定的方式同目标元素对齐。该方法通过设置元素的left和top来设置元素位置，
   * 因此元素需要可浮动时该方法才有效，如设置元素position样式为absolute或fixed时该方法有效。
   * Example: 
   *
   *     // 把当前元素的左上角同目标元素的左下角对齐，并把当前元素限定显示在视口内。
   *     el.alignTo(destEl, "tl-bl?"); //tl-可以省略
   *     // 把当前元素的左下角同目标元素的中心点对齐，并设置x坐标偏移-8。
   *     el.alignTo(destEl, "bl-c", [-8, 0]);
   *
   * @param {Element} el 对齐到目标元素。
   * @param {String} [position] 对齐的方式，语法为[当前元素的方位-目标元素的方位?]，如果末尾加"?"表示
   * 目标元素限制在视口内显示。当前元素的方位为tl时可以省略，如"tl-bl"可以省略为bl。默认为bl。
   * 有效的方位为: 
   * -tl: 左上角
   * -t: 上边中间位置
   * -tr: 右上角
   * -l: 左边中间位置
   * -c: 中心位置
   * -r: 右边中间位置
   * -bl: 左下角
   * -b: 下边中间位置
   * -br: 右下角
   * @param {Number[]} [offset] [x, y]指定的偏移量。
   * @param {Number[]} [minXY] [x, y]指定的最小值。
   */
  alignTo(el, position, offset, minXY) {
    let pos, me = this, ppRect = me.posParent.getRect(), autoSize = me.autoSize || me.citem?.autoSize,
      autoWidth, autoHeight, scrollEl = me.citem?.scrollEl, scrollTop, scrollLeft;

    autoWidth = autoSize === true || autoSize == 'width';
    autoHeight = autoSize === true || autoSize == 'height';
    if (autoWidth) {
      if (scrollEl)
        scrollLeft = scrollEl.scrollLeft;
      me.maxWidth = me.oldMaxWidth;
    }
    if (autoHeight) {
      if (scrollEl)
        scrollTop = scrollEl.scrollTop;
      me.maxHeight = me.oldMaxHeight;
    }
    pos = Wb.Math.getAlignPosition(me.getRect(), el.getRect(), position, ppRect.width, ppRect.height,
      autoSize, offset);
    if (minXY) {
      pos.x = Math.max(pos.x, minXY[0]);
      pos.y = Math.max(pos.y, minXY[1]);
    }
    me.x = pos.x;
    me.y = pos.y;
    if (autoWidth) {
      let maxW = me.maxWidth;
      me.oldMaxWidth = maxW;
      me.maxWidth = maxW ? ('min(' + pos.width + 'px, ' + maxW + ')') : pos.width;
      if (scrollEl)
        scrollEl.scrollLeft = scrollLeft;
    }
    if (autoHeight) {
      let maxH = me.maxHeight;
      me.oldMaxHeight = maxH;
      me.maxHeight = maxH ? ('min(' + pos.height + 'px, ' + maxH + ')') : pos.height;
      if (scrollEl)
        scrollEl.scrollTop = scrollTop;
    }
  },
  /**
   * 设置元素的位置和宽高。
   * @param {Object} rect 位置和宽度组成的对象。
   * @param {Number} .x x坐标
   * @param {Number} .y y坐标
   * @param {Number} .width 宽度
   * @param {Number} .height 高度
   */
  setRect(rect) {
    Wb.applyWith(this, rect, ['x', 'y', 'width', 'height']);
  },
  /**
   * 深度判断该元素是否可见。该方法会遍历所有的上级元素，只要有一个上级元素隐藏（包含"w-disp-none"样式），
   * 就会判定为隐藏。简单判断当前元素是否隐藏请访问{#visible}属性。
   * @return {Boolean} true可见，false隐藏。
   */
  isVisible() {
    return !this.bubbleSome(parent => {
      parent.containsCls('w-disp-none');
    });
  },
  /**
   * 以指定位置为圆心生成覆盖元素面积的波纹效果。
   * @param {Number} left 圆心 x 坐标。
   * @param {Number} top 圆心 y 坐标。
   * @param {Boolean/Number/Object} [rippleRange] 波纹的限定范围，如果设置该值波纹的范围将限定于此。\
   * true表示范围为100*100px。数值表示宽高均限定为此值。
   * @param {Number} [rippleRange.width] 限定宽度值，单位为px。
   * @param {Number} [rippleRange.height] 限定高度值，单位为px。
   * @param {String} [cls] 波纹效果的附加样式类名。
   * @return {Element} 波纹div元素。
   */
  rippleEffect(left, top, rippleRange, cls) {
    let div1, div2, m,
      rect = this.getRect(),
      w = rect.width,
      h = rect.height,
      x = left - rect.x,
      y = top - rect.y,
      mw = Math.max(x, rect.right - left),
      mh = Math.max(y, rect.bottom - top);

    if (rippleRange) {
      let rw, rh;
      if (Wb.isNumber(rippleRange)) {
        rw = rh = rippleRange;
      } else if (Wb.isBoolean(rippleRange)) {
        rw = rh = 100;
      } else {
        rw = rippleRange.width;
        rh = rippleRange.height;
      }
      mw = Math.min(Math.max(x, rect.right - left), rw);
      mh = Math.min(Math.max(y, rect.bottom - top), rh);
    }
    m = Math.sqrt(mw * mw + mh * mh);
    div1 = this.addEl();
    div2 = div1.addEl();
    div1.style.cssText = 'width:' + w + 'px;height:' + h + 'px;left: ' + rect.x + 'px;top: ' +
      rect.y + 'px;border-radius:' + this.computeStyle().borderRadius;
    div1.className = 'w-ripple';
    if (cls)
      div2.className = cls;
    div2.style.cssText = 'width:' + m + 'px;height:' + m + 'px;left: ' +
      (x - m / 2) + 'px;top: ' + (y - m / 2) + 'px';
    div2.addEventListener('animationend', f => {
      div1.remove();
    }, {
      once: true
    });
    return div1;
  },
  /**
   * 生成覆盖元素面积的高亮效果。
   * @param {String} [color] 高亮颜色。默认为当前主题色。
   * @param {Boolean} [isCls] color是否为样式名。默认如果color以#开始表示颜色，否则表示样式名。
   * @return {Element} 高亮div元素。
   */
  highlight(color, isCls) {
    if (this.isHighlighting)
      return;
    let div, colorExp = '', rect = this.getRect();
    this.isHighlighting = true;
    div = this.addEl('w-highlight');
    if (color) {
      isCls ??= !color.startsWith('#');
      if (isCls)
        div.addCls(color);
      else
        colorExp = 'background:' + color + ';';
    }
    div.style.cssText = colorExp + 'width:' + rect.width + 'px;height:' + rect.height +
      'px;left: ' + rect.x + 'px;top: ' + rect.y + 'px;border-radius:' + this.computeStyle().borderRadius;
    div.addEventListener('animationend', f => {
      div.remove();
      delete this.isHighlighting;
    }, {
      once: true
    });
    return div;
  },
  /**
   * 把对象中的所有成员作为属性设置到元素。成员名称为属性名称，值为属性值。
   * Example: 
   * 
   *     el.applyAttribute({foo: 123, bar: 'abc'});
   *     
   * @param {Object} attributes 属性对象。
   */
  applyAttribute(attributes) {
    Wb.each(attributes, (k, v) => { this.setAttribute(k, v) });
  },
  /**
   * 在指定节点后面插入节点。
   * Example: 
   * 
   *     let el = Wb.createEl('my-class');
   *     parentEl.insertAfter(el, refEl);
   * 
   * @param {Node} newNode 插入的节点。
   * @param {Node} refNode 在该节点后插入节点。
   * @return {Node} 新创建的节点。
   */
  insertAfter(newNode, refNode) {
    return this.insertBefore(newNode, refNode.nextSibling);
  },
  /**
   * 创建一个新的元素，并在指定节点前插入。
   * Example: 
   * 
   *     parentEl.insertElBefore('my-class', 'span', refNode);
   * 
   * @param {String} [className] 新创建元素的类名。
   * @param {String} [tagName] 新创建元素的标签名，默认为'div'。
   * @param {Node} [refNode] 在该节点前插入元素。如果缺省将添加到本元素子节点的末尾。
   * @return {Element} 新创建的元素。
   */
  insertElBefore(className, tagName, refNode) {
    let el = document.createElement(tagName || 'div');
    if (className)
      el.className = className;
    return this.insertBefore(el, refNode);
  },
  /**
   * 创建一个新的元素，并在指定节点后插入。
   * Example: 
   * 
   *     parentEl.insertElAfter('my-class', 'span', refNode);
   * 
   * @param {String} [className] 新创建元素的类名。
   * @param {String} [tagName] 新创建元素的标签名，默认为'div'。
   * @param {Element} [refNode] 在该元素后插入元素。如果缺省将添加到本元素子节点的末尾。
   * @return {Element} 新创建的元素。
   */
  insertElAfter(className, tagName, refNode) {
    return this.insertElBefore(className, tagName, refNode ? refNode.nextSibling : null);
  },
  /**
   * 创建一个新的元素，并在指定索引号的节点前插入。
   * @param {Number} index 在该索引号的节点前插入元素。
   * @param {String} [className] 新创建元素的类名。
   * @param {String} [tagName] 新创建元素的标签名，默认为'div'。
   * @return {Element} 新创建的元素。
   */
  insertEl(index, className, tagName) {
    return this.insertElBefore(className, tagName, this.childNodes[index]);
  },
  /**
   * 创建一个新的元素，并添加到本元素子节点的末尾或由weight值指定的特定位置。
   * @param {String} [className] 新创建元素的类名。
   * @param {String/Number} [tagName] 新创建元素的标签名，默认为'div'。如果为数值则为weight参数。
   * @param {Number} [weight] 元素位置权重，值越大越靠后。如果比较的元素无weight将默认为50。缺省添加到末尾。
   * @return {Element} 新创建的元素。
   */
  addEl(className, tagName, weight) {
    if (Wb.isNumber(tagName)) {
      weight = tagName;
      tagName = null;
    }
    if (weight == null) {
      return this.insertElBefore(className, tagName);
    } else {
      let node = this.insertElBefore(className, tagName,
        this.childNodes.find(node => (node.weight ?? 50) > weight));
      node.weight = weight;
      return node;
    }
  },
  /**
   * 创建一个新的元素，并添加到本元素子节点的末尾。
   * @param {String/Number} [tagName] 新创建元素的标签名，默认为'div'。如果为数值则为weight参数。详见{#addEl}方法。
   * @param {Number} [weight] 元素位置权重，值越大越靠后。如果比较的元素无weight将默认为50。缺省添加到末尾。
   * @return {Element} 新创建的元素。
   */
  addTag(tagName, weight) {
    return this.addEl(null, tagName, weight);
  },
  /**
   * 添加样式类名。
   * @param {String} cls 样式类名。
   */
  addCls(cls) {
    this.classList.add(cls);
  },
  /**
   * 移除指定的样式类名。如果移除后元素的className为空，将删除class属性。\
   * 该方法仅允许移除单个样式，移除多个样式请使用{#removeClasses}方法。
   * @param {String} cls 样式类名。
   */
  removeCls(cls) {
    this.classList.remove(cls);
  },
  /**
   * 移除指定的多个样式类名。
   * @param {String} classes 样式类名，多个样式名之间以空格分隔。
   */
  removeClasses(classes) {
    if (!classes)
      return;
    let classList = this.classList;
    if (classes.includes(' ')) {
      classes.split(' ').forEach(cls => {
        cls = cls.trim();
        if (cls)
          classList.remove(cls);
      });
    } else {
      classList.remove(classes);
    }
  },
  /**
   * 添加或移除样式类名。
   * @param {Boolean} enabled true添加样式，false移除样式。
   * @param {String} cls 样式类名。
   */
  setCls(enabled, cls) {
    let list = this.classList;

    if (enabled)
      list.add(cls);
    else
      list.remove(cls);
  },
  /**
   * 切换样式类名。如果存在指定名称的类名则移除，否则添加。
   * @param {String} cls 样式类名。
   */
  toggleCls(cls) {
    let list = this.classList;

    if (list.contains(cls))
      list.remove(cls);
    else
      list.add(cls);
  },
  /**
   * 添加样式类名，并在指定的时间后移除该样式。
   * @param {String} cls 添加的样式类名。
   * @param {Number} [delay] 延时移除样式类名的时间，单位为毫秒，默认为1300。
   */
  transCls(cls, delay) {
    this.addCls(cls);
    this.removeCls.delay(this, delay ?? 1300, cls);
  },
  /**
   * 判断元素的样式类名列表中是否包含指定的样式类名。
   * @param {String} cls 样式类名。
   * @return {Boolean} true包含，false未包含。
   */
  containsCls(cls) {
    return this.classList.contains(cls);
  },
  /**
   * 设置元素指定样式属性的值。
   * @param {String} property 样式属性名称。
   * @param {Object} value 样式属性值。
   * @param {String} [priority] 优先级字符串，如"important"。
   */
  setStyle(property, value, priority) {
    this.style.setProperty(property, value, priority);
  },
  /**
   * 获取元素指定样式属性的值。
   * @param {String} property 样式属性名称。
   * @return {Object} 样式属性值。
   */
  getStyle(property) {
    return this.style.getPropertyValue(property);
  },
  /**
   * 删除元素指定名称的样式属性。如果移除后元素的style为空，将删除style属性。
   * @param {String} property 样式属性名称。
   */
  removeStyle(property) {
    this.style.removeProperty(property);
  },
  /**
   * 返回通过计算后获得的样式值。详细说明请参考{#%getComputedStyle|api:window/getcomputedstyle}方法。
   * @return {CSSStyleDeclaration} 样式值。
   */
  computeStyle() {
    return getComputedStyle(this);
  },
  /**
   * 隐藏该元素。
   * @return {Element} 元素本身。
   */
  hide() {
    this.visible = false;
    return this;
  },
  /**
   * 显示该元素。
   * @return {Element} 元素本身。
   */
  show() {
    this.visible = true;
    return this;
  },
  /**
   * 设置元素的宽度。
   * @param {Number/String} value 元素的宽度。如果值为数值，默认单位为px。
   */
  setWidth(value) {
    this.width = value;
  },
  /**
   * 设置元素的高度。
   * @param {Number/String} value 元素的高度。如果值为数值，默认单位为px。
   */
  setHeight(value) {
    this.height = value;
  },
  /**
   * 设置元素的x坐标。
   * @param {Number/String} value 元素的x坐标。如果值为数值，默认单位为px。
   */
  setX(value) {
    this.x = value;
  },
  /**
   * 设置元素的y坐标。
   * @param {Number/String} value 元素的x坐标。如果值为数值，默认单位为px。
   */
  setY(value) {
    this.y = value;
  }
});
Object.defineProperties(Element.prototype, {
  plainIcon: {
    /** @property {Boolean} plainIcon 该元素下所有的图标是否使用统一的图标色。 @setter */
    set(value) {
      if (this.plainIcon$ !== value) {
        this.plainIcon$ = value;
        this.setCls(value, 'w-plain-icon');
      }
    },
    /** @property {Boolean} plainIcon @getter */
    get() {
      return !!this.plainIcon$;
    },
    configurable: true
  },
  /** @property {Element} - 首个可以设置焦点的子元素。未找到返回null。 @getter */
  firstFocusableChild: {
    get() {
      return this.query('[tabindex]:not([tabindex="-1"])');
    },
    configurable: true
  },
  /** @property {Boolean} - 当前元素是否为INPUT或TEXTAREA元素。 @getter */
  isInput: {
    get() {
      let tagName = this.tagName;
      return tagName == 'TEXTAREA' || tagName == 'INPUT';
    },
    configurable: true
  },
  /** @property {Element} - 返回一个指向最近的包含该元素的定位元素。未找到返回{#globalThis.BodyEl}。 @getter */
  posParent: {
    get() {
      return this.offsetParent ?? BodyEl;
    },
    configurable: true
  },
  cls: {
    /** 
     * @property {String} cls 添加到元素的以空格分隔的多个样式类名。区别于className属性，
     * 设置该属性将增量添加类名。如果值为空无任何效果。
     * @setter
     */
    set(cls) {
      if (cls) {
        //不可使用className相加，会导致重复
        let classList = this.classList;
        //如果是单个cls避免使用split方法
        if (cls.includes(' ')) {
          let list = [];
          cls.split(' ').forEach(clsName => {
            clsName = clsName.trim();
            if (clsName)
              list.push(clsName);
          });
          classList.add(...list);
        } else {
          classList.add(cls);
        }
      }
    },
    /** @property {String} cls 元素的样式类名称，取值同className属性一致。 @getter */
    get() {
      return this.className;
    },
    configurable: true
  },
  border: {
    /**
     * @property {Enum/Number/String} border 元素边界。如果值为数值，默认单位为px。如需设置更多请访问{#style}属性。
     * -true: 设置全部边界为"thin"。
     * -false: 无边界。
     * -'top': 仅上边界为"thin"。
     * -'right': 仅右边界为"thin"。
     * -'bottom': 仅下边界为"thin"。
     * -'left': 仅左边界为"thin"。
     * @setter
     */
    set(val) {
      let me = this, oldValue = me.border$;

      if (oldValue !== val) {
        me.border$ = val;
        if (oldValue != null) {
          if (!String(oldValue).includes(' '))
            me.removeCls('w-bd-' + oldValue);
          me.removeStyle('border');
        }
        if (val == 'top' || val == 'right' || val == 'bottom' || val == 'left')
          me.addCls('w-bd-' + val);
        else if (val === true)
          me.addCls('w-bd-true');
        else if (val === false || val === 0)
          me.setStyle('border', 0);
        else if (String(val).includes(' '))
          me.setStyle('border', val);
        else
          me.setStyle('border', Wb.px(val) + ' solid ' + Wb.configs.borderColor);
      }
    },
    /** @property {Enum/Number/String} border @getter */
    get() {
      return this.border$;
    },
    configurable: true
  },
  margin: {
    /** @property {Enum/Number/String} margin 组件外边距。如果值为数值，默认单位为px。如需设置更多请访问{#style}属性。
     * -true: 设置全部外边距为指定值的边距。
     * -false: 无边距。
     * -'top': 仅上边距。
     * -'right': 仅右边距。
     * -'bottom': 仅下边距。
     * -'left': 仅左边距。
     * @setter
     */
    set(val) {
      let me = this, oldValue = me.margin$;

      if (oldValue !== val) {
        me.margin$ = val;
        if (oldValue != null) {
          if (!String(oldValue).includes(' '))
            me.removeCls('w-margin-' + oldValue);
          me.removeStyle('margin');
        }
        if (val == 'top' || val == 'right' || val == 'bottom' || val == 'left')
          me.addCls('w-margin-' + val);
        else if (val === true)
          me.addCls('w-margin-true');
        else if (val === false || val === 0)
          me.setStyle('margin', 0);
        else
          me.setStyle('margin', Wb.px(val));
      }
    },
    /** @property {Enum/Number/String} margin @getter */
    get() {
      return this.margin$;
    },
    configurable: true
  },
  padding: {
    /** @property {Enum/Number/String} padding 组件内边距。如果值为数值，默认单位为px。如需设置更多请访问{#style}属性。
     * -true: 设置全部内边距为指定值的边距。
     * -false: 无边距。
     * -'top': 仅上边距。
     * -'right': 仅右边距。
     * -'bottom': 仅下边距。
     * -'left': 仅左边距。
     * @setter
     */
    set(val) {
      let me = this, oldValue = me.padding$;

      if (oldValue !== val) {
        me.padding$ = val;
        if (oldValue != null) {
          if (!String(oldValue).includes(' '))
            me.removeCls('w-pad-' + oldValue);
          me.removeStyle('padding');
        }
        if (val == 'top' || val == 'right' || val == 'bottom' || val == 'left')
          me.addCls('w-pad-' + val);
        else if (val === true)
          me.addCls('w-pad-true');
        else if (val === false || val === 0)
          me.setStyle('padding', 0);
        else
          me.setStyle('padding', Wb.px(val));
      }
    },
    /** @property {Enum/Number/String} padding @getter */
    get() {
      return this.padding$;
    },
    configurable: true
  },
  styleText: {
    /** 
     * @property {String} styleText 添加到元素的以分号分隔的多个样式。区别于设置style.cssText属性，
     * 设置该属性将增量添加样式。如果值为空无任何效果。
     * @setter
     */
    set(styleText) {
      if (styleText)
        this.style.cssText += styleText;
    },
    /** @property {String} styleText 样式字符串，同style.cssText属性一致。 @getter */
    get() {
      return this.style.cssText;
    },
    configurable: true
  },
  x: {
    /** @property {Number/String} x 元素的x坐标。如果值为数值，默认单位为px。 @setter */
    set(x) {
      this.style.setProperty('left', Wb.px(x));
    },
    /** @property {String} x @getter */
    get() {
      return this.style.getPropertyValue('left');
    },
    configurable: true
  },
  y: {
    /** @property {Number/String} y 元素的y坐标。如果值为数值，默认单位为px。 @setter */
    set(y) {
      this.style.setProperty('top', Wb.px(y));
    },
    /** @property {String} y @getter */
    get() {
      return this.style.getPropertyValue('top');
    },
    configurable: true
  },
  xy: {
    /** @property {Number[]} - 元素的[x, y]坐标值。如果值为数值，默认单位为px。 @setter */
    set(xy) {
      this.x = xy[0];
      this.y = xy[1];
    },
    /** @property {Number[]} xy @getter */
    get() {
      return [this.x, this.y];
    },
    configurable: true
  },
  width: {
    /** @property {Number/String} width 元素的宽度。如果值为数值，默认单位为px。 @setter */
    set(width) {
      this.style.setProperty('width', Wb.px(width));
    },
    /** @property {String} width @getter */
    get() {
      return this.style.getPropertyValue('width');
    },
    configurable: true
  },
  height: {
    /** @property {Number/String} height 元素的高度。如果值为数值，默认单位为px。 @setter */
    set(height) {
      this.style.setProperty('height', Wb.px(height));
    },
    /** @property {String} height @getter */
    get() {
      return this.style.getPropertyValue('height');
    },
    configurable: true
  },
  minWidth: {
    /** @property {Number/String} minWidth 元素的最小宽度。如果值为数值，默认单位为px。 @setter */
    set(width) {
      this.style.setProperty('min-width', Wb.px(width));
    },
    /** @property {String} minWidth @getter */
    get() {
      return this.style.getPropertyValue('min-width');
    },
    configurable: true
  },
  maxWidth: {
    /** @property {Number/String} maxWidth 元素的最大宽度。如果值为数值，默认单位为px。 @setter */
    set(width) {
      this.style.setProperty('max-width', Wb.px(width));
    },
    /** @property {String} maxWidth @getter */
    get() {
      return this.style.getPropertyValue('max-width');
    },
    configurable: true
  },
  minHeight: {
    /** @property {Number/String} minHeight 元素的最小高度。如果值为数值，默认单位为px。 @setter */
    set(height) {
      this.style.setProperty('min-height', Wb.px(height));
    },
    /** @property {String} minHeight @getter */
    get() {
      return this.style.getPropertyValue('min-height');
    },
    configurable: true
  },
  maxHeight: {
    /** @property {Number/String} maxHeight 元素的最大高度。如果值为数值，默认单位为px。 @setter */
    set(height) {
      this.style.setProperty('max-height', Wb.px(height));
    },
    /** @property {String} maxHeight @getter */
    get() {
      return this.style.getPropertyValue('max-height');
    },
    configurable: true
  },
  activated: {
    /** @property {Boolean} activated 当前元素是否具有焦点。 @getter */
    get() {
      return this.contains(document.activeElement);
    },
    configurable: true
  },
  layout: {
    /** 
     * @property {String} layout 元素的布局名称，多个名称使用空格分隔。元素的布局名称通常为其指定的样式名称，
     * 区别于设置{#cls}，设置新的布局名称将移除原有的布局名称。
     * @setter
     */
    set(layout) {
      let oldLayout = this.layout$;

      if (oldLayout !== layout) {
        let prefix = 'w-',
          classList = this.classList;

        this.layout$ = layout;
        //移除原layout的所有样式
        if (oldLayout) {
          if (oldLayout.includes(' ')) {
            oldLayout.split(' ').forEach(clsName => {
              clsName = clsName.trim();
              if (clsName)
                classList.remove(prefix + clsName);
            });
          } else {
            classList.remove(prefix + oldLayout);
          }
        }
        //添加新的layout样式
        if (layout) {
          if (layout.includes(' ')) {
            layout.split(' ').forEach(clsName => {
              clsName = clsName.trim();
              if (clsName)
                classList.add(prefix + clsName);
            });
          } else {
            classList.add(prefix + layout);
          }
        }
      }
    },
    /** @property {String} layout @getter */
    get() {
      return this.layout$;
    },
    configurable: true
  },
  visible: {
    /** @property {Boolean} visible 元素是否可见，隐藏后不保留占位空间。 @setter */
    set(visible) {
      this.setCls(!visible, 'w-disp-none');
    },
    /** @property {Boolean} visible @getter */
    get() {
      return !this.containsCls('w-disp-none');
    },
    configurable: true
  },
  appeared: {
    /** @property {Boolean} appeared 元素是否可见，隐藏后保留占位空间。 @setter */
    set(appeared) {
      this.setCls(!appeared, 'w-hidden');
    },
    /** @property {Boolean} appeared @getter */
    get() {
      return !this.containsCls('w-hidden');
    },
    configurable: true
  },
  bgColor: {
    /** @property {Boolean} bgColor 元素背景色。设置true使用"固定色"作为背景色，设置false使用默认背景色。 @setter */
    set(value) {
      let me = this, oldValue = me.bgColor$;

      if (oldValue !== value) {
        const fixedColor = 'w-fixed-bgcolor-x', mainColor = 'w-main-bgcolor-x';

        me.bgColor$ = value;
        if (oldValue) {
          if (String(oldValue) == 'true')
            me.removeCls(fixedColor);
          else if (String(oldValue) == 'false')
            me.removeCls(mainColor);
          else
            me.removeStyle('background');
        }
        if (String(value) == 'true')
          me.addCls(fixedColor);
        else if (String(value) == 'false')
          me.addCls(mainColor);
        else
          me.setStyle('background', value);
      }
    },
    /** @property {Boolean} bgColor @getter */
    get() {
      return this.bgColor$;
    },
    configurable: true
  },
  color: {
    /** @property {Boolean} color 元素字体色。设置true使用"激活色"作为字体色，设置false使用默认字体色。 @setter */
    set(value) {
      let me = this, oldValue = me.color$;

      if (oldValue !== value) {
        const activeColor = 'w-active-color-x', mainColor = 'w-main-color-x';

        me.color$ = value;
        if (oldValue) {
          if (String(oldValue) == 'true')
            me.removeCls(activeColor);
          else if (String(oldValue) == 'false')
            me.removeCls(mainColor);
          else
            me.removeStyle('color');
        }
        if (String(value) == 'true')
          me.addCls(activeColor);
        else if (String(value) == 'false')
          me.addCls(mainColor);
        else
          me.setStyle('color', value);
      }
    },
    /** @property {Boolean} color @getter */
    get() {
      return this.color$;
    },
    configurable: true
  },
  autoScroll: {
    /** @property {Boolean/String} autoScroll 当元素溢出时是否显示滚动条。 @setter
     * -true: 允许水平垂直滚动
     * -'x': 仅允许水平滚动
     * -'y': 仅允许垂直滚动
     * -'auto': 允许水平垂直滚动，且仅当鼠标悬停在元素上时显示滚动条
     * -'auto-x': 仅允许水平滚动，且仅当鼠标悬停在元素上时显示滚动条
     * -'auto-y': 仅允许垂直滚动，且仅当鼠标悬停在元素上时显示滚动条
     * -'hide': 允许水平垂直滚动，且始终隐藏滚动条
     * -'hide-x': 仅允许水平滚动，且始终隐藏滚动条
     * -'hide-y': 仅允许垂直滚动，且始终隐藏滚动条
     * -false: 禁止滚动且隐藏溢出内容
     */
    set(value) {
      let oldValue = this.autoScroll$;
      if (oldValue != value) {
        this.autoScroll$ = value;
        if (oldValue != null)
          this.removeCls('w-scroll-' + oldValue);
        if (value != null)
          this.addCls('w-scroll-' + value);
      }
    },
    /** @property {Boolean/String} autoScroll @getter */
    get() {
      return this.autoScroll$;
    },
    configurable: true
  }
});
/**
 * HTMLCollection的扩展类。关于HTMLCollection的更多说明请访问{#%HTMLCollection}。
 * @class HTMLCollection
 */
Wb.apply(HTMLCollection.prototype, {
  /**
   * 获取集合内某个子元素的索引号。该方法同Array的indexOf方法。
   */
  indexOf: Array.prototype.indexOf,
  /**
   * 对集合内每个元素执行一次给定的方法。该方法同forEach方法的区别为可以通过返回false中断遍历，
   * 并且可以逆向进行遍历。详见{#Wb.PT.arrayEach}方法。
   */
  each: Wb.PT.arrayEach,
  /**
   * 对集合内每个元素执行一次给定的方法。该方法同Array的forEach方法。
   */
  forEach: Array.prototype.forEach,
  /**
   * 判断列表内是否存在满足某个条件的元素。详见 {#Wb.PT.some} 方法。
   */
  some: Wb.PT.some,
  /**
   * 判断列表内所有元素是否均满足某个条件。详见 {#Wb.PT.every} 方法。
   */
  every: Wb.PT.every,
  /**
   * 类数组对象的查找单个元素的方法。该方法同Array的find方法。
   */
  find: Array.prototype.find,
  /**
   * 类数组对象的查找多个元素的方法。
   */
  filter: Array.prototype.filter
});
/**
 * NamedNodeMap的扩展类。关于NamedNodeMap的更多说明请访问{#%NamedNodeMap}。
 * @class NamedNodeMap
 */
Wb.apply(NodeList.prototype, {
  /**
   * 对NodeList内每个元素执行一次给定的方法。该方法同forEach方法的区别为可以通过返回false中断遍历，
   * 并且可以逆向进行遍历。详见{#Wb.PT.arrayEach}方法。
   */
  each: Wb.PT.arrayEach,
  /**
   * 判断NodeList内是否存在满足某个条件的元素。详见 {#Wb.PT.some} 方法。
   */
  some: Wb.PT.some,
  /**
   * 判断NodeList内所有元素是否均满足某个条件。详见 {#Wb.PT.every} 方法。
   */
  every: Wb.PT.every,
  /**
   * 类数组对象的查找单个元素的方法。该方法同Array的find方法。
   */
  find: Array.prototype.find,
  /**
   * 类数组对象的查找多个元素的方法。
   */
  filter: Array.prototype.filter
});
/**
 * 元素resize事件的观察器。通过ResizeObserver来实现对所有元素的resize事件支持。
 */
Cls['Wb.ResizeObserver'] = class resizeObserver extends Wb.Base {
  /** @property {Map} - 注册的事件map，key为元素，value为事件列表。 @priv */
  static eventMap = new Map();
  /** @property {ResizeObserver} - 获取观察器对象。 @priv */
  static get observer() {
    return this.observer$ ??= new ResizeObserver(this.resizeHandler.bind(this));
  }
  /**
   * resize事件发生时的处理方法。
   * @param {ResizeObserverEntry} entries 观察入口。
   * @priv
   */
  static resizeHandler(entries, a, b) {
    let entry, elEvents, i, j, event, el, eventMap = this.eventMap;

    for (entry of entries) {
      el = entry.target;
      elEvents = eventMap.get(el);
      if (elEvents) {
        j = elEvents.length;
        for (i = j - 1; i > -1; i--) {
          event = elEvents[i];
          event.eventFn(el);
          if (event.once)
            elEvents.splice(i, 1);
        }
        if (!elEvents.length) {
          eventMap.remove(el);
          this.observer.unobserve(el);
        }
      }
    }
  }
  /**
   * 注册元素的resize事件监听器。当元素大小发生变化时将触发事件。
   * @param {Object} event 事件配置对象。
   * @param {Function) event.fn 事件原始方法。
   * @param {Function) event.eventFn 经过包装后的事件处理方法。
   * @param {Element) event.el 被监听的dom元素。
   * @param {Object) [event.scope] 方法内的this对象，默认为被监听的组件。
   * @param {Boolean) [event.once] 事件是否单次执行，如果设置为true，事件执行一次后即被注销。
   * @param {Object} [event.options] 选项对象，事件配置的可选项，当事件方法运行时也将传递给参数。
   */
  static register(event) {
    let eventMap = this.eventMap,
      el = event.el,
      elEvents = eventMap.get(el);

    if (!elEvents) {
      elEvents = [];
      eventMap.set(el, elEvents);
      this.observer.observe(el);
    }
    elEvents.push(event);
  }
  /**
   * 注销元素的resize事件监听器。
   * @param {Object} event 事件配置对象。
   * @param {Function) event.fn 事件原始方法。
   * @param {Element) event.el 被监听的元素。
   */
  static unregister(event) {
    let elEvents,
      el = event.el,
      fn = event.fn;

    elEvents = this.eventMap.get(el);
    if (elEvents) {
      elEvents.removeBy(evt => evt.el === el && evt.fn === fn);
      if (!elEvents.length) {
        this.eventMap.remove(el);
        this.observer.unobserve(el);
      }
    }
  }
}
/**
 * 全局快捷键类。在全局按键时执行指定方法或执行按钮的点击事件。
 */
Cls['Wb.Keys'] = class keys extends Wb.Base {
  /**
   * 添加指定按键/键组合的全局监听。按该键/键组合后，将执行指定的方法或绑定按钮的点击事件方法。\
   * 按键被处理后将停止按键默认行为并立即停止事件传播。如果添加的按键监听重复，系统会选择最后
   * 一次添加且有效的方法或按钮点击事件来执行。
   * Example:
   *
   *     Wb.Keys.add('Ctrl+Shift+Alt+Meta+S', saveFunction);
   *     Wb.Keys.add('Alt+E', button);
   *     Wb.Keys.add('Ctrl+V|Ctrl+Shift+V', menuItem);
   *
   * @param {String} keys 键或键组合。组合键使用“+”连接。多组键之间使用"|"连接。按键定义详见全局变量Keys定义。
   * @param {Function/Wb.Button} object 执行的方法或按钮。后者在可见且有效的情况下才执行点击事件。
   */
  static add(keys, object) {
    let map = this.map, array;
    if (!map) {
      map = this.map = {};
      addEventListener('keydown', e => this.onKeyDown(e), { capture: true });
    }
    keys.split('|').forEach(key => {
      key = key.trim();
      array = map[this.fixKey(key)] ??= [];
      if (!array.includes(object))
        array.push(object);
    });
  }
  /**
   * 移除使用{#add}方法添加的按键/键组合的全局监听。
   * @param {String} key 键或键组合。组合键使用“+”连接。多组键之间使用"|"连接。按键定义详见{#Keys}。
   * @param {Function/Wb.Button} object 按键时执行的方法或按钮。
   */
  static remove(keys, object) {
    let map = this.map, array;
    keys.split('|').forEach(key => {
      key = key.trim();
      key = this.fixKey(key);
      array = map?.[key];
      if (array) {
        array.remove(object);
        if (!array.length)
          delete map[key];
      }
    });
  }
  /**
   * 把键码修正为键标准码。
   * @param {String} keys 键码。
   * @return {String} 键标准码。
   */
  static fixKey(keys) {
    let index;

    index = keys.lastIndexOf('+');
    if (index == -1)
      return Keys[keys] ?? keys;
    else {
      let fixed = '', lastKey = keys.substr(index + 1);
      keys += '+';
      if (keys.includes('Ctrl+'))
        fixed = 'Ctrl+';
      if (keys.includes('Shift+'))
        fixed += 'Shift+';
      if (keys.includes('Alt+'))
        fixed += 'Alt+';
      if (keys.includes('Meta+'))
        fixed += 'Meta+';
      //无实体键直接返回
      if (keys.length == fixed.length)
        return fixed.slice(0, -1);
      //带实体键
      return fixed + (Keys[lastKey] ?? lastKey);
    }
  }
  /**
   * 全局按键时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  static onKeyDown(e) {
    let key = '', array, cmdAsCtrl = Wb.configs.cmdAsCtrl;
    if (e.ctrlKey || cmdAsCtrl && e.metaKey)
      key = 'Ctrl+';
    if (e.shiftKey)
      key += 'Shift+';
    if (e.altKey)
      key += 'Alt+';
    if (!cmdAsCtrl && e.metaKey)
      key += 'Meta+'
    array = this.map[key.slice(0, -1)];
    if (!array) {
      key += e.code;
      array = this.map[key];
    }
    array?.each(item => {
      if (Wb.isFunction(item)) {
        item(e);
      } else {
        if (item.isOffenKeys) {
          if (item.stopEvent)
            e.stopEvent();
        } else {
          let mainCard = item.up(p => p.parent?.mainTab);
          //模块页面隐藏直接返回
          if (mainCard && !mainCard.visible)
            return;
          if (item.stopEvent)
            e.stopEvent();
          let isMenu = item.isMenuItem;
          //按钮要有效，且非菜单按钮必须可见
          if (item.disabled || !item.visible || !item.appeared || !item.el.isConnected ||
            !isMenu && (!item.isVisible() || !item.isAppeared()))
            return;
          //如果是菜单且通过按钮触发显示，则该按钮必须可见
          if (isMenu) {
            let menuButton = item.up(parent => parent instanceof Wb.Button && !parent.isMenuItem);
            if (menuButton && (!menuButton.isVisible() || !menuButton.isAppeared()))
              return;
          }
          let win = Wb.activeWindow;
          //如果有模态窗口，且窗口不包含该按钮直接返回
          if (win?.modal && !win.contains(item))
            return;
          //如果按钮任意上级元素包含maskComp直接返回
          if (item.el.bubbleSome(parent => parent.maskComp))
            return;
        }
        item.fireClick(e);
      }
      return false;
    }, true, true);
  }
}
/**
 * 字典数据类。
 */
Cls['Wb.Dict'] = class dict extends Wb.Base {
  /**
   * 通过字典数据列表来创建对话框窗口。当关闭该窗口时默认将隐藏。 @priv
   * @param {Array} items 字典数据列表。
   * @param {Object} [configs] 窗口配置项对象。
   * @return {Wb.Window} 生成的对话框实例。
   */
  static createWindow(items, configs) {
    let comp, showGroupTitle, nullGroupTitle, groupTitle, lastTitle, title, value, cfg, cname, titleCt = 0,
      firstTitle, comps = [];
    const keys = ['colspan', 'editFill', 'tagProperties'];

    groupTitle = configs?.groupTitle;
    nullGroupTitle = groupTitle == null;
    showGroupTitle = groupTitle ?? true;
    items.forEach(item => {
      if (!item)
        return;
      groupTitle = Wb.optText(item.groupTitle);
      if (showGroupTitle && groupTitle && (lastTitle != groupTitle || !lastTitle)) {
        title = { cname: 'title', title: groupTitle };
        firstTitle ??= title;
        comps.push(title);
        titleCt++;
      }
      cname = item.cname || 'text';
      comp = Wb.apply({}, item, { groupTitle, text: Wb.optText(item.text) });
      if (value = item.colspan)
        comp.gridColumn = 'span ' + value;
      keys.forEach(key => delete comp[key]);
      if (comp.keyName && (cname == 'text' || cname == 'textArea' || cname == 'number'))
        cname = 'select';
      comp.cname = cname;
      comps.push(comp);
      if (item.editFill)
        comps.push({ cname: 'fill' });
      lastTitle = groupTitle;
    });
    //未显式显示groupTitle且仅为一个title时移除
    if (nullGroupTitle && titleCt < 2) {
      if (firstTitle)
        comps.remove(firstTitle);
      showGroupTitle = false;
    }
    cfg = {
      resetDialog: true, layout: 'grid1', tableStyle: showGroupTitle, width: '65em', autoGrid: true,
      items: comps, minButtonWidth: '6em'
    };
    if (configs)
      Wb.apply(cfg, configs);
    return new Wb.Window(cfg);
  }
  /**
   * 通过指定字典数据条目名称列表来创建对话框窗口。当关闭该窗口时默认将隐藏。
   * @param {Array/String} items 字典条目名称列表，如果为字符串表示以","分隔的多个名称。
   * @param {Function} callback 成功生成窗口后的回调函数。this指向生成的窗口。
   * @param {Wb.Window} .win 生成的窗口。
   * @param {Object} [configs] 窗口配置项对象。
   */
  static loadWindow(items, callback, configs) {
    let me = this;
    if (Wb.isString(items))
      items = items.split(',');
    items ??= [];
    Wb.ajax({
      url: 'get-dict?xaction=getItems',
      data: { items },
      json: true,
      success(resp) {
        let win = me.createWindow(me.getDictEditors(resp), configs);
        callback?.call(win, win);
      }
    });
  }
  /**
   * 通过字典条目列表获取编辑组件列表。
   * @param {Array} items 字典条目列表。
   * @return {Array} 编辑组件列表。
   */
  static getDictEditors(items) {
    let result = [], object, value;
    const keys = ['text', 'groupTitle', 'cname', 'maxLength', 'decimalCount', 'height', 'hint', 'required',
      'readonly', 'colspan', 'hint', 'editFill', 'keyName'];
    items.forEach(item => {
      object = Wb.applyValueWith({}, item, keys);
      result.push(object);
      if (Wb.isNumeric(object.height))
        object.height += 'em';
      if (value = item.editType)
        object.valueType = value;
      if (value = item.validateScript)
        object.validator = Wb.parse('function(value){' + value + '\n}');
      if (value = item.editTags)
        Wb.apply(object, Wb.parse(value));
      object.cid ??= item.id.afterItem('.');
      object.text ??= object.cid;
    });
    return result;
  }
  /**
   * 通过表格列列表获取编辑组件列表。
   * @param {Array} columns 表格列列表。
   * @param {Array/String} [fieldNames] 包含列的字段名称列表及顺序。缺省包含全部列。如果为字符串表示逗号分隔的名称列表。
   * @return {Array} 编辑组件列表。
   */
  static getColumnEditors(columns, fieldNames) {
    let items = [], fieldName, value, object;

    if (Wb.isString(fieldNames))
      fieldNames = fieldNames.splitTrim();
    columns.forEach(col => {
      fieldName = col.fieldName;
      if (col.editor && (!fieldNames || fieldNames.includes(fieldName))) {
        object = Wb.apply({ cid: fieldName, text: col.text }, col.editor);
        if (Wb.isString(value = object.validateScript)) {
          object.validator = Wb.parse('function(value){' + value + '\n}');
          delete object.validateScript
        }
        if (value = object.tagProperties) {
          Wb.apply(object, Wb.parse(value));
          delete object.tagProperties;
        }
        items.push(object);
      }
    });
    if (fieldNames) {
      items.sort((a, b) => {
        return fieldNames.indexOf(a.cid) - fieldNames.indexOf(b.cid);
      });
    }
    return items;
  }
  /**
   * 通过表格列来创建对话框窗口。当关闭该窗口时默认将隐藏。 @priv
   * @param {Array} columns 表格列列表。
   * @param {Array/String} [fieldNames] 包含列的字段名称列表。缺省包含全部列。如果为字符串表示逗号分隔的名称列表。
   * @param {Object} [configs] 窗口配置项对象。
   * @return {Wb.Window} 生成的对话框实例。
   */
  static createColWindow(columns, fieldNames, configs) {
    return this.createWindow(this.getColumnEditors(columns, fieldNames), configs);
  }
}
/**
 * 模板是一组用于定义数据按指格式输出的字符串。模板生成的源码sourceURL名为system.template，
 * 可以方便地在控制台下定位到该源码页进行调试。
 * # 示例1: 数据为对象
 *
 *     let tpl = new Wb.Template("<h1>{title}</h1><ul>{for data.rows}<li class='w-item {cls}'>{text}</li>{/for}</ul>");
 *     console.log(tpl.apply({title: 'My Title', rows: [{cls: 'foo',text: 'item1'}, {cls: 'bar',text: 'item2'}]}));
 *
 * # 示例2: 数据为数组
 *
 *     let tpl = new Wb.Template("<ul>{for}<li class='w-item {cls}'>{[index]}:{text}</li>{/for}");
 *     console.log(tpl.apply([{cls: 'foo',text: 'item1'}, {cls: 'bar',text: 'item2'}]));
 *
 * # 示例3: 数据为多级
 *
 *     let tpl = new Wb.Template("<h1>{title}</h1><ul>{for data.rows}<li class='w-item {cls}'>"+
 *       "{text}{for value.items}<span>{[value1]}</span>{/for}</li>{/for}</ul>");
 *     console.log(tpl.apply({title: 'My Title', rows: [{cls: 'foo',text: 'item1', items:[1, 2, 3]}, 
 *       {cls: 'bar',text: 'item2', items:[4, 5, 6]}]}));
 *
 * # 取值
 * 取值是指获取数据中的指定元素的值，并在当前位置添加到输出的字符串中。其语法为{data.name}，name是指元素的名称，
 * 当获取顶层元素时"data."可以被省略。多级元素可以使用"."来引用，例如{data.foo.bar}。以"**"开头的表达式表示HTML。
 * Example: 
 *
 *     样本数据: {field: 'abc', foo: {bar: 3}} 
 *     <span>{field}</span><span>{data.foo.bar}</span>
 *
 * # 使用循环
 * 循环的语法为{for root}...{/for}，root为需要遍历数据的根节点，如果数据本身为数组，则root可以省略。
 * Example: 
 *
 *     {for}...{/for} //遍历数据本身，一般数据为数组类型
 *     {for data.myArray}...{/for} //遍历对象中名称为myArray的元素
 *
 * data指向填充模板的数据本身。
 * 在循环内可以使用3个参数: 
 * -{{value}}: 当前遍历的元素
 * -{{index}}: 当前元素的索引值
 * -{{array}}: 遍历的数组本身
 * 如果循环内存在着嵌套的循环，其内第一层循环的参数名称分别为value1, index1, array1，
 * 第二层循环的参数名称分别为value2,index2, array2，以下依此类推。
 * # 使用条件判断
 * 条件判断的语法为{if expression}...{elseif expression}...{else}...{/if}
 * expression为任意有效的布尔表达式，elseif等于语句else if，else等于语句else。
 * 其中elseif和else语句可以被省略。
 * Example: 
 *
 *     样本数据: {field: 7, value: 'demo'} 
 *     {if data.field1 > 10}text1{elseif data.field1 < 8 && data.field1 >= 5}{value}{else}text3{/if}
 *
 * # 使用表达式获取值
 * 在模板中可以使用任意表达式来获取值，表达式的语法为{[expression]}
 * expression为任意有效的表达式，表达式返回的值为获取的值。
 * Example: 
 *
 *     {[this.myMethod(data.field1)]}
 *     {[data.field1 >= data.field2 ? data.field3 : data.field4]}
 *
 * # 在模板中插入任意代码
 * 在模板中的当前位置可以插入任意的代码，插入任意代码的语法为{%code%}
 * code为任意代码，将直接在当前位置插入该代码，并直接输出到模板编译得到的方法中。
 * Example: 
 *
 *     {%for(let i = 0; i < 10; i++){%}
 *       foo {field1} bar
 *     {%}%}
 *
 */
Cls['Wb.Template'] = class template extends Wb.Base {
  /** @property {Function} parseFn 用于解析模板的函数。 @priv */

  /**
   * 模板的构造方法。如果模板为字符串在构造时将自动编译模板为函数。
   * @param {String/Function} tpl 字符串模板或模板函数。
   */
  constructor(tpl) {
    super(tpl);
    this.tpl = tpl;
  }
  /**
   * 把数据填充到模板中并返回获得的字符串。
   * @param {Object} [data] 数据，可以为对象，数组或其它任意有效值。
   * @param {Object} [option] 可选参数。
   * @return {String} 获得的字符串。
   */
  apply(data, option) {
    return this.parseFn(data, option);
  }
  /** @property {String/Function} - 字符串模板或模板函数。 */
  set tpl(tpl) {
    this.tpl$ = tpl;
    this.parseFn = Wb.isFunction(tpl) ? tpl : this.compile(tpl);
  }
  /***/
  get tpl() {
    return this.tpl$;
  }
  /**
   * 把字符串模板编译成函数型模板。
   * @param {String} tpl 字符串模板。
   */
  compile(tpl) {
    let start, begin, end, bchar, pos, script, forCount, exp, word, isHtml, paramIndex;
    forCount = 0;
    start = 0;
    begin = tpl.indexOf("{");
    end = tpl.indexOf("}", begin + 2);
    script = 'let s="";\n';
    while (begin != -1 && end > begin) {
      if (begin > start)
        script += 's+=' + Wb.encode(tpl.substring(start, begin)) + ';\n';
      pos = begin + 1;
      bchar = tpl.charAt(pos);
      if (bchar === '[') {
        //取任意表达式的值
        end = tpl.indexOf("]}", begin + 2);
        exp = tpl.substring(pos + 1, end);
        if (exp.startsWith('**'))
          script += 's+=' + exp.substr(2) + ';\n';
        else
          script += 's+=Wb.toHTML(' + exp + ');\n';
        end++;
      } else if (bchar === '%') {
        //在生成的模板函数中嵌入任意代码
        end = tpl.indexOf("%}", begin + 2);
        script += tpl.substring(pos + 1, end) + '\n';
        end++;
      } else if (tpl.substr(pos, 3) === 'for') {
        forCount++;
        word = tpl.substring(pos + 3, end).trim();
        if (word) {
          if (!word.includes('.')) {
            script += 'data.' + word;
          } else {
            script += word;
          }
        } else {
          script += 'data';
        }
        paramIndex = forCount > 1 ? (forCount - 1).toString() : '';
        //第2个循环的参数名称分别为value1, index1, arr1，第3个循环的参数依此类推
        script += `.forEach((value${paramIndex}, index${paramIndex}, arr${paramIndex})=>{\n`;
      } else if (tpl.substr(pos, 5) === '/for}') {
        forCount--;
        script += '});\n';
      } else if (tpl.substr(pos, 2) === 'if') {
        script += 'if(' + tpl.substring(pos + 2, end).trim() + '){\n';
      } else if (tpl.substr(pos, 6) === 'elseif') {
        script += '}else if(' + tpl.substring(pos + 6, end).trim() + '){\n';
      } else if (tpl.substr(pos, 5) === 'else}') {
        script += '}else{\n';
      } else if (tpl.substr(pos, 4) === '/if}') {
        script += '}\n';
      } else {
        //取值并添加到字符串中
        word = tpl.substring(pos, end);
        isHtml = word.startsWith('**');
        if (isHtml)
          word = word.substr(2);
        if (!word.includes('.')) {
          if (forCount > 0)
            exp = `value${paramIndex}["${word}"]`;
          else
            exp = 'data["' + word + '"]';
        } else
          exp = word;
        if (isHtml)
          script += 's+=' + exp + ';\n';
        else
          script += 's+=Wb.toHTML(' + exp + ');\n';
      }
      start = end + 1;
      begin = tpl.indexOf("{", start);
      end = tpl.indexOf("}", begin + 2);
    }
    if (start < tpl.length)
      script += 's+=' + Wb.encode(tpl.substr(start)) + ';\n';
    script += 'return s;\n' + Wb.getSourceURL('system/template');
    return new Function('data', 'options', script);
  }
}
/**
 * 数学工具类。
 */
Cls['Wb.Math'] = class math extends Wb.Base {
  /**
   * 判断两个矩形是否相交。
   * Example: 
   * 
   *     let result = Wb.Math.intersect({x: 10, y: 50, right: 200, bottom: 100}, 
   *                  {x: 10, y: 30, right: 300, bottom: 400});
   *     //result值为: true
   * 
   * @param {Object} rect1 矩形对象1，成员x, y, right, bottom分别表示矩形的左，顶，右，底值。
   * @param {Object} rect2 矩形对象2，成员x, y, right, bottom分别表示矩形的左，顶，右，底值。
   * @return {Booleant} true相交，false不相交。
   */
  static intersect(rect1, rect2) {
    let l = Math.max(rect1.x, rect2.x),
      t = Math.max(rect1.y, rect2.y),
      r = Math.min(rect1.right, rect2.right),
      b = Math.min(rect1.bottom, rect2.bottom);

    return b > t && r > l;
  }
  /**
   * 获取矩形的指定位置点的XY坐标。
   * Example: 
   * 
   *     Wb.Math.getPointXY({x: 10, y: 50, right: 200, bottom: 100}, 'c'); //输出: [105, 75]
   * 
   * @param {Object} rect 矩形对象，成员x, y, right, bottom分别表示矩形的左，顶，右，底值。
   * @param {String} position 位置，有效位置: 
   * -tl: 左上角
   * -t: 上边中间位置
   * -tr: 右上角
   * -l: 左边中间位置
   * -c: 中心位置
   * -r: 右边中间位置
   * -bl: 左下角
   * -b: 下边中间位置
   * -br: 右下角
   * @return {Number[]} [x, y]组成的坐标。
   */
  static getPointXY(rect, position) {
    let xy, xc = (rect.right - rect.x) / 2, yc = (rect.bottom - rect.y) / 2;
    switch (position) {
      case 'tl':
        xy = [rect.x, rect.y];
        break;
      case 'bl':
        xy = [rect.x, rect.bottom];
        break;
      case 'tr':
        xy = [rect.right, rect.y];
        break;
      case 'c':
        xy = [xc, yc];
        break;
      case 't':
        xy = [xc, rect.y];
        break;
      case 'l':
        xy = [rect.x, yc];
        break;
      case 'r':
        xy = [rect.right, yc];
        break;
      case 'b':
        xy = [xc, rect.bottom];
        break;
      case 'br':
        xy = [rect.right, rect.bottom];
        break;
    }
    return xy;
  }
  /**
   * 获取矩形的指定位置点的XY坐标移动到目标XY坐标时，该矩形的XY坐标。
   * Example: 
   * 
   *     Wb.Math.getMoveToPointXY({x: 10, y: 50, right: 200, bottom: 100}, 'c', [100, 200]);//输出: [5, 175]
   * 
   * @param {Object} rect 矩形对象，成员x, y, right, bottom分别表示矩形的左，顶，右，底值。
   * @param {String} position 位置，有效位置: 
   * -tl: 左上角
   * -t: 上边中间位置
   * -tr: 右上角
   * -l: 左边中间位置
   * -c: 中心位置
   * -r: 右边中间位置
   * -bl: 左下角
   * -b: 下边中间位置
   * -br: 右下角
   * @param {Number[]} toXY 移动到目标位置[x, y]。
   * @return {Number[]} [x, y]组成的坐标。
   */
  static getMoveToPointXY(rect, position, toXY) {
    let xy,
      toX = toXY[0],
      toY = toXY[1],
      width = rect.right - rect.x,
      height = rect.bottom - rect.y,
      xc = toX - width / 2,
      yc = toY - height / 2;
    switch (position) {
      case 'tl':
        xy = [toX, toY];
        break;
      case 'bl':
        xy = [toX, toY - height];
        break;
      case 'tr':
        xy = [toX - width, toY];
        break;
      case 'c':
        xy = [xc, yc];
        break;
      case 't':
        xy = [xc, toY];
        break;
      case 'l':
        xy = [toX, yc];
        break;
      case 'r':
        xy = [toX - width, yc];
        break;
      case 'b':
        xy = [xc, toY - height];
        break;
      case 'br':
        xy = [toX - width, toY - height];
        break;
    }
    return xy;
  }
  /**
   * 获取源矩形按指定方式对齐到目标矩形时，源矩形的x, y坐标和调整大小后的宽高值。
   * @param {Object} sourceRect 源矩形对象，成员x, y, right, bottom分别表示矩形的左，顶，右，底值。
   * @param {Object} destRect 目标矩形对象，成员x, y, right, bottom分别表示矩形的左，顶，右，底值。
   * @param {String} position 对齐方式。对齐方式请参考{#Element.alignTo}。
   * @param {Number} restrictWidth 限制宽度。
   * @param {Number} restrictHeight 限制高度。
   * @param {String/Boolean} [autoSize] 是否允许调整源矩形大小，以对齐到最佳位置。仅当对齐方式末尾带"?"时有效。
   * @param {Number[]} [offset] [x, y]组成的偏移量。
   * @return {Object} [x, y, width, height]坐标和宽高值组成的对象。
   */
  static getAlignPosition(sourceRect, destRect, position, restrictWidth, restrictHeight, autoSize, offset) {
    let x, y, ox, oy, toXY, sourcePos, destPos, restrict, divPos, offsetX, offsetY;

    offsetX = offset ? offset[0] : 0;
    offsetY = offset ? offset[1] : 0;
    restrict = position.endsWith('?');
    divPos = position.indexOf('-');
    if (divPos === -1)
      sourcePos = 'tl'; //缺省源位置默认为tl
    else
      sourcePos = position.substring(0, divPos);
    if (restrict)
      destPos = position.slice(divPos + 1, -1);
    else
      destPos = position.substr(divPos + 1);
    toXY = this.getPointXY(destRect, destPos);
    [x, y] = this.getMoveToPointXY(sourceRect, sourcePos, toXY);
    //设置偏移量
    if (offsetX)
      x += offsetX;
    if (offsetY)
      y += offsetY;
    if (!restrict)
      return { x, y };
    let sourcePos0, sourcePos1, destPos0, destPos1, rect, reverseRight, reverseBottom,
      width, height, restrictX, restrictY, sourceWidth = sourceRect.right - sourceRect.x,
      sourceHeight = sourceRect.bottom - sourceRect.y;

    ox = x;
    oy = y;
    //限制到视口内
    restrictX = restrictWidth - sourceWidth;
    restrictY = restrictHeight - sourceHeight;
    x = x.constrain(0, restrictX);
    y = y.constrain(0, restrictY);
    rect = { x, y, right: x + sourceWidth, bottom: y + sourceHeight };
    //移动后源矩形同目标矩形相交时
    if (this.intersect(destRect, rect) || rect.right > restrictWidth || rect.bottom > restrictHeight) {
      //反转对齐方式
      toXY = this.getPointXY(destRect, sourcePos);
      [x, y] = this.getMoveToPointXY(sourceRect, destPos, toXY);
      if (offsetX || offsetY) {
        //设置偏移量是否反转
        sourcePos0 = sourcePos[0];
        sourcePos1 = sourcePos[1];
        destPos0 = destPos[0];
        destPos1 = destPos[1];
        //检查水平是否反转
        if (sourcePos0 == 'l' && destPos0 == 'r' || sourcePos0 == 'r' && destPos0 == 'l' ||
          sourcePos1 == 'l' && destPos1 == 'r' || sourcePos1 == 'r' && destPos1 == 'l')
          offsetX = -offsetX;
        //检查垂直是否反转
        if (sourcePos0 == 't' && destPos0 == 'b' || sourcePos0 == 'b' && destPos0 == 't' ||
          sourcePos1 == 't' && destPos1 == 'b' || sourcePos1 == 'b' && destPos1 == 't')
          offsetY = -offsetY;
        x += offsetX;
        y += offsetY;
      }
      reverseRight = x + sourceWidth;
      reverseBottom = y + sourceHeight;
      if (x < 0) {
        if (autoSize === true || autoSize == 'width') {
          //判断反转和未反转水平区间哪个更大
          x = restrictWidth - ox > reverseRight ? ox : 0;
          width = Math.max(restrictWidth - ox, reverseRight);
        } else {
          x = ox;
          x = x.constrain(0, restrictX);
        }
      } else {
        x = x.constrain(0, restrictX);
      }
      if (y < 0) {
        if (autoSize === true || autoSize == 'height') {
          //判断反转和未反转垂直区间哪个更大
          y = restrictHeight - oy > reverseBottom ? oy : 0;
          height = Math.max(restrictHeight - oy, reverseBottom);
        }
        else {
          y = oy;
          y = y.constrain(0, restrictY);
        }
      } else {
        y = y.constrain(0, restrictY);
      }
    }
    return { x, y, width, height };
  }
  /**
   * 判断点是否位于矩形内。
   * Example: 
   * 
   *     Wb.Math.pointInRect([30, 91], {x: 10, y: 50, right: 200, bottom: 100}); //输出: true
   * 
   * @param {Number[]} point [x, y]坐标值组成的点位置。
   * @param {Object} rect 矩形对象，成员x, y, right, bottom分别表示矩形的左，顶，右，底值。
   * @return {Boolean} true位于矩形内，false矩形外。
   */
  static pointInRect(point, rect) {
    let [x, y] = point;

    return x >= rect.x && x <= rect.right && y >= rect.y && y <= rect.bottom;
  }
  /**
   * 判断一个矩形是否完全位于另一个矩形内。
   * Example: 
   * 
   *     Wb.Math.rectInRect({x: 5, y: 30, right: 20, bottom: 60}, 
   *       {x: 10, y: 50, right: 200, bottom: 100}); //输出: false
   * 
   * @param {Object} inRect 内矩形对象，成员x, y, right, bottom分别表示矩形的左，顶，右，底值。
   * @param {Object} outRect 外矩形对象，成员x, y, right, bottom分别表示矩形的左，顶，右，底值。
   * @return {Boolean} true inRect完全位于outRect内，false inRect不完全位于outRect内。
   */
  static rectInRect(inRect, outRect) {
    return inRect.right < outRect.right && inRect.x > outRect.x && inRect.y > outRect.y &&
      inRect.bottom < outRect.bottom;
  }
  /**
   * 获取两点之间的距离。
   * @param {Number[]} src [x, y]坐标值组成的源点位置。
   * @param {Number[]} dst [x, y]坐标值组成的目标点位置。
   * @return {Number} 距离。
   */
  static getDistance(src, dst) {
    let a = dst[0] - src[0], b = dst[1] - src[1];
    return Math.sqrt(a * a + b * b);
  }
}
/**
 * 编辑器生成类，用于对指定组件设置相关的属性和事件，使之成为可进行嵌入式编辑的组件。编辑时控件将浮动显示
 * 到指定元素位置，并布满整个元素。当控件确认值或失去焦点后将移除或销毁控件。在任何时候仅允许显示单个编辑器。
 * Example:
 *
 *     Wb.Editor.startEdit(div,{value: div.textContent, callback(ok, value){
 *       if (ok)
 *         div.textContent = value;
 *     }});
 *
 */
Cls['Wb.Editor'] = class editor extends Wb.Base {
  /** @property {Function} callback 当前编辑器完成编辑的回调事件。 @readonly @static */
  /** @property {Boolean} valueChanged 编辑器值是否改动了。 @static */
  /** @property {Wb.Text} activeEditor 当前正在编辑的编辑器。undefined表示无正在编辑的编辑器。 @readonly @static */
  /** @property {Element} el 编辑器显示到该元素所在位置。 @readonly @static */
  /**
   * 在指定元素所在位置显示编辑组件，在编辑完成之后移除或销毁编辑组件并执行回调方法。
   * @param {Element} el 把编辑器显示到该元素位置。
   * @param {Object} [configs] 可选的配置参数对象。
   * @param {Object} [.value] 编辑的值。默认为编辑控件当前值。
   * @param {Function} [.callback] 编辑完成之后的回调函数。
   * @param {Boolean} ..ok 是否正常完成编辑。true完成编辑，false取消编辑。
   * @param {Object} ..value 编辑后的值。
   * @param {Function} [.editing] 编辑时的回调函数。
   * @param {Object} ..value 编辑时的值。
   * @param {Wb.Text} [.editor] 编辑控件，缺省使用默认的文本编辑器。
   * @param {Boolean} [.isDestroy] 在编辑完成之后是否销毁组件，false移除，true销毁。
   * @param {Function} [.keydown] 按键时执行的回调方法。返回true表示按钮已经处理。
   * @param {Event} ..e 事件对象。
   */
  static startEdit(el, configs) {
    let me = this, editor = configs.editor;

    me.configs = configs;
    me.el = el;
    editor ??= me.stringEditor;
    el.addCls('w-editor-site');
    editor.cls = 'w-editor w-no-tip';
    me.activeEditor = editor;
    me.lastFocusEl = document.activeElement;
    editor.renderTo(el);
    if (editor.autoPadding) {
      let elStyle, wrapStyle = editor.wrapEl.computeStyle();

      if (el.containsCls('w-text-wrap'))
        elStyle = el.find('w-text').computeStyle();
      else
        elStyle = el.computeStyle();
      editor.inputEl.setStyle('padding', (parseFloat(elStyle.paddingTop) -
        parseFloat(wrapStyle.borderTopWidth)) + 'px ' +
        (parseFloat(elStyle.paddingRight) - parseFloat(wrapStyle.borderRightWidth)) + 'px ' +
        (parseFloat(elStyle.paddingBottom) - parseFloat(wrapStyle.borderBottomWidth)) + 'px ' +
        (parseFloat(elStyle.paddingLeft) - parseFloat(wrapStyle.borderLeftWidth)) + 'px');
    }
    if (editor instanceof Wb.Picker && editor.expanded$)
      editor.collapse();
    if (Wb.hasProperty(configs, 'value')) {
      if (configs.value == null)
        editor.clear();
      else
        editor.value = configs.value;
    }
    editor.on('change', me.onValueChange, me);
    editor.mon({
      scope: me,
      keydown: me.onKeydown,
      [Event.tapDownName]: { fn: me.onDocMouseDown, el: DocEl, capture: true }
    });
    editor.focus();
  }
  /**
   * 完成编辑，并移除编辑器。
   * @param {Boolean} [ok] true完成编辑，false取消编辑。
   */
  static finish(ok) {
    let me = this, editor = me.activeEditor, focusEl;

    if (!editor)
      return;
    let configs = me.configs, callback = configs.callback;
    editor.un('change', me.onValueChange);
    editor.mun({
      keydown: me.onKeydown,
      [Event.tapDownName]: { fn: me.onDocMouseDown, el: DocEl }
    });
    editor.removeCls('w-editor');
    if (configs.isDestroy)
      editor.destroy();
    else
      editor.remove();
    me.el.removeCls('w-editor-site');
    focusEl = me.lastFocusEl;
    if (focusEl?.isConnected)
      focusEl.focusOnly();
    delete me.configs;
    delete me.el;
    delete me.lastFocusEl;
    delete me.activeEditor;
    delete me.valueChanged;
    callback?.call(editor, ok, editor.value);
  }
  /**
   * 使编辑器完成正常的编辑，并移除编辑器。
   */
  static completeEdit() {
    this.finish(this.valueChanged);
  }
  /**
   * 使编辑器取消编辑，并移除编辑器。
   */
  static cancelEdit() {
    this.finish();
  }
  /**
   * 编辑器值改变时执行的方法。 @priv
   */
  static onValueChange(value) {
    this.configs.editing?.call(this, value);
    this.valueChanged = true;
  }
  /**
   * 在文档鼠标按下时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  static onDocMouseDown(e) {
    let editor = this.activeEditor, target = e.target;
    if (!editor.el.contains(target) && !editor.contains(target.getClosestComp()))
      this.completeEdit();
  }
  /**
   * 编辑器按键时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  static onKeydown(e) {
    let me = this, configs = me.configs;

    //防止容器所在的按键导航功能，如上下箭头导航
    e.stopPropagation();
    if (configs.keydown?.call(me, e))
      return;
    let keyCode = e.code;
    if (keyCode == Keys.Esc) {
      me.cancelEdit();
      e.stopEvent();
    } else if (e.isGoKey || keyCode == Keys.Tab) {
      if (e.target.tagName != 'TEXTAREA') {
        me.completeEdit();
        e.stopEvent();
      }
    }
  }
  /** @property {Wb.Text} - 共享的文本编辑器。 */
  static get stringEditor() {
    return this.stringEditor$ ??= new Wb.Text();
  }
}
/**
 * JavaScript的XMLHttpRequest对象。关于XMLHttpRequest的更多说明请访问{#%XMLHttpRequest}。
 * @class XMLHttpRequest
 */
/**
 * 同服务端数据进行交互的类。
 */
Cls['Wb.Request'] = class request extends Wb.Base {
  /**
   * 向服务器发送数据，并获得返回的内容。详见{#Wb.ajax}方法。
   */
  static ajax(configs, resolve) {
    let url, data, object, form, xhr, params, header, method, mask, isArray, type, download,
      uploadProgress, downloadProgress, onDownload, onUpload;

    if (Wb.isString(configs))
      configs = { url: configs };
    mask = configs.mask;
    uploadProgress = configs.uploadProgress;
    downloadProgress = configs.downloadProgress;
    onDownload = configs.onDownload;
    onUpload = configs.onUpload;
    xhr = new XMLHttpRequest();
    download = configs.download;
    if (configs.type)
      type = configs.type;
    else if (configs.json)
      type = 'json';
    else if (download)
      type = 'blob';
    xhr.rawType = type;
    xhr.jsonEName = configs.json;
    //type因为需要允许返回普通字符串，因此不在responseType中设置，改在回调内解码
    if (type && type != 'json')
      xhr.responseType = type;
    if (configs.timeout)
      xhr.timeout = configs.timeout;
    if (configs.wc)
      xhr.withCredentials = true;
    url = configs.url;
    method = configs.method?.toUpperCase() || 'POST';
    header = {
      'X-Requested-With': 'XMLHttpRequest',
      'W-Requested-With': 'XMLHttpRequest'
    };
    params = configs.params;
    if (configs.comps)
      params = Wb.apply(Wb.getValue(configs.comps), params);
    if (configs.data || configs.object) {
      object = configs.object;
      if (object) {
        header['Content-Type'] = 'application/json;charset=utf-8';
        header['Content-serialize'] = 'true';
        data = Wb.serialize(object);
      } else {
        data = configs.data;
        //默认content-type，可以在configs.header中重设
        if (Wb.isObject(data) || Wb.isArray(data)) {
          header['Content-Type'] = 'application/json;charset=utf-8';
          data = Wb.encode(data);
        }
      }
      if (params)
        url += (url.includes('?') ? '&' : '?') + Wb.encodeURL(params);
    } else {
      form = configs.form;
      //如果包含form或Element
      if (form || this.needForm(params)) {
        if (form === true)
          data = new FormData();
        else
          data = new FormData(form);
        if (params) {
          Wb.each(params, (k, v) => {
            isArray = Wb.isArray(v);
            //特殊的可迭代的值添加多个成员
            if (Wb.isIterable(v, true)) {
              let item, needAppend;
              for (item of v) {
                if (Wb.isObject(item) || Wb.isArray(item))
                  item = Wb.encode(item);
                if (needAppend) {
                  data.append(k, item);
                } else {
                  data.set(k, item);
                  needAppend = true;
                }
              }
              //如果v为空集设置为空值
              if (!needAppend)
                data.set(k, '');
            } else {
              if (Wb.isObject(v) || isArray)
                v = Wb.encode(v);
              data.set(k, v ?? '');
            }
          });
        }
      } else {
        data = params ? Wb.encodeURL(params) : undefined;
        //GET方法把参数添加到url
        if (data && method == 'GET') {
          url += (url.includes('?') ? '&' : '?') + data;
          data = undefined;
        }
        header['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
      }
    }
    xhr.open(method, url, configs.async ?? true, configs.user, configs.password);
    Wb.apply(header, configs.header);
    Wb.each(header, (k, v) => xhr.setRequestHeader(k, v));
    xhr.onloadend = e => {
      try {
        let params, response = xhr.response, status = xhr.status, ok = status == 200;

        //type为json时解码
        if (xhr.rawType == 'json') {
          if (!response) {
            response = null;
          } else if (response.startsWith('{') && response.endsWith('}') ||
            response.startsWith('[') && response.endsWith(']')) {
            try {
              response = Wb.decode(response);
            } catch (e) {
              //ignore
            }
          } else if (response == 'null')
            response = null;
          else if (response == 'undefined')
            response = undefined;
        }
        params = [configs.scope ?? xhr, response, xhr, e];
        xhr.ok = ok;
        if (ok) {
          if (download)
            this.download(xhr, Wb.isString(download) ? download : null, url);
        } else {
          if (configs.showError ?? true)
            this.processError(xhr);
        }
        configs.callback?.call(...params);
        resolve?.call(configs.scope ?? xhr, { response, xhr, e, ok });
        (ok ? configs.success : configs.failure)?.call(...params);
      } finally {
        if (mask)
          Wb.unmask(mask);
      }
    };
    if (mask !== false)
      mask = (uploadProgress || downloadProgress) ? Wb.progress(0, mask) : Wb.mask(mask);
    xhr.upload.onprogress = e => {
      if (e.lengthComputable) {
        let percent = e.loaded * 100 / e.total;
        onUpload?.call(xhr, percent);
        if (uploadProgress) {
          let msg;
          if (percent == 100) {
            if (Wb.isString(uploadProgress))
              msg = uploadProgress;
            else
              msg = Str.processing;
          }
          else
            msg = Str.uploading;
          Wb.progress([percent == 100 ? -1 : percent, msg], configs.mask);
        }
      }
    };
    xhr.onprogress = e => {
      if (e.lengthComputable) {
        let percent = e.loaded * 100 / e.total;
        onDownload?.call(xhr, percent);
        if (downloadProgress)
          Wb.progress([percent, Str.downloading], configs.mask);
      }
    };
    xhr.send(data);
    return xhr;
  }
  /**
   * 判断参数对象中的值是否包含需要使用FormData来提交的值。
   * @param {Object} params 参数对象。
   * @return {Boolean} true包含，false不包含。
   * @priv
   */
  static needForm(params) {
    return params && Wb.some(params, (a, v) => v instanceof Blob || Wb.isIterable(v, true));
  }
  /**
   * 把ajax返回的对象作为文件进行下载。
   * @param {XMLHttpRequest} xhr ajax请求对象。
   * @param {String} [filename] 下载的文件名，默认为自动获取。
   * @param {String} [url] 下载的url地址。
   * @priv
   */
  static download(xhr, filename, url) {
    let disposition = xhr.getResponseHeader('Content-Disposition');

    if (filename == null) {
      if (disposition && disposition?.indexOf('attachment') !== -1) {
        let matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition), name = matches?.['1'];
        if (name)
          filename = decodeURI(name.replace(/['"]/g, ''));
      }
    }
    if (url && !filename) {
      let pos = url.indexOf('?');
      if (pos != -1)
        url = url.substr(0, pos);
      pos = url.lastIndexOf('/');
      if (pos != -1)
        filename = url.substr(pos + 1);
    }
    Wb.downloadText(xhr.response, filename ?? 'download');
  }
  /**
   * 处理XHR错误信息。
   * @param {XMLHttpRequest} xhr ajax请求对象。
   * @param {Wb.Component} [target] 错误信息显示到该对象。缺省使用弹窗显示。
   */
  static processError(xhr, target) {
    let error, status = xhr.status;
    switch (status) {
      case 400:
        error = Str.e400;
        break;
      case 401:
      case 402:
        Wb.login();
        return;
      case 403:
        error = xhr.response;
        break;
      case 404:
        error = Str.e404;
        break;
      default:
        let jsonEName, type = xhr.rawType, response = xhr.response;
        switch (type) {
          case 'blob':
            response.text().then(text => {
              text ||= Str.serverError;
              if (target)
                target.text = text;
              else
                Wb.error(text);
            });
            return;
          case 'json':
            jsonEName = xhr.jsonEName;
            if (Wb.isObject(response) && Wb.isString(jsonEName))
              error = response[jsonEName];
            else
              error = response;
            break;
          case 'arraybuffer':
            error = new TextDecoder('utf-8').decode(new Uint8Array(response));
            break;
          case 'document':
            error = response.body.textContent;
            break;
          default:
            error = response;
        }
    }
    if (error == '$$Denied')
      error = Str.accessDeniedDownload;
    else
      error ||= Str.serverError;
    if (target)
      target.text = error;
    else
      Wb.error(error);
  }
}
/**
 * 为组件增加拖动功能。拖动的目标组件由target属性指定。
 */
Cls['Wb.Draggable'] = class draggable extends Wb.Configurable {
  static configs = {
    disabled: false
  };
  static protos = {
    /** @property {Number} - 开始拖动阈值。在水平或垂直方向至少拖过该值像素的距离时才开始拖动。 */
    threshold: 10,
    /** @property {Boolean} - 是否仅允许按鼠标主键时拖动。 */
    primaryButtonOnly: true,
    /** @property {Boolean} - 是否允许水平方向拖动。 */
    moveX: true,
    /** @property {Boolean} - 是否允许垂直方向拖动。 */
    moveY: true,
    /** @property {Boolean} - 拖动时是否隐藏{#targetEl}。默认显示。 */
    hideTarget: false,
    /** @property {Boolean} - 是否直接拖动目标元素本身。 */
    dragTarget: false,
    /** @property {Boolean} - 是否显示动画效果。 */
    animate: false,
    /** @property {Number} - 使用鼠标滚轮滚动后执行{#drag}方法的延时毫秒数。 */
    scrollDragDelay: 300,
    /** @property {Boolean} - 当设置{#disabled}为false时，是否强制启用。默认在移动设备上禁用拖放功能。 */
    forceEnabled: false,
    /** @property {Number} scrollStep 拖动时自动滚动的步长，以像素为单位。默认为30。 */
    scrollStep: 30,
    dragElSize: true,
    disabled$: true
  };
  /** @property {Number/String} maxWidth 拖动元素{#dragEl}的最大宽度。 */
  /** @property {Number/String} maxHeight 拖动元素{#dragEl}的最大高度。 */
  /** @property {Number} minX 限制拖动x坐标最小值。 */
  /** @property {Number} minY 限制拖动Y坐标最小值。 */
  /** @property {Number} maxX 限制拖动x坐标最大值。 */
  /** @property {Number} maxY 限制拖动y坐标最大值。 */
  /** @property {Element} targetEl 被拖动的目标元素。缺省表示{#target}组件元素。 */
  /** @property {Element} dragEl 拖动时显示的元素。 @readonly */
  /** @property {Boolean} dragElSize 拖动时显示的元素是否设置大小。 @priv */
  /** @property {Boolean} dragCenter 拖动时鼠标位置是否位于{#dragEl}的中心点：
   * -true: 鼠标位于{#dragEl}的中心点
   * -false: 鼠标位于{#dragEl}的左上方
   * -null: 原始位置
   */
  /** @property {Element} constrainEl 拖动的元素{#dragEl}限定在该元素内。 */
  /** @property {Wb.DisplayField} displayField 拖动时{#dragEl}关联的显示控件。\
   * 仅当指定text属性时有效。 @readonly */
  /** @property {Wb.Component} target 拖动的目标组件。 */
  /** @property {Boolean} startDrag 是否开始拖动。 @readonly */
  /** @property {Boolean} - 拖动功能是否禁用。 */
  set disabled(disabled) {
    let me = this;
    if (me.disabled$ !== disabled) {
      let target = me.target;

      me.disabled$ = disabled;
      if (Wb.isDesktop || me.forceEnabled)
        target.setListeners(!disabled, target.bodyEl ?? target.el, Event.tapDownName,
          me.onMouseDown, me, { passive: false });
    }
  }
  /***/
  get disabled() {
    return this.disabled$;
  }
  /**
   * 设置拖动功能是否禁用。
   * @param {Boolean} disabled 是否禁用。
   */
  setDisabled(value) {
    this.disabled = value;
  }
  /**
   * @event beforedrag 拖动前触发。返回false将阻止拖动。区别于{#startdrag}，无论是否发生拖动行为，
   * 只要点击对象就会触发事件。另请参考{#afterdrag}。
   * @param {Wb.Draggable} draggable 拖动组件对象。
   * @param {Event} e 拖动时的事件对象。
   */
  /**
   * @event afterdrag 拖动后触发。另请参考{#beforedrag}。
   * @param {Wb.Draggable} draggable 拖动组件对象。
   * @param {Event} e 拖动时的事件对象。
   */
  /**
   * @event startdrag 开始拖动时触发。区别于{#beforedrag}，仅当拖动行为发生后才触发该事件。另请
   * 参考{#enddrag}。
   * @param {Wb.Draggable} draggable 拖动组件对象。
   * @param {Event} e 拖动时的事件对象。
   */
  /**
   * @event enddrag 结束拖动时触发。另请参考{#startdrag}。
   * @param {Wb.Draggable} draggable 拖动组件对象。
   * @param {Event} e 拖动时的事件对象。
   */
  /**
   * @event drag 拖动中触发。
   * @param {Wb.Draggable} draggable 拖动组件对象。
   * @param {Event} e 拖动时的事件对象。
   */
  /**
   * 在拖动句柄元素上触发mousedown事件时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onMouseDown(e) {
    let me = this;
    //左键或在编辑器上点击返回
    if (me.primaryButtonOnly && e.button || e.target.isInput)
      return;
    if (me.fireEvent('beforedrag', me, e) === false)
      return;
    let targetEl;
    targetEl = me.targetEl ??= me.target.el;
    me.startX = e.x;
    me.startY = e.y;
    if (me.dragTarget) {
      me.targetX = targetEl.offsetLeft;
      me.targetY = targetEl.offsetTop;
    } else {
      let targetRect = targetEl.getRect();
      me.targetX = targetRect.x;
      me.targetY = targetRect.y;
    }
    me.target.mon({
      el: DocEl,
      scope: me,
      [Event.tapMoveName]: { fn: me.onMouseMove, capture: true },
      [Event.tapUpName]: { fn: me.onMouseUp, capture: true },
      wheel: { fn: me.onWheel, capture: true, passive: true }
    });
  }
  /**
   * 在document上触发mouseup事件时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onMouseUp(e) {
    let me = this;
    //中间滚轮允许滚动
    if (e.button == 1)
      return;
    me.fireEvent('afterdrag', me, e);
    if (me.startDrag) {
      let dragEl = me.dragEl, targetEl = me.targetEl, fn = f => {
        let dragTarget = me.dragTarget;
        delete me.startDrag;
        if (!dragTarget)
          DocEl.removeCls('w-dragging');
        if (me.displayField) {
          me.displayField.destroy();
          me.displayField = undefined;
        } else {
          if (!dragTarget)
            dragEl.remove();
        }
        if (me.hideTarget)
          targetEl.appeared = true;
        me.drag?.cancelDelay(me);
        me.fireEvent('enddrag', me, e);
      };
      clearInterval(me.scrollTimer);
      delete me.scrollTimer;
      if (me.animate)
        dragEl.slideOut({
          el: targetEl, callback: fn
        });
      else
        fn();
    }
    me.target.mun({
      el: DocEl,
      [Event.tapMoveName]: me.onMouseMove,
      [Event.tapUpName]: me.onMouseUp,
      wheel: me.onWheel
    });
  }
  /** @property {String} - 拖动时{#dragEl}显示的文字。如果缺省将创建{#targetEl}的副本作为{#dragEl}。 */
  set text(value) {
    if (this.text$ !== value) {
      this.text$ = value;
      let df = this.displayField;
      if (df)
        df.value = value;
    }
  }
  /***/
  get text() {
    return this.text$;
  }
  /** @property {IconString} - 拖动时{#dragEl}显示的图标。仅当指定{#text}/{#html}属性时有效。缺省不显示图标。 */
  set icon(value) {
    if (this.icon$ !== value) {
      this.icon$ = value;
      let df = this.displayField;
      if (df)
        df.icon = value;
    }
  }
  /***/
  get icon() {
    return this.icon$;
  }
  /** @property {String} - 拖动时{#dragEl}的样式类。仅当指定{#text}/{#html}属性时有效。 */
  set textCls(value) {
    let oldCls = this.textCls$;
    if (oldCls !== value) {
      this.textCls$ = value;
      let df = this.displayField;
      if (df) {
        if (oldCls)
          df.removeCls(oldCls);
        df.addCls(value);
      }
    }
  }
  /***/
  get textCls() {
    return this.textCls$;
  }
  /** @property {Function} drag 拖动时执行的方法。
   * @param {Wb.Draggable} draggable 拖动组件对象。
   * @param {Event} e 拖动时的事件对象。
   */
  /**
   * 在document上触发wheel事件时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onWheel(e) {
    let me = this;
    me.drag?.delay(me, me.scrollDragDelay, me, e);
    me.fireEvent('drag', me, e);
  }
  /**
   * 在document上触发mousemove事件时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onMouseMove(e) {
    let x = e.x, y = e.y, me = this, dragCenter = me.dragCenter;

    if (!me.startDrag && (Math.abs(me.startX - x) > me.threshold
      || Math.abs(me.startY - y) > me.threshold)) {
      let dragElRect, targetEl, constrainEl = me.constrainEl, dragTarget = me.dragTarget, targetRect;

      me.fireEvent('startdrag', me, e);
      if (!dragTarget)
        DocEl.addCls('w-dragging');
      me.startDrag = true;
      targetEl = me.targetEl;
      targetRect = targetEl.getRect();
      if (me.text || me.html) {
        let cls = 'w-drag-df';
        if (me.textCls)
          cls += ' ' + me.textCls;
        me.displayField = new Wb.DisplayField({
          value: me.text, cls, renderEl: BodyEl, icon: me.icon
        });
        me.dragEl = me.displayField.el;
      } else {
        if (dragTarget)
          me.dragEl = targetEl;
        else
          me.dragEl = targetEl.parentNode.appendChild(targetEl.cloneNode(true));
      }
      if (!dragTarget) {
        me.dragEl.addCls('w-drag');
        if (me.dragElSize) {
          me.dragEl.setRect(targetRect);
        } else {
          me.dragEl.xy = [targetRect.x, targetRect.y];
        }
      }
      if (me.maxWidth)
        me.dragEl.setStyle('max-width', me.maxWidth);
      if (me.maxHeight)
        me.dragEl.setStyle('max-height', me.maxHeight);
      dragElRect = me.dragEl.getRect();
      if (constrainEl) {
        let rect = constrainEl.getRect();
        if (me.dragTarget) {
          me.minX = 0;
          me.maxX = rect.width - me.dragEl.offsetWidth;
          me.minY = 0;
          me.maxY = rect.height - me.dragEl.offsetHeight;
        } else {
          me.minX = rect.x;
          me.maxX = rect.right - dragElRect.width;
          me.minY = rect.y;
          me.maxY = rect.bottom - dragElRect.height;
        }
      }
      if (dragCenter != null) {
        me.startX = x;
        me.startY = y;
        if (dragCenter) {
          me.targetX = x - dragElRect.width / 2;
          me.targetY = y - dragElRect.height / 2;
        } else {
          me.targetX = x + 10;
          me.targetY = y + 20;
        }
      }
      if (me.hideTarget)
        targetEl.appeared = false;
    }
    if (me.startDrag) {
      me.currentX = x;
      me.currentY = y;
      me.scrollTimer ??= setInterval(me.doAutoScroll.bind(me, e.target), 80);
      if (me.moveX) {
        x = me.targetX + x - me.startX;
        if (dragCenter != null)
          x = x.constrain(0, DocEl.clientWidth - me.dragEl.offsetWidth);
        x = x.constrain(me.minX, me.maxX);
        me.dragEl.x = x;
      }
      if (me.moveY) {
        y = me.targetY + y - me.startY;
        if (dragCenter != null)
          y = y.constrain(0, DocEl.clientHeight - me.dragEl.offsetHeight);
        y = y.constrain(me.minY, me.maxY);
        me.dragEl.y = y;
      }
      me.drag?.(me, e);
      me.fireEvent('drag', me, e);
    }
  }
  /** @property {Number} currentX 拖动时当前x坐标。 @priv */
  /** @property {Number} currentY 拖动时当前y坐标。 @priv */
  /**
   * 当拖动时且鼠标位于边缘时自动滚动。 @priv
   */
  doAutoScroll(target) {
    let me = this, scrollStep = me.scrollStep, scrollEl = me.target.scrollEl, rect = scrollEl.getRect(), offset = 10,
      x = me.currentX, y = me.currentY, speed = 20, oldTop = scrollEl.scrollTop, oldLeft = scrollEl.scrollLeft;

    if (x < rect.x + offset)
      scrollEl.scrollLeft -= scrollStep * Math.ceil((rect.x + offset - x) / speed);
    else if (x > rect.right - offset)
      scrollEl.scrollLeft += scrollStep * Math.ceil((x - rect.right + offset) / speed);
    if (y < rect.y + offset)
      scrollEl.scrollTop -= scrollStep * Math.ceil((rect.y + offset - y) / speed);
    else if (y > rect.bottom - offset)
      scrollEl.scrollTop += scrollStep * Math.ceil((y - rect.bottom + offset) / speed);
    if (oldTop != scrollEl.scrollTop || oldLeft != scrollEl.scrollLeft)
      me.fireEvent('drag', me, { x, y, target });
  }
}
/**
 * 为组件增加移动功能。移动的目标组件由target属性指定，移动的元素由handle属性指定。
 */
Cls['Wb.Movable'] = class movable extends Wb.Configurable {
  static configs = {
    disabled: false
  };
  static protos = {
    /** @property {Number} - 开始移动阈值。在水平或垂直方向至少移过该值像素的距离时才开始移动。 */
    threshold: 3,
    /** @property {Boolean} - 仅当拖动的{#handle}元素的cursor为move时允许拖动。 */
    moveCursorOnly: false,
    /** @property {Boolean} - 是否允许水平方向移动。 */
    moveX: true,
    /** @property {Boolean} - 是否允许垂直方向移动。 */
    moveY: true,
    disabled$: true
  };
  /** @property {Wb.Component} target 移动的目标组件。 */
  /** @property {Element} handle 在该元素上实施移动行为。 */
  /** @property {Boolean} startMove 是否开始移动。 */
  /** @property {Boolean} - 移动功能是否禁用。 */
  set disabled(disabled) {
    let me = this;
    if (me.disabled$ !== disabled) {
      me.disabled$ = disabled;
      me.handle.setCls(!disabled, 'w-movable');
      me.target.setEvents(!disabled, 'destroy', me.onDestroy, me);
      me.target.setListeners(!disabled, me.handle, Event.tapDownName, me.onMouseDown, me, { passive: false });
    }
  }
  /***/
  get disabled() {
    return this.disabled$;
  }
  /**
   * 设置移动功能是否禁用。
   * @param {Boolean} disabled 是否禁用。
   */
  setDisabled(value) {
    this.disabled = value;
  }
  /**
   * 目标组件销毁时执行的方法。 @priv
   */
  onDestroy() {
    Wb.removeCls('w-movable');
  }
  /**
   * 在移动句柄元素上触发mousedown事件时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onMouseDown(e) {
    let me = this;

    if (me.moveCursorOnly && e.target.computeStyle().cursor != 'move') return;
    //防止允许移动的对象点击时失去焦点
    if (Wb.isDesktop)
      e.preventDefault();
    if (e.button) return;
    let target = me.target, targetEl = target.el, posParent = targetEl.posParent, tw = targetEl.offsetWidth,
      th = targetEl.offsetHeight, pow = posParent.offsetWidth, poh = posParent.offsetHeight;
    me.startMove = false;
    if (target instanceof Wb.Window) {
      me.minX = -tw + 25;
      me.minY = 0;
      me.maxX = pow - 25;
      me.maxY = poh - 25;
    } else {
      me.minX = -tw + 8;
      me.maxX = pow - 8;
      me.minY = -th + 8;
      me.maxY = poh - 8;
    }
    me.startX = e.x;
    me.startY = e.y;
    me.targetX = targetEl.offsetLeft;
    me.targetY = targetEl.offsetTop;
    Wb.addCls('w-movable');
    target.mon({
      el: DocEl,
      scope: me,
      [Event.tapMoveName]: { fn: me.onMouseMove, passive: false },
      [Event.tapUpName]: me.onMouseUp
    });
    Globals.isMoving = true;
  }
  /**
   * 在document上触发mouseup事件时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onMouseUp() {
    this.target.mun({
      el: DocEl,
      [Event.tapMoveName]: this.onMouseMove,
      [Event.tapUpName]: this.onMouseUp
    });
    Wb.removeCls('w-movable');
    Globals.isMoving = false;
  }
  /**
   * 在document上触发mousemove事件时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onMouseMove(e) {
    let x = e.x, y = e.y, me = this;

    if (!me.startMove && (Math.abs(me.startX - x) > me.threshold || Math.abs(me.startY - y) > me.threshold))
      me.startMove = true;
    if (me.startMove) {
      let target = me.target;
      e.preventDefault();
      if (me.moveX)
        target.x = (me.targetX + x - me.startX).constrain(me.minX, me.maxX);
      if (me.moveY)
        target.y = (me.targetY + y - me.startY).constrain(me.minY, me.maxY);
    }
  }
}
/**
 * 为组件增加调整大小的功能。
 */
Cls['Wb.Resizable'] = class resizable extends Wb.Configurable {
  static configs = {
    disabled: false
  };
  static protos = {
    /** @property {Boolean} allowXY 调整大小时是否同时允许调整目标组件的X, Y值。
     * -true: 允许
     * -false: 禁止
     * -null: 自动判断，如果父元素的position为'absolute', 'relative', 'fixed'则为允许，否则为禁止。
     */
    /** @property {String} allowHandles 允许调整大小的方位列表，多个方便以空格分隔。如："s se sw" 表示允许调整底及其左右两个角。 */
    /** @property {Wb.Component} target 调整的目标组件。 */
    /** @property {Boolean} disableMouseEvent 是否禁止执行onMouseMove和onMouseLeave方法。 @priv */
    /** @property {String} handle 当前调整大小的方位。 @priv */
    /** @property {String} - 调整大小样式名的前缀。 @priv */
    cssPrefix: 'w-resize-',
    /** @property {Number} snapX 水平方向调整步长。 */
    /** @property {Number} snapY 垂直方向调整步长。 */
    /** @property {Boolean} - 调整大小时是否限定在基于定位的上级元素内。默认为true。 */
    constrain: true,
    /** @property {Boolean} - 是否自动在目标组件上添加border作为调整大小的区域，以使调整操作更方便。 */
    handleBorder: true,
    disabled$: true
  };
  /** @property {Boolean} - 调整大小功能是否禁用。 */
  set disabled(disabled) {
    let me = this;
    if (me.disabled$ !== disabled) {
      me.disabled$ = disabled;
      me.target.setCls(!disabled && me.handleBorder, 'w-rb');
      me.target.setEvents(!disabled, 'destroy', me.onDestroy, me);
      me.target.setListeners(!disabled, {
        scope: me,
        mouseleave: me.onMouseLeave,
        [Event.tapMoveName]: me.onMouseMove,
        [Event.tapDownName]: { fn: me.onMouseDown, capture: true, passive: false }
      });
    }
  }
  /***/
  get disabled() {
    return this.disabled$;
  }
  /**
   * 关闭对象，解除对组件的可调整大小功能。
   */
  close() {
    this.disabled = true;
  }
  /**
   * 停止调整大小。 @priv
   */
  stopResize() {
    if (this.handle) {
      let cls = this.cssPrefix + this.handle;
      this.target.el.removeCls(cls);
      Wb.removeCls(cls);
      this.handle = undefined;
    }
  }
  /**
   * 获取当前可调整区域所在的方位。 @priv
   * @param {Event} e 事件对象。
   * @return {String} 有效的方位，如果未找到返回undefined。
   */
  getHandle(e) {
    let handle, x = e.x, y = e.y, s = 5, me = this, targetEl = me.target.el, rect = targetEl.getRect(),
      l = rect.left, t = rect.top, r = rect.right, b = rect.bottom;

    if (x <= l + s && x >= l) {
      if (y <= t + s && y >= t)
        handle = 'nw';
      else if (y >= b - s - 1 && y <= b)
        handle = 'sw';
      else if (y >= t && y <= b)
        handle = 'w';
    } else if (x >= r - s - 1 && x <= r) {
      if (y <= t + s && y >= t)
        handle = 'ne';
      else if (y >= b - s - 1 && y <= b)
        handle = 'se';
      else if (y >= t && y <= b)
        handle = 'e';
    } else if (y <= t + s && y >= t && x >= l && x <= r) {
      handle = 'n';
    } else if (y >= b - s - 1 && y <= b && x >= l && x <= r) {
      handle = 's';
    }
    if (!me.allowHandles || (' ' + me.allowHandles + ' ').includes(' ' + handle + ' '))
      return handle;
  }
  /**
   * 目标组件销毁时执行的方法。 @priv
   */
  onDestroy() {
    this.stopResize();
  }
  /**
   * 鼠标移动时执行的方法。
   * @param {Event} e 事件对象。
   * @priv
   */
  onMouseMove(e) {
    let me = this, target = me.target, targetEl = target.el, eTarget;
    if (me.disableMouseEvent || Globals.isMoving || target.collapsed$)
      return;
    eTarget = e.target;
    if (me.handleBorder && eTarget != targetEl && eTarget != target.ctEl) {
      me.stopResize();
      return;
    }
    let handle = me.getHandle(e);

    if (handle != me.handle) {
      if (me.handle) {
        targetEl.removeCls(me.cssPrefix + me.handle);
        Wb.removeCls(me.cssPrefix + me.handle);
      }
      if (handle) {
        targetEl.addCls(me.cssPrefix + handle);
        Wb.addCls(me.cssPrefix + handle);
      } else {
        me.stopResize();
      }
      me.handle = handle;
    }
  }
  /**
   * 鼠标离开时时执行的方法。
   * @param {Event} e 事件对象。
   * @priv
   */
  onMouseLeave() {
    if (this.disableMouseEvent)
      return;
    this.stopResize();
  }
  /** @property {Number} minWidth 最小调整宽度。 @priv */
  /** @property {Number} minHeight 最小调整高度。 @priv */
  /** @property {Number} oldWidth 开始调整时的宽度。 @priv */
  /** @property {Number} oldHeight 开始调整时的高度。 @priv */
  /** @property {Boolean} doSetXY 是否允许设置目标组件的XY值。 @priv */
  /**
   * 鼠标按下时执行的方法。
   * @param {Event} e 事件对象。
   * @priv
   */
  onMouseDown(e) {
    let me = this;

    if (!me.handle) return;
    e.stopEvent();
    if (e.button) return;
    let targetStyle, target = me.target, targetEl = target.el;

    me.fireEvent('endresize', target);
    me.oldWidth = targetEl.offsetWidth;
    me.oldHeight = targetEl.offsetHeight;
    targetStyle = targetEl.computeStyle();
    me.disableMouseEvent = true;
    if (me.constrain)
      me.opRect = targetEl.posParent.getRect();
    me.startX = e.x;
    me.startY = e.y;
    me.startLeft = targetEl.offsetLeft;
    me.startTop = targetEl.offsetTop;
    me.startWidth = targetEl.offsetWidth;
    me.startHeight = targetEl.offsetHeight;
    me.minWidth = parseFloat(targetStyle.minWidth) || Math.max((parseFloat(targetStyle.paddingLeft) || 0) +
      (parseFloat(targetStyle.paddingRight) || 0) + 5, 10);
    me.minHeight = parseFloat(targetStyle.minHeight) || Math.max((parseFloat(targetStyle.paddingTop) || 0) +
      (parseFloat(targetStyle.paddingBottom) || 0) + 5, 10);
    if (me.allowXY == null) {
      me.doSetXY = Wb.posItems.includes(targetStyle.position);
    } else {
      me.doSetXY = me.allowXY;
    }
    Wb.addCls(me.cssPrefix + me.handle);
    target.mon({
      el: DocEl,
      scope: me,
      [Event.tapMoveName]: me.onDocMouseMove,
      [Event.tapUpName]: me.onDocMouseUp
    });
  }
  /**
   * @event resize 调整大小且发生变化后触发。
   * @param {Wb.Component} target 调整的目标组件。
   */
  /**
   * @event resizing 正在调整大小时触发。
   * @param {Wb.Component} target 调整的目标组件。
   */
  /**
   * @event startresize 调整开始时触发。
   * @param {Wb.Component} target 调整的目标组件。
   */
  /**
   * @event endresize 调整结束后触发。无论目标组件大小是否发生变化均触发。
   * @param {Wb.Component} target 调整的目标组件。
   */
  /**
   * 鼠标在document上释放按键时执行的方法。
   * @param {Event} e 事件对象。
   * @priv
   */
  onDocMouseUp(e) {
    let me = this, target = me.target, targetEl = target.el;

    target.mun({
      el: DocEl,
      [Event.tapMoveName]: me.onDocMouseMove,
      [Event.tapUpName]: me.onDocMouseUp
    });
    if (!me.getHandle(e) || !targetEl.contains(e.target))
      me.stopResize();
    if (me.oldWidth != targetEl.offsetWidth || me.oldHeight != targetEl.offsetHeight)
      me.fireEvent('resize', target);
    me.fireEvent('endresize', target);
    delete me.disableMouseEvent;
  }
  /**
   * 鼠标在document上移动时执行的方法。
   * @param {Event} e 事件对象。
   * @priv
   */
  onDocMouseMove(e) {
    let me = this, target = me.target, minWidth = me.minWidth, minHeight = me.minHeight,
      doSetXY = me.doSetXY, offsetX, offsetY, x = e.x, y = e.y;

    if (me.constrain) {
      x = x.constrain(me.opRect.x, me.opRect.right);
      y = y.constrain(me.opRect.y, me.opRect.bottom);
    }
    offsetX = x - me.startX;
    offsetY = y - me.startY;
    if (me.snapX)
      offsetX = offsetX.snap(me.snapX);
    if (me.snapY)
      offsetY = offsetY.snap(me.snapY);
    e.preventDefault();
    switch (me.handle) {
      case 'e':
        if (me.startWidth + offsetX < minWidth)
          offsetX = minWidth - me.startWidth;
        target.width = me.startWidth + offsetX;
        break;
      case 'w':
        if (me.startWidth - offsetX < minWidth)
          offsetX = me.startWidth - minWidth;
        if (doSetXY)
          target.x = me.startLeft + offsetX;
        target.width = me.startWidth - offsetX;
        break;
      case 's':
        if (me.startHeight + offsetY < minHeight)
          offsetY = minHeight - me.startHeight;
        target.height = me.startHeight + offsetY;
        break;
      case 'n':
        if (me.startHeight - offsetY < minHeight)
          offsetY = me.startHeight - minHeight;
        if (doSetXY)
          target.y = me.startTop + offsetY;
        target.height = me.startHeight - offsetY;
        break;
      case 'ne':
        if (me.startWidth + offsetX < minWidth)
          offsetX = minWidth - me.startWidth;
        target.width = me.startWidth + offsetX;
        if (me.startHeight - offsetY < minHeight)
          offsetY = me.startHeight - minHeight;
        if (doSetXY)
          target.y = me.startTop + offsetY;
        target.height = me.startHeight - offsetY;
        break;
      case 'se':
        if (me.startHeight + offsetY < minHeight)
          offsetY = minHeight - me.startHeight;
        target.height = me.startHeight + offsetY;
        if (me.startWidth + offsetX < minWidth)
          offsetX = minWidth - me.startWidth;
        target.width = me.startWidth + offsetX;
        break;
      case 'sw':
        if (me.startHeight + offsetY < minHeight)
          offsetY = minHeight - me.startHeight;
        target.height = me.startHeight + offsetY;
        if (me.startWidth - offsetX < minWidth)
          offsetX = me.startWidth - minWidth;
        if (doSetXY)
          target.x = me.startLeft + offsetX;
        target.width = me.startWidth - offsetX;
        break;
      case 'nw':
        if (me.startWidth - offsetX < minWidth)
          offsetX = me.startWidth - minWidth;
        if (doSetXY)
          target.x = me.startLeft + offsetX;
        target.width = me.startWidth - offsetX;
        if (me.startHeight - offsetY < minHeight)
          offsetY = me.startHeight - minHeight;
        if (doSetXY)
          target.y = me.startTop + offsetY;
        target.height = me.startHeight - offsetY;
        break;
    }
    me.fireEvent('resizing', target);
  }
}
/**
 * 组件类，是可视化组件的基类。每个组件都具有于之关联的一个或多个dom元素。
 * 组件可以由一个或多个子组件组成，子组件是指属于组件内部但不是下级的组件（下级组件只有容器组件{#Wb.Container}才有），
 * 子组件如选择器的下拉触发按钮，表格的分页工具条等。
 * @icon component
 */
Cls['Wb.Component'] = class component extends Wb.Configurable {
  //cls需要先设置，如要先于visible属性的设置。
  //listeners需要先设置，如要先监听便于设置属性时事件的触发。
  //tabIndex需要先设置，如调用focus方法前
  static firstNames = ['cid', 'listeners', 'cls', 'tabIndex'];
  /**
   * @event resize 组件大小发生变化时触发。该事件有更多用处，比如当组件dom添加到dom树时也会触发该事件。
   * @param {Element} el 大小发生变化的元素。
   */
  /**
   * @event click 组件点击时触发。
   * @param {Event} e 事件对象。
   */
  /**
   * @event dblclick 组件双点击时触发。
   * @param {Event} e 事件对象。
   */
  /** 
   * @property {Object} - 需要把{#listeners}由{#events}来转发的事件名称对象。对象成员名称为事件名称，值为监听
   * 的元素名称，如果为组件关联的元素可以设置为true。设置值为null或false可以显式取消该事件在该组件的转发。该属性
   * 会自动合并所有上级该属性，如果对象成员名称重复，下级的成员将覆盖上级的成员。 @static @priv
   */
  static events = { resize: true, click: true, dblclick: true };
  /** @property {Object} - 当前类静态{#!events}值合并父类该属性值后的值。 @priv */
  static get allEvents() {
    if (!Wb.hasProperty(this, 'allEvents$'))
      this.allEvents$ = this.mergeMembers('events', (parent, self) => Wb.apply({}, parent, self), Wb.Component);
    return this.allEvents$;
  }
  /** @property {String} cls 添加到组件的dom元素的以空格分隔的多个样式类名。区别于非静态{#cls}属性，
   * 设置该属性不会被子类覆盖。 @static */
  /** @property {String} - 当前类静态{#!cls}值合并父类该属性值后的值。 */
  static get allCls() {
    if (!Wb.hasProperty(this, 'allCls$'))
      this.allCls$ = this.mergeMembers('cls', (parent, self) => parent ? (parent + ' ' + self) : self, Wb.Component);
    return this.allCls$;
  }
  /** @property {String} defaults 直接下级组件默认增量属性。区别于非静态{#default}属性，
   * 设置该属性不会被子类覆盖。 @static */
  /** @property {String} - 当前类静态{#!defaults}值合并父类该属性值后的值。 @priv */
  static get allDefaults() {
    if (!Wb.hasProperty(this, 'allDefaults$'))
      this.allDefaults$ = this.mergeMembers('defaults', (parent, self) => Wb.apply({}, parent, self), Wb.Component);
    return this.allDefaults$;
  }
  static protos = {
    /** @property {Boolean} touchTip 在移动端上是否显示提示{#Wb.Tip}。 @code */
    /** @property {String} - 组件元素的tagName。 @readonly */
    tagName: 'div',
    /**
     * 判断是否存在满足某个条件的直接下级组件。详见 {#Wb.PT.some} 方法。
     */
    some: Wb.PT.some,
    /**
     * 判断所有直接下级组件是否满足某个条件。详见 {#Wb.PT.every} 方法。
     */
    every: Wb.PT.every,
    /**
     * 判断是否存在满足某个条件的上级组件（含组件本身）。详见 {#Wb.PT.bubbleSome} 方法。
     */
    bubbleSome: Wb.PT.bubbleSome,
    /**
     *  判断所有上级组件（含组件本身）是否均满足某个条件。详见 {#Wb.PT.bubbleEvery} 方法。
     */
    bubbleEvery: Wb.PT.bubbleEvery,
    /**
     * 判断是否存在满足某个条件的下级组件。详见 {#Wb.PT.cascadeSome} 方法。
     */
    cascadeSome: Wb.PT.cascadeSome,
    /**
     * 判断所有下级组件是否均满足某个条件。详见 {#Wb.PT.cascadeEvery} 方法。
     */
    cascadeEvery: Wb.PT.cascadeEvery,
    /** @property {String} - 使用{#alignTo}方法对齐时默认的对齐方式。 @code */
    defaultAlign: 'bl?',
    /** @property {Number[]} - [x, y]指定的以像素为单位的默认偏移量，通常用于定位显示。 @code */
    defaultOffset: [0, 0],
    /** @property {Number} - 组件插入到header/footer时的权重。值越大插入到header时越靠前，插入到footer时越靠后。\
     * 默认weight值为50。 */
    weight: 50,
    /** @property {Enum} closeAction 调用close方法时执行的动作。默认为"destroy"。
     * -'hide': 调用hide方法隐藏。
     * -'destroy': 调用destroy方法销毁。
     */
    closeAction: 'destroy',
    /** @property {Boolean} - 当组件作为子组件时，当上级组件销毁时是否自动销毁。默认为true。 */
    autoDestroy: true,
    /** @property {Boolean} - 组件是否已经被销毁。 @readonly */
    destroyed: false,
    /** @property {Boolean} - 当组件的{#html}属性设置后，是否自动执行{#make}方法。 */
    autoMake: false,
    /** @property {Boolean} - 当使用{#Wb.verify}方法验证该组件时，是否禁止验证该组件及其所有子组件和下级组件。 */
    noVerify: false,
    /** @property {Boolean} - 当使用{#Wb.getValue}方法获取该组件的"value"值时，是否禁止取该组件及其所有子组件和下级的值。 */
    noValue: false,
    visible$: true,
    appeared$: true,
    floating$: false,
    rippleOnClick$: false,
    disabled$: false,
    full$: false,
    movable$: false,
    resizable$: false,
    shrinkSelf$: null,
    splitter$: false,
    focusable$: true,
    frame$: false,
    roundBorder$: false
  };
  /** @property {Boolean} allowFocus 默认是否允许在指定方法下自动对组件设置焦点。例如窗口显示时。 */
  /** @property {Enum} autoSize 当使用{#alignTo}方法对齐时是否自动设置组件宽高。 @priv
   * -'width': 宽度。
   * -'height': 高度。
   * -true: 宽度和高度。
   */
  /** @property {Element} el 组件关联的dom元素，组件渲染到该元素。 @code */
  /** @property {Boolean} tipAutoAlign 显示提示时，提示信息是否自动对齐。 @code */
  /** @property {Object} tagProperties 直接添加到组件的属性配置对象。 */
  /** @property {Object} tagEvents 直接添加到组件的事件配置对象。 */
  /** @property {PathString} bindModule 组件绑定的模块，如果当前用户允许访问模块则组件可见，否则组件不可见。请注意该属性
   * 仅在xwl模块内加载时有效。 */
  /** @property {Boolean} noVerifyFocus 执行验证后是否不允许设置焦点。 @priv */
  /***/
  init(configs) {
    let value;

    super.init(configs);
    //合并静态cls
    value = this.constructor.allCls;
    if (value)
      configs.cls = configs.cls ? (value + ' ' + configs.cls) : value;
    //合并静态defaults
    value = this.constructor.allDefaults;
    if (value)
      configs.defaults = configs.defaults ? Wb.apply({}, value, configs.defaults) : value;
    //如果未指定el创建新的el
    this.el ??= document.createElement(this.tagName);
    //把对象设置到元素的citem属性
    this.el.citem = this;
  }
  /**
   * 添加需要把{#listeners}由{#events}来转发的事件。需要代理的事件名称由静态{#!events}属性指定。
   * @param {String} eventName 当前需要添加代理的事件名称。
   */
  addProxyEvent(eventName) {
    if (!this.events$?.[eventName]) {
      let el = this.constructor.allEvents[eventName];
      if (el)
        this.mon(el === true ? this.el : this[el], eventName, this.listenerTrigger, this, { eventName });
    }
  }
  /**
    * 移除需要把{#listeners}由{#events}来转发的事件。需要代理的事件名称由静态{#!events}属性指定。
    * @param {String} eventName 当前需要移除代理的事件名称。
    */
  removeProxyEvent(eventName, options) {
    if (!this.events$?.[eventName]?.length) {
      let el = this.constructor.allEvents[eventName];
      if (el)
        this.mun(el === true ? this.el : this[el], eventName, this.listenerTrigger);
    }
  }
  /** @property {Boolean} - 是否显示弧形边框。 @design */
  set roundBorder(value) {
    this.setStyle('border-radius', value ? '0.5em' : null);
  }
  /***/
  get roundBorder() {
    return this.getStyle('border-radius') == '0.5em';
  }
  /** @property {Boolean} - 组件是否不自动弹性收缩。 @design */
  set shrinkSelf(value) {
    let me = this;
    if (me.shrinkSelf$ !== value) {
      me.shrinkSelf$ = value;
      me.setCls(value && value != null, 'w-shrink-s');
      me.setCls(!value && value != null, 'w-no-shrink-s');
    }
  }
  /***/
  get shrinkSelf() {
    return this.shrinkSelf$;
  }
  /** @property {Object} tplData 静态模板数据。用于填充到{#tpl}中的数据。动态更新请调用{#update}方法。 */
  /** @property {HtmlString/Wb.Template/Function} - HTML模板{#Wb.Template}，用于生成组件内的HTML内容。 @key */
  set tpl(value) {
    let me = this;

    me.tpl$ = value instanceof Wb.Template ? value : new Wb.Template(value);
    if (me.tplData)
      me.update(me.tplData);
  }
  /** @property {Wb.Template} */
  get tpl() {
    return this.tpl$;
  }
  /** @property {Function} - HTML模板函数。同{#tpl}属性。
   * @param {Object} data 模板数据。
   * @param {Element} [el] 元素。
   */
  set tplFn(value) {
    this.tpl = value;
  }
  /** @property {Wb.Template} */
  get tplFn() {
    return this.tpl;
  }
  /**
   * 根据{#tpl}的设置，把指定的数据应用到模板后，并把获得的HTML更新到当前组件。静态模板数据请设置{#tplData}属性。
   * @param {Object} data 应用到模板的数据对象。
   */
  update(value) {
    let me = this, lastData;

    lastData = me.lastTplData ??= {};
    Wb.apply(lastData, value);
    if (me.tpl)
      me.html = me.tpl.apply(lastData, me.el);
  }
  /**
   * 把当前组件的zIndex设置到指定范围内的最大值。当zIndex值超出范围时将对所有相关组件重新设置zIndex值。
   */
  setMaxZIndex() {
    let me = this, minZIndex = Globals.minZIndex, zindex = Globals.zIndex;

    if ((me.zIndex ?? 0) < zindex) {
      let maxZIndex = Globals.maxZIndex;
      zindex++;
      Globals.zIndex = me.zIndex = zindex;
      if (zindex >= maxZIndex) {
        //重置所有组件的zIndex值
        let list = BodyEl.queryAll('[style*=z-index]'), items = [], citem;

        list.forEach(el => {
          citem = el.citem;
          if (citem && citem.zIndex >= minZIndex && citem.zIndex <= maxZIndex) {
            items.push(citem);
          }
        });
        items.sort((a, b) => a.zIndex - b.zIndex).forEach(item => item.zIndex = minZIndex++);
        Globals.zIndex = minZIndex;
      }
    }
  }
  /**
   * 由DOM元素监听器代理事件的触发器。 @priv
   */
  listenerTrigger(e, options) {
    this.fireEvent(options.eventName, e);
  }
  /** @property {Boolean} - 组件是否可以通过点击来设置焦点，设置为false将无法通过点击来设置焦点。\
   * 例如工具条按钮通过设置该属性为false，来防止焦点转移。请区别该属性同{#tabIndex}的区别，
   * 后者设置是否可以通过tab键设置焦点。
   */
  set focusable(value) {
    let me = this;
    if (me.focusable$ !== value) {
      me.focusable$ = value;
      if (Wb.isDesktop)
        me.setListeners(!value, Event.tapDownName, Event.pdHandler);
      else {
        me.setListeners(!value, {
          touchstart: {
            fn: me.onFocusTapDown,
            passive: false
          },
          touchend: {
            fn: me.onFocusTapUp,
            passive: false
          }
        });
      }
    }
  }
  /***/
  get focusable() {
    return this.focusable$;
  }
  /**
   * 鼠标释放时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onFocusTapUp(e) {
    //touch上因preventDefault不会触发click了，因此在TapUp上模拟触发
    let me = this;

    if (Math.abs(me.tapAtX - e.x) < 20 && Math.abs(me.tapAtY - e.y) < 20) {
      e.preventDefault();
      me.dispatchEvent('click', e);
    }
  }
  /**
   * 鼠标按下时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onFocusTapDown(e) {
    if (Wb.isTouch) {
      this.tapAtX = e.x;
      this.tapAtY = e.y;
    }
  }
  /**
   * 通过指定元素找到包含该元素的当前组件内的直接子组件或直接下级组件。
   * @param {Element} el 包含的元素。
   * @return {Wb.Component} 找到的组件，未找到返回null。
   */
  findChildByEl(el) {
    let result = null, me = this, rootEl = me.el;

    el?.bubble(parent => {
      if (parent == rootEl)
        return false;
      if (parent.citem?.parent == me) {
        result = parent.citem;
        return false;
      }
    });
    return result;
  }
  /** @property {Boolean} - 当前组件是否具有焦点。 */
  get activated() {
    return this.el.contains(document.activeElement);
  }
  /**
   * 增加元素关联图片的预览功能。移除预览功能请使用{#unClickPreview}方法。
   * @param {Elemenent} [el] 元素。默认为组件元素。
   */
  onClickPreview(el) {
    this.mon(el, 'click', this.onPreviewElClick);
  }
  /**
   * 移除元素关联图片的预览功能。增加预览功能请使用{#onClickPreview}方法。
   * @param {Elemenent} [el] 元素。默认为组件元素。
   */
  unClickPreview(el) {
    this.mun(el, 'click', this.onPreviewElClick);
  }
  /**
   * 图片预览元素点击时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onPreviewElClick(e) {
    let target = e.target, url, quote;

    if (target.tagName == 'IMG')
      url = target.src;
    else {
      url = target.getStyle('background-image');
      if (url) {
        quote = url.includes('url("') ? '"' : "'";
        url = url.getPart('url(' + quote, quote + ')');
      }
    }
    if (url) {
      let win, imageEl, distance, bodyWidth, bodyHeight, naturalWidth, naturalHeight;

      //该布局能使mousedown在滚动条时不关闭
      win = Globals.previewWin;
      if (!win) {
        let listeners;

        listeners = {
          click(e) {
            if (e.isLeftButton) {
              win.close();
              e.stopEvent();
            }
          },
          wheel: {
            fn(e) {
              win.zoomImage(e.deltaY > 0 ? .9 : 1.1)
              e.stopEvent();
            },
            passive: false
          }
        };
        if (Wb.isTouch) {
          Wb.apply(listeners, {
            touchstart: {
              fn(e) {
                if (e.touches.length === 2) {
                  distance = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                  );
                }
              }
            },
            touchmove: {
              fn(e) {
                if (e.touches.length === 2) {
                  let currentDistance = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                  ), scale = currentDistance / distance;
                  win.zoomImage(scale);
                  distance = currentDistance;
                }
              }
            }
          });
        }
        win = new Wb.Window({
          maximized: true, titleBar: false, modal: true, closeOnEsc: true, border: 0, autoScroll: true, textSelectable: false,
          items: { cls: 'w-prev-ct', listeners }, background: '#000',
          zoomImage(scale) {
            let nw = imageEl.naturalWidth, nh = imageEl.naturalHeight, st, sl, scrollWidth, scrollHeight, body = win.bodyEl;

            sl = body.scrollLeft;
            st = body.scrollTop;
            scrollWidth = body.scrollWidth;
            scrollHeight = body.scrollHeight;
            if (nw < nh) {
              imageEl.setStyle('width', Math.max(Math.min(imageEl.width * scale, nw * 3), 12) + 'px');
              imageEl.removeStyle('height');
            } else {
              imageEl.setStyle('height', Math.max(Math.min(imageEl.height * scale, nh * 3), 12) + 'px');
              imageEl.removeStyle('width');
            }
            //scroll to view center
            body.scrollLeft = sl + (body.scrollWidth - scrollWidth) / 2;
            body.scrollTop = st + (body.scrollHeight - scrollHeight) / 2;
          }
        });
      }
      imageEl = win.imageEl ??= win.firstItem.addEl('w-margin-center', 'img');
      imageEl.src = url;
      win.show();
      bodyWidth = win.bodyEl.clientWidth;
      bodyHeight = win.bodyEl.clientHeight;
      naturalWidth = imageEl.naturalWidth;
      naturalHeight = imageEl.naturalHeight;
      if (bodyWidth < bodyHeight && naturalHeight < bodyHeight ||
        bodyWidth > bodyHeight && naturalWidth > bodyWidth) {
        imageEl.setStyle('width', Math.min(bodyWidth - 4, naturalWidth) + 'px');
        imageEl.removeStyle('height');
      } else {
        imageEl.setStyle('height', Math.min(bodyHeight - 4, naturalHeight) + 'px');
        imageEl.removeStyle('width');
      }
      e.stopEvent();
    }
  }
  /**
   * 把当前组件的滚动条滚动到最顶部。
   */
  scrollToTop() {
    this.scrollEl.scrollTop = 0;
  }
  /**
   * 把当前组件的滚动条滚动到最底部。
   */
  scrollToBottom() {
    let el = this.scrollEl;
    el.scrollTop = el.scrollHeight;
  }
  /**
   * 把当前组件的滚动条滚动到最左边。
   */
  scrollToLeft() {
    this.scrollEl.scrollLeft = 0;
  }
  /**
   * 把当前组件的滚动条滚动到最右边。
   */
  scrollToRight() {
    let el = this.scrollEl;
    el.scrollLeft = el.scrollWidth;
  }
  /**
   * 重置组件的水平和垂直滚动条位置为起始位置。
   */
  resetScroll() {
    let el = this.scrollEl;
    el.scrollLeft = 0;
    el.scrollTop = 0;
  }
  /** @property {String} - 组件的子标题，子标题将以"标题 - 子标题"的形式展示。仅当组件具有"title"属性时有效。 @code */
  set subTitle(value) {
    let title = String(this.title), pos = title.indexOf(' - ');

    if (pos != -1)
      title = title.substr(0, pos);
    this.title = Wb.isEmpty(value) ? title : (title + ' - ' + value);
  }
  /***/
  get subTitle() {
    let title = String(this.title), pos = title.indexOf(' - ');

    if (pos == -1)
      return '';
    else
      return title.substr(pos + 3);
  }
  /** @property {Array} resizeListeners resize监听器列表。 @priv */
  /**
   * 注册一个或多个组件元素的事件监听器。当组件被销毁时，监听器将被自动注销。对于具有相同元素，
   * 事件名称和函数的监听器，系统仅允许注册一次，后续多次重复的注册将无效。
   * {#mon}区别于{#on}方法，前者监听dom元素的事件，后者监听组件定义的事件。
   * 关于事件监听器的更多说明请参考{#%addEventListener|api:EventTarget/addEventListener}方法说明。
   * 注销事件监听器请使用{#mun}方法。
   * Example: 
   *
   *     comp.mon('click', fn);
   *     comp.mon(el, 'click', e => {doSomething();}, scope, {once: true, capture: true});
   *     comp.mon({el: el, scope: comp, click: fn, mouseover: {fn: overFn, el: otherEl, once: true}});
   *
   * @param {String/Element/Object} configs 事件名称、监听的元素或监听配置对象。当该参数为字符串时，表示事件名称。\
   * 当该参数为元素时，表示监听的DOM元素对象。当该值为对象时，表示参数为事件配置对象，对象中每个值为方法的成员其名称为
   * 事件名称，值为监听方法；每个值为对象的成员其名称为事件名称，值为事件的配置对象，其属性同configs参数。\
   * 名称为scope的成员为默认scope值，名称为el的成员为默认el值。
   * @param {Element} [configs.el] 监听的dom元素，默认为组件元素。
   * @param {Object} [configs.scope] 监听方法内this指向的对象，默认为组件本身。
   * @param {Function} [configs.fn] 监听的方法，仅用于配置对象作为事件成员时。
   * @param {Boolean} [configs.once] 事件是否单次执行，如果设置为true，事件执行一次后即被注销。
   * @param {Boolean} [configs.capture] 事件在多个元素触发时的处理顺序，false自底向上（冒泡），true自顶向下（捕获）。
   * @param {Boolean} [configs.passive] true表示监听方法永远不会调用preventDefault方法，否则方法无效并将给与警告。
   * @param {Object} [configs.xxx] 可为{#%addEventListener|api:EventTarget/addEventListener}方法的options参数或
   * 其它任意名称的自定义参数。
   * @param {String/Function} [eventName] 事件名称或处理方法。当首个参数为元素时该参数为事件名称，
   * 首个参数为事件名称时该参数为处理方法。该参数仅当configs不是对象时有效。
   * @param {Function/Object} [fn] 监听的方法或scope对象。当首个参数为元素时该参数为处理方法，
   * 首个参数为事件名称时该参数为scope。该参数仅当configs不是对象时有效。
   * @param {Event} [fn.e] 事件对象。
   * @param {Object} [fn.options] 传递的options参数。如果通过对象的方式配置事件，options为对象中的所有成员。
   * @param {Object} [scope] 当首个参数为元素时该参数为监听方法内this指向的对象，首个参数为事件名称时该参数为options。\
   * 该参数仅当configs不是对象时有效。
   * @param {Object} [options] 选项对象，见configs配置说明，当事件方法运行时也将传递该参数作为fn的options。\
   * 该参数仅当configs不是对象时有效。
   */
  mon(configs, eventName, fn, scope, options) {
    if (Wb.isObject(configs) && !eventName) {
      let scope = configs.scope, el = configs.el;
      Wb.each(configs, (k, v) => {
        if (k == 'scope' || k == 'el')
          return;
        if (Wb.isObject(v)) {
          //v为事件配置对象
          this.mon(v.el ?? el, k, v.fn, v.scope ?? scope, v);
        } else if (Wb.isFunction(v)) {
          //v为监听方法
          this.mon(el, k, v, scope);
        } else
          Wb.raise(`Invalid listener "${k}"`);
      });
    } else {
      let el, event, once, listeners, eventFn, isResize;

      if (Wb.isString(configs)) {
        //参数依次为: eventName, fn, scope, options
        el = this.el;
        options = scope;
        scope = fn;
        fn = eventName;
        eventName = configs;
      } else {
        //参数依次为: el, eventName, fn, scope, options
        el = configs || this.el;
      }
      if (!fn)
        Wb.raise(`Null function for add listener "${eventName}".`);
      isResize = eventName == 'resize';
      listeners = isResize ? this.resizeListeners : this.listeners$;
      //如果监听器已经存在直接返回
      if (listeners?.some(item => item.el == el && item.eventName == eventName && item.fn == fn))
        return;
      scope ??= this;
      once = options?.once;
      eventFn = e => {
        //禁用的控件取消相关事件
        if (this.disabled && (eventName.endsWith('click') || eventName == Event.tapDownName || eventName == 'contextmenu')) {
          if (Wb.isDesktop)
            e.stopEvent();
          return;
        }
        if (Wb.isTouch && eventName == 'dblclick') {
          let time = new Date().getTime(), clickTime = eventFn.clickTime$ ?? 0;
          if ((time - clickTime > 500) ||
            !(Math.abs(eventFn.tapAtX - e.x) < 20 && Math.abs(eventFn.tapAtY - e.y) < 20)) {
            eventFn.clickTime$ = new Date().getTime();
            eventFn.tapAtX = e.x;
            eventFn.tapAtY = e.y;
            return;
          } else {
            eventFn.clickTime$ = 0;
          }
        }
        if (once)
          this.mun(el, eventName, fn);
        fn.call(scope, e, options);
      };
      event = { el, eventName, fn, eventFn, scope, options };
      //resize事件通过ResizeObserver实现
      if (isResize) {
        listeners ??= this.resizeListeners = [];
        listeners.push(event);
        Wb.ResizeObserver.register(event);
      } else {
        listeners ??= this.listeners$ = [];
        listeners.push(event);
        el.addEventListener(Wb.isTouch && eventName == 'dblclick' ? 'click' : eventName, eventFn, options);
      }
    }
  }
  /**
   * 注销一个或多个通过{#mon}方法注册的事件监听器。使用该方法将注销具有指定元素、事件名称和函数的监听器。
   * Example: 
   *
   *     comp.mun('click', fn);
   *     comp.mun(el, 'click', fn);
   *     comp.mun({el: el, click: fn, mouseover: {fn: overFn, el: otherEl}});
   *
   * @param {String/Element/Object} configs 事件名称、监听的元素或监听配置对象。当该参数为字符串时，
   * 表示事件名称。当该参数为元素时，表示监听的DOM元素对象。当该值为对象时，表示参数为事件配置对象，
   * 对象中每个值为方法的成员其名称为事件名称，值为监听方法；每个值为对象的成员其名称为事件名称，
   * 值为事件的配置对象，其属性同configs参数。其它类型成员为对应名称的配置属性或选项。\
   * 名称为el的成员为默认el值。
   * @param {Element} [configs.el] 监听的dom元素，默认为组件元素。
   * @param {Function} [configs.fn] 监听的方法，仅用于配置对象作为事件成员时。
   * @param {String/Function} [eventName] 事件名称或监听的方法。当首个参数为元素时该参数为事件名称，
   * 首个参数为事件名称时该参数为监听的方法。该参数仅当configs不是对象时有效。
   * @param {Function} [fn] 监听的方法。方法只能是引用的变量而不能为新定义的方法。该参数仅当configs不是对象时有效。
   */
  mun(configs, eventName, fn) {
    if (Wb.isObject(configs)) {
      let el = configs.el;
      Wb.each(configs, (k, v) => {
        if (k == 'scope' || k == 'el')
          return;
        if (Wb.isObject(v)) {
          this.mun(v.el ?? el, k, v.fn);
        } else if (Wb.isFunction(v)) {
          this.mun(el, k, v);
        }
      });
    } else {
      let el, unRegDone, listeners, isResize;

      if (Wb.isString(configs)) {
        el = this.el;
        fn = eventName;
        eventName = configs;
      } else {
        el = configs || this.el;
      }
      isResize = eventName == 'resize';
      listeners = isResize ? this.resizeListeners : this.listeners$;
      if (!listeners)
        return;
      let i, j = listeners.length, listener, isDblClick = Wb.isTouch && eventName == 'dblclick';
      for (i = 0; i < j; i++) {
        listener = listeners[i];
        if (listener.el === el && listener.eventName === eventName && listener.fn === fn) {
          if (isResize) {
            if (!unRegDone) {
              //unregister仅需执行单次即可把多个相同fn关联的监听器移除
              Wb.ResizeObserver.unregister(listener);
              unRegDone = true;
            }
          } else {
            el.removeEventListener(isDblClick ? 'click' : eventName, listener.eventFn, listener.options);
          }
          listeners.splice(i, 1);
          return;
        }
      }
    }
  }
  /**
   * 注册或注销监听器。
   * @param {Boolean} status true注册，false注销。
   * @param {...Object} [args] 添加到{#mon}/{#mun}方法的参数。
   */
  setListeners(status, ...args) {
    if (status)
      this.mon(...args);
    else
      this.mun(...args);
  }
  /** @property {Object} - dom元素事件的监听器配置对象，用于新注册一个或多个事件监听器。请参考{#mon}方法说明。 @key */
  set listeners(value) {
    this.mon(value);
  }
  /** @property {Array} - 获取监听器配置对象列表。如果要获取resize事件监听器请访问{#resizeListeners}。 */
  get listeners() {
    return this.listeners$;
  }
  /**
   * 触发指定名称的监听器事件，组件指定元素上事件关联的所有方法都将被执行。监听器事件可由组件的{#mon}方法设置。
   * 通过该方法触发的方法其事件对象为空对象。
   * Example: 
   *
   *     let continue  = container.dispatchEvent('click', e, el);
   *
   * @param {String} eventName 事件名称。
   * @param {Event} [e] 事件对象。缺省将为空对象。
   * @param {Element} [el] 触发监听器事件的元素，默认为组件关联的元素。
   * @param {Object} [extraOptions] 事件选项，该对象值将合并到原options参数中。
   * @return {Boolean} 如果监听器事件对应的任意一个方法返回了false，那么返回false，否则返回true。
   */
  dispatchEvent(eventName, e, el, extraOptions) {
    let listeners = eventName == 'resize' ? this.resizeListeners : this.listeners$;
    if (!listeners)
      return true;
    let returnFalse, options;
    e ??= {};
    if (!el)
      el = this.el;
    listeners.each((listener, index) => {
      if (extraOptions)
        options = Wb.apply({}, listener.options, extraOptions);
      else
        options = listener.options;
      if (listener.el == el && listener.eventName == eventName) {
        if (listener.fn.call(listener.scope ?? this, e, options) === false)
          returnFalse = true;
        if (options?.once) {
          listeners.erase(index);
        }
      }
    }, null, true);
    return !returnFalse;
  }
  /**
   * 清除当前组件的所有监听器{#listeners}。
   */
  clearListeners() {
    this.listeners$?.forEach(listener =>
      listener.el.removeEventListener(listener.eventName, listener.eventFn, listener.options));
    this.resizeListeners?.forEach(listener => Wb.ResizeObserver.unregister(listener));
  }
  /** @property {Number} - 当前组件在上级容器中的位置索引号。如果无上级组件返回-1。 */
  get itemIndex() {
    return this.parent?.items$?.indexOf(this) ?? -1;
  }
  /** @property {Boolean} - 是否为容器的首个下级组件。 */
  get isFirstItem() {
    return this.parent?.firstItem == this;
  }
  /** @property {Boolean} - 是否为容器的最后一个下级组件。 */
  get isLastItem() {
    return this.parent?.lastItem == this;
  }
  /** @property {Wb.Component} - 首个可见非禁用的子组件或下级组件。未找到返回null。 */
  get firstValidChild() {
    return this.downBy(item => item.visible && item.appeared && !item.disabled);
  }
  /** @event beforeclose 当前组件关闭前触发。如果返回false将取消关闭。 */
  /** @event close 当前组件关闭后触发。 */
  /**
   * 根据关闭动作执行关闭操作，隐藏或销毁组件。
   * @return {Boolean} true成功执行关闭操作，false关闭操作被取消。
   */
  close() {
    if (this.fireEvent('beforeclose') === false)
      return false;
    this[this.closeAction]();
    this.fireEvent('close');
    return true;
  }
  /**
   * 把当前组件渲染到指定的元素中。
   * @param {Element} el 渲染到元素。
   * @param {Boolean} [replace] 是否替换渲染的元素，true替换，false添加到渲染的元素中。
   */
  renderTo(el, replace) {
    if (replace) {
      if (this.el != el)
        el.parentNode.replaceChild(this.el, el);
    } else {
      this.renderEl = el;
    }
  }
  /** @property {Element} - 把当前组件渲染到该元素下，如果要渲染到元素本身请设置{#el}属性。 @code */
  set renderEl(value) {
    if (this.el.parentNode != value)
      value.appendChild(this.el);
  }
  /** @property {Element} */
  get renderEl() {
    return this.el.parentNode;
  }
  /**
   * 添加当前组件下的所有具有cid属性的子组件和下级组件的引用到指定对象。添加的成员名称为cid属性，值为组件。
   * @param {Object} [object] 添加引用到该对象。默认为组件本身。
   */
  applyRefer(object) {
    object ??= this;
    this.cascadeWhole(item => {
      if (item.cid$)
        object[item.cid$] = item;
    });
  }
  /**
   * 获取当前组件下的所有具有cid属性的子组件和下级组件的引用组成的对象。添加的成员名称为cid属性，值为组件。
   */
  getRefer() {
    let object = {};
    this.applyRefer(object);
    return object;
  }
  /**
   * 作为属性值应用指定前缀的样式到元素。在应该样式之前如果已经存在该属性样式，将移除原样式。
   * Example: 
   * 
   *     button.applyCls('info', 'type', 'w-btn-');
   * 
   * @param {String/Boolean} value 属性值。null将清除样式。
   * @param {String} name 属性名称。
   * @param {String} prefix 样式前缀。
   * @param {Element/Wb.Component} [el] 元素，默认为当前组件的元素。
   * @param {Boolean} [reverse] 当value为Boolean值时true表示移除样式，false表示添加样式。
   * @return {Boolean} true设置成功，false未设置。
   */
  applyCls(value, name, prefix, el, reverse) {
    let oldValue = this[name + '$'];

    if (oldValue !== value) {
      this[name + '$'] = value;
      el = el ? (el.el || el) : this.el;
      if (Wb.isBoolean(value)) {
        el.setCls(reverse ? !value : value, prefix);
      } else {
        if (Wb.isBoolean(oldValue))
          el.removeCls(prefix);
        else if (oldValue != null)
          el.removeCls(prefix + oldValue);
        if (value != null)
          el.addCls(prefix + value);
      }
      return true;
    }
    return false;
  }
  /**
   * 设置组件元素焦点，如果组件元素可以获取到焦点，焦点就会被设置到该元素上。
   * @param {Boolean} [preventScroll] 当设置焦点时，时否阻止滚动条滚动。
   */
  focus(preventScroll) {
    (this.focusEl ?? this.el).focusOnly();
    if (!preventScroll)
      this.intoView();
  }
  /**
   * 设置组件元素焦点并阻止滚动条滚动，如果组件元素可以获取到焦点，焦点就会被设置到该元素上。
   */
  focusOnly() {
    this.focus(true);
  }
  /**
   * 把焦点设置到组件内首个非禁用非隐藏的具有{#allowFocus}属性的子组件或下级组件上。下级组件优先。如果未找到可设置的组件
   * 则把焦点设置到组件本身。
   * @param {Boolean} [preventScroll] 是否阻止滚动条滚动。
   */
  focusFirst(preventScroll) {
    let focusItem, me = this;

    [me, me.buttonsBar$].each(comp => {
      focusItem = comp?.down(item => item.allowFocus && item.visible$ && item.appeared$ && !item.disabled$ &&
        !item.readonly$);
      if (focusItem)
        return false;
    });
    if (!me.activated)
      focusItem ??= me;
    focusItem?.focus(preventScroll);
  }
  /**
   * 对当前组件添加遮盖，并显示正在加载中的动画效果。详细说明请参考{#Wb.mask}方法。
   * Example:
   *
   *     comp.mask();
   *     comp.mask('正在保存中...');
   *
   * @param {Object/String} [configs] 遮盖的配置项或遮盖的提示文本: 
   * @return {String} 遮盖的提示文本，可用于使用{#unmask}方法隐藏指定mask。
   */
  mask(configs) {
    if (Wb.isObject(configs))
      configs = Wb.apply({
        target: this.el
      }, configs);
    else
      configs = {
        target: this.el,
        text: configs
      };
    return Wb.mask(configs).text;
  }
  /**
   * 隐藏使用{#mask}方法添加的对当前组件的遮盖。详细说明请参考{#Wb.unmask}方法。
   * Example:
   *
   *     comp.unmask();
   *     comp.unmask('正在保存中...');
   *
   * @param {String} [text] 在遮盖上显示的提示文本。默认为Str.processing。
   */
  unmask(text) {
    Wb.unmask({
      target: this.el,
      text: text
    });
  }
  /**
   * 对当前组件添加遮盖，并显示和更新进度条位置或显示标签的文本。该方法将默认设置标签宽度。\
   * 隐藏进度条请使用{#unmask}方法。详见{#Wb.mask}和{#Wb.progress}方法。
   * Example: 
   * 
   *     comp.progress(60); //更新默认mask的进度条位置于60%处
   *     comp.progress(80.5, '正在保存中...'); //更新指定mask的进度条位置于80.5%处
   *     comp.progress('正在复制文件 file1.js'); //更新默认mask的标签文本
   *     comp.progress('正在复制文件 file2.js', 'myMask'); //更新指定mask的标签文本
   *     comp.progress('正在复制文件 file3.js', {text: 'myMask', width: null}); //取消宽度限制
   *     comp.progress(30, {cancel(){comp.unmask();}}); //点击取消按钮执行取消操作
   *     comp.progress([35, '正在复制文件file4.js']); //同时更新进度和标签
   * 
   * @param {Number/String/Array} info 如果为数值表示进度条进度百分比乘以100后的数值，如30表示进度条位置在30%处。\
   * 如果为字符串表示对应mask需要更新的标签文本。如果值为数组表示进度位置和标签文本的组合。
   * @param {Object/String} [configs] 遮盖的配置项或遮盖的提示文本，详见{#Wb.mask}方法的configs参数。
   * @return {Object} 遮盖对象，可用于使用{#progress}或{#unmask}方法。
   */
  progress(info, configs) {
    if (Wb.isObject(configs))
      configs = Wb.apply({
        target: this.el
      }, configs);
    else
      configs = {
        target: this.el,
        text: configs
      };
    return Wb.progress(info, configs);
  }
  /** @property {Boolean} - 是否设置框架效果。 @design */
  set frame(value) {
    this.applyCls(value, 'frame', 'w-frame');
  }
  /***/
  get frame() {
    return this.frame$;
  }
  /** @property {Set} - 组件子组件集。 */
  get owned() {
    return this.owned$ ??= new Set();
  }
  /** @property {Wb.Component} - 组件的拥有者，当拥有者被销毁时，拥有的所有组件也会被销毁。
   * 添加的子组件同时具有owner属性和{#parent}属性，均指向组件本身，子组件保存在owner的{#owned}属性内。
   * 区别于{#parent}属性，下级组件只具有{#parent}属性，其引用保存在items属性内。 @code
   */
  set owner(value) {
    let me = this, oldOwner = me.owner$;
    if (oldOwner !== value) {
      me.owner$ = value;
      if (oldOwner)
        oldOwner.owned.remove(me);
      if (value) {
        value.owned.add(me);
        me.parent = value;
      } else {
        me.parent = undefined;
      }
    }
  }
  /***/
  get owner() {
    return this.owner$;
  }
  /** @property {Wb.Component} parent 当前组件的上级组件。下级组件和子组件都具有parent属性。 @readonly */
  /**
   * 把当前组件按指定的方式同目标组件/元素对齐。详细说明请参考{#Element.alignTo}方法。
   * Example: 
   *
   *     // 把当前组件的左上角同目标组件的左下角对齐，并把当前组件限定显示在视口内。
   *     comp.alignTo(destComp, "tl-bl?"); //tl-可以省略
   *     // 把当前组件的左下角同目标组件的中心点对齐，并设置x坐标偏移-8。
   *     comp.alignTo(destComp, "bl-c", [-8, 0]);
   * 
   * @param {Wb.Component/Element} item 对齐到目标组件或元素。
   * @param {String} [position] 对齐的方式。
   * @param {Number[]} [offset] [x, y]指定的偏移量。
   * @param {Number[]} [minXY] [x, y]指定的最小值。
   */
  alignTo(item, position, offset, minXY) {
    this.el.alignTo(item.el || item, position || this.defaultAlign, offset || this.defaultOffset, minXY);
  }
  /**
   * 把当前组件显示到{#Element.posParent}元素的水平垂直中间位置。
   */
  center() {
    this.alignTo(this.el.posParent ?? BodyEl, 'c-c');
  }
  /**
   * 把当前组件按最近原则滚动到可视界面。
   */
  intoView() {
    this.el.intoView();
  }
  /**
   * 把当前组件滚动到可视界面中间位置。
   * @param {Boolean} smooth 是否平滑滚动。
   */
  intoViewCenter(smooth) {
    this.el.intoViewCenter(smooth);
  }
  /**
   * 把当前组件元素滚动到父元素垂直中间位置。
   */
  intoVCenter() {
    this.el.intoVCenter();
  }
  /**
   * 把当前组件元素滚动到父元素水平中间位置。
   */
  intoHCenter() {
    this.el.intoHCenter();
  }
  /**
   * @event beforeshow 在组件显示之前触发，返回false可阻止显示。
   */
  /**
   * @event show 在组件显示后触发。
   */
  /**
   * @event beforehide 在组件隐藏之前触发，返回false可阻止隐藏。
   */
  /**
   * @event hide 在组件隐藏后触发。
   */
  /** @property {Boolean} - 组件是否可见，隐藏后不保留占位空间。另请参见{#appeared}。
   * 设置该属性将触发{#*show}/{#*hide}事件。深度判断当前组件是否可见请使用{#isVisible}方法。 @key */
  set visible(visible) {
    if (this.visible$ !== visible && this.fireEvent(visible ? 'beforeshow' : 'beforehide') !== false) {
      this.visible$ = visible;
      this.el.visible = visible;
      this.fireEvent(visible ? 'show' : 'hide');
    }
  }
  /***/
  get visible() {
    return this.visible$;
  }
  /**
   * 设置组件是否可见。详见{#visible}属性。
   * @param {Boolean} visible 是否可见。
   */
  setVisible(visible) {
    this.visible = visible;
  }
  /**
   * 深度判断该组件是否可见。只要当前组件或任意某个上级组件隐藏（{#visible}属性为false），即判定当前组件为隐藏。
   * 简单判断当前组件是否隐藏请访问{#visible}属性。
   * @return {Boolean} true可见，false隐藏。
   */
  isVisible() {
    return !this.bubbleSome(parent => !parent.visible$);
  }
  /**
   * 隐藏组件，隐藏后不保留占位空间。该方法将触发{#*hide}事件。
   * @return {Wb.Component} 组件本身。
   */
  hide() {
    this.visible = false;
    return this;
  }
  /**
   * 显示该组件。该方法将触发{#*show}事件。
   * @return {Wb.Component} 组件本身。
   */
  show() {
    this.visible = true;
    return this;
  }
  /** @property {Boolean} - 组件是否可见，隐藏后保留占位空间。另请参见{#visible}。
   * 隐藏组件请尽量使用{#visible}属性。设置该属性不会触发{#*show}/{#*hide}事件。\
   * 深度判断当前组件是否显示请使用{#isAppeared}方法。 */
  set appeared(appeared) {
    if (this.appeared$ !== appeared) {
      this.appeared$ = appeared;
      this.el.appeared = appeared;
    }
  }
  /***/
  get appeared() {
    return this.appeared$;
  }
  /**
   * 设置组件是否显示。详见{#appeared}属性。隐藏组件请尽量使用{#visible}属性。设置该属性不会触发{#*show}/{#*hide}事件。\
   * 深度判断当前组件是否显示请使用{#isAppeared}方法。
   */
  setAppeared(appeared) {
    this.appeared = appeared;
  }
  /**
   * 深度判断该组件是否隐藏。只要当前组件或任意某个上级组件隐藏（{#appeared}属性为false），即判定当前组件为隐藏。
   * 简单判断当前组件是否隐藏请访问{#appeared}属性。
   * @return {Boolean} true隐藏，false可见。
   */
  isAppeared() {
    return !this.bubbleSome(parent => !parent.appeared$);
  }
  /** @property {Wb.Menu/Object} - 点击右键时菜单的上下文菜单。设置新的菜单后，该菜单实例将作为组件的子组件。请注意：设置
   * 新的菜单后原菜单不会被自动销毁。上下文菜单关联的元素见{#Wb.Menu.contextTarget}。
   */
  set contextMenu(value) {
    let me = this;
    if (me.contextMenu$ !== value) {
      if (value) {
        if (!value.instanced) {
          let configs = Wb.apply({ cname: 'menu', }, value);

          if (me.app)
            configs.app = me.app;
          value = Wb.create(configs);
        }
        value.owner = me;
      }
      me.contextMenu$ = value;
      me.setListeners(value, 'contextmenu', me.onContextmenu);
    }
  }
  /** @property {Wb.Menu} */
  get contextMenu() {
    return this.contextMenu$;
  }
  /**
   * 组件contextmenu事件触发时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onContextmenu(e) {
    let menu = this.contextMenu, target = e.target;
    if (menu.ignoreInputMenu && target.isInput)
      return;
    Wb.Menu.hideMenus();
    menu.contextTarget$ = target;
    menu.owner = this;
    menu.renderEl ??= BodyEl;
    menu.showAt(e.x, e.y);
    if (menu.visible || menu.hideSystemMenu)
      e.stopEvent();
  }
  /** @property {Number} - 组件的z-index值。 */
  set zIndex(value) {
    this.el.setStyle('z-index', value);
  }
  /***/
  get zIndex() {
    return this.el.getStyle('z-index');
  }
  /**
   * 显示组件，并设置组件的坐标。
   * @param {Number/String} x x坐标，如果为数值单位为px。
   * @param {Number/String} y y坐标，如果为数值单位为px。
   * @param {Boolean} [constrain] 是否限制在视口内显示。默认为true。
   */
  showAt(x, y, constrain) {
    this.show();
    if (constrain ?? true) {
      let el = this.el, pp = el.posParent;
      x = x.constrain(0, pp.offsetWidth - el.offsetWidth - 2);
      y = y.constrain(0, pp.offsetHeight - el.offsetHeight - 2);
    }
    this.x = x;
    this.y = y;
  }
  /**
   * 显示组件，并设置组件的对齐方式。
   * Example: 
   * 
   *     comp.showBy(panel, "tl-bl?"); //显示comp，并把comp的左上角同panel的左下角对齐，并把comp限定显示在视口内。
   * 
   * @param {Wb.Component/Element} refItem 参考组件或元素。当前组件将同该组件/元素对齐。
   * @param {String} [position] 对齐的方式，默认使用{#defaultAlign}属性设置对齐方式。
   * @param {Number[]} [offset] [x, y]指定的偏移量。
   * @param {Number[]} [minXY] [x, y]指定的最小值。
   * 对齐方式请参考{#Element.alignTo}方法。
   */
  showBy(refItem, position, offset, minXY) {
    this.show();
    this.alignTo(refItem, position, offset, minXY);
  }
  /**
   * 切换组件的显示/隐藏状态。
   */
  toggleShow() {
    this.visible = !this.visible;
  }
  /**
   * 切换组件的显示/隐藏状态。当显示组件时，同时设置组件的对齐方式。
   * @param {Wb.Component/Element} refItem 参考组件或元素。当前组件将同该组件/元素对齐。
   * @param {String} [position] 对齐的方式，默认使用{#defaultAlign}属性设置对齐方式。
   * @param {Number[]} [offset] [x, y]指定的偏移量。
   * @param {Number[]} [minXY] [x, y]指定的最小值。
   * 对齐方式请参考{#Element.alignTo}方法。
   */
  toggleShowBy(refItem, position, offset, minXY) {
    if (this.visible)
      this.hide();
    else
      this.showBy(refItem, position, offset, minXY);
  }
  /** @property {Boolean} plainIcon 该组件下所有的图标是否使用统一的图标素色。 @design */
  set plainIcon(value) {
    this.el.plainIcon = value;
  }
  /***/
  get plainIcon() {
    return this.el.plainIcon;
  }
  /** @property {Boolean/String} droppable 是否允许拖动{#draggable}的对象在当前组件内放下。如果为字符串，
   * 表示允许放下且{#dropGroup}为该值。
   */
  /** @property {String} dropGroup 拖放的组名称，仅允许来自相同dropGroup的组件放下。 */
  /** @property {Wb.Draggable} draggableComp 当前组件设置拖动的对象。 @readonly */
  /** @property {Boolean/Object} - 设置组件是否可被拖动。可以通过访问{#draggableComp}获得{#Wb.Draggable}对象。
   * -布尔值: 是否可拖动。
   * -对象值: 为{#Wb.Draggable}的配置对象。
   * 设置{#droppable}为true允许拖动后放下。
   */
  set draggable(value) {
    let oldValue = this.draggable$;
    if (oldValue !== value) {
      this.draggable$ = value;
      this.draggableComp?.setDisabled(true);
      if (value) {
        let defaultConfig = {
          target: this
        };
        if (Wb.isObject(value)) {
          this.draggableComp = new Wb.Draggable(Wb.apply(defaultConfig, value));
        } else {
          this.draggableComp = new Wb.Draggable(defaultConfig);
        }
      } else {
        delete this.draggableComp;
      }
    }
  }
  /***/
  get draggable() {
    return this.draggable$;
  }
  /** @property {Wb.Movable} movableComp 当前组件设置移动的对象。 @readonly @desktop */
  /** @property {Boolean/Object} - 设置组件是否可被移动。如果可被移动，可以通过访问{#movableComp}获得
   * {#Wb.Movable}对象。
   * -布尔值: 是否可移动。
   * -对象值: 为{#Wb.Movable}的配置对象。
   */
  set movable(value) {
    let oldValue = this.movable$;
    if (oldValue !== value) {
      this.movable$ = value;
      this.movableComp?.setDisabled(true);
      if (value) {
        let defaultConfig = {
          target: this,
          handle: this.el
        };
        if (Wb.isObject(value)) {
          this.movableComp = new Wb.Movable(Wb.apply(defaultConfig, value));
        } else {
          this.movableComp = new Wb.Movable(defaultConfig);
        }
      } else {
        delete this.movableComp;
      }
    }
  }
  /***/
  get movable() {
    return this.movable$;
  }
  /** @property {Wb.Resizable} resizableComp 当前组件调整大小的对象。 @readonly @desktop */
  /** @property {Boolean/Object/String} - 设置组件是否可被调整大小。通常当组件允许调整大小时，系统会自动为组件添加适当
   * 大小的border作为调整区域，以使调整操作更方便。如果无需添加border，可以设置{#Wb.Resizable.handleBorder}为
   * false。可以通过访问{#resizableComp}获得{#Wb.Resizable}对象。如果值为对象表示配置对象，值为字符串表示可调整的
   * 方位{#allowHandles}。
   * -布尔值: 所有方位是否可调整大小。
   * -对象值: 为{#Wb.Resizable}的配置对象。
   */
  set resizable(value) {
    let oldValue = this.resizable$;
    if (oldValue !== value) {
      this.resizable$ = value;
      if (Wb.isTouch)
        return;
      this.resizableComp?.close();
      if (value) {
        if (Wb.isObject(value)) {
          this.resizableComp = new Wb.Resizable(Wb.apply({
            target: this
          }, value));
        } else {
          this.resizableComp = new Wb.Resizable({
            target: this,
            allowHandles: Wb.isString(value) ? value : undefined
          });
        }
      } else {
        delete this.resizableComp;
      }
    }
  }
  /***/
  get resizable() {
    return this.resizable$;
  }
  /** @property {Boolean} - 组件内的文本是否禁止自动换行。 @design */
  set noWrap(value) {
    this.setCls(value, 'w-nowrap')
  }
  /***/
  get noWrap() {
    return this.containsCls('w-nowrap');
  }
  /**
   * 创建一个新的元素，并添加到组件dom元素的子元素的末尾。
   * Example: 
   * 
   *     let el = comp.addEl('my-cls');
   * 
   * @param {String} className 新创建元素的类名。
   * @param {String/Number} [tagName] 新创建元素的标签名，默认为'div'。如果为数值则为weight参数。
   * @param {Number} [weight] 元素位置权重，值越大越靠后。如果元素无weight将默认为50。
   * @return {Element} 新创建的元素。
   */
  addEl(className, tagName, weight) {
    return this.el.addEl(className, tagName, weight);
  }
  /**
   * 创建一个新的元素，并添加到组件dom元素的子元素的末尾。
   * Example: 
   * 
   *     let el = comp.addTag('span');
   * 
   * @param {String/Number} [tagName] 新创建元素的标签名，默认为'div'。如果为数值则为weight参数。详见{#addEl}方法。
   * @return {Element} 新创建的元素。
   */
  addTag(tagName) {
    return this.el.addEl(null, tagName);
  }
  /** @property {Boolean} - 当前组件在容器内是否全屏显示，即铺满整个容器。 @key */
  set full(value) {
    this.applyCls(value, 'full', 'w-full');
  }
  /***/
  get full() {
    return this.full$;
  }
  /** 
   * @property {Object} - 组件的位置和宽高。 @code
   * @param {Number} x x坐标
   * @param {Number} y y坐标
   * @param {Number} width 宽度
   * @param {Number} height 高度
   */
  set rect(value) {
    Wb.applyWith(this, value, ['x', 'y', 'width', 'height']);
  }
  /***/
  get rect() {
    return Wb.applyWith({}, this, ['x', 'y', 'width', 'height']);
  }
  /**
   * 生成覆盖组件面积的高亮效果。
   * @param {String} color 高亮颜色。默认为"yellow"。
   * @param {Boolean} [isCls] color是否为样式名。默认如果color以#开始表示颜色，否则表示样式名。
   * @return {Element} 高亮div元素。
   */
  highlight(color, isCls) {
    return this.el.highlight(color, isCls);
  }
  /** @property {Number/String} - 组件的x坐标值。如果值为数值，默认单位为px。 @code */
  set x(x) {
    this.el.setStyle('left', Wb.px(x));
  }
  /** @property {Number} */
  get x() {
    return this.el.offsetLeft;
  }
  /** @property {Number/String} - 组件的y坐标值。如果值为数值，默认单位为px。 @code */
  set y(y) {
    this.el.setStyle('top', Wb.px(y));
  }
  /** @property {Number} */
  get y() {
    return this.el.offsetTop;
  }
  /** @property {Number[]/String[]} - 组件的[x, y]坐标值。如果值为数值，默认单位为px。 @code */
  set xy(xy) {
    this.x = xy?.[0] ?? null;
    this.y = xy?.[1] ?? null;
  }
  /** @property {Number[]} */
  get xy() {
    return [this.x, this.y];
  }
  /** @property {Number/String} - 组件的宽度。如果值为数值，默认单位为px。 @design @key */
  set width(width) {
    this.el.setStyle('width', Wb.px(width));
  }
  /** @property {Number} */
  get width() {
    return this.el.offsetWidth;
  }
  /** @property {Number/String} - 组件的高度。如果值为数值，默认单位为px。 @design @key */
  set height(height) {
    this.el.setStyle('height', Wb.px(height));
  }
  /** @property {Number} */
  get height() {
    return this.el.offsetHeight;
  }
  /** @property {Number/String} - 设置组件的最小宽度值。如果值为数值，默认单位为px。 @design */
  set minWidth(value) {
    this.el.minWidth = value;
  }
  /** @property {String} - 获取组件的最小宽度值。 */
  get minWidth() {
    return this.el.minWidth;
  }
  /** @property {Number/String} - 设置组件的最小高度值。如果值为数值，默认单位为px。 @design */
  set minHeight(value) {
    this.el.minHeight = value;
  }
  /** @property {String} - 获取组件的最小高度值。 */
  get minHeight() {
    return this.el.minHeight;
  }
  /** @property {Number/String} - 组件的最大宽度值。如果值为数值，默认单位为px。 @design */
  set maxWidth(value) {
    this.el.maxWidth = value;
  }
  /** @property {String} */
  get maxWidth() {
    return this.el.maxWidth;
  }
  /** @property {Number/String} - 组件的最大高度值。如果值为数值，默认单位为px。 @design */
  set maxHeight(value) {
    this.el.maxHeight = value;
  }
  /** @property {String} */
  get maxHeight() {
    return this.el.maxHeight;
  }
  /** @property {Enum/Number/String} - 组件外边距。如果值为数值，默认单位为px。
   * -true: 设置全部外边距为指定值的边距。
   * -false: 无边距。
   * -'top': 仅上边距。
   * -'right': 仅右边距。
   * -'bottom': 仅下边距。
   * -'left': 仅左边距。
   * @design
   */
  set margin(value) {
    this.el.margin = value;
  }
  /***/
  get margin() {
    return this.el.margin;
  }
  /** @property {Enum/Number/String} - 组件内边距。如果值为数值，默认单位为px。
   * -true: 设置全部内边距为指定值的边距。
   * -false: 无边距。
   * -'top': 仅上边距。
   * -'right': 仅右边距。
   * -'bottom': 仅下边距。
   * -'left': 仅左边距。
   * @design
   */
  set padding(value) {
    this.el.padding = value;
  }
  /***/
  get padding() {
    return this.el.padding;
  }
  /** @property {Element[]} tabIndexEl 组件中设置tabIndex的元素数组。缺省为{#focusEl}。 @priv */
  /** @property {Element} focusEl 组件中设置焦点的元素。缺省为组件元素。 @priv */
  /** @property {Enum/Number} - 组件的tabIndex。
   * --1: -1。
   * -0: 0。
   * -1: 1。
   * -2: 2。
   * -null: null值，对于输入元素将设置为-1，其它元素将移除tabIndex属性。
   * -undefined: undefined值表示不作任何设置。
   */
  set tabIndex(index) {
    if (this.tabIndex$ !== index) {
      let tabIndexEl = this.tabIndexEl;

      if (Wb.isEmpty(tabIndexEl))
        tabIndexEl = this.focusEl ?? this.el;
      this.tabIndex$ = index;
      Wb.toArray(tabIndexEl).forEach(el => {
        if (index == null) {
          if (el.isInput)
            el.tabIndex = -1;
          else
            el.removeAttribute('tabIndex');
        } else {
          el.tabIndex = index;
        }
      });
    }
  }
  /***/
  get tabIndex() {
    return this.tabIndex$;
  }
  /** @property {String} - 组件的定位方式。 @code */
  set position(value) {
    this.el.setStyle('position', value);
  }
  /***/
  get position() {
    return this.el.getStyle('position');
  }
  /** @property {Number/String} - 设置组件字体大小。 @design */
  set fontSize(value) {
    this.el.setStyle('font-size', Wb.px(value));
  }
  /** @property {String} - 获取组件字体大小。 */
  get fontSize() {
    return this.el.getStyle('font-size');
  }
  /** @property {ColorString} - 组件字体色。设置true使用"激活色"作为字体色，设置false使用默认字体色。 @design */
  set color(value) {
    this.el.color = value;
  }
  /***/
  get color() {
    return this.el.color;
  }
  /** @property {ColorString} - 组件背景色。设置true使用"固定色"作为背景色，设置false使用默认背景色。 @design  */
  set background(value) {
    this.el.bgColor = value;
  }
  /***/
  get background() {
    return this.el.bgColor;
  }
  /** @property {Enum/Number/String} - 组件边界。如果值为数值，默认单位为px。如需设置更多请访问{#style}属性。
   * -true: 设置全部边界为"thin"。
   * -false: 无边界。
   * -'top': 仅上边界为"thin"。
   * -'right': 仅右边界为"thin"。
   * -'bottom': 仅下边界为"thin"。
   * -'left': 仅左边界为"thin"。
   * @design 
   */
  set border(val) {
    this.el.border = val;
  }
  /***/
  get border() {
    return this.el.border;
  }
  /** @property {String} - 组件顶边界。 @code */
  set borderTop(border) {
    this.el.setStyle('border-top', border);
  }
  /***/
  get borderTop() {
    return this.el.getStyle('border-top');
  }
  /** @property {String} - 组件右边界。 @code */
  set borderRight(border) {
    this.el.setStyle('border-right', border);
  }
  /***/
  get borderRight() {
    return this.el.getStyle('border-right');
  }
  /** @property {String} - 组件底边界。 @code */
  set borderBottom(border) {
    this.el.setStyle('border-bottom', border);
  }
  /***/
  get borderBottom() {
    return this.el.getStyle('border-bottom');
  }
  /** @property {String} - 组件左边界。 @code */
  set borderLeft(border) {
    this.el.setStyle('border-left', border);
  }
  /***/
  get borderLeft() {
    return this.el.getStyle('border-left');
  }
  /** @property {Enum} - 当前组件在弹性布局容器中主轴垂直方向排列方式。
   * -'start': 开始
   * -'center': 中间
   * -'end': 末尾
   * -'baseline': 文字基线
   * -'stretch': 拉伸
   * @design
   */
  set alignSelf(value) {
    this.setStyle('align-self', value);
  }
  /***/
  get alignSelf() {
    return this.getStyle('align-self');
  }
  /** @property {Enum} - 当前组件在弹性布局容器中对齐方式。通常应用在grid布局下当前组件的对齐方式。
   * -'start': 开始
   * -'center': 中间
   * -'end': 末尾
   * -'baseline': 文字基线
   * -'stretch': 拉伸
   * @design
   */
  set justifySelf(value) {
    this.setStyle('justify-self', value);
  }
  /***/
  get justifySelf() {
    return this.getStyle('justify-self');
  }
  /** @property {String} - 组件元素的grid-area样式，用于指定组件位于网格布局中的位置。
   * Example:
   *
   *     span 2 / span 3 //表示跨2行3列
   * @design
   */
  set gridArea(value) {
    this.el.setStyle('grid-area', value);
  }
  /***/
  get gridArea() {
    return this.el.getStyle('grid-area');
  }
  /** @property {Enum/Number/String} - 组件元素的grid-column样式，用于指定组件位于网格布局中的列位置。
   * Example:
   *
   *     span 3 //表示跨3列
   * 
   * -'span 1': 跨1列
   * -'span 2': 跨2列
   * -'span 3': 跨3列
   * -'span 4': 跨4列
   * -'span 5': 跨5列
   * -'span 6': 跨6列
   * -'span 7': 跨7列
   * -'span 8': 跨8列
   * -'span 9': 跨9列
   * -'span 10': 跨10列
   * -'1 / -1': 跨整行
   * -'-2 / -1': 最后列
   * @design
   * @key
   */
  set gridColumn(value) {
    this.el.setStyle('grid-column', value);
  }
  /***/
  get gridColumn() {
    return this.el.getStyle('grid-column');
  }
  /** @property {Enum/Number/String} - 组件元素的grid-area样式，用于指定组件位于网格布局中的行位置。
   * Example:
   *
   *     span 2 //表示跨2行
   * 
   * -'span 1': 跨1行
   * -'span 2': 跨2行
   * -'span 3': 跨3行
   * -'span 4': 跨4行
   * -'span 5': 跨5行
   * -'span 6': 跨6行
   * -'span 7': 跨7行
   * -'span 8': 跨8行
   * -'span 9': 跨9行
   * -'span 10': 跨10行
   * -'1 / -1': 跨整行
   * -'-2 / -1': 最后列
   * @design
   * @key
   */
  set gridRow(value) {
    this.el.setStyle('grid-row', value);
  }
  /***/
  get gridRow() {
    return this.el.getStyle('grid-row');
  }
  /** @property {Element} - 组件中设置滚动状态的dom元素。 @priv */
  set scrollEl(el) {
    this.scrollEl$ = el;
  }
  /***/
  get scrollEl() {
    return this.scrollEl$ ?? this.bodyEl ?? this.el;
  }
  /** @property {Enum} - 当组件溢出时是否显示滚动条。
   * -true: 允许水平垂直滚动
   * -'x': 仅允许水平滚动
   * -'y': 仅允许垂直滚动
   * -'auto': 允许水平垂直滚动，且仅当鼠标悬停在元素上时显示滚动条
   * -'auto-x': 仅允许水平滚动，且仅当鼠标悬停在元素上时显示滚动条
   * -'auto-y': 仅允许垂直滚动，且仅当鼠标悬停在元素上时显示滚动条
   * -'hide': 允许水平垂直滚动，且始终隐藏滚动条
   * -'hide-x': 仅允许水平滚动，且始终隐藏滚动条
   * -'hide-y': 仅允许垂直滚动，且始终隐藏滚动条
   * -false: 禁止滚动且隐藏溢出内容
   * @key @design
   */
  set autoScroll(value) {
    this.scrollEl.autoScroll = value;
  }
  /***/
  get autoScroll() {
    return this.scrollEl.autoScroll$;
  }
  /**
   * 获取当前组件同级的前/后某个组件。仅适用于同级的下级组件，不适用于子组件。
   * @param {Number} offset 前后的位次。
   * @return {Wb.Component} 找到的组件，未找到返回null。
   */
  getSibling(offset) {
    let items, parent = this.parent;

    if (items = parent?.items$) {
      let index = items.indexOf(this);
      if (index != -1)
        return items[index + offset] ?? null;
    }
    return null;
  }
  /** @property {Wb.Component} - 获取同级的前一个组件。仅适用于同级的下级组件，不适用于子组件。 */
  get previousSibling() {
    return this.getSibling(-1);
  }
  /** @property {Wb.Component} - 获取同级的后一个组件。仅适用于同级的下级组件，不适用于子组件。 */
  get nextSibling() {
    return this.getSibling(1);
  }
  /**
   * 循环遍历获取同级的前一个或后一个组件。该方法同{#getSibling}方法的区别为前者循环遍历，即遍历到头或尾的
   * 前/后组件时，自动转到尾或头，直到遍历到组件本身为止。
   * @param {Boolean} [next] false返回前一个组件，true返回后一个组件。
   * @param {Boolean} [allowHidden] 允许返回隐藏的组件。
   * @param {Boolean} [allowDisabled] 允许返回禁用的组件。
   * @return {Wb.Component} 找到的组件，未找到返回null。
   */
  travelSibling(next, allowHidden, allowDisabled) {
    let comp = this, me = comp, parent = me.parent, beginItem;

    if (!parent)
      return null;
    beginItem = next ? parent.firstItem : parent.lastItem;
    do {
      comp = (next ? comp.nextSibling : comp.previousSibling) ?? beginItem;
      if (comp == me)
        return null;
    } while (comp && (!allowHidden && (!comp.visible || !comp.appeared) || !allowDisabled && comp.disabled));
    return comp;
  }
  /** @property {Wb.Component} - 循环获取同级的前一个非隐藏非禁用的组件。如果未找到返回null。 */
  get previousValidSibling() {
    return this.travelSibling(false);
  }
  /** @property {Wb.Component} - 循环获取同级的后一个非隐藏非禁用的组件。如果未找到返回null。 */
  get nextValidSibling() {
    return this.travelSibling(true);
  }
  /***/
  set cid(cid) {
    let el = this.el
    super.cid = cid;
    if (cid)
      el.setAttribute('cid', cid);
    else
      el.removeAttribute('cid');
  }
  /***/
  get cid() {
    return this.cid$;
  }
  /**
   * 对组件的dom元素添加样式类名。
   * @param {String} cls 样式类名。
   */
  addCls(cls) {
    this.el.classList.add(cls);
  }
  /**
   * 移除组件的dom元素的样式类名。如果移除后元素的className为空，将删除class属性。
   * @param {String} cls 样式类名。
   */
  removeCls(cls) {
    this.el.removeCls(cls);
  }
  /**
   * 对组件的dom元素添加或移除样式类名。
   * @param {Boolean} enabled true添加样式，false移除样式。
   * @param {String} cls 样式类名。
   */
  setCls(enabled, cls) {
    this.el.setCls(enabled, cls);
  }
  /**
   * 切换组件元素样式类名。如果存在指定名称的类名则移除，否则添加。
   * @param {String} cls 样式类名。
   */
  toggleCls(cls) {
    this.el.toggleCls(cls);
  }
  /**
   * 判断组件的dom元素的样式类名列表中是否包含指定的样式类名。
   * @param {String} cls 样式类名。
   * @return {Boolean} true包含，false未包含。
   */
  containsCls(cls) {
    return this.el.classList.contains(cls);
  }
  /** @property {String} - 添加到组件dom元素的以空格分隔的多个样式类名。区别于元素的className属性，
   * 设置该属性将增量添加类名。设置为静态值可以为组件增量添加默认的cls。
   */
  set cls(cls) {
    this.el.cls = cls;
  }
  /** @property {String} - 组件的dom元素的样式类名称，同元素的className属性一致。 */
  get cls() {
    return this.el.className;
  }
  /** @property {String} - 添加到组件的dom元素的以分号分隔的多个样式。设置该属性将增量添加样式。 */
  set style(style) {
    this.el.styleText = style;
  }
  /** @property {String} - 获取组件的dom元素样式字符串，同style.cssText属性一致。*/
  get style() {
    return this.el.style.cssText;
  }
  /**
   * 获取组件的dom元素指定样式属性的值。
   * @param {String} property 样式属性名称。
   * @return {String} 样式属性值。
   */
  getStyle(property) {
    return this.el.style.getPropertyValue(property);
  }
  /**
   * 设置组件的dom元素指定样式属性的值。
   * @param {String} property 样式属性名称。
   * @param {Object} value 样式属性值。
   * @param {String} [priority] 优先级字符串，如"important"。
   */
  setStyle(property, value, priority) {
    this.el.style.setProperty(property, value, priority);
  }
  /**
   * 删除组件的dom元素指定名称的样式属性。如果移除后元素的style为空，将删除style属性。
   * @param {String} property 样式属性名称。
   */
  removeStyle(property) {
    this.el.removeStyle(property);
  }
  /** @property {Element[]} disabledEls 禁用组件时需要禁用的元素列表。 @priv */
  /** @property {Boolean} - 组件是否禁用。 @design @key */
  set disabled(disabled) {
    let me = this;

    if (me.disabled$ !== disabled) {
      let el = me.el, tabIndex;

      me.disabled$ = disabled;
      if (disabled) {
        tabIndex = me.tabIndex;
        if (tabIndex != null) {
          me.savedTabIndex = tabIndex;
          me.tabIndex = null;
        }
        el.addCls('w-disabled');
      } else {
        tabIndex = me.savedTabIndex;
        if (tabIndex != null)
          me.el.tabIndex = me.savedTabIndex;
        el.removeCls('w-disabled');
      }
      me.disabledEls?.forEach(el => el.disabled = disabled);
      me.setListeners(disabled, 'focusin', me.onDisableFocusIn);
    }
  }
  /***/
  get disabled() {
    return this.disabled$;
  }
  /**
   * 禁用获得焦点时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onDisableFocusIn(e) {
    e.target.blur();
  }
  /**
   * 组件是否禁用。
   * @param {Boolean} disabled 是否禁用。
   */
  setDisabled(disabled) {
    this.disabled = disabled;
  }
  /**
   * 显示以事件鼠标点为圆心生成覆盖组件面积的波纹效果。
   * @param {Event} e 事件对象。
   * @priv
   */
  rippleEffect(e) {
    this.el.rippleEffect(e.x, e.y, this.rippleRange, this.rippleCls);
  }
  /** @property {Boolean} - 点击组件时是否显示波纹。 */
  set rippleOnClick(value) {
    let me = this;
    if (me.rippleOnClick$ !== value) {
      me.rippleOnClick$ = value;
      me.setListeners(value, me.tapClick ? Event.tapDownName : 'click', me.rippleEffect, me, { passive: false });
    }
  }
  /***/
  get rippleOnClick() {
    return this.rippleOnClick$;
  }
  /** @property {Boolean/Number/Object} rippleRange 波纹的限定范围，如果设置该值波纹的范围将限定于此。\
   * true表示范围为100*100px。数值类型表示宽高均限定为此值。对象类型表示指定宽高，rippleRange.width为限定宽度值，
   * 单位为px，rippleRange.height为限定高度值，单位为px。 @code
   */
  /** @property {String} rippleCls 波纹效果的附加样式类名。 @priv */
  /**
   * 遍历组件所有的直接下级组件或（和）子组件({#owned}属性中的组件)，对每个被遍历的组件执行一次给定的方法。
   * 该方法默认仅遍历直接的下级组件。
   * Example: 
   * 
   *     panel.each(item => console.log(item));
   * 
   * @param {Function} fn 遍历每个组件时执行的方法。如果方法返回false，将中断遍历。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {String} fn.index 当前组件的索引。仅当遍历直接下级组件时有效。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @param {Boolean} [reverse] 是否逆向遍历，true逆向，false正向。仅当遍历直接下级组件时有效。
   * @param {Boolean} [whole] 是否完整遍历下级组件和子组件，true完整遍历下级组件和子组件，
   * false仅遍历子组件，null只遍历下级组件（默认值）。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  each(fn, scope, reverse, whole) {
    scope ??= this;
    if (whole !== false) {
      //遍历下级组件，因为组件内可以嵌套容器，因此在组件级方法也必须支持items的遍历
      if (this.items$?.each(fn, scope, reverse) === false)
        return false;
    }
    if (whole != null) {
      //遍历子组件
      if (this.owned$?.each(fn, scope) === false) //Set对象无需reverse处理
        return false;
    }
    return true;
  }
  /**
   * 遍历组件所有的直接下级组件和子组件({#owned}属性中的组件)，对每个被遍历的组件执行一次给定的方法。
   * 该方法遍历直接的下级组件和子组件。
   * @param {Function} fn 遍历每个组件时执行的方法。如果方法返回false，将中断遍历。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {String} fn.index 当前组件的索引。仅当遍历直接下级组件时有效。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @param {Boolean} [reverse] 是否逆向遍历，true逆向，false正向。仅当遍历直接下级组件时有效。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  eachWhole(fn, scope, reverse) {
    return this.each(fn, scope, reverse, true);
  }
  /**
   * 遍历组件子组件({#owned}属性中的组件)，对每个被遍历的组件执行一次给定的方法。
   * @param {Function} fn 遍历每个组件时执行的方法。如果方法返回false，将中断遍历。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  eachOwned(fn, scope) {
    return this.owned$?.each(fn, scope) ?? true;
  }
  /**
   * 向下遍历组件所有的下级组件或（和）子组件({#owned}属性中的组件)，对每个被遍历的组件执行一次给定的方法。
   * Example: 
   * 
   *     panel.cascade(item => console.log(item));
   * 
   * @param {Function} fn 遍历每个组件时执行的方法。如果方法返回false将中断遍历，返回null当前节点下的条目将不再遍历。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @param {Boolean} [reverse] 是否逆向遍历，true逆向，false正向。仅当遍历下级组件时有效。
   * @param {Boolean} [includeSelf] 遍历时是否包含组件本身。
   * @param {Boolean} [whole] 是否完整遍历下级组件和子组件，true完整遍历下级组件和子组件，
   * false仅遍历子组件，null只遍历下级组件（默认值）。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  cascade(fn, scope, reverse, includeSelf, whole) {
    scope ??= this;
    if (includeSelf) {
      let result = fn.call(scope, this);
      if (result === false)
        return false;
      else if (result === null)
        return true;
    }
    return this.each(item => {
      return item.cascade(fn, scope, reverse, true, whole);
    }, scope, reverse, whole);
  }
  /**
   * 向下遍历组件本身及其所有的下级组件或（和）子组件({#owned}属性中的组件)，对每个被遍历的组件执行一次给定的方法。
   * 该方法同{#cascade}方法的区别为遍历时默认包含组件本身。
   * @param {Function} fn 遍历每个组件时执行的方法。如果方法返回false将中断遍历，返回null当前节点下的条目将不再遍历。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @param {Boolean} [reverse] 是否逆向遍历，true逆向，false正向。仅当遍历下级组件时有效。
   * @param {Boolean} [whole] 是否完整遍历下级组件和子组件，true完整遍历下级组件和子组件，
   * false仅遍历子组件，null只遍历下级组件（默认值）。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  cascadeSelf(fn, scope, reverse, whole) {
    return this.cascade(fn, scope, reverse, true, whole);
  }
  /**
   * 向下遍历组件所有的下级组件和子组件({#owned}属性中的组件)，对每个被遍历的组件执行一次给定的方法。
   * 该方法同{#cascade}方法的区别为遍历时默认包含子组件。
   * @param {Function} fn 遍历每个组件时执行的方法。如果方法返回false将中断遍历，返回null当前节点下的条目将不再遍历。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @param {Boolean} [reverse] 是否逆向遍历，true逆向，false正向。仅当遍历下级组件时有效。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  cascadeWhole(fn, scope, reverse) {
    return this.cascade(fn, scope, reverse, false, true);
  }
  /**
   * 向下遍历组件本身及其所有的下级组件和子组件({#owned}属性中的组件)，对每个被遍历的组件执行一次给定的方法。
   * 该方法同{#cascade}方法的区别为遍历时默认包含组件本身以及子组件。
   * @param {Function} fn 遍历每个组件时执行的方法。如果方法返回false将中断遍历，返回null当前节点下的条目将不再遍历。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @param {Boolean} [reverse] 是否逆向遍历，true逆向，false正向。仅当遍历下级组件时有效。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  cascadeSelfWhole(fn, scope, reverse) {
    return this.cascade(fn, scope, reverse, true, true);
  }
  /**
   * 向上遍历组件所有的上级组件，对每个被遍历的组件执行一次给定的方法。
   * Example: 
   * 
   *     panel.bubble(item => console.log(item));
   * 
   * @param {Function} fn 遍历每个组件时执行的方法。如果方法返回false，将中断遍历。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @param {Boolean} [excludeSelf] 遍历时是否排除组件本身。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  bubble(fn, scope, excludeSelf) {
    return Wb.bubble(this, fn, 'parent', scope, excludeSelf);
  }
  /**
   * 向上遍历组件所有的上级组件（不含组件本身），对每个被遍历的组件执行一次给定的方法。
   * 该方法同{#bubble}方法的区别为遍历时不包含组件本身。
   * @param {Function} fn 遍历每个组件时执行的方法。如果方法返回false，将中断遍历。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @return {Boolean} true成功完成遍历，false遍历被中断。
   */
  bubbleParent(fn, scope) {
    return this.bubble(fn, scope, true);
  }
  /** @property {Proxy} - 下级组件或（和）子组件的代理对象，可通过该对象直接访问这些组件。 */
  get children() {
    return this.children$ ??= new Proxy(this, {
      //读接口
      get(target, prop) {
        return target.down(prop);
      }
    });
  }
  /**
   * 向下遍历组件所有的下级组件或（和）子组件({#owned}属性中的组件)，查找cid为指定名称的组件。
   * Example: 
   * 
   *     let comp = panel.down('nameText');
   *     //comp为panel下首个cid为nameText的组件
   * 
   * @param {String/Function} cid 组件的标识cid属性。如果值为方法同{#downBy}。
   * @param {Boolean} [includeSelf] 遍历时是否包含组件本身。
   * @param {Boolean} [whole] 是否完整遍历下级组件和子组件，true完整遍历下级组件和子组件，
   * false仅遍历子组件，null只遍历下级组件（默认值）。
   * @param {Boolean} [queryAll] 是否查询所有匹配的组件，默认为查询首个匹配的组件。
   * @return {Wb.Component/Wb.Component[]} 如果查找单个，返回组件，未找到返回null；如果查找多个，
   * 返回组件组成的数组，未找到返回空数组。
   */
  down(...args) {
    let cid = args[0];
    if (Wb.isFunction(cid))
      return this.downBy(...args);
    let result, includeSelf = args[1], whole = args[2], queryAll = args[3];

    result = queryAll ? [] : null;
    this.cascade(item => {
      if (item.cid$ == cid) {
        if (queryAll) {
          result.push(item);
        } else {
          result = item;
          return false;
        }
      }
    }, this, false, includeSelf, whole);
    return result;
  }
  /**
   * 向下遍历组件所有的下级组件，查找所有cid为指定名称的组件。
   * @param {String/Function} cid 组件的标识cid属性。如果值为方法同{#downAllBy}。
   * @param {Boolean} [includeSelf] 遍历时是否包含组件本身。
   * @return {Wb.Component[]} 返回组件组成的数组，如果未找到返回空数组。
   */
  downAll(cid, includeSelf, x) {
    if (Wb.isFunction(cid))
      return this.downAllBy(cid, includeSelf, x);
    else
      return this.down(cid, includeSelf, null, true);
  }
  /**
   * 向下遍历组件所有的下级组件和子组件({#owned}属性中的组件)，查找cid为指定名称的组件。
   * @param {String/Function} cid 组件的标识cid属性。如果值为方法同{#downWholeBy}。
   * @param {Boolean} [includeSelf] 遍历时是否包含组件本身。
   * @return {Wb.Component} 返回找到的组件，未找到返回null。
   */
  downWhole(cid, includeSelf, x) {
    if (Wb.isFunction(cid))
      return this.downWholeBy(cid, includeSelf, x);
    else
      return this.down(cid, includeSelf, true);
  }
  /**
   * 向下遍历组件所有的下级组件和子组件({#owned}属性中的组件)，查找所有cid为指定名称的组件。
   * @param {String/Function} cid 组件的标识cid属性。如果值为方法同{#downAllWholeBy}。
   * @param {Boolean} [includeSelf] 遍历时是否包含组件本身。
   * @return {Wb.Component[]} 返回组件组成的数组，如果未找到返回空数组。
   */
  downAllWhole(cid, includeSelf, x) {
    if (Wb.isFunction(cid))
      return this.downAllWholeBy(cid, includeSelf, x);
    else
      return this.down(cid, includeSelf, true, true);
  }
  /**
   * 向下遍历组件所有的下级组件或（和）子组件({#owned}属性中的组件)，查找满足指定条件的组件。
   * Example: 
   * 
   *     let comp = panel.downBy(item => item.foo == 'bar');
   *     //comp为panel下首个foo属性为bar的组件
   * 
   * @param {Function} fn 判断组件是否满足条件的方法，返回true满足，false不满足。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @param {Boolean} [includeSelf] 遍历时是否包含组件本身。
   * @param {Boolean} [whole] 是否完整遍历下级组件和子组件，true完整遍历下级组件和子组件，
   * false仅遍历子组件，null只遍历下级组件（默认值）。
   * @param {Boolean} [queryAll] 是否查询所有匹配的组件，默认为查询首个匹配的组件。
   * @return {Wb.Component/Wb.Component[]} 如果查找单个，返回组件，未找到返回null；如果查找多个，
   * 返回组件组成的数组，未找到返回空数组。
   */
  downBy(fn, scope, includeSelf, whole, queryAll) {
    let result;

    scope ??= this;
    result = queryAll ? [] : null;
    this.cascade(item => {
      if (fn.call(scope, item)) {
        if (queryAll) {
          result.push(item);
        } else {
          result = item;
          return false;
        }
      }
    }, this, false, includeSelf, whole);
    return result;
  }
  /**
   * 向下遍历组件所有的下级组件，查找所有满足指定条件的组件。
   * @param {Function} fn 判断组件是否满足条件的方法，返回true满足，false不满足。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @param {Boolean} [includeSelf] 遍历时是否包含组件本身。
   * @return {Wb.Component[]} 返回组件组成的数组，如果未找到返回空数组。
   */
  downAllBy(fn, scope, includeSelf) {
    return this.downBy(fn, scope, includeSelf, null, true);
  }
  /**
   * 向下遍历组件所有的下级组件和子组件({#owned}属性中的组件)，查找满足指定条件的组件。
   * @param {Function} fn 判断组件是否满足条件的方法，返回true满足，false不满足。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @param {Boolean} [includeSelf] 遍历时是否包含组件本身。
   * @return {Wb.Component} 返回找到的组件，未找到返回null。
   */
  downWholeBy(fn, scope, includeSelf) {
    return this.downBy(fn, scope, includeSelf, true);
  }
  /**
   * 向下遍历组件所有的下级组件和子组件({#owned}属性中的组件)，查找所有满足指定条件的组件。
   * @param {Function} fn 判断组件是否满足条件的方法，返回true满足，false不满足。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @param {Boolean} [includeSelf] 遍历时是否包含组件本身。
   * @return {Wb.Component[]} 返回组件组成的数组，如果未找到返回空数组。
   */
  downAllWholeBy(fn, scope, includeSelf) {
    return this.downBy(fn, scope, includeSelf, true, true);
  }
  /**
   * 向上遍历组件所有的上级组件，查找cid为指定名称的组件。
   * Example: 
   * 
   *     let panel = text.up('myPanel');
   *     //panel为text上级组件中最近的cid为myPanel的组件
   * 
   * @param {String} cid 组件的标识cid属性。
   * @param {Boolean} [excludeSelf] 遍历时是否不包含组件本身。
   * @param {Boolean} [queryAll] 是否查询所有匹配的组件，默认为查询首个匹配的组件。
   * @return {Wb.Component/Wb.Component[]} 如果查找单个，返回组件，未找到返回null；如果查找多个，
   * 返回组件组成的数组，未找到返回空数组。
   */
  up(cid, excludeSelf, queryAll, x) {
    if (Wb.isFunction(cid))
      return this.upBy(cid, excludeSelf, queryAll, x);
    let result, parent;

    result = queryAll ? [] : null;
    parent = excludeSelf ? this.parent : this;
    while (parent) {
      if (parent.cid$ == cid) {
        if (queryAll)
          result.push(parent);
        else
          return parent;
      }
      parent = parent.parent;
    }
    return result;
  }
  /**
   * 向上遍历组件所有的上级组件，查找所有cid为指定名称的组件。
   * @param {String} cid 组件的标识cid属性。
   * @param {Boolean} [excludeSelf] 遍历时是否不包含组件本身。
   * @return {Wb.Component[]} 返回组件组成的数组，未找到返回空数组。
   */
  upAll(cid, excludeSelf) {
    return this.up(cid, excludeSelf, true);
  }
  /**
   * 向上遍历组件所有的上级组件，查找满足指定条件的组件。
   * Example: 
   * 
   *     let panel = text.upBy(item => item.foo == 'bar');
   *     //panel为text上级组件中最近的foo属性为bar的组件
   * 
   * @param {Function} fn 判断组件是否满足条件的方法，返回true满足，false不满足。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @param {Boolean} [excludeSelf] 遍历时是否不包含组件本身。
   * @param {Boolean} [queryAll] 是否查询所有匹配的组件，默认为查询首个匹配的组件。
   * @return {Wb.Component/Wb.Component[]} 如果查找单个，返回组件，未找到返回null；如果查找多个，
   * 返回组件组成的数组，未找到返回空数组。
   */
  upBy(fn, scope, excludeSelf, queryAll) {
    let result, parent;

    result = queryAll ? [] : null;
    parent = excludeSelf ? this.parent : this;
    while (parent) {
      if (fn.call(scope, parent)) {
        if (queryAll)
          result.push(parent);
        else
          return parent;
      }
      parent = parent.parent;
    }
    return result;
  }
  /**
   * 向上遍历组件所有的上级组件，查找所有满足指定条件的组件。
   * @param {Function} fn 判断组件是否满足条件的方法，返回true满足，false不满足。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @param {Boolean} [excludeSelf] 遍历时是否不包含组件本身。
   * @return {Wb.Component[]} 返回组件组成的数组，未找到返回空数组。
   */
  upAllBy(fn, scope, excludeSelf) {
    return this.upBy(fn, scope, excludeSelf, true);
  }
  /**
   * 遍历组件直接的下级组件或（和）子组件({#owned}属性中的组件)，查找cid为指定名称的组件。
   * Example: 
   * 
   *     let comp = panel.find('nameText');
   *     //comp为panel直接下级组件中cid为nameText的组件
   * 
   * @param {String/Function} cid 组件的标识cid属性。如果值为方法同{#findBy}。
   * @param {Boolean} [whole] 是否完整遍历下级组件和子组件，true完整遍历下级组件和子组件，
   * false仅遍历子组件，null只遍历下级组件（默认值）。
   * @return {Wb.Component} 返回找到的组件，未找到返回null。
   */
  find(...args) {
    let cid = args[0];
    if (Wb.isFunction(cid))
      return this.findBy(...args);
    let result, whole = args[1];

    this.each(item => {
      if (item.cid$ == cid) {
        result = item;
        return false;
      }
    }, this, false, whole);
    return result ?? null;
  }
  /**
   * 遍历组件直接的下级组件和子组件({#owned}属性中的组件)，查找cid为指定名称的组件。
   * @param {String/Function} cid 组件的标识cid属性。如果值为方法同{#findWholeBy}。
   * @return {Wb.Component} 返回找到的组件，未找到返回null。
   */
  findWhole(cid, scope) {
    if (Wb.isFunction(cid))
      return this.findWholeBy(cid, scope);
    else
      return this.find(cid, true);
  }
  /**
   * 遍历组件直接的下级组件或（和）子组件({#owned}属性中的组件)，查找满足指定条件的组件。
   * Example: 
   * 
   *     let comp = panel.findBy(item => item.foo == 'bar');
   *     //comp为panel直接下级组件中foo属性为bar的组件
   * 
   * @param {Function} fn 判断组件是否满足条件的方法，返回true满足，false不满足。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @param {Boolean} [whole] 是否完整遍历下级组件和子组件，true完整遍历下级组件和子组件，
   * false仅遍历子组件，null只遍历下级组件（默认值）。
   * @param {Boolean} [queryAll] 是否查询所有匹配的组件，默认为查询首个匹配的组件。
   * @return {Wb.Component/Wb.Component[]} 如果查找单个，返回组件，未找到返回null；如果查找多个，
   * 返回组件组成的数组，未找到返回空数组。
   */
  findBy(fn, scope, whole, queryAll) {
    let result;

    scope ??= this;
    result = queryAll ? [] : null;
    this.each(item => {
      if (fn.call(scope, item)) {
        if (queryAll) {
          result.push(item);
        } else {
          result = item;
          return false;
        }
      }
    }, scope, false, whole);
    return result;
  }
  /**
   * 遍历组件直接的下级组件和子组件({#owned}属性中的组件)，查找满足指定条件的组件。
   * @param {Function} fn 判断组件是否满足条件的方法，返回true满足，false不满足。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @return {Wb.Component} 返回找到的组件，未找到返回null。
   */
  findWholeBy(fn, scope) {
    return this.findBy(fn, scope, true);
  }
  /**
   * 遍历组件直接的下级组件，查找所有满足指定条件的组件。
   * @param {Function} fn 判断组件是否满足条件的方法，返回true满足，false不满足。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @return {Wb.Component[]} 返回组件组成的数组，未找到返回空数组。
   */
  filter(fn, scope) {
    return this.findBy(fn, scope, null, true);
  }
  /**
   * 遍历组件直接的下级组件和子组件({#owned}属性中的组件)，查找所有满足指定条件的组件。
   * @param {Function} fn 判断组件是否满足条件的方法，返回true满足，false不满足。
   * @param {Wb.Component} fn.item 正在处理的当前组件。
   * @param {Object} [scope] fn内的this对象，默认为遍历的组件本身。
   * @return {Wb.Component[]} 返回组件组成的数组，未找到返回空数组。
   */
  filterWhole(fn, scope) {
    return this.findBy(fn, scope, true, true);
  }
  /**
   * 判断组件是否包含某个直接的子组件。另请参考{#Wb.Container.has}和{#Wb.Container.hasItem}方法。
   * @param {Wb.Component} [comp] 判断的组件。缺省表示任意组件。
   * @return {Boolean} true包含，false不包含。
   */
  hasSub(comp) {
    return comp?.owner == this;
  }
  /**
   * 判断指定的组件是否为当前组件的下级组件或子组件。如果需要判断直接的下级组件和子组件，请使用{#has}方法。
   * @param {Wb.Component} item 判断的组件。
   * @param {Boolean} [excludeSelf] 遍历时是否不包含组件本身。
   * @return {Boolean} true包含，false不包含。
   */
  contains(item, excludeSelf) {
    if (!item)
      return false;
    let parent = item;

    if (excludeSelf && item == this)
      return false;
    while (parent) {
      if (parent == this)
        return true;
      parent = parent.parent;
    }
    return false;
  }
  /**
   * @event subadd 当组件添加子组件时触发。
   * @param {Wb.Component} child 添加的组件。
   */
  /**
   * @event subadded 当组件作为子组件被添加到上级组件时触发。
   * @param {Wb.Component} parent 添加到的上级组件。
   */
  /**
   * @event added 当组件作为下级组件被添加到上级组件时触发。
   * @param {Wb.Container} parent 添加到的上级组件。
   * @param {Number} position 添加的位置索引。
   */
  /**
   * 当组件实例添加到组件后，如果组件包含该方法，将在添加组件后执行该方法。 @priv
   * @function insertRefresh
   */
  /**
   * 在当前组件的指定位置插入下级组件或子组件。如果插入下级组件，插入的位置由refItem参数指定；如果插入子组件，
   * 插入的位置由其{#weight}属性指定。
   * Example: 
   * 
   *     panel.insertBefore({cname: 'text'}, text1); //在text1之前插入新的文本框
   * 
   * @param {Object/Wb.Component/Array} data 插入的组件数据，可以为组件配置对象、组件实例或由这两者组成的数组。\
   * 如果插入实例且实例具有insertRefresh方法，将在插入后执行该方法。
   * @param {Wb.Component/Element} [refItem] 如果插入下级组件，表示在此组件之前插入。如果插入子组件，
   * 表示在该元素下添加。默认添加到当前组件下。
   * @param {Boolean} [isFooter] 是否作为子组件插入到尾部。true尾部，false头部。如果缺省表示作为下级组件插入。
   * @return {Wb.Component/Wb.Component[]} 插入的组件，如果插入多个返回的值为数组。
   */
  insertBefore(data, refItem, isFooter) {
    let isArray, result, pos, weight, child, configs, refEl, parentEl, items, instanced, app,
      me = this, asSub = isFooter != null;

    if (!data)
      Wb.raise('Failed to execute "insertBefore": parameter data is null.');
    isArray = Wb.isArray(data);
    if (isArray)
      result = [];
    else
      data = [data];
    if (asSub) {
      parentEl = refItem || me.el;
    } else {
      parentEl = me.bodyEl;
      items = me.items$;
    }
    data.forEach(data => {
      instanced = data.instanced;
      if (instanced) {
        if (data == refItem)
          return;
        if (data.parent)
          data.remove();
        if (asSub)
          data.owner = me;
        else
          data.parent = me;
        child = data;
      } else {
        if (Wb.isString(data))
          data = Wb.textToComp(data);
        app = me.app$;
        if (asSub) {
          configs = Wb.apply({
            owner: me
          }, data);
          if (app)
            configs.app ??= app;
        } else {
          configs = Wb.applyMerge({
            parent: me
          }, me.defaults$, data);
          if (app && me.copyApp)
            configs.app ??= app;
        }
        child = Wb.create(configs);
      }
      if (asSub) {
        weight = child.weight;
        refEl = isFooter ? parentEl.lastChild : parentEl.firstChild;
        while (refEl?.citem) {
          if (isFooter && refEl.citem.weight <= weight || !isFooter && refEl.citem.weight < weight)
            break;
          refEl = isFooter ? refEl.previousSibling : refEl.nextSibling;
        }
        if (isFooter && refEl)
          refEl = refEl.nextSibling;
        parentEl.insertBefore(child.el, refEl);
        if (instanced)
          child.insertRefresh?.();
        me.fireEvent('subadd', child);
        child.fireEvent('subadded', me);
      } else {
        if (refItem) {
          pos = items.indexOf(refItem);
          items.insert(pos, child);
          parentEl.insertBefore(child.el, refItem.el);
        } else {
          pos = items.length;
          items.push(child);
          parentEl.appendChild(child.el);
        }
        if (instanced)
          child.insertRefresh?.();
        me.fireEvent('add', child, pos);
        child.fireEvent('added', me, pos);
      }
      if (isArray)
        result.push(child);
    });
    return isArray ? result : child;
  }
  /**
   * 在当前组件内指定头部位置插入一个或多个子组件，其引用被保存到{#owned}属性中。子组件的插入位置由其{#weight}属性指定。
   * Example: 
   * 
   *     panel.addHeader({cname: 'text'}); //在panel头部添加编辑框作为子组件
   * 
   * @param {Object/Wb.Component/Array} data 插入的组件数据，可以为组件配置对象、组件实例或由这两者组成的数组。
   * @param {Element} [headerEl] 把组件添加到该元素下。默认为{#el}元素。
   * @return {Wb.Component/Wb.Component[]} 插入的子组件，如果插入多个返回的值为数组。
   */
  addHeader(data, headerEl) {
    return this.insertBefore(data, headerEl, false);
  }
  /**
   * 在当前组件内指定尾部位置插入一个或多个子组件，其引用被保存到{#owned}属性中。子组件的插入位置由其{#weight}属性指定。
   * Example: 
   * 
   *     panel.addFooter({cname: 'text'}); //在panel尾部添加编辑框作为子组件
   * 
   * @param {Object/Wb.Component/Array} data 插入的组件数据，可以为组件配置对象、组件实例或由这两者组成的数组。
   * @param {Element} [footerEl] 把组件添加到该元素下。默认为{#el}元素。
   * @return {Wb.Component/Wb.Component[]} 插入的子组件，如果插入多个返回的值为数组。
   */
  addFooter(data, footerEl) {
    return this.insertBefore(data, footerEl, true);
  }
  /** @property {Wb.Container/Wb.Toolbar/Wb.Component/Object/Array} - 添加组件的头部子组件，可以为组件配置对象、
   * 组件实例或由这两者组成的数组。 */
  set headers(data) {
    this.headers$ = this.addHeader(data);
  }
  /** @property {Wb.Component/Wb.Component[]} - 获取设置的headers子组件或其列表。 */
  get headers() {
    return this.headers$;
  }
  /** @property {Wb.Container/Wb.Component/Object/Array} - 添加组件的尾部子组件，可以为组件配置对象、
   * 组件实例或由这两者组成的数组。 */
  set footers(data) {
    this.footers$ = this.addFooter(data);
  }
  /** @property {Wb.Component/Wb.Component[]} - 获取设置的footers子组件或其列表。 */
  get footers() {
    return this.footers$;
  }

  /** @event removed 当前组件作为下级组件被从父组件移除后触发。移除操作请参考{#remove}方法说明。
   * @param {Wb.Container} parent 父组件。
   */

  /** @event subremoved 当前组件作为子组件被从父组件移除后触发。移除操作请参考{#remove}方法说明。
   * @param {Wb.Component} parent 父组件。
   */

  /** @event beforesubremove 当前组件的子组件被移除前触发
   * @param {Wb.Component} child 子组件。
   */

  /** @event subremove 当前组件的子组件被移除后触发。移除操作请参考{#remove}方法说明。
   * @param {Wb.Component} child 子组件。
   */

  /**
   * 从父组件移除当前组件，但并不销毁该组件，移除的组件可以被再次展现或添加到别的组件上。
   * 区别于{#destroy}方法，该方法仅移除同父组件的引用关系，并从dom树上移除组件元素。
   * 执行该方法后，组件的其它相关引用仍保留，也不影响当前组件的子组件和下级组件，
   * 因此要确保销毁组件请使用{#destroy}方法。
   */
  remove() {
    let index, me = this, isSub = me.owner$, parent = me.parent;

    if (parent) {
      me.el.remove();
      if (isSub) {
        //子组件关系移除，owner设置null会自动删除me.parent
        me.owner = null;
      } else {
        //下级组件关系移除
        index = parent.items$.indexOf(me);
        if (index != -1)
          parent.items$.splice(index, 1);
        me.parent = undefined;
      }
    } else {
      me.el.remove();
    }
    if (isSub) {
      me.fireEvent('subremoved', parent);
      if (parent)
        parent.fireEvent('subremove', me);
    } else {
      me.fireEvent('removed', parent);
      if (parent)
        parent.fireEvent('remove', me, index);
    }
  }
  /**
   * 移除当前组件下的所有子组件和下级组件。移除组件请参考{#remove}方法说明。
   * @param {Boolean} [mode] 移除模式: 
   * -true: 所有子组件和下级组件
   * -false: 所有子组件
   * -null: 所有下级组件（默认）
   */
  removeAll(mode) {
    let nullMode = mode == null;

    if (nullMode || mode)
      this.items$?.each(item => item.remove(), this, true);
    if (!nullMode)
      this.owned$?.each(item => item.remove());
  }
  /** @event destroy 当前组件销毁后触发。 */
  /**
   * 销毁当前组件，其所有的子组件和下级组件也都将被递归销毁。只有当所有保存该组件的所有引用被删除后，
   * 组件才能被垃圾收集器回收。在销毁组件前会先执行{#remove}方法移除组件。
   */
  destroy() {
    let me = this;
    if (!me.destroyed) {
      me.destroyed = true;
      me.remove();
      //逆向遍历销毁下级组件
      me.items$?.each(item => item.destroy(), me, true);
      //遍历销毁子组件（子组件是set无需逆向）
      me.owned$?.each(item => {
        if (item.autoDestroy)
          item.destroy();
        else
          item.remove();
      });
      me.clearListeners();
      //events中的事件无需清除
      me.fireEvent('destroy');
      super.destroy();
    }
  }
  /**
   * 销毁当前组件下的所有子组件和下级组件。销毁组件请参考{#destroy}方法说明。
   * @param {Boolean} [mode] 销毁模式: 
   * -true: 所有子组件和下级组件
   * -false: 所有子组件
   * -null/undefined: 所有下级组件（默认）
   */
  destroyAll(mode) {
    let nullMode = mode == null;

    if (nullMode || mode)
      this.items$?.each(item => item.destroy(), this, true);
    if (!nullMode)
      this.owned$?.each(item => item.destroy());
  }
  /** @property {Element} - 设置组件的文本dom元素，当设置组件的{#html}属性和{#text}属性时，将基于该元素。
   * 默认为组件本身关联的dom元素。 @priv
   */
  set textEl(el) {
    this.textEl$ = el;
  }
  /** @property {Element} - 获取组件的文本dom元素。如果未设置textEl，默认返回{#bodyEl}或{#el}。
   */
  get textEl() {
    return this.textEl$ || this.bodyEl || this.el;
  }
  /**
   * 遍历组件内所有带"obj"属性的元素并生成对应的组件到该元素。如果"obj"属性为JSON字符串表示组件的配置对象，
   * 否则表示{{cid}}属性为该值的组件。
   * @param {Object} [object] 组件的cid和实例组成的对象。默认为组件关联的{#app}对象。
   */
  make(object) {
    let me = this, comp, obj, app = me.app$;

    object ??= app;
    me.el.queryAll('[obj]').forEach(el => {
      obj = el.getAttribute('obj');
      el.removeAttribute('obj');
      if (obj.startsWith('{')) {
        comp = Wb.parse(obj);
        if (!comp.cname) {
          if (comp.keyName)
            comp.cname = 'select';
          else
            comp.cname = 'text';
        }
      } else {
        comp = object[obj];
      }
      try {
        comp = Wb.create(comp);
      } catch (e) {
        comp = Wb.create({ text: 'failed', tip: obj });
      }
      if (comp) {
        comp.renderTo(el, true);
        comp.owner = me;
        if (app)
          comp.app ??= app;
      }
    });
  }
  /** @property {HtmlString} - 设置组件文本元素{#textEl}的innerHTML属性。如果已指定{#text}，text优先。 */
  set html(value) {
    let me = this;
    if (me.html$ !== value) {
      me.textEl.innerHTML = me.html$ = value;
      if (me.autoMake && me.app$)
        me.make();
    }
  }
  /** @property {HtmlString} - 获取组件设置的html属性。 */
  get html() {
    return this.html$;
  }
  /** @property {String} - 设置组件文本元素{#textEl}的textContent属性。 */
  set text(value) {
    let me = this;
    if (me.text$ !== value) {
      me.textEl.textContent = me.text$ = value;
    }
  }
  /** @property {String} - 获取组件设置的text属性。 */
  get text() {
    return this.text$;
  }
  /** @property {Number/String} - 设置组件元素如何伸长或缩短以适应flex容器中的可用空间。\
   * 同设置el.style.flex属性。 @design @key */
  set flex(value) {
    this.el.setStyle('flex', value);
  }
  /** @property {String} - 获取组件元素的flex样式属性。同获取el.style.flex属性。 */
  get flex() {
    return this.el.getStyle('flex');
  }
  /** @property {Boolean} - 设置组件内的文本是否可被选择，null表示自动判断。 */
  set textSelectable(value) {
    let me = this;
    if (me.textSelectable$ !== value) {
      me.textSelectable$ = value;
      if (Wb.isEmpty(value)) {
        me.removeCls('w-select');
        me.removeCls('w-unselect');
      } else {
        me.setCls(value, 'w-select');
        me.setCls(!value, 'w-unselect');
      }
    }
  }
  /** @property {Boolean} - 获取组件内的文本是否可被选择。该属性仅通过判断是否包含w-unselect样式来判别。 */
  get textSelectable() {
    return this.textSelectable$;
  }
  /** @property {Boolean} - 设置组件元素是否浮动，浮动是指组件元素采用绝对位置定位。如果组件无父组件，
   * 设置浮动后将直接添加到body节点下。 */
  set floating(value) {
    let me = this;
    if (me.floating$ !== value) {
      me.floating$ = value;
      if (value && !me.el.parentNode && !me.parent?.hasItem(me)) {
        //对于浮动组件，无父元素时添加到body
        BodyEl.appendChild(me.el);
      }
      me.setCls(value, 'w-floating');
    }
  }
  /***/
  get floating() {
    return this.floating$;
  }
  /**
   * 设置组件的提示信息，当鼠标移动到该组件上时将显示浮动的提示信息。
   * @param {Object} value 显示的提示对象。
   * @param {String} type 提示的类型: 
   * -'tip': 普通提示
   * -'errorTip': 错误提示
   * -'overflowTip': 内容溢出提示
   * @priv @desktop
   */
  setTip(value, type) {
    let me = this, shareTip, cname, propName, oldTip;

    propName = type + '$';
    if (Wb.isTouch && !me.touchTip) {
      me[propName] = value;
      return;
    }
    oldTip = me[propName];
    switch (type) {
      case 'tip':
        shareTip = Wb.Tooltip.shareTip;
        cname = 'tooltip';
        break;
      case 'errorTip':
        shareTip = Wb.ErrorTip.shareTip;
        cname = 'errorTip';
        break;
      case 'overflowTip':
        shareTip = Wb.OverflowTip.shareTip;
        cname = 'overflowTip';
        break;
    }
    if (oldTip) {
      //注销原有的提示
      if (oldTip.instanced) {
        //提示为实例
        if (oldTip.owner == me)
          oldTip.destroy(); //owner为this销毁tip
        else
          oldTip.unregister(me); //仅注销tip，不销毁tip
      } else {
        //提示为共享对象
        shareTip.unregister(me);
      }
    }
    if (value?.instanced) {
      //实例
      value.register(me);
    } else if (Wb.isObject(value)) {
      //配置对象
      value = Wb.create(Wb.apply({
        cname,
        owner: me
      }, value));
      value.register(me);
    } else if (value) {
      //共享对象
      shareTip.register(me);
    }
    me[propName] = value;
  }
  /** @property {Mix/String/Function/Object/Wb.Tip} - 当鼠标移动当该组件时显示的提示。可以设置提示文本，
   * 方法，提示配置对象或提示实例：
   * -String: 提示的文本，使用共享的提示对象显示提示文本。
   * -Function: 通过该方法动态返回提示的文本，使用共享的提示对象显示提示文本。\
   * 可用参数comp为提示关联的组件，this指向Wb.Tip对象。
   * -Object: 提示配置对象，将生成独立的提示对象，组件销毁时提示对象将被销毁。
   * -Wb.Tip: 直接把实例作为提示对象。组件销毁时默认不会销毁该对象，可通过设置提示对象的{#owner}来绑定销毁。
   * @desktop
   * @key
   */
  set tip(value) {
    if (this.tip$ !== value)
      this.setTip(value, 'tip');
  }
  /***/
  get tip() {
    return this.tip$;
  }
  /** @property {Mix/String/Object/Wb.Tip} - 设置错误提示文本，配置对象或实例。
   * 当值为文本时使用共享的错误提示对象，当值为配置对象时生成独立的提示对象（组件销毁时提示对象将被销毁）。
   * @desktop
   */
  set errorTip(value) {
    if (this.errorTip$ !== value)
      this.setTip(value, 'errorTip');
  }
  /** @property {String/Wb.Tip} - 当设置的该值为文本时返回提示文本，否则返回提示对象。 @desktop */
  get errorTip() {
    return this.errorTip$;
  }
  /** @property {Boolean/Object/Wb.OverTip} - 设置当组件内有终端元素内容溢出时，是否显示内容的完整提示或提示的配置
   * 对象/实例。当值为Boolean时使用共享的提示对象，当值为配置对象时生成独立的提示对象（组件销毁时提示对象将被销毁）。
   * @desktop
   */
  set overflowTip(value) {
    if (this.overflowTip$ !== value)
      this.setTip(value, 'overflowTip');
  }
  /** @property {Boolean/Wb.OverTip} - 当设置该值为Boolean时返回是否显示溢出提示布尔值，
   * 否则返回提示对象。 @desktop */
  get overflowTip() {
    return this.overflowTip$;
  }
}
/**
 * HTML 内联框架元素，表示嵌套的浏览上下文。它能够将另一个 HTML 页面嵌入到当前页面中。
 * @icon layout
 */
Cls['Wb.Iframe'] = class iframe extends Wb.Component {
  static cls = 'w-iframe';
  static protos = {
    tagName: 'iframe'
  };
  /** @property {String} - 用于定位嵌入的浏览上下文的名称。该名称可以用作 {{a}} 标签与 {{form}} 标签的 target 属性值，
   * 也可以用作 {{input}} 标签和 {{button}} 标签的 formtarget 属性值，还可以用作 window.open() 方法的 windowName 参数值。
   * @key
   */
  set name(value) {
    this.el.name = value;
  }
  get name() {
    return this.el.name;
  }
  /** @property {String} - 浏览页面的URL地址。 @key */
  set src(value) {
    this.el.src = value;
  }
  /***/
  get src() {
    return this.el.src;
  }
}
/**
 * 分隔条组件，用于调整分隔条前面或后面组件的宽度或高度，通常应用于具有flex布局的容器内。
 * @icon splitter
 */
Cls['Wb.Splitter'] = class splitter extends Wb.Component {
  static cls = 'w-splitter';
  static configs = {
    collapsible: true
  };
  static protos = {
    /** @property {Boolean} - 鼠标进入到组件时是否显示隐藏的目标组件，鼠标离开后隐藏目标组件。 @desktop @key */
    enterShowTarget: false,
    collapsible$: false
  };
  /** @property {Wb.Component} target 移动分割时调整的组件。null表示自动判断。 @code */
  /** @property {Wb.Component} targetComp 移动分割时实际调整的组件。 @priv */
  /** @property {Boolean} behindTaget 调整的组件是否在分割条后面。 @priv */
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    if (Wb.isTouch)
      me.mon({
        [Event.tapDownName]: { fn: me.onMouseDown, capture: true, passive: false }
      });
    else
      me.mon({
        mouseenter: me.onMouseEnter, mouseleave: me.onMouseLeave,
        [Event.tapDownName]: { fn: me.onMouseDown, capture: true, passive: false }
      });
  }
  /** @property {Boolean} - 设置分割条是否可通过点击按钮或双击切换目标组件的收缩/展开状态。 */
  set collapsible(value) {
    let me = this;
    if (me.collapsible$ !== value) {
      me.collapsible$ = value;
      me.setListeners(value, {
        click: me.onClick, dblclick: me.onDblClick
      });
      if (value) {
        me.toggleBtn ??= me.addFooter({
          cname: 'simpleButton', icon: 'null', cls: 'w-splitter-btn',
          handler(e) {
            let comp = me.targetComp;
            me.restoreTargetComp();
            comp.visible = !comp.visible;
            e.stopEvent();
          }
        });
      } else {
        me.toggleBtn?.destroy();
        me.toggleBtn = undefined;
      }
    }
  }
  /***/
  get collapsible() {
    return this.collapsible$;
  }
  /**
   * 单击时执行的方法。 @priv
   */
  onClick() {
    let comp = this.targetComp;
    if (!comp.visible) {
      this.restoreTargetComp();
      comp.visible = true;
    }
  }
  /**
   * 双击时执行的方法。 @priv
   */
  onDblClick() {
    let comp = this.targetComp;
    comp.visible = !comp.visible;
  }
  /** @property {Boolean} hSplit 是否水平分割。true水平，false垂直，null禁止分割。 @priv @readonly */
  /**
   * 鼠标进入到组件时执行的方法。 @priv
   */
  onMouseEnter(e) {
    let me = this, ps = me.previousSibling, ns = me.nextSibling, targetVisible;
    if (ps && ns) {
      let hSplit, el = me.el, h = el.clientHeight, w = el.clientWidth;
      if (h > 10)
        hSplit = true;
      else if (w > 10)
        hSplit = false;
      else
        hSplit = el.parentElement?.computeStyle()?.flexDirection == 'row';
      me.hSplit = hSplit;
      targetVisible = me.getTarget().visible;
      if (targetVisible) {
        if (hSplit) {
          me.removeCls('w-resize-n');
          me.addCls('w-resize-w');
        } else {
          me.removeCls('w-resize-w');
          me.addCls('w-resize-n');
        }
      }
      if (me.toggleBtn)
        me.setToggleBtn();
    } else {
      me.removeCls('w-resize-n');
      me.removeCls('w-resize-w');
      me.hSplit = null;
    }
    if (Wb.isDesktop && me.enterShowTarget && !targetVisible && !me.slideTarget)
      me.showTargetComp.delay(me, 600);
  }
  /**
   * 鼠标离开组件时执行的方法。 @priv
   */
  onMouseLeave() {
    let me = this;
    me.removeCls('w-resize-n');
    me.removeCls('w-resize-w');
    if (Wb.isDesktop && me.enterShowTarget)
      me.showTargetComp.cancelDelay(me);
  }
  /**
   * 浮动显示隐藏的目标组件。 @priv
   */
  showTargetComp() {
    let me = this, parent = me.parent?.bodyEl, target, hSplit, slideInConfig, slideOutConfig, isBefore, width,
      height, duration = 200;

    target = me.getTarget();
    target.cls = 'w-floating';
    target.removeCls('w-disp-none');
    parent.cls = 'w-rel';
    hSplit = me.hSplit;
    isBefore = target == me.previousSibling;
    width = me.width;
    height = me.height;
    if (hSplit) {
      target.height = me.height;
      slideInConfig = { x: isBefore };
      slideOutConfig = { x: !isBefore };
      if (isBefore)
        target.xy = [width, 0];
      else
        target.xy = [parent.offsetWidth - target.width - width, 0];
    } else {
      target.width = me.width;
      slideInConfig = { y: isBefore };
      slideOutConfig = { y: !isBefore };
      if (isBefore)
        target.xy = [0, height];
      else
        target.xy = [0, parent.offsetHeight - target.height - height, 0];
    }
    slideInConfig.duration = duration;
    target.el.slideIn(slideInConfig);
    slideOutConfig.duration = duration;
    slideOutConfig.callback = me.restoreTargetComp.bind(me);
    me.slideOutConfig = slideOutConfig;
    me.slideTarget = target;
    me.cls = 'w-zindex';
    me.mon(DocEl, 'mouseover', me.hideTargetComp);
  }
  /**
   * 隐藏显示的浮动目标组件。 @priv
   * @param {Event} e 事件对象。
   */
  hideTargetComp(e) {
    let me = this, slideTarget = me.slideTarget;

    me.showTargetComp.cancelDelay(me);
    if (me.el.contains(e.target) || slideTarget.el.contains(e.target))
      return;
    slideTarget.el.slideOut(me.slideOutConfig);
  }
  /** @property {Wb.Component} slideTarget 当前显示的浮动目标组件。 */
  /**
   * 去除目标组件的浮动显示，并恢复显示目标组件。如果无浮动显示，该方法无效。
   */
  restoreTargetComp() {
    let me = this, target = me.slideTarget;

    if (target) {
      target.cls = 'w-disp-none';
      target.removeCls('w-floating');
      if (me.hSplit)
        target.height = null;
      else
        target.width = null;
      target.xy = [null, null];
      me.parent.removeCls('w-rel');
      me.removeCls('w-zindex');
      me.mun(DocEl, 'mouseover', me.hideTargetComp);
      delete me.slideTarget;
    }
  }
  /**
   * 设置分割条切换伸缩按钮。 @priv
   */
  setToggleBtn() {
    let me = this, target, forward, icon, hSplit = me.hSplit, btn = me.toggleBtn, targetHidden;

    target = me.getTarget();
    forward = target == me.nextSibling;
    targetHidden = !target.visible;
    if (targetHidden)
      forward = !forward;
    if (forward)
      icon = hSplit ? 'right' : 'down';
    else
      icon = hSplit ? 'left' : 'up';
    btn.setCls(!hSplit, 'w-splitter-vbtn');
    me.setCls(targetHidden, 'w-pointer');
    btn.icon = icon;
  }
  /**
   * 获取当前组件调整的目标组件。 @priv
   * @return {Wb.Component} 找到的组件。
   */
  getTarget() {
    let me = this;

    if (me.target)
      return me.target;
    let ps = me.previousSibling, ns = me.nextSibling;

    if (ps?.previousSibling instanceof Wb.Splitter)
      return ns;
    return ps.el.computeStyle().flexGrow == '0' ? ps : ns;
  }
  /**
   * 鼠标按下时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onMouseDown(e) {
    let me = this;

    if (Wb.isTouch)
      me.onMouseEnter();
    else
      e.preventDefault();
    //非左键或禁止分割时返回
    if (e.button || me.hSplit == null) return;
    let target = me.getTarget();
    me.targetComp = target;
    if (!target.visible)
      return;
    me.behindTaget = target == me.nextSibling;
    me.startX = e.x;
    me.startY = e.y;
    me.startWidth = target.el.offsetWidth;
    me.startHeight = target.el.offsetHeight;
    Wb.addCls(me.hSplit ? 'w-resize-w' : 'w-resize-n');
    target.mon({
      el: DocEl,
      scope: me,
      [Event.tapMoveName]: me.onDocMouseMove,
      [Event.tapUpName]: me.onDocMouseUp
    });
  }
  /**
   * 鼠标在document上释放按键时执行的方法。
   * @param {Event} e 事件对象。
   * @priv
   */
  onDocMouseUp(e) {
    let me = this, target = me.targetComp;

    target.mun({
      el: DocEl,
      [Event.tapMoveName]: me.onDocMouseMove,
      [Event.tapUpName]: me.onDocMouseUp
    });
    Wb.removeCls(me.hSplit ? 'w-resize-w' : 'w-resize-n');
  }
  /**
   * 鼠标在document上移动时执行的方法。
   * @param {Event} e 事件对象。
   * @priv
   */
  onDocMouseMove(e) {
    let me = this, target = me.targetComp, behindTaget = me.behindTaget;

    if (Wb.isDesktop)
      e.preventDefault();
    if (me.hSplit)
      target.width = Math.max(me.startWidth + (behindTaget ? (me.startX - e.x) : (e.x - me.startX)), 0);
    else
      target.height = Math.max(me.startHeight + (behindTaget ? (me.startY - e.y) : (e.y - me.startY)), 0);
  }
}
/**
 * 填充剩余可用空间的组件。如果位于表格布局内该组件将位于最后一列，因此在该组件后的组件将强制从首列开始布局。
 * @icon right1
 */
Cls['Wb.Fill'] = class fill extends Wb.Component {
  static cls = 'w-fill';
}
/**
 * 宽高占指定空间的组件。如果位于表格布局内将独占一行。
 * @icon space
 */
Cls['Wb.Space'] = class space extends Wb.Component {
  static cls = 'w-space';
}
/**
 * 具有指定最小宽高和固定背景色的组件，通常用于分隔组件。
 * @icon padding
 */
Cls['Wb.Gap'] = class gap extends Wb.Component {
  static cls = 'w-gap-comp';
}
/**
 * 分割线条组件。如果位于表格布局内将独占一行。
 * @icon divider
 */
Cls['Wb.Divider'] = class divider extends Wb.Component {
  static cls = 'w-sline';
  static protos = {
    /** @property {Boolean} - 当该组件前无可见的组件时，是否自动隐藏该组件。默认为true。 */
    autoHide: true
  };
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    if (me.autoHide)
      me.on('added', me.onAdded);
  }
  /**
   * 添加到上级组件时触发。 @priv
   */
  onAdded() {
    let me = this, comp = me, found;

    while (comp = comp.previousSibling) {
      if (comp.visible) {
        if (!(comp instanceof Wb.Divider))
          found = true;
        break;
      }
    };
    if (!found)
      me.visible = false;
  }
}
/**
 * 图片组件，用于显示图片。该组件同{#Wb.Picture}的区别为前者图像默认随组件缩放，后者显示图像实际大小。
 * 图片的相关示例见：{#%visual.xwl|ide?openModule=example/comps/visual.xwl}
 * @icon image
 */
Cls['Wb.Image'] = class image extends Wb.Component {
  static cls = 'w-image';
  static configs = {
    textSelectable: false
  };
  /** @property {String} - 图片url地址。设置为空或null将清除图片。 @design @key */
  set src(value) {
    let me = this;

    if (me.src$ !== value) {
      me.src$ = value;
      if (value)
        me.setStyle('background-image', 'url("' + value + '")');
      else
        me.removeStyle('background-image');
    }
  }
  /***/
  get src() {
    return this.src$;
  }
  /** @property {Enum} - 图像的重复方式。
   * -'no-repeat': 不重复。默认值。
   * -'repeat-x': 水平重复。
   * -'repeat-y': 垂直重复。
   * -'round': 随着允许的空间在尺寸上的增长，被重复的图像将会伸展 (没有空隙), 直到有足够的空间来添加一个图像。
   * -'space': 图像会尽可能得重复，但是不会裁剪。
   * -'repeat': 图像会按需重复来覆盖整个图片所在的区域。
   * @design
   */
  set repeat(value) {
    this.setStyle('background-repeat', value);
  }
  /***/
  get repeat() {
    return this.getStyle('background-repeat');
  }
  /** @property {Boolean} - 点击图片时是否预览全图。 @key */
  set clickPreview(value) {
    let me = this;
    if (this.clickPreview$ !== value) {
      me.clickPreview$ = value;
      if (value)
        me.onClickPreview();
      else
        me.unClickPreview();
    }
  }
  /***/
  get clickPreview() {
    return this.clickPreview$;
  }
  /** @property {Enum} - 图像的大小。
   * -'contain': 缩放图片以完全装入组件，可能组件部分空白。默认值。
   * -'cover': 缩放图片以完全覆盖组件，可能图片部分看不见。
   * -'auto': 原始图片大小。
   * -'25%': 25%比例显示。
   * -'50%': 50%比例显示。
   * -'75%': 75%比例显示。
   * -'2em auto': 宽2em，高自动按比例缩放。
   * -'25% 75%': 宽25%，高75%。
   * @design
   */
  set size(value) {
    this.setStyle('background-size', Wb.px(value));
  }
  /***/
  get size() {
    return this.getStyle('background-size');
  }
  /** @property {Enum} - 图像的位置。
   * -'center': 居中。默认值。
   * -'top': 顶。
   * -'left': 左。
   * -'bottom': 底。
   * -'right': 右。
   * -'top right': 右上角。
   * -'25% 75%': x 25%位置，y 75位置。
   * -'bottom 1em right 2.5em': 底偏移1em, 右偏移2.5em。
   * @design
   */
  set position(value) {
    this.setStyle('background-position', value);
  }
  /***/
  get position() {
    return this.getStyle('background-position');
  }
}
/**
 * 图片组件，用于显示图片。该组件同{#Wb.Image}的区别为前者显示图像实际大小，后者图像默认随组件缩放。
 * 图片的相关示例见：{#%visual.xwl|ide?openModule=example/comps/visual.xwl}
 * @icon picture
 */
Cls['Wb.Picture'] = class picture extends Wb.Component {
  static protos = {
    tagName: 'img'
  };
  static configs = {
    textSelectable: false
  };
  /***/
  init(configs) {
    super.init(configs);
    this.el.draggable = false;
  }
  /** @property {String} - 图片url地址。设置为空或null将清除图片。 @design @key */
  set src(value) {
    this.el.src = value;
  }
  /***/
  get src() {
    return this.el.src;
  }
  /** @property {Boolean} - 点击图片时是否预览全图。 @key */
  set clickPreview(value) {
    let me = this;
    if (this.clickPreview$ !== value) {
      me.clickPreview$ = value;
      if (value)
        me.onClickPreview();
      else
        me.unClickPreview();
    }
  }
  /***/
  get clickPreview() {
    return this.clickPreview$;
  }
}
/**
 * 视频组件，用于播放视频。当仅需要播放音频时请使用{#Wb.playAudio}方法。
 * @icon video
 */
Cls['Wb.Video'] = class video extends Wb.Component {
  static protos = {
    tagName: 'video'
  };
  /** @property {Mix/String/Object/Array} - 视频的url地址或其列表。如果为对象，url表示地址，type表示类型。以下均为有效值：
   * 
   *      'videos/flower.webm' // 单个 URL
   *      {url: 'videos/flower.webm', type: 'video/webm'} // 指定类型
   *      ['videos/flower.webm', {url: 'videos/flower.mp4', type: 'video/mp4'}] // 多个 URL
   * 
   *  @design @key
   */
  set src(value) {
    let me = this;

    if (me.src$ !== value) {
      let el = me.el, source;
      me.src$ = value;
      el.queryAll('source').each(el => el.remove());
      el.removeAttribute('src');
      if (value) {
        if (Wb.isArray(value) || Wb.isObject(value)) {
          Wb.toArray(value).forEach(src => {
            source = el.addTag('source')
            if (Wb.isObject(src)) {
              source.src = src.src;
              source.type = src.type;
            } else {
              source.src = src;
            }
          });
        } else {
          el.src = value;
        }
      }
    }
  }
  /***/
  get src() {
    return this.src$;
  }
  /** @property {Boolean} - 是否在视频底部提供一个控制面板。 @key */
  set controls(value) {
    this.el.controls = value;
  }
  /***/
  get controls() {
    return this.el.controls;
  }
  /** @property {Boolean} - 是否尽快自动开始播放。 @key */
  set autoplay(value) {
    this.el.autoplay = value;
  }
  /***/
  get autoplay() {
    return this.el.autoplay;
  }
  /** @property {Boolean} - 是否循环播放。 */
  set loop(value) {
    this.el.loop = value;
  }
  /***/
  get loop() {
    return this.el.loop;
  }
  /** @property {Boolean} - 是否初始化为静音。 */
  set muted(value) {
    this.el.muted = value;
  }
  /***/
  get muted() {
    return this.el.muted;
  }
  /** @property {Boolean} - 是否内嵌播放，即在元素的播放区域内。 */
  set playsInline(value) {
    this.el.playsInline = value;
  }
  /***/
  get playsInline() {
    return this.el.playsInline;
  }
  /** @property {String} - 海报帧图片 URL。 */
  set poster(value) {
    let el = this.el;
    if (value)
      el.setAttribute('poster', value);
    else
      el.removeAttribute('poster');
  }
  /***/
  get poster() {
    return this.el.getAttribute('poster');
  }
}
/**
 * 对图标进行操作的类。
 */
Cls['Wb.mixin.Icon'] = Parent => class iconMixin extends Parent {
  /** @property {Boolean} smallImg 使用图片图标时是否使用较小的图标。 */
  /** @property {Boolean} isImageIcon 当前图标类型是否为图片。false文字，true图片。 @readonly */
  /** @property {Element} iconEl 图标元素。 @readonly */
  /**
   * 设置图标元素指定类型的图标。 @priv
   * @param {String} value 图标的值。如果value为null或空将销毁{#iconEl}图标元素。"null"值表示空的图标。当销毁
   * 图标后{#iconColor}值也将同时被重置。
   * @param {Boolean} isImg 是否为图片，false文字，true图片。
   */
  setIcon(value, isImg) {
    Wb.PT.setIcon.call(this, value, isImg);
  }
  /** @property {IconString} - 矢量图标。设置为null/空值表示删除图标。设置为"null"表示空的图标。如果首个
   * 字符的编码大于等于128或以"!"开头的字符将直接把该文字作为图标，如Emoji字符或"!U"等都为有效的图标。 @design @key */
  set icon(icon) {
    this.setIcon(icon, false);
  }
  /***/
  get icon() {
    return this.icon$;
  }
  /** @property {ImgString} - 图片图标路径。如果未指定目录默认为"wb/images"，如果未指定图片扩展名
   * 默认为png。设置为null/空值表示删除图标。设置为"null"表示空的图标。 @design */
  set img(img) {
    this.setIcon(img, true);
  }
  /***/
  get img() {
    return this.img$;
  }
  /** @property {ColorString} - 图标颜色。 @design */
  set iconColor(color) {
    if (this.iconColor$ !== color) {
      this.iconColor$ = color;
      this.iconEl?.setStyle('color', color);
    }
  }
  /***/
  get iconColor() {
    return this.iconColor$;
  }
  /** @property {Boolean} - 图标是否旋转。 @design */
  set spin(value) {
    this.iconEl[value ? 'addCls' : 'removeCls']('w-spin');
  }
  /***/
  get spin() {
    return this.iconEl.containsCls('w-spin')
  }
  /** @property {Number/String} - 设置图标大小。 @design */
  set iconSize(value) {
    this.iconEl.setStyle('font-size', Wb.px(value));
  }
  /** @property {String} - 获取图标大小。 */
  get iconSize() {
    return this.iconEl.getStyle('font-size');
  }
}
/**
 * 图标组件，用于显示文字和图片图标。
 * 图标的相关示例见：{#%visual.xwl|ide?openModule=example/comps/visual.xwl}
 * @icon logo
 */
Cls['Wb.Icon'] = class icon extends Wb.mixin.Icon(Wb.Component) {
  /***/
  init(configs) {
    super.init(configs);
    this.iconEl = this.el;
  }
}
/**
 * 客户端动作，用于定义一项行为。动作可绑定到按钮，以指定按钮的相关行为。动作可以同时被绑定到多个按钮。
 * 动作定义的属性将直接设置到绑定的组件，至少包括以下属性：
 * -text: 文本
 * -html: HTML文本
 * -menuText: 菜单条目文本
 * -tip: 提示
 * -icon: 图标
 * -img: 图片图标
 * -disabled: 是否禁用
 * -visible: 是否可见
 * -appeared: 是否显示
 * -keys: 快捷键
 * -handler: 点击时执行的方法
 */
Cls['Wb.Action'] = class action extends Wb.Configurable {
  /** @property {Object} - proxy代理的handler配置对象。 @priv */
  static proxyHandler = {
    set(target, prop, value) {
      target[prop] = value;
      target.props[prop] = value;
      target.comps.forEach(comp => comp[prop] = value);
      return true;
    }
  };
  /** @property {Wb.Component[]} comps 绑定的组件列表。 @priv */
  /** @property {Object} props 绑定的属性组成的对象。 @priv */
  /***/
  constructor(configs) {
    super(configs);
    this.comps = new Set();
    this.props = Wb.copy(configs);
    return new Proxy(this, this.constructor.proxyHandler);
  }
  /**
   * 把指定的组件绑定到当前动作。
   * @param {Wb.Component} comp 绑定的组件。
   */
  bind(comp) {
    let props = this.props;

    this.comps.add(comp);
    comp.initConfigs(props)
    comp.applyConfigs(props);
  }
  /**
   * 把指定的组件从当前动作中解绑。
   * @param {Wb.Component} comp 解绑的组件。
   */
  unbind(comp) {
    this.comps.remove(comp);
  }
}
/**
 * 客户端动作列表对象，用于定义多个动作行为。关于动作的描述请参考{#Wb.Action}。
 */
Cls['Wb.Actions'] = class action extends Wb.Base {
  /**
   * 构造函数。
   * @param {Array} actions 动作或其配置对象的列表。
   * @param {Object} [scope] 执行handler时的默认scope。
   */
  constructor(configs, scope) {
    super(configs);
    this.scope = scope;
    Wb.each(configs, (k, v) => this.add(k, v));
  }
  /**
   * 添加指定名称的动作到当前列表中。
   * @param {String} name 动作名称。
   * @param {Wb.Action/Object} action 动作实例或其配置对象。
   */
  add(name, action) {
    let obj = action.instanced ? action : new Wb.Action(action);
    if (this.scope != null)
      obj.scope = this.scope;
    this[name] = obj;
  }
  /**
   * 从当前列表中移除指定名称的动作。
   * @param {String} name 动作名称。
   */
  remove(name) {
    delete this[name];
  }
}
/**
 * 按钮组件，通过点击触发事件来运行代码或完成某些功能。
 * 按钮的相关示例见：{#%button.xwl|ide?openModule=example/comps/button.xwl}
 * @icon button
 */
Cls['Wb.Button'] = class button extends Wb.mixin.Icon(Wb.Component) {
  static cls = 'w-btn';
  static configs = {
    tabIndex: Wb.isTouch ? undefined : 0,
    rippleOnClick: true
  };
  static events = { click: null };
  static firstNames = ['tip', 'menuText'];
  static protos = {
    /** @property {Boolean} tapClick 是否在鼠标按下或开始触摸时就触发点击事件。*/
    /** @property {Number} - 重复按键{#repeatInterval}开始触发之前的初始延迟。 */
    repeatDelay: 250,
    iconAlign$: 'left',
    /** @property {Boolean} - 当按钮设置{#menu}属性后，是否作为菜单按钮，菜单按钮具有特定样式。默认为true。 */
    menuButton: true,
    /** @property {Boolean} - 当设置keys后默认按键后是否停止事件传播。默认为true。 */
    stopEvent: true,
    /** @property {Boolean} - 是否把快捷键显示到提示中。默认为true。 */
    keysTextTip: true,
    allowFocus: true,
    activeBgColor$: true,
    badgeText$: false,
    active$: null
  };
  /***/
  init(configs) {
    let me = this, text = configs.text;
    super.init(configs);
    //Let keys auto tip
    if (me.keysTextTip && (configs.keys || configs.keysText) && text)
      configs.tip ??= text;
    me.on('click', me.onClickEvent);
    me.mon({ [me.tapClick ? Event.tapDownName : 'click']: { fn: me.onClick, passive: false }, keydown: me.onKeyDown });
  }
  /** @property {Enum} cname 类简名：
   * -'tool': 工具按钮{#Wb.Tool}
   * -'padTool': 带间距的工具按钮{#Wb.PadTool}
   * -'iconButton': 图标按钮{#Wb.IconButton}
   * -'lightButton': 高亮按钮{#Wb.LightButton}
   * -'simpleButton': 简单按钮{#Wb.SimpleButton}
   * -'item': 菜单子项{#Wb.Item}
   * -'closableButton': 关闭按钮{#Wb.ClosableButton}
   * -'tagButton': 标签按钮{#Wb.TagButton}
   */
  /** @property {Boolean} enterButton 当按钮位于{#Wb.Window}时，设置为true将在窗口按回车键时
   * 触发该按钮的click事件。 */
  /** @property {Boolean} escButton 当按钮位于{#Wb.Window}时，设置为true将在窗口按ESC键时
  * 触发该按钮的click事件。 */
  /**
   * 按键时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onKeyDown(e) {
    if (e.code == Keys.Enter || e.code == Keys.Space) {
      this.fireClick(e);
      e.stopEvent();
    }
  }
  /** @property {String} groupName 组名，同一个容器内具有相同组名的按钮仅允许单个激活。 */
  /** @property {Boolean} allowDeactive 是否允许通过点击当前按钮取消当前按钮的激活状态。
   * -true: 允许
   * -false: 禁止
   * -null: 当设置groupName时禁止，否则为允许。
   */

  /** @property {Boolean} enableToggle 是否允许通过点击当前按钮来切换当前按钮的激活状态。\
   * false不允许，true允许，null表示当设置了{#active}或{#groupName}属性允许切换。 */
  /** @property {Express/Function} handler 设置按钮点击时的执行方法。
   * @param {Event} e 事件对象。
   */
  /** @property {Object} scope {#handler}方法内this指向的对象。 @code */
  /**
   * @event click 按钮点击时触发。区别于监听器click事件，该事件支持的功能更广泛，例如通过回车触发。请使用该
   * 事件替代监听器的click事件。 @key
   * @param {Event} e 事件对象。
   */
  /** @property {String} menuAlign 菜单的对齐方法，详见{#Element.alignTo}。 @priv */
  /**
   * 触发按钮的click事件。
   * @param {Event} [e] 事件对象。缺省为undefined。
   */
  fireClick(e) {
    this.fireEvent('click', e);
  }
  /**
   * 按钮点击事件触发时执行的方法。 @priv
   * @param {Event} [e] 事件对象。缺省为undefined。
   */
  onClickEvent(e) {
    let me = this, clickHide, parent = me.parent, menu = me.menu;

    if (me.disabled)
      return;
    clickHide = me.clickHide;
    if (menu) {
      if (menu.visible) {
        //非菜单项点击时隐藏菜单
        if (me.isMenuItem && (clickHide ?? false))
          Wb.Menu.hideMenus();
        else {
          if (Wb.isTouch && me.menu && menu.menuButton != me)
            me.showMenu();
          else
            menu.hide();
        }
      } else if (!(me instanceof Wb.SplitButton)) {
        //SplitButton在点击下拉按钮时触发
        me.showMenu();
      }
    } else if (me.isMenuItem && (clickHide ?? true))
      Wb.Menu.hideMenus();
    me.handler?.call(me.scope || me, e);
    let groupName = me.groupName;
    if (me.enableToggle || me.enableToggle == null && (groupName || me.active$ != null)) {
      if (me.active$) {
        if (me.allowDeactive ?? !groupName)
          me.active = false;
      } else {
        me.active = true;
      }
    }
    //仅允许下级组件发送到容器buttonclick事件
    if (!me.owner$)
      parent?.fireEvent('buttonclick', me, e);
  }
  /**
   * @event beforeshowmenu 在显示关联的菜单之前触发。可以在该事件中重新设置菜单条目。\
   * 返回false可以阻止显示菜单。
   */
  /**
   * 显示按钮关联的菜单。如果无关联的菜单该方法无效。 @priv
   */
  showMenu() {
    let me = this, menu = me.menu;

    if (!menu)
      return;
    let offset, byTarget;

    if (me.isMenuItem)
      offset = [0, -parseFloat(menu.el.computeStyle().paddingTop)];
    if (me.owner instanceof Wb.SplitButton)
      byTarget = me.owner;
    else
      byTarget = me;
    menu.menuButton = me;
    if (menu.visible) {
      menu.showBy(byTarget, me.menuAlign, offset);
    } else {
      Wb.Menu.hideMenus(me);
      if (me.fireEvent('beforeshowmenu') !== false) {
        if (menu.autoHideSC) {
          let visible = menu.some(item => item.keys);
          menu.each(item => { item.shortcutEl?.setVisible(visible) });
        }
        menu.showBy(byTarget, me.menuAlign, offset);
      }
    }
  }
  /**
   * 隐藏当前条目的菜单。 @priv
   */
  hideMenu() {
    this.menu?.hide();
  }
  /** @property {Wb.Action} - 按钮绑定的动作实例，以指定按钮的点击行为，文本，图标和快捷键等属性。 @code */
  set action(value) {
    let oldValue = this.action$;
    if (oldValue !== value) {
      this.action$ = value;
      oldValue?.unbind(this);
      value?.bind(this);
    }
  }
  /***/
  get action() {
    return this.action$;
  }
  /** @property {String} - 显示在菜单上的文本。如果按钮无{#tip}属性，该属性同时将作为按钮的{#tip}属性。 */
  set menuText(value) {
    let oldValue = this.menuText$;
    if (oldValue !== value) {
      let tip = this.tip$;
      this.menuText$ = value;
      if (tip == null || tip == oldValue)
        this.tip = value;
    }
  }
  /***/
  get menuText() {
    return this.menuText$;
  }
  /** @property {Element} shortcutEl 快捷键元素，如果指定该元素将把快捷键文本设置到该元素。 @priv */
  /** @property {String} - 按钮的快捷键。按该键后，如果按钮有效且可见将触发按钮的{#*click}
   * 事件并执行{#handler}方法。如果按键定义重复，最后定义且有效可见的按钮快捷键将被处理。 */
  set keys(value) {
    let oldKeys = this.keys$;
    if (oldKeys !== value) {
      this.keys$ = value;
      this.keysText = value;
      if (oldKeys)
        Wb.Keys.remove(oldKeys, this);
      if (value)
        Wb.Keys.add(value, this);
    }
  }
  /***/
  get keys() {
    return this.keys$;
  }
  /** @property {Boolean} isOffenKeys 是否为开放式快捷按键。 @priv */
  /** @property {String} - 按钮的开放式快捷键。同{#keys}的区别为不受任何因素影响始终触发。详见{#keys}说明。 */
  set offenKeys(value) {
    if (this.offenKeys$ !== value) {
      this.offenKeys$ = value;
      this.keys = value;
      this.isOffenKeys = !!value;
    }
  }
  /***/
  get offenKeys() {
    return this.offenKeys$;
  }
  /** @property {String} - 按钮的快捷键显示文本。 */
  set keysText(value) {
    if (this.keysText$ !== value) {
      this.keysText$ = value;
      if (this.shortcutEl)
        this.shortcutEl.textContent = value ?? '';
    }
  }
  /***/
  get keysText() {
    return this.keysText$;
  }
  /***/
  destroy() {
    let me = this;
    if (!me.destroyed) {
      let keys = me.keys$;
      if (keys)
        Wb.Keys.remove(keys, me);
    }
    super.destroy();
  }
  /***/
  set tip(value) {
    super.tip = value;
  }
  /***/
  get tip() {
    let keysText = this.keysText, tip = super.tip;
    return keysText && this.keysTextTip ? (tip + ' (' + keysText + ')') : tip;
  }
  /**
   * 按钮监听器中点击执行的方法。
   * @param {Even} e 事件对象。
   * @priv
   */
  onClick(e) {
    let me = this;
    //避免使用定时器触发时的重复触发行为
    if (me.ignoreListenerClick)
      delete me.ignoreListenerClick;
    else
      me.fireClick(e);
  }
  /** @property {Wb.Menu/Object} - 按钮关联的菜单组件或配置对象，点击按钮时将显示该菜单。设置新的菜单后，
   * 该菜单实例将作为按钮的子组件。请注意：设置新的菜单后原菜单不会被自动销毁。 @key
   */
  set menu(value) {
    let me = this;
    if (me.menu$ !== value) {
      if (value) {
        if (!value.instanced) {
          let configs = Wb.apply({ cname: 'menu', }, value);

          if (me.app)
            configs.app = me.app;
          value = Wb.create(configs);
        }
        value.owner = me;
        me.enableToggle = false;
      }
      if (me.isMenuItem) {
        me.flagEl.appeared = value?.hasChild;
      } else {
        if (me.menuButton)
          me.setCls(value, 'w-menu-item');
        if (Wb.isDesktop)
          me.setListeners(value, 'mouseenter', me.onMouseEnter);
      }
      me.menu$ = value;
    }
  }
  /** @property {Wb.Menu} */
  get menu() {
    return this.menu$;
  }
  /**
   * 有菜单时鼠标进入时执行的方法。 @priv
   */
  onMouseEnter() {
    let me = this, Menu = Wb.Menu, activeMenu = Menu.activeMenu, menu = me.menu;
    //菜单通过按钮触发显示的mouseEnter后均自动弹出显示
    if (!menu?.visible && (activeMenu?.contains(me) || activeMenu?.upBy(p => p instanceof Wb.Button))) {
      let parent = me.parent;
      //所有上级菜单都取消隐藏
      me.bubble(item => {
        if (item.isMenuItem) {
          item.active = true;
          item.hideMenu.cancelDelay(item);
        } else if (!(item instanceof Menu))
          return false;
      });
      if (!me.disabled && menu) {
        //菜单项在菜单内时延时显示
        if (parent instanceof Menu)
          me.showMenu.delay(me, 200);
        else
          me.showMenu();
      } else
        Menu.hideMenus(parent instanceof Menu ? parent : null);
    }
  }
  /**
   * @event activate 按钮激活时触发。
   */
  /**
   * @event deactivate 按钮取消激活时触发。
   */
  /**
   * @event toggle 按钮切换激活状态时触发。
   * @param {Boolean} active 是否激活。
   */
  /** @property {Boolean} - 设置按钮是否激活。激活的按钮具有指定的样式。 @design */
  set active(active) {
    if (this.active$ !== active) {
      let parent = this.parent,
        groupName = this.groupName;

      this.active$ = active;
      if (active && parent && groupName) {
        //当指定groupName时，该组仅允许单项激活
        parent.each(item => {
          if (groupName == item.groupName && item != this) {
            item.active = false;
          }
        });
      }
      this.setCls(active, 'w-btn-active');
      this.fireEvent(active ? 'activate' : 'deactivate');
      this.fireEvent('toggle', active);
      //发送容器buttontoggle事件
      if (parent) {
        parent.fireEvent('buttontoggle', this, active);
      }
    }
  }
  /***/
  get active() {
    return this.active$;
  }
  /** @property {Boolean} - 按钮激活时是否设置背景色。默认为true。 */
  set activeBgColor(value) {
    this.applyCls(value, 'activeBgColor', 'w-no-bg', null, true);
  }
  /***/
  get activeBgColor() {
    return this.activeBgColor$;
  }
  /** @property {Boolean} - 按钮标签的文字是否为"徽章"样式。 */
  set badgeText(value) {
    this.applyCls(value, 'badgeText', 'w-badge-text');
  }
  /***/
  get badgeText() {
    return this.badgeText$;
  }
  /** @property {Boolean} - 设置按钮是否激活。激活的按钮具有指定的样式。当组件为按钮时同{#active}属性。 @design */
  set checked(value) {
    this.active = value;
  }
  /***/
  get checked() {
    return this.active;
  }
  /**
   * 设置按钮是否激活。
   * @param {Boolean} actived true激活，false不激。
   * @param {Boolean} [focused] 是否设置焦点。
   */
  setActive(actived, focused) {
    this.active = actived;
    if (focused)
      this.focus();
  }
  /** @design @key */
  set html(html) {
    super.html = html;
    this.updateTextEl();
  }
  /***/
  get html() {
    return super.html;
  }
  /** @design @key */
  set text(text) {
    super.text = text;
    this.updateTextEl();
  }
  /***/
  get text() {
    return super.text;
  }
  /***/
  get textEl() {
    let me = this, iconAlign = me.iconAlign$;
    return me.textEl$ ??= me.el[me.iconEl$ && (iconAlign == 'left' || iconAlign == 'top') ?
      'insertElAfter' : 'insertElBefore']('w-label', 'div', me.iconEl$ ?? me.tailEl);
  }
  /**
   * 如果无text和html则删除{#textEl}元素。 @priv
   */
  updateTextEl() {
    let me = this, textEl = me.textEl$;
    if (textEl && Wb.isEmpty(me.html$) && Wb.isEmpty(me.text$)) {
      textEl.remove();
      me.textEl$ = null;
    }
  }
  /** @property {Element} tailEl 添加到尾部的附加元素，如果指定该值，iconEl和textEl将添加在该元素之前。 @priv */
  /** @property {Element} - 获取显示图标的元素。 */
  get iconEl() {
    let me = this, iconAlign = me.iconAlign$;
    return me.iconEl$ ??= me.el[me.textEl$ && (iconAlign == 'right' || iconAlign == 'bottom') ?
      'insertElAfter' : 'insertElBefore'](null, 'div', me.textEl$ ?? me.tailEl);
  }
  /** @property {Enum} - 图标的位置。
   * -'top': 上
   * -'right': 右
   * -'bottom': 下 
   * -'left': 左
   * @design
   */
  set iconAlign(value) {
    let me = this;
    if (me.iconAlign$ !== value) {
      me.iconAlign$ = value;
      me.setCls(value == 'top' || value == 'bottom', 'w-column');
      if (me.iconEl$ && me.textEl$)
        me.el[value == 'right' ? 'insertAfter' : 'insertBefore'](me.iconEl$, me.textEl$);
    }
  }
  /***/
  get iconAlign() {
    return this.iconAlign$;
  }
  /** @property {Enum} - 按钮的样式类型。null表示使用默认样式。
   * -'primary': 主要按钮
   * -'tool': 工具按钮。具有透明背景和较小padding值的普通按钮，如工具栏下的按钮样式。
   * -'icon': 图标按钮。通常仅只有一个图标，且去除按钮本身的颜色，例如触发器按钮样式。
   * -'light': 高亮按钮。当鼠标悬停和激活时按钮背景高亮，其它效果等同图标按钮。如tab标签的关闭按钮。
   * -'plain': 简单按钮，无hover, focus等效果。
   * @design
   * @key
   */
  set type(type) {
    if (this.applyCls(type, 'type', 'w-btn-')) {
      this.rippleCls = type ? 'w-ripple-' + type : null;
    }
  }
  /***/
  get type() {
    return this.type$;
  }
  /** @property {Enum} - 按钮的形状类型。
   * -'circle': 圆形
   * -'rect': 方形
   * -'round': 圆角
   * @design
   */
  set shape(shape) {
    this.applyCls(shape, 'shape', 'w-shape-');
  }
  /***/
  get shape() {
    return this.shape$;
  }
  /** @property {Boolean/Number} - 当按下按钮时重复触发{#*click}事件（非click监听器）的间隔时间，单位为毫秒。\
   * true表示30毫秒。任何Falsy值表示不设置重复触发。 */
  set repeatInterval(value) {
    if (value === true)
      value = 30;
    if (this.repeatInterval$ !== value) {
      this.repeatInterval$ = value;
      this.setListeners(value, {
        [Event.tapDownName]: {
          fn: this.onTapDown,
          passive: false
        },
        [Event.tapUpName]: {
          fn: this.onTapUp,
          passive: false
        }
      });
    }
  }
  /** @property {Number} */
  get repeatInterval() {
    return this.repeatInterval$;
  }
  /** @property {Boolean} ignoreListenerClick 是否忽略监听器的click事件。 @priv */
  /**
   * 按钮按下时执行的方法。 @priv
   */
  onTapDown(e) {
    let me = this;
    me.isMouseDown ??= true;
    //防止重复触发
    if (!me.timeoutTimer) {
      let configs = {
        el: DocEl,
        [Event.tapUpName]: me.onDocTapUp
      };
      if (Wb.isTouch)
        configs.touchcancel = me.onDocTapUp;
      me.mon(configs);
      me.timeoutTimer = setTimeout(f => {
        me.intervalTimer = setInterval(f => {
          me.repeatClicked ??= true;
          me.fireClick(e);
        }, me.repeatInterval$);
      }, me.repeatDelay);
    }
  }
  /**
   * 按钮释放时执行的方法。 @priv
   */
  onTapUp(e) {
    if (this.isMouseDown && this.repeatClicked && !this.disabled)
      this.ignoreListenerClick ??= true;
  }
  /**
   * 在文档上释放按钮时执行的方法。 @priv
   */
  onDocTapUp() {
    let me = this, configs = {
      el: DocEl,
      [Event.tapUpName]: me.onDocTapUp
    };
    if (Wb.isTouch)
      configs.touchcancel = me.onDocTapUp;
    me.mun(configs);
    clearTimeout(me.timeoutTimer);
    delete me.isMouseDown;
    delete me.repeatClicked;
    delete me.timeoutTimer;
    if (me.intervalTimer) {
      clearInterval(me.intervalTimer);
      delete me.intervalTimer;
    }
  }
}
/**
 * 简单按钮。不能获得焦点的按钮。
 */
Cls['Wb.SimpleButton'] = class simpleButton extends Wb.Button {
  static configs = {
    allowFocus: false,
    focusable: false,
    tabIndex: undefined
  };
}
/**
 * 工具按钮组件。工具按钮是{#type}为tool样式且不能获得焦点的按钮。
 */
Cls['Wb.Tool'] = class tool extends Wb.SimpleButton {
  static configs = {
    type: 'tool'
  };
}
/**
 * 带间距的工具按钮组件。
 */
Cls['Wb.PadTool'] = class padTool extends Wb.Tool {
  static cls = 'w-pad-tool';
  static configs = {
    type: 'tool'
  };
}
/**
 * 图标按钮组件。图标按钮是{#type}为icon样式且不能获得焦点的按钮。
 */
Cls['Wb.IconButton'] = class iconButton extends Wb.SimpleButton {
  static configs = {
    type: 'icon'
  };
}
/**
 * 高亮按钮组件。高亮按钮是{#type}为light样式且不能获得焦点的按钮。
 */
Cls['Wb.LightButton'] = class lightButton extends Wb.SimpleButton {
  static configs = {
    type: 'light'
  };
}
/**
 * 分割按钮。带下拉菜单的按钮，该按钮由两部分组成，左侧为常规按钮，右侧点击时显示下拉菜单。
 * @icon split
 */
Cls['Wb.SplitButton'] = class splitButton extends Wb.Button {
  static cls = 'w-split-btn'
  static protos = {
    /** @property {Boolean} - 当按钮添加到工具条下时是否自动设置为工具按钮。 */
    autoTool: true
  };
  static configs = {
    enableToggle: false
  };
  /** @property {Wb.Button} splitButton 右侧用于触发显示菜单的按钮。 @readonly */
  /***/
  init(configs) {
    let me = this, btn;
    super.init(configs);
    btn = me.splitButton = me.addFooter({
      cname: 'lightButton', icon: 'down', menuButton: false, handler: Event.interceptHandler
    });
    if (configs.app)
      btn.app = configs.app; // for menu items cid refer
    me.on('added', parent => {
      if (me.autoTool && parent instanceof Wb.Toolbar) {
        me.addCls('w-btn-tool');
        me.allowFocus = false;
        me.focusable = false;
        me.tabIndex = undefined;
      }
    });
    me.tailEl = btn.el;
  }
  /***/
  set menu(value) {
    this.splitButton.menu = value;
  }
  /***/
  get menu() {
    return this.splitButton.menu;
  }
}
/**
 * 带关闭功能的按钮组件，可点击关闭元素来执行某项操作。
 */
Cls['Wb.ClosableButton'] = class closableButton extends Wb.Button {
  static protos = {
    closable$: null,
    /** @property {String} - 关闭按钮上的提示信息。 */
    closeTip: Str.close,
    transientClose$: false
  };
  static configs = {
    transientClose: true,
    closable: true
  }
  static cls = 'w-closable-btn w-void-close';
  /** @property {Boolean} - 指定关闭按钮是否在激活或鼠标悬停时显示。 */
  set transientClose(value) {
    this.applyCls(value, 'transientClose', 'w-trans-close');
  }
  /***/
  get transientClose() {
    return this.transientClose$;
  }
  /** @property {Enum} - 按钮是否可通过关闭按钮关闭。设置null将销毁关闭按钮。
   * -true: 关闭按钮有效。
   * -false: 关闭按钮禁用。
   * -null: 无关闭按钮。默认值。
   * @design
   */
  set closable(value) {
    let me = this;
    if (me.closable$ !== value) {
      me.closable$ = value;
      if (Wb.isBoolean(value)) {
        me.removeCls('w-void-close');
        if (!me.closeButton) {
          me.closeButton = me.addFooter({
            cname: 'lightButton', cls: 'w-close-btn', weight: 10, icon: 'close', tip: me.closeTip,
            events: {
              click: { fn: me.onCloseClick, scope: me }
            }
          });
          me.tailEl = me.closeButton.el;
        }
        me.closeButton.disabled = !value;
      } else if (value === null) {
        me.addCls('w-void-close');
        if (me.closeButton) {
          me.closeButton.destroy();
          delete me.closeButton;
          delete me.tailEl;
        }
      }
    }
  }
  /***/
  get closable() {
    return this.closable$;
  }
  /**
   * 点击关闭元素时执行的方法。 @priv
   * @param {Event} [e] 事件对象。
   */
  onCloseClick(e) {
    this.fireEvent('closeclick', e);
  }
}
/**
 * Tab按钮组件。
 */
Cls['Wb.TabButton'] = class tabButton extends Wb.ClosableButton {
  static configs = {
    rippleOnClick: undefined,
    overflowTip: true
  }
  /***/
  init(configs) {
    super.init(configs);
    this.on('activate', this.onActivate);
  }
  /***/
  intoView() {
    this.el.viewInParent();
  }
  /***/
  onKeyDown(e, options) {
    if (e.ctrlMeta && e.code == Keys.Enter) {
      //转到首个可以设置焦点的组件
      this.card.firstValidChild?.focus();
      e.stopEvent();
    } else if (e.altKey && e.code == Keys.Backquote) {
      //切换tab
      let card = this.card.travelSibling(!e.shiftKey, true);

      if (card) {
        card.show();
        (card.firstValidChild || card.tabButton)?.focus();
      }
      e.stopEvent();
    } else {
      super.onKeyDown(e, options);
    }
  }
  /**
   * 按钮激活时执行的方法。 @priv
   */
  onActivate() {
    let card = this.card, parent = card.parent;

    if (parent)
      parent.activeCard = card;
    this.intoView();
  }
  /***/
  onCloseClick(e) {
    super.onCloseClick(e);
    this.card.close();
    e.stopEvent();
  }
}
/**
 * 标签按钮，通常用于制作标签。
 */
Cls['Wb.TagButton'] = class tagButton extends Wb.ClosableButton {
  static cls = 'w-tag-btn';
  static protos = {
    closeTip: Str.del
  };
  static configs = {
    transientClose: false,
    rippleOnClick: false
  };
}
/**
 * 标签组件，用于显示文本。
 * @icon label
 */
Cls['Wb.Label'] = class label extends Wb.Component {
  static cls = 'w-label';
  static protos = {
    tagName: 'label',
    indent$: false
  };
  /** @property {String} - 链接的URL。 @design */
  set href(value) {
    let me = this;
    if (me.href$ !== value) {
      me.href$ = value;
      if (value) {
        if (!me.hrefEl) {
          me.el.clearChildren();
          me.textEl = me.hrefEl = me.addEl('w-link', 'A');
          //重置链接的target和text/html属性
          if (me.target$)
            me.hrefEl.target = me.target$;
        }
        me.hrefEl.href = value;
        me.hrefEl.textContent = me.text ?? me.html ?? value;
      } else if (me.hrefEl) {
        me.hrefEl.remove();
        me.hrefEl = null;
        me.textEl = me.el;
        if (me.text)
          me.text = me.text;
        else if (me.html)
          me.html = me.html;
      }
    }
  }
  /***/
  get href() {
    return this.href$;
  }
  /** @property {Enum} - 链接的目标。
   * -_blank: 在新窗口打开。
   * -_parent: 在父窗口打开。
   * -_top: 在顶层窗口打开。
   * -_self: 在同一窗口打开。默认值。
   */
  set target(value) {
    if (this.target$ !== value) {
      this.target$ = value;
      if (this.hrefEl)
        this.hrefEl.target = value;
    }
  }
  /***/
  get target() {
    return this.target$;
  }
  /** @property {Enum} - 标签对齐方式。
   * -'left': 左对齐
   * -'center': 居中
   * -'right': 右对齐
   * @design
   */
  set textAlign(value) {
    this.applyCls(value, 'textAlign', 'w-ta-');
  }
  /***/
  get textAlign() {
    return this.textAlign$;
  }
  /** @property {Enum} - 字体标题类型：
   * -'title1': 一级标题
   * -'title2': 二级标题
   * -'title3': 三级标题
   * -'title4': 四级标题
   * -'title5': 五级标题
   * @design
   */
  set titleType(value) {
    this.applyCls(value, 'titleType', 'w-');
  }
  /***/
  get titleType() {
    return this.titleType$;
  }
  /** @design @key */
  set html(value) {
    let me = this;
    super.html = value;
    if (me.href && !value && !me.text$)
      me.textEl.textContent = me.href;
  }
  /***/
  get html() {
    return super.html;
  }
  /** @design @key */
  set text(value) {
    let me = this;
    super.text = value;
    if (me.href && !value && !me.html$)
      me.textEl.textContent = me.href;
  }
  /***/
  get text() {
    return super.text;
  }
  /** @property {Boolean} - 是否缩进指定大小。 */
  set indent(value) {
    this.applyCls(value, 'indent', 'w-indent');
  }
  get indent() {
    return this.indent$;
  }
}
/**
 * 盒子标签组件，用于显示文本。该组件同{#Wb.Label}的区别为标签元素为子元素，允许按指定方式进行排列对齐。
 * @icon box-label
 */
Cls['Wb.BoxLabel'] = class boxLabel extends Wb.Component {
  static cls = 'w-label w-row';
  static configs = {
    align: 'center'
  };
  /***/
  init(configs) {
    super.init(configs);
    this.textEl = this.addEl();
  }
  /** @property {Enum} - 标签的对齐方式:
   * -'center': 居中。默认值。
   * -'topLeft': 左上。
   * -'topCenter': 中上。
   * -'topRight': 右上。
   * -'centerLeft': 中左。
   * -'centerRight': 中右。
   * -'bottomLeft:' 左下。
   * -'bottomCenter': 中下。
   * -'bottomRight': 右下。
   * @design @key
   */
  set align(value) {
    let me = this, justify, align;

    if (me.align$ !== value) {
      me.align$ = value;
      if (!value || value == 'center') {
        align = justify = 'center';
      } else {
        value = value.camelCaseSplit();
        align = value[0];
        justify = value[1];
      }
      me.el.layout = 'justify-' + justify;
      me.textEl.layout = 'aligns-' + align;
    }
  }
  /***/
  get align() {
    return this.align$;
  }
  /** @property {String} text @design @key */
  /** @property {HtmlString} html @design @key */
}
/**
 * 控件类，用于输入数据并获取数据的组件。
 */
Cls['Wb.Control'] = class control extends Wb.Component {
  static cls = 'w-ctrl';
  static protos = {
    required$: false,
    labelUp$: null,
    /** @property {Boolean} ignoreReset 当初始化设置{#value}时，调用{#reset}方法时是否忽略重置该值。 */
    ignoreReset: false,
    /**
     * 清除所有错误信息。
     */
    clearError: Wb.emptyFn,
    /** @property {Boolean/String} - 标签的分隔符。设置为false表示不显示分隔符。 */
    labelSeparator: Str.labelSeparator
  };
  static configs = {
    tabIndex: 0
  };
  /** @property {String} groupTitle 使用字典分组时的组标题。 @readonly */
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    me.originValue = me.ignoreReset ? null : (configs.value ?? null);
  }
  /** @property {Boolean} - 是否允许显示空的标签。 @design */
  set showEmptyLabel(value) {
    if (this.showEmptyLabel !== value) {
      this.showEmptyLabel$ = value;
      if (value)
        this.createLabelEl();
      else if (this.labelEl && (Wb.isEmpty(this.html) || Wb.isEmpty(this.text))) {
        this.labelEl.parentNode.remove();
        this.labelEl = undefined;
      }
    }
  }
  /**
   * 设置控件的{{readonly}}属性值。如果控件无限制控制只读的功能，仅标识该属性值。
   * @param {Boolean} value readonly属性值。
   */
  setReadonly(value) {
    this.readonly = value;
  }
  /***/
  get showEmptyLabel() {
    return this.showEmptyLabel$;
  }
  /** @property {Element} wrapEl 用于包裹控件中的相关dom元素的元素。 @readonly */
  /** @property {Enum/Number/String} - 组件包裹元素边界。如果值为数值，默认单位为px。
   * -true: 设置全部边界为"thin"。
   * -false: 无边界。
   * -'top': 仅上边界为"thin"。
   * -'right': 仅右边界为"thin"。
   * -'bottom': 仅下边界为"thin"。
   * -'left': 仅左边界为"thin"。
   * @design 
   */
  set wrapBorder(value) {
    let el = this.wrapEl;
    if (el)
      el.border = value;
  }
  /***/
  get wrapBorder() {
    return this.wrapEl?.border;
  }
  /***/
  set roundBorder(value) {
    this.wrapEl.setStyle('border-radius', value ? '0.5em' : null);
  }
  /***/
  get roundBorder() {
    return this.wrapEl.getStyle('border-radius') == '0.5em';
  }
  /**
   * 设置标签图标元素指定类型的图标。 @priv
   * @param {String} value 图标的值。如果value为null或空将销毁{#iconEl}图标元素。"null"值表示空的图标。当销毁
   * 图标后{#iconColor}值也将同时被重置。
   * @param {Boolean} isImg 是否为图片，false文字，true图片。
   */
  setLabelIcon(value, isImg) {
    let me = this, labelEl = me.createLabelEl(), parentEl = labelEl.parentNode;
    labelEl.iconEl ??= parentEl.insertEl(0);
    if (value || me.text || me.html) {
      Wb.PT.setIcon.call(labelEl, value, isImg);
    } else {
      parentEl.remove();
      me.labelEl = undefined;
    }
  }
  /** @property {IconString} - 标签上的图标。 @design */
  set labelIcon(value) {
    this.setLabelIcon(value, false);
  }
  /***/
  get labelIcon() {
    return this.labelEl?.icon$;
  }
  /** @property {ImgString} - 标签上的图片图标。 @design */
  set labelImg(value) {
    this.setLabelIcon(value, true);
  }
  /***/
  get labelImg() {
    return this.labelEl?.img$;
  }
  /**
   * 在控件的头部添加标签元素。如果元素已经存在则直接返回该元素。 @priv
   * @return {Wb.Label} 添加的标签组件。
   */
  createLabelEl() {
    let me = this, labelEl = me.labelEl ??= me.el.insertEl(0, 'w-label-wrap').addEl('w-label', 'label');

    labelEl.width = me.labelWidth$;
    return labelEl;
  }
  /**
   * 设置控件的标签内容。 @priv
   * @param {String} value 标签内容。
   * @param {Boolean} [isHtml] 是否为HTML格式，false为纯文本，true为HTML。
   */
  setText(value, isHtml) {
    let me = this, labelEl = me.labelEl;

    if (isHtml)
      me.html$ = value;
    else
      me.text$ = value;
    if (Wb.isEmpty(me.text$) && Wb.isEmpty(me.html$)) {
      if (labelEl) {
        if (me.showEmptyLabel || me.labelIcon || me.labelImg) {
          labelEl.textContent = '';
        } else {
          labelEl.parentNode.remove();
          me.labelEl = undefined;
        }
      }
    } else {
      let ls = me.labelSeparator || '';
      labelEl ??= me.createLabelEl();
      if (me.text$)
        labelEl.textContent = me.text$ + ls;
      else
        labelEl.innerHTML = me.html$ + ls;
    }
  }
  /** @property {String} - 控件的纯文本标签。 @design @key */
  set text(value) {
    this.setText(value);
  }
  /***/
  get text() {
    return this.text$;
  }
  /** @property {Boolean} - 标签是否显示在上面。false显示在左侧，true显示在上面，null默认值。 @design */
  set labelUp(value) {
    this.applyCls(value, 'labelUp', 'w-label-up');
    //标识标签方位已经设置避免被容器覆盖
    this.setCls(value != null, 'w-uped');
  }
  /***/
  get labelUp() {
    return this.labelUp$;
  }
  /** @property {HtmlString} - 控件的HTML标签。如果指定{$text}，text优先。 @design @key */
  set html(value) {
    this.setText(value, true);
  }
  /***/
  get html() {
    return this.html$;
  }
  /**
   * 清空当前控件的值。重置值请使用{#reset}方法。
   */
  clear() {
    this.value = null;
    this.clearError();
  }
  /**
   * 重置当前控件的值，使值回复到首次初始化的值。如果首次初始化无值等同于{#clear}方法。清空值请使用{#clear}方法。
   */
  reset() {
    this.value = this.originValue;
    this.clearError();
  }
  /** @property {Boolean} - 控件是否必填。设置必填将在标签上添加"*"标记。 @design @key */
  set required(value) {
    this.applyCls(value, 'required', 'w-required');
  }
  /***/
  get required() {
    return this.required$;
  }
  /** @property {Number/String} - 标签宽度。-1表示不设置标签宽度，等于{{"unset"}}。 @design */
  set labelWidth(value) {
    let me = this;

    if (me.labelWidth$ !== value) {
      me.labelWidth$ = value;
      me.labelEl?.setWidth(value == -1 ? 'unset' : value);
    }
  }
  /***/
  get labelWidth() {
    return this.labelWidth$;
  }
  /** @property {Enum} - 标签对齐方式。
   * -'left': 左对齐
   * -'center': 居中
   * -'right': 右对齐
   * @design
   */
  set labelAlign(value) {
    this.applyCls(value, 'labelAlign', 'w-la-');
    //标识标签对齐已经设置避免被容器覆盖
    this.setCls(value != null, 'w-aligned');
  }
  /***/
  get labelAlign() {
    return this.labelAlign$;
  }
  /** @property {Boolean} - 是否添加最大化按钮，点击后可使控件最大化。 @design */
  set maximizable(value) {
    let me = this;

    if (me.maximizable$ !== value) {
      me.maximizable$ = value;
      if (value) {
        me.maximizeBtn = me.addFooter({
          cname: 'iconButton', weight: 990, icon: 'win-max', tip: Str.max + ' (F11)',
          rippleOnClick: false, handler() {
            const cls = 'w-win-full', isMax = !me.containsCls(cls);
            me.setCls(isMax, cls);
            if (isMax) {
              me.maxParentNode = me.el.parentNode;
              me.maxBeforeNode = me.el.nextSibling;
              me.maxBeforeZIndex = me.el.getStyle('z-index');
              me.setMaxZIndex();
              BodyEl.append(me.el);
            } else {
              me.el.setStyle('z-index', me.maxBeforeZIndex);
              me.maxParentNode.insertBefore(me.el, me.maxBeforeNode);
              delete me.maxParentNode;
              delete me.maxBeforeNode;
              delete me.maxBeforeZIndex;
            }
            me.focus();
            this.icon = isMax ? 'win-restore' : 'win-max';
            this.tip = isMax ? Str.restore + ' (F11)' : Str.max + ' (F11)';
          }
        }, me.wrapEl);
        me.mon(me.el, 'keydown', me.onMaxKeyDown);
      } else {
        me.maximizeBtn?.destroy();
        delete me.maximizeBtn;
        me.mun(me.el, 'keydown', me.onMaxKeyDown);
      }
    }
  }
  /***/
  get maximizable() {
    return this.maximizable$;
  }
  /**
   * 控件允许最大化时的按键方法。 @priv
   * @param {Event} e 事件对象。
   */
  onMaxKeyDown(e) {
    if (e.code == Keys.F11) {
      this.maximizeBtn.handler();
      e.stopEvent();
    }
  }
  /** @property {String} - 提示信息。在控件右侧显示问号，当鼠标移到问号上时显示提示信息。 @design */
  set hint(value) {
    if (this.hint$ !== value) {
      let hintIcon = this.hintIcon;
      this.hint$ = value;
      if (Wb.isEmpty(value)) {
        if (hintIcon) {
          hintIcon.destroy();
          delete this.hintIcon;
        }
      } else {
        if (!hintIcon) {
          hintIcon = this.hintIcon = this.addFooter({
            cname: 'icon',
            weight: 62,
            cls: 'w-hint',
            touchTip: true,
            icon: 'help'
          });
        }
        hintIcon.tip = value;
      }
    }
  }
  /***/
  get hint() {
    return this.hint$;
  }
  /** @property {Mix} - 控件的值。 @design @key */
  set value(value) {
    this.value$ = value;
  }
  /***/
  get value() {
    return this.value$;
  }
  /**
   * 获取当前控件的值。
   * @return {Object} 控件的值。
   */
  getValue() {
    return this.value;
  }
  /**
   * 设置当前控件的值。
   * @param {Object} value 设置的值。
   */
  setValue(value) {
    this.value = value;
  }
}
/**
 * 显示控件，用于显示文本。该控件同标签控件{#Wb.Label}的区别为该控件包含两部分标签，分别为名称和内容值标签。
 * @icon label1 
 */
Cls['Wb.DisplayField'] = class displayField extends Wb.mixin.Icon(Wb.Control) {
  static configs = {
    tabIndex: undefined
  };
  /***/
  init(configs) {
    super.init(configs);
    this.contentEl = this.addEl('w-content-label', 'label');
  }
  /** @property {Boolean} htmlValue {#value}是否为HTML格式。true HTML格式，false纯文本格式。 */
  /** @property {String} - 控件内容部分标签内容。 @key */
  set value(value) {
    if (this.value$ !== value) {
      this.value$ = value;
      if (this.htmlValue)
        this.contentEl.innerHTML = value;
      else
        this.contentEl.textContent = value;
    }
  }
  /***/
  get value() {
    return this.value$;
  }
  /** @property {Element} - 获取图标元素。如果不存在将创建一个新的图标元素。 */
  get iconEl() {
    return this.iconEl$ ??= this.el.insertElBefore('w-df-icon', null, this.contentEl);
  }
}
/**
 * 文本框控件，用于输入单行文本。
 * 文本框的相关示例见：{#%input.xwl|ide?openModule=example/comps/input.xwl}
 * @icon text
 */
Cls['Wb.Text'] = class text extends Wb.mixin.Icon(Wb.Control) {
  //autocomplete先于password
  static firstNames = ['autocomplete'];
  /**
   * @event keydown 键按下时触发。
   * @param {Event} e 事件对象。
   */
  /**
   * @event keyup 键释放时触发。
   * @param {Event} e 事件对象。
   */
  static events = { keydown: true, keyup: true };
  static protos = {
    /** @property {String} - 输入框元素的tagName。 @priv */
    inputTagName: 'input',
    /** @property {Boolean} - 当作为编辑器嵌入组件时，是否根据容器padding自动设置padding。 */
    autoPadding: true,
    flat$: false,
    eyeButton$: false,
    inactiveBorder$: false,
    allowFocus: true,
    colorfulIcon$: false,
    readonly$: false,
    /**
     * 执行额外的验证。
     * @param {Object} value 当前值。
     * @param {Set} basicErrors 错误信息集合。
     * @return {Boolean} 返回false阻止默认的其它验证。
     * @function extraVerify
     * @priv
     */
    extraVerify: Wb.emptyFn
  };
  /** @property {Number} minLength 最小字符数。 */
  /** @property {Number} maxLength 最大字符数。0表示无限制。 */
  /** @property {Boolean} sideErrorTip 错误信息是否显示在控件边上的提示按钮。null表示自动判断，
   * 即移动端边上提示，桌面端直接在控件上提示。
   */
  /**
   * @property {Object} - 预定义的值类型定义对象。名称为类型名称，值为regex, fn, msg组成的对象，
   * 分别表示正则，函数和错误提示信息。
   */
  static valueTypeDefines = {
    //字母和下划线
    alpha: {
      regex: Wb.regExp.alpha,
      msg: Str.invalidAlpha
    },
    //字母、下划线和数字
    alphaNum: {
      regex: Wb.regExp.alphaNum,
      msg: Str.invalidAlphaNum
    },
    //字母、下划线、数字和减号
    mark: {
      regex: /^[a-zA-Z0-9_-]+$/,
      msg: Str.invalidMark
    },
    //email地址
    email: {
      regex: /^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+/=?^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/,
      msg: Str.invalidEmail
    },
    //文件名
    filename: {
      regex: /^[^\\<>:?"*|/]+$/,
      msg: Str.invalidFilename
    },
    //url
    url: {
      regex: new RegExp('(((^https?)|(^ftp)):\\/\\/((([\\-\\w]+\\.)+\\w{2,3}(\\/[%\-\\w]+(\\.\\w{2,})?)' +
        '*(([\\w\\-\\.\\?\\\\\\/+@&#;`~=%!]*)(\\.\\w{2,})?)*)|(localhost|LOCALHOST))\\/?)', 'i'),
      msg: Str.invalidUrl
    },
    //字母、下划线、数字、减号和小数点号
    uri: {
      regex: /^[.a-zA-Z0-9_-]+$/,
      msg: Str.invalidMark
    },
    //字母、下划线、数字、减号和小数点号
    path: {
      regex: /^[.a-zA-Z0-9_/-]+$/,
      msg: Str.invalidPath
    },
    express: {
      fn(value) {
        if (value) {
          try {
            Wb.parse(value);
          } catch (e) {
            return false;
          }
        }
        return true;
      },
      msg: Str.invalidExpress
    }
  };
  /** @property {RegExp} regex 用于检验值是否有效的正则表达式。如果值无效，将显示{#regexText}指定的提示信息。 */
  /** @property {String} regexText 当使用{#regex}指定的正则表达式检验值无效时，显示的提示信息。 */
  /** @property {Set} basicErrors 系统预置的错误信息列表。 @private */
  /** @property {Set} errors 自定义的错误信息列表。 @private */
  /** 
   * @property {Function} validator 验证函数，用于验证值是否合法。
   * @param {Object} value 当前验证的值。
   * @return {Boolean/String} 返回字符串表示值非法，该字符串为错误的提示信息。返回其它值表示值合法。
   */
  /** @property {Enum} valueType 预定义的值类型，至少包括: 
   * -'alpha': 字母和下划线
   * -'alphaNum': 字母、下划线和数字
   * -'mark': 字母、下划线、数字和减号
   * -'email': email地址
   * -'filename': 文件名
   * -'url': url地址
   * -'uri': 字母、下划线、数字、减号和小数点号
   * -'express': JS表达式，包括JSON
   */
  /** @property {String} valueTypeText 当使用{#valueType}指定的类型检验值无效时，显示的提示信息。 */
  /** @property {HTMLInputElement} inputEl 输入框元素。 @readonly */
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    me.wrapEl = me.addEl('w-input-wrap');
    me.inputEl = me.focusEl = me.wrapEl.addEl('w-input-el', me.inputTagName);
    me.disabledEls = [me.inputEl];
    me.mon({
      el: me.inputEl,
      focus: me.onInputFocus,
      blur: me.onInputBlur,
      input: me.onInput
    });
  }
  /***/
  ready(configs) {
    super.ready(configs);
    if (this.selectOnInit)
      this.select();
  }
  /** @property {Boolean} - 当编辑框获得焦点时是否使用非高亮的边框。默认为false。 */
  set inactiveBorder(value) {
    this.applyCls(value, 'inactiveBorder', 'w-inactive');
  }
  /***/
  get inactiveBorder() {
    return this.inactiveBorder$;
  }
  /** @property {Boolean} selectOnFocus 当编辑框获得焦点时是否全选编辑框内的文本。 */
  /** @property {Boolean} selectOnInit 当编辑框初始化完成后是否全选编辑框内的文本。 */
  /**
   * @event focus 当输入框获得焦点时触发。
   * @param {Event} e 事件对象。
   */
  /**
   * @event blur 当输入框失去焦点时触发。
   * @param {Event} e 事件对象。
   */
  /**
   * 当输入框获得焦点时的处理方法。 @priv
   * @param {Event} e 事件对象。
   */
  onInputFocus(e) {
    this.fireEvent('focus', e);
    if (this.selectOnFocus)
      this.inputEl.select();
  }
  /**
   * 当输入框失去焦点时的处理方法。 @priv
   * @param {Event} e 事件对象。
   */
  onInputBlur(e) {
    this.fireEvent('blur', e);
  }
  /**
   * 当焦点不在输入框时，把焦点转到输入框。 @priv
   */
  mayFocusInputEl() {
    //Wb.isDesktop prevent show soft keyboard when focus
    if (Wb.isDesktop && document.activeElement != this.inputEl)
      this.focus();
  }
  /**
   * Replace the selection text with the specified text. If no selection is made, new text will be inserted.
   * @param {String} text New text to be replaced.
   */
  replaceSelection(text) {
    let el = this.inputEl, value = el.value, start = el.selectionStart, newValue;
    newValue = value.substring(0, start) + text + value.slice(el.selectionEnd);
    el.value = newValue;
    el.selectionEnd = el.selectionStart = start + text.length;
    this.fireEvent('change', newValue, value);
  }
  /** @property {Enum} - 编辑框文本对齐方式。
   * -'left': 左对齐
   * -'center': 居中
   * -'right': 右对齐
   * @design
   */
  set textAlign(value) {
    this.applyCls(value, 'textAlign', 'w-ta-', this.inputEl);
  }
  /***/
  get textAlign() {
    return this.textAlign$;
  }
  /** @property {Boolean} - 是否为扁平样式。 @design */
  set flat(value) {
    this.applyCls(value, 'flat', 'w-flat-text');
  }
  /***/
  get flat() {
    return this.flat$;
  }
  /** @property {Element} - 获取显示图标的元素。 */
  get iconEl() {
    return this.iconEl$ ??= this.wrapEl.insertEl(0, 'w-input-icon' + (this.colorfulIcon$ ? '' : ' w-ph-color'));
  }
  /** @property {Boolean} - 文本框内的图标是否彩色显示，默认为placeholder色。 @design */
  set colorfulIcon(value) {
    if (this.colorfulIcon$ !== value) {
      this.colorfulIcon$ = value;
      this.iconEl$?.setCls(!value, 'w-ph-color');
    }
  }
  /***/
  get colorfulIcon() {
    return this.colorfulIcon$;
  }
  /** @property {Wb.Label} prefixLabel 前缀标签组件。 @priv */
  /** @property {Wb.Label} suffixLabel 后缀标签组件。 @priv */
  /** @property {String} - 输入框的前缀文本。 @design */
  set prefix(value) {
    let me = this;
    if (me.prefix$ !== value) {
      me.prefix$ = value;
      if (value) {
        if (!me.prefixLabel)
          me.prefixLabel = me.addHeader({
            cname: 'label',
            cls: 'w-text-prefix',
            weight: 60
          }, me.wrapEl);
        me.prefixLabel.text = value;
      } else if (me.prefixLabel) {
        me.prefixLabel.destroy();
        delete me.prefixLabel;
      }
    }
  }
  /***/
  get prefix() {
    return this.prefix$;
  }
  /** @property {String} - 输入框的后缀文本。 @design */
  set suffix(value) {
    let me = this;
    if (me.suffix$ !== value) {
      me.suffix$ = value;
      if (value) {
        if (!me.suffixLabel)
          me.suffixLabel = me.addFooter({
            cname: 'label',
            cls: 'w-text-suffix',
            weight: 60
          }, me.wrapEl);
        me.suffixLabel.text = value;
      } else if (me.suffixLabel) {
        me.suffixLabel.destroy();
        delete me.suffixLabel;
      }
    }
  }
  /***/
  get suffix() {
    return this.suffix$;
  }
  /**
   * 设置组件元素焦点，如果组件元素可以获取到焦点，焦点就会被设置到该元素上。
   * @param {Boolean} [preventScroll] 当设置焦点时，时否阻止滚动条滚动。
   * @param {Boolean/Number/Number[]} [selectText] 当设置焦点后，是否选择文本。
   * -true: 全选文本
   * -0: 光标在开始处
   * --1: 光标在末尾处。
   * -Number[]: [start, end]表示选择文本的开始和结束位置。
   * @param {Boolean/Number} [delay] 是否延时设置焦点，true表示延时50毫秒，其它数值表示延时的毫秒数。
   */
  focus(preventScroll, selectText, delay) {
    if (delay == null) {
      this.doFocus(selectText, preventScroll);
    } else {
      this.doFocus.delay(this, delay == true ? 50 : delay, selectText, preventScroll);
    }
  }
  /**
   * 设置组件元素焦点并阻止滚动条滚动，如果组件元素可以获取到焦点，焦点就会被设置到该元素上。
   * @param {Boolean/Number/Number[]} [selectText] 当设置焦点后，是否选择文本。
   * -true: 全选文本
   * -0: 光标在开始处
   * --1: 光标在末尾处。
   * -Number[]: [start, end]表示选择文本的开始和结束位置。
   * @param {Boolean/Number} [delay] 是否延时设置焦点，true表示延时50毫秒，其它数值表示延时的毫秒数。
   */
  focusOnly(selectText, delay) {
    this.focus(true, selectText, delay);
  }
  /** 设置组件元素焦点，请参考{#focus}方法。 @priv */
  doFocus(selectText, preventScroll) {
    let me = this, focusEl = me.focusEl;

    focusEl.focusOnly();
    if (!preventScroll)
      me.el.intoView();
    if (focusEl == me.inputEl && (selectText || selectText === 0)) {
      if (selectText === true)
        focusEl.select();
      else if (Wb.isArray(selectText))
        focusEl.setSelectionRange(...selectText);
      else {
        if (selectText == -1)
          selectText = focusEl.value.length;
        focusEl.setSelectionRange(selectText, selectText);
      }
    }
  }
  /**
   * 选择当前输入框中的文本。
   * Example:
   *
   *     text1.select(); //选择全部
   *     text1.select(false); //取消选择全部
   *     text1.select(0); //仅设置光标位于最前
   *     text1.select(-1); //仅设置光标位于最后
   *     text1.select(2, 5); //选择[3到5]个字符。
   *
   * @param {Number/Boolean} [start] 被选中的第一个字符的位置索引，从0开始。如果这个值比值长度还大，则会被看作值最后
   * 一个位置的索引。如果缺省或true表示选择全部，如果值为false表示取消选择全部。-1表示最后一个字符位置。
   * @param {Number} [end] 被选中的最后一个字符的[[下一个]]位置索引。如果这个值比值长度还大，则会被看作值最后一
   * 个位置的索引。缺省且start值为数值表示同start。如果start和end位置相同表示仅设置光标位置，但不选择文本。
   * @param {Boolean} [direction] 选择方向，true向前，false向后，null未知（默认值）。
   */
  select(start, end, direction) {
    let inputEl = this.inputEl;

    if (start == null || start === true) {
      inputEl.select();
    } else if (start === false) {
      inputEl.setSelectionRange(0, 0);
    } else {
      if (direction != null)
        direction = direction ? 'forward' : 'backward';
      if (start == -1)
        start = inputEl.value.length;
      end ??= start;
      inputEl.setSelectionRange(start, end, direction);
    }
  }
  /** @property {String} - 输入提示信息。 @design @key */
  set placeholder(value) {
    this.inputEl.setAttribute('placeholder', value);
  }
  /***/
  get placeholder() {
    return this.inputEl.getAttribute('placeholder');
  }
  /**
   * @event change 当值发生变化时触发。
   * @param {String} value 当前值。
   * @param {String} oldValue 原值。
   */
  /** @property {String} lastValue 当前值改变前最后一次输入的值。 @priv */
  /** @property {String} lastInputValue 当前值改变前最后一次输入框内的值。 @priv */
  /**
   * 当输入值时执行的方法。 @priv
   */
  onInput() {
    this.textChangeEvent();
  }
  /**
   * @event clearclick 清除按钮点击时触发。
   */
  /**
   * 当输入的值有变化时执行的方法。 @priv
   */
  textChangeEvent() {
    let me = this, inputValue = me.inputValue;

    if (me.lastInputValue !== inputValue) {
      let value = me.value;
      me.updateClearButton();
      me.verify();
      if (me.canFireChange())
        me.fireEvent('change', value, me.lastValue);
      me.lastValue = value;
      me.lastInputValue = inputValue;
    }
  }
  /**
   * 判断是否可以显示清除按钮。 @priv
   * @return {Boolean} true显示，false不显示。
   */
  canShowClear() {
    return this.inputValue;
  }
  /**
   * 更新清除按钮显示状态。 @priv
   */
  updateClearButton() {
    let me = this;

    if (me.clearButton && me.canShowClear()) {
      me.clearButtonComp ??= me.addFooter({
        cname: 'iconButton',
        cls: 'w-input-btn w-clear-btn',
        icon: 'delete2',
        weight: 10, //降低权重使位置更近input
        listeners: {
          [Event.tapDownName]: {
            fn: me.mayFocusInputEl,
            scope: me,
            passive: false
          }
        },
        handler() {
          me.clear();
          me.fireEvent('clearclick');
          me.fireEvent('action');
        }
      }, me.wrapEl);
    } else if (me.clearButtonComp) {
      me.clearButtonComp.destroy();
      delete me.clearButtonComp;
    }
  }
  /**
   * 文本框值改变时是否允许触发change事件。 @priv
   * @return {Boolean} true允许，false禁止。
   */
  canFireChange() {
    return true;
  }
  /** @property {String} - 输入框中的输入值。 */
  set inputValue(value) {
    this.inputEl.value = value;
  }
  /***/
  get inputValue() {
    return this.inputEl.value;
  }
  /** @property {Wb.Button} clearButtonComp 清除按钮。 @readonly */
  /** @property {Boolean} clearButton 设置是否显示清除按钮。 */
  /** @property {String} - 输入框的值。 @key */
  set value(value) {
    let inputEl = this.inputEl, oldValue;

    value ??= '';
    oldValue = inputEl.value;
    //此句需强制执行，如number: 34e返回亦为空，需要重置值
    inputEl.value = value;
    if (oldValue !== value)
      this.textChangeEvent();
  }
  /***/
  get value() {
    return this.inputEl.value;
  }
  /** @property {Boolean} - 输入框是否只读。 @design @key */
  set readonly(value) {
    if (this.readonly$ !== value) {
      this.readonly$ = value;
      this.setCls(value, 'w-readonly');
      this.inputEl.readOnly = value;
    }
  }
  /***/
  get readonly() {
    return this.readonly$;
  }
  /** @property {Boolean} - 是否为密码输入框。 @design */
  set password(value) {
    let me = this;
    if (me.password != value) {
      let inputEl = me.inputEl;

      if (value) {
        inputEl.lastType = inputEl.type;
        inputEl.type = 'password';
        if (me.autocomplete === undefined)
          inputEl.autocomplete = 'new-password';
      } else {
        if (inputEl.lastType)
          inputEl.type = inputEl.lastType;
        else
          inputEl.removeAttribute('type');
      }
    }
  }
  /***/
  get password() {
    return this.inputEl.type == 'password';
  }
  /** @property {String} - 输入框的自动完成属性名。比如对应用户名称可以设置为"username"。默认为undefined表示自动。 */
  set autocomplete(value) {
    let me = this, oldValue = me.autocomplete$;

    if (oldValue !== value) {
      let inputEl = me.inputEl;
      me.autocomplete$ = value;
      if (value)
        inputEl.autocomplete = value;
      else if (oldValue)
        inputEl.removeAttribute('autocomplete');
    }
  }
  /***/
  get autocomplete() {
    return this.autocomplete$;
  }
  /** @property {Wb.Button} eyeButtonComp 明码/暗码切换按钮。 @readonly */
  /** @property {Boolean} - 设置是否显示明码/暗码切换按钮。可通过{#eyeButtonComp}获取该按钮。 @design */
  set eyeButton(value) {
    if (this.eyeButton$ !== value) {
      let me = this;

      me.eyeButton$ = value;
      if (value) {
        me.eyeButtonComp ??= me.addFooter({
          cname: 'iconButton',
          cls: 'w-input-btn',
          icon: me.password ? 'eye-close' : 'eye',
          weight: 15,
          listeners: {
            [Event.tapDownName]: {
              fn: me.mayFocusInputEl,
              scope: me,
              passive: false
            }
          },
          handler() {
            me.password = !me.password;
            this.icon = me.password ? 'eye-close' : 'eye';
          }
        }, me.wrapEl);
      } else if (me.eyeButtonComp) {
        me.eyeButtonComp.destroy();
        delete me.eyeButtonComp;
      }
    }
  }
  /***/
  get eyeButton() {
    return this.eyeButton$;
  }
  /**
   * 根据值修整值的长度。用于判断值有效的总长度。 @priv
   * @return {Number} 减去的长度。
   */
  fixLength(value) {
    return 0;
  }
  /**
   * 当前组件是否为空值。 @priv
   * @return {Boolean} true空值，false有值。
   */
  isEmptyValue() {
    return Wb.isEmpty(this.inputValue);
  }
  /** @property {String} blankText 当控件不允许为空时显示的信息。 */
  /**
   * 验证当前控件值的合法性。如果值非法将提示错误信息，否则清除错误信息。自定义的错误信息请
   * 使用{#addError}/{#removeError}方法。
   * @return {Boolean} true合法，false非法。
   */
  verify() {
    let typeDefine, me = this, value = me.inputValue, valueType = me.valueType,
      basicErrors = new Set(), maxLength;

    if (me.isEmptyValue()) {
      //验证必填
      if (me.required)
        basicErrors.add(me.blankText ?? Str.requiredHint);
      else
        me.errors = undefined;
    } else {
      if (me.extraVerify(value, basicErrors) !== false) {
        if (!me.forceSelect) {
          //验证最小字符数量
          if (value.length < me.minLength)
            basicErrors.add(Str.minLength.format(me.minLength));
          //验证最大字符数量
          maxLength = me.maxLength;
          if (maxLength && (value.length - me.fixLength(value) > maxLength))
            basicErrors.add(Str.maxLength.format(maxLength));
        }
        //验证指定的值类型
        if (valueType) {
          typeDefine = me.constructor.valueTypeDefines[valueType];
          if (typeDefine) {
            if (typeDefine.regex && !typeDefine.regex.test(value) ||
              typeDefine.fn && !typeDefine.fn.call(me, value))
              basicErrors.add(me.valueTypeText || typeDefine.msg);
          } else {
            Wb.raise(`Invalid valueType name ${valueType}`);
          }
        }
        //验证正则表达式
        if (me.regex && !me.regex.test(value))
          basicErrors.add(me.regexText || Str.invalidValue.format(value));
        //验证自定义函数
        if (me.validator) {
          value = me.validator.call(me, value);
          if (Wb.isString(value))
            basicErrors.add(value);
        }
      }
    }
    me.basicErrors = basicErrors;
    me.checkError();
    return me.isValid;
  }
  /**
   * 向当前组件添加自定义的错误信息。移除错误信息请使用{#removeError}方法。
   * @param {String/String[]} error 错误信息或其列表。
   */
  addError(error) {
    if (!this.errors)
      this.errors = new Set();
    if (Wb.isArray(error))
      this.errors.push(...error);
    else
      this.errors.push(error);
    this.checkError();
  }
  /**
   * 从当前组件移除指定的自定义错误信息。添加错误信息请使用{#addError}方法。
   * @param {String} [error] 错误信息。如果缺省将删除所有自定义错误信息。
   */
  removeError(error) {
    let errors = this.errors;

    if (errors) {
      if (error)
        errors.remove(error);
      else
        errors.clear();
      this.checkError();
    }
  }
  /***/
  clearError() {
    this.errors = undefined;
    this.basicErrors = undefined;
    this.checkError();
  }
  /** @property {Boolean} - 判断当前组件的值是否有效。 */
  get isValid() {
    return !(this.basicErrors?.size || this.errors?.size);
  }
  /**
   * 检查控件的错误信息，如果控件存在{#basicErrors}和{#errors}错误，将添加控件w-invalid样式和错误提示，
   * 否则移除w-invalid样式和错误提示。
   * @priv
   */
  checkError() {
    let errorTip;
    if (this.isValid) {
      errorTip = undefined;
      this.el.removeCls('w-invalid');
    } else {
      let basicErrors = this.basicErrors;
      if (basicErrors?.has(Str.requiredHint)) {
        //如果有Str.requiredHint错误，仅显示该错误
        errorTip = Str.requiredHint;
      } else {
        //合并显示错误
        let mergeErrors = new Set();
        if (this.errors)
          mergeErrors.push(...this.errors);
        if (basicErrors)
          mergeErrors.push(...basicErrors);
        errorTip = mergeErrors.join('\n');
      }
      this.el.addCls('w-invalid');
    }
    if (this.sideErrorTip ?? Wb.isTouch) {
      let errorTipIcon = this.errorTipIcon;
      if (errorTip) {
        if (!errorTipIcon) {
          errorTipIcon = this.errorTipIcon = this.addFooter({
            cname: 'icon',
            weight: 62,
            cls: 'w-ehint',
            touchTip: true,
            icon: 'warn'
          });
        }
        errorTipIcon.errorTip = errorTip;
      } else {
        if (errorTipIcon) {
          errorTipIcon.destroy();
          delete this.errorTipIcon;
        }
      }
    }
    else {
      this.errorTip = errorTip;
    }
  }
}
/**
 * 文本区域控件，用于输入多行文本。
 * @icon textarea
 */
Cls['Wb.TextArea'] = class textArea extends Wb.Text {
  static cls = 'w-textarea';
  static protos = {
    inputTagName: 'textarea'
  }
  /***/
  init(configs) {
    super.init(configs);
    this.scrollEl$ = this.inputEl;
  }
  /***/
  set noWrap(value) {
    this.inputEl.setCls(value, 'w-pre');
  }
  /***/
  get noWrap() {
    return this.inputEl.containsCls('w-pre');
  }
  /** @property {Boolean} - 是否根据内容自动调整控件高度。 */
  set autoResize(value) {
    let me = this;

    if (me.autoResize$ !== value) {
      me.autoResize$ = value;
      me.setEvents(value, 'change', me.onChange);
      me.setListeners(value, 'resize', me.onChange);
    }
  }
  /***/
  get autoResize() {
    return this.autoResize$;
  }
  /**
   * 内容更改时执行的方法。 @priv
   */
  onChange() {
    let me = this, inputEl = me.inputEl, style;
    if (inputEl.isConnected) {
      style = me.el.computeStyle();
      me.height = 'auto';
      me.height = inputEl.scrollHeight + 3 + parseInt(style.paddingTop) + parseInt(style.paddingBottom);
    }
  }
  /** @property {Number} - 用于指定默认高度的行数。 */
  set rows(value) {
    this.inputEl.rows = value;
  }
  /***/
  get rows() {
    return this.inputEl.rows;
  }
  /** @property {Number} - 用于指定默认高度的列数。 */
  set cols(value) {
    this.inputEl.cols = value;
  }
  /***/
  get cols() {
    return this.inputEl.cols;
  }
}
/**
 * 数字输入框控件。在该控件中可以通过按Up/Down来快速增减数值。
 * @icon number-edit
 */
Cls['Wb.Number'] = class number extends Wb.Text {
  static configs = {
    /** @property {Number} - 点击{#spinner}按钮增加减少的单位值。 */
    step: 1,
    repeatInterval: true,
    spinner: 'auto'
  };
  static protos = {
    /** @property {Boolean} - 指定按功能键时点击增减按钮是否加速。true时按Shift加速10倍，其它不加速。 @getter */
    accelerate: true,
    /** @property {Boolean} - 按上下箭头键时是否允许增减值。默认false表示按Ctrl+上下箭头键允许，true按上下箭头键允许。 */
    upDownKey: false,
    numberInput: false,
    spinner$: false,
    fixedZero: false
  };
  /** @property {Number} intCount 整数最大位数。0或null表示无限制。 @key */
  /** @property {Boolean} autoFormat 是否自动格式化输入的值。 @key */
  /** @property {Number} decimalCount 小数位数，0表示整数。 @key */
  /** @property {Boolean} fixedZero 当小数位数不足时，是否添加0补齐，仅当指定{#decimalCount}后有效。 */
  /** @property {Number} minValue 最小值。 */
  /** @property {Number} maxValue 最大值。 */
  /** @property {Number} step 点击增减数值按钮时的步进长度。 */
  /** @property {Boolean} numberInput 输入框是否使用数字输入框。如果设置为true后某些功能将不可用，比如{#autoFormat}，因为
   * 数字框不允许输入非数字。 */
  /***/
  init(configs) {
    super.init(configs);
    // desktop number has up/down key nav
    if (this.numberInput)
      this.inputEl.type = 'number';
  }
  /***/
  onInputBlur(e) {
    let me = this, v;
    super.onInputBlur(e);
    v = me.fixValue(me.inputValue);
    if (v !== undefined)
      super.value = v;
  }
  /***/
  fixLength(value) {
    let len = 0;
    if (value.includes(Number.decimalChar) || value.includes('.'))
      len++;
    if (value.includes('-'))
      len++;
    return len;
  }
  /**
   * 修整输入的数值为指定格式的值。 @priv
   * @param {Number/String} value 需要修整的数值或字符串值。
   * @return {Number/String} 修整后的值。null空值，undefined无效。
   */
  fixValue(rawValue) {
    let me = this, value = rawValue;

    if (value == null)
      return null;
    if (Wb.isString(value))
      value = value.numValue;
    else
      value = parseFloat(value)
    if (isNaN(value))
      return undefined;
    let decimalCount = me.decimalCount, autoFormat = me.autoFormat;

    if (decimalCount != null) {
      if (me.fixedZero)
        value = value.roundFixed(decimalCount, autoFormat);
      else {
        value = value.round(decimalCount);
        if (autoFormat)
          value = value.floatText;
      }
    }
    else if (autoFormat)
      value = value.floatText;
    return value;
  }
  /***/
  set readonly(value) {
    let me = this;
    super.readonly = value;
    me.incButton?.setVisible(!value);
    me.decButton?.setVisible(!value);
    me.spinnerContainer?.setter('visible', !value);
  }
  /***/
  get readonly() {
    return super.readonly;
  }
  /**
   * 在{#inputEl}上按键时执行的方法。
   * @param {Event} e 事件对象。
   * @priv
   */
  onKeyDown(e) {
    let ctrlMeta = e.ctrlMeta, upDownKey = this.upDownKey;

    if (e.code == Keys.Up) {
      if (ctrlMeta || upDownKey) {
        this.incStep(e);
        e.stopEvent();
      }
    } else if (e.code == Keys.Down) {
      if (ctrlMeta || upDownKey) {
        this.decStep(e);
        e.stopEvent();
      }
    }
  }
  /***/
  extraVerify(rawValue, basicErrors) {
    let me = this, value = rawValue;

    super.extraVerify(value, basicErrors);
    if (Wb.isString(value))
      value = value.numValue;
    else
      value = parseFloat(value);
    if (isNaN(value))
      basicErrors.add(Str.invalidValue.format(rawValue));
    else {
      let intCount = me.intCount;
      //验证最小值
      if (value < me.minValue)
        basicErrors.add(Str.minValue.format(me.minValue));
      //验证最大值
      if (value > me.maxValue)
        basicErrors.add(Str.maxValue.format(me.maxValue));
      //验证整数部分长度
      if (intCount && Math.abs(value) >= Math.pow(10, intCount))
        basicErrors.add(Str.maxIntLength.format(intCount));
    }
  }
  /** @property {Enum/Boolean} - 增减数值按钮的样式: 
    * -'upDown': 上下
    * -'leftRight': 左右
    * -'beforeAfter': 前后
    * -'auto': 自动判断，移动端leftRight，桌面端upDown。默认值。null等同于'auto'。
    * -false: 无增减按钮
    * @design
    */
  set spinner(value) {
    let me = this, oldValue = me.spinner$;

    if (value === null)
      value = 'auto';
    if (oldValue !== value) {
      me.spinner$ = value;
      me.setListeners(value, 'keydown', me.onKeyDown);
      if (oldValue) {
        Wb.destroy([me.decButton, me.incButton, me.spinnerContainer]);
        delete me.decButton;
        delete me.incButton;
        delete me.spinnerContainer;
      }
      let newValue, decBtn = {
        cname: 'iconButton',
        icon: 'minus',
        handler: me.decStep,
        repeatInterval: me.repeatInterval$,
        scope: me,
        listeners: {
          [Event.tapDownName]: {
            fn: me.mayFocusInputEl,
            scope: me,
            passive: false
          }
        }
      }, incBtn = {
        cname: 'iconButton',
        icon: 'add',
        handler: me.incStep,
        repeatInterval: me.repeatInterval$,
        scope: me,
        listeners: {
          [Event.tapDownName]: {
            fn: me.mayFocusInputEl,
            scope: me,
            passive: false
          }
        }
      };
      newValue = value == 'auto' ? (Wb.isTouch ? 'leftRight' : 'upDown') : value;
      switch (newValue) {
        case 'upDown':
          me.spinnerContainer = me.addFooter({
            layout: 'column',
            cls: 'w-spinner-ct',
            items: [
              Wb.applyIf({ icon: 'up2' }, incBtn),
              Wb.applyIf({ icon: 'down2' }, decBtn)
            ]
          }, me.wrapEl);
          me.incButton = me.spinnerContainer.items$[0];
          me.decButton = me.incButton.nextSibling;
          break;
        case 'leftRight':
          me.decButton = me.addFooter(decBtn, me.wrapEl);
          me.incButton = me.addFooter(incBtn, me.wrapEl);
          break;
        case 'beforeAfter':
          me.decButton = me.addHeader(decBtn, me.wrapEl);
          me.incButton = me.addFooter(incBtn, me.wrapEl);
          break;
      }
    }
  }
  /***/
  get spinner() {
    return this.spinner$;
  }
  /** @property {Enum/Number} - 当按下增减数值按钮时重复触发的间隔时间，单位为毫秒。null表示不设置重复触发。
   * -null: 不重复触发。
   * -10: 10毫秒
   * -50: 10毫秒
   * -100: 100毫秒
   * -200: 200毫秒
   * -500: 500毫秒
   */
  set repeatInterval(value) {
    if (this.repeatInterval$ !== value) {
      this.repeatInterval$ = value;
      if (this.incButton) {
        this.incButton.repeatInterval = this.decButton.repeatInterval = value;
      }
    }
  }
  /***/
  get repeatInterval() {
    return this.repeatInterval$;
  }
  /**
   * 当前控件值增减指定步长的值。
   * @param {Event} e 事件对象。
   * @param {Boolean} add 是否增加，true增加，false减少。
   */
  addValue(e, add) {
    let me = this, value, curVal, newVal;

    value = (add ? 1 : -1) * me.step * (me.accelerate && e.shiftKey ? 10 : 1);
    curVal = this.value;
    if (curVal == null || isNaN(curVal))
      newVal = (add ? this.maxValue : this.minValue) ?? value;
    else
      newVal = curVal + value;
    if (newVal < this.minValue)
      newVal = this.minValue;
    if (newVal > this.maxValue)
      newVal = this.maxValue;
    this.value = Math.round(newVal);
  }
  /**
   * 点击减少值按钮执行的方法。
   * @param {Event} e 事件对象。
   * @priv
   */
  decStep(e) {
    this.addValue(e, false);
  }
  /**
   * 点击增加值按钮执行的方法。
   * @param {Event} e 事件对象。
   * @priv
   */
  incStep(e) {
    this.addValue(e, true);
  }
  /** @property {Number} - 输入框的值。 @key */
  set value(val) {
    super.value = this.fixValue(val) ?? null;
  }
  /***/
  get value() {
    let val = super.value;
    if (val == '')
      return null;
    let dc = this.decimalCount;
    val = val.numValue;
    if (dc != null)
      val = val.round(dc)
    return val;
  }
}
/**
 * 带触发按钮的输入框控件，点击按钮可以触发事件运行。
 * @icon trigger
 */
Cls['Wb.Trigger'] = class trigger extends Wb.Text {
  static configs = {
    trigger: true,
    triggerIcon: 'ellipsis'
  };
  static protos = {
    /** @property {Boolean} - 当控件设置为只读时，是否自动隐藏触发按钮。默认为true。 */
    autoHideTrigger: true,
    editable$: true,
    /** @property {Boolean} - 按回车键时是否触发{#*triggerclick}事件。 */
    enterTriggerClick: false
  }
  init(configs) {
    super.init(configs);
    this.mon('keydown', this.onKeyDown);
  }
  /**
   * 添加一个或多个触发器按钮。
   * @param {Wb.Button/Wb.Button[]} buttons 添加的按钮列表。
   */
  addTrigger(buttons) {
    let me = this, items = [];

    Wb.toArray(buttons).forEach(btn => {
      items.push(Wb.applyMerge({
        cname: 'iconButton', weight: 900, icon: 'ellipsis', rippleOnClick: false,
        listeners: {
          [Event.tapDownName]: {
            fn: me.mayFocusInputEl,
            scope: me,
            passive: false
          }
        }
      }, btn));
    });
    //不要改为me.addFooter(items)，需要显示返回单个按钮或数组
    return me.addFooter(items.length > 1 ? items : items[0], me.wrapEl);
  }
  /** @property {Boolean/Object} - 是否创建触发按钮，如果为对象表示按钮配置对象。null值重置为初始状态。 @design */
  set trigger(value) {
    let me = this;

    value ??= me.constructor.allConfigs?.trigger;
    if (value) {
      if (!me.trigger$) {
        let configs = {
          events: {
            click: me.onTriggerClick, scope: me
          }
        };
        if (me.readonly)
          configs.visible = false;
        if (me.triggerIcon)
          configs.icon = me.triggerIcon;
        if (Wb.isObject(value))
          Wb.apply(configs, value);
        me.trigger$ ??= me.addTrigger(configs);
      }
    } else {
      if (me.trigger$) {
        me.trigger$.destroy();
        delete me.trigger$;
      }
    }
  }
  /** @property {Wb.Button} - 触发按钮对象或undefined。 */
  get trigger() {
    return this.trigger$;
  }
  /** @property {Wb.Item/Wb.Item[]} - 辅助的触发按钮或其列表。 */
  set triggers(value) {
    let me = this;
    Wb.destroy(me.triggers$);
    me.triggers$ = me.addTrigger(value);
  }
  /***/
  get triggers() {
    return this.triggers$;
  }
  /***/
  set readonly(value) {
    super.readonly = value;
    if (this.trigger$ && this.autoHideTrigger)
      this.trigger$.visible = !value;
  }
  /***/
  get readonly() {
    return super.readonly;
  }
  /**
   * 在输入框上按键时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onKeyDown(e) {
    if (this.enterTriggerClick && e.isGoKey) {
      this.onTriggerClick(e);
      e.stopEvent();
    }
  }
  /**
   * @event triggerclick 点击触发按钮时触发。
   * @param {Event} e 事件对象。
   */
  /** @property {Function} - 触发按钮点击时执行的方法。
   * @param {Event} e 事件对象。
   */
  onTriggerClick(e) {
    let me = this;

    if (Wb.isDesktop)
      me.focus();
    if (me.trigger?.visible)
      me.fireEvent('triggerclick', e);
  }
  /** @property {IconString} - 默认触发器的矢量图标。null值重置为初始状态。 @design */
  set triggerIcon(value) {
    let me = this;

    value ??= me.constructor.allConfigs?.triggerIcon;
    if (me.triggerIcon$ !== value) {
      me.triggerIcon$ = value;
      let btn = me.trigger$;
      if (btn)
        btn.icon = value;
    }
  }
  /***/
  get triggerIcon() {
    return this.triggerIcon$;
  }
  /** @property {Boolean} - 控件是否可以输入编辑。 @key */
  set editable(value) {
    let me = this;
    if (me.editable$ !== value) {
      me.editable$ = value;
      me.inputEl.readOnly = !value;
      me.setCls(!value, 'w-no-edit')
      me.setListeners(!value, me.inputEl, 'click', me.onInputClick);
    }
  }
  /***/
  get editable() {
    return this.editable$;
  }
  /**
   * 只读输入框点击时执行的方法。
   * @param {Event} [e] 事件对象。
   * @priv
   */
  onInputClick(e) {
    this.onTriggerClick(e);
  }
}
/**
 * 文件框控件，用于选择客户端文件。使用该控件通常用于上传文件。
 * @icon search-file
 */
Cls['Wb.FileInput'] = class fileInput extends Wb.Trigger {
  static cls = 'w-file';
  static protos = {
    browseMode$: false
  }
  static configs = {
    browseWidth: '9em',
    browseHeight: '9em',
    triggerIcon: 'search-file',
    clearButton: true,
    trigger: { tip: Str.selectFile }
  };
  /** @property {Boolean} download 点击文件按钮时是否发起下载。仅在表格内编辑时有效。 */
  /***/
  init(configs) {
    let me = this, wrapEl, fileCtEl;
    super.init(configs);
    wrapEl = me.wrapEl;
    me.focusEl = wrapEl;
    wrapEl.tabIndex = -1;
    wrapEl.ondragover = Event.pdHandler;
    wrapEl.ondrop = e => {
      e.preventDefault();
      me.addFile(e.dataTransfer.files);
    };
    if (configs.browseMode && !configs.multiple)
      configs.fileButtons ??= false;
    me.inputEl.type = 'file';
    fileCtEl = wrapEl.insertElBefore('w-file-ct', null, me.inputEl);
    me.fileCt = new Wb.ScrolledCt({ itemsSortable: true, owner: me, el: fileCtEl });
    me.mon(me.inputEl, 'change', me.onInputChange);
    me.mon(me.wrapEl, 'dblclick', me.wrapElDblClick);
    me.on({ change: me.onChange, destroy: me.onDestroy });
  }
  /** @property {Boolean} - 文件按钮栏是否可见。当{#browseMode}为true且{#multiple}为false时按钮栏不可见。 */
  set fileButtons(value) {
    this.fileCt.visible = value
  }
  /***/
  get fileButtons() {
    return this.fileCt.visible;
  }
  /***/
  onInput() {
    //ignore
  }
  /**
   * 销毁时执行的方法。 @priv
   */
  onDestroy() {
    let url = this.lastBrowseUrl;

    if (url)
      URL.revokeObjectURL(url);
  }
  /** @property {Boolean} - 是否为浏览模式。浏览模式下可在线浏览图片等文件。 @design @key */
  set browseMode(value) {
    let me = this;
    if (me.browseMode$ !== value) {
      let wrapEl = me.wrapEl, fileCt = me.fileCt, fileCtEl = fileCt.el, inputEl = me.inputEl;
      me.browseMode$ = value;
      fileCt.each(btn => {
        btn.enableToggle = value;
        btn.groupName = value ? 'tag' : null;
        if (!value)
          btn.active = null;
      });
      if (value) {
        let prevEl, prevCtEl, width = me.browseWidth$, height = me.browseHeight$;

        prevCtEl = me.prevCtEl = wrapEl.insertElBefore('w-file-prev-ct', null, inputEl);
        prevEl = me.prevEl = prevCtEl.addEl('w-center w-prev-body').addEl('w-center w-margin');
        me.onClickPreview(prevEl);
        if (width != null)
          prevEl.width = width;
        if (height != null)
          prevEl.height = height;
        prevCtEl.addEl().appendChild(fileCtEl);
      } else {
        me.unClickPreview(me.prevEl);
        me.prevCtEl?.remove();
        wrapEl.insertBefore(fileCtEl, inputEl);
      }
    }
  }
  /***/
  get browseMode() {
    return this.browseMode$;
  }
  /** @property {Number/String} - 浏览元素宽度。如果值为数值，默认单位为px。如："calc(100% - 1em)"。 @design */
  set browseWidth(value) {
    let me = this;
    if (me.browseWidth$ !== value) {
      let prevEl = me.prevEl, child;
      me.browseWidth$ = value;
      prevEl?.setWidth(value);
      child = prevEl?.firstElementChild;
      if (child)
        child.maxWidth = value;
    }
  }
  /***/
  get browseWidth() {
    return this.browseWidth$;
  }
  /** @property {Number/String} - 浏览元素高度。如果值为数值，默认单位为px。如："calc(100% - 1em)"。 @design */
  set browseHeight(value) {
    let me = this;
    if (me.browseHeight$ !== value) {
      let prevEl = me.prevEl, child;
      me.browseHeight$ = value;
      prevEl?.setHeight(value);
      child = prevEl?.firstElementChild;
      if (child)
        child.maxHeight = value;
    }
  }
  /***/
  get browseHeight() {
    return this.browseHeight$;
  }
  /** @property {Boolean} - 是否选择目录而非文件。 */
  set directory(value) {
    this.inputEl.webkitdirectory = value;
  }
  /***/
  get directory() {
    return this.inputEl.webkitdirectory;
  }
  /** @property {Enum} - 1个或多个文件类型的逗号分隔列表，或唯一的文件类型说明符，用于描述允许的文件类型。
   * -'image!/*': 所有图片。
   * -'audio!/*': 所有音频。
   * -'video!/*': 所有视频。
   * -'application!/zip': zip文件。
   * -'.doc, .docx': Word文件。
   * -'.xls, .xlsx': Excel文件。
   * -'.ppt, .pptx, .pps, .ppsx': Powerpoint 文件。
   * -'.pdf': Pdf文件。
   * -'.png, .jpg, .jpeg': png或jpg格式的文件。
   * @key
   */
  set accept(value) {
    let me = this;

    if (me.accept$ !== value) {
      me.accept$ = value;
      me.inputEl.accept = value;
    }
  }
  /***/
  get accept() {
    return this.accept$;
  }
  /** 
   * @event buttonclick 文件按钮点击时触发。
   * @param {Wb.TagButton} button 按钮。
   * @param {Event} e 事件对象。
   */
  /**
   * 包裹元素双击时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  wrapElDblClick(e) {
    let target = e.target;
    if (!this.readonly && !target.closest('.w-btn') && target.tagName != 'IMG') {
      this.openDialog();
      e.stopEvent();
    }
  }
  /**
   * 打开文件对话框以选择文件。
   */
  openDialog() {
    this.inputEl.click();
  }
  /** @property {File[]} lastFiles change事件前最后选择的文件。 @priv */
  /**
   * @event change 当选择的文件发生变化时触发。当添加文件时可通过files.{#diff|Array.diff}(oldFiles)获取新增
   * 的文件列表。
   * @param {File/File[]} files 新选择的文件或其列表。
   * @param {File/File[]} oldFiles 原选择的文件其列表。
   */
  /**
   * 向当前组件内添加文件，虚拟文件或其列表。虚拟文件通过对象表示。
   * Example:
   *
   *     me.addFile([file1, {name: 'pic.png', size: 2345}]);
   *
   * @param {File/FileList/File[]/Object/Object[]} [files] 文件或其列表。
   */
  addFile(files) {
    if (!Wb.isArray(files) && !(files instanceof FileList))
      files = [files];
    if (!files.length) return;

    let name, file, size, configs, i = 0, j, me = this, items = [],
      single = !me.multiple, download = me.download;

    if (single)
      me.silentClear();
    j = files.length;
    for (file of files) {
      name = file.name;
      size = file.size;
      configs = {
        cname: 'tagButton', text: name, icon: Wb.getFileIcon(name), file, filename: name, capture: true,
        tip: name + (size == null ? '' : ' (' + size.fileSize + ')'), events: {
          closeclick() {
            let btn = this, nextBtn = btn.nextSibling ?? btn.previousSibling;

            btn.destroy();
            if (nextBtn)
              nextBtn.active = true;
            else
              me.preview();//清除预览
            me.fireEvent('change', me.value, me.lastFiles);
          },
          toggle(active) {
            if (active)
              me.preview(this.file);
          },
          click(e) {
            if (download)
              me.downloadFile(this);
            me.fireEvent('buttonclick', this, e);
          }
        }
      };
      if (download)
        configs.rippleOnClick = true;
      if (me.browseMode) {
        i++;
        configs.enableToggle = true;
        configs.groupName = 'tag';
        if (i == j)
          configs.active = true;
      }
      items.push(configs);
      if (single)
        break;
    }
    me.fileCt.add(items);
    me.fireEvent('change', me.value, me.lastFiles);
  }
  /**
   * 该控件在表格模式下时下载关联的文件。 @priv
   * @param {Wb.TagButton} btn 按钮。
   */
  downloadFile(btn) {
    let me = this, el = me.el, grid = el.getClosestComp(Wb.Grid), file = btn.file,
      fieldName = grid?.editCol?.fieldName;

    if (file instanceof File) {
      Wb.downloadBlob(file, file.name ?? fieldName);
    } else {
      //远程下载
      let url = grid?.url;
      if (url) {
        let params = Wb.copy(grid.params);

        params[grid.downloadName] = Wb.apply({ _meta: { fieldName, filename: file.name, size: file.size } },
          grid?.editRow?.originData);
        Wb.download(url, params, 'POST');
      }
    }
  }
  /**
   * 在预览元素上预览指定的文件或URL资源。仅当{#browseMode}为true时有效。
   * @param {File/Object/String} [file] 文件或URL资源。缺省将清除预览。
   */
  preview(file) {
    let me = this;
    if (me.lastBrowseUrl) {
      URL.revokeObjectURL(me.lastBrowseUrl);
      me.lastBrowseUrl = undefined;
    }
    if (!me.browseMode)
      return;
    let prevEl = me.prevEl, isString;

    prevEl.setStyle('background-image', '');
    prevEl.textContent = '';
    me.prevTextEl?.remove();
    isString = Wb.isString(file);
    if (!isString && !file?.name)
      return;
    if (isString || Wb.isImageFile(file.name) && file instanceof Blob) {
      let img, url;

      if (isString)
        url = file;
      else
        url = me.lastBrowseUrl = URL.createObjectURL(file);
      img = prevEl.addEl('w-pointer', 'img');
      img.draggable = false;
      img.src = url;
      img.maxWidth = me.browseWidth;
      img.maxHeight = me.browseHeight;
    } else {
      let items = [];
      items.pushIf(file.name, file.size?.fileSize,
        file.lastModified ? new Date(file.lastModified).dateText : null);
      me.prevTextEl = prevEl.parentNode.addEl('w-text-prev');
      me.prevTextEl.textContent = items.join('\n');
    }
  }
  /**
   * 文件输入元素选择文件时触发。 @priv
   * @param {Event} [e] 事件对象。
   */
  onInputChange(e) {
    let me = this, inputEl = me.inputEl, files = inputEl.files;

    if (files.length) {
      me.addFile(files);
      inputEl.value = null;
    }
  }
  /***/
  set readonly(value) {
    super.readonly = value;
    this.fileCt.itemsSortable = !value;
  }
  /***/
  get readonly() {
    return super.readonly;
  }
  /**
   * 清除所有的文件，不触发change事件。 @priv
   */
  silentClear() {
    let me = this;
    me.suspendEvent('change')
    try {
      me.fileCt.destroyAll();
    } finally {
      me.resumeEvent('change')
    }
  }
  /***/
  clear() {
    let me = this, lastFiles = me.lastFiles;

    if (me.fileCt.items.length)
      me.silentClear();
    me.preview();
    if (lastFiles != null)
      me.fireEvent('change', null, lastFiles);
    me.clearError();
  }
  /***/
  reset() {
    this.clear();
  }
  /***/
  canShowClear() {
    return this.fileCt.firstItem;
  }
  /**
   * 选择文件变化时执行的方法。 @priv
   * @param {File/File[]} files 新选择的文件或其列表。
   * @param {File/File[]} oldFiles 原选择的文件或其列表。
   */
  onChange(files, oldFiles) {
    let me = this;
    me.updateClearButton();
    me.verify();
    me.lastFiles = files;
  }
  /***/
  onTriggerClick(e) {
    super.onTriggerClick(e);
    if (this.trigger?.visible) {
      this.openDialog();
    }
  }
  /***/
  verify() {
    let me = this, basicErrors = new Set();

    if (!me.fileCt.items.length && me.required) {
      basicErrors.add(me.blankText ?? Str.requiredHint);
    }
    me.basicErrors = basicErrors;
    me.checkError();
    return me.isValid;
  }
  /** @property {Boolean} - 是否允许选择多个文件。 @key */
  set multiple(value) {
    this.inputEl.multiple = value;
  }
  /***/
  get multiple() {
    return this.inputEl.multiple;
  }
  /** @property {Mix/File/FileList/File[]/Object/Object[]} - 文件或其列表值。如果空值或空数组将清空该控件；\
   * 如果值为对象，表示一个虚拟的文件；如果为字符串表示一个文件名。如果{#multiple}属性为true，则值为数组。
   * @design false
   */
  set value(value) {
    let me = this;

    if (Wb.isEmpty(value))
      me.clear();
    else {
      if (Wb.isString(value))
        value = { name: value };
      me.suspendEvent('change')
      try {
        me.fileCt.destroyAll();
        me.addFile(value);
      } finally {
        me.resumeEvent('change');
      }
      me.fireEvent('change', me.value, me.lastFiles);
    }
    me.lastFiles = value;
  }
  /** @property {File/File[]} - 除虚拟文件外的文件或其列表。未选择文件返回null。如果仅有虚拟文件返回undefined。如果
   * 要获取包含虚拟文件在内的值请访问{#getFiles}方法。 */
  get value() {
    return this.getFiles(true);
  }
  /**
   * 获取包含虚拟文件在内的文件或其列表。 @priv
   * @param {Boolean} [excludeVirtual] 是否排除虚拟文件。
   * @return {Mix} 文件或其列表。未选择文件返回null。如果"excludeVirtual"为true且仅有虚拟文件返回undefined。
   */
  getFiles(excludeVirtual) {
    let me = this, fs = me.fileCt.items.pluck('file');

    if (!fs.length)
      return null;
    if (excludeVirtual)
      fs = fs.filter(f => f instanceof File);
    if (me.multiple) {
      fs.canIterable = true;
      return fs.length ? fs : undefined;
    } else {
      return fs[0];
    }
  }
}
/**
 * 下拉控件。点击触发器按钮后显示下拉对象，该下拉对象称为下拉组件。请区别下拉控件和下拉组件特指的对象。
 * @icon picker
 */
Cls['Wb.Picker'] = class picker extends Wb.Trigger {
  //picker需要先处理，如先于expanded属性
  static firstNames = ['picker'];
  static configs = {
    triggerIcon: 'down'
  };
  static protos = {
    /** @property {Boolean} - 按Esc键时是否收缩下拉组件。默认为true。 @desktop */
    collapseOnEsc: true,
    /** @property {Boolean} - 点击触发器按钮或Down按键时是否自动展开/收缩下拉组件。 @priv */
    autoExpand: true,
    /** @property {Boolean} - 当下拉组件展开时，是否自动把上下箭头按键事件派发到下拉组件。 @priv */
    autoDispatch: true,
    /** @property {Boolean} - 在没有展开下拉组件前是否不把下拉组件添加到组件。默认为true。 */
    lazyRender: true,
    /** @property {Boolean} - 在没有展开下拉组件前是否不创建下拉组件实例。 */
    lazyPicker: false,
    /** @property {Boolean} - 下拉组件的宽度是否同下拉控件的宽度保持一致。 */
    matchWidth: false,
    /** @property {Boolean} - 按[向下按钮]是否展开。false按[Ctrl+向下按钮]展开，true按[向下按钮]展开。 */
    arrowDownExpand: false,
    dockedPicker$: false,
    expanded$: false
  };
  /***/
  init(configs) {
    super.init(configs);
    this.on('destroy', this.onDestroy);
  }
  /**
   * 控件销毁时执行的方法。 @priv
   */
  onDestroy() {
    let picker = this.picker$;
    if (picker?.instanced && !picker.destroyed)
      picker.hide();
  }
  /**
   * 实例化picker并返回picker实例。 @priv
   * @return {Wb.Component} picker实例。
   */
  instancePicker() {
    let me = this, picker = me.picker$;
    if (!picker.instanced) {
      me.picker = picker;
      picker = me.picker; //Setter方式后转换为实例
    }
    return picker;
  }
  /** @property {Enum} - 指定下拉组件是否始终停靠在窗口底部。
   * -true: 始终停靠在底部。
   * -false: 不停靠。
   * -'auto': 在touch模式下停靠，desktop模式下不停靠。
   */
  set dockedPicker(value) {
    let me = this;

    if (me.dockedPicker$ !== value) {
      me.dockedPicker$ = value;
      me.picker.setCls(value === true || value == 'auto' && Wb.isTouch, 'w-docked-picker');
    }
  }
  /***/
  get dockedPicker() {
    return this.dockedPicker$;
  }
  /**
   * 组件上按键时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onKeyDown(e) {
    let me = this;
    if ((e.ctrlMeta || me.arrowDownExpand) && e.code == Keys.Down && me.autoExpand && !me.expanded$) {
      me.expand();
      e.stopEvent();
      return;
    }
    let picker = me.instancePicker(), keyCode = e.code;
    if (me.expanded$ && me.autoDispatch && (keyCode == Keys.ArrowDown ||
      keyCode == Keys.ArrowUp || e.isGoKey))
      picker.dispatchEvent('keydown', e, null, { forceFire: true });
    else
      super.onKeyDown(e);
  }
  /***/
  onTriggerClick(e) {
    let me = this;

    super.onTriggerClick(e);
    if (me.trigger?.visible && me.autoExpand)
      me.expanded = !me.expanded;
  }
  /** @event beforeexpand 下拉组件展开前触发。如果返回false将取消展开。 */
  /** @event expand 下拉组件展开时触发。 */
  /** @event beforecollapse 下拉组件收缩前触发。如果返回false将取消收缩。 */
  /** @event collapse 下拉组件收缩时触发。 */
  /** @property {Boolean} - 下拉组件是否展开。 */
  set expanded(value) {
    let me = this;
    if (me.expanded$ !== value) {
      let picker = me.picker;
      if (!picker)
        return;
      picker = me.instancePicker(picker);
      if (value) {
        if (me.fireEvent('beforeexpand') === false)
          return;
        me.expanded$ = value;
        //picker可能为共享对象重新设置owner
        picker.owner = me;
        if (picker.renderEl != me.el)
          picker.renderEl = me.el;
        picker.show();
        if (me.matchWidth)
          picker.width = me.wrapEl.offsetWidth;
        me.alignPicker();
        me.fireEvent('expand');
      } else {
        if (me.fireEvent('beforecollapse') === false)
          return;
        me.expanded$ = value;
        picker.hide();
        me.fireEvent('collapse');
      }
      me.setListeners(value, {
        el: DocEl,
        [Event.tapDownName]: me.onDocTapDown,
        keydown: { fn: me.onDocKeyDown, capture: true },
        resize: me.onDocResize,
        wheel: { fn: me.onDocWheel, passive: true }
      });
    }
  }
  /***/
  get expanded() {
    return this.expanded$;
  }
  /**
   * 展开下拉组件。
   */
  expand() {
    this.expanded = true;
  }
  /**
   * 收缩下拉组件。
   */
  collapse() {
    this.expanded = false;
  }
  /** @property {Wb.Container/Wb.Component} - 设置下拉组件或配置对象，下拉组件为点击触发器按钮后显示的组件。 */
  set picker(picker) {
    let me = this, oldPicker = me.picker$;

    if (me.lazyPicker && !oldPicker) {
      me.picker$ = picker;
      return;
    }
    if (oldPicker?.instanced && oldPicker.autoDestroy)
      oldPicker.destroy();
    me.picker$ = Wb.create(picker);
    let config = {
      visible: me.expanded$, tabIndex: -1, cls: 'w-picker-comp', owner: me
    };
    if (me.picker$.cname == 'tree')
      me.picker$.gridLine ??= false;
    if (!me.lazyRender)
      config.renderEl = me.el;
    Wb.apply(me.picker$, config);
  }
  /***/
  get picker() {
    return this.picker$;
  }
  /** @property {Number/String} - 下拉组件的最小高度，如果值为数值，默认单位为px。 */
  set pickerMinHeight(value) {
    this.picker$.minHeight = value;
  }
  /***/
  get pickerMinHeight() {
    return this.picker$.minHeight;
  }
  /** @property {Number/String} - 下拉组件的最大高度，如果值为数值，默认单位为px。 */
  set pickerMaxHeight(value) {
    this.picker$.maxHeight = value;
  }
  /***/
  get pickerMaxHeight() {
    return this.picker$.maxHeight;
  }
  /** @property {Number/String} - 下拉组件的高度，如果值为数值，默认单位为px。 */
  set pickerHeight(value) {
    this.picker$.height = value;
  }
  /***/
  get pickerHeight() {
    return this.picker$.height;
  }
  /** @property {Number/String} - 下拉组件的宽度，如果值为数值，默认单位为px。 */
  set pickerWidth(value) {
    this.picker$.width = value;
  }
  /***/
  get pickerWidth() {
    return this.picker$.width;
  }
  /** @property {Number/String} - 下拉组件的最小宽度，如果值为数值，默认单位为px。 */
  set pickerMinWidth(value) {
    this.picker$.minWidth = value;
  }
  /***/
  get pickerMinWidth() {
    return this.picker$.minWidth;
  }
  /** @property {Number/String} - 下拉组件的最大宽度，如果值为数值，默认单位为px。 */
  set pickerMaxWidth(value) {
    this.picker$.maxWidth = value;
  }
  /***/
  get pickerMaxWidth() {
    return this.picker$.maxWidth;
  }
  /** @property {Object} pickerConfig 下拉组件的配置对象。 */
  set pickerConfig(value) {
    this.pickerConfig$ = value;
    Wb.apply(this.picker$, value);
  }
  /***/
  get pickerConfig() {
    return this.pickerConfig$;
  }
  /** @property {Element/Element[]} noCollapseEl 点击时不隐藏下拉组件的元素或其列表。 @priv */
  /**
   * {#globalThis.DocEl}点击时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onDocTapDown(e) {
    let me = this, target = e.target, picker = me.picker$, nce = me.noCollapseEl, els;

    els = [picker.el, me.inputEl, me.trigger?.el];
    if (nce)
      els.pushAll(Wb.toArray(nce));
    //点击除下拉组件本身、输入框和触发器按钮外的任何元素均将隐藏下拉组件
    if (!els.some(el => el?.contains(target)) && !picker.contains(target.getClosestComp()))
      me.collapse();
  }
  /**
   * {#globalThis.DocEl}按键时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onDocKeyDown(e) {
    let me = this;
    switch (e.code) {
      case Keys.Esc:
        //收起picker
        if (me.collapseOnEsc) {
          me.collapse();
          me.focus();
          e.stopEvent();
        }
        break;
      case Keys.Tab:
        me.collapseOnBlur.delay(me, 10);
        break;
      default:
        let inputEl = me.inputEl, atInputEl = inputEl.contains(e.target);
        //在picker和inputEl之外或inputEl内且为disabled停止按键事件
        if (!atInputEl && !me.picker$.el.contains(e.target) || atInputEl && inputEl.disabled) {
          e.stopEvent();
        }
    }
  }
  /**
   * {#globalThis.DocEl}鼠标滚轮滚动时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onDocWheel(e) {
    //除下拉组件本身外的任何元素上鼠标滚轮滚动时均将隐藏下拉组件
    if (!this.picker.el.contains(e.target))
      this.collapse();
  }
  /**
   * {#globalThis.DocEl}Resize时执行的方法。 @priv
   */
  onDocResize() {
    this.alignPicker.delay(this);
  }
  /**
   * 对齐下拉组件到{#wrapEl}。 @priv
   */
  alignPicker() {
    let me = this, picker = me.picker$;

    if (me.matchWidth)
      picker.width = me.wrapEl.offsetWidth;
    picker.alignTo(me.wrapEl);
  }
  /**
   * 当组件的任何部分失去焦点时收缩下拉组件。 @priv
   */
  collapseOnBlur() {
    let activeEl = document.activeElement;
    if (![this.inputEl, this.picker$.el, this.trigger?.el, this.el].some(
      el => el.contains(activeEl)))
      this.collapse();
  }
}
/**
 * 日期选择控件，用于通过选择下拉日历日期的方式来输入数据。在该控件中可以通过按Ctrl+Up/Down来快速增减日期。
 * 日期选择控件的相关示例见：{#%date.xwl|ide?openModule=example/comps/date.xwl}
 * @icon calendar
 */
Cls['Wb.Date'] = class date extends Wb.Picker {
  static configs = {
    triggerIcon: 'calendar'
  };
  static protos = {
    format$: Str.dateFormat,
    /** @property {Express/Array} - 可选的日期有效格式列表。 */
    altFormats: Str.altDateFormats,
    /** @property {Boolean} - 是否使用共享的视图，使用共享的视图下拉配置项将无效。默认为true。 */
    shareView: true,
    /** @property {Number} - 当使用{#beginDate}指定起始日期时，开始日期同结束日期的最小偏差天数。 */
    rangeOffset: 0,
    /** @property {Boolean} - 是否强制要求日期值为有效日期格式。默认为true。 */
    forceDate: true,
    /** @property {Enum} - 是否使用本地的日期时间格式，如果为字符串表示使用的日期时间格式。设置该属性后，
     * {#editable}将为false。
     * -true: 日期控件使用"dateText", 时间控件使用"timeText", 日期时间控件使用"dateTimeText"。
     * -'dateText': 日期格式，见{#Date.dateText}说明。
     * -'timeText': 24小时制时间格式，见{#Date.timeText}说明。
     * -'timeTextHM': 24小时制时分时间格式，见{#Date.timeTextHM}说明。
     * -'timeText12': 12小时制时间格式，见{#Date.timeText12}说明。
     * -'timeText12HM': 12小时制时分时间格式，见{#Date.timeText12HM}说明。
     * -'dateTimeText': 24小时制日期时间格式，见{#Date.dateTimeText}说明。
     * -'dateTimeTextHM': 24小时制时分日期时间格式，见{#Date.dateTimeTextHM}说明。
     * -'dateTimeText12': 12小时制日期时间格式，见{#Date.dateTimeText12}说明。
     * -'dateTimeText12HM': 12小时制时分日期时间格式，见{#Date.dateTimeText12HM}说明。
     * -'dateTimeMilliText': 24小时制日期时间和毫秒格式，见{#Date.dateTimeMilliText}说明。
     * -'dateTimeMilliText12': 12小时制日期时间和毫秒格式，见{#Date.dateTimeMilliText12}说明。
     * -'prettyText': 当地地区域根据当前时间显示的24小时制最佳时间表示。见{#Date.prettyText}说明。
     * -'prettyText12': 当地地区域根据当前时间显示的12小时制最佳时间表示。见{#Date.prettyText12}说明。
     * -'autoText': 当地区域以24小时制4位年和2位数月日时分秒表示的日期时间字符串。日期和时间使用空格连接。如果时分秒\
     * 为0仅显示日期部分。
     */
    localFormat: false,
    /** @property {Boolean} - 未指定的年、月、日、时、分、秒和毫秒是否使用当前时间。详见{#Wb.parseDate}。 @priv */
    defaultNow: false
  };
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    if (this.localFormat) {
      this.forceDate = false;
      configs.editable = false;
    }
    me.picker = me.createDatePicker();
    me.on({ expand: me.onExpand, collapse: me.onCollapse });
  }
  /**
   * 创建日期下拉组件。 @priv
   */
  createDatePicker() {
    return this.shareView ? Wb.DateView.picker : { cname: 'dateView' };
  }
  /** @property {String/Wb.Date} - 目标区间起始日期控件，将同该控件组成日期区间控件。如果为字符串表示
   * 目标控件的cid属性。 @key */
  set beginDate(value) {
    let me = this, oldValue = me.beginDate$;

    if (oldValue !== value) {
      me.beginDate$ = value;
      if (oldValue) {
        if (Wb.isString(oldValue))
          oldValue = me.parent?.find(oldValue);
        oldValue.un('change', me.onBeginChange);
        oldValue.un('select', me.onBeginSelect);
        me.un('change', me.onEndChange);
      }
      if (value) {
        if (Wb.isString(value))
          value = me.parent?.find(value);
        value.on('change', me.onBeginChange, me);
        value.on('select', me.onBeginSelect, me);
        me.on('change', me.onEndChange, value, { endDate: me });
      }
    }
  }
  /***/
  get beginDate() {
    return this.beginDate$;
  }
  /**
   * 组成区间日期时起始日期值改变时执行的方法。 @priv
   */
  onBeginChange(newValue) {
    this.minValue = newValue?.addDay(this.rangeOffset);
  }
  /**
   * 组成区间日期时起始日期值选择时执行的方法。 @priv
   */
  onBeginSelect(newValue) {
    let toDate = this;
    if (!toDate.value)
      toDate.expand.delay(toDate);
  }
  /**
   * 组成区间日期时结束日期值改变时执行的方法。 @priv
   */
  onEndChange(newValue, oldValue, options) {
    this.maxValue = newValue?.addDay(-options.endDate.rangeOffset);
  }
  /** @property {Date} minValue 最小值。 */
  /** @property {Date} maxValue 最大值。 */
  /**
   * 下拉组件展开前执行的方法。 @priv
   */
  onExpand() {
    let me = this, picker = me.picker$, value = me.value;

    picker.minValue = me.minValue;
    picker.maxValue = me.maxValue;
    //forceDate非强制日期格式可能返回字符串
    if (!me.forceDate && Wb.isString(value))
      value = Wb.parseDate(value);
    picker.value = value;
    picker.on('selectdate', me.onSelectDate, me);
  }
  /**
   * 下拉组件收缩时执行的方法。 @priv
   */
  onCollapse() {
    this.picker$.un('selectdate', this.onSelectDate);
  }
  /***/
  extraVerify(value, basicErrors) {
    let me = this;
    super.extraVerify(value, basicErrors);
    if (me.forceDate) {
      let format = me.format$;
      value = me.parseDate(value);
      if (value) {
        //验证最小值
        if (value < me.getCompareValue(me.minValue))
          basicErrors.add(Str.minValue.format(me.minValue.format(format)));
        //验证最大值
        if (value > me.getCompareValue(me.maxValue))
          basicErrors.add(Str.maxValue.format(me.maxValue.format(format)));
      } else {
        basicErrors.add(Str.invalidDate.format((new Date()).format(format)));
        return false;
      }
    }
  }
  /** @property {Date/String} - 最大日期值或文本表示的日期。 */
  set maxValue(value) {
    let me = this;

    if (me.maxValue$ !== value) {
      if (Wb.isString(value))
        value = me.parseDate(value);
      me.maxValue$ = value;
    }
  }
  /***/
  get maxValue() {
    return this.maxValue$;
  }
  /** @property {Date} - 最小日期值。 */
  set minValue(value) {
    let me = this;

    if (me.minValue$ !== value) {
      if (Wb.isString(value))
        value = me.parseDate(value);
      me.minValue$ = value;
    }
  }
  /***/
  get minValue() {
    return this.minValue$;
  }
  /**
   * 获取用于比较大小的日期值。
   * @param {Date} date 日期值。
   * @return {Date} 处理后的日期值。
   * @priv
   */
  getCompareValue(date) {
    return date ? date.datePart : undefined;
  }
  /***/
  onInputBlur(e) {
    super.onInputBlur(e);
    let me = this, val = me.value;
    if (val && me.forceDate)
      me.value = val.format(me.format$);
  }
  /**
   * @event select 选择下拉日历中的日期时触发。
   * @param {Date} date 日期。
   */
  /**
   * 在日历中选择日期时执行的方法。
   * @param {Date} date 选择的日期。
   * @priv
   */
  onSelectDate(date) {
    let me = this;

    me.value = date;
    me.fireEvent('select', date);
    me.collapse();
    me.focus();
  }
  /** @property {Date} dateValue 设置{#localFormat}后保存的日期值。 @priv */
  /** @property {Date/String} - 设置日期值，如果为字符串必须为{#format}指定格式的日期字符串。 @key */
  set value(value) {
    let me = this;

    if (me.forceDate) {
      if (Wb.isString(value))
        value = me.parseDate(value);
      if (value)
        value = value.format(me.format$);
    } else {
      let lf = me.localFormat;
      if (Wb.isString(value))
        value = Wb.parseDate(value) ?? value;
      if (lf) {
        me.dateValue = value;
        if (value) {
          if (lf === true) {
            if (me instanceof Wb.Time)
              lf = 'timeText';
            else if (me instanceof Wb.Datetime)
              lf = 'dateTimeText';
            else
              lf = 'dateText';
          }
          value = value[lf];
        }
      } else if (Wb.isDate(value))
        value = value.format(me.format$);
    }
    super.value = value;
  }
  /** @property {Date} - 获取日期值。如果值为空或非法返回null。 */
  get value() {
    if (this.localFormat)
      return this.dateValue ?? null;
    else
      return this.forceDate ? this.parseDate(super.value) : super.value;
  }
  /**
   * 把文本值按{#format}和{#Str}.altDateFormats定义的格式转换为日期类型。
   * @param {String} text 文本值。
   * @return {Date} 转换后的日期值，如果格式无效将返回null。
   */
  parseDate(text) {
    if (text) {
      let value = Wb.parseDate(text, this.format$);
      if (value)
        return value;
      //尝试多种格式解析日期
      this.altFormats.some(format => value = Wb.parseDate(text, format, this.defaultNow));
      if (!value)
        value = Wb.parseDate(text);
      return value;
    }
    return null;
  }
  /** 
   * @property {String} - 日期的显示格式，例如: y-MM-dd HH:mm:ss.SSS，详见{#Date.format}方法。默认为根据区域配置文件。
   */
  set format(value) {
    if (this.format$ !== value) {
      this.format$ = value;
      this.value = this.value;
    }
  }
  /***/
  get format() {
    return this.format$;
  }
}
/**
 * 时间选择控件，用于通过选择下拉时间的方式来输入数据。
 * @icon time
 */
Cls['Wb.Time'] = class time extends Wb.Date {
  static configs = {
    triggerIcon: 'time'
  };
  static protos = {
    format$: Str.timeFormat,
    altFormats: Str.altTimeFormats,
    defaultNow: true
  };
  /**
   * @event selectdate 选定某个时间时触发。
   * @param {Date} date 日期。
   */
  /** @property {Time} value @setter */
  /** @property {Time} minValue @setter */
  /** @property {Time} maxValue @setter */
  /***/
  createDatePicker() {
    return this.shareView ? Wb.TimeSlot.picker : { cname: 'timeSlot' };
  }
  /***/
  getCompareValue(date) {
    return date ? date.timePart : undefined;
  }
  /***/
  onExpand() {
    super.onExpand();
    this.picker.format = this.format;
  }
}
/**
 * 年月选择控件，用于通过选择下拉年月的方式来输入数据。
 * @icon month
 */
Cls['Wb.YearMonth'] = class yearMonth extends Wb.Time {
  static configs = {
    triggerIcon: 'calendar'
  };
  static protos = {
    format$: Str.monthFormat,
    altFormats: Str.altMonthFormats,
    defaultNow: false
  };
  /** @property {YearMonth} value @setter */
  /** @property {YearMonth} minValue @setter */
  /** @property {YearMonth} maxValue @setter */
  /***/
  createDatePicker() {
    return this.shareView ? Wb.MonthSlot.picker : { cname: 'monthSlot' };
  }
  /***/
  getCompareValue(date) {
    return date ? date.datePart : undefined;
  }
}
/**
 * 日期时间选择控件，用于通过选择下拉日期时间的方式来输入数据。
 * @icon dt-picker
 */
Cls['Wb.Datetime'] = class datetime extends Wb.Date {
  static configs = {
    triggerIcon: 'dt-picker'
  };
  static protos = {
    format$: Str.dateTimeFormat,
    altFormats: Str.altDateTimeFormats
  };
  /** @property {DateTime} value @setter */
  /** @property {DateTime} minValue @setter */
  /** @property {DateTime} maxValue @setter */
  /**
   * @event selectdate 选定某个日期时间时触发。
   * @param {Date} date 日期。
   */
  /***/
  createDatePicker() {
    return this.shareView ? Wb.DatetimePanel.picker : { cname: 'datetimePanel' };
  }
  /***/
  getCompareValue(date) {
    return date;
  }
  /***/
  onExpand() {
    super.onExpand();
    this.picker.format = this.format;
  }
}
/**
 * 颜色选择控件，用于通过选择下拉调色板的方式来输入颜色值。
 * @icon color
 */
Cls['Wb.Color'] = class color extends Wb.Picker {
  static configs = {
    triggerIcon: 'color',
    icon: 'null'
  };
  static protos = {
    autoPadding: false,
    matchWidth: true
  };
  /***/
  init(configs) {
    super.init(configs);
    this.picker = Wb.ColorComp.colorComp;
    this.on({ change: this.onChange, expand: this.onExpand, collapse: this.onCollapse });
  }
  /**
   * 值有变化时执行的方法。 @priv
   * @param {String} value 值。
   */
  onChange(value) {
    this.iconEl$.bgColor = value;
  }
  /**
   * 下拉组件展开前执行的方法。 @priv
   */
  onExpand() {
    let value = this.value, picker = this.picker$;

    if (value) {
      let rgb = '#';

      value = this.iconEl$.computeStyle().backgroundColor.getPart('(', ')').split(',');
      value.forEach((item, i) => {
        if (i == 3)
          rgb += Math.round(parseFloat(item) * 255).toString(16).padStart(2, '0');
        else
          rgb += parseInt(item).toString(16).padStart(2, '0');
      });
      value = rgb;
    }
    else value = null;
    picker.value = value;
    picker.on('change', this.onPickerChange, this);
  }
  /**
   * 下拉颜色组件值变化时执行的方法。 @priv
   * @return {String} value 颜色值。
   */
  onPickerChange(value) {
    this.value = value;
  }
  /**
   * 下拉组件收缩时执行的方法。 @priv
   */
  onCollapse() {
    this.picker$.un('change', this.onPickerChange);
  }
}
/**
 * 选择器，用于通过选择下拉列表项的方式来输入数据。
 * 选择器的相关示例见：{#%select.xwl|ide?openModule=example/comps/select.xwl}
 * @icon combo
 */
Cls['Wb.Select'] = class select extends Wb.Picker {
  static configs = {
    triggerIcon: 'down2',
    pickerMaxHeight: '22em',
    showMask: false
  };
  //itemTpl需要先处理，如先于data属性, data先于valueIndex
  static firstNames = ['itemTpl', 'data'];
  static protos = {
    /** @property {String} - 选择器的显示字段名称。默认为"text"。*/
    textField: 'text',
    /** @property {String} - 下拉条目副文本字段名称。默认为"subtext"。 */
    subtextField: 'subtext',
    /** @property {Boolean} useTag 选择条目后是否生成标签。默认当{#multiSelect}为true时，值为true。 */
    /** @property {Number/String} - 当使用{#useTag}标签时，标签区域最大宽度。默认为自动。 */
    tagWidth: 'max(calc(100% - 15em), 60%)',
    /** @property {String} - 当使用{#useTag}生成标签时，已选择条目标签的提示字段名称。默认为"tip"。 */
    tagTipField: 'tip',
    /** @property {Enum} - 是否自动加载远程数据：
     * -'all': 自动加载，将自动设置{#loadOnce}和{#showMask}为true。并且如果已经设置值将自动更新显示值。
     * -true: 自动加载，将自动设置{#loadOnce}和{#showMask}为true。
     * -false: 不自动加载。
     */
    autoLoad: false,
    autoExpand: false,
    /** @property {Boolean} - 当设置{#useTag}为true且输入框为空时，下拉展开后是否选择最后一个标签对应的条目。 */
    tagSelectItem: true,
    /** @property {Boolean/Number/String} - 是否允许多选条目。允许多选将自动设置{#useTag}为true。数值和字符串表示
     * 已选条目标签区域所占宽度。true表示50%。 @key */
    multiSelect: false,
    /** @property {Boolean} - 当{#useTag}为true，使用标签时，选择条目后是否保留输入框中的值。 */
    keepValue: false,
    /** @property {Boolean} - 当允许{#multiSelect}多选时，选择的标签按钮是否允许换行。 */
    tagWrap: false,
    matchWidth: true,
    /** @property {Enum} matchMode 本地数据筛选列表内容的模式，筛选的字段列表由{#matchFields}属性指定。默认为"startsWithIC"。\
     * 相关属性请参考{#selectMode}。
     * -'startsWith': 匹配开始部分字符串。
     * -'includes': 匹配任意部分字符串。
     * -'endsWith': 匹配结尾部分字符串。
     * -'equals': 匹配整个字符串。
     * -'startsWithIC': 匹配开始部分字符串并忽略大小写。
     * -'includesIC': 匹配任意部分字符串并忽略大小写。
     * -'endsWithIC': 匹配结尾部分字符串并忽略大小写。
     * -'equalsIC': 匹配整个字符串并忽略大小写。
     */
    /** @property {Enum} selectMode 自动选择下拉条目时，匹配下拉列表内容的模式。默认为同{#matchMode}。
     * -false: 不自动选择。
     * -'startsWith': 匹配开始部分字符串。默认项。
     * -'includes': 匹配任意部分字符串。
     * -'endsWith': 匹配结尾部分字符串。
     * -'equals': 匹配整个字符串。
     * -'startsWithIC': 匹配开始部分字符串并忽略大小写。
     * -'includesIC': 匹配任意部分字符串并忽略大小写。
     * -'endsWithIC': 匹配结尾部分字符串并忽略大小写。
     * -'equalsIC': 匹配整个字符串并忽略大小写。
     */
    /** @property {Mix/String/String[]} matchFields 本地数据筛选列表内容时筛选的字段名称列表，
     * 默认null表示仅显示字段{#textField}。 */
    /** @property {String} - 远程查询下拉列表内容时，传递输入内容作为参数的名称，默认为"query"。 */
    queryName: 'query',
    /** @property {String} - 远程查询下拉列表内容时，传递输入框中的内容作为参数的名称，默认为"queryInput"。 */
    queryInputName: 'queryInput',
    /** @property {Boolean/Number} - 从输入内容到发起查询之间的延迟时间（毫秒）。true表示远程500，本地10。\
     * 0或者false表示不延时。
     */
    queryDelay: true,
    tagSortable$: false
  };
  /** @property {Boolean/Object} treePicker 下拉组件是否为树形。如果为对象表示下拉树的配置对象。 */
  /** @property {Boolean} loadOnce 当通过url远程加载数据时，是否仅加载单次。设置true后加载的数据视为本地数据。 */
  /***/
  init(configs) {
    let me = this, textField = me.textField, multiSelect = me.multiSelect;

    if (multiSelect || me.valueMap)
      me.useTag = true;
    me.data$ ??= [];
    super.init(configs);
    if (me.tagWrap)
      me.wrapEl.cls = 'w-aligns-stretch';
    if (!configs.picker) {
      let treePicker = me.treePicker, cfg = {
        textField, prepareMethod: me.prepareData, prepareScope: me, url: configs.url,
        parentSelect: me, events: {
          itemclick: { fn: me.onItemClick, scope: me },
          beforeload: { fn: me.onBeforeLoad, scope: me },
          success: { fn: me.onLoadSuccess, scope: me },
          failure: { fn: me.onLoadFailure, scope: me }
        }
      };
      if (treePicker) {
        Wb.apply(cfg, {
          cname: 'tree', autoLoad: false, enterEvent: 'itemclick', autoSize: 'height', cls: 'w-select-tree',
          subtextField: me.subtextField, gridLine: false
        });
        if (Wb.isObject(treePicker))
          Wb.apply(cfg, treePicker);
        if (multiSelect) {
          me.on('expand', function () {
            let me = this;
            if (me.treePicker && me.multiSelect)
              me.picker.refresh();
          });
        }
      } else {
        cfg.cname = 'selectView';
      }
      if (multiSelect) {
        cfg.listeners = {
          [Event.tapDownName]: {
            fn() {
              me.lastSelItem = me.picker.selection;
            }, capture: true
          }
        }
      }
      configs.picker = cfg;
    }
  }
  /***/
  ready(configs) {
    let me = this, autoLoad = me.autoLoad;
    super.ready(configs);
    if (me.autoLoad) {
      me.loadOnce = me.showMask = true;
      me.instancePicker().load({
        params: me.params,
        success(a, b, rows) {
          let value = me.inputValue;
          me.data$ = rows;
          if (autoLoad == 'all' && value) {
            let valueField = me.valueField, row;
            row = rows.find(row => row[valueField] == value);
            if (row) {
              me.inputValue = row[me.textField];
            }
          }
        }
      });
    }
  }
  /** @property {String} bindField 绑定的字段名称。当使用{#Wb.getValue}和{#Wb.setValue}获取和设置该控件值时，将自
   * 动生成一个名称为该属性，值为{#valueField}的值，并且该组件返回的值使用{#textField}指定的值。读取和设置多个值时请
   * 参考{#valueMap}属性。 */
  /** @property {Express/Object} valueMap 值的存取定义对象，用于获取和设置组件内的多个值时字段名称映射关系的定义。当
   * 使用{#Wb.getValue}和{#Wb.setValue}获取和设置该控件值时，将自动生成根据该属性定义的多个值。比如设置该属性
   * 为{a: 'f1', b:'f2, c: 'c'}，那么将分别生成"f1", "f2", "c"共3个值，其值分别取自选择条目对象值中的"a", "b", "c"字
   * 段。设置该属性时默认{#useTag}属性为true。另请参考{#bindField}属性。 */
  /**
   * 获取指定对象值中使用{#valueMap}定义的值。当指定data参数，如果组件是单选返回对象值，如果组件是多选返回对象值组成
   * 的数组，无任何有效值时返回null。当未指定data参数时，始终返回对象值。
   * @param {Object} [data] 对象值。缺省表示获取组件值。
   */
  getMappedValue(data) {
    let me = this, map = me.valueMap, value = {}, multiSelect = me.multiSelect, hasValue;

    if (data) {
      if (multiSelect) {
        let object, i = 0;

        value = [];
        while (true) {
          hasValue = false;
          object = {};
          Wb.each(map, (k, v) => {
            object[k] = data[v]?.[i] ?? null;
            if (object[k] != null)
              hasValue = true;
          });
          if (!hasValue)
            break;
          value.push(object);
          i++;
        }
        return value.length ? value : null;
      } else {
        value = {};
        Wb.each(map, (k, v) => {
          value[k] = data[v] ?? null;
          if (value[k] != null)
            hasValue = true;
        });
        return hasValue ? value : null;
      }
    } else {
      value = {};
      data = me.value;
      Wb.each(map, (k, v) => {
        value[v] = (multiSelect ? data?.pluck(k) : data?.[k]) ?? null;
      });
      return value;
    }
  }
  /** @property {String} - 下拉列表数据源url。 @key */
  set url(value) {
    this.picker.url = value;
  }
  /***/
  get url() {
    return this.picker.url;
  }
  /**
   * @event beforeload 发起远程数据请求之前的事件，返回false将取消请求。可以通过该事件传递参数。
   * @param {Object} configs 加载的选项对象。
   * @param {Object} params 请求时提交的参数对象。该参数对象中设置的同名参数优先级高于{#params}指定的参数。
   */
  /** 
   * @event loadsuccess 远程列表数据加载成功后的事件。
   * @param {Wb.SelectView} parent 加载成功后添加子组件到该容器中。
   * @param {Wb.ViewItem[]} items 添加的子组件列表。
   * @param {Object} response 返回的值对象。
   * @param {XMLHttpRequest} xhr ajax请求对象。
   * @param {Event} e 事件对象。
   */
  /** 
   * @event loadfailure 远程列表数据加载失败后的事件。
   * @param {Wb.SelectView} parent 加载成功后添加子组件到该容器中。
   * @param {Wb.ViewItem[]} items 添加的子组件列表。当请求失败时该值始终为null。
   * @param {Object} response 返回的值对象。
   * @param {XMLHttpRequest} xhr ajax请求对象。
   * @param {Event} e 事件对象。
   */
  /**
   * 列表数据加载前执行的方法。 @priv
   */
  onBeforeLoad(...args) {
    return this.fireEvent('beforeload', ...args);
  }
  /**
   * 列表数据加载成功后执行的方法。 @priv
   */
  onLoadSuccess(...args) {
    this.fireEvent('loadsuccess', ...args);
  }
  /**
   * 列表数据加载成功后执行的方法。 @priv
   */
  onLoadFailure(...args) {
    this.fireEvent('loadfailure', ...args);
  }
  /***/
  canFireChange() {
    return !this.useTag;
  }
  /** @property {Array} - 当前控件完整的列表数据。远程模式同下拉列表数据，本地模式同{#data}。非树形列表有效。 @priv */
  get listData() {
    let me = this;
    return me.picker$.url && !me.loadOnce ? (me.picker$.data ?? []) : me.data$;
  }
  /**
   * 判断下拉列表的显示值列表是否包含指定的显示值。
   * @param {String} text 检查的显示值。
   * @return {Boolean} true在列表中，false不在列表中。
   */
  inList(text) {
    let me = this, field = me.textField;

    if (me.treePicker)
      return me.picker.down(item => item.data[field] == text);
    else
      return me.listData.find(item => item[field] == text);
  }
  /** @property {String} - 键名称，用于指定下拉列表数据源来自指定名称的键值列表。请注意，由于键值数据通过远程的方式
   * 动态加载，因此首次设置值是须同时指定键和值的数据，比如设置键名称为"gender"时，设置{#value}为[1, '男]。 @key */
  set keyName(value) {
    let me = this;

    if (me.keyName$ !== value) {
      me.keyName$ = value;
      me.matchMode ??= 'includesIC';
      me.matchFields ??= [0, 1]
      me.forceSelect ??= true;
      me.loadOnce ??= true;
      me.url = value ? ('get-kv?type=list&name=' + value) : null;
    }
  }
  /***/
  get keyName() {
    return this.keyName$;
  }
  /***/
  onKeyDown(e, options) {
    let me = this, keyCode = e.code, enterKey = e.isGoKey, expanded = me.expanded$, picker = me.picker$;

    //多选时全选
    if (me.multiSelect && e.ctrlMeta && expanded && e.code == Keys.A) {
      let oldValue = me.value, sel = !e.shiftKey;

      picker.cascade(item => me.handleSelect(item, e, sel));
      me.alignPicker();
      me.fireEvent('change', me.value, oldValue);
      me.fireEvent('action');
      e.stopEvent();
      return;
    }
    //避免按回车和ESC后再弹出下拉
    if (enterKey || keyCode == Keys.Esc)
      me.query.cancelDelay(me);
    //如果picker展开且无条目选择按回车键时收起picker并触发trigger
    if (enterKey && expanded && !picker.selection && me.enterTriggerClick) {
      me.collapse();
      me.onTriggerClick(e);
      e.stopEvent();
      return;
    }
    super.onKeyDown(e, options);
    if ((e.ctrlMeta || me.arrowDownExpand) && keyCode == Keys.Down && !expanded) {
      //展开列表
      me.query();
      e.stopEvent();
    }
  }
  /**
   * @event action 执行动作时触发。包括点击触发器按钮，清除按钮和选择条目时触发。设置该事件后点击触发器按钮将不会执行展开操作。
   */
  /***/
  onTriggerClick(e) {
    let me = this;

    super.onTriggerClick(e);
    if (me.trigger?.visible) {
      if (me.events?.action) {
        me.collapse();
        me.fireEvent('action');
      } else {
        if (me.expanded$)
          me.collapse();
        else
          me.query();
      }
    }
  }
  /** @property {Object} rawValue 控件的原值。当获取{#value}时，该值优先被获取。 @priv */
  /**
   * 控件输入时执行的方法。 @priv
   */
  onInput() {
    let me = this, delay = me.queryDelay, picker = me.picker$;

    me.rawValue = undefined;
    me.inputChanged = true;
    super.onInput();
    if (delay === true)
      delay = picker.url && (!me.loadOnce || !picker.loaded) ? 500 : 10;
    if (delay)
      me.query.delay(me, delay, me.inputValue);
    else
      me.query(me.inputValue);
  }
  /** @property {Boolean} inputChanged 从最后一次设置值后输入值是否改变。 @priv */
  /** @property {Boolean} forceSelect 是否强制选择下拉项中的值，设置后如果值改变且未选择下拉项中的值，将提示值非法。 @key */
  /***/
  extraVerify(value, basicErrors) {
    let me = this;
    super.extraVerify(value, basicErrors);
    if (!Wb.isEmpty(value) && me.forceSelect && me.inputChanged && !me.rawValue && !me.inList(value)) {
      basicErrors.add(Str.invalidValue.format(value));
    }
  }
  /** @property {Object} params 远程查询时的参数对象。可在{#*beforequery}事件中动态设置该参数。 */
  /**
   * @event beforequery 在查询下拉数据之前触发。返回false将阻止默认的查询。
   * Example:
   *
   *     //在beforequery事件中自定义本地查询数据
   *     this.params = {abc: 123}; //远程查询时设置参数
   *     this.data = [{ text: 'item1' }, { text: 'item2' }]; //动态设置下拉数据
   *     this.localQuery(); //查询本地全部数据
   *     return false; //阻止默认的查询
   * 
   * @param {String} value 查询的值。
   */
  /**
   * 对本地或远程数据下拉列表进行查询，并自动选择最匹配的下拉项。详情请参考{#localQuery}和{#remoteQuery}方法。
   * 对于{#Wb.Select}组件，调用{#expand}方法仅展开下拉列表，并不会自动加载数据，因此如果要加载数据并展开下拉
   * 列表请使用该方法。
   * @param {String} [value] 查找的值。如果找到列表则显示下拉组件，否则收起下拉组件。如果值为空值，
   * 将收起下拉组件。如果值为null，将查找全部并展开下拉组件。
   */
  query(value) {
    if (this.fireEvent('beforequery', value) !== false) {
      if (this.url)
        this.remoteQuery(value);
      else
        this.localQuery(value);
    }
  }
  /**
   * 对本地数据下拉列表按指定模式{#matchMode}和指定字段{#matchFields}进行查询，并自动选择最匹配的下拉项。
   * @param {String} [value] 查找的值。如果找到列表则显示下拉组件，否则收起下拉组件。如果值为空值，将直接
   * 收起下拉组件。如果值为null，将查找全部并展开下拉组件。
   */
  localQuery(value) {
    let me = this, picker = me.instancePicker(), treePicker = me.treePicker;

    if (value) {
      let matchFields = Wb.toArray(me.matchFields ?? [me.textField]), matchMode = me.matchMode ?? 'startsWithIC',
        filterFn = item => {
          return matchFields.some(field => {
            let val = treePicker ? item.data[field] : item[field];
            return val != null && String(val)[matchMode](value);
          });
        };
      if (treePicker) {
        me.expanded = !!picker.down(filterFn);
      } else {
        picker.data = me.data$.filter(filterFn);
        me.expanded = picker.hasChild;
      }
    } else if (value === '') {
      me.collapse();
    } else {
      if (!treePicker)
        picker.data = me.data$;
      me.expanded = picker.hasChild;
    }
    me.selectItem();
  }
  /** @property {Date} lastQueryTime 最后一次执行远程查询的时间。 @priv */
  /**
   * 对远程数据下拉列表进行查询，查询时将传递名称为{#queryName}和{#queryInputName}指定的参数，并自动选择匹配的下拉项。
   * @param {String} [value] 查找的值。如果找到列表则显示下拉组件，否则收起下拉组件。如果值为空值，将直接收起下拉组件。\
   * 如果值为null，将查找全部并展开下拉组件。
   */
  remoteQuery(value) {
    let me = this, picker = me.instancePicker();

    if (me.loadOnce && picker.loaded) {
      //加载单次且已经加载的执行本地查询
      me.localQuery(value);
    } else {
      if (value === '') {
        me.collapse();
      } else {
        let queryTime = new Date();
        if (me.treePicker && me.lastQueryValue === value && picker.hasChild) {
          me.expand();
          me.selectItem();
          return;
        } else {
          me.lastQueryValue = value;
        }
        picker.load({
          params: Wb.apply({ [me.queryName]: value, [me.queryInputName]: me.inputValue }, me.params),
          success(a, b, rows) {
            if (queryTime < me.lastQueryTime)
              return;
            if (me.loadOnce) {
              if (!me.treePicker)
                me.data$ = picker.data;
              me.localQuery(value);
            } else {
              me.expanded = picker.hasChild;
              me.selectItem();
            }
            if (value)
              me.verify();
            me.lastQueryTime = queryTime;
          }
        });
      }
    }
  }
  /**
   * 保存当前输入的内容至下拉列表条目。如果已经存在相同内容的条目，将移动该条目至目标位置。
   * @param {Boolean} [toLast] 是否保存到最后条目。false保存到首个条目，true保存到最后一个条目。
   */
  saveInput(toLast) {
    let me = this, value = me.value;

    if (Wb.isEmpty(value))
      return;
    let data = me.data, fieldName = this.textField, item;
    data.removeBy(item => item[fieldName] == value);
    item = { [fieldName]: value };
    if (toLast)
      data.push(item);
    else
      data.insert(0, item);
    this.refresh();
  }
  /** @property {Boolean/Object} - 加载过程中是否显示正在加载中的遮盖动画提示。默认为false。详见{#Wb.mask}说明。 */
  set showMask(value) {
    this.picker$.showMask = value;
  }
  /***/
  get showMask() {
    return this.picker$.showMask;
  }
  /**
   * 根据输入框中输入的内容和由{#matchFields}指定的查找字段，选择下拉组件中对应的条目。 @priv
   */
  selectItem() {
    let me = this, selectMode = me.selectMode ?? me.matchMode ?? 'startsWithIC';
    if (!selectMode || !me.expanded$)
      return;
    let found, picker = me.picker$, rawValue = me.rawValue;

    if (rawValue) {
      let valueField = me.valueField;
      // attempt to select item that has the value
      found = picker.down(item => item.data[valueField] == rawValue);
    } else {
      let value, inputValue = me.inputValue, matchFields = Wb.toArray(me.matchFields ?? [me.textField]), isObject;

      if (!inputValue && me.useTag && me.tagSelectItem) {
        value = me.value;
        if (Wb.isEmpty(value))
          value = null;
        else if (Wb.isArray(value))
          value = value.lastItem;
        selectMode = 'equals';
        isObject = true;
      } else {
        value = inputValue;
        isObject = false;
      }
      if (value) {
        matchFields.each(field => {
          found = picker.down(item => String(item.data[field])[selectMode](isObject ? value[field] : value));
          if (found)
            return false;
        });
      }
    }
    me.alignPicker();
    if (found && !found.disabled)
      found.selectNoFocus();
  }
  /**
   * @event select 选择下拉列表条目时触发。无论值是否变化，选择条目时均会触发该事件。另请参见{#*change}事件。 @key
   * @param {Object} data 选择的条目数据。
   * @param {Wb.ViewItem} item 选择的条目。
   * @param {Event} e 事件对象。
   */
  /**
   * @event beforeselect 选择下拉列表条目前触发。返回false可阻止被选择。
   * @param {Object} data 选择的条目数据。
   * @param {Wb.ViewItem} item 选择的条目。
   * @param {Event} e 事件对象。
   */
  /**
   * 下拉列表项被点击时执行的方法。 @priv
   * @param {Wb.ViewItem} item 点击条目。
   * @param {Event} e 事件对象。
   */
  onItemClick(item, e) {
    let me = this, picker = me.picker$, lastSelItem;

    if (me.multiSelect && e.shiftKey && (lastSelItem = me.lastSelItem || picker.firstItem) != item) {
      let oldValue = me.value, items = picker.slice(lastSelItem, item);

      items.forEach(item => me.handleSelect(item, e, !e.ctrlMeta));
      me.alignPicker();
      me.fireEvent('change', me.value, oldValue);
      me.fireEvent('action');
    } else if (!e.ctrlMeta) {
      me.handleSelect(item, e);
    }
  }
  /**
   * 处理选择操作。 @priv
   * @param {Wb.ViewItem} item 条目。
   * @param {Event} e 事件对象。
   * @param {Boolean} [batchSelect] 是否批量选择，true为全选，false为全不选。默认null不作批量处理。
   */
  handleSelect(item, e, batchSelect) {
    let me = this, data = item.data;

    if (me.fireEvent('beforeselect', data, item, e) !== false) {
      let hasBatch = batchSelect != null;
      if (me.useTag) {
        let valueField = me.valueField, value = data[valueField], foundItem, oldValue, single = !me.multiSelect;
        foundItem = me.tagCt?.find(tag => tag.itemData[valueField] === value);
        if (single) {
          me.collapse();
          if (foundItem)
            return;
        }
        me.rawValue = undefined;
        if (!hasBatch)
          oldValue = me.value;
        if (single)
          me.tagCt?.destroyAll();
        if (hasBatch) {
          if (batchSelect) {
            !foundItem && me.addItemTag(data);
          } else {
            foundItem && me.destroyItemTag(foundItem);
          }
        } else {
          if (foundItem) {
            me.destroyItemTag(foundItem);
          } else {
            me.addItemTag(data);
          }
        }
        item.refresh();
        if (!hasBatch) {
          me.alignPicker();
          me.fireEvent('change', me.value, oldValue);
        }
        if (!me.keepValue) {
          me.inputValue = '';
          me.clearError();
        }
        me.focus();
      } else {
        me.rawValue = data[me.valueField];
        super.value = data[me.textField];
        me.collapse();
        me.focus();
      }
      me.fireEvent('select', data, item, e);
      if (!hasBatch)
        me.fireEvent('action');
    }
  }
  /** @property {String} - 选择器的值字段名称。默认为自动。 */
  set valueField(value) {
    this.valueField$ = value;
  }
  /***/
  get valueField() {
    return this.valueField$ || this.textField;
  }
  /***/
  canShowClear() {
    return this.inputValue || this.tagCt?.firstItem;
  }
  /** @property {Boolean} - 条目标签是否可以拖动以调整顺序。 */
  set tagSortable(value) {
    let me = this;

    if (me.tagSortable$ !== value) {
      me.tagSortable$ = value;
      me.tagCt?.setter('itemsSortable', value);
    }
  }
  /***/
  get tagSortable() {
    return this.tagSortable$;
  }
  /**
   * 添加指定条目数据到已经选择条目标签按钮容器。 @priv
   * @param {Object} itemData 条目数据。
   */
  addItemTag(itemData) {
    let me = this, configs, subtext, tip = me.tagTipField;

    if (!me.tagCt) {
      let tagWidth = me.tagWidth, configs = {
        owner: me, bodyCls: 'w-fixed-bgcolor', itemsSortable: me.tagSortable,
        el: me.wrapEl.insertElBefore(null, null, me.inputEl),
        maxWidth: Wb.px(tagWidth),
        events: {
          add() {
            me.verify();
          },
          remove() {
            me.verify();
          }
        }
      };
      if (me.tagWrap) {
        Wb.apply(configs, { autoScroll: true, cname: 'container', cls: 'w-tag-ct w-row w-wrap' });
      } else {
        Wb.apply(configs, { cname: 'scrolledCt', cls: 'w-tag-ct' });
      }
      me.tagCt = Wb.create(configs);
    }
    subtext = itemData[me.subtextField];
    configs = {
      cname: 'tagButton', text: itemData[me.textField] + (subtext ? (' (' + subtext + ')') : ''), itemData, events: {
        closeclick() {
          let oldValue = me.value;
          me.destroyItemTag(this);
          me.fireEvent('change', me.value, oldValue)
        }
      }
    };
    tip = itemData[tip];
    if (tip)
      configs.tip = tip;
    me.tagCt.add(configs);
    me.updateClearButton();
  }
  /**
   * 销毁指定的条目标签。 @priv
   * @param {Wb.TagButton/Boolean} tag 标签。true表示全部。
   */
  destroyItemTag(tag) {
    let me = this, tagCt = me.tagCt;

    if (tagCt) {
      if (tag === true)
        tagCt.destroyAll();
      else
        tag.destroy();
      if (!tagCt.hasChild) {
        tagCt.destroy();
        me.tagCt = null;
        me.updateClearButton();
      }
    }
  }
  /** @property {HtmlString/Wb.Template/Function} - 下拉列表条目内容的模板，模板请参考{#Wb.Template}。 @key */
  set itemTpl(value) {
    this.picker$.itemTpl = value;
  }
  /** @property {Wb.Template} */
  get itemTpl() {
    return this.picker$.itemTpl;
  }
  /** @property {Function} - 视图条目模板函数。同{#itemTpl}属性。
   * @param {Object} data 模板数据。
   * @param {Element} [el] 条目元素。
   */
  set itemTplFn(value) {
    this.itemTpl = value;
  }
  /** @property {Wb.Template} */
  get itemTplFn() {
    return this.itemTpl;
  }
  /** @property {Array} - 下拉列表本地数据。 @key */
  set data(data) {
    let me = this;
    me.picker$.data = me.data$ = me.prepareData(data);
  }
  /***/
  get data() {
    return this.data$;
  }
  /**
   * 处理数据，把数据转换为合法的格式，并根据数据自动设置{#textField}和{#valueField}值。 @priv
   * @param {Array} data 数据。
   * @return {Array} 处理后的数据。
   */
  prepareData(data) {
    data ??= [];
    if (Wb.isArray(data)) {
      let firstItem, me = this;
      firstItem = data[0] ?? '';
      if (!Wb.isObject(firstItem)) {
        if (Wb.isArray(firstItem)) {
          if (me.textField == 'text')
            me.picker.textField = me.textField = 0;
        } else {
          let oldData = data;
          data = [];
          oldData.forEach(item => {
            data.push({ text: item });
          });
        }
      }
      if (!me.valueField$) {
        if (Wb.isArray(firstItem))
          me.valueField$ = firstItem.length > 1 ? 1 : me.textField;
        else
          me.valueField$ = firstItem.value === undefined ? me.textField : 'value';
      }
    }
    return data;
  }
  /**
   * 刷新下拉列表数据。
   */
  refresh() {
    this.data = this.data$;
  }
  /** @property {Mix} - 设置组件的值。设置为null将清空编辑器的值。如果组件为多选，值为包含文本和值的对象组成的数组；如果组件
   * 为使用标签{#useTag}的单选列表，值为包含文本、值和其他字段值的对象；其他可以为值，文本或两者组成的对象或数组。
   * @key
   */
  set value(value) {
    let me = this, valueField = me.valueField, textField = me.textField;

    me.rawValue = undefined;
    me.inputChanged = false;
    if (me.useTag) {
      let oldValue = me.value, newValue;
      me.destroyItemTag(true);
      if (value) {
        Wb.toArray(value).forEach(item => {
          // array means 0: value, 1: text
          if (Wb.isArray(item))
            item = { [valueField]: item[0], [textField]: item[1] };
          me.addItemTag(item);
        });
      }
      super.value = null;
      newValue = me.value;
      me.updateClearButton();
      if (oldValue !== newValue)
        me.fireEvent('change', newValue, oldValue);
    } else {
      if (value != null) {
        if (Wb.isArray(value)) {
          me.rawValue = value[0];
          value = value[1];
        } else if (Wb.isObject(value)) {
          me.rawValue = value[valueField];
          value = value[textField];
        } else {
          let foundItem;
          me.rawValue = value;
          if (me.treePicker)
            foundItem = me.picker.down(item => item.data[valueField] === value)?.data;
          else
            foundItem = me.listData.find(item => item[valueField] === value);
          if (foundItem)
            value = foundItem[me.textField];
        }
      }
      super.value = value;
    }
  }
  /** @property {Mix} - 获取组件的值。如果组件为多选，返回标签按钮的对象值组成的数组；如果组件为使用标签{#useTag}的单选列表，
   * 返回标签按钮的对象值或null；其他如果存在原始值返回原始值，否则查找下拉列表对应条目值，未找到返回编辑框中的值。
   */
  get value() {
    let me = this;

    if (me.useTag) {
      if (me.multiSelect)
        return me.tagCt?.items.pluck('itemData') ?? [];
      else
        return me.tagCt?.firstItem?.itemData ?? null;
    } else {
      return me.rawValue ?? me.getListValue(true);
    }
  }
  /***/
  isEmptyValue() {
    let me = this;
    if (me.useTag)
      return !me.tagCt?.hasChild;
    else
      return super.isEmptyValue();
  }
  /**
   * 获取当前输入的文本对应存在于列表中的值。
   * @param {Boolean} [returnText] 如果未找到列表中对应的值，是否返回输入的文本。true返回文本，false返回null。
   * @return {Object} 值。
   */
  getListValue(returnText) {
    let me = this, value = super.value, textField = me.textField, foundItem;

    if (me.treePicker)
      foundItem = me.picker.down(node => node.data[textField] === value)?.data;
    else
      foundItem = me.listData.find(item => item[textField] === value);
    if (foundItem)
      return foundItem[me.valueField];
    else
      return returnText ? value : null;
  }
  /** @property {Number} - 设置指定索引的下拉条目值作为当前值。如果不存在将设置为空。 */
  set valueIndex(value) {
    let me = this;

    if (me.treePicker)
      value = me.picker.items[value]?.data;
    else
      value = me.listData[value];
    me.value = value?.[me.valueField] ?? '';
  }
  /** @property {Number} - 获取当前值在下拉条目中的索引位置。未找到返回-1。 */
  get valueIndex() {
    let me = this, valueField = me.valueField, value = super.value;

    if (me.treePicker)
      return me.picker.find(item => item.data[valueField] == value)?.itemIndex ?? -1;
    else
      return me.listData?.findIndex(item => item[valueField] == value) ?? -1;
  }
  /** @property {Boolean} - 下拉列表中的条目是否禁止自动换行。 */
  set noWrap(value) {
    this.picker$.setCls(value, 'w-select-nowrap');
  }
  /***/
  get noWrap() {
    return this.picker$.containsCls('w-select-nowrap');
  }
}
/**
 * 颜色列表选择器。
 * @icon brush
 */
Cls['Wb.ColorSelect'] = class colorSelect extends Wb.Select {
  static cls = 'w-colorselect';
  static protos = {
    selectMode: 'equals',
    loadOnce: true,
    defaultButton$: false
  };
  static configs = {
    editable: false,
    pickerMinWidth: '12em',
    triggerIcon: 'color',
    itemTpl: '<div class="w-item" style="background:{text}"></div>',
    data: ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive',
      'purple', 'red', 'silver', 'teal', 'white', 'yellow']
  };
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    me.inputEl.hide();
    me.fitEl = me.wrapEl.insertElBefore('w-fit-el', null, me.inputEl);
    me.noCollapseEl = me.fitEl;
    me.mon(me.fitEl, 'click', f => me.expanded = !me.expanded);
    me.on('change', me.onChange);
  }
  /**
   * 值改变时执行的方法。 @priv
   * @param {String} value 值。
   */
  onChange(value) {
    this.wrapEl.setStyle('background', value);
  }
  /** @property {Boolean} - 是否在底部添加默认颜色条目。 */
  set defaultButton(value) {
    let me = this;

    if (me.defaultButton$ !== value) {
      me.defaultButton$ = value;
      if (value) {
        if (!me.defaultBtn) {
          me.defaultBtn = me.picker.addFooter({
            cname: 'button', text: Str.default, margin: '.2em', handler() {
              me.value = 'default';
              me.fireEvent('select', { text: 'default', value: 'default' });
              me.collapse();
            }
          });
        }
      } else {
        me.defaultBtn?.destroy();
        me.defaultBtn = null;
      }
    }
  }
  /***/
  get defaultButton() {
    return this.defaultButton$;
  }
}
/**
 * 布尔值选择器。该组件同{#Wb.Check}和{#Wb.Toggle}的区别为能设置和返回空值。
 * @icon check8
 */
Cls['Wb.BoolSelect'] = class boolSelect extends Wb.Select {
  static protos = {
    /** @property {Enum} - 获取值时返回的值类型：
     * -'int': 整数值，为0或1。
     * -'string': 字符值，为"false"或"true"。
     * -'bool': 布尔值。默认值。
     */
    returnType: 'bool'
  };
  static configs = {
    forceSelect: true
  }
  /***/
  init(configs) {
    super.init(configs);
    configs.data ??= [{ text: 'true', value: true }, { text: 'false', value: false }];
  }
  /** @property {Boolean/Object} - 组件值。设置值时非空值将自动转换为布尔值。 @key */
  set value(value) {
    if (value != null)
      value = Wb.parseBool(value);
    super.value = value;
  }
  /***/
  get value() {
    let value = super.value;
    if (Wb.isEmpty(value))
      return null;
    switch (this.returnType) {
      case 'int':
        return value ? 1 : 0;
      case 'string':
        return value ? 'true' : 'false';
      default:
        return value;
    }
  }
}
/**
 * 显示组件，用于显示内容。默认带边框，内间距和自动滚动。
 * @icon desktop
 */
Cls['Wb.Viewer'] = class viewer extends Wb.Component {
  static cls = 'w-viewer';
}
/**
 * 容器类，容器类组件可以添加一个或多个下级组件，并可对下级组件设置不同形式的布局。
 * 容器类的相关示例见：{#%container.xwl|ide?openModule=example/comps/container.xwl}
 * @icon container
 */
Cls['Wb.Container'] = class container extends Wb.Component {
  //defaults先于items处理
  static firstNames = ['defaults', 'items'];
  /**
   * @event keydown 键按下时触发。
   * @param {Event} e 事件对象。
   */
  /**
   * @event keyup 键释放时触发。
   * @param {Event} e 事件对象。
   */
  static events = { keydown: true, keyup: true };
  static protos = {
    /** @property {Boolean} - 添加下级组件时是否复制app。 @priv */
    copyApp: true,
    shrink$: null,
    tableStyle$: false,
    itemsSortable$: false,
    flexWrap$: false,
    labelUp$: false
  }
  /**
   * @event add 当组件添加下级组件时触发。
   * @param {Wb.Component} child 添加的下级组件。
   * @param {Number} position 添加的位置索引。
   */

  /** @event beforeremove 当前组件的直接下级组件被移除前触发。
   * @param {Wb.Component} child 下级组件。
   */

  /** @event remove 当前组件的直接下级组件被移除后触发。移除操作请参考{#remove}方法说明。
   * @param {Wb.Component} child 下级组件。
   * @param {Number} position 移除的位置索引。
   */

  /** 
   * @event buttonclick 容器中的直接下级按钮点击时触发。
   * @param {Wb.Button} button 按钮。
   * @param {Event} e 事件对象。
   */

  /** 
   * @event buttontoggle 容器中的直接下级按钮切换状态时触发。
   * @param {Wb.Button} button 按钮。
   * @param {Boolean} active 按钮是否被激活。
   */

  /** @property {Element} bodyEl 组件的结构体元素，所有的下级元素都添加到该元素下面。默认为{#el}。 @readonly */

  /***/
  init(configs) {
    super.init(configs);
    this.items$ = [];
    this.bodyEl ??= this.el;
  }
  /** @property {Boolean} autoContextMenu 是否自动获取"tbar"工具条中的按钮作为上下文菜单。 */
  /***/
  ready(configs) {
    let me = this;
    super.ready(configs);
    if (me.autoContextMenu) {
      let btns = [];
      me.tbar?.forEach(bar => {
        if (btns.lastItem)
          btns.push(null);
        bar.each(btn => {
          if (btn instanceof Wb.Button)
            btns.push(btn);
          else if (btn instanceof Wb.Divider || btn instanceof Wb.Space || btn instanceof Wb.Fill) {
            if (btns.lastItem)
              btns.push(null);
          }
        });
      });
      if (!btns.lastItem)
        btns.pop();
      me.contextMenu = Wb.createMenu(btns);
    }
  }
  /** @property {Enum} - 是否使用表格样式来显示所有下级组件。通常配合grid布局使用。
   * -true: 表格样式
   * -false: 普通样式
   * -'simple': 简单表格样式
   * @design */
  set tableStyle(value) {
    let me = this, oldValue = me.tableStyle$;
    if (oldValue !== value) {
      let bodyEl = me.bodyEl;
      me.tableStyle$ = value;
      if (oldValue == 'simple')
        bodyEl.removeCls('w-table-simple');
      bodyEl.setCls(!!value, 'w-table-style');
      if (value == 'simple')
        bodyEl.cls = 'w-table-simple';
    }
  }
  /***/
  get tableStyle() {
    return this.tableStyle$;
  }
  /** @property {Boolean} - 容器下的直接控件的标签是否显示在上面。false显示在左侧，true显示在上面。 @design */
  set labelUp(value) {
    this.applyCls(value, 'labelUp', 'w-clabel-up', this.bodyEl);
  }
  /***/
  get labelUp() {
    return this.labelUp$;
  }
  /** @property {Enum} - 容器下的直接控件标签对齐方式。
   * -'left': 左对齐
   * -'center': 居中
   * -'right': 右对齐
   * @design
   */
  set labelAlign(value) {
    this.applyCls(value, 'labelAlign', 'w-cla-', this.bodyEl);
  }
  /***/
  get labelAlign() {
    return this.labelAlign$;
  }
  /**
   * @event beforesort 通过拖动调整容器内组件顺序前触发。返回false可阻止拖动。
   * @param {Wb.Button} dragComp 拖动的组件。
   * @param {Wb.Draggable} draggable 拖动对象。
   * @param {Event} e 事件对象。
   */
  /**
   * @event sort 通过拖动调整容器内组件顺序后触发。
   * @param {Wb.Button} dragComp 拖动的按组件。
   * @param {Wb.Button} refComp 拖动到该组件前。null表示最后。
   */
  /**
   * @event sorting 通过拖动调整容器内组件顺序时触发。返回false可阻止拖动组件放下。
   * @param {Wb.Button} dragComp 拖动的组件。
   * @param {Wb.Button} refComp 拖动到该组件前。null表示最后。
   */
  /** @property {Boolean} verticalSort 容器内组件调整顺序时是否仅允许垂直方向。false仅水平方向，true仅垂直方向，
   * null所有方向。允许容器内组件调整顺序请参考{#itemsSortable}。
   */
  /** @property {Boolean} - 是否可以通过拖动的方式来调整容器内组件的顺序。 */
  set itemsSortable(value) {
    let me = this;
    if (me.itemsSortable$ !== value) {
      me.itemsSortable$ = value;
      if (value) {
        me.draggable = {
          hideTarget: true, constrainEl: me.bodyEl,
          events: {
            drag(data, e) {
              const offset = 3;
              let dragComp = data.dragComp, dragEl = data.dragEl, dragRect = dragEl.getRect(), refComp,
                dx = dragRect.x, dy = dragRect.y, dr = dragRect.right, db = dragRect.bottom, pt = [e.x, e.y],
                allPt = [];

              if (Wb.Math.pointInRect(pt, dragRect))
                allPt.push(pt);
              allPt.push([dx + offset, dy + offset], [dr - offset, dy + offset],
                [dr - offset, db - offset], [dx + offset, db - offset]);
              allPt.find(item => refComp = me.findChildByEl(Wb.findEl(item[0], item[1])));
              if (!refComp) {
                let lastRect = me.lastItem?.el.getRect(), firstRect = me.firstItem?.el.getRect();
                if (lastRect && dx >= (lastRect.x + lastRect.width / 2) && db >= (lastRect.y + lastRect.height / 2))
                  refComp = me.lastItem;
                else if (firstRect && dr <= (firstRect.x + firstRect.width / 2) && dy <= (firstRect.y + firstRect.height / 2))
                  refComp = me.firstItem;
              }
              if (refComp?.el?.parentNode != me.bodyEl)
                refComp = null;
              if (refComp) {
                if (me.fireEvent('sorting', dragComp, refComp) === false)
                  return;
                let refRect, compRect, refC, dIndex, rIndex, ds, de;

                refRect = refComp.el.getRect();
                compRect = dragComp.el.getRect();
                dIndex = dragComp.itemIndex;
                rIndex = refComp.itemIndex;
                if (refRect.y >= compRect.bottom - 1 || refRect.bottom <= compRect.y + 1) {
                  //vertical drag
                  refC = refRect.y + (refRect.height / 2);
                  ds = dy;
                  de = db;
                } else {
                  refC = refRect.x + (refRect.width / 2);
                  ds = dx;
                  de = dr;
                }
                if (dIndex < rIndex && de > refC + offset || dIndex > rIndex && ds < refC - offset) {
                  if (dIndex < rIndex)
                    refComp = refComp.nextSibling;
                  if (refComp != dragComp && refComp != dragComp.nextSibling) {
                    me.suspendEvent();
                    data.refComp = refComp;
                    me.insertBefore(dragComp, refComp);
                    me.resumeEvent();
                  }
                }
              }
            },
            beforedrag(data, e) {
              let comp = me.findChildByEl(e.target);
              if (me.fireEvent('beforesort', comp, data, e) === false)
                return false;
              if (comp) {
                let vertical = me.verticalSort;

                data.refComp = false;
                data.dragComp = comp;
                data.targetEl = comp.el;
                if (vertical != null) {
                  data.moveX = !vertical;
                  data.moveY = vertical;
                }
              } else
                return false;
            },
            enddrag(data) {
              if (data.refComp !== false)
                me.fireEvent('sort', data.dragComp, data.refComp);
            }
          }
        }
      } else {
        me.draggable = false;
      }
    }
  }
  /***/
  get itemsSortable() {
    return this.itemsSortable$;
  }
  /** @property {Object} - 直接下级组件默认增量属性。如需清除该属性值，清使用{#clearDefaults}方法。 */
  set defaults(value) {
    if (value) {
      if (this.defaults$)
        Wb.apply(this.defaults$, value);
      else
        this.defaults$ = Wb.copy(value);
    }
  }
  /** @property {Object} - 直接下级组件默认属性。 */
  get defaults() {
    return this.defaults$;
  }
  /**
   * 清除容器的直接下级组件默认属性。
   */
  clearDefaults() {
    this.defaults$ = undefined;
  }
  /**
   * 删除所有下级组件并添加新的下级组件。
   * @param {Object/Wb.Component/Array} items 下级组件配置对象、实例或其组成的数组。
   */
  setItems(items) {
    this.destroyAll();
    return this.add(items);
  }
  /** @property {Object/Wb.Component/Array} - 设置下级组件配置对象、实例或其组成的数组。 @code */
  set items(items) {
    this.setItems(items);
  }
  /** @property {Wb.Component[]} - 获取容器的直接下级组件实例组成的数组。 */
  get items() {
    return this.items$;
  }
  /**
   * 判断容器是否包含某个直接的下级组件。另请参考{#has}和{#hasSub}方法。
   * @param {Wb.Component} [comp] 判断的组件。缺省表示任意组件。
   * @return {Boolean} true包含，false不包含。
   */
  hasItem(comp) {
    return comp?.parent == this && !comp.owner;
  }
  /** @property {Boolean} - 组件是否包含直接的下级组件。另请参考{#has}, {#hasSub}, {#hasItem}方法 */
  get hasChild() {
    return !!this.items$?.length;
  }
  /**
   * 判断当前组件是否包含某个直接的下级组件或子组件。另请参考{#hasItem}和{#hasSub}方法。
   * @param {Wb.Component} [comp] 判断的组件。缺省表示任意组件。
   * @return {Boolean} true包含，false不包含。
   */
  has(comp) {
    return this.hasItem(comp) || this.hasSub(comp);
  }
  /** @property {Wb.Component[]} - 获取容器的所有下级组件实例组成的数组。 */
  get allItems() {
    return this.downAllBy(f => true);
  }
  /** 
   * @property {Enum} - 组件{#bodyEl}的预定义布局名称，用于指定其下级组件的排列方式，多个布局名称使用空格
   * 分隔。元素的布局名称通常为其指定的样式名称。
   * -'fit': 下级组件填满容器。
   * -'row': 弹性行。
   * -'column': 弹性列。
   * -'center': 下级组件水平垂直居中布局。当下级组件溢出时将裁剪组件使其中心同容器中心始终保持对齐。
   * -'vcenter': 居中布局。同"center"的区别为flex-direction为column。
   * -'form': 自动表单，下级组件按组件原始宽度自动水平平铺。
   * -'form1': 表单1列。该布局同grid1的区别为可以纵向弹性伸缩。
   * -'grid': 自动网格，下级组件按指定宽度自动水平平铺并对齐到网格。
   * -'grid1': 网格1列。
   * -'grid2': 网格2列。
   * -'grid3': 网格3列。
   * -'grid4': 网格4列。
   * -'grid5': 网格5列。
   * -'grid6': 网格6列。
   * -'grid7': 网格7列。
   * -'grid8': 网格8列。
   * -'grid9': 网格9列。
   * -'grid10': 网格10列。
   * -'grid11': 网格11列。
   * -'grid12': 网格12列。
   * -'grid13': 网格13列。
   * -'grid14': 网格14列。
   * -'grid15': 网格15列。
   * -'grid16': 网格16列。
   * -'grid17': 网格17列。
   * -'grid18': 网格18列。
   * -'grid19': 网格19列。
   * -'grid20': 网格20列。
   * -'form-compact': 紧凑样式自动表单，下级组件按组件原始宽度自动水平平铺。
   * -'grid-compact': 紧凑样式自动网络，下级组件按指定宽度自动水平平铺并对齐到网格。
   * -'middle': 下级组件水平垂直居中布局。当下级组件溢出时不裁剪组件，此时其中心同容器中心将不对齐。
   * -'hmiddle': 下级组件水平居中布局。当下级组件溢出时不裁剪组件，此时其中心同容器中心将不水平对齐。
   * -'vmiddle': 下级组件垂直居中布局。当下级组件溢出时不裁剪组件，此时其中心同容器中心将不垂直对齐。
   * @design
   * @key
   */
  set layout(layout) {
    this.bodyEl.layout = layout;
  }
  /***/
  get layout() {
    return this.bodyEl.layout$;
  }
  /** @property {Enum/Boolean} - 当{#layout}使用网格布局时是否根据窗口大小动态调整为单列网格。
   * -true: 当窗口小于指定宽度时使用单列网格，否则恢复为指定列数的网格布局。
   * -false: 恢复为默认的网格布局。
   * -'up': 具有 true 值的效果的同时且强制将标签显示在控件上面。
   */
  set autoGrid(value) {
    let me = this, oldValue = me.autoGrid$, bodyEl = me.bodyEl;

    if (oldValue !== value) {
      me.autoGrid$ = value;
      if (oldValue)
        bodyEl.removeCls('w-autogrid-' + oldValue);
      if (value)
        bodyEl.addCls('w-autogrid-' + value);
    }
  }
  /***/
  get autoGrid() {
    return this.autoGrid$;
  }
  /** @property {Boolean/Number/String} - 下级组件之间是否添加间隙。true显式增加默认大小间隙，false显式去掉
   * 间隙。数值或字符表示间隙大小。默认为null表示不设置间隙。 @design */
  set gap(value) {
    let me = this;

    if (me.gap$ !== value) {
      me.gap$ = value;
      me.bodyEl.setStyle('gap', Wb.px(value));
    }
  }
  /***/
  get gap() {
    return this.gap$;
  }
  /** @property {Boolean} - 下级组件是否设置加宽的标签宽度。false普通宽度，true宽度加宽。 @design */
  set wideLabel(value) {
    this.applyCls(value, 'wideLabel', 'w-wide-label', this.bodyEl);
  }
  /***/
  get wideLabel() {
    return this.wideLabel$;
  }
  /***/
  set padding(value) {
    this.bodyEl.padding = value;
  }
  /***/
  get padding() {
    return this.bodyEl.padding;
  }
  /** @property {String} - 添加到组件的{#bodyEl}元素的以空格分隔的多个样式类名。区别于元素的className属性，
   * 设置该属性将增量添加类名。 */
  set bodyCls(cls) {
    this.bodyEl.cls = cls;
  }
  /** @property {String} - 组件的{#bodyEl}元素的样式类名称，同元素的className属性一致。 */
  get bodyCls() {
    return this.bodyEl.className;
  }
  /** @property {String} - 添加到组件的{#bodyEl}元素的以分号分隔的多个样式。设置该属性将增量添加样式。 */
  set bodyStyle(style) {
    this.bodyEl.styleText = style;
  }
  /** @property {String} - 组件的{#bodyEl}元素样式字符串，同style.cssText属性一致。*/
  get bodyStyle() {
    return this.bodyEl.style.cssText;
  }
  /** @property {TextString} - 组件的{#bodyEl}元素的grid样式，设置该属性同时将设置display样式为grid，
   * 详见{#%css:grid}。 @design */
  set grid(value) {
    let bodyEl = this.bodyEl;

    if (value) {
      bodyEl.setStyle('display', 'grid');
      bodyEl.setStyle('grid', value);
    } else if (bodyEl.getStyle('display') == 'grid') {
      bodyEl.removeStyle('display');
      bodyEl.removeStyle('grid');
    }
  }
  /***/
  get grid() {
    return this.bodyEl.getStyle('grid');
  }
  /** @property {String} - 组件的{#bodyEl}元素的grid-template-columns样式。 */
  set gridTplColumns(value) {
    this.bodyEl.setStyle('grid-template-columns', value);
  }
  /***/
  get gridTplColumns() {
    return this.bodyEl.getStyle('grid-template-columns');
  }
  /** @property {String} - 组件的{#bodyEl}元素的grid-template-rows样式。 */
  set gridTplRows(value) {
    this.bodyEl.setStyle('grid-template-rows', value);
  }
  /***/
  get gridTplRows() {
    return this.bodyEl.getStyle('grid-template-rows');
  }
  /** @property {Enum} - 组件的bodyEl元素的grid-auto-flow样式，详见{#%css:grid-auto-flow}。
   * -'row': 通过逐行填充来排列元素，在必要时增加新行。
   * -'column': 通过逐列填充来排列元素，在必要时增加新列。
   * -'dense': 使用“稠密”堆积算法。
   * -'row dense': row和dense的组合。
   * -'column dense': column和dense的组合。
   * @design
   */
  set gridAutoFlow(value) {
    this.bodyEl.setStyle('grid-auto-flow', value);
  }
  /***/
  get gridAutoFlow() {
    return this.bodyEl.getStyle('grid-auto-flow');
  }
  /** @property {Enum} - 当组件为弹性布局时，下级组件主轴方向对齐方式。
   * -'start': 开始
   * -'center': 中间
   * -'end': 末尾
   * -'space-between': 两端对齐
   * -'space-around': 等间距对齐
   * @design
   */
  set justify(value) {
    this.bodyEl.setStyle('justify-content', value);
  }
  /***/
  get justify() {
    return this.bodyEl.getStyle('justify-content');
  }
  /** @property {Enum} - 当组件为弹性布局时，下级组件主轴垂直方向排列方式。
   * -'start': 开始
   * -'center': 中间
   * -'end': 末尾
   * -'baseline': 文字基线
   * -'stretch': 拉伸
   * @design
   */
  set align(value) {
    this.bodyEl.setStyle('align-items', value);
  }
  /***/
  get align() {
    return this.bodyEl.getStyle('align-items');
  }
  /** @property {Boolean} - 当组件为弹性布局时，下级组件是否自动弹性收缩。true收缩，false不收缩，null默认。 @design */
  set shrink(value) {
    let me = this;
    if (me.shrink$ !== value) {
      let bodyEl = me.bodyEl;
      me.shrink$ = value;
      bodyEl.setCls(value && value != null, 'w-shrink');
      bodyEl.setCls(!value && value != null, 'w-no-shrink');
    }
  }
  /***/
  get shrink() {
    return this.shrink$;
  }
  /** @property {Boolean} - 如果容器使用弹性布局，下级组件是否自动换行。 @design */
  set flexWrap(value) {
    this.bodyEl.setStyle('flex-wrap', value ? 'wrap' : null);
  }
  /***/
  get flexWrap() {
    return this.bodyEl.getStyle('flex-wrap') == 'wrap';
  }
  /** @property {Enum} - 当组件为弹性布局且自动换行多行显示时，每行下级组件之间和周围如何分配空间。
   * -'start': 开始
   * -'center': 中间
   * -'end': 末尾
   * -'between': 两端对齐
   * -'around': 等间距对齐
   * -'stretch': 拉伸
   * @design
   */
  set alignContent(value) {
    this.bodyEl.setStyle('align-content', value);
  }
  /***/
  get alignContent() {
    return this.bodyEl.getStyle('align-content');
  }
  /** @property {Wb.Component} - 容器的首个直接下级组件。 */
  get firstItem() {
    return this.items$[0];
  }
  /** @property {Wb.Component} - 容器的最后一个直接下级组件。 */
  get lastItem() {
    return this.items$.lastItem;
  }
  /**
   * 在当前组件的某个下级组件之后插入一个或多个下级组件。其引用被保存到{#items}属性中。
   * Example: 
   * 
   *     panel.insertAfter({cname: 'text'}, text1); //在text1之后插入新的文本框
   * 
   * @param {Object/Wb.Component/Array} data 插入的组件数据，可以为组件配置对象、组件实例或由这两者组成的数组。
   * @param {Wb.Component} [refItem] 在此组件之后插入。如果缺省将添加到容器下。
   * @return {Wb.Component/Wb.Component[]} 插入的下级组件，如果插入多个返回的值为数组。
   */
  insertAfter(data, refItem) {
    return this.insertBefore(data, refItem ? refItem.nextSibling : null);
  }
  /**
   * 在当前组件的下级组件指定索引位置插入一个或多个下级组件。其引用被保存到{#items}属性中。
   * Example: 
   * 
   *     panel.insert(2, {cname: 'text'}); //在第2个下级组件处插入新的文本框
   * 
   * @param {Number} index 插入的索引位置。
   * @param {Object/Wb.Component/Array} data 插入的组件数据，可以为组件配置对象、组件实例或由这两者组成的数组。
   * @return {Wb.Component/Wb.Component[]} 插入的下级组件，如果插入多个返回的值为数组。
   */
  insert(index, data) {
    let refItem = this.items$[index];

    if (refItem != data)
      return this.insertBefore(data, refItem);
  }
  /**
   * 在当前组件尾部添加一个或多个下级组件。其引用被保存到{#items}属性中。
   * Example: 
   *
   *     //添加通过字面量配置的对象
   *     container.add({cname: 'button', text: 'My Button'});
   *     //添加对象实例
   *     container.add(new Wb.Button({text: 'My Button'}));
   *
   * @param {Object/Wb.Component/Array} data 添加的组件数据，可以为组件配置对象、组件实例或由这两者组成的数组。
   * @return {Wb.Component/Wb.Component[]} 添加的下级组件，如果添加多个返回的值为数组。
   */
  add(data) {
    return this.insertBefore(data);
  }
}
/**
 * 进度条，用于以图形和文本形式显示进度。
 * @icon progress
 */
Cls['Wb.ProgressBar'] = class progressBar extends Wb.Component {
  static cls = 'w-progress';
  static configs = {
    value: 0,
    showPercent: true
  };
  /** @property {Element} percentEl 显示进度比例的元素。 @priv */
  /** @property {String} - 进度标签文本。 @key */
  set progressText(value) {
    let me = this;

    if (me.progressText$ !== value) {
      me.progressText$ = value;
      if (value) {
        me.labelEl = me.el.insertEl(0);
        me.labelEl.textContent = value;
      }
      else {
        me.labelEl?.remove();
        me.labelEl = null;
      }
      me.updateProgress();
    }
  }
  /***/
  get progressText() {
    return this.progressText$;
  }
  /** @property {Boolean} - 是否显示进度百分比标签。 */
  set showPercent(value) {
    let me = this;

    if (me.showPercent$ !== value) {
      me.showPercent$ = value;
      if (value) {
        me.percentEl = me.el.insertEl(1);
        me.updateProgress();
      } else {
        me.percentEl?.remove();
        me.percentEl = null;
      }
    }
  }
  /***/
  get showPercent() {
    return this.showPercent$;
  }
  /**
   * 根据当前进度更新进度标签。 @priv
   */
  updateProgress() {
    let me = this, el = me.percentEl;
    if (el) {
      let value = Math.round(me.value) + '%';
      el.textContent = me.progressText ? ('(' + value + ')') : value;
    }
  }
  /** @property {Number} - 进度条的进度值。最大值为100，最小值为0。 @key */
  set value(value) {
    let me = this;
    if (me.value$ !== value) {
      me.value$ = value;
      me.updateProgress();
      me.el.setStyle('background', 'linear-gradient(to right, ' + Wb.configs.progressColor + ' ' + value +
        '%, ' + Wb.configs.progressBgColor + ' 0%)');
    }
  }
  /***/
  get value() {
    return this.value$;
  }
}
/**
 * 自动滚动播放容器，用于对容器内的组件定时滚动切换显示，比如对多张图片的滚动轮播。
 * @icon play1
 * @mimic container
 */
Cls['Wb.Carousel'] = class carousel extends Wb.Container {
  static cls = 'w-carousel';
  static protos = {
    /** @property {Number} - 切换组件滑动效果持续的时长，单位为毫秒，默认为500。 */
    duration: 500,
    scrollButtons$: false,
    activeIndex$: -1,
    /** @property {Boolean} - 是否显示导航按钮，点击按钮将直接跳转到指定索引的组件。 */
    navigateButtons: true
  };
  static configs = {
    interval: 5000,
    scrollButtons: true,
    activeIndex: 0
  };
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    if (me.navigateButtons) {
      me.listCt = me.addFooter({
        cls: 'w-center w-cs-list', items: [{
          cname: 'iconButton', icon: 'pause', handler() {
            if (me.isPaused) {
              me.interval = me.saveInterval;
              this.icon = 'pause';
            } else {
              me.saveInterval = me.interval;
              me.interval = 0;
              this.icon = 'resume';
            }
            me.isPaused = !me.isPaused;
          }
        }, '|']
        , events: {
          buttonclick(btn) {
            let index = btn.itemIndex;
            if (index > 1) {
              me.activeIndex = btn.itemIndex - 2;
              me.resetInterval();
            }
          }
        }
      });
      me.on({ add: me.onAdd, remove: me.onRemove });
    }
  }
  /** @property {Object/Wb.Component/Array} items 设置下级组件配置对象、实例或其组成的数组。下级组件的{{carouselCls}}属性
   * 为其激活时容器的{#cls}属性。 @setter @code */
  /**
   * 添加下级组件时执行的方法。 @priv
   * @param {Wb.Component} comp 添加的组件。
   */
  onAdd(comp) {
    this.listCt.add({ cname: 'iconButton', icon: 'check1', bindComp: comp });
  }
  /**
   * 移除下级组件时执行的方法。 @priv
   * @param {Wb.Component} comp 移除的组件。
   */
  onRemove(comp) {
    this.listCt.find(item => item.bindComp == comp)?.remove();
    this.activeIndex$ = -1;
  }
  /** @property {Number} - 自动滚动切换的间隔，以毫秒为单位。设置为小于等于0的值将停止切换。默认为5000。 */
  set interval(value) {
    let me = this;

    if (me.interval$ !== value) {
      me.interval$ = value;
      if (me.timer)
        clearInterval(me.timer);
      if (value > 0)
        me.timer = setInterval(f => me.next(), value);
    }
  }
  /***/
  get interval() {
    return this.interval$;
  }
  /**
   * 重新开始自动滚动切换。
   */
  resetInterval() {
    let me = this, interval = me.interval$;
    me.interval = 0;
    me.interval = interval;
  }
  /** @property {Boolean} - 是否显示手动滚动按钮。 */
  set scrollButtons(value) {
    let me = this;

    if (me.scrollButtons$ !== value) {
      me.leftBtn = me.addHeader({ cls: 'w-cs-left', cname: 'iconButton', icon: 'left2', handler() { me.previous() } });
      me.rightBtn = me.addFooter({ cls: 'w-cs-right', cname: 'iconButton', icon: 'right2', handler() { me.next() } });
    }
  }
  /***/
  get scrollButtons() {
    return this.scrollButtons$;
  }
  /**
   * 播放切换显示到下一个组件。
   */
  next() {
    let me = this, index = me.activeIndex + 1;

    if (index >= me.items.length)
      index = 0;
    me.activeIndex = index;
    me.resetInterval();
  }
  /**
   * 播放切换显示到前一个组件。
   */
  previous() {
    let me = this, index = me.activeIndex - 1;

    if (index < 0)
      index = me.items.length - 1;
    me.activeIndex = index;
    me.resetInterval();
  }
  /** @property {Number} - 当前显示的子组件索引号。-1表示无显示的子组件。 */
  set activeIndex(value) {
    let me = this, oldIndex = me.activeIndex$;

    if (!me.hasChild) {
      me.activeIndex$ = -1;
      return;
    }
    value = Math.min(me.items.length - 1, value);
    if (oldIndex !== value) {
      const activeCls = 'w-cs-active';
      let items = me.items, newComp = items[value], oldComp = items[oldIndex], toLeft, listCt = me.listCt, crsCls

      me.activeIndex$ = value;
      if (Math.abs(value - oldIndex) > items.length / 2)
        toLeft = value > oldIndex;
      else
        toLeft = value < oldIndex;
      me.oldAnimate?.finish();
      me.oldAnimate = null;
      me.newAnimate?.finish();
      me.newAnimate = null;
      if (value >= 0 && listCt)
        listCt.items[value + 2].icon = 'check10';
      if (oldComp) {
        crsCls = oldComp.carouselCls;
        if (crsCls)
          me.removeCls(crsCls);
        if (listCt)
          listCt.items[oldIndex + 2].icon = 'check1';
        oldComp.addCls(activeCls);
        me.oldAnimate = oldComp.el.slideOut({
          x: toLeft, duration: me.duration, easing: 'linear', callback() {
            if (!newComp)
              oldComp.removeCls(activeCls);
          }
        });
        if (newComp) {
          newComp.addCls(activeCls);
          me.newAnimate = newComp.el.slideIn({
            x: toLeft, duration: me.duration, easing: 'linear', callback() {
              items.each(item => item.setCls(item == newComp, activeCls));
            }
          });
        }
      } else {
        //直接显示，不显示动画效果
        newComp?.addCls(activeCls);
      }
      crsCls = newComp?.carouselCls;
      if (crsCls)
        me.addCls(crsCls);
    }
  }
  /***/
  get activeIndex() {
    return this.activeIndex$;
  }
}
/**
 * 字段集容器。通常用于添加多个控件，并把这些控件归为一组。
 * @icon fieldset
 */
Cls['Wb.Fieldset'] = class fieldset extends Wb.mixin.Icon(Wb.Container) {
  static cls = 'w-fieldset';
  static protos = {
    collapsible$: false,
    collapsed$: false
  };
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    me.legendEl = me.addEl('w-fs-legend');
    me.bodyEl = me.addEl('w-fs-body');
  }
  /** @property {Element} - 获取显示图标的元素。 */
  get iconEl() {
    return this.iconEl$ ??= this.legendEl.addEl(0, 1);
  }
  /** @property {String} - 容器的标题。 @design @key */
  set title(value) {
    let me = this;
    if (me.title$ !== value) {
      me.title$ = value;
      if (value) {
        me.titleEl ??= me.legendEl.addEl('w-fs-title', 2);
        me.titleEl.textContent = value;
      } else {
        me.titleEl?.remove();
        me.titleEl = null;
      }
    }
  }
  /***/
  get title() {
    return this.title$;
  }
  /** @property {Boolean} - 容器是否显示可收缩的按钮。 @design */
  set collapsible(value) {
    let me = this;
    if (me.collapsible$ !== value) {
      me.collapsible$ = value;
      if (value) {
        me.collapseIcon ??= new Wb.Icon({
          owner: me,
          plainIcon: true,
          icon: me.collapsed ? 'down' : 'up',
          el: me.legendEl.addEl('w-fs-btn', 3),
          events: {
            click() {
              me.collapsed = !me.collapsed;
            }
          }
        });
      } else {
        me.collapseIcon?.destroy();
        me.collapseIcon = null;
      }
    }
  }
  /***/
  get collapsible() {
    return this.collapsible$;
  }
  /** @property {Boolean} - 容器是否收缩，收缩后容器的{#bodyEl}不可见。 */
  set collapsed(value) {
    let me = this, collapseIcon = me.collapseIcon;

    if (collapseIcon)
      collapseIcon.icon = value ? 'down' : 'up';
    me.applyCls(value, 'collapsed', 'w-fs-clps');
  }
  /***/
  get collapsed() {
    return this.collapsed$;
  }
}
/**
 * 分割线，通常用于对内容进行分割。
 * @icon line
 */
Cls['Wb.Line'] = class line extends Wb.mixin.Icon(Wb.Component) {
  static cls = 'w-line';
  static protos = {
    dashed$: false,
    dimTitle$: false
  };
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    this.beginLine = me.addEl('w-line-el', 1);
    this.endLine = me.addEl('w-line-el', 9);
  }
  /** @property {Boolean} - 是否显示短划线样式虚线。 @design */
  set dashed(value) {
    this.applyCls(value, 'dashed', 'w-dashed-line');
  }
  /***/
  get dashed() {
    return this.dashed$;
  }
  /** @property {Boolean} - 是否显示暗淡的标题。 @design */
  set dimTitle(value) {
    this.applyCls(value, 'dimTitle', 'w-dim-title');
  }
  /***/
  get dimTitle() {
    return this.dimTitle$;
  }
  /** @property {Element} - 获取显示图标的元素。 */
  get iconEl() {
    return this.iconEl$ ??= this.addEl('w-line-icon', 3);
  }
  /** @property {String} - 组件的标题。 @design @key */
  set title(value) {
    let me = this;
    if (me.title$ !== value) {
      me.title$ = value;
      if (value) {
        me.titleEl ??= me.addEl('w-line-label', 5);
        me.titleEl.textContent = value;
      } else {
        me.titleEl?.remove();
        me.titleEl = null;
      }
    }
  }
  /***/
  get title() {
    return this.title$;
  }
}
/**
 * 标题，通常显示为一个标题和分割线。可用于表单中对不同类别的控件进行分组。非首个标题组件将自动添加顶部间距，
 * 设置{#fixedMargin}为true可取消该默认特性。
 * @icon title
 */
Cls['Wb.Title'] = class title extends Wb.mixin.Icon(Wb.Component) {
  static cls = 'w-tt';
  static protos = {
    marker$: false,
    line$: false
  };
  static configs = {
    marker: true,
    line: true
  }
  /** @property {Boolean} - 在标题前是否显示标记。如果显示图标该标记将不会被显示。null同true。 @design */
  set marker(value) {
    let me = this;

    value ??= true;
    if (me.marker$ !== value) {
      me.marker$ = value;
      if (value)
        me.markerEl ??= me.addEl('w-tt-marker', 2);
      else {
        me.markerEl?.remove();
        me.markerEl = null;
      }
    }
  }
  /***/
  get marker() {
    return this.marker$;
  }
  /** @property {Boolean} - 是否使用固定边距。true固定边距，false非首条时上边距大于下边距。 @design */
  set fixedMargin(value) {
    this.applyCls(value, 'fixedMargin', 'w-fixed-margin');
  }
  /***/
  get fixedMargin() {
    return this.fixedMargin$;
  }
  /** @property {Boolean} - 是否显示分割线。 @design */
  set line(value) {
    let me = this;

    value ??= true;
    if (me.line$ !== value) {
      me.line$ = value;
      if (value) {
        me.lineEl ??= me.addEl('w-tt-line', 4);
      } else {
        me.lineEl?.remove();
        me.lineEl = null;
      }
    }
  }
  /***/
  get line() {
    return this.line$;
  }
  /** @property {Element} - 获取显示图标的元素。 */
  get iconEl() {
    return this.iconEl$ ??= this.addEl('w-tt-icon', 1);
  }
  /** @property {String} - 组件的标题。 @design @key */
  set title(value) {
    let me = this;
    if (me.title$ !== value) {
      me.title$ = value;
      if (value) {
        me.titleEl ??= me.addEl('w-tt-title', 3);
        me.titleEl.textContent = value;
      } else {
        me.titleEl?.remove();
        me.titleEl = null;
      }
    }
  }
  /***/
  get title() {
    return this.title$;
  }
}
/**
 * 专用的可滚动容器。当容器内容溢出时，将在左右或顶部底部显示用于滚动的按钮，这些按钮用于替代传统的滚动条方式滚动。
 * @icon position 
 */
Cls['Wb.ScrolledCt'] = class scrolledCt extends Wb.Container {
  static cls = 'w-sc w-row';
  static protos = {
    /** @property {Number} scrollStep 滚动步长，即每点击一次按钮滚动的以像素为单位的长度。默认为30。 */
    scrollStep: 30,
    /** @property {Boolean} - 是否已经启用wheel事件监听。 @priv */
    moniteWheel: false,
    /** @property {Boolean} - 当鼠标悬停在滚动按钮上时是否自动滚动。 */
    scrollOnHover: false,
    vertical$: false
  };
  /***/
  init(configs) {
    let me = this;

    if (Wb.isTouch)
      Wb.apply(configs, { autoScroll: 'hide' });
    super.init(configs);
    me.bodyEl = me.el.addEl('w-sc-body w-row');
    //添加时需要监听，因为超出容器长度后不触发resize
    me.on({ add: me.updateButtons, remove: me.updateButtons });
    me.mon({
      el: me.bodyEl,
      resize: me.onResize,
      scroll: { fn: me.updateButtons, passive: true },
      keydown: me.onKeyDown
    });
  }
  /**
   * 调整大小时执行的方法。 @priv
   */
  onResize() {
    this.updateButtons();
  }
  /**
   * 按键时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onKeyDown(e) {
    let btn = Wb.getActiveComp(Wb.Button);
    if (btn) {
      switch (e.code) {
        case Keys.Left:
        case Keys.Up:
          btn = btn.previousValidSibling;
          break;
        case Keys.Right:
        case Keys.Down:
          btn = btn.nextValidSibling;
          break;
        default:
          btn = null;
      }
      if (btn) {
        if (btn.enableToggle || btn.active != null) {
          btn.setActive(true, true);
          e.stopEvent();
        }
      }
    }
  }
  /**
   * 鼠标滚动时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onWheel(e) {
    let me = this, bodyEl = me.bodyEl;

    if (me.vertical$ && bodyEl.offsetHeight < bodyEl.scrollHeight
      || !me.vertical$ && bodyEl.offsetWidth < bodyEl.scrollWidth) {
      me.doScroll(e.deltaY < 0);
      e.stopEvent();
    }
  }
  /** @property {Boolean} - 是否仅允许垂直调整下级组件顺序。false水平，true垂直。 */
  get verticalSort() {
    return this.vertical;
  }
  /** @property {Wb.IconButton} - 获取向前滚动的按钮。 */
  get beforeBtn() {
    return this.createScrollButton(true);
  }
  /** @property {Wb.IconButton} - 获取向后滚动的按钮。 */
  get afterBtn() {
    return this.createScrollButton();
  }
  /**
   * 创建滚动按钮。 @priv
   * @param {Boolean} [isBefore] 是否创建向前滚动按钮。
   */
  createScrollButton(isBefore) {
    let me = this, key = isBefore ? 'beforeBtn$' : 'afterBtn$';

    if (me[key])
      return me[key];

    let vertical = me.vertical$, configs = {
      cname: 'iconButton', repeatInterval: true, scope: me,
      icon: isBefore ? (vertical ? 'up' : 'left') : (vertical ? 'down' : 'right'),
      handler: isBefore ? me.scrollToBefore : me.scrollToAfter
    };
    if (Wb.isDesktop && me.scrollOnHover) {
      configs.listeners = {
        mouseenter() {
          me.scrollTimer = setInterval(f => {
            me.doScroll(isBefore);
          }, 80);
        },
        mouseleave() {
          if (me.scrollTimer) {
            clearInterval(me.scrollTimer);
            me.scrollTimer = null;
          }
        }
      };
    }
    return me[key] = me[isBefore ? 'addHeader' : 'addFooter'](configs);
  }
  /**
   * 设置滚动条位置。 @priv
   * @param {Boolean} dir true向前，false向后。
   */
  doScroll(dir) {
    let step = this.scrollStep;

    if (dir)
      step = -step;
    if (this.vertical$)
      this.bodyEl.scrollTop += step;
    else
      this.bodyEl.scrollLeft += step;
    this.updateButtons();
  }
  /**
   * 设置滚动条位置往前。 @priv
   */
  scrollToBefore() {
    this.doScroll(true);
  }
  /**
   * 设置滚动条位置往后。 @priv
   */
  scrollToAfter() {
    this.doScroll();
  }
  /**
   * @event togglebutton 当滚动按钮显示或销毁时触发。
   * @param {Boolean} visible 滚动按钮是否可见。
   */
  /**
   * 更新滚动按钮，使之显示/销毁或有效/无效。在某些情况下可通过手动调用该方法以达到更新滚动按钮目的。
   */
  updateButtons() {
    let me = this, bodyEl = me.bodyEl, vertical = me.vertical$,
      scrollHeight = bodyEl.scrollHeight, scrollWidth = bodyEl.scrollWidth,
      clientHeight = bodyEl.clientHeight, clientWidth = bodyEl.clientWidth,
      begin = (vertical ? bodyEl.scrollTop : bodyEl.scrollLeft);

    // if hidden not process
    if (!clientWidth && !clientHeight)
      return;
    if (vertical && (scrollHeight > clientHeight) || !vertical && (scrollWidth > clientWidth)) {
      me.beforeBtn.disabled = begin == 0;
      me.afterBtn.disabled = begin + 1 >= (vertical ? (scrollHeight -
        clientHeight) : (scrollWidth - clientWidth));
      me.fireEvent('togglebutton', true);
      if (Wb.isDesktop && !me.moniteWheel) {
        me.mon('wheel', me.onWheel, me, { passive: false });
        me.moniteWheel = true;
      }
    } else {
      let btn;

      if (btn = me.beforeBtn$) {
        btn.destroy();
        me.beforeBtn$ = undefined;
      }
      if (btn = me.afterBtn$) {
        btn.destroy()
        me.afterBtn$ = undefined;
      }
      me.fireEvent('togglebutton', false);
      if (Wb.isDesktop && me.moniteWheel) {
        me.mun('wheel', me.onWheel);
        me.moniteWheel = false;
      }
    }
  }
  /** @property {Boolean} - 是否为垂直滚动。true垂直，false水平。 @design @key */
  set vertical(value) {
    if (this.vertical$ !== value) {
      this.vertical$ = value;
      if (this.beforeBtn$)
        this.beforeBtn$.icon = value ? 'up' : 'left';
      if (this.afterBtn$)
        this.afterBtn$.icon = value ? 'down' : 'right';
      this.setCls(!value, 'w-row');
      this.setCls(value, 'w-column');
      this.bodyEl.setCls(!value, 'w-row');
      this.bodyEl.setCls(value, 'w-column');
    }
  }
  /***/
  get vertical() {
    return this.vertical$;
  }
}
/**
 * 面板组件，包含顶部标题栏和底部按钮栏的容器。顶部标题栏和底部按钮栏默认不创建，只有当设置或访问它们时才被创建。
 * @icon panel
 */
Cls['Wb.Panel'] = class panel extends Wb.mixin.Icon(Wb.Container) {
  static cls = 'w-column w-panel';
  static configs = {
    buttonAlign: 'right'
  };
  static protos = {
    winMaxCls: 'w-win-full',
    closable$: null,
    buttonAlign$: 'left',
    collapsible$: false,
    collapsed$: false,
    titleCenter$: false,
    maximizable$: null,
    minimizable$: false,
    maximized$: false,
    minimized: false,
    plainTitle$: false,
    /** @property {Boolean} - 组件最大化时是否基于父容器，false基于Window最大化，true基于父容器最大化。如果值为true，
     * 需要设置父容器的{{position}}。请注意
     */
    maxOnParent: false
  };
  /** @property {Element} ctEl 容器元素。把标题栏、按钮栏和{#bodyEl}等都添加到该元素下。 @priv */
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    me.bodyEl = (me.ctEl ?? me.el).addEl('w-body');
  }
  /***/
  set background(value) {
    super.background = value;
    this.bodyEl.bgColor = value;
  }
  /***/
  get background() {
    return super.background;
  }
  /**
   * @event buttonclick 底部按钮工具条按钮点击时触发。
   * @param {Wb.Button} button 点击的按钮。
   * @param {Event} e 事件对象。
   */
  /** @property {Function} onButtonClick 底部按钮工具条按钮点击时执行的方法。见{#*buttonclick}事件说明。 @code */
  /** @property {Number/String} minButtonWidth 设置按钮的默认最小宽度值。如果值为数值，默认单位为px。 */
  /** @property {Wb.Toolbar} - 获取底部按钮工具条。 */
  get buttonsBar() {
    let me = this;
    return me.buttonsBar$ ??= me.addFooter({
      cname: 'container',
      cls: 'w-btn-bar',
      justify: me.buttonAlign$,
      weight: 90,
      defaults: {
        cname: 'button'
      },
      listeners: {
        keydown(e) {
          let code = e.code, isRight, target = e.target;
          if (code == Keys.Left || code == Keys.Up || (isRight = (code == Keys.Right || code == Keys.Down))) {
            let button = target.getClosestComp(Wb.Button);
            if (button?.parent == this) {
              if (isRight)
                button.nextValidSibling?.focus();
              else
                button.previousValidSibling?.focus();
              e.stopEvent();
            }
          }
        }
      },
      events: {
        add(comp) {
          if (comp instanceof Wb.Button)
            comp.minWidth = me.minButtonWidth;
        },
        buttonclick(btn, e) {
          me.onButtonClick?.call(me, btn, e);
          me.fireEvent('buttonclick', btn, e);
        }
      }
    }, me.ctEl);
  }
  /** @property {Enum} - 按钮栏按钮的对齐方式。
   * -'left': 左
   * -'center': 中
   * -'right': 右
   */
  set buttonAlign(align) {
    if (this.buttonAlign$ !== align) {
      this.buttonAlign$ = align;
      if (this.buttonsBar$)
        this.buttonsBar$.justify = align;
    }
  }
  /***/
  get buttonAlign() {
    return this.buttonAlign$;
  }
  /** @property {Boolean} - 是否显示素色的标题栏，默认标题栏具有指定的背景色。 */
  set plainTitle(value) {
    this.applyCls(value, 'plainTitle', 'w-plain-title');
  }
  /***/
  get plainTitle() {
    return this.plainTitle$;
  }
  /** @property {Boolean} - 组件是否最大化。true最大化，false还原最大化前的大小。 */
  set maximized(value) {
    let me = this;
    if (me.maximized$ !== value) {
      let maxBtn = me.maximizeBtn$;
      me.maximized$ = value;
      if (value) {
        me.restoreData = { resizable: me.resizable, movable: me.movable };
        me.addCls(me.winMaxCls);
        me.resizable = false;
        me.movable = false;
        if (maxBtn) {
          maxBtn.tip = Str.restore;
          maxBtn.icon = 'win-restore';
        }
      } else {
        let restoreData = me.restoreData;
        me.removeCls(me.winMaxCls);
        me.resizable = restoreData.resizable;
        me.movable = restoreData.movable;
        delete me.restoreData;
        if (maxBtn) {
          maxBtn.tip = Str.max;
          maxBtn.icon = 'win-max';
        }
      }
    }
  }
  /***/
  get maximized() {
    return this.maximized$;
  }
  /** @property {Wb.Button} - 获取最大化按钮。 @priv */
  get maximizeBtn() {
    let me = this, isMax = me.maximized;
    return me.maximizeBtn$ ??= me.titleBar.addHeader({
      cname: 'lightButton',
      cls: 'w-title-tool',
      icon: isMax ? 'win-resore' : 'win-max',
      tip: isMax ? Str.restore : Str.max,
      weight: 63,
      handler() {
        me.maximized = !me.maximized;
      }
    });
  }
  /** @property {Enum} - 组件是否可通过最大化/还原按钮执行相关操作。设置null将销毁该按钮。
   * -true: 最大化按钮有效。
   * -false: 最大化按钮禁用。
   * -null: 无最大化按钮。默认值。
   * @design
   */
  set maximizable(value) {
    if (this.maximizable$ !== value) {
      this.maximizable$ = value;
      if (value == null) {
        if (this.maximizeBtn$) {
          this.maximizeBtn$.destroy();
          delete this.maximizeBtn$;
        }
      } else {
        this.maximizeBtn.disabled = !value;
      }
    }
  }
  /***/
  get maximizable() {
    return this.maximizable$;
  }
  /** @property {Wb.Button} - 获取最小化按钮。 @priv */
  get minimizeBtn() {
    let me = this, isMin = me.minimized;
    return me.minimizeBtn$ ??= me.titleBar.addHeader({
      cname: 'lightButton',
      cls: 'w-title-tool',
      icon: isMin ? 'win-resore' : 'win-min',
      tip: isMin ? Str.restore : Str.min,
      weight: 65,
      handler() {
        me.minimize?.();
      }
    });
  }
  /** @property {Enum} - 组件是否可通过最小化按钮执行相关操作。设置null将销毁该按钮。最小化时将
   * 执行{#minimize}方法，该方法默认为空方法。
   * -true: 最小化按钮有效。
   * -false: 最小化按钮禁用。
   * -null: 无最小化按钮。默认值。
   * @design
   */
  set minimizable(value) {
    if (this.minimizable$ !== value) {
      this.minimizable$ = value;
      if (value == null) {
        if (this.minimizeBtn$) {
          this.minimizeBtn$.destroy();
          delete this.minimizeBtn$;
        }
      } else {
        this.minimizeBtn.disabled = !value;
      }
    }
  }
  /***/
  get minimizable() {
    return this.minimizable$;
  }
  /** @property {Enum} - 组件是否可通过收缩按钮来收缩和展开，收缩后仅标题栏可见。
   * -true: 在标题栏右侧添加收缩按钮来提供收缩功能。
   * -'tree': 在标题栏左侧添加类似树节点扩展器来提供收缩功能。点击标题栏时也能切换收缩。
   * -'accordion': 同'tree'类型，区别为点击时将展开该面板同时收缩同一容器内的其它所有面板。
   * -false: 无收缩按钮。
   * @design 
   */
  set collapsible(value) {
    let me = this;
    if (me.collapsible$ !== value) {
      me.collapsible$ = value;
      if (value) {
        let trueValue = value === true, treeValue = value == 'tree';
        me.collapseBtn?.destroy()
        me.collapseBtn = me.titleBar.addHeader({
          cname: 'lightButton',
          cls: 'w-title-tool' + (trueValue ? '' : ' w-margin-r'),
          icon: me.collapsed ? (treeValue ? 'right' : 'down') : (treeValue ? 'down' : 'up'),
          tip: me.collapsed ? Str.expand : Str.collapse,
          weight: treeValue ? 98 : 55,
          handler: me.onToggleCollapse,
          scope: me
        });
        me.setListeners(!trueValue, me.titleBar.el, 'click', me.onToggleCollapse);
      } else {
        me.collapseBtn?.destroy();
        delete me.collapseBtn;
      }
    }
  }
  /***/
  get collapsible() {
    return this.collapsible$;
  }
  /**
   * 点击切换面板的收缩和展开状态。 @priv
   */
  onToggleCollapse(e) {
    let me = this;

    if (me.collapsible == 'accordion') {
      me.parent.each(item => {
        item.collapsed = item != me;
      });
    } else {
      me.collapsed = !me.collapsed;
    }
    e.stopEvent();
  }
  /** @property {Boolean} - 组件是否收缩，收缩后仅标题栏可见。 */
  set collapsed(value) {
    let me = this, btn = me.collapseBtn;
    if (btn) {
      btn.icon = me.collapsible == 'tree' ? (value ? 'right' : 'down') : (value ? 'down' : 'up');
      btn.tip = value ? Str.expand : Str.collapse;
    }
    me.applyCls(value, 'collapsed', 'w-panel-clps');
  }
  /***/
  get collapsed() {
    return this.collapsed$;
  }
  /** @property {Boolean} - 设置标题栏容器是否可见。 @design */
  set titleBar(value) {
    this.titleBar.visible = value;
  }
  /** @property {Wb.Container} - 获取标题栏容器。 */
  get titleBar() {
    let me = this, titleBar = me.titleBar$;
    if (!titleBar) {
      titleBar = me.titleBar$ ??= me.addHeader({
        cname: 'container',
        cls: 'w-titlebar w-row w-align-center',
        weight: 110,
        listeners: {
          dblclick(e) {
            let target = e.target;
            if (me.maximizable && (target == e.currentTarget || target == me.iconEl$ ||
              target == titleBar.titleLabel.el))
              me.maximized = !me.maximized;
          }
        }
      }, me.ctEl);
      titleBar.titleLabel = titleBar.addHeader({
        cname: 'label',
        weight: 80,
        cls: 'w-panel-label',
        overflowTip: true
      });
    }
    return titleBar;
  }
  /** @property {Wb.Label} - 获取标题标签。 */
  get titleLabel() {
    return this.titleBar.titleLabel;
  }
  /** @property {Boolean} - 面板中的标题栏是否居中显示。 */
  set titleCenter(value) {
    this.applyCls(value, 'titleCenter', 'w-center-title');
  }
  /***/
  get titleCenter() {
    return this.titleCenter$;
  }
  /** @property {Wb.Button} backBtn 返回按钮的实例对象。 @readonly */
  /** @property {Boolean} - 是否在标题栏左上角添加返回按钮，点击该按钮将关闭窗口。在{#beforeclose}事件中返回false可以阻止
   * 关闭。{#backBtn}属性可以访问返回按钮实例对象。
   */
  set backButton(value) {
    let me = this;

    if (me.backButton$ !== value) {
      me.backButton$ = value;
      if (value)
        me.backBtn ??= me.titleBar.addHeader({
          cname: 'iconButton',
          icon: 'left2',
          weight: 85,
          handler() {
            me.close();
          }
        });
      else {
        me.backBtn?.destroy();
        delete me.backBtn;
      }
    }
  }
  /***/
  get backButton() {
    return this.backButton$;
  }
  /** @property {Wb.Button} menuBtn 菜单按钮对象。 @readonly */
  /** @property {Wb.Menu} - 面板菜单。设置该属性后将在标题栏右上角生成菜单按钮，并关联该菜单，请注意：设置
   * 新的菜单后原菜单不会被自动销毁。{#menuBtn}为菜单按钮。 @key */
  set menu(value) {
    let me = this;

    me.menuBtn ??= me.titleBar.addHeader({
      cname: 'iconButton',
      icon: 'menu',
      weight: 30
    });
    me.menuBtn.menu = value;
  }
  /***/
  get menu() {
    return this.menu$;
  }
  /** @property {Element} - 获取显示图标的元素。 */
  get iconEl() {
    return this.iconEl$ ??= (this.iconComp = this.titleBar.addHeader({
      tagName: 'div',
      cls: 'w-panel-icon',
      weight: 90
    })).el;
  }
  /** @property {Wb.Container} - 获取辅助组件栏。 */
  get toolsBar() {
    return this.toolsBar$ ??= this.titleBar.addHeader({
      cname: 'container',
      cls: 'w-row w-tools-bar',
      defaults: { cname: 'lightButton' },
      weight: 70
    });
  }
  /** @property {Wb.Item[]/Wb.Component[]} - 设置标题栏上的辅助组件列表。 */
  set tools(tools) {
    if (this.tools$)
      Wb.destroy(this.tools$);
    this.tools$ = this.toolsBar.add(tools);
  }
  /** @property {Wb.Component[]} - 获取标题栏上的辅助组件列表。 */
  get tools() {
    return this.tools$;
  }
  /**
   * 关闭按钮点击时执行的方法。 @priv
   */
  onCloseClick() {
    this.close();
  }
  /** @property {Wb.Button[]/Wb.Button} - 设置底部按钮配置对象，实例或两者组成的数组。 @key */
  set buttons(buttons) {
    this.buttonsBar.setItems(buttons);
  }
  /** @property {Wb.Component[]} - 按钮栏所有下级组件组成的数组。 */
  get buttons() {
    return this.buttonsBar.items$;
  }
  /** @property {Wb.Toolbar/Wb.Container/Wb.Component/Wb.Toolbar[]} - 设置一个或多个顶部组件栏，该栏位于标题栏下方。\
   * 组件默认{#weight}为100。 @key */
  set tbar(comps) {
    //标题栏默认添加到组件的最顶部
    let items = [];
    Wb.destroy(this.tbar$);
    Wb.toArray(comps).forEach(item => {
      item = Wb.apply({ weight: 100 }, item);
      item.cls = item.cls ? (item.cls + ' w-tbar') : 'w-tbar';
      items.push(item);
    });
    this.tbar$ = this.addHeader(items, this.ctEl);
  }
  /***/
  get tbar() {
    return this.tbar$;
  }
  /** @property {Wb.Toolbar/Wb.Container/Wb.Component/Wb.Toolbar[]} - 设置一个或多个底部组件栏，
   * 该栏位于最下方。组件默认{#weight}为100。 */
  set bbar(comps) {
    //标题栏默认添加到组件的最顶部
    let items = [];
    Wb.destroy(this.bbar$);
    Wb.toArray(comps).forEach(item => {
      item = Wb.apply({ weight: 100 }, item);
      item.cls = item.cls ? (item.cls + ' w-bbar') : 'w-bbar';
      items.push(item);
    });
    this.bbar$ = this.addFooter(items, this.ctEl);
  }
  /***/
  get bbar() {
    return this.bbar$;
  }
  /** @property {Boolean} htmlTitle {#title}是否为HTML格式。true HTML格式，false纯文本格式。 */
  /** @property {String} - 面板标题。设置为null将销毁标题栏。 @design @key */
  set title(value) {
    let me = this;
    if (me.title$ !== value) {
      let titleBar = me.titleBar;
      me.title$ = value;
      if (me.isIdeDesigner) {
        if (titleBar)
          titleBar.visible = value != null;
        if (value == null)
          value = '';
      }
      if (value == null) {
        titleBar?.destroy();
        delete me.titleBar$;
      } else if (me.htmlTitle)
        me.titleLabel.html = value;
      else
        me.titleLabel.text = value;
    }
  }
  /***/
  get title() {
    return this.title$;
  }
  /** @property {Wb.Button} - 获取关闭按钮。 @priv */
  get closeBtn() {
    return this.closeBtn$ ??= this.titleBar.addHeader({
      cname: 'lightButton',
      cls: 'w-title-tool',
      icon: 'close',
      tip: Str.close,
      weight: 60,
      handler: f => { this.onCloseClick.call(this); }
    });
  }
  /** @property {Enum} - 面板是否可通过关闭按钮关闭。设置null将销毁关闭按钮。
   * -true: 关闭按钮有效。
   * -false: 关闭按钮禁用。
   * -null: 无关闭按钮。默认值。
   * @design
   */
  set closable(value) {
    if (this.closable$ !== value) {
      this.closable$ = value;
      if (value == null) {
        if (this.closeBtn$) {
          this.closeBtn$.destroy();
          delete this.closeBtn$;
        }
      } else {
        this.closeBtn.disabled = !value;
      }
    }
  }
  /***/
  get closable() {
    return this.closable$;
  }
}
/**
 * 弹出式菜单组件，可添加菜单条目{#Wb.Item}来提供选择交互功能。
 * 菜单的相关示例见：{#%toolbar-menu.xwl|ide?openModule=example/comps/toolbar-menu.xwl}
 * @icon menu2
 */
Cls['Wb.Menu'] = class menu extends Wb.ScrolledCt {
  static cls = 'w-menu w-disp-none';
  static defaults = {
    cname: 'item',
    groupName: 'menu'
  };
  /** @property {Wb.Card} contextCard 当菜单作为{#Wb.Tab.tabMenu}时关联的卡片。 @readonly */
  static configs = {
    vertical: true,
    scrollOnHover: true,
    floating: true
  };
  static protos = {
    /** @property {Boolean} - 显示菜单时，当菜单所有条目均无快捷键时，是否自动隐藏显示快捷键的元素。默认为true。 */
    autoHideSC: true,
    /** @property {Boolean} - 是否在输入框上忽略显示上下文菜单，即显示默认的菜单。 */
    ignoreInputMenu: false,
    /** @property {Boolean} - 当作为上下文菜单被阻止显示后，是否也阻止系统上下文菜单的显示。 */
    hideSystemMenu: false,
    autoSize: 'height',
    visible$: false
  };
  /**
   * 隐藏除指定菜单外的其它菜单。 @priv
   * @param {Wb.Menu} [menu] 保留显示的菜单。该菜单外的其它菜单将被隐藏。null将隐藏所有菜单。
   */
  static hideMenus(menu) {
    this.activeMenu?.bubble(item => {
      if (item instanceof this) {
        if (item.contains(menu))
          return false;
        item.hide();
      }
    });
  }
  /**
   * @event menuclick 菜单条目点击时触发。 @key
   * @param {Wb.Item} item 菜单条目。
   * @param {Event} e 事件对象。
   */
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    me.on({ subremoved: me.onSubRemoved, remove: me.onRemove, add: me.onAdd });
    me.mon({ contextmenu: Event.pdHandler });
  }
  /** @property {Wb.Button} menuButton 通过菜单按钮显示该菜单时关联的按钮。 */
  /** @property {Element} contextTarget 当作为上下文菜单显示时，根菜单关联的目标元素。未找到返回null。 */
  get contextTarget() {
    let parentMenu = this, target;

    while (parentMenu) {
      if (target = parentMenu.contextTarget$)
        return target;
      parentMenu = parentMenu.parent?.parent;
      if (!(parentMenu instanceof Wb.Menu))
        return null;
    }
  }
  /***/
  hide() {
    let me = this;

    super.hide();
    me.each(item => item.menu?.hide());
    return me;
  }
  /**
   * 在组件作为子组件移除时执行的方法。 @priv
   */
  onSubRemoved(parent) {
    if (parent?.menu == this)
      parent.menu = null;
    if (parent?.contextMenu == this)
      parent.contextMenu = null;
  }
  /***/
  destroy() {
    let me = this;
    if (!me.destroyed) {
      let Menu = me.constructor, parent = me.parent;
      if (me.menuMoniteWheel)
        Menu.menuMoniteWheel = false;
      if (me.visible) {
        Menu.activeMenu = (parent instanceof Wb.Item && parent.parent?.visible) ? parent.parent : undefined;
        if (parent)
          parent.active = false;
      }
    }
    super.destroy();
  }
  /**
   * 移除下级组件执行的方法。 @priv
   */
  onRemove() {
    this.parent?.flagEl?.setAppeared(this.hasChild);
  }
  /**
   * 添加下级组件执行的方法。 @priv
   */
  onAdd() {
    this.parent?.flagEl?.setAppeared(true);
  }
  /***/
  set visible(value) {
    let me = this;
    if (me.visible$ !== value) {
      let Menu = Wb.Menu, parent = me.parent, parentIsMenuBtn = parent instanceof Wb.Button && parent.menu == me;

      super.visible = value;
      //可能在beforeshow取消，因此需判断重新设置value值
      value = me.visible$;
      if (value) {
        Menu.hideMenus(me);
        Menu.activeMenu = me;
        me.setMaxZIndex();
        if (parentIsMenuBtn)
          parent.active = value;
        if (!Menu.menuMoniteWheel) {
          me.mon(DocEl, 'wheel', me.onDocWheel, me, { passive: true });
          me.menuMoniteWheel = true;
          Menu.menuMoniteWheel = true;
        }
      } else {
        me.each(item => {
          if (item.isMenuItem && item.active$)
            item.active = false;
        });
        //隐藏菜单的parent如果是按钮，取消激活状态
        let activeMenu = undefined;
        if (parent) {
          if (parent.isMenuItem) {
            if (parent.parent?.visible)
              activeMenu = parent.parent;
          } else if (parentIsMenuBtn) {
            parent.active = false;
          }
        }
        if (!Menu.activeMenu?.contains(me, true))
          Menu.activeMenu = activeMenu;
        if (me.menuMoniteWheel) {
          me.mun(DocEl, 'wheel', me.onDocWheel);
          me.menuMoniteWheel = false;
          Menu.menuMoniteWheel = false;
        }
        delete me.menuButton;
      }
      me.setListeners(value, {
        el: DocEl,
        [Event.tapDownName]: { fn: me.doHideMenu, capture: true },
        keydown: { fn: me.onDocKeyDown, capture: true }
      });
      BodyEl.setCls(Menu.activeMenu, 'w-no-caret');
    }
  }
  /***/
  get visible() {
    return super.visible;
  }
  /**
   * {#globalThis.DocEl}鼠标滚轮滚动时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onDocWheel(e) {
    let Menu = Wb.Menu;
    if (!e.target.getClosestComp(Menu))
      Menu.hideMenus();
  }
  /** @property {Wb.Item} - 当前菜单激活的菜单项。未找到返回null。 */
  get activeItem() {
    return this.findBy(item => item.active && item.isMenuItem);
  }
  /**
   * 点击文档时隐藏当前菜单。 @priv
   */
  doHideMenu(e) {
    let target = e.target, comp = target.getClosestComp(Wb.Component);
    //左键点击在有效的菜单按钮上直接返回
    if (e.isLeftButton && comp?.menu && !comp.disabled && !(comp instanceof Wb.SplitButton))
      return;
    Wb.Menu.hideMenus(target.getClosestComp(Wb.Menu));
  }
  /**
   * 文档上按键时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onDocKeyDown(e) {
    let activeMenu = Wb.Menu.activeMenu, target = e.target;

    if (!activeMenu || activeMenu.el.contains(target) && !target.getClosestComp(Wb.Item))
      return;
    let processed = true, activeItem;
    switch (e.code) {
      case Keys.Enter:
        activeItem = activeMenu.activeItem
        if (activeItem && !activeItem.disabled) {
          activeItem.fireClick(e);
          if (activeItem.menu)
            activeItem.showMenu();
          else
            activeMenu.hide();
        } else
          processed = false;
        return;
      case Keys.Esc:
        activeMenu.hide();
        break;
      case Keys.Up:
        activeMenu.walkingItem('up');
        break;
      case Keys.Down:
        activeMenu.walkingItem('down');
        break;
      case Keys.Left:
        activeMenu.walkingItem('left');
        break;
      case Keys.Right:
        activeMenu.walkingItem('right');
        break;
      default:
        processed = false;
    }
    if (processed)
      e.stopEvent();
  }
  /**
   * 当前激活菜单按指定按键方向导航。 @priv
   * @param {String} dir 导航方向。有效值：
   * -'left': 左
   * -'right': 右
   * -'up': 上
   * -'down': 下
   */
  walkingItem(dir) {
    let activeItem = this.activeItem, nextItem = activeItem,
      activeMenu = Wb.Menu.activeMenu, navTarget = this, showMenu, button, circled,
      method = (dir == 'left' || dir == 'up') ? 'previousSibling' : 'nextSibling';

    if (dir == 'right' && activeItem?.menu) {
      activeItem.showMenu();
      activeItem.menu.walkingItem('down');
      return;
    }
    if (dir == 'left' && activeMenu?.parent?.isMenuItem) {
      activeMenu.hide();
      return;
    }
    //顶层菜单左右导航
    if (dir == 'right' || dir == 'left') {
      //获取顶层菜单按钮
      button = activeMenu.upBy(item =>
        !item.isMenuItem && !(item instanceof Wb.Menu));
      //如果存在菜单按钮
      if (button) {
        if (button.parent instanceof Wb.SplitButton)
          button = button.parent;
        activeItem = nextItem = button;
        navTarget = activeItem.parent;
        showMenu = true;
      }
    }
    do {
      if (!nextItem) {
        nextItem = navTarget.firstItem;
        if (!nextItem)
          return;
      } else if (nextItem == navTarget?.lastItem && method == 'nextSibling') {
        if (circled)
          return;
        nextItem = navTarget.firstItem;
        circled = true;
      } else if (nextItem == navTarget?.firstItem && method == 'previousSibling') {
        if (circled)
          return;
        nextItem = navTarget.lastItem;
        circled = true;
      } else {
        nextItem = nextItem[method];
        if (!nextItem)
          return;
      }
      if (nextItem == activeItem)
        break;
      if ((nextItem?.isMenuItem || nextItem?.menu) && nextItem.visible && nextItem.appeared && !nextItem.disabled) {
        if (activeItem)
          activeItem.active = false;
        nextItem.active = true;
        nextItem.intoView();
        if (showMenu)
          nextItem.showMenu();
        return;
      }
    } while (true);
  }
}
/**
 * 菜单子项条目，通常添加在菜单{#Wb.Menu}组件内。当在ide设计时其{#cname}属性将缺省，因此可以表示任意按钮类，
 * 其实际{#cname}属性默认取决于上级容器控件，如在菜单内添加表示菜单项，在工具条内表示工具按钮。
 * @icon item
 * @implict
 */
Cls['Wb.Item'] = class item extends Wb.SimpleButton {
  static cls = 'w-menu-item';
  static protos = {
    /** @property {Boolean} - 是否为菜单项的标识。 @readonly */
    isMenuItem: true,
    menuAlign: 'tr?',
    keysTextTip: false,
    /** @property {Boolean} shortcutSite 是否保留显示快捷键所需的占位宽度。默认为null表示自动判断。 */
    enableToggle: false
  }
  static configs = {
    icon: 'null',
    rippleOnClick: undefined
  }
  /** @property {Boolean} clickHide 点击后是否隐藏菜单，false不隐藏，true隐藏，默认为null表示有子菜单时不隐藏否则隐藏。 */
  /***/
  init(configs) {
    let me = this, sc = me.shortcutSite, action = configs.action;

    super.init(configs);
    me.iconEl$ = me.addEl();
    me.textEl$ = me.addEl('w-mr-auto w-label');
    if (sc || sc == null && (configs.keys || configs.keysText || action?.keys || action?.keysText))
      me.shortcutEl = me.addEl('w-mi-sc');
    me.flagEl = me.addEl('w-menu-flag w-icon w-hidden');
    if (Wb.isTouch)
      me.mon({ contextmenu: me.fireClick });
    else
      me.mon({ mouseenter: me.onMouseEnter, mouseleave: me.onMouseLeave, contextmenu: me.fireClick });
  }
  /**
   * 鼠标离开时执行的方法。 @priv
   */
  onMouseLeave(e) {
    let me = this;
    me.showMenu.cancelDelay(me);
    if (!me.menu?.el?.contains(e.relatedTarget))
      me.hideMenu.delay(me, 200);
    me.active = false;
  }
  /** @property {Element} contextTarget 当作为上下文菜单条目显示时，根菜单关联的目标元素。未找到返回null。 */
  get contextTarget() {
    return this.parent?.contextTarget;
  }
  /** @property {Boolean} ellipsis 在菜单条目文本上添加"..."后缀，通常表示点击菜单将弹出对话框。 */
  /** @property {String} - 菜单条目上的文本。 */
  set menuText(value) {
    this.text = value;
  }
  /***/
  get menuText() {
    return this.text;
  }
  /***/
  set text(value) {
    let me = this;
    if (me.text$ !== value) {
      let textEl = me.textEl;
      me.text$ = value;
      if (value != null)
        textEl.textContent = value + (me.ellipsis ? '...' : '');
      else if (me.html$ != null)
        textEl.innerHTML = me.html$;
      else
        me.updateTextEl();
    }
  }
  /***/
  get text() {
    return super.text;
  }
  /**
   * @event checkchange 勾选状态变化时触发。
   * @param {Boolean} checked 是否勾选。null表示不显示勾选图标。
   */
  /** @property {String} checkGroup 菜单组名，相同组名的菜单仅允许单个菜单被勾选。 @key */
  /** @property {Boolean} - 是否在菜单前显示勾选图标。每次点击将切换勾选状态。可以指定{#checkGroup}来设置一组勾选，
   * 相同组名的菜单仅允许单个菜单被勾选。true显示勾选图标，false显示未勾选图标，null不显示勾选图标。 @key
   */
  set checked(value) {
    let me = this;
    if (me.checked$ !== value) {
      me.checked$ = value;
      if (value == null) {
        me.icon = 'null';
      } else {
        let checkGroup = me.checkGroup;
        if (checkGroup) {
          if (value) {
            me.parent.each(item => {
              if (item != me && item.checkGroup == checkGroup)
                item.checked = false;
            });
          }
          me.icon = value ? 'check2' : 'check1';
        } else {
          me.icon = value ? 'check7' : 'check5';
        }
      }
      me.fireEvent('checkchange', value);
    }
  }
  /***/
  get checked() {
    return this.checked$;
  }
  /***/
  onClickEvent(e) {
    let me = this, checkGroup = me.checkGroup;

    if (checkGroup || me.checked != null)
      me.checked = checkGroup ? true : !me.checked;
    super.onClickEvent(e);
    me.parent.fireEvent('menuclick', me, e)
  }
}
/**
 * 选项，用于点击时执行操作或关联组件来设置值。
 * 选项的相关示例见：{#%option.xwl|ide?openModule=example/comps/option.xwl}
 * @icon options
 */
Cls['Wb.Option'] = class option extends Wb.mixin.Icon(Wb.Component) {
  static cls = 'w-option';
  //editor, options先于value属性
  static firstNames = ['editor', 'options'];
  static events = { click: null };
  static protos = {
    allowClick$: false
  };
  /**
   * @event click @key
   */
  /** @property {Element} textWrapEl 标题包裹元素。 @priv */
  /***/
  init(configs) {
    let me = this;

    super.init(configs);
    me.textWrapEl = me.addEl('w-option-wrap');
    me.textEl$ = me.textWrapEl.addEl('w-label w-option-label');
    me.mon({
      [Event.tapDownName]: {
        fn(e) {
          me.tapDownTarget = e.target;
        },
        passive: false
      },
      click(e) {
        if (!me.allowClick && !me.flagEl?.contains(e.target))
          return;
        let drawer = me.optionsDrawer, editor = me.editor;
        if (drawer)
          drawer.show();
        else if (!editor?.el.contains(e.target) && !editor?.el.contains(me.tapDownTarget)) {
          if (editor instanceof Wb.Toggle)
            editor.value = !editor.value;
          me.handler?.call(me, e);
          me.fireEvent('click', e);
        }
      }
    });
  }
  /***/
  ready(configs) {
    let me = this, hasClick, hasOption;
    super.ready(configs);
    hasClick = me.events$?.click;
    hasOption = me.options;
    if (!me.flagIcon) {
      if (me.handler || hasClick)
        me.flagIcon = 'right2';
      else if (hasOption)
        me.flagIcon = 'menu';
    }
    if (configs.allowClick == null)
      me.allowClick = !!(me.editor instanceof Wb.Toggle || hasClick || hasOption);
  }
  /** @property {Boolean} - 组件是否允许点击。不允许点击的组件将不具有悬停及点击时的前景背景色，同时对组件本身的点击事件将被忽略，
   * 但仍然可以通过点击{#flagEl}来触发点击事件。默认为自动判断，即当存在可触发的事件或{#editor}是{#Wb.Toggle}时为true，
   * 否则为false。 @design @key
   */
  set allowClick(value) {
    this.applyCls(value, 'allowClick', 'w-option-click');
  }
  /***/
  get allowClick() {
    return this.allowClick$;
  }
  /** @property {Number/String} - 标签宽度。 @design */
  set labelWidth(value) {
    let me = this;
    if (me.labelWidth$ !== value) {
      me.labelWidth$ = value;
      me.textWrapEl.width = value;
    }
  }
  /***/
  get labelWidth() {
    return this.labelWidth$;
  }
  /** @property {String} - 标题下方对标题进行描述说明的文本。 */
  set description(value) {
    let me = this;

    if (me.description$ !== value) {
      me.description$ = value;
      if (value == null) {
        me.descEl?.remove();
        me.descEl = null;
      } else {
        me.descEl ??= me.textWrapEl.addEl('w-option-desc');
        me.descEl.textContent = value;
      }
    }
  }
  /***/
  get description() {
    return this.description$;
  }
  /** @property {Boolean} - 是否为按钮样式，该样式居中显示，且不显示标记图标。 @key @design */
  set buttonStyle(value) {
    this.applyCls(value, 'buttonStyle', 'w-option-btn');
  }
  /***/
  get buttonStyle() {
    return this.buttonStyle$;
  }
  /** @property {Element} - 获取显示图标的元素。 */
  get iconEl() {
    let me = this;
    return me.iconEl$ ??= me.el.insertElBefore(null, null, me.textWrapEl);
  }
  /** @property {Element} flagEl 选项右侧的标记图标元素。 @code */
  /** @property {IconString} - 选项右侧的标记图标。默认当设置{#handler}或{#click}事件时，值为"right2"。设置
   * 为null将隐藏该图标。 @design */
  set flagIcon(value) {
    let me = this, oldValue = me.flagIcon$;

    if (oldValue !== value) {
      me.flagIcon$ = value;
      if (value) {
        if (oldValue)
          me.flagIconEl?.removeCls('icon-' + oldValue);
        me.flagEl ??= me.addEl('w-option-flag');
        me.flagIconEl ??= me.flagEl.addEl('w-icon');
        me.flagIconEl.addCls('icon-' + value);
      } else {
        me.flagEl?.remove();
        me.flagEl = null;
        me.flagIconEl = null;
      }
    }
  }
  /***/
  get flagIcon() {
    return this.flagIcon$;
  }
  /** @property {String} text 文本标题。 @setter @key @design */
  /** @property {String} text 文本标题。 @getter @key @design */
  /** @property {String} html HTML标题。 @setter @design */
  /** @property {String} html HTML标题。 @getter @design */
  /** @property {String} - 显示在右侧的文本，通常用于显示值。 @key @design */
  set valueText(value) {
    let me = this;

    if (me.valueText$ !== value) {
      me.valueText$ = value;
      if (value) {
        me.hintEl ??= me.el.insertElBefore('w-option-value', null, me.editor?.el ?? me.flagEl);
        me.hintEl.textContent = value;
      } else {
        me.hintEl?.remove();
        me.hintEl = null;
      }
    }
  }
  /***/
  get valueText() {
    return this.valueText$;
  }
  /** @property {Express/Function} handler 设置组件点击时的执行方法。
   * @param {Event} e 事件对象。
   */
  /**
   * @event click 组件点击时触发。
   * @param {Event} e 事件对象。
   */
  /** @property {Wb.Toggle/Wb.Text/Wb.Number/Wb.Select/Wb.Date/Wb.Component} - 显示在左侧的编辑器组件，该组件的值
   * 即为整个组件的值。请注意点击在该组件上不会触发{#click}事件。 @key */
  set editor(value) {
    let me = this, oldValue = me.editor$;

    if (oldValue !== value) {
      oldValue?.destroy();
      value &&= Wb.create(Wb.apply({
        cls: 'w-no-shrink-s', el: me.el.insertElBefore(null, null, me.flagEl),
        events: {
          change(newValue, oldValue) {
            me.fireEvent('change', newValue, oldValue);
          }
        }
      }, value));
      me.editor$ = value;
    }
  }
  /***/
  get editor() {
    return this.editor$;
  }
  /** @property {Boolean/Object} - 组件的值。当设置{#editor}属性，值即为该编辑器的值。当设置{#options}属性值为
   * 选项的值，否则为undefined。 @key */
  set value(value) {
    let me = this, editor = me.editor;
    if (editor)
      editor.value = value;
    else {
      let view = me.optionsView;
      if (view) {
        view.value = value;
      }
    }
  }
  /***/
  get value() {
    let me = this, editor = me.editor;
    if (editor)
      return editor.value;
    else {
      let view = me.optionsView;
      if (view)
        return view.value;
    }
  }
  /**
   * @event change 当值发生变化时触发。仅当设置{#editor}或{#options}属性后有效。 @key
   * @param {String} value 当前值。
   * @param {String} oldValue 原值。
   */
  /** @property {Array} - 可选项列表。选择的值将同组件的{#value}属性绑定。如果选项值是{#Object}类型值，那么对象中
   * 的"value"属性表示值，"text"属性表示显示文本，"_icon"属性表示图标，"_img"属性表示图片图标。 @key */
  set options(value) {
    let me = this;
    if (me.options$ !== value) {
      me.options$ = value;
      me.optionsDrawer ??= new Wb.Drawer({
        layout: 'fit', items: {
          cname: 'checkView', border: false, events: {
            select(item) {
              let data = item.data, value = data.value;
              me.valueText = data.text;
              me.fireEvent('change', value, this.lastValue);
              this.lastValue = value;
            },
            itemclick() {
              me.optionsDrawer.close();
            }
          }
        }
      });
      me.optionsView ??= me.optionsDrawer.firstItem;
      me.optionsView.data = value;
    }
  }
  /***/
  get options() {
    return this.options$;
  }
  /** @property {String} - 选项窗口的标题。 */
  set optionsTitle(value) {
    this.optionsDrawer?.setter('title', value);
  }
  /***/
  get optionsTitle() {
    return this.optionsDrawer.title;
  }
}
/**
 * 视口组件。默认{#full}属性为true的面板，该组件在上级容器内全屏显示，即铺满整个容器。
 * @icon viewport
 */
Cls['Wb.Viewport'] = class viewport extends Wb.Panel {
  static configs = {
    full: true
  };
}
/**
 * 工具条，具有特定布局且默认下级组件为按钮的容器。在工具条下的控件其字体大小具有特定值，通常比常规状态下的要小。
 * 工具条的相关示例见：{#%toolbar-menu.xwl|ide?openModule=example/comps/toolbar-menu.xwl}
 * @icon toolbar
 */
Cls['Wb.Toolbar'] = class toolbar extends Wb.ScrolledCt {
  static cls = 'w-toolbar';
  static defaults = {
    cname: 'tool'
  };
  static protos = {
    overflowMenu$: false
  };
  static configs = {
    layout: 'row'
  };
  /** @property {Boolean} - 当按钮溢出时，是否显示溢出菜单。 */
  set overflowMenu(value) {
    if (this.overflowMenu$ !== value) {
      this.overflowMenu$ = value;
      this.setEvents(value, 'togglebutton', this.onToggleButton);
      this.onToggleButton(value ? !!this.afterBtn$ : false);
    }
  }
  /***/
  get overflowMenu() {
    return this.overflowMenu$;
  }
  /**
   * 滚动按钮切换时执行的方法。 @priv
   * @param {Boolean} visible 按钮是否可见。
   */
  onToggleButton(visible) {
    if (visible) {
      this.menuBtn ??= this.addFooter({
        cname: 'iconButton', icon: 'right3', cls: 'w-tb-menu-btn', weight: 120, menu: true,
        events: { beforeshowmenu: { fn: this.onBeforeshowmenu, scope: this } }
      });
    } else {
      this.menuBtn?.destroy();
      delete this.menuBtn;
    }
  }
  /**
   * 菜单显示前执行的方法。 @priv
   */
  onBeforeshowmenu() {
    let menu = this.menuBtn.menu, menuItems = [];
    menu.destroyAll();
    this.each(item => {
      if (item.visible) {
        if (item instanceof Wb.Divider)
          menuItems.push('-');
        else if (item instanceof Wb.Button) {
          menuItems.push({
            text: item.menuText ?? item.text, disabled: item.disabled, icon: item.icon,
            img: item.icon ? undefined : item.img, handler(e) {
              item.fireEvent('click', e);
              item.intoView();
            }
          });
        }
      }
    });
    menu.add(menuItems);
  }
  /** @property {Enum} - 预定义的工具条样式。
   * -'menu': 菜单列表样式。
   * -'padding': 工具条下的按钮加大间隙。
   */
  set type(value) {
    const verticals = ['menu'];
    let me = this;

    me.oldVertical ??= me.vertical;
    if (verticals.includes(value)) {
      me.vertical = true;
    } else {
      me.vertical = me.oldVertical;
    }
    this.applyCls(value, 'type', 'w-tbt-', this.bodyEl);
  }
  /***/
  get type() {
    return this.type$;
  }
}
/**
 * 分页工具条，用于对视图{#Wb.View}组件进行分页显示。
 * @icon pagenum
 * @noDesign
 */
Cls['Wb.PagingBar'] = class pagingBar extends Wb.Toolbar {
  static cls = 'w-pagingbar';
  static defaults = {
    cname: 'iconButton'
  };
  static protos = {
    /** @property {Number} - 页码按钮数量。小于3时值为3。 */
    pageButtonsCount: 10,
    /** @property {Boolean} - 是否显示导航按钮。默认为true。 */
    showNavigate: true,
    /** @property {Boolean} - 是否显示首页按钮。默认为true。 */
    showFirstButton: true,
    /** @property {Boolean} - 是否显示末页按钮。默认为true。 */
    showLastButton: true,
    /** @property {Boolean} - 是否显示页码编辑框。默认为true。 */
    showPageEdit: true,
    /** @property {Boolean} - 是否显示刷新按钮。默认为true。 */
    showRefreshButton: true,
    /** @property {Boolean} - 是否显示每页记录数菜单。默认为true。 */
    showPageSizeMenu: true,
    /** @property {Boolean} - 是否显示导出菜单。默认为true。 */
    showExportMenu: true,
    /** @property {Boolean} - 是否显示允许选择文本菜单。默认为true。 */
    showSelectMenu: true,
    /** @property {Boolean} - 是否显示列设置菜单。默认为true。 */
    showColumnsMenu: true,
    /** @property {Boolean} - 是否显示信息标签。默认为true。 */
    showInfoLabel: true,
    /** @property {Boolean} - 信息标签是否仅显示记录总数信息。默认显示记录范围和总数。 */
    totalOnly: false,
    /** @property {Boolean} - 是否显示页码按钮。 */
    showPageButtons: false
  };
  /** @property {Enum} docked 工具条添加到表格上时的停靠方位。默认为"top"。
   * -'top': 顶部。
   * -'bottom': 底部。
   */
  /** @property {Wb.View} view 需要分页的视图对象。 @code */
  /***/
  init(configs) {
    let me = this, items, view = me.view, paged = view.pageSize != -1, showPageSize, showCol, showExport, showSel;

    super.init(configs);
    me.on('buttonclick', me.onButtonClick);
    view.on('success', me.onViewSuccess, me);
    items = [];
    if (paged && me.showNavigate) {
      if (me.showFirstButton)
        items.push({ icon: 'begin', tip: Str.firstPage, cid: 'firstBtn', disabled: true, navMethod: 'firstPage' });
      items.push({ icon: 'left', tip: Str.previousPage, cid: 'previousBtn', disabled: true, navMethod: 'previousPage' },
        { icon: 'right', tip: Str.nextPage, cid: 'nextBtn', disabled: true, navMethod: 'nextPage' });
      if (me.showLastButton)
        items.push({ icon: 'end', tip: Str.lastPage, cid: 'lastBtn', disabled: true, navMethod: 'lastPage' });
    }
    if (paged && me.showPageEdit) {
      items.push(
        {
          cname: 'number', cid: 'pageNumEdit', noValue: true, width: '6em', minValue: 1, spinner: false,
          listeners: {
            keydown(e) {
              if (e.isGoKey && this.verify()) {
                view.pageIndex = this.value - 1;
                e.stopEvent();
              }
            }
          }
        }
      );
    }
    if (view.url && me.showRefreshButton) {
      if (items.length)
        items.push({ cname: 'divider', cid: 'divider1' });
      items.push({
        icon: 'refresh', tip: Str.refresh, cid: 'refreshBtn', handler() {
          view.localData = null;
          if (view.isTree)
            view.loadSelect();
          else
            view.reload();
        }
      });
    }
    showPageSize = paged && me.showPageSizeMenu;
    showExport = me.showExportMenu && view?.isGrid;
    showCol = me.showColumnsMenu && view?.isGrid;
    showSel = me.showSelectMenu;
    if (showPageSize || showCol || showExport || showSel) {
      let menuItems = [];
      items.push({
        icon: 'menu', cid: 'menuItem', menu: {
          items: menuItems, events: {
            show() {
              let selItem = me.textSelItem;
              if (selItem)
                selItem.checked = view.textSelectable;
            }
          }
        }
      });
      if (showPageSize) {
        menuItems.push({
          icon: 'pagenum',
          cid: 'pageSizeItem',
          text: Str.pageSize,
          menu: {
            events: {
              show(value) {
                me.pageSlider.value = view.pageSize;
              }
            },
            items: {
              cid: 'pageSlider', noValue: true, cname: 'slider', minValue: 0, maxValue: 1000, step: 10,
              suffix: true, width: '15em',
              events: {
                enddrag(value) {
                  value = Math.max(value, 1);
                  if (view.pageSize != value) {
                    view.pageSize = value;
                    view.reload();
                  }
                }
              }
            }
          }
        });
      }
      if (showSel) {
        menuItems.push({
          cid: 'textSelItem', checked: false, text: Str.textSelectable, events: {
            checkchange(checked) {
              view.textSelectable = checked;
            }
          }
        });
      }
      if (showExport) {
        if (menuItems.length)
          menuItems.push('-');
        if (view.pageSize != -1) {
          menuItems.push({
            icon: 'excel', text: Str.expCurrentTo.format('Excel'), handler() {
              view.exportExcel();
            }
          });
        }
        menuItems.push({
          icon: 'excel', text: Str.expAllTo.format('Excel'), handler() {
            view.exportExcel(true);
          }
        });
        if (view.pageSize != -1) {
          menuItems.push({
            icon: 'txt', text: Str.expCurrentTo.format('CSV'), handler() {
              view.exportFile();
            }
          });
        }
        menuItems.push({
          icon: 'txt', text: Str.expAllTo.format('CSV'), handler() {
            view.exportFile(true);
          }
        });
      }
      if (showCol) {
        if (menuItems.length)
          menuItems.push('-');
        menuItems.pushAll([
          {
            text: Str.toggleColumns, cid: 'toggleColItem', colRootItem: true, menu: {
              bindView: view, bindBar: me, events: { show: me.onColumnMenuShow, menuclick: me.onColumnMenuClick },
              items: {}
            }
          },
          {
            text: Str.freezeColumns, cid: 'freezeItem', colRootItem: true, menu: {
              bindView: view, bindBar: me, events: { show: me.onColumnMenuShow, menuclick: me.onColumnMenuClick },
              items: {}
            }
          }
        ]);
        if (view.stateId)
          menuItems.pushAll([
            { text: Str.addColumn, cid: 'addColItem', icon: 'add', handler() { view.addColumn(); } },
            { text: Str.save, cid: 'saveColItem', icon: 'save', handler() { view.saveColumns(); } },
            { text: Str.reset, cid: 'resetColItem', icon: 'undo', handler() { view.resetColumns(); } }]);
      }
    }
    if (me.showInfoLabel)
      items.push({ cname: 'label', cid: 'infoLabel', cls: 'w-ml-auto' });
    configs.items = items;
  }
  /***/
  ready(configs) {
    super.ready(configs);
    this.applyRefer();
  }
  /***/
  destroy() {
    let me = this;
    if (!me.destroyed)
      me.view.un('success', me.onViewSuccess);
    super.destroy();
  }
  /**
   * 列菜单显示时执行的方法。 @priv
   */
  onColumnMenuShow() {
    let me = this, createItems, view = me.bindView, columns,
      isFreeze = me.parent.cid == 'freezeItem', events = { menuclick: me.bindBar.onColumnMenuClick };

    createItems = cols => {
      let text, html, configs, items = [];
      cols.forEach((col, colIndex) => {
        if (col.hideInMenu)
          return;
        text = col.menuText || col.text;
        html = col.html;
        if (!text && !html && col.rowNum)
          text = '(' + Str.rowNum + ')';
        if (!text && !html)
          return;
        configs = { bindView: view, colIndex, isFreeze, clickHide: false };
        if (text)
          configs.text = text;
        else
          configs.html = html;
        if (isFreeze) {
          if (!col.items) {
            if (col.width < 0)
              configs.disabled = true;
            else
              configs.checked = col.freeze;
          }
        } else {
          configs.checked = col.visible;
        }
        if (col.items)
          configs.menu = { items: createItems(col.items), events };
        items.push(configs);
      });
      return items;
    };
    me.destroyAll();
    columns = view?.columns;
    if (columns?.length)
      me.add(createItems(columns));
    else
      me.add({ text: Str.none, disabled: true });
  }
  /**
   * 列菜单点击时执行的方法。 @priv
   * @param {Wb.Item} item 菜单条目。
   * @param {Event} e 事件对象。
   */
  onColumnMenuClick(item, e) {
    //col设置隐藏后将重建列因此需动态获取col
    let col, indexList = [], columns = item.bindView.columns, checked;

    checked = item.checked;
    item.bubble(p => {
      if (p.colRootItem)
        return false;
      else if (p instanceof Wb.Item)
        indexList.push(p.colIndex);
    });
    indexList.each(index => {
      col = columns[index];
      columns = col.items;
    }, true, true)
    if (item.isFreeze)
      col.freeze = checked ? (e.ctrlMeta ? 'right' : true) : checked;
    else
      col.visible = checked;
  }
  /**
   * 按钮点击时执行的方法。 @priv
   */
  onButtonClick(item) {
    if (item.pageButton) {
      //点击页码按钮
      this.view.pageIndex = (parseInt(item.text)) - 1;
    } else if (item.navMethod) {
      //点击导航按钮
      this.view[item.navMethod]();
    }
  }
  /**
   * 更新统计信息标签内容。
   */
  updateInfo() {
    let me = this, view = me.view;

    if (view.isTree)
      return;
    let text, fromIndex = view.pageSize * view.pageIndex$, count = view.items.length, total = view.total ?? count;

    if (total) {
      if (me.totalOnly) {
        text = Str.concat.format(Str.total, total.intText);
      } else {
        if (count)
          text = Str.pagingBarInfo.format((fromIndex + 1).intText, (fromIndex + count).intText, total.intText);
        else
          text = Str.pagingBarInfo.format(0, 0, total.intText);
      }
    } else {
      text = Str.noData;
    }
    me.infoLabel?.setter('text', text);
  }
  /**
   * 根据本地或远程数据刷新分页工具条.
   */
  refresh() {
    let me = this, view = me.view, localData = view.localData, pageSize = view.pageSize, total;

    total = localData ? localData.length : view.total;
    view.pageCount = pageSize == -1 ? (total ? 1 : 0) : Math.ceil(total / pageSize);
    me.onViewSuccess(view);
  }
  /**
   * 工具条关联视图数据加载成功时执行的方法。 @priv
   */
  onViewSuccess(parent) {
    let me = this, view = me.view, pageIndex = view.pageIndex$, pageNumEdit, pageCount = view.pageCount;

    //Return if parent is node
    if (parent != view)
      return;
    me.updateInfo();
    if (view.pageSize != -1) {
      let pageNums = me.showPageButtons;
      me.firstBtn?.setter('disabled', pageIndex == 0);
      me.previousBtn?.setter('disabled', pageIndex == 0);
      me.lastBtn?.setter('disabled', pageIndex >= pageCount - 1);
      me.nextBtn?.setter('disabled', pageIndex >= pageCount - 1);
      pageNumEdit = me.pageNumEdit;
      if (pageNumEdit) {
        pageNumEdit.value = pageIndex + 1;
        pageNumEdit.maxValue = Math.max(pageCount, 1);
        pageNumEdit.suffix = ' / ' + pageCount;
      }
      if (pageNums)
        me.loadPageButtons();
      me.setCls(pageNums, 'w-pagenum')
    }
    me.updateButtons();
  }
  /**
   * 根据工具条关联view相关属性重新生成分页按钮。 @priv
   */
  loadPageButtons() {
    let i, startPage, endPage, leftPageCount, rightPageCount, me = this, view = me.view,
      pageButtonsCount = Math.max(1, me.pageButtonsCount - 2), pageCount = view.pageCount, items = [],
      pageIndex = view.pageIndex$, curPage = pageIndex + 1;

    Wb.destroy(me.filter(item => item.pageButton));
    leftPageCount = pageButtonsCount / 2 | 0;
    rightPageCount = pageButtonsCount - leftPageCount;
    leftPageCount += Math.max(0, curPage + rightPageCount - pageCount);
    if (leftPageCount == 0 && curPage == pageCount)
      leftPageCount = 1;
    startPage = Math.max(2, curPage - leftPageCount);
    endPage = Math.min(startPage + pageButtonsCount - 1, pageCount - 1);
    items.push({
      text: 1,
      pageButton: true,
      cls: 'w-page-btn',
      disabled: 1 == curPage
    });
    if (startPage > 2) {
      items.push({
        cname: 'label',
        text: '...',
        pageButton: true,
        cls: 'w-page-btn'
      });
    }
    for (i = startPage; i <= endPage; i++) {
      items.push({
        text: i,
        pageButton: true,
        cls: 'w-page-btn',
        disabled: i == curPage
      });
    }
    if (endPage < pageCount - 1) {
      items.push({
        cname: 'label',
        text: '...',
        pageButton: true
      });
    }
    if (pageCount > 1) {
      items.push({
        text: pageCount,
        pageButton: true,
        cls: 'w-page-btn',
        disabled: pageCount == curPage
      });
    }
    me.insertAfter(items, me.previousBtn);
  }
}
/**
 * Tab组件的分页按钮工具条。
 */
Cls['Wb.TabBar'] = class tabBar extends Wb.Toolbar {
  static cls = 'w-tabbar';
  static configs = {
    overflowMenu: true
  };
  /***/
  onResize() {
    this.items.find(item => item.active)?.intoView();
    super.onResize();
  }
}
/**
 * 对视图进行操作的mixin类，可以mixin到{#Wb.View}和{#Wb.TreeItem}。
 */
Cls['Wb.mixin.View'] = Parent => class viewMixin extends Parent {
  /**
   * 在当前组件的某个下级组件之前插入一个或多个通过数据自动生成的下级组件。其引用被保存到{#items}属性中。
   * Example: 
   * 
   *     view.insertDataBefore({text: 'foo', myProp: 'bar'});
   *     view.insertDataBefore([{text: 'foo1', myProp: 'bar1'}, {text: 'foo2', myProp: 'bar2'}]);
   * 
   * @param {Object/Array} data 插入的数据。如果值为null那么该方法将直接返回null。
   * @param {Wb.Component} [refItem] 在此组件之前插入。如果缺省将添加到容器下。
   * @return {Wb.ViewItem/Wb.ViewItem[]} 插入的下级组件，如果插入多个返回的值为数组。
   */
  insertDataBefore(data, refItem) {
    if (!data) return null;
    let newRecs, isArray = Wb.isArray(data);

    if (isArray) {
      newRecs = [];
      data.forEach(data => {
        newRecs.push({ data });
      });
    } else {
      newRecs = { data };
    }
    return this.insertBefore(newRecs, refItem);
  }
  /**
   * 在当前组件的某个下级组件之后插入一个或多个通过数据自动生成的下级组件。其引用被保存到{#items}属性中。
   * @param {Object/Array} data 插入的数据。
   * @param {Wb.Component} [refItem] 在此组件之后插入。如果缺省将添加到容器下。
   * @return {Wb.ViewItem/Wb.ViewItem[]} 插入的下级组件，如果插入多个返回的值为数组。
   */
  insertDataAfter(data, refItem) {
    return this.insertDataBefore(data, refItem ? refItem.nextSibling : null);
  }
  /**
   * 在当前组件的下级组件指定索引位置插入一个或多个通过数据自动生成的下级组件。其引用被保存到{#items}属性中。
   * @param {Number} index 插入的索引位置。
   * @param {Object/Array} data 插入的数据。
   * @return {Wb.ViewItem/Wb.ViewItem[]} 插入的下级组件，如果插入多个返回的值为数组。
   */
  insertData(index, data) {
    return this.insertDataBefore(data, this.items$[index]);
  }
  /**
   * 在当前组件的下级组件尾部添加一个或多个通过数据自动生成的下级组件。其引用被保存到{#items}属性中。
   * @param {Object/Array} data 添加的数据。
   * @return {Wb.ViewItem/Wb.ViewItem[]} 添加的下级组件，如果添加多个返回的值为数组。
   */
  addData(data) {
    return this.insertDataBefore(data);
  }
  /**
   * 重新设置视图的数据。该方法同{#addData}和{#insertDataBefore}等方法的区别为：
   * -使用该方法后{#rendered}属性为true，表示数据已经被渲染过。
   * -不会触发{#itemchange}事件。当{#recordChanges}为true且[add]参数为null时，将清除增删改历史记录。
   * -根据{#autoSelect}属性选择首个条目。
   * -可以根据[add]参数设置数据添加方式。
   * @param {Object/Array} data 视图数据或其列表。
   * @param {Boolean} [add] 添加模式。true添加到最前，false添加到最后，null清除原数据后再添加。
   * @return {Wb.ViewItem/Wb.ViewItem[]} 添加的视图子项或其列表。
   */
  setData(data, add) {
    let items, me = this, leafColumns, fireChange;

    me.recordChangesCt++;
    me.suspendSelChange++;
    me.rendered ??= true;
    try {
      if (add == null) {
        fireChange = me.selection;
        me.destroyAll();
        me.removedRows = undefined;
      }
      if (me.reverseData && Wb.isArray(data))
        data = data.copy().reverse();
      items = me.insertDataBefore(data, add ? me.firstItem : null);
      if (me.autoSelect && me.isView && items.length) {
        items[0].select(false, false, true, true);
        fireChange = true;
      }
      if (me.isGrid && (leafColumns = me.leafColumns)) {
        if (leafColumns.some(col => col.mergeColsGroup))
          me.mergeCols();
        if (leafColumns.some(col => col.mergeRows))
          me.mergeRows();
      }
    } finally {
      me.recordChangesCt--;
      me.suspendSelChange--;
      if (fireChange)
        me.fireEvent('selectionchange');
    }
    return items;
  }
  /**
   * 获取当前组件所有下级组件的数据副本组成的数组。
   * @param {Boolean} [deep] 是否深度获取所有下级组件的数据。
   * @param {Wb.ViewItem[]} [excludeItems] 排除这些条目的数据。
   * @param {Boolean} [removeEmptyItems] 目录节点如果无子节点是否移除items属性。
   * @return {Array} 数据副本组成的数组，如果无数据返回空数组。
   */
  getData(deep, excludeItems, removeEmptyItems) {
    let data, result = [];

    this.items$.forEach(item => {
      if (excludeItems?.includes(item))
        return;
      data = Wb.copy(item.data$);
      result.push(data);
      if (deep && !item.leaf && item.loaded && (item.items.length || !removeEmptyItems))
        data.items = item.getData(true, excludeItems, removeEmptyItems);
    });
    return result;
  }
  /**
   * 按指定的方法对视图条目排序。如果需要排序并重新加载数据请使用{#Wb.View.sort}方法。
   * @param {Function} fn 排序的方法，详见{#%Array.sort|obj:Array/sort}方法说明。
   * @param {Wb.ViewItem} [.a] 排序的记录A。
   * @param {Wb.ViewItem} [.b] 排序的记录B。
   */
  sortItems(fn) {
    let me = this, items;

    items = me.items.copy().sort(fn);
    me.removeAll();
    me.add(items);
  }
  /**
   * 查找视图内具有指定字段值的首个直接下级组件。
   * Example: 
   * 
   *     view.findItem('field1', 'value1');
   * 
   * @param {String} fieldName 字段名称。
   * @param {Object} value 值。
   * @return {Wb.ViewItem} 找到的组件，如果未找到返回null。
   */
  findItem(fieldName, value) {
    return this.findBy(item => item.data[fieldName] === value);
  }
  /**
   * 查找视图内具有指定字段值的所有直接下级组件。
   * @param {String} fieldName 字段名称。
   * @param {Object} value 值。
   * @return {Wb.ViewItem[]} 找到的所有组件组成的数组，如果未找到返回空数组。
   */
  findItems(fieldName, value) {
    return this.filter(item => item.data[fieldName] === value);
  }
  /**
   * 查找视图内具有指定字段值的首个下级组件。
   * @param {String} fieldName 字段名称。
   * @param {Object} value 值。
   * @return {Wb.ViewItem} 找到的组件，如果未找到返回null。
   */
  downItem(fieldName, value) {
    return this.downBy(item => item.data[fieldName] === value);
  }
  /**
   * 查找视图内具有指定字段值的所有下级组件。
   * @param {String} fieldName 字段名称。
   * @param {Object} value 值。
   * @return {Wb.ViewItem[]} 找到的所有组件组成的数组，如果未找到返回空数组。
   */
  downItems(fieldName, value) {
    return this.downAllBy(item => item.data[fieldName] === value);
  }
}
/**
 * 视图组件，根据数据生成指定内容条目列表的组件。
 * 视图的相关示例见：{#%view.xwl|ide?openModule=example/comps/view.xwl}
 * @icon list-view
 */
Cls['Wb.View'] = class view extends Wb.mixin.View(Wb.Panel) {
  static defaults = {
    cname: 'viewItem'
  };
  static cls = 'w-view';
  static configs = {
    autoScroll: true,
    keyNavigate: true,
    overflowTip: true,
    tabIndex: 0
  };
  //itemTpl先于html，html先于data处理
  static firstNames = ['itemTpl', 'itemTplFn', 'html', 'data'];
  static protos = {
    /** @property {Boolean} - 是否是视图的标识。 @readonly */
    isView: true,
    /** @property {Boolean/String} - 是否根据按键内容自动选择首个查找到的条目。true查找内容为条目的
     * text属性，字符串表示查找内容为条目的该值属性。设置{#keyWalkingSensitive}可以区分大小写。
     */
    keyWalking: false,
    /** @property {Boolean} - 设置{#keyWalking}按键查找条目时是否区分大小写。 */
    keyWalkingSensitive: false,
    autoPaging$: null,
    /** @property {Enum} - 加载数据后是否自动滚动到最底部。相关属性请参考：{#reserveScrollbar}。
     * -true: 仅首次加载滚动到底部。
     * -false: 不滚动。
     * -'always': 每次加载后都滚动到底部。
     */
    autoToBottom: false,
    /** @property {Enum} - 当视图内容更新后是否保留滚动条位置。相关属性请参考{#autoToBottom}。
     * -true: 保留水平和垂直滚动条位置
     * -false: 重置水平和垂直滚动条位置
     * -'y': 仅保留垂直滚动条位置
     * -'x': 仅保留水平滚动条位置
     */
    reserveScrollbar: 'x',
    /** @property {Boolean} - 当使用{#setData}方法加载数据时，是否先逆向排序数据后再加载。 */
    reverseData: false,
    /** @property {Number} - 表示请求远程数据时的最大请求时间（毫秒），若超出该时间，请求会自动终止。\
     * 默认空值或 0，表示没有超时。 */
    timeout: null,
    /** @property {Enum} - 鼠标点击或按下时选择条目的方法。
     * -false: 鼠标点击或按下时不选择条目。
     * -true: 鼠标点击选择条目，touch模式下的默认项。
     * -null: 鼠标按下选择条目。desktop模式下的默认项。
     */
    clickSelect: Wb.isTouch ? true : null,
    /** @property {Boolean} - 当显示上下文菜单时，如果触发显示菜单的条目未选择是否自动选择该条目。默认为true。 */
    contextSelect: true,
    /** @property {Number} - 执行{#recordChanges}时的计数，计数为0时允许执行。 @priv */
    recordChangesCt: 0,
    recordChanges$: false,
    /** @property {Array} localData 本地数据。该属性同{#data}的区别为前者为本地全部页数据，后者为当前页的数据。\
     * 从远程获取数据请设置{#url}属性。动态设置该属性后，如果要立即更新数据请调用{#load}方法。 @key */
    /** @property {Boolean} allowDeselect 是否允许通过点击反选条目。false禁止，true允许。null自动判断，
     * 即单选禁止，多选允许。 */
    /** @property {Boolean} autoLoad 是否在组件就绪后自动加载远程数据。仅当组件无数据时有效。默认为true。 @key */
    autoLoad: true,
    /** @property {Boolean} - 当数据加载后是否自动选择首条有效的记录。 */
    autoSelect: false,
    /** @property {Object} defaultFields 默认字段元数据，该属性将自动合并到{#fields}。 */
    /** @property {Boolean} fireSelected 是否触发所有被选择条目的事件。true所有选择条目都触发，false仅目标条目
     * 触发。例如在允许多选的视图条目上双击时，设置true所有选择条目均将被触发。 */
    fireSelected: false,
    /** @property {String} - 数据列表节点路径。 */
    itemsPath: 'items',
    copyApp: false,
    /** @property {String} - 总记录数节点路径。 */
    totalPath: 'total',
    /** @property {String} - 字段元数据节点路径。 */
    fieldsPath: 'fields',
    /** @property {Number} - 当前视图总页数。 @readonly */
    pageCount: 0,
    /** @property {Number} pageSize 每页显示的记录数。-1表示显示全部即不分页。默认如果有{#pagingBar}值为100，否则为-1。 @key */
    pageIndex$: 0,
    /** @property {String} - 发起远程数据请求时开始行号参数名称，首行号为0。默认为"_from"。 */
    fromName: '_from',
    /** @property {String} - 发起远程数据请求时结束行号参数名称，首行号为0。默认为"_to"。 */
    toName: '_to',
    /** @property {String} - 发起远程数据请求时传递的每页记录数参数名称。默认为"_size"。 */
    pageSizeName: '_size',
    /** @property {String} - 发起远程数据请求时传递的排序参数名称。默认为"_sort"。 */
    sortName: '_sort',
    /** @property {String} pageIndexName 发起远程请求时传递的页索引参数名称，如果未指定不传递。首页索引为0。 */
    /** @property {Boolean/Object} - 加载过程中显示正在加载中的遮盖动画提示。false表示始终不显示；true表示
     * 始终显示；null表示视图加载时显示，非视图（如树节点）加载时不显示（默认值）。对象值表示mask配置对象。\
     * 详见{#Wb.mask}说明。 */
    showMask: null,
    /** @property {Number} - 大于0时挂起触发selectionchange事件。 @priv */
    suspendSelChange: 0,
    /** @property {Express/Object} params 发起远程请求时默认传递的参数对象。 */
    /** @property {Boolean} cached 是否把通过{#url}加载的远程数据在首次加载后作为{#localData}缓存到本地。如果需要重新从
     * 远程加载数据，可以设置{#localData}为null后再调用{#load}方法。设置该属性为true将不传递分页相关的参数。 @key
     */
    /** @property {String} url 加载远程数据时默认指向的url地址。设置本地数据请访问{#localData}属性。 @key */
    /** @property {Object} fields 视图中的数据字段原型定义对象。对象的键为字段名称，值为配置对象。
     * Example:
     *
     *     {field1: {type: 'date', format: 'y-M-d'}, field2: 'float'}
     * 
     * 配置对象属性为：
     * @param {String} [type] 字段类型，包括：
     * -'string': 字符串
     * -'int': 整数
     * -'float': 浮点数
     * -'bool': 布尔值，布尔值的转换规则见{#Wb.parseBool}方法。
     * -'date': 日期，格式请设置format属性，默认如果value长度小于8为{#Date.ymFormat}，小于11为{#Date.dateFormat}，
     * 其它为{#Date.dateTimeFormat}。
     * @param {String} [format] 日期格式，仅适用于type为date时。日期格式请参考{#Date.format}。
     * @param {Object} [value] 默认值。当值为undefined时的值。
     * @param {Function} [convert] 值转换函数。输入value和data参数，输出值为转换后的值。
     * @param {Object} .value 当前字段根据原型转换后的值。
     * @param {Object} .data 当前字段所在的记录所有字段值组成的对象。
     */
    /** @property {Boolean/String/Array} keyFields 视图中的关键字段名称列表。当获取记录原值时，将仅获取该列表中的字段
     * 值。如果为字符串表示逗号分隔的数组。true表示所有字段是关键字段，false表示所有字段均不是关键字段。默认为值长度不超过
     * 500的字段均为关键字段。
     */
    /** @property {Enum} - 使用智能导航的方向，仅对该方向导航时使用智能识别找到指定方向最近的条目。默认为'vertical'。
     * -'horizontal': 水平。仅对按左右方向键时导航到指定方向最近的条目。上下键按前一项/后一项条目进行导航。
     * -'vertical': 垂直。仅对按上下方向键时导航到指定方向最近的条目。左右键按前一项/后一项条目进行导航。
     * -'both': 水平和垂直。
     * -'none'/null: 无，UP/LEFT键选择最近前一项，DOWN/RIGHT键选择最近后一项。
     */
    smartNavigate: 'vertical',
    /** @property {Boolean} circleNavigate 是否循环导航，即首项的前一项为末项，末项的后一项为首项。 */
    /** @property {Boolean/String} - 在条目上回车时触发的事件名称。true表示自动判断，按"itemclick",
     * "itemdblclick"事件依次检查，如果注册了就触发该事件。False值表示不触发。默认为true。 */
    enterEvent: true,
    /** @property {Boolean} - 视图中的条目是否允许多选。 @key */
    multiSelect: false,
    keyNavigate$: false,
    /** @property {Boolean} - 是否允许通过拖动画框的方式选择条目。 @desktop */
    rectSelect: false,
    emptyHint$: false
  };
  /** @property {Number} total 视图期望加载的条目总数。通常由服务器端返回，用于分页。 @readonly */
  /**
   * @event update 视图条目数据通过{#set}方法更新时触发。仅当{#recordChanges}属性设置为true时有效。
   * @param {Wb.ViewItem} item 视图条目。
   * @param {Object} data 新数据。
   * @param {Object} oldData 原数据。
   */
  /**
   * @event itemdblclick 双击视图条目时触发。
   * @param {Wb.ViewItem} item 双击的视图条目。
   * @param {Event} e 事件对象。
   */
  /**
   * @event itemclick 单击视图条目时触发。
   * @param {Wb.ViewItem} item 单击的视图条目。
   * @param {Event} e 事件对象。
   */
  /** 
   * @event select 当有条目被选择时触发。获取所有选择的条目请访问{#selection}属性。
   * @param {Wb.ViewItem} item 选择的条目。
   */

  /** 
   * @event deselect 当有条目被取消选择时触发。获取所有选择的条目请访问{#selection}属性。
   * @param {Wb.ViewItem} item 取消选择的条目。
   */
  /** 
   * @event beforeselect 当有条目被选择前触发。返回false可以取消操作。
   * @param {Wb.ViewItem} item 选择的条目。
   */

  /** 
   * @event beforedeselect 当有条目被取消选择前触发。返回false可以取消操作。
   * @param {Wb.ViewItem} item 取消选择的条目。
   */
  /** 
   * @event selectionchange 当有条目被选择或取消选择时触发，当有批量选择/取消选择时该事件仅触发一次。\
   * 获取所有选择的条目请访问{#selection}或{#selections}属性。
   */
  /** @property {Boolean} loading 视图是否正在加载中。 @readonly */
  /** @property {Element} oldBodyEl 原始的{#bodyEl}。 @priv */
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    me.oldBodyEl = me.bodyEl;
    me.pageSize ??= configs.pagingBar ? 100 : -1;
    me.mon({
      el: me.bodyEl,
      click: me.onClick,
      //draggable事件也监听mousedown，要先于它执行
      [Event.tapDownName]: { fn: me.onMouseDown, capture: true, passive: false },
      dblclick: me.onDblClick
    });
    //使view和viewItem的view属性统一都指向view
    me.view = me;
  }
  /***/
  ready(configs) {
    let me = this;
    super.ready(configs);
    if (me.autoLoad && !me.hasChild)
      me.load();
  }
  /** @property {Boolean} - 视图内容为空时是否显示提示信息。 */
  set emptyHint(value) {
    this.applyCls(value, 'emptyHint', 'w-empty-hint');
  }
  /***/
  get emptyHint() {
    return this.emptyHint$;
  }
  /**
   * 加载数据后设置滚动条的位置。 @priv
   */
  setScrollPos() {
    let me = this, scrollEl = me.scrollEl, reserveScrollbar = me.reserveScrollbar, autoToBottom = me.autoToBottom;

    if (autoToBottom == 'always' || autoToBottom && !me.firstToBottom) {
      me.firstToBottom ??= true;
      me.scrollToBottom();
    } else if (reserveScrollbar == 'x') {
      scrollEl.scrollTop = 0;
    } else if (reserveScrollbar == 'y') {
      scrollEl.scrollLeft = 0;
    } else if (!reserveScrollbar) {
      scrollEl.scrollTop = 0;
      scrollEl.scrollLeft = 0;
    }
  }
  /** @property {Enum} - 选择和悬停在条目上时，条目是否使用指定的字体色和背景色。默认为null，即选择和悬停时都使用指定色。
   * -'active': 点击时使用指定色，同时在桌面模式下悬停时也使用指定色。
   * -'hover': 仅悬停时使用指定色。
   * -'select': 仅选择时使用指定色。
   * -'none': 选择和悬停时都不使用指定色，即字体色和背景色保持不变。
   */
  set selectColor(value) {
    this.applyCls(value, 'selectColor', 'w-scolor-');
  }
  /***/
  get selectColor() {
    return this.selectColor$;
  }
  /** @property {Boolean} - 视图内条目的鼠标样式是否使用指针。 */
  set cursorPointer(value) {
    this.applyCls(value, 'cursorPointer', 'w-view-pointer');
  }
  /***/
  get cursorPointer() {
    return this.cursorPointer$;
  }
  /**
   * @event captureclick 当设置{#captureClass}属性后，点击在指定元素上时执行的方法。
   * @param {Wb.ViewItem} item 点击的视图条目。
   */
  /** @property {String} - 指定元素点击行为的元素类名。当点击在该元素上时不执行默认的点击和选择条目行为，
   * 并触发{#captureclick}事件。设置falsy值将取消该设置。 */
  set captureClass(value) {
    let me = this, oldValue = me.captureClass$;
    if (oldValue !== value) {
      me.captureClass$ = value;
      if (!oldValue && value || oldValue && !value) {
        let capture = Wb.isDesktop;
        me.setListeners(value, {
          [Event.tapDownName]: { fn: me.captureTapDown, capture, passive: false },
          [Event.tapUpName]: { fn: me.captureTapUp, capture }
        });
      }
    }
  }
  /***/
  get captureClass() {
    return this.captureClass$;
  }
  /**
   * 当设置{#captureClass}时，tap down时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  captureTapDown(e) {
    let me = this;

    if (me.captureEl = e.target.closest(me.captureClass)) {
      // prevent loss focus in desktop mode & default select action
      me.captureX = e.x;
      me.captureY = e.y;
      e.stopEvent();
    }
  }
  /**
   * 当设置{#captureClass}时，tap up时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  captureTapUp(e) {
    let me = this, target = e.target;

    if (me.captureEl && me.captureEl == target.closest(me.captureClass) &&
      Math.abs(me.captureX - e.x) < 5 && Math.abs(me.captureY - e.y) < 5) {
      let item = target.getClosestComp(Wb.ViewItem);
      if (item) {
        me.fireEvent('captureclick', item);
        // prevent loss focus in touch mode & default select action
        e.stopEvent();
      }
    }
  }
  /** @property {Array} - 视图当前页显示的数据。访问本地数据请设置{#localData}属性，访问远程数据请
   * 设置{#url}属性。详见{#setData}方法说明。 */
  set data(data) {
    this.setData(data);
    this.setScrollPos();
  }
  /***/
  get data() {
    return this.getData(true);
  }
  /**
   * 显示保存确认对话框，并在确认后执行保存方法。
   * @param {Wb.Button} saveBtn 保存按钮。
   * @param {Function} callback 确认后执行的保存方法。
   * @param {Function} .reload 重新加载表格方法。
   * @param {String} [name] 提示的关键字名称。默认为[Str.list]。
   * @return {Boolean} 显示提示框后返回false，否则返回undefined。
   */
  saveConfirm(saveBtn, callback, name) {
    let view = this;
    if (saveBtn && !saveBtn.disabled) {
      Wb.choose(Str.modifiedConfirm.format(name ?? Str.list), btn => {
        if (btn == 'yes')
          callback(f => view.reload());
        else if (btn == 'no') {
          saveBtn.disabled = true;
          view.reload();
        }
      });
      return false;
    }
  }
  /** @property {Element} mouseDownEl 鼠标按下时的元素。 @priv */
  /**
   * 鼠标按下时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onMouseDown(e) {
    let me = this, target = e.target, item = me.findItemByEl(target), clickSelect;

    me.drawRectSeled = false;
    me.mouseDownEl = target;
    if (Wb.isDesktop && me.rectSelect && !item && !me.headerEl?.contains(target) && !target.isInput) {
      let bodyEl = me.contentEl || me.bodyEl, rect = bodyEl.getRect();
      me.startX = e.x - rect.x + bodyEl.scrollLeft;
      me.startY = e.y - rect.y + bodyEl.scrollTop;
      me.mon({
        el: DocEl,
        [Event.tapMoveName]: me.onDocMouseMove,
        [Event.tapUpName]: me.onDocMouseUp,
        wheel: { fn: me.onDocMouseMove, passive: true }
      });
    }
    if (item && !item.disabled) {
      let expander;

      expander = target.closest('.w-expander');
      if (expander && e.isLeftButton) {
        //点击tree的expander
        item.toggleExpand();
        return;
      }
      clickSelect = me.clickSelect;
      if (item.fixed || clickSelect != null && !clickSelect)
        return;
      //条目未选择在mousedown内处理，如果已选择在click事件内处理
      if (!item.selected$ && !clickSelect) {
        me.handleSelect(target, item, e);
        me.allowHandleSelect = false;
      } else {
        me.allowHandleSelect = true;
      }
    }
  }
  /**
   * 当允许{#rectSelect}时鼠标在DocEl上移动时执行的方法。 @priv
   * @return {e} 事件对象。
   */
  onDocMouseMove(e) {
    let me = this, rectEl = me.rectEl, bodyEl = me.contentEl || me.bodyEl,
      rect = bodyEl.getRect(), x, y, rawX = e.x, rawY = e.y;

    x = rawX - rect.x + bodyEl.scrollLeft;
    y = rawY - rect.y + bodyEl.scrollTop;
    if (!rectEl && (Math.abs(me.startX - x) > 10 || Math.abs(me.startY - y) > 10)) {
      DocEl.addCls('w-dragging');
      rectEl = me.rectEl ??= bodyEl.addEl('w-d-rect');
      bodyEl.addCls('w-rel');
    }
    if (rectEl) {
      let minX = Math.min(me.startX, x), minY = Math.min(me.startY, y), drawRect, ox, oy, el,
        scrollWidth = bodyEl.scrollWidth, scrollHeight = bodyEl.scrollHeight, isSel, ctrlMeta = e.ctrlMeta;

      rectEl.setRect({
        x: minX, y: minY,
        width: Math.min(Math.abs(me.startX - x), scrollWidth - minX - 1),
        height: Math.min(Math.abs(me.startY - y), scrollHeight - minY - 1)
      });
      ox = rectEl.offsetLeft;
      oy = rectEl.offsetTop;
      drawRect = { x: ox, y: oy, right: ox + rectEl.offsetWidth, bottom: oy + rectEl.offsetHeight };
      me.cascade(item => {
        if (item.disabled$ || !item.appeared$)
          return;
        el = item.el;
        ox = el.offsetLeft;
        oy = el.offsetTop;
        isSel = Wb.Math.intersect(drawRect, {
          x: ox, y: oy, right: ox + el.offsetWidth, bottom: oy + el.offsetHeight
        });
        if (ctrlMeta || isSel)
          me.drawRectSeled = true;
        if (!ctrlMeta || isSel)
          item.doSelect(isSel, true, false, false, true);
      });
    }
  }
  /**
   * 当允许{#rectSelect}时鼠标在DocEl上释放时执行的方法。 @priv
   * @return {e} 事件对象。
   */
  onDocMouseUp(e) {
    let me = this;

    if (me.rectEl) {
      DocEl.removeCls('w-dragging');
      (me.contentEl || me.bodyEl).addCls('w-rel');
      me.rectEl.remove();
      me.rectEl = null;
    }
    me.mun({
      el: DocEl,
      [Event.tapMoveName]: me.onDocMouseMove,
      [Event.tapUpName]: me.onDocMouseUp,
      wheel: me.onDocMouseMove
    });
  }
  /** @property {Array} sorterList 排序字段整理后的数组。 @priv */
  /** @property {Mix/String/Object/Array} - 排序的字段或其列表。如果值为字符串表示字段名；如果值为对象表示字段名和排序方式组成
   * 的对象，"name"表示字段名，"desc"表示是否为倒序。null表示无排序字段。设置该属性不会重新加载数据，如果需要排序并重新加载数据
   * 请使用{#sort}方法。
   * Example:
   *
   *     view.sorters = 'field1'; //指定排序字段名称
   *     view.sorters = {name: 'field2', desc: true}; //指定排序名和排序方式
   *     view.sorters = ['field3', {name: 'field4', desc: true}]; //指定多个排序字段
   * @key
   */
  set sorters(value) {
    let me = this;

    if (me.sorters$ !== value) {
      me.sorters$ = value;
      if (Wb.isObject(value)) {
        value = [value];
      } else if (Wb.isArray(value)) {
        value.forEach((item, i) => {
          if (!Wb.isObject(item))
            value[i] = { name: item };
        });
      } else if (value != null) {
        value = [{ name: String(value) }];
      } else
        value = null;
      me.sorterList = value;
    }
  }
  /***/
  get sorters() {
    return this.sorters$;
  }
  /**
   * 按指定的字段对视图数据进行排序并重新加载数据。如果仅需对视图条目进行排序请使用{#sortItems}方法。
   * @param {String/Object/Array} [sorters] 排序的字段，详见{#sorters}说明。缺省表示不排序。
   */
  sort(sorters) {
    this.sorters = sorters;
    this.reload();
  }
  /**
   * 插入新的记录到当前视图并选择该记录，如果为可编辑表格则自动启动首个有效单元格的编辑。如果存在分页条将更新分页条统计信息。
   * @param {Object} [data] 行数据。默认为空行。对象中的blob属性值将自动转换为"(blob)"文本。
   * @param {Boolean/Wb.ViewItem} [append] 是否为添加。true添加到末行，false插入到首行。如果为条目对象，插入到该
   * 条目之前。默认为添加到选择行后。
   * @param {Wb.TreeItem} [node] 添加节点时的父节点。仅操作树节点时有效。
   * @return {Wb.ViewItem} 新添加的行。
   */
  addRecord(data, append, node) {
    let me = this, parent = node ?? me, rec, col, pagingBar;

    Wb.each(data, (k, v) => {
      if (v instanceof Blob)
        data[k] = '(blob)';
    });
    data ??= {};
    if (append == null) {
      let selNode = me.selection;
      if (selNode?.parent == me)
        rec = parent.insertDataAfter(data, selNode);
      else
        rec = parent.addData(data);
    } else if (append.isViewItem)
      rec = parent.insertDataBefore(data, append);
    else if (append)
      rec = parent.addData(data);
    else
      rec = parent.insertData(0, data);
    if (me.editable) {
      col = me.leafColumns.find(col => col.editor && !col.editor.readonly);
      if (col)
        me.startEdit(rec, col);
    } else {
      rec.select();
    }
    pagingBar = me.pagingBar;
    if (pagingBar) {
      me.total++;
      pagingBar.updateInfo();
    }
    return rec;
  }
  /**
   * 添加新的记录到当前视图并选择该记录，如果为可编辑表格则自动启动首个有效单元格的编辑。如果存在分页条将更新分页条统计信息。
   * @param {Object} [data] 行数据。
   * @return {Wb.ViewItem} 新添加的行。
   */
  appendRecord(data) {
    return this.addRecord(data, true);
  }
  /**
   * 删除选择的所有行。如果存在分页条将更新分页条统计信息。
   * @param {Boolean} [noFocus] 是否不设置焦点。
   */
  delRecords(noFocus) {
    let me = this, selCount = me.selections?.length;

    if (selCount > 0) {
      let pagingBar;
      me.destroySelections(noFocus);
      pagingBar = me.pagingBar;
      if (pagingBar) {
        me.total -= selCount;
        pagingBar.updateInfo();
      }
    } else {
      Wb.tipSelect();
    }
  }
  /**
   * 显示确认窗口，并在确认后发起远程请求，执行删除选择的所有记录。
   * @param {String/Object} url 提交到后台的url地址或请求配置对象。
   * @param {String} [fieldName] 提示的字段名称。
   * @param {Object} [params] 提交到后台的参数。
   * @param {Function} [callback] 执行成功之后的回调方法。
   * @param {Boolean} [isUpload] 是否使用文件上传方式提交。默认为true。
   * @param {String} [action] 提示的动作名称。默认为Str.del。
   */
  removeRecords(url, fieldName, params, callback, isUpload, action) {
    let me = this, sels = me.selections, configs = Wb.isString(url) ? { url } : url;
    if (!sels.length) {
      Wb.tipSelect();
      return;
    }
    Wb.confirm(Wb.getActionHint(sels, fieldName, action), f => {
      Wb.ajax(Wb.apply({
        params: Wb.apply({ del: me.originData }, params),
        form: isUpload ?? true,
        success() {
          callback?.call(me, me);
          me.delRecords();
        }
      }, configs));
    });
  }
  /**
   * 显示对话框窗口，并在确认后发起远程请求，执行添加记录。
   * Example:
   *
   *     app.grid1.insertRecord(url, app.editWin);
   *
   * @param {String/Object} url 提交到后台的url地址或请求配置对象。
   * @param {Wb.Window} win 编辑数据的窗口。
   * @param {String} [subTitle] 编辑窗口的副标题。
   * @param {Object} [params] 提交到后台的参数。
   * @param {Function} [callback] 执行成功之后的回调方法。可用参数view和item。
   * @param {Boolean} [isUpload] 是否使用文件上传方式提交。默认为true。
   * @param {Boolean/Wb.ViewItem} [append] 是否为添加。true添加到末行，false插入到首行。如果为条目对象，插入到该
   * 条目之前。默认为添加到最后。
   * @param {Wb.TreeItem} [node] 添加节点时的父节点。仅操作树节点时有效。
   */
  insertRecord(url, win, subTitle, params, callback, isUpload, append, node) {
    let me = this, oldSuccess, configs = Wb.isString(url) ? { url } : Wb.copy(url);

    win.showAdd(subTitle, (win, values) => {
      let doRequest = f => {
        oldSuccess = configs.success;
        delete configs.success;
        Wb.ajax(Wb.apply({
          params: Wb.apply(values, params),
          form: isUpload ?? true,
          json: true,
          success(resp, ...args) {
            let item = me.addRecord(Wb.apply(values, resp), append ?? true, node);
            callback?.call(me, me, item);
            oldSuccess?.call(this, resp, ...args);
            win.hide();
          }
        }, configs));
      };
      if (node?.isNode)
        node.expand(doRequest);
      else
        doRequest();
    });
  }
  /**
   * 显示对话框窗口，并在确认后发起远程请求，执行修改记录。
   * Example:
   *
   *     app.grid1.editRecord(url, app.editWin, 'user_name');
   *
   * @param {String/Object} url 提交到后台的url地址或请求配置对象。
   * @param {Wb.Window} win 编辑数据的窗口。
   * @param {String} [fieldName] 作为窗口的副标题的字段名称。
   * @param {Object} [params] 提交到后台的参数。
   * @param {Function} [callback] 执行成功之后的回调方法。可用参数view和item。
   * @param {Boolean} [isUpload] 是否使用文件上传方式提交。默认为true。
   */
  editRecord(url, win, fieldName, params, callback, isUpload) {
    let me = this, rec = me.selection, oldSuccess, configs = Wb.isString(url) ? { url } : Wb.copy(url);
    if (!rec) {
      Wb.tipSelect();
      return;
    }
    let data = rec.data;
    win.showEdit(data, data[fieldName], (win, values) => {
      oldSuccess = configs.success;
      delete configs.success;
      Wb.ajax(Wb.apply({
        params: Wb.apply(rec.getDiffer(values), params),
        form: isUpload ?? true,
        json: true,
        success(resp, ...args) {
          rec.update(Wb.apply(values, resp));
          callback?.call(me, me, rec);
          oldSuccess?.call(this, resp, ...args);
          win.hide();
        }
      }, configs));
    });
  }
  /**
   * @event beforesort 本地排序前触发。返回false将阻止默认的排序行为，未返回false默认的排序行为仍将启用。
   * @param {Array} data 排序的数据。
   * @param {Array} sorters 排序的字段信息，详见{#sorters}属性说明。
   */
  /**
   * 本地排序时的默认方法。排序并重新加载数据请使用{#sort}方法，对视图条目排序请调用{#sortItem}方法。自定义排序逻辑请
   * 在{#beforesort}事件内处理。 @priv
   * @param {Array} data 排序的数据。
   * @param {Array} sorters 排序的字段信息，详见{#sorters}属性说明。
   */
  localSort(data, sorters) {
    if (this.fireEvent('beforesort', data, sorters) !== false) {
      let keys = [], desc = [];

      sorters.forEach(item => {
        keys.push(item.name);
        desc.push(item.desc);
      });
      data.mixSort(keys, desc);
    }
  }
  /** @property {Boolean} - 判断当前表格数据自最后一次{#commit}方法以来是否被修改。仅当{#recordChanges}属性为true时有效。 */
  get isModified() {
    return !!(this.cascadeSome(item => item.isNew || item.isDirty) || this.removedRows?.length);
  }
  /** @property {Object} - 自最后一次{#commit}方法以来所有增删改的数据副本组成的对象。仅当{#recordChanges}属性为true时有效。
   * -insert: 新增的数据。
   * -update: 更新的数据。其中以"#"开头的字段值为字段原值。
   * -del: 删除的数据。其中以"#"开头的字段值为字段原值。
   */
  get modifiedData() {
    let data, newData, oldData, hasChange, insert = [], update = [], del = [], me = this, result = {};

    //获取新增和修改记录
    me.cascade(item => {
      if (item.isNew) {
        data = {};
        Wb.each(item.data, (k, v) => {
          if (v != null && v !== '')
            data[k] = v;
        });
        insert.push(data);
      } else if (item.isDirty) {
        data = item.originData;
        newData = item.data;
        oldData = item.oldData;
        hasChange = false;
        Wb.each(newData, (k, v) => {
          if (oldData[k] !== v) {
            data[k] = v ?? null;
            hasChange = true;
          }
        });
        if (hasChange)
          update.push(data);
      }
    });
    //获取删除记录
    me.removedRows?.forEach(row => {
      del.push(row.originData);
    });
    if (insert.length)
      result.insert = insert;
    if (update.length)
      result.update = update;
    if (del.length)
      result.del = del;
    return result;
  }
  /**
   * 获取所有被修改的数据。同{#modifiedData}的区别为在回调函数中将读取blob字段的内容。
   * @param {Function} [fn] 回调函数。
   * @param {Object} .data 修改的数据。详见{#modifiedData}说明。
   * @return {Boolean} 是否存在blob字段，true存在，false不存在。
   */
  getModifiedData(fn) {
    let data = this.modifiedData, blobs = [], recs = [], fields = [], allRecs;

    allRecs = Wb.concat(data.insert, data.update);
    allRecs.forEach(rec => {
      Wb.each(rec, (k, v) => {
        if (v instanceof Blob) {
          blobs.push(v);
          recs.push(rec);
          fields.push(k);
        }
      });
    });
    Wb.readBlob(blobs, values => {
      values.forEach((value, i) => {
        recs[i][fields[i]] = value;
      });
      fn?.(data);
    });
    return blobs.length > 0;
  }
  /**
   * @event itemchange 视图条目增删改时触发。当设置{#recordChanges}属性为true时有效。
   * @param {Wb.ViewItem} item 条目。
   */
  /** @property {Boolean} - 是否记录对视图数据的增删改操作。访问{#modifiedData}可获取增删改数据。调用{#commit}方法可提交
   * 对数据的增删改。
   */
  set recordChanges(value) {
    let me = this;

    if (me.recordChanges$ !== value) {
      if (!value)
        me.commit();
      me.recordChanges$ = value;
      me.setEvents(value, {
        add: me.onAddData,
        remove: me.onRemoveData,
        update: me.onUpdateData
      });
    }
  }
  /***/
  get recordChanges() {
    return this.recordChanges$;
  }
  /**
   * 添加数据时执行的方法。 @priv
   * @param {Wb.ViewItem} child 添加的视图条目。
   */
  onAddData(child) {
    if (this.recordChangesCt == 0) {
      child.isNew = true;
      this.fireEvent('itemchange', child);
    }
  }
  /**
   * 删除数据时执行的方法。 @priv
   * @param {Wb.ViewItem} child 删除的视图条目。
   */
  onRemoveData(child) {
    if (!child.isNew && this.recordChangesCt == 0) {
      let rows = this.removedRows ??= [];
      rows.push(child);
      this.fireEvent('itemchange', child);
    }
  }
  /**
   * 更新数据时执行的方法。 @priv
   * @param {Wb.ViewItem} child 更新的视图条目。
   * @param {Object} data 新数据。
   * @param {Object} oldData 原数据。
   */
  onUpdateData(child, data, oldData) {
    if (!child.isNew && this.recordChangesCt == 0) {
      child.isDirty = true;
      child.oldData ??= oldData;
      this.fireEvent('itemchange', child);
    }
  }
  /**
   * 提交对所有视图数据的增删改。如果存在Blob类型的值，将转换为"(blob)"。仅当{#recordChanges}属性设置为true时有效。
   */
  commit() {
    let me = this, data, changed;
    if (!me.recordChanges)
      return;
    me.cascade(item => {
      data = item.data;
      changed = false;
      Wb.each(data, (k, v) => {
        if (v instanceof Blob) {
          data[k] = '(blob)';
          changed = true;
        }
      });
      if (item.isDirty)
        item.isDirty = undefined;
      if (item.isNew)
        item.isNew = undefined;
      if (item.oldData)
        item.oldData = undefined;
      if (changed)
        item.refresh();
    });
    me.removedRows = undefined;
  }
  /**
   * @event itembeforedrag 在条目拖动之前触发。返回false可阻止拖动。
   * @param {Wb.Draggable} draggable 拖动对象。
   * @param {Wb.ViewItem[]} .source 拖动的源条目列表。
   * @param {Event} e 事件对象。
   */
  /**
   * @event itemdrag 在条目有效拖动时触发。
   * @param {Wb.Draggable} draggable 拖动对象。
   * @param {Wb.ViewItem[]} .source 拖动的源条目列表。
   * @param {Wb.Component} .dest 拖动到的目标组件。
   * @param {Boolean} .allowDrop 是否允许放下。默认如果组件{#droppable}为true则允许放下。
   * @param {Boolean} .copy 拖放后是否复制条目。
   * @param {Boolean} .flatten 拖放后是否使所有条目都扁平化。
   * @param {String/Boolean} .mode 拖放的模式。
   * -'before': 放到目标节点前
   * -'after': 放到目标节点后
   * -'append': 添加到目标节点
   * -false: 将取消默认的拖放行为。如拖动仅复制数据可以设置为false。
   * @param {Boolean} .autoDrop 拖放结束后是否自动放下条目。默认true，如果设置为false将不自动放下条目，
   * 可在适当的时候调用draggable.acceptDrop()方法来放下条目。在未加载完成的节点上执行acceptDrop方法仅移去源节点。
   * @param {Boolean} .unselectItems 放下条目后，是否不自动选择放下的条目。
   * @param {Event} e 事件对象。
   */
  /**
   * @event itemdrop 在条目有效拖动后放下时触发。相关事件见{#*itemdrag}。
   * @param {Wb.Draggable} draggable 拖动对象。更多属性请参考{#*itemdrag}说明。
   * @param {Event} e 事件对象。
   */
  /** @property {Boolean/Object} - 设置组件是否可被拖动。可以通过访问{#draggableComp}获得{#Wb.Draggable}对象。
   * -布尔值: 是否可拖动。
   * -对象值: 为{#Wb.Draggable}的配置对象，更多属性请参考{#*itemdrag}说明。
   * 设置{#droppable}为true允许拖动后放下。
   */
  set draggable(value) {
    if (value) {
      let me = this, configs;
      configs = {
        dragCenter: false,
        dragElSize: false,
        removeLine() {
          this.lineEl?.remove();
          delete this.lineEl;
        },
        acceptDrop() {
          let data = this, isCopy = data.copy, destItem = data.dest, items, dropItems, view, fromView,
            source = data.source;

          items = [];
          source.forEach(item => {
            //exclude children items
            if (!data.flatten && source.some(p => p.contains(item, true)))
              return;
            if (isCopy)
              items.push(item.isNode ? item.itemsData : item.data);
            else
              items.push(item);
          });
          fromView = items[0]?.view;
          if (destItem?.isViewItem) {
            switch (data.mode) {
              case 'before':
                dropItems = isCopy ? destItem.parent.insertDataBefore(items, destItem) :
                  destItem.parent.insertBefore(items, destItem);
                break;
              case 'after':
                dropItems = isCopy ? destItem.parent.insertDataAfter(items, destItem) :
                  destItem.parent.insertAfter(items, destItem);
                break;
              case 'append':
                if (destItem.isNode) {
                  if (destItem.loaded) {
                    destItem.expand();
                    dropItems = isCopy ? destItem.addData(items) : destItem.add(items);
                  } else {
                    Wb.destroy(items);
                  }
                }
                break;
            }
          } else if (destItem instanceof Wb.View) {
            dropItems = isCopy ? destItem.addData(items) : destItem.add(items);
          }
          data.dropItems = dropItems ?? [];
          view = destItem.view;
          if (!data.unselectItems)
            view.selection = data.dropItems;
          view.pagingBar?.updateInfo();
          fromView?.pagingBar?.updateInfo();
        }, events: {
          drag(data, e) {
            let destComp, c, lineEl, mode, beforeMode, afterMode, vertical, destRect, ct,
              source = data.source, x = e.x, y = e.y, allowDrop = false, selfDroppable = me.droppable,
              dropGroup = me.dropGroup || selfDroppable, nullDroppable = dropGroup == null,
              targetEl = Wb.findEl(x, y), destItem = targetEl?.getClosestComp(Wb.ViewItem), viewComp;

            if (destItem)
              destComp = destItem;
            else if (viewComp = targetEl?.getClosestComp(Wb.View))
              destComp = viewComp;
            else
              destComp = targetEl?.getClosestComp();
            //判断是否允许放下
            destComp?.bubble(parent => {
              let droppable = parent.droppable;
              if (droppable != null) {
                if (nullDroppable || (parent.dropGroup || droppable) == dropGroup)
                  allowDrop = true;
                return false;
              }
            });
            data.allowDrop = allowDrop;
            if (destComp?.isView)
              data.mode = 'append';
            data.dest = destComp;
            destRect = destItem?.isNode ? destItem.contentEl.getRect() : destComp?.el?.getRect();
            ct = destItem ? destItem.view : destComp?.parent;
            if (ct) {
              //限定高宽到ct body
              let ctStyle;
              ct = ct.el;
              ctStyle = ct.computeStyle();
              destRect.width = destRect.width.constrain(0, ct.clientWidth
                - parseInt(ctStyle.paddingLeft) - parseInt(ctStyle.paddingRight));
              destRect.height = destRect.height.constrain(0, ct.clientHeight
                - parseInt(ctStyle.paddingTop) - parseInt(ctStyle.paddingBottom));
            }
            if (destItem) {
              if (destItem instanceof Wb.GridItem) {
                vertical = true;
              } else {
                let bodyEl = destItem.view.bodyEl, style = bodyEl.computeStyle();
                vertical = !(style.display == 'flex' && style.flexDirection.startsWith('row') ||
                  style.display == 'grid' && style.gridTemplateColumns.includes(' ') ||
                  style.float == 'left' || style.float == 'right');
              }
              if (destItem.isNode) {
                if (destItem.leaf)
                  c = (destRect.height / 2).constrain(3);
                else
                  c = (destRect.height / 3).constrain(3);
                if (y < destRect.y + c)
                  mode = 'before';
                else if (destItem.leaf || y > destRect.y + destRect.height - c)
                  mode = 'after';
                else
                  mode = 'append';
                if (!destItem.leaf && !destItem.expanded && !source.includes(destItem)) {
                  //自动展开节点
                  if (!destItem.autoExpandSet) {
                    destItem.autoExpandSet = true;
                    destItem.expand.delay(destItem, 800);
                    destItem.mon('mouseleave', f => {
                      delete destItem.autoExpandSet;
                      destItem.expand.cancelDelay(destItem)
                    }, true, { once: true });
                  }
                }
                if (data.allowDrop && source.some(item => item.contains(destItem)))
                  data.allowDrop = false;
              } else {
                if (vertical) {
                  c = (destRect.height / 2).constrain(3);
                  if (y < destRect.y + c)
                    mode = 'before';
                  else
                    mode = 'after';
                } else {
                  c = (destRect.width / 2).constrain(3);
                  if (x < destRect.x + c)
                    mode = 'before';
                  else
                    mode = 'after';
                }
                if (data.allowDrop && source.includes(destItem))
                  data.allowDrop = false;
              }
              data.mode = mode;
            }
            if (data.allowDrop)
              me.fireEvent('itemdrag', data, e);
            data.animate = !data.allowDrop;
            //取itemdrag后设置的mode值
            beforeMode = data.mode == 'before';
            afterMode = data.mode == 'after';
            if (beforeMode && source.includes(destComp?.previousSibling) ||
              afterMode && source.includes(destComp?.nextSibling))
              data.allowDrop = false;
            if (data.allowDrop && (beforeMode || afterMode)) {
              lineEl = data.lineEl ??= BodyEl.addEl();
              lineEl.setCls(!vertical, 'w-drag-vline');
              lineEl.setCls(vertical, 'w-drag-hline');
              lineEl.setRect(destRect);
              if (vertical) {
                if (afterMode)
                  lineEl.y = destRect.bottom;
                lineEl.height = 1;
                data.icon = beforeMode ? 'row-before' : 'row-after';
              } else {
                if (afterMode)
                  lineEl.x = destRect.right;
                lineEl.width = 1;
                data.icon = beforeMode ? 'column-before' : 'column-after';
              }
            } else {
              data.removeLine();
              data.icon = data.allowDrop ? 'add2' : 'delete4';
            }
          },
          beforedrag(data, e) {
            let text, item, items, length;

            item = e.target.getClosestComp(Wb.ViewItem);
            if (item) {
              items = me.selections;
              length = items.length;
              text = Str.selectedItems.format(length);
              if (length == 1)
                text = item.text || text;
              data.source = items;
              Wb.apply(data, {
                text: text, textCls: 'w-drag-bg', icon: 'delete4', targetEl: item.el
              });
              return me.fireEvent('itembeforedrag', data, e);
            } else
              return false;
          },
          enddrag(data, e) {
            data.removeLine();
            if (data.allowDrop) {
              if (data.autoDrop ?? true)
                data.acceptDrop();
              me.fireEvent('itemdrop', data, e);
            }
          }
        }
      }
      if (Wb.isObject(value))
        value = Wb.apply(configs, value);
      else
        value = configs;
    }
    super.draggable = value;
  }
  /***/
  get draggable() {
    return super.draggable;
  }
  /**
   * 销毁所有选择的条目，并选择候选节点{#candidateSelection}。
   * @param {Boolean} [noFocus] 是否不设置焦点。
   */
  destroySelections(noFocus) {
    let selItem = this.candidateSelection;
    this.selections.forEach(item => item.destroy());
    if (noFocus)
      selItem?.selectNoFocus();
    else
      selItem?.select();
  }
  /** @property {Wb.ViewItem} - 当选择的条目被删除时，建议的被选择候选条目。如果无候选条目返回null。 */
  get candidateSelection() {
    let sels = this.selections;

    return sels.lastItem?.nextSibling ?? sels[0]?.previousSibling ?? null;
  }
  /**
   * 根据当前视图的数据刷新视图。
   */
  refresh() {
    this.each(item => item.refresh());
  }
  /**
   * 获取响应对象数据中的columns列表。 @priv
   * @param {Object} response 响应对象。
   * @param {Array} rows 记录数组。
   * @return {Array} columns列表。未找到返回null。
   */
  getResponseColumns(response, rows) {
    let me = this, columns = Wb.getNS(me.columnsPath, response);

    if (!columns && rows?.length) {
      let row = rows[0];
      columns = [];
      if (Wb.isArray(row))
        row.forEach((f, i) => columns.push({ text: 'Column ' + (i + 1), fieldName: i }));
      else
        Wb.each(row, k => columns.push({ text: k, fieldName: k }));
    }
    if (me.isTree) {
      // set expander and filter valid fields
      const keyFields = ['_leaf', '_icon', '_img', 'items', '_cls', '_disabled', '_selected', '_visible', '_fixed',
        '_tip', '_color', '_expanded', '_checked']
      let fieldName, subField = me.subtextField;
      columns = columns.filter(col => {
        fieldName = col.fieldName;
        return !keyFields.includes(fieldName) && fieldName != subField;
      });
      if (!columns.some(col => col.expander)) {
        let col = columns.find(col => col.visible ?? true);
        if (col)
          col.expander = true;
      }
    }
    return columns;
  }
  /** @property {Object} lastParams 最后一次查询时使用的参数对象。 */
  /**
   * @event beforeload 发起远程数据请求之前的事件，返回false将取消请求。可以通过该事件传递参数。
   * @param {Object} configs 加载的选项对象。
   * @param {Wb.TreeItem} .node 发起请求的树节点，仅当{#Wb.TreeItem}发起请求时有效。
   * @param {Object} params 请求时提交的参数对象。该参数对象中设置的同名参数优先级高于{#params}和{#load}方法内指定的参数。
   */
  /** 
   * @event callback 远程数据加载完成后的事件，无论数据加载成功与否该事件均会被触发。
   * @param {Wb.View/Wb.TreeItem} parent 加载成功后添加子组件到该容器中。
   * @param {Wb.ViewItem[]} items 添加的子组件列表。
   * @param {Object} response 返回的值对象。
   * @param {XMLHttpRequest} xhr ajax请求对象。
   * @param {Event} e 事件对象。
   * @param {Boolean} successful 加载是否成功，true成功，false失败。
   */
  /** 
   * @event success 远程数据加载成功后的事件。
   * @param {Wb.View/Wb.TreeItem} parent 加载成功后添加子组件到该容器中。
   * @param {Wb.ViewItem[]} items 添加的子组件列表。
   * @param {Object} response 返回的值对象。
   * @param {XMLHttpRequest} xhr ajax请求对象。
   * @param {Event} e 事件对象。
   */
  /** 
   * @event failure 远程数据加载失败后的事件。
   * @param {Wb.View/Wb.TreeItem} parent 加载成功后添加子组件到该容器中。
   * @param {Wb.ViewItem[]} items 添加的子组件列表。当请求失败时该值始终为null。
   * @param {Object} response 返回的值对象。
   * @param {XMLHttpRequest} xhr ajax请求对象。
   * @param {Event} e 事件对象。
   */

  /** @property {Boolean} loaded 当前视图远程数据是否已经被加载。 @readonly */
  /** @property {Boolean} rendered 当前视图数据是否已经被渲染。 @readonly */
  /** @property {XMLHttpRequest} xhr 加载数据时使用的ajax请求对象。 @readonly */
  /**
   * 获取远程数据，成功后重新加载到视图中。设置本地数据请使用{#localData}属性，动态设置{#localData}后可以调用{#load}方法来更新数据。
   * 加载数据时可以通过如下的方法传递参数: 设置组件的{#params}，load方法configs参数中的params，
   * {#*beforeload}事件中的params，上述参数优先级从低到高。
   * 更多说明和参数请参考{#Wb.ajax}方法。
   * Example: 
   * 
   *     view.load({params: {foo: 123, bar: 'abc'}, success(){doSomething();}});
   * 
   * @param {Object/String} configs 配置对象或请求的url地址。
   * @param {Boolean} [.json] 指定返回响应数据的类型是否为json，
   * 如果值为true返回值将直接解码为json对象。默认为true。
   * @param {Wb.Container} [.node] 如果指定该值，将把本次请求的数据生成的视图条目添加到该值指定的容器中，
   * 否则添加到组件本身。
   * @param {Boolean} [.keepPageIndex] 是否保持当前页索引号。
   * @param {Boolean} [.add] 是否增量加载。true加载到最前，false加载到最后，null清除原数据后再加载。
   * @param {Function} [.callback] 数据加载完成后调用的方法，无论数据加载成功与否该方法均会被执行。\
   * 参数请参考{#*callback}事件说明。
   * @param {Function} [.success] 数据加载成功后调用的方法。参数请参考{#*success}事件说明。
   * @param {Function} [.failure] 数据加载失败后调用的方法。参数请参考{#*failure}事件说明。
   * @param {Function} [resolve] 数据加载完成后调用的方法，无论数据加载成功与否该方法均会被执行。
   * @return {Boolean} true正常执行加载，false加载被取消。
   */
  load(configs, resolve) {
    let pageSize, url, pageIndex, curIndex, newConfigs, mask, sysParams, showError, sorterList, timeout,
      node, parent, allParams, me = this, extraParams = {}, localData = me.localData;

    if (Wb.isString(configs))
      configs = { url: configs };
    else
      configs = Wb.copy(configs);
    node = configs.node;
    parent = node || me;
    if (!localData) {
      if (configs.comps) {
        //comps中的值有可能变化，需要把comps中值固化到参数中
        configs.params = Wb.apply(Wb.getValue(configs.comps), configs.params);
        //避免传递给ajax的comps
        delete configs.comps;
      }
    }
    //未设置url允许执行beforeload，可在beforeload中动态加载数据
    if (me.fireEvent('beforeload', configs, extraParams) === false)
      return false;
    url = me.url;
    //无url直接返回false
    if (!url && !localData)
      return false;
    pageSize = me.pageSize;
    sysParams = {};
    sorterList = me.sorterList;
    if (sorterList?.length)
      sysParams[me.sortName] = sorterList;
    if (!configs.keepPageIndex)
      me.pageIndex$ = 0;
    pageIndex = me.pendPageIndex ?? me.pageIndex$;
    if (pageSize != -1) {
      curIndex = pageIndex * pageSize;
      if (!me.cached) {
        sysParams[me.fromName] = curIndex;
        sysParams[me.toName] = curIndex + pageSize - 1;
        sysParams[me.pageSizeName] = pageSize;
        if (me.pageIndexName)
          sysParams[me.pageIndexName] = pageIndex;
      }
    }
    mask = me.showMask;
    //加载节点时默认不显示mask
    if (mask == null && node)
      mask = false;
    showError = me.showError;
    if (!localData) {
      allParams = Wb.apply({}, me.params, configs.params, extraParams);
      if (parent == me)
        me.lastParams = allParams;
    }
    timeout = me.timeout;
    newConfigs = Wb.apply({
      json: true,
      url,
      timeout,
      showError,
      mask
    }, configs, {
      success: null,
      failure: null,
      //合并所有参数，分页参数优先级最高
      params: localData ? null : Wb.apply(sysParams, allParams),
      callback(response, xhr, e) {
        let ok = xhr.ok, items = null, params, pendIndex = me.pendPageIndex;

        response ||= [];
        delete (node ?? me).loading;
        me.pendPageIndex = undefined;
        if (ok) {
          let total, rows, fields, columns, prepareData = me.prepareData, reloadColumns;

          if (prepareData)
            response = prepareData?.call(me, response);
          if (me.cached)
            me.localData = localData = response;
          if (pendIndex != null)
            me.pageIndex$ = pendIndex;
          me.resetRowNum?.();
          if (Wb.isArray(response)) {
            rows = response;
            total = response.length;
          } else {
            rows = Wb.getNS(me.itemsPath, response);
            total = Wb.getNS(me.totalPath, response);
            total = total ? parseInt(total) : (rows?.length ?? 0);
            fields = Wb.getNS(me.fieldsPath, response);
            if (fields)
              me.fields = fields;
          }
          reloadColumns = !me.columns || me.reloadColumns;
          if (me.isGrid && (reloadColumns || me.stateId && !me.rawColumns) &&
            (columns = me.getResponseColumns(response, rows))) {
            if (reloadColumns)
              me.columns = columns;
            if (me.stateId && (reloadColumns || !me.rawColumns))
              me.rawColumns = columns;
          }
          //本地数据排序和分页
          if (localData) {
            if (sorterList?.length)
              me.localSort(rows, sorterList);
            if (pageSize != -1) {
              rows = rows.slice(curIndex, curIndex + pageSize);
            }
          }
          me.total = total;
          me.pageCount = pageSize == -1 ? (total ? 1 : 0) : Math.ceil(total / pageSize);
          items = parent.setData(rows, configs.add);
          me.syncHeaderChecks?.();
          me.setScrollPos();
          me.loaded ??= true;
        }
        params = [parent, items, response, xhr, e];
        configs.callback?.call(me, ...params, ok);
        me.fireEvent('callback', ...params, ok);
        if (ok) {
          configs.success?.call(me, ...params);
          me.fireEvent('success', ...params);
        } else {
          configs.failure?.call(me, ...params);
          me.fireEvent('failure', ...params);
        }
        resolve?.call(me, { parent, items, response, xhr, e, ok });
        me.xhr = null;
      }
    });
    if (localData) {
      newConfigs.callback.call(me, localData, { ok: true }, {});
    } else {
      (node ?? me).loading = true;
      me.xhr = Wb.Request.ajax(newConfigs);
    }
    return true;
  }
  /**
   * 延时380ms后执行{#load}方法。
   * @param {...Object} args {#load}方法的参数列表。
   */
  delayLoad(...args) {
    this.load.delay(this, 380, ...args);
  }
  /**
   * 延时380ms后执行{#reload}方法。
   * @param {...Object} args {#load}方法的参数列表。
   */
  delayReload(...args) {
    this.reload.delay(this, 380, ...args);
  }
  /**
   * {#load}方法的Promise版本。无论请求成功或失败，Promise始终执行resolved。\
   * 如果方法被取消，Promise将返回resolve({canceled: true})。
   * Promise回调方法this指向当前视图组件，结果对象的参数如下：
   * -parent: 加载成功后视图条目添加到的容器对象。例如为视图，表格，树或树节点等。
   * -items: 添加的视图条目列表。
   * -response: 请求返回的对象。
   * -xhr: xhr对象。
   * -e: 事件对象。
   * -ok: 加载是否成功。
   * 详细说明请参考{#Wb.View.load}。
   * Example: 
   *
   *     view.loadx({params: {p1: 'abc', p2:123}}).then(
   *       result => {
   *          if(result.ok)
   *            this.doSomething(); //this指向view
   *          else if(result.canceled)
   *            console.warn('canceled');
   *          else
   *            console.warn('failed');
   *       }
   *     );
   *
   * @return {Promise} promise对象。
   */
  loadx(configs) {
    return new Promise(resolve => {
      if (!this.load(configs, resolve))
        resolve({ canceled: true });
    });
  }
  /**
   * 默认使用最后一次{#load}方法的参数，获取远程数据，成功后重新加载到视图中。
   * @param {Object} [configs] 配置对象，该对象中的参数将覆盖最后一次请求参数。\
   * 请参考{#load}方法的configs参数。
   * @param {Function} [resolve] 数据加载完成后调用的方法，无论数据加载成功与否该方法均会被执行。
   * 详细说明请参考{#Wb.View.load}。
   */
  reload(configs, resolve) {
    configs = Wb.copy(configs);
    configs.keepPageIndex ??= true;
    configs.params = Wb.apply({}, this.lastParams, configs.params)
    return this.load(configs, resolve);
  }
  /**
   * {#reload}方法的promise版本。无论请求成功或失败，Promise始终执行resolved。\
   * 请求成功或失败请通过xhr.ok判断。如果方法被取消，Promise将返回resolve({canceled: true})。
   * 详细说明请参考{#Wb.View.load}。
   * @return {Promise} promise对象。
   */
  reloadx(configs) {
    return new Promise(resolve => {
      if (!this.reload(configs, resolve))
        resolve({ canceled: true });
    });
  }
  /** @property {Boolean} - 是否允许使用按键进行导航和进行相关操作。默认为true。 */
  set keyNavigate(value) {
    let me = this;
    if (me.keyNavigate$ !== value) {
      me.keyNavigate$ = value;
      me.setListeners(value, 'keydown', me.onKeyDown);
    }
  }
  /***/
  get keyNavigate() {
    return this.keyNavigate$;
  }
  /**
   * 获取指定条目距离最近的前一条目。
   * @param {Wb.ViewItem} item 基准条目。
   * @return {Wb.ViewItem} 前一条目。
   * @priv
   */
  getPrevItem(item) {
    let prevItem = item.previousSibling;
    if (prevItem) {
      while (prevItem.lastItem && prevItem.expanded) {
        prevItem = prevItem.lastItem;
      }
      return prevItem;
    } else if (item.parent?.isViewItem) {
      return item.parent;
    }
    return null;
  }
  /**
   * 获取指定条目距离最近的后一项条目。
   * @param {Wb.ViewItem} item 基准条目。
   * @return {Wb.ViewItem} 后一条目。
   * @priv
   */
  getNextItem(item) {
    if (item.firstItem && item.expanded)
      return item.firstItem;
    else if (item.nextSibling)
      return item.nextSibling;
    else {
      let parentItem = item.parent;
      while (parentItem?.isViewItem) {
        if (parentItem.nextSibling)
          return parentItem.nextSibling;
        parentItem = parentItem.parent;
      }
    }
    return null;
  }
  /**
   * 查找指定条目指定方向最近的一个条目。
   * @param {Wb.ViewItem} item 条目。
   * @param {String} direction 方向。
   * -'up': 上
   * -'down': 下
   * -'left': 左
   * -'right': 右
   * @param {String} [smartMode] 智能模式。详见{#smartNavigate}。
   * @param {Boolean} [circleMode] 循环模式。详见{#circleNavigate}。
   * @param {Boolean} [containsInvalid] 是否包含禁用和隐藏的条目。
   * @return {Wb.ViewItem} 找到的条目。未找到返回null。如果item参数为null，该方法将直接返回首个条目。
   */
  findClosestItem(item, direction, smartMode, circleMode, containsInvalid) {
    if (containsInvalid)
      return this.doFindClosestItem(item, direction, smartMode, circleMode);
    while (item = this.doFindClosestItem(item, direction, smartMode, circleMode)) {
      if (!item.disabled$ && item.visible$ && item.appeared$ && !item.fixed)
        return item;
    }
    return null;
  }
  /**
   * 查找指定条目指定方向最近的一个条目。详见{#findClosestItem}说明。 @priv
   */
  doFindClosestItem(item, direction, smartMode, circleMode) {
    if (!item)
      return this.firstItem;
    if (circleMode) {
      if (item == this.firstItem && (direction == 'up' || direction == 'left'))
        return this.lastItem;
      if (item == this.lastItem && (direction == 'down' || direction == 'right'))
        return this.firstItem;
    }
    let findItem, horizontalNav = smartMode == 'horizontal', verticalNav = smartMode == 'vertical';

    //智能模式: 根据距离识别
    if (smartMode && smartMode != 'none') {
      switch (direction) {
        case 'up':
          if (horizontalNav)
            findItem = this.getPrevItem(item);
          else
            findItem = item.findSibling('up');
          break;
        case 'down':
          if (horizontalNav)
            findItem = this.getNextItem(item);
          else
            findItem = item.findSibling('down');
          break;
        case 'left':
          if (verticalNav)
            findItem = this.getPrevItem(item);
          else
            findItem = item.findSibling('left');
          break;
        case 'right':
          if (verticalNav)
            findItem = this.getNextItem(item);
          else
            findItem = item.findSibling('right');
          break;
      }
    } else {
      //简单模式: 上左选择最近前一项，下右选择最近后一项
      switch (direction) {
        case 'up':
        case 'left':
          findItem = this.getPrevItem(item);
          break;
        case 'down':
        case 'right':
          findItem = this.getNextItem(item);
          break;
      }
    }
    return findItem == item ? null : (findItem ?? null);
  }
  /** @property {Wb.Column} - 首个可编辑的列。无可编辑列返回null。 */
  get firstEditColumn() {
    return this.leafColumns.find(col => col.editor !== false);
  }
  /**
   * @event beforenavigate 在按键导航操作前触发。返回false可以取消按键导航。当{#keyNavigate}为true时允许按键导航。
   * @param {Event} e 事件对象。
   */
  /**
   * 视图上按键时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onKeyDown(e, options) {
    let me = this, direction, target = e.target, keyCode = e.code;

    if (!options?.forceFire && target != me.el && !me.bodyEl.contains(target))
      return;
    if (me.fireEvent('beforenavigate', e) === false)
      return;
    //Touch support
    if (e.keyCode == 13)
      keyCode = Keys.Enter;
    switch (keyCode) {
      case Keys.A:
        if (e.ctrlMeta && me.multiSelect) {
          me.selectAll();
          e.stopEvent();
          return;
        }
        break;
      case Keys.Enter:
        let selection = me.selection, enterEvent = me.enterEvent, processed,
          items = me.fireSelected ? me.selections : (selection ? [selection] : null);

        if (me.editable && me.enterEdit && selection) {
          let col = me.firstEditColumn;
          if (col) {
            me.startEdit(selection, col);
            processed = true;
          }
        }
        if (items?.length && enterEvent) {
          let eventName, canExpand = me.dblclickExpand;
          items.forEach(item => {
            item ??= me.firstItem;
            if (enterEvent === true) {
              if (canExpand && !item.leaf)
                eventName = 'itemdblclick';
              else
                eventName = me.events$?.['itemclick'] ? 'itemclick' : 'itemdblclick';
            } else eventName = enterEvent;
            me.fireEvent(eventName, item, e);
          });
          processed = true;
        }
        if (processed) {
          e.stopEvent();
          return;
        }
        break;
      case Keys.Up:
        direction = 'up';
        break;
      case Keys.Left:
        direction = 'left';
        break;
      case Keys.Down:
        direction = 'down';
        break;
      case Keys.Right:
        direction = 'right';
        break;
    }
    if (direction) {
      let item, curItem = me.selection, smartNavigate = me.smartNavigate,
        circleNavigate = me.circleNavigate;

      item = me.findClosestItem(curItem, direction, smartNavigate, circleNavigate);
      if (item) {
        if (e.shiftKey) {
          //选择
          if (curItem.selected$ && item.selected) {
            curItem.doSelect(false, true);
            item.focus();
          } else {
            item.doSelect(!item.selected$, true);
          }
        } else {
          //导航
          item.select();
        }
        e.stopEvent();
        return;
      }
    }
    if (me.keyWalking) {
      me.onKeyWalking(e);
    }
  }
  /**
   * 在视图上按键时，自动选择指定属性为所按键内容的首个条目。 @priv
   * @param {Event} e 事件对象。
   */
  onKeyWalking(e) {
    if (e.hasAssistKey || e.target.isInput)
      return;
    let key = e.key, keyCode = key.charCodeAt(0);

    //仅对可打印字符进行定位
    if (key.length == 1 && keyCode >= 32 && keyCode <= 126) {
      let me = this, walkLastKey = me.walkLastKey ?? '', now = new Date(),
        ignoreCase = !me.keyWalkingSensitive, item, query, value, field, target;

      if (ignoreCase)
        key = key.toLowerCase();
      field = me.keyWalking === true ? 'text' : me.keyWalking;
      query = me.walkLastKey = (now.elapse(me.walkLastTime) < 500) ? (walkLastKey + key) : key;
      if (me.isTree) {
        target = me.selection;
        if (target) {
          target = target.firstItem ? target : target.parent;
          item = target.downBy(item => {
            if (!item.disabled$ && item.visible$ && item.appeared$) {
              value = item.data[field];
              if (ignoreCase)
                value = value.toLowerCase();
              return value.startsWith(query);
            }
          });
          if (!item)
            target = null;
        }
      }
      target ??= me;
      item ??= target.downBy(item => {
        if (!item.disabled$ && item.visible$ && item.appeared$) {
          value = item.data[field];
          if (ignoreCase)
            value = value.toLowerCase();
          return value.startsWith(query);
        }
      });
      if (item)
        item.select();
      me.walkLastTime = now;
    }
  }
  /** @property {Enum/Object} - 分页工具条。对象值表示工具条配置对象，其docked属性表示位置（top表示顶部）。
   * -true: 生成底部默认工具条（默认值）。
   * -false: 不显示工具条。
   * -'top': 生成顶部默认工具条。
   * -'pageNums': 生成底部带页码按钮的工具条。
   * @design
   * @key
   */
  set pagingBar(value) {
    let me = this, bar = undefined;

    value ??= this.constructor.configs.pagingBar;
    me.pagingBar$?.destroy();
    if (value) {
      // new Wb.PagingBar(configs) to prevent refer cid to app
      let configs = { view: me };
      if (value == 'top') {
        bar = me.addHeader(new Wb.PagingBar(configs));
      } else if (value === true) {
        bar = me.addFooter(new Wb.PagingBar(configs));
      } else {
        if (value == 'pageNums')
          value = { showPageButtons: true, showPageEdit: false, showFirstButton: false, showLastButton: false };
        value = Wb.apply(configs, value);
        value = new Wb.PagingBar(value);
        bar = value.docked == 'top' ? me.addHeader(value) : me.addFooter(value);
      }
    }
    me.pagingBar$ = bar;
  }
  /** @property {Wb.PagingBar} */
  get pagingBar() {
    return this.pagingBar$;
  }
  /**
   * 加载指定页的数据。
   * @param {Number} pageIndex 页索引号，首页为0。
   * @param {Boolean/Object} [add] 是否增量加载。true加载到最前，false加载到最后，null清除原数据后再加载。如果为对象表示
   * 加载{#load}方法的参数。
   */
  loadPage(pageIndex, add) {
    let me = this, realIndex = pageIndex.constrain(0, me.pageCount - 1);
    if (me.pageIndex$ !== realIndex) {
      me.pendPageIndex = realIndex;
      me.reload(Wb.isObject(add) ? add : { add });
    }
  }
  /** @property {Number} pendPageIndex 未决的当前页索引号。加载成功后确认该索引号，否则拒绝该索引号。\
   * undefined表示该索引号已确定。 @priv */
  /** @property {Number} - 视图当前页的索引号，首页为0。 @code */
  set pageIndex(pageIndex) {
    this.loadPage(pageIndex);
  }
  /***/
  get pageIndex() {
    return this.pageIndex$;
  }
  /**
   * 加载上一页数据。
   * @param {Boolean/Object} [add] 是否增量加载。true加载到最前，false加载到最后，null清除原数据后再加载。如果为对象表示
   * 加载{#load}方法的参数。
   */
  previousPage(add) {
    let me = this;
    if (me.pageIndex > 0)
      me.loadPage(me.pageIndex - 1, add);
  }
  /**
   * 加载下一页。
   * @param {Boolean/Object} [add] 是否增量加载。true加载到最前，false加载到最后，null清除原数据后再加载。如果为对象表示
   * 加载{#load}方法的参数。
   */
  nextPage(add) {
    let me = this;
    if (me.pageIndex < me.pageCount - 1)
      me.loadPage(me.pageIndex + 1, add);
  }
  /**
   * 转到首页。
   */
  firstPage() {
    this.pageIndex = 0;
  }
  /**
   * 转到末页。
   */
  lastPage() {
    this.pageIndex = this.pageCount - 1;
  }
  /** @property {Boolean} - 当视图滚动到顶部或底部时是否自动加载下一页。true滚动到底部时加载下一页并把数据添加到底部，
   * false滚动到顶部时加载下一页并把数据添加到顶部，null不加载。 */
  set autoPaging(value) {
    let me = this;

    if (me.autoPaging$ !== value) {
      me.autoPaging$ = value;
      if (value == null) {
        me.reserveScrollbar = me.lastReserveValue;
      } else {
        me.lastReserveValue ??= me.reserveScrollbar;
        me.reserveScrollbar = true;
      }
      me.setListeners(value != null, me.scrollEl, 'scroll', me.onPagingScroll, me, { passive: true });
    }
  }
  /***/
  get autoPaging() {
    return this.autoPaging$;
  }
  /** @property {Boolean} - 当设置{#autoPaging}为true后视图滚动时执行的方法。 @priv */
  onPagingScroll() {
    let me = this, scrollEl = me.scrollEl, top = scrollEl.scrollTop, offset = 20;

    if (me.autoPaging) {
      if (top > scrollEl.scrollHeight - scrollEl.offsetHeight - offset && !me.loading)
        me.nextPage(false);
    } else {
      if (top < offset && !me.loading) {
        me.nextPage({
          add: true, success() {
            // allow to continue scroll
            if (me.pageIndex < me.pageCount - 1 && scrollEl.scrollTop <= 20)
              scrollEl.scrollTop = 30;
          }
        });
      }
    }
  }
  /***/
  set html(html) {
    let bodyEl = this.oldBodyEl;

    //允许通过设置html重置bodyEl，用于设置view内容的框架
    bodyEl.innerHTML = html;
    //如果指定w-items表示bodyEl
    bodyEl = bodyEl.find('w-items');
    if (bodyEl)
      this.bodyEl = bodyEl;
  }
  /***/
  get html() {
    return super.html;
  }
  /** @property {HtmlString/Wb.Template/Function} - 视图条目模板{#Wb.Template}，用于生成视图条目。当定义的首个元素
   * 包含"w-item"类名时，该元素将作为整个条目的元素。 @key */
  set itemTpl(value) {
    this.itemTpl$ = value instanceof Wb.Template ? value : new Wb.Template(value);
  }
  /** @property {Wb.Template} */
  get itemTpl() {
    return this.itemTpl$;
  }
  /** @property {Function} - 视图条目模板函数。同{#itemTpl}属性。 @key
   * @param {Object} data 模板数据。
   * @param {Element} [el] 条目元素。
   */
  set itemTplFn(value) {
    this.itemTpl$ = new Wb.Template(value);
  }
  /** @property {Wb.Template} */
  get itemTplFn() {
    return this.itemTpl$;
  }
  /** @property {Wb.ViewItem/Wb.ViewItem[]} - 设置视图中被选择的条目列表。 @code */
  set selection(items) {
    this.doSelect(items, true);
  }
  /** @property {Wb.ViewItem} - 获取被选择的具有焦点的条目，如果所有条目都未具有焦点返回被选择的首个条目。\
   * 如果未选择任何条目返回null。 */
  get selection() {
    let activeEl = document.activeElement, item;

    if (this.el.contains(activeEl) && (item = activeEl.getClosestComp(Wb.ViewItem)) && item.selected$)
      return item;
    return this.down(item => item.selected$);
  }
  /** @property {Wb.ViewItem[]} - 被选择的条目组成的数组。如果未选择返回空数组。 */
  set selections(value) {
    this.doSelect(value, true);
  }
  /***/
  get selections() {
    return this.downAllBy(item => item.selected$);
  }
  /** @property {Object} - 获取选择的首个条目数据对象。 */
  get selectionData() {
    return this.selection?.data;
  }
  /** @property {Array} - 获取选择的所有条目数据组成的数组。 */
  get selectionsData() {
    return this.selections.pluck('data');
  }
  /**
   * 批量设置指定条目的选择状态。
   * @param {Wb.ViewItem/Wb.ViewItem[]} items 条目列表。
   * @param {Boolean} selected 是否选择。
   * @param {Boolean} [keepExisting] 是否保留原选择的条目选择状态。仅当selected参数为true时有效。
   * @param {Boolean} [suppressEvent] 是否压制选择事件触发。
   * @param {Boolean} [preventFocus] 是否阻止设置首个条目焦点。
   * @param {Boolean} [preventScroll] 是否阻止滚动条滚动。
   * @param {Boolean} [preventForceView] 是否阻止强制展开上级节点并使其可见。默认单个条目为false，多个条目为true。
   */
  doSelect(items, selected, keepExisting, suppressEvent, preventFocus, preventScroll, preventForceView) {
    if (!items) {
      if (selected && !keepExisting)
        this.deselectAll();
      return;
    }
    let selChanged, me = this, pv;

    me.suspendSelChange++;
    try {
      items = Wb.toArray(items);
      pv = preventForceView ?? items.length > 1;
      if (items.length) {
        let firstItem;
        if (keepExisting) {
          items.forEach(item => {
            if (item.selected$ !== selected && item.doSelect(selected, true, suppressEvent, true, true, pv)) {
              selChanged ??= true;
            }
          });
        } else {
          me.cascade(item => {
            if (items.includes(item)) {
              if (item.selected$ !== selected && item.doSelect(selected, true, suppressEvent, true, true, pv))
                selChanged ??= true;
            } else {
              if (item.selected$ && item.doSelect(false, true, suppressEvent, true, true, pv))
                selChanged ??= true;
            }
          });
        }
        firstItem = items[0];
        if (!preventFocus)
          firstItem.el.focusOnly();
        if (!preventScroll)
          (firstItem.isNode ? firstItem.contentEl : firstItem.el).intoView();
      } else {
        if (selected && !keepExisting) {
          //取消选择全部
          me.cascade(item => {
            if (item.selected$ && item.doSelect(false, true, suppressEvent)) {
              selChanged ??= true;
            }
          });
        }
      }
    } finally {
      me.suspendSelChange--;
    }
    if (!suppressEvent && selChanged)
      me.fireEvent('selectionchange');
  }
  /**
   * 批量选择指定的视图条目。单个条目操作请直接访问条目的{#selected|Wb.ViewItem.selected}属性。
   * @param {Wb.ViewItem/Wb.ViewItem[]} items 条目列表。
   * @param {Boolean} [keepExisting] 是否保留原选择的条目选择状态。
   * @param {Boolean} [suppressEvent] 是否压制选择事件触发。
   * @param {Boolean} [preventFocus] 是否阻止设置首个条目焦点。
   * @param {Boolean} [preventScroll] 是否阻止滚动条滚动。
   * @param {Boolean} [preventForceView] 是否阻止强制展开上级节点并使其可见。默认为true。
   */
  select(items, keepExisting, suppressEvent, preventFocus, preventScroll, preventForceView) {
    this.doSelect(items, true, keepExisting, suppressEvent, preventFocus, preventScroll, preventForceView);
  }
  /**
   * 批量选择指定的视图条目并阻止设置焦点。单个条目操作请直接访问条目的{#selected|Wb.ViewItem.selected}属性。
   * @param {Wb.ViewItem/Wb.ViewItem[]} items 条目列表。
   * @param {Boolean} [keepExisting] 是否保留原选择的条目选择状态。
   * @param {Boolean} [suppressEvent] 是否压制选择事件触发。
   */
  selectNoFocus(items, keepExisting, suppressEvent) {
    this.doSelect(items, true, keepExisting, suppressEvent, true);
  }
  /**
   * 批量选择指定的视图条目并阻止设置滚动。单个条目操作请直接访问条目的{#selected|Wb.ViewItem.selected}属性。
   * @param {Wb.ViewItem/Wb.ViewItem[]} items 条目列表。
   * @param {Boolean} [keepExisting] 是否保留原选择的条目选择状态。
   * @param {Boolean} [suppressEvent] 是否压制选择事件触发。
   */
  selectNoScroll(items, keepExisting, suppressEvent) {
    this.doSelect(items, true, keepExisting, suppressEvent, false, true);
  }
  /**
   * 批量取消选择指定的视图条目。单个条目操作请直接访问条目的{#selected|Wb.ViewItem.selected}属性。
   * @param {Wb.ViewItem/Wb.ViewItem[]} items 条目列表。
   * @param {Boolean} [suppressEvent] 是否压制选择事件触发。
   */
  deselect(items, suppressEvent) {
    this.doSelect(items, false, true, suppressEvent);
  }
  /**
   * 批量选择所有的非禁用非隐藏的视图条目。
   * @param {Boolean} [suppressEvent] 是否压制选择事件触发。
   */
  selectAll(suppressEvent) {
    this.cascade(item => {
      if (item.visible$ && !item.disabled$ && item.appeared$)
        item.doSelect(true, true, suppressEvent, true, true);
    });
  }
  /**
   * 批量取消选择所有的视图条目。
   * @param {Boolean} [suppressEvent] 是否压制选择事件触发。
   */
  deselectAll(suppressEvent) {
    this.cascade(item => {
      item.doSelect(false, true, suppressEvent);
    });
  }
  /**
   * 获取从开始条目到结束条目之间的所有条目。
   * @param {Wb.ViewItem} beginItem 开始条目。
   * @param {Wb.ViewItem} endItem 结束条目。
   * @return {Wb.ViewItem[]} 获取的条目数组。
   */
  slice(beginItem, endItem) {
    if (beginItem == endItem)
      return [beginItem];
    let contain, slicedItems = [];
    this.cascade(item => {
      if (item == beginItem || item == endItem) {
        slicedItems.push(item);
        contain = !contain;
        if (!contain)
          return false;
      } else if (contain)
        slicedItems.push(item);
    });
    return slicedItems;
  }
  /**
   * 通过指定元素找到包含该元素的当前视图组件内的视图条目。
   * @param {Element} el 包含的元素。
   * @return {Wb.ViewItem} 找到的视图条目，未找到返回null。
   */
  findItemByEl(el) {
    let item, result, rootEl = this.el;

    el.bubble(parent => {
      //遍历到组件元素或w-editor时中断
      if (parent == rootEl || parent.containsCls('w-editor'))
        return false;
      item = parent.citem;
      if (item?.isViewItem && item.view == this) {
        result = item;
        return false;
      }
    });
    return result ?? null;
  }
  /** @property {Boolean} stickSelect 当点击视图选择条目时，是否反选且不取消已有的选择。 */
  /**
   * 处理选择操作。 @priv
   * @param {Element} target 目标元素。
   * @param {Wb.ViewItem} item 视图条目。
   * @param {Event} e 事件对象。
   */
  handleSelect(target, item, e) {
    let me = this, multiSelect = me.multiSelect, allowDeselect = me.allowDeselect ?? multiSelect, succ;
    if (multiSelect) {
      if (e.shiftKey) {
        if (!item.selected$) {
          me.doSelect(me.slice(me.selection || me.firstItem, item),
            true, e.ctrlMeta, null, true, true);
        }
        succ = true;
      } else if (e.ctrlMeta || me.stickSelect) {
        succ = item.doSelect(allowDeselect ? !item.selected$ : true, true, null, true, true);
      } else {
        succ = item.doSelect(true, null, null, true, true);
      }
    } else {
      if (me.isTree && e.shiftKey) {
        let checked = !e.ctrlMeta;
        me.slice(me.selection || me.firstItem, item).forEach(item => {
          if (item.checked != null)
            item.checked = checked;
        });
      }
      succ = item.doSelect((e.ctrlMeta || me.stickSelect) ? (allowDeselect ? !item.selected$ : true) : true,
        null, null, true, true);
    }
    //未成功防止设置焦点
    if (!succ)
      e.preventDefault();
  }
  /**
   * 视图点击时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onClick(e) {
    let me = this, allowDeselect = me.allowDeselect ?? me.multiSelect;
    me.triggerClick('itemclick', e);
    if (!me.drawRectSeled && allowDeselect && !e.target.getClosestComp(Wb.ViewItem))
      me.deselectAll();
  }
  /**
   * 视图双点击时执行的方法。
   * @param {Event} e 事件对象。
   * @priv
   */
  onDblClick(e) {
    this.triggerClick('itemdblclick', e);
  }
  /** @property {Boolean} allowHandleSelect 是否允许处理选择操作。 @priv */
  /**
   * 触发点击事件。 @priv
   * @param {String} eventName 事件名称。
   * @param {Event} e 事件对象。
   */
  triggerClick(eventName, e) {
    let target = e.target, item = this.findItemByEl(target);
    //鼠标按下时目标不一致直接返回，防止滑动产生误操作
    if (this.mouseDownEl != target || this.draggableComp?.startDrag)
      return;
    if (item && !item.disabled && !target.closest('.w-expander')) {
      if (eventName == 'itemclick' && this.allowHandleSelect)
        this.handleSelect(target, item, e);
      this.fireEvent(eventName, item, e);
      if (this.fireSelected) {
        this.selections.forEach(sub => {
          if (sub != item)
            this.fireEvent(eventName, sub, e);
        });
      }
    }
  }
}
/**
 * 表格头，用于管理和维护表格头。表格头可以显示多层的列。
 */
Cls['Wb.GridHeader'] = class gridHeader extends Wb.Base {
  /** @property {Wb.Column[]} columns 列对象列表，列的子列可通过对应列的{#Wb.Column.items}属性获取。 */
  /** @property {Wb.Column[]} leafColumns 所有的叶子列列表。 */
  /** @property {Element} tableEl 表格元素。 */
  /** @property {Boolean} fitTable 表格是否自适应宽度。 */
  /** @property {Wb.Grid} grid 关联的表格对象。 */
  /**
   * 构造函数。
   * @param {Wb.Grid} grid 表格头渲染到该组件。
   * @param {Array} columns 表格的原始列数据。
   */
  constructor(grid, columns) {
    let cols, td, tds, me, left = 0, right = 0, widthList;

    super(grid, columns);
    me = this;
    me.grid = grid;
    me.el = grid.headerEl;
    me.leafColumns = [];
    me.maxDepth = 0;
    columns = me.copyColumns(columns);
    me.prepareColumns(columns, null, 0);
    cols = me.renderColumns();
    //设置列的td
    tds = me.el.queryAll('td');
    cols.forEach((col, i) => td = col.td = tds[i]);
    //设置叶子列的相关属性
    cols = me.tableEl.queryAll('col');
    me.leafColumns.forEach((col, i) => {
      Wb.apply(col.rawCol, { isLeaf: true, col: cols[i], leafIndex: i });
    });
    //获取所有列实例
    me.columns = me.createColumns(columns, null, grid.app);
    //获取所有叶子列实例
    me.leafColumns = Wb.downAll(me.columns, col => col.isLeaf);
    //为所有列实例设置对应的leafColumns
    me.leafColumns.forEach(col => Wb.bubble(col, parent => parent.leafColumn = col));
    //设置左侧冻结列
    widthList = [];
    me.leafColumns.forEach((col, i) => {
      if (col.freeze) {
        td = col.td;
        td.addCls('w-freeze');
        col.freezeLeft = left;
        td.setStyle('left', left);
        widthList.push(col.realWidth);
        if (widthList.length > 1)
          left = 'calc(' + widthList.join(' + ') + ')';
        else
          left = widthList[0];
      }
    });
    //设置右侧冻结列
    widthList = [];
    me.leafColumns.each((col, i) => {
      if (col.freeze) {
        col.freezeRight = right;
        col.td.setStyle('right', right);
        widthList.push(col.realWidth);
        if (widthList.length > 1)
          right = 'calc(' + widthList.join(' + ') + ')';
        else
          right = widthList[0];
      }
    }, true, true);
  }
  /**
   * 创建列的副本数据，以避免污染原始列数据。 @priv
   * @param {Array} columns 原始列数据。
   * @return {Array} 列数据副本。
   */
  copyColumns(columns) {
    const clearProps = ['leafIndex', 'leafColumn', 'isLeaf', 'col', 'td'];
    let cols = [], copyCol, colItems, width, grid = this.grid, defaultWidth = grid.defaultColWidth, tagProperties;
    columns.forEach(col => {
      copyCol = { visible: true };
      if (grid.stateId)
        copyCol.fromColumn = col;
      if (col.rowNum)
        width = '3.5em';
      else if (col.checkBox)
        width = '3em';
      else
        width = defaultWidth;
      copyCol.width = width;
      Wb.apply(copyCol, col);
      if (tagProperties = col.tagProperties) {
        Wb.apply(copyCol, Wb.parse(tagProperties));
        copyCol.tagProperties = undefined;
      }
      if (col.rowNum)
        copyCol.editor = false;
      if (col.instanced) {
        clearProps.forEach(name => copyCol[name] = undefined);
        //把setter属性设置到copyCol
        Wb.each(copyCol, (k, v) => {
          if (k.endsWith('$')) {
            copyCol[k.slice(0, -1)] = v;
            delete copyCol[k];
          }
        });
      }
      cols.push(copyCol);
      colItems = col.items;
      if (colItems?.length)
        copyCol.items = this.copyColumns(colItems);
      else if (colItems)
        delete copyCol.items;
    });
    return cols;
  }
  /**
   * 渲染列头表格到元素。 @priv
   * @return {Array} 生成的单元格td对应的列对象列表。
   */
  renderColumns() {
    let colGroup, y, row, maxDepth, colspan, rowspan, col, align, autoWrap,
      grid = [], cols = [], fitTable = false, html = '', me = this;

    maxDepth = me.maxDepth;
    colGroup = '<colgroup>';
    me.leafColumns.forEach((leaf, i) => {
      colGroup += '<col>';
      //width小于0表示为flex值
      if (!fitTable && leaf.width < 0)
        fitTable = true;
      leaf.rowspan = maxDepth - leaf.y;
      do {
        leaf.colspan++;
        if (leaf.x == null) {
          leaf.x = i;
          y = leaf.y;
          row = grid[y];
          if (!row) {
            row = [];
            grid[y] = row;
          }
          row[i] = leaf;
        }
      } while ((leaf = leaf.parent));
    });
    me.fitTable = fitTable;
    colGroup += '</colgroup>';
    html = '<table class="w-header-table';
    if (fitTable)
      html += ' w-fit-table';
    html += '">';
    html += colGroup;
    grid.forEach(row => {
      html += '<tr>';
      row.forEach(cell => {
        if (!cell)
          return;
        col = cell.rawCol;
        cols.push(col);
        html += '<td class="w-text';
        align = col.titleAlign ?? col.align;
        if (col.items?.length)
          align ??= 'center';//多个子列默认居中
        if (align)
          html += ' w-ta-' + align;
        autoWrap = col.titleAutoWrap;
        if (autoWrap)
          html += ' w-' + autoWrap;
        html += '"';
        colspan = cell.colspan;
        if (colspan > 0) {
          html += ' colspan="';
          html += colspan + 1;
          html += '"';
        }
        rowspan = cell.rowspan;
        if (rowspan > 0) {
          html += ' rowspan="';
          html += rowspan + 1;
          html += '"';
        }
        html += '>';
        html += '</td>';
      });
      html += '</tr>';
    });
    html += '</table>';
    me.el.innerHTML = html;
    me.tableEl = me.el.query('table');
    return cols;
  }
  /**
   * 创建表格列对象。 @priv
   * @param {Array} columns 原始列数据。
   * @param {Wb.Column} parent 上级列。
   * @param {Object} app 组件app。
   */
  createColumns(columns, parent, app) {
    let gridColumn, td, gridColumns = [];

    columns.forEach(col => {
      col.gridHeader = this;
      if (parent)
        col.parent = parent;
      gridColumn = new Wb.Column(col);
      if (app && col.cid)
        app[col.cid] = gridColumn;
      td = col.td;
      if (td)
        td.colItem = gridColumn;
      gridColumns.push(gridColumn);
    });
    gridColumns.forEach(col => {
      if (col.items)
        col.items = this.createColumns(col.items, col, app);
    });
    return gridColumns;
  }
  /**
   * 根据列原始数据获得预处理后的所有可见列组成的数据。 @priv
   * @param {Array} columns 列原始数据。
   * @param {Object} parent 上级列。
   * @param {Number} depth 当前列深度。
   * @return {Array} 处理后的所有可见列组成的数据。
   */
  prepareColumns(columns, parent, depth) {
    let pcol, preparedColumns = [];

    this.maxDepth = Math.max(this.maxDepth, depth);
    columns.forEach(col => {
      if (!col.visible)
        return;
      pcol = {
        y: depth,
        colspan: -1,
        rowspan: -1,
        rawCol: col
      };
      if (col.width != null)
        pcol.width = col.width;
      if (parent)
        pcol.parent = parent;
      preparedColumns.push(pcol);
      if (Wb.down(col.items, col => col.visible))
        pcol.items = this.prepareColumns(col.items, pcol, depth + 1);
      else
        this.leafColumns.push(pcol);
    });
    return preparedColumns;
  }
}
/**
 * 表格列。用于对表格列进行配置和操作。
 * @icon column
 * @container
 * @noDesign
 */
Cls['Wb.Column'] = class column extends Wb.Configurable {
  static protos = {
    /** @property {Wb.Column[]} items 当前列的子列列表。 */
    /** @property {Boolean} resizable 列是否可以调整宽度。 */
    /** @property {Boolean} - 当导出表格数据时指定该列是否不导出。 */
    noExport: false,
    /** @property {Boolean} - 列是否可以通过点击排序。默认为true。 */
    sortable: true,
    /** @property {Boolean} - 当列设置{#checkBox}且通过点击使勾选变化时是否刷新当前条目整行数据。 */
    checkRefresh: false,
    /** @property {Boolean} headerCheck 当列设置{#checkBox}为可编辑时，是否在标头中显示复选框。默认为true。 */
    /** @property {String} menuText 显示在菜单上的文本。 */
    /** @property {Boolean} mergeRows 是否允许对相同内容的单元格进行合并行。 */
    /** @property {String} mergeColsGroup 合并列的组名。指定该值时，当具有相同组名紧邻的列且单元格内容相同时将进行合并列。 */
    /** @property {Boolean} - 列是否可以通过拖动调整位置。默认为true。 */
    draggable: true,
    freeze$: false,
    visible$: true
  };
  /** @property {Object} tagProperties 直接添加到组件的属性配置对象。 */
  /** @property {Object} tagEvents 直接添加到组件的事件配置对象。 */
  /**
   * Base64下载的渲染方法。
   * @param {Object} value 当前值。
   * @param {Object} data 记录数据。
   * @param {Wb.Column} col 当前列。
   * @param {Element} div 元素。
   */
  static base64DownloadRender(value, data, col, el) {
    if (!value)
      return;
    let a;
    el.cls = 'w-ta-center';
    a = el.addEl('w-link', 'a');
    a.textContent = Str.download;
    a.onclick = e => {
      Wb.downloadBase64(value, col.text);
      e.stopEvent();
    };
  }
  /**
   * 在指定元素上创建下载链接。
   * @param {Element} div 元素，在该元素下创建链接。
   * @param {String} fieldName 下载字段名称。
   * @param {String} [filename] 下载文件名称。
   * @param {String} [filesize] 下载文件大小。
   * @param {String} [text] 下载链接的文本。默认为filename。缺省为Str.download。
   * @return {Element} 创建的链接元素。
   */
  static createDownload(el, fieldName, filename, filesize, text) {
    let a;

    a = el.addEl('w-link', 'a');
    a.textContent = text || filename || Str.download;
    a.fieldName = fieldName;
    a.filename = filename;
    a.filesize = filesize;
    a.onclick = this.downloadHandler;
    return a;
  }
  /**
   * 在指定的文本元素节点下添加包含副文本的文本节点。
   * @param {Element} el 文本元素。
   * @param {String} text 文本。
   * @param {String} subText 副文本。
   */
  static addSubText(el, text, subText) {
    if (subText) {
      el.removeCls('w-text');
      if (el.tagName != 'TD')
        el = el.addEl('w-text-wrap')
      else
        el.addCls('w-text-wrap');
      el.addEl('w-text').textContent = text;
      el.addEl('w-sub-text').textContent = subText;
    } else {
      el.textContent = text;
    }
  }
  /**
   * 点击下载链接时执行的方法。 @priv
   */
  static downloadHandler(e) {
    let a = e.target, grid = a.getClosestComp(Wb.Grid), params = Wb.copy(grid.params), _meta, value;

    _meta = { fieldName: a.fieldName };
    if (value = a.filename)
      _meta.filename = value;
    if (value = a.filesize)
      _meta.size = value;
    params[grid.downloadName] = Wb.apply({ _meta }, a.getClosestComp(Wb.ViewItem).originData);
    Wb.download(grid.url, params, 'POST');
    e.stopEvent();
  }
  /**
   * 二进制列的渲染方法。
   * @param {Object} value 当前值。
   */
  static blobRender(value) {
    return Wb.isEmpty(value) ? '' : '(blob)';
  }
  /**
   * 按钮渲染方法。 @priv
   * @param {Object} value 当前值。
   * @param {Object} data 记录数据。
   * @param {Wb.Column} col 当前列。
   * @param {Element} div 元素。
   */
  static buttonRender(value, data, col, div) {
    let items = [], gridItem = this;

    div.removeCls('w-text');
    Wb.toArray(col.buttons).forEach(button => items.push(Wb.apply({ data, gridItem }, button)));
    this.addFooter({ cname: 'toolbar', cls: 'w-cell-bar', bodyCls: 'w-gapd2', justify: 'center', items }, div);
  }
  /**
   * 勾选渲染方法。 @priv
   * @param {Object} value 当前值。
   * @param {Object} data 记录数据。
   * @param {Wb.Column} col 当前列。
   * @param {Element} div 元素。
   */
  static checkRender(value, data, col, div) {
    let checkBox = col.checkBox;

    value = Wb.parseBool(value);
    switch (checkBox) {
      case 'roTrue':
      case 'roAll':
        if (value)
          div.addEl('w-icon icon-ok w-inline-flex');
        else if (checkBox == 'roAll')
          div.addEl('w-icon icon-delete w-inline-flex');
        break;
      default:
        if (value)
          div.addEl('w-box w-check-box w-check-checked w-inline');
        else
          div.addEl('w-box w-check-box w-inline');
        div.onclick = Wb.Column.onCheckClick;
    }
  }
  /**
   * check div点击时执行的方法。 @priv
   */
  static onCheckClick(e) {
    let el = e.currentTarget, rowEl = el.closest('.w-item'), row = rowEl.citem, view = row.view,
      col = view.leafColumns[el.parentNode.children.indexOf(el)], configs,
      fieldName = col.fieldName, value = Wb.parseBool(row.data[fieldName]);

    switch (col.checkBox) {
      case 'bool':
        value = !value;
        break;
      case 'int':
        value = value ? 0 : 1;
        break;
      case 'string':
        value = value ? 'false' : 'true';
    }
    configs = { value };
    if (view.fireEvent('beforeedit', row, col, configs) === false)
      return;
    value = configs.value;
    view.fireEvent('editing', row, col);
    if (col.checkRefresh) {
      row.set(fieldName, value);
    } else {
      row.setChecked(col, value);
      row.data[fieldName] = value;
    }
    col.syncHeaderCheck();
    view.fireEvent('edit', value, row, col);
  }
  /**
   * 表头check div点击时执行的方法。 @priv
   */
  static onHeaderCheckClick(e) {
    let td = e.currentTarget.parentNode, tr = td.parentNode, view = tr.getClosestComp(Wb.View),
      configs, allChecked, col = view.leafColumns.find(col => col.td == td), fieldName = col.fieldName,
      checkDiv = td.firstChild, value, newValue;

    e.stopEvent();
    value = checkDiv.containsCls('w-check-checked');
    switch (col.checkBox) {
      case 'bool':
        value = !value;
        break;
      case 'int':
        value = value ? 0 : 1;
        break;
      case 'string':
        value = value ? 'false' : 'true';
    }
    view.cascade(item => {
      allChecked ??= true;
      configs = { value };
      if (view.fireEvent('beforeedit', item, col, configs) === false) {
        if (allChecked && !Wb.parseBool(item.data[fieldName]))
          allChecked = false;
        return;
      }
      newValue = configs.value;
      view.fireEvent('editing', item, col);
      if (col.checkRefresh) {
        item.set(fieldName, newValue);
      } else {
        item.setChecked(col, newValue);
        item.data[fieldName] = newValue;
      }
      view.fireEvent('edit', newValue, item, col);
      if (allChecked && !Wb.parseBool(newValue))
        allChecked = false;
    });
    checkDiv.setCls(allChecked, 'w-check-checked');
  }

  /** @property {String} format 当值为日期或数值时输出的格式，请分别参考{#Date.format}或{#Number.format}。 */
  /** @property {Enum} align 列内容的对齐方式。如果需要设置列标题的对齐方式，请设置{#titleAlign}属性。
   * -'left': 左对齐
   * -'center': 居中
   * -'right': 右对齐
   */
  /** @property {Enum} titleAlign 列标题的对齐方式。默认同{#align}。
   * -'left': 左对齐
   * -'center': 居中
   * -'right': 右对齐
   */
  /** @property {Enum} verticalAlign 列内容的垂直对齐方式。默认为垂直居中对齐。
   * -'top': 顶对齐
   * -'middle': 居中对齐
   * -'bottom': 底对齐
   */
  /** @property {Wb.Item/Wb.Item[]} buttons 按钮配置对象或其列表，按钮data属性为对应{#条目|Wb.GridItem}的数据对象，
   * 按钮gridItem属性为对应{#条目|Wb.GridItem}。 */
  /** @property {Enum} checkBox 把值转换为勾选框的方法类型。勾选时默认不会更新整个{#Wb.ViewItem}，
   * 如需更新可设置{#checkRefresh}属性为true。
   * -'bool': 读取值使用{#Wb.parseBool}方法把值转换为布尔值，写入值为布尔值。
   * -'int': 读取值使用{#Wb.parseBool}方法把值转换为布尔值，写入值为整数值（0或1）。
   * -'string': 读取值使用{#Wb.parseBool}方法把值转换为布尔值，写入值为"false"或"true"。
   * -'roTrue': 只读模式，读取值使用{#Wb.parseBool}方法把值转换为布尔值，仅显示true的值，不写入值。
   * -'roAll': 只读模式，读取值使用{#Wb.parseBool}方法把值转换为布尔值，显示所有值，不写入值。
   *  @key 
   */
  /** @property {Boolean} expander 是否为带展开/收缩器的列。仅适用于{#Wb.Tree}的列时有效。 @key */
  /** @property {Enum} titleAutoWrap 列标题自动换行方式。设置内容自动换行请访问{#autoWrap}属性。
   * -'normal': 普通换行方式。
   * -'break-word': 如果行内没有多余的地方容纳该单词到结尾，则那些正常的不能被分割的单词会被强制分割换行。
   * -'break-all': 可在任意字符间断行。
   * -'nowrap': 和 normal 一样，连续的空白符会被合并。但文本内的换行无效。
   * -'pre': 连续的空白符会被保留。在遇到换行符或者br元素时才会换行。
   * -'pre-wrap': 连续的空白符会被保留。在遇到换行符或者br元素，或者需要为了填充行框盒子 (line boxes)时才会换行。
   * -'pre-line': 连续的空白符会被合并。在遇到换行符或者br元素，或者需要为了填充行框盒子 (line boxes)时会换行。
   * -'break-spaces': 与 pre-wrap的行为相同，除了行尾空格换行。
   */
  /** @property {String} fieldName 列关联的字段名称，默认列的值取自该字段。 @key */
  /** @property {Enum} autoWrap 列内容自动换行方式。设置标题自动换行请访问{#titleAutoWrap}属性。
   * -'normal': 普通换行方式。
   * -'break-word': 如果行内没有多余的地方容纳该单词到结尾，则那些正常的不能被分割的单词会被强制分割换行。
   * -'break-all': 可在任意字符间断行。
   * -'nowrap': 和 normal 一样，连续的空白符会被合并。但文本内的换行无效。
   * -'pre': 连续的空白符会被保留。在遇到换行符或者br元素时才会换行。
   * -'pre-wrap': 连续的空白符会被保留。在遇到换行符或者br元素，或者需要为了填充行框盒子 (line boxes)时才会换行。
   * -'pre-line': 连续的空白符会被合并。在遇到换行符或者br元素，或者需要为了填充行框盒子 (line boxes)时会换行。
   * -'break-spaces': 与 pre-wrap的行为相同，除了行尾空格换行。
   */
  /** @property {Enum} summary 统计本地数据{#localData}或当前页数据时当前列的汇总方式：
   * -'sum': 合计
   * -'avg': 平均数
   * -'count': 计数
   * -'max': 最大值
   * -'min': 最小值
   */
  /** @property {Boolean} hideInMenu 在菜单中是否隐藏该列。 */
  /** @property {Boolean} keyValue 是否显示对应的键值。仅当使用键值时有效。也可设置{#fieldName}为fieldName$来指定键值。 */
  /** @property {Boolean} rowNum 当前列是否为行号列。行号列具有专属的特性。 @key */
  /** @property {Boolean} isLeaf 是否为叶子列。 @readonly */
  /** @property {Wb.Text/Wb.Number/Wb.Date/Boolean} editor 该列单元格默认使用的编辑器，设置为false将不允许编辑。 @key */
  /** @property {Wb.Text} editorInstance 列关联的编辑器实例。 @priv */
  /** @property {Wb.GridHeader} gridHeader 关联的表格头对象。 @readonly */
  /** @property {Number} colspan 列跨度。 @readonly */
  /** @property {Number} rowspan 行跨度。 @readonly */
  /** @property {Boolean} leaf 是否为叶子列。 @readonly */
  /** @property {Wb.Column[]} items 子列对象列表。 @readonly */
  /** @property {Wb.Column} leafColumn 当前列代表的叶子列。如果是非多级列即为列本身。 @readonly */
  /** @property {Number} leafIndex 叶子列的索引号。仅对显示的列编号。从0开始。 @readonly */
  /** @property {String} realWidth 列的实际宽度。 @readonly */
  /** @property {Element} td 所在的单元格元素。 @readonly */
  /** @property {Number} x 单元格x坐标。 @priv */
  /** @property {Number} y 单元格y坐标。 @priv */
  /** @property {Enum} type 列数据类型，设置该属性将自动设置数据的显示格式，同时{#format}属性将无效。
   * -'text': 当地区域表示的数字字符串。
   * -'intText': 当地区域表示的整数字符串。
   * -'floatText': 当地区域以浮点数表示的字符串。
   * -'percent': 当地区域以百分比表示的字符串，小数固定保留2位。
   * -'percentInt': 当地区域以百分比表示的字符串，无小数位。
   * -'percentAuto': 当地区域以百分比表示的字符串，小数最多保留2位。
   * -'boolText': 布尔值。
   * -'enableText': 启用/禁用值。
   * -'usd': 当地区域美元货币。
   * -'cny': 当地区域人民币货币。
   * -'eur': 当地区域欧元货币。
   * -'gbp': 当地区域英镑货币。
   * -'jpy': 当地区域日元货币。
   * -'cad': 当地区域加元货币。
   * -'aud': 当地区域澳元货币。
   * -'hkd': 当地区域港元货币。
   * -'dateText': 日期格式，见{#Date.dateText}说明。
   * -'timeText': 24小时制时间格式，见{#Date.timeText}说明。
   * -'timeTextHM': 24小时制时分时间格式，见{#Date.timeTextHM}说明。
   * -'timeText12': 12小时制时间格式，见{#Date.timeText12}说明。
   * -'timeText12HM': 12小时制时分时间格式，见{#Date.timeText12HM}说明。
   * -'dateTimeText': 24小时制日期时间格式，见{#Date.dateTimeText}说明。
   * -'dateTimeTextHM': 24小时制时分日期时间格式，见{#Date.dateTimeTextHM}说明。
   * -'dateTimeText12': 12小时制日期时间格式，见{#Date.dateTimeText12}说明。
   * -'dateTimeText12HM': 12小时制时分日期时间格式，见{#Date.dateTimeText12HM}说明。
   * -'dateTimeMilliText': 24小时制日期时间和毫秒格式，见{#Date.dateTimeMilliText}说明。
   * -'dateTimeMilliText12': 12小时制日期时间和毫秒格式，见{#Date.dateTimeMilliText12}说明。
   * -'prettyText': 当地地区域根据当前时间显示的24小时制最佳时间表示。见{#Date.prettyText}说明。
   * -'prettyText12': 当地地区域根据当前时间显示的12小时制最佳时间表示。见{#Date.prettyText12}说明。
   * -'autoText': 当地区域以24小时制4位年和2位数月日时分秒表示的日期时间字符串。日期和时间使用空格连接。如果时分秒\
   * 为0仅显示日期部分。见{#Date.autoText}说明。
   * -'kb': 当地区域以KB为单位表示的字符串。
   * -'mb': 当地区域以MB为单位表示的字符串。
   * -'fileSize': 当地区域以MB/KB/B为单位表示的字符串。具体使用的单位取决于实际大小。
   * -'none': 不应用任何默认的类型设置。
   * @key
   */
  /** @property {Element} titleEl 标题元素。当存在headerCheck时该属性有效。 @priv */
  /***/
  init(configs) {
    let me = this, ct = me.constructor, type, checkBox = me.checkBox;

    super.init(configs);
    me.titleAlign ??= me.align;
    if (me.buttons)
      me.render ??= ct.buttonRender;
    if (checkBox) {
      me.render ??= ct.checkRender;
      me.align ??= 'center';
      me.editor = false;
      if (checkBox == 'bool' || checkBox == 'int' || checkBox == 'string') {
        me.headerCheck ??= true;
        if (me.headerCheck && configs.visible) {
          let td = me.td;
          td.cls = 'w-header-check';
          if (!me.titleAlign)
            td.addCls('w-ta-center');
          me.titleEl = td.insertEl(0, 'w-box w-check-box w-inline');
          me.titleEl.onclick = Wb.Column.onHeaderCheckClick;
        }
      } else {
        me.headerCheck = false;
      }
    } else
      me.headerCheck = false;
    me.resizable ??= true;
    type = me.type;
    if (type == 'boolText' || type == 'enableText')
      me.align = '';
  }
  /**
   * 根据当前列所有条目的复选框状态同步表头复选框状态。
   */
  syncHeaderCheck() {
    let me = this;
    if (!me.headerCheck)
      return;
    let checked, fieldName = me.fieldName, grid = me.gridHeader.grid;

    checked = grid.firstItem && !grid.cascadeSome(item => !Wb.parseBool(item.data[fieldName]));
    me.td.firstChild.setCls(checked, 'w-check-checked');
  }
  /**
   * 显示列。
   */
  show() {
    this.visible = true;
  }
  /**
   * 隐藏列。
   */
  hide() {
    this.visible = false;
  }
  /** @property {String} text 纯文本列标题。设置HTML标题请访问{#html}。 @key */
  set text(value) {
    let me = this;

    if (me.text$ !== value) {
      me.text$ = value;
      let td = me.titleEl || me.td;
      if (td)
        td.textContent = value;
    }
  }
  /***/
  get text() {
    return this.text$;
  }
  /** @property {String} html HTML格式列标题。设置纯文本标题请访问{#text}。 */
  set html(value) {
    let me = this;

    if (me.html$ !== value) {
      me.html$ = value;
      let td = me.titleEl || me.td;
      if (td)
        td.innerHTML = value;
    }
  }
  /***/
  get html() {
    return this.html$;
  }
  /** @property {Boolean} - 列是否可见。 @key */
  set visible(value) {
    let me = this;
    if (me.visible$ !== value) {
      let fromColumn;

      me.visible$ = value;
      fromColumn = me.fromColumn;
      if (fromColumn)
        fromColumn.visible = value;
      me.refreshColumns();
    }
  }
  /***/
  get visible() {
    return this.visible$;
  }
  /**
   * 深度判断该列是否隐藏。包含该列在内的任意上级列隐藏即判定为隐藏
   * @return {Boolean} true可见，false隐藏。
   */
  isVisible() {
    return !Wb.up(this, p => !p.visible$);
  }
  /** @property {Boolean} - 列是否是冻结的，冻结列在不可见时将固定显示在两侧且不随滚动条滚动。该属性仅叶子列
   * 有效。请注意：不要设置弹性列为冻结列。
   * @key */
  set freeze(value) {
    let me = this;
    if (me.freeze$ !== value) {
      let fromColumn;

      me.freeze$ = value;
      fromColumn = me.fromColumn;
      if (fromColumn)
        fromColumn.freeze = value;
      me.refreshColumns();
    }
  }
  /***/
  get freeze() {
    return this.freeze$;
  }
  /**
   * 如果表格未在更新状态中更新表格列。 @priv
   */
  refreshColumns() {
    let grid = this.gridHeader?.grid;
    if (grid && !grid.columnsLoading)
      grid.refreshColumns();
  }
  /** @property {Function/String} - 自定义输出函数，可以通过该函数设置数据，转换数据或返回输出值。函数的this指
   * 向{#Wb.ViewItem}条目。 @key
   * Example:
   *
   *     data._icon = 'user'; //设置图标
   *     return 'user: '+ value; //在输出值前加'user: '前缀
   *
   * @param {Object} value 当前字段值。
   * @param {Object} data 当前行所有字段值组成的对象。
   * @param {Wb.Column} column 当前列对象。
   * @param {Element} el 当前单元格元素。
   * @return {Object} 当前单元格输出的值。返回undefined表示不输出任何值。
   */
  set render(value) {
    if (Wb.isString(value))
      value = Wb.parse(value);
    this.render$ = value;
  }
  /***/
  get render() {
    return this.render$;
  }
  /** @property {Function/String} - 合计行自定义输出函数，可以通过该函数设置数据，转换数据或返回输出值。函数的this指
   * 向表格。
   * Example:
   *
   *     return 'avg: '+ data.summaryField / data.countField;
   *
   * @param {Object} value 当前字段值。
   * @param {Object} data 当前行所有字段值组成的对象。
   * @param {Wb.Column} column 当前列对象。
   * @param {Element} el 当前单元格元素。
   * @return {Object} 当前单元格输出的值。返回undefined表示不输出任何值。
   */
  set summaryRender(value) {
    if (Wb.isString(value))
      value = Wb.parse(value);
    this.summaryRender$ = value;
  }
  /***/
  get summaryRender() {
    return this.summaryRender$;
  }
  /** @property {Wb.Text/Wb.Number/Wb.Date/Boolean} - 该列单元格默认使用的编辑器，设置为false将不允许编辑。 @key */
  set editor(value) {
    let me = this, tags, script;

    if (tags = value?.tagProperties) {
      Wb.apply(value, Wb.parse(tags));
      value.tagProperties = undefined;
    }
    if (script = value?.validateScript)
      value.validator = Wb.parse('function(value){' + script + '\n}');
    me.editor$ = value;
  }
  /***/
  get editor() {
    return this.editor$;
  }
  /**
   * 根据{#type}和{#format}属性格式化值。
   * @param {Object} value 值。
   * @return {String} 格式化后的值。
   */
  formatValue(value) {
    let me = this, type;

    if (value != null) {
      type = me.type;
      if (type) {
        if (type == 'none')
          return value;
        else if (type == 'boolText')
          return Wb.parseBool(value) ? Str.yes : Str.no;
        else if (type == 'enableText')
          return Wb.parseBool(value) ? Str.enable : Str.disable;
        else
          return value[type];
      } else if (me.format)
        return Wb.format(value, me.format);
      else {
        if (Wb.isDate(value))
          return value.autoText;
        else if (Wb.isNumber(value))
          return value.floatText;
      }
    }
    return value;
  }
  /** @property {Number/String} - 列的最小宽度。仅适用于表格列。 */
  set minWidth(value) {
    let me = this;

    if (me.minWidth$ !== value) {
      let contentCol, grid = me.gridHeader.grid;
      me.minWidth$ = value;
      if (me.col && !grid.isTree) {
        value = Wb.px(value);
        contentCol = grid.contentCols?.[me.leafIndex];
        if (contentCol)
          contentCol.setStyle('min-width', value);
        me.col.setStyle('min-width', Wb.px(value));
      }
    }
  }
  /***/
  get minWidth() {
    return this.minWidth$;
  }
  /** @property {Number/String} - 当前列宽度。如果为负数表示弹性列，其含义等于flex值；例如有3个列其width分别为-1, -2, -3，那么其
   * 实际宽度分别为剩余可用宽度的1/6, 2/6和3/6。 @key */
  set width(width) {
    let me = this;
    if (me.width$ !== width) {
      me.width$ = width;
      if (me.fromColumn)
        me.fromColumn.width = width;
      if (!me.isLeaf)
        return;
      let fitTable, gridHeader = me.gridHeader, grid = gridHeader.grid;
      if (Wb.isNumber(width)) {
        if (width < 0)
          width = -width * 100 + '%';
        else
          width = width + 'px';
      }
      me.realWidth = width;
      if (!me.col)
        return;
      me.col.setStyle('width', width);
      grid.setColumnWidth(me.leafIndex, width);
      fitTable = gridHeader.leafColumns.some(col => col.width < 0);
      if (gridHeader.fitTable != fitTable) {
        gridHeader.fitTable = fitTable;
        gridHeader.tableEl.setCls(fitTable, 'w-fit-table');
        grid.summaryEl?.tableEl.setCls(fitTable, 'w-fit-table');
        grid.setTableFit();
      }
    }
  }
  /***/
  get width() {
    return this.width$;
  }
}
/**
 * 表格组件，行列二维显示的视图。
 * 表格的相关示例见：{#%grid.xwl|ide?openModule=example/comps/grid.xwl}
 * @icon grid
 */
Cls['Wb.Grid'] = class grid extends Wb.View {
  static cls = 'w-column';
  static defaults = {
    cname: 'gridItem'
  };
  //以下属性必须依次处理
  static firstNames = ['columns', 'items', 'data', 'plainTable', 'sorters'];
  static configs = {
    pagingBar: true,
    gridLine: true,
    stripeRows: true,
    headerLine: true,
    columnsDraggable: true
  };
  static protos = {
    /** @property {Boolean} - 是否是表格的标识。 @readonly */
    isGrid: true,
    /** @property {String} - 可编辑表格关联的文件控件下载时提交的参数名称。默认为"download"。 */
    downloadName: 'download',
    /** @property {Boolean} - 点击列标题切换排序时是否显示波纹效果，默认为true。 */
    clickHeaderRipple: true,
    /** @property {Boolean} - 是否在每个条目显示图标。显示的默认图标由{#itemIcon}属性指定。 */
    showIcon: false,
    /** @property {Boolean} - 是否可以通过点击列标题对列进行排序。 @key */
    columnsSortable: false,
    /** @property {IconString} - 每个条目显示的默认图标。是否显示图标由{#showIcon}属性指定。 */
    itemIcon: 'file',
    /** @property {String} - 条目默认副文本字段名称。默认为"subtext"。 */
    subtextField: 'subtext',
    /** @property {String} - 列数组{#columns}节点路径。 */
    columnsPath: 'columns',
    /** @property {Number/String} - 表格列的默认宽度。默认为"10em"。 */
    defaultColWidth: '10em',
    /** @property {Boolean} - 设置表格是否可以编辑。设置该值为true时，默认{#recordChanges}属性为true。 @key */
    editable: false,
    /** @property {Boolean} - 当表格已经包含{#columns}且远程数据返回表格列时，是否重新加载表格列。 */
    reloadColumns: false,
    /** @property {Number} - 在表头上按鼠标滚动键滚动时以像素为单位的步长。默认为30。 */
    headerScrollStep: 30,
    /** @property {Boolean} - 当列模型更新或销毁时是否自动销毁编辑器。默认为true。 */
    autoDestroyEditors: true,
    /** @property {Boolean} - 原滚动状态。 @priv */
    oldScrolled: false,
    /** @property {String} exportFilename 导出表格数据时使用的文件名称，该名称不包括扩展名。 */
    /** @property {String} exportTitle 导出表格数据时使用的标题。 */
    /** @property {Boolean} - 当表格允许编辑且未在编辑状态时按Enter键是否开始编辑首个有效列单元格。 */
    enterEdit: false,
    /** @property {Boolean} - 当表格编辑时按Enter键是否作为Tab键处理。 */
    enterAsTab: false,
    /** @property {Boolean} - 当表格编辑时且在最后行按Enter键时是否自动添加行。如果{#enterAsTab}属性为false该属性无效。 */
    enterAppend: true,
    /** @property {Boolean} - 当表格编辑时且在最后行按arrowDown键时是否自动添加行。如果{#enterAsTab}属性为false该属性无效。 */
    arrowDownAppend: false,
    /** @property {Boolean} navigateEdit 按导航键时是否允许保持编辑状态，null表示同{#keyWalking}值相反。默认为null。 */
    smartNavigate: null,
    headerLine$: false,
    plainTable$: false,
    stripeRows$: false,
    columnsDraggable$: false,
    noVerifyFocus: true,
    compact$: false
  };
  /** @property {Element} headerEl 表格表头元素。 @readonly */
  /** @property {Element} contentEl 表格内容包裹元素。 @readonly */
  /** @property {Element} contentTableEl 表格内容元素。 @readonly */
  /***/
  init(configs) {
    let bodyEl, me = this;

    super.init(configs);
    bodyEl = me.bodyEl;
    me.navigateEdit ??= !me.keyWalking;
    me.headerEl = bodyEl.addEl('w-grid-header');
    me.mon({
      el: me.headerEl,
      mouseleave: me.onColsMouseLeave,
      wheel: { fn: me.onHeaderWheel, passive: false },
      click: me.onHeaderClick,
      [Event.tapMoveName]: { fn: me.onColsMouseMove, passive: false },
      [Event.tapDownName]: { fn: me.onColsMouseDown, passive: false }
    });
    me.scrollEl = me.contentEl = bodyEl.addEl('w-grid-content');
    me.addTableEl();
    me.mon({
      el: me.contentEl,
      scroll: { fn: me.onContentElScroll, passive: true },
      resize: me.onContentElResize,
      [Event.tapDownName]: { fn: me.onContentElMouseDown, passive: true },
      [Event.tapUpName]: me.onContentElMouseUp
    });
    me.mon({
      el: me.headerEl,
      scroll: { fn: me.onHeaderElScroll, passive: true }
    })
    if (me.stateId)
      me.rawColumns = configs.columns;
    if (configs.stateData)
      configs.columns = Wb.deserialize(configs.stateData);
    if (me.editable)
      configs.recordChanges ??= true;
  }
  /**
   * 重置首行索引。 @priv
   */
  resetRowNum() {
    let me = this;
    me.contentEl.setStyle('counter-reset', 'w-row-num ' + me.pageSize * me.pageIndex);
  }
  /**
   * 导出表格中的数据到文件，并下载到本地。
   * @param {String} [filename] 导出的文件名称，不包括扩展名。默认为"data"。
   * @param {Enum} [format] 导出数据的格式。
   * -'xlsx': Excel xlsx格式文件。默认值。
   * -'csv': Csv文件。
   * @param {Boolean} [allPages] 是否导出所有页数据。true所有页，false当前页。
   * @param {Boolean/Array} [localData] 是否使用本地数据。仅当导出当前页时有效。默认pageSize为-1时为true，否则为
   * false。如果为数组表示导出的数据组成的数组。
   * @param {String} [title] 导出Excel的标题。
   */
  exportData(filename, format, allPages, localData, title) {
    const parentColProps = ['titleAlign'];
    const leafColProps = ['align', 'keyValue', 'width', 'titleAlign'];
    const types = ['date', 'int', 'float', 'bool', 'string'];
    let params, me = this, getCols, data, url = me.url, width, freezeCol = 0, isLeaf, indexName,
      getExcelFormat, fontSize = parseInt(me.bodyEl.computeStyle().fontSize), field, dataType,
      fields = Wb.apply({}, me.defaultFields, me.fields), fieldName, exportCol, summary;

    localData ??= me.pageSize == -1;
    exportCol = col => !col.noExport && col.visible && (col.fieldName != null || !col.isLeaf);
    getExcelFormat = (format, type) => {
      switch (type) {
        case 'floatText':
          format = '#,##0.0#############';
          break;
        case 'intText':
        case 'kb':
        case 'mb':
        case 'fileSize':
          format = '#,##0';
          break;
        case 'percent':
          format = '#,##0.00%';
          break;
        case 'percentInt':
          format = '#,##0%';
          break;
        case 'percentAuto':
          format = '#,##0.0#%';
          break;
        case 'usd':
        case 'cny':
        case 'eur':
        case 'gbp':
        case 'jpy':
        case 'cad':
        case 'aud':
        case 'hkd':
          format = '"' + (0)[type].firstItem('0') + '"#,##0.00';
          break;
        case 'dateText':
          format = Str.dateFormat;
          break;
        case 'timeText':
          format = Str.timeFormat;
          break;
        case 'timeTextHM':
          format = 'hh:mm';
          break;
        case 'timeText12':
          format = Str.timeFormat + ' AM/PM';
          break;
        case 'timeText12HM':
          format = 'hh:mm AM/PM';
          break;
        case 'dateTimeText':
          format = Str.dateFormat + ' ' + Str.timeFormat;
          break;
        case 'dateTimeTextHM':
          format = Str.dateFormat + ' hh:mm';
          break;
        case 'dateTimeText12':
          format = Str.dateFormat + ' ' + Str.timeFormat + ' AM/PM';
          break;
        case 'dateTimeText12HM':
          format = Str.dateFormat + ' hh:mm AM/PM';
          break;
        case 'dateTimeMilliText':
          format = Str.dateFormat + ' ' + Str.timeFormat + '.000';
          break;
        case 'dateTimeMilliText12':
          format = Str.dateFormat + ' ' + Str.timeFormat + '.000 AM/PM';
          break;
      }
      if (format) {
        // y means yyyy
        if (format.occur('y') == 1)
          format = format.replace('y', 'yyyy');
        // z to 0 for milliSec
        format = format.replaceAll('z', '0');
        return format;
      }
    };
    getCols = cols => {
      let columns = [];
      cols.forEach(col => {
        isLeaf = col.isLeaf;
        fieldName = col.fieldName;
        if (exportCol(col)) {
          data = Wb.applyValueWith({}, col, isLeaf ? leafColProps : parentColProps);
          data.fieldName = fieldName;
          data.text = col.text ?? col.td?.textContent;
          data.titleAutoWrap = col.titleAutoWrap && col.titleAutoWrap != 'nowrap';
          if (isLeaf) {
            data.autoWrap = col.autoWrap && col.autoWrap != 'nowrap';
            width = data.width;
            if (Wb.isNumber(width)) {
              if (width > 0)
                width = width / fontSize;
            } else {
              if (width.endsWith('em'))
                width = parseInt(width);
              else if (width.endsWith('px'))
                width = parseInt(width) / fontSize;
              else if (width.endsWith('%'))
                width = -parseInt(width) / 100;
              else
                width = parseInt(col.col.computeStyle().fontSize) / fontSize;
            }
            data.width = width;
            data.format = getExcelFormat(col.format, col.type);
            field = fields[fieldName];
            if (field) {
              if (field.value != null)
                data.fieldValue = field.value;
              if (field.format)
                data.fieldFormat = field.format;
              if (field.type) {
                dataType = types.indexOf(field.type);
                if (dataType != -1) {
                  data.fieldType = dataType;
                  data.format ||= getExcelFormat(Str.dateTimeFormat.replace('.S', ''));
                }
              }
            }
          }
          columns.push(data);
          if (col.items) {
            data.items = getCols(col.items);
          }
        }
      });
      return columns;
    };
    // find the last continous freeze column
    me.leafColumns.each(col => {
      if (exportCol(col)) {
        if (col.freeze)
          freezeCol++;
        else
          return false;
      }
    });
    params = { title, columns: getCols(me.columns), gridLine: me.gridLine, _download: true };
    if (freezeCol > 0)
      params.freeze = freezeCol;
    if (filename)
      params.filename = filename;
    if (format)
      params.format = format;
    if (me.isTree) {
      params.tree = true;
      params.itemsName = me.itemsName;
    }
    if (localData && (!allPages || me.pageSize == -1) && (!me.serverExport ||
      !me.cascadeSome(n => !n.leaf && !n.loaded)) || !url) {
      if (Wb.isArray(localData))
        params.data = localData;
      else if (allPages)
        params.data = me.localData ?? me.data;
      else
        params.data = me.data;
    } else {
      let lowerUrl = url.toLowerCase(), localUrl, urlParams, sorterList = me.sorterList;
      if (url.includes('?'))
        url += '&';
      else
        url += '?';
      url += 'W-Requested-With=XMLHttpRequest';
      if (!lowerUrl.startsWith('http:') && !lowerUrl.startsWith('https:')) {
        localUrl = url;
        if (url.includes('?')) {
          let pos = url.indexOf('?'), uParams;
          uParams = new URLSearchParams(url.substr(pos + 1));
          urlParams = {};
          uParams.forEach((v, k) => urlParams[k] = v);
          localUrl = url.substr(0, pos);
          if (localUrl == 'm' && urlParams.xwl) {
            localUrl = urlParams.xwl + '.xwl';
            delete urlParams.xwl;
          }
        }
        url = location.protocol + '//' + location.host + (url.startsWith('/') ? url : (Wb.path + '/' + url));
      }
      if (indexName = me.pageIndexName)
        params.pageIndexName = indexName;
      if (!allPages) {
        let pi = me.pageIndex, ps = me.pageSize;
        Wb.apply(params, { pageIndex: pi, pageSize: ps, fromValue: pi * ps, toValue: (pi + 1) * ps - 1 });
      }
      if (sorterList?.length) {
        params.sortValue = sorterList;
        params.sortName = me.sortName;
      }
      Wb.apply(params, {
        params: me.lastParams, allPages, url, urlParams, localUrl, itemsPath: me.itemsPath,
        fromName: me.fromName, toName: me.toName, pageSizeName: me.pageSizeName
      });
    }
    summary = me.summaryData;
    if (summary && (!allPages || me.pageCount < 2))
      params.summary = summary;
    Wb.download('export', params, null, true);
  }
  /**
   * 导出表格中的数据到Excel文件，并下载到本地。详见{#exportData}方法。
   * @param {Boolean} [allPages] 是否导出所有页数据。true所有页，false当前页。
   */
  exportExcel(allPages) {
    this.exportFile(allPages, 'xlsx');
  }
  /**
   * 导出表格中的数据到CSV文件，并下载到本地。详见{#exportData}方法。
   * @param {Boolean} [allPages] 是否导出所有页数据。true所有页，false当前页。
   * @param {String} [format] 导出的格式。默认为"csv"。
   */
  exportFile(allPages, format) {
    let me = this;
    me.exportData(me.exportFilename || me.cid, format || 'csv', allPages, true, me.exportTitle);
  }
  /**
   * 把表格中具有相同值的行合并为一行。该方法将扫描所有列，如果指定列允许合并行，则把该列相同值的行进行合并。设置列对象
   * 的{#Wb.Column.mergeRow}属性为true，则该列将执行行合并。 @priv
   */
  mergeRows() {
    let me = this, table = me.contentTableEl, cols = me.leafColumns, i, j = cols.length, rows = table.rows,
      x, y = rows.length, cell, text, count, prevCell, prevText;

    for (i = j - 1; i > -1; i--) {
      if (!cols[i].mergeRows)
        continue;
      count = 0;
      prevCell = null;
      for (x = y - 1; x > -1; x--) {
        cell = rows[x].cells[i];
        text = cell.textContent;
        if (prevCell) {
          if (text === prevText) {
            prevCell.parentNode.removeChild(prevCell);
            if (x === 0) {
              if (count > 0)
                cell.rowSpan = count + 1;
            }
          } else {
            if (count > 1)
              prevCell.rowSpan = count;
            count = 0;
          }
        }
        count++;
        prevCell = cell;
        prevText = text;
      }
    }
  }
  /**
   * 把表格中具有相同值的列合并为一列。该方法将扫描所有行，如果指定列允许合并列，则把相同值的列进行合并。设置列对象
   * 的{#Wb.Column.mergeRowGroup}属性以标识合并列的组名，使用该方法后具有相同mergeColsGroup属性的列都将执行合并列的操作。
   * @priv
   */
  mergeCols(grid) {
    let me = this, table = me.contentTableEl, cols = me.leafColumns, i, j = cols.length, rows = table.rows,
      x, y = rows.length, cell, row, text, count, group, prevGroup, prevCell, prevText;

    for (x = y - 1; x > -1; x--) {
      count = 0;
      row = rows[x];
      prevCell = null;
      for (i = j - 1; i > -1; i--) {
        cell = row.cells[i];
        if (!cell)
          continue;
        text = cell.textContent;
        group = cols[i].mergeColsGroup;
        if (prevCell) {
          if (text === prevText && group && group === prevGroup) {
            prevCell.parentNode.removeChild(prevCell);
            if (i === 0) {
              if (count > 0)
                cell.colSpan = count + 1;
            }
          } else {
            if (prevGroup && count > 1)
              prevCell.colSpan = count;
            count = 0;
          }
        }
        count++;
        prevCell = cell;
        prevText = text;
        prevGroup = group;
      }
    }
  }
  /***/
  set sorters(value) {
    super.sorters = value;
    this.updateSortFlags();
  }
  /***/
  get sorters() {
    return super.sorters;
  }
  /** @property {Object/Array} - 选择记录修改前的关键字段的原值数据组成的对象，字段名称前加"$"。多选返回数组。 */
  get originData() {
    let me = this;

    if (me.multiSelect)
      return me.selections.pluck('originData');
    else
      return me.selection?.originData;
  }
  /** @property {Object/Array} - 选择记录关键字段的原值和所有新值数据组成的对象，原值字段名称前加"$"。多选返回数组。 */
  get fullData() {
    let me = this;

    if (me.multiSelect)
      return me.selections.pluck('fullData');
    else
      return me.selection?.fullData;
  }
  /**
   * 在当前表格添加新的空白列。
   */
  addColumn() {
    let me = this;
    Wb.prompt({ title: Str.addColumn, icon: 'add' }, [{ text: Str.title, cid: 'title', required: true }],
      (values, win) => {
        me.cloneColumns.push({ text: values.title, additionCol: true });
        me.refreshColumns();
        win.close();
      });
  }
  /**
   * 保存当前的列状态到服务器端。
   */
  saveColumns() {
    let me = this, cloneColumns = me.cloneColumns;
    me.leafColumns.forEach(col => col.additionCol && cloneColumns.remove(col.fromColumn));
    Wb.ajax({
      url: 'set-resource',
      data: {
        name: 'state.' + me.stateId,
        value: Wb.serialize(cloneColumns)
      }
    });
  }
  /** @property {Array} rawColumns 原始列列表。仅设置{#stateId}有效。 @priv */
  /** @property {Array} cloneColumns 原始列列表的克隆副本，该副本会随着列的设置而调整内容。仅设置{#stateId}有效。 @priv */
  /**
   * 重置表格的列状态为原始状态。
   */
  resetColumns() {
    let me = this, rawColumns = me.rawColumns;
    Wb.confirm(Str.doConfirm.format(Str.reset), f => {
      if (rawColumns) {
        Wb.ajax({
          url: 'set-resource',
          params: {
            name: 'state.' + me.stateId
          },
          success() {
            me.columns = rawColumns;
          }
        });
      }
    });
  }
  /** @property {Wb.Window} dictWin 生成的字典对话框窗口。 @readonly */
  /**
   * 根据字典配置，显示对话框窗口，并在确认后发起远程请求，执行添加记录。该对话框为单例模式，在首次调用方法后创建，
   * 并在表格销毁后自动销毁。
   * @param {String/Object} url 提交到后台的url地址或请求配置对象。
   * @param {String} [subTitle] 编辑窗口的副标题。
   * @param {Object} [params] 提交到后台的参数。
   * @param {Function/Object} [callback] 执行成功之后的回调方法或窗口配置项对象。可用参数grid和item。
   * @param {Object} [configs] 窗口配置项对象。
   * @param {Boolean} [isUpload] 是否使用文件上传方式提交。默认为true。
   * @param {Boolean/Wb.ViewItem} [append] 是否为添加。true添加到末行，false插入到首行。如果为条目对象，插入到该
   * 条目之前。默认为添加到最后。
   * @param {Wb.TreeItem} [node] 添加节点时的父节点。仅操作树节点时有效。
   * @return {Wb.Window} 显示的窗口。可以通过{#dictWin}属性访问该窗口。
   */
  dictAdd(url, subTitle, params, callback, configs, isUpload, append, node) {
    let me = this, win;

    if (Wb.isObject(callback)) {
      configs = callback;
      callback = null;
    }
    win = me.dictWin ??= me.createWindow(configs);
    win.isEdit = false;
    me.insertRecord(url, win, subTitle, params, callback, isUpload ?? true, append, node);
    return win;
  }
  /**
   * 根据字典配置，显示对话框窗口，并在确认后发起远程请求，执行修改记录。该对话框为单例模式，在首次调用方法后创建，
   * 并在表格销毁后自动销毁。
   * @param {String/Object} url 提交到后台的url地址或请求配置对象。
   * @param {String} [fieldName] 作为窗口的副标题的字段名称。
   * @param {Object} [params] 提交到后台的参数。
   * @param {Function/Object} [callback] 执行成功之后的回调方法或窗口配置项对象。可用参数grid和item。
   * @param {Object} [configs] 窗口配置项对象。
   * @param {Boolean} [isUpload] 是否使用文件上传方式提交。默认为true。
   * @return {Wb.Window} 显示的窗口。可以通过{#dictWin}属性访问该窗口。
   */
  dictEdit(url, fieldName, params, callback, configs, isUpload) {
    let me = this, win;

    if (Wb.isObject(callback)) {
      configs = callback;
      callback = null;
    }
    win = me.dictWin ??= me.createWindow(configs);
    win.isEdit = true;
    me.editRecord(url, win, fieldName, params, callback, isUpload ?? true);
    return win;
  }
  /**
   * 通过表格中的字典数据来创建对话框窗口。 @priv
   * @param {Object} [configs] 窗口配置项对象。
   * @return {Wb.Window} 生成的对话框实例。
   */
  createWindow(configs) {
    let win;

    win = Wb.Dict.createWindow(Wb.Dict.getColumnEditors(this.columns), configs);
    this.on('destroy', f => win.destroy());
    return win;
  }
  /**
   * @event headerclick 表头点击时触发。
   * @param {Wb.Column} column 点击的列对象。
   * @param {Element} td 表头的单元格元素。
   * @param {Event} e 事件对象。
   */
  /**
   * 表头点击时执行的方法。 @priv
   */
  onHeaderClick(e) {
    let me = this, td = e.target.closest('td'), colItem = td?.colItem, name = colItem?.fieldName;

    me.fireEvent('headerclick', colItem, td, e);
    if (name && me.columnsSortable && colItem.sortable) {
      let sorter;
      if (me.clickHeaderRipple)
        td.rippleEffect(e.x, e.y);
      sorter = me.sorterList?.find(item => item.name == name);
      if (sorter)
        sorter = { name, desc: !sorter.desc };
      else
        sorter = name;
      me.sort(sorter);
    }
  }
  /**
   * 根据字段排序信息更新表头中的排序标记。
   */
  updateSortFlags() {
    let me = this, leafColumns = me.leafColumns, td, sorter, sorters = me.sorterList;

    leafColumns?.forEach(col => {
      td = col.td;
      sorter = sorters?.find(item => item.name == col.fieldName);
      if (sorter) {
        td.addCls('w-sort');
        td.setCls(sorter.desc, 'w-sort-desc');
      } else {
        td.removeCls('w-sort');
        td.removeCls('w-sort-desc');
      }
    });
  }
  /**
   * 表格头鼠标滚动时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onHeaderWheel(e) {
    let contentEl = this.contentEl;
    if (contentEl.offsetWidth < contentEl.scrollWidth) {
      let step = this.headerScrollStep;
      if (e.deltaY < 0)
        step = -step;
      contentEl.scrollLeft += step;
      e.stopEvent();
    }
  }
  /**
   * 添加内容表格元素。 @priv
   */
  addTableEl() {
    let tableEl;

    tableEl = this.contentTableEl = this.contentEl.addEl('w-content-table', 'table');
    this.contentGroupEl = tableEl.addTag('colgroup');
    this.bodyEl = tableEl.addTag('tbody');
  }
  /**
   * 根据表头设置内容表格是否自适应。 @priv
   */
  setTableFit() {
    this.contentTableEl.setCls(this.gridHeader.fitTable, 'w-fit-table');
  }
  /**
   * 验证可编辑表格的数据是否合法，如果非法将把编辑焦点转到首个非法的单元格。非可编辑表示该方法始终返回true。
   * @param {Boolean} noFocus 是否禁止设置焦点。
   * @return {Boolean} 是否合法。
   */
  verify(noFocus) {
    let me = this;

    if (!me.editable)
      return true;
    let ok = true, fieldName, editor, requiredNames = me.columns.filter(col =>
      (editor = col.editor) && editor.required && !editor.readonly && editor.visible
    ).pluck('fieldName');
    me.cascade(item => {
      fieldName = requiredNames.find(fieldName => Wb.isEmpty(item.data[fieldName]));
      if (fieldName) {
        let col = me.findColumn(fieldName);

        if (col?.visible && !noFocus) {
          me.startEdit(item, col);
          Wb.Editor.activeEditor.verify();
        }
        ok = false;
        return false;
      }
    });
    return ok;
  }
  /**
   * 把表格中未提交的增删改数据同步到后台{#url}指定的地址。成功后将自动调用{#commit}方法提交数据。如果服务器返回
   * JSON对象，insert表示需要同步到客户端的新增数据，update表示需要同步到客户端的更新数据。
   * @param {Object} configs 配置对象。更多说明和参数请参考{#Wb.ajax}方法，请注意所有回调方法this默认指向当前表格。
   * @param {Boolean} [.autoCommit] 是否自动提交和同步客户端数据。默认为true。
   */
  sync(configs) {
    let me = this, hasBlob;

    me.completeEdit();
    if (!me.verify()) return;
    //使mask先于读取文件前显示
    let mask = configs.mask;
    hasBlob = me.getModifiedData(data => {
      let oldCallback;
      configs = Wb.copy(configs);
      if (!configs.url) {
        configs.url = me.url;
      }
      if (!configs.url)
        Wb.raise('The URL is not specified.');
      configs.scope ||= me;
      configs.mask = false;
      configs.data = Wb.apply(data, me.params, configs.params);
      oldCallback = configs.callback;
      configs.callback = function (...args) {
        if (mask)
          mask = Wb.unmask(mask);
        if ((configs.autoCommit ?? true) && args[1].ok) {
          let resp = args[0].trim();
          if (resp.startsWith('{') && resp.endsWith('}')) {
            //同步服务端数据
            let insert, update;
            resp = Wb.decode(resp);
            insert = resp.insert;
            update = resp.update;
            if (insert || update) {
              let insertIndex = 0, updateIndex = 0;
              me.cascade(item => {
                if (insert && item.isNew)
                  item.update(insert[insertIndex++]);
                else if (update && item.isDirty) {
                  item.update(update[updateIndex++]);
                }
              });
            }
          }
          me.commit();
        }
        oldCallback?.apply(this, args);
      };
      Wb.ajax(configs);
    });
    if (mask !== false) {
      if (hasBlob) {
        //带blob立即显示mask
        if (Wb.isString(mask))
          mask = { delay: 0, text: mask };
        else if (Wb.isObject(mask))
          mask = Wb.apply({ delay: 0 }, mask);
        else
          mask = { delay: 0 };
      }
      mask = Wb.mask(mask);
    }
  }
  /** @property {Boolean} - 表格内容是否紧凑显示。 */
  set compact(value) {
    this.applyCls(value, 'compact', 'w-compact');
  }
  /***/
  get compact() {
    return this.compact$;
  }
  /**
   * 当{#contentEl}滚动时执行的方法。 @priv
   */
  onContentElScroll() {
    let me = this, scrollLeft = me.contentEl.scrollLeft, headerEl = me.headerEl, summaryEl = me.summaryEl;

    if (headerEl.scrollLeft != scrollLeft)
      headerEl.scrollLeft = scrollLeft;
    if (summaryEl && summaryEl.scrollLeft != scrollLeft)
      summaryEl.scrollLeft = scrollLeft;
  }
  /**
   * 当{#headerEl}滚动时执行的方法。 @priv
   */
  onHeaderElScroll() {
    let me = this, scrollLeft = me.headerEl.scrollLeft, contentEl = me.contentEl;

    if (contentEl.scrollLeft != scrollLeft)
      contentEl.scrollLeft = scrollLeft;
  }
  /**
   * 当{#contentEl}大小改变时（包括客户区大小改变）执行的方法。 @priv
   */
  onContentElResize() {
    this.adjustColGutter();
  }
  /**
   * 获取指定行和列的单元格元素。
   * @param {Wb.GridItem} row 行对象。
   * @param {Wb.Column} column 列对象。
   * @return {Element} 单元格元素。
   */
  getCell(row, col) {
    return row.el.children[col.leafIndex];
  }
  /**
   * 在{#contentEl}中mousedown时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onContentElMouseDown(e) {
    //e.target可能已经被替换因此使用Wb.findEl找target
    let me = this, target = Wb.findEl(e.x, e.y);
    if (target && me.editable && !Wb.Editor.activeEditor?.el.contains(target)) {
      let item = me.findItemByEl(target);
      me.mouseDownX = item?.itemIndex;
      me.mouseDownY = me.findColumnByEl(target)?.leafIndex;
      me.tapAtX = e.x;
      me.tapAtY = e.y;
      me.mouseDowned = true;
    }
  }
  /**
   * 在{#contentEl}中mouseup时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onContentElMouseUp(e) {
    //更新值后更新了dom导致click不响应，因此通过mousedown/mouseup组合来模拟判断click事件
    let me = this;
    if (me.mouseDowned && me.editable && e.isLeftButton) {
      let target = Wb.findEl(e.x, e.y), textEl, item, col;

      //仅点击在w-text元素上且mousedown和mouseup的xy一致才触发编辑
      textEl = target?.closest('.w-text-wrap') ?? target?.closest('.w-text');
      if (textEl) {
        item = me.findItemByEl(textEl);
        col = me.findColumnByEl(textEl);
        if (!e.ctrlMeta && !e.shiftKey && item && col && me.mouseDownX == item.itemIndex &&
          me.mouseDownY == col.leafIndex && Math.abs(me.tapAtX - e.x) < 20 && Math.abs(me.tapAtY - e.y) < 20)
          me.startEdit(item, col);
      }
    }
    me.mouseDowned = false;
  }
  /**
   * @event beforeedit 在开始编辑表格之前触发。返回false将阻止编辑。
   * @param {Wb.GridItem} row 编辑单元格所在行。
   * @param {Wb.Column} column 编辑单元格所在列。
   * @param {Object} configs 配置对象。
   * @param {Object} .value 编辑的值。可重置该值实现编辑值的重置。
   */
  /**
   * @event edit 在编辑表格完成时触发。返回false将阻止把值设置到表格。
   * @param {Object} value 编辑的值。
   * @param {Wb.GridItem} row 编辑单元格所在行。
   * @param {Wb.Column} column 编辑单元格所在列。
   */
  /**
   * @event editing 编辑表格数据时触发。
   * @param {Wb.GridItem} row 编辑单元格所在行。
   * @param {Wb.Column} column 编辑单元格所在列。
   */
  /** @property {Wb.ViewItem} editRow 正在编辑的行。 @readonly */
  /** @property {Wb.Column} editCol 正在编辑的列。 @readonly */
  /**
   * 开始编辑指定单元格的数据。可通过调用{#completeEdit}方法完成编辑或调用{#cancelEdit}方法取消编辑。如果
   * 该单元格不可以编辑直接返回false。
   * Example:
   *
   *     view.startEdit(view.selection, 'name'); //编辑选择行name列
   *
   * @param {Wb.GridItem/Number} row 编辑单元格所在行条目或其索引。
   * @param {Wb.Column/Number/String} col 编辑单元格所在叶子列的对象、索引或字段名称。
   * @param {Function} [callback] 成功完成编辑后的回调方法。this指向表格对象。返回false将阻止把值设置到表格。
   * @param {Object} .value 编辑的值。
   * @param {Wb.GridItem} .row 编辑单元格所在行。
   * @param {Wb.Column} .column 编辑单元格所在列。
   * @param {Boolean} [doCancel] 如果单元格正在编辑，是否取消当前编辑。false完成编辑，true取消编辑。
   * @return {Boolean} true成功开始编辑，false未开始编辑。
   */
  startEdit(row, col, callback, doCancel) {
    let me = this, configs, fieldName, value, rowData, editor;
    if (Wb.isNumber(row))
      row = me.items[row];
    if (Wb.isNumber(col))
      col = me.leafColumns[col];
    else if (Wb.isString(col))
      col = me.findColumn(col);
    editor = col.editor;
    if (row.disabled || row.fixed || editor === false)
      return false;
    if (Wb.Editor.activeEditor && (row == me.editRow && col == me.editCol))
      return true;
    if (doCancel)
      me.cancelEdit();
    else
      me.completeEdit();
    rowData = row.data;
    fieldName = col.fieldName;
    value = rowData[fieldName];
    configs = { value };
    if (me.fireEvent('beforeedit', row, col, configs) === false)
      return false;
    let editEl, textEl;

    //edit/value允许被重置
    editor = col.editor;
    if (!editor)
      return false;
    if (editor.cname == 'textArea')
      editor.maximizable ??= true;
    value = configs.value;
    if (!editor?.instanced)
      editor = col.editorInstance ??= Wb.create(editor);
    me.editRow = row;
    me.editCol = col;
    editEl = me.getCell(row, col);
    if (!editEl.containsCls('w-text-wrap')) {
      textEl = editEl.find('w-text-wrap') || editEl.find('w-text');
      if (textEl)
        editEl = textEl;
    }
    row.select();
    if (editor instanceof Wb.Select) {
      if (editor.keyName)
        value = [value, rowData[fieldName + '$']];
      else if (editor.valueMap)
        value = editor.getMappedValue(rowData);
      else if (editor.bindField)
        value = [rowData[editor.bindField], value];
    }
    Wb.Editor.startEdit(editEl, {
      value,
      editor,
      editing() {
        me.fireEvent('editing', row, col);
      },
      callback(ok, value) {
        let editor = this;
        if (ok && editor.isValid) {
          let completeEdit = true;
          if (callback?.call(me, value, row, col) === false)
            completeEdit = false;
          if (me.fireEvent('edit', value, row, col) === false)
            completeEdit = false;
          if (completeEdit) {
            if (editor.keyName)
              row.set({ [fieldName]: value, [fieldName + '$']: editor.inputValue });
            else if (editor.valueMap)
              row.set(editor.getMappedValue());
            else if (editor.bindField)
              row.set({ [fieldName]: editor.inputValue, [editor.bindField]: value, });
            else
              row.set(fieldName, value);
          }
        }
        delete me.editRow;
        delete me.editCol;
      },
      keydown(e) {
        return me.doKeyNavigate(e);
      }
    });
    return true;
  }
  /**
   * 在编辑器上按tab/shift+tab，回车和上下箭头导航键时执行的导航方法。 @priv
   * @param {Event} e 事件对象。
   * @return {Boolean} 按钮是否已经被处理。
   */
  doKeyNavigate(e) {
    let key = e.code, pressEnter, pressDown, me = this;

    //类TextArea编辑器仅对Tab键作处理
    if (e.target.tagName == 'TEXTAREA' && key != Keys.Tab)
      return false;
    if ([Keys.Enter, Keys.Tab, Keys.Up, Keys.Down].indexOf(key) == -1)
      return false;
    pressEnter = key == Keys.Enter;
    pressDown = key == Keys.Down;
    if (pressEnter) {
      if (me.enterAsTab)
        key = Keys.Tab;
      else
        return false;
    }
    let row = me.editRow, col = me.editCol, cols = me.leafColumns, downAppend = me.arrowDownAppend,
      colIndex = col.leafIndex, oldRow, oldCol, i, j = cols.length;

    oldRow = row;
    oldCol = col;
    switch (key) {
      case Keys.Up:
        row = me.findClosestItem(row, 'up');
        break;
      case Keys.Down:
      case Keys.Tab:
        if (pressDown) {
          row = me.findClosestItem(row, 'down');
          if (row || !downAppend) break;
          //向下按键添加行
          row = me.editRow;
        }
        col = null;
        if (e.shiftKey) {
          for (i = colIndex - 1; i >= 0; i--) {
            if (cols[i].editor !== false) {
              col = cols[i];
              break;
            }
          }
          if (!col) {
            row = me.findClosestItem(row, 'up');
            if (row) {
              for (i = j - 1; i >= colIndex; i--) {
                if (cols[i].editor !== false) {
                  col = cols[i];
                  break;
                }
              }
            }
          }
        } else {
          if (!pressDown) {
            for (i = colIndex + 1; i < j; i++) {
              if (cols[i].editor !== false) {
                col = cols[i];
                break;
              }
            }
          }
          if (!col) {
            row = me.findClosestItem(row, 'down');
            if (!row && (me.enterAppend && pressEnter || pressDown))
              row = me.addData({});
            if (row)
              col = me.firstEditColumn;
          }
        }
        break;
    }
    if (me.navigateEdit && (row != oldRow || col != oldCol) && row && col && me.startEdit(row, col)) {
      row.selectNoFocus();
      e.stopEvent();
      return true;
    }
    return false;
  }
  /**
   * 完成当前正在进行的编辑操作。如果表格不在编辑中该方法无任何效果。
   */
  completeEdit() {
    Wb.Editor.completeEdit();
  }
  /**
   * 取消当前正在进行的编辑操作。如果表格不在编辑中该方法无任何效果。
   */
  cancelEdit() {
    Wb.Editor.cancelEdit();
  }
  /**
   * 调整表头以适应内容的宽度。 @priv
   */
  adjustColGutter() {
    let me = this, contentEl = me.contentEl, ow = contentEl.offsetWidth, scrolled = contentEl.clientWidth != ow;

    if (me.oldScrolled !== scrolled && ow > 0) {
      me.oldScrolled = scrolled;
      me.headerEl?.setCls(scrolled, 'w-rsbar');
      me.summaryEl?.setCls(scrolled, 'w-rsbar');
    }
  }
  /**
   * 设置内容列。 @priv
   */
  setContentColumns() {
    let me = this, contentCol, contentGroupEl = me.contentGroupEl;

    me.setTableFit();
    me.contentCols = [];
    contentGroupEl.clearChildren();
    me.leafColumns.forEach(col => {
      contentCol = contentGroupEl.addTag('col');
      me.contentCols.push(contentCol);
      contentCol.setStyle('width', col.realWidth);
      if (!me.isTree && col.minWidth != null)
        contentCol.setStyle('min-width', Wb.px(col.minWidth));
    });
  }
  /** @property {Wb.Column[]} leafColumns 所有的叶子列列表。 @readonly */
  /**
   * 设置表格列。
   * @param {Wb.Column[]} columns 表格列数组。
   */
  setColumns(columns) {
    this.columns = columns;
  }
  /**
   * @event beforeloadcolumns 在加载列之前触发。返回false可阻止加载。
   * @param {Array} columns 列配置对象列表数组。
   */
  /** @property {String} stateId 用于保存表格状态的id，相同id的表格将共享状态。设置该值后将允许表格保存状态。比如保存
   * 调整后的列顺序，宽度和显示状态等。每个用户状态都是独立的。 */
  /** @property {Boolean} columnsLoading 是否正在加载列。 @priv */
  /** @property {Wb.Column[]} - 表格列数组，用于指定表格的列。 @key */
  set columns(columns) {
    let me = this;

    if (me.fireEvent('beforeloadcolumns', columns) === false)
      return;
    me.columnsLoading = true;
    try {
      if (me.autoDestroyEditors)
        me.destroyColumnsEditors();
      me.destroyRowEditors();
      if (me.stateId)
        me.cloneColumns = columns = Wb.clone(columns);
      me.gridHeader = new Wb.GridHeader(me, columns);
      me.leafColumns = me.gridHeader.leafColumns;
      me.updateSortFlags();
      me.setContentColumns();
      me.refresh();
      me.syncHeaderChecks();
      if (me.plainTable$ == 'auto')
        me.resetter('plainTable');
      if (me.isTree) {
        let name = columns.find(col => col.expander)?.fieldName;
        if (name)
          me.textField = name;
      }
      me.setSummary();
    } finally {
      me.columnsLoading = false;
    }
  }
  /** @property {Wb.Column[]} */
  get columns() {
    return this.gridHeader?.columns;
  }
  /**
   * 根据当前视图的列刷新列。
   */
  refreshColumns() {
    let me = this, destroy = me.autoDestroyEditors;

    me.autoDestroyEditors = false;
    try {
      me.columns = me.stateId ? me.cloneColumns : me.columns;
    } finally {
      me.autoDestroyEditors = destroy;
    }
  }
  /**
   * 设置合计行。 @priv
   */
  setSummary() {
    let me = this;

    if (me.summaryEl) {
      me.summaryEl.remove();
      me.summaryEl = null;
      me.un('success', me.onSummarySuccess);
    }
    if (Wb.down(me.columns, col => col.summary)) {
      let gridLine = me.gridLine, showLine = gridLine === true, tableEl, cols, i, j, tr, summaryEl, colItems, td, col,
        headerEl = me.headerEl;

      me.summaryEl = summaryEl = headerEl.parentNode.addEl('w-grid-header' +
        ((showLine || gridLine == 'vertical') ? ' w-grid-vline' : '') +
        ((showLine || gridLine == 'horizontal') ? ' w-grid-hline' : '')
      );
      if (headerEl.containsCls('w-rsbar'))
        summaryEl.cls = 'w-rsbar';
      summaryEl.tableEl = tableEl = summaryEl.addEl('w-header-table' +
        (me.gridHeader.fitTable ? ' w-fit-table' : ''), 'table');
      cols = headerEl.query('colgroup').cloneNode(true);
      tableEl.append(cols);
      colItems = summaryEl.summaryCols = cols.children;
      tr = tableEl.addTag('tbody').addTag('tr');
      j = colItems.length;
      for (i = 0; i < j; i++) {
        col = me.leafColumns[i];
        td = colItems[i].td = tr.addEl('w-text w-ta-' + (col.align || 'right'), 'td');
        if (col.freeze) {
          td.addCls('w-freeze');
          td.setStyle('right', col.freezeRight);
          td.setStyle('left', col.freezeLeft);
        }
      }
      me.on('success', me.onSummarySuccess);
      me.adjustColGutter();
      if (me.loaded)
        me.updateSummary();
    }
  }
  /**
   * 当表格包含合计时，成功加载数据后执行的方法。 @priv
   */
  onSummarySuccess() {
    this.updateSummary();
  }
  /** @property {Object} summaryData 经过渲染后的合计行数据。如果无合计行返回undefined。 @priv */
  /**
   * 更新表格中的合计行数据。
   */
  updateSummary() {
    let me = this;

    if (!me.summaryEl)
      return;
    let data = me.localData ?? me.data, value, summary, fieldName, td, tds, render, values = {};

    tds = me.summaryEl.queryAll('td');
    me.summaryData = {};
    me.leafColumns.forEach((col, i) => {
      if (summary = col.summary) {
        fieldName = col.fieldName;
        switch (summary) {
          case 'sum':
            value = data.reduce((a, c) => a + c[fieldName], 0);
            break;
          case 'avg':
            value = data.reduce((a, c) => a + c[fieldName], 0) / data.length;
            break;
          case 'count':
            value = data.length;
            break;
          case 'max':
            value = data.reduce((a, c) => Math.max(a, c[fieldName]), data[0]?.[fieldName]);
            break;
          case 'min':
            value = data.reduce((a, c) => Math.min(a, c[fieldName]), data[0]?.[fieldName]);
            break;
          default:
            Wb.raise('Invalid summary type "' + summary + '".');
        }
        values[fieldName] = value;
        me.summaryData[fieldName] = value;
        tds[i].textContent = col.formatValue(value);
      }
    });
    me.leafColumns.forEach((col, i) => {
      if (render = col.summaryRender) {
        fieldName = col.fieldName;
        td = tds[i];
        value = render.call(me, values[fieldName], values, col, td);
        if (value !== undefined) {
          me.summaryData[fieldName] = value;
          td.textContent = value;
        }
      }
    });
  }
  /**
   * 根据当前表格中所有复选框状态同步所有表头复选框状态。
   */
  syncHeaderChecks() {
    this.leafColumns?.forEach(col => col.syncHeaderCheck());
  }
  /**
   * 销毁所有条目对象拥有的编辑器。 @priv
   */
  destroyRowEditors() {
    this.each(item => {
      Wb.destroy(item.owned);
      item.owned$ = null;
    });
  }
  /**
   * 销毁所有列关联的编辑器。 @priv
   */
  destroyColumnsEditors() {
    let editor, instance;
    Wb.down(this.columns, col => {
      editor = col.editor;
      instance = col.editorInstance
      if (editor?.instanced)
        editor.destroy();
      if (instance != editor)
        instance?.destroy();
    });
  }
  /***/
  destroy() {
    let me = this;
    if (!me.destroyed) {
      if (me.autoDestroyEditors)
        me.destroyColumnsEditors();
      Wb.removeCls('w-col-resize');
    }
    super.destroy();
  }
  /**
   * 设置内容列的宽度。设置表格列的宽度请访问{#Wb.Column.width}属性。 @priv
   * @param {Number} index 列索引。
   * @param {Number/String} width 列宽度。如果为负数表示弹性列，其含义等于flex值。
   */
  setColumnWidth(index, width) {
    let me = this;
    if (!me.columnsLoading) {
      me.contentCols[index].setStyle('width', width);
      me.summaryEl?.summaryCols[index].setStyle('width', width);
      me.resizeFrozenColumns(index);
    }
  }
  /**
   * 调整该列及之后冻结列的起始冻结位置。 @priv
   * @param {Number} index 列索引。
   */
  resizeFrozenColumns(index) {
    let me = this, leafColumns = me.leafColumns, widthList, left = 0, right = 0,
      sCols = me.summaryEl?.summaryCols;

    //调整左侧
    widthList = [];
    leafColumns.forEach((col, i) => {
      if (col.freeze) {
        widthList.push(col.realWidth);
        if (i > index) {
          col.td.setStyle('left', left);
          sCols?.[i].td.setStyle('left', left);
          me.bodyEl.queryAll('.w-item > td:nth-child(' + (i + 1) +
            ')').forEach(td => td.setStyle('left', left));
        }
        if (widthList.length > 1)
          left = 'calc(' + widthList.join(' + ') + ')';
        else
          left = widthList[0];
      }
    });
    //调整右侧
    widthList = [];
    leafColumns.each((col, i) => {
      if (col.freeze) {
        widthList.push(col.realWidth);
        if (i < index) {
          col.td.setStyle('right', right);
          sCols?.[i].td.setStyle('right', right);
          me.bodyEl.queryAll('.w-item > td:nth-child(' + (i + 1) +
            ')').forEach(td => td.setStyle('right', right));
        }
        if (widthList.length > 1)
          right = 'calc(' + widthList.join(' + ') + ')';
        else
          right = widthList[0];
      }
    }, true, true);
  }
  /**
   * 查询fieldName或text为指定值的首个列对象。
   * @param {String} value 值。
   * @param {Boolean} [isText] false表示值为fieldName，true表示值为text。
   * @return {Wb.Column} 列对象。如果未找到返回undefined。
   */
  findColumn(value, isText) {
    return Wb.down(this.columns, col => (isText ? col.text : col.fieldName) == value);
  }
  /**
   * 通过指定元素找到包含该元素的当前表格内的列对象。
   * @param {Element} el 包含的元素。
   * @return {Wb.Column} 找到的列对象。如果未找到返回null。
   */
  findColumnByEl(el) {
    let cell = this.findCell(el);
    return (cell && this.view.leafColumns[cell.parentNode.children.indexOf(cell)]) ?? null;
  }
  /**
   * 查询包含指定元素所在的单元格元素。 @priv
   * @param {Element} el 包含的元素。
   * @return {Element} 单元格元素。如果未找到返回null。
   */
  findCell(el) {
    let cell;
    if (this.bodyEl.contains(el))
      cell = el.closest('tr.w-item > td');
    return cell ?? null;
  }
  /** @property {Boolean} disableMouseEvent 是否禁止执行onColsMouseMove和onColsMouseLeave方法。 @priv */
  /** @property {Wb.Column} currentColumn 当前鼠标位置上调整的列对象。 @priv */
  /**
   * 获取当前鼠标位置上调整的列对象。
   * @param {Event} e 事件对象。
   * @return {Wb.Column} 如果找到列且列可调整大小返回列对象，否则返回null。
   * @priv
   */
  getCurrentColumn(e) {
    let target = e.target.closest('td');

    if (target) {
      let rect, leftTarget;
      rect = target.getRect();
      if (rect.x + rect.width - e.x <= 5) {
        //位于右边界取当前单元格
        if (target.colItem?.resizable)
          return target.colItem;
      } else if (e.x - rect.x < 5) {
        //位于左边界取左侧单元格
        leftTarget = Wb.findEl(e.x - 10, e.y);
        if (leftTarget) {
          leftTarget = leftTarget.closest('td');
          //如果左侧存在单元格且为同一个表格
          if (leftTarget && leftTarget.closest('table') == target.closest('table') &&
            leftTarget.colItem?.resizable) {
            return leftTarget.colItem;
          }
        }
      }
    }
    return null;
  }
  /**
   * 鼠标移动时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onColsMouseMove(e) {
    if (!this.disableMouseEvent) {
      this.currentColumn = this.getCurrentColumn(e);
      Wb.setCls(this.currentColumn, 'w-col-resize');
    }
  }
  /**
   * 鼠标离开时时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onColsMouseLeave() {
    if (!this.disableMouseEvent) {
      Wb.removeCls('w-col-resize');
      delete this.currentColumn;
    }
  }
  /**
   * 鼠标按下时执行的方法。
   * @param {Event} e 事件对象。
   * @priv
   */
  onColsMouseDown(e) {
    let me = this, currentColumn;

    if (Wb.isTouch)
      me.currentColumn = me.getCurrentColumn(e);
    currentColumn = me.currentColumn;
    if (!currentColumn) return;
    me.disableMouseEvent = true;
    me.startPos = currentColumn.leafColumn.td.offsetWidth - e.x;
    Wb.addCls('w-col-resize');
    me.mon({
      el: DocEl,
      [Event.tapMoveName]: me.onColsDocMouseMove,
      [Event.tapUpName]: me.onColsDocMouseUp
    });
    //阻止click事件表头排序
    me.passTarget = e.target;
    e.target.addCls('w-pass');
    e.stopEvent();
  }
  /**
   * 鼠标在document上释放按键时执行的方法。
   * @priv
   */
  onColsDocMouseUp(e) {
    let me = this;

    me.mun({
      el: DocEl,
      [Event.tapMoveName]: me.onColsDocMouseMove,
      [Event.tapUpName]: me.onColsDocMouseUp
    });
    if (!me.getCurrentColumn(e))
      Wb.removeCls('w-col-resize');
    me.passTarget.removeCls('w-pass');
    delete me.disableMouseEvent;
    delete me.currentColumn;
    delete me.passTarget;
    e.stopEvent();
  }
  /**
   * 鼠标在document上移动时执行的方法。
   * @param {Event} e 事件对象。
   * @priv
   */
  onColsDocMouseMove(e) {
    let column = this.currentColumn.leafColumn;
    column.width = Math.max(this.startPos + e.x, 10);
    // e.stopEvent();
  }
  /** @property {Enum} - 表格是否为简单样式。简单样式是指不显示表头且宽度自适应。通常适用于单列的表格。
   * -true: 简单样式
   * -false: 普通样式（默认值）
   * -'auto': 自动，如果视图为树且仅有单列设置为true，否则为false。
   */
  set plainTable(value) {
    let me = this;
    if (me.plainTable$ !== value) {
      me.plainTable$ = value;
      if (value === 'auto')
        value = me.isTree && me.leafColumns?.length == 1;
      me.setCls(value, 'w-auto-width');
      if (!me.headerSetted) {
        me.header = !value;
        me.headerSetted = false;
      }
    }
  }
  /***/
  get plainTable() {
    return this.plainTable$;
  }
  /** @property {Boolean} - 是否对行添加条纹。默认为true。 */
  set stripeRows(value) {
    if (this.stripeRows$ !== value) {
      this.stripeRows$ = value;
      let el = this.contentTableEl;
      if (el)
        el.setCls(value, 'w-striple-rows');
    }
  }
  /***/
  get stripeRows() {
    return this.stripeRows$;
  }
  /** @property {Enum} - 表格内容显示单元格线条模式。
   * -true: 显示水平和垂直线条（默认值）
   * -false: 隐藏水平和垂直线条
   * -'vertical': 仅显示垂直线条
   * -'horizontal': 仅显示水平线条
   */
  set gridLine(value) {
    let me = this;
    if (me.gridLine$ !== value) {
      let showLine = value === true, visible;
      me.gridLine$ = value;
      visible = showLine || value == 'vertical';
      me.contentEl.setCls(visible, 'w-grid-vline');
      me.contentEl.setCls(!visible, 'w-grid-novline')
      me.summaryEl?.setCls(visible, 'w-grid-vline');
      me.summaryEl?.setCls(!visible, 'w-grid-novline');
      visible = showLine || value == 'horizontal';
      me.contentEl.setCls(visible, 'w-grid-hline');
      me.contentEl.setCls(!visible, 'w-grid-nohline');
      me.summaryEl?.setCls(visible, 'w-grid-hline');
      me.summaryEl?.setCls(!visible, 'w-grid-nohline');
    }
  }
  /***/
  get gridLine() {
    return this.gridLine$;
  }
  /** @property {Enum} - 表格头显示单元格线条模式。
   * -true: 显示水平和垂直线条（默认值）
   * -false: 隐藏水平和垂直线条
   * -'vertical': 仅显示垂直线条
   * -'horizontal': 仅显示水平线条
   */
  set headerLine(value) {
    if (this.headerLine$ !== value) {
      let showLine = value === true;
      this.headerLine$ = value;
      this.headerEl.setCls(showLine || value == 'vertical', 'w-grid-vline');
      this.headerEl.setCls(showLine || value == 'horizontal', 'w-grid-hline');
    }
  }
  /***/
  get headerLine() {
    return this.headerLine$;
  }
  /** @property {Boolean} - 表头是否可见。 */
  set header(visible) {
    this.headerEl.setCls(!visible, 'w-hidden-h0');
    this.headerSetted = true;
  }
  /***/
  get header() {
    return !this.headerEl.containsCls('w-hidden-h0');
  }
  /**
   * @event columnbeforedrag 在列拖动之前触发。返回false可阻止拖动。
   * @param {Wb.Draggable} draggable 拖动对象。
   * @param {Wb.Column} .sourceCol 拖动的源列。
   */
  /**
   * @event columndrag 在列有效拖动时触发。
   * @param {Wb.Draggable} draggable 拖动对象。
   * @param {Wb.Column} .sourceCol 拖动的源列。
   * @param {Wb.Column} .destCol 拖动到的目标列。
   */
  /**
   * @event columndrop 在列有效拖动后放下时触发。
   * @param {Wb.Draggable} draggable 拖动对象。
   * @param {Wb.Column} .sourceCol 拖动的源列。
   * @param {Wb.Column} .destCol 拖动到的目标列。
   */
  /** @property {Boolean} - 是否可以通过拖动的方式对列进行顺序调整。默认为true。 */
  set columnsDraggable(value) {
    let me = this;
    if (me.columnsDraggable$ !== value) {
      let headerEl = me.headerEl;
      me.columnsDraggable$ = value;
      me.headerComp ??= Wb.get(headerEl, { owner: me });
      if (value) {
        me.headerComp.draggable = {
          dragCenter: false, events: {
            beforedrag(data, e) {
              let td = e.target.closest('td.w-text');
              if (td?.colItem?.draggable) {
                data.sourceCol = td.colItem;
                Wb.apply(data, {
                  text: td.colItem.text || ('(' + Str.column + ')'), textCls: 'w-drag-bg',
                  icon: 'delete4', targetEl: td
                });
                return me.fireEvent('columnbeforedrag', data);
              } else
                return false;
            },
            drag(data, e) {
              let allowDrop, x = e.x, td = e.target.closest('td.w-text');

              allowDrop = td?.colItem && td != data.targetEl && headerEl.contains(td)
                && !Wb.up(td.colItem, parent => parent == data.sourceCol);
              data.animate = !allowDrop;
              if (allowDrop) {
                let ax, rx, aw, mx, rect = td.getRect(), upArrow, isCenter,
                  downArrow, headerRect = headerEl.getRect();
                data.destCol = td.colItem;
                if (!data.upArrow) {
                  let config = { cls: 'w-drag-arrow', renderEl: BodyEl, icon: 'up4' };
                  data.upArrow = new Wb.Icon(config);
                  config.icon = 'down4';
                  data.downArrow = new Wb.Icon(config);
                }
                upArrow = data.upArrow;
                downArrow = data.downArrow;
                upArrow.show();
                downArrow.show();
                rx = rect.x + rect.width / 2;
                mx = (rect.width / 6).constrain(3);
                aw = upArrow.el.offsetWidth;
                //isCenter为移动到叶子列中间时表示添加模式
                isCenter = data.isCenter = !Wb.down(data.destCol.items, item => item.visible$)
                  && (x > rx - mx) && (x < rx + mx);
                data.isAfter = x > rx;
                if (isCenter)
                  ax = rx;
                else if (data.isAfter)
                  ax = rect.right - aw;
                else
                  ax = rect.x;
                aw = aw / 2;
                if (!isCenter && !data.destCol.parent) {
                  //非添加模式顶层列头显示箭头到两列中间
                  if (data.isAfter)
                    ax += aw;
                  else
                    ax -= aw;
                }
                ax = ax.constrain(headerRect.x - aw, headerRect.right - aw);
                downArrow.x = ax;
                downArrow.y = rect.y - upArrow.el.offsetHeight;
                upArrow.x = ax;
                upArrow.y = headerRect.bottom;
                if (isCenter)
                  data.icon = 'add2';
                else if (data.isAfter)
                  data.icon = 'column-after';
                else
                  data.icon = 'column-before';
                me.fireEvent('columndrag', data);
              } else {
                data.upArrow?.hide();
                data.downArrow?.hide();
                data.icon = 'delete4';
                data.destCol = null;
              }
            },
            enddrag(data, e) {
              data.upArrow?.destroy();
              delete data.upArrow;
              data.downArrow?.destroy();
              delete data.downArrow;
              if (data.destCol) {
                let index, destCol = data.destCol, sourceCol = data.sourceCol, destArray, srcArray;

                if (destCol.fromColumn) {
                  destArray = destCol.parent?.fromColumn?.items ?? me.cloneColumns;
                  srcArray = sourceCol.parent?.fromColumn?.items ?? me.cloneColumns;
                  destCol = destCol.fromColumn;
                  sourceCol = sourceCol.fromColumn;
                } else {
                  destArray = destCol.parent?.items ?? me.columns;
                  srcArray = sourceCol.parent?.items ?? me.columns;
                }
                delete data.destCol;
                srcArray.remove(sourceCol);
                if (data.isCenter) {
                  if (sourceCol.instanced)
                    sourceCol.parent = destCol;
                  destCol.items ??= [];
                  destCol.items.push(sourceCol);
                } else {
                  if (sourceCol.instanced)
                    sourceCol.parent = destCol.parent;
                  index = destArray.indexOf(destCol)
                  if (data.isAfter)
                    index++;
                  destArray.insert(index, sourceCol);
                }
                me.refreshColumns();
                me.fireEvent('columndrop', data);
              }
            }
          }
        }
      } else {
        me.headerComp.draggable = false;
      }
    }
  }
  /***/
  get columnsDraggable() {
    return this.columnsDraggable$;
  }
}
/**
 * 树组件，分层多级显示的表格。
 * 树的相关示例见：{#%tree.xwl|ide?openModule=example/comps/tree.xwl}
 * @icon tree-view
 */
Cls['Wb.Tree'] = class tree extends Wb.Grid {
  static defaults = {
    cname: 'treeItem'
  };
  static cls = 'w-tree';
  static configs = {
    plainTable: 'auto',
    pagingBar: undefined,
    gridLine: undefined,
    stripeRows: undefined
  };
  static protos = {
    /** @property {Boolean} - @priv */
    pageSize: -1,
    /** @property {Boolean} - 是否是树的标识。 @readonly */
    isTree: true,
    /** @property {Boolean} - 当存在未加载的节点时是否允许在后台导出数据。 */
    serverExport: false,
    /** @property {Boolean} - 当树未显式指定{#columns}时是否创建默认树列。默认为true。 */
    defaultColumns: true,
    /** @property {Boolean} autoPostParams 当加载节点时是否自动提交节点的原始类型数据作为参数。
     * -true: 当前节点合并所有上级节点数据作为参数。如果参数名称重复，下级节点优先级高。
     * -false: 不提交节点数据。
     * -null: 当前节点数据作为参数。默认值。
     */
    /** @property {Boolean} - 双击目录节点时是否切换展开/收缩状态。默认为true。 */
    dblclickExpand: true,
    /** @property {String} - 节点路径分隔符。默认为"/"。 */
    pathSeparator: '/',
    /** @property {String} - 节点默认文本字段名称。默认为"text"。 */
    textField: 'text',
    showIcon: true,
    /** @property {IconString} - 默认目录节点图标。默认为"folder1"。 */
    folderIcon: 'folder1',
    /** @property {Boolean} - 子节点是否保留展开收缩状态扩展器的空间。默认为true。 */
    leafExpander: true,
    /** @property {Boolean} - 子节点是否缩进。默认为true。 */
    leafIndent: true,
    /** @property {IconString} - 节点加载时显示的旋转图标。默认为"loading"。 */
    loadingIcon: 'loading',
    /** @property {Number} - 节点加载时显示旋转图标的延时(毫秒)。默认同{#Wb.configs}.maskDelay。 */
    loadingIconDelay: Wb.configs.maskDelay,
    reserveScrollbar: true,
    /** @property {Boolean} - 节点扩展器是否显示在右侧。 */
    rightExpander: false,
    /***/
    setContentColumns: Wb.emptyFn,
    linkedCheck$: false
  };
  /**
   * 获取节点列表中所有的最上层节点。当节点的上级节点存在于列表中时该节点将被排除在外。
   * @param {Wb.TreeItem[]} nodes 节点列表。
   * @return {Wb.TreeItem[]} 最上层节点列表。
   */
  static getTopNodes(nodes) {
    return nodes.filter(node => !nodes.some(parent => parent != node && parent.contains(node)));
  }
  /**
   * @event beforecheckchange 改变子节点勾选状态前触发。返回false阻止改变。
   * @param {Wb.TreeItem} node 子节点。
   * @param {Boolean/String} checked 是否勾选。true勾选，false未勾选，"half"半选。
   */
  /**
   * @event checkchange 改变子节点勾选状态时触发。
   * @param {Wb.TreeItem} node 子节点。
   * @param {Boolean/String} checked 是否勾选。true勾选，false未勾选，"half"半选。
   */
  /**
   * @event toggleexpand 展开或收缩节点时触发。
   * @param {Wb.TreeItem} node 节点。
   */
  /***/
  init(configs) {
    let me = this;

    if (me.defaultColumns) {
      configs.columns ??= [{
        fieldName: me.textField,
        expander: true,
        width: -1
      }];
    }
    super.init(configs);
    me.on('itemdblclick', me.onItemDblClick);
  }
  /** @property {Boolean} grouping 是否根据排序的首个字段分组显示数据。 */
  /***/
  setData(data, add) {
    let me = this, sorterList = me.sorterList;
    if (me.grouping && sorterList) {
      let node, expanderField, groupField, groupValue, tree = [];

      groupField = sorterList[0]?.name;
      expanderField = me.leafColumns?.find(col => col.expander)?.fieldName;
      data.forEach(item => {
        groupValue = item[groupField];
        node = tree.find(n => n[expanderField] === groupValue);
        if (!node) {
          node = { [expanderField]: groupValue, _expanded: true, items: [] };
          tree.push(node);
        }
        node.items.push(item);
      });
      tree.forEach(node => node.items.mixSort(expanderField));
      data = tree;
    }
    return super.setData(data, add);
  }
  /***/
  findCell(el) {
    let cell;
    if (this.bodyEl.contains(el))
      cell = el.closest('.w-item-content > div');
    return cell ?? null;
  }
  /***/
  onKeyDown(e, options) {
    let item = this.selection;
    if (item && !item.leaf) {
      if (e.code == Keys.Left) {
        if (item.expanded) {
          item.collapse();
          e.stopEvent();
          return;
        }
      } else if (e.code == Keys.Right) {
        if (!item.expanded) {
          item.expand();
          e.stopEvent();
          return;
        }
      }
    }
    super.onKeyDown(e, options);
  }
  /** @property {Enum} - 树样式类型。
   * -'menu': 菜单样式。
   */
  set treeStyle(value) {
    this.applyCls(value, 'treeStyle', 'w-ts-');
  }
  /***/
  get treeStyle() {
    return this.treeStyle$;
  }
  /** @property {Boolean} - 节点勾选时是否自动同步所有父子节点的勾选状态。 */
  set linkedCheck(value) {
    let me = this;

    if (me.linkedCheck$ !== value) {
      me.linkedCheck$ = value;
      me.setEvents(value, 'checkchange', me.onCheckChange);
    }
  }
  /***/
  get linkedCheck() {
    return this.linkedCheck$;
  }
  /**
   * 当启用{#linkedCheck}时，节点勾选状态变化时执行的方法。 @priv
   */
  onCheckChange(node, checked) {
    let me = this;
    if (me.isCheckChanging)
      return;
    me.isCheckChanging = true;
    let checkedVal, hasChecked, hasUnchecked, hasHalfChecked;
    if (checked != 'half')
      node.cascade(n => {
        if (n.checked != null)
          n.checked = checked;
      });
    node.bubbleParent(p => {
      if (p.isTree)
        return false;
      hasChecked = false;
      hasUnchecked = false;
      hasHalfChecked = false;
      p.cascade(n => {
        checkedVal = n.checked;
        if (checkedVal == null)
          return;
        if (checkedVal == 'half') {
          hasHalfChecked = true;
          return false;
        } else if (checkedVal)
          hasChecked = true;
        else
          hasUnchecked = true;
        if (n == node)
          return null;
      });
      if (hasHalfChecked || hasChecked && hasUnchecked)
        p.checked = 'half';
      else if (hasChecked && !hasUnchecked)
        p.checked = true;
      else
        p.checked = false;
    });
    me.isCheckChanging = false;
  }
  /***/
  refresh() {
    this.cascade(node => node.refresh());
  }
  /**
   * 展开已经加载的所有节点。
   */
  expandAll() {
    this.cascade(node => node.expand());
  }
  /**
   * 收缩已经加载的所有节点。
   */
  collapseAll() {
    this.cascade(node => node.collapse());
  }
  /**
   * 树条目触发双击事件时执行的方法。 @priv
   * @param {Wb.TreeItem} item 树条目。
   * @param {Event} e 事件对象。
   */
  onItemDblClick(item, e) {
    //双击目录节点时切换展开/收缩状态
    if (!e.hasAssistKey && this.dblclickExpand && !item.leaf && e.target != item.checkEl)
      item.toggleExpand();
  }
  /***/
  getCell(row, col) {
    return row.el.firstChild.children[col.leafIndex];
  }
  /***/
  addTableEl() {
    this.bodyEl = this.contentEl.addEl('w-item-tree');
  }
  /***/
  setTableFit() {
    let fitTable = this.gridHeader.fitTable;
    this.bodyEl.queryAll('.w-item-content').forEach(div => {
      div.setCls(fitTable, 'w-fit-table');
    });
  }
  /** @property {Wb.TreeItem[]} - 获取勾选的节点组成的数组。如果未选择返回空数组。 */
  get checkedNodes() {
    let checked;
    return this.downAllBy(item => (checked = item.data._checked) && checked != 'half');
  }
  /** @property {Wb.TreeItem[]} - 获取所有被选择的节点中最上层的节点。 */
  get topSelections() {
    return Wb.Tree.getTopNodes(this.selections);
  }
  /***/
  get candidateSelection() {
    let topSelections = this.topSelections, node;
    //查询nextSibling
    node = topSelections.find(node => node.nextSibling && !topSelections.includes(node.nextSibling));
    if (node)
      return node.nextSibling;
    //查询previousSibling
    node = topSelections.find(node => node.previousSibling && !topSelections.includes(node.previousSibling));
    if (node) {
      return node.previousSibling;
    } else {
      //查询父节点
      node = topSelections.find(node => node.parent?.isViewItem);
      return node ? node.parent : null;
    }
  }
  /***/
  setColumnWidth(index, width) {
    let me = this;
    if (!me.columnsLoading) {
      me.bodyEl.queryAll('.w-item-content > div:nth-child(' + (index + 1) +
        ')').forEach(div => div.width = width);
      me.summaryEl?.summaryCols[index].setStyle('width', width);
      me.resizeFrozenColumns(index);
    }
  }
  /***/
  resizeFrozenColumns(index) {
    let me = this, leafColumns = me.leafColumns, widthList, left = 0, right = 0,
      sCols = me.summaryEl?.summaryCols;

    //调整左侧
    widthList = [];
    leafColumns.forEach((col, i) => {
      if (col.freeze) {
        widthList.push(col.realWidth);
        if (i > index) {
          col.td.setStyle('left', left);
          sCols?.[i].td.setStyle('left', left);
          me.bodyEl.queryAll('.w-item-content > div:nth-child(' + (i + 1) +
            ')').forEach(div => div.setStyle('left', left));
        }
        if (widthList.length > 1)
          left = 'calc(' + widthList.join(' + ') + ')';
        else
          left = widthList[0];
      }
    });
    //调整右侧
    widthList = [];
    leafColumns.each((col, i) => {
      if (col.freeze) {
        widthList.push(col.realWidth);
        if (i < index) {
          col.td.setStyle('right', right);
          sCols?.[i].td.setStyle('right', right);
          me.bodyEl.queryAll('.w-item-content > div:nth-child(' + (i + 1) +
            ')').forEach(div => div.setStyle('right', right));
        }
        if (widthList.length > 1)
          right = 'calc(' + widthList.join(' + ') + ')';
        else
          right = widthList[0];
      }
    }, true, true);
  }
  /** @property {String} - 获取子节点列表的属性名称。
   * 如itemsPath为foo.bar.items，itemsName返回items。
   */
  get itemsName() {
    let pos, itemsName = this.itemsPath;

    pos = itemsName.lastIndexOf('.');
    if (pos != -1)
      itemsName = itemsName.slice(pos + 1);
    return itemsName;
  }
  /**
   * 重新加载数据，并选择刷新前选择的首个路径相同的节点，如果节点不存在将不设置选择。
   * @param {String} [field] 生成路径时使用的字段名称。默认为{#Wb.Tree.textField}。
   * @param {Function} [success] 成功之后的回调方法。见{#load}方法的success说明。
   */
  loadSelect(field, success) {
    let me = this, path = me.selection?.getPath(field, '\n');

    if (path) {
      let autoSelect = me.autoSelect;
      me.autoSelect = false;
      me.suspendEvent('selectionchange');
      me.reload({
        callback() {
          me.autoSelect = autoSelect;
          me.resumeEvent('selectionchange');
        },
        success(...args) {
          let items = args[1];
          if (items.length)
            me.selectPath(path, null, field, '\n');
          else
            me.fireEvent('selectionchange');
          success?.apply(me, args);
        }
      });
    } else {
      me.reload({ success });
    }
  }
  /**
   * 获取当前选择节点以指定分隔符分隔的路径，路径值由节点fieldName字段指定。
   * @param {String} fieldName 节点路径值字段名。
   * @param {String} [pathSeparator] 路径分隔符。默认为{#pathSeparator}。
   * @return {String} 路径。null表示无被选择节点。
   */
  getPath(fieldName, pathSeparator) {
    let node = this.selection;
    return node ? node.getPath(fieldName, pathSeparator) : null;
  }
  /** @property {String} - 获取以{#pathSeparator}属性分隔的当前选择节点的路径，路径值由节点文本字段指定。
   * 返回null表示无被选择节点。
   */
  get path() {
    let node = this.selection;
    return node ? node.path : null;
  }
  /**
   * 根据指定的路径查找该路径指向的节点。请注意该方法仅从已经加载的节点中查找。\
   * 如果需要从未加载的节点中查找请参考{#selectPath}方法。
   * Example:
   *
   *     node = tree.findPath('/root/wb/ide');
   *
   * @param {String} path 路径。
   * @param {String} [field] 路径使用的字段名称。默认为{#Wb.Tree.textField}。
   * @param {String} [separator] 多级路径分隔符。默认为{#Wb.Tree.pathSeparator}。
   * @return {Wb.TreeItem} 找到的树节点，如果未找到返回null。
   */
  findPath(path, field, separator) {
    let me = this, node = me;

    field ??= me.textField;
    separator ??= me.pathSeparator;
    path.split(separator).each(item => {
      node = node.findItem(field, item);
      if (!node)
        return false;
    });
    return node;
  }
  /**
   * 根据指定的路径展开树并查找该路径指向的节点，如果节点存在将选择该节点。
   * Example:
   *
   *     tree.selectPath('/root/wb/ide');
   *
   * @param {String} path 路径。
   * @param {Function} [callback] 操作完成后执行的回调方法。可用参数node表示找到的子节点或null。
   * @param {String} [field] 路径使用的字段名称。默认为{#Wb.Tree.textField}。
   * @param {String} [separator] 多级路径分隔符。默认为{#Wb.Tree.pathSeparator}。
   * @param {Object} [scope] 回调方法this指向的对象。默认为当前树组件本身。
   * @param {Boolean} [unselect] 找到节点后是否不选择该节点。true不选择，false选择。
   */
  selectPath(path, callback, field, separator, scope, unselect) {
    let me = this, node = me, depth = 0, maxDepth, pathItems, fn;

    fn = f => {
      node = node.findItem(field, pathItems[depth]);
      if (node) {
        if (depth == maxDepth) {
          if (!unselect)
            node.select();
          callback?.call(scope, node);
        } else {
          depth++;
          node.expand(fn);
        }
      } else {
        callback?.call(scope, node);
      }
    };
    field ??= me.textField;
    separator ??= me.pathSeparator;
    scope ??= me;
    pathItems = path.split(separator);
    maxDepth = pathItems.length - 1;
    fn();
  }
}
/**
 * 视图条目组件。
 */
Cls['Wb.ViewItem'] = class viewItem extends Wb.Container {
  static cls = 'w-item';
  static protos = {
    selected$: false,
    fixed$: false,
    /** @property {Boolean} - 是否是视图条目的标识。 @readonly */
    isViewItem: true
  };
  static configs = {
    tabIndex: -1
  };
  /***/
  destroy() {
    let me = this;

    if (!me.destroyed) {
      let view;
      if (me.selected$ && (view = me.view) && !view.destroyed) {
        me.selected$ = false;
        view.fireEvent('deselect', me);
        if (view.suspendSelChange == 0)
          view.fireEvent('selectionchange');
      }
    }
    super.destroy();
  }
  /** @property {Boolean} isDirty 数据是否被修改且未提交。当设置{#Wb.View.recordChanges}属性为true时有效。 */
  /** @property {Boolean} isNew 是否为新添加的条目且未提交。当设置{#Wb.View.recordChanges}属性为true时有效。 */
  /** @property {Object} oldData 修改前的原始数据。当设置{#Wb.View.recordChanges}属性为true时有效。 */
  /** @property {Object} - 修改前的关键字段的原值数据组成的对象，字段名称前加"$"。 */
  get originData() {
    let result = {}, keyFields = this.view?.keyFields, trueKeyFields;

    if (keyFields === false)
      return result;
    trueKeyFields = keyFields === true;
    if (Wb.isString(keyFields))
      keyFields = keyFields.split(',');
    Wb.each(this.oldData ?? this.data, (k, v) => {
      if (trueKeyFields || !keyFields && !(v?.length > 500) || keyFields?.includes(k))
        result['$' + k] = v;
    });
    return result;
  }
  /** @property {Object} - 关键字段的原值和所有新值数据组成的对象，原值字段名称前加"$"。多选返回数组。 */
  get fullData() {
    return Wb.apply(this.originData, this.data);
  }
  /**
   * 获取指定对象同当前记录中的差异字段值与当前记录关键字段的原值组成的对象。原值字段名称以"$"开头。
   * @param {Object} data 比较对象。
   * @return {Object} 差异字段值和原值组成的对象。
   */
  getDiffer(newData) {
    let data = this.originData, oldData = this.data$, oldValue, equal;

    Wb.each(newData, (k, v) => {
      oldValue = oldData[k];
      if (Wb.isDate(v) && Wb.isDate(oldValue))
        equal = v.equals(oldValue);
      else
        equal = v === oldValue;
      if (v instanceof Blob || !equal && !((oldValue == null || oldValue === '') && (v == null || v === '')))
        data[k] = v ?? null;
    });
    return data;
  }
  /**
   * 预处理数据，根据字段原型把对象中的字段值转换为原型指定的值。
   * @param {Wb.View} view 视图对象。
   * @param {Object} data 设置的数据对象。
   * @return {Object} 预处理后的数据对象副本。
   * @priv
   */
  preprocess(view, data) {
    data = this.data$ = Wb.apply({}, data);
    if (view.fields || view.defaultFields) {
      let value, fields = Wb.apply({}, view.defaultFields, view.fields);
      Wb.each(fields, (k, v) => {
        value = data[k];
        if (value != null) {
          switch (v.type) {
            case 'date':
              value = Wb.isDate(value) ? value : Wb.parseDate(value, v.format);
              break;
            case 'int':
              value = parseInt(value);
              break;
            case 'float':
              value = parseFloat(value);
              break;
            case 'bool':
              value = Wb.parseBool(value);
              break;
            case 'string':
              value = String(value);
              break;
          }
        }
        if (v.convert)
          value = v.convert.call(this, value, data);
        if (value === undefined && v.value !== undefined)
          value = v.value;
        if (value != null)
          data[k] = value;
      });
    }
    return data;
  }
  /**
   * 把data属性中的包含特定名称的具有指定含义的属性设置到当前组件。 @priv
   */
  applyProperties() {
    let data = this.data$;

    if (data._cls !== undefined)
      this.itemCls = data._cls;
    if (data._disabled != undefined)
      this.disabled = data._disabled;
    if (data._visible != undefined)
      this.visible = data._visible;
    if (data._fixed != undefined)
      this.fixed = data._fixed;
    if (data._tip != undefined)
      this.tip = data._tip;
    if (data._selected != undefined)
      this.doSelect(data._selected, true, false, true, true);
  }
  /** @property {String} - 添加到条目的dom元素的以空格分隔的多个样式类名。 */
  set itemCls(value) {
    let oldCls = this.itemCls$;
    if (oldCls !== value) {
      this.itemCls$ = value;
      this.el.removeClasses(oldCls);
      if (value)
        this.el.cls = value;
    }
  }
  /***/
  get itemCls() {
    return this.itemCls$;
  }
  /** @property {Boolean} - 是否为固定项。固定项不可通过被点击实现选择、编辑和导航，且具有固定背景色。 */
  set fixed(value) {
    this.applyCls(value, 'fixed', 'w-item-fixed');
  }
  /***/
  get fixed() {
    return this.fixed$;
  }
  /**
   * @event render 条目渲染时触发。
   * @param {Object} value 值对象。
   * @param {Element} el 条目元素。
   */
  /** @property {Object} - 条目的数据。
   * 其中如下属性具有指定含义:
   * -_cls: 条目元素增量添加的class属性。
   * -_disabled: 是否禁用。
   * -_selected: 是否被选择。
   * -_visible: 是否隐藏。
   * -_fixed: 是否为固定项。固定项不可通过被点击实现选择、编辑和导航，且具有固定背景色。
   * -_tip: 浮动提示信息。
   * -_icon: 图标。仅适用于{#Wb.GridItem}及其子类和{#Wb.SelectView}。
   * -_color: 图标颜色。仅适用于{#Wb.GridItem}及其子类和{#Wb.SelectView}。
   * -_img: 图片图标。仅适用于{#Wb.GridItem}及其子类和{#Wb.SelectView}。
   * -subtext:条目副标题。仅适用于{#Wb.GridItem}及其子类。名称可通过{#Wb.Grid.subtextField}指定。
   * -_expanded: 节点是否展开。仅适用于{#Wb.TreeItem}及其子类。
   * -_checked: 节点是否显示勾选组件，false显示未勾选组件，true显示已勾选组件，"half"表示半勾选，null不显示勾选。\
   * 获取勾选节点请访问{#checkedNodes#}属性。仅适用于{#Wb.TreeItem}及其子类。
   * -_leaf: 节点是否为叶子节点。仅适用于{#Wb.TreeItem}及其子类。
   * -items: 子节点列表。仅适用于{#Wb.TreeItem}及其子类。
   * -text: 子节点标题。仅适用于{#Wb.TreeItem}及其子类。名称可通过{#Wb.Tree.textField}指定。
   */
  set data(value) {
    let str, me = this, view = me.view, el = me.el;

    value = me.preprocess(view, value);
    str = view.itemTpl.apply(value, el);
    me.applyProperties();
    if (str != null) {
      let child;

      el.innerHTML = str; // It's safe, because all variables are converted to HTML.
      child = el.firstElementChild;
      if (child?.containsCls('w-item')) {
        let sub;
        el.className = child.className;
        el.styleText = child.styleText;
        if (me.selected$)
          el.addCls('w-item-sel');
        if (me.disabled$)
          el.addCls('w-disabled');
        if (me.fixed$)
          el.addCls('w-item-fixed');
        while (sub = child.firstChild)
          el.append(sub);
        child.remove();
      }
    }
    view.fireEvent('render', value, el);
  }
  /***/
  get data() {
    return this.data$;
  }
  /**
   * 查找当前条目指定方位最近的条目。
   * @param {String} position 查找的方位。
   * -'up': 上
   * -'down': 下
   * -'left': 左
   * -'right': 右
   * @return {Wb.ViewItem} 找到的条目，未找到返回null。
   */
  findSibling(position) {
    //算法: 向上或向下遍历最近的100项，查找距离最近的元素
    let foundItem, dx, dy, dir, distance, minDistance = Number.MAX_VALUE, ct = 0,
      item = this, x = item.el.offsetLeft, y = item.el.offsetTop,
      pt = [x, y], prev = position == 'left' || position == 'up';

    foundItem = prev ? item.previousSibling : item.nextSibling;
    while (item = (prev ? item.previousSibling : item.nextSibling)) {
      dx = item.el.offsetLeft;
      dy = item.el.offsetTop;
      switch (position) {
        case 'left':
          dir = dx < x;
          break;
        case 'up':
          dir = dy < y;
          break;
        case 'right':
          dir = dx > x;
          break;
        case 'down':
          dir = dy > y;
          break;
        default:
          Wb.raise(`Invalid position: ${position}`);
      }
      distance = Wb.Math.getDistance(pt, [dx, dy]);
      if (dir && distance < minDistance) {
        minDistance = distance;
        foundItem = item;
      }
      if (ct++ > 100)
        break;
    }
    return foundItem;
  }
  /**
   * 根据当前条目的数据刷新视图。
   */
  refresh() {
    this.data = this.data$;
  }
  /***/
  insertRefresh() {
    this.refresh();
  }
  /** @property {Wb.View} - 获取当前组件所在的视图对象，如果组件为视图返回组件本身，如果未找到视图将返回null。 */
  get view() {
    let parent = this.parent;

    while (parent) {
      if (parent.isView)
        return parent;
      parent = parent.parent;
    }
    return null;
  }
  /**
   * 设置当前组件的焦点和滚动条。 @priv
   * @param {Boolean} [preventFocus] 是否阻止设置焦点。
   * @param {Boolean} [preventScroll] 是否阻止滚动条滚动。
   */
  doFocusScroll(preventFocus, preventScroll) {
    let me = this;
    if (!preventFocus)
      me.el.focusOnly();
    if (!preventScroll)
      (me.isNode ? me.contentEl : me.el).intoView();
  }
  /**
   * 取消选择指定视图中除本条目之外的其它所有条目。 @priv
   * @param {Wb.View} view 视图。
   * @param {Boolean} suppressEvent 是否阻止事件触发。
   * @return {Boolean} true条目选择有变化，false条目选择无变化。
   */
  deselectOthers(view, suppressEvent) {
    let me = this, changed = false;
    view.suspendSelChange++;
    try {
      view.cascade(item => {
        if (item.selected$ && item != me) {
          if (item.doSelect(false, true, suppressEvent))
            changed = true;
        }
      });
    } finally {
      view.suspendSelChange--;
    }
    return changed;
  }
  /**
   * 设置当前组件的选择状态。
   * @param {Boolean} selected 选择状态，true选择，false不选择。
   * @param {Boolean} [keepExisting] 是否保留原选择的条目选择状态。仅当selected参数为true时有效。
   * @param {Boolean} [suppressEvent] 是否压制选择事件触发。
   * @param {Boolean} [preventFocus] 是否阻止设置焦点。
   * @param {Boolean} [preventScroll] 是否阻止滚动条滚动。
   * @return {Boolean} 是否设置成功。true成功，false被取消。
   */
  doSelect(selected, keepExisting, suppressEvent, preventFocus, preventScroll) {
    let me = this, view = me.view;

    if (!view.multiSelect)
      keepExisting = false;
    if (me.selected$ == selected) {
      let selChanged;
      if (selected) {
        if (!keepExisting)
          selChanged = me.deselectOthers(view, suppressEvent);
        me.doFocusScroll(preventFocus, preventScroll);
        if (selChanged && view && !suppressEvent && view.suspendSelChange == 0)
          view.fireEvent('selectionchange');
      }
      return true;
    }
    if (view.fireEvent(selected ? 'beforeselect' : 'beforedeselect', me) === false)
      return false;
    if (selected) {
      if (!keepExisting)
        me.deselectOthers(view, suppressEvent);
      me.doFocusScroll(preventFocus, preventScroll);
    }
    me.selected$ = selected;
    me.setCls(selected, 'w-item-sel');
    if (view && !suppressEvent)
      view.fireEvent(selected ? 'select' : 'deselect', me);
    if (view && !suppressEvent && view.suspendSelChange == 0)
      view.fireEvent('selectionchange');
    return true;
  }
  /** @property {Boolean} - 条目是否被选择。当容器视图允许多选时，将取消原选择条目的选择状态。
   * 更多选项请使用{#doSelect}方法。
   */
  set selected(value) {
    this.doSelect(value);
  }
  /***/
  get selected() {
    return this.selected$;
  }
  /**
   * 选择当前条目。当容器视图允许多选时，将取消原选择条目的选择状态。更多选项请使用{#doSelect}方法。
   * @param {Boolean} [keepExisting] 是否保留原选择的条目选择状态。
   * @param {Boolean} [suppressEvent] 是否压制选择事件触发。
   * @param {Boolean} [preventFocus] 是否阻止设置焦点。
   * @param {Boolean} [preventScroll] 是否阻止滚动条滚动。
   */
  select(keepExisting, suppressEvent, preventFocus, preventScroll) {
    this.doSelect(true, keepExisting, suppressEvent, preventFocus, preventScroll);
  }
  /**
   * 选择当前条目并阻止设置焦点。当容器视图允许多选时，将取消原选择条目的选择状态。更多选项请使用{#doSelect}方法。
   * @param {Boolean} [keepExisting] 是否保留原选择的条目选择状态。
   * @param {Boolean} [suppressEvent] 是否压制选择事件触发。
   * @param {Boolean} [preventFocus] 是否阻止设置焦点。
   * @param {Boolean} [preventScroll] 是否阻止滚动条滚动。
   */
  selectNoFocus(keepExisting, suppressEvent) {
    this.doSelect(true, keepExisting, suppressEvent, true);
  }
  /**
   * 选择当前条目并阻止设置滚动。当容器视图允许多选时，将取消原选择条目的选择状态。更多选项请使用{#doSelect}方法。
   * @param {Boolean} [keepExisting] 是否保留原选择的条目选择状态。
   * @param {Boolean} [suppressEvent] 是否压制选择事件触发。
   * @param {Boolean} [preventFocus] 是否阻止设置焦点。
   * @param {Boolean} [preventScroll] 是否阻止滚动条滚动。
   */
  selectNoScroll(keepExisting, suppressEvent) {
    this.doSelect(true, keepExisting, suppressEvent, false, true);
  }
  /**
   * 取消选择当前条目。
   * @param {Boolean} [suppressEvent] 是否压制选择事件触发。
   */
  deselect(suppressEvent) {
    this.doSelect(false, false, suppressEvent);
  }
  /** @property {Proxy} - 当前数据的代理对象，可通过该对象直接读写数据属性值。 */
  get proxy() {
    return this.proxy$ ??= new Proxy(this, {
      //读接口
      get(target, prop) {
        return target.data[prop];
      },
      //写接口
      set(target, prop, value) {
        target.set(prop, value);
        return true;
      }
    });
  }
  /**
   * 设置指定名称字段的值。
   * Example:
   *
   *     item.set('fieldName', value); //设置单个值
   *     item.set({field1: 'abc', field2: 123}); //设置多个值
   *
   * @param {String/Object} fieldName 字段名称或字段名称和值组成的对象。设置多个字段值时请指定为对象值。
   * @param {Object} value 设置的值。仅当fieldName为字段名称时有效。
   */
  set(fieldName, value) {
    let me = this, newData, oldData = me.data$, updated;

    if (Wb.isObject(fieldName)) {
      //评估是否有变化
      Wb.each(fieldName, (k, v) => {
        if (oldData[k] !== v) {
          updated = true;
          return false;
        }
      });
      if (updated)
        newData = Wb.apply({}, oldData, fieldName);
    } else if (oldData[fieldName] !== value) {
      newData = Wb.copy(oldData);
      newData[fieldName] = value;
      updated = true;
    }
    if (updated) {
      let view = me.view;
      me.data = newData;
      if (view.recordChanges$)
        view.fireEvent('update', me, newData, oldData);
    }
  }
  /**
   * 把对象中的所有属性值更新到当前条目。
   * @param {Object} data 对象值。对象中的blob属性值将自动转换为"(blob)"文本。
   */
  update(data) {
    Wb.each(data, (k, v) => {
      if (v instanceof Blob)
        data[k] = '(blob)';
    });
    data = Wb.apply({}, this.data$, data);
    this.data = data;
  }
  /**
   * 获取指定名称字段的值。
   * @return {Object} 字段值。
   */
  get(fieldName) {
    return this.data[fieldName];
  }
}
/**
 * 表格条目组件，亦称表格行。每个表格条目对应表格的每一行。
 */
Cls['Wb.GridItem'] = class gridItem extends Wb.mixin.Icon(Wb.ViewItem) {
  static protos = {
    tagName: 'tr'
  };
  /***/
  set data(data) {
    let fieldName, subtext, value, render, textEl, iconAdded, subTextAdded, me = this, el = me.el,
      view = me.view, autoWrap, wrapEl, align;

    data = me.preprocess(view, data);
    el.clearChildren();
    //子元素清空后图标相关数据需清空
    me.icon$ = me.img$ = me.iconColor$ = undefined;
    view.leafColumns?.forEach(col => {
      fieldName = col.fieldName;
      if (col.keyValue)
        value = data[fieldName + '$'] ?? data[fieldName];
      else
        value = data[fieldName];
      textEl = el.addTag('td');
      if (col.freeze) {
        textEl.addCls('w-freeze');
        textEl.setStyle('right', col.freezeRight);
        textEl.setStyle('left', col.freezeLeft);
      }
      if (col.rowNum)
        textEl.addCls('w-rn');
      else {
        if (!iconAdded && view.showIcon) {
          wrapEl = textEl.addEl('w-row w-align-center');
          textEl.addCls('w-full-td');
          me.iconEl = wrapEl.addEl('w-item-icon');
          textEl = wrapEl.addEl();
          if (!data._img)
            data._icon ??= view.itemIcon;
          iconAdded = true;
        }
        if (!subTextAdded) {
          subtext = data[view.subtextField];
          if (subtext) {
            textEl.cls = 'w-text-wrap';
            wrapEl = textEl;
            textEl = wrapEl.addEl();
            wrapEl.addEl('w-sub-text').textContent = subtext;
          }
          subTextAdded = true;
        }
      }
      textEl.addCls('w-text');
      align = col.align;
      if (align == null) {
        if (Wb.isNumber(value))
          textEl.addCls('w-ta-right');
      } else {
        if (align)
          textEl.addCls('w-ta-' + align);
      }
      align = col.verticalAlign;
      if (align != null)
        textEl.addCls('w-v-' + align);
      autoWrap = col.autoWrap;
      if (autoWrap)
        textEl.addCls('w-' + autoWrap);
      render = col.render;
      if (render)
        value = render.call(me, value, data, col, textEl);
      value = col.formatValue(value);
      //value为undefined表示已经渲染，无需再设置text
      if (value !== undefined)
        textEl.textContent = value;
    });
    me.applyProperties();
    view.fireEvent('render', data, el);
  }
  /***/
  get data() {
    return this.data$;
  }
  /***/
  set icon(value) {
    this.data._icon = value;
    if (this.iconEl)
      super.icon = value;
    else
      this.refresh();
  }
  /***/
  get icon() {
    return this.data._icon;
  }
  /***/
  set iconColor(value) {
    this.data._color = value;
    if (this.iconEl)
      super.iconColor = value;
    else
      this.refresh();
  }
  /***/
  get iconColor() {
    return this.data._color;
  }
  /***/
  set img(value) {
    this.data._img = value;
    if (this.iconEl)
      super.img = value;
    else
      this.refresh();
  }
  /***/
  get img() {
    return this.data._img;
  }
  /**
   * 设置当前条目指定列的勾选状态。该方法为轻量级的设置勾选状态实现，较{#set}方法具有更高性能。
   * @param {Wb.Column/String} col 列或列关联的fieldName。
   * @param {Boolean/String/Number} checked 是否勾选。值为布尔值、字符串或数字。"false"表示取消勾选。
   */
  setChecked(col, checked) {
    if (Wb.isString(col))
      col = this.view.findColumn(col);
    (this.contentEl || this.el).children[col.leafIndex].firstChild.setCls(Wb.parseBool(checked), 'w-check-checked');
  }
  /***/
  applyProperties() {
    super.applyProperties();
    let data = this.data, icon = data._icon;

    if (icon)
      super.icon = icon;
    else if (data._img)
      super.img = data._img;
    if (data._color)
      super.iconColor = data._color;
  }
}
/**
 * 树条目组件，亦称树节点。每个树条目对应树中的每个节点。
 */
Cls['Wb.TreeItem'] = class treeItem extends Wb.mixin.View(Wb.GridItem) {
  static defaults = {
    cname: 'treeItem'
  };
  static cls = 'w-collapse';
  static protos = {
    /** @property {Boolean} - 是否是树节点的标识。 */
    isNode: true,
    expanded$: false,
    tagName: 'div' //重置
  };
  init(configs) {
    super.init(configs);
    this.on({ add: this.onAdd, remove: this.onRemove })
  }
  /** @property {Element} contentEl 内容元素。 @priv */
  /**
   * 添加子节点时执行的方法。 @priv
   * @param {Wb.TreeItem} node 子节点。
   */
  onAdd() {
    this.updateExpander();
  }
  /**
   * 移除子节点时执行的方法。 @priv
   * @param {Wb.TreeItem} node 子节点。
   */
  onRemove() {
    this.updateExpander();
  }
  /**
   * 移动节点扩展器。如果节点已经加载将清除所有子节点，如果节点未加载将设置为已经加载。
   */
  removeExpander() {
    let me = this;

    if (me.loaded)
      me.destroyAll();
    else {
      me.loaded = true;
      me.expanderDiv?.removeCls('w-expander');
    }
  }
  /**
   * 根据指定的子节点路径展开树并查找该路径指向的节点，如果节点存在将选择该节点。
   * Example:
   *
   *     node.selectChild('text');
   *
   * @param {String} path 子节点的路径。
   * @param {Function} [callback] 操作完成后执行的回调方法。可用参数node表示找到的子节点或null。
   * @param {String} [field] 路径使用的字段名称。默认为{#Wb.Tree.textField}。
   * @param {Object} [scope] 回调方法this指向的对象。默认为当前树组件本身。
   * @param {Boolean} [unselect] 找到节点后是否不选择该节点。true不选择，false选择。
   */
  selectChild(path, callback, field, scope, unselect) {
    let node = this;

    field ??= node.view.textField;
    scope ??= node;
    node.expand(f => {
      node = node.findItem(field, path);
      if (!unselect)
        node?.select();
      callback?.call(scope, node);
    });
  }
  /**
   * 设置当前组件的选择状态。详见{#Wb.ViewItem.doSelect}方法。
   * @param {...Object} otherParams selected, keepExisting, suppressEvent, preventFocus, preventScroll等参数说明
   * 见{#Wb.ViewItem.select}。
   * @param {Boolean} [preventForceView] 是否阻止强制展开上级节点并使其可见。
   */
  doSelect(selected, keepExisting, suppressEvent, preventFocus, preventScroll, preventForceView) {
    if (selected && !preventForceView)
      this.forceView(true);
    return super.doSelect(selected, keepExisting, suppressEvent, preventFocus, preventScroll);
  }
  /**
   * 选择当前节点。详见{#Wb.ViewItem.select}方法。
   * @param {...Object} otherParams keepExisting, suppressEvent, preventFocus, preventScroll等参数说明
   * 见{#Wb.ViewItem.select}。
   * @param {Boolean} [preventForceView] 是否阻止强制展开上级节点并使其可见。
   */
  select(keepExisting, suppressEvent, preventFocus, preventScroll, preventForceView) {
    this.doSelect(true, keepExisting, suppressEvent, preventFocus, preventScroll, preventForceView);
  }
  /**
   * 根据当前节点是否具有子节点来设置列expander是否可见。 @priv
   */
  updateExpander() {
    this.expanderDiv?.setCls(this.hasChild, 'w-expander');
  }
  /**
   * 强制该节点可见。该方法将展开所有上级节点，并调整滚动条使节点可见。
   * @param {Boolean} [preventScroll] 是否阻止滚动条滚动。
   */
  forceView(preventScroll) {
    this.bubbleParent(node => {
      if (node.isView)
        return false;
      node.expand();
      if (node.depth == 0)
        return false;
    });
    if (!preventScroll)
      this.contentEl.intoView();
  }
  /***/
  set data(data) {
    let me = this, view = me.view, depth = me.depth, itemsName = view.itemsName, el = me.el, fieldDiv,
      checked, oldLeaf = me.data$?._leaf, fieldName, value, render, rowDiv, isNew, wrapDiv, textDiv,
      isFolder, items, showExpander, partialUpdate, propValue, expanderDiv, rightExpander = view.rightExpander;

    data = me.preprocess(view, data);
    items = data[itemsName];
    if (items == 0)
      items = [];
    else if (items == 1)
      items = null;
    if (items)
      items = Wb.toArray(items);
    //子元素清空后图标相关数据需清空
    me.icon$ = me.img$ = me.iconColor$ = undefined;
    isNew = !me.contentEl;
    if (items || isNew) {
      //对子节点在内进行全部更新
      el.clearChildren();
      me.contentEl = el.addEl('w-item-content' +
        (view.gridHeader.fitTable ? ' w-fit-table' : ''));
    } else {
      //仅更新当前节点，不更新子节点
      partialUpdate = true;
      me.contentEl.clearChildren();
      //部分更新叶子状态不变
      data._leaf = oldLeaf;
    }
    rowDiv = me.contentEl;
    isFolder = !data._leaf;
    if (isFolder) {
      if (items?.length)
        showExpander = true;
      else
        showExpander = !items && (!me.loaded || me.loaded && me.items$.length);
    } else {
      showExpander = false;
    }
    view.leafColumns?.forEach(col => {
      fieldName = col.fieldName;
      if (col.keyValue)
        value = data[fieldName + '$'] ?? data[fieldName];
      else
        value = data[fieldName];
      fieldDiv = rowDiv.addEl();
      if (col.freeze) {
        fieldDiv.addCls('w-freeze');
        fieldDiv.setStyle('right', col.freezeRight);
        fieldDiv.setStyle('left', col.freezeLeft);
      }
      fieldDiv.width = col.realWidth;
      if (col.expander) {
        //带展开功能的列
        wrapDiv = fieldDiv.addEl('w-expander-wrap');
        if (depth > 0 && view.leafIndent)
          wrapDiv.setStyle('padding-left', depth + 'em');
        if ((isFolder || view.leafExpander) && !rightExpander) {
          expanderDiv = me.expanderDiv = wrapDiv.addEl();
        }
        checked = data._checked;
        if (checked == null) {
          if (me.checkEl) {
            me.mun(me.checkEl, 'click', me.onCheckClick);
            me.checkEl = null;
          }
        } else {
          if (checked == 'half')
            propValue = 'w-check-half';
          else if (checked)
            propValue = 'w-check-checked';
          else
            propValue = 'w-check-box';
          me.checkEl = wrapDiv.addEl('w-box ' + propValue);
          me.mon(me.checkEl, 'click', me.onCheckClick);
        }
        if (view.showIcon) {
          me.iconEl = wrapDiv.addEl();
          if (!data._img)
            data._icon ??= isFolder ? view.folderIcon : view.itemIcon;
        }
        me.textEl = textDiv = wrapDiv.addEl();
        if (isFolder || view.leafExpander) {
          if (rightExpander)
            expanderDiv = me.expanderDiv = wrapDiv.addEl();
          //如果为目录且存在子节点或目录未加载时显示expander
          if (showExpander)
            expanderDiv.className = 'w-expander-site w-expander';
          else
            expanderDiv.className = 'w-expander-site';
        }
        propValue = data[view.subtextField];
        if (propValue) {
          textDiv.cls = 'w-text-wrap';
          me.textEl = textDiv.addEl();
          textDiv.addEl('w-sub-text').textContent = propValue;
          textDiv = me.textEl;
        }
        propValue = view.parentSelect;
        if (propValue?.multiSelect) {
          let valueField = propValue.valueField, dataValue = data[valueField];
          if (propValue.tagCt?.down(item => item.itemData[valueField] === dataValue)) {
            wrapDiv.addEl('w-icon icon-ok w-flag1');
          }
        }
      } else {
        if (col.rowNum)
          fieldDiv.addCls('w-rn');
        textDiv = fieldDiv;
      }
      textDiv.addCls('w-text');
      propValue = col.align;
      if (propValue == null) {
        if (!col.expander && Wb.isNumber(value))
          textDiv.addCls('w-ta-right');
      } else {
        if (propValue)
          textDiv.addCls('w-ta-' + propValue);
      }
      propValue = col.verticalAlign;
      if (propValue != null)
        textDiv.addCls('w-v-' + propValue);
      propValue = col.autoWrap;
      if (propValue)
        textDiv.addCls('w-' + propValue);
      render = col.render;
      if (render)
        value = render.call(me, value, data, col, textDiv);
      value = col.formatValue(value);
      //value为undefined表示已经渲染，无需再设置text
      if (value !== undefined)
        textDiv.textContent = value;
    });
    if (isFolder && !partialUpdate) {
      me.bodyEl = el.addEl('w-item-tree');
      if (items) {
        me.loaded = true;
        delete data[itemsName];
        me.setData(items);
      }
      me.expanded = !!data._expanded;
    }
    me.applyProperties();
    view.fireEvent('render', data, el);
  }
  /***/
  get data() {
    return this.data$;
  }
  /** @property {Object} - 获取包括当前节点及其所有子节点在内所有节点的数据副本。 */
  get itemsData() {
    return this.getItemsData();
  }
  /**
   * 获取包括当前节点及其所有子节点在内所有节点的数据副本。
   * @param {Wb.ViewItem[]} [excludeItems] 如果包含这些下级条目，则排除这些条目的数据。
   * @param {Boolean} [removeEmptyItems] 目录节点如果无子节点是否移除items属性。
   * @return {Object} 节点数据。
   */
  getItemsData(excludeItems, removeEmptyItems) {
    let data = Wb.copy(this.data$);
    if (!this.leaf && this.loaded && (this.items.length || !removeEmptyItems))
      data.items = this.getData(true, excludeItems, removeEmptyItems);
    return data;
  }
  /** @property {Boolean} - 当前节点复选框状态：
   * -false: 显示未勾选
   * -true: 显示已勾选
   * -'half': 显示半勾选
   * -null: 不显示勾选
   */
  set checked(value) {
    let me = this;

    if (me.checkEl) {
      let view = me.view, cls;
      if (view?.fireEvent('beforecheckchange', me, value) !== false) {
        me.data._checked = value;
        if (value == null) {
          me.checkEl.remove();
          me.checkEl = null;
        } else {
          if (value == 'half')
            cls = 'w-check-half';
          else if (value)
            cls = 'w-check-checked';
          else
            cls = 'w-check-box';
          me.checkEl.className = 'w-box ' + cls;
        }
        view?.fireEvent('checkchange', me, value);
      }
    } else {
      me.data._checked = value;
      me.refresh();
    }
  }
  /***/
  get checked() {
    return this.data._checked;
  }
  /**
   * Check图标点击时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onCheckClick(e) {
    let me = this, oldChecked;

    oldChecked = me.data._checked;
    me.checked = oldChecked == 'half' || !oldChecked;
    e.stopEvent();
  }
  /**
   * 刷新当前节点及其所有子节点的数据。
   */
  refreshAll() {
    this.cascadeSelf(node => node.refresh());
  }
  /***/
  insertRefresh() {
    this.refreshAll();
  }
  /**
   * 获取远程数据，把数据加载到当前节点中。
   * 详细说明请参考{#Wb.View.load}。
   */
  load(configs) {
    return this.view.load(Wb.apply({
      node: this
    }, configs));
  }
  /**
   * 重新加载数据，并选择刷新前选择的首个路径相同的节点（如果该节点在当前节点内）。
   * @param {String} [field] 生成路径时使用的字段名称。默认为{#Wb.Tree.textField}。
   * @param {Function} [success] 成功之后的回调方法。见{#load}方法的success说明。
   */
  loadSelect(field, success) {
    let me = this, view = me.view, node = view?.selection, path;

    if (me.contains(node, true)) {
      let autoSelect = view.autoSelect;
      view.autoSelect = false;
      view.suspendEvent('selectionchange');
      path = node.getPath(field, '\n');
      me.load({
        callback() {
          view.autoSelect = autoSelect;
          view.resumeEvent('selectionchange');
        },
        success(...args) {
          let items = args[1];
          if (items.length)
            view.selectPath(path, null, field, '\n');
          else
            view.fireEvent('selectionchange');
          success?.apply(me, args);
        }
      });
    } else {
      me.reload({ success });
    }
  }
  /**
   * {#load}方法的Promise版本。无论请求成功或失败，Promise始终执行resolved。\
   * 请求成功或失败请通过xhr.ok判断。如果方法被取消，Promise将返回resolve({canceled: true})。
   * 详细说明请参考{#Wb.View.load}。
   * @return {Promise} promise对象。
   */
  loadx(configs) {
    return this.view.loadx(Wb.apply({
      node: this
    }, configs));
  }
  /**
   * 默认使用最后一次{#load}方法的配置对象，获取远程数据，把数据加载到当前节点中。
   * 详细说明请参考{#Wb.View.load}。
   */
  reload(configs) {
    return this.view.reload(Wb.apply({
      node: this,
      keepPageIndex: true
    }, configs));
  }
  /**
   * {#reload}方法的Promise版本。无论请求成功或失败，Promise始终执行resolved。\
   * 请求成功或失败请通过xhr.ok判断。如果方法被取消，Promise将返回resolve({canceled: true})。
   * 详细说明请参考{#Wb.View.load}。
   * @return {Promise} promise对象。
   */
  reloadx(configs) {
    return this.view.reloadx(Wb.apply({
      node: this
    }, configs));
  }
  /** @property {Boolean} - 当前节点是否为叶子节点。 */
  get leaf() {
    return !!this.data._leaf;
  }
  /**
   * 创建当前节点及其上级节点原始数据类型属性组成的参数对象。
   * @param {Boolean} [containsParent] 是否包含所有上级节点的参数。
   * @return {Object} 参数对象。
   */
  createParams(containsParent) {
    let params = {};

    this.bubble(parent => {
      if (!parent.isNode)
        return false;
      Wb.each(parent.data, (k, v) => {
        if (!(k in params) && Wb.isPrimitive(v))
          params[k] = v;
      });
      if (!containsParent)
        return false;
    });
    return params;
  }
  /** @property {Boolean} loading 节点是否正在加载中。 @readonly */
  /** @property {Boolean} loaded 节点是否已经加载完成。仅目录节点有效。 */
  /**
   * 展开节点。如果子节点未加载将先加载子节点。
   * @param {Function} callback 成功展开节点后的回调方法。
   * @return {Boolean} true正常执行加载，false加载被取消。
   */
  expand(callback) {
    let me = this;
    if (me.leaf) {
      callback?.call(me);
      return;
    }
    let configs, autoPostParams, tree = me.view;

    if (me.loaded) {
      me.doExpand();
      callback?.call(me);
    } else {
      if (callback) {
        me.expCallbacks ??= [];
        me.expCallbacks.push(callback);
      }
      if (!me.loading) {
        configs = {
          node: me,
          callback(a, b, c, xhr) {
            me.showLoadingIcon.cancelDelay(me);
            me.hideLoadingIcon();
            if (xhr.ok) {
              me.loaded = true;
              me.doExpand();
              if (me.expCallbacks) {
                me.expCallbacks.forEach(fn => fn.call(me));
                delete me.expCallbacks;
              }
            }
          }
        };
        autoPostParams = tree.autoPostParams;
        if (autoPostParams !== false)
          configs.params = me.createParams(autoPostParams != null);
        me.showLoadingIcon.delay(me, tree.loadingIconDelay);
        if (!tree.load(configs)) {
          me.showLoadingIcon.cancelDelay(me);
          me.hideLoadingIcon();
          return false;
        }
      }
    }
    return true;
  }
  /**
   * {#expand}方法的Promise版本。如果展开被取消，Promise将返回resolve({canceled: true})。
   * @return {Promise} promise对象。
   */
  expandx() {
    return new Promise(resolve => {
      if (!this.expand(resolve))
        resolve({ canceled: true });
    });
  }
  /**
   * 显示正在加载中的图标。 @priv
   */
  showLoadingIcon() {
    let me = this, iconEl = me.iconEl;
    if (iconEl) {
      me.preloadCls = iconEl.className;
      me.preloadImg = iconEl.getStyle('background-image');
      if (me.preloadImg)
        iconEl.removeStyle('background-image');
      iconEl.className = 'w-node-icon w-icon w-spin icon-' + me.view.loadingIcon;
    }
  }
  /**
   * 隐藏正在加载中的图标。 @priv
   */
  hideLoadingIcon() {
    let me = this, iconEl = me.iconEl;
    if (iconEl && me.preloadCls != null) {
      iconEl.className = me.preloadCls;
      if (me.preloadImg)
        iconEl.setStyle('background-image', me.preloadImg);
      delete me.preloadImg;
      delete me.preloadCls;
    }
  }
  /** @property {Element} iconEl 图标元素。 */
  /**
   * 执行节点的展开操作，子节点必须已经被加载。
   * @priv
   */
  doExpand() {
    if (!this.expanded$) {
      this.expanded$ = this.data._expanded = true;
      this.removeCls('w-collapse');
      this.addCls('w-expand');
      this.view.fireEvent('toggleexpand', this);
    }
  }
  /**
   * 收缩节点，隐藏所有直接下级子节点。
   */
  collapse() {
    if (this.expanded$) {
      this.expanded$ = this.data._expanded = false;
      this.removeCls('w-expand');
      this.addCls('w-collapse');
      this.view.fireEvent('toggleexpand', this);
    }
  }
  /** @property {Boolean} - 节点是否展开。 */
  set expanded(expanded) {
    if (this.expanded$ !== expanded) {
      if (expanded)
        this.expand();
      else
        this.collapse();
    }
  }
  /***/
  get expanded() {
    return this.expanded$;
  }
  /**
   * 切换节点的展开状态。
   */
  toggleExpand() {
    this.expanded = !this.expanded;
  }
  /** @property {Object} - 获取当前节点合并所有上级节点的数据对象。如果对象成员重复，下级节点覆盖上级节点。 */
  get allData() {
    let data = [], result = {};
    this.bubble(node => {
      if (node.isTree)
        return false;
      data.push(node.data);
    });
    data.each(item => Wb.apply(result, item), true, true);
    return result;
  }
  /** @property {Number} - 获取节点的深度。根节点深度为0。 */
  get depth() {
    let parent = this.parent;

    if (!parent || parent.isTree)
      return 0;
    else
      return parent.depth + 1;
  }
  /**
   * 获取当前节点以指定分隔符分隔的路径，路径值由节点fieldName字段指定。
   * @param {String} [fieldName] 路径值字段名。默认为{#Wb.Tree.textField}。
   * @param {String} [separator] 路径分隔符。默认为{#Wb.Tree.pathSeparator}。
   * @return {String} 路径。
   */
  getPath(fieldName, separator) {
    let isFirst = true, path = '', tree = this.view;

    fieldName ??= tree.textField;
    separator ??= tree.pathSeparator;
    this.bubble(parent => {
      if (parent.isTree)
        return false;
      if (isFirst)
        isFirst = false;
      else
        path = separator + path;
      path = parent.data[fieldName] + path;
    });
    return path;
  }
  /** @property {String} - 获取当前节点以{#Wb.Tree.pathSeparator}分隔的路径，路径值由节点文本字段指定。 */
  get path() {
    return this.getPath('text');
  }
  /** @property {String} - 节点的标题。 */
  set text(value) {
    this.data.text = value;
    super.text = value;
  }
  /** @property {String} - 节点的标题。 */
  get text() {
    return this.data.text;
  }
  /** @property {Wb.TreeItem} - 当前节点所在的根节点。 */
  get rootNode() {
    return this.upBy(p => p.depth == 0);
  }
}
/**
 * 日历视图组件，以列表的形式展示日期。当前日期代表显示该日期所在月的日历视图，日期值代表日历视图的组件值。\
 * 点击顶部导航按钮可以增减年月，同时按Ctrl键可以快速增减年份。
 */
Cls['Wb.DateView'] = class dateView extends Wb.View {
  static cls = 'w-dateview';
  static configs = {
    value: new Date(),
    /** @property {Boolean} - 是否创建“现在”按钮。 */
    nowButton: true
  };
  static protos = {
    itemTpl: '{text}',
    /** @property {Number} - 指定周几为开始日期，0为周日，1为周一，其它类推。 */
    startDay: Str.startDay
  };
  /** @property {Wb.DateView} - 获取共享的下拉日期视图组件。 */
  static get picker() {
    return this.dateViewPicker$ ??= new Wb.DateView({ autoDestroy: false });
  }
  /** @property {Array} - 周日到周一的简称组成的列表。 */
  static weekdays = (f => {
    let date = new Date(2022, 10, 6), i, days = [],
      formatter = new Intl.DateTimeFormat(Str.lang, { weekday: Str.lang.startsWith('zh-') ? 'narrow' : 'short' });
    for (i = 0; i < 7; i++)
      days.push(formatter.format(date.addDay(i)));
    return days;
  })();
  /** @property {Date} maxValue 允许选择的最大日期值。 */
  /** @property {Date} minValue 允许选择的最小日期值。 */
  /**
   * @event selectdate 选定某个日期时触发。
   * @param {Date} date 日期。
   */
  /***/
  init(configs) {
    let me = this, startDay = me.startDay, i, html, weekdays = me.constructor.weekdays;

    super.init(configs);
    html = '<div class="w-dateview-label">';
    for (i = 0; i < 7; i++)
      html += '<div>' + weekdays[(i + startDay) % 7] + '</div>';
    html += '</div><div class="w-items w-dateview-content"></div>';
    me.html = html;
    me.addHeader({
      cname: 'toolbar',
      cls: 'w-center',
      defaults: {
        cname: 'iconButton',
        repeatInterval: true
      },
      items: [{
        icon: 'left3',
        tip: Str.prevYear + ' (Ctrl+Up)',
        handler: me.prevYear.bind(me)
      }, {
        icon: 'left2',
        tip: Str.prevMonth + ' (Ctrl+Left)',
        handler: me.prevMonth.bind(me)
      }, {
        cname: 'label',
        cid: 'dateLabel',
        text: '',
        cls: 'w-date-title'
      }, {
        icon: 'right2',
        tip: Str.nextMonth + ' (Ctrl+Right)',
        handler: me.nextMonth.bind(me)
      }, {
        icon: 'right3',
        tip: Str.nextYear + ' (Ctrl+Down)',
        handler: me.nextYear.bind(me)
      }]
    });
    me.applyRefer();
    if (me.nowButton)
      me.nowButtonComp = me.addFooter({
        cname: 'padTool',
        alignSelf: 'center',
        text: Str.now,
        handler: me.selectToday.bind(me)
      });
    me.on({ itemclick: me.onItemClick, select: me.onItemSelect });
    if (Wb.isTouch) {
      me.mon({
        el: me.bodyEl,
        touchstart: {
          fn(e) {
            me.tapAtY = e.y;
          },
          passive: false
        },
        touchend(e) {
          let y = me.tapAtY;
          if (Math.abs(e.y - y) > 20) {
            if (e.y > y) {
              me.prevPage();
            } else {
              me.nextPage();
            }
          }
        }
      });
    } else {
      me.mon(me.bodyEl, 'wheel', e => {
        if (e.deltaY < 0)
          me.prevPage();
        else
          me.nextPage();
        e.stopEvent();
      }, me, { passive: false }
      );
    }
  }
  /**
   * 日历向上翻页。 @priv
   */
  prevPage() {
    this.prevMonth();
    this.lastItem.selected = true;
  }
  /**
    * 日历向下翻页。 @priv
    */
  nextPage() {
    this.nextMonth();
    this.firstItem.selected = true;
  }
  /***/
  onKeyDown(e, options) {
    let me = this, key = e.code;

    if ((key == Keys.Up || key == Keys.Left) && me.firstItem?.selected) {
      //转到上一月并选择最后一天
      me.prevPage();
      e.stopEvent();
      return;
    }
    if ((key == Keys.Down || key == Keys.Right) && me.lastItem?.selected) {
      //转到下一月并选择第一天
      me.nextPage();
      e.stopEvent();
      return;
    }
    if (e.ctrlMeta) {
      //跳转年月
      let ignore;
      switch (key) {
        case Keys.Up:
          me.prevYear();
          break;
        case Keys.Down:
          me.nextYear();
          break;
        case Keys.Left:
          me.prevMonth();
          break;
        case Keys.Right:
          me.nextMonth();
          break;
        default:
          ignore = true;
      }
      if (!ignore) {
        e.stopEvent();
        return;
      }
    }
    if (e.isGoKey) {
      me.fireEvent('selectdate', me.value);
      e.stopEvent();
      return;
    }
    super.onKeyDown(e, options);
  }
  /**
   * 条目被点击时执行的方法。 @priv
   */
  onItemClick(item) {
    this.value = item.data.date;
    this.fireEvent('selectdate', this.value);
  }
  /**
   * 条目被选择时执行的方法。 @priv
   */
  onItemSelect(item) {
    this.value$ = item.data.date;
  }
  /**
   * 选择今天作为组件的日期值。 @priv
   */
  selectToday() {
    let now = new Date().datePart;
    if (now > this.maxValue || now < this.minValue) {
      //无效的值仅跳转视图
      this.currentDate = now;
    } else {
      this.value = now;
      this.fireEvent('selectdate', this.value);
    }
  }
  /**
   * 转到上一年视图。
   */
  prevYear() {
    this.currentDate = this.currentDate.addYear(-1).constrainValue;
  }
  /**
   * 转到下一年视图。
   * @param {Event} e 事件对象。
   */
  nextYear() {
    this.currentDate = this.currentDate.addYear(1).constrainValue;
  }
  /**
   * 转到上一月视图。
   */
  prevMonth() {
    this.currentDate = this.currentDate.addMonth(-1).constrainValue;
  }
  /**
   * 转到下一月视图。
   */
  nextMonth() {
    this.currentDate = this.currentDate.addMonth(1).constrainValue;
  }
  /** @property {Date} - 组件当前展示的日期值。如果为null默认为当前日期。 */
  set currentDate(date) {
    let me = this, current = new Date(), activated = me.activated;
    date ??= current;
    me.currentDate$ = date;
    let i, calDate, cls, configs, minValue = me.minValue, maxValue = me.maxValue,
      data = [], today = current, curValue = me.value$, viewData = me.viewData,
      firstDate = date.monthFirstDate, lastDate = date.monthLastDate,
      firstDateSunday = firstDate.sundayDate,
      firstDay = firstDateSunday.addDay(me.startDay - (firstDate.equals(firstDateSunday) ? 7 : 0));

    //minValue/maxValue/today,firstDate等相同时无需重绘
    if (minValue?.datePart.getTime() == viewData?.minValue?.datePart.getTime() &&
      maxValue?.datePart.getTime() == viewData?.maxValue?.datePart.getTime() &&
      today.datePart.getTime() == viewData?.today.datePart.getTime() &&
      firstDate.datePart.getTime() == viewData?.firstDate.datePart.getTime()
    ) {
      me.find(item => item.data.date.equals(date))?.select();
      return;
    }
    me.viewData = { minValue, maxValue, today, firstDate };
    me.dateLabel.text = Date.yearMonthFormatter.format(date);
    for (i = 0; i < 42; i++) {
      calDate = firstDay.addDay(i);
      if (calDate >= firstDate && calDate <= lastDate)
        cls = 'w-date-in';
      else
        cls = 'w-date-out';
      if (today.equalsDate(calDate))
        cls += ' w-date-today';
      configs = {
        date: calDate,
        text: calDate.getDate(),
        _cls: cls
      };
      if (curValue.equalsDate(calDate))
        configs._selected = true;
      if (calDate.datePart < minValue?.datePart || calDate.datePart > maxValue?.datePart)
        configs._disabled = true;
      data.push(configs);
    }
    me.data = data;
    if (activated)
      me.focus();
  }
  /***/
  get currentDate() {
    return this.currentDate$;
  }
  /** @property {Date} - 组件的日期值。如果为null默认为当前日期。 @key */
  set value(value) {
    value ||= new Date().datePart;
    this.value$ = value;
    this.currentDate = value;
  }
  /***/
  get value() {
    return this.value$;
  }
}
/**
 * 选择器视图组件，选择器的下拉组件。
 */
Cls['Wb.SelectView'] = class selectView extends Wb.View {
  static cls = 'w-select-view';
  static protos = {
    /** @property {String} - 列表内容的显示字段名称。 */
    textField: 'text',
    /** @property {String} valueField 列表内容的值字段名称。 */
    smartNavigate: null,
    autoLoad: false,
    autoSize: 'height'
  };
  /** @property {Function} prepareMethod 准备数据的方法。 @priv */
  /** @property {Object} prepareScope 准备数据的方法的this对象。 @priv *
  /** @property {Wb.Template} defaultTpl 默认的条目渲染模板。 @readonly */
  /***/
  init(configs) {
    super.init(configs);
    this.defaultTpl = new Wb.Template(this.renderFn.bind(this));
  }
  /**
   * 下拉列表条目的渲染方法。 @priv
   * @param {Object} data 条目数据。
   * @param {Object} el 条目元素。
   */
  renderFn(data, el) {
    let icon, img, parentSelect = this.parentSelect, multiSelect = parentSelect?.multiSelect, subText;

    subText = data[parentSelect?.subtextField];
    if ((icon = data._icon) || (img = data._img) || multiSelect || subText) {
      let wrapEl, iconEl;
      el.clearChildren();
      wrapEl = el.addEl('w-text-wrap w-gap');
      if (icon) {
        iconEl = wrapEl.addEl('w-icon icon-' + icon);
        if (data._color)
          iconEl.setStyle('color', data._color);
      } else if (img) {
        iconEl = wrapEl.addEl('w-img');
        iconEl.setStyle('background-image', 'url("' + Wb.getImagePath(img) + '")')
      }
      el = wrapEl.addEl('w-ellipsis');
      if (subText)
        wrapEl.addEl('w-sub-text').textContent = subText;
      if (multiSelect) {
        let valueField = parentSelect.valueField, value = data[valueField];
        if (parentSelect.tagCt?.some(item => item.itemData[valueField] === value)) {
          wrapEl.addEl('w-icon icon-ok w-ml-auto');
        }
      }
    }
    el.textContent = data[this.textField];
  }
  /***/
  set itemTpl(value) {
    super.itemTpl = value;
  }
  /***/
  get itemTpl() {
    return super.itemTpl ?? this.defaultTpl;
  }
  /**
   * 准备远程加载后的数据。 @priv
   * @param {Array} resp 响应的数据。
   * @return {Array} 准备后的数据。
   */
  prepareData(resp) {
    let me = this, prepareMethod = me.prepareMethod;

    if (prepareMethod)
      return prepareMethod.call(me.prepareScope, resp);
    else
      return resp;
  }
}
/**
 * 勾选视图组件，通过勾选的方式对条目进行单选或多选。
 * 视图条目数据中以下属性包含特定含义：
 * -'text': 文本标题
 * -'value': 值
 * -'_icon': 图标
 * -'_img': 图片图标
 * 其他属性请参考{#Wb.ViewItem.data}说明。
 * @icon check7
 */
Cls['Wb.CheckView'] = class checkView extends Wb.View {
  static protos = {
    clickSelect: true,
    /** @property {String} - 文本标题字段名称，默认为"text"。 */
    textField: 'text',
    /** @property {String} - 值字段名称，默认为"value"。 */
    valueField: 'value',
    /** @property {String} - 图标字段名称，默认为"_icon"。 */
    iconField: '_icon',
    /** @property {String} - 图片图标字段名称，默认为"_img"。 */
    imgField: '_img'
  };
  static configs = {
    selectColor: 'active',
    stickSelect: true
  };
  /***/
  init(configs) {
    let me = this, iconField = me.iconField, imgField = me.imgField;
    super.init(configs);
    configs.itemTpl ??= '<div class="w-item w-item1">{if data.' + iconField + '}<div class="w-icon icon-{' +
      iconField + '}"></div>{/if}{if data.' + imgField + '}<div class="w-img" style="background-image:url(\'{' +
      imgField + '}\')"></div>{/if}<div class="w-name">{' +
      me.textField + '}</div><div class="w-icon w-item1-check"></div></div>';
  }
  /** @property {Object/Array} - 组件的值。当单选时为选择条目的值，未选择返回undefined。多选时为选择条目的值组成的数组，
   * 未选择返回空数组。 */
  set value(value) {
    let me = this, valueField = me.valueField;
    if (value == null)
      me.selection = null;
    else
      me.selection = me.multiSelect ? me.filter(item => value.includes(item.data[valueField])) :
        me.findItem(valueField, value);
  }
  /***/
  get value() {
    let me = this, valueField = me.valueField;
    return me.multiSelect ? me.selectionsData.pluck(valueField) : me.selection?.data[valueField];
  }
  /***/
  set data(value) {
    if (Wb.isArray(value) && !Wb.isObject(value[0])) {
      let newData = [];
      value.forEach(item => newData.push({ [this.textField]: item, [this.valueField]: item }));
      value = newData;
    }
    super.data = value;
  }
  /***/
  get data() {
    return super.data;
  }
}
/**
 * 列表视图组件，用于列表的方式展示条目，条目样式由{#viewType}属性设定。
 * 该视图条目中的以下默认字段名称具有特定含义：
 * -'text': 文本标题
 * -'subtext': 在文本标题下方显示的副文本标题
 * -'_icon': 图标
 * -'_img': 图片图标
 * -'textvalue': 右侧显示的文本值
 * -'datevalue': 右侧显示的日期时间值
 * -'iconvalue': 右侧显示的图标
 * -'badge': 显示在图标或图片图标上的徽章计数，如果无图标或图片图标该属性无效。
 * 其他属性请参考{#Wb.ViewItem.data}说明。
 * @icon list1
 */
Cls['Wb.ListView'] = class listView extends Wb.View {
  static firstNames = ['viewType', 'data'];
  static protos = {
    /** @property {String} - 文本标题字段名称，默认为"text"。 */
    textField: 'text',
    /** @property {String} - 在文本标题下方显示的副文本标题字段名称，默认为"subtext"。 */
    subtextField: 'subtext',
    /** @property {String} - 图标字段名称，默认为"_icon"。 */
    iconField: '_icon',
    /** @property {String} - 图片图标字段名称，默认为"_img"。 */
    imgField: '_img',
    /** @property {String} - 右侧显示的文本值字段名称，默认为"textvalue"。 */
    textvalueField: 'textvalue',
    /** @property {String} - 右侧显示的日期时间值字段名称，默认为"datevalue"。 */
    datevalueField: 'datevalue',
    /** @property {String} - 右侧显示的图标值字段名称，默认为"iconvalue"。 */
    iconvalueField: 'iconvalue',
    /** @property {String} - 显示在图标或图片图标上的徽章计数，如果无图标或图片图标该属性无效，默认为"badge"。 */
    badgeField: 'badge',
    noDivider$: false
  };
  static configs = {
    viewType: 'list'
  };
  /***/
  init(configs) {
    super.init(configs);
    this.initLayout = configs.layout;
  }
  /** @property {Enum} - 视图类型，用于设置视图条目显示的样式。
   * -'smallList': 列表样式，通常在条目左侧包含图标，右侧显示文本。条目以纵向列表方式展示，每行显示一个条目。
   * -'list': 列表样式，通常在条目左侧包含图标，右侧显示文本。条目以纵向列表方式展示，每行显示一个条目。
   * -'smallIcon': 小图标样式，通常在条目左侧包含一个小图标，右侧显示文本。条目默认以横向平铺的方式展示
   * -'mediumIcon': 中等图标样式，通常在条目上方包含一个中等图标，下方显示文本。条目默认以横向平铺的方式展示。
   * -'bigIcon': 大图标样式，通常在条目上方包含一个大图标，下方显示文本。条目默认以横向平铺的方式展示。
   * @key
   */
  set viewType(value) {
    let me = this, oldValue = me.viewType$;

    if (oldValue !== value) {
      if (value == null)
        Wb.raise('Wb.View "viewType" property cannot be null.');
      let iconField = me.iconField, imgField = me.imgField, subtextField = me.subtextField,
        badge, badgeField = me.badgeField, textField = me.textField, textvalueField = me.textvalueField,
        datevalueField = me.datevalueField, iconvalueField = me.iconvalueField;

      me.viewType$ = value;
      if (oldValue)
        me.removeCls('w-vt-' + oldValue.toLowerCase());
      me.addCls('w-vt-' + value.toLowerCase());
      badge = '{if data.' + badgeField + '!=null}<div class="w-badge">{' + badgeField + '}</div>{/if}';
      switch (value) {
        case 'smallList':
        case 'list':
          if (!me.initLayout)
            me.layout = undefined;
          me.itemTpl = '<div class="w-item w-list-item">{if data.' +
            iconField + '}<div class="w-icon icon-{' + iconField + '}">' + badge + '</div>{/if}{if data.' +
            imgField + '}<div class="w-img" style="background-image:url(\'{' + imgField +
            '}\')">' + badge + '</div>{/if}<div class="w-list-wrap1"><div class="w-name">{' + me.textField +
            '}</div>{if data.' + subtextField + '}<div class="w-sub-name">{' + subtextField +
            '}</div>{/if}</div><div class="w-list-wrap2">{if data.' + textvalueField +
            '}<div class="w-name">{' + textvalueField + '}</div>{/if}{if data.' + datevalueField +
            '}<div class="w-sub-name">{[data.' + datevalueField + '.prettyText]}</div>{/if}{if data.' +
            iconvalueField + '}<div class="w-icon icon-{' + iconvalueField + '}"></div>{/if}</div></div>';
          break;
        case 'smallIcon':
        case 'mediumIcon':
        case 'bigIcon':
          if (!me.initLayout)
            me.layout = 'grid';
          me.itemTpl = '<div class="w-item w-list-icon">' +
            '{if data.' + iconField + '}<div class="w-icon icon-{' + iconField + '}">' + badge + '</div>{/if}' +
            '{if data.' + imgField + '}<div class="w-img" style="background-image:url(\'{' + imgField + '}\')">' +
            badge + '</div>{/if}' +
            '{if data.' + textField + '}<div class="w-name">{' + textField + '}</div>{/if}</div>';
          break;
      }
      if (me.rendered)
        me.refresh();
    }
  }
  /***/
  get viewType() {
    return this.viewType$;
  }
  /** @property {Boolean} - Whether to hide dividing line between each item. Only available for some {#viewType}. */
  set noDivider(value) {
    this.applyCls(value, 'noDivider', 'w-no-divider', this.bodyEl);
  }
  /***/
  get noDivider() {
    return this.noDivider$;
  }
}
/**
 * 图表列表视图组件，通常在条目上方包含一个图标，下方显示文本。条目默认以横向平铺的方式展示。详细信息请
 * 参考{#Wb.ListView}说明。该组件为{#Wb.ListView}组件{#viewType}的"mediumIcon"样式。
 * @icon icon-list
 */
Cls['Wb.IconView'] = class iconView extends Wb.ListView {
  static configs = {
    viewType: 'mediumIcon'
  };
}
/**
 * 卡槽视图组件，用于添加到卡槽容器中显示卡槽数据。
 * @icon list
 */
Cls['Wb.SlotView'] = class slotView extends Wb.SelectView {
  static cls = 'w-slot-view';
  static protos = {
    autoSelect: true,
    clickSelect: true
  };
  static configs = {
    autoScroll: 'auto',
    autoLoad: true,
    enterEvent: false,
    flex: 1
  };
  /***/
  init(configs) {
    let me = this, events;
    super.init(configs);
    me.on({
      select: me.onItemSelect
    });
    events = {
      el: me.bodyEl,
      resize() {
        me.realign();
      },
      scroll() {
        let bodyEl = me.bodyEl, scrollTop = bodyEl.scrollTop;
        if (me.lastScrollTop == scrollTop || me.isTapDown)
          return;
        me.onScrollEnd.delay(me, 200);
        me.lastScrollTop = scrollTop;
      },
      [Event.tapDownName]: {
        fn() {
          me.isTapDown = true;
          me.mon(DocEl, Event.tapUpName, me.onSvDocTapUp, me, { capture: true });
        },
        passive: true
      }
    };
    me.mon(events);
  }
  /** @property {Boolean} isTapDown 鼠标是否按下。 @priv */
  /**
   * 作为SlotView时在{#DocEl}上释放鼠标执行的方法。 @priv
   */
  onSvDocTapUp() {
    let me = this;
    me.isTapDown = false;
    me.mun(DocEl, Event.tapUpName, me.onSvDocTapUp);
    me.onScrollEnd.cancelDelay(me);
    me.onScrollEnd.delay(me);
  }
  /** @property {String} - 顶部标题。 */
  set topTitle(value) {
    let me = this;

    if (me.topTitle$ !== value) {
      me.topTitle$ = value;
      if (value) {
        me.topLabel ??= me.addHeader({
          cname: 'label',
          cls: 'w-top-label',
          weight: 90
        });
        me.topLabel.text = value;
      } else {
        me.topLabel?.destroy();
        delete me.topLabel;
      }
    }
  }
  /***/
  get topTitle() {
    return this.topTitle$;
  }
  /**
   * 条目被选择时执行的方法。 @priv
   * @param {Wb.ViewItem} item 条目。
   */
  onItemSelect(item) {
    this.parent?.fireEvent('itemselect', item);
    item.intoVCenter();
  }
  /**
   * 滚动结束后执行的方法。 @priv
   */
  onScrollEnd() {
    let me = this, bodyEl = me.bodyEl, item, bodyRect = bodyEl.getRect();

    item = Wb.findEl(bodyRect.x + bodyRect.width / 2, bodyRect.y + bodyRect.height / 2)?.citem;
    if (item?.isViewItem) {
      item.select(false, false, true, true);
      me.realign();
      me.lastScrollTop = me.bodyEl.scrollTop;
    }
  }
  /**
   * 重新对齐选择条目使之居中。
   */
  realign() {
    this.selection?.intoVCenter();
  }
}
/**
 * 卡槽容器组件，该组件可包含一个或多个卡槽，用于通过滚动的方式选择卡槽内的数据。
 * 卡槽的相关示例见：{#%slot.xwl|ide?openModule=example/comps/slot.xwl}
 * @icon slots
 */
Cls['Wb.Slot'] = class slot extends Wb.Panel {
  static cls = 'w-slot-ct';
  static configs = {
    tabIndex: -1,
    layout: 'row'
  };
  static defaults = {
    cname: 'slotView'
  };
  /**
   * @event itemselect 任意卡槽条目被选择时触发。
   * @param {Wb.ViewItem} item 选择的条目。
   */

  /** @property {Wb.component} stripe 用于高亮选择数据的条纹。 @priv @readonly */
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    me.stripe = me.addHeader({ cls: 'w-slot-stripe' }, me.bodyEl);
  }
  /***/
  ready(configs) {
    super.ready(configs);
    this.titlePlace ??= this.some(item => item.topTitle);
  }
  /** @property {Boolean} - 是否保留卡槽的标题栏高度以调整{#stripe}的位置。默认为null，自动判断。 */
  set titlePlace(value) {
    this.applyCls(value, 'titlePlace', 'w-slot-top', this.stripe);
  }
  /***/
  get titlePlace() {
    return this.titlePlace$;
  }
  /** @property {Array} - 卡槽数据列表。 @key
   * Example:
   *
   *     [[{text: 'a1'}, {text:'a2'}], [{text: 'b1'}, {text:'b2'}]] //定义2个卡槽
   */
  set data(value) {
    let me = this;

    me.data$ = value;
    if (!Wb.isArray(value?.[0]))
      value = [value];
    me.destroyAll();
    value.forEach(item => me.add(me.createSlot(item)));
  }
  /***/
  get data() {
    return this.data$;
  }
  /**
   * 创建新的卡槽，根据卡槽数据生成卡槽视图。创建的卡槽可以添加到组件的{#container}下。
   * @param {Array} data 卡槽数据列表。
   * @return {Wb.SlotView} 卡槽视图。
   */
  createSlot(data) {
    return new Wb.SlotView({ data });
  }
  /** @property {Array} - 所有可见卡槽选择条目的value属性值或text属性值组成的数组。未选择值项的值为null。 @key */
  set value(value) {
    let items = this.items, item;
    value.forEach((val, i) => {
      item = items[i];
      item.selection = item.findItem(item.valueField || item.textField, val);
    });
  }
  /***/
  get value() {
    let me = this, items = me.items, vals = [];

    items.forEach(item => {
      vals.push(item.selection?.data[item.valueField || item.textField] ?? null);
    });
    return vals;
  }
}
/**
 * 时间卡槽容器组件，该组件可包含时、分和秒等卡槽，用于通过滚动的方式选择时间。
 */
Cls['Wb.TimeSlot'] = class timeSlot extends Wb.Slot {
  static cls = 'w-time-slot';
  static protos = {
    format$: Str.timeFormat,
    /** @property {Boolean} - 是否创建“现在”按钮。 */
    nowButton: true,
    /** @property {Boolean} - 是否创建“确定”按钮。 */
    okButton: true
  };
  static configs = {
    titlePlace: true,
    buttonAlign: 'center'
  };
  /** @property {Wb.TimeSlot} - 获取共享的下拉时间卡槽组件。 */
  static get picker() {
    return this.timePicker$ ??= new Wb.TimeSlot({ autoDestroy: false });
  }
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    me.createTimeSlot();
    me.createButtons();
    me.mon('keydown', me.onKeyDown);
    me.mon('dblclick', me.onDblClick);
  }
  /**
   * 按键时执行的方法。 @priv
   */
  onKeyDown(e) {
    if (e.isGoKey) {
      this.fireEvent('selectdate', this.value);
      e.stopEvent();
    }
  }
  /**
   * 双击时执行的方法。 @priv
   */
  onDblClick(e) {
    if (e.target.closest('.w-item-sel')) {
      this.fireEvent('selectdate', this.value);
      e.stopEvent();
    }
  }
  /**
   * 创建工具按钮。 @priv
   */
  createButtons() {
    let me = this, btns = [];

    if (me.nowButton)
      btns.push({
        cname: 'padTool',
        text: Str.now,
        handler() {
          me.value = new Date();
          me.fireEvent('selectdate', me.value);
        }
      });
    if (me.okButton)
      btns.push({
        cname: 'padTool',
        text: Str.ok,
        handler() {
          me.fireEvent('selectdate', me.value);
        }
      });
    if (btns.length)
      me.buttons = btns;
  }
  /**
   * 创建时间卡槽视图。 @priv
   * @param {Number} length 条目长度。
   * @param {String} title 卡槽标题。
   * @return {Wb.SlotView} 卡槽视图。
   */
  createSlotView(length, title) {
    let data = [], value, configs;
    for (value = 0; value < length; value++)
      data.push({ text: value.toString().padStart(2, '0'), value });
    configs = { cname: 'slotView', topTitle: title, data, valueField: 'value' };
    if (Wb.isTouch)
      configs.autoScroll = 'hide';
    return this.add(configs);
  }
  /**
   * 创建时、分和秒时间卡槽。 @priv
   */
  createTimeSlot() {
    let me = this;
    me.hourSlot = me.createSlotView(24, Str.hShort)
    me.minuteSlot = me.createSlotView(60, Str.mShort);
    me.secondSlot = me.createSlotView(60, Str.sShort);
  }
  /** @property {Date} - 组件的时间值。如果为null默认为当前时间。 @key */
  set value(value) {
    if (!value) {
      value = new Date();
      value.setMinutes(0);
      value.setSeconds(0);
    }
    super.value = [value.getHours(), value.getMinutes(), value.getSeconds()];
  }
  /***/
  get value() {
    let val = super.value;
    return new Date(1970, 0, 1, val[0] ?? 0, val[1] ?? 0, val[2] ?? 0);
  }
  /** @property {String} - 时间格式，用于控制是否显示时，分，秒卡槽。 */
  set format(value) {
    let me = this;
    if (me.format$ !== value) {
      me.format$ = value;
      me.hourSlot.visible = value.includes('H');
      me.minuteSlot.visible = value.includes('m');
      me.secondSlot.visible = value.includes('s');
    }
  }
  /***/
  get format() {
    return this.format$;
  }
}
/**
 * 年月日卡槽容器组件，该组件可包含年月日卡槽，用于通过滚动的方式选择日期。
 */
Cls['Wb.DateSlot'] = class dateSlot extends Wb.Slot {
  static protos = {
    format$: Str.dateFormat,
    /** @property {Number} - 可选择当前日期多少年之前的年份。 */
    beforeYears: 150,
    /** @property {Number} - 可选择当前日期多少年之后的年份。 */
    afterYears: 10,
    /** @property {Boolean} - 是否不生成日卡槽。 @priv */
    noDate: false,
    /** @property {Boolean} - 是否创建“现在”按钮。 */
    nowButton: true,
    /** @property {Boolean} - 是否创建“确定”按钮。 */
    okButton: true
  };
  static configs = {
    buttonAlign: 'center'
  };
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    me.createDateSlot();
    Wb.TimeSlot.prototype.createButtons.call(me);
    me.mon('keydown', me.onKeyDown);
    me.mon('dblclick', me.onDblClick);
  }
  /**
   * 按键时执行的方法。 @priv
   */
  onKeyDown(e) {
    if (e.isGoKey) {
      this.fireEvent('selectdate', this.value);
      e.stopEvent();
    }
  }
  /**
   * 双击时执行的方法。 @priv
   */
  onDblClick(e) {
    if (e.target.closest('.w-item-sel')) {
      this.fireEvent('selectdate', this.value);
      e.stopEvent();
    }
  }
  /**
   * 创建日期卡槽。 @priv
   */
  createDateSlot() {
    let me = this, data, text, value, valueField = 'value', date = new Date(), monthSlot, selItem,
      year = date.getFullYear(), beforeYears = me.beforeYears, afterYears = me.afterYears, getConfig;

    getConfig = f => {
      let configs = { cname: 'slotView', data, valueField };
      if (Wb.isTouch)
        configs.autoScroll = 'hide';
      return configs;
    };
    data = [];
    for (value = -beforeYears; value < afterYears; value++) {
      text = year + value;
      data.push({ text, value: text });
    }
    me.yearSlot = me.add(getConfig());
    data = [];
    for (value = 0; value < 12; value++) {
      date.setMonth(value);
      data.push({ text: Date.shortMonthFormatter.format(date), value });
    }
    monthSlot = me.monthSlot = me.add(getConfig());
    if (!me.noDate) {
      data = []
      me.dateSlot = me.add(getConfig());
      monthSlot.on('select', me.onMonthSelect, me);
      if (selItem = monthSlot.selection)
        me.onMonthSelect.call(me, selItem);
    }
  }
  /**
   * 月改变时执行的方法。 @priv
   */
  onMonthSelect(item) {
    let dateSlot = this.dateSlot;
    let date = new Date(this.yearSlot.selection.data.value, item.data.value, 1),
      i, j = date.monthLastDate.getDate(), data = [];
    for (i = 1; i <= j; i++)
      data.push({ text: i, value: i });
    dateSlot.data = data;
  }
  /** @property {Date} - 组件的日期值。如果为null默认为当前日期。 @key */
  set value(value) {
    let val;
    value ||= new Date();
    val = [value.getFullYear(), value.getMonth()];
    if (!this.noDate)
      val.push(value.getDate())
    super.value = val;
  }
  /***/
  get value() {
    let val = super.value;
    return new Date(val[0], val[1] ?? 0, val[2] ?? 1);
  }
  /** @property {String} - 年月日格式，用于控制是否显示年月日。 */
  set format(value) {
    let me = this;
    if (me.format$ !== value) {
      me.format$ = value;
      me.yearSlot.visible = value.includes('y');
      me.monthSlot.visible = value.includes('M');
      me.dateSlot?.setVisible(value.includes('d'));
    }
  }
  /***/
  get format() {
    return this.format$;
  }
}
/**
 * 年月卡槽容器组件，该组件可包含年和月卡槽，用于通过滚动的方式选择年月组成的日期。
 */
Cls['Wb.MonthSlot'] = class monthSlot extends Wb.DateSlot {
  static configs = {
    format: Str.monthFormat,
    noDate: true
  };
  /** @property {Wb.TimeSlot} - 获取共享的下拉日期卡槽组件。 */
  static get picker() {
    return this.monthPicker$ ??= new Wb.MonthSlot({ autoDestroy: false });
  }
}
/**
 * 日期时间组合面板。
 */
Cls['Wb.DatetimePanel'] = class datetimePanel extends Wb.Panel {
  static cls = 'w-dt-panel';
  static protos = {
    /** @property {Boolean} - 是否创建“现在”按钮。 */
    nowButton: true,
    /** @property {Boolean} - 是否创建“确定”按钮。 */
    okButton: true
  };
  static configs = {
    layout: 'row',
    buttonAlign: 'center'
  };
  /** @property {Wb.DatetimePanel} - 日期时间组合面板。 */
  static get picker() {
    return this.datetimePicker$ ??= new Wb.DatetimePanel({ autoDestroy: false });
  }
  /***/
  init(configs) {
    let me = this, items;
    super.init(configs);
    me.add([
      {
        cname: 'dateView', flex: 1, events: {
          itemdblclick() {
            me.fireEvent('selectdate', me.value);
          }
        }
      },
      {
        cname: 'timeSlot', events: {
          selectdate() {
            me.fireEvent('selectdate', me.value);
          }
        }
      }
    ]);
    items = me.items;
    me.dateComp = items[0];
    me.dateComp.nowButtonComp.destroy();
    me.timeComp = items[1];
    me.timeComp.buttonsBar.destroy();
    me.mon('keydown', me.onKeyDown, me, { capture: true });
    Wb.TimeSlot.prototype.createButtons.call(me);
  }
  /**
   * 按键时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onKeyDown(e) {
    if (e.isGoKey) {
      this.fireEvent('selectdate', this.value);
      e.stopEvent();
    }
  }
  /** @property {String} - 日期时间格式。 */
  set format(value) {
    let me = this;
    if (me.format$ !== value) {
      let pos = value.indexOf(' ');
      if (pos == -1)
        Wb.raise('Date and time format must be separated by a space.');
      me.format$ = value;
      me.dateComp.format = value.substr(0, pos);
      me.timeComp.format = value.substr(pos + 1);
    }
  }
  /***/
  get format() {
    this.format$;
  }
  /** @property {Date} - 组件的日期时间值。如果为null默认为当前日期时间。 @key */
  set value(value) {
    value ||= new Date().datePart; // Set date default time to 0
    this.dateComp.value = this.timeComp.value = value;
  }
  /***/
  get value() {
    let me = this, date = me.dateComp.value, time = me.timeComp.value;

    time.setFullYear(date.getFullYear());
    time.setDate(date.getDate());
    time.setMonth(date.getMonth());
    return time;
  }
  /** @property {Date} - 最大日期值。 */
  set maxValue(value) {
    let me = this;

    if (me.maxValue$ !== value) {
      me.maxValue$ = value;
      this.dateComp.maxValue = value;
    }
  }
  /***/
  get maxValue() {
    return this.maxValue$;
  }
  /** @property {Date} - 最小日期值。 */
  set minValue(value) {
    let me = this;

    if (me.minValue$ !== value) {
      me.minValue$ = value;
      this.dateComp.minValue = value;
    }
  }
  /***/
  get minValue() {
    return this.minValue$;
  }
}
/**
 * 卡片容器组件，该组件下的直接下级组件也叫卡片。该组件每次最多仅显示单个卡片，其余卡片均隐藏。
 * @icon win-restore
 */
Cls['Wb.CardCt'] = class cardCt extends Wb.Panel {
  static configs = {
    layout: 'card',
    activeIndex: 0
  };
  /**
   * 获取指定组件的Hash Id。 @priv
   * @param {Wb.Component} component 组件。
   * @return {String} Hash id。
   */
  static getHashId(component) {
    let hash = [], parent, pid;
    component.bubble(comp => {
      parent = comp.parent;
      if (parent instanceof Wb.CardCt) {
        comp.cid ||= Wb.getId();
        pid = parent.el.id ||= Wb.getId();
        hash.push(pid + '=' + comp[parent.hashName ?? 'cid']);
      }
    });
    return '#wb$' + hash.reverse().join('|');
  }
  /** @property {Array} orderCards 维护卡片排序的列表。 @priv */
  /***/
  init(configs) {
    super.init(configs);
    this.orderCards = [];
    this.on({
      add: this.onAdd,
      remove: this.onRemove,
      cardchange: this.onCardChange
    });
  }
  /**
   * 卡片切换时执行的方法。 @priv
   * @param {Wb.Component} newCard 新卡片。
   * @param {Wb.Component} oldCard 旧卡片。
   */
  onCardChange(newCard, oldCard) {
    if (oldCard?.parent) {
      this.orderCards.push(oldCard);
    }
  }
  /**
   * 添加新的下级组件时执行的方法。 @priv
   * @param {Wb.Component} child 添加的卡片。
   */
  onAdd(child) {
    child.visible = child == this.activeCard$;
  }
  /**
   * 移除下级组件时执行的方法。 @priv
   * @param {Wb.Component} child 移除的卡片。
   */
  onRemove(child) {
    this.orderCards.removeAll(child);
    if (this.activeCard$ == child)
      this.activeCard = this.hasChild ? (this.orderCards.pop() ?? this.lastItem) : null;
  }
  /** @property {Enum} useHash 是否把下级组件指定hash添加到历史记录中，以支持前进后退导航。hash由{#hashName}设置。
   * -true: 在touch和desktop模式下均使用。
   * -'touch': 仅在touch模式下使用。
   * -'desktop': 仅在desktop模式下使用。
   */
  /** @property {String} hashName 使用{#useHash}时，下级组件的该名称的属性值为hash，默认为"cid"。 */
  /**
   * 转到指定hash的下级组件。可以重写该方法以实现自定义的转到hash逻辑。
   * @param {String} id Hash id。
   */
  gotoHash(id) {
    let comp = this.find(id);
    if (comp)
      this.activeCard = comp;
  }
  /**
   * @event cardchange 在card切换后触发。
   * @param {Wb.Component} newCard 新卡片，如果卡片为空该值为null。
   * @param {Wb.Component} oldCard 原卡片，如果卡片为空该值为null。
   */
  /** @property {Wb.Component} - 设置当前激活的卡片。如果值为null，所有卡片均不激活。 @code */
  set activeCard(card) {
    let me = this, oldCard = me.activeCard$, ct = Wb.CardCt;
    if (oldCard != card) {
      me.activeCard$ = card;
      me.items$.forEach(item => item.visible = item == card);
      me.fireEvent('cardchange', card, oldCard || null);
      if (Wb.configs.recordHash && (me.useHash === true || Wb.isTouch && me.useHash == 'touch' ||
        Wb.isDesktop && me.useHash == 'desktop')) {
        let hash, locHash;

        locHash = location.hash;
        if (!locHash && oldCard)
          history.pushState(null, '', ct.getHashId(oldCard));
        if (card) {
          hash = ct.getHashId(card);
          if (!(locHash + '|')?.startsWith(hash + '|'))
            history.pushState(null, '', hash);
        } else {
          history.pushState(null, '', '#');
        }
      }
    }
  }
  /***/
  get activeCard() {
    return this.activeCard$;
  }
  /** @property {Number/String} - 指定索引号的卡片，如果值大于最大索引将被视为最大索引值。-1表示所有卡片均不激活。字符串
   * 表示卡片的{#cid}值。 @design */
  set activeIndex(index) {
    //仅当有卡片时才允许设置index
    let items = this.items$, len = items.length;
    if (len) {
      if (Wb.isString(index))
        index = items.findIndex(item => item.cid == index);
      this.activeCard = items[Math.min(index, len - 1)];
    }
  }
  /** @property {Number} */
  get activeIndex() {
    return this.items$.indexOf(this.activeCard$);
  }
}
/**
 * Tab标签页组件，用于分页显示的容器组件。
 * @icon tab
 */
Cls['Wb.Tab'] = class tab extends Wb.CardCt {
  static defaults = {
    cname: 'card'
  };
  static protos = {
    tabSortable$: false,
    clipTabText$: false,
    touchStyle$: false,
    highlightText$: false
  };
  static configs = {
    tabSortable: true
  };
  /***/
  init(configs) {
    configs.tabPosition ??= configs.touchStyle ? 'bottom' : 'top';
    super.init(configs);
  }
  /** @property {Boolean} - 是否为主Tab，主Tab是指使用{#Wb.open}及相关方法打开页面时显示到该组件。每个窗口仅
   * 可包含一个主Tab，如果已经存在主Tab，则不会再指定该Tab为主Tab。
   */
  set mainTab(value) {
    if (this.mainTab$ !== value) {
      this.mainTab$ = value;
      if (value)
        Globals.WbMainTab ??= this;
      else {
        if (Globals.WbMainTab == this)
          Globals.WbMainTab = undefined;
      }
    }
  }
  /***/
  get mainTab() {
    return this.mainTab$;
  }
  /** @property {Boolean} - 是否可以通过拖动Tab页标签按钮来对Tab页进行排序。 */
  set tabSortable(value) {
    let tabBar = this.tabBar;

    tabBar.itemsSortable = value;
    tabBar.setEvents(value, {
      sort: this.onTabBarSort,
      sorting: this.onTabBarSorting,
      beforesort: this.onTabBarBeforeSort, scope: this
    });
  }
  /***/
  get tabSortable() {
    return this.tabBar.itemsSortable$;
  }
  /** @property {Boolean} - 激活的选项卡标题文本是否高亮。 */
  set highlightText(value) {
    this.applyCls(value, 'highlightText', 'w-hl-text');
  }
  /***/
  get highlightText() {
    return this.highlightText$;
  }
  /**
   * Tab条调整顺序前执行的方法。 @priv
   * @param {Wb.Button} dragBtn 拖动的按钮。
   */
  onTabBarBeforeSort(dragBtn) {
    return dragBtn?.card.sortable;
  }
  /**
   * Tab条调整顺序时执行的方法。 @priv
   * @param {Wb.Button} dragBtn 拖动的按钮。
   * @param {Wb.Button} refBtn 拖动到该按钮前。
   */
  onTabBarSorting(dragBtn, refBtn) {
    return refBtn.card.sortable;
  }
  /**
   * Tab条调整顺序后执行的方法。 @priv
   * @param {Wb.Button} dragBtn 拖动的按钮。
   * @param {Wb.Button} refBtn 拖动到该按钮前。
   */
  onTabBarSort(dragBtn, refBtn) {
    let me = this;
    me.suspendEvent();
    me.insertBefore(dragBtn.card, refBtn?.card);
    dragBtn.intoView();
    me.resumeEvent();
  }
  /**
   * 点击导航返回按钮执行的方法。 @priv
   */
  onBackClick() {
    let me = this, card, cid = me.activeCard?.cid, item, backList = me.backList,
      forwardList = me.forwardList;

    me.stopRecNav = true;
    try {
      while ((item = backList.pop())) {
        card = me.find(item);
        if (card) {
          if (cid) {
            if (forwardList.length > 49)
              forwardList.shift();
            forwardList.push(cid);
          }
          me.activeCard = card;
          break;
        }
      }
    } finally {
      me.stopRecNav = false;
    }
  }
  /**
   * 点击导航前进按钮执行的方法。 @priv
   */
  onForwardClick() {
    let me = this, card, cid = me.activeCard?.cid, item, backList,
      forwardList = me.forwardList;

    me.stopRecNav = true;
    try {
      while ((item = forwardList.pop())) {
        card = me.find(item);
        if (card) {
          if (cid) {
            backList = me.backList;
            if (backList.length > 49)
              backList.shift();
            backList.push(cid);
          }
          me.activeCard = card;
          break;
        }
      }
    } finally {
      me.stopRecNav = false;
    }
  }
  /**
   * 设置对当前组件的导航操作，以方便后退和前进到上次选项卡。
   * @param {Wb.Button} backBtn 后退按钮。
   * @param {Wb.Button} forwardBtn 前进按钮。
   */
  setNavigate(backBtn, forwardBtn) {
    let me = this, setBtns, backList, forwardList;

    setBtns = f => {
      backBtn.disabled = !me.some(card => backList.includes(card.cid));
      forwardBtn.disabled = !me.some(card => forwardList.includes(card.cid));
    };
    backList = me.backList = [];
    forwardList = me.forwardList = [];
    me.on('cardchange', (newCard, oldCard) => {
      if (newCard)
        newCard.cid ??= Wb.getId();
      let cid = newCard?.cid;
      if (!me.stopRecNav && me.hasItem(oldCard)) {
        if (backList.length > 49)
          backList.shift();
        backList.push(oldCard.cid);
      }
      if (cid) {
        while (backList.lastItem == cid)
          backList.pop();
        while (forwardList.lastItem == cid)
          forwardList.pop();
      }
      setBtns();
    });
    me.on('remove', card => {
      let cid = card.cid;
      backList.removeAll(cid);
      forwardList.removeAll(cid);
      setBtns();
    });
    me.on('destroy', f => {
      backBtn.un('click', me.onBackClick);
      forwardBtn.un('click', me.onForwardClick);
    });
    backBtn.disabled = true;
    forwardBtn.disabled = true;
    backBtn.on('click', me.onBackClick, me);
    forwardBtn.on('click', me.onForwardClick, me);
  }
  /** @property {Boolean} - 双击tab按钮时是否全屏显示当前tab组件 */
  set dblclickFull(value) {
    let me = this;
    if (me.dblclickFull$ !== value) {
      me.dblclickFull$ = value;
      me.setListeners(value, me.tabBar.el, 'dblclick', me.onTabBarDblClick);
    }
  }
  /***/
  get dblclickFull() {
    return this.dblclickFull$;
  }
  /** @property {Wb.Button} tabRestoreBtn 恢复最大化前状态的按钮，请参考{#dblclickFull}。 @priv */
  /**
   * 当启用{#dblclickFull}时，TabBar双击时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onTabBarDblClick(e) {
    if (e.target.getClosestComp()?.cname == 'tabButton') {
      this.setFullWin(!this.containsCls('w-win-full'))
      e.stopEvent();
    }
  }
  /**
   * 设置组件是否全屏显示。 @priv
   * @param {Boolean} isFull 是否全屏显示。true全屏，false正常。
   */
  setFullWin(isFull) {
    let me = this;

    me.setCls(isFull, 'w-win-full');
    if (isFull) {
      me.tabRestoreBtn ??= me.tabBar.addFooter({
        cname: 'iconButton', icon: 'win-restore', tip: Str.restore, weight: 999, handler() {
          me.setFullWin(false);
        }
      });
      me.maxParentNode = me.el.parentNode;
      me.maxBeforeNode = me.el.nextSibling;
      me.maxBeforeZIndex = me.el.getStyle('z-index');
      me.setMaxZIndex();
      BodyEl.append(me.el);
    } else {
      me.tabRestoreBtn?.destroy();
      me.el.setStyle('z-index', me.maxBeforeZIndex);
      me.maxParentNode.insertBefore(me.el, me.maxBeforeNode);
      delete me.maxParentNode;
      delete me.maxBeforeNode;
      delete me.tabRestoreBtn;
      delete me.maxBeforeZIndex;
    }
  }
  /** @property {Boolean} - 是否显示tab栏的上下文菜单。 */
  set tabMenu(value) {
    let me = this;
    if (me.tabMenu$ !== value) {
      me.tabMenu$ = value;
      if (value) {
        let menu = Wb.Menu.closeMenu;

        if (!menu) {
          let doClose = type => {
            let card = menu.contextCard;
            card?.parent.closeCards(type, card);
          };
          menu = Wb.Menu.closeMenu ??= new Wb.Menu({
            autoDestroy: false,
            items:
              [{ text: Str.close, icon: 'close', cid: 'close', handler() { doClose(false) } },
              { text: Str.closeAll, handler() { doClose(true) } },
                '-',
              { text: Str.closeOthers, handler() { doClose('others') } },
              { text: Str.closeToLeft, handler() { doClose('left') } },
              { text: Str.closeToRight, handler() { doClose('right') } }
              ], events: {
                show() {
                  let menu = this, card, target = menu.contextTarget;
                  card = target?.getClosestComp(Wb.TabButton)?.card ??
                    target?.getClosestComp(Wb.TabBar)?.parent?.activeCard;
                  menu.contextCard = card;
                  menu.down('close').disabled = !card?.closable;
                }
              }
          });
        }
        me.tabBar.contextMenu = menu;
      } else {
        me.tabBar.contextMenu = null;
      }
    }
  }
  /***/
  get tabMenu() {
    return this.tabMenu$;
  }
  /** @property {Enum} - tab按钮栏所在的方位。
   * -'top': 顶
   * -'bottom': 底
   * -'left': 左
   * -'right':右
   */
  set tabPosition(pos) {
    let me = this;
    if (me.tabPosition$ !== pos) {
      let el = me.tabBarEl$ || me.el, tabBar = me.tabBar;
      me.tabPosition$ = pos;
      if (pos == 'left' || pos == 'right') {
        el.removeCls('w-column');
        el.addCls('w-row');
        tabBar.vertical = true;
      } else {
        el.removeCls('w-row');
        el.addCls('w-column');
        tabBar.vertical = false;
      }
      if (pos == 'left' || pos == 'top')
        me.addHeader(tabBar, el);
      else
        me.addFooter(tabBar, el);
    }
  }
  /***/
  get tabPosition() {
    return this.tabPosition$;
  }
  /** @property {Boolean} - 是否生成触摸样式风格，该风格页标签在底部，标签文字在图标下。 */
  set touchStyle(value) {
    this.applyCls(value, 'touchStyle', 'w-touch-tab');
  }
  /***/
  get touchStyle() {
    return this.touchStyle$;
  }
  /** @property {Boolean} - tab栏中的按钮是否自动弹性收缩。 */
  set shrinkTabButton(value) {
    this.tabBar.shrink = value;
  }
  /***/
  get shrinkTabButton() {
    return this.tabBar.shrink;
  }
  /** @property {Boolean} - tab栏中的按钮文本超长时是否裁剪。 @design */
  set clipTabText(value) {
    this.applyCls(value, 'clipTabText', 'w-clip-bt', this.tabBar);
  }
  /***/
  get clipTabText() {
    return this.clipTabText$;
  }
  /** @property {Boolean} - tab栏中的按钮是否自动换行。 */
  set wrapTab(value) {
    this.tabBar.flexWrap = value;
  }
  /***/
  get wrapTab() {
    return this.tabBar.flexWrap$;
  }
  /** @property {Wb.TabBar} - 获取tab工具条对象。 */
  get tabBar() {
    return this.tabBar$ ??= new Wb.TabBar({ weight: 30 });
  }
  /** @property {Element} - tab工具条{#tabBar}渲染到的元素。 @code */
  set tabBarEl(value) {
    let me = this;

    if (me.tabBarEl$ !== value) {
      me.tabBarEl$ = value;
      if (me.tabBar$ && value)
        me.tabBar$.renderEl = value;
    }
  }
  /***/
  get tabBarEl() {
    return this.tabBarEl$;
  }
  /**
   * 关闭子卡片。
   * @param {String} mode 关闭的模式。
   * -'active'/falsy: 关闭当前激活的卡片
   * -'all'/true: 关闭全部卡片。默认值。
   * -'others': 关闭其它卡片
   * -'left': 关闭左侧全部卡片
   * -'right': 关闭右侧全部卡片
   * @param {Wb.Card} [card] 参照的卡片，默认为当前显示的卡片。
   */
  closeCards(mode, card) {
    let isActiveCard, passActiveCard, activeCard;

    activeCard = card ?? this.activeCard;
    mode ??= true;
    this.each(card => {
      isActiveCard = card == activeCard;
      if (isActiveCard)
        passActiveCard = true;
      if (!card.closable)
        return;
      if (mode == 'all' || mode === true || (mode == 'active' || !mode) && isActiveCard ||
        mode == 'others' && !isActiveCard || mode == 'right' && !passActiveCard ||
        mode == 'left' && passActiveCard && !isActiveCard) {
        card.close();
      }
    }, this, true);
  }
}
/**
 * Tab卡片组件，用于{#Wb.Tab}控件的子控件，表示一个Tab页。
 * @icon card
 */
Cls['Wb.Card'] = class card extends Wb.Container {
  static cls = 'w-disp-none';
  static protos = {
    /** @property {Boolean} - 是否允许拖动卡片以调整在容器中的位置。仅当设置容器的
     * {#Wb.Tab.tabSortable}属性为true时有效。 */
    sortable: true,
    closable$: null,
    visible$: false
  };
  static configs = {
    closable: true
  };
  /** @property {Wb.TabButton} tabButton 卡片对应标签按钮。 @readonly */
  /***/
  init(configs) {
    super.init(configs);
    this.on({
      added: this.onAdded, removed: this.onRemoved, destroy: this.onDestroy,
      show: this.onShow, hide: this.onHide
    });
    this.mon('keydown', this.onKeyDown);
    //tabButton不设置owner，在destroy事件中销毁
    this.tabButton = new Wb.TabButton({
      card: this,
      closable: null,
      groupName: 'tab'
    });
  }
  /** @property {Boolean} - 当前卡片及关联的标签按钮是否均可见。 */
  set cardVisible(value) {
    this.visible = this.tabButton.visible = value;
  }
  /** @property {Boolean} - 当前卡片关联的标签按钮是否可见。 */
  get cardVisible() {
    return this.tabButton.visible;
  }
  /**
   * 按键时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onKeyDown(e) {
    if (e.code == Keys.Backquote) {
      //焦点转到tab按钮
      if (e.ctrlMeta) {
        this.tabButton.focus();
        e.stopEvent();
      }
      else if (e.altKey) {
        //切换tab
        let card = this.travelSibling(!e.shiftKey, true);

        if (card) {
          card.show();
          (card.firstValidChild || card.tabButton)?.focus();
        }
        e.stopEvent();
      }
    }
  }
  /***/
  show() {
    super.show();
    this.tabButton?.intoView();
    return this;
  }
  /**
   * 被添加到容器时执行的方法。 @priv
   * @param {Wb.Tab} parent 父组件。
   * @param {Number}} index 添加到的索引位置。
   */
  onAdded(parent, index) {
    if (!(parent instanceof Wb.Tab))
      Wb.raise('Wb.Card can only be added to Wb.Tab');
    parent.tabBar.insert(index, this.tabButton);
  }
  /**
   * 从容器中被移除时执行的方法。 @priv
   */
  onRemoved() {
    this.tabButton.remove();
  }
  /**
   * 组件销毁时执行的方法。
   */
  onDestroy() {
    //tabButton的owner/parent不确定因此需要显式销毁
    this.tabButton.destroy();
  }
  /**
   * 显示关闭选项卡前的包含"是", "否"和"取消"按钮的确认对话框，当点击"是"时执行指定的方法。
   * @param {Function} fn 点击"是"时执行的方法。
   * @param {Wb.Card} .card 关闭的卡片。
   * @param {Function} .callback 传递的关闭选项卡的回调方法。
   * @param {Object} [scope] fn方法的this对象。默认为关闭的卡片。
   * @param {String} [propName] 该名称的选择卡属性作为提示信息。默认为标题。
   * @return {Boolean} 是否允许关闭。
   */
  confirmClose(fn, scope, propName) {
    let me = this;

    if (!me.isModified)
      return true;
    if (Wb.Window.getDialog()?.visible) {
      me.closePending = true;
      return false;
    }
    let title, tab = me.parent, doClose = f => {
      tab.each(card => {
        if (card.closePending)
          card.close();
      }, true, true);
    };
    if (propName)
      title = me[propName];
    else {
      title = me.title;
      if (title.startsWith('*'))
        title = title.substr(1);
    }
    me.show();
    Wb.choose(Str.saveChanges.format(title), btn => {
      if (btn == 'yes')
        fn.call(scope ?? me, me, doClose);
      else if (btn == 'no') {
        Wb.unModified(me);
        doClose();
      } else {
        tab.each(card => { delete card.closePending });
      }
    });
    me.closePending = true;
    return false;
  }
  /**
   * 显示该组件时执行的方法。 @priv
   */
  onShow() {
    if (!this.parent?.hasItem(this))
      Wb.raise('Wb.Card can only be shown when added to Wb.Tab');
    this.tabButton.active = true;
  }
  /**
   * 隐藏该组件时执行的方法。 @priv
   */
  onHide() {
    this.tabButton.active = false;
  }
  /** @property {String} - 卡片对应标签按钮的标题。 @design @key */
  set title(value) {
    this.tabButton.text = value;
  }
  /***/
  get title() {
    return this.tabButton.text;
  }
  /** @property {IconString} - 卡片对应标签按钮的矢量图标。 @design @key */
  set icon(value) {
    this.tabButton.icon = value;
  }
  /***/
  get icon() {
    return this.tabButton.icon;
  }
  /** @property {ImgString} - 卡片对应标签按钮的图片图标。详见{#Wb.mixin.Icon.img}。 @design */
  set img(value) {
    this.tabButton.img = value;
  }
  /***/
  get img() {
    return this.tabButton.img;
  }
  /** @property {Boolean} - 卡片对应标签按钮的图标是否旋转。详见{#Wb.mixin.Icon.spin}。 @design */
  set spin(value) {
    this.tabButton.spin = value;
  }
  /***/
  get spin() {
    return this.tabButton.spin;
  }
  /** @property {Enum} - 卡片是否可通过关闭按钮关闭。设置null将销毁关闭按钮。
   * -true: 关闭按钮有效。
   * -false: 关闭按钮禁用。
   * -null: 无关闭按钮。默认项。
   * @design
   */
  set closable(value) {
    this.tabButton.closable = value;
  }
  /***/
  get closable() {
    return this.tabButton.closable;
  }
  /** @property {String/Object/Wb.Tip} - 卡片对应标签按钮的提示信息。 */
  set tabTip(value) {
    this.tabButton.tip = value;
  }
  /** @property {String/Wb.Tip} */
  get tabTip() {
    return this.tabButton.tip;
  }
  /** @property {Boolean/Object/Wb.OverTip} - 卡片对应标签按钮的文本溢出时的提示信息。 */
  set tabOverflowTip(value) {
    this.tabButton.overflowTip = value;
  }
  /** @property {Boolean/Wb.OverTip} */
  get tabOverflowTip() {
    return this.tabButton.overflowTip;
  }
  /***/
  set disabled(disabled) {
    super.disabled = disabled;
    this.tabButton.disabled = disabled;
  }
  /***/
  get disabled() {
    return this.disabled$;
  }
}
/**
 * 弹出式的可移动并可调整大小的面板控件。
 * 窗口的相关示例见：{#%window.xwl|ide?openModule=example/comps/window.xwl}
 * @icon window
 * @mimic panel
 */
Cls['Wb.Window'] = class window extends Wb.Panel {
  static cls = 'w-win w-disp-none';
  //居中显示需要先设置窗口宽度和高度
  static firstNames = ['floating', 'width', 'height', 'visible'];
  static configs = {
    movable: true,
    floating: true,
    closable: true,
    resizable: true,
    /** @property {Enum} - 组件是否可通过最大化/还原按钮执行相关操作。设置null将销毁该按钮。
     * -true: 最大化按钮有效。默认值。
     * -false: 最大化按钮禁用。
     * -null: 无最大化按钮。
     * @design @setter
     */
    maximizable: true,
    tabIndex: -1
  };
  /** @property {Object} - 所有具有name的消息窗口实例组成的对象，key为name，value为窗口实例。 @priv */
  static messageWindows = {};
  /** @property {Object} - 所有提示窗口实例组成的数组。 @priv */
  static tipWindows = [];
  static protos = {
    defaultAlign: 'c-c',
    winMaxCls: 'w-win-max',
    /** @property {Boolean} - 显示窗口后是否自动居中。 */
    autoCenter: true,
    visible$: false,
    /** @property {Enum} closeAction 调用close方法时执行的动作。默认为"hide"。
     * -'hide': 调用hide方法隐藏。
     * -'destroy': 调用destroy方法销毁。
     * @key
     */
    closeAction: 'hide',
    minButtonWidth: '6em',
    modal$: false,
    /** @property {Enum/String} focusControl 当显示窗口时是否把焦点转移到指定组件上。如果为字符串表示把焦点转到
     * 下级/子组件的cid属性所指定的组件上。
     * -true: 把焦点转到上次设置焦点的控件{#Wb.Control}上。如果上次无焦点控件则把焦点转到首个有效的具有{#allowFocus}属性的组件。
     * -false: 把焦点设置到窗口本身。
     * -null: 把焦点转到首个有效的具有{#allowFocus}属性的组件。默认值。
     */
  };
  /**
   * 获取消息窗口。 @priv
   * @param {String} closeAction 关闭行为。
   * @return {Wb.Window} 窗口对象。
   */
  static getMessageWin(closeAction) {
    return new Wb.Window({
      layout: 'row', align: 'center', modal: true, buttonAlign: 'center', closeAction,
      minButtonWidth: '6em', resizable: false, maximizable: null, cls: 'w-msg-win'
    });
  }
  /**
   * 显示消息对话框。
   * Example: 
   *
   *     Wb.Window.showMessage({title: '提示', text: '成功保存', buttons: [{text: '确定', cid: 'ok'}]});
   *
   * @param {Object} configs 配置对象。
   * @param {String} [configs.title] 标题。
   * @param {String} [configs.icon] 图标。
   * @param {String} [configs.iconColor] 图标前景色。
   * @param {String} [configs.text] 纯文本消息。
   * @param {String} [configs.html] html格式文本消息。设置该参数text参数无效。
   * @param {Array} [configs.buttons] 按钮列表。
   * @param {Function} [configs.callback] 点击按钮时的回调方法。this指向窗口。
   * @param {Function} [configs.callback.buttonCid] button的cid属性。
   * @param {String} [configs.enterButton] 按回车键时点击的按钮名称。null表示首个按钮。空串表示不响应回车键。
   * @param {String} [configs.escButton] 按Esc键或关闭窗口时点击的按钮名称。null表示最后一个按钮。
   * 空串不响应Esc键，同时关闭按钮将禁用。
   * @param {Boolean} [configs.name] 窗口名称，相同名称的窗口仅显示单例。为空每次将创建新的窗口。
   * @return {Wb.Window} 显示的窗口。
   */
  static showMessage(configs) {
    let win;

    if (configs.name) {
      win = Wb.Window.messageWindows[configs.name];
      if (!win) {
        win = Wb.Window.messageWindows[configs.name] = Wb.Window.getMessageWin('hide');
        win.on('destroy', f => delete Wb.Window.messageWindows[configs.name]);
      }
    } else
      win = Wb.Window.getMessageWin('destroy');
    win.destroyAll();
    win.title = configs.title;
    if (configs.icon)
      win.add({ cname: 'icon', cls: 'w-msg-icon', icon: configs.icon, iconColor: configs.iconColor });
    if (configs.text != null || configs.html != null) {
      let comp = { cls: 'w-msg-label' };
      if (configs.html == null)
        comp.text = configs.text;
      else
        comp.html = configs.html;
      win.add({ cls: 'w-msg-ct', items: comp });
    }
    win.onButtonClick = btn => {
      configs.callback?.call(win, btn.cid$);
    };
    win.buttons = configs.buttons;
    win.onEnter = configs.enterButton === '' ? null :
      f => configs.callback?.call(win, configs.enterButton ?? win.buttonsBar.firstItem?.cid$);
    win.closable = configs.escButton === '' ? null : true;
    win.onEsc = win.onCloseClick = configs.escButton === '' ? null :
      f => configs.callback?.call(win, configs.escButton ?? win.buttonsBar.lastItem?.cid$);
    if (win.visible)
      win.focusFirst();
    else
      win.show();
    win.center();
    return win;
  }
  /**
   * 获取指定名称的对话框窗口。
   * @param {String} [name] 窗口名称。默认为"sys.dialog"。
   * @return {Wb.Window} 窗口对象或null。
   */
  static getDialog(name) {
    return Wb.Window.messageWindows[name ?? 'sys.dialog'];
  }
  /**
   * 显示消息提示框，该消息提示框可在指定时长后自动关闭。不按Ctrl键点击能立即关闭提示框。
   * @param {Object} configs 配置对象。
   * @param {String} [configs.icon] 图标。
   * @param {String} [configs.iconColor] 图标前景色。
   * @param {String} [configs.text] 纯文本消息。
   * @param {String} [configs.html] html格式文本消息。设置该参数text参数无效。
   * @param {Number} [configs.dismissDelay] 自动隐藏的延迟毫秒数。默认为3500。
   * @param {Boolean} [configs.toast] 设置为true将在窗口中间位置使用共享的窗口淡入/淡出显示消息。
   * @param {Function} [configs.callback] 点击消息文字链接后执行的回调方法。
   * @return {Wb.Container} 提示容器。
   */
  static showTip(configs) {
    let win, wbWin = Wb.Window, callback;

    if (configs.toast) {
      win = wbWin.toastWin ??= new Wb.Container({
        layout: 'row', align: 'center', floating: true, cls: 'w-toast-win', listeners: {
          click(e) { if (!e.ctrlMeta) this.hide(); }
        }
      });
      win.destroyAll();
    } else {
      win = new Wb.Container({
        layout: 'row', align: 'center', floating: true, cls: 'w-tip-win', visible: true, listeners: {
          click(e) { if (!e.ctrlMeta) this.hide(); }
        }
      });
    }
    callback = configs.callback;
    if (configs.icon)
      win.add({ cname: 'icon', cls: 'w-tip-icon', icon: configs.icon, iconColor: configs.iconColor });
    if (configs.text != null || configs.html != null) {
      let comp = { cls: 'w-msg-label' };
      if (configs.html == null)
        comp.text = configs.text;
      else
        comp.html = configs.html;
      if (callback) {
        comp.cls += ' w-link';
        comp.listeners = { click: callback };
      }
      win.add({ cls: 'w-msg-ct', items: comp });
    }
    if (configs.toast) {
      if (!win.visible) {
        win.show();
        win.el.fadeIn();
      }
      // Prevent width changes
      win.xy = [0, 0];
      win.center();
      if (wbWin.toastTimer)
        clearTimeout(wbWin.toastTimer);
      if (wbWin.toastAnimate)
        wbWin.toastAnimate.cancel();
      wbWin.toastTimer = setTimeout(f => {
        wbWin.toastAnimate = win.el.fadeOut(f => {
          win.hide();
          delete wbWin.toastAnimate;
        });
        delete wbWin.toastTimer;
      }, configs.dismissDelay ?? 3500);
    } else {
      let winHeight, fromY, toY, padding = 10, tipWindows = wbWin.tipWindows;
      winHeight = win.el.offsetHeight;
      win.x = (innerWidth - win.el.offsetWidth) / 2;
      win.y = fromY = wbWin.lastTipTop == null ? -winHeight :
        (wbWin.lastTipTop < 0 ? -winHeight : wbWin.lastTipTop);
      win.toY = toY = fromY + (tipWindows.lastItem?.el?.offsetHeight ?? winHeight) + padding;
      win.el.slideTo({ y: toY });
      wbWin.lastTipTop = toY;
      setTimeout(f => {
        win.el.fadeOut(f => {
          let tipWin, height = winHeight + padding, i, j = tipWindows.length;
          wbWin.lastTipTop -= height;
          //所有下层窗口上升
          for (i = tipWindows.indexOf(win) + 1; i < j; i++) {
            tipWin = tipWindows[i];
            tipWin.toY -= height;
            tipWin.el.slideTo({ y: tipWin.toY });
          }
          tipWindows.remove(win);
          win.destroy();
        });
      }, configs.dismissDelay ?? 3500);
      tipWindows.push(win);
    }
    return win;
  }
  /** @property {Boolean} isEdit 当前窗口是否为编辑窗口。false新建窗口，true编辑窗口。仅适用字典模式。 @readonly */
  /** @property {Boolean} closeOnEsc 按Esc键时是否关闭窗口。如果已经设置{#onEsc}则该属性无效。默认为true。 */
  /** @property {Boolean} okOnEnter 按Enter键时是否触发{#ok}事件。如果已经设置{#onEnter}则该属性无效。默认为true。 */
  /** @property {Boolean} dialog 设置是否为对话框窗口，即包含“确定”和“取消”按钮的模态窗口。\
   * 设置该属性为true将默认设置{#modal}, {#closeOnEsc}, {#okOnEnter}属性为true。 @key */
  /** @property {Boolean} resetDialog 设置是否为重置对话框窗口，同{#dialog}区别为隐藏后会自动重置窗口内组件值。 @key */
  /** @property {Boolean} clearDialog 设置是否为清空对话框窗口，同{#dialog}区别为隐藏后会自动清空窗口内组件值。\
   * 设置该属性为true后{#resetDialog}属性将无效。 @key */
  /**
   * @event beforeok 当窗口为对话框时点击确定按钮前触发。返回false可阻止{#ok}事件。 @key
   */
  /**
   * @event ok 当窗口为对话框时点击确定按钮触发，或设置{#okOnEnter}为true时按Enter键触发。\
   * 只有当窗口内所有控件的值合法时才会触发该事件。 @key
   */
  /** @property {Boolean} groupTitle 字典分组时是否显示组标题，默认为自动判断。指定该值默认{#tableStyle}为true。 @code */
  /***/
  init(configs) {
    let me = this, resetDialog = me.resetDialog, clearDialog = me.clearDialog;
    super.init(configs);
    me.mon({ keydown: me.onKeyDown, focusin: me.onFocusIn, [Event.tapDownName]: { fn: me.onTapDown, passive: true } });
    if (me.dialog || resetDialog || clearDialog) {
      configs.modal ??= true;
      configs.buttons ??= [{ text: Str.ok, cid: 'ok', type: 'primary', handler: me.onOk, scope: me },
      { text: Str.cancel, cid: 'cancel', handler: me.onCancel, scope: me }];
      me.closeOnEsc ??= true;
      me.okOnEnter ??= true;
      if (clearDialog)
        me.on('hide', function () { Wb.clear(this); })
      else if (resetDialog)
        me.on('hide', function () { Wb.reset(this); });
    }
    if (me.okOnEnter)
      me.onEnter ??= me.onOk;
    if (me.closeOnEsc)
      me.onEsc ??= me.onCancel;
  }
  /***/
  set background(value) {
    super.background = value;
    this.ctEl.bgColor = value;
  }
  /***/
  get background() {
    return super.background;
  }
  /** @property {Number/String} x */
  /** @property {Number/String} y */
  /**
   * 设置组件元素焦点，如果组件元素可以获取到焦点，焦点就会被设置到该元素上。
   * @param {Boolean} [preventScroll] 当设置焦点时，时否阻止滚动条滚动。默认为true。
   */
  focus(preventScroll) {
    //防止窗口溢出body
    preventScroll ??= true;
    super.focus(preventScroll);
  }
  /**
   * 点击时执行的方法。
   * @param {Event} e 事件对象。
   */
  onTapDown(e) {
    this.toFront();
  }
  /** @property {Function} onEnter 按回车键时执行的方法。
   * @param {Event} e 事件对象。
   */
  /** @property {Function} onEsc 按Esc键时执行的方法。
   * @param {Event} e 事件对象。
   */
  /**
   * 按键时执行的方法。
   * @param {Event} e 事件对象。
   */
  onKeyDown(e) {
    let me = this;

    if (e.code == Keys.Esc) {
      me.downWholeBy(item => item.escButton)?.fireEvent('click', e);
      me.onEsc?.call(me, e);
    } else if (e.isGoKey) {
      if (e.target.tagName != 'TEXTAREA') {
        me.downWholeBy(item => item.enterButton)?.fireEvent('click', e);
        me.onEnter?.call(me, e);
      }
    }
  }
  /**
   * 获得焦点时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onFocusIn(e) {
    let control = e.target.getClosestComp();
    if (control instanceof Wb.Control)
      this.inActiveCtrl = control;
  }
  /***/
  get ctEl() {
    return this.ctEl$ ??= this.addEl('w-ct-el');
  }
  /** @property {Function} okHandler 点击确定按钮时执行的方法。每次窗口隐藏后将被清除。
   *  @param {Wb.Window} .win 当前窗口。
   *  @param {Object} .values 当前窗口所有组件值组成的对象。
   *  @code
   */
  /**
   * 当窗口为对话框时点击确定按钮时，或设置{#okOnEnter}为true时按Enter键执行的方法。 @priv
   */
  onOk(e) {
    let me = this;
    e.stopEvent();
    if (Wb.verify(me)) {
      if (me.fireEvent('beforeok') !== false) {
        me.okHandler?.call(me, me, Wb.getValue(me));
        me.fireEvent('ok');
      }
    }
  }
  /**
   * 当窗口为对话框时点击取消按钮时，或设置{#closeOnEsc}为true时按Esc键执行的方法。 @priv
   */
  onCancel(e) {
    e.stopEvent();
    this.close();
  }
  /***/
  remove() {
    super.remove();
    this.focusOutEl();
  }
  /***/
  ready(configs) {
    let me = this, visible;

    super.ready(configs);
    me.isReady = true;
    visible = configs.visible;
    //使visible在最后设置
    if (visible !== undefined)
      me.visible = visible;
  }
  /**
   * 窗口显示后默认设置大小和位置的方法。
   * @function setDefaultSize
   * @priv
   */
  /** @property {Boolean} closeOnBack 当窗口为模态窗口时，点击系统的返回按钮时是否关闭窗口。非模态窗口无效。
   * -true: 关闭窗口。
   * -false: 不关闭窗口。
   * -null: 自动判断。在{#Wb.isTouch}模式下且{#closable}为true的模态窗口时允许关闭，否则不允许关闭。默认值。
   */
  /***/
  set visible(value) {
    let me = this;
    //visible在ready后设置
    if (!me.isReady)
      return;
    if (value)
      me.toFront();
    if (me.visible !== value) {
      super.visible = value;
      if (value) {
        let el = me.el, activeEl, cob = me.closeOnBack;

        if (Wb.configs.recordHash && me.modal$ && (cob || cob == null && Wb.isTouch && me.closable)) {
          me.winHashId = Wb.getId();
          history.pushState(null, '', '#$win' + me.winHashId);
        }
        me.setDefaultSize?.();
        //无parent的窗口如果未指定x和y则显示到中央
        if (me.autoCenter && (me.visible && el.parentNode == BodyEl && (!el.getStyle('left') || !el.getStyle('top')))) {
          me.center();
          if (me.x < 0)
            me.x = 0;
          if (me.y < 0)
            me.y = 0;
        }
        //设置焦点
        if (me.modal) {
          activeEl = document.activeElement;
          if (!el.contains(activeEl))
            me.outActiveEl = activeEl;
        }
        me.setWinFocus();
      } else {
        me.okHandler = undefined;
        if (me.modal)
          me.focusOutEl();
      }
      if (me.modal$)
        me.setListeners(value, DocEl, 'focusin', me.onDocFocusIn);
    }
  }
  /***/
  get visible() {
    return super.visible;
  }
  /***/
  close() {
    let closed = super.close();
    if (closed) {
      let locHash = location.hash;
      if (locHash?.startsWith('#$win') && locHash.substr(5) == this.winHashId) {
        Globals.stopPopState = true;
        history.back();
      }
    }
    return closed;
  }
  /**
   * 设置窗口焦点。 @priv
   */
  setWinFocus() {
    let comp, me = this, focusControl = me.focusControl

    if (focusControl == null) {
      me.focusFirst();
    } else if (Wb.isString(focusControl)) {
      comp = me.down(focusControl);
      if (comp)
        comp.focus();
      else if (!me.activated)
        me.focus();
    } else {
      if (focusControl) {
        if (me.el.contains(me.inActiveCtrl?.el))
          me.inActiveCtrl.focusOnly();
        else
          me.focusFirst();
      } else if (!me.activated) {
        me.focus();
      }
    }
  }
  /**
   * 模态窗口文档获得焦点时执行的方法。 @priv
   */
  onDocFocusIn(e) {
    let el = this.el, target = e.target, rect = target.getRect();
    //模态窗口下被当前窗口及其mask盖住的不允许获得焦点
    if (el.isConnected && !el.contains(target) && el.contains(Wb.findEl(rect.x + 1, rect.y + 1)))
      target.blur();
  }
  /** @property {Boolean} manualShow 当使用{#showDo}方法显示窗口时是否不自动显示窗口。通常用于字典编辑窗口。 */
  /**
   * 显示窗口，设置标题，并在点击确定按钮后执行回调方法。
   * @param {String/Function} [title] 窗口标题或回调方法。
   * @param {Function} [callback] 点击确定后的回调方法，可用参数"win"表示当前窗口。
   */
  showDo(title, callback) {
    let me = this;

    if (Wb.isFunction(title)) {
      callback = title;
      title = null;
    }
    if (title != null)
      me.title = title;
    if (callback)
      me.okHandler = callback;
    if (!me.manualShow)
      me.show();
  }
  /**
   * 显示窗口并设置窗口标题默认为"Str.add - subTitle"。同时将复位窗口滚动条到起始位置。
   * @param {String/Function} [subTitle] 窗口子标题或回调方法。
   * @param {Function} [callback] 点击确定后的回调方法，可用参数"win"表示当前窗口。
   */
  showAdd(subTitle, callback) {
    let me = this, scrollEl;
    if (Wb.isFunction(subTitle)) {
      callback = subTitle;
      subTitle = null;
    }
    scrollEl = me.scrollEl;
    me.icon = 'add';
    me.focusControl = null;
    me.showDo(subTitle ? (Str.add + ' - ' + subTitle) : Str.add, callback);
    scrollEl.scrollTop = scrollEl.scrollLeft = 0;
  }
  /**
   * 显示窗口并设置窗口标题默认为"Str.edit - subTitle"。同时把焦点转到最后一次获得焦点的控件上。
   * @param {Object/Wb.Grid} data 编辑的数据对象。
   * @param {String/Function} [subTitle] 窗口子标题或回调方法。
   * @param {Function} [callback] 点击确定后的回调方法，可用参数"win"表示当前窗口。
   */
  showEdit(data, subTitle, callback) {
    let me = this;
    if (Wb.isFunction(subTitle)) {
      callback = subTitle;
      subTitle = null;
    }
    me.icon = 'edit';
    Wb.setValue(me, data);
    me.focusControl = true;
    me.showDo(subTitle ? (Str.edit + ' - ' + subTitle) : Str.edit, callback);
  }
  /**
   * 把焦点转移到窗口显示前聚焦的外部元素。 @priv
   */
  focusOutEl() {
    if (this.outActiveEl?.isConnected)
      this.outActiveEl.focusOnly();
    else
      delete this.outActiveEl;
  }
  /** @property {Element} outActiveEl 窗口激活之前激活的外部元素。 @priv */
  /** @property {Wb.Control} inActiveCtrl 窗口内最后激活的控件。 @priv */
  /**
   * 把当前窗口设置到最前面。
   */
  toFront() {
    this.setMaxZIndex();
  }
  /** @property {Element} maskEl 模态对话框的遮盖元素。 @readonly */
  /** @property {Boolean} - 窗口是否以模态形式显示。 */
  set modal(value) {
    let me = this;
    if (me.modal$ !== value) {
      me.modal$ = value;
      me.setCls(value, 'w-modal');
      if (value) {
        me.maskEl ??= me.el.insertEl(0, 'w-modal-mask');
      } else if (me.maskEl) {
        me.maskEl.remove();
        delete me.maskEl;
      }
    }
  }
  /***/
  get modal() {
    return this.modal$;
  }
  /***/
  set movable(value) {
    if (value === true) {
      let configs = {
        target: this,
        moveCursorOnly: true,
        handle: this.titleBar.el
      };
      if (Wb.isObject(value))
        value = Wb.apply(configs, value);
      else
        value = configs;
    }
    super.movable = value;
  }
  /***/
  get movable() {
    return super.movable;
  }
}
/**
 * 默认具有动画显示和隐藏效果的窗口。该窗口显示或隐藏后其{#visible}属性将同步更新，无论其动画效果是否完成。当需要在显示动画完成
 * 后操作，可以监听{shown}事件；当需要在隐藏动画完成后操作，可以监听{#hidden}事件。
 */
Cls['Wb.AnimateWindow'] = class animateWindow extends Wb.Window {
  static protos = {
    /** @property {Enum} - 显示时使用的动画效果：
     * -'top': 从顶部滑入。
     * -'right': 从右侧滑入。
     * -'bottom': 从底部滑入。
     * -'left': 从左侧滑入。
     * -true: 从右侧滑入。同'right'。
     * -false: 无动画效果。
     */
    animateShow: true,
    /** @property {Enum} - 隐藏时使用的动画效果：
     * -'top': 从顶部滑出。
     * -'right': 从右侧滑出。
     * -'bottom': 从底部滑出。
     * -'left': 从左侧滑出。
     * -true: 从右侧滑出。同'right'。
     * -false: 无动画效果。
     */
    animateHide: true
  };
  /**
   * @event shown 显示动画完成后触发。
   */
  /**
   * @event hidden 隐藏动画完成后触发。
   */
  /** @property {Boolean} isShowing 是否正在显示中。 */
  /** @property {Boolean} isHiding 是否正在隐藏中。 */
  /**
   * 设置窗口是否可见。
   * @param {Boolean} value 是否可见。
   * @param {Function} [callback] 显示或隐藏后的回调方法。
   * @param {Function} [.win] 当前窗口对象。
   */
  setVisible(value, callback) {
    let me = this, oldVisible = super.visible, focusControl, animateShow = me.animateShow,
      animateHide = me.animateHide, useCallback;

    try {
      if (value && animateShow) {
        focusControl = me.focusControl;
        me.focusControl = false;
        super.visible = value;
        me.focusControl = focusControl;
      } else {
        super.visible = value;
      }
      if (oldVisible != super.visible) {
        let configs;
        if (value && animateShow) {
          useCallback = true;
          configs = {
            callback() {
              me.isShowing = false;
              if (!me.isHiding)
                me.setWinFocus();
              me.fireEvent('shown');
              callback?.call(me, me);
            }
          };
          switch (animateShow) {
            case 'top':
              configs.y = true;
              break;
            case true:
            case 'right':
              configs.x = false;
              break;
            case 'bottom':
              configs.y = false;
              break;
            case 'left':
              // left is default
              break;
            default:
              // no animation
              me.setWinFocus();
              return;
          }
          me.isShowing = true;
          me.el.slideIn(configs);
        } else if (!value && animateHide) {
          useCallback = true;
          configs = {
            callback() {
              me.isHiding = false;
              me.addCls('w-disp-none');
              me.maskEl?.removeCls('w-opacity');
              me.fireEvent('hidden');
              callback?.call(me, me);
            }
          };
          switch (animateHide) {
            case 'top':
              configs.y = false;
              break;
            case true:
            case 'right':
              // true, right is default
              break;
            case 'bottom':
              configs.y = true;
              break;
            case 'left':
              configs.x = false;
              break;
            default:
              // no animation
              return;
          }
          me.removeCls('w-disp-none');
          me.maskEl?.addCls('w-opacity');
          me.isHiding = true;
          me.el.slideOut(configs);
        }
      }
    } finally {
      if (!useCallback)
        callback?.call(me, me);
    }
  }
  /***/
  set visible(value) {
    this.setVisible(value);
  }
  /***/
  get visible() {
    return super.visible;
  }
  /**
   * 关闭当前窗口。
   * @param {Boolean} [noAnimate] 是否无动画效果。
   * @return {Boolean} true成功执行关闭操作，false关闭操作被取消。
   */
  close(noAnimate) {
    let me = this, value;
    if (noAnimate && (value = me.animateHide)) {
      me.animateHide = false;
      try {
        return super.close()
      } finally {
        me.animateHide = value;
      }
    } else {
      return super.close();
    }
  }
  /**
   * 显示当前窗口。
   * @param {Boolean} [noAnimate] 是否无动画效果。
   * @return {Wb.AnimateWindow} 窗口本身。
   */
  show(noAnimate) {
    let me = this, value;
    if (noAnimate && (value = me.animateShow)) {
      me.animateShow = false;
      try {
        return super.show()
      } finally {
        me.animateShow = value;
      }
    } else {
      return super.show();
    }
  }
  /**
   * 隐藏当前窗口。
   * @param {Boolean} [noAnimate] 是否无动画效果。
   * @return {Wb.AnimateWindow} 窗口本身。
   */
  hide(noAnimate) {
    let me = this, value;
    if (noAnimate && (value = me.animateHide)) {
      me.animateHide = false;
      try {
        return super.hide()
      } finally {
        me.animateHide = value;
      }
    } else {
      return super.hide();
    }
  }
}
/**
 * 模态全屏的对话框窗口。在窗口的左上角默认具有关闭功能的返回按钮，标题默认居中。
 * @icon dialog
 */
Cls['Wb.Dialog'] = class dialog extends Wb.AnimateWindow {
  static cls = 'w-dialog';
  static protos = {
    autoCenter: false,
    closeOnBack: true
  };
  static configs = {
    modal: true,
    closable: null,
    maximizable: null,
    plainTitle: true,
    titleCenter: true,
    movable: false,
    closeOnEsc: true,
    resizable: false,
    backButton: true
  }
}
/**
 * 抽屉组件，可自动收缩的模态对话框窗口。
 * @icon drawer
 */
Cls['Wb.Drawer'] = class drawer extends Wb.AnimateWindow {
  static cls = 'w-drawer';
  static protos = {
    autoCenter: false,
    /** @property {Boolean} - 点击mask时是否自动关闭抽屉。 */
    closeOnClick: true,
    closeOnBack: true
  };
  static configs = {
    modal: true,
    closable: null,
    maximizable: null,
    plainTitle: true,
    titleCenter: true,
    movable: false,
    resizable: false,
    closeOnEsc: true,
    dockPosition: 'bottom'
  }
  /***/
  ready(configs) {
    let me = this;
    super.ready(configs);
    me.mon(me.maskEl, 'click', f => me.closeOnClick && me.close());
    me.on({
      show() {
        me.mon(DocEl, 'resize', me.onDocResize);
      },
      hide() {
        me.mun(DocEl, 'resize', me.onDocResize);
      }
    })
  }
  /**
   * {#DocEl}改变大小时执行的方法。 @priv
   */
  onDocResize() {
    let me = this;

    if (!me.isShowing && !me.isHiding)
      me.setDefaultSize.delay(me);
  }
  /***/
  setDefaultSize() {
    let me = this, xy;
    switch (me.dockPosition) {
      case 'top':
      case 'left':
        xy = [0, 0];
        break;
      case 'right':
        me.x = 0;
        xy = [DocEl.offsetWidth - me.el.offsetWidth, 0];
        break;
      case 'bottom':
        me.y = 0;
        xy = [0, DocEl.offsetHeight - me.el.offsetHeight];
        break;
    }
    me.xy = xy;
  }
  /** @property {Enum} - 组件停靠的位置：
   * -'top': 顶部
   * -'right': 右侧
   * -'bottom': 底部
   * -'left': 左侧
   * @key
   */
  set dockPosition(value) {
    let me = this;
    me.applyCls(value, 'dockPosition', 'w-dock-');
    me.animateShow = me.animateHide = value;
  }
  /***/
  get dockPosition() {
    return this.dockPosition$;
  }
}
/**
 * 浮动提示组件。
 * @icon info
 * @mimic container
 */
Cls['Wb.Tip'] = class tip extends Wb.Container {
  static cls = 'w-tip w-pass w-disp-none';
  static configs = {
    floating: true,
    visible$: false
  };
  static protos = {
    /** @property {Boolean} clickTip 是否点击时显示提示。null表示自动判断，
     * 即移动端点击显示/隐藏提示，桌面端鼠标进入显示提示。 */
    /** @property {Number} - 显示时的延迟毫秒数。 */
    showDelay: 600,
    /** @property {Number} - 隐藏时的延迟毫秒数。 */
    hideDelay: 200,
    /** @property {Number} - 自动隐藏的延迟毫秒数。0或负数表示不自动隐藏。 */
    dismissDelay: 5000,
    /** @property {String} - 监听鼠标进入使用的事件名称。 @desktop @priv */
    enterEvent: 'mouseenter',
    /** @property {String} - 监听鼠标离开使用的事件名称。 @desktop @priv */
    leaveEvent: 'mouseleave',
    /** @property {Boolean} - 鼠标按键后是否自动隐藏提示。 */
    keydownDismiss: true,
    /** @property {Boolean} - 是否允许同时显示多个提示。 */
    allowOtherTips: false,
    /** @property {Boolean} - 是否显示在鼠标位置。true显示在鼠标位置，false根据defaultAlign对齐到目标组件元素。 */
    showAtCursor: true,
    /** @property {Boolean} - 当离开目标组件或提示对象时是否自动隐藏。默认为true。 */
    autoHide: true,
    defaultOffset: [15, 15],
    defaultAlign: 'br?',
    enterRetain$: false
  };
  /** @property {Boolean} isHtml 文本提示是否为HTML格式。true为html, false为文本。 */
  /** @property {Set} allowComps 允许显示提示的组件集。 @priv */
  /**
   * @event beforetip 在通过{#showTip}方法显示提示之前触发。返回false可阻止显示。
   * @param {Wb.Component} comp 提示关联的目标组件对象。
   * @param {Event} e 事件对象。
   */
  /***/
  init(configs) {
    let me = this;

    me.allowComps = new Set();
    //定义非原型的实例方法，用于添加到事件，防止相同原型方法在事件中仅注册一次
    Wb.apply(me, {
      //进入目标对象时执行的方法
      onTargetEnter() {
        me.allowComps.add(this);
      },
      //目标鼠标按下执行的方法
      onTargetMouseDown() {
        if (!me.visible)
          me.showTip.cancelDelay(me);
      },
      //离开目标对象时执行的方法
      onTargetLeave() {
        me.allowComps.remove(this);
        me.showTip.cancelDelay(me);
        if (me.autoHide) {
          if (me.visible)
            me.hideTip.delay(me, me.hideDelay);
          else
            me.hideTip.cancelDelay(me);
        }
      },
      //在目标对象上移动鼠标时执行的方法
      onTargetMouseMove(e) {
        let comp = this;
        if (me.allowComps.has(comp)) {
          //当最近的提示对象是组件本身时才提示，防止多个组件同时显示提示
          if (e.target.upBy(p => {
            p = p.citem;
            return p && (p.tip$ || p.errorTip$ || p.overflowTip$);
          })?.citem == comp) {
            me.currentComp = comp;
            me.showTip.delay(me, Wb.Tip.lastTip?.visible ? 10 : me.showDelay, comp, e);
          }
        }
      },
      //在目标对象上点击时执行的方法
      onTargetClick(e) {
        me.currentComp = this;
        me.showTip(this, e);
      }
    });
    super.init(configs);
    me.on({ show: me.onShow, hide: me.onHide });
  }
  /** @property {Wb.Tip} lastTip 最后一次显示的tip对象。 @static */
  /** @property {Boolean} moveDismiss 鼠标移动指定距离后是否自动隐藏提示。 */
  /**
   * 显示时执行的方法。 @priv
   */
  onShow() {
    let me = this, Tip = Wb.Tip;
    if (!me.allowOtherTips) {
      let lastTip = Tip.lastTip;
      if (lastTip !== me && lastTip?.visible && !lastTip?.contains(me.currentComp))
        lastTip.hideTip();
    }
    me.setMaxZIndex();
    Tip.lastTip = me;
    if (me.moveDismiss) {
      me.startMove = false;
      me.mon(DocEl, 'mousemove', me.onDocMouseMove);
    }
    me.mon(DocEl, Event.tapDownName, me.onTryHideTip);
    if (me.keydownDismiss)
      me.mon(DocEl, 'keydown', me.onTryHideTip);
  }
  /**
   * 隐藏时执行的方法。 @priv
   */
  onHide() {
    let me = this;
    if (me.moveDismiss)
      me.mun(DocEl, 'mousemove', me.onDocMouseMove);
    me.mun(DocEl, Event.tapDownName, me.onTryHideTip);
    if (me.keydownDismiss)
      me.mun(DocEl, 'keydown', me.onTryHideTip);
  }
  /** @property {Boolean} - 鼠标进入到提示组件内时是否保持显示状态。 */
  set enterRetain(value) {
    let me = this;
    if (me.enterRetain$ !== value) {
      me.enterRetain$ = value;
      me.setCls(!value, 'w-pass');
      if (me.clickTip ?? Wb.isTouch) {
        me.setListeners(value, 'click', me.toggleRetain);
      } else {
        me.setListeners(value, {
          mouseenter: me.onTipEnter,
          mouseleave: me.onTipLeave
        });
      }
    }
  }
  /***/
  get enterRetain() {
    return this.enterRetain$;
  }
  /**
   * 切换提示是否保持状态。 @priv
   */
  toggleRetain() {
    let me = this;
    if (me.hideTip.isDelayed(me))
      me.hideTip.cancelDelay(this);
    else
      me.hideTip();
  }
  /**
   * 进入提示组件时执行的方法。 @desktop @priv
   */
  onTipEnter() {
    this.hideTip.cancelDelay(this);
  }
  /**
   * 离开提示组件时执行的方法。 @desktop @priv
   */
  onTipLeave() {
    this.onTargetLeave();
  }
  /**
   * 注册或注销提示的目标对象。
   * @param {Wb.Component} comp 目标对象。
   * @param {Boolean} isReg true注册，false注销。
   * @priv
   */
  doRegister(comp, isReg) {
    comp.setEvents(isReg, 'destroy', this.onCompDestroy, this, { comp });
    if (this.clickTip ?? Wb.isTouch) {
      comp.setListeners(isReg, 'click', this.onTargetClick);
    } else {
      comp.setListeners(isReg, {
        [Event.tapMoveName]: this.onTargetMouseMove,
        [Event.tapDownName]: this.onTargetMouseDown,
        [this.enterEvent]: this.onTargetEnter,
        [this.leaveEvent]: this.onTargetLeave
      });
    }
  }
  /**
   * 目标组件销毁时执行的方法。 @priv
   */
  onCompDestroy(options) {
    if (options.comp == this.currentComp) {
      this.hideTip();
      delete this.currentComp;
    }
  }
  /**
   * 注册新的提示组件。
   * @param {Wb.Component} comp 目标组件。
   */
  register(comp) {
    this.doRegister(comp, true);
  }
  /**
   * 注销已经存在的提示组件。
   * @param {Wb.Component} comp 目标组件。
   */
  unregister(comp) {
    this.doRegister(comp, false);
    if (comp == this.currentComp) {
      delete this.currentComp;
      this.hide();
    }
  }
  /** @property {Wb.Component} currentComp 当前显示提示信息关联的对象。 @readonly */
  /**
   * 根据{#showAtCursor}的设置，立即显示当前提示对象到指定位置。 @priv
   * @param {Wb.Component} comp 提示关联的目标组件。
   * @param {Event} e 事件对象。
   */
  showTip(comp, e) {
    let me = this;

    if (!me.autoHide && me.visible$)
      return;
    //进入到离开targetEl仅允许显示一次tip
    me.allowComps.remove(comp);
    if (me.fireEvent('beforetip', comp, e) !== false) {
      //把xy移到0, 0可使超长宽度的tip宽度最大化
      me.xy = [0, 0];
      me.hideTip.cancelDelay(me);
      if (me.showAtCursor && !comp.tipAutoAlign)
        me.showAt(e.x + me.defaultOffset[0], e.y + me.defaultOffset[1]);
      else
        me.showBy(me.getTipTarget(e));
      if (me.dismissDelay > 0)
        me.hideTip.delay(me, me.dismissDelay);
    }
  }
  /**
   * 立即隐藏当前提示对象。
   */
  hideTip() {
    this.showTip.cancelDelay(this);
    this.hide();
  }
  /**
   * 获取关联的元素，鼠标进入该元素时将显示提示。
   * @param {Event} e 事件对象。
   * @priv
   */
  getTipTarget(e) {
    return e.currentTarget ?? e.target;
  }
  /**
   * 在点击或按键时尝试隐藏提示。 @priv
   */
  onTryHideTip(e) {
    let me = this;
    if (!me.enterRetain || !me.el.contains(e.target)) {
      //非enterRetain模式或enterRetain模式点击在提示外面
      me.hideTip();
    }
  }
  /** @property {Boolean} moveHideDone 移动后执行隐藏是否完成。 @priv */
  /**
   * 当DocEl移动鼠标时执行的方法。 @priv
   */
  onDocMouseMove(e) {
    let me = this;

    if (!me.startMove) {
      me.startMove = true;
      me.moveHideDone = false;
      me.startX = e.x;
      me.startY = e.y;
    } else if (Math.abs(e.x - me.startX) > 10 || Math.abs(e.y - me.startY) > 10) {
      if (!me.moveHideDone && (!me.enterRetain$ || !me.el.contains(e.target))) {
        me.hideTip.delay(me, me.hideDelay);
        me.moveHideDone = true;
      }
    }
  }
}
/**
 * 工具提示组件。该组件能根据目标对象的指定属性自动生成提示文本。
 */
Cls['Wb.Tooltip'] = class tooltip extends Wb.Tip {
  /** @property {Wb.Tooltip} - 获取共享的提示组件。 */
  static get shareTip() {
    return this.tooltip$ ??= new Wb.Tooltip();
  }
  /** @property {Wb.Tooltip} - 获取共享的可保持的提示组件。 */
  static get retainTip() {
    return this.retainTip$ ??= new Wb.Tooltip({
      enterRetain: true, textSelectable: true, keydownDismiss: false, autoScroll: 'auto', moveDismiss: true
    });
  }
  static protos = {
    /** @property {String} - 获取提示内容的目标组件属性名称。 */
    tipName: 'tip'
  };
  /**
   * 把指定值转换为提示对象。
   * @param {String/Object/Wb.Tip} tip 提示的信息内容、配置对象或提示实例。
   * @param {Boolean} [isHtml] 如果提示的为文本，是否为html格式。
   * @return {Wb.Tip} 提示对象。
   */
  static toTip(tip, isHtml) {
    let object;
    if (tip instanceof Wb.Tip) {
      object = tip;
    } else if (Wb.isObject(tip)) {
      object = Wb.create(Wb.apply({
        cname: 'tooltip'
      }, tip));
    } else {
      object = Wb.Tooltip.shareTip;
      if (isHtml)
        object.html = tip;
      else
        object.text = tip;
    }
    return object;
  }
  /***/
  ready(configs) {
    super.ready(configs);
    this.on('beforetip', this.onBeforeTip);
  }
  /**
   * 在提示之前执行的方法。 @priv
   * @param {Wb.Component} comp 提示关联的目标组件对象。
   * @param {Event} e 事件对象。
   */
  onBeforeTip(comp, e) {
    let tip = comp[this.tipName];
    //当组件同时设置有tip和errorTip时，优先显示errorTip
    if (tip == null || comp.errorTip$ && this.tipName != 'errorTip' || comp.picker$?.el?.contains(e.target))
      return false;
    if (!tip.instanced) {
      //非实例获取tip并设置到提示内容
      if (Wb.isFunction(tip))
        tip = tip.call(this, comp);
      else
        tip = String(tip);
      if (this.isHtml)
        this.html = tip;
      else
        this.text = tip;
    }
  }
}
/**
 * 错误提示组件。具有指定错误样式的提示组件。
 */
Cls['Wb.ErrorTip'] = class errorTip extends Wb.Tooltip {
  static configs = {
    layout: 'row'
  };
  static get shareTip() {
    return this.errorTip$ ??= new Wb.ErrorTip();
  }
  static protos = {
    /***/
    tipName: 'errorTip'
  };
  /***/
  init(configs) {
    super.init(configs);
    this.addEl('w-etip-icon w-icon icon-warn');
    this.textEl = this.addEl('w-etip-text');
  }
}
/**
 * 在组件不同的子元素移动时能触发显示的浮动提示组件。
 * 区别于{#Wb.Tip}使用mouseenter/mouseleave监听移动事件，该对象使用mouseover/mouseout来监听。
 */
Cls['Wb.OverTip'] = class overTip extends Wb.Tip {
  static protos = {
    enterEvent: 'mouseover',
    leaveEvent: 'mouseout'
  };
  /**
   * 获取显示提示信息的对象元素。
   * @param {Event} e 事件对象。
   * @priv
   */
  getTipTarget(e) {
    return e.target;
  }
}
/**
 * 组件内当有终端元素内容溢出时显示完整内容的提示组件。
 */
Cls['Wb.OverflowTip'] = class overflowTip extends Wb.OverTip {
  static configs = {
    enterRetain: true,
    textSelectable: true,
    keydownDismiss: false,
    autoScroll: true
  };
  /** @property {Wb.OverflowTip} - 获取共享的提示组件。 */
  static get shareTip() {
    return this.overflowTip$ ??= new Wb.OverflowTip();
  }
  /***/
  ready(configs) {
    super.ready(configs);
    this.on('beforetip', this.onBeforeTip);
  }
  /**
   * 在提示之前执行的方法。 @priv
   * @param {Wb.Component} comp 提示关联的目标组件对象。
   * @param {Event} e 事件对象。
   */
  onBeforeTip(comp, e) {
    let targetEl = e.target;
    //当前元素无子元素且溢出时提示
    if ((!targetEl.firstElementChild || targetEl.containsCls('w-text')) &&
      (targetEl.offsetWidth < targetEl.scrollWidth || targetEl.offsetHeight < targetEl.scrollHeight)) {
      //任意上级元素所在的组件设置了tip/errortip后阻止显示overflowTip
      if (targetEl.isInput || targetEl.closest('.w-no-tip') ||
        targetEl.bubbleSome(parent => parent.citem?.tip$ || parent.citem?.errorTip$))
        return false;
      let text = targetEl.textContent;
      if (!text)
        return false;
      this.text = text;
    } else {
      return false;
    }
  }
}
/**
 * 控件容器，具有容器的控件，可以在容器内添加下级控件。
 * @container
 * @icon model
 * @mimic container
 */
Cls['Wb.ControlCt'] = class controlCt extends Wb.Control {
  static firstNames = ['defaults', 'items'];
  static configs = {
    layout: 'row',
    align: 'center'
  };
  /** @property {Element} bodyEl 容器部分控件的结构体元素。 @readonly */
  /** @property {Object} containerConfig 容器部分控件的配置项。请参考{#Wb.Container}。 */
  /***/
  init(configs) {
    let me = this;

    super.init(configs);
    me.container = me.addFooter(Wb.apply({
      cname: 'container',
      cls: 'w-ctrl-ct'
    }, me.containerConfig));
    me.bodyEl = me.container.bodyEl;
    me.items$ = me.container.items$;
  }
  /** @property {Wb.Container} container 容器部分控件。 @readonly */
  /**
   * 删除容器控件内所有下级组件并添加新的下级组件。
   * @param {Object/Wb.Component/Array} items 下级组件配置对象、实例或其组成的数组。
   */
  setItems(items) {
    this.container.setItems(items);
  }
  /** @property {Object/Wb.Component/Array} - 设置容器控件内下级组件配置对象、实例或其组成的数组。 @code */
  set items(value) {
    this.container.items = value;
  }
  /** @property {Wb.Component[]} - 获取容器控件的直接下级组件实例组成的数组。 */
  get items() {
    return this.container.items;
  }
  /** @code */
  set app(value) {
    super.app = value;
    this.container.app = value;
  }
  /***/
  get app() {
    return super.app;
  }
  /**
   * 在容器组件尾部添加一个或多个下级组件。详见{#Wb.Container.add}。
   */
  add(data) {
    return this.container.insertBefore(data);
  }
  /** @property {Boolean} - 容器组件下的直接控件的标签是否显示在上面。false显示在左侧，true显示在上面。 @design */
  set labelUp(value) {
    this.container.labelUp = value;
  }
  /***/
  get labelUp() {
    return this.container.labelUp;
  }
  /** @property {Enum} - 容器组件下的直接控件标签对齐方式。
    * -'left': 左对齐
    * -'center': 居中
    * -'right': 右对齐
    * @design
    */
  set labelAlign(value) {
    this.container.labelAlign = value;
  }
  /***/
  get labelAlign() {
    return this.container.labelAlign;
  }
  /** @property {TextString} - 容器组件的{#bodyEl}元素的grid样式。详见{#Wb.Container.grid}。 @design */
  set grid(value) {
    this.container.grid = value;
  }
  /***/
  get grid() {
    return this.container.grid;
  }
  /** @property {String} - 容器组件的{#bodyEl}元素的grid-template-columns样式。 */
  set gridTplColumns(value) {
    this.container.gridTplColumns = value;
  }
  /***/
  get gridTplColumns() {
    return this.container.gridTplColumns
  }
  /** @property {String} - 容器组件的{#bodyEl}元素的grid-template-rows样式。 */
  set gridTplRows(value) {
    this.container.gridTplRows = value
  }
  /***/
  get gridTplRows() {
    return this.container.gridTplRows;
  }
  /** @property {Enum} - 容器组件的bodyEl元素的grid-auto-flow样式。详见{#Wb.Container.gridAutoFlow}。
   * -'row': 通过逐行填充来排列元素，在必要时增加新行。
   * -'column': 通过逐列填充来排列元素，在必要时增加新列。
   * -'dense': 使用“稠密”堆积算法。
   * -'row dense': row和dense的组合。
   * -'column dense': column和dense的组合。
   * @design
   */
  set gridAutoFlow(value) {
    this.container.gridAutoFlow = value;
  }
  /***/
  get gridAutoFlow() {
    return this.container.gridAutoFlow;
  }
  /** @property {Boolean} - 如果容器组件使用弹性布局，下级组件是否自动换行。 @design */
  set flexWrap(value) {
    this.container.flexWrap = value;
  }
  /***/
  get flexWrap() {
    return this.container.flexWrap;
  }
  /** @property {Enum} - 当容器组件为弹性布局时，下级组件主轴方向对齐方式。详见{#Wb.Container.justify}。
   * -'start': 开始
   * -'center': 中间
   * -'end': 末尾
   * -'between': 两端对齐
   * -'around': 等间距对齐
   * @design
   */
  set justify(value) {
    this.container.justify = value;
  }
  /***/
  get justify() {
    return this.container.justify;
  }
  /** @property {Enum/Number/String} - 容器组件内边距。如果值为数值，默认单位为px。
   * -true: 设置全部内边距为指定值的边距。
   * -false: 无边距。
   * -'top': 仅上边距。
   * -'right': 仅右边距。
   * -'bottom': 仅下边距。
   * -'left': 仅左边距。
   * @design
   */
  set padding(padding) {
    this.container.padding = padding;
  }
  /***/
  get padding() {
    return this.container.padding;
  }
  /** @property {Boolean} - 当容器组件为弹性布局时，下级组件是否自动弹性收缩。 @design */
  set shrink(value) {
    this.container.shrink = value;
  }
  /***/
  get shrink() {
    return this.container.shrink;
  }
  /** @property {String} - 添加到组件的{#bodyEl}元素的以空格分隔的多个样式类名。区别于元素的className属性，
   * 设置该属性将增量添加类名。 */
  set bodyCls(cls) {
    this.bodyEl.cls = cls;
  }
  /** @property {String} - 组件的{#bodyEl}元素的样式类名称，同元素的className属性一致。 */
  get bodyCls() {
    return this.bodyEl.className;
  }
  /** 
   * @property {Enum} - 容器控件的预定义布局名称，用于指定其下级组件的排列方式，多个布局名称使用空格
   * 分隔。元素的布局名称通常为其指定的样式名称。
   * -'fit': 下级组件填满容器。
   * -'row': 弹性行。
   * -'column': 弹性列。
   * -'center': 下级组件水平垂直居中布局。当下级组件溢出时将裁剪组件使其中心同容器中心始终保持对齐。
   * -'vcenter': 居中布局。同"center"的区别为flex-direction为column。
   * -'form': 自动表单，下级组件按组件原始宽度自动水平平铺。
   * -'form1': 表单1列。该布局同grid1的区别为可以纵向弹性伸缩。
   * -'grid': 自动网格，下级组件按指定宽度自动水平平铺并对齐到网格。
   * -'grid1': 网格1列。
   * -'grid2': 网格2列。
   * -'grid3': 网格3列。
   * -'grid4': 网格4列。
   * -'grid5': 网格5列。
   * -'grid6': 网格6列。
   * -'grid7': 网格7列。
   * -'grid8': 网格8列。
   * -'grid9': 网格9列。
   * -'grid10': 网格10列。
   * -'grid11': 网格11列。
   * -'grid12': 网格12列。
   * -'grid13': 网格13列。
   * -'grid14': 网格14列。
   * -'grid15': 网格15列。
   * -'grid16': 网格16列。
   * -'grid17': 网格17列。
   * -'grid18': 网格18列。
   * -'grid19': 网格19列。
   * -'grid20': 网格20列。
   * -'form-compact': 紧凑样式自动表单，下级组件按组件原始宽度自动水平平铺。
   * -'grid-compact': 紧凑样式自动网络，下级组件按指定宽度自动水平平铺并对齐到网格。
   * -'middle': 下级组件水平垂直居中布局。当下级组件溢出时不裁剪组件，此时其中心同容器中心将不对齐。
   * -'hmiddle': 下级组件水平居中布局。当下级组件溢出时不裁剪组件，此时其中心同容器中心将不水平对齐。
   * -'vmiddle': 下级组件垂直居中布局。当下级组件溢出时不裁剪组件，此时其中心同容器中心将不垂直对齐。
   * @design
   * @key
   */
  set layout(layout) {
    this.container.layout = layout;
  }
  /***/
  get layout() {
    return this.container.layout;
  }
  /** @property {Enum/Boolean} - 当容器{#layout}使用网格布局时是否根据窗口大小动态调整为单列网格。
   * -true: 当窗口小于指定宽度时使用单列网格，否则恢复为指定列数的网格布局。
   * -false: 恢复为默认的网格布局。
   * -'up': 具有 true 值的效果的同时且强制将标签显示在控件上面。
   */
  set autoGrid(value) {
    this.container.autoGrid = value;
  }
  /***/
  get autoGrid() {
    return this.container.autoGrid;
  }
  /** @property {Boolean/Number/String} - 容器控件下级组件之间是否添加间隙。true显式增加默认大小间隙，false显式去掉
   * 间隙。数值或字符表示间隙大小。默认为null表示不设置间隙。 @design */
  set gap(value) {
    this.container.gap = value;
  }
  /***/
  get gap() {
    return this.container.gap;
  }
  /** @property {Boolean} - 容器控件下级组件是否设置加宽的标签宽度。false普通宽度，true加宽的宽度。 @design */
  set wideLabel(value) {
    this.container.wideLabel = value;
  }
  /***/
  get wideLabel() {
    return this.container.wideLabel;
  }
  /** @property {Enum} - 容器控件为弹性布局时，下级组件主轴垂直方向排列方式。
   * -'start': 开始
   * -'center': 中间
   * -'end': 末尾
   * -'baseline': 文字基线
   * -'stretch': 拉伸
   * @design
   */
  set align(value) {
    this.container.align = value;
  }
  /***/
  get align() {
    return this.container.align;
  }
  /** @property {Enum} - 当容器控件为弹性布局且自动换行多行显示时，每行下级组件之间和周围如何分配空间。
   * -'start': 开始
   * -'center': 中间
   * -'end': 末尾
   * -'between': 两端对齐
   * -'around': 等间距对齐
   * -'stretch': 拉伸
   * @design
   */
  set alignContent(value) {
    this.container.alignContent = value
  }
  /***/
  get alignContent() {
    return this.container.alignContent;
  }
  /** @property {Boolean} - 容器控件是否使用表格样式来显示所有下级组件。通常配合grid布局使用。 @design */
  set tableStyle(value) {
    this.container.tableStyle = value;
  }
  /***/
  get tableStyle() {
    return this.container.tableStyle;
  }
  /** @property {Object} - 容器控件直接下级组件默认增量属性。如需清除该属性值，清使用{#clearDefaults}方法。 */
  set defaults(value) {
    this.container.defaults = value;
  }
  /** @property {Object} - 容器控件直接下级组件默认属性。 */
  get defaults() {
    return this.container.defaults;
  }
}
/**
 * 滑块控件，用于通过滑动的方式来设置和展示值。
 * 滑块的相关示例见：{#%check-slider.xwl|ide?openModule=example/comps/check-slider.xwl}
 * @icon slidebar
 */
Cls['Wb.Slider'] = class slider extends Wb.Control {
  //设置值时可能用到prefix/suffix,value要先于tabIndex
  static firstNames = ['prefix', 'suffix', 'value', 'tabIndex'];
  static protos = {
    diffTrackColor$: true,
    /** @property {Number} - 每次拖动的步长。 */
    step: 1,
    /** @property {Number} - 最大值。 */
    maxValue: 100,
    /** @property {Number} - 最小值。 */
    minValue: 0,
    /** @property {Boolean} slideTip 滑块滑动时是否在滑块上显示值的提示。默认null表示显示。 */
    /** @property {Boolean} - 当值为0和1时是否返回boolean值。 @priv */
    boolValue: false,
    vertical$: false,
    tabIndex$: 0,
    /** @property {Boolean} - 是否显示滑块轨道。 */
    track: true
  };
  static configs = {
    tabIndex: undefined
  };
  /**
   * @event change 当值发生变化时触发。
   * @param {Number} value 当前滑块值。如果有多个滑块，获取所有滑块值请访问{#value}属性。
   * @param {Number} oldValue 当前滑块原值。
   */
  /** @property {Element} trackEl1 滑块已完成部分元素。 @readonly */
  /** @property {Element} trackEl2 滑块示完成部分元素。 @readonly */
  /** @property {Element} sliderEl 滑块轨道元素。 @readonly */
  /** @property {Element} handles 滑块把手元素列表。 @readonly */
  /** @property {Boolean} percentUnit 滑动最小单位的百分比值。 @priv */
  /**
   * @event startdrag 开始拖动时触发。
   * @param {Number} value 当前值。
   */
  /**
   * @event enddrag 结束拖动后触发。
   * @param {Number} value 当前值。
   */
  /***/
  init(configs) {
    let me = this, sliderEl;

    super.init(configs);
    configs.value ??= me.minValue;
    sliderEl = me.sliderEl = me.addEl('w-slider');
    if (me.track) {
      me.trackEl1 = sliderEl.addEl('w-slider-track');
      me.trackEl2 = sliderEl.addEl('w-slider-track w-slider-remain');
    }
    me.mon({
      el: sliderEl,
      keydown: me.onKeyDown,
      [Event.tapDownName]: { fn: me.onTapDown, passive: false },
      [Event.tapUpName]: { fn: me.onTapUp, passive: false }
    });
    me.draggable = {
      dragTarget: true, forceEnabled: true, constrainEl: sliderEl, threshold: 1, moveY: false, moveX: true,
      drag(data) {
        let handle = data.handle, handles = me.handles, index = handles.indexOf(handle),
          offsetPos = me.vertical ? 'offsetTop' : 'offsetLeft',
          beforePos = handles[index - 1]?.[offsetPos] ?? -Wb.maxInt,
          afterPos = handles[index + 1]?.[offsetPos] ?? Wb.maxInt;

        me.moveHandle(handle, handle[offsetPos].constrain(beforePos, afterPos));
      },
      events: {
        startdrag() {
          me.fireEvent('startdrag', me.value);
        },
        enddrag() {
          me.allowEndDrag = false;
          me.fireEvent('enddrag', me.value);
        },
        beforedrag(data, e) {
          let handle = me.dispatchHandle ?? e.target.closest('.w-slider-handle');
          if (handle) {
            data.handle = data.targetEl = handle;
            handle.tipEl?.show();
            me.setTipPos(handle);
          } else
            return false;
        },
        afterdrag(data) {
          data.handle.tipEl?.hide();
        }
      }
    };
  }
  /** @property {Boolean} - 是否垂直滑动。 @design */
  set vertical(value) {
    let me = this;
    if (me.vertical$ !== value) {
      let draggable = me.draggableComp, trackEl = me.trackEl1;

      me.vertical$ = value;
      me.setCls(value, 'w-vertical');
      draggable.moveY = value;
      draggable.moveX = !value;
      if (value) {
        me.handles.forEach(handle => {
          if (handle?.x) {
            handle.y = handle.x;
            handle.x = null;
          }
        });
        if (trackEl?.width) {
          trackEl.height = trackEl.width;
          trackEl.width = null;
        }
      } else {
        me.handles.forEach(handle => {
          handle.x = handle.y;
          handle.y = null;
        });
        if (trackEl?.height) {
          trackEl.width = trackEl.height;
          trackEl.height = null;
        }
      }
    }
  }
  /***/
  get vertical() {
    return this.vertical$;
  }
  /** @property {Number} handleCount 滑块的数量。 @priv */
  /** @property {Number/Number[]/Boolean} - 滑块值。如果存在多个滑块为多个滑块值组成的数组。如果无滑块返回null。 @key
   */
  set value(value) {
    let me = this, newValue, oldValue;

    if (value === true)
      value = 1;
    value = Wb.toArray(value);
    me.handleCount = value.length;
    if (me.handles?.length != value.length)
      me.rebuildSlider();
    me.handles.forEach((handle, i) => {
      newValue = value[i];
      if (handle.slideValue != newValue) {
        oldValue = handle.slideValue;
        handle.slideValue = newValue;
        me.setHandlePos(handle, (newValue - me.minValue) / (me.maxValue - me.minValue));
        me.fireChange(newValue, oldValue);
      }
    });
  }
  /***/
  get value() {
    let handles = this.handles;

    if (handles) {
      if (handles.length == 1) {
        let val = handles[0].slideValue;
        return this.boolValue ? !!val : val;
      } else {
        return handles.pluck('slideValue').sort();
      }
    } else return null;
  }
  /** @property {Boolean} isChanged 按下鼠标后是否发生change事件。 @priv */
  /**
   * 发起change事件。 @priv
   * @param {Number} newValue 新值。
   * @param {Number} oldValue 原值。
   */
  fireChange(newValue, oldValue) {
    let me = this;
    if (me.boolValue) {
      newValue = !!newValue;
      oldValue = !!oldValue;
    }
    if (newValue !== oldValue) {
      me.fireEvent('change', newValue, oldValue);
      if (me.prefix === true)
        me.prefixEl.textContent = newValue;
      if (me.suffix === true)
        me.suffixEl.textContent = newValue;
      me.isChanged = true;
    }
  }
  /** @property {Element} dispatchHandle 通过dispatchEvent方法传递的元素。 @priv */
  /**
   * 鼠标按下时执行的方法。
   * @param {Event} e 事件对象。
   */
  onTapDown(e) {
    let me = this, vertical = me.vertical;

    me.isChanged = false;
    if (e.target.containsCls('w-slider-handle') || e.button)
      return;
    let pos, handle, handles = me.handles, rect = me.sliderEl.getRect();
    handles.each(h => {
      if (vertical && h.getRect().y < e.y || !vertical && h.getRect().x < e.x) {
        handle = h;
        return false;
      }
    }, true, true);
    handle ??= handles[0];
    if (vertical)
      pos = e.y - rect.y - handle.offsetHeight / 2;
    else
      pos = e.x - rect.x - handle.offsetWidth / 2;
    me.moveHandle(handle, pos);
    handle.focus();
    e.stopEvent();
    me.dispatchHandle = handle;
    me.dispatchEvent(Event.tapDownName, e);
    delete me.dispatchHandle;
    me.allowEndDrag = true;
  }
  /**
   * 鼠标释放时执行的方法。
   * @param {Event} e 事件对象。
   */
  onTapUp(e) {
    let me = this;
    if (me.allowEndDrag) {
      me.allowEndDrag = false;
      me.fireEvent('enddrag', me.value);
    }
  }
  /**
   * 移动滑块至指定位置。 @priv
   * @param {Element} handle 滑块把手元素。
   * @param {Number} pos 位置。
   */
  moveHandle(handle, pos) {
    let me = this, percent, oldValue, value;

    if (me.vertical)
      value = me.sliderEl.offsetHeight - handle.offsetHeight;
    else
      value = me.sliderEl.offsetWidth - handle.offsetWidth;
    percent = value == 0 ? 0 : (pos / value).snap(me.percentUnit).constrain(0, 1);
    oldValue = handle.slideValue;
    value = Math.round(me.minValue + (me.maxValue - me.minValue) * percent);
    me.setHandlePos(handle, percent);
    if (value != oldValue) {
      handle.slideValue = value;
      me.setTipPos(handle);
      me.fireChange(value, oldValue);
    }
  }
  /**
   * 按键时执行的方法。
   * @param {Event} e 事件对象。
   */
  onKeyDown(e) {
    let me = this, handle = e.target.closest('.w-slider-handle');

    if (handle) {
      let oldValue, newValue, keyPressed, step = me.step;

      newValue = oldValue = handle.slideValue;
      switch (e.code) {
        case Keys.Left:
        case Keys.Up:
          if (newValue > me.minValue)
            newValue -= step;
          newValue = newValue.snap(step).constrain(me.minValue, me.maxValue);
          keyPressed = true;
          break;
        case Keys.Right:
        case Keys.Down:
          if (newValue < me.maxValue)
            newValue += step;
          newValue = newValue.snap(step).constrain(me.minValue, me.maxValue);
          keyPressed = true;
          break;
        case Keys.Enter:
          if (me.boolValue) {
            newValue = !oldValue;
            keyPressed = true;
          }
          break;
      }
      if (keyPressed) {
        if (newValue != oldValue) {
          handle.slideValue = newValue;
          me.setHandlePos(handle, (newValue - me.minValue) / (me.maxValue - me.minValue));
          me.fireChange(newValue, oldValue);
        }
        e.stopEvent();
      }
    }
  }
  /** @property {Function} tipRender 自定义滑块提示内容方法。返回值将作为滑块滑动时的提示文本。
   * @param {Number} value 当前值。
   */
  /**
   * 设置滑块提示的位置。 @priv
   * @param {Element} handle 滑块把手元素。
   */
  setTipPos(handle) {
    let tipEl = handle.tipEl, reverse;

    if (tipEl) {
      let rect = handle.getRect(), x, y, value;

      value = handle.slideValue;
      tipEl.textContent = this.tipRender?.call(this, value) ?? value;
      if (this.vertical) {
        tipEl.y = (rect.y - tipEl.offsetHeight / 2 + handle.offsetHeight / 2).constrain(2,
          BodyEl.offsetHeight - tipEl.clientHeight - 2);
        x = rect.x - tipEl.offsetWidth - 10;
        reverse = x < 0;
        tipEl.setCls(reverse, 'w-reverse');
        if (reverse)
          x = rect.right + 10;
        tipEl.x = x;
      } else {
        tipEl.x = (rect.x - tipEl.offsetWidth / 2 + handle.offsetWidth / 2).constrain(2,
          BodyEl.offsetWidth - tipEl.clientWidth - 2);
        y = rect.y - tipEl.offsetHeight - 10;
        reverse = y < 0;
        tipEl.setCls(reverse, 'w-reverse');
        if (reverse)
          y = rect.bottom + 10;
        tipEl.y = y;
      }
    }
  }
  /**
   * 设置滑块把手的百分比位置。 @priv
   * @param {Element} handle 滑块把手元素。
   * @param {Number} percent 百分比位置。
   */
  setHandlePos(handle, percent) {
    let me = this, vertical = me.vertical;

    percent = 'calc((100% - 0.5em) * ' + percent + ')';
    if (vertical)
      handle.y = percent;
    else
      handle.x = percent;
    if (me.track && me.diffTrackColor) {
      let lastHandle;
      lastHandle = me.handles.reduce((a, b) => {
        return a.slideValue > b.slideValue ? a : b;
      });
      if (lastHandle == handle) {
        if (vertical)
          me.trackEl1.height = percent;
        else
          me.trackEl1.width = percent;
      }
    }
  }
  /**
   * 重新构建滑块。
   */
  rebuildSlider() {
    let i, handles, handle, me = this, handleCount = me.handleCount,
      sliderEl = me.sliderEl, tabIndex = me.tabIndex;

    if (me.maxValue <= me.minValue)
      Wb.raise('Wb.Slider: Property maxValue must be greater than minValue.');
    if (me.step.hasDecimal)
      Wb.raise('Wb.Slider: Property step must be an integer.');
    me.percentUnit = me.step / (me.maxValue - me.minValue);
    me.handles?.forEach(handle => handle.remove());
    handles = me.handles = [];
    me.tabIndexEl = [];
    for (i = 0; i < handleCount; i++) {
      handle = sliderEl.addEl('w-slider-handle');
      if (me.slideTip ?? true)
        handle.tipEl = handle.addEl('w-slider-tip w-disp-none');
      me.tabIndexEl.push(handle);
      handle.tabIndex = tabIndex;
      handles.push(handle);
    }
    me.focusEl = me.tabIndexEl[0];
  }
  /** @property {Boolean} - 最后一个滑块之前和之后的轨道颜色是否差异化显示。 */
  set diffTrackColor(value) {
    if (this.diffTrackColor$ !== value) {
      this.diffTrackColor$ = value;
      this.trackEl1.setCls(!value, 'w-slider-remain');
    }
  }
  /***/
  get diffTrackColor() {
    return this.diffTrackColor$;
  }
  /** @property {Element} prefixEl 轨道前标签元素，仅当设置{#prefix}后有效。 @readonly */
  /** @property {String} - 轨道前标签。 @design @key */
  set prefix(value) {
    let me = this;
    if (me.prefix$ !== value) {
      me.prefix$ = value;
      if (value) {
        me.prefixEl ??= me.el.insertElBefore('w-margin-r', null, me.sliderEl);
        me.prefixEl.textContent = value;
      } else {
        me.prefixEl?.remove();
        me.prefixEl = null;
      }
    }
  }
  /***/
  get prefix() {
    return this.prefix$;
  }
  /** @property {String/Number} suffixWidth 轨道后标签宽度，数值表示像素。 */
  /** @property {Element} suffixEl 轨道后标签元素，仅当设置{#suffix}后有效。 @readonly */
  /** @property {Boolean/String} - 轨道后标签，设置true将显示当前值并默认设置slideTip为false。 @design @key */
  set suffix(value) {
    let me = this;
    if (me.suffix$ !== value) {
      me.suffix$ = value;
      if (value) {
        let suffixWidth = me.suffixWidth;

        me.suffixEl ??= me.el.insertElAfter('w-margin-l', null, me.sliderEl);
        if (value === true) {
          me.slideTip ??= false;
          me.suffixEl.removeCls('w-margin-l')
          me.suffixEl.cls = 'w-ta-right';
          suffixWidth ??= (String(me.maxValue).length) + 'em';
        }
        if (suffixWidth != null)
          me.suffixEl.width = Wb.px(suffixWidth);
        me.suffixEl.textContent = value === true ? me.value : value;
      } else {
        me.suffixEl?.remove();
        me.suffixEl = null;
      }
    }
  }
  /***/
  get suffix() {
    return this.suffix$;
  }
}
/**
 * 平面滑块控件，可在水平和垂直方向自由滑动，并获取水平和垂直值。
 * @icon check3
 */
Cls['Wb.AreaSlider'] = class areaSlider extends Wb.Control {
  static cls = 'w-area-slider';
  static protos = {
    /** @property {Number} - 每次拖动的步长。 */
    step: 1,
    /** @property {Mix/Number[]} - 最大值。 */
    maxValue: [100, 100],
    /** @property {Mix/Number[]} - 最小值。 */
    minValue: [0, 0]
  };
  /**
   * @event change 当值发生变化时触发。
   * @param {Number[]} value 当前值。
   * @param {Number[]} oldValue 原值。
   */
  /** @property {Element} sliderEl 滑块轨道元素。 @readonly */
  /** @property {Element} handle 滑块把手元素。 @readonly */
  /** @property {Boolean} percentX 水平滑动最小单位的百分比值。 @priv */
  /** @property {Boolean} percentY 垂直滑动最小单位的百分比值。 @priv */
  /**
   * @event startdrag 开始拖动时触发。
   * @param {Number[]} value 当前值。
   */
  /**
   * @event enddrag 结束拖动后触发。
   * @param {Number[]} value 当前值。
   */
  /***/
  init(configs) {
    let me = this, handle, sliderEl;

    super.init(configs);
    configs.value ??= me.minValue;
    sliderEl = me.sliderEl = me.addEl('w-slider');
    me.percentX = me.step / (me.maxValue[0] - me.minValue[0]);
    me.percentY = me.step / (me.maxValue[1] - me.minValue[1]);
    handle = me.focusEl = me.handle = sliderEl.addEl('w-slider-handle');
    handle.tabIndex = me.tabIndex;
    me.mon({
      el: sliderEl,
      [Event.tapDownName]: { fn: me.onTapDown, passive: false },
      [Event.tapUpName]: { fn: me.onTapUp, passive: false }
    });
    me.draggable = {
      dragTarget: true, constrainEl: sliderEl, threshold: 1, forceEnabled: true,
      drag(data) {
        me.moveHandle(handle.offsetLeft, handle.offsetTop);
      },
      events: {
        beforedrag(data, e) {
          return !!(data.targetEl = me.dispatchHandle ?? e.target.closest('.w-slider-handle'));
        },
        startdrag() {
          me.fireEvent('startdrag', me.value);
        },
        enddrag() {
          me.allowEndDrag = false;
          me.fireEvent('enddrag', me.value);
        },
      }
    };
  }
  /** @property {Mix/Number[]} - 组件值。由X和Y值组成的数组。 @key */
  set value(value) {
    let me = this, oldValue = this.value$ ?? [];

    if (oldValue[0] !== value[0] || oldValue[1] !== value[1]) {
      me.value$ = value;
      me.setHandlePos((value[0] - me.minValue[0]) / (me.maxValue[0] - me.minValue[0]),
        (value[1] - me.minValue[1]) / (me.maxValue[1] - me.minValue[1]));
      me.fireChange(value, oldValue);
    }
  }
  /***/
  get value() {
    return this.value$;
  }
  /** @property {Enum/Number/String} - 平面边界。如果值为数值，默认单位为px。
   * -true: 设置全部边界为"thin"。
   * -false: 无边界。
   * -'top': 仅上边界为"thin"。
   * -'right': 仅右边界为"thin"。
   * -'bottom': 仅下边界为"thin"。
   * -'left': 仅左边界为"thin"。
   * @design 
   */
  set areaBorder(val) {
    this.sliderEl.border = val;
  }
  /***/
  get areaBorder() {
    return this.sliderEl.border;
  }
  /**
   * 发起change事件。 @priv
   * @param {Number[]} newValue 新值。
   * @param {Number[]} oldValue 原值。
   */
  fireChange(newValue, oldValue) {
    this.fireEvent('change', newValue, oldValue);
  }
  /** @property {Element} dispatchHandle 通过dispatchEvent方法传递的元素。 @priv */
  /**
   * 鼠标按下时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onTapDown(e) {
    let me = this, x, y;

    if (e.target.containsCls('w-slider-handle') || e.button)
      return;
    let handle = me.handle, rect = me.sliderEl.getRect();
    x = e.x - rect.x - handle.offsetWidth / 2;
    y = e.y - rect.y - handle.offsetHeight / 2;
    me.moveHandle(x, y);
    handle.focus();
    e.stopEvent();
    me.dispatchHandle = handle;
    me.dispatchEvent(Event.tapDownName, e);
    delete me.dispatchHandle;
    me.allowEndDrag = true;
  }
  /**
   * 鼠标释放时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onTapUp(e) {
    let me = this;
    if (me.allowEndDrag) {
      me.allowEndDrag = false;
      me.fireEvent('enddrag', me.value);
    }
  }
  /**
   * 移动滑块至指定位置。 @priv
   * @param {Number} x x位置。
   * @param {Number} y y位置。
   */
  moveHandle(x, y) {
    let me = this, handle = me.handle, oldValue, value;

    x = (x / (me.sliderEl.offsetWidth - handle.offsetWidth)).snap(me.percentX).constrain(0, 1);
    y = (y / (me.sliderEl.offsetHeight - handle.offsetHeight)).snap(me.percentY).constrain(0, 1);
    oldValue = me.value$;
    value = [
      Math.round(me.minValue[0] + (me.maxValue[0] - me.minValue[0]) * x),
      Math.round(me.minValue[1] + (me.maxValue[1] - me.minValue[1]) * y)
    ];
    me.setHandlePos(x, y);
    if (value[0] != oldValue[0] || value[1] != oldValue[1]) {
      me.value$ = value;
      me.fireChange(value, oldValue);
    }
  }
  /**
   * 设置滑块把手的百分比位置。 @priv
   * @param {Number} percentX x百分比位置。
   * @param {Number} percentY y百分比位置。
   */
  setHandlePos(percentX, percentY) {
    let handle = this.handle;

    handle.x = 'calc((100% - 1em) * ' + percentX + ')';
    handle.y = 'calc((100% - 1em) * ' + percentY + ')';
  }
}
/**
 * 开关控件，用于在“开”和“关”之间切换状态。
 * @icon switcher-on
 */
Cls['Wb.Toggle'] = class toggle extends Wb.Slider {
  static cls = 'w-toggle';
  static protos = {
    maxValue: 1,
    boolValue: true,
    slideTip: false,
    value$: false,
    /** @property {Enum} - 获取值时返回的值类型：
     * -'int': 整数值，为0或1。
     * -'string': 字符值，为"false"或"true"。
     * -'bool': 布尔值。默认值。
     */
    returnType: 'bool'
  };
  static configs = {
    clickToggle: null
  };
  /** @property {Boolean} value 开关的状态值。true开，false关。 @setter @design true */
  /**
   * 点击时执行的方法。 @priv
   */
  onClick() {
    if (!this.isChanged)
      this.value = !this.value;
  }
  /***/
  setHandlePos(handle, percent) {
    let me = this;

    if (me.vertical) {
      if (percent) {
        handle.y = '1.5em';
        me.trackEl1.height = '3em';
      } else {
        handle.y = '.2em';
        me.trackEl1.height = '0';
      }
    } else {
      if (percent) {
        handle.x = '1.5em';
        me.trackEl1.width = '3em';
      } else {
        handle.x = '.2em';
        me.trackEl1.width = '0';
      }
    }
  }
  /** @property {Boolean} - 点击时是否切换开关。true仅点击切换，false仅拖动切换。默认为null，即二者皆可。 */
  set clickToggle(value) {
    let me = this;
    if (me.clickToggle$ !== value) {
      let allowClick, allowDrag;
      me.clickToggle$ = value;
      if (value == null) {
        allowClick = true;
        allowDrag = true;
      } else if (value) {
        allowClick = true;
        allowDrag = false;
      } else {
        allowClick = false;
        allowDrag = true;
      }
      me.setListeners(allowClick, me.sliderEl, 'click', me.onClick);
      me.draggableComp.disabled = !allowDrag;
    }
  }
  /***/
  get clickToggle() {
    return this.clickToggle$;
  }
  /** @property {Enum} - 开关按钮的对齐方式：
   * -'start': 开始，默认值
   * -'center': 居中
   * -'end': 末尾
   * @design
   */
  set toggleAlign(value) {
    this.applyCls(value, 'toggleAlign', 'w-margin-', this.sliderEl);
  }
  /***/
  get toggleAlign() {
    return this.toggleAlign$;
  }
  /** @property {Boolean} - 开关值。true表示打开，false表示关闭。 @key
   */
  set value(value) {
    super.value = value;
  }
  /***/
  get value() {
    let value = super.value;
    switch (this.returnType) {
      case 'int':
        return value ? 1 : 0;
      case 'string':
        return value ? 'true' : 'false';
      default:
        return value;
    }
  }
}
/**
 * 图表类，用于显示图表。该类为Echart类的适配类，相关文档见ECharts文档说明。
 * 图表的相关示例见：{#%chart.xwl|ide?openModule=example/comps/chart.xwl}
 * @icon chart-bar
 * @lib wb/libs/echarts.js
 * @mimic component
 */
Cls['Wb.Chart'] = class chart extends Wb.Component {
  static cls = 'w-ct';
  static protos = {
    /** @property {Boolean} autoLoad 是否在组件就绪后自动加载远程数据。仅当组件无数据时有效。默认为true。 @key */
    autoLoad: true
  };
  /** @property {Object} instance 图表实例对象。 */
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    me.instance = echarts.init(me.el, Wb.configs.editorTheme == 'vs-dark' ? 'dark' : null,
      { locale: Str.lang == 'zh-cn' ? 'ZH' : 'EN' });
    me.mon('resize', f => {
      me.instance.resize();
    });
  }
  /***/
  ready(configs) {
    let me = this;
    super.ready(configs);
    if (me.autoLoad && me.url)
      me.load();
  }
  /**
   * @event beforeload 发起远程数据请求之前的事件，返回false将取消请求。可以通过该事件传递参数。
   * @param {Object} configs 加载的选项对象。
   * @param {Object} params 请求时提交的参数对象。
   */
  /** 
   * @event callback 远程数据加载完成后的事件，无论数据加载成功与否该事件均会被触发。
   * @param {Object} data 选项和数据。
   * @param {XMLHttpRequest} xhr ajax请求对象。
   * @param {Event} e 事件对象。
   * @param {Boolean} successful 加载是否成功，true成功，false失败。
   */
  /** 
   * @event success 远程数据加载成功后的事件。
   * @param {Object} data 选项和数据。
   * @param {XMLHttpRequest} xhr ajax请求对象。
   * @param {Event} e 事件对象。
   */
  /** 
   * @event failure 远程数据加载失败后的事件。
   * @param {Object} data 选项和数据。
   * @param {XMLHttpRequest} xhr ajax请求对象。
   * @param {Event} e 事件对象。
   */
  /** @property {String} url 加载远程数据时默认指向的url地址。设置本地数据请访问{#option}属性。 @key */
  /**
   * 加载远程图表数据到当前图表中。详见{#Wb.ajax}说明。
   * @param {Object/String} configs 请求的配置对象或请求的url地址。
   * @return {XMLHttpRequest} ajax请求对象。
   */
  load(configs) {
    if (Wb.isString(configs))
      configs = { url: configs };
    else
      configs = Wb.copy(configs);
    let me = this, callback = configs.success, extraParams = {};

    //未设置url允许执行beforeload，可在beforeload中动态加载数据
    if (me.fireEvent('beforeload', configs, extraParams) === false)
      return false;
    configs.json ??= true;
    configs.url ??= me.url;
    configs.params = Wb.apply({}, configs.params, extraParams);
    me.lastParams = Wb.copy(configs.params);
    configs.callback = function (resp, xhr, e) {
      let ok = xhr.ok;
      if (ok) {
        me.option = resp;
        me.fireEvent('success', resp, xhr, e);
      } else {
        me.fireEvent('failure', resp, xhr, e);
      }
      me.fireEvent('callback', resp, xhr, e, ok);
      callback?.apply(this, args);
    };
    return Wb.ajax(configs);
  }
  /** @property {Object} lastParams 最后一次查询时使用的参数对象。 @priv */
  /**
   * 默认使用最后一次{#load}方法的参数，获取远程数据，成功后重新加载到图表中。
   * @param {Object} [configs] 配置对象，该对象中的参数将覆盖最后一次请求参数。\
   * 请参考{#load}方法的configs参数。
   */
  reload(configs) {
    configs = Wb.copy(configs);
    configs.params = Wb.apply({}, this.lastParams, configs.params);
    return this.load(configs);
  }
  /** @property {Object} - 图表选项和数据。 @key */
  set option(value) {
    this.setOption(value);
  }
  /***/
  get option() {
    return this.getOption();
  }
  /**
   * 设置图表选项和数据。详见ECharts的setOption方法说明。
   * @param {...Object} options 选项和数据对象。
   */
  setOption(...options) {
    this.instance.setOption(...options);
  }
  /**
   * 获取图表选项和数据。详见ECharts的getOption方法说明。
   * @return {Object} 选项和数据。
   */
  getOption() {
    return this.instance.getOption();
  }
  /**
   * 清空图表并移除所有的组件和图表。
   */
  clear() {
    this.instance.clear();
  }
  destroy() {
    let instance = this.instance;
    instance.off();
    instance.dispose();
    super.destroy();
  }
}
/**
 * G2 该类为AntG2类的适配类，相关文档见G2文档说明。
 * @icon chart-bar
 * @lib wb/libs/g2.min.js
 * @mimic component
 */
Cls['Wb.AntG2'] = class antG2 extends Wb.Component {
  static cls = 'w-ct w-fit';
  static protos = {

  }
  /** @property {Object} options 图的配置对象。 */
  /** @property {Object} instance 图实例对象。 @code */
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    me.wrapEl = me.addEl();
    me.wrapEl.style.width = '100%';
    me.wrapEl.style.height = '100%';
    me.wrapEl.style.overflow = 'hidden';
    me.instance = new G2.Chart({
      container: me.wrapEl,
      autoFit: true
    });
    let options = Wb.copy(configs.options);
    if (configs.data) {
      options.data = undefined;
    }
    me.instance.options(options);
    me.instance.render();
  }

  setData(data) {
    this.instance.options({
      data: data || []
    });
    this.instance.render();
  }

  /** @property {Object} - 数据。 */
  set data(value) {
    this.setData(value);
  }
  /***/
  get data() {
    return this.instance.options().data || [];
  }
  /***/
  destroy() {
    this.instance.destroy();
    super.destroy();
  }
  /**
   * 清空画布。
   */
  clear() {
    this.instance.clear();
  }
}
/**
 * G6 该类为AntG6类的适配类，相关文档见G6文档说明。
 * @icon flow1
 * @lib wb/libs/g6.min.js
 * @mimic component
 */
Cls['Wb.AntG6'] = class antG6 extends Wb.Component {
  static cls = 'w-ct w-fit';
  static protos = {

  }
  /** @property {Object} options 图的配置对象。 */
  /** @property {Object} instance 图实例对象。 @code */
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    me.wrapEl = me.addEl();
    me.wrapEl.style.width = '100%';
    me.wrapEl.style.height = '100%';
    me.wrapEl.style.overflow = 'hidden';
    me.instance = new G6.Graph(Wb.apply({
      container: me.wrapEl,
      ...configs.options
    }));
    me.instance.render();
  }
  /***/
  destroy() {
    this.instance.destroy();
    super.destroy();
  }
  /**
   * 清空画布。
   */
  clear() {
    this.instance.clear();
  }
}
/**
 * S2 该类为AntS2类的适配类，相关文档见S2文档说明。
 * @icon flow1
 * @lib wb/libs/s2.min.js
 * @mimic component
 */
Cls['Wb.AntS2'] = class antS2 extends Wb.Component {
  static cls = 'w-ct w-fit';
  static protos = {

  }
  /** @property {Object} options 图的配置对象。 */
  /** @property {Object} instance 图实例对象。 @code */
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    me.wrapEl = me.addEl();
    me.instance = new S2.PivotSheet(
      me.wrapEl,
      configs.data,
      configs.options
    )
    me.instance.render();
  }
  /** @property {Object} - 数据。 */
  set data(value) {

  }
  /***/
  get data() {

  }
  /***/
  destroy() {
    this.instance.destroy();
    super.destroy();
  }
  /**
   * 清空画布。
   */
  clear() {
    this.instance.clear();
  }
}

/**
 * 图，用于绘制包括流程图在内的各类图。该类为X6 Graph类的适配类，相关文档见X6文档说明。
 * @icon flow1
 * @lib wb/libs/x6.js
 * @mimic component
 */
Cls['Wb.Graph'] = class graph extends Wb.Component {
  static cls = 'w-ct w-fit';
  static protos = {
    showGrid$: false,
    scroller$: false,
    /** @property {Boolean} - 节点默认是否可移动。可以通过设置节点data的"nodeMovable"为false禁止移动，true允许移动。 */
    nodeMovable: true
  }
  static movableNode = { nodeMovable: false };
  /**
   * 注册节点。详见Graph的registerNode方法。
   */
  static registerNode(...args) {
    X6.Graph.registerNode(...args);
  }
  /** @property {Object} graphConfigs 图的配置对象。 */
  /** @property {Object} instance 图实例对象。 @code */
  /***/
  init(configs) {
    let me = this;
    super.init(configs);
    me.wrapEl = me.addEl();
    me.instance = new X6.Graph(Wb.apply({
      container: me.wrapEl,
      autoResize: true,
      panning: true,
      interacting(cellView) {
        if (cellView.cell.getData()?.nodeMovable ?? me.nodeMovable)
          return true;
        else
          return Wb.Graph.movableNode;
      }
    }, configs.graphConfigs));
  }
  /**
   * 添加节点。详见Graph的addNode方法。
   */
  addNode(...args) {
    return this.instance.addNode(...args);
  }
  /**
   * 添加边。详见Graph的addEdge方法。
   */
  addEdge(...args) {
    return this.instance.addEdge(...args);
  }
  /** @property {Boolean} - 是否显示网格。 */
  set showGrid(value) {
    let me = this;

    if (me.showGrid$ !== value) {
      me.showGrid$ = value;
      me.instance[value ? 'showGrid' : 'hideGrid']();
    }
  }
  /***/
  get showGrid() {
    return this.showGrid$;
  }
  /** @property {Boolean} - 是否允许拖拽画布。设置为true将自动设置{#scroller}为false。 */
  set panning(value) {
    if (value)
      this.scroller = false;
    this.instance[value ? 'enablePanning' : 'disablePanning']();
  }
  /***/
  get panning() {
    return this.instance.isPannable();
  }
  /** @property {Boolean} - 是否允许滚动鼠标滚轮来缩放画布。 */
  set mousewheel(value) {
    this.instance[value ? 'enableMouseWheel' : 'disableMouseWheel']();
  }
  /***/
  get mousewheel() {
    return this.instance.isMouseWheelEnabled();
  }
  /** @property {Object} - 流程图数据。 */
  set data(value) {
    this.instance.fromJSON(value);
  }
  /***/
  get data() {
    return this.instance.toJSON();
  }
  /** @property {Boolean} snapLine 当移动的节点与其他节点对齐时，是否自动出现对齐线。 */
  set snapLine(value) {
    let me = this, plug = me.snapLinePlugin;

    if (value) {
      if (!plug) {
        plug = me.snapLinePlugin = new X6Plugin.Snapline();
        me.instance.use(plug);
      }
      plug.enable();
    } else {
      plug?.disable();
    }
  }
  /***/
  get snapLine() {
    return this?.snapLinePlugin?.isEnabled() ?? false;
  }
  /** @property {Boolean} snapLine 是否使用滚动画布功能。设置为true将自动设置{#panning}为false。 */
  set scroller(value) {
    let me = this;

    if (me.scroller$ !== value) {
      let instance = me.instance;
      me.scroller$ = value;
      if (value) {
        me.panning = false;
        if (!me.scrollerPlugin) {
          me.scrollerPlugin = new X6Plugin.Scroller();
          instance.use(me.scrollerPlugin);
        }
        instance.unlockScroller();
      } else {
        instance.lockScroller();
      }
    }
  }
  /***/
  get scroller() {
    return this.scroller$;
  }
  /**
   * 在 x、y 方向上平移画布。
   * Example:
   *
   *     graph.translate(10, 20);
   *
   * @param {Number} x x坐标。
   * @param {Number} y y坐标。
   */
  translate(x, y) {
    this.instance.translate(x, y);
  }
  /**
   * 将画布缩放级别增加或减少指定值。
   * @param {Number} level 增加或减少级别。
   */
  zoom(level) {
    this.instance.zoom(level);
  }
  /**
   * 将画布缩放级别设置为指定值。
   * @param {Number} level 级别。
   */
  zoomTo(level) {
    this.instance.zoomTo(level);
  }
  /**
   * 将画布中元素缩小或者放大一定级别，让画布正好容纳所有元素。
   * @param {Number} [maxScale] 最大级别。默认为1。
   */
  zoomToFit(maxScale) {
    maxScale ??= 1;
    this.instance.zoomToFit({ maxScale });
  }
  /**
   * 将画布中元素居中展示。
   */
  centerContent() {
    this.instance.centerContent();
  }
  /***/
  destroy() {
    this.instance.dispose();
    super.destroy();
  }
  /**
   * 清空画布。
   */
  clearCells() {
    this.instance.clearCells();
  }
}
/**
 * HTML富文本编辑器。该类为Quill的适配类，相关文档见Quill文档说明。
 * HTML富文本编辑器的相关示例见：{#%html-editor.xwl|ide?openModule=example/comps/html-editor.xwl}
 * @icon file-html
 * @lib wb/libs/quill.css, wb/libs/quill.js
 * @mimic textArea
 */
Cls['Wb.HtmlEditor'] = class htmlEditor extends Wb.Control {
  static protos = {
    toolbar$: null,
    readonly$: false,
    allowFocus: true
  };
  static configs = {
    toolbar: true
  };
  /** @property {Object} editor 编辑器实例对象。 @code */
  /** @property {Object} editorConfigs 编辑器配置对象。 */
  /**
   * @event change 值改变时触发。获得HTML值请访问{#value}属性，获得文本值请访问{#textValue}属性。
   * @param {Object} delta 新delta对象。
   * @param {Object} oldDelta 原delta对象。
   * @param {String} source source。
   */
  /**
   * @event selectionchange 选择改变时触发。
   * @param {Object} range 新delta对象。
   * @param {Object} oldRange 原delta对象。
   * @param {String} source source。
   */
  /**
   * @event editorchange 值改变a或选择改变时触发。为{#change}和{#selectionchange}事件的合并。
   * @param {String} name 事件名称。
   * @param {...Object} args 对应事件的参数列表。
   */
  /***/
  init(configs) {
    let me = this, editor;
    super.init(configs);
    me.wrapEl = me.addEl('w-input-wrap w-htmleditor');
    editor = me.editor = new Quill(me.wrapEl.addEl(),
      Wb.applyMerge({ modules: { toolbar: null }, theme: 'snow' }, configs.editorConfigs));
    editor.on('editor-change', me.editorChange.bind(me));
    me.initFontSize();
    me.mon('keydown', e => {
      // prevent enter key event
      if (e.isGoKey)
        e.stopEvent();
    });
  }
  /**
   * 初始化字体和大小。 @priv
   */
  initFontSize() {
    let me = this, font, size, fontList = [{ text: Str.default, value: 'default' }], value, whitelist = [];

    Str.fontList.splitTrim().forEach(item => {
      value = item.afterItem('=').replaceAll(' ', '-');
      fontList.push({ text: item.beforeItem('='), value });
      whitelist.push(value);
    });
    me.fontList = fontList;
    font = Quill.import('formats/font');
    font.whitelist = whitelist;
    Quill.register(font, true);
    size = Quill.import('formats/size');
    me.sizeList = [9, 10, 11, 12, 13, 14, 15, 16, 20, 28, 36, 48, 72];
    whitelist = [];
    me.sizeList.forEach(item => {
      whitelist.push('p' + item);
    });
    size.whitelist = whitelist;
    Quill.register(size, true);
  }
  /***/
  focus(preventScroll) {
    let editor = this.editor;
    if (preventScroll)
      editor.focus(this.el.preventScrollOption);
    else
      editor.focus();
  }
  /**
   * 编辑器变化时执行的方法。 @priv
   */
  editorChange(name, ...args) {
    let me = this, sel, format, isTextChange = name == 'text-change';

    if (isTextChange) {
      me.fireEvent('change', ...args);
      me.verify();
    } else {
      me.fireEvent('selectionchange', ...args);
    }
    me.fireEvent('editorchange', isTextChange ? 'change' : 'selectionchange', args);
    if (!me.toolbar$)
      return;
    sel = me.selection;
    if (!sel)
      return;
    format = me.editor.getFormat(sel);
    me.boldBtn.active = !!format.bold;
    me.italicBtn.active = !!format.italic;
    me.underlineBtn.active = !!format.underline;
    me.strikeBtn.active = !!format.strike;
    me.leftBtn.active = format.align == 'left';
    me.centerBtn.active = format.align == 'center';
    me.rightBtn.active = format.align == 'right';
    me.numberBtn.active = format.list == 'ordered';
    me.itemBtn.active = format.list == 'bullet';
    me.colorSelect.value = format.color;
    me.fontSelect.value = format.font || 'default';
    me.sizeSelect.value = format.size ? format.size.slice(1) : 14;
  }
  /** @property {Boolean} - 是否生成默认的工具条。 */
  set toolbar(value) {
    let me = this;
    if (value) {
      if (!me.toolbar$) {
        me.toolbar$ = new Wb.Toolbar({
          cname: 'toolbar', el: me.wrapEl.insertEl(0), gap: 2, plainIcon: true, owner: me, items: [
            {
              icon: 'bold', cid: 'boldBtn', tip: Str.bold, enableToggle: false, handler() {
                me.setFormat('bold', !this.active);
              }
            },
            {
              icon: 'italic', cid: 'italicBtn', tip: Str.italic, enableToggle: false, handler() {
                me.setFormat('italic', !this.active);
              }
            },
            {
              icon: 'underline', cid: 'underlineBtn', tip: Str.underline, enableToggle: false, handler() {
                me.setFormat('underline', !this.active);
              }
            },
            {
              icon: 'strikethrough', cid: 'strikeBtn', tip: Str.Strikethrough, enableToggle: false, handler() {
                me.setFormat('strike', !this.active);
              }
            },
            '-',
            {
              icon: 'align-left', cid: 'leftBtn', tip: Str.alignLeft, enableToggle: false, handler() {
                me.setFormat('align');
              }
            },
            {
              icon: 'align-center', cid: 'centerBtn', tip: Str.alignCenter, enableToggle: false, handler() {
                me.setFormat('align', 'center');
              }
            },
            {
              icon: 'align-right', cid: 'rightBtn', tip: Str.alignRight, enableToggle: false, handler() {
                me.setFormat('align', 'right');
              }
            },
            '-',
            {
              icon: 'list1', cid: 'itemBtn', tip: Str.itemList, enableToggle: false, handler() {
                me.setFormat('list', this.active ? false : 'bullet');
              }
            },
            {
              icon: 'list2', cid: 'numberBtn', tip: Str.numberList, enableToggle: false, handler() {
                me.setFormat('list', this.active ? false : 'ordered');
              }
            },
            '-',
            {
              cname: 'select', width: '12em', cid: 'fontSelect', data: me.fontList, value: 'default', editable: false,
              itemTpl: '<div style="font-family:{text}">{text}</div>', events: {
                select(data) {
                  me.setFormat('font', data.value == 'default' ? undefined : data.value);
                }
              }
            },
            {
              cname: 'select', width: '4em', cid: 'sizeSelect', noValue: true, data: me.sizeList, value: 14, editable: false,
              pickerMinWidth: 120, itemTpl: '<div style="font-size:{text}px">{text}</div>', events: {
                select(data) {
                  me.setFormat('size', data.text == 14 ? undefined : 'p' + data.text);
                }
              }
            },
            {
              cname: 'colorSelect', cid: 'colorSelect', noValue: true, width: '1.8em', defaultButton: true, events: {
                select(item) {
                  let color = item.text;
                  me.setFormat('color', color == 'default' ? undefined : color);
                }
              }
            },
            '-',
            {
              icon: 'link', tip: Str.link, handler() {
                let index = me.selection.index || 0;
                Wb.prompt({ title: Str.add + ' - ' + Str.link, icon: 'link' },
                  { cname: 'text', required: true, cid: 'link', valueType: 'url' },
                  (values, win) => {
                    let link = values.link;
                    me.editor.insertText(index, link, 'link', link);
                    win.close();
                  });
              }
            },
            {
              icon: 'image', tip: Str.image, handler() {
                Wb.selectFiles(files => {
                  let editor = me.editor;
                  editor.uploader.upload(editor.getSelection(true), files);
                }, 'image/*');
              }
            }
          ]
        });
        me.toolbar$.applyRefer(me);
      }
    } else {
      me.toolbar$?.destroy();
      me.toolbar$ = null;
    }
  }
  /** @property {Wb.Toolbar} - 工具条对象。如果未生成工具条返回null。 */
  get toolbar() {
    return this.toolbar$;
  }
  /***/
  verify() {
    let me = this;

    if (me.required || me.validator) {
      let msg = null, value = me.textValue;

      if (me.required && value === '')
        msg = Str.requiredHint;
      if (!msg && me.validator) {
        value = me.validator.call(me, value);
        if (Wb.isString(value))
          msg = value;
      }
      me.setCls(msg, 'w-invalid');
      me.errorTip = msg;
      return !msg;
    }
    return true;
  }
  /**
   * Set selection format. @priv
   * @param {Object} format Format type.
   * @param {Object} value Format value.
   */
  setFormat(format, value) {
    this.editor.format(format, value);
  }
  /** @property {Object} - 选择的范围。 */
  set selection(value) {
    this.editor.setSelection(value);
  }
  /***/
  get selection() {
    return this.editor.getSelection();
  }
  /** @property {Boolean} - 控件是否只读。 */
  set readonly(value) {
    let me = this;
    if (me.readonly$ !== value) {
      me.readonly$ = value;
      me.toolbar$?.setVisible(!value);
      if (value)
        me.editor.disable();
      else
        me.editor.enable();
    }
  }
  /***/
  get readonly() {
    return this.readonly$;
  }
  /** @property {HtmlString} - 控件的HTML值。文本值请参考{#textValue}属性。 @key */
  set value(value) {
    this.editor.clipboard.dangerouslyPasteHTML(value);
  }
  /***/
  get value() {
    return this.editor.getSemanticHTML();
  }
  /** @property {TextString} - 控件的纯文本值。HTML值请参考{#value}属性。 @key */
  set textValue(value) {
    this.editor.setText(value);
  }
  /***/
  get textValue() {
    return this.editor.getText().slice(0, -1);
  }
}
/**
 * 复选框控件，用于多项的选择，通过选中表示选择状态。
 * 复选框的相关示例见：{#%check-slider.xwl|ide?openModule=example/comps/check-slider.xwl}
 * @icon check6
 */
Cls['Wb.Check'] = class check extends Wb.Control {
  static protos = {
    /** @property {Enum} - 获取值时返回的值类型：
     * -'int': 整数值，为0或1。
     * -'string': 字符值，为"false"或"true"。
     * -'bool': 布尔值。默认值。
     */
    returnType: 'bool',
    value$: false
  };
  /** @property {Element} boxEl 盒子元素。 @readonly */
  /***/
  init(configs) {
    super.init(configs);
    this.wrapEl = this.focusEl = this.addEl('w-box-wrap');
    this.boxEl = this.wrapEl.addEl('w-box w-' + this.constructor.name + '-box');
    this.mon({
      el: this.wrapEl,
      click: this.onClick,
      keydown: this.onKeyDown
    });
  }
  /**
   * 组件点击时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onClick() {
    this.value = !this.value;
  }
  /**
   * 组件按键时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onKeyDown(e) {
    if (e.isGoKey) {
      this.value = !this.value;
      e.stopEvent();
    }
  }
  /**
   * @event change 当值发生变化时触发。
   * @param {Boolean} value 当前值。
   * @param {Boolean} oldValue 当前值。
   */
  /** @property {Boolean/Mix} - 控件值，true表示选择，false表示未选择。如果值为非布尔值将先使用{#Wb.parseBool}方法
   * 把值转换为布尔值。 @design @key */
  set value(value) {
    let me = this, oldValue = me.value$;

    value = Wb.parseBool(value);
    if (oldValue !== value) {
      let ct = me.parent?.parent;

      me.applyCls(value, 'value', 'w-' + me.constructor.name + '-checked', me.boxEl);
      me.fireEvent('change', me.value, oldValue);
      if (ct?.fireChangeEvent)
        ct.fireEvent('change');
    }
  }
  /***/
  get value() {
    let me = this, value = me.value$;
    switch (me.returnType) {
      case 'int':
        return value ? 1 : 0;
      case 'string':
        return value ? 'true' : 'false';
      default:
        return value;
    }
  }
  /** @property {String} - 复选框的标签。区别于{#text}属性，该标签为box后缀标签。 @design @key */
  set label(value) {
    if (this.label$ !== value) {
      this.label$ = value;
      if (value) {
        let boxEl = this.boxLabelEl ??= this.wrapEl.addEl('w-label');
        boxEl.textContent = value;
      } else if (this.boxLabelEl) {
        this.boxLabelEl.remove();
        delete this.boxLabelEl;
      }
    }
  }
  /***/
  get label() {
    return this.label$;
  }
}
/**
 * 单选框控件，用于单项的选择，通过选中表示选择状态。
 * 单选框的相关示例见：{#%check-slider.xwl|ide?openModule=example/comps/check-slider.xwl}
 * @icon check2
 */
Cls['Wb.Radio'] = class radio extends Wb.Check {
  /** @property {String} group 单选框控件所属的组名，同一容器下相同组名的单选框控件仅允许单个被选中。 @key */
  /** @property {Boolean} - 控件值，true表示选择，false表示未选择。 @design @key */
  set value(value) {
    let me = this, oldValue = me.value$;

    value = Wb.parseBool(value);
    if (oldValue !== value) {
      let group = me.group, parent = me.parent, ct = parent?.parent, fireChange = ct?.fireChangeEvent;

      if (value && group && parent) {
        parent.each(item => {
          if (item.group == group && item instanceof Wb.Radio && item != me)
            item.value = false;
        })
      }
      if (fireChange) {
        // ensure only checked radio can fire event change
        ct.fireChangeEvent = false;
        super.value = value;
        ct.fireChangeEvent = true;
        if (value)
          ct.fireEvent('change');
      } else {
        super.value = value;
      }
    }
  }
  /***/
  get value() {
    return super.value;
  }
  /***/
  onClick() {
    this.value = true;
  }
  /***/
  onKeyDown(e) {
    if (e.isGoKey) {
      this.value = true;
      e.stopEvent();
    }
  }
}
/**
 * 复选框组组件，用于生成多个复选框并对之进行操作。
 * @icon checks
 */
Cls['Wb.CheckGroup'] = class checkGroup extends Wb.ControlCt {
  static defaults = {
    cname: 'check'
  };
  static configs = {
    layout: 'form',
    alignContent: 'center'
  };
  static protos = {
    /** @property {Boolean} - 是否返回选择子组件{#cid}组成的数组。false返回对象，true返回数组。 */
    returnArray: false,
    /** @property {Boolean} - 获取值{#value}时，是否返回全部子组件数据。false仅返回选择的，true返回全部。 */
    returnAll: false,
    /** @property {Boolean} - 是否触发change事件。 @priv */
    fireChangeEvent: true
  };
  /**
   * @event change 容器内的check组件值变化时触发。
   */
  /** @property {Express/Object/Array} - 所有被选择的子组件的{#cid}属性/状态组成的对象或数组。如果子组件无cid属
   * 性将以其索引号替代。空对象、数组或null表示所有子组件均没有被选择。设置返回数组格式请设置{#returnArray}属性为true。
   * Example:
   *
   *     [true, false, true] //合法，值由选择状态组成
   *     ['check1', 'check3'] //合法，值由cid组成
   *     {check1: true, check3: true} //合法，值由cid选择状态组成的对象
   *     [true, 'check3'] //非法
   * @design false
   * @key
   */
  set value(value) {
    if (!value) {
      this.each(item => {
        if (item.value)
          item.value = false;
      });
    } else if (Wb.isArray(value)) {
      let isBool = Wb.isBoolean(value.firstItem);
      this.each((item, index) => {
        item.value = isBool ? (value[index] ?? false) : value.includes(item.cid$ ?? index);
      });
    } else {
      this.each((item, index) => {
        item.value = !!value[item.cid$ ?? index];
      });
    }
  }
  /***/
  get value() {
    let result, checked, returnArray = this.returnArray, returnAll = this.returnAll;

    result = returnArray ? [] : {};
    this.each((item, index) => {
      checked = item.value;
      if (returnAll || checked) {
        if (returnArray)
          result.push(returnAll ? checked : (item.cid$ ?? index));
        else
          result[item.cid$ ?? index] = checked;
      }
    });
    return result;
  }
}
/**
 * 单选框组组件，用于生成多个单选框并对之进行操作。
 * @icon radios
 */
Cls['Wb.RadioGroup'] = class radioGroup extends Wb.ControlCt {
  static defaults = {
    cname: 'radio',
    group: 'default'
  };
  static configs = {
    layout: 'form',
    alignContent: 'center'
  };
  static protos = {
    /** @property {Boolean} - 是否返回被选择的子组件的{#cid}。false返回索引号，true返回{#cid}属性。 */
    returnName: false,
    /** @property {Boolean} - 是否触发change事件。 @priv */
    fireChangeEvent: true
  };
  /**
 * @event change 容器内的check组件值变化时触发。
 */
  /** @property {Number/String} - 被选择的子组件的索引号或其{#cid}属性，具体返回类型由{#returnName}指定。如果子
   * 组件无cid属性将以其索引号替代。当所有子组件均没有被选择时，返回-1。
   * Example:
   *
   *     3 //合法，值为选择条目的索引
   *     -1/null //合法，取消选择全部
   *     radio2 //合法，值为选择条目的cid
   * @design false
   * @key
   */
  set value(value) {
    let radio;

    if (value != null && value != -1)
      radio = Wb.isNumber(value) ? this.items$[value] : this.find(value);
    if (radio)
      radio.value = true;
    else {
      this.each(item => {
        if (item.value)
          item.value = false;
      });
    }
  }
  /***/
  get value() {
    let i, j, items = this.items, item;

    j = items.length;
    for (i = 0; i < j; i++) {
      item = items[i];
      if (item.value)
        return this.returnName ? (item.cid ?? i) : i;
    }
    return -1;
  }
}
/**
 * 颜色选择组件，用于可视化地选取颜色。
 */
Cls['Wb.ColorComp'] = class colorComp extends Wb.Component {
  static cls = 'w-column w-color-comp';
  static protos = {
    /** @property {Number} - 暂停更新颜色计数。 @priv */
    suspendUpdate: 0,
    /** @property {String} - 未设置值时的初始颜色。 */
    originColor: '#194d33',
    /** @property {Boolean} - 是否显示颜色值的文本框。 */
    colorText: false,
    fullSize$: false
  };
  static configs = {
    value: null
  };
  /** @property {Wb.ColorComp} - 获取共享的颜色选择组件。 */
  static get colorComp() {
    return this.colorComp$ ??= new Wb.ColorComp({ autoDestroy: false });
  }
  /***/
  init(configs) {
    let me = this, paletteEl, bannerEl, wrapEl;

    super.init(configs);
    bannerEl = me.el.addEl('w-color-banner w-alpha-bg');
    me.colorEl = bannerEl.addEl('w-flex');
    me.oldColorEl = bannerEl.addEl('w-flex');
    if (me.colorText)
      me.valueText = new Wb.Text({
        el: bannerEl.addEl(), owner: me, textAlign: 'center', selectOnFocus: true, width: '8em', readonly: true
      });
    wrapEl = me.el.addEl('w-row w-flex');
    paletteEl = me.paletteEl = wrapEl.addEl('w-color-palette');
    paletteEl.addEl('w-color-mask1');
    paletteEl.addEl('w-color-mask2');
    me.paletteSlider = new Wb.AreaSlider({
      slideTip: false, el: paletteEl, areaBorder: 0, owner: me, events: {
        change() {
          me.updateColor();
        }
      }
    });
    me.alphaSlider = new Wb.Slider({
      slideTip: false, maxValue: 255, track: false, owner: me, vertical: true,
      cls: 'w-color-awrap', el: wrapEl.addEl('w-color-alpha w-alpha-bg'), events: {
        change() {
          me.updateColor();
        }
      }
    });
    me.hueSlider = new Wb.Slider({
      slideTip: false, maxValue: 359, track: false, owner: me, vertical: true,
      el: wrapEl.addEl('w-color-hue'), events: {
        change(value) {
          paletteEl.setStyle('background', 'rgb(' + me.hsvToRgb(value, 100, 100).join(', ') + ')');
          me.updateColor();
        }
      }
    });
  }
  /**
   * @event change 颜色值变化时触发。
   * @param {String} value 新值。6位rgb值如"#11aa33"或8位RGBA值如"#11aa33bb"。
   * @param {String} oldValue 原值。
   */
  /**
   * 更新颜色。 @priv
   */
  updateColor() {
    let me = this;

    if (me.suspendUpdate)
      return;
    let oldValue, value, rgb;
    oldValue = me.value$;
    value = me.fetchColor();
    me.colorEl.setStyle('background', value);
    if (!me.value$)
      me.oldColorEl.setStyle('background', value);
    rgb = value.substr(0, 7);
    me.alphaSlider.sliderEl.setStyle('background',
      'linear-gradient(to bottom, ' + rgb + ' 0%, ' + rgb + '00 100%)');
    me.valueText?.setValue(value);
    me.fireEvent('change', value, oldValue);
  }
  /**
   * 把hsv色转换为rgb色。 @priv
   * @param {Number} h 色调。值范围0到359。
   * @param {Number} s 饱和度。值范围0到100。
   * @param {Number} v 亮度。值范围0到100。
   * @return {Array} rgb值组成的数组。rgb值范围0到255。
   */
  hsvToRgb(h, s, v) {
    s /= 100;
    v /= 100;
    let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [f(5) * 255, f(3) * 255, f(1) * 255];
  }
  /**
   * 把rgb色转换为hsv色。 @priv
   * @param {Number} r 红。值范围0到255。
   * @param {Number} g 绿。值范围0到255。
   * @param {Number} b 蓝。值范围0到255。
   * @return {Array} hsv值组成的数组。h值范围0到359，s和v值范围0到100。
   */
  rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    let v = Math.max(r, g, b), n = v - Math.min(r, g, b);
    let h = n && ((v == r) ? (g - b) / n : ((v == g) ? 2 + (b - r) / n : 4 + (r - g) / n));
    return [60 * (h < 0 ? h + 6 : h), (v && n / v) * 100, v * 100];
  }
  /** @property {String} - 面板的RGBA颜色值。可为3位，4位，6位或8位有效值，如#1a2, #1a2b, #11aa22, #11aa22bb。 @key */
  set value(color) {
    let me = this, value;

    if (color?.startsWith('rgb'))
      color = Wb.rgbToHex(color);
    value = color ?? me.originColor;
    if (me.value$ !== value) {
      me.value$ = color;
      if (value.startsWith('#')) {
        let colorValue = value.substr(1);
        let s, i, j, hsv, k = colorValue.length, l = k > 4 ? 2 : 1, x = ['r', 'g', 'b', 'a'], c = { a: 255 };

        j = k / l;
        for (i = 0; i < j; i++) {
          k = i * l;
          s = colorValue.substr(k, l);
          if (l == 1)
            s += s;
          c[x[i]] = parseInt(s, 16);
        }
        hsv = me.rgbToHsv(c.r, c.g, c.b);
        me.suspendUpdate++;
        try {
          me.hueSlider.value = hsv[0];
          me.paletteSlider.value = [hsv[1], 100 - hsv[2]];
          me.alphaSlider.value = 255 - c.a;
        } finally {
          me.suspendUpdate--;
        }
        me.updateColor();
      }
      me.oldColorEl.setStyle('background', value);
    }
  }
  /***/
  get value() {
    return this.value$;
  }
  /**
   * 获取当前组件设置的颜色值。 @priv
   */
  fetchColor() {
    let me = this, i, color, alpha, pv = me.paletteSlider.value,
      rgb = me.hsvToRgb(me.hueSlider.value, pv[0], 100 - pv[1]);

    color = '#';
    for (i = 0; i < 3; i++)
      color += Math.round(rgb[i]).toString(16).padStart(2, '0');
    alpha = 255 - me.alphaSlider.value;
    if (alpha < 255)
      color += alpha.toString(16).padStart(2, '0');
    return color;
  }
}
/**
 * Web Socket组件，通常用于后台向前台实时推送数据。前台向后台发送数据，建议使用{#Wb.ajax}方法。该组件依赖后台
 * 服务的HTTP会话，因此如果当前用户未登录，该组件将会自动关闭。
 * Web Socket组件的相关示例见：{#%web-socket.xwl|ide?openModule=example/comps/web-socket.xwl}
 * @icon plug
 * @noDesign
 */
Cls['Wb.Socket'] = class socket extends Wb.Configurable {
  /** @property {Set} - socket实例组成的集合。 */
  static sockets = new Set();
  /**
   * 打开所有的 WebSocket 实例。
   */
  static openAll() {
    this.sockets.forEach(socket => socket.open());
  }
  /** @property {String} cid 组件标识。 @key */
  /** @property {PathString} name WebSocket名称，用于标识WebSocket。如果以".xwl"结尾，表示为模块文件，
   * 如果以"$"开头表示模块捷径，name标识为模块文件后，仅当登录后且具有访问该模块的权限时才允许建立连接。 @key */
  /** @property {PathString} xwl 当WebSocket后台接收到消息时运行的模块文件。此模式下该模块服务器端脚本可以访问
   * 以下的全局变量：
   * -data: 客户端发送的数据。
   * -event: 事件类型，"message"-消息，"open"-建立连接，"close"-关闭连接，"error"-发生错误。
   * -session: websocket会话。
   * -httpSession: 关联的HTTP会话。如果未建立HTTP会话则为null。
   * -closeReason: 关闭理由，仅当event为"close"时有效。
   * -error: 异常对象，仅当event为"error"时有效。
   * -inWSSession: 是否运行在WebSocket会话中的标识。如果该值为true表示模块运行在WebSocket会话中，发送消息给客户端可以\
   * 使用{#Wb.send|Wb-Server.send}方法。
   * @key
   */
  /** @property {String/String[]} protocols 协议字符串或者其组成的数组。 */
  static protos = {
    /** @property {Boolean} - 在创建组件后是否自动打开WebSocket。默认为true。 */
    autoOpen: true,
    /** @property {Boolean} - WebSocket 是否已经打开。 */
    opened: false,
    /** @property {Boolean} - 是否必须登录后才能建立连接。请注意该属性仅用于登录验证，如果系统允许连接，客户端仍然可以通过设置
     * 该参数为false来建立连接。禁止未登录建立连接请设置配置项"sys.session.anonymousWebsocket"为false。
     */
    loginRequired: false,
    autoReconnect$: false,
    heartbeatInterval$: -1
  };
  /***/
  ready(configs) {
    let me = this;
    super.ready(configs);
    Wb.Socket.sockets.add(me);
    if (me.autoOpen)
      me.open();
  }
  /** @property {Express/Object} params 通过WebSocket发送数据时的参数对象。 */
  /**
   * 打开当前的WebSocket组件。如果打开时发生异常，将抛出该异常。
   */
  open() {
    let me = this;

    if (!me.opened) {
      let socket, url, value, params = [];

      url = Globals.wsPrefix + '/s';
      value = me.name;
      if (value) {
        if (value.startsWith('m?xwl=') || value.endsWith('.xwl'))
          value = Wb.getModulePath(value);
        params.push('name=' + encodeURIComponent(value));
      }
      value = me.xwl;
      if (value) {
        let pos = value.indexOf('{');

        if (pos == -1) {
          value = Wb.getModulePath(value.trim());
        } else {
          value = Wb.getModulePath(value.substr(0, pos).trim()) + value.substr(pos);
        }
        params.push('xwl=' + encodeURIComponent(value));
      }
      if (me.loginRequired)
        params.push('login=1');
      Wb.each(me.params, (k, v) => {
        params.push(k + '=' + encodeURIComponent(v));
      });
      if (params.length)
        url += '?' + params.join('&');
      socket = me.socket = new WebSocket(url, me.protocols);
      socket.onclose = e => { me.onClose(e); };
      socket.onopen = e => { me.onOpen(e); };
      socket.onerror = e => { me.onError(e); };
      socket.onmessage = e => { me.onMessage(e); };
    }
  }
  /**
   * 关闭当前的WebSocket组件。
   * @param {Number} [code] 数字状态码，解释连接关闭的原因。
   * @param {String} [reason] 连接关闭的原因文本说明。
   */
  close(code, reason) {
    let me = this;
    if (me.opened) {
      me.socket.close(code, reason);
    }
  }
  /**
   * 销毁当前的WebSocket组件。该方法同{#close}方法的区别为该方法在关闭WebSocket后将移除该实例。
   */
  destroy() {
    let me = this;
    me.close();
    Wb.Socket.sockets.remove(me);
    if (me.pingTimer != null)
      clearInterval(me.pingTimer);
    if (me.reconnectTimer != null)
      clearTimeout(me.reconnectTimer);
    if (me.resetTimer != null)
      clearTimeout(me.resetTimer);
    super.destroy();
  }
  /**
   * @event close 组件关闭时触发。 @key
   * @param {Event} e 事件对象。
   */
  /**
   * @event failure 组件关闭且重新连接失败后触发。 @key
   * @param {Event} e 事件对象。
   */
  /**
   * @event open 组件打开时触发。 @key
   * @param {Event} e 事件对象。
   */
  /**
   * @event error 组件发生错误时触发。
   * @param {Event} e 事件对象。
   */
  /**
   * @event message 组件收到消息时触发。 @key
   * @param {Event} e 事件对象。
   */
  /**
   * 组件关闭时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onClose(e) {
    const connTimes = 3;
    let me = this;

    me.opened = false;
    delete me.socket;
    me.fireEvent('close', e);
    // ##开头的是强制断开
    if (me.autoReconnect && !e.reason?.startsWith('##') && me.reconnectTimes < connTimes) {
      me.reconnectTimer = setTimeout(f => me.open(), 1000 * (3 ** me.reconnectTimes));
      me.reconnectTimes++;
    } else {
      me.fireEvent('failure', e);
    }
  }
  /** @property {Boolean} - 当 WebSocket 连接由于非HTTP会话过期的原因断开后是否自动重新连接。 */
  set autoReconnect(value) {
    let me = this;

    if (me.autoReconnect$ !== value) {
      me.autoReconnect$ = value;
      if (value)
        me.reconnectTimes = 0;
    }
  }
  /***/
  get autoReconnect() {
    return this.autoReconnect$;
  }
  /** @property {Number} - 定时发送心跳消息的周期，以秒为单位。用以维持WebSocket会话。当周期到时WebSocket会自动发送
   * "ping"/"pong"的消息，这些消息系统均会自动屏蔽。小于或等0表示不发送。默认为-1。
   */
  set heartbeatInterval(value) {
    let me = this;

    if (me.heartbeatInterval$ !== value) {
      me.heartbeatInterval$ = value;
      if (me.pingTimer) {
        clearInterval(me.pingTimer);
        me.pingTimer = null;
      }
      if (me.heartbeatInterval > 0) {
        me.pingTimer = setInterval(f => {
          if (me.state == 1) {
            me.send('$$~!@ping');
          }
        }, me.heartbeatInterval * 1000);
      }
    }
  }
  /***/
  get heartbeatInterval() {
    return this.heartbeatInterval$;
  }
  /**
   * 组件打开时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onOpen(e) {
    let me = this;

    if (me.resetTimer != null) {
      clearTimeout(me.resetTimer);
      me.resetTimer = null;
    }
    // 30秒后允许再次重新连接，30秒内多次连接失败将不再连接
    if (me.autoReconnect)
      me.resetTimer = setTimeout(f => { me.reconnectTimes = 0 }, 30000);
    me.opened = true;
    me.fireEvent('open', e);
  }
  /**
   * 组件发生错误时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onError(e) {
    this.fireEvent('error', e);
  }
  /**
   * 组件收到消息时执行的方法。 @priv
   * @param {Event} e 事件对象。
   */
  onMessage(e) {
    if (e.data != '$$~!@pong') {
      this.fireEvent('message', e);
    }
  }
  /**
   * 发送数据到服务器端。该方法通过WebSocket链接使传输至服务器的数据排入队列。
   * Example:
   *
   *     WebSocket.send('Hello server');
   *
   * @param {Object} data 发送的数据。可以为字符串，ArrayBuffer，Blob和ArrayBufferView等类型数据。
   */
  send(data) {
    if (Wb.isObject(data) || Wb.isArray(data))
      data = Wb.encode(data);
    if (this.state == 1)
      this.socket.send(data);
    else
      Wb.raise(Str.wsNotOpen);
  }
  /** @property {Number} - 组件的状态。详见{#%readyState|api:WebSocket/readyState}。 */
  get state() {
    return this.socket?.readyState ?? 3; //3为已关闭
  }
}
/**
 * 模块应用类，用于定义一个模块应用。
 */
Cls['Wb.App'] = class app extends Wb.Base {
  /**
   * 模块初始化后运行的主方法，并返回应用的主组件。
   * @param {Wb.Container} ct 容器组件。模块主组件将添加到该容器下 
   * @return {Wb.Component} 主组件。如果返回组件，系统将自动把主组件添加到容器中。
   * @function main
   */
  /** @property {Object} configs 配置参数。 */
  /**
   * @event ready 在对象初始化完成之后触发。
   * @param {Object} configs 构造函数的配置参数。
   */
  /**
   * 构造函数结束执行时执行的方法。可以重载该方法执行初始化完成后相关的操作。
   * @param {Object} configs 构造函数的配置参数。
   * @priv
   * @function ready
   */
  /** @property {Wb.Component} mainCt 在main方法内返回的主组件。通常添加到上下文容器中。 */
  /**
   * 构造器方法。
   * @param {Wb.Container/Boolean} [container] 把应用主组件添加到该容器中。false不添加，缺省将把应用主组件
   * 渲染到{#globalThis.BodyEl}。
   * @param {Object} [configs] 配置参数。将直接设置到{#configs}属性。
   */
  constructor(container, configs) {
    let mainCt;

    super();
    this.configs = configs;
    mainCt = this.mainCt = this.main?.(container);
    if (mainCt && container !== false) {
      if (container)
        container.add(mainCt);
      else if (!mainCt.el.isConnected)
        BodyEl.insertBefore(mainCt.el, BodyEl.firstChild);
    }
    this.ready?.(configs);
    this.fireEvent('ready', configs);
  }
}
/**
 * 数组，下级组件将添加到数组内。该组件作为上级组件的属性，其{#cid}为属性名称。
 * 该类仅用于IDE中对模块进行设计。
 * @icon array
 * @noDesign
 */
Cls['Wb.Array'] = class array {
  /** @property {String} cid 数组标识。通常作为上级组件的属性名。 @key */
  /** @property {String} description 描述和说明。 */
}
/**
 * 脚本组件，用于自定义脚本。
 * 该类仅用于IDE中对模块进行设计。
 * @icon file-json
 * @noDesign
 */
Cls['Wb.Script'] = class script {
  /** @property {String} cid 脚本标识。 @key */
  /** @property {Boolean} isProperty 标识该组件是否作为上级组件的属性，其{#cid}属性为属性名称。 */
  /** @property {String} description 描述和说明。 */
  /** @property {Object} script 输出到上下文的任意JavaScript脚本，通常为对象脚本。 @key */
}
/**
 * 图标字符串，同String。更多信息请参考{#String}。
 * @class IconString
 */
/**
 * 图片图标字符串，同String。更多信息请参考{#String}。
 * @class ImgString
 */
/**
 * HTML脚本类，同String。更多信息请参考{#String}。
 * @class HtmlString
 */
/**
 * 用于定义一个模块。模块为具有独立命名空间的闭包。在模块的{#serverScript}属性中可以进行服务器端的脚本编程，
 * 当模块被调用时这些脚本会被执行。{#initialize}为客户端初始化事件，除了可以进行客户端处理化，还可以定义客
 * 户端的模块内的公共方法和属性。
 * 当一个模块被调用时，会先执行{#serverScript}属性中定义的服务器端脚本，然后再返回客户端脚本交由浏览器运行。
 * 该类仅用于IDE中对模块进行设计。
 * @icon module
 */
Cls['Wb.Module'] = class module {
  /** @property {TextString} description 对模块的详细描述。 */
  /** @property {String} remark 对模块的简要备注。 */
  /** @property {Enum} moduleType 模块面向客户端的类型：
   * -'desktop': 面向桌面。
   * -'touch': 面向移动触摸设备。
   * -'any': 适配任何类型。默认值。
   */
  /** @property {Function} serverScript 服务器端运行的脚本。在请求模块或运行模块时系统将在服务器端自动运行该脚本。 @key */
  /** @property {String} title 模块标题。 */
  /** @property {Boolean/String} theme 指定使用的界面主题名称。true表示"classic", false表示"dark"。 */
  /** @property {String} cid 模块标识。 @key */
  /** @property {String} cls 添加到组件的{#globalThis.BodyEl}元素标签的以空格分隔的多个样式类名。 */
  /** @property {String} style 添加到组件{#globalThis.BodyEl}元素标签的以分号分隔的多个样式。 */
  /** @property {String} bodyTag 添加到组件{#globalThis.BodyEl}元素标签的任意脚本。 */
  /** @property {String[]} links 模块运行前加载的资源链接列表，这些资源包括js和css资源。 @key */
  /** @property {Boolean} loginRequired 访问模块前是否必须登录及验证权限。 @key */
  /** @property {String} language 使用的语言。缺省表示使用系统设置。 */
  /** @property {Boolean} obfuscate 压缩文件时是否混淆加密代码。当需要保护该模块代码时可设置该属性为true。 */
  /** @property {HtmlString} head 输出到页面header节点内的头信息。 */
  /**
   * @event beforeunload 在模块关闭之前触发，返回false可阻止关闭。
   */
  /**
   * @event initialize 模块加载之前运行的自定义客户端脚本。模块内的公共方法和属性可在此定义。 @key
   */
  /**
   * @event finalize 模块加载之后运行的自定义客户端脚本。
   */
}
/**
 * Xwl模块组件，表示静态引用一个Xwl模块，该模块在执行后，其客户端脚本将嵌入到该组件。
 * @icon module
 * @noDesign
 */
Cls['Wb.Xwl'] = class xwl {
  /** @property {String} cid Xwl组件标识。 @key */
  /** @property {PathString} path 模块文件相对路径。 @key */
  /** @property {String} remark 对模块的简要备注。 */
  /** @property {Object} params 参数对象，传递到模块的"parentParams"变量。 */
  /** @property {Object} container 包裹Xwl模块容器{#Wb.Container}的配置对象。 */
  /**
   * @property {Function} ready 在对象实例化完成后触发。this指向包裹模块的容器对象。
   * @param {Object} scope 组件指向模块的app对象。
   * @param {Wb.Container} container 包裹模块的容器对象。
   */
}
/**
 * 双向选择器。用于在可选列表中选择条目。
 * 双向选择器的相关示例见：{#%dual-box.xwl|ide?openModule=example/comps/dual-box.xwl}
 * @icon dual-box
 */
Cls['Wb.DualBox'] = class dualBox extends Wb.Panel {
  static protos = {
    /** @property {Boolean} - 是否自动加载表格数据。默认为false。 */
    autoLoad: true,
    /** @property {String} - 当{#searchBar}搜索时传递的参数名称，默认为"search"。 */
    searchName: 'search',
    /** @property {String} - 文本字段名称。 */
    textField: 'text',
    /** @property {String} - 副文本字段名称。 */
    subtextField: 'subtext'
  }
  static configs = {
    layout: 'row',
    gap: '.5em'
  };
  /** @property {String} sourceUrl 源表格的url地址。 @key */
  /** @property {String} destUrl 目标表格的url地址。 @key */
  /** @property {Wb.Column[]} columns 表格列数组。 @key */
  /** @property {Wb.Grid} sourceGridConfigs 源表格配置对象。 */
  /** @property {Wb.Grid} destGridConfigs 目标表格配置对象。 */
  /***/
  init(configs) {
    let me = this, dropId = Wb.getId(), columns, autoLoad = me.autoLoad, searchName = me.searchName,
      sourceConfigs = me.sourceGridConfigs, destConfigs = me.destGridConfigs, textField = me.textField,
      subtextField = me.subtextField;

    super.init(configs);
    columns = me.columns ?? [{ rowNum: true }, { fieldName: textField, width: -1 }];
    me.add([
      Wb.applyMerge({
        cname: 'grid', cid: 'sourceGrid', header: false, draggable: { autoDrop: false }, droppable: dropId,
        flex: 1, autoLoad: false, multiSelect: true, pagingBar: me.sourceUrl || sourceConfigs?.url,
        url: me.sourceUrl, autoLoad, textField, subtextField, tbar: {
          cname: 'text', cid: 'search', noValue: true, placeholder: Str.search, icon: 'search',
          clearButton: true, visible: false, events: {
            change() {
              me.sourceGrid.delayReload({ keepPageIndex: false, params: { [searchName]: this.value } });
            }
          }
        }, columns, events: {
          itemdblclick() {
            me.doMove('source');
          },
          itemdrop(d) {
            if (d.source[0].view == d.dest.view)
              d.acceptDrop();
            else
              me.doMove('source');
          },
          add() {
            me.incBtn.disabled = me.incAllBtn.disabled = false;
          },
          remove() {
            me.incBtn.disabled = me.incAllBtn.disabled = !this.items.length;
          }
        }
      }, sourceConfigs),
      {
        cname: 'container', layout: 'vcenter', gap: '.5em', cls: 'w-padding-tb', defaults: {
          cname: 'button'
        },
        items: [
          { icon: 'right2', cid: 'incBtn', disabled: true, handler() { me.doMove('source') } },
          { icon: 'right3', cid: 'incAllBtn', disabled: true, handler() { me.doMove('sourceAll') } },
          { icon: 'left2', cid: 'decBtn', disabled: true, handler() { me.doMove('dest') } },
          { icon: 'left3', cid: 'decAllBtn', disabled: true, handler() { me.doMove('destAll') } },
        ]
      },
      Wb.applyMerge({
        cname: 'grid', cid: 'destGrid', header: false, draggable: { autoDrop: false }, droppable: dropId,
        flex: 1, autoLoad: false, multiSelect: true, pagingBar: me.destUrl || destConfigs?.url,
        url: me.destUrl, autoLoad, textField, subtextField, tbar: {
          cname: 'text', cid: 'search', noValue: true, placeholder: Str.searh, icon: 'search',
          clearButton: true, visible: false, events: {
            change() {
              me.destGrid.delayReload({ keepPageIndex: false, params: { [searchName]: this.value } });
            }
          }
        }, columns, events: {
          itemdblclick() {
            me.doMove('dest');
          },
          itemdrop(d) {
            if (d.source[0].view == d.dest.view)
              d.acceptDrop();
            else
              me.doMove('dest');
          },
          add() {
            me.decBtn.disabled = me.decAllBtn.disabled = false;
          },
          remove() {
            me.decBtn.disabled = me.decAllBtn.disabled = !this.items.length;
          }
        }
      }, destConfigs),
    ]);
    this.applyRefer();
  }
  /** @property {String} moveType 移动类型。
   * -'source': 把源表格选择的记录移动到目标表格
   * -'sourceAll': 把源表格选择的所有记录移动到目标表格
   * -'dest': 把目标表格选择的记录移动到源表格
   * -'destAll': 把目标表格选择的所有记录移动到源表格 
   * @priv
   */
  /**
   * @event beforemove 在移动之前出发，返回false可以阻止默认的移动行为。当移动前需要异步操作时，可以返回false，并在
   * 异步操作完成后调用{#acceptMove}方法，以完成移动操作。 @key
   * @param {Array} items 拖动的记录列表。
   * @param {Boolean} include 是否为包含，true包含，false排除。
   */
  /**
   * 执行移动操作。 @priv
   * @param {String} type 移动的类型。详见{#moveType}。
   */
  doMove(type) {
    let me = this, items, include, sourceGrid;

    me.moveType = type;
    include = type.startsWith('source');
    sourceGrid = include ? me.sourceGrid : me.destGrid;
    me.moveItems = type.endsWith('All') ? sourceGrid.items.copy() : sourceGrid.selections;
    items = me.moveItems.map(item => item.data);
    if (me.fireEvent('beforemove', items, include) !== false) {
      me.acceptMove();
    }
  }
  /**
   * 接受移动操作。
   */
  acceptMove() {
    let me = this, moveType = me.moveType, sourceGrid, destGrid, sels, candidate, pagingBar;

    if (moveType.startsWith('source')) {
      sourceGrid = me.sourceGrid;
      destGrid = me.destGrid;
    } else {
      sourceGrid = me.destGrid;
      destGrid = me.sourceGrid;
    }
    candidate = sourceGrid.candidateSelection;
    sels = me.moveItems;
    delete me.moveItems
    sels = destGrid.add(sels);
    candidate?.selectNoFocus();
    if (sels.length) {
      destGrid.selections = sels;
      destGrid.scrollToBottom();
    }
    pagingBar = sourceGrid.pagingBar;
    if (pagingBar) {
      sourceGrid.total -= sels.length;
      pagingBar.updateInfo();
    }
    pagingBar = destGrid.pagingBar;
    if (pagingBar) {
      destGrid.total += sels.length;
      pagingBar.updateInfo();
    }
  }
  /** @property {Array} - 源表格的{#data}。 @key */
  set sourceData(value) {
    this.sourceGrid.data = value;
  }
  /***/
  get sourceData() {
    return this.sourceGrid.data;
  }
  /** @property {Array} - 目标表格的{#data}。 @key */
  set destData(value) {
    this.destGrid.data = value;
  }
  /***/
  get destData() {
    return this.destGrid.data;
  }
  /** @property {Array} - 目标表格的{#data}。同{#destData}属性。 */
  set value(value) {
    this.destData = value;
  }
  /***/
  get value() {
    return this.destData;
  }
  /** @property {Boolean} - 搜索框是否可见。当搜索时将向表格传递{#searchName#}指定名称的参数。 */
  set searchBar(value) {
    this.sourceGrid.tbar[0].visible = value;
    this.destGrid.tbar[0].visible = value;
  }
  /***/
  get searchBar() {
    return this.sourceGrid.tbar[0].visible;
  }
  /** @property {Boolean} - 表格的表头是否可见。 */
  set gridHeader(value) {
    this.sourceGrid.header = value;
    this.destGrid.header = value;
  }
  /***/
  get gridHeader() {
    return this.sourceGrid.header;
  }
}

/**
 * 组织架构选择器。
 * @icon combo
 */
// Cls['Gt.OrgSelect'] = class OrgSelect extends Wb.Select {
//   static protos = {
//     /** @property {Boolean} - 获取组件值时，如果父节点被选中，是否仅获取父节点的值。默认为true。 */
//     parentValueOnly: true
//   };
//   static configs = {
//     tagWrap: true,
//     treePicker: true,
//     valueField: "sid",
//     url: "",
//     textField: "text",
//     tagWidth: "70%",
//     clearButton: true,
//     maxHeight: "10em",
//     tagSortable: true,
//     multiSelect: true
//   };
//   /***/
//   ready(configs) {
//     let me = this, picker;

//     super.ready(configs);
//     picker = me.instancePicker();
//     picker.headers = {
//       cname: 'toolbar', defaults: { flex: 1 }, items: [
//         { text: '全选', handler(e) { me.selectNodes(true, e); } },
//         { icon: '反选', handler(e) { me.reverseSelect(e); } }
//       ]
//     };
//   }
//   /**
//    * 选择节点。
//    * @param {Boolean} [selectAll] true全选，false反选。
//    * @param {Event} [e] 事件对象。
//    */
//   selectNodes(selectAll, e) {
//     let me = this, oldValue = me.value;

//     me.picker.cascade(item => me.handleSelect(item, e, selectAll));
//     me.alignPicker();
//     me.fireEvent('change', me.value, oldValue);
//     me.fireEvent('action');
//   }
//   /**
//    * 反选节点。
//    * @param {Event} [e] 事件对象。
//    */
//   reverseSelect(e) {
//     let me = this, oldValue = super.value;

//     me.picker.cascade(item => me.handleSelect(item, e, !oldValue.find(t => item.data$.sid == t.sid)));
//     me.alignPicker();
//     me.fireEvent('change', me.value, oldValue);
//     me.fireEvent('action');
//   }
//   /***/
//   set value(value) {
//     super.value = value;
//   }
//   /***/
//   get value() {
//     let me = this;

//     if (me.useTag) {
//       if (me.multiSelect) {
//         let vals = me.tagCt?.items.pluck('itemData') ?? [], parentNodes = [], nodeData;
//         if (me.parentValueOnly) {
//           me.picker.cascade(node => {
//             if (nodeData = vals.find(val => val.sid == node.data.sid)) {
//               parentNodes.pushIf(nodeData);
//               return null;
//             }
//           });
//           return parentNodes;
//         } else {
//           return vals;
//         }
//       } else
//         return me.tagCt?.firstItem?.itemData ?? null;
//     } else {
//       return me.rawValue ?? me.getListValue(true);
//     }
//   }

// }
/**
 * 组织架构选择器。
 * @icon combo
 */
Cls['Gt.OrgSelect'] = class OrgSelect extends Wb.Select {
  static protos = {
    /** @property {Boolean} - 获取组件值时，如果父节点被选中，是否仅获取父节点的值。默认为true。 */
    parentValueOnly: true,
    addFolder: true,
  };
  static configs = {
    tagWrap: true,
    treePicker: true,
    valueField: "sid",
    url: "",
    textField: "text",
    tagWidth: "70%",
    clearButton: true,
    maxHeight: "10em",
    tagSortable: true,
    multiSelect: true
  };
  /***/
  ready(configs) {
    let me = this, picker;
    super.ready(configs);
    picker = me.instancePicker();
    picker.headers = {
      cname: 'toolbar', defaults: { flex: 1 }, items: [
        { text: '全选', handler(e) { me.selectNodes(me.addFolder, true, e); } }
      ]
    };
  }
  /**
   * 选择节点。
   * @param {Boolean} [selectAll] true全选，false反选。
   * @param {Event} [e] 事件对象。
   */
  selectNodes(addFolder, selectAll, e) {
    let me = this, oldValue = me.value;
    if (addFolder) {
      me.picker.cascade(item => me.handleSelect(item, e, selectAll));
    } else {
      me.picker.each(item => me.handleSelect(item, e, selectAll));
    }
    me.alignPicker();
    me.fireEvent('change', me.value, oldValue);
    me.fireEvent('action');
  }
  /***/
  set value(value) {
    super.value = value;
  }
  /***/
  get value() {
    let me = this;

    if (me.useTag) {
      if (me.multiSelect) {
        let vals = me.tagCt?.items.pluck('itemData') ?? [], allvals = [], parentNodes = [], nodeData;
        me.picker.cascade(node => allvals.push(node));
        if (vals.length == allvals.length) return -1;
        if (me.parentValueOnly) {
          me.picker.cascade(node => {
            if (nodeData = vals.find(val => val.sid == node.data.sid)) {
              parentNodes.pushIf(nodeData);
            }
          });
          return parentNodes;
        } else {
          return vals;
        }
      } else
        return me.tagCt?.firstItem?.itemData ?? null;
    } else {
      return me.rawValue ?? me.getListValue(true);
    }
  }
}
/**
 * 双向选择器。用于在可选列表中选择条目。
 * 双向选择器的相关示例见：{#%dual-box.xwl|ide?openModule=example/comps/dual-box.xwl}
 * @icon dual-box
 */
Cls['GT.DualTreeBox'] = class dualTreeBox extends Wb.Panel {
  static protos = {
    /** @property {Boolean} - 是否自动加载表格数据。默认为false。 */
    autoLoad: true,
    /** @property {String} - 当{#searchBar}搜索时传递的参数名称，默认为"search"。 */
    searchName: 'search',
    /** @property {String} - 文本字段名称。 */
    textField: 'text',
    /** @property {String} - 副文本字段名称。 */
    subtextField: 'subtext'
  }
  static configs = {
    layout: 'row',
    gap: '.5em'
  };
  /** @property {String} sourceUrl 源表格的url地址。 @key */
  /** @property {String} destUrl 目标表格的url地址。 @key */
  /** @property {Wb.Column[]} columns 表格列数组。 @key */
  /** @property {Wb.Tree} sourceTreeConfigs 源表格树配置对象。 */
  /** @property {Wb.Grid} destGridConfigs 目标表格配置对象。 */
  /***/
  init(configs) {
    let me = this, dropId = Wb.getId(), columns, autoLoad = me.autoLoad, searchName = me.searchName,
      sourceConfigs = me.sourceTreeConfigs, destConfigs = me.destGridConfigs, textField = me.textField,
      subtextField = me.subtextField, columnsTree;

    super.init(configs);
    columns = me.columns ?? [{ rowNum: true }, { fieldName: textField, width: -1 }];
    columnsTree = me.columnsTree ?? [{ fieldName: textField, width: -1, expander: true }];
    me.add([
      Wb.applyMerge({
        cname: 'tree', cid: 'sourceTree', header: false,
        flex: 1, autoLoad: false, multiSelect: true,
        url: me.sourceUrl, autoLoad, textField, subtextField, tbar: {
          cname: 'text', cid: 'search', noValue: true, placeholder: Str.search, icon: 'search',
          clearButton: true, visible: false, events: {
            change() {
              me.sourceTree.delayReload({ keepPageIndex: false, params: { [searchName]: this.value } });
            }
          }
        }, columns: columnsTree, events: {
          itemdblclick() {
            me.doMove('source');
          },
          itemdrop(d) {
            if (d.source[0].view == d.dest.view)
              d.acceptDrop();
            else
              me.doMove('source');
          },
          add() {
            me.incBtn.disabled = false;
          },
          remove() {
            me.incBtn.disabled = !this.items.length;
          }
        }
      }, sourceConfigs),
      {
        cname: 'container', layout: 'vcenter', gap: '.5em', cls: 'w-padding-tb', defaults: {
          cname: 'button'
        },
        items: [
          { icon: 'right2', cid: 'incBtn', disabled: true, handler() { me.doMove('source') } },
          { icon: 'left2', cid: 'decBtn', disabled: true, handler() { me.doMove('dest') } },
        ]
      },
      Wb.applyMerge({
        cname: 'grid', cid: 'destGrid', header: false, draggable: { autoDrop: false }, droppable: dropId,
        flex: 1, autoLoad: false, multiSelect: true, pagingBar: false,
        textField, subtextField, tbar: {
          // cname: 'text', cid: 'search', noValue: true, placeholder: Str.search, icon: 'search',
          // clearButton: true, visible: false, events: {
          //   change() {
          //     me.destGrid.delayReload({ keepPageIndex: false, params: { [searchName]: this.value } });
          //   }
          // }
        }, columns, events: {
          itemdblclick() {
            me.doMove('dest');
          },
          itemdrop(d) {
            if (d.source[0].view == d.dest.view)
              d.acceptDrop();
            else
              me.doMove('dest');
          },
          add() {
            me.decBtn.disabled = false;
          },
          remove() {
            me.decBtn.disabled = !this.items.length;
          }
        }
      }, destConfigs),
    ]);
    this.applyRefer();
  }
  /** @property {String} moveType 移动类型。
   * -'source': 把源表格选择的记录移动到目标表格
   * -'sourceAll': 把源表格选择的所有记录移动到目标表格
   * -'dest': 把目标表格选择的记录移动到源表格
   * -'destAll': 把目标表格选择的所有记录移动到源表格 
   * @priv
   */
  /**
   * @event beforemove 在移动之前出发，返回false可以阻止默认的移动行为。当移动前需要异步操作时，可以返回false，并在
   * 异步操作完成后调用{#acceptMove}方法，以完成移动操作。 @key
   * @param {Array} items 拖动的记录列表。
   * @param {Boolean} include 是否为包含，true包含，false排除。
   */
  /**
   * 执行移动操作。 @priv
   * @param {String} type 移动的类型。详见{#moveType}。
   */
  doMove(type) {
    let me = this, items, include, sourceTree;

    me.moveType = type;
    include = type.startsWith('source');
    sourceTree = include ? me.sourceTree : me.destGrid;
    me.moveItems = sourceTree.selections.filter(item => !item.data._fixed);
    items = me.moveItems.map(item => item.data);
    if (me.fireEvent('beforemove', items, include) !== false) {
      me.acceptMove();
    }
  }
  /**
   * 接受移动操作。
   */
  acceptMove() {
    let me = this, moveType = me.moveType, sourceTree, destGrid, sels, candidate, allSid;
    if (moveType.startsWith('source')) {
      sourceTree = me.sourceTree;
      destGrid = me.destGrid;
      candidate = sourceTree.candidateSelection;
      sels = me.moveItems;
      allSid = destGrid.data.map(node => node.sid);
      sels = sels.filter(i => {
        if (!allSid.includes(i.data.sid)) {
          return i;
        }
      });
      delete me.moveItems;
      if (sels.length) {
        sels = destGrid.addData(sels?.pluck('data'));
        candidate?.selectNoFocus();
        destGrid.selections = sels;
        destGrid.scrollToBottom();
      } else {
        candidate?.selectNoFocus();
      }
    } else {
      destGrid = me.destGrid;
      sels = me.moveItems;
      delete me.moveItems;
      destGrid.delRecords();
      if (sels.length) {
        destGrid.selections = sels;
        destGrid.scrollToBottom();
      }
    }
  }
  /** @property {Array} - 源表格的{#data}。 @key */
  set sourceData(value) {
    this.sourceTree.data = value;
  }
  /***/
  get sourceData() {
    return this.sourceTree.data;
  }
  /** @property {Array} - 目标表格的{#data}。 @key */
  set destData(value) {
    this.destGrid.data = value;
  }
  /***/
  get destData() {
    return this.destGrid.data;
  }
  /** @property {Array} - 目标表格的{#data}。同{#destData}属性。 */
  set value(value) {
    this.destData = value;
  }
  /***/
  get value() {
    return this.destData;
  }
  /** @property {Boolean} - 搜索框是否可见。当搜索时将向表格传递{#searchName#}指定名称的参数。 */
  set searchBar(value) {
    this.sourceTree.tbar[0].visible = value;
    this.destGrid.tbar[0].visible = value;
  }
  /***/
  get searchBar() {
    return this.sourceTree.tbar[0].visible;
  }
  /** @property {Boolean} - 表格的表头是否可见。 */
  set gridHeader(value) {
    this.sourceTree.header = value;
    this.destGrid.header = value;
  }
  /***/
  get gridHeader() {
    return this.sourceTree.header;
  }
}

/**
 * 双向选择器Check版。用于在可选列表中选择条目。
 * 双向选择器的相关示例见：{#%dual-box.xwl|ide?openModule=example/comps/dual-box.xwl}
 * @icon dual-box
 */
Cls['GT.DualTreeCheckBox'] = class dualTreeCheckBox extends Wb.Panel {
  static protos = {
    /** @property {Boolean} - 是否自动加载表格数据。默认为false。 */
    autoLoad: true,
    /** @property {String} - 当{#searchBar}搜索时传递的参数名称，默认为"search"。 */
    searchName: 'search',
    /** @property {String} - 文本字段名称。 */
    textField: 'text',
    /** @property {String} - 副文本字段名称。 */
    subtextField: 'subtext'
  }
  static configs = {
    layout: 'row',
    gap: '.5em'
  };
  /** @property {String} sourceUrl 源表格的url地址。 @key */
  /** @property {String} destUrl 目标表格的url地址。 @key */
  /** @property {Wb.Column[]} columns 表格列数组。 @key */
  /** @property {Wb.Tree} sourceTreeConfigs 源表格树配置对象。 */
  /** @property {Wb.Grid} destGridConfigs 目标表格配置对象。 */
  /***/
  init(configs) {
    let me = this, dropId = Wb.getId(), columns, autoLoad = me.autoLoad, searchName = me.searchName,
      sourceConfigs = me.sourceTreeConfigs, destConfigs = me.destGridConfigs, textField = me.textField,
      subtextField = me.subtextField, columnsTree;

    super.init(configs);
    columns = me.columns ?? [{ rowNum: true }, { fieldName: textField, width: -1 }];
    columnsTree = me.columnsTree ?? [{ fieldName: textField, width: -1, expander: true }];
    me.add([
      Wb.applyMerge({
        cname: 'tree', cid: 'sourceTree', header: false,
        flex: 1, autoLoad: false, multiSelect: true,
        url: me.sourceUrl, autoLoad, textField, subtextField, tbar: {
          cname: 'text', cid: 'search', noValue: true, placeholder: Str.search, icon: 'search',
          clearButton: true, visible: false, events: {
            change() {
              me.sourceTree.delayReload({ keepPageIndex: false, params: { [searchName]: this.value } });
            }
          }
        }, columns: columnsTree, events: {
          itemdblclick() {
            me.doMove('source');
          },
          itemdrop(d) {
            if (d.source[0].view == d.dest.view)
              d.acceptDrop();
            else
              me.doMove('source');
          },
          add() {
            me.incBtn.disabled = false;
          },
          remove() {
            me.incBtn.disabled = !this.items.length;
          }
        }
      }, sourceConfigs),
      {
        cname: 'container', layout: 'vcenter', gap: '.5em', cls: 'w-padding-tb', defaults: {
          cname: 'button'
        },
        items: [
          { icon: 'right2', cid: 'incBtn', disabled: true, handler() { me.doMove('source') } },
          { icon: 'left2', cid: 'decBtn', disabled: true, handler() { me.doMove('dest') } },
        ]
      },
      Wb.applyMerge({
        cname: 'tree', cid: 'destGrid', header: false, draggable: { autoDrop: false }, droppable: dropId,
        flex: 1, autoLoad: false, multiSelect: true, pagingBar: false,
        textField, subtextField, tbar: {
          // cname: 'text', cid: 'search', noValue: true, placeholder: Str.search, icon: 'search',
          // clearButton: true, visible: false, events: {
          //   change() {
          //     me.destGrid.delayReload({ keepPageIndex: false, params: { [searchName]: this.value } });
          //   }
          // }
        }, columns, events: {
          itemdblclick() {
            me.doMove('dest');
          },
          itemdrop(d) {
            if (d.source[0].view == d.dest.view)
              d.acceptDrop();
            else
              me.doMove('dest');
          },
          add() {
            me.decBtn.disabled = false;
          },
          remove() {
            me.decBtn.disabled = !this.items.length;
          }
        }
      }, destConfigs),
    ]);
    this.applyRefer();
  }
  /** @property {String} moveType 移动类型。
   * -'source': 把源表格选择的记录移动到目标表格
   * -'sourceAll': 把源表格选择的所有记录移动到目标表格
   * -'dest': 把目标表格选择的记录移动到源表格
   * -'destAll': 把目标表格选择的所有记录移动到源表格 
   * @priv
   */
  /**
   * @event beforemove 在移动之前出发，返回false可以阻止默认的移动行为。当移动前需要异步操作时，可以返回false，并在
   * 异步操作完成后调用{#acceptMove}方法，以完成移动操作。 @key
   * @param {Array} items 拖动的记录列表。
   * @param {Boolean} include 是否为包含，true包含，false排除。
   */
  /**
   * 执行移动操作。 @priv
   * @param {String} type 移动的类型。详见{#moveType}。
   */
  doMove(type) {
    let me = this, items, include, sourceTree;

    me.moveType = type;
    include = type.startsWith('source');
    sourceTree = include ? me.sourceTree : me.destGrid;
    // me.moveItems = sourceTree.selections.filter(item => !item.data._fixed);
    me.moveItems = sourceTree.checkedNodes.filter(item => !item.data._fixed);
    items = me.moveItems.map(item => item.data);
    if (me.fireEvent('beforemove', items, include) !== false) {
      me.acceptMove();
    }
  }
  /**
   * 接受移动操作。
   */
  acceptMove() {
    let me = this, moveType = me.moveType, sourceTree, destGrid, sels, candidate, allSid;
    if (moveType.startsWith('source')) {
      sourceTree = me.sourceTree;
      destGrid = me.destGrid;
      candidate = sourceTree.candidateSelection;
      sels = me.moveItems;
      me.moveItems
      allSid = destGrid.data.map(node => node.sid);
      sels = sels.filter(i => {
        if (!allSid.includes(i.data.sid)) {
          return i;
        }
      });
      for (var i = 0; i < me.moveItems.length; i++) {
        var tmpItems = me.moveItems[i];
        tmpItems.data._checked = false;
      }

      delete me.moveItems;
      if (sels.length) {
        sels = destGrid.addData(sels?.pluck('data'));
        candidate?.selectNoFocus();
        // destGrid.selections = sels;
        destGrid.scrollToBottom();
      } else {
        candidate?.selectNoFocus();
      }
    } else {
      destGrid = me.destGrid;
      sels = me.moveItems;
      delete me.moveItems;
      // destGrid.delRecords();
      sels.forEach(item => item.destroy());
      if (sels.length) {
        // destGrid.selections = sels;
        destGrid.scrollToBottom();
      }
    }
  }
  /** @property {Array} - 源表格的{#data}。 @key */
  set sourceData(value) {
    this.sourceTree.data = value;
  }
  /***/
  get sourceData() {
    return this.sourceTree.data;
  }
  /** @property {Array} - 目标表格的{#data}。 @key */
  set destData(value) {
    this.destGrid.data = value;
  }
  /***/
  get destData() {
    return this.destGrid.data;
  }
  /** @property {Array} - 目标表格的{#data}。同{#destData}属性。 */
  set value(value) {
    this.destData = value;
  }
  /***/
  get value() {
    return this.destData;
  }
  /** @property {Boolean} - 搜索框是否可见。当搜索时将向表格传递{#searchName#}指定名称的参数。 */
  set searchBar(value) {
    this.sourceTree.tbar[0].visible = value;
    this.destGrid.tbar[0].visible = value;
  }
  /***/
  get searchBar() {
    return this.sourceTree.tbar[0].visible;
  }
  /** @property {Boolean} - 表格的表头是否可见。 */
  set gridHeader(value) {
    this.sourceTree.header = value;
    this.destGrid.header = value;
  }
  /***/
  get gridHeader() {
    return this.sourceTree.header;
  }
}
Wb.finalize();