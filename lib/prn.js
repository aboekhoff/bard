'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var immutable = require('immutable');
var Map = immutable.Map;
var List = immutable.List;
var Stack = immutable.Stack;

var _Symbol = require('./symbol');
var utils = require('./utils');
var extend = utils.extend;

function _prn(x) {
  if (x == null) {
    return "#nil";
  }

  if (typeof x == 'boolean') {
    return x ? "#t" : "f";
  }

  if (typeof x.prn == 'function') {
    return x.prn();
  } else {
    var name = Object.constructor && Object.constructor.name ? Object.constructor.name : "Object";
    return "#<" + name + ">";
  }
}

exports.default = _prn;
extend(_Symbol.prototype, {
  toString: function toString() {
    return this.name;
  },
  prn: function prn() {
    return this.name;
  }
});

extend(Number.prototype, {
  prn: function prn() {
    return '' + this.valueOf();
  }
});

extend(String.prototype, {
  prn: function prn() {
    return JSON.stringify(this);
  }
});

extend(Array.prototype, {
  prn: function prn() {
    return "#[" + this.map(_prn).join(" ") + "]";
  }
});

extend(Stack.prototype, {
  prn: function prn() {
    return "(" + this.map(_prn).toJS().join(" ") + ")";
  }
});

extend(List.prototype, {
  prn: function prn() {
    return "[" + this.map(_prn).toJS().join(" ") + "]";
  }
});

extend(Map.prototype, {
  prn: function prn() {
    var res = [];
    this.entrySeq().forEach(function (pair) {
      res.push(_prn(pair[0]) + " " + _prn(pair[1]));
    });
    return "{" + res.join(", ") + "}";
  }
});