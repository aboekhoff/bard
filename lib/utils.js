"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var extend = exports.extend = function extend(obj, props) {
  for (var v in props) {
    obj[v] = props[v];
  }
  return obj;
};
var slice = exports.slice = function slice(indexed) {
  return Array.prototype.slice.call(indexed);
};
var concat = exports.concat = function concat() {
  for (var _len = arguments.length, arrays = Array(_len), _key = 0; _key < _len; _key++) {
    arrays[_key] = arguments[_key];
  }

  return Array.prototype.concat.apply([], arrays);
};