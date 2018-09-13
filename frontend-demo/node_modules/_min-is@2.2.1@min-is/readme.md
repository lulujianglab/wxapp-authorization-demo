min-is
===

[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-image]][david-url]
[npm-image]: https://img.shields.io/npm/v/min-is.svg?style=flat-square
[npm-url]: https://npmjs.org/package/min-is
[downloads-image]: http://img.shields.io/npm/dm/min-is.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/min-is
[david-image]: http://img.shields.io/david/chunpu/min-is.svg?style=flat-square
[david-url]: https://david-dm.org/chunpu/min-is


Check if a value is something

Installation
---

```sh
npm i min-is
```

Api
---

##### helper

- `is.browser` detect is browser
- `is.h5` simple modern browser detect
- `is.mobile` detect mobile browser or pc browser
- `is.wechatApp` detect wechat app

##### basic function

- `is.owns`, short for `Object.prototype.hasOwnProperty.call`
- `is.bool`
- `is.number`
- `is.integer`
- `is.decimal`
- `is.undef`
- `is.hash` `is.plainObject`
- `is.object`
- `is.fn`
- `is.string`
- `is.array`
- `is.arraylike`
- `is.empty`
- `is.element`
- `is.regexp`
- `is.nan`, only `NaN` is true, other is false, unlike `isNaN`


Merge Api
---

- `is.iod` is int or decimal
- `is.oof` is object or function
- `is.nos` is number or string


Advance
---

- `is._class`, short for `Object.prototype.toString.call(value)`
- `is._type`, short for `typeof value`

License
---

[![License][license-image]][license-url]

[travis-image]: https://img.shields.io/travis/chunpu/min-is.svg?style=flat-square
[travis-url]: https://travis-ci.org/chunpu/min-is
[license-image]: http://img.shields.io/npm/l/min-is.svg?style=flat-square
[license-url]: #
