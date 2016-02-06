import {List, Map, Stack, fromJS} from 'immutable'
import Symbol from './symbol'
import prn from './prn'
import {
  show, run, bind, seq, skip, lit, lift, token, eof, or, and, anyOf, unless,
  anyBut, many, many1, not, join, desc, succ, fail,
  define, parsers, createState
} from './parser'

// init()

const testFactory = input => parser => {
  console.log(show(parser))
  console.log(prn(run(parser, createState(input))))
}

const input1 = "foo"
const test1 = testFactory(input1)

test1(token)
test1(seq([token, token]))
test1(seq([token, token, token]))
test1(seq([token, token, token, token]))
test1(lit('foo'))
test1(lit('foops'))

const input2 = `

foo ; this is a comment bro
bar ; this is another comment bro
(* x x)

`
const test2 = testFactory(input2)

const whitespace = anyOf([" ", "\t", "\f", "\n", "\r\n"])
const whitespaces = many1(whitespace)

const commentStart = lit(";")
const commentEnd = anyOf(["\n", "\r\n"])
const commentCont1 = anyBut(["\n", "\r\n"])
const commentCont = many(commentCont1)
const comment = and(commentStart, commentCont, commentEnd)

const whitestuff1 = or(whitespaces, comment)
const whitestuff = many(whitestuff1)

const escapeStart = lit("\\")
const escapeCont = anyOf(["n", "r", "f", "b", "\""])
const escapeMap = {
  "n"  : "\n",
  "r"  : "\r",
  "f"  : "\f",
  "b"  : "\b",
  "\"" : "\""
}

const escapeChar =
  bind(escapeStart) (_ =>
  bind(escapeCont)  (c =>
    succ(escapeMap[c])))

const stringDelimiter = lit("\"")
const stringBody = or(escapeChar, unless(stringDelimiter)(token))
const string =
  bind(stringDelimiter)  (_ =>
  bind(many(stringBody)) (xs =>
  bind(stringDelimiter)  (_ => succ(xs.join("")))))

const listStart = lit("(")
const listEnd = lit(")")
const list = desc('list',
  bind(listStart) (_  =>
  bind('exprs')   (xs =>
  bind(listEnd)   (_  => succ(List(xs))))))

const delimiter = or(listStart, listEnd, stringDelimiter)
const atomTerminal = or(whitestuff1, delimiter, eof)

const atom1 = unless(atomTerminal)(token)
const atom = bind(many1(atom1))(xs => succ(new Symbol(xs.join(""))))

const expr = skip(whitestuff)(or(list, string, atom))
const exprs = many(expr)

define({exprs})

// console.log(parsers)

const input4 = `(foo "bar" baz)`
const test4 = testFactory(input4)
test4(list)
/*

const input3 = `;wtfmansrsly

    ok
    yesss
    (sweet dude sweeeeet)
`
const test3 = testFactory(input3)
test3(commentStart)
test3(seq([commentStart, unless(commentEnd)(token)]))
test3(seq([commentStart, many(unless(commentEnd)(token))]))
test3(comment)
test3(seq([comment, whitespaces]))
test3(whitestuff)
test3(expr)
test3(and(expr, expr))
test3(exprs)

*/

//test2(whitespace)
//test2(whitespaces)
//test2(whitestuff)
// test2(expr)
