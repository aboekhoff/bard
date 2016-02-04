import {List, Map, Stack, fromJS} from 'immutable'
import Symbol from './symbol'
import {
  show, run, bind, seq, skip, lit, lift, token, or, anyOf, unless,
  anyBut, many, many1, not, join,
  define, parsers, createState
} from './parser'

// init()

const testFactory = input => parser => {
  console.log(show(parser))
  console.log(run(parser, createState(input)))
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
const commentCont1 = unless(commentEnd)(token)
const commentCont = many(commentCont1)
const comment = seq([commentStart, commentCont, commentEnd])

const whitestuff1 = or([whitespaces, comment])
const whitestuff = many(whitestuff1)

const listOpen = lit("(")
const listClose = lit(")")
const list =
  bind(listOpen)      (_  =>
  bind(many('exprs')) (xs =>
  bind(listClose)     (_  => lift(Stack))))

const atom1 = unless(whitestuff1)(token)
const atom = bind(many1(atom1))(join)

const expr = skip(whitestuff)(or([list, atom]))
const exprs = many(expr)

define({exprs})

console.log(parsers)

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
test3(exprs)
//test2(whitespace)
//test2(whitespaces)
//test2(whitestuff)
// test2(expr)
