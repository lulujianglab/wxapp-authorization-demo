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
