(function(){
	var ua = window.navigator.userAgent;

	var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
	    ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
	    ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
	    iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

	var transitUrl = 'http://qlife.qq.com/jump.html';

	if(!android && !iphone && !ipod && !ipad){
		location.replace(transitUrl + '?target_url=' + encodeURIComponent(location.href));
	}
})();;//     Zepto.js
//     (c) 2010-2014 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
    document = window.document,
    elementDisplay = {}, classCache = {},
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,
    capitalRE = /([A-Z])/g,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    simpleSelectorRE = /^[\w-]*$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div'),
    propMap = {
      'tabindex': 'tabIndex',
      'readonly': 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      'maxlength': 'maxLength',
      'cellspacing': 'cellSpacing',
      'cellpadding': 'cellPadding',
      'rowspan': 'rowSpan',
      'colspan': 'colSpan',
      'usemap': 'useMap',
      'frameborder': 'frameBorder',
      'contenteditable': 'contentEditable'
    },
    isArray = Array.isArray ||
      function(object){ return object instanceof Array }

  zepto.matches = function(element, selector) {
    if (!selector || !element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
  }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    var dom, nodes, container

    // A special case optimization for a single tag
    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

    if (!dom) {
      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
      if (!(name in containers)) name = '*'

      container = containers[name]
      container.innerHTML = '' + html
      dom = $.each(slice.call(container.childNodes), function(){
        container.removeChild(this)
      })
    }

    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }

    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. Note that `__proto__` is not supported on Internet
  // Explorer. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    dom = dom || []
    dom.__proto__ = $.fn
    dom.selector = selector || ''
    return dom
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    var dom
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // Optimize for string selectors
    else if (typeof selector == 'string') {
      selector = selector.trim()
      // If it's a html fragment, create nodes from it
      // Note: In both Chrome 21 and Firefox 15, DOM error 12
      // is thrown if the fragment doesn't begin with <
      if (selector[0] == '<' && fragmentRE.test(selector))
        dom = zepto.fragment(selector, RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // If it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, just return it
    else if (zepto.isZ(selector)) return selector
    else {
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes.
      else if (isObject(selector))
        dom = [selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // create a new Zepto collection from the nodes found
    return zepto.Z(dom, selector)
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found,
        maybeID = selector[0] == '#',
        maybeClass = !maybeID && selector[0] == '.',
        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
        isSimple = simpleSelectorRE.test(nameOnly)
    return (isDocument(element) && isSimple && maybeID) ?
      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
      slice.call(
        isSimple && !maybeID ?
          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
          element.getElementsByTagName(selector) : // Or a tag
          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
      )
  }

  function filtered(nodes, selector) {
    return selector == null ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = document.documentElement.contains ?
    function(parent, node) {
      return parent !== node && parent.contains(node)
    } :
    function(parent, node) {
      while (node && (node = node.parentNode))
        if (node === parent) return true
      return false
    }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className || '',
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    var num
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          !/^0/.test(value) && !isNaN(num = Number(value)) ? num :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) {
    return str == null ? "" : String.prototype.trim.call(str)
  }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      // need to check if document.body exists for IE as that browser reports
      // document ready when it hasn't yet created the body element
      if (readyRE.test(document.readyState) && document.body) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (!selector) result = []
      else if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var node = this[0], collection = false
      if (typeof selector == 'object') collection = $(selector)
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = '')
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return 0 in arguments ?
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        }) :
        (0 in this ? this[0].innerHTML : null)
    },
    text: function(text){
      return 0 in arguments ?
        this.each(function(idx){
          var newText = funcArg(this, text, idx, this.textContent)
          this.textContent = newText == null ? '' : ''+newText
        }) :
        (0 in this ? this[0].textContent : null)
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && !(1 in arguments)) ?
        (!this.length || this[0].nodeType !== 1 ? undefined :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
    },
    prop: function(name, value){
      name = propMap[name] || name
      return (1 in arguments) ?
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        }) :
        (this[0] && this[0][name])
    },
    data: function(name, value){
      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

      var data = (1 in arguments) ?
        this.attr(attrName, value) :
        this.attr(attrName)

      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      return 0 in arguments ?
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        }) :
        (this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
           this[0].value)
        )
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (!this.length) return null
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2) {
        var element = this[0], computedStyle = getComputedStyle(element, '')
        if(!element) return
        if (typeof property == 'string')
          return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
        else if (isArray(property)) {
          var props = {}
          $.each(property, function(_, prop){
            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
          })
          return props
        }
      }

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      if (!name) return false
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      if (!name) return this
      return this.each(function(idx){
        if (!('className' in this)) return
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (!('className' in this)) return
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      if (!name) return this
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(value){
      if (!this.length) return
      var hasScrollTop = 'scrollTop' in this[0]
      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
      return this.each(hasScrollTop ?
        function(){ this.scrollTop = value } :
        function(){ this.scrollTo(this.scrollX, value) })
    },
    scrollLeft: function(value){
      if (!this.length) return
      var hasScrollLeft = 'scrollLeft' in this[0]
      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
      return this.each(hasScrollLeft ?
        function(){ this.scrollLeft = value } :
        function(){ this.scrollTo(value, this.scrollY) })
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    var dimensionProperty =
      dimension.replace(/./, function(m){ return m[0].toUpperCase() })

    $.fn[dimension] = function(value){
      var offset, el = this[0]
      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var i = 0, len = node.childNodes.length; i < len; i++)
      traverseNode(node.childNodes[i], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        var parentInDocument = $.contains(document.documentElement, parent)

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          parent.insertBefore(node, target)
          if (parentInDocument) traverseNode(node, function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src)
              window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()

// If `$` is not yet defined, point it to `Zepto`
window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)
;//     Zepto.js
//     (c) 2010-2014 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj){ return typeof obj == 'string' },
      handlers = {},
      specialEvents={},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || (focusinSupported && focus[type]) || type
  }

  function add(element, events, fn, data, selector, delegator, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    events.split(/\s/).forEach(function(event){
      if (event == 'ready') return $(document).ready(fn)
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = delegator
      var callback  = delegator || fn
      handler.proxy = function(e){
        e = compatible(e)
        if (e.isImmediatePropagationStopped()) return
        e.data = data
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      if ('addEventListener' in element)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    ;(events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
      if ('removeEventListener' in element)
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    var args = (2 in arguments) && slice.call(arguments, 2)
    if (isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {
      if (args) {
        args.unshift(fn[context], fn)
        return $.proxy.apply(null, args)
      } else {
        return $.proxy(fn[context], fn)
      }
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, data, callback){
    return this.on(event, data, callback)
  }
  $.fn.unbind = function(event, callback){
    return this.off(event, callback)
  }
  $.fn.one = function(event, selector, data, callback){
    return this.on(event, selector, data, callback, 1)
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }

  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      $.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name]
        event[name] = function(){
          this[predicate] = returnTrue
          return sourceMethod && sourceMethod.apply(source, arguments)
        }
        event[predicate] = returnFalse
      })

      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
          source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue
    }
    return event
  }

  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    return compatible(proxy, event)
  }

  $.fn.delegate = function(selector, event, callback){
    return this.on(event, selector, callback)
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.off(event, selector, callback)
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, data, callback, one){
    var autoRemove, delegator, $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined
    if (isFunction(data) || data === false)
      callback = data, data = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(_, element){
      if (one) autoRemove = function(e){
        remove(element, e.type, callback)
        return callback.apply(this, arguments)
      }

      if (selector) delegator = function(e){
        var evt, match = $(e.target).closest(selector, element).get(0)
        if (match && match !== element) {
          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
        }
      }

      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }
  $.fn.off = function(event, selector, callback){
    var $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.off(type, selector, fn)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.trigger = function(event, args){
    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
    event._args = args
    return this.each(function(){
      // items in the collection might not be DOM elements
      if('dispatchEvent' in this) this.dispatchEvent(event)
      else $(this).triggerHandler(event, args)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, args){
    var e, result
    this.each(function(i, element){
      e = createProxy(isString(event) ? $.Event(event) : event)
      e._args = args
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return callback ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  ;['focus', 'blur'].forEach(function(name) {
    $.fn[name] = function(callback) {
      if (callback) this.bind(name, callback)
      else this.each(function(){
        try { this[name]() }
        catch(e) {}
      })
      return this
    }
  })

  $.Event = function(type, props) {
    if (!isString(type)) props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    return compatible(event)
  }

})(Zepto)
;//     Zepto.js
//     (c) 2010-2014 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
// 加入防止误点击，doubletap trigger的时候把e传过去

;(function($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
    longTapDelay = 750,
    gesture

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >=
      Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  function longTap() {
    longTapTimeout = null
    if (touch.last) {
      touch.el.trigger('longTap')
      touch = {}
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout)
    if (tapTimeout) clearTimeout(tapTimeout)
    if (swipeTimeout) clearTimeout(swipeTimeout)
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
    touch = {}
  }

  function isPrimaryTouch(event){
    return (event.pointerType == 'touch' ||
      event.pointerType == event.MSPOINTER_TYPE_TOUCH)
      && event.isPrimary
  }

  function isPointerEventType(e, type){
    return (e.type == 'pointer'+type ||
      e.type.toLowerCase() == 'mspointer'+type)
  }

  $(document).ready(function(){
    var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType

    var isScrolling = false,
        $scrollEl, 
        timer,
        lastTouchMoveScrollTop, 
        lastTouchMoveTime,
        touchEndScrollTop, 
        parentArr = [];

    if ('MSGesture' in window) {
      gesture = new MSGesture()
      gesture.target = document.body
    }

    $(document)
      .bind('MSGestureEnd', function(e){
        var swipeDirectionFromVelocity =
          e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
        if (swipeDirectionFromVelocity) {
          touch.el.trigger('swipe')
          touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
        }
      })
      .on('touchstart MSPointerDown pointerdown', function(e){
        // fix for ios
        if($.os.ios){
            $scrollEl = null;
            // clear last interval
            clearInterval(timer);

            parentArr = [];

            // record all parents' scrollTop for checking scroll DOM element
            var $parent = $(e.target);

            while($parent[0]){
                parentArr.push({
                  $el: $parent,
                  touchStartScrollTop: $parent.scrollTop()
                });

                if($parent[0] == document.body){
                  break;
                }

                $parent = $parent.parent();
            }

        }

        if((_isPointerType = isPointerEventType(e, 'down')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
        if (e.touches && e.touches.length === 1 && touch.x2) {
          // Clear out touch movement data if we have it sticking around
          // This can occur if touchcancel doesn't fire due to preventDefault, etc.
          touch.x2 = undefined
          touch.y2 = undefined
        }
        now = Date.now()
        delta = now - (touch.last || now)
        touch.el = $('tagName' in firstTouch.target ?
          firstTouch.target : firstTouch.target.parentNode)
        touchTimeout && clearTimeout(touchTimeout)
        touch.x1 = firstTouch.pageX
        touch.y1 = firstTouch.pageY
        if (delta > 0 && delta <= 500) touch.isDoubleTap = true
        touch.last = now
        longTapTimeout = setTimeout(longTap, longTapDelay)

        // adds the current touch contact for IE gesture recognition
        if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
      })
      .on('touchmove MSPointerMove pointermove', function(e){
        if((_isPointerType = isPointerEventType(e, 'move')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
        cancelLongTap()
        touch.x2 = firstTouch.pageX
        touch.y2 = firstTouch.pageY

        deltaX += Math.abs(touch.x1 - touch.x2)
        deltaY += Math.abs(touch.y1 - touch.y2)

        // when touch move, we can check which dom is scrolling
        if($.os.ios){

            // if checked for this time, then do nothing
            if(!$scrollEl){
                $.each(parentArr, function(index, item){
                    if(Math.abs(item.$el.scrollTop() - item.touchStartScrollTop) > 0){
                        $scrollEl = item.$el;
                        return false;
                    }
                });
            }

            // record the last scrollTop for calculating the velocity
            if($scrollEl){
                lastTouchMoveScrollTop = $scrollEl.scrollTop();
                lastTouchMoveTime = +new Date();
            }
        }
      })
      .on('touchend MSPointerUp pointerup', function(e){
        if((_isPointerType = isPointerEventType(e, 'up')) &&
          !isPrimaryTouch(e)) return
        cancelLongTap()

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)){

          swipeTimeout = setTimeout(function() {
            if(touch && touch.el){
              touch.el.trigger('swipe')
              touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            }
            touch = {}
          }, 0)

          if($.os.ios){
              if($scrollEl){
                  touchEndScrollTop = $scrollEl.scrollTop();

                  var v = (touchEndScrollTop - lastTouchMoveScrollTop) / (+new Date() - lastTouchMoveTime);

                  // if velocity > 0.5, we believe that the scroll element will continue scroll
                  // and at the same time we can't get the correct scrollTop using js
                  // when it's stopped, scrollTop will be set correct immediately
                  if(Math.abs(v) > 0.5){
                      timer = setInterval(function(){
                        var scrollTop = $scrollEl.scrollTop();

                        // if current scrollTop always equals to touchEndScrollTop, scroll element now is scrolling.
                        if(touchEndScrollTop == scrollTop){
                            isScrolling = true;

                        // else it's stopped
                        }else{
                            isScrolling = false;

                            clearInterval(timer);
                        }
                      }, 20);
                  }else{
                      isScrolling = false;
                  }
              }
          }

        // normal tap
        }else if ('last' in touch)
          // don't fire tap when delta position changed by more than 30 pixels,
          // for instance when moving to a point and back to origin
          if (deltaX < 30 && deltaY < 30) {
            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
            // ('tap' fires before 'scroll')
            tapTimeout = setTimeout(function() {

              // trigger universal 'tap' with the option to cancelTouch()
              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
            // if the scroll dom is scrolling, 
            // the first tap is to stop scrolling rather than trigger tap events
            if($.os.ios && isScrolling) {
                isScrolling = false;
                return;
            }

              var event = $.Event('tap')
              event.cancelTouch = cancelAll
              touch.el.trigger(event)

              // trigger double tap immediately
              if (touch.isDoubleTap) {
                if (touch.el) touch.el.trigger('doubleTap', [e])
                touch = {}
              }

              // trigger single tap after 250ms of inactivity
              else {
                touchTimeout = setTimeout(function(){
                  touchTimeout = null
                  if (touch.el) touch.el.trigger('singleTap')
                  touch = {}
                }, 250)
              }
            }, 0)
          } else {
            touch = {}
          }
          deltaX = deltaY = 0

      })
      // when the browser window loses focus,
      // for example when a modal dialog is shown,
      // cancel all ongoing events
      .on('touchcancel MSPointerCancel pointercancel', cancelAll)

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    $(window).on('scroll', cancelAll)
  })

  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
    'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
    $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
  })
})(Zepto)
;//     Zepto.js
//     (c) 2010-2014 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  function detect(ua){
    var os = this.os = {}, browser = this.browser = {},
      webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
      android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
      osx = !!ua.match(/\(Macintosh\; Intel /),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      wp = ua.match(/Windows Phone ([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      kindle = ua.match(/Kindle\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
      bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
      rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
      playbook = ua.match(/PlayBook/),
      chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
      firefox = ua.match(/Firefox\/([\d.]+)/),
      ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
      webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
      safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/)

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    if (browser.webkit = !!webkit) browser.version = webkit[1]

    if (android) os.android = true, os.version = android[2]
    if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
    if (wp) os.wp = true, os.version = wp[1]
    if (webos) os.webos = true, os.version = webos[2]
    if (touchpad) os.touchpad = true
    if (blackberry) os.blackberry = true, os.version = blackberry[2]
    if (bb10) os.bb10 = true, os.version = bb10[2]
    if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
    if (playbook) browser.playbook = true
    if (kindle) os.kindle = true, os.version = kindle[1]
    if (silk) browser.silk = true, browser.version = silk[1]
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
    if (chrome) browser.chrome = true, browser.version = chrome[1]
    if (firefox) browser.firefox = true, browser.version = firefox[1]
    if (ie) browser.ie = true, browser.version = ie[1]
    if (safari && (osx || os.ios)) {browser.safari = true; if (osx) browser.version = safari[1]}
    if (webview) browser.webview = true

    os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
      (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
    os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
      (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
      (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
  }

  detect.call($, navigator.userAgent)
  // make available to unit tests
  $.__detect = detect

})(Zepto)
;//     Zepto.js
//     (c) 2010-2014 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

// The following code is heavily inspired by jQuery's $.fn.data()

;(function($){
  var data = {}, dataAttr = $.fn.data, camelize = $.camelCase,
    exp = $.expando = 'Zepto' + (+new Date()), emptyArray = []

  // Get value from node:
  // 1. first try key as given,
  // 2. then try camelized key,
  // 3. fall back to reading "data-*" attribute.
  function getData(node, name) {
    var id = node[exp], store = id && data[id]
    if (name === undefined) return store || setData(node)
    else {
      if (store) {
        if (name in store) return store[name]
        var camelName = camelize(name)
        if (camelName in store) return store[camelName]
      }
      return dataAttr.call($(node), name)
    }
  }

  // Store value under camelized key on node
  function setData(node, name, value) {
    var id = node[exp] || (node[exp] = ++$.uuid),
      store = data[id] || (data[id] = attributeData(node))
    if (name !== undefined) store[camelize(name)] = value
    return store
  }

  // Read all "data-*" attributes from a node
  function attributeData(node) {
    var store = {}
    $.each(node.attributes || emptyArray, function(i, attr){
      if (attr.name.indexOf('data-') == 0)
        store[camelize(attr.name.replace('data-', ''))] =
          $.zepto.deserializeValue(attr.value)
    })
    return store
  }

  $.fn.data = function(name, value) {
    return value === undefined ?
      // set multiple values via object
      $.isPlainObject(name) ?
        this.each(function(i, node){
          $.each(name, function(key, value){ setData(node, key, value) })
        }) :
        // get value from first element
        (0 in this ? getData(this[0], name) : undefined) :
      // set value on all elements
      this.each(function(){ setData(this, name, value) })
  }

  $.fn.removeData = function(names) {
    if (typeof names == 'string') names = names.split(/\s+/)
    return this.each(function(){
      var id = this[exp], store = id && data[id]
      if (store) $.each(names || store, function(key){
        delete store[names ? camelize(this) : key]
      })
    })
  }

  // Generate extended `remove` and `empty` functions
  ;['remove', 'empty'].forEach(function(methodName){
    var origFn = $.fn[methodName]
    $.fn[methodName] = function() {
      var elements = this.find('*')
      if (methodName === 'remove') elements = elements.add(this)
      elements.removeData()
      return origFn.call(this)
    }
  })
})(Zepto)
;(function($, undefined) {
    var prefix = "", eventPrefix, endEventName, endAnimationName, vendors = {
        Webkit: "webkit",
        Moz: "",
        O: "o",
        ms: "MS"
    }, document = window.document, testEl = document.createElement("div"), supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i, transform, transitionProperty, transitionDuration, transitionTiming, animationName, animationDuration, animationTiming, cssReset = {};
    function dasherize(str) {
        return downcase(str.replace(/([a-z])([A-Z])/, "$1-$2"));
    }
    function downcase(str) {
        return str.toLowerCase();
    }
    function normalizeEvent(name) {
        return eventPrefix ? eventPrefix + name : downcase(name);
    }
    $.each(vendors, function(vendor, event) {
        if (testEl.style[vendor + "TransitionProperty"] !== undefined) {
            prefix = "-" + downcase(vendor) + "-";
            eventPrefix = event;
            return false;
        }
    });
    transform = prefix + "transform";
    cssReset[transitionProperty = prefix + "transition-property"] = cssReset[transitionDuration = prefix + "transition-duration"] = cssReset[transitionTiming = prefix + "transition-timing-function"] = cssReset[animationName = prefix + "animation-name"] = cssReset[animationDuration = prefix + "animation-duration"] = cssReset[animationTiming = prefix + "animation-timing-function"] = "";
    $.fx = {
        off: eventPrefix === undefined && testEl.style.transitionProperty === undefined,
        speeds: {
            _default: 400,
            fast: 200,
            slow: 600
        },
        cssPrefix: prefix,
        transitionEnd: normalizeEvent("TransitionEnd"),
        animationEnd: normalizeEvent("AnimationEnd")
    };
    $.fn.animate = function(properties, duration, ease, callback) {
        if ($.isPlainObject(duration)) ease = duration.easing, callback = duration.complete, 
        duration = duration.duration;
        if (duration) duration = (typeof duration == "number" ? duration : $.fx.speeds[duration] || $.fx.speeds._default) / 1e3;
        return this.anim(properties, duration, ease, callback);
    };
    $.fn.anim = function(properties, duration, ease, callback) {
        var key, cssValues = {}, cssProperties, transforms = "", that = this, wrappedCallback, endEvent = $.fx.transitionEnd;
        if (duration === undefined) duration = .4;
        if ($.fx.off) duration = 0;
        if (typeof properties == "string") {
            // keyframe animation
            cssValues[animationName] = properties;
            cssValues[animationDuration] = duration + "s";
            cssValues[animationTiming] = ease || "linear";
            endEvent = $.fx.animationEnd;
        } else {
            cssProperties = [];
            // CSS transitions
            for (key in properties) if (supportedTransforms.test(key)) transforms += key + "(" + properties[key] + ") "; else cssValues[key] = properties[key], 
            cssProperties.push(dasherize(key));
            if (transforms) cssValues[transform] = transforms, cssProperties.push(transform);
            if (duration > 0 && typeof properties === "object") {
                cssValues[transitionProperty] = cssProperties.join(", ");
                cssValues[transitionDuration] = duration + "s";
                cssValues[transitionTiming] = ease || "linear";
            }
        }
        wrappedCallback = function(event) {
            if (typeof event !== "undefined") {
                if (event.target !== event.currentTarget) return;
                // makes sure the event didn't bubble from "below"
                $(event.target).unbind(endEvent, wrappedCallback);
            }
            $(this).css(cssReset);
            callback && callback.call(this);
        };
        if (duration > 0) this.bind(endEvent, wrappedCallback);
        // trigger page reflow so new elements can animate
        this.size() && this.get(0).clientLeft;
        this.css(cssValues);
        if (duration <= 0) setTimeout(function() {
            that.each(function() {
                wrappedCallback.call(this);
            });
        }, 0);
        return this;
    };
    testEl = null;
})(Zepto);;;(function($){
  var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.isDefaultPrevented()
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings, deferred) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    if (deferred) deferred.resolveWith(context, [data, status, xhr])
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings, deferred) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    if (deferred) deferred.rejectWith(context, [xhr, type, error])
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options, deferred){
    if (!('type' in options)) return $.ajax(options)

    var _callbackName = options.jsonpCallback,
      callbackName = ($.isFunction(_callbackName) ?
        _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
      script = document.createElement('script'),
      originalCallback = window[callbackName],
      responseData,
      abort = function(errorType) {
        $(script).triggerHandler('error', errorType || 'abort')
      },
      xhr = { abort: abort }, abortTimeout

    if (deferred) deferred.promise(xhr)

    $(script).on('load error', function(e, errorType){
      clearTimeout(abortTimeout)
      $(script).off().remove()

      if (e.type == 'error' || !responseData) {
        ajaxError(null, errorType || 'error', xhr, options, deferred)
      } else {
        ajaxSuccess(responseData[0], xhr, options, deferred)
      }

      window[callbackName] = originalCallback
      if (responseData && $.isFunction(originalCallback))
        originalCallback(responseData[0])

      originalCallback = responseData = undefined
    })

    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort')
      return xhr
    }

    window[callbackName] = function(){
      responseData = arguments
    }

    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
    document.head.appendChild(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
      abort('timeout')
    }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    // IIS returns Javascript as "application/x-javascript"
    accepts: {
      script: 'text/javascript, application/javascript, application/x-javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0,
    // Whether data should be serialized to string
    processData: true,
    // Whether the browser should be allowed to cache GET responses
    cache: true
  }

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    if (query == '') return url
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data), options.data = undefined
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {}),
        deferred = $.Deferred && $.Deferred()
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
      RegExp.$2 != window.location.host

    if (!settings.url) settings.url = window.location.toString()
    serializeData(settings)
    if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

    var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
    if (dataType == 'jsonp' || hasPlaceholder) {
      if (!hasPlaceholder)
        settings.url = appendQuery(settings.url,
          settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
      return $.ajaxJSONP(settings, deferred)
    }

    var mime = settings.accepts[dataType],
        headers = { },
        setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(),
        nativeSetHeader = xhr.setRequestHeader,
        abortTimeout

    if (deferred) deferred.promise(xhr)

    if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
    setHeader('Accept', mime || '*/*')
    if (mime = settings.mimeType || mime) {
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
      setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

    if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
    xhr.setRequestHeader = setHeader

    xhr.realAbort = function(){
      xhr.realAbort = empty;
      xhr.onreadystatechange = empty;
      clearTimeout(abortTimeout);
      xhr.abort();
      ajaxError(null, 'abort', xhr, settings, deferred)
      return settings.data;
    }

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            // http://perfectionkills.com/global-eval-what-are-the-options/
            if (dataType == 'script')    (1,eval)(result)
            else if (dataType == 'xml')  result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
          } catch (e) { error = e }

          if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
          else ajaxSuccess(result, xhr, settings, deferred)
        } else {
          ajaxError(xhr.statusText || null, 'error', xhr, settings, deferred)
        }
      }
    }

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      ajaxError(null, 'abort', xhr, settings, deferred)
      return xhr
    }

    if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async, settings.username, settings.password)
    if(settings.crossDomain) xhr.withCredentials = true;

    for (name in headers) nativeSetHeader.apply(xhr, headers[name])

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings, deferred)
      }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    if ($.isFunction(data)) dataType = success, success = data, data = undefined
    if (!$.isFunction(success)) dataType = success, success = undefined
    return {
      url: url
    , data: data
    , success: success
    , dataType: dataType
    }
  }

  $.get = function(/* url, data, success, dataType */){
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function(/* url, data, success, dataType */){
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function(/* url, data, success */){
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }

  $.fn.load = function(url, data, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    options.success = function(response){
      self.html(selector ?
        $('<div>').html(response.replace(rscript, "")).find(selector)
        : response)
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
    $.each(obj, function(key, value) {
      type = $.type(value)
      if (scope) key = traditional ? scope :
        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
    serialize(params, obj, traditional)
    return params.join('&');
  }
})(Zepto)
;;(function($){
	$.extend($, {
		emptyFunction: function(){},
		preventDefault: function(e){
			e.preventDefault();
		},
		template: (function(){
			var cache = {};

			return function(str, data){
				// Figure out if we're getting a template, or if we need to
				// load the template - and be sure to cache the result.
				var fn = cache[str] || 
				  // Generate a reusable function that will serve as a template
				  // generator (and which will be cached).
				  new Function("obj",
					"var p=[],print=function(){p.push.apply(p,arguments);};" +
					
					// Introduce the data as local variables using with(){}
					"with(obj){p.push('" +
					
					// Convert the template into pure JavaScript
					str
					  .replace(/[\r\t\n]/g, " ")
					  .split("<%").join("\t")
					  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
					  .replace(/\t=(.*?)%>/g, "',$1,'")
					  .split("\t").join("');")
					  .split("%>").join("p.push('")
					  .split("\r").join("\\'")
				  + "');}return p.join('');");
				
				// Provide some basic currying to the user
				return data ? fn( data ) : fn;
			}
		})(),
		insertStyleSheet: function() {
	        var $el = $('<style type="text/css"></style>').appendTo('head');
        	return $el[0].sheet;
    	},
    	debounce: function(func, wait, immediate){
	        var timeout;

	        return function() {
	            var context = this, 
	                args = arguments,
	                callNow = immediate && !timeout;

	            var later = function() {
	                timeout = null;
	                if (!immediate) {
	                    func.apply(context, args);
	                }
	            };

	            clearTimeout(timeout);

	            timeout = setTimeout(later, wait);

	            if (callNow) {
	                func.apply(context, args);
	            }
	        };
	    },
	    setCookie: function(name, value, domain, path, hour) {
			if (hour) {
				var today = new Date();
				var expire = new Date();
				expire.setTime(today.getTime() + 3600000 * hour);
			}
			window.document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
			return true;
		},
	    getCookie: function(name) {
			var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
			var m = window.document.cookie.match(r);
			return (!m ? "" : m[1]);
		},
		deleteCookie: function(name, domain, path) {
			window.document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
		}
	});

	$.extend($.fn, {
		isInView: function(viewWidth, viewHeight){
			var el = $(this)[0];
			if(!el){
				return false;
			}
			
			var rect = el.getBoundingClientRect();

	        if((rect.left > -rect.width && rect.right < (viewWidth || window.innerWidth) + rect.width) &&
	            (rect.top > -rect.height && rect.bottom < (viewHeight || window.innerHeight) + rect.height)){
	            return true;
	        }else{
	            return false;
	        }
	    }
	});
})(Zepto);;(function($){
    function bounceFix() {
        $.isBounceFix = true;

        // fix by jdochen
        // 为兼容后期生成的节点，使用委托方式绑定
        $(document)
        .on('touchmove', '[data-bouncefix],[data-scrollable]', function (e) {
            var el = e.currentTarget,
                clientHeight = el.clientHeight,
                scrollHeight = el.scrollHeight;

            if(scrollHeight <= clientHeight){
                e.preventDefault();
            }
        })
        .on('touchstart', '[data-scrollable]', function (e) {
            var el = e.currentTarget,
                scrollTop = el.scrollTop,
                clientHeight = el.clientHeight,
                scrollHeight = el.scrollHeight;

            if(scrollHeight > clientHeight){
                if ( scrollTop <= 0 ) {
                    el.scrollTop = 1;
                }

                if ( scrollTop >= scrollHeight - clientHeight ){
                    el.scrollTop = scrollHeight - clientHeight - 1;
                }
            }
        })
    }

    // only for ios6+
    if( $.os.ios && $.os.version >= '6' ) {
        $('body').addClass('js-bounce-fix');
        bounceFix();
    }
})(Zepto);
;;(function($){
	var PREFIX = 'pro';		// data存储前缀

	// Read all "data-*" attributes from a node
	function attributeData(node) {
		var store = {}
		$.each(node.attributes || [], function(i, attr){
		  	if (attr.name.indexOf('data-') == 0)
		    	store[$.camelCase(attr.name.replace('data-', ''))] =
		      		$.zepto.deserializeValue(attr.value)
		})
		return store
	}

	// 将组件挂到$.fn上
	function zeptolize( name ) {
	    var key = name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ),
	        old = $.fn[ key ];

	    $.fn[ key ] = function( opts, fuc ) {
	        var args = [].slice.call( arguments, (typeof opts === 'string'? 1 : 2)),
	            method = (typeof opts === 'string' && opts) || (typeof fuc === 'string' && fuc),
	            ret,
	            obj;

	        $.each( this, function( i, el ) {
	        	var $el = $( el ),
	        		attr = attributeData( el );

	            // 从data中取，没有则创建一个
	            obj = $el.data( PREFIX + '-' + name );

	            if( obj === undefined ) {
	            	obj = new pro[ name ]( el, $.isPlainObject( opts ) ? $.extend( opts, attr ) : attr );
	            	$el.data( PREFIX + '-' + name, obj );
	            }else {
	            	obj.setOption( opts );
	            }

	            // 取实例
	            if ( method === false ) {
	                ret = obj;
	                return false;    // 断开each循环
	            } else if ( method ) {

	                // 当取的方法不存在时，抛出错误信息
	                if ( !$.isFunction( obj[ method ] ) ) {
	                    throw new Error( 'no such method' );
	                }

	                ret = obj[ method ].apply( obj, args );

	                // 断定它是getter性质的方法，所以需要断开each循环，把结果返回
	                if ( ret !== undefined && ret !== obj ) {
	                    return false;
	                }

	                // ret为obj时为无效值，为了不影响后面的返回
	                ret = undefined;
	            }
	        } );

	        return ret !== undefined ? ret : this;
	    };

	    /*
	     * NO CONFLICT
	     */
	    $.fn[ key ].noConflict = function() {
	        $.fn[ key ] = old;
	        return this;
	    };
	}

    window.pro = {
    	// 创建组件
	    createWidget: function ( name, object, isSingleton, superClass ) {
	        if ( !$.isFunction(superClass) ) {
	            superClass = Widget;	// 默认基类为Widget
	        }

	        function subClass( el, opts ) {
	            this._init( el, opts );
	        }

	        subClass.superClass = superClass;
	        subClass.prototype = Object.create( superClass.prototype );

	        object.$super = function( name ) {
	            var fn = superClass.prototype[ name ];
	            return $.isFunction( fn ) && fn.apply( this, [].slice.call( arguments, 1 ) );
	        };

	        $.extend( subClass.prototype, object );

	        if( isSingleton ) {
	        	pro[ name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ) ] = new subClass();		// 单例的组件直接实例化
	        }else {
	        	pro[ name ] = subClass;
	        	zeptolize( name );
	        } 

	        return subClass;
	    }
    };

    /*
     * @class 基类Widget
     */
    function Widget() {}

    Widget.prototype = {
    	options: {},
    	tpl: '',
    	/*
         * @method _init
         * @desc 组件初始化
         */
    	_init: function( el, opts) {
    		this.$container = $( el || document.body);

    		this.options = $.extend( {}, this.options, opts );

            if(opts && opts.$el){
                //处理已有内容的类型，不需要调用show方法来绑定事件，如Tab 
                /* this.$el = typeof opts.$el === 'string' ? $(opts.$el) : opts.$el; */
                this.$el = $(opts.$el, this.$container);

                this._bindEvents();
            }
    	},
    	/*
         * @method setOption
         * @desc 设置options
         */
    	setOption: function( opts ) {
    		this.options = $.extend( this.options, opts );
    	},
    	/*
         * @method _create
         * @desc 创建组件相应的dom
         */
    	_create: function(){
    		this.$el = $($.isPlainObject(this.tpl)? this.tpl.main : this.tpl).appendTo(this.$container);
    		this._bindEvents();

			if(this.options.preventScroll){
				// fix by jdochen
				// 这里改为是否阻止该wedget默认行为比较合适
				this.$el.on('touchmove', $.preventDefault);
			}
    	},
    	/*
         * @method _render
         * @desc 根据配置项渲染相应的dom
         */
    	_render: $.emptyFunction,
    	/*
         * @method _bindEvents
         * @desc 给组件绑定相应的事件
         */
    	_bindEvents: $.emptyFunction,
    	/*
         * @method show
         * @desc show组件
         */
    	show: function( opts ){
			var self = this;

			this.setOption( opts );

			if(!this.$el){
				this._create();
				this._render();
			}else if(opts){
				this._render();
			}else if(this.isShow){
				return;
			}

			this.isShow = true;

			// 是否出遮罩
			this.options.mask && pro.mask.show({
				tapHide: this.options.tapHide,
				relatedWidget: this
			});

			// 是否有动画
			if(this.options.animation){
				this.$el.show().addClass('js-effect');
				this.$el[0].offsetWidth;	// repaint
			}else{
				this.$el.removeClass('js-effect').show();
			}

			this.$el.off('webkitTransitionEnd');
			this.$el.addClass('js-show');

			// 是否需要阻止页面滚动
			/*if(this.options.preventScroll){
				$(document).on('touchmove', $.preventDefault);
			}*/
		},
		/*
         * @method hide
         * @desc hide组件
         */
		hide: function(){
			var self = this;

			if(!this.isShow){
				return;
			}

			this.isShow = false;

			if(this.options.animation){
				this.$el.one('webkitTransitionEnd', function(){
					self.$el.hide();
				});
			}else{
				this.$el.hide();
			}

			this.$el.removeClass('js-show');

			this.options.mask && pro.mask.hide();

			/*if(this.options.preventScroll){
				$(document).off('touchmove', $.preventDefault);
			}*/
		}
    }
})(Zepto)
;(function( $, pro ) {
    pro.createWidget( 'Dot', {
        options: {
            type: 'normal',   // normal, new, num
            color: 'red',   // red 或 blue
            content: '',    // New红点和数字红点需要指定content
            css: null   // 样式，可以自由控制红点的位置和大小，默认红点在容器的右上角
        },
        tpl: '<div></div>',
        _render: function(){
            var options = this.options;
            
            this.$el.removeClass().addClass('ui-dot-' + options.type + ' ' + 'ui-dot-' + options.color).text(options.content);

            if(options.css){
                this.$el.css(options.css);
            }else{
                this.$el.addClass('ui-dot-tr');     // 位置默认在容器的右上角
            }
        }
    });
})(Zepto, pro);
;(function( $, pro ) {
	pro.createWidget( 'Mask', {
		options: {
			animation: true,
			preventScroll: true
		},
		tpl: '<div class="ui-mask"></div>',
		_bindEvents: function(){
            var self = this;

            var options = this.options;

            this.$el.on('tap', function(){
            	if(options.tapHide === true){
					if(options.relatedWidget){
						$.isFunction(options.relatedWidget.hide) && options.relatedWidget.hide();
					}
					self.hide();
				}else if($.isFunction(options.tapHide)){
					options.tapHide();
				}
			});
        }
	}, true);
})(Zepto, pro);
;(function( $, pro ) {
	pro.createWidget( 'Toast', {
		options: {
			animation: true,
			preventScroll: true,
			state: 'warning',	// 三种状态 warning，tips，success，参见 http://waltz.cdc.com/mqq.html#3539
			content: '',
			duration: 2000
		},
		tpl: '<div class="ui-toast">\
			  	<i></i>\
			  	<span class="ui-color-white"></span>\
			  </div>',
		_render: function(){
			this.$el.find('i').removeClass().addClass('ui-icon-' + this.options.state);
			this.$el.find('span').text(this.options.content);
		},
		show: function( opts ){
			var self = this;

			this.$super('show', opts);

			if(this.options.duration){
				clearTimeout(this.timer);
				
				this.timer = setTimeout(function(){
					self.hide();
				}, this.options.duration);
			}
		},
	}, true);
})(Zepto, pro);
;(function( $, pro ) {
    pro.createWidget( 'Dialog', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            title: '提示',
            content: '',
            btnText: ['取消', '确定'],
            btnHandle: []
        },
        tpl: '<div class="ui-dialog">\
                <div class="body ui-color-black">\
                    <div class="title"></div>\
                    <div class="content"></div>\
                </div>\
                <div class="btns ui-border-1px ui-color-blue">\
                    <div class="btn"></div>\
                    <div class="btn ui-border-1px"></div>\
                </div>\
            </div>',
        _render: function(){
            var options = this.options;
            if(options.title){
                this.$el.find('.title').text(options.title).css('display', 'block');
            }else{
                this.$el.find('.title').css('display', 'none');
            }
            this.$el.find('.content').html(options.content);
            this.$el.find('.btn:nth-child(1)').text(options.btnText[0]);
            if(options.btnText.length > 1){
                this.$el.find('.btn:nth-child(2)').text(options.btnText[1]).css('display', 'block');
            }else{
                this.$el.find('.btn:nth-child(2)').css('display', 'none');
            }
        },
        _bindEvents: function(){
            var self = this;

            this.$el.on('tap', '.btn', function(e){
                var $btn = $(e.currentTarget);

                $btn.active(function(){
                    self.hide();    // 点击后隐藏dialog

                    // 防止dialog隐藏动画和其他渲染一起出现卡顿
                    setTimeout(function(){
                        var fn = self.options.btnHandle[$btn.index()];
                        $.isFunction( fn ) && fn();
                    }, 0); 
                });
            });
        },
        show: function( opts ){
            if(!this.$el){
                this._create();
                this._render();
            }

            if($.env.isPoorDevice){
                this.$el.css('top', window.scrollY + window.innerHeight/2);
            }
            this.$el.addClass('js-before-show');

            this.$super('show', opts);
        },
        hide: function(){
            this.$el.removeClass('js-before-show');

            this.$super('hide');
        }
    }, true);
})(Zepto, pro);
;(function( $, pro ) {
    var cssPrefix = '-webkit-';
    var ratio = window.devicePixelRatio == 1? 1 : 2;

    var sheet = $.insertStyleSheet();

    var cache = {}; /* Cache animation rules */
    
    pro.createWidget( 'Loading', {
        options: {
            size: 30,               // The width/ height of the spinner

            lineWidth : 2,         // The the width of each lines in px
            lines: 12,            // The number of lines to draw

            color : '158,158,158',      // Must be an RGB string

            duration: 1.6        // Seconds per round
        },
        tpl: '<canvas></canvas>',
        _addAnimation: function(lines){
            var name = "js-loading-" + lines;

            if (!cache[name] && lines > 0) {

                var rule = "",
                    percentage;

                rule += "@" + cssPrefix + "keyframes " + name + "{";
                for (var i = 0; i <= lines; i++) {
                    percentage = i/lines;
                    rule += percentage*100 + "%{" + cssPrefix + "transform:rotate(" + percentage*360 + "deg)}";
                }
                rule += "}";

                sheet.insertRule(rule, sheet.cssRules.length);
                
                cache[name] = true;     //缓存
            }

            return name;
        },
        _render: function(){
            if($.env && $.env.isPoorDevice){
                ratio = 1;
            }

            var options = this.options;

            var size = options.size * ratio,
                halfSize = size/2;
                inner = halfSize * (1/3) ;
                outer = halfSize * (2/3) ;
                lineWidth = options.lineWidth * ratio,
                lines = options.lines;

            this.$el.attr({ width: size, height: size });
            var ctx = this.$el[0].getContext("2d");

            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';

            ctx.clearRect(0, 0, size, size);

            ctx.translate(halfSize, halfSize);

            for (var i = 0, l = lines; i < l; i++) {
                ctx.rotate(Math.PI * 2 / lines);

                ctx.strokeStyle = "rgba(" + options.color + "," + ( i < (1/4 * l) ? 1/4 : i/l )  + ")";

                ctx.beginPath();

                ctx.moveTo(0, inner);
                ctx.lineTo(0, outer);

                ctx.stroke();
            }

            this.$el.css(cssPrefix + 'animation', this._addAnimation(lines) + ' ' + options.duration + 's step-start infinite');

            var style = { width: halfSize, height: halfSize };
            style[cssPrefix + 'transform-origin'] = '0 0';
            style[cssPrefix + 'transform'] = 'scale(0.5)';
            this.$container.css(style);

            this.$el.appendTo(this.$container);
        }
    });
})(Zepto, pro);
;(function( $, pro ) {
    pro.createWidget( 'PageLoading', {
        options: {
            content: ''
        },
        tpl: '<div class="ui-page-loading">\
                <div class="loading"></div>\
                <div class="content"></div>\
            </div>',
        _render: function(){
            var options = this.options;
            
            this.$el.find('.loading').loading('show');

            this.$el.find('.content').html(options.content);
        }
    }, true);
})(Zepto, pro);
;(function( $, pro ) {
    pro.createWidget( 'TextLoading', {
        options: {
            preventScroll: true,
            content: ''
        },
        tpl: '<div class="ui-text-loading">\
                <div class="loading" data-color="255,255,255" data-size="36"></div>\
                <div class="content ui-color-white"></div>\
            </div>',
        _render: function(){
            var options = this.options;
            
            this.$el.find('.loading').loading('show');

            this.$el.find('.content').html(options.content);
        }
    }, true);
})(Zepto, pro);
;(function( $, pro ) {
    pro.createWidget( 'RichLoading', {
        options: {
            preventScroll: true,
            content: '',
            onClose: $.emptyFunction
        },
        tpl: '<div class="ui-rich-loading">\
                <div class="loading" data-color="255,255,255" data-size="36"></div>\
                <div class="ui-no-wrap content"></div>\
                <div class="ui-icon-close btn"></div>\
            </div>',
        _render: function(){
            var options = this.options;
            
            this.$el.find('.loading').loading('show');

            this.$el.find('.content').html(options.content);
        },
        _bindEvents: function(){
            var self = this;

            this.$el.on('tap', '.btn', function(e){
                var $btn = $(e.currentTarget);

                $btn.active(function(){
                    self.options.onClose();
                    self.hide();    // 点击后隐藏dialog
                });
            });
        }
    }, true);
})(Zepto, pro);
;(function( $, pro ) {
    /*底部浮层组件
    * 
    * 调用示例：by gctang
    * pro.actionSheet.show({
    *   content: ['value1','value2'], // 或以'<li>value1</li><li>value2</li>>'的字符串形式传入
    *   binHandle: [function(){}, function(){}]//需与content一一对应
    *})
    * or 高级配置用法：
    * pro.actionSheet.show({
    *   content: [
    *       {
    *           id: 'testId',//给节点添加自定义id
    *           className: 'ui-clor-red',//添加自己的样式
    *           value: 'value1' //展示的值
    *           cmd: 'customEvent1' //自定义事件名
    *       },
    *       {
    *           value: 'value2',
    *           cmd: 'customEvent2' //自定义事件名
    *       }
    *    ],
    *    customEvent1: function(){
    *        //自定义事件 do something
    *    }
    * })
    */
    pro.createWidget( 'ActionSheet', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue ui-border-1px btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue ui-border-1px btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
            }else{
                this.$el.find('.content').html(options.content);
            } 
        },
        _bindEvents: function(){
            var self = this;

            this.$el.on('tap', '.btn', function(e){
                var $btn = $(e.currentTarget);
                var command = $btn.data('cmd');

                $btn.active(function(){
                    var fu = null;
                    var index = -1;
                    if(command === 'as-cancel'){
                        index = self.$el.find('.content').children().length;
                    }else{
                        index = $btn.index();
                    }
                   
                    if($btn.data('dismiss')){
                        self.hide();    // 点击后隐藏action-sheet
                    } 

                    if(self.options.btnHandle.length > 0){
                        fn = self.options.btnHandle[index];
                        $.isFunction( fn ) && fn();
                    } else if($.isFunction( self.options[command] )){
                        self.options[command]();
                    }
                });
            });
        }
    }, true);
})(Zepto, pro);
;;(function($){
	$.extend($.fn, {
		// 有点击态的按钮
		active: function(fn, className){
			className = className || 'js-active';
			$.each( this, function( i, el ) {
				var $el = $(el);

				$el.addClass(className);
				$el[0].offsetWidth;		// repaint

				setTimeout(function(){
					$.isFunction( fn ) && fn.apply( self, [].slice.call( arguments, 1 ) );
					$el.removeClass(className);
				}, 50);
			});
		},
		// 状态切换的按钮
		change: function(className, fn){
			$.each( this, function( i, el ) {
				var $el = $(el);

				$el.toggleClass(className);

				$.isFunction( fn ) && fn.apply( self, [].slice.call( arguments, 1 ) );
			});
		}
	});
})(Zepto);(function( $, pro ) {
    pro.createWidget( 'Lazyload', {
        options: {
            attribute: 'data-lazy',

            viewWidth: window.innerWidth*2,
            viewHeight: window.innerHeight*2,   // 默认懒加载为两屏
            
            handler: function($el, src){
                var img;

                if(src){
                    if($el[0].tagName.toLowerCase() == 'img'){
                        img = $el[0];
                    }else{
                        img = $('img', $el)[0];
                    }

                    if(img){
                        img.onload = function(){
                            $el.addClass('js-loaded');
                        }

                        img.src = src;
                    }
                }
            },

            defer: 200
        },
        _init: function(el, opts){
            this.$super('_init', el, opts);

            this.$scrollEl = this.$container;
            this.$container = $.isWindow(this.$scrollEl[0])? $('body') : this.$scrollEl;

            this._bindEvents();
        },
        _bindEvents: function(){
            this._debounceLoad = $.debounce($.proxy(this.startLoad, this), this.options.defer, false);

            this.$scrollEl.on('scroll', this._debounceLoad);

            $(window).on('resize', this._debounceLoad);
        },
        startLoad: function(){
            var $container = this.$container,
                attribute = this.options.attribute,
                handler = this.options.handler;

            var $els = $('[' + attribute + ']', $container);

            var flag = false;
            for(var i = 0, l = $els.length; i < l; i++){
                var el = $els[i],
                    $el = $(el);

                if(!$el.attr('skip-load') && $el.isInView(this.options.viewWidth, this.options.viewHeight)){
                    handler($el, $el.attr(attribute));
                    $el.removeAttr(attribute);
                    
                    flag = true;
                }else if(flag){
                    break;
                }
            }
        }
    });
})(Zepto, pro);
;/*
custom apis:
core,
device.isMobileQQ,
device.getDeviceInfo,
device.getClientInfo,
device.getNetworkType,
device.getWebViewType,
device.connectToWiFi,
device.setScreenStatus,
app.isAppInstalled,
app.isAppInstalledBatch,
app.launchApp,
app.launchAppWithTokens,
app.sendFunnyFace,
ui.openUrl,
ui.openView,
ui.popBack,
ui.returnToAIO,
ui.setActionButton,
ui.setLoading,
ui.showDialog,
ui.showOfficalAccountDetail,
ui.showProfile,
ui.refreshTitle,
ui.showEQQ,
ui.scanQRcode,
ui.showActionSheet,
ui.shareAudio,
ui.shareMessage,
ui.shareRichMessage,
ui.pageVisibility,
ui.setOnCloseHandler,
ui.openAIO,
ui.showTips,
ui.setWebViewBehavior,
ui.setOnShareHandler,
ui.closeWebViews,
data.batchFetchOpenID,
data.sendRequest,
data.fetchJson,
data.readH5Data,
data.writeH5Data,
data.deleteH5Data,
data.deleteH5DataByHost,
data.getUrlImage,
data.setShareInfo,
data.setShareURL,
data.startSyncData,
data.stopSyncData,
data.pbReport,
data.getPageLoadStamp,
data.isFollowUin,
data.followUin,
data.getUserInfo,
offline.isCached,
offline.checkUpdate,
offline.downloadUpdate,
sensor.getLocation,
sensor.getSensorStatus,
sensor.getRealLocation,
sensor.vibrate,
sensor.startAccelerometer,
sensor.stopAccelerometer,
sensor.startCompass,
sensor.stopCompass,
sensor.startListen,
sensor.stopListen,
media.preloadSound,
media.playLocalSound,
media.getPicture,
media.getLocalImage,
tenpay.pay,
tenpay.openTenpayView,
tenpay.buyGoods,
tenpay.openService,
tenpay.rechargeGameCurrency,
tenpay.rechargeQb,
pay.pay,
pay.enablePay,
coupon.addCoupon,
coupon.addFavourBusiness,
coupon.goToCouponHomePage,
coupon.isFavourBusiness,
coupon.isFavourCoupon,
coupon.removeCoupon,
coupon.removeFavourBusiness,
redpoint.getAppInfo,
redpoint.setAppInfo,
redpoint.getNewMsgCnt,
redpoint.getNewMsgList,
redpoint.reportRedTouch,
redpoint.getRedPointShowInfo
*/
;
(function(name, definition) {

    this[name] = definition();

    if (typeof define === 'function') {
        define(this[name]);
    } else if (typeof module === 'object') {
        module.exports = this[name];
    }

})('mqq', function(undefined) {
    "use strict";

    var exports = {};

    var ua = navigator.userAgent;

    var SLICE = Array.prototype.slice;
    var REGEXP_IOS_QQ = /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/;
    var REGEXP_ANDROID_QQ = /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/; // 国际版的 QQ 的 ua 是 sqi

    var UUIDSeed = 1; //从1开始, 因为QQ浏览器的注入广告占用了0, 避免冲突

    var aCallbacks = {}; // 调用回调

    var aReports = {}; // API 调用的名字跟回调序号的映射

    var aSupports = {}; // 保存 API 的版本支持信息

    var CODE_API_CALL = -100000; // 定义为 API 调用, 跟 API 的回调区分

    var CODE_API_CALLBACK = -200000; // 定义为 API 调用的返回, 但是不知道确切返回码

    var NEW_PROTOCOL_BACK_LIST = { // 4.7启用了新协议, 但是部分接口不支持, 这里做个黑名单, 目前都是 android 的接口
        'qbizApi': '5.0', // 5.0 会支持新协议
        'pay': '999999', // pay相关的暂时没有修改计划
        'SetPwdJsInterface': '999999', // 设置密码?
        'GCApi': '999999', //游戏中心
        'q_download': '999999', // 下载器
        'qqZoneAppList': '999999', // 
        'qzone_app': '999999', // 
        'qzone_http': '999999', // 
        'qzone_imageCache': '999999', // 
        'RoamMapJsPlugin': '999999' //
    };

    exports.debuging = false;

    exports.iOS = REGEXP_IOS_QQ.test(ua);
    exports.android = REGEXP_ANDROID_QQ.test(ua);
    if (exports.iOS && exports.android) {

        /*
         * 同时是 iOS 和 android 是不可能的, 但是有些国产神机很恶心,
         * 明明是 android, ua 上还加上个 iPhone 5s...
         * 这里要 fix 掉
         */
        exports.iOS = false;
    }

    exports.version = '20141016001';

    exports.QQVersion = '0';

    exports.ERROR_NO_SUCH_METHOD = 'no such method';
    exports.ERROR_PERMISSION_DENIED = 'permission denied';

    if (!exports.android && !exports.iOS) {
        console.log('mqqapi: not android or ios');
    }

    /**
     * 当a<b返回-1, 当a==b返回0, 当a>b返回1,
     * 约定当a或b非法则返回-1
     */
    function compareVersion(a, b) {
        a = String(a).split('.');
        b = String(b).split('.');
        try {
            for (var i = 0, len = Math.max(a.length, b.length); i < len; i++) {
                var l = isFinite(a[i]) && Number(a[i]) || 0,
                    r = isFinite(b[i]) && Number(b[i]) || 0;
                if (l < r) {
                    return -1;
                } else if (l > r) {
                    return 1;
                }
            }
        } catch (e) {
            return -1;
        }
        return 0;
    }

    exports.compare = function(ver) {
        return compareVersion(exports.QQVersion, ver);
    };

    if (exports.android) {
        exports.QQVersion = function(m) { // 从 ua 拿版本号
            return m && (m[3] || m[1]) || 0;
        }(ua.match(REGEXP_ANDROID_QQ));

        if (!window.JsBridge) { // 兼容 android
            window.JsBridge = {};
        }
        window.JsBridge.callMethod = invokeClientMethod;
        window.JsBridge.callback = execGlobalCallback;
        window.JsBridge.compareVersion = exports.compare;

    }

    if (exports.iOS) {

        window.iOSQQApi = exports; // 兼容 iOS
        exports.__RETURN_VALUE = undefined; // 用于接收客户端返回值

        exports.QQVersion = function(m) { // 从 ua 拿版本号
            return m && m[3] || 0;
        }(ua.match(REGEXP_IOS_QQ));

        // exports.QQVersion = function(){
        //     return invokeClientMethod('device', 'qqVersion') || 0;
        // }();

    }

    exports.platform = exports.iOS ? 'IPH' : exports.android ? 'AND' : 'OTH';


    var Report = (function() {
        var reportCache = [];

        var sendFrequency = 500;

        var timer = 0;

        var lastTimerTime = 0;

        var APP_ID = 1000218;

        var TYPE_ID = 1000280;

        // 抽样比例
        var sample = 20;

        var mainVersion = String(exports.QQVersion).split('.').slice(0, 3).join('.');

        var releaseVersion = exports.platform + "_MQQ_" + mainVersion;

        var qua = exports.platform + exports.QQVersion + '/' + exports.version;

        function sendReport() {
            var arr = reportCache;
            reportCache = [];
            timer = 0;

            if (!arr.length) {

                // 这次没有要上报的, 就关掉定时器
                return;
            }
            var params = {};

            params.appid = APP_ID; // 手机QQ JS API
            params.typeid = TYPE_ID; // UDP 接口需要
            params.releaseversion = releaseVersion;
            // params.build = location.hostname + location.pathname;
            params.sdkversion = exports.version;
            params.qua = qua;
            params.frequency = sample;

            params.t = Date.now();

            params.key = ['commandid', 'resultcode', 'tmcost'].join(',');

            arr.forEach(function(a, i) {

                params[i + 1 + '_1'] = a[0];
                params[i + 1 + '_2'] = a[1];
                params[i + 1 + '_3'] = a[2];
            });

            params = new String(toQuery(params));

            // api 的上报量太大了, 后台撑不住
            if (exports.compare('4.6') >= 0) {

                // 优先用客户端接口上报
                setTimeout(function() {
                    
                    if(mqq.iOS){
                        mqq.invoke('data', 'pbReport', { 'type': String(10004), 'data': params }, true);
                    }else{
                        mqq.invoke('publicAccount', 'pbReport', String(10004), params, true);
                    }
                }, 0);

            } else {
                var img = new Image();
                img.onload = function() {
                    img = null;
                };
                img.src = 'http://wspeed.qq.com/w.cgi?' + params;
            }

            timer = setTimeout(sendReport, sendFrequency);
        }

        function send(api, retCode, costTime) {

            // API调用进行抽样上报, 返回则不抽样
            if(retCode === CODE_API_CALL){

                retCode = 0; // API 调用的状态码用回 0
                var mod = Math.round(Math.random() * sample) % sample;
                if(mod !== 1){
                    return;
                }
            }

            reportCache.push([api, retCode || 0, costTime || 0]);

            // if(Date.now() - lastTimerTime < sendFrequency){

            //     // 连续的 sendFrequency 时间内的上报都合并掉
            //     clearTimeout(timer);
            //     timer = 0;
            // }
            if (!timer) {
                lastTimerTime = Date.now();
                timer = setTimeout(sendReport, sendFrequency);
            }

        }

        return {
            send: send
        };

    })();


    var Console = (function() {

        function debug() {
            if (!exports.debuging) {
                return;
            }
            var argus = SLICE.call(arguments);
            var result = [];
            argus.forEach(function(a) {
                if (typeof a === 'object') {
                    a = JSON.stringify(a);
                }
                result.push(a);
            });
            alert(result.join('\n'));
        }

        return {
            debug: debug
        };
    })();

    /**
     * 上报 API 调用和把 API 的回调跟 API 名字关联起来, 用于上报返回码和返回时间
     */
    function reportAPI(schema, ns, method, argus, sn) {

        if (!schema || !ns || !method) {

            // 非正常的 API 调用就不上报了
            return;
        }

        var uri = schema + '://' + ns + '/' + method;
        var a, i, l, m;

        argus = argus || [];

        if (!sn || !(aCallbacks[sn] || window[sn])) {

            // 尝试从参数中找到回调参数名作为 sn
            sn = null;
            for (i = 0, l = argus.length; i < l; i++) {
                a = argus[i];
                if (typeof a === 'object' && a !== null) {

                    a = a.callbackName || a.callback;
                }
                if (a && (aCallbacks[a] || window[a])) {
                    sn = a;
                    break;
                }
            }
        }

        if (sn) { // 记录 sn 和 uri 的对应关系
            aReports[sn] = {
                uri: uri,
                startTime: Date.now()
            };
            m = String(sn).match(/__MQQ_CALLBACK_(\d+)/);
            if (m) { //  兼容直接使用 createCallbackName 生成回调的情况
                aReports[m[1]] = aReports[sn];
            }
        }
        // Console.debug('sn: ' + sn, aReports);
        // 发上报请求
        Report.send(uri, CODE_API_CALL);
    }

    /**
     * 创建名字空间
     * @param  {String} name
     */
    function createNamespace(name) {
        var arr = name.split('.');
        var space = window;
        arr.forEach(function(a) {
            !space[a] && (space[a] = {});
            space = space[a];
        });
        return space;
    }

    /**
     * 创建回调的名字
     * @param  {Function} func
     * @param  {Boolean} deleteOnExec  为 true 则执行一次之后就删除该 function
     * @param  {Boolean} execOnNewThread
     * @return {String}
     */
    function createCallbackName(callback, deleteOnExec, execOnNewThread) {

        callback = (typeof callback === "function") ? callback : window[callback];
        if (!callback) {
            return;
        }

        var sn = storeCallback(callback);

        var name = '__MQQ_CALLBACK_' + sn;

        window[name] = function() {

            var argus = SLICE.call(arguments);

            fireCallback(sn, argus, deleteOnExec, execOnNewThread);

        };
        return name;
    }

    function storeCallback(callback) {
        var sn = UUIDSeed++;
        if (callback) {
            aCallbacks[sn] = callback;
        }
        return sn;
    }

    /**
     * 所有回调的最终被执行的入口函数
     */
    function fireCallback(sn, argus, deleteOnExec, execOnNewThread) {
        var callback = typeof sn === 'function' ? sn : (aCallbacks[sn] || window[sn]);
        var endTime = Date.now();
        argus = argus || [];
        // Console.debug('fireCallback, sn: ' + sn);
        if (typeof callback === 'function') {
            if (execOnNewThread) {
                setTimeout(function() {

                    callback.apply(null, argus);
                }, 0);
            } else {
                callback.apply(null, argus);
            }
        } else {

            console.log('mqqapi: not found such callback: ' + sn);
        }
        if (deleteOnExec) {
            delete aCallbacks[sn];
            delete window['__MQQ_CALLBACK_' + sn];
        }

        // Console.debug('sn: ' + sn + ', aReports[sn]: ' + aReports[sn])
        // 上报 API 调用返回
        if (aReports[sn]) {
            var obj = aReports[sn];
            delete aReports[sn];
            if (Number(sn)) {
                delete aReports['__MQQ_CALLBACK_' + sn];
            }
            var retCode = CODE_API_CALLBACK;

            // 提取返回结果中的 retCode
            var keys = ['retCode', 'retcode', 'resultCode', 'ret', 'code', 'r'];
            var a, j, n;
            // Console.debug(argus);
            if (argus.length) {
                a = argus[0]; // 只取第一个参数来判断

                if (typeof a === 'object' && a !== null) { // 返回码可能在 object 里
                    for (j = 0, n = keys.length; j < n; j++) {
                        if (keys[j] in a) {
                            retCode = a[keys[j]];
                            break;
                        }
                    }
                } else if (/^-?\d+$/.test(String(a))) { // 第一个参数是个整数, 认为是返回码
                    retCode = a;
                }
            }

            // 发上报请求
            Report.send(obj.uri + '#callback', retCode, endTime - obj.startTime);
        }
    }

    /**
     * android / iOS 5.0 开始, client回调 js, 都通过这个入口函数处理
     */
    function execGlobalCallback(sn /*, data*/ ) {
        Console.debug('execGlobalCallback: ' + JSON.stringify(arguments));

        var argus = SLICE.call(arguments, 1);

        if (exports.android && argus && argus.length) {

            // 对 android 的回调结果进行兼容
            // android 的旧接口返回会包装个 {r:0,result:123}, 要提取出来
            argus.forEach(function(data, i) {
                if (typeof data === 'object' && ('r' in data) && ('result' in data)) {
                    argus[i] = data.result;
                }
            });
        }

        fireCallback(sn, argus);
    }

    /**
     * 空的api实现, 用于兼容在浏览器调试, 让mqq的调用不报错
     */
    function emptyAPI() {
        // var argus = SLICE.call(arguments);
        // var callback = argus.length && argus[argus.length-1];
        // return (typeof callback === 'function') ? callback(null) : null;
    }

    /**
     * 创建 api 方法, 把指定 api 包装为固定的调用形式
     */
    function buildAPI(name, data) {
        var func = null;
        var index = name.lastIndexOf('.');
        var nsName = name.substring(0, index);
        var methodName = name.substring(index + 1);

        var ns = createNamespace(nsName);
        if (ns[methodName]) {

            // 已经有这个API了, 抛出异常
            throw new Error('[mqqapi]already has ' + name);
        }
        if (data.iOS && exports.iOS) {

            // 这里担心有业务没有判断方法是否存在就调用了, 还是去掉这个吧 az 2014/8/19
            // if (data.support && data.support.iOS) {
            //     if (exports.compare(data.support.iOS) > -1) {
            //         func = data.iOS;
            //     }
            // } else {
            func = data.iOS;
            // }
        } else if (data.android && exports.android) {

            // if (data.support && data.support.android) {
            //     if (exports.compare(data.support.android) > -1) {
            //         func = data.android;
            //     }
            // } else {
            func = data.android;
            // }
        } else if (data.browser) { // 某些 api 可能有浏览器兼容的方式
            func = data.browser;
        }
        ns[methodName] = func || emptyAPI;
        aSupports[name] = data.support;

    }

    function supportVersion(name) {

        var support = aSupports[name] || aSupports[name.replace('qw.', 'mqq.')];
        var env = exports.iOS ? 'iOS' : exports.android ? 'android' : 'browser';

        if (!support || !support[env]) {
            return false;
        }
        // 增加版本区间检查 20140924
        var vers = support[env].split("-");

        if ( vers.length === 1 ) {
            return exports.compare(vers[0]) > -1
        } else {
            return exports.compare(vers[0]) > -1 && exports.compare(vers[1]) < 1
        }

        // return exports.compare(vers[0]) > -1 && (vers.length === 1 || exports.compare(vers[1]) < 1)

    }

    /**
     * 使用 iframe 发起伪协议请求给客户端
     */
    function openURL(url, sn) {
        Console.debug('openURL: ' + url);
        var iframe = document.createElement('iframe');
        iframe.style.cssText = 'display:none;width:0px;height:0px;';
        var failCallback = function() {

            /*
                正常情况下是不会回调到这里的, 只有客户端没有捕获这个 url 请求,
                浏览器才会发起 iframe 的加载, 但这个 url 实际上是不存在的, 
                会触发 404 页面的 onload 事件
            */
            execGlobalCallback(sn, {
                r: -201,
                result: 'error'
            });
        };
        if (exports.iOS) {

            /* 
                ios 必须先赋值, 然后 append, 否者连续的 api调用会间隔着失败
                也就是 api1(); api2(); api3(); api4(); 的连续调用, 
                只有 api1 和 api3 会真正调用到客户端
            */
            iframe.onload = failCallback;
            iframe.src = url;
        }
        var container = document.body || document.documentElement;
        container.appendChild(iframe);

        /*
            android 这里必须先添加到页面, 然后再绑定 onload 和设置 src
            1. 先设置 src 再 append 到页面, 会导致在接口回调(callback)中嵌套调用 api会失败, 
                iframe会直接当成普通url来解析
            2. 先设置onload 在 append , 会导致 iframe 先触发一次 about:blank 的 onload 事件

         */
        if (exports.android) { // android 必须先append 然后赋值
            iframe.onload = failCallback;
            iframe.src = url;
        }

        // iOS 可以同步获取返回值, 因为 iframe 的url 被客户端捕获之后, 会挂起 js 进程
        var returnValue = exports.__RETURN_VALUE;
        exports.__RETURN_VALUE = undefined;

        // android 捕获了iframe的url之后, 也是中断 js 进程的, 所以这里可以用个 setTimeout 0 来删除 iframe
        setTimeout(function() {
            iframe.parentNode.removeChild(iframe);
        }, 0);

        return returnValue;
    }

    // 三星特供版, 从 4.2.1 开始有, 4.2.1 已经去掉了注入到全局对象的方法
    exports.__androidForSamsung = /_NZ\b/.test(ua);

    // android 的 jsbridge 协议开始支持的版本 4.5, 三星特供版也可以用 jsbridge 协议
    exports.__supportAndroidJSBridge = exports.android && (exports.compare('4.5') > -1 || exports.__androidForSamsung);

    // android 新 jsbridge 协议
    exports.__supportAndroidNewJSBridge = exports.android && exports.compare('4.7.2') > -1;

    function canUseNewProtocal(ns /*, method*/ ) {
        if (exports.iOS) { // iOS 旧版本的客户端也能很好兼容新协议
            return true;
        }
        if (exports.android && exports.__supportAndroidNewJSBridge) {

            if (NEW_PROTOCOL_BACK_LIST[ns] && exports.compare(NEW_PROTOCOL_BACK_LIST[ns]) < 0) {

                // 部分接口在 4.7.2 还不能使用新协议, 后续版本会修复该问题
                return false;
            }
            return true;
        }
        return false;
    }

    function invokeClientMethod(ns, method, argus, callback) {
        if (!ns || !method) {
            return null;
        }
        var url, sn; // sn 是回调函数的序列号
        argus = SLICE.call(arguments, 2);
        callback = argus.length && argus[argus.length - 1];

        if (callback && typeof callback === 'function') { // args最后一个参数是function, 说明存着callback
            argus.pop();
        } else if (typeof callback === 'undefined') {

            // callback 是undefined的情况, 可能是 api 定义了callback, 但是用户没传 callback, 这时候要把这个 undefined的参数删掉
            argus.pop();
        } else {
            callback = null;
        }

        // 统一生成回调序列号, callback 为空也会返回 sn 
        sn = storeCallback(callback);

        if (method === 'pbReport' && argus[argus.length - 1] === true) {

            argus.pop();

            // 内部的API调用就不要上报了, 否则就死循环了
        } else {

            // 上报 API 调用, openURL 会阻塞 js 线程, 因此要先打点和上报
            reportAPI('jsbridge', ns, method, argus, sn);
        }

        if (exports.android && !exports.__supportAndroidJSBridge) {

            /* 
                兼容Android QQ 4.5以下版本的客户端API调用方式
                排除掉三星特供版, 他可以用 jsbridge 协议
            */
            if (window[ns] && window[ns][method]) {
                var result = window[ns][method].apply(window[ns], argus);
                if (callback) {

                    fireCallback(sn, [result]);
                } else {
                    return result;
                }
            } else if (callback) {
                fireCallback(sn, [exports.ERROR_NO_SUCH_METHOD]);
            }
        } else if (canUseNewProtocal(ns, method)) {

            /* 
                android 4.7 以上的支持 ios的协议, 但是客户端的旧接口需要迁移, 4.7赶不上, 需要等到 4.7.2
                jsbridge://ns/method?p=test&p2=xxx&p3=yyy#123
            */
            url = 'jsbridge://' + encodeURIComponent(ns) + '/' + encodeURIComponent(method);

            argus.forEach(function(a, i) {
                if (typeof a === 'object') {
                    a = JSON.stringify(a);
                }
                if (i === 0) {
                    url += '?p=';
                } else {
                    url += '&p' + i + '=';
                }
                url += encodeURIComponent(String(a));
            });

            if (method === 'pbReport') {

                /**
                 * pbReport 这个接口不能加回调序号, 这个接口本来就不支持回调
                 * 但是 android 的 jsbridge 即使接口没有回调结果, 也会调用一次 js 表示这次接口调用到达了客户端
                 * 同时, 由于 android 一执行 loadUrl('javascript:xxx') 就会导致软键盘收起
                 * 所以上报的时候经常会引发这个问题, 这里就直接不加回调序号了
                 */
            } else {

                // 加上回调序列号
                url += '#' + sn;
            }

            var r = openURL(url);
            if (exports.iOS && r !== undefined && r.result !== undefined) {

                // FIXME 这里可能会导致回调两次, 但是 iOS 4.7.2以前的接口是依靠这里实现异步回调, 因此要验证下
                if (callback) {
                    fireCallback(sn, [r.result], false /*deleteOnExec*/ , true /*execOnNewThread*/ );
                } else {
                    return r.result;
                }
            }

        } else if (exports.android) { // android 4.7 以前的旧协议, 不能使用新协议的 android 会 fallback 到这里

            // jsbridge://ns/method/123/test/xxx/yyy
            url = 'jsbridge://' + encodeURIComponent(ns) + '/' + encodeURIComponent(method) + '/' + sn;

            argus.forEach(function(a) {
                if (typeof a === 'object') {
                    a = JSON.stringify(a);
                }
                url += '/' + encodeURIComponent(String(a));
            });

            openURL(url, sn);
        }

        return null;
    }

    // 执行原有的伪协议接口
    function invokeSchemaMethod(schema, ns, method, params, callback) {
        if (!schema || !ns || !method) {
            return null;
        }

        var argus = SLICE.call(arguments),
            sn;
        if (typeof argus[argus.length - 1] === 'function') {
            callback = argus[argus.length - 1];
            argus.pop();
        } else {
            callback = null;
        }
        if (argus.length === 4) {
            params = argus[argus.length - 1];
        } else {
            params = {};
        }
        if (callback) {
            params['callback_type'] = 'javascript';
            sn = createCallbackName(callback);
            params['callback_name'] = sn;
        }
        params['src_type'] = params['src_type'] || 'web';

        if (!params.version) {
            params.version = 1;
        }
        var url = schema + '://' + encodeURIComponent(ns) + '/' + encodeURIComponent(method) + '?' + toQuery(params);
        openURL(url);

        // 上报 API 调用
        reportAPI(schema, ns, method, argus, sn);
    }

    //////////////////////////////////// util /////////////////////////////////////////////////
    function mapQuery(uri) {
        var i,
            key,
            value,
            index = uri.indexOf("?"),
            pieces = uri.substring(index + 1).split("&"),
            params = {};
        for (i = 0; i < pieces.length; i++) {
            index = pieces[i].indexOf("=");
            key = pieces[i].substring(0, index);
            value = pieces[i].substring(index + 1);
            params[key] = decodeURIComponent(value);
        }
        return params;
    }

    function toQuery(obj) {
        var result = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                result.push(encodeURIComponent(String(key)) + "=" + encodeURIComponent(String(obj[key])));
            }
        }
        return result.join("&");
    }

    function removeQuery(url, keys) {
        var a = document.createElement('a');
        a.href = url;
        var obj;
        if (a.search) {
            obj = mapQuery(String(a.search).substring(1));
            keys.forEach(function(k) {
                delete obj[k];
            });
            a.search = '?' + toQuery(obj);
        }
        if (a.hash) {
            obj = mapQuery(String(a.hash).substring(1));
            keys.forEach(function(k) {
                delete obj[k];
            });
            a.hash = '#' + toQuery(obj);
        }
        url = a.href;
        a = null;

        return url;
    }

    //////////////////////////////////// end util /////////////////////////////////////////////////


    //////////////////////////////////// event /////////////////////////////////////////////////

    // 监听客户端或者其他 webview 抛出的事件
    function addEventListener(eventName, handler) {

        if (eventName === 'qbrowserVisibilityChange') {

            // 兼容旧的客户端事件
            document.addEventListener(eventName, handler, false);
            return true;
        }
        var evtKey = 'evt-' + eventName;
        (aCallbacks[evtKey] = aCallbacks[evtKey] || []).push(handler);
        return true;
    }

    // 移除事件监听, 如果没有传 handler, 就把该事件的所有监听都移除
    function removeEventListener(eventName, handler) {
        var evtKey = 'evt-' + eventName;
        var handlers = aCallbacks[evtKey];
        var flag = false;
        if (!handlers) {
            return false;
        }
        if (!handler) {
            delete aCallbacks[evtKey];
            return true;
        }

        for (var i = handlers.length - 1; i >= 0; i--) {
            if (handler === handlers[i]) {
                handlers.splice(i, 1);
                flag = true;
            }
        }

        return flag;
    }

    // 这个方法时客户端回调页面使用的, 当客户端要触发事件给页面时, 会调用这个方法
    function execEventCallback(eventName /*, data, source*/ ) {
        var evtKey = 'evt-' + eventName;
        var handlers = aCallbacks[evtKey];
        var argus = SLICE.call(arguments, 1);
        if (handlers) {
            handlers.forEach(function(handler) {
                fireCallback(handler, argus, false /*deleteOnExec*/ , true /*execOnNewThread*/ );
            });
        }
    }

    /**
    通知一个事件给客户端webview, 可以用于多个 webview 之间进行通信, 用 domains 来指定需要通知到的域名

    对应的协议为:
        jsbridge://event/dispatchEvent?p={
            event:eventName
            data:{...},
            options: {...}
        }#id

        options:
        {Boolean} [echo]: 当前webview是否能收到这个事件，默认为true
        {Boolean} [broadcast]: 是否广播模式给其他webview，默认为true
        {Array<String>} [domains]: 指定能接收到事件的域名，默认只有同域的webview能接收，支持通配符，比如‘*.qq.com’匹配所有qq.com和其子域、‘*’匹配所有域名。注意当前webview是否能接收到事件只通过echo来控制，这个domains限制的是非当前webview。
    */
    function dispatchEvent(eventName, data, options) {

        var params = {
            event: eventName,
            data: data || {},
            options: options || {}
        };

        if (exports.android && params.options.broadcast === false && exports.compare('5.2') <= 0) {
            // 对 android 的 broadcast 事件进行容错, broadcast 为 false 时, 
            // 没有 Webview会接收到该事件, 但客户端依然要能接收
            // 5.2 已经修复该问题
            params.options.domains = ['localhost'];
            params.options.broadcast = true;
        }

        var url = 'jsbridge://event/dispatchEvent?p=' + encodeURIComponent(JSON.stringify(params) || '');
        openURL(url);

        reportAPI('jsbridge', 'event', 'dispatchEvent');
    }


    //////////////////////////////////// end event /////////////////////////////////////////////////

    // for debug
    exports.__aCallbacks = aCallbacks;
    exports.__aReports = aReports;
    exports.__aSupports = aSupports;

    // for internal use
    exports.__fireCallback = fireCallback;
    exports.__reportAPI = reportAPI;

    exports.build = buildAPI;
    exports.support = supportVersion;
    exports.invoke = invokeClientMethod;
    exports.invokeSchema = invokeSchemaMethod;
    exports.callback = createCallbackName;
    exports.execGlobalCallback = execGlobalCallback;

    // util
    exports.mapQuery = mapQuery;
    exports.toQuery = toQuery;
    exports.removeQuery = removeQuery;

    // event
    exports.addEventListener = addEventListener;
    exports.removeEventListener = removeEventListener;

    exports.execEventCallback = execEventCallback;
    exports.dispatchEvent = dispatchEvent;

    return exports;

});;mqq.build('mqq.device.isMobileQQ', {
    iOS: function(callback) {
        var result = mqq.iOS;
        return callback ? callback(result) : result;
    },
    android: function(callback) {
        var result = mqq.android;
        return callback ? callback(result) : result;
    },
    browser: function(callback) {
        var result = mqq.android || mqq.iOS;
        return callback ? callback(result) : result;
    },
    support: {
        iOS: '4.2',
        android: '4.2'
    }
});;/* iOS 接口兼容 */

