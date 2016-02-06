'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lift = exports.skip = exports.bind = exports.fail = exports.succ = exports.zero = exports.createState = exports.define = exports.run = exports.show = exports.parsers = undefined;

var _util = require('util');

var _immutable = require('immutable');

var parsers = exports.parsers = {};

var show = exports.show = function show(obj) {
  return typeof obj == 'function' ? obj.descriptor || obj.name : '' + obj;
};

var toParser = function toParser(obj) {
  var parser = obj;

  if (typeof obj == 'string') {
    parser = parsers[obj];
    if (typeof parser != 'function') {
      console.log(JSON.stringify(parsers));
      throw Error('no parser found named ' + obj);
    }
  }

  if (typeof parser != 'function') {
    console.log(JSON.stringify(parser));
    throw Error('could not coerce ' + (0, _util.inspect)(obj) + ' to parser');
  }

  return parser;
};

var run = exports.run = function run(parser, state) {
  return toParser(parser)(state);
};

var define = exports.define = function define() {
  for (var _len = arguments.length, defs = Array(_len), _key = 0; _key < _len; _key++) {
    defs[_key] = arguments[_key];
  }

  var cacheFunction = function cacheFunction(parser) {
    var name = arguments.length <= 1 || arguments[1] === undefined ? parser.name : arguments[1];

    parsers[name] = parser;
  };

  var cacheObject = function cacheObject(obj) {
    for (var v in obj) {
      cacheFunction(obj[v], v);
    }
  };

  for (var i = 0; i < defs.length; i++) {
    var def = defs[i];
    switch (typeof def === 'undefined' ? 'undefined' : _typeof(def)) {
      case 'object':
        cacheObject(def);break;
      case 'function':
        cacheFunction(def);break;
      default:
        throw Error('cannot cache ' + def);
    }
  }
};

var createState = exports.createState = function createState(input) {
  var metadata = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _immutable.fromJS)({
    input: input,
    metadata: metadata,
    offset: 0,
    line: 0,
    column: 0,
    errors: []
  });
};

var zero = exports.zero = function zero(st) {
  return [true, null, st];
};
var succ = exports.succ = function succ(val) {
  return function (st) {
    return [true, val, st];
  };
};
var fail = exports.fail = function fail(val) {
  return function (st) {
    return [false, val, st];
  };
};

var bind = exports.bind = function bind(p) {
  return function (f) {
    return function (state) {
      var result = run(p, state);

      var _result = _slicedToArray(result, 3);

      var ok = _result[0];
      var val = _result[1];
      var _state = _result[2];

      return ok ? run(f(val), _state) : result;
    };
  };
};

var skip = exports.skip = function skip(p1) {
  return function (p2) {
    return function (state) {
      var result = run(p1, state);

      var _result2 = _slicedToArray(result, 3);

      var ok = _result2[0];
      var val = _result2[1];
      var _state = _result2[2];

      return ok ? run(p2, _state) : result;
    };
  };
};

var lift = exports.lift = function lift(f) {
  return function (x) {
    return succ(f(x));
  };
};

/*

skip(whitespace)(expr)

bind(
parser1)(a => bind(
parser2)(b => bind(
parser3)(c => bind(

))
))
))
(parser1)
(a => bind
(parser2)
((b) => bind
(parser3)
((c => succ[a, b, c]))))


bind(
parser1, (a) => bind(
parser2, (b) => bind(
parser3, (c) => bind(
parser4, (d) => succ(...))))

*/