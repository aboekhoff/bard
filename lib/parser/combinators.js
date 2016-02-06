'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.join = exports.maybe = exports.many1 = exports.many = exports.anyBut = exports.anyOf = exports.unless = exports.lit = exports.ch = exports.or = exports.and = exports.eof = exports.seq = exports.token = exports.desc = undefined;

var _utils = require('../utils');

var _framework = require('./framework');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var desc = exports.desc = function desc(_desc, fn) {
  fn.descriptor = _desc;
  return fn;
};

var token = exports.token = function token(state) {
  var input = state.get('input');
  var offset = state.get('offset');

  if (offset < input.length) {
    var val = input[offset];
    var line = state.get('line');
    var column = state.get('column');

    var newState = val == '\n' ? state.merge({ offset: offset + 1, line: line + 1, column: 0 }) : state.merge({ offset: offset + 1, column: column + 1 });

    return (0, _framework.succ)(val)(newState);
  } else {
    return (0, _framework.fail)('unexpected eof')(state);
  }
};

var seq = exports.seq = function seq(ps) {
  return desc('seq(' + ps.map(_framework.show).join(" ") + ')', function (s0) {
    var s1 = s0;
    var vals = [];
    for (var i = 0; i < ps.length; i++) {
      var r = (0, _framework.run)(ps[i], s1);

      var _r = _slicedToArray(r, 3);

      var ok = _r[0];
      var val = _r[1];
      var s2 = _r[2];

      if (!ok) {
        return r;
      }
      vals.push(val);
      s1 = s2;
    }
    return (0, _framework.succ)(vals)(s1);
  });
};

var eof = exports.eof = function eof(st) {
  var input = st.get('input');
  var offset = st.get('offset');

  return offset < input.length ? (0, _framework.fail)('eof')(st) : (0, _framework.succ)(true)(st);
};

var and = exports.and = function and() {
  for (var _len = arguments.length, ps = Array(_len), _key = 0; _key < _len; _key++) {
    ps[_key] = arguments[_key];
  }

  return desc('and(' + ps.map(_framework.show).join(" ") + ')', seq(ps));
};

var or = exports.or = function or() {
  for (var _len2 = arguments.length, ps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    ps[_key2] = arguments[_key2];
  }

  return desc('or(' + ps.map(_framework.show).join(" ") + ')', function (s0) {
    var errs = [];
    for (var i = 0; i < ps.length; i++) {
      var r = (0, _framework.run)(ps[i], s0);

      var _r2 = _slicedToArray(r, 3);

      var ok = _r2[0];
      var err = _r2[1];
      var s1 = _r2[2];

      if (ok) {
        return r;
      }
      errs.push(err);
    }
    return (0, _framework.fail)(errs)(s0);
  });
};

var ch = exports.ch = function ch(c) {
  return desc('ch(' + c + ')', (0, _framework.bind)(token)(function (t) {
    return t === c ? (0, _framework.succ)(t) : (0, _framework.fail)(t + ' != ' + c);
  }));
};

var lit = exports.lit = function lit(str) {
  return desc('lit(' + JSON.stringify(str) + ')', (0, _framework.bind)(seq((0, _utils.slice)(str).map(ch)))(function (chars) {
    return (0, _framework.succ)(chars.join(""));
  }));
};

var unless = exports.unless = function unless(notP) {
  return function (p) {
    return desc('unless(' + (0, _framework.show)(notP) + ' ' + (0, _framework.show)(p) + ')', function (st) {
      var res = (0, _framework.run)(notP, st);

      var _res = _slicedToArray(res, 3);

      var ok = _res[0];
      var val = _res[1];
      var _st = _res[2];

      return ok ? (0, _framework.fail)('expected not ' + p)(st) : p(st);
    });
  };
};

var anyOf = exports.anyOf = function anyOf(strs) {
  return or.apply(undefined, _toConsumableArray(strs.map(lit)));
};

var anyBut = exports.anyBut = function anyBut(strs) {
  return desc('anyBut(' + strs.map(JSON.stringify).join(" ") + ')', unless(anyOf(strs))(token));
};

var many = exports.many = function many(p) {
  return desc('many(' + (0, _framework.show)(p) + ')', function (st) {
    var vals = [];
    while (true) {
      var res = (0, _framework.run)(p, st);

      var _res2 = _slicedToArray(res, 3);

      var ok = _res2[0];
      var val = _res2[1];
      var _st = _res2[2];

      if (ok) {
        vals.push(val);
        st = _st;
      } else {
        return (0, _framework.succ)(vals)(_st);
      }
    }
  });
};

var many1 = exports.many1 = function many1(p) {
  return desc('many1(' + (0, _framework.show)(p) + ')', function (st) {
    var res = many(p)(st);

    var _res3 = _slicedToArray(res, 3);

    var ok = _res3[0];
    var vals = _res3[1];
    var _st = _res3[2];

    return vals.length > 0 ? res : (0, _framework.fail)('expected at least one ' + (0, _framework.show)(p))(st);
  });
};

var maybe = exports.maybe = function maybe(p) {
  return desc('maybe(' + (0, _framework.show)(p) + ')', function (st) {
    var res = p(st);

    var _res4 = _slicedToArray(res, 3);

    var ok = _res4[0];
    var val = _res4[1];
    var _st = _res4[2];

    return ok ? [true, [val], _st] : [true, null, st];
  });
};

// utils

var join = exports.join = (0, _framework.lift)(function (xs) {
  return xs.join("");
});