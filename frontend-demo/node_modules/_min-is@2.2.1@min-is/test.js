var assert = require('assert')
var is = require('./')

describe('browser', function() {
	it('is browser', function() {
		if (global.window) {
			assert(true === is.browser())
		}
	})
})

describe('mobile', function() {
	it('can detect mobile or pc browser', function() {
		if (is.browser()) {
			if (undefined === document.ontouchstart) {
				// most situation is equal
				assert(false === is.mobile)
			} else {
				assert(true === is.mobile)
			}
		}
	})
})

describe('owns', function() {
	it('is owns', function() {
		assert(is.owns({a: 1}, 'a'))
	})
	it('is not owns', function() {
		var o = {}
		assert(o.toString)
		assert(!is.owns(o, 'toString'))
	})
})

describe('bool', function() {
	it('is bool', function() {
		assert(is.bool(true))
		assert(is.bool(false))
	})
	it('is not bool', function() {
		assert(!is.bool(1))
		assert(!is.bool({}))
		assert(!is.bool('true'))
	})
})

describe('number', function() {
	it('is number', function() {
		assert(!is.number(NaN))
		assert(!is.number(''))
		assert(!is.number())
		assert(!is.number(null))
		assert(!is.number(Number))
		assert(is.number(0))
		assert(is.number(-100))
		assert(is.number(-100))
		assert(is.number(10.3242342))
		assert(is.number(Math.PI))
		assert(is.number(Infinity))
		assert(is.number(-Infinity))
	})

	it('is iod', function() {
		assert(!is.iod(Infinity))
		assert(!is.iod(-Infinity))
		assert(!is.iod(NaN))
		assert(!is.iod(''))
		assert(is.iod(1000))
		assert(is.iod(0))
		assert(is.iod(0.23423))
	})

	it('is integer', function() {
		assert(is.integer(100))
		assert(is.integer(0))
		assert(!is.integer(10.24))
		assert(!is.integer(NaN))
		assert(!is.integer(''))
		assert(!is.integer(isNaN))
	})

	it('is decimal', function() {
		assert(is.decimal(10.24))
		assert(is.decimal(-0.24))

		assert(!is.decimal(0))
		assert(!is.decimal(NaN))
		assert(!is.decimal())
	})

	it('is nan', function() {
		assert(!is.nan())
		assert(!is.nan(null))
		assert(is.nan(NaN))

		assert(!is.nan(Infinity))
		assert(!is.nan(0))
		assert(!is.nan(10.24))
	})
})

describe('function', function() {
	it('is fn', function() {
		assert(is.fn(function() {}))
		assert(is.fn(isNaN))
		assert(is.fn(Date))
	})

	it('is not fn', function() {
		assert(!is.fn(new Date))
		assert(!is.fn(/x/))
		assert(!is.fn('a'))
		assert(!is.fn())
		assert(!is.fn(null))
		assert(!is.fn(1024))
	})
})

describe('string', function() {
	it('is string', function() {
		assert(is.string('a'))
		assert(is.string(''))
		
		assert(is.string(Object('a')))
		assert(is.string(String('a')))
		assert(is.string(new String('a')))
	})

	it('is not string', function() {
		assert(!is.string(1024))
		assert(!is.string({a: 1}))
		assert(!is.string(/x/))
		assert(!is.string(Date))
		assert(!is.string())
		assert(!is.string(null))
	})
})

describe('array', function() {
	it('is array', function() {
		assert(is.array([]))
		assert(is.array([1, 2, 3]))
	})

	it('is not array', function(done) {
		assert(!is.array())
		assert(!is.array({}))
		assert(!is.array({0: 1, length: 1}))
		assert(!is.array(Date))
		assert(!is.array(/x/))
		!function() {
			assert(!is.array(arguments))
			done()
		}(1, 2, 3)
	})
})

describe('arraylike', function() {
	it('is arraylike', function(done) {
		assert(is.arraylike([]))
		assert(is.arraylike({0: 'foo', length: 1}))
		assert(is.arraylike({length: 0}))
		!function() {
			assert(is.arraylike(arguments))
			done()
		}(1, 2, 3)
	})

	it('is not arraylike', function() {
		assert(!is.arraylike())
		assert(!is.arraylike({}))
		assert(!is.arraylike({length: 1.2}))
		assert(!is.arraylike({length: -2}))
		assert(!is.arraylike({length: NaN}))
		assert(!is.arraylike({length: Infinity}))
		assert(!is.arraylike(true))
		assert(!is.arraylike(global))
	})
})

describe('object', function() {
	it('is object', function() {
		assert(is.object({}))
		assert(is.object(new Date))
		assert(is.object(global))
		assert(is.object(Object('a')))
	})

	it('is not obj', function() {
		assert(!is.object())
		assert(!is.object(null))
		assert(!is.object(true))
	})
})

describe('hash, plain object', function() {
	it('is hash', function() {
		assert(is.hash({}))
		assert(is.hash({a: 1}))
	})

	it('is not hash', function() {
		assert(!is.hash())
		assert(!is.hash(null))
		
		if (is.browser()) {
			assert(!is.hash(document))
			assert(!is.hash(window))
			assert(!is.hash(document.createElement('div')))
		}
		
		assert(!is.hash(true))
		assert(!is.hash(new Boolean()))
		assert(!is.hash(new Date))
		assert(!is.hash(new Number))
		assert(!is.hash(''))
		
		
		assert(!is.hash(Object('a')))
		assert(!is.hash(1024))
		assert(!is.hash(/x/))
		assert(!is.hash(Date))
		assert(!is.hash({nodeType: 1}))
	})
	
})

describe('empty', function() {
	it('is empty', function(done) {
		assert(is.empty())
		assert(is.empty({}))
		assert(is.empty(null))
		assert(is.empty([]))
		assert(is.empty({0: 1, length: 0}))
		assert(is.empty(new String))
		assert(is.empty(''))
		assert(is.empty(111))
		assert(is.empty(false))
		assert(is.empty(true))
		assert(is.empty(/x/))
		assert(is.empty(function(a, b, c){}))
		assert(is.empty(Date))
		!function() {
			assert(is.empty(arguments))
			done()
		}()
	})

	it('is not empty', function(done) {
		assert(!is.empty('x'))
		assert(!is.empty([1]))
		assert(!is.empty({length: 1}))
		assert(!is.empty({a: 1}))
		!function() {
			assert(!is.empty(arguments))
			done()
		}(1, 2, 3)
	})
})

describe('element', function() {
	it('is element', function() {
		if (is.browser()) {
			assert(is.element(document.createElement('div')))
		}
	})

	it('is not element', function() {
		if (is.browser()) {
			assert(!is.element(document))
		}
	})
})

describe('regexp', function() {
	it('is regexp', function() {
		assert(is.regexp(/1/))
		assert(is.regexp(new RegExp))
	})

	it('is not regexp', function() {
		assert(!is.regexp(RegExp))
		assert(!is.regexp())
		assert(!is.regexp(null))
	})
})
