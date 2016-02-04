export const extend = (obj, props) => {
  for (var v in props) {
    obj[v] = props[v]
  }
  return obj
}
export const slice = (indexed) => Array.prototype.slice.call(indexed)
export const concat = (...arrays) => Array.prototype.concat.apply([], arrays)
