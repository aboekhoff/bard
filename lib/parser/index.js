'use strict';

var _framework = require('./framework');

var framework = _interopRequireWildcard(_framework);

var _combinators = require('./combinators');

var combinators = _interopRequireWildcard(_combinators);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

framework.define(combinators);

for (var v in framework) {
  exports[v] = framework[v];
}

for (var v in combinators) {
  exports[v] = combinators[v];
}

/*
bind(
lit('(')   ,(_)  => bind(
many(expr) ,(xs) => bind(
lit(')')   ,(_)  => bind(
  result(List(xs))
))))
*/