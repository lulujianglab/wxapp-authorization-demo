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
