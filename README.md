# route-matcher

Lightweight utility for converting route patterns into regular expressions.

Requires support for [ES2018 RegExp named capture groups][regex-named-capture-groups].

```js
import { compile } from '@intrnl/route-matcher';

let pattern = compile('/foo/:bar');
// -> /^\/foo\/(?<bar>[^\/]+?)\/?$/i
```


[regex-named-capture-groups]: https://caniuse.com/mdn-javascript_builtins_regexp_named_capture_groups


## Supported operators

For the sake of simplicity, only the commonly used pathing operators are supported by route-matcher.

### Named parameters

Named parameters are defined by prefixing a colon to the parameter name.

```js
let pattern = compile('/books/:genre');
// -> /^\/books\/(?<genre>[^\/]+?)\/?$/i

let match = pattern.exec('/books/fiction');
// match -> ['/books/fiction', 'fiction']
// match.groups -> { genre: 'fiction' }
```

Parameter names must only use `a-zA-Z_`, and JavaScript does not allow for multiple named capture groups of the same name.

### Optional parameters

Parameters can be suffixed with `?` to make them optional.

```js
let pattern = compile('/movies/:genre/:title?');
// -> /^\/movies\/(?<genre>[^\/]+?)(?:\/(?<title>[^\/]+?))?\/?$/i

pattern.exec('/movies/action')?.groups;
// -> { genre: 'action', title: undefined }

pattern.exec('/movies/action/big-hero-6')?.groups;
// -> { genre: 'action', title: 'big-hero-6' }
```

### Custom parameter matcher

Parameters have a default matcher of `[^/]+?`, which you can change to only
allow for matching specific patterns.

```js
let pattern = compile('/icon-:size(\\d+).png');
// -> /^\/icon-(?<size>\d+)\.png\/?$/i

pattern.exec('/icon-128.png')?.groups;
// -> { size: '128' }

pattern.exec('/icon-abc.png')?.groups;
// -> undefined
```

Parameter names must only use `a-zA-Z_`, and JavaScript does not allow for multiple named capture groups of the same name.

### Custom prefix and suffix

Optional parameters matches up to the last `/`, for example:

```js
let pattern = compile('/image-:size(\\d+)?');
// -> /^(?:\/image-(?<size>[^\/]+?))?\/?$/i

pattern.test('/');          // -> true
pattern.test('/image');     // -> false
pattern.test('/image-');    // -> false
pattern.test('/image-128'); // -> true
```

Parameters can include a custom prefix and suffix to be matched:

```js
let pattern = compile('/image{-:size(\\d+)}?');
// -> /^\/image(?:-(?<size>\d+))?\/?$/i

pattern.test('/');          // -> false
pattern.test('/image');     // -> true
pattern.test('/image-');    // -> false
pattern.test('/image-128'); // -> true
```


## Unsupported path operators

### Custom matching modifiers

Any other modifiers, like `*` or `:splat*` and `:foo+` are not supported, you can still make do with custom matchers instead.

```js
let pattern = compile('/assets/:path(.+)');

pattern.exec('/assets/')?.groups;
// -> undefined

pattern.exec('/assets/images')?.groups;
// -> { path: 'images' }

pattern exec('/assets/images/icon')?.groups;
// -> { path: 'images/icon' }
```

### Unnamed parameters

Unnamed parameters are not supported.


## License

Licensed under MIT
