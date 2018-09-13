min-qs
===

[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-image]][david-url]

[npm-image]: https://img.shields.io/npm/v/min-qs.svg?style=flat-square
[npm-url]: https://npmjs.org/package/min-qs
[downloads-image]: http://img.shields.io/npm/dm/min-qs.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/min-qs
[david-image]: http://img.shields.io/david/chunpu/min-qs.svg?style=flat-square
[david-url]: https://david-dm.org/chunpu/min-qs


Mini Querystring Parse and Stringify Library

Installation
---

```sh
npm i min-qs
```

Usage
---

just like querystring in node.js

```js
var qs = require('min-qs')
qs.parse('foo=bar')
qs.stringify({foo: 'bar'})
```

No nested or array support, can also custom sep and eq

```js
qs.parse('a:1;b:2', ';', ':')
```

Options
---

`keepRaw` if false will not do any encode or decode, default is true

```js
var ret = qs.stringify({
	'&=': ' '
}, {keepRaw: true})
assert.deepEqual(ret, '&== ')
```

`sort` true or sort function

```js
var ret = qs.stringify({
	c: 3,
	a: 1,
	b: 2,
	aa: 11
}, {
	sort: true
})
assert.deepEqual(ret, 'a=1&aa=11&b=2&c=3')
```

`ignoreValues` ignore some values, default is `[undefined]`

```js
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
```

License
---

[![License][license-image]][license-url]

[travis-image]: https://img.shields.io/travis/chunpu/min-qs.svg?style=flat-square
[travis-url]: https://travis-ci.org/chunpu/min-qs
[license-image]: http://img.shields.io/npm/l/min-qs.svg?style=flat-square
[license-url]: #
