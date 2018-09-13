var _ = require('min-util')
var is = _.is

var defaultOption = {
	sep: '&',
	eq: '=',
	encode: encodeURIComponent,
	decode: decodeURIComponent,
	keepRaw: false,
	sort: null,
	ignoreValues: [undefined]
}

exports.parse = function(qs, sep, eq, opt) {
	qs += ''
	opt = getOpt(sep, eq, opt)
	var decode = opt.decode
	// var ret = {}
	qs = qs.split(opt.sep)

	return _.reduce(qs, function(ret, arr) {
		arr = arr.split(opt.eq)
		if (2 == arr.length) {
			var k = arr[0]
			var v = arr[1]
			if (!opt.keepRaw) {
				try {
					k = decode(k)
					v = decode(v)
				} catch (ignore) {}
			}
			ret[k] = v
		}
		return ret
	}, {})
}

exports.stringify = function(obj, sep, eq, opt) {
	opt = getOpt(sep, eq, opt)

	var keys = _.keys(obj)

	var sort = opt.sort
	if (sort) {
		if (is.fn(sort)) {
			keys.sort(sort)
		} else {
			keys.sort()
		}
	}

	var encode = opt.encode

	var arr = []
	_.each(keys, function(key) {
		var val = obj[key]
		if (!_.includes(opt.ignoreValues, val)) {
			if (is.nan(val) || null == val) {
				val = ''
			}
			if (!opt.keepRaw) {
				key = encode(key)
				val = encode(val)
			}
			arr.push(key + opt.eq + val)
		}
	})
	return arr.join(opt.sep)
}

function getOpt(sep, eq, opt) {
	// can be
	// _
	// opt
	// sep, opt
	// sep, eq, opt
	opt = _.find(arguments, function(val) {
		return is.object(val)
	})
	sep = is.nos(sep) ? sep : undefined
	eq = is.nos(eq) ? eq : undefined
	opt = _.extend({}, defaultOption, opt, {sep: sep, eq: eq})
	return opt
}