mqq.build('mqq.device.systemName', {
    iOS: function(callback) {

        return mqq.invoke('device', 'systemName', callback);
    },
    support: {
        iOS: '4.5'
    }
});

mqq.build('mqq.device.systemVersion', {
    iOS: function(callback) {

        return mqq.invoke('device', 'systemVersion', callback);
    },
    support: {
        iOS: '4.5'
    }
});

mqq.build('mqq.device.model', {
    iOS: function(callback) {

        return mqq.invoke('device', 'model', callback);
    },
    support: {
        iOS: '4.5'
    }
});

mqq.build('mqq.device.modelVersion', {
    iOS: function(callback) {

        return mqq.invoke('device', 'modelVersion', callback);
    },
    support: {
        iOS: '4.5'
    }
});

/* end iOS 接口兼容 */

mqq.build('mqq.device.getDeviceInfo', {

    iOS: function(callback) {

        if (mqq.compare(4.7) >= 0) {
            //4.7把下面這些調用都整合到一個接口上，並提供了一個新的字段identifier來唯一標識設備
            return mqq.invoke('device', 'getDeviceInfo', callback);
        } else {
            var callbackName = mqq.callback(callback, false /*deleteOnExec*/ , true /*execOnNewThread*/ );
            mqq.__reportAPI('web', 'device', 'getClientInfo', null, callbackName);

            var result = {
                'isMobileQQ': this.isMobileQQ(),
                'systemName': this.systemName(),
                'systemVersion': this.systemVersion(),
                'model': this.model(),
                'modelVersion': this.modelVersion()
            };

            if (typeof callback === 'function') {
                mqq.__fireCallback(callbackName, [result]);
            } else {
                return result;
            }
        }
    },
    android: function(callback) {
        if (mqq.compare('4.6') >= 0) {
            var oldCallback = callback;
            callback = function(data) {
                try {
                    data = JSON.parse(data);
                } catch (e) {}
                oldCallback && oldCallback(data);
            };
            mqq.invoke('qbizApi', 'getDeviceInfo', callback);
        } else {
            var ua = navigator.userAgent;
            mqq.__reportAPI('web', 'device', 'getClientInfo');
            callback({
                isMobileQQ: true,
                systemName: 'android',
                systemVersion: function(m) {
                    return m && m[1] || 0;
                }(ua.match(/\bAndroid ([\d\.]+)/i)),
                model: function(m) {
                    return m && m[1] || null;
                }(ua.match(/;\s([^;]+)\s\bBuild\/\w+/i))
            });
        }
    },
    support: {
        iOS: '4.5',
        android: '4.5'
    }
});;/**
 获取客户端信息
 @param {Function} callback(data)
   {Object} data
        - String qqVersion
        - String qqBuild
 */

