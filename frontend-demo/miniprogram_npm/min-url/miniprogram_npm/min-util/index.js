module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1536828770237, function(require, module, exports) {
module.exports = require('./src')

/* webpack only
if (DEBUG && global.console) {
	console.debug('debug mode')
}
*/

}, function(modId) {var map = {"./src":1536828770238}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770238, function(require, module, exports) {
var cou = require('cou')

module.exports = cou.extend(_, cou)

require('./lang')(_)
require('./util')(_)
require('./array')(_)
require('./object')(_)
require('./function')(_)
require('./string')(_)
require('./math')(_)

_.mixin(_, _)

function _(val) {
	if (!(this instanceof _)) return new _(val)
	this.__value = val
	this.__chain = false
}

}, function(modId) { var map = {"./lang":1536828770239,"./util":1536828770240,"./array":1536828770241,"./object":1536828770242,"./function":1536828770243,"./string":1536828770245,"./math":1536828770246}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770239, function(require, module, exports) {
module.exports = function(_) {

var is = _.is

_.isString = is.string

_.isArray = is.array

_.isArrayLike = is.arraylike

_.isBoolean = is.bool

_.isElement = is.element

_.isEmpty = is.empty

_.isFunction = is.fn

_.isInteger = is.integer

_.isNaN = is.nan

_.isNumber = is.number

_.isObject = is.object

_.isPlainObject = is.plainObject

_.isRegExp = is.regexp

_.isString = is.string

_.isUndefined = is.undef

}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770240, function(require, module, exports) {
module.exports = function(_) {

var is = _.is

_.now = function() {
	return +new Date
}

_.constant = function(val) {
	return function() {
		return val
	}
}

_.identity = function(val) {
	return val
}

_.random = function(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1))
}

_.mixin = function(dst, src, opt) {
	var keys = _.functions(src)
	if (dst) {
		if (is.fn(dst)) {
			opt = opt || {}
			var isChain = !!opt.chain
			// add to prototype
			var proto = dst.prototype
			_.each(keys, function(key) {
				var fn = src[key]
				proto[key] = function() {
					var me = this
					var args = [me.__value]
					args.push.apply(args, arguments)
					var ret = fn.apply(me, args)
					if (me.__chain) {
						me.__value = ret
						return me
					}
					return ret
				}
			})
		} else {
			_.each(keys, function(key) {
				dst[key] = src[key]
			})
		}
	}
	return dst
}

_.chain = function(val) {
	var ret = _(val)
	ret.__chain = true
	return ret
}

_.value = function() {
	this.__chain = false
	return this.__value
}

}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770241, function(require, module, exports) {
module.exports = function(_) {

var each = _.forEach = _.each
var includes = _.includes
var is = _.is
var proto = Array.prototype

_.reject = function(arr, fn) {
	return _.filter(arr, function(val, i, arr) {
		return !fn(val, i, arr)
	})
}

_.without = function(arr) {
	var other = _.slice(arguments, 1)
	return _.difference(arr, other)
}

_.difference = function(arr, other) {
	var ret = []
	_.each(arr, function(val) {
		if (!includes(other, val)) {
			ret.push(val)
		}
	})
	return ret
}

_.pluck = function(arr, key) {
	return _.map(arr, function(item) {
		if (item) return item[key]
	})
}

_.nth = function(arr, n) {
	n = getRealIndex(n, arr)
	n = n || 0
	var ret
	if (_.isString(arr)) {
		ret = arr.charAt(n)
	} else {
		ret = arr[n]
	}
	return ret
}

_.first = function(arr) {
	if (arr) return _.nth(arr, 0)
}

_.last = function(arr) {
	var len = _.len(arr)
	if (len) {
		return _.nth(arr, len - 1)
	}
}

_.asyncMap = function(arr, fn, cb) {
	// desperate
	var ret = []
	var count = 0
	var hasDone, hasStart

	each(arr, function(arg, i) {
		hasStart = true
		fn(arg, function(err, val) {
			if (hasDone) return
			count++
			if (err) {
				hasDone = true
				return cb(err)
			}
			ret[i] = val
			if (count == arr.length) {
				hasDone = true
				cb(null, ret)
			}
		})
	})

	if (!hasStart) cb(null) // empty
}

_.uniq = function(arr) {
	return _.uniqBy(arr)
}

_.uniqBy = function(arr, fn) {
	var ret = []
	var pool = []
	if (!is.fn(fn)) {
		fn = null
	}
	each(arr, function(item) {
		var val = item
		if (fn) {
			val = fn(item)
		}
		if (!includes(pool, val)) {
			pool.push(val)
			ret.push(item)
		}
	})
	return ret
}

_.flatten = function(arrs) {
	var ret = []
	each(arrs, function(arr) {
		if (is.arraylike(arr)) {
			each(arr, function(item) {
				ret.push(item)
			})
		} else ret.push(arr)
	})
	return ret
}

_.union = function() {
	return _.uniq(_.flatten(arguments))
}

_.sample = function(arr, n) {
	var ret = _.toArray(arr)
	var len = ret.length
	var need = Math.min(n || 1, len)
	for (var i = 0; i < len; i++) {
		var rand = _.random(i, len - 1)
		var tmp = ret[rand]
		ret[rand] = ret[i]
		ret[i] = tmp
	}
	ret.length = need
	if (null == n) {
		return ret[0]
	}
	return ret
}

_.shuffle = function(arr) {
	return _.sample(arr, Infinity)
}

_.compact = function(arr) {
	return _.filter(arr, _.identity)
}

_.rest = function(arr) {
	return _.slice(arr, 1)
}

_.invoke = function() {
	var args = arguments
	var arr = args[0]
	var fn = args[1]
	var isFunc = is.fn(fn)
	args = _.slice(args, 2)

	return _.map(arr, function(item) {
		if (isFunc) {
			return fn.apply(item, args)
		}
		if (null != item) {
			var method = item[fn]
			if (is.fn(method)) {
				return method.apply(item, args)
			}
		}
	})
}

_.partition = function(arr, fn) {
	var hash = _.groupBy(arr, function(val, i, arr) {
		var ret = fn(val, i, arr)
		if (ret) return 1
		return 2
	})
	return [hash[1] || [], hash[2] || []]
}

_.groupBy = function(arr, fn) {
	var hash = {}
	_.each(arr, function(val, i, arr) {
		var ret = fn(val, i, arr)
		hash[ret] = hash[ret] || []
		hash[ret].push(val)
	})
	return hash
}

_.range = function() {
	var args = arguments
	if (args.length < 2) {
		return _.range(args[1], args[0])
	}
	var start = args[0] || 0
	var last = args[1] || 0
	var step = args[2]
	if (!is.number(step)) {
		step = 1
	}
	var count = last - start
	if (0 != step) {
		count = count / step
	}
	var ret = []
	var val = start
	for (var i = 0; i < count; i++) {
		ret.push(val)
		val += step
	}
	return ret
}

_.pullAt = function(arr) {
	// `_.at` but mutate
	var indexes = _.slice(arguments, 1)
	return mutateDifference(arr, indexes)
}

_.remove = function(arr, fn) {
	// `_.filter` but mutate
	var len = _.len(arr) || 0
	var indexes = []
	while (len--) {
		if (fn(arr[len], len, arr)) {
			indexes.push(len)
		}
	}
	return mutateDifference(arr, indexes)
}

_.fill = function(arr, val, start, end) {
	var size = _.size(arr)
	start = getRealIndex(start, arr) || 0
	end = getRealIndex(end, arr) || size
	for (var i = start; i < end; i++) {
		arr[i] = val
	}
	return arr
}

_.size = function(val) {
	// size is safe length
	var size = 0
	if (val) {
		var len = val.length
		if (_.isInteger(len) && len >= 0) {
			size = len
		} else if (_.isObject(val)) {
			size = _.keys(val).length
		}
	}
	return size
}

// support negative
function getRealIndex(index, arr) {
	var size = _.size(arr)
	if (index < 0) {
		index += size
	}
	if (index < 0) {
		index = 0 // smallest is zero
	}
	if (index > size) {
		index = size // biggest is size, because [start, end)
	}
	return index || 0 // default zero
}

function mutateDifference(arr, indexes) {
	var ret = []
	var len = _.len(indexes)
	if (len) {
		indexes = indexes.sort(function(a, b) {
			return a - b
		})
		while (len--) {
			var index = indexes[len]
			ret.push(proto.splice.call(arr, index, 1)[0])
		}
	}
	ret.reverse()
	return ret
}

}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770242, function(require, module, exports) {
module.exports = function(_) {

var is = _.is
var each = _.each
var forIn = _.forIn

_.only = function(obj, keys) {
	obj = obj || {}
	if (is.string(keys)) keys = keys.split(/ +/)
	return _.reduce(keys, function(ret, key) {
		if (null != obj[key]) ret[key] = obj[key]
		return ret
	}, {})
}

_.values = function(obj) {
	return _.map(_.keys(obj), function(key) {
		return obj[key]
	})
}

_.pick = function(obj, fn) {
	if (!is.fn(fn)) {
		return _.pick(obj, function(val, key) {
			return key == fn
		})
	}
	var ret = {}
	forIn(obj, function(val, key, obj) {
		if (fn(val, key, obj)) {
			ret[key] = val
		}
	})
	return ret
}

_.functions = function(obj) {
	return _.keys(_.pick(obj, function(val) {
		return is.fn(val)
	}))
}

_.mapKeys = function(obj, fn) {
	var ret = {}
	forIn(obj, function(val, key, obj) {
		var newKey = fn(val, key, obj)
		ret[newKey] = val
	})
	return ret
}

_.mapObject = _.mapValues = function(obj, fn) {
	var ret = {}
	forIn(obj, function(val, key, obj) {
		ret[key] = fn(val, key, obj)
	})
	return ret
}

// return value when walk through path, otherwise return empty
_.get = function(obj, path) {
	path = toPath(path)
	if (path.length) {
		var flag = _.every(path, function(key) {
			if (null != obj) { // obj can be indexed
				obj = obj[key]
				return true
			}
		})
		if (flag) return obj
	}
}

_.has = function(obj, path) {
	path = toPath(path)
	if (path.length) {
		var flag = _.every(path, function(key) {
			if (null != obj && is.owns(obj, key)) {
				obj = obj[key]
				return true
			}
		})
		if (flag) return true
	}
	return false
}

_.set = function(obj, path, val) {
	path = toPath(path)
	var cur = obj
	_.every(path, function(key, i) {
		if (is.oof(cur)) {
			if (i + 1 == path.length) {
				cur[key] = val
			} else {
				var item = cur[key]
				if (null == item) {
					// fill value with {} or []
					var item = {}
					if (~~key == key) {
						item = []
					}
				}
				cur = cur[key] = item
				return true
			}
		}
	})
	return obj
}

_.create = (function() {
	function Object() {} // so it seems like Object.create
	return function(proto, property) {
		// not same as Object.create, Object.create(proto, propertyDescription)
		if ('object' != typeof proto) {
			// null is ok
			proto = null
		}
		Object.prototype = proto
		return _.extend(new Object, property)
	}
})()

_.defaults = function() {
	var args = arguments
	var target = args[0]
	var sources = _.slice(args, 1)
	if (target) {
		_.each(sources, function(src) {
			_.mapObject(src, function(val, key) {
				if (is.undef(target[key])) {
					target[key] = val
				}
			})
		})
	}
	return target
}

_.isMatch = function(obj, src) {
	var ret = true
	obj = obj || {}
	forIn(src, function(val, key) {
		if (val !== obj[key]) {
			ret = false
			return false
		}
	})
	return ret
}

_.toPlainObject = function(val) {
	var ret = {}
	forIn(val, function(val, key) {
		ret[key] = val
	})
	return ret
}

_.invert = function(obj) {
	var ret = {}
	forIn(obj, function(val, key) {
		ret[val] = key
	})
	return ret
}

// topath, copy from lodash

var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g
var reEscapeChar = /\\(\\)?/g;

function toPath(val) {
	if (is.array(val)) return val
	var ret = []
	_.toString(val).replace(rePropName, function(match, number, quote, string) {
		var item = number || match
		if (quote) {
			item = string.replace(reEscapeChar, '$1')
		}
		ret.push(item)
	})
	return ret
}

}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770243, function(require, module, exports) {
module.exports = function(_) {

var is = _.is
var slice = _.slice

_.bind = function(fn, ctx) {
	if (is.string(ctx)) {
		var obj = fn
		fn = obj[ctx]
		ctx = obj
	}
	if (!is.fn(fn)) return fn
	var args = slice(arguments, 2)
	ctx = ctx || this
	return function() {
		return fn.apply(ctx, _.flatten([args, arguments]))
	}
}

// from lang.js `Function.prototype.inherits`
// so belong to function
_.inherits = function(ctor, superCtor) {
	ctor.super_ = superCtor
	ctor.prototype = _.create(superCtor.prototype, {
		constructor: ctor
	})
}

_.delay = function(fn, wait) {
	var args = _.slice(arguments, 2)
	return setTimeout(function() {
		fn.apply(this, args)
	}, wait)
}

_.before = function(n, fn) {
	return function() {
		if (n > 1) {
			n--
			return fn.apply(this, arguments)
		}
	}
}

_.once = function(fn) {
	return _.before(2, fn)
}

_.after = function(n, fn) {
	return function() {
		if (n > 1) {
			n--
		} else {
			return fn.apply(this, arguments)
		}
	}
}

_.throttle = function(fn, wait, opt) {
	wait = wait || 0
	opt = _.extend({
		leading: true,
		trailing: true,
		maxWait: wait
	}, opt)
	return _.debounce(fn, wait, opt)
}

_.debounce = function(fn, wait, opt) {
	wait = wait || 0
	opt = _.extend({
		leading: false,
		trailing: true
	}, opt)
	var maxWait = opt.maxWait
	var lastExec = 0 // wait
	var lastCall = 0 // just for maxWait
	var now = _.now()
	var timer

	if (!opt.leading) {
		lastExec = now
	}

	function ifIsCD() {
		if (now - lastExec > wait) return false
		if (maxWait && now - lastCall > maxWait) return false
		return true
	}

	function exec(fn, ctx, args) {
		lastExec = _.now() // update last exec
		return fn.apply(ctx, args)
	}

	function cancel() {
		if (timer) {
			clearTimeout(timer)
			timer = null
		}
	}

	function debounced() {
		now = _.now() // update now
		var isCD = ifIsCD()
		lastCall = now // update last call
		var me = this
		var args = arguments

		cancel()

		if (!isCD) {
			exec(fn, me, args)
		} else {
			if (opt.trailing) {
				timer = _.delay(function() {
					exec(fn, me, args)
				}, wait)
			}
		}
	}

	debounced.cancel = cancel

	return debounced
}

function memoize(fn) {
	var cache = new memoize.Cache
	function memoized() {
		var args = arguments
		var key = args[0]
		if (!cache.has(key)) {
			var ret = fn.apply(this, args)
			cache.set(key, ret)
		}
		return cache.get(key)
	}
	memoized.cache = cache
	return memoized
}

memoize.Cache = require('./cache')

_.memoize = memoize

_.wrap = function(val, fn) {
	return function() {
		var args = [val]
		args.push.apply(args, arguments)
		return fn.apply(this, args)
	}
}

_.curry = function(fn) {
	var len = fn.length
	return setter([])

	function setter(args) {
		return function() {
			var arr = args.concat(_.slice(arguments))
			if (arr.length >= len) {
				arr.length = len
				return fn.apply(this, arr)
			}
			return setter(arr)
		}
	}
}

}

}, function(modId) { var map = {"./cache":1536828770244}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770244, function(require, module, exports) {
var cou = require('cou')
var is = cou.is

module.exports = Cache

function Cache() {
	this.data = {}
}

var proto = Cache.prototype

proto.has = function(key) {
	return is.owns(this.data, key)
}

proto.get = function(key) {
	return this.data[key]
}

proto.set = function(key, val) {
	this.data[key] = val
}

proto['delete'] = function(key) {
	delete this.data[key]
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770245, function(require, module, exports) {
module.exports = function(_) {

_.tostr = _.toString = tostr // lodash toString

var indexOf = _.indexOf

_.split = function(str, separator, limit) {
	str = tostr(str)
	return str.split(separator, limit)
}

_.capitalize = function(str) {
	str = tostr(str)
	return str.charAt(0).toUpperCase() + str.substr(1)
}

_.decapitalize = function(str) {
	str = tostr(str)
	return str.charAt(0).toLowerCase() + str.substr(1)
}

_.camelCase = function(str) {
	str = tostr(str)
	var arr = str.split(/[^\w]|_+/)
	arr = _.map(arr, function(val) {
		return _.capitalize(val)
	})
	return _.decapitalize(arr.join(''))
}

_.startsWith = function(str, val) {
	return 0 == indexOf(str, val)
}

_.endsWith = function(str, val) {
	val += '' // null => 'null'
	return val == _.slice(str, _.len(str) - _.len(val))
}

_.toLower = _.lower = function(str) {
	// lodash toLower
	return tostr(str).toLowerCase()
}

_.toUpper = _.upper = function(str) {
	// lodash toUpper
	return tostr(str).toUpperCase()
}

_.repeat = function(str, count) {
	return _.map(_.range(count), function() {
		return str
	}).join('')
}

_.padStart = function(str, len, chars) {
	str = tostr(str)
	len = len || 0
	var delta = len - str.length
	return getPadStr(chars, delta) + str
}

_.padEnd = function(str, len, chars) {
	str = tostr(str)
	len = len || 0
	var delta = len - str.length
	return str + getPadStr(chars, delta)
}


var htmlEscapes = {
  '&': '&amp',
  '<': '&lt',
  '>': '&gt',
  '"': '&quot',
  "'": '&#39'
}

_.escape = function(str) {
    return tostr(str).replace(/[&<>"']/g, function(item) {
        return htmlEscapes[item] || item
    })
}

// 不支持定制 templateSettings
_.template = function(str) {
	var arr = ['with(data) {var ret = ""']
	_.each(_.split(str, '<%'), function(x, i) {
		var two = x.split('%>')
		if (two[1]) {
			genJS(_.trim(two[0]))
			return filter(two[1])
		}
		filter(two[0])
	})

	arr.push('return ret}')
	var func = new Function('data', arr.join('\n'))
	var internalData = {
		_: _
	}
	var ret = function(data) {
		return func(_.extend({}, internalData, data))
	}
	return ret

	function genJS(jsstr) {
		var first = _.first(jsstr)
		if (first === '=' || first === '-') {
			var text = _.slice(jsstr, 1)
			if (first === '-') {
				text = '_.escape(' + text + ')'
			}
			arr.push('ret += ' + text) // 插入文本
		} else {
			arr.push(jsstr)
		}
	}

	function filter(html) {
		arr.push('ret += "' + html.replace(/('|"|\\)/g, '\\$1').replace(/\r/g, '\\r').replace(/\n/g, '\\n') + '"')
	}
}

function getPadStr(chars, len) {
	chars = tostr(chars) || ' ' // '' will never end
	var count = Math.floor(len / chars.length) + 1
	return _.repeat(chars, count).slice(0, len)
}

function tostr(str) {
	if (str || 0 == str) return str + ''
	return ''
}

}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1536828770246, function(require, module, exports) {
module.exports = function(_) {

_.sum = function(arr) {
	return _.reduce(arr, function(sum, val) {
		return sum + val
	}, 0)
}

_.max = function(arr, fn) {
	var index = -1
	var data = -Infinity
	fn = fn || _.identity
	_.each(arr, function(val, i) {
		val = fn(val)
		if (val > data) {
			data = val
			index = i
		}
	})
	if (index > -1) {
		return arr[index]
	}
	return data
}

_.min = function(arr, fn) {
	var index = -1
	var data = Infinity
	fn = fn || _.identity
	_.each(arr, function(val, i) {
		val = fn(val)
		if (val < data) {
			data = val
			index = i
		}
	})
	if (index > -1) {
		return arr[index]
	}
	return data
}

}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1536828770237);
})()
//# sourceMappingURL=index.js.map