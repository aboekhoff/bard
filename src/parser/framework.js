import {inspect} from 'util'
import {fromJS} from 'immutable'

export const parsers = {}

export const show = obj => (typeof obj == 'function') ? obj.descriptor || obj.name : '' + obj

const toParser = (obj) => {
  let parser = obj

  if (typeof obj == 'string') {
    parser = parsers[obj]
    if (typeof parser != 'function') {
      console.log(JSON.stringify(parsers))
      throw Error(`no parser found named ${obj}`)
    }
  }

  if (typeof parser != 'function') {
    console.log(JSON.stringify(parser))
    throw Error(`could not coerce ${inspect(obj)} to parser`)
  }

  return parser

}

export const run = (parser, state) => toParser(parser)(state)

export const define = (...defs) => {
  const cacheFunction = (parser, name=parser.name) => {
    parsers[name] = parser
  }

  const cacheObject = (obj) => {
    for (var v in obj) {
      cacheFunction(obj[v], v)
    }
  }

  for (var i=0; i<defs.length; i++) {
    const def = defs[i]
    switch(typeof def) {
      case 'object': cacheObject(def); break;
      case 'function': cacheFunction(def); break;
      default: throw Error(`cannot cache ${def}`)
    }
  }
}

export const createState = (input, metadata={}) => {
  return fromJS({
    input: input,
    metadata: metadata,
    offset: 0,
    line: 0,
    column: 0,
    errors: [],
  })
}

export const zero = (st)      => [true, null, st]
export const succ = val => st => [true, val, st]
export const fail = val => st => [false, val, st]

export const bind = p => f => state => {
  const result = run(p, state)
  const [ok, val, _state] = result
  return ok ? run(f(val), _state) : result
}

export const skip = p1 => p2 => state => {
  const result = run(p1, state)
  const [ok, val, _state] = result
  return ok ? run(p2, _state) : result
}

export const lift = f => x => succ(f(x))

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