/* iOS 接口兼容 */
mqq.build('mqq.device.qqVersion', {
    iOS: function(callback) {

        return mqq.invoke('device', 'qqVersion', callback);
    },
    support: {
        iOS: '4.5'
    }
});

mqq.build('mqq.device.qqBuild', {
    iOS: function(callback) {

        return mqq.invoke('device', 'qqBuild', callback);
    },
    support: {
        iOS: '4.5'
    }
});
/*end iOS 接口兼容 */

mqq.build('mqq.device.getClientInfo', {
    iOS: function(callback) {
        var result = {
            'qqVersion': this.qqVersion(),
            'qqBuild': this.qqBuild()
        };
        var callbackName = mqq.callback(callback, false /*deleteOnExec*/ , true /*execOnNewThread*/ );
        mqq.__reportAPI('web', 'device', 'getClientInfo', null, callbackName);
        if (typeof callback === 'function') {
            mqq.__fireCallback(callbackName, [result]);
        } else {
            return result;
        }
    },
    android: function(callback) {
        if (mqq.compare('4.6') >= 0) {
            var oldCallback = callback;
            callback = function(data) {
                try {
                    data = JSON.parse(data);
                } catch (e) {}
                oldCallback && oldCallback(data);
            };
            mqq.invoke('qbizApi', 'getClientInfo', callback);
        } else {
            mqq.__reportAPI('web', 'device', 'getClientInfo');
            callback({
                qqVersion: mqq.QQVersion,
                qqBuild: function(m) {
                    m = m && m[1] || 0;
                    return m && m.slice(m.lastIndexOf('.') + 1) || 0;
                }(navigator.userAgent.match(/\bqq\/([\d\.]+)/i))
            });
        }
    },
    support: {
        iOS: '4.5',
        android: '4.6'
    }
});;/**
 获取当前用户的网络类型
 @param {Function} callback(result)
     - {int} result
        -1: Unknown 未知类型网络
        0: NotReachable
        1: ReachableViaWiFi
        2: ReachableVia2G
        3: ReachableVia3G
        4. 4G   
 */

