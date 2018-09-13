module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1536828770115, function(require, module, exports) {
module.exports = require('./src/index.js')

}, function(modId) {var map = {"./src/index.js":1536828770116}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770116, function(require, module, exports) {
const _ = require('min-util')
const HttpClient = require('./http')

const instance = new HttpClient()

module.exports = exports = http // always export a function

function http(...args) {
  return instance.request(...args)
}

for (var key in instance) {
  var val = instance[key]
  if (_.isFunction(val)) {
    val = _.bind(val, instance)
  }
  http[key] = val
}

}, function(modId) { var map = {"./http":1536828770117}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770117, function(require, module, exports) {
const _ = require('min-util')
const Url = require('min-url')
const qs = require('min-qs')
const Queue = require('./queue')
const utils = require('./utils')
const adapters = require('./adapters')

const JSON_TYPE = 'application/json'
const URL_TYPE = 'application/x-www-form-urlencoded'
const CONTENT_TYPE_KEY = utils.CONTENT_TYPE_KEY
const simpleMethods = ['get', 'head', 'delete', 'options']
const dataMethods = ['post', 'put', 'patch']
const httpMethods = [...simpleMethods, ...dataMethods]

// TODO recognize timeout error type
function HttpClient (opt) {
  // has defaults, interceptors two key
  this.defaults = {
    baseURL: '',
    timeout: 0,
    headers: {
      common: {}
    },
    withCredentials: false
  }
  _.each(httpMethods, method => {
    var header = this.defaults.headers[method] = {}
    if (_.includes(dataMethods, 'method')) {
      header[method] = JSON_TYPE
    }
  })

  this.interceptors = {
    request: new Queue(),
    response: new Queue()
  }

  this.qs = qs

  this.init(opt)
}

HttpClient.qs = qs

var proto = HttpClient.prototype

proto.init = function (opt) {
  // not exist in axios
  opt = _.extend({}, opt)
  this.defaults.headers.common = opt.headers || {}
  delete opt.headers
  _.extend(this.defaults, opt)
}

proto.create = function (opt) {
  return new HttpClient(opt)
}

proto.request = function (arg1, arg2) {
  if (_.isString(arg1)) {
    return this.request(_.extend({url: arg1}, arg2))
  }
  var config = arg1 || {}
  config.headers = config.headers || {} // 必须有值
  config = _.extend({}, this.defaults, config)

  var url = config.baseURL + config.url
  url = Url.appendQuery(url, config.params)

  var method = _.toLower(config.method) || 'get'
  var defaultHeaders = this.defaults.headers
  var headers = _.extend({}, defaultHeaders.common, defaultHeaders[method], config.headers)
  var contentType = utils.getContentType(headers)
  var guessRequestType = contentType

  // 序列化 request data
  var data = config.data
  if (_.isPlainObject(data)) {
    // 只序列化 plain object, 其他直接发送, 比如字符串, FormData, Blob 之类的
    if (contentType === URL_TYPE) {
      data = qs.stringify(data)
    } else if (contentType === JSON_TYPE) {
      data = JSON.stringify(data)
    }
    if (!guessRequestType) {
      if (_.isString(data)) {
        guessRequestType = URL_TYPE
      }
    }
    if (!_.isString(data)) {
      data = JSON.stringify(data) // 默认用 json
      guessRequestType = guessRequestType || JSON_TYPE
    }
    if (!contentType && guessRequestType) {
      headers[CONTENT_TYPE_KEY] = guessRequestType
    }
  } else {
    if (utils.isFormData(data)) {
      // Let the browser set it
      delete headers[CONTENT_TYPE_KEY]
    }
  }

  var timeout = config.timeout

  // TODO auth...
  config = {
    url,
    data,
    headers,
    method: _.toUpper(method),
    withCredentials: config.withCredentials
  }

  if (timeout) {
    config.timeout = timeout
  }

  return Promise.resolve(config)
    .then(config => this.interceptors.request.exec(config)) // after get config
    .then(config => this.adapter.call(this, config))
    .then(response => {
      // 尝试解析 response.data, 总是尝试解析成 json(就像 axios 一样), 因为后端通常写不对 mime
      if (_.isString(response.data)) {
        if (!this.axios) {
          var rawResponse = response.data
          try {
            response.data = JSON.parse(response.data)
          } catch (err) {
            response.data = rawResponse
          }
        }
      }
      response.config = config
      response.headers = _.mapKeys(response.headers, (value, key) => {
        return _.toLower(key) // All header names are lower cased
      })
      return response
    })
    .then(response => this.interceptors.response.exec(response)) // after parse data
}

// axios adapter
proto.adapter = function (config) {
  var defaults = this.defaults
  if (defaults.wx) {
    return adapters.wx.call(this, config)
  } else if (defaults.axios) {
    return adapters.axios.call(this, config)
  } else if (defaults.jQuery) {
    return adapters.jquery.call(this, config)
  } else if (defaults.quickapp) {
    return adapters.quickapp.call(this, config)
  } else if (typeof XMLHttpRequest === 'function') {
    return adapters.xhr.call(this, config)
  }
}

_.each(simpleMethods, method => {
  proto[method] = function (url, config) {
    return this.request(_.extend({
      method,
      url
    }, config))
  }
})

_.each(dataMethods, method => {
  proto[method] = function (url, data, config) {
    return this.request(_.extend({
      url,
      method,
      data
    }, config))
  }
})

module.exports = exports = HttpClient

}, function(modId) { var map = {"./queue":1536828770118,"./utils":1536828770119,"./adapters":1536828770120}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770118, function(require, module, exports) {
const _ = require('min-util')

module.exports = Queue

function Queue() {
  this.queue = []
}

_.extend(Queue.prototype, {
  use (...middleware) {
    this.queue.push(middleware)
    return this
  },
  exec (value) {
    return _.reduce(this.queue, (prev, middleware) => {
      return prev.then(...middleware)
    }, Promise.resolve(value))
  }
})

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770119, function(require, module, exports) {
const _ = require('min-util')

const CONTENT_TYPE_KEY = 'Content-Type'
const reContentType = new RegExp(CONTENT_TYPE_KEY, 'i')

function getContentType(headers) {
  var headerKeys = _.keys(headers)
  var typeKey = _.find(headerKeys, key => {
    return reContentType.test(key)
  })
  return headers[typeKey]
}

function parseHeadersFromXhr(xhr) {
  return _.chain(xhr.getAllResponseHeaders())
    .trim()
    .split('\n')
    .reduce((ret, header) => {
      var i = _.indexOf(header, ':')
      var key = _.toLower(_.trim(_.slice(header, 0, i)))
      var value = _.trim(_.slice(header, i + 1))
      if (ret[key]) {
        ret[key] = ',' + value // 多个 cookie 用 `,` 分隔, 无空格
      } else {
        ret[key] = value
      }
      return ret
    }, {})
    .value()
}

function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData)
}

function timeout(time) {
  return new Promise((resolve, reject) => {
    if (timeout) {
      setTimeout(() => {
        reject(new Error('timeout'))
      }, time)
    }
  })
}

function clearTimer(timer) {
  if (timer) {
    clearTimeout(timer)
  }
}

function createError(message, obj) {
  var err = new Error(message)
  _.extend(err, obj)
  return err
}

exports.CONTENT_TYPE_KEY = CONTENT_TYPE_KEY
exports.getContentType = getContentType
exports.parseHeadersFromXhr = parseHeadersFromXhr
exports.isFormData = isFormData
exports.timeout = timeout
exports.clearTimer = clearTimer
exports.createError = createError

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770120, function(require, module, exports) {
const wx = require('./wx')
const quickapp = require('./quickapp')
const axios = require('./axios')
const jquery = require('./jquery')
const xhr = require('./xhr')

exports.wx = wx
exports.quickapp = quickapp
exports.axios = axios
exports.jquery = jquery
exports.xhr = xhr

}, function(modId) { var map = {"./wx":1536828770121,"./quickapp":1536828770122,"./axios":1536828770123,"./jquery":1536828770124,"./xhr":1536828770125}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770121, function(require, module, exports) {
const utils = require('../utils')

module.exports = function(config) {
  var defaults = this.defaults
  if (defaults && defaults.wx) {
    // https://developers.weixin.qq.com/miniprogram/dev/api/network-request.html#wxrequestobject
    var timer
    return new Promise((resolve, reject) => {
      var task = defaults.wx.request({
        url: config.url,
        data: config.data,
        header: config.headers,
        method: config.method,
        success (response) {
          utils.clearTimer(timer)
          var {data, statusCode, header} = response
          resolve({
            data,
            status: statusCode,
            headers: header
          })
        },
        fail (err) {
          utils.clearTimer(timer)
          reject(err)
        }
      })

      if (config.timeout) {
        timer = setTimeout(() => {
          if (task && task.abort) {
            task.abort
          }
          reject(utils.createError('timeout'))
        }, config.timeout)
      }
    })
  }
}

}, function(modId) { var map = {"../utils":1536828770119}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770122, function(require, module, exports) {
const utils = require('../utils')

module.exports = function(config) {
  var defaults = this.defaults
  if (defaults && defaults.quickapp) {
    // https://doc.quickapp.cn/features/system/fetch.html
    return new Promise((resolve, reject) => {
      defaults.quickapp.fetch({
        url: config.url,
        data: config.data,
        header: config.headers,
        method: config.method,
        success (response) {
          utils.clearTimer(timer)
          var {data, code, headers} = response
          resolve({
            data,
            status: code,
            headers
          })
        },
        fail (data, code) {
          utils.clearTimer(timer)
          reject({data, code})
        }
      })

      if (config.timeout) {
        timer = setTimeout(() => {
          reject(utils.createError('timeout'))
        }, config.timeout)
      }
    })
  }
}

}, function(modId) { var map = {"../utils":1536828770119}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770123, function(require, module, exports) {
module.exports = function(config) {
  var defaults = this.defaults
  if (defaults && defaults.axios) {
    // https://github.com/axios/axios
    return defaults.axios.request(config).then(response => {
      return response
    })
  }
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770124, function(require, module, exports) {
const utils = require('../utils')

module.exports = function(config) {
  var defaults = this.defaults
  if (defaults && defaults.jQuery) {
    // http://api.jquery.com/jquery.ajax/
    return new Promise((resolve, reject) => {
      defaults.jQuery.ajax({
        url: config.url,
        data: config.data,
        headers: config.headers,
        method: config.method,
        timeout: config.timeout,
        withCredentials: config.withCredentials,
        success (data, textStatus, jqXHR) {
          resolve({
            data,
            status: 200,
            headers: utils.parseHeadersFromXhr(jqXHR)
          })
        },
        error (jqXHR, textStatus, errorThrown) {
          reject(utils.createError(errorThrown, {
            response: jqXHR,
            textStatus: textStatus
          }))
        }
      })
    })
  }
}

}, function(modId) { var map = {"../utils":1536828770119}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770125, function(require, module, exports) {
const utils = require('../utils')

module.exports = function(config) {
  // default use XMLHttpRequest
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.onload = ev => {
      resolve({
        status: xhr.status,
        data: xhr.responseText,
        headers: utils.parseHeadersFromXhr(xhr)
      })
    }
    xhr.ontimeout = ev => {
      reject(utils.createError('timeout'))
    }
    xhr.onerror = ev => {
      reject(utils.createError('error'))
    }
    xhr.open(config.method, config.url, true)
    if (config.timeout) {
      xhr.timeout = config.timeout
    }
    if (config.withCredentials) {
      xhr.withCredentials = config.withCredentials
    }
    _.forIn(config.headers, (value, key) => {
      xhr.setRequestHeader(key, value)
    })
    xhr.send(config.data)
  })
}

}, function(modId) { var map = {"../utils":1536828770119}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1536828770115);
})()
//# sourceMappingURL=index.js.map