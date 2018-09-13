// wiki: http://en.wikipedia.org/wiki/URI_scheme
// spec: https://url.spec.whatwg.org/
// e.g. http://user:pass@host.com:8080/p/a/t/h?query=string#hash

var qs = require('min-qs')
var _ = require('min-util')

exports.parse = function(url, parseQuery) {
  if ('string' != typeof url) {
    return url
  }

  var ret = {}, arr, rest

  ret.href = url

  // hash
  arr = split(url, '#')
  rest = arr[0]
  if (arr[1]) {
    ret.hash = '#' + arr[1]
  }

  // get scheme
  arr = splicePattern(rest, /^[a-zA-Z][a-zA-Z0-9+-.]*:/)
  rest = arr[1]
  ret.protocol = arr[0].toLowerCase()

  // query
  arr = split(rest, '?')
  rest = arr[0]
  var query = arr[1]
  if (parseQuery) {
    query = qs.parse(query)
  }
  ret.query = query

  // rest: `//user:pass@host.com:8080/p/a/t/h`

  // not normal like http url
  if ('/' != rest.charAt(0)) {
    if (ret.schema) {
      // rootless paths per RFC 3986 as opaque
      // like mailto:xxx.com/path
      ret.opaque = rest
      return ret
    }
  }

  // normal
  if (_.startsWith(rest, '//')) {
    rest = rest.slice(2)
    arr = split(rest, '/')

    ret.pathname = '/' + unescape(arr[1] || '')

    arr = parseAuthority(arr[0])
    ret.auth = arr[0]

    // hostname, port
    var host = arr[1]
    arr = split(host, ':')
    ret.hostname = arr[0]
    ret.port = ~~arr[1]
  }

  return ret
}

var slashProtocols = 'http https ftp gopher file'.split(' ')

exports.format = function(obj) {
  if (!obj || 'object' != typeof obj) return obj
  var protocol = obj.protocol
  var arr = [protocol]

  if (!protocol || _.includes(slashProtocols, protocol.slice(0, protocol.length - 1))) {
    arr.push('//')
  }

  if (obj.auth) {
    arr.push(obj.auth, '@')
  }

  arr.push(obj.hostname)

  if (obj.port) {
    arr.push(':', obj.port)
  }

  arr.push(obj.pathname)

  var query = obj.query
  if (query) {
    if ('string' != typeof query) {
      query = qs.stringify(query)
    }
    if (query) {
      arr.push('?', query)
    }
  }

  arr.push(obj.hash)

  var ret = []
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) ret.push(arr[i])
  }

  return ret.join('')
}

exports.appendQuery = function(url, query) {
    var arr = split(url, '#')
    url = arr[0]
    var fragment = arr[1]

    if (_.isObject(query)) {
      query = qs.stringify(query)
    }

    if (_.includes(url, '?')) {
      // has query
      if (!_.endsWith(url, '&') && !_.endsWith(url, '?')) {
        if (query) {
          query = '&' + query
        }
      }

    } else {
      // no query
      if (query) {
        query = '?' + query
      }
    }

    if (query) {
      url += query
    }

    if (fragment) {
      url += '#' + fragment
    }

    return url
}

function splicePattern(str, reg) {
  var ret = ''
  str = str.replace(reg, function(matched) {
    ret = matched
    return ''
  })
  return [ret, str]
}

function split(str, sep) {
  var arr = []
  var index = _.indexOf(str, sep)
  if (-1 == index) {
    arr[0] = str
  } else {
    arr[0] = str.slice(0, index)
    arr[1] = str.slice(index + sep.length)
  }
  return arr
}

function parseAuthority(authAndHost) {
  var arr = split(authAndHost, '@')
  var auth = arr[0]
  var host = arr[1]
  if (!host) {
    host = arr[0]
    auth = null
  }
  return [auth, host]
}