mqq.build('mqq.device.getNetworkType', {
    iOS: function(callback) {
        var result = mqq.invoke('device', 'networkStatus');
        result = Number(result); // 4.7.1 返回的是字符串数字...
        if (typeof callback === 'function') {
            mqq.__fireCallback(callback, [result], false /*deleteOnExec*/ , true /*execOnNewThread*/ );
        } else {
            return result;
        }
    },
    android: function(callback) {
        if (mqq.compare('4.6') >= 0) {
            mqq.invoke('qbizApi', 'getNetworkType', callback);
        } else {
            mqq.invoke('publicAccount', 'getNetworkState', function(state) {
                // 0: mobile, 1: wifi, 2...: other
                var map = {
                    '-1': 0,
                    '0': 3,
                    '1': 1
                };
                var newState = (state in map) ? map[state] : 4;
                callback(newState);
            });
        }
    },
    support: {
        iOS: '4.5',
        android: '4.6'
    }
});

/* iOS 的接口兼容 */
mqq.build('mqq.device.networkStatus', {
    iOS: mqq.device.getNetworkType,
    support: {
        iOS: '4.5'
    }
});

mqq.build('mqq.device.networkType', {
    iOS: mqq.device.getNetworkType,
    support: {
        iOS: '4.5'
    }
});
/* end iOS 的接口兼容 */;/**
 * 获取当前webview的类型
 * @param  {Function} callback(result)
 *         - {int}  result
 *          1 通用
 *          2 优惠券
 *          3 我的优惠
 *          4 二维码
 *          5 公众帐号(android)
 */

