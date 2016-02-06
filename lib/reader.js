'use strict';

var _immutable = require('immutable');

var _symbol = require('./symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _parser = require('./parser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// init()

var testFactory = function testFactory(input) {
  return function (parser) {
    console.log((0, _parser.show)(parser));
    console.log((0, _parser.run)(parser, (0, _parser.createState)(input)));
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
var commentCont1 = (0, _parser.unless)(commentEnd)(_parser.token);
var commentCont = (0, _parser.many)(commentCont1);
var comment = (0, _parser.seq)([commentStart, commentCont, commentEnd]);

var whitestuff1 = (0, _parser.or)([whitespaces, comment]);
var whitestuff = (0, _parser.many)(whitestuff1);

var atom1 = (0, _parser.unless)(whitestuff1)(_parser.token);

var atom = (0, _parser.bind)((0, _parser.many1)(atom1))(join);
var expr = (0, _parser.skip)(whitestuff)(atom);
var exprs = (0, _parser.many)(expr);

var input3 = ';wtfmansrsly\n\n    ok\n    yesss\n    (sweet dude sweeeeet)\n';
var test3 = testFactory(input3);
test3(commentStart);
test3((0, _parser.seq)([commentStart, (0, _parser.unless)(commentEnd)(_parser.token)]));
test3((0, _parser.seq)([commentStart, (0, _parser.many)((0, _parser.unless)(commentEnd)(_parser.token))]));
test3(comment);
test3((0, _parser.seq)([comment, whitespaces]));
test3(whitestuff);
test3(expr);
test3(exprs);
//test2(whitespace)
//test2(whitespaces)
//test2(whitestuff)
//test2(expr)