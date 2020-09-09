# graph-cache-css

This is a ```PostCSS``` parser for [graph-cache](https://github.com/VKCOM/graph-cache) library.

## Installation

```yarn add @vkontakte/graph-cache-css```

## Usage
```javascript
const createGraphCache = require('graph-cache');
const cssParser = require('graph-cache-css');

function parser(lessOpts, sign, file, filename) {
  return cssParser(sign, file, filename);
}

const gcache = createGraphCache(parser, sign, {});
```

## Testing

This library is tested using ```Mocha``` and ```Chai```. You can run test suit with ```yarn test```.
You can run ```yarn run test-watch``` to rerun tests on file updates.


## Contributing

Issues and PR's are welcomed here. 