mqq.build('mqq.device.getWebViewType', {
    iOS: function(callback) {

        return mqq.invoke('device', 'webviewType', callback);

    },
    android: function(callback) {
        // 1 通用
        // 2 优惠券 PA Coupon
        // 3 我的优惠 PA MyCoupon
        // 4 二维码 QR
        // 5 公众帐号 PA
        var type = 1,
            ua = navigator.userAgent;
        if (/\bPA\b/.test(ua)) {
            type = 5;
            if (/\bCoupon\b/.test(ua)) {
                type = 2;
            } else if (/\bMyCoupon\b/.test(ua)) {
                type = 3;
            }
        } else if (/\bQR\b/.test(ua)) {
            type = 4;
        }
        mqq.__reportAPI('web', 'device', 'getWebViewType');
        return callback ? callback(type) : type;
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});

/* iOS 接口兼容 */
mqq.build('mqq.device.webviewType', {
    iOS: mqq.device.getWebViewType,
    support: {
        iOS: '4.6'
    }
});
/* end iOS 接口兼容 */;/**
 * 连接wifi
  
 * @param ssid 热点名称
 * @param type 热点加密类型: WPA, WEP, nopass
 * @param password 密码
 * @param callback 回调名称：callback(code):0表示连接成功，1表示操作失败，2表示连接超时, 3参数错误
 */

mqq.build('mqq.device.connectToWiFi', {
    iOS: function(params, callback) {

        callback && callback(mqq.ERROR_NO_SUCH_METHOD);
    },
    android: function(params, callback) {

        params.callback = mqq.callback(callback);
        mqq.invoke('qbizApi', 'connectToWiFi', params);
    },
    support: {
        android: '4.7'
    }
});;/**
 设置屏幕是否常亮
jsbridge://device/setScreenStatus?p=json
入参：status: 1-屏幕常亮  0-屏幕不长亮
返回：{"result":0,"message":"dim"} 当前状态是不长亮  或者 {"result":1,"message":"light"} 表示当前状态是常亮 

 */

mqq.build('mqq.device.setScreenStatus', {
    iOS: function(params, callback) {

        params = params || {};
        params.callback = mqq.callback(callback);
        mqq.invoke('device', 'setScreenStatus', params);

    },
    android: function(params, callback) {

        params = params || {};
        params.callback = mqq.callback(callback);
        mqq.invoke('device', 'setScreenStatus', params);
    },
    support: {
        android: '5.0'
    }
});;/**
 查询单个应用是否已安装
 @param {String} scheme 比如'mqq'
 @return {Boolean}
 */

mqq.build('mqq.app.isAppInstalled', {
    iOS: function(scheme, callback) {

        return mqq.invoke('app', 'isInstalled', {
            'scheme': scheme
        }, callback);
    },
    android: function(identifier, callback) {
        mqq.invoke('QQApi', 'isAppInstalled', identifier, callback);
    },
    support: {
        iOS: '4.2',
        android: '4.2'
    }
});;/**
 批量查询指定应用是否已安装
 @param {Array<String>} schemes 比如['mqq', 'mqqapi']
 @return {Array<Boolean>}
 */

mqq.build('mqq.app.isAppInstalledBatch', {
    iOS: function(schemes, callback) {

        return mqq.invoke('app', 'batchIsInstalled', {
            'schemes': schemes
        }, callback);
    },
    android: function(identifiers, callback) {
        identifiers = identifiers.join('|');

        mqq.invoke('QQApi', 'isAppInstalledBatch', identifiers, function(result) {
            var newResult = [];

            result = (result + '').split('|');
            for (var i = 0; i < result.length; i++) {
                newResult.push(parseInt(result[i]) === 1);
            }

            callback(newResult);
        });
    },
    support: {
        iOS: '4.2',
        android: '4.2'
    }
});;/**
 * 使用 schema(iOS) 或者 包名 (android) 启动一个 app
 */

mqq.build('mqq.app.launchApp', {
    iOS: function(params) {

        mqq.invokeSchema(params.name, 'app', 'launch', params);
    },
    android: function(params) {

        mqq.invoke('QQApi', 'startAppWithPkgName', params.name);
    },
    support: {
        iOS: '4.2',
        android: '4.2'
    }
});;mqq.build('mqq.app.launchAppWithTokens', {
    iOS: function(params, paramsStr) {
        //判断参数是4.6的接口样式
        if (typeof params === 'object') {
            return mqq.invoke('app', 'launchApp', params);
        }
        //判断参数是4.5的接口样式
        return mqq.invoke('app', 'launchApp', {
            'appID': params,
            'paramsStr': paramsStr
        });
    },
    android: function(params) {
        if (mqq.compare('5.2') >= 0) {
            mqq.invoke('QQApi', 'launchAppWithTokens', params);
        } else if (mqq.compare('4.6') >= 0) {
            mqq.invoke('QQApi', 'launchAppWithTokens', params.appID,
                params.paramsStr, params.packageName, params.flags || params.falgs || 0);
        } else {
            mqq.invoke('QQApi', 'launchApp', params.appID,
                params.paramsStr, params.packageName);
        }
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
 发送趣味表情
 @param type 业务类型，一起玩为funnyFace
 @param sessionType 会话类型，1（群）、2（讨论组）、3（C2C聊天）
 @param gcode 会话ID，针对群，这里是外部可见的群号
 @param guin 针对群，这里是内部群号。讨论组和C2C类型这里指定为0
 @param faceID 标识特定表情，到connect.qq.com上申请
 */

mqq.build('mqq.app.sendFunnyFace', {
    iOS: function(params) {
        mqq.invoke('app', 'sendFunnyFace', params);
    },
    android: function(params) {
        mqq.invoke('qbizApi', 'sendFunnyFace', params.type, params.sessionType,
            params.gcode, params.guin, params.faceID);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
    @param {Object}
    String url
    int [target]
    String [relatedAccount]
    String [relatedAccountType]

    @return {void}

    target:
    0: 在当前webview打开
    1: 在新webview打开
    2: 在外部浏览器上打开（iOS为Safari,Android为系统默认浏览器）

    style（只对target=1有效）:
    0: 顶部控制栏模式（默认）
    1: 顶部控制栏无分享入口
    2: 底部工具栏模式（顶部的bar依然会存在）
    3: 底部工具栏无分享入口（顶部的bar依然会存在）

    relatedAccount和relatedAccountType用于传入与该webview相关的帐号和帐号类型，比如传入公众帐号可在分享菜单里显示相关的分享选项（同样只对target=1有效）：
    relatedAccountType:
    ‘officalAccount’：公众帐号

    @example
    mqq.ui.openUrl({
       url: ‘http://web.qq.com’,
       target: 1,
       style: 3
    });
*/

mqq.build('mqq.ui.openUrl', {
    iOS: function(params) {
        if (!params) {
            params = {};
        }
        switch (params.target) {
            case 0:
                window.open(params.url, '_self');
                break;
            case 1:
                params.styleCode = ({
                    1: 4,
                    2: 2,
                    3: 5
                })[params.style] || 1;
                mqq.invoke('nav', 'openLinkInNewWebView', {
                    'url': params.url,
                    'options': params
                });
                break;
            case 2:
                mqq.invoke('nav', 'openLinkInSafari', {
                    'url': params.url
                });
                break;
        }
    },
    android: function(params) {
        if (params.target === 2) {
            if (mqq.compare('4.6') >= 0) {
                mqq.invoke('publicAccount', 'openInExternalBrowser', params.url);
            } else if (mqq.compare('4.5') >= 0) {
                mqq.invoke('openUrlApi', 'openUrl', params.url);
            } else {
                // location.href = params.url;
            }
        } else if (params.target === 1) {
            if (!params.style) {
                params.style = 0;
            }
            if (mqq.compare('4.6') >= 0) {
                mqq.invoke('qbizApi', 'openLinkInNewWebView', params.url, params.style);
            } else if (mqq.compare('4.5') >= 0) {
                mqq.invoke('publicAccount', 'openUrl', params.url);
            } else {
                location.href = params.url;
            }
        } else {
            location.href = params.url;
        }
    },
    browser: function(params) { // 兼容普通浏览器的调用
        if (params.target === 2) {
            window.open(params.url, '_blank');
        } else {
            location.href = params.url;
        }
    },
    support: {
        iOS: '4.5',
        android: '4.6',
        browser: '0'
    }
});;/**
 打开指定的viewController
 @param {Object} options
     - {String} name viewController的名字，可取如下值：
     - 'ChatAvatarSetting'   聊天气泡
     - 'MarketFace'          表情商城
     - 'Coupon'              优惠券
     - 'UserSummary'         用户自己的资料页面
 */
;
(function() {

    var IOS_VIEW_MAP = {

    };

    var AND_VIEW_MAP = {
        'Abount': 'com.tencent.mobileqq.activity.AboutActivity',

        'GroupTribePublish': 'com.tencent.mobileqq.troop.activity.TroopBarPublishActivity',
        'GroupTribeReply': 'com.tencent.mobileqq.troop.activity.TroopBarReplyActivity',
        'GroupTribeComment': 'com.tencent.mobileqq.troop.activity.TroopBarCommentActivity'
    };


    mqq.build('mqq.ui.openView', {
        iOS: function(params) {

            params.name = IOS_VIEW_MAP[params.name] || params.name;
            if (typeof params.onclose === 'function') {
                params.onclose = mqq.callback(params.onclose);
            }
            mqq.invoke('nav', 'openViewController', params);
        },
        android: function(params) {

            params.name = AND_VIEW_MAP[params.name] || params.name;
            if (typeof params.onclose === 'function') {
                params.onclose = mqq.callback(params.onclose);
            }
            if (mqq.compare('5.0') > -1) {
                mqq.invoke('ui', 'openView', params);
            } else {
                mqq.invoke('publicAccount', 'open', params.name);
            }
        },
        support: {
            iOS: '4.5',
            android: '4.6'
        }
    });

})();;/**
    返回打开webview的上一层view 
*/

mqq.build('mqq.ui.popBack', {
    iOS: function() {
        mqq.invoke('nav', 'popBack');
    },
    android: function() {
        mqq.invoke('publicAccount', 'close');
    },
    support: {
        iOS: '4.5',
        android: '4.6'
    }
});;/**
     调用之后关闭当前WebView，返回到AIO聊天窗口
     @param 无
     @returns 无
 */

mqq.build('mqq.ui.returnToAIO', {
    iOS: function() {
        mqq.invoke('nav', 'returnToAIO');
    },
    android: function() {
        mqq.invoke('qbizApi', 'returnToAIO');
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
 设置webview右上角按钮的标题和回调
 */

mqq.build('mqq.ui.setActionButton', {
    iOS: function(params, callback) {
        if (typeof params !== 'object') {
            params = {
                title: params
            };
        }

        var callbackName = mqq.callback(callback, false /*deleteOnExec*/ , true /*execOnNewThread*/ );
        params.callback = callbackName;
        mqq.invoke('nav', 'setActionButton', params);
    },
    android: function(params, callback) {
        var callbackName = mqq.callback(callback);

        if (params.hidden) {
            params.title = '';
        }

        if (mqq.compare('4.7') >= 0) {
            params.callback = callbackName;
            mqq.invoke('ui', 'setActionButton', params);
        } else {
            mqq.invoke('publicAccount', 'setRightButton', params.title, '', callbackName || null);
        }
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;mqq.build('mqq.ui.setLoading', {
    iOS: function(params) {

        if (params) {
            //文档上要求如果visible没有值，不去改变菊花。
            if (params.visible === true) {
                mqq.invoke('nav', 'showLoading');
            } else if (params.visible === false) {
                mqq.invoke('nav', 'hideLoading');
            }

            if (params.color) {
                mqq.invoke('nav', 'setLoadingColor', {
                    'r': params.color[0],
                    'g': params.color[1],
                    'b': params.color[2]
                });
            }
        }
    },
    android: function(params) {
        if ('visible' in params) {
            if (params.visible) {
                mqq.invoke('publicAccount', 'showLoading');
            } else {
                mqq.invoke('publicAccount', 'hideLoading');
            }
        }
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
弹出一个确认框
@param {Object}
     - String title
     - String text
     - Boolean [needOkBtn] //是否显示确认按钮，默认true
     - Boolean [needCancelBtn] //是否显示取消按钮，默认true
@param {Function} [callback(result)]
     - result.button == 0, //点击了确认按钮
     - result.button == 1,//点击了取消按钮
*/

mqq.build('mqq.ui.showDialog', {
    iOS: function(params, callback) {
        if (params) {
            params.callback = mqq.callback(callback, true /*deleteOnExec*/ , true /*execOnNewThread*/ );
            params.title = params.title + '';
            params.text = params.text + '';
            if (!('needOkBtn' in params)) {
                params.needOkBtn = true;
            }
            if (!('needCancelBtn' in params)) {
                params.needCancelBtn = true;
            }
            mqq.invoke('nav', 'showDialog', params);
        }
    },
    android: function(params, callback) {
        if (mqq.compare('4.8.0') >= 0) {
            params.callback = mqq.callback(callback, true);
            mqq.invoke('ui', 'showDialog', params);
        } else {
            var okCbName = '',
                cancelCbName = '';

            if (callback) {

                okCbName = mqq.callback(function() {
                    callback({
                        button: 0
                    });
                }, true);
                cancelCbName = mqq.callback(function() {
                    callback({
                        button: 1
                    });
                }, true);

                okCbName += '()';
                cancelCbName += '()';
            }
            params.title = params.title + '';
            params.text = params.text + '';
            if (!('needOkBtn' in params)) {
                params.needOkBtn = true;
            }
            if (!('needCancelBtn' in params)) {
                params.needCancelBtn = true;
            }
            mqq.invoke('publicAccount', 'showDialog', params.title, params.text,
                params.needOkBtn, params.needCancelBtn, okCbName, cancelCbName);
        }
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
 推入展示指定公众帐号详情信息的view controller，或者公众帐号AIO
 @param {String|Object} param uin or {'uin':uin, ...}
 */


mqq.build('mqq.ui.showOfficalAccountDetail', {
    iOS: function(param) {
        var parameter = (typeof param == 'object' ? param : {
            'uin': param
        });
        mqq.invoke('nav', 'showOfficalAccountDetail', parameter);

    },
    android: function(params) {
        if (mqq.compare('4.6') >= 0) {
            mqq.invoke('publicAccount', 'viewAccount', params.uin, params.showAIO);
        } else {
            mqq.invoke('publicAccount', 'viewAccount', params.uin);
        }
    },
    support: {
        iOS: '4.5',
        android: '4.6'
    }
});;//查看指定uin的个人资料卡

mqq.build('mqq.ui.showProfile', {
    iOS: function(params) {
        if (mqq.compare('4.7') >= 0) {

            mqq.invoke('nav', 'showProfile', params);
        } else if (mqq.compare('4.6') >= 0 && !params.uinType) {
            // 4.6 版本不支持 type 参数
            mqq.invoke('nav', 'showProfile', params);
        } else { // 低版本使用 schema 接口

            if (params.uinType === 1) {
                params['card_type'] = 'group';
            }
            mqq.invokeSchema('mqqapi', 'card', 'show_pslcard', params);
        }
    },
    android: function(params) {
        if (mqq.compare('4.7') >= 0) {

            mqq.invoke('publicAccount', 'showProfile', params);
        } else if (mqq.compare('4.6') >= 0 && !params.uinType) {
            // 4.6 版本不支持 type 参数
            mqq.invoke('publicAccount', 'showProfile', params.uin);
        } else { // 低版本使用 schema 接口

            if (params.uinType === 1) {
                params['card_type'] = 'group';
            }
            mqq.invokeSchema('mqqapi', 'card', 'show_pslcard', params);
        }
    },
    support: {
        iOS: '4.5',
        android: '4.5'
    }
});;/**
* 
刷新客户端显示的网页标题

在iOS中，网页标题动态改变后，显示WebView的导航栏标题不会改变，请调用refreshTitle来手动刷新。Android不需要。

 */

mqq.build('mqq.ui.refreshTitle', {
    iOS: function() {
        mqq.invoke('nav', 'refreshTitle');
    },
    support: {
        iOS: '4.6'
    }
});;/**
    打开QQ商家资料卡
     @param {Object} params
          - {String} uin 企业QQ账号uin
          - {String} sigt sigt标识
*/

mqq.build('mqq.ui.showEQQ', {
    iOS: function(params) {
        mqq.invoke('nav', 'showBusinessAccountProfile', params);
    },
    android: function(params) {
        mqq.invoke('eqq', 'showEQQ', params);
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;/**
    唤起扫一扫来扫描二维码 
*/

mqq.build('mqq.ui.scanQRcode', {
    iOS: function(params, callback) {
        params = params || {};
        if (callback) {
            params.callback = mqq.callback(callback);
        }
        mqq.invoke('ui', 'scanQRcode', params);
    },
    android: function(params, callback) {
        params = params || {};
        if (callback) {
            params.callback = mqq.callback(callback);
        }
        mqq.invoke('ui', 'scanQRcode', params);
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;/**
 弹出ActionSheet

@param {Object}
String [title] //标题
String [cancel] //取消按钮标题
Array[ ] items
Function onclick(int type, int index)
type
0: 普通item
1: 取消按钮或空白区域
index 从0开始

@example
mqq.invoke(‘ui’, ‘showActionSheet’, {
    title: ‘ActionSheet标题’,
    cancel: ‘取消’,
    items: [‘1’, ‘2’, ‘3’],
    onclick: mqq.callback(function(type, index){
        console.log(type, index);
    });
});

 */
mqq.build('mqq.ui.showActionSheet', {
    iOS: function(params, callback) {
        if (callback) {
            params.onclick = mqq.callback(callback, false /*deleteOnExec*/ , true /*execOnNewThread*/ );
        }
        return mqq.invoke('ui', 'showActionSheet', params);
    },
    android: function(params, callback) {
        if (callback) {
            params.onclick = mqq.callback(callback);
        }
        return mqq.invoke('ui', 'showActionSheet', params);
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;/**
音乐分享
@param {Object}
     - String title
     - String desc
     - String share_url
     - String image_url
     - String audio_url
@param {Function} [callback(result)]
     - result
*/

mqq.build('mqq.ui.shareAudio', {
    iOS: function(params, callback) {
        var callbackName = mqq.callback(callback, true);
        if (params.desc) {
            params.desc = params.desc.length > 50 ? (params.desc.substring(0, 50) + '...') : params.desc;
        }
        mqq.invoke('nav', 'shareAudio', {
            'params': params,
            'callback': callbackName
        });
    },
    android: function(params, callback) {
        params['req_type'] = 2;
        if (callback) {
            params.callback = mqq.callback(callback, true);
        }
        if (params.desc) {
            params.desc = params.desc.length > 50 ? (params.desc.substring(0, 50) + '...') : params.desc;
        }
        mqq.invoke('QQApi', 'shareMsg', params);
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;/**
使用 native分享接口, 分享内容给好友/群
@param {Object}
     - String title
     - String desc
     - String share_url
     - String image_url
@param {Function} [callback(result)]
     - result
*/

mqq.build('mqq.ui.shareMessage', {
    iOS: function(params, callback) {

        if (!('needPopBack' in params) && ('back' in params)) {
            params.needPopBack = params.back;
        }
        if (params['share_url']) {
            params['share_url'] = mqq.removeQuery(params['share_url'], ['sid', '3g_sid']);
        }
        if (params.desc) {
            params.desc = params.desc.length > 50 ? (params.desc.substring(0, 50) + '...') : params.desc;
        }
        params['callback'] = mqq.callback(callback, true /*deleteOnExec*/ , true);
        mqq.invoke('nav', 'shareURLWebRichData', params);
    },
    android: function(params, callback) {
        if (params['share_url']) {
            params['share_url'] = mqq.removeQuery(params['share_url'], ['sid', '3g_sid']);
        }
        params['callback'] = mqq.callback(function(result) {
            callback && callback({
                retCode: result ? 0 : 1
            });
        }, true /*deleteOnExec*/ );
        if (params.desc) {
            params.desc = params.desc.length > 50 ? (params.desc.substring(0, 50) + '...') : params.desc;
        }

        if (params['share_type'] && (params['share_type'] === 2 || params['share_type'] === 3) && mqq.compare('5.2') < 0 && mqq.support('mqq.app.isAppInstalled')) {

            // 先检查有没有安装微信, ios不用, ios会自己弹出一个 toast 提示
            // 5.2 android 也会自己检查
            var unsupportTips = '您尚未安装微信，不可使用此功能';
            mqq.app.isAppInstalled('com.tencent.mm', function(result) {
                if (result) {
                    mqq.invoke('QQApi', 'shareMsg', params);
                } else if (mqq.support('mqq.ui.showTips')) {
                    mqq.ui.showTips({
                        text: unsupportTips
                    });
                } else {
                    alert(unsupportTips);
                }

            });

        } else {
            mqq.invoke('QQApi', 'shareMsg', params);
        }
    },
    support: {
        iOS: '4.7.2',
        android: '4.7.2'
    }
});;/**
 * 以公众账号的身份调用native分享接口
 * @param {String} oaUin 公众账号uin
 * @param {String} title 消息标题
 * @param {String} summary 消息摘要
 * @param {String} targetUrl 点击消息后的跳转url
 * @param {String} imageUrl 消息左侧缩略图url
 * @param {String} [sourceName] 消息来源名称，默认为空，直接读取oaUin对应的公众账号名称
 * @param {Boolean} [back] 发送消息之后是否返回到web页面，默认NO，直接到AIO
 * @param {Function} [callback(result)] - result.ret == 0, //
 *        用户点击发送，完成整个分享流程 result.ret == 1, // 用户点击取消，中断分享流程
 *
 * @example
 * mqq.ui.shareRichMessage({
 *      oaUin: 'xxx',
 *      title: 'xxx',
 *      summary: 'xxx',
 *      // ...
 * }, function(result){
 *      // do something
 * })
 *
 *
 */
mqq.build('mqq.ui.shareRichMessage', {
    iOS: function(params, callback) {

        // 参数容错
        params.puin = params.oaUin;
        params.desc = params.desc || params.summary;

        if (params['share_url']) {
            params['share_url'] = mqq.removeQuery(params['share_url'], ['sid', '3g_sid']);
        }
        if (params.desc) {
            params.desc = params.desc.length > 50 ? (params.desc.substring(0, 50) + '...') : params.desc;
        }
        params.callback = mqq.callback(callback);
        mqq.invoke('nav', 'officalAccountShareRichMsg2QQ', params);
    },
    android: function(params, callback) {

        // 参数容错
        params.puin = params.oaUin;
        params.desc = params.desc || params.summary;
        if (params.desc) {
            params.desc = params.desc.length > 50 ? (params.desc.substring(0, 50) + '...') : params.desc;
        }
        if (mqq.compare('5.0') >= 0) {
            // 兼容依旧传 targetUrl 的调用
            params['share_url'] = params['share_url'] || params.targetUrl;
            params['image_url'] = params['image_url'] || params.imageUrl;

            if (params['share_url']) {
                params['share_url'] = mqq.removeQuery(params['share_url'], ['sid', '3g_sid']);
            }
            params.callback = callback ? mqq.callback(function(result) {
                callback({
                    ret: result ? 0 : 1
                });
            }) : null;

            mqq.invoke('QQApi', 'shareMsg', params);
        } else {

            params.targetUrl = params.targetUrl || params['share_url'];
            params.imageUrl = params.imageUrl || params['image_url'];

            if (params['targetUrl']) {
                params['targetUrl'] = mqq.removeQuery(params['targetUrl'], ['sid', '3g_sid']);
            }
            params.callback = mqq.callback(callback);
            mqq.invoke('publicAccount', 'officalAccountShareRichMsg2QQ', params);
        }
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});

// 兼容旧的归类
mqq.build('mqq.data.shareRichMessage', {
    iOS: mqq.ui.shareRichMessage,
    android: mqq.ui.shareRichMessage,
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;/*
 检查页面是否可见，若当前显示的是其他view或应用推到了后台，接口返回false
*/

mqq.build('mqq.ui.pageVisibility', {
    iOS: function(callback) {
        mqq.invoke('ui', 'pageVisibility', callback);
    },
    android: function(callback) {
        mqq.invoke('ui', 'pageVisibility', callback);
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;//设置webview被关闭前的回调, 回调将会替换原来的行为

mqq.build('mqq.ui.setOnCloseHandler', {
    iOS: function(callback) {
        mqq.invoke('ui', 'setOnCloseHandler', {
            'callback': mqq.callback(callback, false/*deleteOnExec*/, true/*execOnNewThread*/)
        });
    },
    android: function(callback) {
        mqq.invoke('ui', 'setOnCloseHandler', {
            'callback': mqq.callback(callback)
        });
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;//打开指定聊天窗口
/*
    ios 貌似不支持 attach_content
    mqq.ui.openAIO({
        uin: '2202055354',
        chat_type: 'c2c',
        attach_content: Base64.encode('你好呀')
    });

*/


mqq.build('mqq.ui.openAIO', {
    iOS: function(params) {

        mqq.invokeSchema('mqqapi', 'im', 'chat', params);
    },
    android: function(params) {

        mqq.invokeSchema('mqqapi', 'im', 'chat', params);
    },
    support: {
        iOS: '4.5',
        android: '4.5'
    }
});;// 模块：ui
// 方法名：showTips
// 说明：弹出文本的toast提示，2秒后消失。
// 参数：
// @param {Object} params 
// {String} text 要提示的文字内容 


// 示例：
// mqq.invoke('ui','showTips', {text: 'hello'});


mqq.build('mqq.ui.showTips', {
    iOS: function(params) {

        mqq.invoke('ui', 'showTips', params);
    },
    android: function(params) {

        mqq.invoke('ui', 'showTips', params);
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;/**
 配置webview的行为
 @param {Object} 配置项，支持如下配置：
[swipeBack]     是(1)否(0)支持右划关闭手势
[actionButton]  是(1)否(0)显示右上角按钮

 */

mqq.build('mqq.ui.setWebViewBehavior', {
    iOS: function(params) {
        mqq.invoke("ui", "setWebViewBehavior", params);
    },
    android: function(params) {
        mqq.invoke("ui", "setWebViewBehavior", params);
    },
    support: {
        iOS: '4.7.2',
        android: '5.1'
    }
});;/**
设置web页面分享的监听事件
用户点击右上角的弹出菜单后, 点击了分享时会通知页面
**/

mqq.build('mqq.ui.setOnShareHandler', {
    iOS: function(callback){
        mqq.invoke('nav', 'addWebShareListener', {'callback': mqq.callback(callback, false/*deleteOnExec*/, true/*execOnNewThread*/)});
    },
    android: function(callback){
        mqq.invoke('ui', 'setOnShareHandler', {'callback': mqq.callback(callback, false/*deleteOnExec*/, true/*execOnNewThread*/)});
    },
    support: {
        iOS: '4.7.2',
        android: '4.7.2'
    }
});;/**
 关闭相邻webview

@example
mqq.ui.closeWebViews({
    //关闭模式，有如下几种模式：
    //0: 默认模式，关闭所有相邻webview
    //1: 关闭在当前webview之上的所有相邻webview
    //2: 关闭在当前webview之下的所有相邻webview
    mode:int,

    //是否不关闭当前webview，默认为false（会关闭当前webview）
    //当前webview指调用本接口的webview，不一定是当前可见的webview
    exclude:boolean
});

 */
mqq.build('mqq.ui.closeWebViews', {
    iOS: function(params) {
        mqq.invoke('ui', 'closeWebViews', params || {});
    },
    android: function(params) {
        mqq.invoke('ui', 'closeWebViews', params || {});
    },
    support: {
        iOS: '5.2',
        android: '5.2'
    }
});;/**
 批量获取当前用户指定应用的openid
 @param {Array<String>} appID数组
 @param {Object} options
 @param {Function/String} callback
 @param {Object} context
 */

mqq.build('mqq.data.batchFetchOpenID', {

    iOS: function(opt, callback) {
        var appIDs = opt.appIDs;

        mqq.data.fetchJson({
            url: 'http://cgi.connect.qq.com/api/get_openids_by_appids',
            params: {
                'appids': JSON.stringify(appIDs)
            }
        }, callback);
    },
    android: function(opt, callback) {
        var appIDs = opt.appIDs;

        mqq.data.fetchJson({
            url: 'http://cgi.connect.qq.com/api/get_openids_by_appids',
            params: {
                'appids': JSON.stringify(appIDs)
            }
        }, callback);
    },
    support: {
        iOS: '4.5',
        android: '4.6'
    }
});;/**
 通过客户端接口拉取数据
 @param {String} url
 @param {Object} params 请求参数
 @param {Object} options 请求配置
     - method: 'GET'/'POST', 默认为GET
     - timeout: 超时时间，默认无超时时间
 @param {Function/String} 回调函数（或该函数的名字），参数格式：function(responseText, context, httpStatusCode){ ... }
 @param {Object} context 会原样传入到callback内
 */

mqq.build('mqq.data.sendRequest', {
    iOS: function(opt, callback) {
        var url = opt.url,
            params = opt.params,
            options = opt.options || {},
            context = opt.context;
        //query parameters
        params['_t'] = +new Date();

        //send request to url via client
        mqq.invoke('data', 'fetchJson', {
            'method': options.method || 'GET',
            // 'timeout': options.timeout || -1,
            'options': options,
            'url': url,
            'params': mqq.toQuery(params),
            'callback': mqq.callback(callback),
            'context': JSON.stringify(context)
        });
    },
    android: function(opt, callback) {

        // var options = opt.options || {};
        // var method = options.method || 'GET';
        opt.callback = mqq.callback(callback);

        mqq.invoke('data', 'sendRequest', opt);
    },
    support: {
        iOS: '4.5',
        android: '4.7'
    }
});;/**
 拉取json数据
 @param {String} url
 @param {Object} params 请求参数
 @param {Object} options 请求配置
     - method: 'GET'/'POST', 默认为GET
     - timeout: 超时时间，默认无超时时间
 @param {Function/String} 回调函数（或该函数的名字），参数格式：function(responseText, context, httpStatusCode){ ... }
 @param {Object} context 会原样传入到callback内
 */
(function() {


    // fetchJson 的回调
    var requestMap = {};
    var UUIDSeed = 1;

    function createUUID() {
        return 'UID_' + (++UUIDSeed);
    }

    // 这个全局回调是 for android的
    window['clientCallback'] = function(result, callbackToken) {
        // alert('callback: ' + result + '\n token: ' + callbackToken)
        var options = requestMap[callbackToken];
        if (!options) {
            console.log('this getJson no callbackToken!');
            return;
        }
        if (options.callback) {
            clearTimeout(options.timer);
            if (typeof result === 'string') {
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    result = null;
                }
            }
            options.callback(result, options.context || window, 200);
            options.callback = null;
        }
    };

    mqq.build('mqq.data.fetchJson', {
        iOS: function(opt, callback) {
            var url = opt.url,
                params = opt.params || {},
                options = opt.options || {},
                context = opt.context;
            //query parameters
            params['_t'] = +new Date();

            //callback function
            var callbackName = callback ? mqq.callback(function(result, ctx, statusCode) {
                if (typeof result === 'string') {
                    try {
                        result = JSON.parse(result);
                    } catch (e) {
                        result = null;
                    }
                }
                callback(result, ctx, statusCode);
            }, true /*deleteOnExec*/ , true /*execOnNewThread*/ ) : null;
            //send request to url via client
            mqq.invoke('data', 'fetchJson', {
                'method': options['method'] || 'GET',
                'timeout': options['timeout'] || -1,
                'options': options,
                'url': url,
                'params': mqq.toQuery(params),
                'callback': callbackName,
                'context': JSON.stringify(context)
            });
        },
        android: function(opt, callback) {

            var options = opt.options || {};
            var method = options.method || 'GET';
            var strParams = {
                param: opt.params,
                method: method
            };
            strParams = JSON.stringify(strParams);

            var callbackToken = createUUID();
            // alert(strParams + '\n' +callbackToken);
            opt.callback = callback;
            requestMap[callbackToken] = opt;
            if (options.timeout) {
                opt.timer = setTimeout(function() {
                    if (opt.callback) {
                        opt.callback('timeout', opt.context || window, 0);
                        opt.callback = null;
                    }
                }, options.timeout);
            }
            mqq.invoke('publicAccount', 'getJson', opt.url,
                strParams, '', callbackToken);
        },
        support: {
            iOS: '4.5',
            android: '4.6'
        }
    });
})();;/*
    @param params {Object}
    callid: String    // 用来标示请求id, 返回时把该值传回
    host: String  // 如果host不为空, 且是该页面的域名的父域名, 则往host写, 如果为空则往页面的域名写, 其他为错误
    path: String  // 区分业务
    key: String     // 数据对应的key
*/

mqq.build('mqq.data.readH5Data', {
    iOS: function(params, callback) {

        var callbackName = callback ? mqq.callback(callback) : null;
        mqq.invoke('data', 'readWebviewBizData', {
            'callback': callbackName,
            'params': params
        });
    },
    android: function(params, callback) {
        params = JSON.stringify(params || {});
        mqq.invoke('publicAccount', 'readH5Data', params,
            mqq.callback(function(result) {

                if (result && result.response && result.response.data) {
                    var data = result.response.data;
                    data = data.replace(/\\/g, ""); //android读出来的数据有些时候会莫名多一些"/"，真是醉了。。。
                    data = decodeURIComponent(data); // android 存入的数据会 encode 一次, 这里要 decode
                    result.response.data = data;
                }
                callback(result);
            }, true));
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/*
  @param params {Object}
  callid: String    // 用来标示请求id, 返回时把该值传回
  host: String  // 如果host不为空, 且是该页面的域名的父域名, 则往host写, 如果为空则往页面的域名写, 其他为错误
  path: String  // 区分业务
  key: String     // 数据对应的key
  data: String    // 数据
*/

mqq.build('mqq.data.writeH5Data', {
    iOS: function(params, callback) {

        // var callbackName = callback ? mqq.callback(callback) : null;
        // 新增默认callback, 以免IOS下crash 20140928
        var callbackName = mqq.callback( callback || function(){} );
        // 兼容对象格式数据 20140928
        var data = params.data;
        if ( data && typeof data === "object" ) {
            // 兼容对象格式数据 20140928
            params.data = JSON.stringify(data);
        }
        mqq.invoke('data', 'writeWebviewBizData', {
            'callback': callbackName,
            'params': params
        });
    },
    android: function(params, callback) {
        var data = params.data;
        if (data) {
            // 兼容对象格式数据 20140928
            if ( typeof data === "object" ) data = JSON.stringify(data);
            params.data = encodeURIComponent(data); // android 会对 \ 进行多次转义, 这里要先 encode
        }
        mqq.invoke('publicAccount', 'writeH5Data', params,
            // 新增默认callback, 以免android下写入不成功 20140928
            mqq.callback(callback||function(){}, true));
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/*
    @param params {Object}
    callid: String    // 用来标示请求id, 返回时把该值传回
    host: String    //如果host不为空, 且是该页面的域名的父域名, 则往host读, 如果为空则往页面的域名读, 其他为错误
    path: String  // 区分业务, 为空则报错.
    key: String       // 数据对应的key, 如果为空则删除整个path
*/
mqq.build('mqq.data.deleteH5Data', {
    iOS: function(params, callback) {

        var callbackName = callback ? mqq.callback(callback) : null;
        mqq.invoke('data', 'deleteWebviewBizData', {
            'callback': callbackName,
            'params': params
        });
    },
    android: function(params, callback) {
        params = JSON.stringify(params || {});
        mqq.invoke('publicAccount', 'deleteH5Data', params,
            mqq.callback(callback, true));
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/*
    @param params {Object}
    callid: String    // 用来标示请求id, 返回时把该值传回
    host: String    //如果host不为空, 且是该页面的域名的父域名, 则清除该host, 如果为空则清除页面的域名, 其他为错误
*/

mqq.build('mqq.data.deleteH5DataByHost', {
    iOS: function(params, callback) {
        var callbackName = callback ? mqq.callback(callback) : null;
        mqq.invoke('data', 'deleteWebviewBizData', {
            'callback': callbackName,
            'delallhostdata': 1,
            'params': params
        });
    },
    android: function(params, callback) {
        params = JSON.stringify(params || {});
        mqq.invoke('publicAccount', 'deleteH5DataByHost', params,
            mqq.callback(callback, true));
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/*
    @param {Object}
    - String callid
    - String url
*/

mqq.build('mqq.data.getUrlImage', {
    iOS: function(params, callback) {

        var callbackName = callback ? mqq.callback(callback, false /*deleteOnExec*/ , true /*execOnNewThread*/ ) : null;
        mqq.invoke('data', 'getUrlImage', {
            'callback': callbackName,
            'params': params
        });
    },
    android: function(params, callback) {
        params = JSON.stringify(params || {});
        mqq.invoke('publicAccount', 'getUrlImage', params,
            mqq.callback(callback));
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/*
    @param params {Object}
    share_url: String     页面可以定制分享出去的url，去掉某些敏感参数等，如空，用页面url
    title: String         分享的标题,必填
    desc: String          分享的摘要,必填
    image_url: String     图片URL
*/

mqq.build('mqq.data.setShareInfo', {
    iOS: function(params, callback) {
        if (params['share_url']) {
            params['share_url'] = mqq.removeQuery(params['share_url'], ['sid', '3g_sid']);
        }
        if (params.desc) {
            params.desc = params.desc.length > 50 ? (params.desc.substring(0, 50) + '...') : params.desc;
        }
        return mqq.invoke('data', 'setShareInfo', {
            'params': params
        }, callback);
    },
    android: function(params, callback) {
        if (params['share_url']) {
            params['share_url'] = mqq.removeQuery(params['share_url'], ['sid', '3g_sid']);
        }
        if (params.desc) {
            params.desc = params.desc.length > 50 ? (params.desc.substring(0, 50) + '...') : params.desc;
        }
        mqq.invoke('QQApi', 'setShareInfo', params, callback);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/*
    @param url: String    // 设置什么，webview分享出去的就是什么url
*/



mqq.build('mqq.data.setShareURL', {
    iOS: function(params, callback) {
        if (params.url) {
            params['url'] = mqq.removeQuery(params['url'], ['sid', '3g_sid']);
        }
        mqq.invoke('data', 'setShareURL', params, callback);
    },
    android: function(params, callback) {

        if (params.url) {
            params['url'] = mqq.removeQuery(params['url'], ['sid', '3g_sid']);
        }

        if (mqq.compare('4.6') < 0) {
            callback(false);
        } else {
            mqq.invoke('QQApi', 'setShareURL', params.url, callback);
        }
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
    开始接收游戏状态变更的PUSH消息
    @param {Object} params
     - {Number} appID
    @param {Function} callback 收到push消息后调用callback传数据给js的回调
*/

mqq.build('mqq.data.startSyncData', {
    iOS: function(params, callback) {

        var callbackName = mqq.callback(callback);
        if (callbackName) {
            params.callback = callbackName;
            mqq.invoke('data', 'startSyncData', params);
        }

    },
    android: function(params, callback) {
        var name = mqq.callback(callback);
        mqq.invoke('qbizApi', 'startSyncData', params.appID, name);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
    停止接收游戏状态变更的PUSH消息
    @param {Object} params
     - {Number} appID
*/

mqq.build('mqq.data.stopSyncData', {
    iOS: function(params) {
        mqq.invoke('data', 'stopSyncData', params);
    },
    android: function(params) {

        mqq.invoke('qbizApi', 'stopSyncData', params.appID, name);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
客户端的上报接口, 上报到后台根据type进行分发, type需要跟后台约定, 可以联系 mapleliang

 */

mqq.build('mqq.data.pbReport', {
    iOS: function(type, data) {

        mqq.invoke('data', 'pbReport', {
            'type': String(type),
            'data': data
        });
    },
    android: function(type, data) {
        
        mqq.invoke('publicAccount', 'pbReport', String(type), data);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
 * 返回 创建 webview 到 WebView 开始加载url间的时间点
 * 因为 webviwe 创建之后还要做一堆处理, 中间是需要耗时的, 这段耗时单纯 web无法统计
 */

mqq.build('mqq.data.getPageLoadStamp', {
    iOS: function(callback) {

        mqq.invoke('data', 'getPageLoadStamp', {
            callback: mqq.callback(callback)
        });
    },
    android: function(callback) {

        mqq.invoke('publicAccount', 'getPageLoadStamp', mqq.callback(callback));
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/*
    @param uin: String    // 公众帐号的 uin
*/

mqq.build('mqq.data.isFollowUin', {
    iOS: function(params, callback) {
        params.callback = mqq.callback(callback);
        mqq.invoke('data', 'isFollowUin', params);
    },
    android: function(params, callback) {
        mqq.invoke('publicAccount', 'isFollowUin', params, mqq.callback(callback));
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;/*
    @param uin: String    // 公众帐号的 uin
*/

mqq.build('mqq.data.followUin', {
    iOS: function(params, callback) {
        params.callback = mqq.callback(callback);
        mqq.invoke('data', 'followUin', params);
    },
    android: function(params, callback) {
        mqq.invoke('publicAccount', 'followUin', params, mqq.callback(callback));
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;mqq.build('mqq.data.getUserInfo', {
    iOS: function(callback) {

        return mqq.invoke('data', 'userInfo', callback);
    },
    android: function(callback) {
        mqq.invoke('data', 'userInfo', {
            callback: mqq.callback(callback)
        });
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;/**
查询本地是否有离线缓存 
@param {Object} params
     - {Number} bid 
@param {Function} callback(ret)
     - {Number} ret          //有本地缓存1，无0.
@param {Function} callback(localVersion)
     - {Number} localVersion //本地缓存版本号

关于callback中的本地缓存版本号的特殊值：
    -1: 无本地缓存。
     0: 代表有本地缓存但是无法获取版本号（比如本地文件夹内没有config.json或者其他原因）。
*/

mqq.build('mqq.offline.isCached', {
    iOS: function(params, callback) {
        var callbackName = mqq.callback(callback);
        if (callbackName) {
            params.callback = callbackName;
            mqq.invoke('offline', 'isCached', params);
        }
    },
    android: function(params, callback) {

        mqq.invoke('qbizApi', 'isCached', params.bid, mqq.callback(callback));
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
查询后台是否有更新
param {Object} params
     - {Number} bid
@param {Function} callback(response)
     - {String} response     //后台的回应JSON。

后台JSON示例：
    无更新：
    {
        "r":0,
        "type":0
    }
    有更新：
    {
        "r":0,
        "type":1,
        "uptype":0,
        "url":http://pub.idqqimg.com/xxxx.zip,
        "version":20080
    }
*/

mqq.build('mqq.offline.checkUpdate', {
    iOS: function(params, callback) {
        var callbackName = mqq.callback(callback);
        if (callbackName) {
            params.callback = callbackName;
            mqq.invoke('offline', 'checkUpdate', params);
        }
    },
    android: function(params, callback) {

        mqq.invoke('qbizApi', 'checkUpdate', params.bid, mqq.callback(callback));
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
下载更新（直接下载，不查询更新）    
@param {Object} params
     - {Number} bid 
     - {String} url         //更新zip包URL
@param {Function} callback(ret, error)
     - {Number} ret         //1更新成功，0更新失败。
     - {String} error [可选] //失败原因（成功则为null）。

    public static final int CODE_SUCCESS = 0;  //下载离线包成功
    public static final int CODE_ERROR_PARAM = 1;       //参数错误
    public static final int CODE_DOWN_ERROR = 2;        //下载更新包出错
    public static final int CODE_NO_SDCARD = 3; //没有sd卡
    public static final int CODE_OTHER_ERROR = 4;       //其他错误
    public static final int CODE_HAD_UPDATE = 5;        //暂时不需要更新，即在最小更新间隔内 
    public static final int CODE_ERROR_UNZIP = 6;//解压失败
    public static final int CODE_DOWNLOADING = 7;//正在下载
    public static final int CODE_NO_UPDATE = 8;//暂无更新
*/


mqq.build('mqq.offline.downloadUpdate', {
    iOS: function(params, callback) {
        var callbackName = mqq.callback(callback);
        if (callbackName) {
            params.callback = callbackName;
            mqq.invoke('offline', 'downloadUpdate', params);
        }
    },
    android: function(params, callback) {
        var name = mqq.callback(callback);
        if (params.fileSize && params.fileSize > 0) {
            mqq.invoke('qbizApi', 'forceUpdate', params.bid, params.url, params.fileSize, name);
        } else {
            mqq.invoke('qbizApi', 'forceUpdate', params.bid, params.url, name);
        }
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
 拉取地理位置
 */
mqq.build('mqq.sensor.getLocation', {
    iOS: function(callback) {

        return mqq.invoke('data', 'queryCurrentLocation', {
            'callback': mqq.callback(callback)
        });
    },
    android: function(callback) {
        var callbackName = mqq.callback(function(result) {
            var retCode = -1,
                longitude = null,
                latitude = null;
            if (result && result !== 'null') {
                result = (result + '').split(',');
                if (result.length === 2) {
                    retCode = 0; // 获取的是经纬度

                    longitude = parseFloat(result[0] || 0);
                    latitude = parseFloat(result[1] || 0);
                }
            }
            callback(retCode, latitude, longitude);
        }, true);
        mqq.invoke('publicAccount', 'getLocation', callbackName);
    },
    browser: function(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {

                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                callback(0, latitude, longitude);
            }, function( /*error*/ ) {
                // switch (error.code) { 
                // case 0: 
                //     alert(“尝试获取您的位置信息时发生错误：” + error.message); 
                //     break; 
                // case 1: 
                //     alert(“用户拒绝了获取位置信息请求。”); 
                //     break; 
                // case 2: 
                //     alert(“浏览器无法获取您的位置信息。”); 
                //     break; 
                // case 3: 
                //     alert(“获取您位置信息超时。”); 
                //     break; 
                // } 
                callback(-1);
            });
        } else {
            callback(-1);
        }
    },
    support: {
        iOS: '4.5',
        android: '4.6',
        browser: '0'
    }
});;/**
 获取传感器状态
 */
mqq.build('mqq.sensor.getSensorStatus', {
    iOS: function(params, callback) {
        params = params || {
            type: 'gps'
        };
        params.callbackName = mqq.callback(callback);
        mqq.invoke('sensor', 'getSensorStatus', params);
    },
    support: {
        iOS: '4.7'
    }
});;/**
    获取地理位置
    @param {Object} params
    int desiredAccuracy 地理位置精度，默认2
    1: best
    2: 100m
    3: 1000m
    4: 3000m
    int isWGS84 获取的座标类型，默认1
    0: 火星座标
    1: 地球座标
    int showAlert 当系统定位关闭时，回调函数的retCode会返回-1，此参数用于控制是否弹出alert询问用户是否打开定位，默认1
    0: 不弹框
    1: 弹框
    @param {Function} callback(int retCode, Object result)
    int retCode 返回码
    -1: 获取位置失败
    0: 获取经纬度成功
    Object result
    int type 返回的类型
    1: 基站信息
        String data
    2: 座标
        int desiredAccuracy 精度
        double lat 精度
        double lon 维度
        int isWGS84 是(1)否(0)火星座标
        int timestamp 时间戳
*/
mqq.build('mqq.sensor.getRealLocation', {
    iOS: function(params, callback) {
        var callbackName = callback ? mqq.callback(callback) : null;
        return mqq.invoke('data', 'getOSLocation', {
            'params': params,
            'callback': callbackName
        });
    },
    android: function(params, callback) {
        params = JSON.stringify(params || {});
        mqq.invoke('publicAccount', 'getRealLocation', params,
            mqq.callback(callback, true));
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
让手机震动指定时间
@param {Object}
     - Number  time (毫秒)
*/

mqq.build('mqq.sensor.vibrate', {
    iOS: function(params) {
        params = params || {};
        mqq.invoke('sensor', 'vibrate', params);
    },
    android: function(params) {
        params = params || {};
        mqq.invoke('qbizApi', 'phoneVibrate', params.time);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
 开始监听重力感应数据
 @param {Function} callback(ret, x, y, z)
  {boolean} ret 是否成功启动传感器
  {double} x
  {double} y
  {double} z
 三个轴的数值，监听频率 50次/秒
 @return 无
*/

mqq.build('mqq.sensor.startAccelerometer', {
    iOS: function(callback) {
        var callbackName = mqq.callback(callback, false, true);
        if (callbackName) {
            mqq.invoke('sensor', 'startAccelerometer', {
                'callback': callbackName
            });
        }
    },
    android: function(callback) {
        var name = mqq.callback(callback, false, true);
        mqq.invoke('qbizApi', 'startAccelerometer', name);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }

});;/**
 停止监听重力感应数据
 @param 无
 @return 无
*/

mqq.build('mqq.sensor.stopAccelerometer', {
    iOS: function() {
        mqq.invoke('sensor', 'stopAccelerometer');
    },
    android: function() {
        mqq.invoke('qbizApi', 'stopAccelerometer');
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }

});;/**
 开始监听罗盘数据
 @param {Function} callback(ret, direction)
   {boolean} ret 是否成功启动传感器
   {double} direction 面对的方向度数，频率50次/秒
 @return 无
*/

mqq.build('mqq.sensor.startCompass', {
    iOS: function(callback) {
        var callbackName = mqq.callback(callback, false, true);
        if (callbackName) {
            mqq.invoke('sensor', 'startCompass', {
                'callback': callbackName
            });
        }
    },
    android: function(callback) {
        var name = mqq.callback(callback, false, true);
        mqq.invoke('qbizApi', 'startCompass', name);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }

});;/**
 停止监听罗盘数据
 @param 无
 @return 无
*/

mqq.build('mqq.sensor.stopCompass', {
    iOS: function() {
        mqq.invoke('sensor', 'stopCompass');
    },
    android: function() {
        mqq.invoke('qbizApi', 'stopCompass');
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }

});;/**
 开始监听麦克风音量大小
 @param {Function} callback(ret, volume)
  {boolean} ret
  {float} volume 音量大小(db)，回调频率10次/秒
 @return 无
*/

mqq.build('mqq.sensor.startListen', {
    iOS: function(callback) {
        var callbackName = mqq.callback(callback, false, true);
        if (callbackName) {
            mqq.invoke('sensor', 'startListen', {
                'callback': callbackName
            });
        }
    },
    android: function(callback) {
        var name = mqq.callback(callback, false, true);
        mqq.invoke('qbizApi', 'startListen', name);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }

});;/**
 停止监听麦克风音量大小
 @param 无
 @return 无
*/

mqq.build('mqq.sensor.stopListen', {
    iOS: function() {
        mqq.invoke('sensor', 'stopListen');
    },
    android: function() {
        mqq.invoke('qbizApi', 'stopListen');
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }

});;/**
预加载声音   
（不过目前iOS没有预加载声音）

@param {Object} params
     - {Number} bid
     - {String} url         //声音URL
@param {Function} callback(ret)
     - {Number} ret         //1加载成功，0加载失败。
     - {String} error [可选] //失败原因（成功则为null）。
*/

mqq.build('mqq.media.preloadSound', {
    iOS: function(params, callback) {
        params.callback = mqq.callback(callback, true);
        mqq.invoke('sensor', 'preloadSound', params);
    },
    android: function(params, callback) {
        mqq.invoke('qbizApi', 'preloadVoice', params.bid, params.url,
            mqq.callback(callback, true));
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
播放离线包里的音频
@params {Object}
     - Number bid
     - String url
*/

mqq.build('mqq.media.playLocalSound', {
    iOS: function(params) {
        mqq.invoke('sensor', 'playLocalSound', params);
    },
    android: function(params) {
        mqq.invoke('qbizApi', 'playVoice', params.bid, params.url);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;// 一个object和一个callback，object={source:int, max:int, maxWidth:int, maxHeight:int}，
// source是控制来源的，0=相册，1=拍照，现在只支持0，max是最大张数限制，
// maxWidth和maxHeight是用来压缩图片尺寸的，
// callback(ret:int, images:Array)，返回所选图片的base64数据
// 
/*
source:0,
            max:5,
            outMaxWidth:480,
            outMaxHeight:480,
            inMinWidth: 300,
            inMinHeight: 300,
            callback:
mqq.callback(function(code, data){
                var ret = [];
                for (var i=0,len=data.length;i<len;i++){
                    ret.push(data[i].ret);
                }
                alert('code: ' + code + ' ,data: ' + ret);
                if (code == 0 && data.length > 0 && data[0].ret == 0) {
                    img.src = data[0].data;
                }
            })

*/
//
mqq.build('mqq.media.getPicture', {
    iOS: function(params, callback) {
        // 对 4.6的参数名进行兼容
        if (!params.outMaxWidth && params.maxWidth) {
            params.outMaxWidth = params.maxWidth;
            delete params.maxWidth;
        }
        if (!params.outMaxHeight && params.maxHeight) {
            params.outMaxHeight = params.maxHeight;
            delete params.maxHeight;
        }

        params.callback = mqq.callback(function(code, data){
            // 修复 ios 的选取拍照图片时, 返回的数组元素是个base64字符串的问题
            if(data && data.forEach){
                data.forEach(function(item, i){
                    if(typeof item === 'string'){
                        data[i] = {
                            data: item,
                            imageID: '',
                            match: 0
                        }
                    }
                });
            }
            callback && callback(code, data);
        }, true /*deleteOnExec*/ , true /*execOnNewThread*/ );
        mqq.invoke('media', 'getPicture', params);
    },
    android: function(params, callback) {
        params.callback = mqq.callback(callback);
        mqq.invoke('media', 'getPicture', params);
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;/*
读取给定路径的本体图片，本接口是配合 getPicture 使用的。主要应用于使用 getPicture 时用户选择多张图片的场景，此时如果全部图片内容一起返回给页面，会导致页面卡死。因此可以指定 getPicture 的 urlOnly 参数，同时使用本接口单独加载图片
*/


mqq.build('mqq.media.getLocalImage', {
    iOS: function(params, callback) {

        params.callback = mqq.callback(callback, true /*deleteOnExec*/ , true /*execOnNewThread*/ );
        mqq.invoke('media', 'getLocalImage', params);
    },
    android: function(params, callback) {

        params.callback = mqq.callback(callback);
        mqq.invoke('media', 'getLocalImage', params);
    },
    support: {
        iOS: '4.7.2',
        android: '4.7.2'
    }
});;/**
 发起财付通现金支付请求
 */
(function() {

    var wrapCallback = function(callback) {
        return function(resultCode, data) {

            // 返回的 resultCode 有可能是字符串数字
            resultCode = Number(resultCode);

            var result = {
                resultCode: resultCode,
                retmsg: '',
                data: {}
            };
            if (resultCode === 0) {
                //保存原始attach信息
                var rawData = data;

                data = mqq.mapQuery(data);
                //此处与android返回一致
                data['sp_data'] = rawData;

                if (data.attach && data.attach.indexOf('{') === 0) {
                    data.attach = JSON.parse(data.attach);
                }
                if (data['time_end']) {
                    data['pay_time'] = data['time_end'];
                }
                result.data = data;
            } else if (resultCode === 1 || resultCode === -1) {
                result.retmsg = '用户主动放弃支付';
                result.resultCode = -1;
            } else {
                result.retmsg = data;
            }

            callback && callback(result);
        };
    };

    mqq.build('mqq.tenpay.pay', {
        iOS: function(params, callback) {

            params['order_no'] = params.tokenId || params.tokenID;
            params['app_info'] = params['app_info'] || params.appInfo;
            //如果调用时有传入使用回调函数封装则封装回调，否则直接透传
            // params['wrapResult'] = params['wrapResult'] || false;

            if (mqq.compare('4.6.2') >= 0) {
                mqq.invokeSchema('mqqapi', 'wallet', 'pay', params, wrapCallback(callback));
            } else {
                mqq.invokeSchema('mqqapiwallet', 'wallet', 'pay', params, wrapCallback(callback));
            }

        },
        android: function(params, callback) {

            params['token_id'] = params.tokenId || params.tokenID;
            params['app_info'] = params['app_info'] || params.appInfo;
            //如果调用时有传入使用回调函数封装则封装回调，否则直接透传
            // params['wrapResult'] = params['wrapResult'] || false;

            if (mqq.compare('4.6.1') >= 0) {

                // 4.6.1 有新的接口
                mqq.invoke('pay', 'pay', JSON.stringify(params), callback);
            } else {

                mqq.invokeSchema('mqqapi', 'tenpay', 'pay', params, wrapCallback(callback));
            }
        },
        support: {
            iOS: '4.6.1',
            android: '4.6.1'
        }
    });
})();;/**
 打开财付通业务界面
 */

mqq.build('mqq.tenpay.openTenpayView', {
    iOS: function(options, callback) {
        var callbackName = callback ? mqq.callback(callback) : null;
        mqq.invoke('pay', 'openTenpayView', {
            'params': options,
            'callback': callbackName
        });
    },
    android: function(params, callback) {
        mqq.invoke('pay', 'openTenpayView', JSON.stringify(params), callback);
    },
    support: {
        iOS: '4.6.1',
        android: '4.6.1'
    }
});;mqq.build('mqq.tenpay.buyGoods', {

    android: function(params, callback) {
        mqq.invoke('pay', 'buyGoods', JSON.stringify(params), callback);
    },
    support: {
        android: '4.6.1'
    }
});;mqq.build('mqq.tenpay.openService', {

    android: function(params, callback) {
        mqq.invoke('pay', 'openService', JSON.stringify(params), callback);
    },
    support: {
        android: '4.6.1'
    }
});;mqq.build('mqq.tenpay.rechargeGameCurrency', {

    android: function(params, callback) {
        mqq.invoke('pay', 'rechargeGameCurrency', JSON.stringify(params), callback);
    },
    support: {
        android: '4.6.1'
    }
});;mqq.build('mqq.tenpay.rechargeQb', {

    android: function(params, callback) {
        mqq.invoke('pay', 'rechargeQb', JSON.stringify(params), callback);
    },
    support: {
        android: '4.6.1'
    }
});;/**
 发起购买请求
 pay.pay 是IOS的  iap的支付  和财付通的支付没有关系 
 @param {Object} options
 - {String}  apple_pay_source 调用来源，区分不同的场景，找soapyang 统一定义
 - {int}    [qq_product_id] QQ 商品ID  1 表情类   2 会员  3超级会员
 - {String} [qq_product_name]   QQ 商品ID 可用于显示的名称
 - {String}  app_id 数平支付的id 区分不同产品 目前表情填：1450000122  会员填：1450000299 超级会员：1450000306
 - {String} [pf] 平台来源，$平台-$渠道-$版本-$业务标识  例如：mobile-1234-kjava-$大厅标识 , 业务自定义的
 - {String} [pfkey] 跟平台来源和openkey根据规则生成的一个密钥串。内部应用填pfKey即可，不做校验
 - {String}  product_id 苹果支付的商品ID, 手Q和sdk透传
 - {int}    [product_type]  (0.消费类产品 1.非消费类产品 2.包月+自动续费 3.免费 4.包月+非自动续费)
 - {int}    [quantity] 购买数量，目前填1
 - {int}    [is_deposit_game_coin] 是否是托管游戏币，表情商城目前不是，0
 - {String} [pay_item] 购买明细，业务自己控制，手Q和sdk透传，存在于批价和发货整个流程里,即从批价svr获取的paytoken
 - {String} [var_item] 这里存放业务扩展信息，如tj_plat_id=1~tj_from=vip.gongneng.xxx.xx~provider_id=1~feetype
 @param {String} callback 回调的js函数  callback(int,String)
 回调字段
 - {int}    [result]
 -1   //未知错误
 0  //发货成功
 1  //下订单失败
 2  //支付失败
 3   //发货失败
 4    //网络错误
 5    //登录失败或无效
 6    //用户取消
 7    //用户关闭IAP支付
 -  {String} [message]
 信息+（错误码），在提示给用户信息的同时添加错误码方便定位问题。
 格式如：参数错误（1001）     
 */

mqq.build('mqq.pay.pay', {
    iOS: function(options, callback) {
        var callbackName = callback ? mqq.callback(callback) : null;
        mqq.invoke('pay', 'pay', {
            'params': options,
            'callback': callbackName
        });
    },
    support: {
        iOS: '4.6'
    }
});;/**
 设置界面支持的商品种类
 @param {Array} productIdArray
 - {int}     QQ 商品ID  1 表情类   2 会员包月类
 */

mqq.build('mqq.pay.enablePay', {
    iOS: function(options) {
        mqq.invoke('pay', 'enablePay', {
            'params': options
        });
    },
    support: {
        iOS: '4.6'
    }
});;/**
领取优惠券

4.6参数（函数继续兼容4.5）
@param {Object}
     - int bid //商家ID
     - int sourceId //商户来源ID
     - int cid //优惠券ID
@param {Function} [callback(retCode)] //回调函数
*/


mqq.build('mqq.coupon.addCoupon', {
    iOS: function(bid, cid, sourceId, city, callback) {
        if (typeof bid === 'object') { // 4.6
            var params = bid;
            // cid（第二个参数）是callback
            if (params.callback = mqq.callback(cid)) {
                mqq.invoke('coupon', 'addCoupon', params);
            }
        } else { // 兼容4.5
            if (typeof city === 'function') {
                callback = city;
                city = '';
            }
            mqq.invoke('coupon', 'addCoupon', {
                'bid': bid,
                'cid': cid,
                'sourceId': sourceId,
                'city': city || '',
                'callback': mqq.callback(callback)
            });
        }
    },
    android: function(params, callback) {
        var name = mqq.callback(callback, true);
        mqq.invoke('coupon', 'addCoupon', params.bid, params.sourceId,
            params.cid, name);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
收藏商家

4.6参数（函数继续兼容4.5）
@param {Object}
     - int bid //商家ID
     - int sourceId //商户来源ID
@param {Function} [callback(retCode)] //回调函数
*/
mqq.build('mqq.coupon.addFavourBusiness', {
    iOS: function(bid, sourceId, callback) {
        //4.6
        if (typeof bid === 'object') {
            var params = bid;
            //sourceId（第二个参数）是callback
            if (params.callback = mqq.callback(sourceId)) {
                mqq.invoke('coupon', 'addFavourBusiness', params);
            }
        }
        //兼容4.5
        else {
            mqq.invoke('coupon', 'addFavourBusiness', {
                'bid': bid,
                'sourceId': sourceId,
                'callback': mqq.callback(callback)
            });
        }
    },
    android: function(params, callback) {
        var name = mqq.callback(callback, true);
        mqq.invoke('coupon', 'addFavourBusiness', params.bid, params.sourceId,
            name);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;

mqq.build('mqq.coupon.goToCouponHomePage', {
    iOS: function(params) {
        mqq.invoke('coupon', 'goToCouponHomePage', {
            'params': params
        });
    },
    android: function(params) {
        params = JSON.stringify(params || {});
        mqq.invoke('coupon', 'goToCouponHomePage', params);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
判断是否我收藏的商家  

4.6参数（函数继续兼容4.5）
@param {Object}
     - int bid //商家ID
     - int sourceId //商户来源ID
@param {Function} [callback(Boolean result)]
*/

mqq.build('mqq.coupon.isFavourBusiness', {
    iOS: function(bid, sourceId, callback) {
        //4.6
        if (typeof bid === 'object') {
            var params = bid;
            //sourceId（第二个参数）是callback
            if (params.callback = mqq.callback(sourceId)) {
                mqq.invoke('coupon', 'isFavourBusiness', params);
            }
        }
        //兼容4.5
        else {
            mqq.invoke('coupon', 'isFavourBusiness', {
                'bid': bid,
                'sourceId': sourceId,
                'callback': mqq.callback(callback)
            });
        }
    },
    android: function(params, callback) {
        mqq.invoke('coupon', 'isFavourBusiness', params.bid, params.sourceId,
            callback);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
判断指定的优惠券是否已收藏

4.6参数（函数继续兼容4.5）
@param {Object}
     - int bid //商家ID
     - int sourceId //商户来源ID
     - int cid //优惠券ID

@param {Function} [callback(retCode)] //回调函数
*/

mqq.build('mqq.coupon.isFavourCoupon', {
    iOS: function(bid, cid, sourceId, callback) {
        //4.6
        if (typeof bid === 'object') {
            var params = bid;
            //cid（第二个参数）是callback
            if (params.callback = mqq.callback(cid)) {
                mqq.invoke('coupon', 'isFavourCoupon', params);
            }
        }
        //兼容4.5
        else {
            mqq.invoke('coupon', 'isFavourCoupon', {
                'bid': bid,
                'cid': cid,
                'sourceId': sourceId,
                'callback': mqq.callback(callback)
            });
        }
    },
    android: function(params, callback) {
        mqq.invoke('coupon', 'isFavourCoupon', params.bid, params.cid,
            params.sourceId, callback);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
删除优惠券

4.6参数（函数继续兼容4.5）
@param {Object}
     - int bid //商家ID
     - int sourceId //商户来源ID
     - int cid //优惠券ID
@param {Function} [callback(retCode)] //回调函数
*/

mqq.build('mqq.coupon.removeCoupon', {
    iOS: function(bid, cid, sourceId, callback) {
        //4.6
        if (typeof bid === 'object') {
            var params = bid;
            //cid（第二个参数）是callback
            if (params.callback = mqq.callback(cid)) {
                mqq.invoke('coupon', 'removeCoupon', params);
            }
        }
        //兼容4.5
        else {
            mqq.invoke('coupon', 'removeCoupon', {
                'bid': bid,
                'cid': cid,
                'sourceId': sourceId,
                'callback': mqq.callback(callback)
            });
        }
    },
    support: {
        iOS: '4.6'
    }
});;/**
删除收藏商家

4.6参数（函数继续兼容4.5）
@param {Object}
     - int bid //商家ID
     - int sourceId //商户来源ID
@param {Function} [callback(retCode)] //回调函数
*/

mqq.build('mqq.coupon.removeFavourBusiness', {
    iOS: function(bid, sourceId, callback) {
        //4.6
        if (typeof bid === 'object') {
            var params = bid;
            //sourceId（第二个参数）是callback
            if (params.callback = mqq.callback(sourceId)) {
                mqq.invoke('coupon', 'removeFavourBusiness', params);
            }
        }
        //兼容旧接口
        else {
            mqq.invoke('coupon', 'removeFavourBusiness', {
                'bid': bid,
                'sourceId': sourceId,
                'callback': mqq.callback(callback)
            });
        }
    },
    android: function(params, callback) {
        var name = mqq.callback(callback, true);
        mqq.invoke('coupon', 'removeFavourBusiness', params.bid, params.sourceId,
            name);
    },
    support: {
        iOS: '4.6',
        android: '4.6'
    }
});;/**
 * 手Q动态Tab中所有红点信息
 *
 * @param {Object} params
 *			- String path 业务对应的红点appid，由红点后台分配，需联系红点后台负责人jackxu，此处需传入全路径，如999999.100004
 * @param {Function} callback(result) 回调函数
 *			- int code 返回码，0为正常，非0为有错
 *			- String errorMessage 错误信息，code为非0时才出现
 *			- Object data 数据，code为0时有，data类型如下（具体含义和咨询红点后台负责人）：
 *				{
 *					'appID':'100004',
 *					'iNewFlag':1,
 *					'missions':'xxx',
 *					'type':1,
 *					'buffer':{
 *						'msg':{
 *							'1':{
 *								'content':'这是一条消息',
 *								'link':'http://vip.qq.com',
 *								'img':'http://xxx',
 *								'time':123456,
 *								'stat':1
 *							},
 *							'2':{
 *								'content':'这是一条消息',
 *								'link':'http://vip.qq.com',
 *								'img':'http://xxx,
 *								'time':123456,
 *								'stat':1
 *							}
 *						}
 *					},
 *					'path':'999999.100004',
 *					'appset':0,
 *					'modify_ts':12353311,
 *					'num':0
 *				}
 */
mqq.build('mqq.redpoint.getAppInfo', {
    iOS: function(params, callback) {
        var callbackName = mqq.callback(callback);
        if (callbackName) {
            params.callback = callbackName;
        }
        mqq.invoke('redpoint', 'getAppInfo', params);
    },
    android: function(params, callback) {
        var callbackName = mqq.callback(callback);
        if (callbackName) {
            params.callback = callbackName;
        }
        mqq.invoke('redpoint', 'getAppInfo', params);
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;/**
 * 设置手Q动态Tab中红点消息为已读
 *
 * @param {Object} param
 *          - Object appInfo 数据，data类型如下（具体含义和咨询红点后台负责人）：
 *              {
 *                  'appID':'100004',
 *                  'iNewFlag':1,
 *                  'missions':'xxx',
 *                  'type':1,
 *                  'buffer':{
 *                      'msg':{
 *                          '1':{
 *                              'content':'这是一条消息',
 *                              'link':'http://vip.qq.com',
 *                              'img':'http://xxx',
 *                              'time':123456,
 *                              'stat':1
 *                          },
 *                          '2':{
 *                              'content':'这是一条消息',
 *                              'link':'http://vip.qq.com',
 *                              'img':'http://xxx,
 *                              'time':123456,
 *                              'stat':1
 *                          }
 *                      }
 *                  },
 *                  'path':'999999.100004',
 *                  'appset':0,
 *                  'modify_ts':12353311,
 *                  'num':0
 *              }
 * @param {Function} callback(result) 回调函数
 *          - int code 返回码，0为正常，非0为有错
 *          - String errorMessage 错误信息，code为非0时才出现
 *
 */
mqq.build('mqq.redpoint.setAppInfo', {
    iOS: function(params, callback) {
        var callbackName = mqq.callback(callback);
        if (callbackName) {
            params.callback = callbackName;
        }
        mqq.invoke('redpoint', 'setAppInfo', params);
    },
    android: function(params, callback) {
        var callbackName = mqq.callback(callback);
        if (callbackName) {
            params.callback = callbackName;
        }
        mqq.invoke('redpoint', 'setAppInfo', params);
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;/**
 * 获取手Q动态Tab中所有红点信息
 *
 * @param {Object} params
 *			- String path 业务对应的红点appid，由红点后台分配，需联系红点后台负责人jackxu，此处需传入全路径，如999999.100004
 * @param {Function} callback(result) 回调函数
 *			- int code 返回码，0为正常，非0为有错
 *			- String errorMessage 错误信息，code为非0时才出现
 *			- Object data 数据，code为0时有，data类型如下（具体含义和咨询红点后台负责人）：
 *				{
 *					'appID':'100004',
 *					'iNewFlag':1,
 *					'missions':'xxx',
 *					'type':1,
 *					'buffer':{
 *						'msg':{
 *							'1':{
 *								'content':'这是一条消息',
 *								'link':'http://vip.qq.com',
 *								'img':'http://xxx',
 *								'time':123456,
 *								'stat':1
 *							},
 *							'2':{
 *								'content':'这是一条消息',
 *								'link':'http://vip.qq.com',
 *								'img':'http://xxx,
 *								'time':123456,
 *								'stat':1
 *							}
 *						}
 *					},
 *					'path':'999999.100004',
 *					'appset':0,
 *					'modify_ts':12353311,
 *					'num':0
 *				}
 */
(function() {
    //缓存查询字符串以及url对象
    var queryString = false,
        params = {};

    /**
     * 获取查询字符串或hash中的字段值
     *
     * @param string key 要获取的字段名
     *
     * @return mixed 获取的字段名对应的值
     */
    function getQueryParams(key) {
        var val = null;
        if (queryString === false) {
            queryString = location.search == '' ? (location.hash == '' ? '' : location.hash.substring(1)) : location.search.substring(1);
            queryString = queryString.split('&');
            if (queryString.length > 0) {
                for (var i = 0; i < queryString.length; i++) {
                    val = queryString[i];
                    val = val.split('=');
                    if (val.length > 1) {
                        try {
                            params[val[0]] = decodeURIComponent(val[1]);
                        } catch (e) {
                            params[val[0]] = '';
                        }
                    }
                }
            }
        }
        return typeof params[key] != 'undefined' ? params[key] : '';
    }

    /**
     * sid，url中有则获取
     */
    var sid = getQueryParams('sid');

    /**
     * platid, ios 110， android 109， winphone 107
     */
    var platid = mqq.iOS ? 110 : (mqq.android ? 109 : 0);

    /**
     * 手机qq的版本
     */
    var qqver = mqq.QQVersion ? mqq.QQVersion : '';

    /**
     * 消息cgi的地址
     */
    var url = 'http://msg.vip.qq.com/cgi-bin/';

    /**
     * 手Q版本是否4.7及以上
     */
    var qq4_7 = (function() {
        return mqq.compare('4.7') >= 0;
    })();

    /**
     * 业务逻辑回调函数
     */
    var logicCb = null;


    /**
     * 发送cgi查询请求
     */
    function sendRequest(appid) {
        var param = {
            sid: sid,
            appid: appid.substring(appid.lastIndexOf('.') + 1),
            platid: platid,
            qqver: qqver,
            format: 'json',
            _: new Date().getTime()
        };
        var uri = 'get_new_msg_cnt';

        try {
            Zepto.ajax({
                type: 'get',
                url: url + uri,
                dataType: 'json',
                data: param,
                timeout: 10000,
                success: function(json) {
                    var ret = {
                        ret: json.ecode,
                        count: 0
                    };

                    if (json.ecode == 0) {
                        ret.count = json.new_msg_cnt;
                    }

                    logicCb(ret);
                },
                error: function() {
                    logicCb({
                        ret: -1,
                        count: 0
                    });
                }
            });
        } catch (e) {
            logicCb({
                ret: -2,
                count: 0
            });
        }
    }

    /**
     * 获取并返回消息列表
     */
    function getMsgList(json) {
        if (json.code == 0) { //正常
            var ret = {
                ret: json.code,
                count: 0
            };
            var list = json.data.buffer;
            var arr = [];

            list = (typeof list != 'object' && list != '') ? JSON.parse(list) : list;

            if (typeof list.msg != 'undefined') {
                for (var i in list.msg) {
                    if (list.msg[i].stat == 1) {
                        ret.count++;
                    }
                }

            }
            logicCb(ret);
        } else {
            logicCb({
                ret: json.code,
                list: []
            });
        }
    }

    mqq.build('mqq.redpoint.getNewMsgCnt', {
        iOS: function(params, callback) {
            appid = String(params.path);
            logicCb = callback;

            if (qq4_7) {
                mqq.redpoint.getAppInfo(params, getMsgList);
            } else {
                if (!Zepto) { //zepto不存在，直接返回错误
                    typeof callback == 'function' ? callback({
                        ret: -10000,
                        count: 0
                    }) : null;
                    return;
                }
                sendRequest(appid);
            }
        },
        android: function(params, callback) {
            appid = String(params.path);
            logicCb = callback;

            if (qq4_7) {
                mqq.redpoint.getAppInfo(params, getMsgList);
            } else {
                if (!Zepto) { //zepto不存在，直接返回错误
                    typeof callback == 'function' ? callback({
                        ret: -10000,
                        count: 0
                    }) : null;
                    return;
                }
                sendRequest(appid);
            }
        },
        support: {
            iOS: '4.5',
            android: '4.5'
        }
    });
})();;/**
 * 获取手Q动态Tab中所有红点信息
 *
 * @param {Object} params
 *			- String path 业务对应的红点appid，由红点后台分配，需联系红点后台负责人jackxu，此处需传入全路径，如999999.100004
 * @param {Function} callback(result) 回调函数
 *			- int code 返回码，0为正常，非0为有错
 *			- String errorMessage 错误信息，code为非0时才出现
 *			- Object data 数据，code为0时有，data类型如下（具体含义和咨询红点后台负责人）：
 *				{
 *					'appID':'100004',
 *					'iNewFlag':1,
 *					'missions':'xxx',
 *					'type':1,
 *					'buffer':{
 *						'msg':{
 *							'1':{
 *								'content':'这是一条消息',
 *								'link':'http://vip.qq.com',
 *								'img':'http://xxx',
 *								'time':123456,
 *								'stat':1
 *							},
 *							'2':{
 *								'content':'这是一条消息',
 *								'link':'http://vip.qq.com',
 *								'img':'http://xxx,
 *								'time':123456,
 *								'stat':1
 *							}
 *						}
 *					},
 *					'path':'999999.100004',
 *					'appset':0,
 *					'modify_ts':12353311,
 *					'num':0
 *				}
 */
(function() {
    //缓存查询字符串以及url对象
    var queryString = false,
        params = {};

    /**
     * 获取查询字符串或hash中的字段值
     *
     * @param string key 要获取的字段名
     *
     * @return mixed 获取的字段名对应的值
     */
    function getQueryParams(key) {
        var val = null;
        if (queryString === false) {
            queryString = location.search == '' ? (location.hash == '' ? '' : location.hash.substring(1)) : location.search.substring(1);
            queryString = queryString.split('&');
            if (queryString.length > 0) {
                for (var i = 0; i < queryString.length; i++) {
                    val = queryString[i];
                    val = val.split('=');
                    if (val.length > 1) {
                        try {
                            params[val[0]] = decodeURIComponent(val[1]);
                        } catch (e) {
                            params[val[0]] = '';
                        }
                    }
                }
            }
        }
        return typeof params[key] != 'undefined' ? params[key] : '';
    }

    /**
     * sid，url中有则获取
     */
    var sid = getQueryParams('sid');

    /**
     * platid, ios 110， android 109， winphone 107
     */
    var platid = mqq.iOS ? 110 : (mqq.android ? 109 : 0);

    /**
     * 手机qq的版本
     */
    var qqver = mqq.QQVersion ? mqq.QQVersion : '';

    /**
     * 消息cgi的地址
     */
    var url = 'http://msg.vip.qq.com/cgi-bin/';

    /**
     * 手Q版本是否4.7及以上
     */
    var qq4_7 = (function() {
        return mqq.compare('4.7') >= 0;
    })();

    /**
     * 业务逻辑回调函数
     */
    var logicCb = null;


    /**
     * 发送cgi查询请求
     */
    function sendRequest(appid) {
        var param = {
            sid: sid,
            appid: appid.substring(appid.lastIndexOf('.') + 1),
            platid: platid,
            qqver: qqver,
            format: 'json',
            _: new Date().getTime()
        };
        var uri = 'read_msg';

        try {
            Zepto.ajax({
                type: 'get',
                url: url + uri,
                dataType: 'json',
                data: param,
                timeout: 10000,
                success: function(json) {
                    var ret = {
                        ret: json.ecode,
                        list: []
                    };
                    if (json.ecode == 0) {
                        var list = json.msg,
                            arr = [];
                        for (var i in list) {
                            arr.push({
                                content: list[i].content ? list[i].content : '',
                                link: list[i].link ? list[i].link : '',
                                img: list[i].img ? list[i].img : '',
                                pubTime: list[i].time ? list[i].time : '',
                                title: list[i].title ? list[i].title : '',
                                src: list[i].src ? list[i].src : '',
                                ext1: list[i].ext1 ? list[i].ext1 : '',
                                ext2: list[i].ext2 ? list[i].ext2 : '',
                                ext3: list[i].ext3 ? list[i].ext3 : '',
                                id: i
                            });
                        }
                        ret.list = arr;
                    }
                    logicCb(ret);
                },
                error: function() {
                    logicCb({
                        ret: -1,
                        list: []
                    });
                }
            });
        } catch (e) {
            logicCb({
                ret: -2,
                list: []
            });
        }
    }


    /**
     * 获取并返回消息列表
     */
    function getMsgList(json) {
        if (json.code == 0) { //正常
            var ret = {
                ret: json.code,
                list: []
            };
            var list = json.data.buffer;
            var arr = [];

            list = (typeof list != 'object' && list != '') ? JSON.parse(list) : list;

            if (typeof list.msg != 'undefined') {
                for (var i in list.msg) {
                    if (list.msg[i].stat == 1) {
                        arr.push({
                            content: list.msg[i].content ? list.msg[i].content : '',
                            link: list.msg[i].link ? list.msg[i].link : '',
                            img: list.msg[i].img ? list.msg[i].img : '',
                            pubTime: list.msg[i].time ? list.msg[i].time : '',
                            title: list.msg[i].title ? list.msg[i].title : '',
                            src: list.msg[i].src ? list.msg[i].src : '',
                            ext1: list.msg[i].ext1 ? list.msg[i].ext1 : '',
                            ext2: list.msg[i].ext2 ? list.msg[i].ext2 : '',
                            ext3: list.msg[i].ext3 ? list.msg[i].ext3 : '',
                            id: i
                        });
                        //因为获取消息列表需要将消息设置为已读，所以此处将消息的stat设置为2，已读
                        list.msg[i].stat = 2;
                    }
                }
                json.data.buffer = JSON.stringify(list);

                if (arr.length > 0) {
                    ret.list = arr;
                    //因为获取消息列表需要将消息设置为已读，所以此处先回调，将消息的stat设置为2，已读
                    mqq.redpoint.setAppInfo({
                        appInfo: json.data
                    }, function(json) {
                        console.log(JSON.stringify(json));
                    });
                    var appid = json.data.appID;
                    //因为目前手Q4.7不会即时上报消息被拉取，所以这里发请求拉取cgi，通知服务器消息已被拉取
                    var param = {
                        sid: sid,
                        appid: appid,
                        platid: platid,
                        qqver: qqver,
                        format: 'json',
                        _: new Date().getTime()
                    };
                    var uri = 'read_msg';
                    try {
                        Zepto.ajax({
                            type: 'get',
                            url: url + uri,
                            dataType: 'json',
                            data: param,
                            timeout: 10000,
                            success: function(json) {},
                            error: function() {}
                        });
                    } catch (e) {}
                }
            }
            logicCb(ret);
        } else {
            logicCb({
                ret: json.code,
                list: []
            });
        }
    }

    mqq.build('mqq.redpoint.getNewMsgList', {
        iOS: function(params, callback) {
            appid = String(params.path);
            logicCb = callback;

            if (qq4_7) {
                mqq.redpoint.getAppInfo(params, getMsgList);
            } else {
                if (!Zepto) { //zepto不存在，直接返回错误
                    typeof callback == 'function' ? callback({
                        ret: -10000,
                        count: 0
                    }) : null;
                    return;
                }
                sendRequest(appid);
            }
        },
        android: function(params, callback) {
            appid = String(params.path);
            logicCb = callback;

            if (qq4_7) {
                mqq.redpoint.getAppInfo(params, getMsgList);
            } else {
                if (!Zepto) { //zepto不存在，直接返回错误
                    typeof callback == 'function' ? callback({
                        ret: -10000,
                        count: 0
                    }) : null;
                    return;
                }
                sendRequest(appid);
            }
        },
        support: {
            iOS: '4.5',
            android: '4.5'
        }
    });
})();;/**
 * 上报手Q动态tab中红点点击信息
 *
 * @param {Object} param
 *			- String path 业务对应的红点appid，由红点后台分配，需联系红点后台负责人jackxu，此处需传入全路径，如999999.100004
 *			- int isWithRedPoint 是否和红点一起上报，默认为1
 * @param {Function} callback(result) 回调函数
 *				- int code 返回码，0为正常，非0为有错
 *				- String errorMessage 错误信息，code为非0时才出现
 *
 */
mqq.build('mqq.redpoint.reportRedTouch', {
    iOS: function(params, callback) {
        var callbackName = mqq.callback(callback);
        if (callbackName) {
            params.callback = callbackName;
        }
        mqq.invoke('redpoint', 'reportRedTouch', params);
    },
    android: function(params, callback) {
        var callbackName = mqq.callback(callback);
        if (callbackName) {
            params.callback = callbackName;
        }
        mqq.invoke('redpoint', 'reportRedTouch', params);
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;/**
 * 根据set或path获取手Q动态tab中红点内容
 *
 * @param (Object) param
 *			- String path 业务对应的红点appid，由红点后台分配，需联系红点后台负责人jackxu，此处需传入全路径，如999999.100004
 *			- String set 业务对应的红点set值，由红点后台分配，需联系红点后台负责人jackxu，客户端优先判断set，次选path，set or path必须有一个值
 * @param {Function} callback(result) 回调函数
 *			- int  返回码，0为正常，非0为有错
 *			- errorMessage 错误信息，返回错误时出现
 *			- Object data 数据 ，返回正常时出现
 *				- int hintType
 *				- int number
 *				- int isShow
 */
mqq.build('mqq.redpoint.getRedPointShowInfo', {
    iOS: function(params, callback) {
        var callbackName = mqq.callback(callback);
        if (callbackName) {
            params.callback = callbackName;
        }
        mqq.invoke('redpoint', 'getRedPointShowInfo', params);
    },
    android: function(params, callback) {
        var callbackName = mqq.callback(callback);
        if (callbackName) {
            params.callback = callbackName;
        }
        mqq.invoke('redpoint', 'getRedPointShowInfo', params);
    },
    support: {
        iOS: '4.7',
        android: '4.7'
    }
});;;;(function($){
	$.config = {
		domain: 'web.p.qq.com',
		webPath: 'http://web.p.qq.com/qqmpmobile/coupon/',
        cdnPath: 'http://pub.idqqimg.com/qqmpmobile/coupon/',
        defaultLogoSrc : 'http://pub.idqqimg.com/qqmpmobile/coupon/img/dist/default-logo.png',   // 默认logo
        defaultShopSrc : 'http://pub.idqqimg.com/qqmpmobile/coupon/img/dist/default-shop.png'   	// 默认门店图
    }
})(Zepto)
;;
(function($) {
	// 获取跳转时需要带上参数
	var generateJumpParam = (function() {
		var param,
		channel;

		return function(c) {
			if (param && (c === undefined || channel == c)) {
				return param;
			} else {
				channel = c;

				param = {
					_bid: $.env.bid
				};

				var urlParam = util.getUrlParam(),
					traceid = urlParam.traceid, // 广点通跟踪id，透传
					operid = urlParam.operid, // 运营为id，透传
					followid = urlParam.followid, // 吃喝玩乐跟踪id，透传

					// 渠道号，根据页面自身的level和url带过来的生成新的渠道号
					r = util.getStype(),
					level = '5';

				if (channel) {
					level = String(channel).substring(0, 1);
				}

				for (var i = 1; i <= 4; i++) {
					if (i < level) {
						param['r' + i] = r[i - 1];
					} else {
						if (level <= 4) {
							param['r' + level] = channel;
						}
						break;
					}
				}

				if (traceid) {
					param.traceid = traceid;
				}

				if (operid) {
					param.operid = operid;
				}

				if (followid) {
					param.followid = followid;
				}

				return param;
			}
		}
	})();

	var util = {
		/* 比较版本
		 * 当a<b返回-1, 当a==b返回0, 当a>b返回1,
		 * 约定当a或b非法则返回-1
		 */
		compareVersion: function(a, b) {
			a = String(a).split('.');
			b = String(b).split('.');
			try {
				for (var i = 0, len = Math.max(a.length, b.length); i < len; i++) {
					var l = isFinite(a[i]) && Number(a[i]) || 0,
						r = isFinite(b[i]) && Number(b[i]) || 0;
					if (l < r) {
						return -1;
					} else if (l > r) {
						return 1;
					}
				}
			} catch (e) {
				return -1;
			}
			return 0;
		},
		// 判断url是否属于特定域名
		isSpecificDomain: function(domain, url) {
			if (!domain || !url) {
				return false;
			}

			var link = document.createElement('a');

			link.href = url;

			if (link.hostname.substr(-domain.length) == domain) {
				return true;
			} else {
				return false;
			}
		},
		// 获取url参数，不传key，获取所有参数对象
		getUrlParam: (function() {
			var param;

			// fix by jdochen 2014/10/21
			// 增加强制读取最新url参数
			// 兼容调用方式 getUrlParam(true) & getUrlParam('key') & getUrlParam('key', true)
			return function(key, refresh) {
				if (!param || ("boolean" === typeof key && key) || refresh) {
					param = {};

					var search = location.search.substring(1),
						hash = location.hash.substring(1);

					// 兼容android客户端
					if (search.indexOf('_fromclient') != -1) {
						search = search.replace(/_fromclient([^&]*)/, function(m, a) {
							return decodeURIComponent(a);
						});
					}

					var paramStrArr = (search + '&' + hash).split('&');

					$.each(paramStrArr, function(i, str) {
						str = str.split('=');

						var key = str[0],
							value = str[1];

						if (key && value) {
							param[key] = decodeURIComponent(value);
						}
					});
				}

				return typeof key === 'string' ? (param[key] || '') : param;
			}
		})(),
		// 获取各层级的渠道号
		getStype: function() {
			var urlParam = this.getUrlParam(),
				r1 = urlParam.stype || urlParam.r1 || 11001,	// 默认为动态过来的
				r2 = urlParam.r2 || '',
				r3 = urlParam.r3 || '',
				r4 = urlParam.r4 || '';

			return [r1, r2, r3, r4];
		},
		// 根据当前页面的channel和url参数中传进来的渠道层级，生成新的stype，用于旧页面的统计跳转参数
		newStype: function(channel) {

			var oStype = this.getStype().join('_');

			channel = channel + '';

			function addStype(compat) {
				var new_s = channel.charAt(0),
					rt = [],
					arr = [];
				oStype.split('_').forEach(function(v) {
					var s = v.charAt(0);
					arr[s] = v;
				});
				for (var i = 1; i < new_s; i++) {
					rt[i] = arr[i] || (compat === 'compat' ? i + '0000' : '0');
				}
				rt[new_s] = channel;
				return rt.join('_').slice(1);
			}

			if (!oStype) {
				//如果url参数中没有stype参数，则用i0000补齐
				//例：url中stype为空，传入31001，则变成10000_20000_31001
				return addStype('compat');
			} else {
				//如果url参数中带了stype参数，则缺失的位用0补齐，多余的位去掉
				//例：url中stype为14003，传入31001，则变成14003_0_31001
				//    url中stype为14003_21001_32001_42001，传入31001，则变为14003_21001_31001
				var reg = new RegExp('(^|_)' + channel.charAt(0) + '([^_$]*)(?:_|$)');
				var match = oStype.match(reg);
				if (match) {
					return oStype.substr(0, match.index) + match[1] + channel;
				} else {
					return addStype();
				}
			}
		},
		// html转义
		toHtml: function(str) {
			return _.escape(str);
		},
		// 在zepto之上封装了一层，在请求时带上时间戳，同时将结果上报mm
		ajax: function(options) {
			options = $.extend(true, {
				type: 'POST',
				data: {
					sid: this.getUrlParam('sid'),
					_ts: +new Date() // 请求默认加一个时间戳参数，防止被cache
				},
				dataType: 'json',
				timeout: 20000,
				crossDomain: true
			}, options);

			var before = +new Date(),
				success = options.success,
				error = options.error || this.showErrorToast;

			options.success = function(data) {
				var retcode = data.retcode !== undefined? data.retcode : data.ret;
				$.report.cgiReport(options.url, retcode, +new Date() - before); // cgi统一做返回码上报
				if (data && (data.retcode == 0 || data.ret == 0)) {
					success && success(data);
				} else {
					error(retcode);
				}
			}

			options.error = function(xhr, type) {
				if (type != 'abort') {
					$.report.cgiReport(options.url, xhr.status, 0);
					error && error(-1);
				}
			}

			return $.ajax(options);
		},
		showErrorToast: function(retcode) {
			retcode = retcode || -1;

			pro.toast.show({
				content: retcode == -1 ? '无法连接至服务器，请稍后重试' : ('系统繁忙，请稍后重试(' + retcode + ')')
			});
		},
		// 根据param和hash生成url
		generateUrl: function(url, param, hash) {
			if (url) {
				param = param || '';
				hash = hash || '';

				if ($.isPlainObject(param)) {
					param = $.param(param);
				}

				if ($.isPlainObject(hash)) {
					hash = $.param(hash);
				}

				var u1 = url.split('#'),
					u2 = u1[0].split('?');

				u1[1] = u1[1] ? (u1[1] + '&' + hash) : hash;
				u2[1] = u2[1] ? (u2[1] + '&' + param) : param;

				return u2[0] + (u2[1] ? '?' : '') + u2[1] + (u1[1] ? '#' : '') + u1[1];
			} else {
				return '';
			}
		},
		// 生成跳转链接，qq域下的
		generateJumpUrl: function(url, channel, param, hash) {
			var jumpParam = {};

			// 非业务域名跳转带上用户位置信息，吃喝玩乐页面直接从缓存中取
			if (!this.isSpecificDomain($.config.domain, url)) {
				var locateParam = $.geo.getLocalData();

				jumpParam.maplng = locateParam.maplng;
				jumpParam.maplat = locateParam.maplat;
				jumpParam.coodinate = locateParam.coodinate;
			}

			if (this.isSpecificDomain('qq.com', url)) {
				// 业务参数放在最后，可以覆盖之前的
				$.extend(jumpParam, generateJumpParam(channel), param);

				hash = $.extend({
					sid: this.getUrlParam('sid')
				}, hash);

				url = this.generateUrl(url, jumpParam, hash);
			} else {
				url = this.generateUrl(url, jumpParam, hash);
			}

			return url;
		},
		/*
		 * 打开页面
		 * @param target
		 *	 -1: 在当前webview打开, 不产生历史记录
		 *	 0 : 在当前webview打开, 产生历史记录
		 *	 1 : 在新webview打开（默认）
		 *	 2 : 在外部浏览器上打开（iOS为Safari,Android为系统默认浏览器）
		 * @param style
		 *	 0: 顶部标题栏模式（默认，无底部工具栏）
		 *	 1: 顶部标题栏无分享入口（无底部工具栏）（默认）
		 *	 2: 底部工具栏模式（顶部标题依然会存在）
		 *	 3: 底部工具栏模式且顶部无分享入口（顶部标题依然会存在）
		 */
		openUrl: function(url, channel, param, target, style) {
			if (!url) {
				return;
			}

			param = $.extend({
				_wv: 5121 // 1 + 1024 + 4096 隐藏底部导航，禁用横屏，ios禁用左滑回退
			}, param);

			if (target === undefined) {
				target = 1;
			}

			if (style === undefined) {
				style = 1;
			}

			url = this.generateJumpUrl(url, channel, param);

			if (target == -1) {
				window.location.replace(url);
			} else if (mqq.support('mqq.ui.openUrl')) {
				mqq.ui.openUrl({
					url: url,
					target: target,
					style: style,
					openInCouponWebview: 1, // 用吃喝玩乐webview打开，后续会废弃
				});
			} else if (target == 0) {
				window.location.href = url;
			} else if (target == 1) {
				window.location.href = url;
			}
		},
		/**
	     * 让日期和时间按照指定的格式显示的方法
	     * @method date
	     * @memberOf format
	     * @param {String} format 格式字符串
	     * @return {String} 返回生成的日期时间字符串
	     * 
	     * @example
	     * Jx().$package(function(J){
	     *     var d = new Date();
	     *     // 以 YYYY-MM-dd hh:mm:ss 格式输出 d 的时间字符串
	     *     J.format.date(d, "YYYY-MM-DD hh:mm:ss");
	     * };
	     * 
	     */
	    formatDate: function(date, formatString){
	        /*
	         * eg:formatString="YYYY-MM-DD hh:mm:ss";
	         */
	        var o = {
	            "M+" : date.getMonth()+1,    //month
	            "D+" : date.getDate(),    //day
	            "h+" : date.getHours(),    //hour
	            "m+" : date.getMinutes(),    //minute
	            "s+" : date.getSeconds(),    //second
	            "q+" : Math.floor((date.getMonth()+3)/3),    //quarter
	            "S" : date.getMilliseconds()    //millisecond
	        }
	     
	        if(/(Y+)/.test(formatString)){
	            formatString = formatString.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
	        }
	    
	        for(var k in o){
	            if(new RegExp("("+ k +")").test(formatString)){
	                formatString = formatString.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	            }
	        }
	        return formatString;
	    },
		changeHash: function(hash) {
			window.location.hash = hash;
		},
		/*
		 * 页面回退
		 * @param target
		 *	 0 : 在当前webview回退
		 *	 1 : 返回上一个webview（默认）
		 */
		returnPrev: function(target) {
			if (target === undefined) {
				target = 1;
			}

			if (target == 0) {
				window.history.back();
			} else if (mqq.support('mqq.ui.popBack')) {
				mqq.ui.popBack();
			}
		},
		// 拨打电话
		phoneCall: function(tel) {
			if (!tel) {
				return;
			}

			var tels = String(tel).split(',');
			if (tels.length > 1) {
				var html = [];
				var handler = [];
				for (var i = 0, l = tels.length; i < l; i++) {
					html.push(tels[i]);
					handler.push(new Function('$.util.phoneCall(' + tels[i] + ')'));
				}
				pro.actionSheet.show({
					content: html,
					btnHandle: handler
				});
				return;
			}

			if ($.os.android) {
				pro.dialog.show({
					content: '<center>是否确认拨打' + tel + '</center>',
					btnText: ['取消', '拨打'],
					btnHandle: [function() {}, function() {
						window.location.href = 'tel:' + tel;
					}]
				});
			} else if ($.os.ios) {
				window.location.href = 'tel:' + tel;
			}
		},
		// 隐藏客户端loading
		hideClientLoading: function() {
			if (mqq.support('mqq.ui.setLoading')) {
				mqq.ui.setLoading({
					visible: false
				});
			}
		},
		// 截取字符串
		substr: function(str, maxLength) {
			if (maxLength > 0) {
				if (str.replace(/[^\x00-\xff]/g, "xx").length > maxLength) {
					for (var i = Math.floor(maxLength / 2), l = str.length; i < l; i++) {
						if (str.substr(0, i).replace(/[^\x00-\xff]/g, "xx").length > maxLength) {
							str = str.substr(0, i - 1) + "...";
							break;
						}
					}
				}
			}

			return str;
		},
		// 用户登录获取sid
		loginPop: function(msg) {
			msg = msg || '尚未获取到您的登录信息，建议您重新登录';
			var confirm = window.confirm(msg);
			if (confirm) {

				var urlParam = this.getUrlParam();
				delete urlParam.sid;

				var url = 'http://pt.3g.qq.com/s?';
				var location = window.location;

				var params = {
					aid: 'touchLogin',
					t: 'qlife',
					bid_code: 'qlife',
					css: 'http://imgcache.gtimg.cn/lifestyle/proj-life-coupon/css/ptlogin.css?v=1.0',
					g_ut: 3,
					go_url: location.protocol + '//' + location.host + location.pathname + '?' + $.param(urlParam)
				};
				window.location.href = url + $.param(params);
			}
		},
		// 检测是否有sid;
		isLogin: function() {
			var sid = this.getUrlParam('sid') || '';
			return sid.trim().length > 0 && sid != 'null' && sid != 'undefined';
		},
		getQQVersion: function() {
			function platform(os) {
				var ua = navigator.userAgent.toLowerCase(),
					ver = ('' + (new RegExp(os + '(\\d+((\\.|_)\\d+)*)').exec(ua) || [, 0])[1]).replace(/_/g, '.');

				return parseFloat(ver) || undefined;
			}

			var qqVersion;

			//qq浏览器， window.mqq用来检测是否在手Q里面
			if (window.mqq && window.x5mtt && x5mtt.getSingleApp) {
				try {
					var str = x5mtt.getSingleApp('com.tencent.mobileqq');
					if (str) {
						qqVersion = JSON.parse(str).versionname;
						//alert(qqVersion);
					}
				} catch (e) {}

			} else {
				qqVersion = platform('qq[/]') || platform('v1_and_sq_');
			}

			return qqVersion;
		},
		/**
		 * 将表情标签解析为对应图片
		 * @param {String} val 评论内容 eg: [em]e113[/em]
		 * @return {String} 表情标签转为图片后的评论内容
		 */

		parseEmoji: function(val) {
			return val.replace(/\[em(?:2)?\]e(\d{1,8})(?:,\d{1,3},\d{1,3})?\[\/em(?:2)?\]/gi, function(_0, _1) {
				return '<img src="http://qzonestyle.gtimg.cn/qzone/em/2.0/e' + _1 + '@2x.gif" class="mini-em" />';
			})
		},
		setTitle: function(title) {
			document.title = title;
			this.refreshTitle();
		},
		refreshTitle: function(){
			if($.os.ios && mqq.support('mqq.ui.refreshTitle')){
				mqq.ui.refreshTitle();
			}
		},
		generateTdbReportParam: function(item, module, index){
			return {
                Algfilever: item.Algfilever,
                Algsubver: item.Algsubver,
                Algver: item.Algver,
                expid: item.expid,

                module: module,
                source_id: item.source_id,
                biz_id: item.biz_id,
                shop_id: item.shopid,
                coup_id: item.coup_id || item.cid,
                price: item.price1,
                fromtype: item.fromtype,
                display_index: index
            };
		},
		// 标准化城市名
		standardizeCity: function(city){
		    if(city && city.slice(-1) == '市' && city.length > 2){
		        city = city.slice(0, -1);
		    }

		    return city;
		}
	};

	util.getUrlParam();

	$.util = util;
})(Zepto);;(function($){
    var $U = $.util;

	var env = {
        ratio : window.devicePixelRatio || 1, 
        platform : $.os.android? 'android' : ($.os.ios? 'ios' : 'unknow'),
		network : 'unknow',
        qqVersion: (mqq && mqq.QQVersion) || 'unknow',
        isPoorDevice: false,

        timestamp : '20141104121421',
        version: '3.0',
        bid : 108,
        isOffline: false,   // 是否离线
        offlineVersion : -1     // 离线包版本号，-1表示没有离线包
	};

    // 特殊hack的机器
    var HACK_DEVICE = ['GT-I9100G'];

    function getAndroidVersionFlag(ver){
        env.androidV3 = $U.compareVersion(ver, '3') >= 0;
        env.androidV44 = $U.compareVersion(ver, '4.4') >= 0;
    }

    function getQQVersionFlag(ver){
        env.qqV45 = $U.compareVersion(ver, '4.5') >= 0;
        env.qqV46 = $U.compareVersion(ver, '4.6') >= 0;
    }

    var envArr = [
        // 获取设备信息
        {
            name: 'device.getDeviceInfo',
            callback: function(result){
                $.extend(env, result);

                if($.os.android){
                    var androidVersion = (result && result.systemVersion) || 'unknow';
                    getAndroidVersionFlag(androidVersion);
                }
            }
        },
        // 获取客户端信息
        {
            name: 'device.getClientInfo',
            callback: function(result){
                $.extend(env, result);
                    
                var qqVersion = (result && result.qqVersion) || 'unknow';
                getQQVersionFlag(qqVersion);
            }
        },
        // 获取网络状态
        {
            name: 'device.getNetworkType',
            callback: function(result){
                var map = {
                    0: 'noNetwork',
                    1: 'wifi',
                    2: '2g',
                    3: '3g',
                    4: 'unknow'
                }

                env.network = map[result] || 'unknow';
            }
        },
        // 判断是否离线
        {
            name: 'offline.isCached',
            param: { bid: env.bid },
            callback: function(result){
                env.offlineVersion = result;
                env.isOffline = result != -1;
            } 
        }
    ];

    var ready = false,
        envCount = 0,
        callbacks = [],
        envTimeout = null;

    // 添加一个客户端环境调用接口
    function addEnv(env){
        var name = env.name.split('.');
        name.unshift('mqq');

        var callback = function(){
            env.callback(result);

            envOnload();
        }

        // 客户端是否支持此接口
        if(mqq.support(name.join('.'))){
            envCount++;

            mqq[name[1]][name[2]](env.param || env.callback, env.callback);  
        }
    }

    function envload(){
    	var mqq = window.mqq;

    	if(!mqq){
    		return;
    	}

        $.each(envArr, function(i, env){
            addEnv(env);
        });
        
        if(envCount == 0){
            envOnload();
        }
    };

 	function envOnload(){
 		if(--envCount <= 0){
 			onReady();
 		}
 	};

    function onReady(){
        ready = true;

        clearTimeout(envTimeout);
        envTimeout = null;

        doCallback();
    };

 	function doCallback(){
 		$.each(callbacks, function(index, callback){
 			callback();
 		});

 		callbacks = [];
 	};

 	env.envReady = function(callback){
 		if(ready){
            callback();
        }else{
            callbacks.push(callback);
        }
 	};

    // 低端机样式适配
    function setPoorDevice(){
        $('body').addClass('poor-device');
        env.isPoorDevice = true;
    }

    // 安卓版本，通过ua获取
    function getAndroidVersion(){
        var av = window.navigator.userAgent.match(/Android[\/ ]([\d\.]+)/);
        return av ? av[1] : '0';
    }

    (function(){
        if($.os.android){
	    	var androidVersion = getAndroidVersion();
            env.systemVersion = androidVersion;
		    getAndroidVersionFlag(androidVersion);
		}

        if(($.os.android && !env.androidV3) || String($.os.ios) <= "5.1"){
            setPoorDevice();
        }else{
            var ua = window.navigator.userAgent;
            for(var i = 0, l = HACK_DEVICE.length; i < l; i++){
                if(ua.indexOf(HACK_DEVICE[i]) != -1){
                    setPoorDevice();
                    break;
                }
            }
        }

    	envload();

        if(!envTimeout){
            envTimeout = setTimeout(function(){
                onReady();
            }, 1000);
        }
    })();

    $.env = env;
})(Zepto)
;;(function($){
    // 通用上报
    $.report = {
        report: function(url, param){
            var img = new Image();

            img.onload = function(){
                img = null;
            }

            img.src = $.util.generateUrl(url, param);
        }
    };
})(Zepto)
;;(function($){
    var $EV = $.env,
        $R = $.report;

    var MM_BID = 1000143,
        SPEED_REPORT_CGI = 'http://wspeed.qq.com/w.cgi',
        REPORT_CACHE_TIME = 5000;      // 批量上报

    var performance = (window.performance? window.performance : window.webkitPerformance) || {};

    var pageName = '',
        isDataCache = false,
        envReportTag = {
            'pageLoad': ['offline'],
            'showData': ['cache', 'offline']
        },
        startTimeCache = {},
        reportQueue = [];     // 上报截流缓存

    // 初始化会上报每个页面webview耗时和performance数据
    $R.init = function(name){
        pageName = name;

        // webview创建耗时上报
        if(mqq.support('mqq.data.getPageLoadStamp')){
            mqq.data.getPageLoadStamp(function(data){
                if(data && data.ret == 0){
                    $R.speedReport('webview', 0, data.startLoadUrlTime - data.onCreateTime);
                }
            });
        }

        // H5 performance上报
        // var reportPoints = ['navigationStart', 'unloadEventStart', 'unloadEventEnd',
        //                 'redirectStart', 'redirectEnd', 'fetchStart', 'domainLookupStart',
        //                 'domainLookupEnd', 'connectStart', 'connectEnd', 'requestStart',
        //                 'responseStart', 'responseEnd', 'domLoading', 'domInteractive',
        //                 'domContentLoadedEventStart', 'domContentLoadedEventEnd',
        //                 'domComplete', 'loadEventStart', 'loadEventEnd'];
        var timing = performance.timing;
        if(timing){
            $R.speedReport('performance', 0, timing.responseStart - timing.navigationStart);
        }
    };

    // 生成上报项的名称
    function getTag(tagName){
        var tag = pageName + '_' + tagName,
            condition = envReportTag[tagName];

        if(condition){
            $.each(condition, function(index, item){
                if(item == 'cache'){
                    tag += '_' + (isDataCache? 'cache' : 'real');
                }else if(item == 'offline'){
                    tag += '_' + ($EV.isOffline? 'offline' : 'online');
                }
            })
        }
        return tag;
    };

    // 批量上报，统一做了一次截流
    var doReport = $.debounce(function(){
        $EV.envReady(function(){
            var param = {
                appid: MM_BID,
                apn: $EV.network,
                frequency: 1,
                touin: null,
                releaseversion: [$EV.platform, $EV.qqVersion, $EV.version, $EV.androidV3? 1 : 0].join('_'),
                stime: +new Date(),
                dtype: 1,
                key: 'commandId, tmcost, odetails'
            };

            $.each(reportQueue, function(i, item){
                param[i + 1 + '_1'] = getTag(item[0]);
                param[i + 1 + '_2'] = item[1];
                param[i + 1 + '_3'] = '1:0,' + item[1] + ';';
            });

            $R.report(SPEED_REPORT_CGI, param);

            reportQueue = [];
        });
    }, REPORT_CACHE_TIME, false);

    /*
     * 目前主要有client，performance，pageLoad，showData 4个测速上报
     * @param  {String} tagName
     * @param  {Number} start 
     * @param  {Number} end 
     */
    $R.speedReport = function(tagName, start, end, cache){
        if(end){
            if(cache !== undefined){
                isDataCache = cache;
            }

            reportQueue.push([tagName, end - (startTimeCache[tagName] || start || 0)]);    // 值为数组则时间为end-start
            delete startTimeCache[tagName];
            
            doReport();
        }else{
            startTimeCache[tagName] = start;      // 值为数字则时间为start
        }
    };
})(Zepto);;(function($){
    var $EV = $.env,
        $R = $.report;

    var MM_BID = 1000143,
        SPEED_REPORT_CGI = 'http://wspeed.qq.com/w.cgi',
        REPORT_CACHE_TIME = 5000;      // 批量上报

    var reportQueue = [];

    // 批量上报，统一做了一次截流
    var doReport = $.debounce(function(){
        $EV.envReady(function(){
            var param = {
                appid: MM_BID,
                apn: $EV.network,
                frequency: 1,
                touin: null,
                releaseversion: $EV.platform + '_' + $EV.qqVersion,
                key: 'commandId, resultcode, tmcost'
            };

            $.each(reportQueue, function(i, item){
                param[i + 1 + '_1'] = item[0];
                param[i + 1 + '_2'] = item[1];
                param[i + 1 + '_3'] = item[2];
            });

            $R.report(SPEED_REPORT_CGI, param);

            reportQueue = [];
        });
    }, REPORT_CACHE_TIME, false);

    /*
     * cgi 监控
     * @param {string} cgi cgi路径, 不携带参数, 例如: https://openmobile.qq.com/oauth2.0/m_sdkauthorize
     * @param {string} retcode 返回码, 透传cgi的retcode
     * @param {string} tmcost cgi耗时, 在请求cgi前打"请求时间戳"t1, 执行callback时马上打"响应时间戳"t2
     *                          此处传入t2-t1的值, 单位为ms
     * @param {object} param 扩展参数对象
     */
    $R.cgiReport = function(cgi, retcode, tmcost){
        reportQueue.push([cgi, retcode, tmcost]);

        doReport();
    };
})(Zepto);;(function($){
	var $R = $.report;

	var ERROR_REPORT_BID = 188,
        ERROR_REPORT_URL = 'http://badjs.qq.com/cgi-bin/js_report';

	/**
     * 上报js错误
     * @param  {String} errorMsg   
     * @param  {String} url        
     * @param  {Number} lineNumber 
     */
    $R.errorReport = function(errorMsg, url, lineNumber){
        var msg = [errorMsg, url || location.href, lineNumber, navigator.userAgent, $.env.timestamp].join('|_|');

        $R.report(ERROR_REPORT_URL, {
            bid: ERROR_REPORT_BID,
            msg: msg,
            t: +new Date()
        });
    };

    // 调试和开发的时候url带上debug参数就不会上报
    window.onerror = function(errorMsg, url, lineNumber){
    	if(!$.util.getUrlParam('debug')){
    		$R.errorReport(errorMsg, url, lineNumber);
    	}else{
    		// 调试的时候可以在这里alert
            // alert(errorMsg);
    	} 
    };
})(Zepto)
;;(function($){
    var $U = $.util,
        $EV = $.env,
        $R = $.report;
        

    var STAND_REPORT_CGI = 'http://s.p.qq.com/coupon/report',
        TDB_REPORT_CGI = 'http://s.p.qq.com/coupon/tdbreport_v2',
        REPORT_CACHE_TIME = 1000;      // 批量上报

    var standReportParam,
        tdbReportParam,
        tdbReportQueue = [];

    // 吃喝玩乐业务上报 
    // 参见 https://docs.google.com/spreadsheets/d/1mLq5uySvcZr0elnG3P2UBgRPezN4qV114lWl21ZrWhs/edit#gid=1513219428
    $R.standReport = function(param){
        $EV.envReady(function(){
            if(!standReportParam){
                var urlParam = $U.getUrlParam(),
                    r = $U.getStype();

                standReportParam = {
                    sid : urlParam.sid,
                    platform : $EV.platform,
                    ver : $EV.qqVersion,
                    res6 : $EV.offlineVersion,
                    operid : urlParam.operid || '',
                    followid : urlParam.followid || '',
                    channel1 : r[0],
                    channel2 : r[1],
                    channel3 : r[2],
                    channel4 : r[3],
                    network : $EV.network
                };
            }

            $R.report(STAND_REPORT_CGI, $.extend({obj3 : $.storage.get('chosenCity') || ''}, standReportParam, param));
        });
    };

    // 数平合作上报
    // ts           行为时间，秒
    // uin          QQ号
    // action     
    // source_id    平台id
    // biz_id       商家id
    // shop_id      门店id
    // coup_id      优惠id
    // price        价格
    // latitude     用户经度
    // longitude    用户纬度
    // coordinate   用户坐标系
    // stype        渠道id
    // url          当前url
    // referer      来源url
    // module       热门精选优惠、热门精选门店、好友推荐门店
    // type         数平推荐、运营配置、gdt
    // object       coupon, biz, shop
    // city         城市
    // index        数平推荐时所在的index
    // offline_version 前端离线包版本
    // algfilever   算法文件版本
    // algver       算法主版本
    // algsubver    算法文件版本
    // reserved1    预留1
    // reserved2    预留2
    // reserved3    预留3

    var doTdbReport = $.debounce(function(){
        if(!tdbReportParam){
            var locateData = $.geo.getLocalData();

            tdbReportParam = $.extend({
                sid: $U.getUrlParam('sid'),
                stype: $U.getStype().join('_'),
                url: location.href.substring(0, location.href.indexOf('?')),
                referer: document.referrer && document.referrer.substring(0, document.referrer.indexOf('?')),
                offline_version: $EV.timestamp
            }, {
                longitude: locateData.maplng,
                latitude: locateData.maplat,
                coordinate: locateData.coordinate
            });
        }

        $.ajax({
            url: TDB_REPORT_CGI,
            type: 'POST',
            data: $.extend({}, tdbReportParam, {list: JSON.stringify(tdbReportQueue)})
        });

        tdbReportQueue = [];
    }, REPORT_CACHE_TIME, false);

    $R.tdbReport = function(param){
        tdbReportQueue.push(param);
        doTdbReport();
    };
})(Zepto)
;;(function($){
    var $EV = $.env,
        $R = $.report;

    var STORAGE_PREFIX = 'coupon-',

        // native存储接口
        MQQ_STORAGE_HOST = 'qq.com',    // 存储host
        MQQ_STORAGE_PATH = 'coupon',    // 存储path
        MQQ_STORAGE_READ_TIMEOUT = 2000,    // 读取数据超时时间

        // native存储接口错误码
        ERROR_NO_SPACE_OR_NO_SDCARD = -9,   // 手机没有存储卡或卡上可用空间不足
        ERROR_DATA_NOT_EXIST = -11,     // key对应的数据不存在
        ERROR_TOO_MANY_DATA = -12,      // 超过native接口本身总大小的限制

        // 其他常量
        RET_STORAGE_ERROR = -1,
        RET_CLIENT_DISABLE = -2,
        RET_CLIENT_ERROR = -3,
        RET_CLIENT_TIMEOUT = -4,
        RET_PARAM_ERROR = -5;

    var callid = 0,
        clientDisable = false,
        localCacheData = {},
        sessionCacheData = {};

    var _storage = {
        stringifyData : function(data){
            data = data === undefined || data === null? '' : data;

            if(typeof data == 'object'){
                data = JSON.stringify(data);
            }

            return data;
        },
        parseData: function(data){
            try{
                data = JSON.parse(data);
            }catch(e){}

            return data;
        },
        clear : function(){
            // 清除旧的缓存数据
            var version = this.getStorage({key: 'version'});
            if(!version || version < $EV.version){
                for(var item in localStorage){
                    if(item.indexOf(STORAGE_PREFIX) == 0){
                        delete localStorage[item];
                    }
                }
            }

            // 缓存版本号，用来区分新旧版
            this.saveStorage({
                key: 'version',
                value: $EV.version
            });
        },
        saveStorage : function(options){
            options = options || {};

            var storage = options.sessionStorage === true? sessionStorage : localStorage,
                key = options.key,
                value = options.value,
                callback = options.callback || $.emptyFunction;

            var data = this.stringifyData(value);

            try{
                storage[STORAGE_PREFIX + key] = data;
            }catch(e){
                $R.errorReport("browserStorage.overflow", location.href, 0);
            }

            callback();
        },
        getStorage : function(options){
            options = options || {};

            var storage = options.sessionStorage === true? sessionStorage : localStorage,
                key = options.key,
                callback = options.callback || $.emptyFunction;

            var data = this.parseData(storage[STORAGE_PREFIX + key]);

            callback(data);

            return data;
        },
        delStorage : function(options){
            options = options || {};

            var storage = options.sessionStorage === true? sessionStorage : localStorage,
                key = options.key,
                callback = options.callback || $.emptyFunction;

            delete storage[STORAGE_PREFIX + key];

            callback();
        },
        saveClient : function(options){
            var self = this;

            options = options || {};
            
            var host = options.host || MQQ_STORAGE_HOST,
                path = options.path || MQQ_STORAGE_PATH,
                key = options.key,
                value = options.value,
                callback = options.callback || $.emptyFunction;
                useLocalStorage = options.useLocalStorage === false? false : true;

            var data = this.stringifyData(value); 

            // 需要的话copy一份放在localStorage里面
            if(useLocalStorage){
                this.saveStorage({
                    key: key,
                    value: data
                });
            }

            if(clientDisable){
                callback();
                return;
            }

            if(mqq.support('mqq.data.writeH5Data')){
                mqq.data.writeH5Data({
                    callid: callid++,
                    host: host,
                    path: path,
                    key: key,
                    data: data
                }, function(result){
                    if(!result || result.ret == ERROR_NO_SPACE_OR_NO_SDCARD || result.ret == ERROR_TOO_MANY_DATA){
                        clientDisable = true;
                    }
                    callback();
                });
            }else{
                clientDisable = true;
                callback();
            }
        },
        getClient : function(options){
            var self = this;

            options = options || {};
            
            var host = options.host || MQQ_STORAGE_HOST,
                path = options.path || MQQ_STORAGE_PATH,
                key = options.key,
                callback = options.callback || $.emptyFunction,
                timeout = options.timeout || MQQ_STORAGE_READ_TIMEOUT,
                useLocalStorage = options.useLocalStorage === false? false : true;

            if(useLocalStorage){
                data = this.parseData(this.getStorage({key: key}));

                if(data){
                    callback(data);
                    return;
                }
            }

            if(clientDisable){
                callback();
                return; 
            }

            if(mqq.support('mqq.data.readH5Data')){
                if(timeout){
                    var readTimeout = setTimeout(function(){
                        callback();
                        callback = $.emptyFunction;
                    }, timeout);
                }
                
                mqq.data.readH5Data({
                    callid: callid++,
                    host: host,
                    path: path,
                    key: key
                }, function(result){
                    clearTimeout(readTimeout);

                    if(!result || result.ret == ERROR_NO_SPACE_OR_NO_SDCARD){
                        clientDisable = true;

                        callback();
                    }else if(result.ret == 0 && result.response){
                        var data = result.response.data;

                        data = self.parseData(data);

                        if(useLocalStorage){
                            // fix localStorage丢失问题
                            self.saveStorage({
                                key: key,
                                value : data
                            });
                        }

                        callback(data);
                    }else{
                        callback();
                    }
                });
            }else{
                clientDisable = true;
                callback();
            }
        },
        delClient : function(options){
            var self = this;

            options = options || {};

            var host = options.host || MQQ_STORAGE_HOST,
                path = options.path || MQQ_STORAGE_PATH,
                key = options.key || '',
                callback = options.callback || $.emptyFunction,
                useLocalStorage = options.useLocalStorage === false? false : true;

            if(useLocalStorage){
                this.delStorage({
                    key : key
                });
            }

            if(mqq.support('mqq.data.deleteH5Data')){
                mqq.data.deleteH5Data({
                    callid: callid++,
                    host: host,
                    path: path,
                    key: key
                }, function(result){
                    callback();
                });
            }else{
                clientDisable = true;
                callback();
            }
        }
    }

    $.storage = {
        // 下面做了一层封装，使外层调用形式统一
        save: function(options){
            if(options.useClient){
                _storage.saveClient(options);
            }else{
                _storage.saveStorage(options);
            }
        },
        get: function(options){
            if(typeof options == 'string'){
                return _storage.getStorage({key: options});
            }else if(options){
                if(options.useClient){
                    _storage.getClient(options);
                }else{
                    return _storage.getStorage(options);
                }
            }
        },
        del: function(options){
            if(typeof options == 'string'){
                _storage.delStorage({key: options});
            }else if(options){
                if(options.useClient){
                    _storage.delClient(options);
                }else{
                    _storage.delStorage(options);
                }
            }
        }
    }

    _storage.clear();
})(Zepto);;;(function($){
    var $C = $.config,
        $U = $.util;

    $.eventHelper = {
        isWebviewVisibility: true,

        commandHandle: {},
        proxyHandle: [],
        
        hasBindCmdTap: false, 

        bindCmdTap: function(handle){
            var self = this;

            if($.isFunction(handle)){
                this.proxyHandle.push(handle);
            }else{
                $.extend(this.commandHandle, handle);
            }

            if(!this.hasBindCmdTap){
                this.hasBindCmdTap = true;

                $(document).on('tap', '[cmd]', function(e){
                    var $el = $(e.currentTarget),
                        cmd = $el.attr('cmd');

                    if($el.attr('disable')){
                        return;
                    }

                    var command = self.commandHandle[cmd],
                        proxyHandle = self.proxyHandle;
                        
                    $el.active(function(){
                        var returnValue;

                        // 优先用proxyHandle来处理
                        for(var i = 0, l = proxyHandle.length; i < l; i++){
                            returnValue = proxyHandle[i]($el, cmd);

                            // true表示已经正确处理，会跳过后续的handle
                            if(returnValue === true){
                                return;
                            }
                        }

                        if(command){
                            if($.isFunction(command)){
                                command($el)
                            }else if($.isFunction(command.handle) && command.context){
                                handle.call(context, $el);
                            }
                        }
                    });
                });
            }
        },
        onWebviewVisibilityChange: function(visibleCallback, invisibleCallback){
            var self = this;
            $(document).on('qbrowserVisibilityChange', function(e){
                var r = e.hidden;

                if(!r){
                    visibleCallback && visibleCallback();
                }else{
                    invisibleCallback && invisibleCallback();
                }
            });
        }
    };
})(Zepto);;(function($){
    var $U = $.util,
        $EV = $.env,
        $S = $.storage,
        $R = $.report;

    // 常量
    var FLAG_NATIVE_SUCCESS = -1,   // 客户端接口成功

        FLAG_NATIVE_FAILURE = 0,    // 客户端接口失败
        FLAG_NATIVE_TIMEOUT = 1,    // 客户端接口超时

        FLAG_NATIVE_DISABLE = 2,    // ios定位未开启    
        FLAG_NATIVE_UNAUTHORIZED = 3,   // ios定位开启但未对手Q授权

        FLAG_CGI_FAILURE = 4,   // cgi定位失败

        FLAG_USER_CANCEL = 5,   // 用户主动取消定位

        FLAG_ALL_SUCCESS = 6,   // 定位成功，cgi成功返回用户具体位置，包括城市、地区等

        LOCATION_TIME_TIMEOUT = 15000,  // 定位超时时间

        CACHE_TIME = 5*60*1000,   // 定位信息缓存时间，5分钟？

        DEFAULT_DATA = {
            maplng : 0,     // 经度
            maplat : 0,     // 纬度
            coordinate : 0,     // 坐标系，0表示地球，1表示火星

            lastLocaTime: 0,    // 上次定位时间

            info: {},    // 位置信息描述
            city: ''    // city在info中就有了，这里为了方便复制一个到外面来
        };

    var isLocating = false,
        
        locationTimer,
        richLoadingTimer,

        success,
        error;

    function removeTimeout(){
        if(locationTimer){
            clearTimeout(locationTimer);

            locationTimer = null;
        }

        if(richLoadingTimer){
            pro.richLoading.hide();

            clearTimeout(richLoadingTimer);

            richLoadingTimer = null;
        }
    }

    function doCallback(flag, param, report){
        isLocating = false;

        removeTimeout();

        // 全等于false才不上报，undefined也会上报
        // 处理web定位不上报，以免产生干扰统计
        if(report !== false){
            $R.speedReport('getLocation', 0, +new Date());   // 客户端接口测速上报

            geo.report(flag, param && param.adata);     // 客户端接口结果上报
        }

        if(flag == FLAG_NATIVE_SUCCESS){
            // 注释掉是怕这里只存经纬度导致缓存中经纬度和位置信息对不上
            // if(param.adata === undefined){      // 非基站信息定位，定位成功后直接存储经纬度
            //     geo.saveLocation(param);
            // }

            success(param);    // cgi定位之后一定回调
        }else{
            error(flag);
        }
    }

    // 客户端定位回调
    window.getLocationCallback = function(ret, lat, lon){
        //  定位已被取消
        if(!isLocating){
            return;
        }

        if($.os.android){
            if(ret == 0 && lat && lat.data){    // 4.6新定位接口，android返回基站信息
                doCallback(FLAG_NATIVE_SUCCESS, {
                    adata : lat.data,
                    decrypt_padding : lat.decrypt_padding || 0      // decrypt_padding表示加密方式，修复客户端加密bug
                });
            }else if(ret == 0 && lon != 0 && lat != 0){
                doCallback(FLAG_NATIVE_SUCCESS, {
                    coordinate : 1,     // android定位到的是火星坐标
                    maplng : Math.round(lon * 1000000),
                    maplat : Math.round(lat * 1000000)
                });
            }else{
                doCallback(FLAG_NATIVE_FAILURE);
            }
        }else if($.os.ios){
            // IOS8在定位授权中增加了`使用应用程序期间`选项
            // authroized==4
            // 重写状态，直接走4.6定位成功的逻辑
            if(ret < 0 && lon && lon.authroized == 4){
                ret = 2;
            }

            if(ret < 0 && lon){      // ios 4.7 返回定位是否开启，是否授权手Q
                if(!lon.enabled){
                    doCallback(FLAG_NATIVE_DISABLE);
                }else if(lon.authroized != 3){
                    doCallback(FLAG_NATIVE_UNAUTHORIZED);
                }else{
                    doCallback(FLAG_NATIVE_FAILURE);
                }
            }else if(ret == 2 && lat && lat.lon != 0 && lat.lat != 0){    // 4.6新定位接口
                doCallback(FLAG_NATIVE_SUCCESS, {
                    coordinate : 0,     // ios定位到的是地球坐标
                    maplng : Math.round(lat.lon * 1000000),
                    maplat : Math.round(lat.lat * 1000000)
                });
            }else if(ret == 0 && lon != 0 && lat != 0){
                doCallback(FLAG_NATIVE_SUCCESS, {
                    coordinate : 1,
                    maplng : Math.round(lon * 1000000),
                    maplat : Math.round(lat * 1000000)
                });
            }else{
                doCallback(FLAG_NATIVE_FAILURE);
            }
        }
    };

    // web定位callback
    function webGetLocationCallback(ret, lat, lon){
        //  定位已被取消
        if(!isLocating){
            return;
        }

        if(ret){
            doCallback(FLAG_NATIVE_SUCCESS, {
                coordinate : 0,
                maplng : lon,
                maplat : lat
            }, false);
        }else{
            doCallback(FLAG_NATIVE_FAILURE, undefined, false);
        }
    }

    var geo = {
        useClient: true,
        storageKey : 'locate-data',
        tryLoadCache : function(useClient, refresh, callback){
            var self = this;

            if(refresh || !this.data){
                $S.get({
                    useClient: useClient,
                    key: this.storageKey,
                    callback: function(data){
                        if(data){
                            self.data = data;
                        }else if(useClient){        // 如果客户端都获取失败了，就直接初始化成默认值了
                            self.data = DEFAULT_DATA;
                        }

                        callback && callback(self.data || DEFAULT_DATA);
                    },
                    refresh: refresh
                });
            }else{
                callback && callback(self.data);
            }
        },

        processData: function(){
            this.data = $.extend(DEFAULT_DATA, this.data);
        },
        // 获取localStorage中缓存的位置信息
        getLocalData: function(refresh){
            this.tryLoadCache(false, refresh);

            return this.data || DEFAULT_DATA;
        },
        // 根据时间判断定位信息是否在有效
        needLocation : function(cacheTime, callback){
            var self = this;

            var data = this.data;

            cacheTime = cacheTime || CACHE_TIME;

            if(!data){
                var fn = arguments.callee,
                    args = arguments;

                this.tryLoadCache(true, false, function(){
                    fn.apply(self, args);
                });

                return;
            }

            if(data.maplng && data.maplat && data.city && (+new Date() - data.lastLocaTime) < cacheTime){
                // add by jdochen
                callback(false, data);
            }else{
                callback(true);
            }
        },

        /*
         * 存储
         * cgi返回位置信息时调用locateOver来存储
         */
        saveLocation: function(param){
            if(param){
                if(param.lastLocaTime === undefined){
                    param.lastLocaTime = this.locaTime || +new Date();
                }

                // 存储前检查数据
                for(var key in DEFAULT_DATA){
                    if(param[key] === undefined){
                        return;
                    }
                }
            
                this.data = param;

                $S.save({
                    useClient: this.useClient,
                    key: this.storageKey,
                    value: this.data
                });
            }
        },

        // 重置定位信息
        resetLocation: function(){
            this.saveLocation(DEFAULT_DATA);
        },

        //定位结果上报
        report: function(flag, adata, ret){
            var data = this.data;

            var param = {
                module : 'locate_over',
                action : flag,
                res5 : ret || ''    // 用于cgi失败时上报错误码
            };

            if(this.locateFlag == FLAG_NATIVE_SUCCESS){    
                if(adata){      // 基站定位上报基站信息
                    param.obj1 = adata;
                }else{      // 非基站定位上报经纬度
                    param.obj1 = data.maplng;
                    param.obj2 = data.maplat;
                }
            }else if(this.locateFlag == FLAG_ALL_SUCCESS){
                param.obj3 = (data.info && data.info.city) || '';
            }

            $R.standReport(param);
        },

        // 用户取消定位上报
        userCancelReport: function(){
            this.report(FLAG_USER_CANCEL);
        },

        isLocating : function(){
            return isLocating;
        },

        // 取消定位
        cancelLocation : function(){
            isLocating = false;

            removeTimeout();

            success = $.emptyFunction;
            error = $.emptyFunction;
        },

        /*
         * 定位  
         * @params
         *   cacheTime 缓存有效时间
         *   success 成功回调
         *   error 失败回调
         *   richLoading 定位过程中是否有提示
         *   userCancelCallback 用户取消定位回调
         *   cgi 客户端定位之后调用cgi（因为涉及到定位信息存储，为了对调用者透明，这里封装了一层）
         *   useAData 是否调用新接口获取adata，针对android机器，cgi不支持解析adata的情况，默认不传，不获取adata传false
         */
        getLocation : function(params){
            var self = this;

            if(isLocating) return;    // 正在定位中直接返回
         
            isLocating = true;

            success = params.success || $.emptyFunction;
            error = params.error || this.showErrorToast;

            $EV.envReady(function(){
                // 超时容错逻辑
                locationTimer = setTimeout(function(){
                    doCallback(FLAG_NATIVE_TIMEOUT);
                }, LOCATION_TIME_TIMEOUT);

                $R.speedReport('getLocation', +new Date);   // 测速上报

                if(params.richLoading){
                    richLoadingTimer = setTimeout(function(){
                        pro.richLoading.show({
                            content: '正在定位...',
                            onClose: function(){
                                self.cancelLocation();

                                self.userCancelReport();

                                params.userCancelCallback && params.userCancelCallback();
                            }
                        })
                    }, 5000);
                }

                this.locaTime = +new Date();    // 记录定位的时间

                if(mqq.support('mqq.sensor.getRealLocation') && !($.os.android && params.useAData === false)){
                    mqq.sensor.getRealLocation({
                        desiredAccuracy : ($EV.network == 'wifi'? 1 : 2),   // 4.6新定位接口，desiredAccuracy表示精度，仅对ios起作用
                        decrypt_padding: 1      // android新的加密方式
                    }, getLocationCallback);    
                } else if(mqq.support('mqq.sensor.getLocation')){
                    mqq.sensor.getLocation(getLocationCallback);
                } else if (navigator.geolocation) {
                    //调用h5接口
                    var options = {
                        timeout: LOCATION_TIME_TIMEOUT,
                        maximumAge: LOCATION_TIME_TIMEOUT
                    };
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var maplat = position.coords.latitude.toFixed(6) * 1000000;
                        var maplng = position.coords.longitude.toFixed(6) * 1000000;
                        webGetLocationCallback(true, maplat, maplng);
                    }, function(e) {
                        webGetLocationCallback(false);
                    }, options);
                }else{
                    // todo:
                }
            }); 
        },

        // 用于cgi定位之后的回调，主要是处理存储和上报
        locateOver: function(data, param, retcode){
            if(!param){
                return;
            }

            var flag;

            if(data){
                var saveParam = {};

                if(param.adata && data.maplng && data.maplat){      // 基站定位cgi会返回经纬度
                    saveParam.maplng = data.maplng;
                    saveParam.maplat = data.maplat;
                    saveParam.coordinate = 1;      // cgi返回的都是火星坐标
                }else{
                    saveParam.maplng = param.maplng || 0;
                    saveParam.maplat = param.maplat || 0;
                    saveParam.coordinate = param.coordinate || 0;
                }

                if(data.subnation){
                    saveParam.info = data.subnation;
                    saveParam.city = data.subnation.city || '';

                    // 有经纬度对应的位置信息才存储
                    this.saveLocation(saveParam);
                }

                flag = FLAG_ALL_SUCCESS;
                this.report(flag);
            }else{
                flag = FLAG_CGI_FAILURE;
                this.report(flag, param && param.adata, retcode);
            }
        },

        showErrorToast: function(flag) {
            var text;

            if(flag == FLAG_NATIVE_DISABLE || flag == FLAG_NATIVE_UNAUTHORIZED){
                text = '定位失败，请在设置里开启定位服务';
            }else{
                text = '定位失败，请稍后重试';
            }

            pro.toast.show({
                content: text
            });
        }
    };

    $.geo = geo;
})(Zepto);
;(function(){
  window._ = {};

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    // if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

})();