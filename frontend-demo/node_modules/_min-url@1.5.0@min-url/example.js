var url = require('url')
var minUrl = require('./')

var raw = 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'

console.log('official url.parse', url.parse(raw, true), '\n\n')

console.log('min url.parse', minUrl.parse(raw, true), '\n\n')

console.log('official url.format', url.format(url.parse(raw, true)), '\n\n')

console.log('min url.format', minUrl.format(minUrl.parse(raw, true)))
