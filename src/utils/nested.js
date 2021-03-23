export default class {
  handler (nested = [], destroyKey = 'destroyed') {
    if (!Array.isArray(nested)) {
      throw new Error('Array needed.')
    }

    let index = 0
    let counter = 1

    function hasNext () {
      return index < nested.length
    }

    function next () {
      return nested[index++]
    }

    while (hasNext()) {
      const current = next()

      if (current.id && !current[destroyKey]) {
        counter = current.id
      }

      if (current[destroyKey]) {
        index--
        nested.splice(index, 1)
        continue
      }

      current.id = counter

      for (const key in current) {
        if (Array.isArray(current[key]) && current[key].length) {
          this.handler(nested[index - 1][key])
        }
      }

      counter++
    }

    return nested
  }
}
