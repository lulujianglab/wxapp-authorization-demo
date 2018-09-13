module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1536828770152, function(require, module, exports) {
var _ = require('min-util')
var is = _.is

var open = 1
var close = 0

module.exports = Ctor

function Ctor(queueList) {
	var me = this
	if (!(me instanceof Ctor)) return new Ctor(queueList)
	me.queueList = queueList || []
	me.close()
}

var proto = Ctor.prototype

proto.queue = function() {
	var me = this
	var args = arguments
	if (me.isOpen) {
		me.exec(args)
	} else {
		me.queueList.push(args)
	}
}

proto.close = function() {
	this.isOpen = false
}

proto.open = function() {
	this.isOpen = true
	this.execAll()
}

proto.execAll = function() {
	var me = this
	var queue = me.queueList
	_.each(queue, function(args) {
		me.exec(args)
	})
	queue.length = 0
}

proto.exec = function(args) {
	var func
	var first = _.first(args)
	var ctx = this.ctx
	if (is.fn(first)) {
		func = first
	} else {
		func = _.get(ctx, first)
	}
	if (is.fn(func)) {
		try {
			func.apply(ctx, _.slice(args, 1))
		} catch (ignore) {}
	}
}

proto.overwriteQueue = function(name) {
	var me = this
	global[name] = function() {
		me.queue.apply(me, arguments)
	}
}

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1536828770152);
})()
//# sourceMappingURL=index.js.map