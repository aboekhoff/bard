'use strict';

var _immutable = require('immutable');

var _symbol = require('./symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _prn = require('./prn');

var _prn2 = _interopRequireDefault(_prn);

var _parser = require('./parser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// init()

var testFactory = function testFactory(input) {
  return function (parser) {
    console.log((0, _parser.show)(parser));
    console.log((0, _prn2.default)((0, _parser.run)(parser, (0, _parser.createState)(input))));
  };
};

var input1 = "foo";
var test1 = testFactory(input1);

test1(_parser.token);
test1((0, _parser.seq)([_parser.token, _parser.token]));
test1((0, _parser.seq)([_parser.token, _parser.token, _parser.token]));
test1((0, _parser.seq)([_parser.token, _parser.token, _parser.token, _parser.token]));
test1((0, _parser.lit)('foo'));
test1((0, _parser.lit)('foops'));

var input2 = '\n\nfoo ; this is a comment bro\nbar ; this is another comment bro\n(* x x)\n\n';
var test2 = testFactory(input2);

var whitespace = (0, _parser.anyOf)([" ", "\t", "\f", "\n", "\r\n"]);
var whitespaces = (0, _parser.many1)(whitespace);

var commentStart = (0, _parser.lit)(";");
var commentEnd = (0, _parser.anyOf)(["\n", "\r\n"]);
var commentCont1 = (0, _parser.anyBut)(["\n", "\r\n"]);
var commentCont = (0, _parser.many)(commentCont1);
var comment = (0, _parser.and)(commentStart, commentCont, commentEnd);

var whitestuff1 = (0, _parser.or)(whitespaces, comment);
var whitestuff = (0, _parser.many)(whitestuff1);

var escapeStart = (0, _parser.lit)("\\");
var escapeCont = (0, _parser.anyOf)(["n", "r", "f", "b", "\""]);
var escapeMap = {
  "n": "\n",
  "r": "\r",
  "f": "\f",
  "b": "\b",
  "\"": "\""
};

var escapeChar = (0, _parser.bind)(escapeStart)(function (_) {
  return (0, _parser.bind)(escapeCont)(function (c) {
    return (0, _parser.succ)(escapeMap[c]);
  });
});

var stringDelimiter = (0, _parser.lit)("\"");
var stringBody = (0, _parser.or)(escapeChar, (0, _parser.unless)(stringDelimiter)(_parser.token));
var string = (0, _parser.bind)(stringDelimiter)(function (_) {
  return (0, _parser.bind)((0, _parser.many)(stringBody))(function (xs) {
    return (0, _parser.bind)(stringDelimiter)(function (_) {
      return (0, _parser.succ)(xs.join(""));
    });
  });
});

var listStart = (0, _parser.lit)("(");
var listEnd = (0, _parser.lit)(")");
var list = (0, _parser.desc)('list', (0, _parser.bind)(listStart)(function (_) {
  return (0, _parser.bind)('exprs')(function (xs) {
    return (0, _parser.bind)(listEnd)(function (_) {
      return (0, _parser.succ)((0, _immutable.List)(xs));
    });
  });
}));

var delimiter = (0, _parser.or)(listStart, listEnd, stringDelimiter);
var atomTerminal = (0, _parser.or)(whitestuff1, delimiter, _parser.eof);

var atom1 = (0, _parser.unless)(atomTerminal)(_parser.token);
var atom = (0, _parser.bind)((0, _parser.many1)(atom1))(function (xs) {
  return (0, _parser.succ)(new _symbol2.default(xs.join("")));
});

var expr = (0, _parser.skip)(whitestuff)((0, _parser.or)(list, string, atom));
var exprs = (0, _parser.many)(expr);

(0, _parser.define)({ exprs: exprs });

// console.log(parsers)

var input4 = '(foo "bar" baz)';
var test4 = testFactory(input4);
test4(list);
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