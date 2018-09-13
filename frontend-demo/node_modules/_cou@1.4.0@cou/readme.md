cou
===

[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-image]][david-url]
[npm-image]: https://img.shields.io/npm/v/cou.svg?style=flat-square
[npm-url]: https://npmjs.org/package/cou
[downloads-image]: http://img.shields.io/npm/dm/cou.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/cou
[david-image]: http://img.shields.io/david/chunpu/cou.svg?style=flat-square
[david-url]: https://david-dm.org/chunpu/cou

[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]

Core Util Javascript Lib

Installation
---

```sh
npm i cou
```

Usage
---

```js
var _ = require('min-util')
```

#### Type Check

`_.is` equals [min-is](https://github.com/chunpu/min-is)

```js
assert(_.is.arraylike({0: 'foo', length: 1}))
```

#### Core Util Function

- `_.extend` same as `_.assign`
- `_.each`
- `_.map`
- `_.filter`
- `_.some`
- `_.every`
- `_.reduce`
- `_.findIndex`
- `_.find`
- `_.indexOf`
- `_.toArray`
- `_.size`
- `_.has`
- `_.includes`
- `_.slice`
- `_.negate`
- `_.keys`
- `_.forIn`
- `_.trim`
- `_.noop`
- `_.len` return length of object, unofficial


Support
---

- all browsers even `IE6+`
- node.js

License
---

[![License][license-image]][license-url]

[travis-image]: https://img.shields.io/travis/chunpu/cou.svg?style=flat-square
[travis-url]: https://travis-ci.org/chunpu/cou
[coveralls-image]: https://img.shields.io/coveralls/chunpu/cou/gh-pages.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/chunpu/cou
[gittip-image]: https://img.shields.io/gittip/chunpu.svg?style=flat-square
[gittip-url]: https://www.gittip.com/chunpu/
[license-image]: http://img.shields.io/npm/l/cou.svg?style=flat-square
[license-url]: #
