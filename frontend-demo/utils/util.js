const qs = require('min-qs')
const _ = require('min-util')
import http from '@chunpu/http'

let util = exports

http.init({
  baseURL: 'http://localhost:9999',
  wx: wx
})

http.interceptors.response.use(response => {
  var { headers, data, status } = response
  if (data && typeof data === 'object') {
    // always spread the response data for directly usage
    Object.assign(response, data)
    // console.log(data)
    if (data.code !== 0) {
      return Promise.reject(new Error(data.message || 'error'))
    }
  }
  if (status >= 400) {
    return Promise.reject(new Error('error'))
  }
  var setCookie = headers['set-cookie'] || ''
  var cookie = setCookie.split('; ')[0]
  if (cookie) {
    var cookie = qs.parse(cookie)
    return util.promisify(wx.getStorage)({
      key: 'cookie'
    }).catch(() => { }).then(res => {
      res = res || {}
      var allCookie = res.allCookie || {}
      Object.assign(allCookie, cookie)
      return util.promisify(wx.setStorage)({
        key: 'cookie',
        data: allCookie
      })
    }).then(() => {
      return response
    })
  } else {
    return response
  }
})

http.interceptors.request.use(config => {
  return util.promisify(wx.getStorage)({
    key: 'cookie'
  }).catch(() => { }).then(res => {
    if (res && res.data) {
      Object.assign(config.headers, {
        Cookie: qs.stringify(res.data, ';', '=')
      })
    }
    return config
  })
  return config
})

_.extend(exports, {
  promisify(original) {
    return function (opt) {
      return new Promise((resolve, reject) => {
        opt = Object.assign({
          success: resolve,
          fail: reject
        }, opt)
        original(opt)
      })
    }
  },
  showToast(opt) {
    opt = _.extend({
      title: '',
      duration: 1500,
      mask: false
    }, opt)
    opt.icon = opt.type
    if (opt.type === 'success') {
      opt.icon = 'success'
    } else if (opt.type === 'error') {
      opt.icon = 'none'
      opt.title = opt.title || '未知错误'
    }
    if (opt.title) {
      opt.title = opt.title.replace(/，<a.*a>/, '') //去掉 html 标签提示
    }
    delete opt.type
    return exports.promisify(wx.showToast)(opt)
  },
  showError(err) {
    var title = '未知错误'
    if (_.isString(err)) {
      title = err
    } else if (err) {
      title = err.errmsg || err.errMsg || err.message || err.msg
    }
    return exports.showToast({
      title: title,
      type: 'error'
    })
  },
  request(data, opt) {
    // 所有请求都要默认带 cookie
    // TODO 全部换成 fetch.js
    return util.promisify(wx.getStorage)({
      key: 'token'
    }).catch(_.noop).then(_data => {
      var token = _.get(_data, 'data')

      var header = {}
      if (token) {
        header = { Cookie: qs.stringify({ token: token }, '; ', '=') }
      }
      return util.doRequest(data, _.extend({ header }, opt))
    })
  },
  doRequest(data, opt) {
    opt = _.extend({
      showMessage: 'error',
      needAll: false
    }, opt)
    return new Promise((resolve, reject) => {
      // var baseUrl = 'https://easy.ainfinit.com/api'
      opt = _.extend({
        url: '/',
        method: 'get',
        dataType: 'json',
        header: {
        },
        success: resolve,
        fail: reject
      }, opt)
      opt.data = data
      opt.url = baseUrl + opt.url
      console.log('request', opt)
      wx.request(opt)
    }).catch(err => {
      if (opt.showMessage === 'error') {
        exports.showError(err)
      }
      return Promise.reject(err)
    }).then(res => {
      var data = res.data || {}
      if (data.code != null) {
        // 说明有 code
        if (parseInt(data.code) === 10200) {
          // 成功
        } else {
          if (opt.showMessage === 'error') {
            exports.showError(data)
          }
          return Promise.reject(data) // 传完整的 data
        }
      }
      if (opt.needAll) {
        return res
      } else {
        return data
      }
    })
  }
})