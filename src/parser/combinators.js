import {extend, slice, concat} from '../utils'
import {run, succ, fail, zero, bind, show, lift} from './framework'

export const desc = (desc, fn) => {
  fn.descriptor = desc
  return fn
}

export const token = (state) => {
  const input = state.get('input')
  const offset = state.get('offset')

  if (offset < input.length) {
    const val = input[offset]
    const line = state.get('line')
    const column = state.get('column')

    const newState = val == '\n' ?
      state.merge({offset: offset+1, line: line+1, column: 0}) :
      state.merge({offset: offset+1, column: column+1})

    return succ(val)(newState)
  }

  else {
    return fail('unexpected eof')(state)
  }
}

export const seq = (ps) => desc(
  `seq(${ps.map(show).join(" ")})`,
  s0 => {
    let s1 = s0
    const vals = []
    for (let i=0; i<ps.length; i++) {
      const r = run(ps[i], s1)
      const [ok, val, s2] = r
      if (!ok) { return r }
      vals.push(val)
      s1 = s2
    }
    return succ(vals)(s1)
  }
)

export const eof = (st) => {
  const input = st.get('input')
  const offset = st.get('offset')

  return offset < input.length ?
    fail('eof')(st) :
    succ(true)(st)
}

export const and = (...ps) => desc(`and(${ps.map(show).join(" ")})`, seq(ps))

export const or = (...ps) => desc(
  `or(${ps.map(show).join(" ")})`,
  s0 => {
    const errs = []
    for (let i=0; i<ps.length; i++) {
      const r = run(ps[i], s0)
      const [ok, err, s1] = r
      if (ok) { return r }
      errs.push(err)
    }
    return fail(errs)(s0)
  }
)

export const ch = c => desc(`ch(${c})`,
  bind(token)
  (t => t === c ? succ(t) : fail(`${t} != ${c}`)))

export const lit = (str) => desc(`lit(${JSON.stringify(str)})`,
  bind(seq(slice(str).map(ch)))
  (chars => succ(chars.join(""))))

export const unless = notP => p => desc(`unless(${show(notP)} ${show(p)})`, st => {
  const res = run(notP, st)
  const [ok, val, _st] = res
  return ok ? fail(`expected not ${p}`)(st) : p(st)
})

export const anyOf = strs => or(...strs.map(lit))

export const anyBut = strs => desc(
  `anyBut(${strs.map(JSON.stringify).join(" ")})`,
  unless(anyOf(strs))(token))

export const many = p => desc(`many(${show(p)})`, st => {
  const vals = []
  while(true) {
    const res = run(p, st)
    const [ok, val, _st] = res
    if (ok) {
      vals.push(val)
      st = _st
    }
    else {
      return succ(vals)(_st)
    }
  }
})

export const many1 = p => desc(`many1(${show(p)})`, st => {
  const res = many(p)(st)
  const [ok, vals, _st] = res
  return vals.length > 0 ? res : fail(`expected at least one ${show(p)}`)(st)
})

export const maybe = p => desc(`maybe(${show(p)})`, st => {
  const res = p(st)
  const [ok, val, _st] = res
  return ok ? [true, [val], _st] : [true, null, st]
})

// utils

export const join = lift(xs => xs.join(""))
