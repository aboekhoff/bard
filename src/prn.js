var immutable = require('immutable')
var Map = immutable.Map
var List = immutable.List
var Stack = immutable.Stack

var Symbol = require('./symbol')
var utils = require('./utils')
var extend = utils.extend

module.exports = function prn(x) {
  if (x == null) {
    return "#nil"
  }

  if (typeof x == 'boolean') {
    return x ? "#t" : "f"
  }

  if (typeof x.prn == 'function') {
    return x.prn()
  }

  else {
    var name = (Object.constructor && Object.constructor.name) ? Object.constructor.name : "Object"
    return "#<" + name +">"
  }
}

extend(Symbol.prototype, {
  toString: function() { return this.name },
  prn: function() { return this.name }
})

extend(Number.prototype, {
  prn: function() {
    return '' + this.valueOf()
  }
})

extend(String.prototype, {
  prn: function() {
    return JSON.stringify(this)
  }
})

extend(Array.prototype, {
  prn: function() {
    return "#[" + this.map(prn).join(" ") + "]"
  }
})

extend(Stack.prototype, {
  prn: function() {
    return "(" + this.map(prn).toJS().join(" ") + ")"
  }
})

extend(List.prototype, {
  prn: function() {
    return "[" + this.map(prn).toJS().join(" ") + "]"
  }
})

extend(Map.prototype), {
  prn: function() {
    return "{...}"
  }
}
