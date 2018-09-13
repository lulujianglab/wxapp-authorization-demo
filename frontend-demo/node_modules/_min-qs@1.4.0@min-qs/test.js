var assert = require('assert')
var qs = require('./')


describe('parse', function() {
	it('should return object', function() {
		var ret = qs.parse('a=1&b=foo')
		assert.deepEqual(ret, {
			a: 1,
			b: 'foo'
		})
	})

	it('should decode', function() {
		var ret = qs.parse('%23=%20&b=%23%24')
		assert.deepEqual(ret, {
			'#': ' ',
			b: '#$'
		})
	})

	it('can custom seq and eq', function() {
		var ret = qs.parse('a:1;b:2', ';', ':')
		assert.deepEqual(ret, {
			a: 1,
			b: 2
		})
	})

	it('return empty obj when meet shit', function() {
		var invalid = [undefined, null, function() {}, '', 100, {}]
		for (var i = 0; i < invalid.length; i++) {
			var ret = qs.parse(invalid[i])
			assert.deepEqual(ret, {})
		}
	})

	it('support keepRaw option to return raw string', function() {
		var ret = qs.parse('%26%3D=%20', {keepRaw: true})
		assert.deepEqual(ret, {'%26%3D': '%20'})
	})

})

describe('stringify', function() {
	it('basic', function() {
		var ret = qs.stringify({
			a: 1,
			b: 'foo'
		})
		assert('a=1&b=foo' == ret || 'b=foo&a=1' == ret)
	})

	it('should encode and decode will get self', function() {
		var dirty = {
			'#': ' ',
			b: '#$'
		}
		assert.deepEqual(dirty, qs.parse(qs.stringify(dirty)))
	})

	it('default will encode key and value', function() {
		var ret = qs.stringify({
			'&=': ' '
		})
		assert.deepEqual(ret, '%26%3D=%20')
	})

	it('support keepRaw option to not encode key and value', function() {
		var ret = qs.stringify({
			'&=': ' '
		}, {keepRaw: true})
		assert.deepEqual(ret, '&== ')
	})

	it('can custom sep and eq', function() {
		var ret = qs.stringify({
			a: 1,
			b: 2
		}, ';', ':')
		assert('a:1;b:2' == ret || 'b:2;a:1' == ret)
	})

	it('should return empty string when meet shit', function() {
		var invalid = [undefined, null, '', {}, 100, function() {}]
		for (var i = 0; i < invalid.length; i++) {
			var ret = qs.stringify(invalid[i])
			assert.deepEqual(ret, '')
		}
	})

	it('support sort option', function() {
		var ret = qs.stringify({
			c: 3,
			a: 1,
			b: 2,
			aa: 11
		}, {
			sort: true
		})
		assert.deepEqual(ret, 'a=1&aa=11&b=2&c=3')
	})

	it('support custom sort option', function() {
		var ret = qs.stringify({
			c: 3,
			a: 1,
			b: 2,
			aa: 11,
			bbb: 222
		}, {
			sort: function(a, b) {
				a += ''
				b += ''
				if (a.length != b.length) {
					return a.length - b.length
				}
				return a > b
			}
		})

		assert.deepEqual(ret, 'a=1&b=2&c=3&aa=11&bbb=222')
	})

	it('can custom ignore values', function() {
		var ret = qs.stringify({
			'0': 0,
			'empty': '',
			'NaN': NaN,
			'null': null,
			'undefined': undefined,
			'false': false
		}, {
			sort: true,
			ignoreValues: [undefined, null]
		})

		assert.deepEqual(ret, '0=0&NaN=&empty=&false=false')
	})

})
