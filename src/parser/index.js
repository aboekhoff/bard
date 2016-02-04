import * as framework from './framework'
import * as combinators from './combinators'

framework.define(combinators)

for (var v in framework) {
  exports[v] = framework[v]
}

for (var v in combinators) {
  exports[v] = combinators[v]
}

/*
bind(
lit('(')   ,(_)  => bind(
many(expr) ,(xs) => bind(
lit(')')   ,(_)  => bind(
  result(List(xs))
))))
*/
