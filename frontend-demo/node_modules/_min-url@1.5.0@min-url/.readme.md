Usage
---

```js
var Url = require('min-url')

var url = Url.parse('http://user:pass@host.com:8080/p/a/t/h?query=string#hash', true)

console.log(url)

/* =>
{ hash: '#hash',
  protocol: 'http:',
  query: { query: 'string' },
  pathname: '/p/a/t/h',
  auth: 'user:pass',
  hostname: 'host.com',
  port: 8080 }
*/
```

Api
---

- `Url.parse(string, [shouldParseQuery])`

- `Url.format(object)`

- `Url.appendQuery(url, query)` append query string/object to url


Progress
---

`Url.parse(string, shouldParseQuery)`


```
splitTwo(str, sp)

1. var arr = split(str, sp)
2. first = arr[0]
3. second = slice(arr, 1).join(sp)
4. return first, second
```

```
splicePattern(str, regexp)

var matched
var rest = replace(str, regexp, function(_matched) {
	matched = _matched
	return ''
})
return matched, rest
```


1. if url is not string, return url
1. get hash
	1. splitTwo by `#` get rest and hash
1. get query
	1. splitTwo by `?` get rest and query
	1. if shouldParseQuery
		1. query = parse query
1. get schema
	1. splicePattern rest by `/^[a-zA-Z][a-zA-Z0-9+-.]*:/` get protocol and rest
	1. protocol = protocol to lowercase
1. if rest startsWith `//`
	1. rest = slice(rest, 2)
1. get pathname
	1. split rest by `/`, get rest and pathname
	1. pathname = '/' + unescape(pathname || '')
1. get auth and host
	1. split rest by `@`, get auth and host
	1. if not host
		1. host = auth
		1. auth = null
1. get hostname and port
	1. split host, get hostname and port
	1. if port
		1. port = tonumber(port)
